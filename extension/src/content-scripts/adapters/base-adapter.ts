// ─── Platform adapter utilities — Halo Companion ───────────
// Re-exports the PlatformAdapter interface and provides shared
// utilities: debug logging, safe DOM queries, factory registry.

export type { PlatformAdapter, PlatformCapabilities } from "@/src/types/platform";
export type {
  FanContext,
  ConversationContext,
  MessageContext,
  MediaContext,
  OverlayAnchors,
  SyncableData,
  PageType,
} from "@/src/types/platform";

// ─── Debug ─────────────────────────────────────────────────

const DEBUG_STORAGE_KEY = "halo_debug_enabled";

export function isDebugEnabled(): boolean {
  try {
    return sessionStorage.getItem(DEBUG_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setDebugEnabled(enabled: boolean): void {
  try {
    sessionStorage.setItem(DEBUG_STORAGE_KEY, String(enabled));
  } catch {
    // sessionStorage unavailable
  }
}

export function debugLog(tag: string, ...args: unknown[]): void {
  if (isDebugEnabled()) {
    console.log(`[Halo:${tag}]`, ...args);
  }
}

export function debugWarn(tag: string, ...args: unknown[]): void {
  if (isDebugEnabled()) {
    console.warn(`[Halo:${tag}]`, ...args);
  }
}

// ─── Safe DOM Queries ──────────────────────────────────────

export function qs<T extends Element>(selector: string, root: ParentNode = document): T | null {
  try {
    return root.querySelector(selector) as T | null;
  } catch {
    return null;
  }
}

export function qsa<T extends Element>(selector: string, root: ParentNode = document): T[] {
  try {
    return Array.from(root.querySelectorAll(selector)) as T[];
  } catch {
    return [];
  }
}

export function text(selector: string, root: ParentNode = document): string | null {
  const el = qs(selector, root);
  return el?.textContent?.trim() ?? null;
}

export function attr(selector: string, attrName: string, root: ParentNode = document): string | null {
  const el = qs(selector, root);
  return el?.getAttribute(attrName) ?? null;
}

/** Try multiple selectors, return the first match */
export function qsFirst<T extends Element>(selectors: string[], root: ParentNode = document): T | null {
  for (const sel of selectors) {
    const el = qs<T>(sel, root);
    if (el) return el;
  }
  return null;
}

/** Try multiple selectors, return all matches from the first selector that yields results */
export function qsaFirst<T extends Element>(selectors: string[], root: ParentNode = document): T[] {
  for (const sel of selectors) {
    const els = qsa<T>(sel, root);
    if (els.length > 0) return els;
  }
  return [];
}

/** Extract a number from a DOM element's text, stripping non-numeric chars */
export function extractNumber(selector: string, root?: ParentNode): number {
  const t = text(selector, root);
  if (!t) return 0;
  return parseFloat(t.replace(/[^0-9.]/g, "")) || 0;
}

// ─── Base Adapter Class (optional convenience) ─────────────

import type { PlatformType, PlatformSelectors, ExtractedFan, ExtractedMessage, ExtractedStats } from "@/src/types/platform";

export abstract class BasePlatformAdapter {
  abstract readonly platform: PlatformType;
  abstract readonly selectors: PlatformSelectors;
  abstract readonly capabilities: import("@/src/types/platform").PlatformCapabilities;

  abstract extractFans(): ExtractedFan[];
  abstract extractMessages(): ExtractedMessage[];
  abstract extractStats(): ExtractedStats | null;
  abstract isOnFanListPage(): boolean;
  abstract isOnChatPage(): boolean;
  abstract isOnDashboardPage(): boolean;
  abstract getFanPageUrl(fanId: string): string;
  abstract getChatInputSelector(): string;
  abstract getSendButtonSelector(): string;

  protected qs<T extends Element>(selector: string): T | null {
    return qs<T>(selector);
  }

  protected qsa<T extends Element>(selector: string): T[] {
    return qsa<T>(selector);
  }

  protected text(selector: string): string | null {
    return text(selector);
  }

  protected attr(selector: string, attrName: string): string | null {
    return attr(selector, attrName);
  }
}

// ─── Adapter Registry ──────────────────────────────────────

import type { PlatformAdapter } from "@/src/types/platform";

const adapterRegistry = new Map<string, PlatformAdapter>();

export function registerAdapter(adapter: PlatformAdapter): void {
  adapterRegistry.set(adapter.platformName, adapter);
}

export function getAdapter(platform: string): PlatformAdapter | undefined {
  return adapterRegistry.get(platform);
}

export function getActiveAdapter(): PlatformAdapter | undefined {
  for (const adapter of adapterRegistry.values()) {
    if (adapter.isOnPlatform()) return adapter;
  }
  return undefined;
}
