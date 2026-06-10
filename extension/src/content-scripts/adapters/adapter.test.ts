// ─── Platform Adapter Tests — Halo Companion ───────────

import { describe, it, expect, beforeEach } from "vitest";
import { createMockPlatformDOM, resetAllMocks } from "../../test-setup";
import { onlyfansAdapter } from "./onlyfans-adapter";
import { fanslyAdapter } from "./fansly-adapter";
import { mymAdapter } from "./mym-adapter";
import { instagramAdapter } from "./instagram-adapter";
import { tiktokAdapter } from "./tiktok-adapter";

beforeEach(() => {
  resetAllMocks();
});

function setURL(url: string): void {
  Object.defineProperty(window, "location", {
    value: { href: url, hostname: new URL(url).hostname, pathname: new URL(url).pathname },
    writable: true,
  });
}

// ─── OnlyFans Adapter ────────────────────────────────────

describe("onlyfans-adapter", () => {
  beforeEach(() => {
    setURL("https://onlyfans.com/my/dms/sarah_vip");
    createMockPlatformDOM("onlyfans");
  });

  it("detects it is on OnlyFans", () => {
    expect(onlyfansAdapter.isOnPlatform()).toBe(true);
  });

  it("detects chat page type from URL", () => {
    expect(onlyfansAdapter.detectPageType()).toBe("chat");
  });

  it("returns platform capabilities", () => {
    const caps = onlyfansAdapter.capabilities;
    expect(caps.extractFans).toBe(true);
    expect(caps.extractMessages).toBe(true);
    expect(caps.injectChatAssistant).toBe(true);
    expect(caps.extractStats).toBe(true);
  });

  it("returns overlay anchors", () => {
    const anchors = onlyfansAdapter.getOverlayAnchors();
    expect(anchors).toHaveProperty("floatingButtonAnchor");
    expect(anchors).toHaveProperty("fanBadgeAnchor");
    expect(anchors).toHaveProperty("aiAssistantAnchor");
    expect(typeof anchors.floatingButtonAnchor).toBe("string");
    expect(anchors.floatingButtonAnchor.length).toBeGreaterThan(0);
  });

  it("builds correct fan page URL", () => {
    expect(onlyfansAdapter.getFanPageUrl("sarah_vip")).toBe("https://onlyfans.com/u/sarah_vip");
  });

  it("builds correct conversation URL", () => {
    expect(onlyfansAdapter.getConversationUrl("conv_123")).toBe("https://onlyfans.com/my/dms/conv_123");
  });

  it("returns supported page types", () => {
    expect(onlyfansAdapter.supportedPages).toContain("fans_list");
    expect(onlyfansAdapter.supportedPages).toContain("chat");
    expect(onlyfansAdapter.supportedPages).toContain("dashboard");
  });
});

// ─── Fansly Adapter ──────────────────────────────────────

describe("fansly-adapter", () => {
  beforeEach(() => {
    setURL("https://fansly.com/creator/sarah_vip");
    createMockPlatformDOM("fansly");
  });

  it("detects it is on Fansly", () => {
    expect(fanslyAdapter.isOnPlatform()).toBe(true);
  });

  it("has all required interface methods", () => {
    expect(typeof fanslyAdapter.getCurrentFanContext).toBe("function");
    expect(typeof fanslyAdapter.extractFanList).toBe("function");
    expect(typeof fanslyAdapter.getCurrentConversation).toBe("function");
    expect(typeof fanslyAdapter.getLastMessages).toBe("function");
    expect(typeof fanslyAdapter.extractStats).toBe("function");
    expect(typeof fanslyAdapter.insertTextInInput).toBe("function");
    expect(typeof fanslyAdapter.clickSendButton).toBe("function");
    expect(typeof fanslyAdapter.getOverlayAnchors).toBe("function");
    expect(typeof fanslyAdapter.getFanPageUrl).toBe("function");
    expect(typeof fanslyAdapter.getConversationUrl).toBe("function");
  });
});

