// ─── WTF Lex, Embeddings Service ─────────────────────────────
// Wrapper autour de Voyage AI pour la génération d'embeddings.
// Fallback : embedding mock en développement.

const VOYAGE_API_URL = "https://api.voyageai.com/v1/embeddings";
const MODEL = "voyage-3-large"; // 1024 dimensions
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

interface VoyageResponse {
  data: { embedding: number[]; index: number }[];
  usage: { total_tokens: number };
}

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Génère un embedding vectoriel pour un texte donné.
 * Utilise Voyage AI en production, mock en développement.
 */
export async function generateEmbedding(
  text: string
): Promise<number[]> {
  const apiKey = process.env.VOYAGE_API_KEY;

  if (!apiKey) {
    // Dev mode : embedding mock déterministe basé sur la longueur du texte
    return mockEmbedding(text);
  }

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(VOYAGE_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: [text],
          model: MODEL,
          input_type: "document",
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Voyage AI error ${response.status}: ${await response.text()}`
        );
      }

      const result = (await response.json()) as VoyageResponse;
      return result.data[0].embedding;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt);
      }
    }
  }

  console.warn(
    "Embedding API failed after retries, using mock:",
    lastError?.message
  );
  return mockEmbedding(text);
}

/**
 * Génère des embeddings pour plusieurs textes (batch).
 */
export async function generateEmbeddings(
  texts: string[]
): Promise<number[][]> {
  const apiKey = process.env.VOYAGE_API_KEY;

  if (!apiKey) {
    return texts.map((t) => mockEmbedding(t));
  }

  try {
    // Split en batches de 10 pour éviter les timeouts
    const batchSize = 10;
    const results: number[][] = [];

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const response = await fetch(VOYAGE_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: batch,
          model: MODEL,
          input_type: "document",
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Voyage AI batch error ${response.status}: ${await response.text()}`
        );
      }

      const result = (await response.json()) as VoyageResponse;
      const sorted = result.data.sort((a, b) => a.index - b.index);
      results.push(...sorted.map((d) => d.embedding));
    }

    return results;
  } catch (err) {
    console.warn("Batch embedding failed, using mocks:", err);
    return texts.map((t) => mockEmbedding(t));
  }
}

/**
 * Embedding mock déterministe pour le développement.
 * Génère un vecteur de 1024 dimensions basé sur le hash du texte.
 */
function mockEmbedding(text: string): number[] {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const chr = text.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }

  const seed = Math.abs(hash) / 0x7fffffff;
  const vec: number[] = [];
  for (let i = 0; i < 1024; i++) {
    // Pseudo-aléatoire déterministe basé sur le seed
    const val = Math.sin(seed * (i + 1) * 100) * 0.5 + 0.5;
    vec.push(Math.max(0, Math.min(1, val)));
  }
  return vec;
}
