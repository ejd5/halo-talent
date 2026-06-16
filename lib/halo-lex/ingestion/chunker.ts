// ─── WTF Lex, Intelligent Chunker ────────────────────────────
// Stratégies de chunking adaptées au type de document juridique.

import type { ChunkResult } from "./types";

interface ChunkerOptions {
  maxChunkSize: number; // caractères max par chunk
  overlap: number; // caractères de chevauchement entre chunks
}

const DEFAULT_OPTIONS: ChunkerOptions = {
  maxChunkSize: 4000, // ~1000 tokens
  overlap: 200,
};

/**
 * Détecte le type de document et applique la stratégie de chunking appropriée.
 */
export function chunkDocument(
  content: string,
  sourceType: string,
  options: ChunkerOptions = DEFAULT_OPTIONS
): ChunkResult[] {
  switch (sourceType) {
    case "cgu_platform":
    case "law":
      return chunkByArticle(content, options);
    case "jurisprudence":
    case "case_law":
      return chunkByParagraph(content, options);
    default:
      return chunkByHeading(content, options);
  }
}

/**
 * Chunking par article/section pour les textes de loi et CGU.
 * Détecte "Art.", "Article", "Section", "CHAPTER", numbered sections.
 */
function chunkByArticle(
  text: string,
  options: ChunkerOptions
): ChunkResult[] {
  const articleRegex =
    /^(?:Art(?:icle)?\.?\s+[\d]+[\w.-]*|Section\s+[\d]+|CHAPTER\s+[\w]+|Article\s+[\d]+[^\n]*)/gim;
  return splitByBoundary(text, articleRegex, "article", options);
}

/**
 * Chunking par paragraphe pour la jurisprudence.
 */
function chunkByParagraph(
  text: string,
  options: ChunkerOptions
): ChunkResult[] {
  const paragraphRegex = /^(?:\d+[.)]\s|paragraphe\s+\d+|considérant|attendu)/gim;
  return splitByBoundary(text, paragraphRegex, "paragraph", options);
}

/**
 * Chunking par heading (##, ###) pour les documents génériques.
 */
function chunkByHeading(
  text: string,
  options: ChunkerOptions
): ChunkResult[] {
  const headingRegex = /^#{1,4}\s+.+$/gm;
  return splitByBoundary(text, headingRegex, "heading", options);
}

/**
 * Divise le texte en chunks aux boundaries détectées.
 * Fallback : chunking par taille fixe si aucune boundary trouvée.
 */
function splitByBoundary(
  text: string,
  boundaryRegex: RegExp,
  boundaryType: string,
  options: ChunkerOptions
): ChunkResult[] {
  const boundaries: { index: number; label: string }[] = [];
  let match: RegExpExecArray | null;

  // Reset regex state
  boundaryRegex.lastIndex = 0;

  while ((match = boundaryRegex.exec(text)) !== null) {
    boundaries.push({
      index: match.index,
      label: match[0].trim(),
    });
  }

  if (boundaries.length <= 1) {
    // Aucune boundary trouvée → fallback au chunking par taille fixe
    return chunkByFixedSize(text, options);
  }

  const chunks: ChunkResult[] = [];
  for (let i = 0; i < boundaries.length; i++) {
    const start = boundaries[i].index;
    const end =
      i + 1 < boundaries.length ? boundaries[i + 1].index : text.length;
    const chunkText = text.slice(start, end).trim();

    // Si le chunk est trop grand, sous-diviser
    if (chunkText.length > options.maxChunkSize) {
      const subChunks = chunkByFixedSize(chunkText, options);
      for (const sub of subChunks) {
        chunks.push({
          index: chunks.length,
          text: sub.text,
          metadata: {
            boundaryType,
            boundaryLabel: boundaries[i].label,
            subChunk: true,
          },
        });
      }
    } else {
      chunks.push({
        index: chunks.length,
        text: chunkText,
        metadata: {
          boundaryType,
          boundaryLabel: boundaries[i].label,
        },
      });
    }
  }

  return chunks;
}

/**
 * Fallback : chunking par taille fixe avec chevauchement.
 */
function chunkByFixedSize(
  text: string,
  options: ChunkerOptions
): ChunkResult[] {
  if (text.length <= options.maxChunkSize) {
    return [
      {
        index: 0,
        text: text.trim(),
        metadata: { chunkingStrategy: "fixed", isComplete: true },
      },
    ];
  }

  const chunks: ChunkResult[] = [];
  let start = 0;
  let index = 0;

  while (start < text.length) {
    let end = Math.min(start + options.maxChunkSize, text.length);

    // Essayer de couper à la fin d'une phrase
    if (end < text.length) {
      const sentenceEnd = text.lastIndexOf(".", end);
      if (sentenceEnd > start + options.maxChunkSize / 2) {
        end = sentenceEnd + 1;
      }
    }

    chunks.push({
      index,
      text: text.slice(start, end).trim(),
      metadata: {
        chunkingStrategy: "fixed",
        startOffset: start,
        endOffset: end,
      },
    });

    start = end - options.overlap;
    index++;
  }

  return chunks;
}
