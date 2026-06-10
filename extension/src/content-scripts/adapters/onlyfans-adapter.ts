// ─── OnlyFans adapter — Halo Companion ───────────
// Full implementation: DOM reading, FanContext extraction,
// ConversationContext, MessageContext, stats, UI injection.
// No fetch() to hidden APIs — only visible DOM.

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
import { debugLog, debugWarn, qs, qsa, qsFirst, qsaFirst, text, extractNumber } from "./base-adapter";
import { logEvent } from "@/src/lib/audit-logger";

// ─── Constants ─────────────────────────────────────────────

const PLATFORM = "onlyfans" as const;
const DISPLAY_NAME = "OnlyFans";

// ─── Primary Selectors (2026 DOM structure) ────────────────

const SEL = {
  // Fan profile page
  fanProfileName: '[class*="username"], [class*="name"], [data-profile-username], h1',
  fanProfileAvatar: 'img[class*="avatar"], [class*="profile"] img, [class*="Avatar"] img',
  fanProfileBadge: '[class*="badge"], [class*="Badge"], [class*="vip"]',
  fanProfileSpent: '[class*="spent"], [class*="total"], [class*="amount"]',
  fanProfileNotes: '[class*="notes"], [contenteditable][class*="note"]',

  // Fan list (subscribers page)
  fanListContainer: '[class*="subscribers"], [class*="Subscribers"], [class*="fans-list"]',
  fanRow: 'a[href*="/u/"], [class*="user-row"], [class*="UserRow"], [class*="subscriber-row"]',
  fanRowName: '[class*="username"], [class*="name"], [class*="displayName"], span',
  fanRowAvatar: "img",
  fanRowSpent: '[class*="spent"], [class*="amount"], [class*="total"]',
  fanRowSubBadge: '[class*="subscription"], [class*="tier"], [class*="plan"]',

  // Chat / DMs
  chatContainer: '[class*="messages"], [class*="Messages"], [class*="chat"], [class*="conversation"]',
  chatBubble: '[class*="bubble"], [class*="Bubble"], [class*="message-item"], [class*="MessageItem"]',
  chatBubbleText: '[class*="text"], [class*="body"], [class*="content"], p',
  chatBubbleSender: '[class*="sender"], [class*="name"], [class*="username"]',
  chatBubbleTime: '[class*="time"], [class*="timestamp"], time',
  chatInput: 'div[contenteditable="true"], textarea[placeholder*="message" i], [class*="chat-input"] textarea, [class*="ChatInput"] div[contenteditable]',
  chatSendBtn: 'button[type="submit"], button[aria-label*="send" i], [class*="send-btn"], [class*="SendButton"], button:has(svg[class*="send"])',
  chatHeaderName: '[class*="chat-header"] [class*="name"], [class*="conversation-header"] [class*="name"], [class*="ChatHeader"] span',

  // Tip detection in chat
  tipIndicator: '[class*="tip"], [class*="Tip"], [class*="gift"], [class*="Gift"]',
  tipAmount: '[class*="amount"], [class*="price"], [class*="tip-amount"]',

  // Dashboard / Statistics
  statsContainer: '[class*="statistics"], [class*="Statistics"], [class*="analytics"], [class*="Analytics"], [class*="dashboard"]',
  statsRevenue: '[class*="revenue"], [class*="earnings"], [class*="income"], [class*="Revenue"]',
  statsFans: '[class*="subscribers"], [class*="fans"], [class*="Fans"], [class*="subscriber-count"]',
  statsActive: '[class*="active"], [class*="online"], [class*="Active"]',
  statsNew24h: '[class*="new"], [class*="today"], [class*="24h"]',

  // Top spenders on dashboard
  topSpenderRow: '[class*="top-fan"], [class*="TopFan"], [class*="top-spender"], [class*="leaderboard"] > *',
  topSpenderName: '[class*="name"], [class*="username"], span',
  topSpenderAmount: '[class*="amount"], [class*="spent"], [class*="total"]',

  // Overlay anchors
  floatingBtnAnchor: '[class*="header"], [class*="Header"], [class*="top-bar"], [class*="nav"]',
  fanBadgeAnchor: '[class*="profile-header"], [class*="ProfileHeader"], [class*="user-info"], h1',
  aiPanelAnchor: '[class*="chat"], [class*="messages"], [class*="conversation"]',
} as const;

