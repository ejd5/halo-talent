// ─── WTF Lex, Ingester ───────────────────────────────────────
// Orchestrateur du pipeline : chunk → embed → enrich → insert.

import { createClient } from "@supabase/supabase-js";
import type { DocumentInput, IngestionStats } from "./types";
import { chunkDocument } from "./chunker";
import { enrichChunks } from "./enricher";
import { embedChunks } from "./embedder";
import { hashContent, hasChanged } from "./change-detector";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) {
    throw new Error("Missing Supabase env vars");
  }
  return createClient(url, key);
}

/**
 * Ingest un document dans le pipeline complet :
 * 1. Vérifie les doublons via version_hash
 * 2. Chunk le texte
 * 3. Enrichit chaque chunk (Claude)
 * 4. Embed chaque chunk (Voyage AI)
 * 5. Insère dans legal_documents + legal_chunks
 */
export async function ingestDocument(
  input: DocumentInput,
  onProgress?: (msg: string) => void
): Promise<IngestionStats> {
  const startTime = Date.now();
  const stats: IngestionStats = {
    chunksCreated: 0,
    chunksSkipped: 0,
    errors: [],
    durationMs: 0,
  };

  const log = (msg: string) => {
    if (onProgress) onProgress(msg);
  };

  try {
    const supabase = getAdminClient();
    const versionHash = hashContent(input.content);

    // 1. Vérifier si un document identique existe déjà
    const { data: existingDoc } = await supabase
      .from("legal_documents")
      .select("id")
      .eq("version_hash", versionHash)
      .maybeSingle();

    if (existingDoc) {
      log(`⏭️ Document identique déjà ingéré : ${input.title}`);
      stats.documentId = existingDoc.id;
      stats.durationMs = Date.now() - startTime;
      return stats;
    }

    // 2. Insérer le document
    log(`📄 Insertion du document : ${input.title}`);
    const { data: doc, error: docErr } = await supabase
      .from("legal_documents")
      .insert({
        source_id: input.sourceId,
        document_title: input.title,
        document_reference: input.reference ?? null,
        effective_date: new Date().toISOString().slice(0, 10),
        version_hash: versionHash,
        full_text: input.content,
        metadata: input.metadata ?? {},
      })
      .select("id")
      .single();

    if (docErr || !doc) {
      throw new Error(`Failed to insert document: ${docErr?.message}`);
    }

    stats.documentId = doc.id;

    // 3. Récupérer le source_type pour le chunking strategy
    const { data: source } = await supabase
      .from("legal_sources")
      .select("source_type")
      .eq("id", input.sourceId)
      .single();

    const sourceType = source?.source_type ?? "law";

    // 4. Chunking
    log(`✂️ Chunking du document...`);
    const chunks = chunkDocument(input.content, sourceType);

    if (chunks.length === 0) {
      log(`⚠️ Aucun chunk généré pour : ${input.title}`);
      stats.durationMs = Date.now() - startTime;
      return stats;
    }

    // 5. Enrichissement
    log(`🧠 Enrichissement de ${chunks.length} chunks...`);
    const enrichments = await enrichChunks(chunks, input.title);

    // 6. Embedding
    log(`🔢 Génération des embeddings pour ${chunks.length} chunks...`);
    const embedded = await embedChunks(chunks, enrichments);

    // 7. Insertion des chunks
    log(`💾 Insertion de ${embedded.length} chunks...`);
    const chunkRows = embedded.map((c) => ({
      document_id: doc.id,
      chunk_index: c.index,
      chunk_text: c.text,
      chunk_summary: c.enrichment.summary,
      embedding: c.embedding,
      tags: c.enrichment.tags,
      complexity_level: c.enrichment.complexityLevel,
      use_cases: c.enrichment.useCases,
      metadata: chunks[c.index]?.metadata ?? {},
    }));

    // Insert en batch
    const batchSize = 20;
    for (let i = 0; i < chunkRows.length; i += batchSize) {
      const batch = chunkRows.slice(i, i + batchSize);
      const { error: insertErr } = await supabase
        .from("legal_chunks")
        .insert(batch);

      if (insertErr) {
        stats.errors.push(
          `Batch ${i / batchSize}: ${insertErr.message}`
        );
      } else {
        stats.chunksCreated += batch.length;
      }
    }

    // 8. Mettre à jour le source avec le nouveau hash
    await supabase
      .from("legal_sources")
      .update({
        current_version_hash: versionHash,
        last_updated_at: new Date().toISOString(),
        last_checked_at: new Date().toISOString(),
      })
      .eq("id", input.sourceId);

    log(`✅ Document ingéré : ${input.title} (${stats.chunksCreated} chunks)`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    stats.errors.push(msg);
    console.error("Ingestion failed:", err);
  }

  stats.durationMs = Date.now() - startTime;
  return stats;
}

/**
 * Ingest tous les documents non encore traités depuis legal_knowledge.
 */
export async function ingestAllFromKnowledgeBase(
  onProgress?: (msg: string) => void
): Promise<IngestionStats[]> {
  const supabase = getAdminClient();
  const results: IngestionStats[] = [];

  // Récupérer les entrées knowledge qui n'ont pas encore de source correspondante
  const { data: sources } = await supabase
    .from("legal_sources")
    .select("id, source_name, source_type");

  const sourceMap = new Map<string, string>();
  for (const s of sources ?? []) {
    sourceMap.set(s.source_name, s.id);
  }

  // Récupérer les entrées de legal_knowledge actives
  const { data: entries } = await supabase
    .from("legal_knowledge")
    .select("*")
    .eq("is_active", true);

  if (!entries || entries.length === 0) {
    log("Aucune entrée dans legal_knowledge à ingérer.");
    return [];
  }

  for (const entry of entries) {
    const sourceName = String(
      entry.source_name ?? `legal_knowledge:${entry.title}`
    );
    let sourceId = sourceMap.get(sourceName);

    // Créer la source si elle n'existe pas
    if (!sourceId) {
      const { data: newSource } = await supabase
        .from("legal_sources")
        .insert({
          source_type: entry.category === "law" ? "law" : "cgu_platform",
          source_name: sourceName,
          jurisdiction: entry.jurisdiction ?? "international",
          language: "fr",
          update_frequency: "monthly",
        })
        .select("id")
        .single();

      if (newSource) {
        sourceMap.set(sourceName, newSource.id);
        sourceId = newSource.id;
      }
    }

    if (!sourceId) {
      results.push({
        errors: [`No source found for ${entry.title}`],
        chunksCreated: 0,
        chunksSkipped: 0,
        durationMs: 0,
      });
      continue;
    }

    const stats = await ingestDocument(
      {
        sourceId,
        title: entry.title,
        reference: entry.category,
        content: entry.content,
        metadata: {
          knowledgeId: entry.id,
          category: entry.category,
          platform: entry.platform,
          tags: entry.tags,
          severity: entry.severity_score,
        },
      },
      (msg) => log(msg)
    );

    results.push(stats);
  }

  return results;
}

function log(msg: string) {
  console.log(`  ${msg}`);
}
