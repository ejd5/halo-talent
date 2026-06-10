// ─── Companion Store — Halo Side Panel ───────────
// Zustand store for all side panel state.

import { create } from "zustand";
import type { PlatformType, FanContext, ConversationContext, ExtractedStats } from "@/src/types/platform";
import type { FanProfile, } from "@/src/types/fan";
import type { ChatScript, AIDraft, } from "@/src/types/message";
import type { VaultSearchResult } from "@/src/types/vault";

// ─── Alert ─────────────────────────────────────────────────

export interface CompanionAlert {
  id: string;
  type: "whale_online" | "fan_at_risk" | "ppv_unopened" | "new_fan" | "big_spender";
  fanName: string;
  fanId: string;
  message: string;
  cta: { label: string; action: "open_conversation" | "send_message" | "ignore" };
  timestamp: number;
}

// ─── Daily Summary ─────────────────────────────────────────

export interface DailySummary {
  messagesSent: number;
  revenueToday: number;
  activeFans: number;
  ppvSold: number;
}

// ─── Settings ──────────────────────────────────────────────

export interface CompanionSettings {
  theme: "auto" | "light" | "dark" | "clock";
  language: "fr" | "en" | "es" | "pt" | "de" | "it";
  notifications: {
    whaleOnline: boolean;
    fanAtRisk: boolean;
    ppvUnopened: boolean;
  };
  platforms: Partial<Record<PlatformType, boolean>>;
  debugMode: boolean;
}

// ─── Store State ───────────────────────────────────────────

interface CompanionState {
  // Connection
  isConnected: boolean;
  userEmail: string;
  setConnection: (connected: boolean, email?: string) => void;

  // Platform
  activePlatform: PlatformType | null;
  pageType: string;
  setActivePlatform: (platform: PlatformType | null, pageType?: string) => void;

  // Fan
  fanContext: FanContext | null;
  fanProfile: FanProfile | null;
  fanMemories: { id: string; content: string; createdAt: number }[];
  setFanContext: (ctx: FanContext | null) => void;
  setFanProfile: (profile: FanProfile | null) => void;

  // Conversation
  conversationContext: ConversationContext | null;
  lastMessages: { content: string; direction: "inbound" | "outbound"; timestamp: string }[];
  setConversationContext: (ctx: ConversationContext | null) => void;

  // Stats
  stats: ExtractedStats | null;
  dailySummary: DailySummary;
  setStats: (stats: ExtractedStats | null) => void;

  // Scripts & AI
  scripts: ChatScript[];
  aiDrafts: AIDraft[];
  setScripts: (scripts: ChatScript[]) => void;
  setAIDrafts: (drafts: AIDraft[]) => void;

  // Vault
  vaultResults: VaultSearchResult[];
  vaultSearchQuery: string;
  setVaultResults: (results: VaultSearchResult[]) => void;
  setVaultSearchQuery: (query: string) => void;

  // Alerts
  alerts: CompanionAlert[];
  addAlert: (alert: CompanionAlert) => void;
  dismissAlert: (id: string) => void;

  // Settings
  settings: CompanionSettings;
  updateSettings: (partial: Partial<CompanionSettings>) => void;

  // Loading states
  isFanLoading: boolean;
  isStatsLoading: boolean;
  isScriptsLoading: boolean;
  isVaultLoading: boolean;
  isDraftsLoading: boolean;

  // Onboarding
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
}

const DEFAULT_SETTINGS: CompanionSettings = {
  theme: "auto",
  language: "fr",
  notifications: {
    whaleOnline: true,
    fanAtRisk: true,
    ppvUnopened: true,
  },
  platforms: {
    onlyfans: true,
    fansly: true,
    mym: true,
    instagram: false,
    tiktok: false,
  },
  debugMode: false,
};

export const useCompanionStore = create<CompanionState>((set) => ({
  // Connection
  isConnected: false,
  userEmail: "",
  setConnection: (connected, email = "") => set({ isConnected: connected, userEmail: email }),

  // Platform
  activePlatform: null,
  pageType: "unknown",
  setActivePlatform: (platform, pageType = "unknown") => set({ activePlatform: platform, pageType }),

  // Fan
  fanContext: null,
  fanProfile: null,
  fanMemories: [],
  setFanContext: (ctx) => set({ fanContext: ctx, isFanLoading: false }),
  setFanProfile: (profile) => set({ fanProfile: profile, isFanLoading: false }),

  // Conversation
  conversationContext: null,
  lastMessages: [],
  setConversationContext: (ctx) => set({ conversationContext: ctx }),

  // Stats
  stats: null,
  dailySummary: { messagesSent: 0, revenueToday: 0, activeFans: 0, ppvSold: 0 },
  setStats: (stats) => set({ stats, isStatsLoading: false }),

  // Scripts & AI
  scripts: [],
  aiDrafts: [],
  setScripts: (scripts) => set({ scripts, isScriptsLoading: false }),
  setAIDrafts: (drafts) => set({ aiDrafts: drafts, isDraftsLoading: false }),

  // Vault
  vaultResults: [],
  vaultSearchQuery: "",
  setVaultResults: (results) => set({ vaultResults: results, isVaultLoading: false }),
  setVaultSearchQuery: (query) => set({ vaultSearchQuery: query }),

  // Alerts
  alerts: [],
  addAlert: (alert) => set((s) => ({ alerts: [alert, ...s.alerts].slice(0, 20) })),
  dismissAlert: (id) => set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),

  // Settings
  settings: DEFAULT_SETTINGS,
  updateSettings: (partial) => set((s) => ({ settings: { ...s.settings, ...partial } })),

  // Loading
  isFanLoading: false,
  isStatsLoading: false,
  isScriptsLoading: false,
  isVaultLoading: false,
  isDraftsLoading: false,

  // Onboarding
  hasCompletedOnboarding: false,
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
}));
