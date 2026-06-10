// ─── Intelligent DOM Observer — Halo Companion ───────────
// Watches DOM mutations, debounces scans, detects SPA navigation,
// emits typed events. Rate-limited to max 1 scan/second.

import type { PlatformType } from "@/src/types/platform";
import { detectPageType } from "./platform-detector";
import { logEvent } from "@/src/lib/audit-logger";
import { debugLog, debugWarn } from "./adapters/base-adapter";

// ─── Event Types ───────────────────────────────────────────

export interface PageChangedEvent {
  type: "page_changed";
  previousPage: string;
  currentPage: string;
  url: string;
  timestamp: number;
}

export interface ConversationOpenedEvent {
  type: "conversation_opened";
  conversationId?: string;
  fanUsername?: string;
  url: string;
  timestamp: number;
}

export interface NewMessagesEvent {
  type: "new_messages_received";
  count: number;
  conversationId?: string;
  timestamp: number;
}

export interface FanListUpdatedEvent {
  type: "fan_list_updated";
  fanCount: number;
  timestamp: number;
}

export type DOMEvent =
  | PageChangedEvent
  | ConversationOpenedEvent
  | NewMessagesEvent
  | FanListUpdatedEvent;

export type DOMEventCallback = (event: DOMEvent) => void;
export type LegacyDOMCallback = (mutation: MutationRecord) => void;

// ─── Rate Limiting State ───────────────────────────────────

const SCAN_INTERVAL_MS = 1000; // 1 scan/second max
let lastScanTime = 0;
let scanTimeout: ReturnType<typeof setTimeout> | null = null;
let pendingScan = false;

// ─── SPA Navigation Detection ──────────────────────────────

let lastUrl = window.location.href;
let lastPageType = "unknown";
let navigationCheckInterval: ReturnType<typeof setInterval> | null = null;

// ─── Callback Registry ─────────────────────────────────────

const typedCallbacks = new Map<string, Set<DOMEventCallback>>();
const legacyCallbacks = new Map<string, Set<LegacyDOMCallback>>();
let observer: MutationObserver | null = null;
let intersectionObserver: IntersectionObserver | null = null;
let currentPlatform: PlatformType | null = null;

// ─── Public API ────────────────────────────────────────────

/** Start the intelligent DOM observer for the given platform */
export function startDOMObserver(platform: PlatformType): void {
  currentPlatform = platform;
  lastUrl = window.location.href;
  lastPageType = detectPageType(platform);

  debugLog("Observer", `Starting on ${platform}, page: ${lastPageType}`);

  // 1. MutationObserver for DOM changes (debounced)
  observer = new MutationObserver(() => {
    scheduleScan("mutation");
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  });

  // 2. SPA navigation detection via URL polling
  startSPADetection(platform);

  // 3. IntersectionObserver for fan element detection
  startIntersectionObserver();

  // 4. Monkey-patch history API for instant SPA detection
  patchHistoryAPI(platform);

  debugLog("Observer", "All observers active");
}

/** Stop all observers */
export function stopDOMObserver(): void {
  observer?.disconnect();
  observer = null;

  intersectionObserver?.disconnect();
  intersectionObserver = null;

  if (navigationCheckInterval) {
    clearInterval(navigationCheckInterval);
    navigationCheckInterval = null;
  }

  unpatchHistoryAPI();

  debugLog("Observer", "Stopped");
}

/** Register a typed event callback */
export function onDOMEvent(
  eventType: DOMEvent["type"] | "*",
  callback: DOMEventCallback
): () => void {
  if (!typedCallbacks.has(eventType)) {
    typedCallbacks.set(eventType, new Set());
  }
  typedCallbacks.get(eventType)!.add(callback);

  return () => {
    typedCallbacks.get(eventType)?.delete(callback);
  };
}

/** Register a legacy mutation callback (backwards compat) */
export function onDOMChange(
  event: string,
  callback: LegacyDOMCallback
): () => void {
  if (!legacyCallbacks.has(event)) {
    legacyCallbacks.set(event, new Set());
  }
  legacyCallbacks.get(event)!.add(callback);

  return () => {
    legacyCallbacks.get(event)?.delete(callback);
  };
}

// ─── Scan Scheduling (Debounced) ───────────────────────────

function scheduleScan(source: string): void {
  const now = Date.now();
  const elapsed = now - lastScanTime;

  if (elapsed >= SCAN_INTERVAL_MS) {
    performScan(source);
    lastScanTime = now;
  } else if (!pendingScan) {
    pendingScan = true;
    const delay = SCAN_INTERVAL_MS - elapsed;
    if (scanTimeout) clearTimeout(scanTimeout);
    scanTimeout = setTimeout(() => {
      performScan("debounced");
      lastScanTime = Date.now();
      pendingScan = false;
    }, delay);
  }
}

function performScan(source: string): void {
  if (!currentPlatform) return;

  const currentPage = detectPageType(currentPlatform);
  debugLog("Observer", `Scan [${source}], page: ${currentPage}`);

  // Check if page type changed
  if (currentPage !== lastPageType) {
    const event: PageChangedEvent = {
      type: "page_changed",
      previousPage: lastPageType,
      currentPage,
      url: window.location.href,
      timestamp: Date.now(),
    };
    lastPageType = currentPage;

    emitTypedEvent("page_changed", event);

    // Also emit specific event for the new page type
    if (currentPage === "chat") {
      emitTypedEvent("conversation_opened", {
        type: "conversation_opened",
        url: window.location.href,
        timestamp: Date.now(),
      });
    }

    logEvent({
      action: "page_changed",
      platform: currentPlatform,
      details: { from: event.previousPage, to: currentPage, url: window.location.href },
      success: true,
    });
  }

  // Emit legacy events for backwards compat
  emitLegacy("dom_changed", new MutationRecord());
}

