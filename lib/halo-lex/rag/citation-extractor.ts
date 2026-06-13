// ─── WTF Lex, Citation Extractor ────────────────────────────
// Extrait les citations [Source: ...] du texte généré par Claude.

import type { Citation } from "./types";

const CITATION_REGEX = /\[Source:\s*([^\]]+)\]/g;
const REFERENCE_REGEX = /(Art\.?\s*[\d-]+|RÈGLEMENT\s+[\d/]+|L\.\s*[\d-]+|Section\s+[\d.]+|Article\s+[\d]+)/gi;

/**
 * Extrait les citations du texte de réponse de Lex.
 * Cherche les patterns [Source: ...] et les structure.
 */
export function extractCitations(text: string): Citation[] {
  const citations: Citation[] = [];
  const seen = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = CITATION_REGEX.exec(text)) !== null) {
    const full = match[1].trim();

    // Éviter les doublons
    if (seen.has(full)) continue;
    seen.add(full);

    // Parser le contenu : "Type, Référence, date"
    const parts = full.split(", ").map((p) => p.trim());
    const sourceName = parts[0] ?? full;
    const reference = parts.length > 1 ? parts[1] : extractReference(full);

    // Prendre le texte environnant comme extrait
    const contextStart = Math.max(0, match.index - 60);
    const contextEnd = Math.min(text.length, match.index + match[0].length + 60);
    const snippet = text
      .slice(contextStart, contextEnd)
      .replace(CITATION_REGEX, "")
      .trim()
      .slice(0, 150);

    citations.push({
      sourceName,
      reference,
      text: snippet || full,
    });
  }

  return citations;
}

/**
 * Extrait une référence juridique depuis le nom de la source.
 */
function extractReference(sourceName: string): string {
  const match = REFERENCE_REGEX.exec(sourceName);
  if (match) return match[1];

  // Fallback : utiliser les 60 premiers caractères
  return sourceName.slice(0, 60).trim();
}
