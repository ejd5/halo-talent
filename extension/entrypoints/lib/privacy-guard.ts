// ─── Privacy Guard — Halo Companion ───────────
// Validates and sanitizes ALL data before it leaves the browser.
// Rules:
//   1. NEVER store full fan messages (summary only, max 200 chars)
//   2. NEVER store media (photos/videos)
//   3. NEVER store platform credentials/passwords
//   4. MINIMIZE fan data — username, displayName, segment, LTV, dates only
//   5. ENCRYPT local cache (AES-256-GCM via Web Crypto API)
//   6. EXPIRE local cache after 24h (configurable)
//   7. ALLOW total purge at any time

import { logEvent } from "./audit-logger";
import { encrypt as aesEncrypt, decrypt as aesDecrypt, deriveKey, isEncryptionReady, clearEncryptionKey } from "./encryption";
import { ENCRYPTION } from "./constants";
import type { PlatformType } from "@/src/types/platform";

// ─── Types ────────────────────────────────────────────────

export interface PrivacyCheckResult {
  allowed: boolean;
  sanitizedData: Record<string, unknown>;
  removedFields: string[];
  reason?: string;
  riskLevel: "none" | "low" | "medium" | "high";
}

/** Minimal fan data that may be stored locally or sent to the Halo API */
export interface SanitizedFanData {
  username: string;
  displayName: string;
  platform: PlatformType;
  platformId: string;
  segment: string;
  ltv: number;
  subscriptionMonths: number;
  lastActivity: string | null;
  tags: string[];
  /** AI-generated summary only — max 200 chars, never full messages */
  conversationSummary: string | null;
}

/** Raw fan data as extracted from the platform adapter */
export interface RawFanData {
  username?: string;
  displayName?: string;
  platform?: PlatformType;
  platformId?: string;
  totalSpent?: number;
  subscriptionMonths?: number;
  lastActivity?: string;
  tags?: string[];
  isVIP?: boolean;
  avatarUrl?: string;
  email?: string;
  phone?: string;
  address?: string;
  realName?: string;
  messages?: unknown[];
  media?: unknown[];
  notes?: string;
  [key: string]: unknown;
}

// ─── Allowed Fields ───────────────────────────────────────
const BLOCKED_FIELDS = new Set([
  "password",
  "passwd",
  "secret",
  "token",
  "apiKey",
  "sessionToken",
  "cookie",
  "authToken",
  "refreshToken",
  "credential",
  "email",
  "phone",
  "phoneNumber",
  "address",
  "realName",
  "fullName",
  "birthDate",
  "ssn",
  "socialSecurity",
  "passportNumber",
  "creditCard",
  "bankAccount",
  "messages",
  "media",
  "photos",
  "videos",
  "attachments",
  "avatarUrl",
  "avatar",
]);

// ─── Sensitive Pattern Detection ──────────────────────────

