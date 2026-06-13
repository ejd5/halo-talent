// ─── Fan Brain types — Halo Companion ───────────

import type { PlatformType } from "./platform";

/** Fan profile enriched by Halo Fan Brain AI */
export interface FanProfile {
  id: string;
  platformId: string;
  platform: PlatformType;
  username: string;
  displayName: string;
  avatarUrl?: string;

  // Subscription
  isSubscribed: boolean;
  subscriptionMonths: number;
  subscriptionPrice: number;
  isVIP: boolean;

  // Financials
  totalSpent: number;
  avgMonthlySpend: number;
  lastTipDate?: string;
  lastTipAmount?: number;
  isWhale: boolean;

  // Engagement
  messagesReceived: number;
  messagesSent: number;
  lastMessageDate?: string;
  avgResponseTimeHours: number;
  isHighEngagement: boolean;

  // AI enrichment
  persona: FanPersona;
  interests: string[];
  sentiment: "positive" | "neutral" | "negative";
  churnRisk: number; // 0-100
  upsellPotential: number; // 0-100
  nextBestAction?: string;
  aiNotes?: string;

  // Local
  localTags: string[];
  localNotes: string;
  lastViewedAt?: number;
}

export type FanPersona =
  | "whale"
  | "regular"
  | "new_fan"
  | "dormant"
  | "vip"
  | "tipper"
  | "chatter"
  | "lurker"
  | "custom";

export const FAN_PERSONA_LABELS: Record<FanPersona, string> = {
  whale: "🐋 Whale",
  regular: "⭐ Régulier",
  new_fan: "🆕 Nouveau",
  dormant: "💤 Dormant",
  vip: "👑 VIP",
  tipper: "💸 Tipper",
  chatter: "💬 Chatter",
  lurker: "👀 Lurker",
  custom: "🏷️ Custom",
};

/** Fan Brain memory embedding (synced to backend) */
export interface FanMemory {
  id: string;
  fanId: string;
  content: string;
  category: "note" | "preference" | "interaction" | "reminder";
  embedding?: number[];
  createdAt: number;
  updatedAt: number;
}
