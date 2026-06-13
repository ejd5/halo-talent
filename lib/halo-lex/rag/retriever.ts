// ─── WTF Lex, Retriever ─────────────────────────────────────
// Recherche multi-stratégie : vectorielle + full-text + hybride.

import { createClient } from "@supabase/supabase-js";
import { generateEmbedding } from "../embeddings";
import type { SearchQuery, RagResult } from "./types";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
}

/**
 * Recherche vectorielle via pgvector cosine similarity.
 */
async function vectorSearch(
  query: SearchQuery
): Promise<RagResult[]> {
  const supabase = getAdminClient();
  const embedding = await generateEmbedding(query.text);

  const { data, error } = await supabase.rpc("match_legal_chunks", {
    p_embedding: embedding,
    p_match_threshold: query.threshold ?? 0.7,
    p_match_count: query.topK ?? 10,
    p_tags: query.tags ?? null,
  });

  if (error) {
    console.warn("Vector search failed:", error.message);
    return [];
  }

  const rows = data as Record<string, unknown>[];
  return rows.map((r) => ({
    chunkId: r.id as string,
    text: r.chunk_text as string,
    summary: r.chunk_summary as string,
    source: r.source_name as string,
    sourceUrl: r.source_url as string | undefined,
    score: r.similarity as number,
    tags: r.tags as string[],
    complexityLevel: r.complexity_level as number,
  }));
}

/**
 * Recherche full-text via PostgreSQL tsvector.
 */
async function fullTextSearch(
  query: SearchQuery
): Promise<RagResult[]> {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("legal_chunks")
    .select(`
      id, chunk_text, chunk_summary, complexity_level, tags,
      document:document_id!inner(document_title, source:source_id!inner(source_name, url))
    `)
    .textSearch("chunk_text", query.text, {
      type: "websearch",
      config: "french",
    })
    .limit(query.topK ?? 10);

  if (error) {
    console.warn("Full-text search failed:", error.message);
    return [];
  }

  return (data as unknown as Record<string, unknown>[]).map((r) => ({
    chunkId: r.id as string,
    text: r.chunk_text as string,
    summary: (r.chunk_summary as string) ?? "",
    source: ((r.document as Record<string, unknown>)?.source as Record<string, unknown>)?.source_name as string,
    sourceUrl: ((r.document as Record<string, unknown>)?.source as Record<string, unknown>)?.url as string | undefined,
    score: 0.5, // Full-text n'a pas de score normalisé
    tags: r.tags as string[],
    complexityLevel: r.complexity_level as number,
  }));
}

/**
 * Recherche hybride : fusionne vectorielle + full-text avec Reciprocal Rank Fusion.
 */
export async function retrieve(query: SearchQuery): Promise<RagResult[]> {
  const [vectorResults, ftResults] = await Promise.all([
    vectorSearch(query),
    fullTextSearch(query),
  ]);

  // Reciprocal Rank Fusion
  const scores = new Map<string, { result: RagResult; rankSum: number }>();
  const K = 60; // Constant de fusion

  const addWithRank = (results: RagResult[], source: "vector" | "fulltext") => {
    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      const key = r.chunkId;
      const existing = scores.get(key);
      const rank = i + 1;

      if (existing) {
        existing.rankSum += 1 / (K + rank);
        // Prendre le meilleur score
        if (r.score > existing.result.score) {
          existing.result = r;
        }
      } else {
        scores.set(key, {
          result: r,
          rankSum: 1 / (K + rank),
        });
      }
    }
  };

  addWithRank(vectorResults, "vector");
  addWithRank(ftResults, "fulltext");

  // Trier par rankSum descendant
  return [...scores.entries()]
    .sort((a, b) => b[1].rankSum - a[1].rankSum)
    .map(([, v]) => ({
      ...v.result,
      score: v.rankSum,
    }));
}
