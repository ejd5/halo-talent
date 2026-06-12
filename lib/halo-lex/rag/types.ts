// ─── Halo Lex — RAG Types ─────────────────────────────────────
// Types pour le système de Retrieval-Augmented Generation.

export interface SearchQuery {
  text: string;
  tags?: string[];
  topK?: number;
  threshold?: number;
}

export interface RagResult {
  chunkId: string;
  text: string;
  summary: string;
  source: string;
  sourceUrl?: string;
  score: number;
  tags: string[];
  complexityLevel: number;
}

export interface RerankedResult extends RagResult {
  rerankScore: number;
}

export interface ContextBlock {
  source: string;
  reference: string;
  content: string;
  url?: string;
}

export interface Citation {
  sourceName: string;
  reference: string;
  text: string;
  url?: string;
}
