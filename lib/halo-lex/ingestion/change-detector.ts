// ─── Halo Lex — Change Detector ────────────────────────────────
// Détection de changements via SHA-256 entre versions de documents.

import crypto from "crypto";

/**
 * Calcule le hash SHA-256 d'un texte.
 */
export function hashContent(content: string): string {
  return crypto
    .createHash("sha256")
    .update(content, "utf-8")
    .digest("hex");
}

/**
 * Compare un hash avec une version précédente.
 * Retourne true si le contenu a changé.
 */
export function hasChanged(
  newHash: string,
  previousHash?: string | null
): boolean {
  if (!previousHash) return true;
  return newHash !== previousHash;
}

/**
 * Analyse la proportion de changement entre deux textes
 * via Jaccard similarity sur les mots.
 * Retourne un score de 0 (identique) à 1 (totalement différent).
 */
export function diffScore(
  oldText: string,
  newText: string
): number {
  const tokenize = (t: string): Set<string> =>
    new Set(
      t
        .toLowerCase()
        .split(/\W+/)
        .filter((w) => w.length > 2)
    );

  const oldTokens = tokenize(oldText);
  const newTokens = tokenize(newText);

  if (newTokens.size === 0) return 1;

  const intersection = new Set(
    [...oldTokens].filter((t) => newTokens.has(t))
  );

  const union = new Set([...oldTokens, ...newTokens]);

  return 1 - intersection.size / union.size;
}
