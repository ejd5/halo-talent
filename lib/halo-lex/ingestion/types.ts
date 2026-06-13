// ─── WTF Lex, Ingestion Types ────────────────────────────────

export interface DocumentInput {
  sourceId: string;
  title: string;
  reference?: string;
  content: string;
  language?: string;
  metadata?: Record<string, unknown>;
}

export interface ChunkResult {
  index: number;
  text: string;
  metadata: Record<string, unknown>;
}

export interface EnrichmentResult {
  summary: string;
  tags: string[];
  complexityLevel: number;
  useCases: string[];
}

export interface IngestionStats {
  documentId?: string;
  chunksCreated: number;
  chunksSkipped: number;
  errors: string[];
  durationMs: number;
}

export interface SourceStatus {
  sourceId: string;
  sourceName: string;
  sourceType: string;
  documentCount: number;
  chunkCount: number;
  lastIngestedAt: string | null;
  status: "pending" | "done" | "error";
}