const PII_PATTERNS: [string, RegExp][] = [
  ["email", /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g],
  ["phone_international", /(?:\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g],
  ["credit_card", /\b\d{4}[-.\s]?\d{4}[-.\s]?\d{4}[-.\s]?\d{4}\b/g],
  ["ip_address", /\b(?:\d{1,3}\.){3}\d{1,3}\b/g],
  ["url_with_token", /[?&](?:token|api_key|auth|secret|password)=[^&\s]+/gi],
];

// ─── Cache Management ─────────────────────────────────────

interface CacheEntry<T = unknown> {
  data: T;
  encrypted: boolean;
  createdAt: number;
  expiresAt: number;
}

const CACHE_PREFIX = "halo_privacy_cache_";
const DEFAULT_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

const ENCRYPTION_PASSWORD = "halo-companion-local-v1";
let _salt: Uint8Array<ArrayBuffer> | null = null;

async function getSalt(): Promise<Uint8Array<ArrayBuffer>> {
  if (_salt) return _salt;
  const stored = await chrome.storage.local.get("halo_encryption_salt");
  if (stored.halo_encryption_salt) {
    _salt = new Uint8Array(stored.halo_encryption_salt) as Uint8Array<ArrayBuffer>;
  } else {
    _salt = crypto.getRandomValues(new Uint8Array(16)) as Uint8Array<ArrayBuffer>;
    await chrome.storage.local.set({ halo_encryption_salt: Array.from(_salt) });
  }
  return _salt;
}

async function ensureEncryption(): Promise<void> {
  if (!isEncryptionReady()) {
    const salt = await getSalt();
    await deriveKey(ENCRYPTION_PASSWORD, salt);
  }
}

// ─── Public API ───────────────────────────────────────────

/**
 * Check if data can be sent to the Halo backend.
 * Removes blocked fields, scans for PII patterns, and logs the check.
 */
export function canSendToBackend(data: unknown): PrivacyCheckResult {
  if (typeof data !== "object" || data === null) {
    return {
      allowed: true,
      sanitizedData: data as Record<string, unknown>,
      removedFields: [],
      riskLevel: "none",
    };
  }

  const input = { ...(data as Record<string, unknown>) };
  const removedFields: string[] = [];
  const warnings: string[] = [];
  let riskLevel: PrivacyCheckResult["riskLevel"] = "none";

  // 1. Strip explicitly blocked fields
  for (const key of Object.keys(input)) {
    const lower = key.toLowerCase();
    if (BLOCKED_FIELDS.has(key) || BLOCKED_FIELDS.has(lower)) {
      delete input[key];
      removedFields.push(key);
      riskLevel = "high";
    }
  }

  // 2. Scan string values for PII patterns
  for (const [key, value] of Object.entries(input)) {
    if (typeof value !== "string") continue;
    for (const [patternName, regex] of PII_PATTERNS) {
      if (regex.test(value)) {
        input[key] = "[REDACTED — PII detected]";
        removedFields.push(`${key}(${patternName})`);
        warnings.push(`Field "${key}" matched PII pattern: ${patternName}`);
        riskLevel = riskLevel === "high" ? "high" : "medium";
        break;
      }
    }
  }

  // 3. Check for full message content (>500 chars is suspicious)
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === "string" && value.length > 500) {
      input[key] = value.slice(0, 200) + "…";
      warnings.push(`Field "${key}" truncated to 200 chars`);
      if (!removedFields.includes(key)) removedFields.push(`${key}(truncated)`);
      riskLevel = riskLevel === "high" ? "high" : "low";
    }
  }

  // 4. Check for media references
  for (const key of Object.keys(input)) {
    const v = input[key];
    if (typeof v === "string" && /\.(jpg|jpeg|png|gif|webp|mp4|mov|avi|mkv)(\?|$)/i.test(v)) {
      delete input[key];
      removedFields.push(`${key}(media_url)`);
      riskLevel = riskLevel === "high" ? "high" : "medium";
    }
  }

  const blocked = removedFields.length > 0;

  logEvent({
    action: "privacy_check",
    platform: "halo-api",
    details: {
      fieldsChecked: Object.keys(data as Record<string, unknown>).length,
      fieldsRemoved: removedFields.length,
      riskLevel,
      warnings,
    },
    success: !blocked,
    error: blocked ? `Blocked fields: ${removedFields.join(", ")}` : undefined,
  });

  return {
    allowed: !blocked,
    sanitizedData: input,
    removedFields,
    reason: blocked ? `Removed ${removedFields.length} sensitive field(s)` : undefined,
    riskLevel,
  };
}

/**
 * Strip fan data down to the absolute minimum.
 * Only keeps: username, displayName, segment, LTV, dates, tags, platform notes.
 * Strips: full messages, media, credentials, PII.
 */
export function sanitizeFanData(fan: RawFanData): SanitizedFanData {
  const platform = (fan.platform ?? "onlyfans") as PlatformType;
  const totalSpent = typeof fan.totalSpent === "number" ? fan.totalSpent : 0;

  let segment = "regular";
  if (fan.isVIP || totalSpent > 500) segment = "vip";
  else if (fan.subscriptionMonths && fan.subscriptionMonths > 6) segment = "loyal";
  else if (fan.subscriptionMonths && fan.subscriptionMonths <= 1) segment = "new";

  let ltv = totalSpent;
  if (!ltv && typeof fan.ltv === "number") ltv = fan.ltv;
  if (!ltv && typeof fan.totalSpent === "number") ltv = fan.totalSpent;

  return {
    username: (fan.username ?? fan.platformId ?? "unknown").toLowerCase(),
    displayName: fan.displayName ?? fan.username ?? "Unknown",
    platform,
    platformId: fan.platformId ?? fan.username ?? "",
    segment,
    ltv,
    subscriptionMonths: fan.subscriptionMonths ?? 1,
    lastActivity: fan.lastActivity ?? null,
    tags: Array.isArray(fan.tags) ? fan.tags.slice(0, 20) : [],
    conversationSummary: null,
  };
}

/**
 * Encrypt data for localStorage / chrome.storage.local.
 * Uses the shared AES-256-GCM encryption module.
 */
export async function encryptForLocalStorage(data: unknown): Promise<string> {
  await ensureEncryption();
  const json = JSON.stringify(data);
  const { ciphertext, iv } = await aesEncrypt(json);
  // Pack IV + ciphertext as base64
  const packed = new Uint8Array(iv.length + new Uint8Array(ciphertext).length);
  packed.set(iv);
  packed.set(new Uint8Array(ciphertext), iv.length);
  return btoa(String.fromCharCode(...packed));
}

