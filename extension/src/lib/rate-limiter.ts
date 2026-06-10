// ─── Rate limiter — Halo Companion ───────────
// Prevents flooding platforms or the Halo API

interface RateLimitBucket {
  lastRefill: number;
  tokens: number;
}

const buckets = new Map<string, RateLimitBucket>();

/**
 * Check if an action is allowed under the rate limit.
 * Uses a token bucket algorithm.
 *
 * @param key - Unique key for the rate-limited resource
 * @param maxTokens - Max tokens in the bucket
 * @param refillRateMs - How often one token is added (ms)
 * @param consumeTokens - How many tokens this action consumes (default 1)
 * @returns true if the action is allowed
 */
export function checkRateLimit(
  key: string,
  maxTokens: number,
  refillRateMs: number,
  consumeTokens = 1
): boolean {
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket) {
    bucket = { lastRefill: now, tokens: maxTokens };
    buckets.set(key, bucket);
  }

  // Refill tokens
  const elapsed = now - bucket.lastRefill;
  const tokensToAdd = Math.floor(elapsed / refillRateMs) * consumeTokens;
  if (tokensToAdd > 0) {
    bucket.tokens = Math.min(maxTokens, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;
  }

  // Consume
  if (bucket.tokens >= consumeTokens) {
    bucket.tokens -= consumeTokens;
    return true;
  }

  return false;
}

/** Wait until rate-limited action is allowed */
export async function waitForRateLimit(
  key: string,
  maxTokens: number,
  refillRateMs: number,
  consumeTokens = 1
): Promise<void> {
  while (!checkRateLimit(key, maxTokens, refillRateMs, consumeTokens)) {
    await new Promise((r) => setTimeout(r, refillRateMs));
  }
}

/** Clear all rate limit buckets (for testing) */
export function clearRateLimits(): void {
  buckets.clear();
}
