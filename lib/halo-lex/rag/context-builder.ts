// ─── Halo Lex — Context Builder ───────────────────────────────
// Construit le contexte injecté dans le system prompt du LLM.

import type { RerankedResult, ContextBlock } from "./types";

interface ContextBuilderOptions {
  maxTokens: number;
  includeSummaries: boolean;
}

const DEFAULT_OPTIONS: ContextBuilderOptions = {
  maxTokens: 4000, // ~16k chars
  includeSummaries: true,
};

/**
 * Estime le nombre de tokens à partir du nombre de caractères.
 * Approximation : ~4 caractères par token pour le français.
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Formate un résultat RAG en bloc de contexte structuré.
 */
function formatContextBlock(r: RerankedResult): string {
  const header = `[Source: ${r.source}]`;
  const lines = [header];

  if (r.sourceUrl) {
    lines.push(`URL: ${r.sourceUrl}`);
  }

  if (r.summary) {
    lines.push(`Résumé: ${r.summary}`);
  }

  lines.push(`Tags: ${r.tags.join(", ")}`);
  lines.push("---");
  lines.push(r.text);
  lines.push(""); // blank line separator

  return lines.join("\n");
}

/**
 * Construit le contexte RAG à injecter dans le prompt système.
 * Tronque si nécessaire pour respecter le budget tokens.
 */
export function buildContext(
  results: RerankedResult[],
  options: ContextBuilderOptions = DEFAULT_OPTIONS
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const blocks: string[] = [];
  let totalTokens = 0;

  for (const result of results) {
    const block = formatContextBlock(result);
    const tokens = estimateTokens(block);

    if (totalTokens + tokens > opts.maxTokens) {
      // Si on a déjà au moins 1 block, on arrête
      if (blocks.length > 0) break;
      // Sinon, on tronque ce block
      const maxChars = opts.maxTokens * 4;
      blocks.push(block.slice(0, maxChars) + "\n… [tronqué]");
      break;
    }

    blocks.push(block);
    totalTokens += tokens;
  }

  return blocks.join("\n");
}
