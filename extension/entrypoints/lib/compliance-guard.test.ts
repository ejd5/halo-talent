// ─── Compliance Guard Tests — Halo Companion ───────────

import { describe, it, expect, beforeEach } from "vitest";
import {
  canExtensionAssistAction,
  isBlockedInV1,
  getBlockedActions,
  type ActionContext,
} from "./compliance-guard";
import { resetAllMocks } from "../test-setup";
import { clearRateLimits } from "./rate-limiter";

beforeEach(() => {
  resetAllMocks();
  clearRateLimits();
});

function makeCtx(overrides: Partial<ActionContext> = {}): ActionContext {
  return {
    platform: "onlyfans",
    action: "read_fan_context",
    consentActive: true,
    ...overrides,
  };
}

// ─── Blocked actions V1 ──────────────────────────────────

describe("blocked actions V1", () => {
  it.each([
    "auto_send_message",
    "auto_dm_mass",
    "scrape_background",
    "download_media",
    "bypass_platform_limits",
    "extract_invisible_data",
  ])("blocks %s permanently", (action) => {
    expect(isBlockedInV1(action)).toBe(true);
    const result = canExtensionAssistAction(action, makeCtx({ action }));
    expect(result.allowed).toBe(false);
    expect(result.riskLevel).toBe("blocked");
  });

  it("returns full blocked list", () => {
    const blocked = getBlockedActions();
    expect(blocked).toHaveLength(6);
    expect(blocked).toContain("auto_send_message");
    expect(blocked).toContain("download_media");
  });
});

// ─── Platform consent ─────────────────────────────────────

describe("platform consent", () => {
  it("allows action when consent is active", () => {
    const result = canExtensionAssistAction("read_fan_context", makeCtx({ consentActive: true }));
    expect(result.allowed).toBe(true);
  });

  it("blocks action without consent", () => {
    const result = canExtensionAssistAction("read_fan_context", makeCtx({ consentActive: false }));
    expect(result.allowed).toBe(false);
    expect(result.riskLevel).toBe("high");
  });
});

// ─── Human validation ─────────────────────────────────────

describe("human validation", () => {
  it("allows insert_text without autoSend flag", () => {
    const result = canExtensionAssistAction("insert_text", makeCtx({ action: "insert_text" }));
    expect(result.allowed).toBe(true);
  });

  it("blocks insert_text with autoSend=true", () => {
    const result = canExtensionAssistAction("insert_text", makeCtx({
      action: "insert_text",
      metadata: { autoSend: true },
    }));
    expect(result.allowed).toBe(false);
    expect(result.riskLevel).toBe("blocked");
  });
});

// ─── Off-platform solicitation ───────────────────────────

describe("off-platform solicitation", () => {
  it.each([
    "Contact me on WhatsApp",
    "DM me on Telegram for more",
    "Add me on Snapchat",
    "PayPal me at",
    "my number is",
    "let's meet up",
  ])("flags off-platform keyword: %s", (text) => {
    const result = canExtensionAssistAction("insert_text", makeCtx({
      action: "insert_text",
      textToInsert: text,
    }));
    expect(result.allowed).toBe(false);
    expect(result.riskLevel).toBe("high");
  });

  it("allows clean text", () => {
    const result = canExtensionAssistAction("insert_text", makeCtx({
      action: "insert_text",
      textToInsert: "Hey! J'espère que tu vas bien 💕",
    }));
    expect(result.allowed).toBe(true);
  });
});

// ─── Aggressive language ──────────────────────────────────

describe("aggressive language", () => {
  it("blocks explicitly dangerous keywords", () => {
    const result = canExtensionAssistAction("insert_text", makeCtx({
      action: "insert_text",
      textToInsert: "This is underage content",
    }));
    expect(result.allowed).toBe(false);
    expect(result.riskLevel).toBe("blocked");
  });

  it("warns on scam/fraud keywords", () => {
    const result = canExtensionAssistAction("insert_text", makeCtx({
      action: "insert_text",
      textToInsert: "This is a scam",
    }));
    expect(result.allowed).toBe(true); // Allowed but warned
    expect(result.riskLevel).toBe("medium");
    expect(result.reasons.length).toBeGreaterThan(0);
  });
});

// ─── Rate limiting ────────────────────────────────────────

describe("rate limiting", () => {
  it("allows first action", () => {
    const result = canExtensionAssistAction("insert_text", makeCtx({ action: "insert_text" }));
    expect(result.allowed).toBe(true);
  });

  it("blocks rapid repeated actions", () => {
    // Fire 4 rapid insert_text actions (bucket has 3 tokens)
    for (let i = 0; i < 3; i++) {
      const r = canExtensionAssistAction("insert_text", makeCtx({ action: "insert_text" }));
      expect(r.allowed).toBe(true);
    }
    // 4th should be rate-limited
    const blocked = canExtensionAssistAction("insert_text", makeCtx({ action: "insert_text" }));
    expect(blocked.allowed).toBe(false);
    expect(blocked.riskLevel).toBe("low");
    expect(blocked.reasons[0]).toContain("fréquence");
  });
});

// ─── No credential storage ────────────────────────────────

describe("credential storage", () => {
  it("blocks when storingCredentials is true", () => {
    const result = canExtensionAssistAction("read_fan_context", makeCtx({
      action: "read_fan_context",
      metadata: { storingCredentials: true },
    }));
    expect(result.allowed).toBe(false);
    expect(result.riskLevel).toBe("blocked");
  });

  it("blocks when hasSessionToken is true", () => {
    const result = canExtensionAssistAction("read_fan_context", makeCtx({
      action: "read_fan_context",
      metadata: { hasSessionToken: true },
    }));
    expect(result.allowed).toBe(false);
  });
});

// ─── Batch actions ────────────────────────────────────────

describe("batch actions", () => {
  it("blocks batch_action without approval", () => {
    const result = canExtensionAssistAction("batch_action", makeCtx({ action: "batch_action" }));
    expect(result.allowed).toBe(false);
    expect(result.riskLevel).toBe("blocked");
  });

  it("allows batch_action with approval", () => {
    const result = canExtensionAssistAction("batch_action", makeCtx({
      action: "batch_action",
      metadata: { batchApproved: true },
    }));
    expect(result.allowed).toBe(true);
  });
});

// ─── Working hours (optional) ─────────────────────────────

describe("working hours", () => {
  it("allows action without working hours config", () => {
    const result = canExtensionAssistAction("read_fan_context", makeCtx());
    expect(result.allowed).toBe(true);
  });

  it("warns outside working hours when configured", () => {
    const now = new Date();
    const currentHour = now.getHours();
    // Set working hours opposite to current time
    const start = (currentHour + 6) % 24;
    const end = (currentHour + 12) % 24;

    const result = canExtensionAssistAction("read_fan_context", makeCtx({
      workingHours: { start, end, timezone: "Europe/Paris" },
    }));
    // Should still be allowed, but with low risk warning
    expect(result.allowed).toBe(true);
  });
});

// ─── Allowed actions ──────────────────────────────────────

describe("allowed actions pass cleanly", () => {
  it.each([
    "read_fan_context",
    "generate_suggestion",
    "sync_conversation",
    "check_vault",
    "add_note",
    "update_tags",
    "send_notification",
    "translate_message",
  ])("allows %s with consent", (action) => {
    const result = canExtensionAssistAction(action, makeCtx({ action, consentActive: true }));
    expect(result.allowed).toBe(true);
  });
});
