// ─── Privacy Guard Tests — Halo Companion ───────────

import { describe, it, expect, beforeEach } from "vitest";
import {
  canSendToBackend,
  sanitizeFanData,
} from "./privacy-guard";
import { resetAllMocks } from "../test-setup";

beforeEach(() => {
  resetAllMocks();
});

// ─── canSendToBackend ─────────────────────────────────────

describe("canSendToBackend", () => {
  it("allows clean data through untouched", () => {
    const result = canSendToBackend({
      username: "sarah_vip",
      displayName: "Sarah",
      totalSpent: 890,
    });
    expect(result.allowed).toBe(true);
    expect(result.removedFields).toHaveLength(0);
    expect(result.riskLevel).toBe("none");
  });

  it("strips known PII fields (email, phone, address)", () => {
    const result = canSendToBackend({
      username: "john",
      email: "john@example.com",
      phone: "+33123456789",
      address: "1 rue de Paris",
      totalSpent: 100,
    });
    expect(result.allowed).toBe(false);
    expect(result.removedFields).toContain("email");
    expect(result.removedFields).toContain("phone");
    expect(result.removedFields).toContain("address");
    expect(result.riskLevel).toBe("high");
  });

  it("strips credential fields (password, token, apiKey)", () => {
    const result = canSendToBackend({
      username: "test",
      password: "secret123",
      token: "abc-def",
      apiKey: "sk-xxx",
      sessionToken: "sess-abc",
    });
    expect(result.removedFields).toContain("password");
    expect(result.removedFields).toContain("token");
    expect(result.removedFields).toContain("apiKey");
    expect(result.removedFields).toContain("sessionToken");
    expect(result.riskLevel).toBe("high");
  });

  it("redacts credit card numbers in string values", () => {
    const result = canSendToBackend({
      username: "test",
      note: "CC: 4111-1111-1111-1111 for payment",
    });
    expect(result.removedFields.length).toBeGreaterThan(0);
    expect(result.sanitizedData.note).toBe("[REDACTED — PII detected]");
  });

  it("truncates long text fields (>500 chars)", () => {
    const longText = "x".repeat(1000);
    const result = canSendToBackend({
      username: "test",
      biography: longText,
    });
    expect(result.removedFields).toContain("biography(truncated)");
    const sanitized = result.sanitizedData.biography as string;
    expect(sanitized.length).toBeLessThanOrEqual(203); // 200 + "…"
  });

  it("strips media URL references", () => {
    const result = canSendToBackend({
      username: "test",
      photo: "https://example.com/image.jpg",
      video: "https://example.com/video.mp4?token=abc",
    });
    expect(result.removedFields).toContain("photo(media_url)");
    expect(result.removedFields).toContain("video(url_with_token)");
  });

  it("blocks media arrays (messages, photos, videos)", () => {
    const result = canSendToBackend({
      username: "test",
      messages: [{ text: "Hello", sender: "fan" }],
      media: [{ url: "photo.jpg" }],
      photos: ["img1.jpg"],
      videos: ["vid1.mp4"],
    });
    expect(result.removedFields).toContain("messages");
    expect(result.removedFields).toContain("media");
    expect(result.removedFields).toContain("photos");
    expect(result.removedFields).toContain("videos");
    expect(result.riskLevel).toBe("high");
  });

  it("handles non-object input gracefully", () => {
    const result = canSendToBackend("just a string");
    expect(result.allowed).toBe(true);
    expect(result.removedFields).toHaveLength(0);
  });

  it("handles null input gracefully", () => {
    const result = canSendToBackend(null);
    expect(result.allowed).toBe(true);
    expect(result.removedFields).toHaveLength(0);
  });

  it("detects PII patterns in values with case-insensitive key matching", () => {
    const result = canSendToBackend({
      Email: "test@example.com",
      PHONE: "555-1234",
    });
    expect(result.removedFields.length).toBeGreaterThan(0);
  });
});

// ─── sanitizeFanData ──────────────────────────────────────

describe("sanitizeFanData", () => {
  it("keeps only allowed fan fields", () => {
    const result = sanitizeFanData({
      username: "sarah_vip",
      displayName: "Sarah",
      platform: "onlyfans",
      platformId: "12345",
      totalSpent: 890,
      subscriptionMonths: 12,
      lastActivity: "2026-06-10",
      tags: ["vip", "loyal"],
      isVIP: true,
      avatarUrl: "https://example.com/avatar.jpg",
      email: "sarah@example.com",
      messages: [{ text: "secret" }],
    });

    expect(result.username).toBe("sarah_vip");
    expect(result.displayName).toBe("Sarah");
    expect(result.ltv).toBe(890);
    expect(result.segment).toBe("vip");
    expect(result.platform).toBe("onlyfans");
    expect(result.tags).toContain("vip");
    // These should NOT be in the sanitized output
    expect((result as unknown as Record<string, unknown>).email).toBeUndefined();
    expect((result as unknown as Record<string, unknown>).avatarUrl).toBeUndefined();
    expect((result as unknown as Record<string, unknown>).messages).toBeUndefined();
  });

  it("classifies loyal fans correctly", () => {
    const result = sanitizeFanData({
      username: "loyal_fan",
      subscriptionMonths: 12,
      totalSpent: 200,
    });
    expect(result.segment).toBe("loyal");
  });

  it("classifies new fans correctly", () => {
    const result = sanitizeFanData({
      username: "new_fan",
      subscriptionMonths: 1,
      totalSpent: 10,
    });
    expect(result.segment).toBe("new");
  });

  it("classifies VIP fans by spending threshold", () => {
    const result = sanitizeFanData({
      username: "big_spender",
      totalSpent: 600,
      isVIP: true,
    });
    expect(result.segment).toBe("vip");
  });

  it("caps tags at 20", () => {
    const manyTags = Array.from({ length: 30 }, (_, i) => `tag-${i}`);
    const result = sanitizeFanData({
      username: "test",
      tags: manyTags,
    });
    expect(result.tags.length).toBe(20);
  });

  it("handles missing fields with defaults", () => {
    const result = sanitizeFanData({});
    expect(result.username).toBe("unknown");
    expect(result.displayName).toBe("Unknown");
    expect(result.segment).toBe("regular");
    expect(result.ltv).toBe(0);
  });
});
