// ─── Content script injector — Halo Companion ───────────
// Main entry point injected into platform pages.
// Routes messages through the active platform adapter.

import { detectPlatform } from "./platform-detector";
import { startDOMObserver, onDOMEvent } from "./dom-observer";
import { initializeOverlayManager, removeAllOverlays } from "./overlay-manager";
import { logEvent } from "@/src/lib/audit-logger";
import {
  registerAdapter,
  getAdapter,
  debugLog,
  debugWarn,
  isDebugEnabled,
  setDebugEnabled,
} from "./adapters/base-adapter";
import type { PlatformAdapter } from "@/src/types/platform";

// ─── Adapter Imports ───────────────────────────────────────

import { onlyfansAdapter } from "./adapters/onlyfans-adapter";
import { fanslyAdapter } from "./adapters/fansly-adapter";
import { mymAdapter } from "./adapters/mym-adapter";
import { instagramAdapter } from "./adapters/instagram-adapter";
import { tiktokAdapter } from "./adapters/tiktok-adapter";

// Register all adapters
registerAdapter(onlyfansAdapter);
registerAdapter(fanslyAdapter);
registerAdapter(mymAdapter);
registerAdapter(instagramAdapter);
registerAdapter(tiktokAdapter);

// ─── Initialization ────────────────────────────────────────

(function initialize() {
  const platform = detectPlatform(window.location.hostname);

  if (!platform) {
    console.debug("[Halo Companion] Not a supported platform, skipping injection");
    return;
  }

  const adapter = getAdapter(platform);
  if (!adapter) {
    debugWarn("Injector", `Platform ${platform} detected but no adapter registered`);
    return;
  }

  debugLog("Injector", `Injected on ${platform}, page: ${adapter.detectPageType()}`);

  // Start intelligent DOM observer
  startDOMObserver(platform);

  // Initialize overlay manager (floating button, fan badges)
  initializeOverlayManager(platform);

  // Listen for page changes to re-evaluate context
  onDOMEvent("page_changed", (event) => {
    if (event.type !== "page_changed") return;
    debugLog("Injector", `Page changed: ${event.previousPage} → ${event.currentPage}`);
    logEvent({
      action: "page_changed",
      platform,
      details: { from: event.previousPage, to: event.currentPage, url: event.url },
      success: true,
    });
  });

  // Log injection
  logEvent({
    action: "overlay_opened",
    platform,
    details: { url: window.location.href, pageType: adapter.detectPageType() },
    success: true,
  });

  // Message listener
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    handleMessage(message, adapter)
      .then((result) => sendResponse(result))
      .catch((err) => {
        sendResponse({
          type: "ERROR",
          payload: { message: err instanceof Error ? err.message : "Unknown error" },
          source: "content-script",
          timestamp: Date.now(),
        });
      });
    return true;
  });
})();

// ─── Message Handler ───────────────────────────────────────

