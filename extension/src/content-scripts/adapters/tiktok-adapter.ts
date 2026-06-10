// ─── TikTok adapter — Halo Companion ───────────
// Limited adapter: TikTok's web interface is restricted.
// Extracts followers list when visible. No DM or stats.

import type {
  PlatformAdapter,
  FanContext,
  ConversationContext,
  MessageContext,
  OverlayAnchors,
  PageType,
  ExtractedStats,
} from "@/src/types/platform";
import { debugLog, debugWarn, qsa } from "./base-adapter";

const PLATFORM = "tiktok" as const;

const SEL = {
  fanRow: 'div[class*="user"], a[href*="/@"], [class*="follower-item"], [class*="FollowerItem"]',
  fanRowName: '[class*="username"], [class*="nickname"], [class*="name"], span, p',
  fanRowAvatar: "img",
} as const;

export const tiktokAdapter: PlatformAdapter = {
  platformName: PLATFORM,
  displayName: "TikTok",
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
    return host === "tiktok.com" || host.endsWith(".tiktok.com");
  },

  detectPageType(): PageType {
    const path = window.location.pathname.toLowerCase();
    if (path.includes("/messages") || path.includes("/dm")) return "chat";
    if (path.includes("/followers") || path.includes("/following")) return "fans_list";
    if (path.includes("/analytics") || path.includes("/creator-portal")) return "dashboard";
    return "unknown";
  },

  getCurrentFanContext(): FanContext | null {
    // TikTok profile pages on web have limited visible data
    return null;
  },

  extractFanList(): FanContext[] {
    const fans: FanContext[] = [];
    try {
      const rows = qsa<HTMLElement>(SEL.fanRow);
      for (const row of rows) {
        try {
          const nameEl = row.querySelector(SEL.fanRowName);
          const username = nameEl?.textContent?.trim() ?? "";
          if (!username || username.length < 2 || username.length > 50) continue;

          const avatarEl = row.querySelector(SEL.fanRowAvatar);
          const avatarUrl = (avatarEl as HTMLImageElement)?.src ?? undefined;

          fans.push({
            platformId: username.replace(/^@/, ""),
            username: username.replace(/^@/, ""),
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
            pageUrl: `https://tiktok.com/@${username.replace(/^@/, "")}`,
          });
        } catch {
          // skip row
        }
      }

      debugLog("TikTok", `extractFanList: ${fans.length}`);
    } catch (err) {
      debugWarn("TikTok", "extractFanList failed", err);
    }
    return fans;
  },

  getCurrentConversation(): ConversationContext | null {
    return null;
  },

  getLastMessages(_count: number): MessageContext[] {
    return [];
  },

  extractStats(): ExtractedStats | null {
    return null;
  },

  insertTextInInput(_text: string): boolean {
    debugWarn("TikTok", "insertTextInInput not supported on TikTok web");
    return false;
  },

  clickSendButton(): boolean {
    debugWarn("TikTok", "clickSendButton not supported on TikTok web");
    return false;
  },

  getOverlayAnchors(): OverlayAnchors {
    return {
      floatingButtonAnchor: "header, nav, [class*='header']",
      fanBadgeAnchor: '[class*="profile"]',
      aiAssistantAnchor: "body",
    };
  },

  getFanPageUrl(fanId: string): string {
    return `https://tiktok.com/@${fanId}`;
  },

  getConversationUrl(_conversationId: string): string {
    return "https://tiktok.com/messages";
  },
};
