// ─── Halo Lex — Enricher ───────────────────────────────────────
// Enrichit chaque chunk via Claude Opus : résumé, tags, complexité.

import type { ChunkResult, EnrichmentResult } from "./types";

interface EnricherOptions {
  language: string;
}

const DEFAULT_OPTIONS: EnricherOptions = {
  language: "fr",
};

/**
 * Enrichit un chunk avec résumé, tags, complexité et cas d'usage.
 * Utilise Claude Opus si ANTHROPIC_API_KEY est défini,
 * sinon génère des valeurs par défaut.
 */
export async function enrichChunk(
  chunk: ChunkResult,
  documentTitle: string,
  options: EnricherOptions = DEFAULT_OPTIONS
): Promise<EnrichmentResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return defaultEnrichment(chunk, documentTitle);
  }

  try {
    const prompt = `Analyse cet extrait juridique et retourne UNIQUEMENT du JSON valide (sans markdown, sans \`\`\`).

Extrait : "${chunk.text.slice(0, 2000)}"
Document : "${documentTitle}"

Format JSON attendu :
{
  "summary": "Résumé en 1-2 phrases en ${options.language}",
  "tags": ["tag1", "tag2", "tag3"],
  "complexity_level": 3,
  "use_cases": ["cas d'usage typique pour créateur"]
}

Règles :
- summary : concis, en ${options.language}, accessible à un créateur
- tags : max 5 tags juridiques (ex: droit_image, RGPD, clause_abusive, suspension, paiement)
- complexity_level : 1 (simple) à 5 (très complexe)
- use_cases : max 3 cas d'usage typiques pour créateurs de contenu`;

    const response = await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          temperature: 0.3,
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Anthropic API error ${response.status}: ${await response.text()}`
      );
    }

    const result = await response.json();
    const text = result.content?.[0]?.text ?? "{}";

    // Extract JSON from response (handle markdown wrapping)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in enrichment response");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      summary: parsed.summary ?? `Extrait de ${documentTitle}`,
      tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 5) : [],
      complexityLevel: parsed.complexity_level ?? 3,
      useCases: Array.isArray(parsed.use_cases) ? parsed.use_cases.slice(0, 3) : [],
    };
  } catch (err) {
    console.warn("Enrichment failed, using defaults:", err);
    return defaultEnrichment(chunk, documentTitle);
  }
}

/**
 * Enrichit plusieurs chunks en parallèle.
 */
export async function enrichChunks(
  chunks: ChunkResult[],
  documentTitle: string,
  options: EnricherOptions = DEFAULT_OPTIONS
): Promise<EnrichmentResult[]> {
  // Limiter le parallélisme pour éviter les rate limits
  const concurrency = 3;
  const results: EnrichmentResult[] = [];

  for (let i = 0; i < chunks.length; i += concurrency) {
    const batch = chunks.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map((c) => enrichChunk(c, documentTitle, options))
    );
    results.push(...batchResults);
  }

  return results;
}

function defaultEnrichment(
  chunk: ChunkResult,
  documentTitle: string
): EnrichmentResult {
  const textPreview = chunk.text.slice(0, 100).replace(/\s+/g, " ").trim();
  return {
    summary: `Extrait de ${documentTitle}: "${textPreview}..."`,
    tags: extractTagsFromText(chunk.text),
    complexityLevel: 3,
    useCases: ["consultation_juridique_generale"],
  };
}

function extractTagsFromText(text: string): string[] {
  const keywords: Record<string, RegExp> = {
    droit_image: /droit\s*(?:à\s*)?l['']image/i,
    rgpd: /rgpd|données?\s+personnelles?|data\s+protection/i,
    dsa: /dsa|digital\s+services\s+act/i,
    clause_abusive: /clause\s+abusive/i,
    suspension: /suspension|bannissement|ban/i,
    paiement: /paiement|payment|retenue/i,
    contrat: /contrat|contract/i,
    propriete_intellectuelle: /propri[ée]t[ée]\s+intellectuelle|copyright/i,
    cgu: /cgu|terms\s+of\s+service/i,
    fiscalite: /fiscalit[ée]|imp[ôo]t|taxe|déclaration/i,
  };

  return Object.entries(keywords)
    .filter(([, regex]) => regex.test(text))
    .map(([tag]) => tag);
}
