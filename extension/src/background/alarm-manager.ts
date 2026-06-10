// ─── Alarm manager — Halo Companion ───────────
// Periodic tasks: sync fan data, refresh auth tokens, flush audit logs

import { STORAGE_KEYS } from "@/src/lib/constants";
import { haloAPI } from "@/src/lib/halo-api-client";
import { getAuthToken, refreshAuthToken } from "./auth-manager";
import { logEvent } from "@/src/lib/audit-logger";

const ALARMS = {
  SYNC_VAULT: "halo_sync_vault",
  REFRESH_TOKEN: "halo_refresh_token",
  FLUSH_AUDIT: "halo_flush_audit",
  HEARTBEAT: "halo_heartbeat",
} as const;

export function startAlarmManager(): void {
  // Create alarms if they don't exist
  chrome.alarms.get(ALARMS.SYNC_VAULT, (alarm) => {
    if (!alarm) {
      chrome.alarms.create(ALARMS.SYNC_VAULT, { periodInMinutes: 15 });
    }
  });

  chrome.alarms.get(ALARMS.REFRESH_TOKEN, (alarm) => {
    if (!alarm) {
      chrome.alarms.create(ALARMS.REFRESH_TOKEN, { periodInMinutes: 50 });
    }
  });

  chrome.alarms.get(ALARMS.FLUSH_AUDIT, (alarm) => {
    if (!alarm) {
      chrome.alarms.create(ALARMS.FLUSH_AUDIT, { periodInMinutes: 1 });
    }
  });

  chrome.alarms.get(ALARMS.HEARTBEAT, (alarm) => {
    if (!alarm) {
      chrome.alarms.create(ALARMS.HEARTBEAT, { periodInMinutes: 5 });
    }
  });

  // Listen for alarms
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    switch (alarm.name) {
      case ALARMS.SYNC_VAULT:
        await syncVault();
        break;
      case ALARMS.REFRESH_TOKEN:
        await handleTokenRefresh();
        break;
      case ALARMS.FLUSH_AUDIT:
        await flushAudit();
        break;
      case ALARMS.HEARTBEAT:
        await heartbeat();
        break;
    }
  });

  console.log("[Halo Companion] Alarms started");
}

async function syncVault(): Promise<void> {
  try {
    const token = await getAuthToken();
    if (!token) return;

    haloAPI.setToken(token);
    // Sync is lightweight — just check what's new since last sync
    const lastSync = await chrome.storage.local.get(STORAGE_KEYS.LAST_SYNC);
    const since = lastSync[STORAGE_KEYS.LAST_SYNC] ?? Date.now() - 15 * 60 * 1000;

    // Pulse to backend to check for updates
    await haloAPI.searchVault(""); // lightweight ping

    await chrome.storage.local.set({
      [STORAGE_KEYS.LAST_SYNC]: Date.now(),
    });

    await logEvent({
      action: "sync_vault",
      platform: "halo-api",
      details: { since },
      success: true,
    });
  } catch (err) {
    console.warn("[Halo Companion] Vault sync failed:", err);
  }
}

async function handleTokenRefresh(): Promise<void> {
  try {
    await refreshAuthToken();
  } catch {
    console.warn("[Halo Companion] Token refresh failed");
  }
}

async function flushAudit(): Promise<void> {
  // Audit logs are flushed periodically by the audit-logger module
  // This alarm ensures we flush even if the buffer is below the batch threshold
  const { stopAuditFlush, startAuditFlush } = await import("@/src/lib/audit-logger");
  await stopAuditFlush();
  startAuditFlush(30_000);
}

async function heartbeat(): Promise<void> {
  // Lightweight heartbeat to keep service worker alive
  console.debug("[Halo Companion] Heartbeat");
}
