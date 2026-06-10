// ─── Rate Limiter Tests — Halo Companion ───────────

import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, clearRateLimits } from "./rate-limiter";

beforeEach(() => {
  clearRateLimits();
});

describe("checkRateLimit", () => {
  it("allows first request", () => {
    expect(checkRateLimit("test_key", 5, 1000)).toBe(true);
  });

  it("allows up to maxTokens requests", () => {
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit("burst_key", 5, 1000)).toBe(true);
    }
  });

  it("blocks requests beyond maxTokens", () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit("limit_key", 5, 1000);
    }
    expect(checkRateLimit("limit_key", 5, 1000)).toBe(false);
  });

  it("isolates different keys from each other", () => {
    // Exhaust key A
    for (let i = 0; i < 3; i++) {
      checkRateLimit("key_a", 3, 1000);
    }
    // Key B should still have tokens
    expect(checkRateLimit("key_b", 3, 1000)).toBe(true);
    // Key A should be exhausted
    expect(checkRateLimit("key_a", 3, 1000)).toBe(false);
  });

  it("respects custom consumeTokens", () => {
    // Consume 3 tokens at once from a 5-token bucket
    expect(checkRateLimit("bulk_key", 5, 1000, 3)).toBe(true);
    // Should have 2 tokens left
    expect(checkRateLimit("bulk_key", 5, 1000, 2)).toBe(true);
    // Should be empty now
    expect(checkRateLimit("bulk_key", 5, 1000)).toBe(false);
  });

  it("rejects request that exceeds maxTokens", () => {
    expect(checkRateLimit("huge_key", 5, 1000, 10)).toBe(false);
  });
});

describe("clearRateLimits", () => {
  it("resets all buckets", () => {
    // Exhaust limit
    for (let i = 0; i < 5; i++) {
      checkRateLimit("reset_key", 5, 1000);
    }
    expect(checkRateLimit("reset_key", 5, 1000)).toBe(false);

    // Clear
    clearRateLimits();

    // Should work again
    expect(checkRateLimit("reset_key", 5, 1000)).toBe(true);
  });
});
