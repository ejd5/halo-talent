// ─── WTF Lex, Chat API (Express mode) ──────────────────────
// POST /api/lex/chat
// Body: { messages, locale?, platforms?, newSession? }
// Response: SSE stream via DeepSeek (with fallback to Claude)
//
// Express pipeline:
// 1. PII anonymization → 2. Router → 3. RAG → 4. DeepSeek → 5. Citation check
// → 6. Forbidden terms filter → 7. Disclaimer injection → 8. SSE

import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { LexMessage } from "@/lib/halo-lex/types";
import { retrieve } from "@/lib/halo-lex/rag/retriever";
import { rerank } from "@/lib/halo-lex/rag/reranker";
import { buildContext } from "@/lib/halo-lex/rag/context-builder";
import { extractCitations } from "@/lib/halo-lex/rag/citation-extractor";
import { buildLexSystemPrompt, getWelcomeMessage } from "@/lib/halo-lex/llm/system-prompts";
import { checkGuardrails } from "@/lib/halo-lex/llm/guardrails";
import { sseResponse, sseData } from "@/lib/halo-lex/llm/streaming";
import { chatWithDeepSeek } from "@/lib/halo-lex/llm/deepseek-client";
import { analyzeContext, selectModel, detectLetterNeed, analyzeComplexity, selectModelByComplexity } from "@/lib/halo-lex/llm/router";
import { anonymizePII, deanonymize } from "@/lib/halo-lex/compliance/pii-anonymizer";
import { applyTerminologyFilter, checkAndFilter } from "@/lib/halo-lex/compliance/forbidden-words-filter";
import { sanitizeResponse } from "@/lib/halo-lex/compliance/citation-verifier";
import { injectDisclaimer, hasDisclaimer } from "@/lib/halo-lex/compliance/disclaimer-injector";
import { sendMessageStream } from "@/lib/halo-lex/llm/claude-client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface ChatRequestBody {
  messages: LexMessage[];
  locale?: string;
  platforms?: string[];
  newSession?: boolean;
  useClaude?: boolean; // Force Claude instead of DeepSeek
}

/**
 * POST /api/lex/chat
 * Envoie un message à Lex et retourne une réponse streamée.
 * Utilise DeepSeek V4 par défaut (économique), avec option Claude.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatRequestBody;
    const { messages, locale = "fr", platforms = [], newSession, useClaude } = body;

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages requis" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = await createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Authentification requise" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Welcome message for new sessions
    if (newSession) {
      const welcome = getWelcomeMessage(locale);
      const stream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          controller.enqueue(
            encoder.encode(sseData({ type: "text", text: welcome }))
          );
          controller.enqueue(encoder.encode(sseData({ type: "sources", sources: [] })));
          controller.enqueue(
            encoder.encode(
              sseData({
                type: "actions",
                actions: [
                  { label: "🔍 Lancer un diagnostic guidé", action: "start_questionnaire" },
                  { label: "📝 Demander une rédaction officielle", action: "generate_letter" },
                ],
              })
            )
          );
          controller.enqueue(encoder.encode(sseData({ type: "done" })));
          controller.close();
        },
      });
      return sseResponse(stream);
    }

    // Get last user message
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    const query = lastUserMessage?.content ?? "";

    // Guardrails check
    const guardrailResult = checkGuardrails(query);
    if (guardrailResult.action === "emergency") {
      const stream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          controller.enqueue(
            encoder.encode(
              sseData({ type: "guardrail", action: "emergency", text: guardrailResult.reason })
            )
          );
          controller.enqueue(encoder.encode(sseData({ type: "done" })));
          controller.close();
        },
      });
      return sseResponse(stream);
    }

    // RAG retrieval
    let ragContext = "";
    if (query) {
      const results = await retrieve({ text: query, topK: 6 });
      const reranked = rerank(results);
      ragContext = buildContext(reranked);
    }

    // Build system prompt
    const systemPrompt = buildLexSystemPrompt({ locale, platforms, ragContext });

    // Detect letter need for action suggestions
    const letterNeed = detectLetterNeed(messages);

    // Build the enriched SSE stream with compliance pipeline
    const enrichedStream = await buildResponseStream({
      messages,
      systemPrompt,
      query,
      ragContext,
      locale,
      useClaude: useClaude || !process.env.DEEPSEEK_API_KEY,
      letterNeed: letterNeed.detected,
    });

    return sseResponse(enrichedStream);
  } catch (error) {
    console.error("Lex chat error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

interface BuildStreamParams {
  messages: LexMessage[];
  systemPrompt: string;
  query: string;
  ragContext: string;
  locale: string;
  useClaude: boolean;
  letterNeed: boolean;
}

/**
 * Construit le flux SSE avec la pipeline compliance Express.
 */
