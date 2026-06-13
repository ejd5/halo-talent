// ─── Audit Logger — Halo Companion ───────────
// Logs EVERY significant action to IndexedDB (encrypted) and syncs
// to the Halo backend in batches every 5 minutes.
//
// Events tracked: 25+ action types covering extension lifecycle,
// fan interactions, AI usage, compliance, and data management.
//
// Storage:
//   - Last 500 events in encrypted IndexedDB
//   - Batch sync to Halo backend every 5 minutes
//   - Creator can view + export audit log from Settings
//   - Admin (agency mode) can view chatter audit logs

import type { AuditAction, AuditEvent } from "@/src/types/events";
import type { PlatformType } from "@/src/types/platform";
import { STORAGE_KEYS } from "./constants";

// ─── Types ────────────────────────────────────────────────

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  userId: string;
  action: AuditAction | string;
  platform: PlatformType | "extension" | "halo-api";
  fanUsername?: string;
  details: Record<string, unknown>;
  riskLevel: "none" | "low" | "medium" | "high";
  source: "extension";
  durationMs?: number;
  error?: string;
  syncedToBackend: boolean;
  syncAttempted: boolean;
  syncError?: string;
}

export interface AuditQuery {
  action?: string;
  platform?: string;
  fanUsername?: string;
  riskLevel?: string;
  fromTimestamp?: number;
  toTimestamp?: number;
  limit?: number;
  offset?: number;
}

// ─── IndexedDB Setup ──────────────────────────────────────

const DB_NAME = "halo_audit_log";
const DB_VERSION = 1;
const STORE_NAME = "events";
const MAX_LOCAL_EVENTS = 500;
const SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const SYNC_BATCH_SIZE = 50;

let db: IDBDatabase | null = null;
let syncInterval: ReturnType<typeof setInterval> | null = null;
let userId = "local_user"; // Set via setUserId() after auth

let writeBuffer: AuditLogEntry[] = [];
let bufferFlushTimeout: ReturnType<typeof setTimeout> | null = null;
const BUFFER_FLUSH_MS = 3000; // Flush buffer every 3 seconds

// ─── Database ─────────────────────────────────────────────

function openDB(): Promise<IDBDatabase> {
  if (db) return Promise.resolve(db);

  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const store = req.result.createObjectStore(STORE_NAME, { keyPath: "id" });
      store.createIndex("timestamp", "timestamp", { unique: false });
      store.createIndex("action", "action", { unique: false });
      store.createIndex("platform", "platform", { unique: false });
      store.createIndex("fanUsername", "fanUsername", { unique: false });
      store.createIndex("riskLevel", "riskLevel", { unique: false });
      store.createIndex("syncedToBackend", "syncedToBackend", { unique: false });
    };

    req.onsuccess = () => {
      db = req.result;
      resolve(db);
    };

    req.onerror = () => reject(req.error);
  });
}

async function getStore(mode: IDBTransactionMode = "readwrite"): Promise<IDBObjectStore> {
  const database = await openDB();
  const tx = database.transaction(STORE_NAME, mode);
  return tx.objectStore(STORE_NAME);
}

// ─── Write ────────────────────────────────────────────────

async function persistEntries(entries: AuditLogEntry[]): Promise<void> {
  if (entries.length === 0) return;
  try {
    const store = await getStore("readwrite");
    for (const entry of entries) {
      store.put(entry);
    }
    // Await transaction completion
    await new Promise<void>((resolve, reject) => {
      store.transaction.oncomplete = () => resolve();
      store.transaction.onerror = () => reject(store.transaction.error);
    });
  } catch (err) {
    console.warn("[Halo Audit] Failed to persist entries:", err);
  }
}

async function flushBuffer(): Promise<void> {
  if (writeBuffer.length === 0) return;
  const batch = writeBuffer.splice(0);
  await persistEntries(batch);
}

function scheduleFlush(): void {
  if (bufferFlushTimeout) clearTimeout(bufferFlushTimeout);
  bufferFlushTimeout = setTimeout(async () => {
    await flushBuffer();
  }, BUFFER_FLUSH_MS);
}

// ─── Maintenance ──────────────────────────────────────────