/**
 * Decrypt data from localStorage / chrome.storage.local.
 */
export async function decryptFromLocalStorage(encrypted: string): Promise<unknown> {
  await ensureEncryption();
  const packed = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));
  const iv = packed.slice(0, ENCRYPTION.IV_LENGTH);
  const ciphertext = packed.slice(ENCRYPTION.IV_LENGTH).buffer;
  const json = await aesDecrypt(ciphertext, iv);
  return JSON.parse(json);
}

/**
 * Store data in chrome.storage.local with encryption and TTL.
 */
export async function cacheSet<T>(key: string, data: T, ttlMs = DEFAULT_CACHE_TTL_MS): Promise<void> {
  const entry: CacheEntry = {
    data,
    encrypted: false,
    createdAt: Date.now(),
    expiresAt: Date.now() + ttlMs,
  };

  const encrypted = await encryptForLocalStorage(entry);
  entry.encrypted = true;

  // Store the encrypted blob + metadata
  await chrome.storage.local.set({
    [`${CACHE_PREFIX}${key}`]: encrypted,
    [`${CACHE_PREFIX}${key}_expires`]: entry.expiresAt,
  });
}

/**
 * Retrieve data from chrome.storage.local, checking TTL and decrypting.
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  const stored = await chrome.storage.local.get([
    `${CACHE_PREFIX}${key}`,
    `${CACHE_PREFIX}${key}_expires`,
  ]);

  const expiresAt = stored[`${CACHE_PREFIX}${key}_expires`] as number | undefined;
  if (expiresAt && Date.now() > expiresAt) {
    // Expired — clean up
    await chrome.storage.local.remove([`${CACHE_PREFIX}${key}`, `${CACHE_PREFIX}${key}_expires`]);
    return null;
  }

  const encrypted = stored[`${CACHE_PREFIX}${key}`] as string | undefined;
  if (!encrypted) return null;

  try {
    const entry = await decryptFromLocalStorage(encrypted) as CacheEntry<T>;
    return entry.data;
  } catch {
    // Decryption failed — corrupted or wrong key
    await chrome.storage.local.remove([`${CACHE_PREFIX}${key}`, `${CACHE_PREFIX}${key}_expires`]);
    return null;
  }
}

/**
 * Purge ALL locally cached data immediately.
 */
export async function purgeAllCache(): Promise<void> {
  const all = await chrome.storage.local.get(null);
  const keysToRemove: string[] = [];
  for (const key of Object.keys(all)) {
    if (key.startsWith(CACHE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  if (keysToRemove.length > 0) {
    await chrome.storage.local.remove(keysToRemove);
  }
  clearEncryptionKey();
  _salt = null;

  logEvent({
    action: "setting_changed",
    platform: "extension",
    details: { action: "cache_cleared", keysRemoved: keysToRemove.length },
    success: true,
  });
}

/**
 * Check if a specific cache entry exists and is not expired.
 */
export async function cacheHas(key: string): Promise<boolean> {
  const expiresAt = await chrome.storage.local.get(`${CACHE_PREFIX}${key}_expires`);
  const exp = expiresAt[`${CACHE_PREFIX}${key}_expires`] as number | undefined;
  return !!exp && Date.now() <= exp;
}

/**
 * Get the total size of cached data (approximate, in bytes).
 */
export async function cacheSize(): Promise<number> {
  const all = await chrome.storage.local.get(null);
  let size = 0;
  for (const [key, value] of Object.entries(all)) {
    if (key.startsWith(CACHE_PREFIX)) {
      size += JSON.stringify(value).length;
    }
  }
  return size;
}

// ─── Legacy-compatible exports ───────────────────────────

/**
 * Run a privacy guard check on data before sending to the Halo API.
 * @deprecated Use canSendToBackend() for new code.
 */
export function checkPrivacy(
  data: Record<string, unknown>,
  _context: "fan_profile" | "chat_message" | "vault_item" | "stats"
): { allowed: boolean; sanitized?: Record<string, unknown>; blockedFields: string[]; warnings: string[] } {
  const result = canSendToBackend(data);
  return {
    allowed: result.allowed,
    sanitized: result.allowed ? result.sanitizedData : undefined,
    blockedFields: result.removedFields,
    warnings: result.removedFields.map((f) => `Field "${f}" was removed by privacy guard`),
  };
}

/**
 * Quick check — is this fan data OK to send to the API?
 * @deprecated Use canSendToBackend() for new code.
 */
export function isFanDataSafeForAPI(fan: Record<string, unknown>): boolean {
  const result = canSendToBackend(fan);
  return result.removedFields.length === 0;
}
