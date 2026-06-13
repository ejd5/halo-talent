// ─── Platform types — Halo Companion ───────────
// Full type definitions for platform adapters, extraction contexts,
// and the PlatformAdapter interface.

export type PlatformType = "onlyfans" | "fansly" | "mym" | "instagram" | "tiktok";

export type PlatformDomain =
  | "onlyfans.com"
  | "fansly.com"
  | "mym.fans"
  | "instagram.com"
  | "tiktok.com";

export const PLATFORM_LABELS: Record<PlatformType, string> = {
  onlyfans: "OnlyFans",
  fansly: "Fansly",
  mym: "MYM",
  instagram: "Instagram",
  tiktok: "TikTok",
};

export const PLATFORM_DOMAINS: Record<PlatformDomain, PlatformType> = {
  "onlyfans.com": "onlyfans",
  "fansly.com": "fansly",
  "mym.fans": "mym",
  "instagram.com": "instagram",
  "tiktok.com": "tiktok",
};

// ─── Page Type ─────────────────────────────────────────────

export type PageType =
  | "fans_list"
  | "fan_profile"
  | "chat"
  | "dashboard"
  | "unknown";

// ─── Extraction Contexts ───────────────────────────────────

/** Full context about the fan currently being viewed */
export interface FanContext {
  platformId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  platform: PlatformType;
  isVIP: boolean;
  subscriptionPrice: number;
  subscriptionMonths: number;
  totalSpent: number;
  lastActivity: string;
  tags: string[];
  /** Whether the fan is currently online/active */
  isOnline: boolean;
  /** Notes visible in the platform UI (e.g. creator notes on OF) */
  platformNotes?: string;
  /** URL of the current fan page */
  pageUrl: string;
}

/** Context about the current conversation */
export interface ConversationContext {
  /** Platform-specific conversation ID */
  conversationId: string;
  /** Fan username in this conversation */
  fanUsername: string;
  /** Fan display name */
  fanDisplayName: string;
  /** URL of the conversation page */
  pageUrl: string;
  /** Total message count visible */
  messageCount: number;
  /** Whether the fan has tipped in this conversation */
  hasTips: boolean;
  /** Total tip amount visible in this conversation */
  totalTipAmount: number;
  /** Last message preview */
  lastMessagePreview: string;
  /** Last message timestamp */
  lastMessageAt: string;
}

/** A single extracted message */
export interface MessageContext {
  messageId: string;
  content: string;
  timestamp: string;
  direction: "inbound" | "outbound";
  isTip: boolean;
  tipAmount?: number;
  attachments: MediaContext[];
}

/** Media attachment extracted from a message */
export interface MediaContext {
  type: "image" | "video" | "audio";
  /** Thumbnail URL only — never the full media */
  thumbnailUrl?: string;
  /** Whether the media is locked/Pay-Per-View */
  isLocked: boolean;
  /** Price if PPV */
  price?: number;
}

// ─── Overlay Anchors ───────────────────────────────────────

/** DOM anchor points for injecting Halo Companion UI elements */
export interface OverlayAnchors {
  /** Where to inject the floating "Open in Halo" button */
  floatingButtonAnchor: string;
  /** Where to inject the fan profile badge */
  fanBadgeAnchor: string;
  /** Where to inject the AI chat assistant panel */
  aiAssistantAnchor: string;
}

// ─── Syncable Data ─────────────────────────────────────────

/** Data that can be synced from the platform to Halo Talent */
export interface SyncableData {
  fans: FanContext[];
  conversations: ConversationContext[];
  messages: MessageContext[];
  stats: ExtractedStats | null;
  syncedAt: number;
  platform: PlatformType;
}

// ─── Platform Adapter Interface ────────────────────────────

export interface PlatformAdapter {
  /** Machine-readable platform identifier */
  readonly platformName: PlatformType;

  /** Human-readable platform label */
  readonly displayName: string;

  /** Page types this adapter can handle */
  readonly supportedPages: PageType[];

  /** Whether we're currently on this platform */
  isOnPlatform(): boolean;

  /** Detect the current page type */
  detectPageType(): PageType;

  // ── Fan Extraction ──────────────────────────────────────

  /** Get fan context from the current page (fan profile view) */
  getCurrentFanContext(): FanContext | null;

  /** Extract fan list from the current page (subscribers view) */
  extractFanList(): FanContext[];

  // ── Conversation Extraction ─────────────────────────────

  /** Get the current conversation context (chat/DM view) */
  getCurrentConversation(): ConversationContext | null;

  /** Get the last N messages from the current conversation */
  getLastMessages(count: number): MessageContext[];

  // ── Stats Extraction ────────────────────────────────────

  /** Extract dashboard stats from the current page */
  extractStats(): ExtractedStats | null;

  // ── UI Injection ────────────────────────────────────────

  /** Insert text into the chat input */
  insertTextInInput(text: string): boolean;

  /** Click the send button */
  clickSendButton(): boolean;

  /** Get DOM anchors for UI injection */
  getOverlayAnchors(): OverlayAnchors;

  // ── Navigation ──────────────────────────────────────────

  /** Build URL for a fan profile page */
  getFanPageUrl(fanId: string): string;

  /** Build URL for a conversation page */
  getConversationUrl(conversationId: string): string;

  // ── Capabilities ────────────────────────────────────────

  /** What this adapter can do */
  readonly capabilities: PlatformCapabilities;
}

// ─── DOM Selectors ─────────────────────────────────────────

export interface PlatformSelectors {
  fanListContainer: string;
  fanRow: string;
  fanUsername: string;
  fanDisplayName: string;
  fanAvatar: string;
  fanSpentAmount: string;
  fanSubscriptionBadge: string;
  chatContainer: string;
  chatMessage: string;
  chatMessageText: string;
  chatMessageSender: string;
  chatInput: string;
  chatSendButton: string;
  statsDashboard: string;
  statsRevenue: string;
  statsFans: string;
  /** Fallback selectors when primary ones don't match */
  fallbacks: Record<string, string[]>;
}

// ─── Capabilities ──────────────────────────────────────────

export interface PlatformCapabilities {
  extractFans: boolean;
  extractMessages: boolean;
  injectChatAssistant: boolean;
  extractStats: boolean;
  detectVIPFans: boolean;
}

// ─── Legacy extraction types (kept for compatibility) ──────

export interface ExtractedFan {
  platformId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  platform: PlatformType;
  isVIP?: boolean;
  subscriptionPrice?: number;
  subscriptionMonths?: number;
  totalSpent?: number;
  lastActivity?: string;
  tags?: string[];
}

export interface ExtractedMessage {
  platformId: string;
  fanUsername: string;
  content: string;
  timestamp: string;
  direction: "inbound" | "outbound";
  isTip?: boolean;
  tipAmount?: number;
  attachments?: ExtractedAttachment[];
}

export interface ExtractedAttachment {
  type: "image" | "video" | "audio";
  url: string;
  thumbnailUrl?: string;
}

export interface ExtractedStats {
  platform: PlatformType;
  totalFans: number;
  activeFans: number;
  newFans24h: number;
  revenue24h: number;
  revenue30d: number;
  topSpenders: { username: string; amount: number }[];
  extractedAt: number;
}