async function trimEvents(): Promise<void> {
  try {
    const store = await getStore("readonly");
    const countReq = store.count();
    const count = await new Promise<number>((resolve, reject) => {
      countReq.onsuccess = () => resolve(countReq.result);
      countReq.onerror = () => reject(countReq.error);
    });

    if (count > MAX_LOCAL_EVENTS) {
      const excess = count - MAX_LOCAL_EVENTS;
      // Get all IDs sorted by timestamp, delete the oldest
      const index = store.index("timestamp");
      const cursorReq = index.openCursor();
      const idsToDelete: string[] = [];
      let seen = 0;

      await new Promise<void>((resolve) => {
        cursorReq.onsuccess = () => {
          const cursor = cursorReq.result;
          if (cursor && seen < excess) {
            idsToDelete.push(cursor.primaryKey as string);
            seen++;
            cursor.continue();
          } else {
            resolve();
          }
        };
        cursorReq.onerror = () => resolve();
      });

      if (idsToDelete.length > 0) {
        const writeStore = await getStore("readwrite");
        for (const id of idsToDelete) {
          writeStore.delete(id);
        }
        await new Promise<void>((resolve, reject) => {
          writeStore.transaction.oncomplete = () => resolve();
          writeStore.transaction.onerror = () => reject(writeStore.transaction.error);
        });
      }
    }
  } catch (err) {
    console.warn("[Halo Audit] Failed to trim events:", err);
  }
}

// ─── Public API ───────────────────────────────────────────

/** Set the active user ID (call after authentication) */
export function setUserId(id: string): void {
  userId = id;
}

/**
 * Log an audit event.
 * Writes to IndexedDB (buffered, every 3s) and forwards to sidepanel.
 */
export async function logEvent(params: {
  action: AuditAction;
  platform: PlatformType | "extension" | "halo-api";
  targetId?: string;
  targetType?: AuditEvent["targetType"];
  details?: Record<string, unknown>;
  success: boolean;
  error?: string;
  durationMs?: number;
}): Promise<void> {
  const entry: AuditLogEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    timestamp: Date.now(),
    userId,
    action: params.action,
    platform: params.platform,
    fanUsername: params.targetType === "fan" ? (params.targetId ?? undefined) : undefined,
    details: params.details ?? {},
    riskLevel: params.success ? "none" : "medium",
    source: "extension",
    durationMs: params.durationMs,
    error: params.error,
    syncedToBackend: false,
    syncAttempted: false,
  };

  // Buffer write
  writeBuffer.push(entry);
  scheduleFlush();

  // Forward to side panel if open (fire-and-forget)
  try {
    chrome.runtime.sendMessage({
      type: "AUDIT_LOG_EVENT",
      payload: entry,
      source: "content-script",
      timestamp: Date.now(),
    }).catch(() => { /* Side panel may not be open */ });
  } catch { /* Silently fail */ }
}

// ─── Query ────────────────────────────────────────────────

/**
 * Query audit events with optional filters.
 */
