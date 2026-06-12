// ─── Halo Lex — Claude Client ─────────────────────────────────
// Wrapper autour de l'API Anthropic Claude Opus 4.7.

import type { LexMessage } from "../types";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-opus-4-7";
const DEFAULT_MAX_TOKENS = 2048;
const DEFAULT_TEMPERATURE = 0.3;

interface ClaudeOptions {
  maxTokens?: number;
  temperature?: number;
  system?: string;
}

interface ClaudeResponse {
  content: { type: string; text: string }[];
  usage: { input_tokens: number; output_tokens: number };
}

/**
 * Envoie un message à Claude Opus 4.7 et retourne la réponse complète.
 */
export async function sendMessage(
  messages: LexMessage[],
  systemPrompt: string,
  options: ClaudeOptions = {}
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return mockResponse(messages);
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: options.maxTokens ?? DEFAULT_MAX_TOKENS,
      temperature: options.temperature ?? DEFAULT_TEMPERATURE,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role === "system" ? "assistant" : m.role,
        content: m.content,
      })),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error ${response.status}: ${error}`);
  }

  const result = (await response.json()) as ClaudeResponse;
  return result.content[0]?.text ?? "";
}

/**
 * Envoie un message à Claude avec streaming SSE.
 * Retourne un ReadableStream que le client peut consommer.
 */
export function sendMessageStream(
  messages: LexMessage[],
  systemPrompt: string,
  options: ClaudeOptions = {}
): ReadableStream<Uint8Array> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    // Mode dev : retourne un stream mock
    const mockText = mockResponse(messages);
    return new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        for (const char of mockText) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "text", text: char })}\n\n`)
          );
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
        controller.close();
      },
    });
  }

  let cancelled = false;

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        const response = await fetch(ANTHROPIC_API_URL, {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: MODEL,
            max_tokens: options.maxTokens ?? DEFAULT_MAX_TOKENS,
            temperature: options.temperature ?? DEFAULT_TEMPERATURE,
            system: systemPrompt,
            messages: messages.map((m) => ({
              role: m.role === "system" ? "assistant" : m.role,
              content: m.content,
            })),
            stream: true,
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", text: `Claude API error: ${error}` })}\n\n`
            )
          );
          controller.close();
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        while (!cancelled) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;

              try {
                const event = JSON.parse(data);
                const text = event.delta?.text;
                if (text) {
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ type: "text", text })}\n\n`
                    )
                  );
                }
              } catch {
                // Ignorer les lignes non-JSON
              }
            }
          }
        }

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
        );
      } catch (err) {
        if (!cancelled) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", text: String(err) })}\n\n`
            )
          );
        }
      }

      controller.close();
    },
    cancel() {
      cancelled = true;
    },
  });

  return stream;
}

/**
 * Réponse mock pour le développement (quand ANTHROPIC_API_KEY n'est pas défini).
 */
function mockResponse(messages: LexMessage[]): string {
  const lastUserMessage = messages.filter((m) => m.role === "user").pop();
  const question = lastUserMessage?.content ?? "";

  return `Merci pour votre question. Je comprends que vous me demandez au sujet de : "${question.slice(0, 100)}..."

D'après la base juridique à ma disposition, voici les éléments d'information pertinents :

1. **Cadre légal** : Cette situation est principalement régie par les dispositions du Code civil et les Conditions Générales d'Utilisation des plateformes concernées.

2. **Points clés** :
   - Les créateurs conservent leurs droits fondamentaux
   - Les clauses contractuelles déséquilibrées peuvent être contestées
   - Il est recommandé de documenter tous les échanges par écrit

3. **Recommandation** : Je vous suggère de consulter un avocat spécialisé si le montant en jeu dépasse 5 000 € ou si la situation implique plusieurs juridictions.

[Sources: Code civil français, Art. 1171; CGU plateformes]

N'hésitez pas à me donner plus de détails pour une analyse plus précise, ou à utiliser le générateur de lettres pour formaliser votre démarche.`;
}
