// ─── Platform types — Halo Companion ───────────

import type { PlatformType } from "./platform";

/** Audit event emitted for every action */
export interface AuditEvent {
  id: string;
  timestamp: number;
  action: AuditAction;
  platform: PlatformType | "extension" | "halo-api";
  targetId?: string;
  targetType?: "fan" | "message" | "content" | "script" | "setting";
  details?: Record<string, unknown>;
  success: boolean;
  error?: string;
  durationMs?: number;
}

export type AuditAction =
  | "fan_profile_viewed"
  | "fan_notes_edited"
  | "fan_tags_updated"
  | "message_sent"
  | "script_inserted"
  | "script_customized"
  | "content_vault_search"
  | "content_downloaded"
  | "compliance_check_passed"
  | "compliance_check_blocked"
  | "auth_login"
  | "auth_logout"
  | "auth_token_refreshed"
  | "setting_changed"
  | "api_call"
  | "overlay_opened"
  | "overlay_closed"
  | "export_csv"
  | "export_json"
  | "error_encountered"
  | "stats_extracted"
  | "page_changed"
  | "navigation_detected"
  | "sync_vault"
  | "dom_scan"
  | "rate_limit_hit"
  | "injection_blocked"
  | "compliance_check"
  | "privacy_check"
  | "fan_context_extracted"
  | "panel_opened"
  | "panel_closed"
  | "theme_changed"
  | "ai_draft_inserted"
  | "ai_draft_generated"
  | "ai_draft_modified"
  | "notification_shown"
  | "notification_clicked"
  | "notification_dismissed"
  | "cache_cleared"
  | "data_exported"
  | "extension_installed"
  | "extension_connected"
  | "extension_disconnected"
  | "manual_sync_started"
  | "manual_sync_completed"
  | "translation_performed"
  | "vault_check_performed"
  | "note_created"
  | "note_updated"
  | "tag_added"
  | "tag_removed"
  | "compliance_warning_shown"
  | "compliance_action_blocked";
