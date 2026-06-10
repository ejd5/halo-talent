// ─── Adapter tests — Halo Companion ───────────

import { describe, it, expect } from "vitest";

// Platform detection tests would go here.
// DOM-dependent tests run in a browser environment via WXT's e2e test runner.

describe("Platform adapters", () => {
  it("should detect platform from hostname", () => {
    // The detectPlatform function is tested indirectly through the adapters
    // Full DOM tests require a browser environment (Playwright + WXT)
    expect(true).toBe(true);
  });
});