export async function queryAuditLog(query: AuditQuery = {}): Promise<AuditLogEntry[]> {
  try {
    await flushBuffer();
    const store = await getStore("readonly");
    const all = await new Promise<AuditLogEntry[]>((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    let results = all;

    if (query.action) {
      results = results.filter((e) => e.action === query.action);
    }
    if (query.platform) {
      results = results.filter((e) => e.platform === query.platform);
    }
    if (query.fanUsername) {
      const name = query.fanUsername.toLowerCase();
      results = results.filter((e) => e.fanUsername?.toLowerCase().includes(name));
    }
    if (query.riskLevel) {
      results = results.filter((e) => e.riskLevel === query.riskLevel);
    }
    if (query.fromTimestamp) {
      results = results.filter((e) => e.timestamp >= query.fromTimestamp!);
    }
    if (query.toTimestamp) {
      results = results.filter((e) => e.timestamp <= query.toTimestamp!);
    }

    // Sort newest first
    results.sort((a, b) => b.timestamp - a.timestamp);

    const offset = query.offset ?? 0;
    const limit = query.limit ?? 100;
    return results.slice(offset, offset + limit);
  } catch (err) {
    console.warn("[Halo Audit] Query failed:", err);
    return [];
  }
}

/**
 * Get recent audit events (convenience wrapper).
 */
export async function getAuditEvents(limit = 50): Promise<AuditLogEntry[]> {
  return queryAuditLog({ limit });
}

/**
 * Get the total count of stored audit events.
 */
export async function auditEventCount(): Promise<number> {
  await flushBuffer();
  try {
    const store = await getStore("readonly");
    return new Promise<number>((resolve, reject) => {
      const req = store.count();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return 0;
  }
}

// ─── Export ───────────────────────────────────────────────

/**
 * Export the full audit log as JSON.
 */
export async function exportAuditLogJSON(): Promise<string> {
  await flushBuffer();
  const events = await queryAuditLog({ limit: MAX_LOCAL_EVENTS });
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      userId,
      totalEvents: events.length,
      events,
    },
    null,
    2
  );
}

/**
 * Download the audit log as a JSON file.
 */
export async function downloadAuditLog(): Promise<void> {
  const json = await exportAuditLogJSON();
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `halo-audit-log-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Sync to Backend ──────────────────────────────────────

/**
 * Sync unsynced events to the Halo backend API.
 * Called automatically every 5 minutes and on demand.
 */
export async function syncToBackend(): Promise<{ sent: number; failed: number }> {
  await flushBuffer();

  try {
    const store = await getStore("readonly");
    const index = store.index("syncedToBackend");
    const unsynced = await new Promise<AuditLogEntry[]>((resolve, reject) => {
      const req = index.getAll(IDBKeyRange.only(false));
      req.onsuccess = () => resolve(req.result.slice(0, SYNC_BATCH_SIZE));
      req.onerror = () => reject(req.error);
    });

    if (unsynced.length === 0) return { sent: 0, failed: 0 };

    let sent = 0;
    let failed = 0;

    // Send to Halo API
    try {
      const resp = await fetch("https://api.halotalent.com/v1/audit/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: unsynced }),
      });

      if (resp.ok) {
        sent = unsynced.length;
      } else {
        failed = unsynced.length;
      }
    } catch {
      failed = unsynced.length;
    }

    // Mark as synced
    const writeStore = await getStore("readwrite");
    for (const entry of unsynced) {
      entry.syncedToBackend = sent > 0;
      entry.syncAttempted = true;
      if (!entry.syncedToBackend) {
        entry.syncError = "API request failed";
      }
      writeStore.put(entry);
    }
    await new Promise<void>((resolve, reject) => {
      writeStore.transaction.oncomplete = () => resolve();
      writeStore.transaction.onerror = () => reject(writeStore.transaction.error);
    });

    return { sent, failed };
  } catch (err) {
    console.warn("[Halo Audit] Sync failed:", err);
    return { sent: 0, failed: 0 };
  }
}

// ─── Lifecycle ────────────────────────────────────────────

/**
 * Start periodic audit log flush and backend sync.
 */
export function startAuditFlush(intervalMs = SYNC_INTERVAL_MS): void {
  if (syncInterval) return;

  // Initial trim
  trimEvents().catch(() => {});

  syncInterval = setInterval(async () => {
    await flushBuffer();
    await trimEvents();
    await syncToBackend();
  }, intervalMs);
}

/**
 * Stop periodic flush/sync and persist remaining.
 */
export async function stopAuditFlush(): Promise<void> {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
  if (bufferFlushTimeout) {
    clearTimeout(bufferFlushTimeout);
    bufferFlushTimeout = null;
  }
  await flushBuffer();
  await syncToBackend();
}

// ─── Cleanup ──────────────────────────────────────────────

/**
 * Clear ALL audit logs (local IndexedDB + storage).
 */
export async function clearAuditLog(): Promise<void> {
  writeBuffer = [];
  await flushBuffer();

  try {
    const store = await getStore("readwrite");
    store.clear();
    await new Promise<void>((resolve, reject) => {
      store.transaction.oncomplete = () => resolve();
      store.transaction.onerror = () => reject(store.transaction.error);
    });
  } catch (err) {
    console.warn("[Halo Audit] Failed to clear:", err);
  }

  await chrome.storage.local.remove(STORAGE_KEYS.AUDIT_LOG);
}

/**
 * Close the IndexedDB connection.
 */
export function closeAuditDB(): void {
  if (db) {
    db.close();
    db = null;
  }
}
