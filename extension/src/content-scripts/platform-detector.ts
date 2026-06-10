// ─── Platform detector — Halo Companion ───────────
// Detects which platform the current page belongs to

import type { PlatformType } from "@/src/types/platform";
import { PLATFORM_DOMAINS } from "@/src/types/platform";

/**
 * Detect the platform from the current hostname.
 * Returns null if the page is not a supported platform.
 */
export function detectPlatform(hostname: string): PlatformType | null {
  const normalized = hostname.toLowerCase().replace(/^www\./, "");

  // Check for exact match or subdomain match
  for (const [domain, platform] of Object.entries(PLATFORM_DOMAINS)) {
    if (normalized === domain || normalized.endsWith(`.${domain}`)) {
      return platform;
    }
  }

  return null;
}

/**
 * Detect the current page type on the platform.
 * Returns the type of page: "fans_list", "chat", "dashboard", "fan_profile", "unknown"
 */
export function detectPageType(platform: PlatformType): string {
  const path = window.location.pathname.toLowerCase();

  switch (platform) {
    case "onlyfans":
      if (path.includes("/my/dms/") || path.includes("/chats/"))
        return "chat";
      if (path.includes("/my/subscribers") || path.includes("/my/fans"))
        return "fans_list";
      if (path.includes("/my/statistics") || path.includes("/my/dashboard"))
        return "dashboard";
      if (path.startsWith("/u") || path.startsWith("/@")) return "fan_profile";
      if (path === "/my/home" || path === "/") return "dashboard";
      return "unknown";

    case "fansly":
      if (path.includes("/messages")) return "chat";
      if (path.includes("/subscribers") || path.includes("/followers"))
        return "fans_list";
      if (path.includes("/dashboard") || path.includes("/analytics"))
        return "dashboard";
      if (path.includes("/creator/")) return "fan_profile";
      return "unknown";

    case "mym":
      if (path.includes("/messages")) return "chat";
      if (path.includes("/subscribers") || path.includes("/subs"))
        return "fans_list";
      if (path.includes("/dashboard")) return "dashboard";
      return "unknown";

    case "instagram":
      if (path.includes("/direct/")) return "chat";
      if (path.includes("/followers") || path.includes("/following"))
        return "fans_list";
      return "unknown";

    case "tiktok":
      if (path.includes("/messages")) return "chat";
      if (path.includes("/followers")) return "fans_list";
      return "unknown";
  }
}

/** Get the URL of the current page for the fan list on a given platform */
export function getFanListUrl(platform: PlatformType): string | null {
  switch (platform) {
    case "onlyfans":
      return "https://onlyfans.com/my/subscribers";
    case "fansly":
      return "https://fansly.com/subscribers";
    case "mym":
      return "https://mym.fans/dashboard/subscribers";
    default:
      return null;
  }
}
