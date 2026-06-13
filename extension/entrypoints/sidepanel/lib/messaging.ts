// ─── Messaging client — Halo Side Panel ───────────
// Typed chrome.runtime messaging helpers for the side panel.

import type { FanContext, ConversationContext, ExtractedStats } from "@/src/types/platform";
import type { FanProfile, FanMemory } from "@/src/types/fan";
import type { ChatScript, AIDraft } from "@/src/types/message";
import type { VaultSearchResult } from "@/src/types/vault";

// ─── Message Types ─────────────────────────────────────────

type RequestType =
  | "GET_FAN_CONTEXT"
  | "GET_FANS_LIST"
  | "GET_CONVERSATION_CONTEXT"
  | "GET_LAST_MESSAGES"
  | "EXTRACT_STATS"
  | "INSERT_SCRIPT"
  | "SEND_MESSAGE"
  | "GET_PAGE_INFO"
  | "TOGGLE_DEBUG"
  | "GET_FAN_PROFILE"
  | "GET_FAN_MEMORIES"
  | "GET_SCRIPTS"
  | "GET_AI_DRAFTS"
  | "SEARCH_VAULT"
  | "CHECK_VAULT_COMPLIANCE"
  | "GET_OVERLAY_ANCHORS";

interface MessageResponse<T = unknown> {
  type: string;
  payload: T;
  source: string;
  timestamp: number;
}

// ─── Generic Send ──────────────────────────────────────────

async function sendToContentScript<T>(type: RequestType, payload?: Record<string, unknown>): Promise<T> {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tabId = tabs[0]?.id;
  if (!tabId) throw new Error("No active tab");

  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, {
      type,
      payload: payload ?? {},
      source: "sidepanel",
      timestamp: Date.now(),
    }, (response: MessageResponse<T> | undefined) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      if (!response) {
        reject(new Error("No response from content script"));
        return;
      }
      if (response.type === "ERROR") {
        reject(new Error((response.payload as Record<string, string>)?.message ?? "Unknown error"));
        return;
      }
      resolve(response.payload as T);
    });
  });
}

async function sendToBackground<T>(type: string, payload?: Record<string, unknown>): Promise<T> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      type,
      payload: payload ?? {},
      source: "sidepanel",
      timestamp: Date.now(),
    }, (response: MessageResponse<T> | undefined) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      if (!response) {
        reject(new Error("No response from background"));
        return;
      }
      resolve(response.payload as T);
    });
  });
}

// ─── Fan Context ───────────────────────────────────────────

export async function getFanContext(): Promise<FanContext | null> {
  try {
    const result = await sendToContentScript<{ context: FanContext | null }>("GET_FAN_CONTEXT");
    return result.context;
  } catch {
    return null;
  }
}

export async function getFanList(): Promise<FanContext[]> {
  try {
    const result = await sendToContentScript<{ fans: FanContext[]; count: number }>("GET_FANS_LIST");
    return result.fans;
  } catch {
    return [];
  }
}

// ─── Conversation ──────────────────────────────────────────

export async function getConversationContext(): Promise<ConversationContext | null> {
  try {
    const result = await sendToContentScript<{ context: ConversationContext | null }>("GET_CONVERSATION_CONTEXT");
    return result.context;
  } catch {
    return null;
  }
}

export async function getLastMessages(count = 10): Promise<{ content: string; direction: "inbound" | "outbound"; timestamp: string }[]> {
  try {
    const result = await sendToContentScript<{ messages: { content: string; direction: "inbound" | "outbound"; timestamp: string }[] }>("GET_LAST_MESSAGES", { count });
    return result.messages;
  } catch {
    return [];
  }
}

// ─── Stats ─────────────────────────────────────────────────

export async function getStats(): Promise<ExtractedStats | null> {
  try {
    const result = await sendToContentScript<{ stats: ExtractedStats | null }>("EXTRACT_STATS");
    return result.stats;
  } catch {
    return null;
  }
}

// ─── Page Info ─────────────────────────────────────────────

export async function getPageInfo(): Promise<{ platform: string; pageType: string; url: string } | null> {
  try {
    const result = await sendToContentScript<{ platform: string; pageType: string; url: string; capabilities: unknown }>("GET_PAGE_INFO");
    return result;
  } catch {
    return null;
  }
}

// ─── Script Insertion ──────────────────────────────────────

export async function insertScript(text: string): Promise<boolean> {
  try {
    const result = await sendToContentScript<{ success: boolean; error?: string }>("INSERT_SCRIPT", { text });
    return result.success;
  } catch {
    return false;
  }
}

export async function sendMessage(text: string): Promise<boolean> {
  try {
    const result = await sendToContentScript<{ success: boolean; error?: string }>("SEND_MESSAGE", { text });
    return result.success;
  } catch {
    return false;
  }
}

// ─── Vault Search ──────────────────────────────────────────

export async function searchVault(query: string): Promise<VaultSearchResult[]> {
  try {
    const result = await sendToBackground<{ results: VaultSearchResult[] }>("SEARCH_VAULT", { query });
    return result.results;
  } catch {
    return [];
  }
}

// ─── Fan Profile (from background / Halo API) ──────────────

export async function getFanProfileFromAPI(fanId: string): Promise<FanProfile | null> {
  try {
    const result = await sendToBackground<{ profile: FanProfile }>("GET_FAN_PROFILE_FROM_API", { fanId });
    return result.profile;
  } catch {
    return null;
  }
}

export async function getFanMemoriesFromAPI(fanId: string): Promise<FanMemory[]> {
  try {
    const result = await sendToBackground<{ memories: FanMemory[] }>("GET_FAN_MEMORIES", { fanId });
    return result.memories;
  } catch {
    return [];
  }
}

// ─── Scripts ───────────────────────────────────────────────

export async function getScripts(): Promise<ChatScript[]> {
  try {
    const result = await sendToBackground<{ scripts: ChatScript[] }>("GET_SCRIPTS");
    return result.scripts;
  } catch {
    return [];
  }
}

// ─── AI Drafts ─────────────────────────────────────────────

export async function getAIDrafts(context?: string): Promise<AIDraft[]> {
  try {
    const result = await sendToBackground<{ drafts: AIDraft[] }>("GET_AI_DRAFTS", { context });
    return result.drafts;
  } catch {
    return [];
  }
}

// ─── Settings Persistence ──────────────────────────────────

export async function saveSettings(settings: Record<string, unknown>): Promise<void> {
  try {
    await chrome.storage.local.set({ halo_settings: settings });
  } catch {
    // storage unavailable
  }
}

export async function loadSettings(): Promise<Record<string, unknown> | null> {
  try {
    const result = await chrome.storage.local.get("halo_settings");
    return (result?.halo_settings as Record<string, unknown>) ?? null;
  } catch {
    return null;
  }
}
