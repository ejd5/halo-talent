// ─── Instagram adapter — Halo Companion ───────────
// Limited adapter: Instagram's DOM is heavily obfuscated (React Fiber).
// Extracts fan followers/following list only. No DM extraction.

import type {
  PlatformAdapter,
  FanContext,
  ConversationContext,
  MessageContext,
  OverlayAnchors,
  PageType,
  ExtractedStats,
} from "@/src/types/platform";
import { debugLog, debugWarn, qs, qsa } from "./base-adapter";

const PLATFORM = "instagram" as const;

const SEL = {
  fanListDialog: '[role="dialog"]',
  fanRow: '[role="dialog"] a[href*="/"], [role="dialog"] [class*="user"]',
  fanRowName: "span",
  fanRowAvatar: "img, canvas",
} as const;

export const instagramAdapter: PlatformAdapter = {
  platformName: PLATFORM,
  displayName: "Instagram",
  supportedPages: ["fans_list"],

  capabilities: {
    extractFans: true,
    extractMessages: false,
    injectChatAssistant: false,
    extractStats: false,
    detectVIPFans: false,
  },

  isOnPlatform(): boolean {
    const host = window.location.hostname.toLowerCase();
    return host === "instagram.com" || host.endsWith(".instagram.com");
  },

  detectPageType(): PageType {
    const path = window.location.pathname.toLowerCase();
    if (path.includes("/direct/")) return "chat";
    if (path.includes("/followers") || path.includes("/following")) return "fans_list";
    if (path.includes("/insights") || path.includes("/professional")) return "dashboard";
    return "unknown";
  },

  getCurrentFanContext(): FanContext | null {
    // Instagram profile pages are not reliably scrapable for fan data
    // since the DOM is obfuscated and requires authentication context
    return null;
  },

  extractFanList(): FanContext[] {
    const fans: FanContext[] = [];
    try {
      const dialog = qs(SEL.fanListDialog);
      if (!dialog) {
        debugLog("IG", "No follower dialog found — user may not have opened the followers list");
        return fans;
      }

      const rows = qsa(SEL.fanRow, dialog);
      for (const row of rows) {
        try {
          const span = row.querySelector(SEL.fanRowName);
          const username = span?.textContent?.trim() ?? "";
          if (!username || username.length < 2) continue;

          const avatarEl = row.querySelector(SEL.fanRowAvatar);
          let avatarUrl: string | undefined;
          if (avatarEl instanceof HTMLImageElement) {
            avatarUrl = avatarEl.src;
          } else if (avatarEl instanceof HTMLCanvasElement) {
            // Canvas-based avatars can't be extracted reliably
            avatarUrl = undefined;
          }

          fans.push({
            platformId: username,
            username,
            displayName: username,
            avatarUrl,
            platform: PLATFORM,
            isVIP: false,
            subscriptionPrice: 0,
            subscriptionMonths: 0,
            totalSpent: 0,
            lastActivity: new Date().toISOString(),
            tags: [],
            isOnline: false,
            pageUrl: `https://instagram.com/${username}`,
          });
        } catch {
          // skip row
        }
      }

      debugLog("IG", `extractFanList: ${fans.length}`);
    } catch (err) {
      debugWarn("IG", "extractFanList failed", err);
    }
    return fans;
  },

  getCurrentConversation(): ConversationContext | null {
    // Instagram DM extraction is not supported — DOM is too obfuscated
    return null;
  },

  getLastMessages(_count: number): MessageContext[] {
    return [];
  },

  extractStats(): ExtractedStats | null {
    return null;
  },

  insertTextInInput(_text: string): boolean {
    debugWarn("IG", "insertTextInInput not supported on Instagram");
    return false;
  },

  clickSendButton(): boolean {
    debugWarn("IG", "clickSendButton not supported on Instagram");
    return false;
  },

  getOverlayAnchors(): OverlayAnchors {
    return {
      floatingButtonAnchor: "nav, [role='navigation']",
      fanBadgeAnchor: "header",
      aiAssistantAnchor: "body",
    };
  },

  getFanPageUrl(fanId: string): string {
    return `https://instagram.com/${fanId}`;
  },

  getConversationUrl(_conversationId: string): string {
    return "https://instagram.com/direct/inbox/";
  },
};