async function buildResponseStream(params: BuildStreamParams): Promise<ReadableStream> {
  const { messages, systemPrompt, locale, useClaude, letterNeed } = params;

  // Step 1: PII anonymization
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
  const queryText = lastUserMsg?.content || "";
  const { anonymized, mappings } = anonymizePII(queryText);

  // Step 2: Model routing
  const complexity = analyzeComplexity(anonymized);
  const context = analyzeContext(anonymized, messages);
  const modelName = useClaude ? "deepseek-v4-flash" : selectModelByComplexity(complexity);
  const modelLabel = useClaude ? "Claude Opus 4.7" : modelName;

  console.log(`[Lex Router] Modèle sélectionné : ${modelLabel} | Complexité: ${complexity} | Contexte:`, context);

  if (useClaude) {
    // Use existing Claude implementation (fallback)
    const claudeMessages: LexMessage[] = messages.map((m) => ({
      role: m.role,
      content: m.role === "user" ? deanonymize(anonymizePII(m.content).anonymized, {}) : m.content,
    }));

    return buildClaudeStream(claudeMessages, systemPrompt, letterNeed, locale);
  }

  // Step 3: Call DeepSeek
  const dsMessages: LexMessage[] = messages.map((m) => ({
    role: m.role,
    content: m.role === "user" ? anonymized : m.content,
  }));

  try {
    const response = await chatWithDeepSeek({
      model: modelName,
      systemPrompt,
      messages: dsMessages,
      ragContext: params.ragContext,
      temperature: 0.3,
      maxTokens: 2048,
      stream: true,
    });

    // Step 4: Build SSE with compliance pipeline
    return new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let fullResponse = "";

        try {
          for await (const chunk of response) {
            const delta = chunk.choices?.[0]?.delta?.content;
            if (delta) {
              fullResponse += delta;
              controller.enqueue(
                encoder.encode(sseData({ type: "text", text: delta }))
              );
            }
          }

          // Step 5: Deanonymize before compliance checks
          let finalResponse = deanonymize(fullResponse, mappings);

          // Step 6: Citation verification (anti-hallucination)
          const { sanitized, removedCitations } = await sanitizeResponse(
            finalResponse,
            params.ragContext
          );
          finalResponse = sanitized;

          if (removedCitations.length > 0) {
            console.log("[Lex Compliance] Citations non vérifiées supprimées:", removedCitations);
          }

          // Step 7: Forbidden terms filter
          const { filtered, corrections } = checkAndFilter(finalResponse);
          if (corrections.length > 0) {
            console.log("[Lex Compliance] Termes interdits filtrés:", corrections);
          }
          finalResponse = applyTerminologyFilter(finalResponse);

          // Step 8: Disclaimer injection (if not already present)
          if (!hasDisclaimer(finalResponse)) {
            finalResponse = injectDisclaimer(finalResponse, "chat");
          }

          // Re-envoyer la version filtrée
          controller.enqueue(
            encoder.encode(sseData({ type: "correction", text: finalResponse }))
          );

          // Extracted citations
          const citations = extractCitations(finalResponse);
          if (citations.length > 0) {
            controller.enqueue(encoder.encode(sseData({ type: "sources", sources: citations })));
          }

          // Suggested actions
          const actions = generateSuggestedActions(finalResponse, letterNeed, locale);
          controller.enqueue(encoder.encode(sseData({ type: "actions", actions })));
        } catch (err) {
          controller.enqueue(
            encoder.encode(sseData({ type: "error", text: String(err) }))
          );
        }

        controller.enqueue(encoder.encode(sseData({ type: "done" })));
        controller.close();
      },
    });
  } catch (err) {
    // Fallback to Claude if DeepSeek fails
    console.error("[Lex] DeepSeek failed, falling back to Claude:", err);
    const claudeMessages: LexMessage[] = messages.map((m) => ({
      role: m.role,
      content: deanonymize(anonymizePII(m.content).anonymized, {}),
    }));
    return buildClaudeStream(claudeMessages, systemPrompt, letterNeed, locale);
  }
}

/**
 * Build SSE stream from Claude (fallback or explicit).
 */
function buildClaudeStream(
  messages: LexMessage[],
  systemPrompt: string,
  letterNeed: boolean,
  locale: string
): ReadableStream {
  const claudeStream = sendMessageStream(messages, systemPrompt);

  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let fullResponse = "";

      try {
        const reader = claudeStream.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullResponse += chunk;
          controller.enqueue(new TextEncoder().encode(chunk));
        }

        // Compliance filters on Claude output
        let finalResponse = fullResponse;
        const { sanitized } = await sanitizeResponse(finalResponse);
        finalResponse = applyTerminologyFilter(sanitized);
        if (!hasDisclaimer(finalResponse)) {
          finalResponse = injectDisclaimer(finalResponse, "chat");
        }

        controller.enqueue(encoder.encode(sseData({ type: "correction", text: finalResponse })));

        const citations = extractCitations(finalResponse);
        if (citations.length > 0) {
          controller.enqueue(encoder.encode(sseData({ type: "sources", sources: citations })));
        }

        const actions = generateSuggestedActions(finalResponse, letterNeed, locale);
        controller.enqueue(encoder.encode(sseData({ type: "actions", actions })));
      } catch (err) {
        controller.enqueue(encoder.encode(sseData({ type: "error", text: String(err) })));
      }

      controller.enqueue(encoder.encode(sseData({ type: "done" })));
      controller.close();
    },
  });
}

/**
 * Génère les actions suggérées (Express : lettre → demande de rédaction).
 */
function generateSuggestedActions(
  response: string,
  letterNeedDetected: boolean,
  locale: string
): { label: string; action: string }[] {
  const actions: { label: string; action: string }[] = [];

  // Si besoin de lettre détecté, proposer la rédaction
  if (letterNeedDetected || /\b(générer|lettre|mise en demeure|appel|recours|rédaction)\b/i.test(response)) {
    actions.push({
      label: locale === "en" ? "📝 Request official drafting" : "📝 Demander la rédaction officielle",
      action: "generate_letter",
    });
  }

  if (/\b(diagnostic|questionnaire|examiner|analyser)\b/i.test(response)) {
    actions.push({
      label: locale === "en" ? "🔍 Start a diagnosis" : "🔍 Lancer un diagnostic",
      action: "start_diagnostic",
    });
  }

  // Toujours proposer le diagnostic si c'est le début
  if (!letterNeedDetected && actions.length === 0) {
    actions.push({
      label: locale === "en" ? "🔍 Start a diagnosis" : "🔍 Lancer un diagnostic guidé",
      action: "start_questionnaire",
    });
  }

  return actions;
}
