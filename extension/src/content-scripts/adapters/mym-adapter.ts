// ─── MYM adapter — Halo Companion ───────────
// Full implementation with MYM-specific DOM selectors.
// MYM (mym.fans) uses a Vue-based SPA with French-focused UI.

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

const PLATFORM = "mym" as const;

const SEL = {
  fanProfileName: '[class*="username"], [class*="name"], [class*="displayName"], [class*="pseudo"], h1, h2',
  fanProfileAvatar: '[class*="avatar"] img, [class*="Avatar"] img, [class*="profile"] img',
  fanProfileBadge: '[class*="badge"], [class*="Badge"], [class*="certified"], [class*="verified"], [class*="vip"]',
  fanProfileSpent: '[class*="spent"], [class*="total"], [class*="amount"], [class*="depense"]',
  fanProfileNotes: '[contenteditable], textarea, [class*="notes"]',

  fanListContainer: '[class*="subscribers"], [class*="Subscribers"], [class*="fans"], [class*="abonnes"]',
  fanRow: '[class*="user-row"], [class*="UserRow"], [class*="fan-item"], a[href*="/user/"], [class*="subscriber-item"]',
  fanRowName: '[class*="username"], [class*="name"], [class*="pseudo"], span',
  fanRowAvatar: "img",
  fanRowSpent: '[class*="spent"], [class*="amount"], [class*="total"], [class*="depense"]',
  fanRowSubBadge: '[class*="subscription"], [class*="abonnement"], [class*="tier"], [class*="plan"]',

  chatContainer: '[class*="conversation"], [class*="Conversation"], [class*="messages"], [class*="Messages"]',
  chatBubble: '[class*="message"], [class*="Message"], [class*="bubble"], [class*="Bubble"]',
  chatBubbleText: '[class*="text"], [class*="body"], [class*="content"], p, span',
  chatBubbleSender: '[class*="sender"], [class*="name"], [class*="username"]',
  chatBubbleTime: '[class*="time"], [class*="timestamp"], time, [class*="date"]',
  chatInput: 'textarea, div[contenteditable="true"], [contenteditable], [class*="input-message"], [class*="chat-input"]',
  chatSendBtn: 'button[type="submit"], button[aria-label*="envoyer" i], button[aria-label*="send" i], [class*="send"], button:has(svg)',
  chatHeaderName: '[class*="header"] [class*="name"], [class*="Header"] span, [class*="title"], [class*="contact-name"]',

  tipIndicator: '[class*="tip"], [class*="Tip"], [class*="gift"], [class*="cadeau"]',
  tipAmount: '[class*="amount"], [class*="price"], [class*="value"], [class*="montant"]',

  statsContainer: '[class*="dashboard"], [class*="Dashboard"], [class*="stats"], [class*="Stats"], [class*="analytics"]',
  statsRevenue: '[class*="revenue"], [class*="earnings"], [class*="income"], [class*="revenu"], [class*="chiffre"]',
  statsFans: '[class*="fans"], [class*="subscribers"], [class*="abonnes"], [class*="total"]',
  statsActive: '[class*="active"], [class*="online"], [class*="actif"]',
  statsNew24h: '[class*="new"], [class*="today"], [class*="aujourd"], [class*="24h"]',

  topSpenderRow: '[class*="top-fan"], [class*="TopFan"], [class*="top-spender"], [class*="meilleur"], [class*="leaderboard"] > *',
  topSpenderName: '[class*="name"], [class*="username"], [class*="pseudo"], span',
  topSpenderAmount: '[class*="amount"], [class*="spent"], [class*="depense"]',

  floatingBtnAnchor: '[class*="header"], [class*="Header"], [class*="top-bar"], nav, [class*="navbar"]',
  fanBadgeAnchor: '[class*="profile"], [class*="Profile"], [class*="user-info"], [class*="creator-info"]',
  aiPanelAnchor: '[class*="chat"], [class*="messages"], [class*="conversation"]',
} as const;

