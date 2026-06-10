// ─── Audit Logger Tests — Halo Companion ───────────

import { describe, it, expect, beforeEach } from "vitest";
import {
  logEvent,
  setUserId,
  queryAuditLog,
  getAuditEvents,
  auditEventCount,
  clearAuditLog,
  exportAuditLogJSON,
  closeAuditDB,
} from "./audit-logger";
import { resetAllMocks } from "../test-setup";

beforeEach(async () => {
  closeAuditDB();
  resetAllMocks();
  await clearAuditLog();
  setUserId("test-user-123");
});

// ─── logEvent ─────────────────────────────────────────────

describe("logEvent", () => {
  it("logs an audit event successfully", async () => {
    await logEvent({
      action: "fan_profile_viewed",
      platform: "onlyfans",
      targetId: "fan_456",
      targetType: "fan",
      details: { targetId: "sarah_vip", targetType: "fan", ltv: 890 },
      success: true,
    });

    const events = await getAuditEvents(10);
    expect(events.length).toBeGreaterThanOrEqual(1);
    const event = events[0];
    expect(event.action).toBe("fan_profile_viewed");
    expect(event.platform).toBe("onlyfans");
    expect(event.fanUsername).toBe("fan_456");
    expect(event.userId).toBe("test-user-123");
    expect(event.source).toBe("extension");
    expect(event.syncedToBackend).toBe(false);
  });

  it("logs failure events with risk level", async () => {
    await logEvent({
      action: "compliance_check_blocked",
      platform: "onlyfans",
      details: { ruleId: "no_off_platform", reason: "WhatsApp mention detected" },
      success: false,
      error: "Off-platform solicitation blocked",
    });

    const events = await getAuditEvents(10);
    expect(events.length).toBeGreaterThanOrEqual(1);
    expect(events[0].action).toBe("compliance_check_blocked");
    expect(events[0].riskLevel).toBe("medium");
    expect(events[0].error).toContain("Off-platform");
  });

  it("generates unique IDs for each event", async () => {
    await logEvent({ action: "panel_opened", platform: "extension", success: true });
    await logEvent({ action: "panel_closed", platform: "extension", success: true });

    const events = await getAuditEvents(10);
    expect(events.length).toBeGreaterThanOrEqual(2);
    const ids = events.map((e) => e.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

// ─── queryAuditLog ────────────────────────────────────────

describe("queryAuditLog", () => {
  beforeEach(async () => {
    await logEvent({ action: "fan_profile_viewed", platform: "onlyfans", targetId: "user_a", targetType: "fan", success: true, details: {} });
    await logEvent({ action: "script_inserted", platform: "onlyfans", targetId: "user_b", targetType: "fan", success: true, details: {} });
    await logEvent({ action: "panel_opened", platform: "extension", success: true, details: {} });
  });

  it("filters by action", async () => {
    const results = await queryAuditLog({ action: "script_inserted" });
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.every((e) => e.action === "script_inserted")).toBe(true);
  });

  it("filters by platform", async () => {
    const results = await queryAuditLog({ platform: "extension" });
    expect(results.every((e) => e.platform === "extension")).toBe(true);
  });

  it("filters by fanUsername (substring match)", async () => {
    const results = await queryAuditLog({ fanUsername: "user_a" });
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it("respects limit and offset", async () => {
    const results = await queryAuditLog({ limit: 1 });
    expect(results.length).toBeLessThanOrEqual(1);
  });

  it("returns empty array for no matches", async () => {
    const results = await queryAuditLog({ action: "nonexistent_action" });
    expect(results).toHaveLength(0);
  });
});

// ─── auditEventCount ─────────────────────────────────────

describe("auditEventCount", () => {
  it("counts logged events", async () => {
    const before = await auditEventCount();
    await logEvent({ action: "fan_profile_viewed", platform: "onlyfans", success: true, details: {} });
    await logEvent({ action: "script_inserted", platform: "onlyfans", success: true, details: {} });
    const after = await auditEventCount();
    expect(after).toBeGreaterThanOrEqual(before + 2);
  });
});

// ─── exportAuditLogJSON ───────────────────────────────────

describe("exportAuditLogJSON", () => {
  it("exports valid JSON with metadata", async () => {
    await logEvent({ action: "theme_changed", platform: "extension", details: { from: "dark", to: "light" }, success: true });

    const json = await exportAuditLogJSON();
    const parsed = JSON.parse(json);

    expect(parsed).toHaveProperty("exportedAt");
    expect(parsed).toHaveProperty("userId", "test-user-123");
    expect(parsed).toHaveProperty("totalEvents");
    expect(parsed).toHaveProperty("events");
    expect(Array.isArray(parsed.events)).toBe(true);
    expect(parsed.totalEvents).toBeGreaterThanOrEqual(1);
  });

  it("includes all event fields in export", async () => {
    await logEvent({
      action: "ai_draft_inserted",
      platform: "onlyfans",
      targetId: "sarah_vip", targetType: "fan",
      details: { draftId: "draft_1", fanName: "Sarah" },
      success: true,
      durationMs: 150,
    });

    const json = await exportAuditLogJSON();
    const parsed = JSON.parse(json);
    const event = parsed.events[0];

    expect(event.action).toBe("ai_draft_inserted");
    expect(event.platform).toBe("onlyfans");
    expect(event.fanUsername).toBe("sarah_vip");
    expect(event.source).toBe("extension");
    expect(event.durationMs).toBe(150);
  });
});

// ─── clearAuditLog ────────────────────────────────────────

describe("clearAuditLog", () => {
  it("removes all events", async () => {
    await logEvent({ action: "panel_opened", platform: "extension", success: true, details: {} });
    await clearAuditLog();
    const after = await auditEventCount();
    expect(after).toBe(0);
  });
});

// ─── setUserId ────────────────────────────────────────────

describe("setUserId", () => {
  it("updates userId on subsequent events", async () => {
    setUserId("new-user");
    await logEvent({ action: "panel_opened", platform: "extension", success: true, details: {} });
    const events = await getAuditEvents(1);
    expect(events[0].userId).toBe("new-user");
  });
});
