// ─── Halo Lex — Embedder ───────────────────────────────────────
// Génère des embeddings pour une liste de chunks et les stocke.

import { generateEmbedding, generateEmbeddings } from "../embeddings";
import type { ChunkResult, EnrichmentResult } from "./types";

export interface EmbeddedChunk {
  index: number;
  text: string;
  embedding: number[];
  enrichment: EnrichmentResult;
}

/**
 * Génère les embeddings pour une liste de chunks enrichis.
 */
export async function embedChunks(
  chunks: ChunkResult[],
  enrichments: EnrichmentResult[]
): Promise<EmbeddedChunk[]> {
  if (chunks.length === 0) return [];

  const texts = chunks.map((c) => c.text);

  // Vérifier si on peut faire du batch
  const useBatch = chunks.length > 1 && !!process.env.VOYAGE_API_KEY;

  let embeddings: number[][];

  if (useBatch) {
    embeddings = await generateEmbeddings(texts);
  } else {
    embeddings = await Promise.all(texts.map((t) => generateEmbedding(t)));
  }

  return chunks.map((chunk, i) => ({
    index: chunk.index,
    text: chunk.text,
    embedding: embeddings[i] ?? [],
    enrichment: enrichments[i] ?? {
      summary: "",
      tags: [],
      complexityLevel: 3,
      useCases: [],
    },
  }));
}