export const mymAdapter: PlatformAdapter = {
  platformName: PLATFORM,
  displayName: "MYM",
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
    return host === "mym.fans" || host.endsWith(".mym.fans");
  },

  detectPageType(): PageType {
    const path = window.location.pathname.toLowerCase();
    if (path.includes("/messages") || path.includes("/chat") || path.includes("/discussions")) return "chat";
    if (path.includes("/subscribers") || path.includes("/fans") || path.includes("/abonnes") || path.includes("/subs")) return "fans_list";
    if (path.includes("/dashboard") || path.includes("/stats") || path.includes("/analytics") || path.includes("/tableau")) return "dashboard";
    if (path.includes("/user/") || path.includes("/@")) return "fan_profile";
    return "unknown";
  },

  getCurrentFanContext(): FanContext | null {
    try {
      if (this.detectPageType() !== "fan_profile") return null;

      const username = text(SEL.fanProfileName) ?? extractMymUsername();
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
      debugWarn("MYM", "getCurrentFanContext failed", err);
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
          const subBadge = row.querySelector(SEL.fanRowSubBadge);
          const subText = subBadge?.textContent?.trim() ?? "";
          const platformId = username.toLowerCase().replace(/\s+/g, "_");

          fans.push({
            platformId,
            username,
            displayName: username,
            avatarUrl: (avatarEl as HTMLImageElement)?.src ?? undefined,
            platform: PLATFORM,
            isVIP: false,
            subscriptionPrice: extractMymPrice(subText),
            subscriptionMonths: 0,
            totalSpent,
            lastActivity: new Date().toISOString(),
            tags: [],
            isOnline: false,
            pageUrl: `https://mym.fans/user/${platformId}`,
          });
        } catch {
          // skip row
        }
      }
      debugLog("MYM", `extractFanList: ${fans.length}`);
    } catch (err) {
      debugWarn("MYM", "extractFanList failed", err);
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
        conversationId: extractMymConvId(),
        fanUsername: headerName.toLowerCase().replace(/\s+/g, "_"),
        fanDisplayName: headerName,
        pageUrl: window.location.href,
        messageCount: messages.length,
        hasTips,
        totalTipAmount: hasTips ? sumMymTips() : 0,
        lastMessagePreview: lastBubble?.textContent?.trim().slice(0, 120) ?? "",
        lastMessageAt: new Date().toISOString(),
      };
    } catch (err) {
      debugWarn("MYM", "getCurrentConversation failed", err);
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
            bubble.matches('[class*="sent"], [class*="outgoing"], [class*="envoye"], [class*="mine"]');

          const isTip = bubble.querySelector(SEL.tipIndicator) !== null;
          const tipAmount = isTip ? extractNumber(SEL.tipAmount, bubble) || undefined : undefined;

          messages.push({
            messageId: `mym-msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            content,
            timestamp: timeEl?.getAttribute("datetime") ?? timeEl?.textContent?.trim() ?? new Date().toISOString(),
            direction: isOutbound ? "outbound" : "inbound",
            isTip,
            tipAmount,
            attachments: extractMymMedia(bubble),
          });
        } catch {
          // skip
        }
      }
      debugLog("MYM", `getLastMessages: ${messages.length}/${count}`);
    } catch (err) {
      debugWarn("MYM", "getLastMessages failed", err);
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
      debugWarn("MYM", "extractStats failed", err);
      return null;
    }
  },

  insertTextInInput(text: string): boolean {
    try {
      const input = qsFirst<HTMLElement>([SEL.chatInput, 'div[contenteditable="true"]', "textarea"]);
      if (!input) {
        debugWarn("MYM", "Chat input not found");
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
      debugWarn("MYM", "insertTextInInput failed", err);
      return false;
    }
  },

  clickSendButton(): boolean {
    try {
      const btn = qsFirst<HTMLButtonElement>([SEL.chatSendBtn, 'button[type="submit"]', '[aria-label*="envoyer" i]', '[aria-label*="send" i]']);
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
    return `https://mym.fans/user/${fanId}`;
  },

  getConversationUrl(conversationId: string): string {
    return `https://mym.fans/messages/${conversationId}`;
  },
};

// ─── Helpers ───────────────────────────────────────────────

function extractMymUsername(): string | null {
  const path = window.location.pathname;
  const match = path.match(/\/user\/([^/]+)/) ?? path.match(/\/@([^/]+)/);
  return match ? match[1] : null;
}

function extractMymConvId(): string {
  const path = window.location.pathname;
  const match = path.match(/\/messages\/([^/]+)/) ?? path.match(/\/chat\/([^/]+)/) ?? path.match(/\/discussions\/([^/]+)/);
  return match ? match[1] : `mym-conv-${Date.now()}`;
}

function extractMymPrice(text: string): number {
  if (!text) return 0;
  const match = text.match(/[$€]?\s?([\d,.]+)\s?\/?\s?(mois|month|mo|jour|day|an|year)?/i);
  return match ? parseFloat(match[1].replace(",", ".")) || 0 : 0;
}

function sumMymTips(): number {
  let total = 0;
  qsa(SEL.tipAmount).forEach((el) => {
    total += parseFloat(el.textContent?.replace(/[^0-9.,]/g, "").replace(",", ".") ?? "0") || 0;
  });
  return total;
}

function extractMymMedia(bubble: Element): MediaContext[] {
  const media: MediaContext[] = [];
  try {
    bubble.querySelectorAll("img:not([class*='avatar']):not([class*='Avatar'])").forEach((img) => {
      const src = (img as HTMLImageElement).src;
      if (!src || src.includes("avatar")) return;
      media.push({
        type: "image",
        thumbnailUrl: src,
        isLocked: bubble.querySelector('[class*="locked"], [class*="verrou"], [class*="payant"]') !== null,
      });
    });
  } catch {
    // best effort
  }
  return media;
}
