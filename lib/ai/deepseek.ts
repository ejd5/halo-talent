// ─── DeepSeek V4 Provider, Server-only ───────────────────
// Caching client for WTF Sovereign Chat AI
// Internal names: deepseek-v4-flash / deepseek-v4-pro
// API names mapped internally via MODEL_API_NAMES

import type { DeepSeekModel, DeepSeekRequest, DeepSeekResponse } from "@/lib/types/chat-ai";

// ── API model name mapping (internal → actual API) ──────
const MODEL_API_NAMES: Record<DeepSeekModel, string> = {
  "deepseek-v4-flash": "deepseek-chat",
  "deepseek-v4-pro": "deepseek-reasoner",
};

// ── Client singleton ────────────────────────────────────

let _client: { fetch: typeof fetch } | null = null;

function getClient() {
  if (!_client) {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return null; // Demo mode
    }
    _client = { fetch };
  }
  return _client;
}

function getApiKey(): string | null {
  return process.env.DEEPSEEK_API_KEY || null;
}

// ── Core call ───────────────────────────────────────────

export async function callDeepSeek(req: DeepSeekRequest): Promise<DeepSeekResponse> {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY not configured");
  }

  const apiModel = MODEL_API_NAMES[req.model] || req.model;
  const startTime = Date.now();

  const body: Record<string, unknown> = {
    model: apiModel,
    messages: req.messages,
    temperature: req.temperature ?? 0.3,
    max_tokens: req.maxTokens ?? 2048,
  };

  if (req.json) {
    body.response_format = { type: "json_object" };
  }

  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`DeepSeek API error ${res.status}: ${errorText}`);
  }

  const data = await res.json();
  const latencyMs = Date.now() - startTime;
  const choice = data.choices?.[0];
  const text = choice?.message?.content || "";
  const tokensUsed = data.usage?.total_tokens || 0;

  let parsed: Record<string, unknown> | undefined;
  if (req.json && text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      // Not valid JSON, return raw text
    }
  }

  return { text, model: req.model, tokensUsed, latencyMs, parsed };
}

// ── Demo check ──────────────────────────────────────────

export function isDemoMode(): boolean {
  return !getApiKey();
}

// ── Token cost estimation (indicative) ──────────────────

const COST_PER_MILLION: Record<DeepSeekModel, { input: number; output: number }> = {
  "deepseek-v4-flash": { input: 0.28, output: 1.10 },
  "deepseek-v4-pro": { input: 1.74, output: 3.48 },
};

export function estimateCost(model: DeepSeekModel, inputTokens: number, outputTokens: number): number {
  const rates = COST_PER_MILLION[model];
  return ((inputTokens / 1_000_000) * rates.input) + ((outputTokens / 1_000_000) * rates.output);
}
