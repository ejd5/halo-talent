// ─── Message types — Halo Companion ───────────

import type { PlatformType } from "./platform";

/** Internal message envelope for extension ↔ background ↔ side panel */
export interface HaloMessage<T = unknown> {
  type: MessageType;
  payload: T;
  source: MessageSource;
  timestamp: number;
  requestId?: string;
}

export type MessageType =
  | "GET_FAN_PROFILE"
  | "GET_FAN_PROFILE_RESPONSE"
  | "GET_FANS_LIST"
  | "GET_FANS_LIST_RESPONSE"
  | "EXTRACT_STATS"
  | "EXTRACT_STATS_RESPONSE"
  | "INJECT_OVERLAY"
  | "REMOVE_OVERLAY"
  | "INSERT_SCRIPT"
  | "SEND_MESSAGE"
  | "GET_AUTH_TOKEN"
  | "AUTH_TOKEN_RESPONSE"
  | "AUDIT_LOG_EVENT"
  | "COMPLIANCE_CHECK"
  | "COMPLIANCE_CHECK_RESPONSE"
  | "PRIVACY_CHECK"
  | "PRIVACY_CHECK_RESPONSE"
  | "SYNC_VAULT"
  | "SYNC_VAULT_RESPONSE"
  | "OPEN_SIDE_PANEL"
  | "CLOSE_SIDE_PANEL"
  | "NAVIGATE"
  | "NOTIFICATION"
  | "NOTIFY_EVENT"
  | "GET_SCRIPTS_OVERLAY"
  | "GET_SCRIPTS_OVERLAY_RESPONSE"
  | "GET_AI_DRAFTS_OVERLAY"
  | "GET_AI_DRAFTS_OVERLAY_RESPONSE"
  | "REGENERATE_DRAFTS"
  | "REGENERATE_DRAFTS_RESPONSE"
  | "ERROR";

export type MessageSource = "popup" | "sidepanel" | "content-script" | "background";

/** Chat scripts from the Halo script library */
export interface ChatScript {
  id: string;
  title: string;
  category: ScriptCategory;
  content: string;
  tone: ScriptTone;
  targetPersona?: string;
  tags: string[];
  isCustom: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export type ScriptCategory =
  | "welcome"
  | "icebreaker"
  | "upsell"
  | "renewal"
  | "comeback"
  | "tip_ask"
  | "ppv_promo"
  | "thank_you"
  | "birthday"
  | "custom";

export type ScriptTone =
  | "friendly"
  | "flirty"
  | "professional"
  | "casual"
  | "mysterious"
  | "grateful";

export const SCRIPT_TONE_LABELS: Record<ScriptTone, string> = {
  friendly: "👋 Amical",
  flirty: "💋 Flirty",
  professional: "💼 Pro",
  casual: "😊 Décontracté",
  mysterious: "🔮 Mystérieux",
  grateful: "🙏 Reconnaissant",
};

/** AI-generated draft suggestion */
export interface AIDraft {
  id: string;
  originalPrompt: string;
  generatedText: string;
  tone: ScriptTone;
  confidence: number; // 0-1
  sourceFan?: { id: string; persona: string };
  createdAt: number;
}

/** Chat thread summary for the chat assist page */
export interface ChatThread {
  fanId: string;
  fanUsername: string;
  fanAvatar?: string;
  platform: PlatformType;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  isPriority: boolean;
  persona: string;
}
