/**
 * Anti-verbatim guardrail.
 * Detects if a generated text is too similar to a source (CGU, law text, etc.)
 * and blocks publication if the similarity exceeds the threshold.
 *
 * Uses word-set overlap (Jaccard index) — lightweight, no embedding model needed.
 * Threshold 0.35 = 35% word overlap triggers rejection.
 */

const THRESHOLD = 0.35;

function wordSet(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .split(/[^\p{L}]+/u)
      .filter((w) => w.length > 3)
  );
}

/**
 * Returns the Jaccard similarity between two texts (0..1).
 * 0 = completely different, 1 = identical.
 */
export function similarity(a: string, b: string): number {
  const aSet = wordSet(a);
  const bSet = wordSet(b);

  if (aSet.size === 0 && bSet.size === 0) return 0;

  let intersection = 0;
  for (const w of aSet) {
    if (bSet.has(w)) intersection++;
  }

  const union = new Set([...aSet, ...bSet]);
  return union.size > 0 ? intersection / union.size : 0;
}

/**
 * Asserts that `generated` text is not a verbatim copy of `source`.
 * Throws if similarity exceeds the threshold.
 */
export function assertNoVerbatim(
  generated: string,
  source: string,
  context?: string,
): void {
  const sim = similarity(generated, source);

  if (sim > THRESHOLD) {
    throw new Error(
      `[no-verbatim] Blocage : similarité ${(sim * 100).toFixed(0)}% ` +
        `(seuil ${(THRESHOLD * 100).toFixed(0)}%)` +
        (context ? ` — ${context}` : "") +
        `. Le texte généré est trop proche de la source originale. Reformulez avec vos propres mots.`,
    );
  }
}

/**
 * Safe version — returns result instead of throwing.
 */
export function checkVerbatim(
  generated: string,
  source: string,
): { ok: boolean; similarity: number; threshold: number } {
  const sim = similarity(generated, source);
  return {
    ok: sim <= THRESHOLD,
    similarity: sim,
    threshold: THRESHOLD,
  };
}