// ─── Fallback Selector Sets ────────────────────────────────

const FALLBACKS: Record<string, string[]> = {
  fanProfileName: ["h1", "h2", '[class*="name"]', '[class*="title"]'],
  chatInput: ['div[contenteditable="true"]', "textarea", '[role="textbox"]', '[contenteditable]'],
  chatSendBtn: ['button[type="submit"]', '[aria-label*="send"]', "button:has(svg)"],
  statsRevenue: ['[class*="revenue"]', '[class*="earnings"]', '[class*="income"]', '[class*="stat"]'],
  fanRow: ['a[href*="/u/"]', '[class*="user"]', '[class*="subscriber"]', "tr"],
};

// ─── Adapter Implementation ────────────────────────────────

export const onlyfansAdapter: PlatformAdapter = {
  platformName: PLATFORM,
  displayName: DISPLAY_NAME,
  supportedPages: ["fans_list", "fan_profile", "chat", "dashboard"],

  capabilities: {
    extractFans: true,
    extractMessages: true,
    injectChatAssistant: true,
    extractStats: true,
    detectVIPFans: true,
  },

  // ── Platform Detection ──────────────────────────────────

  isOnPlatform(): boolean {
    const host = window.location.hostname.toLowerCase();
    return host === "onlyfans.com" || host.endsWith(".onlyfans.com");
  },

  detectPageType(): PageType {
    const path = window.location.pathname.toLowerCase();
    if (path.includes("/my/dms/") || path.includes("/chats/") || path.includes("/messages/")) return "chat";
    if (path.includes("/my/subscribers") || path.includes("/my/fans") || path.includes("/my/lists")) return "fans_list";
    if (path.includes("/my/statistics") || path.includes("/my/dashboard") || path === "/my/home") return "dashboard";
    if (path.startsWith("/u") || path.startsWith("/@")) return "fan_profile";
    return "unknown";
  },

  // ── Fan Context Extraction ──────────────────────────────

  getCurrentFanContext(): FanContext | null {
    try {
      const pageType = this.detectPageType();
      if (pageType !== "fan_profile") return null;

      const username = text(SEL.fanProfileName) ?? extractUsernameFromUrl();
      if (!username || username === "@") return null;

      const displayName = text(SEL.fanProfileName) ?? username;
      const avatarUrl = qs<HTMLImageElement>(SEL.fanProfileAvatar)?.src ?? undefined;
      const isVIP = qs(SEL.fanProfileBadge) !== null;
      const platformNotes = text(SEL.fanProfileNotes) ?? undefined;
      const totalSpent = extractNumber(SEL.fanProfileSpent);

      const platformId = extractPlatformIdFromUrl() ?? username.toLowerCase();

      debugLog("OF", "FanContext extracted", { username, platformId, isVIP, totalSpent });

      // Audit the extraction
      logEvent({
        action: "fan_profile_viewed",
        platform: PLATFORM,
        details: { platformId, username },
        success: true,
      });

      return {
        platformId,
        username,
        displayName: displayName || username,
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
      debugWarn("OF", "getCurrentFanContext failed", err);
      return null;
    }
  },

  extractFanList(): FanContext[] {
    const fans: FanContext[] = [];
    try {
      const container = qs(SEL.fanListContainer);
      const rows = qsaFirst<HTMLElement>(FALLBACKS.fanRow, container ?? undefined);

      for (const row of rows) {
        try {
          const href = row instanceof HTMLAnchorElement ? row.getAttribute("href") ?? "" : "";
          const platformId = href.split("/").pop() ?? "";
          if (!platformId || platformId === "my") continue;

          const usernameEl = row.querySelector(SEL.fanRowName);
          const username = usernameEl?.textContent?.trim() ?? platformId;
          const displayName = username;
          const avatarEl = row.querySelector(SEL.fanRowAvatar);
          const avatarUrl = (avatarEl as HTMLImageElement)?.src ?? undefined;
          const totalSpent = extractNumber(SEL.fanRowSpent, row);
          const subBadge = row.querySelector(SEL.fanRowSubBadge);
          const subText = subBadge?.textContent?.trim() ?? "";

          fans.push({
            platformId,
            username,
            displayName,
            avatarUrl,
            platform: PLATFORM,
            isVIP: false,
            subscriptionPrice: extractPrice(subText),
            subscriptionMonths: extractMonths(subText),
            totalSpent,
            lastActivity: new Date().toISOString(),
            tags: [],
            isOnline: false,
            pageUrl: `https://onlyfans.com/u/${platformId}`,
          });
        } catch {
          // Skip individual row failures
        }
      }

      debugLog("OF", `extractFanList: ${fans.length} fans`);
    } catch (err) {
      debugWarn("OF", "extractFanList failed", err);
    }
    return fans;
  },

  // ── Conversation Context ────────────────────────────────

  getCurrentConversation(): ConversationContext | null {
    try {
      if (this.detectPageType() !== "chat") return null;

      const headerName = text(SEL.chatHeaderName) ?? "Unknown";
      const conversationId = extractConversationId();
      const messages = qsa(SEL.chatBubble);
      const lastBubble = messages[messages.length - 1];
      const lastPreview = lastBubble?.textContent?.trim().slice(0, 120) ?? "";
      const hasTips = qs(SEL.tipIndicator) !== null;
      let totalTipAmount = 0;
      if (hasTips) {
        const tipEls = qsa(SEL.tipAmount);
        totalTipAmount = tipEls.reduce((sum, el) => sum + parseFloat(el.textContent?.replace(/[^0-9.]/g, "") ?? "0"), 0);
      }

      debugLog("OF", "ConversationContext extracted", { conversationId, fanUsername: headerName, messageCount: messages.length });

      return {
        conversationId,
        fanUsername: headerName.toLowerCase().replace(/\s+/g, "_"),
        fanDisplayName: headerName,
        pageUrl: window.location.href,
        messageCount: messages.length,
        hasTips,
        totalTipAmount,
        lastMessagePreview: lastPreview,
        lastMessageAt: new Date().toISOString(),
      };
    } catch (err) {
      debugWarn("OF", "getCurrentConversation failed", err);
      return null;
    }
  },

  getLastMessages(count: number): MessageContext[] {
    const messages: MessageContext[] = [];
    try {
      const bubbles = qsa(SEL.chatBubble);
      const recent = bubbles.slice(-count);

      for (const bubble of recent) {
        try {
          const textEl = bubble.querySelector(SEL.chatBubbleText);
          const content = textEl?.textContent?.trim() ?? "";
          if (!content) continue;

          const timeEl = bubble.querySelector(SEL.chatBubbleTime);

          const isOutbound =
            bubble.classList.contains("outgoing") ||
            bubble.classList.contains("sent") ||
            bubble.getAttribute("data-direction") === "out" ||
            bubble.matches('[class*="outgoing"], [class*="sent"], [class*="mine"]');

          const tipEl = bubble.querySelector(SEL.tipIndicator);
          const isTip = tipEl !== null;
          let tipAmount: number | undefined;
          if (isTip) {
            const amtEl = bubble.querySelector(SEL.tipAmount);
            tipAmount = parseFloat(amtEl?.textContent?.replace(/[^0-9.]/g, "") ?? "0") || undefined;
          }

          const attachments = extractMediaFromBubble(bubble);

          messages.push({
            messageId: bubble.getAttribute("data-message-id") ?? `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            content,
            timestamp: timeEl?.getAttribute("datetime") ?? timeEl?.textContent?.trim() ?? new Date().toISOString(),
            direction: isOutbound ? "outbound" : "inbound",
            isTip,
            tipAmount,
            attachments,
          });
        } catch {
          // Skip individual bubble failures
        }
      }

      debugLog("OF", `getLastMessages: ${messages.length} of ${count} requested`);
    } catch (err) {
      debugWarn("OF", "getLastMessages failed", err);
    }
    return messages;
  },

  // ── Stats Extraction ────────────────────────────────────

  extractStats(): ExtractedStats | null {
    try {
      const container = qs(SEL.statsContainer);
      if (!container) return null;

      const totalFans = extractNumber(SEL.statsFans, container);
      const activeFans = extractNumber(SEL.statsActive, container);
      const newFans24h = extractNumber(SEL.statsNew24h, container);
      const revenue24h = extractNumber(SEL.statsRevenue, container);

      // Top spenders
      const topSpenders: { username: string; amount: number }[] = [];
      const spenderRows = qsa(SEL.topSpenderRow, container);
      for (const row of spenderRows.slice(0, 10)) {
        const name = row.querySelector(SEL.topSpenderName)?.textContent?.trim() ?? "Unknown";
        const amount = extractNumber(SEL.topSpenderAmount, row);
        if (amount > 0) {
          topSpenders.push({ username: name, amount });
        }
      }

      debugLog("OF", "Stats extracted", { totalFans, activeFans, newFans24h, revenue24h });

      logEvent({
        action: "stats_extracted",
        platform: PLATFORM,
        details: { totalFans, revenue24h },
        success: true,
      });

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
      debugWarn("OF", "extractStats failed", err);
      return null;
    }
  },

  // ── UI Injection ────────────────────────────────────────

  insertTextInInput(text: string): boolean {
    try {
      const input = qsFirst<HTMLElement>(FALLBACKS.chatInput);
      if (!input) {
        debugWarn("OF", "Chat input not found");
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

      debugLog("OF", "Text inserted into chat input", { length: text.length });

      logEvent({
        action: "script_inserted",
        platform: PLATFORM,
        details: { textLength: text.length },
        success: true,
      });

      return true;
    } catch (err) {
      debugWarn("OF", "insertTextInInput failed", err);
      return false;
    }
  },

  clickSendButton(): boolean {
    try {
      const btn = qsFirst<HTMLButtonElement>(FALLBACKS.chatSendBtn);
      if (!btn) {
        debugWarn("OF", "Send button not found");
        return false;
      }

      btn.click();
      debugLog("OF", "Send button clicked");
      return true;
    } catch (err) {
      debugWarn("OF", "clickSendButton failed", err);
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

  // ── Navigation ──────────────────────────────────────────

  getFanPageUrl(fanId: string): string {
    return `https://onlyfans.com/u/${fanId}`;
  },

  getConversationUrl(conversationId: string): string {
    return `https://onlyfans.com/my/dms/${conversationId}`;
  },
};

// ─── Helpers ───────────────────────────────────────────────

function extractUsernameFromUrl(): string | null {
  const path = window.location.pathname;
  const match = path.match(/\/u\/([^/]+)/) ?? path.match(/\/@([^/]+)/);
  return match ? match[1] : null;
}

function extractPlatformIdFromUrl(): string | null {
  return extractUsernameFromUrl();
}

function extractConversationId(): string {
  const path = window.location.pathname;
  const match = path.match(/\/dms\/([^/]+)/) ?? path.match(/\/chats\/([^/]+)/) ?? path.match(/\/messages\/([^/]+)/);
  return match ? match[1] : `conv-${Date.now()}`;
}

function extractPrice(text: string): number {
  if (!text) return 0;
  const match = text.match(/\$?\s?([\d.]+)\s?\/?\s?(mo|month|mth|day|yr|year)?/i);
  return match ? parseFloat(match[1]) || 0 : 0;
}

function extractMonths(text: string): number {
  if (!text) return 0;
  const match = text.match(/(\d+)\s?(months?|mo|mths?)/i);
  return match ? parseInt(match[1], 10) || 0 : 0;
}

function extractMediaFromBubble(bubble: Element): MediaContext[] {
  const media: MediaContext[] = [];
  try {
    const imgs = bubble.querySelectorAll("img:not([class*='avatar']):not([class*='Avatar'])");
    for (const img of imgs) {
      const src = (img as HTMLImageElement).src;
      if (!src || src.includes("avatar")) continue;
      media.push({
        type: "image",
        thumbnailUrl: src,
        isLocked: bubble.querySelector('[class*="locked"], [class*="paywall"], [class*="ppv"]') !== null,
        price: undefined,
      });
    }
  } catch {
    // Media extraction is best-effort
  }
  return media;
}
