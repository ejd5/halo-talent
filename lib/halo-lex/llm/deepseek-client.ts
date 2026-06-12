// ─── DeepSeek API Client ──────────────────────────────────────
// Compatible API OpenAI via https://api.deepseek.com/v1
// Modèles:
//   - deepseek-v4-pro    : 1.74$/M input, 3.48$/M output
//   - deepseek-v4-flash  : 0.28$/M input, 1.10$/M output

import OpenAI from "openai";
import type { LexMessage } from "@/lib/halo-lex/types";

export type DeepSeekModel = "deepseek-v4-pro" | "deepseek-v4-flash";

export interface DeepSeekChatParams {
  model: DeepSeekModel;
  systemPrompt: string;
  messages: LexMessage[];
  ragContext?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

type DeepSeekStream = OpenAI.Chat.Completions.ChatCompletionChunk;
type DeepSeekCompletion = OpenAI.Chat.Completions.ChatCompletion;

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error("DEEPSEEK_API_KEY non configurée");
    }
    client = new OpenAI({
      baseURL: "https://api.deepseek.com/v1",
      apiKey,
    });
  }
  return client;
}

// Overloads: stream:true → AsyncIterable<ChatCompletionChunk>, stream:false → ChatCompletion
export async function chatWithDeepSeek(
  params: DeepSeekChatParams & { stream: true }
): Promise<AsyncIterable<DeepSeekStream>>;
export async function chatWithDeepSeek(
  params: DeepSeekChatParams & { stream?: false }
): Promise<DeepSeekCompletion>;
export async function chatWithDeepSeek(
  params: DeepSeekChatParams
): Promise<AsyncIterable<DeepSeekStream> | DeepSeekCompletion> {
  const { model, systemPrompt, messages, ragContext, temperature = 0.3, maxTokens = 2048, stream = false } = params;

  const fullSystemPrompt = ragContext
    ? systemPrompt + "\n\n## CONTEXTE JURIDIQUE PERTINENT :\n" + ragContext
    : systemPrompt;

  const ds = getClient();

  const result = await ds.chat.completions.create({
    model,
    messages: [
      { role: "system", content: fullSystemPrompt },
      ...messages.map((m) => ({ role: m.role as "user" | "assistant" | "system", content: m.content })),
    ],
    temperature,
    max_tokens: maxTokens,
    stream,
  });

  return result as AsyncIterable<DeepSeekStream> | DeepSeekCompletion;
}

/**
 * Envoie un message à DeepSeek avec streaming SSE.
 * Retourne un ReadableStream pour l'API route.
 */
export async function chatWithDeepSeekStream(
  params: DeepSeekChatParams
): Promise<ReadableStream> {
  const stream = await chatWithDeepSeek({ ...params, stream: true });

  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        for await (const chunk of stream) {
          const delta = chunk.choices?.[0]?.delta?.content;
          if (delta) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "text", text: delta })}\n\n`
              )
            );
          }
        }
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
        );
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "error", text: String(err) })}\n\n`
          )
        );
      }
      controller.close();
    },
  });
}
