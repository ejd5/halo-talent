// ─── Fansly adapter — Halo Companion ───────────
// Full implementation with Fansly-specific DOM selectors.
// Fansly uses a React-based SPA with hash-style obfuscation.

import type {
  PlatformAdapter,
  FanContext,
  ConversationContext,
  MessageContext,
  MediaContext,
  OverlayAnchors,
  PageType,
  ExtractedStats,
} from "@/src/types/platform";
import { debugLog, debugWarn, qs, qsa, qsFirst, text, extractNumber } from "./base-adapter";
import { logEvent } from "@/src/lib/audit-logger";

const PLATFORM = "fansly" as const;

const SEL = {
  fanProfileName: '[class*="displayName"], [class*="DisplayName"], [class*="creator-name"], [class*="username"], h1',
  fanProfileAvatar: '[class*="avatar"] img, [class*="Avatar"] img, [class*="profile-pic"]',
  fanProfileBadge: '[class*="badge"], [class*="Badge"], [class*="vip"], [class*="verified"]',
  fanProfileSpent: '[class*="spent"], [class*="total"], [class*="amount"], [class*="stat-value"]',
  fanProfileNotes: '[contenteditable], textarea, [class*="notes"]',

  fanListContainer: '[class*="subscribers"], [class*="Subscribers"], [class*="followers"], [class*="Followers"]',
  fanRow: '[class*="user-row"], [class*="UserRow"], [class*="subscriber"], a[href*="/creator/"], [class*="fan-item"]',
  fanRowName: '[class*="username"], [class*="displayName"], [class*="name"], span',
  fanRowAvatar: "img",
  fanRowSpent: '[class*="spent"], [class*="amount"], [class*="total"], [class*="stat"]',

  chatContainer: '[class*="conversation"], [class*="Conversation"], [class*="messages"], [class*="Messages"]',
  chatBubble: '[class*="message"], [class*="Message"], [class*="bubble"], [class*="Bubble"]',
  chatBubbleText: '[class*="text"], [class*="body"], [class*="content"], p, span',
  chatBubbleSender: '[class*="sender"], [class*="name"], [class*="username"]',
  chatBubbleTime: '[class*="time"], [class*="timestamp"], time, [class*="date"]',
  chatInput: 'textarea, div[contenteditable="true"], [contenteditable], [class*="chat-input"]',
  chatSendBtn: 'button[type="submit"], button[aria-label*="send" i], [class*="send"], button:has(svg)',
  chatHeaderName: '[class*="header"] [class*="name"], [class*="Header"] span, [class*="title"]',

  tipIndicator: '[class*="tip"], [class*="Tip"], [class*="gift"]',
  tipAmount: '[class*="amount"], [class*="price"], [class*="value"]',

  statsContainer: '[class*="analytics"], [class*="Analytics"], [class*="dashboard"], [class*="Dashboard"], [class*="stats"]',
  statsRevenue: '[class*="revenue"], [class*="earnings"], [class*="income"], [class*="Revenue"]',
  statsFans: '[class*="fans"], [class*="subscribers"], [class*="followers"], [class*="total"]',
  statsActive: '[class*="active"], [class*="online"], [class*="Active"]',
  statsNew24h: '[class*="new"], [class*="today"], [class*="24h"]',

  topSpenderRow: '[class*="top-spender"], [class*="TopSpender"], [class*="top-fan"], [class*="leaderboard"] > *',
  topSpenderName: '[class*="name"], [class*="username"], span',
  topSpenderAmount: '[class*="amount"], [class*="spent"]',

  floatingBtnAnchor: '[class*="header"], [class*="Header"], [class*="top-bar"], nav',
  fanBadgeAnchor: '[class*="profile"], [class*="Profile"], [class*="creator-info"]',
  aiPanelAnchor: '[class*="chat"], [class*="messages"], [class*="conversation"]',
} as const;

