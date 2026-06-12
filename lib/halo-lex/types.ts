// ─── Halo Lex — Shared Types ──────────────────────────────────

export type LexMessageRole = "user" | "assistant" | "system";

export interface LexMessage {
  role: LexMessageRole;
  content: string;
  timestamp?: string;
}

export interface LexSession {
  id: string;
  userId: string;
  plan: string;
  startedAt: Date;
  durationSeconds: number;
}

export interface SourceCitation {
  sourceName: string;
  reference: string;
  text: string;
  url?: string;
}

export interface SuggestedAction {
  label: string;
  action:
    | "generate_letter"
    | "start_diagnostic"
    | "escalate_lawyer"
    | "view_case"
    | "start_questionnaire";
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

export interface GuardrailResult {
  safe: boolean;
  reason?: string;
  action?: "escalate" | "redirect" | "emergency";
}

export interface LexConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

export interface IngestionResult {
  documentId: string;
  chunksCreated: number;
  chunksSkipped: number;
  errors: string[];
}

export interface ChunkInput {
  index: number;
  text: string;
  metadata: Record<string, unknown>;
}

export interface EnrichedChunk {
  index: number;
  text: string;
  summary: string;
  tags: string[];
  complexityLevel: number;
  useCases: string[];
  metadata: Record<string, unknown>;
}
