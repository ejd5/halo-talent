// ─── Adapters index — Halo Companion ───────────
// Re-exports all platform adapters and utilities.

export type {
  PlatformAdapter,
  PlatformCapabilities,
  FanContext,
  ConversationContext,
  MessageContext,
  MediaContext,
  OverlayAnchors,
  SyncableData,
  PageType,
} from "@/src/types/platform";

export {
  registerAdapter,
  getAdapter,
  getActiveAdapter,
  isDebugEnabled,
  setDebugEnabled,
  debugLog,
  debugWarn,
  qs,
  qsa,
  qsFirst,
  qsaFirst,
  text,
  attr,
  extractNumber,
  BasePlatformAdapter,
} from "./base-adapter";

export { onlyfansAdapter } from "./onlyfans-adapter";
export { fanslyAdapter } from "./fansly-adapter";
export { mymAdapter } from "./mym-adapter";
export { instagramAdapter } from "./instagram-adapter";
export { tiktokAdapter } from "./tiktok-adapter";