// ─── SPA Navigation Detection ──────────────────────────────

function startSPADetection(platform: PlatformType): void {
  navigationCheckInterval = setInterval(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      debugLog("Observer", `SPA navigation: ${lastUrl} → ${currentUrl}`);
      lastUrl = currentUrl;

      const currentPage = detectPageType(platform);
      if (currentPage !== lastPageType) {
        const event: PageChangedEvent = {
          type: "page_changed",
          previousPage: lastPageType,
          currentPage,
          url: currentUrl,
          timestamp: Date.now(),
        };
        lastPageType = currentPage;
        emitTypedEvent("page_changed", event);

        logEvent({
          action: "navigation_detected",
          platform,
          details: { from: event.previousPage, to: currentPage, url: currentUrl },
          success: true,
        });
      }
    }
  }, 500); // Check every 500ms for SPA changes
}

// ─── History API Monkey-Patch ──────────────────────────────

let origPushState: typeof history.pushState | null = null;
let origReplaceState: typeof history.replaceState | null = null;

function patchHistoryAPI(platform: PlatformType): void {
  if (origPushState) return; // Already patched

  origPushState = history.pushState;
  origReplaceState = history.replaceState;

  history.pushState = function (...args: Parameters<typeof history.pushState>) {
    const result = origPushState!.apply(this, args);
    onHistoryChange(platform);
    return result;
  };

  history.replaceState = function (...args: Parameters<typeof history.replaceState>) {
    const result = origReplaceState!.apply(this, args);
    onHistoryChange(platform);
    return result;
  };

  window.addEventListener("popstate", () => onHistoryChange(platform));
}

function unpatchHistoryAPI(): void {
  if (origPushState) history.pushState = origPushState;
  if (origReplaceState) history.replaceState = origReplaceState;
  origPushState = null;
  origReplaceState = null;
}

function onHistoryChange(_platform: PlatformType): void {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl) {
    debugLog("Observer", `History change: ${lastUrl} → ${currentUrl}`);
    lastUrl = currentUrl;
    scheduleScan("navigation");
  }
}

// ─── IntersectionObserver ──────────────────────────────────

function startIntersectionObserver(): void {
  intersectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          // Fan-related element became visible
          const el = entry.target as HTMLElement;
          if (
            el.matches(
              '[class*="fan" i], [class*="subscriber" i], [class*="user" i], [class*="follower" i], a[href*="/u/"], a[href*="/@"]'
            )
          ) {
            emitLegacy("fan_list_updated", new MutationRecord());
          }
          // Chat-related element became visible
          if (
            el.matches(
              '[class*="message" i], [class*="chat" i], [class*="dm" i], [class*="conversation" i]'
            )
          ) {
            emitLegacy("chat_message_received", new MutationRecord());
          }
        }
      }
    },
    { threshold: 0.1 }
  );
}

// ─── Event Emission ────────────────────────────────────────

function emitTypedEvent(eventType: string, event: DOMEvent): void {
  const handlers = typedCallbacks.get(eventType);
  if (handlers) {
    for (const cb of handlers) {
      try {
        cb(event);
      } catch (err) {
        debugWarn("Observer", `${eventType} callback error`, err);
      }
    }
  }

  // Also notify "*" listeners
  const wildcard = typedCallbacks.get("*");
  if (wildcard) {
    for (const cb of wildcard) {
      try {
        cb(event);
      } catch {
        // wildcard listeners shouldn't break the pipeline
      }
    }
  }
}

function emitLegacy(event: string, mutation: MutationRecord): void {
  const handlers = legacyCallbacks.get(event);
  if (handlers) {
    for (const cb of handlers) {
      try {
        cb(mutation);
      } catch (err) {
        console.warn(`[Halo Companion] DOM callback error (${event}):`, err);
      }
    }
  }
}

// ─── Element Waiting ───────────────────────────────────────

/** Wait for a specific element to appear in the DOM */
export function waitForElement(
  selector: string,
  timeoutMs = 10_000
): Promise<Element> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(selector);
    if (existing) {
      resolve(existing);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(interval);
        resolve(el);
      } else if (Date.now() - startTime > timeoutMs) {
        clearInterval(interval);
        reject(new Error(`Timeout waiting for element: ${selector}`));
      }
    }, 200);
  });
}

/** Extract visible fan elements from the DOM (generic fallback) */
export function extractFanElements(): HTMLElement[] {
  const selectors = [
    '[class*="subscriber" i]',
    '[class*="fan" i]',
    '[data-testid*="fan" i]',
    '[data-testid*="subscriber" i]',
    'tr[class*="user" i]',
    'div[class*="user-row" i]',
    'a[href*="/u/" i]',
    'a[href*="/@"]',
  ];

  const found = new Set<HTMLElement>();
  for (const sel of selectors) {
    try {
      document.querySelectorAll(sel).forEach((el) => {
        if (el instanceof HTMLElement) found.add(el);
      });
    } catch {
      // Invalid selector — skip
    }
  }

  return Array.from(found);
}
