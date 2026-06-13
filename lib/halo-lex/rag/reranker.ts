// ─── WTF Lex, Reranker ──────────────────────────────────────
// Re-ranking des résultats RAG par pertinence + complexité.

import type { RagResult, RerankedResult } from "./types";

interface RerankerOptions {
  /** Score minimum pour être inclus */
  threshold?: number;
  /** Préférer les chunks les plus simples (vrai) ou les plus complexes */
  preferSimple?: boolean;
  /** Déduplication : max chunks par document source */
  maxPerSource?: number;
}

const DEFAULT_OPTIONS: RerankerOptions = {
  threshold: 0.3,
  preferSimple: true,
  maxPerSource: 3,
};

/**
 * Re-rank les résultats RAG.
 * - Filtre les résultats sous le threshold
 * - Déduplique par document source
 * - Réordonne par score de pertinence puis complexité
 */
export function rerank(
  results: RagResult[],
  options: RerankerOptions = DEFAULT_OPTIONS
): RerankedResult[] {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // 1. Filtrer
  let filtered = results.filter((r) => r.score >= (opts.threshold ?? 0));

  // 2. Dédupliquer par source
  const perSource = new Map<string, number>();
  filtered = filtered.filter((r) => {
    const count = perSource.get(r.source) ?? 0;
    if (count >= (opts.maxPerSource ?? 3)) return false;
    perSource.set(r.source, count + 1);
    return true;
  });

  // 3. Calculer le rerank score
  const scored: RerankedResult[] = filtered.map((r) => {
    const complexityBonus = opts.preferSimple
      ? (5 - r.complexityLevel) / 5 // +1 pour les plus simples
      : r.complexityLevel / 5; // +1 pour les plus complexes

    return {
      ...r,
      rerankScore: r.score * 0.7 + complexityBonus * 0.3,
    };
  });

  // 4. Trier par rerank score
  return scored.sort((a, b) => b.rerankScore - a.rerankScore);
}
