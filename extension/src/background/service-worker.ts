// ─── Background service worker — Halo Companion ───────────
// Entry point for all background tasks — auth, messaging, alarms

import { handleMessage } from "./message-handler";
import { startAuthManager } from "./auth-manager";
import { startAlarmManager } from "./alarm-manager";

// ─── Lifecycle ───────────

chrome.runtime.onInstalled.addListener((details) => {
  console.log("[Halo Companion] Installed:", details.reason);

  if (details.reason === "install") {
    // First install — open onboarding
    chrome.tabs.create({
      url: "https://app.halotalent.com/onboarding?source=extension",
    });

    // Set default preferences
    chrome.storage.local.set({
      halo_preferences: {
        theme: "dark",
        language: "fr",
        notificationsEnabled: true,
        overlayEnabled: true,
        autoSyncMinutes: 15,
      },
      halo_onboarding_complete: false,
    });
  }

  if (details.reason === "update") {
    console.log(
      `[Halo Companion] Updated from ${details.previousVersion} to ${chrome.runtime.getManifest().version}`
    );
  }
});

chrome.runtime.onStartup.addListener(() => {
  console.log("[Halo Companion] Browser started — initializing");
  initialize();
});

// ─── Message routing ───────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle asynchronously — keep the message channel open
  handleMessage(message, sender)
    .then((response) => {
      sendResponse(response);
    })
    .catch((error) => {
      sendResponse({
        type: "ERROR",
        payload: { message: error instanceof Error ? error.message : "Unknown error" },
        source: "background",
        timestamp: Date.now(),
      });
    });

  // Return true to keep the message channel open for async response
  return true;
});

// ─── Side panel ───────────

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: false })
  .catch((err) => console.warn("[Halo Companion] Side panel setup:", err));

// Listen for open-side-panel requests from content scripts
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "OPEN_SIDE_PANEL") {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab?.id) {
        chrome.sidePanel.open({ tabId: tab.id });
      }
    });
  }
});

// ─── Init ───────────

async function initialize(): Promise<void> {
  await startAuthManager();
  startAlarmManager();
  console.log("[Halo Companion] Background initialized");
}

// Start immediately
initialize();