async function handleMessage(
  message: Record<string, unknown>,
  adapter: PlatformAdapter
): Promise<Record<string, unknown>> {
  const { type, payload } = message as { type: string; payload: Record<string, unknown> };

  switch (type) {
    // ── Fan Extraction ────────────────────────────────────

    case "GET_FAN_CONTEXT": {
      const ctx = adapter.getCurrentFanContext();
      return {
        type: "FAN_CONTEXT_RESPONSE",
        payload: { context: ctx },
        source: "content-script",
        timestamp: Date.now(),
      };
    }

    case "GET_FANS_LIST": {
      const fans = adapter.extractFanList();
      return {
        type: "FANS_LIST_RESPONSE",
        payload: { fans, count: fans.length },
        source: "content-script",
        timestamp: Date.now(),
      };
    }

    // ── Conversation ──────────────────────────────────────

    case "GET_CONVERSATION_CONTEXT": {
      const ctx = adapter.getCurrentConversation();
      return {
        type: "CONVERSATION_RESPONSE",
        payload: { context: ctx },
        source: "content-script",
        timestamp: Date.now(),
      };
    }

    case "GET_LAST_MESSAGES": {
      const count = (payload?.count as number) ?? 20;
      const messages = adapter.getLastMessages(count);
      return {
        type: "MESSAGES_RESPONSE",
        payload: { messages, count: messages.length },
        source: "content-script",
        timestamp: Date.now(),
      };
    }

    // ── Stats ─────────────────────────────────────────────

    case "EXTRACT_STATS": {
      const stats = adapter.extractStats();
      return {
        type: "STATS_RESPONSE",
        payload: { stats },
        source: "content-script",
        timestamp: Date.now(),
      };
    }

    // ── Chat Injection ────────────────────────────────────

    case "INSERT_SCRIPT": {
      const text = (payload?.text as string) ?? "";
      const success = adapter.insertTextInInput(text);
      return {
        type: "INSERT_SCRIPT_RESPONSE",
        payload: { success, error: success ? undefined : "Chat input not found or insertion failed" },
        source: "content-script",
        timestamp: Date.now(),
      };
    }

    case "SEND_MESSAGE": {
      const text = payload?.text as string | undefined;
      // If text provided, insert it first
      if (text) {
        adapter.insertTextInInput(text);
      }
      const success = adapter.clickSendButton();
      return {
        type: "SEND_MESSAGE_RESPONSE",
        payload: { success, error: success ? undefined : "Send button not found" },
        source: "content-script",
        timestamp: Date.now(),
      };
    }

    // ── Navigation ────────────────────────────────────────

    case "GET_PAGE_INFO": {
      return {
        type: "PAGE_INFO_RESPONSE",
        payload: {
          platform: adapter.platformName,
          pageType: adapter.detectPageType(),
          url: window.location.href,
          capabilities: adapter.capabilities,
        },
        source: "content-script",
        timestamp: Date.now(),
      };
    }

    case "NAVIGATE_TO_FAN": {
      const fanId = (payload?.fanId as string) ?? "";
      const url = adapter.getFanPageUrl(fanId);
      window.location.href = url;
      return {
        type: "NAVIGATE_RESPONSE",
        payload: { success: true, url },
        source: "content-script",
        timestamp: Date.now(),
      };
    }

    // ── Overlay Anchors ───────────────────────────────────

    case "GET_OVERLAY_ANCHORS": {
      const anchors = adapter.getOverlayAnchors();
      return {
        type: "OVERLAY_ANCHORS_RESPONSE",
        payload: anchors,
        source: "content-script",
        timestamp: Date.now(),
      };
    }

    // ── Overlay Management ────────────────────────────────

    case "INJECT_OVERLAY": {
      const overlayType = (payload?.overlay as string) ?? "all";
      // Re-initialize triggers injection
      if (overlayType === "fan_badge" || overlayType === "all") {
        initializeOverlayManager(adapter.platformName);
      }
      return {
        type: "INJECT_OVERLAY_RESPONSE",
        payload: { success: true, overlay: overlayType },
        source: "content-script",
        timestamp: Date.now(),
      };
    }

    case "REMOVE_OVERLAY": {
      const overlayType = (payload?.overlay as string) ?? "all";
      if (overlayType === "all") {
        removeAllOverlays();
      }
      return {
        type: "REMOVE_OVERLAY_RESPONSE",
        payload: { success: true, overlay: overlayType },
        source: "content-script",
        timestamp: Date.now(),
      };
    }

    // ── Debug ─────────────────────────────────────────────

    case "TOGGLE_DEBUG": {
      const enabled = payload?.enabled as boolean | undefined;
      const newState = enabled ?? !isDebugEnabled();
      setDebugEnabled(newState);
      return {
        type: "DEBUG_RESPONSE",
        payload: { debugEnabled: newState },
        source: "content-script",
        timestamp: Date.now(),
      };
    }

    default:
      return {
        type: "ERROR",
        payload: { message: `Unknown action: ${type}` },
        source: "content-script",
        timestamp: Date.now(),
      };
  }
}
