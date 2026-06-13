// ─── WTF Lex, Scheduler ──────────────────────────────────────
// Déclencheur manuel pour le pipeline d'ingestion.
// Utilisé par l'API admin et la CLI.

import { createClient } from "@supabase/supabase-js";
import { ingestAllFromKnowledgeBase } from "./ingester";
import type { IngestionStats, SourceStatus } from "./types";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
}

/**
 * Déclenche l'ingestion complète depuis la base de connaissances.
 */
export async function runIngestion(): Promise<{
  stats: IngestionStats[];
  durationMs: number;
}> {
  const startTime = Date.now();
  console.log("── Ingestion pipeline start ──────────────────────");

  const stats = await ingestAllFromKnowledgeBase((msg) => console.log(msg));

  const durationMs = Date.now() - startTime;
  const totalCreated = stats.reduce((s, r) => s + r.chunksCreated, 0);
  const totalErrors = stats.reduce((s, r) => s + r.errors.length, 0);

  console.log("── Ingestion complete ────────────────────────────");
  console.log(`  Duration: ${Math.round(durationMs / 1000)}s`);
  console.log(`  Documents processed: ${stats.length}`);
  console.log(`  Chunks created: ${totalCreated}`);
  console.log(`  Errors: ${totalErrors}`);

  return { stats, durationMs };
}

/**
 * Récupère le statut de toutes les sources.
 */
export async function getSourceStatuses(): Promise<SourceStatus[]> {
  const supabase = getAdminClient();

  const { data: sources } = await supabase.from("legal_sources").select("*");

  if (!sources) return [];

  const statuses: SourceStatus[] = [];

  for (const source of sources) {
    const { count: docCount } = await supabase
      .from("legal_documents")
      .select("*", { count: "exact", head: true })
      .eq("source_id", source.id);

    // Get document IDs for this source, then count chunks
    const { data: docIds } = await supabase
      .from("legal_documents")
      .select("id")
      .eq("source_id", source.id);

    let chunkCount = 0;
    if (docIds && docIds.length > 0) {
      const ids = docIds.map((d: { id: string }) => d.id);
      const { count } = await supabase
        .from("legal_chunks")
        .select("*", { count: "exact", head: true })
        .in("document_id", ids);
      chunkCount = count ?? 0;
    }

    statuses.push({
      sourceId: source.id,
      sourceName: source.source_name,
      sourceType: source.source_type,
      documentCount: docCount ?? 0,
      chunkCount: chunkCount ?? 0,
      lastIngestedAt: source.last_updated_at,
      status: chunkCount && chunkCount > 0 ? "done" : "pending",
    });
  }

  return statuses;
}
