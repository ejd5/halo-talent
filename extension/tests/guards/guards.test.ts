// ─── Guard tests — Halo Companion ───────────

import { describe, it, expect } from "vitest";
import { checkPrivacy } from "../../src/lib/privacy-guard";
import { checkCompliance } from "../../src/lib/compliance-guard";

describe("PrivacyGuard", () => {
  it("should redact email fields", () => {
    const result = checkPrivacy(
      { email: "user@onlyfans.com", name: "John" },
      "fan_profile"
    );
    expect(result.blockedFields).toContain("email");
    expect(result.sanitized?.email).toBe("[REDACTED]");
  });

  it("should pass clean data", () => {
    const result = checkPrivacy(
      { username: "creator123", platform: "onlyfans" },
      "fan_profile"
    );
    expect(result.blockedFields).toHaveLength(0);
    expect(result.allowed).toBe(true);
  });

  it("should redact phone numbers", () => {
    const result = checkPrivacy(
      { phone: "+33 6 12 34 56 78", name: "Jane" },
      "fan_profile"
    );
    expect(result.blockedFields.length).toBeGreaterThan(0);
  });
});

describe("ComplianceGuard", () => {
  it("should block auto-send without human validation", () => {
    const results = checkCompliance({
      platform: "onlyfans",
      action: "send_message",
      metadata: { autoSend: true },
    });
    const blocker = results.find((r) => !r.passed && r.severity === "block");
    expect(blocker).toBeDefined();
  });

  it("should pass human-validated send", () => {
    const results = checkCompliance({
      platform: "onlyfans",
      action: "send_message",
      metadata: { autoSend: false },
    });
    const hasBlocker = results.some(
      (r) => !r.passed && r.severity === "block"
    );
    expect(hasBlocker).toBe(false);
  });

  it("should block credential storage", () => {
    const results = checkCompliance({
      platform: "onlyfans",
      action: "setting_changed",
      metadata: { storingCredentials: true },
    });
    const blocker = results.find((r) => !r.passed && r.severity === "block");
    expect(blocker).toBeDefined();
  });
});