export const fanslyAdapter: PlatformAdapter = {
  platformName: PLATFORM,
  displayName: "Fansly",
  supportedPages: ["fans_list", "fan_profile", "chat", "dashboard"],

  capabilities: {
    extractFans: true,
    extractMessages: true,
    injectChatAssistant: true,
    extractStats: true,
    detectVIPFans: false,
  },

  isOnPlatform(): boolean {
    const host = window.location.hostname.toLowerCase();
    return host === "fansly.com" || host.endsWith(".fansly.com");
  },

  detectPageType(): PageType {
    const path = window.location.pathname.toLowerCase();
    if (path.includes("/messages") || path.includes("/dms")) return "chat";
    if (path.includes("/subscribers") || path.includes("/followers")) return "fans_list";
    if (path.includes("/dashboard") || path.includes("/analytics") || path.includes("/stats")) return "dashboard";
    if (path.includes("/creator/") || path.includes("/@")) return "fan_profile";
    return "unknown";
  },

  getCurrentFanContext(): FanContext | null {
    try {
      if (this.detectPageType() !== "fan_profile") return null;

      const username = text(SEL.fanProfileName) ?? extractFanslyUsername();
      if (!username) return null;

      const avatarUrl = qs<HTMLImageElement>(SEL.fanProfileAvatar)?.src ?? undefined;
      const isVIP = qs(SEL.fanProfileBadge) !== null;
      const totalSpent = extractNumber(SEL.fanProfileSpent);
      const platformNotes = text(SEL.fanProfileNotes) ?? undefined;
      const platformId = username.toLowerCase().replace(/\s+/g, "_");

      logEvent({
        action: "fan_profile_viewed",
        platform: PLATFORM,
        details: { platformId, username },
        success: true,
      });

      return {
        platformId,
        username,
        displayName: username,
        avatarUrl,
        platform: PLATFORM,
        isVIP,
        subscriptionPrice: 0,
        subscriptionMonths: 0,
        totalSpent,
        lastActivity: new Date().toISOString(),
        tags: [],
        isOnline: false,
        platformNotes,
        pageUrl: window.location.href,
      };
    } catch (err) {
      debugWarn("Fansly", "getCurrentFanContext failed", err);
      return null;
    }
  },

  extractFanList(): FanContext[] {
    const fans: FanContext[] = [];
    try {
      const rows = qsa<HTMLElement>(SEL.fanRow);
      for (const row of rows) {
        try {
          const nameEl = row.querySelector(SEL.fanRowName);
          const username = nameEl?.textContent?.trim() ?? "unknown";
          if (!username || username.length < 2) continue;

          const avatarEl = row.querySelector(SEL.fanRowAvatar);
          const totalSpent = extractNumber(SEL.fanRowSpent, row);
          const platformId = username.toLowerCase().replace(/\s+/g, "_");

          fans.push({
            platformId,
            username,
            displayName: username,
            avatarUrl: (avatarEl as HTMLImageElement)?.src ?? undefined,
            platform: PLATFORM,
            isVIP: false,
            subscriptionPrice: 0,
            subscriptionMonths: 0,
            totalSpent,
            lastActivity: new Date().toISOString(),
            tags: [],
            isOnline: false,
            pageUrl: `https://fansly.com/creator/${platformId}`,
          });
        } catch {
          // skip row
        }
      }
      debugLog("Fansly", `extractFanList: ${fans.length}`);
    } catch (err) {
      debugWarn("Fansly", "extractFanList failed", err);
    }
    return fans;
  },

  getCurrentConversation(): ConversationContext | null {
    try {
      if (this.detectPageType() !== "chat") return null;
      const headerName = text(SEL.chatHeaderName) ?? "Unknown";
      const messages = qsa(SEL.chatBubble);
      const lastBubble = messages[messages.length - 1];
      const hasTips = qs(SEL.tipIndicator) !== null;

      return {
        conversationId: extractFanslyConvId(),
        fanUsername: headerName.toLowerCase().replace(/\s+/g, "_"),
        fanDisplayName: headerName,
        pageUrl: window.location.href,
        messageCount: messages.length,
        hasTips,
        totalTipAmount: hasTips ? sumTips() : 0,
        lastMessagePreview: lastBubble?.textContent?.trim().slice(0, 120) ?? "",
        lastMessageAt: new Date().toISOString(),
      };
    } catch (err) {
      debugWarn("Fansly", "getCurrentConversation failed", err);
      return null;
    }
  },

  getLastMessages(count: number): MessageContext[] {
    const messages: MessageContext[] = [];
    try {
      const bubbles = qsa(SEL.chatBubble).slice(-count);
      for (const bubble of bubbles) {
        try {
          const textEl = bubble.querySelector(SEL.chatBubbleText);
          const content = textEl?.textContent?.trim() ?? "";
          if (!content) continue;

          const timeEl = bubble.querySelector(SEL.chatBubbleTime);
          const isOutbound =
            bubble.classList.contains("sent") ||
            bubble.classList.contains("outgoing") ||
            bubble.matches('[class*="sent"], [class*="outgoing"], [class*="mine"]');

          const isTip = bubble.querySelector(SEL.tipIndicator) !== null;
          const tipAmount = isTip ? extractNumber(SEL.tipAmount, bubble) || undefined : undefined;

          messages.push({
            messageId: `fansly-msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            content,
            timestamp: timeEl?.getAttribute("datetime") ?? timeEl?.textContent?.trim() ?? new Date().toISOString(),
            direction: isOutbound ? "outbound" : "inbound",
            isTip,
            tipAmount,
            attachments: extractFanslyMedia(bubble),
          });
        } catch {
          // skip
        }
      }
      debugLog("Fansly", `getLastMessages: ${messages.length}/${count}`);
    } catch (err) {
      debugWarn("Fansly", "getLastMessages failed", err);
    }
    return messages;
  },

  extractStats(): ExtractedStats | null {
    try {
      const container = qs(SEL.statsContainer);
      if (!container) return null;

      const totalFans = extractNumber(SEL.statsFans, container);
      const activeFans = extractNumber(SEL.statsActive, container);
      const newFans24h = extractNumber(SEL.statsNew24h, container);
      const revenue24h = extractNumber(SEL.statsRevenue, container);

      const topSpenders: { username: string; amount: number }[] = [];
      qsa(SEL.topSpenderRow, container).slice(0, 10).forEach((row) => {
        const name = row.querySelector(SEL.topSpenderName)?.textContent?.trim() ?? "Unknown";
        const amount = extractNumber(SEL.topSpenderAmount, row);
        if (amount > 0) topSpenders.push({ username: name, amount });
      });

      logEvent({ action: "stats_extracted", platform: PLATFORM, details: { totalFans, revenue24h }, success: true });

      return {
        platform: PLATFORM,
        totalFans,
        activeFans,
        newFans24h,
        revenue24h,
        revenue30d: 0,
        topSpenders,
        extractedAt: Date.now(),
      };
    } catch (err) {
      debugWarn("Fansly", "extractStats failed", err);
      return null;
    }
  },

  insertTextInInput(text: string): boolean {
    try {
      const input = qsFirst<HTMLElement>([SEL.chatInput, 'div[contenteditable="true"]', "textarea"]);
      if (!input) {
        debugWarn("Fansly", "Chat input not found");
        return false;
      }
      if (input instanceof HTMLTextAreaElement || input instanceof HTMLInputElement) {
        input.value = text;
      } else {
        input.textContent = text;
      }
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      input.focus();

      logEvent({ action: "script_inserted", platform: PLATFORM, details: { textLength: text.length }, success: true });
      return true;
    } catch (err) {
      debugWarn("Fansly", "insertTextInInput failed", err);
      return false;
    }
  },

  clickSendButton(): boolean {
    try {
      const btn = qsFirst<HTMLButtonElement>([SEL.chatSendBtn, 'button[type="submit"]', '[aria-label*="send" i]']);
      if (!btn) return false;
      btn.click();
      return true;
    } catch {
      return false;
    }
  },

  getOverlayAnchors(): OverlayAnchors {
    return {
      floatingButtonAnchor: SEL.floatingBtnAnchor,
      fanBadgeAnchor: SEL.fanBadgeAnchor,
      aiAssistantAnchor: SEL.aiPanelAnchor,
    };
  },

  getFanPageUrl(fanId: string): string {
    return `https://fansly.com/creator/${fanId}`;
  },

  getConversationUrl(conversationId: string): string {
    return `https://fansly.com/messages/${conversationId}`;
  },
};

// ─── Helpers ───────────────────────────────────────────────

function extractFanslyUsername(): string | null {
  const path = window.location.pathname;
  const match = path.match(/\/creator\/([^/]+)/) ?? path.match(/\/@([^/]+)/);
  return match ? match[1] : null;
}

function extractFanslyConvId(): string {
  const path = window.location.pathname;
  const match = path.match(/\/messages\/([^/]+)/) ?? path.match(/\/dms\/([^/]+)/);
  return match ? match[1] : `fansly-conv-${Date.now()}`;
}

function sumTips(): number {
  let total = 0;
  qsa(SEL.tipAmount).forEach((el) => {
    total += parseFloat(el.textContent?.replace(/[^0-9.]/g, "") ?? "0") || 0;
  });
  return total;
}

function extractFanslyMedia(bubble: Element): MediaContext[] {
  const media: MediaContext[] = [];
  try {
    bubble.querySelectorAll("img:not([class*='avatar']):not([class*='Avatar'])").forEach((img) => {
      const src = (img as HTMLImageElement).src;
      if (!src || src.includes("avatar")) return;
      media.push({
        type: "image",
        thumbnailUrl: src,
        isLocked: bubble.querySelector('[class*="locked"], [class*="paywall"]') !== null,
      });
    });
  } catch {
    // best effort
  }
  return media;
}
