// ─── Auth manager — Halo Companion ───────────
// OAuth flow with the Halo Talent backend — token lifecycle management

import { STORAGE_KEYS } from "@/src/lib/constants";
import { haloAPI } from "@/src/lib/halo-api-client";
import { logEvent } from "@/src/lib/audit-logger";

let currentToken: string | null = null;
let currentRefreshToken: string | null = null;
let refreshTimer: ReturnType<typeof setInterval> | null = null;

export async function startAuthManager(): Promise<void> {
  // Load stored tokens
  const stored = await chrome.storage.local.get([
    STORAGE_KEYS.AUTH_TOKEN,
    STORAGE_KEYS.REFRESH_TOKEN,
  ]);

  currentToken = stored[STORAGE_KEYS.AUTH_TOKEN] ?? null;
  currentRefreshToken = stored[STORAGE_KEYS.REFRESH_TOKEN] ?? null;

  if (currentToken) {
    haloAPI.setToken(currentToken);
    console.log("[Halo Companion] Auth restored from storage");

    await logEvent({
      action: "auth_token_refreshed",
      platform: "halo-api",
      success: true,
    });
  }

  // Start periodic refresh (every 50 min — tokens live 60 min)
  if (currentRefreshToken) {
    refreshTimer = setInterval(refreshAuthToken, 50 * 60 * 1000);
  }
}

/** Get the current access token */
export async function getAuthToken(): Promise<string | null> {
  if (!currentToken && currentRefreshToken) {
    await refreshAuthToken();
  }
  return currentToken;
}

/** Set tokens from OAuth callback */
export async function setAuthTokens(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  currentToken = accessToken;
  currentRefreshToken = refreshToken;

  await chrome.storage.local.set({
    [STORAGE_KEYS.AUTH_TOKEN]: accessToken,
    [STORAGE_KEYS.REFRESH_TOKEN]: refreshToken,
  });

  haloAPI.setToken(accessToken);

  await logEvent({
    action: "auth_login",
    platform: "halo-api",
    success: true,
  });
}

/** Refresh the access token */
export async function refreshAuthToken(): Promise<string | null> {
  if (!currentRefreshToken) return null;

  try {
    const { accessToken } = await haloAPI.refreshToken(currentRefreshToken);

    currentToken = accessToken;
    await chrome.storage.local.set({
      [STORAGE_KEYS.AUTH_TOKEN]: accessToken,
    });

    haloAPI.setToken(accessToken);

    await logEvent({
      action: "auth_token_refreshed",
      platform: "halo-api",
      success: true,
    });

    return accessToken;
  } catch (err) {
    console.error("[Halo Companion] Token refresh failed:", err);

    await logEvent({
      action: "auth_token_refreshed",
      platform: "halo-api",
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    });

    // Clear invalid tokens
    await clearAuth();
    return null;
  }
}

/** Log out and clear all tokens */
export async function clearAuth(): Promise<void> {
  currentToken = null;
  currentRefreshToken = null;

  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }

  await chrome.storage.local.remove([
    STORAGE_KEYS.AUTH_TOKEN,
    STORAGE_KEYS.REFRESH_TOKEN,
  ]);

  haloAPI.setToken(null);

  await logEvent({
    action: "auth_logout",
    platform: "halo-api",
    success: true,
  });
}

/** Check if the user is authenticated */
export function isAuthenticated(): boolean {
  return currentToken !== null;
}