// ─── MYM Adapter ─────────────────────────────────────────

describe("mym-adapter", () => {
  beforeEach(() => {
    setURL("https://mym.fans/user/sarah_vip");
    createMockPlatformDOM("mym");
  });

  it("detects it is on MYM", () => {
    expect(mymAdapter.isOnPlatform()).toBe(true);
  });

  it("has all required interface methods", () => {
    expect(typeof mymAdapter.getCurrentFanContext).toBe("function");
    expect(typeof mymAdapter.extractFanList).toBe("function");
    expect(typeof mymAdapter.getCurrentConversation).toBe("function");
    expect(typeof mymAdapter.getLastMessages).toBe("function");
    expect(typeof mymAdapter.extractStats).toBe("function");
    expect(typeof mymAdapter.insertTextInInput).toBe("function");
    expect(typeof mymAdapter.clickSendButton).toBe("function");
    expect(typeof mymAdapter.getOverlayAnchors).toBe("function");
  });
});

// ─── Instagram Adapter ───────────────────────────────────

describe("instagram-adapter", () => {
  beforeEach(() => {
    setURL("https://www.instagram.com/");
  });

  it("detects it is on Instagram", () => {
    expect(instagramAdapter.isOnPlatform()).toBe(true);
  });

  it("has limited capabilities (no DM extraction)", () => {
    const caps = instagramAdapter.capabilities;
    expect(caps.extractFans).toBe(true);
    expect(caps.extractMessages).toBe(false);
    expect(caps.injectChatAssistant).toBe(false);
  });

  it("has all required interface methods", () => {
    expect(typeof instagramAdapter.getOverlayAnchors).toBe("function");
    expect(typeof instagramAdapter.getFanPageUrl).toBe("function");
    expect(typeof instagramAdapter.getConversationUrl).toBe("function");
  });
});

// ─── TikTok Adapter ──────────────────────────────────────

describe("tiktok-adapter", () => {
  beforeEach(() => {
    setURL("https://www.tiktok.com/@creator");
  });

  it("detects it is on TikTok", () => {
    expect(tiktokAdapter.isOnPlatform()).toBe(true);
  });

  it("has limited capabilities (fans only)", () => {
    const caps = tiktokAdapter.capabilities;
    expect(caps.extractMessages).toBe(false);
    expect(caps.injectChatAssistant).toBe(false);
  });

  it("has all required interface methods", () => {
    expect(typeof tiktokAdapter.getOverlayAnchors).toBe("function");
    expect(typeof tiktokAdapter.getFanPageUrl).toBe("function");
    expect(typeof tiktokAdapter.getConversationUrl).toBe("function");
  });
});

// ─── Adapter Consistency ─────────────────────────────────

describe("adapter consistency", () => {
  it("all adapters implement PlatformAdapter interface", () => {
    const adapters = [onlyfansAdapter, fanslyAdapter, mymAdapter, instagramAdapter, tiktokAdapter];
    for (const adapter of adapters) {
      expect(typeof adapter.platformName).toBe("string");
      expect(typeof adapter.displayName).toBe("string");
      expect(Array.isArray(adapter.supportedPages)).toBe(true);
      expect(typeof adapter.isOnPlatform).toBe("function");
      expect(typeof adapter.detectPageType).toBe("function");
      expect(typeof adapter.getCurrentFanContext).toBe("function");
      expect(typeof adapter.extractFanList).toBe("function");
      expect(typeof adapter.getCurrentConversation).toBe("function");
      expect(typeof adapter.getLastMessages).toBe("function");
      expect(typeof adapter.extractStats).toBe("function");
      expect(typeof adapter.insertTextInInput).toBe("function");
      expect(typeof adapter.clickSendButton).toBe("function");
      expect(typeof adapter.getOverlayAnchors).toBe("function");
      expect(typeof adapter.getFanPageUrl).toBe("function");
      expect(typeof adapter.getConversationUrl).toBe("function");
      expect(typeof adapter.capabilities).toBe("object");
    }
  });
});
