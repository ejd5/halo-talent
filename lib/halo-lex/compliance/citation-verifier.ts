// ─── Legal Citation Verifier ──────────────────────────────────
// Vérifie que les citations légales mentionnées par le LLM
// existent réellement dans la base juridique (anti-hallucination).

import { createAdminClient } from "@/lib/supabase/server";

export interface CitationCheck {
  citation: string;
  verified: boolean;
  source?: string;
}

// Patterns de citations légales
const CITATION_PATTERNS = [
  /Article\s+\d+(?:[-\s]\d+)?(?:[-.\s]\d+)?(?:\s+du\s+(?:Code|Règlement|Loi|Décret)[^,.!?]+)/gi,
  /Art\.\s+\d+(?:[-\s]\d+)?(?:[-.\s]\d+)?(?:\s+(?:C\.?\s*(?:civ|com|trav|pén|CPI)|code[^,.!?]+))/gi,
  /(?:CGU|Conditions Générales)\s+(?:d['e]n?|de\s+la\s+plateforme\s+)?(?:OnlyFans|Fansly|MYM|Instagram|TikTok|YouTube|Twitter|Twitch)/gi,
  /Règlement\s+(?:UE| européen)[^,.!?]*\d{4}\/\d+/gi,
  /Loi\s+(?:n°|nº|n\.?)\s*\d{4}[-\s]\d+/gi,
  /Section\s+\d+(?:\.\d+)?\s+des\s+(?:CGU|Conditions Générales)/gi,
  /DSA\s*(?:Article|Règlement)?\s*\d+/gi,
  /RGPD\s*(?:Article|Règlement)?\s*\d+/gi,
];

/**
 * Extrait les citations légales d'un texte.
 */
export function extractLegalCitations(text: string): string[] {
  const citations: Set<string> = new Set();

  for (const pattern of CITATION_PATTERNS) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      citations.add(match[0].trim());
    }
  }

  return Array.from(citations);
}

/**
 * Vérifie si une citation existe dans la base de connaissance juridique.
 */
export async function verifyCitationExists(
  citation: string,
  ragContext?: string
): Promise<boolean> {
  // 1. Vérifier dans le contexte RAG fourni (déjà chargé)
  if (ragContext && ragContext.toLowerCase().includes(citation.toLowerCase())) {
    return true;
  }

  // 2. Vérifier dans la base de connaissance Supabase
  try {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from("legal_knowledge")
      .select("id")
      .textSearch("content", citation, { config: "french" })
      .limit(1);

    if (data && data.length > 0) return true;

    // 3. Vérifier aussi dans legal_chunks
    const { data: chunks } = await supabase
      .from("legal_chunks")
      .select("id")
      .textSearch("chunk_text", citation, { config: "french" })
      .limit(1);

    return !!(chunks && chunks.length > 0);
  } catch {
    return false;
  }
}

/**
 * Vérifie toutes les citations d'un texte contre la base juridique.
 */
export async function verifyAllCitations(
  text: string,
  ragContext?: string
): Promise<{
  verified: CitationCheck[];
  allVerified: boolean;
}> {
  const citations = extractLegalCitations(text);
  const results: CitationCheck[] = [];

  for (const citation of citations) {
    const verified = await verifyCitationExists(citation, ragContext);
    results.push({ citation, verified });
  }

  return {
    verified: results,
    allVerified: results.every((r) => r.verified),
  };
}

/**
 * Nettoie une réponse en supprimant les passages avec des citations non vérifiées.
 * Utilisé comme filet de sécurité avant envoi à l'utilisateur.
 */
export async function sanitizeResponse(
  response: string,
  ragContext?: string
): Promise<{ sanitized: string; removedCitations: string[] }> {
  const { verified } = await verifyAllCitations(response, ragContext);
  const removedCitations: string[] = [];

  let sanitized = response;
  for (const result of verified) {
    if (!result.verified) {
      sanitized = sanitized.replace(result.citation, "[référence supprimée]");
      removedCitations.push(result.citation);
    }
  }

  return { sanitized, removedCitations };
}
