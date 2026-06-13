// ─── Global constants — Halo Companion ───────────

export const HALO_API_BASE = "https://api.halotalent.com";
export const HALO_API_VERSION = "v1";

export const RATE_LIMIT = {
  /** Max requests per second to any platform */
  PLATFORM_REQUESTS_PER_SECOND: 1,
  /** Max requests per minute to Halo API */
  API_REQUESTS_PER_MINUTE: 60,
  /** Max overlay injections per page load */
  OVERLAY_INJECTIONS_PER_PAGE: 3,
} as const;

export const CACHE_TTL = {
  FAN_PROFILE: 5 * 60 * 1000, // 5 min
  FANS_LIST: 2 * 60 * 1000, // 2 min
  STATS: 10 * 60 * 1000, // 10 min
  SCRIPTS: 30 * 60 * 1000, // 30 min
  VAULT_INDEX: 15 * 60 * 1000, // 15 min
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: "halo_auth_token",
  REFRESH_TOKEN: "halo_refresh_token",
  USER_PROFILE: "halo_user_profile",
  PREFERENCES: "halo_preferences",
  ONBOARDING_COMPLETE: "halo_onboarding_complete",
  AUDIT_LOG: "halo_audit_log",
  FAN_CACHE: "halo_fan_cache",
  SCRIPT_CACHE: "halo_script_cache",
  VAULT_CACHE: "halo_vault_cache",
  LAST_SYNC: "halo_last_sync",
} as const;

export const ENCRYPTION = {
  ALGORITHM: "AES-GCM" as const,
  KEY_LENGTH: 256,
  IV_LENGTH: 12,
} as const;

export const SIDE_PANEL = {
  WIDTH: 420,
  MIN_WIDTH: 320,
  MAX_WIDTH: 600,
} as const;

export const POPUP = {
  WIDTH: 128,
  HEIGHT: 128,
} as const;
