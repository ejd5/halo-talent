// ─── Audit Log Service, Chat AI ─────────────────────────
// Logs every sensitive action: draft generated, approved, copied,
// PPV created, follow-up approved, settings changed, pause/resume.

import { createAdminClient } from "@/lib/supabase/server";
import type { AuditLogEntry } from "@/lib/types/chat-ai";

interface LogActionInput {
  userId: string;
  actorId?: string;
  actorType?: AuditLogEntry["actorType"];
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Log an action to Supabase (production) or console (fallback).
 */
export async function logAction(input: LogActionInput): Promise<void> {
  const entry = {
    user_id: input.userId,
    actor_id: input.actorId || null,
    actor_type: input.actorType || "system",
    action: input.action,
    target_type: input.targetType || null,
    target_id: input.targetId || null,
    metadata: input.metadata || {},
    created_at: new Date().toISOString(),
  };

  try {
    const supabase = await createAdminClient();
    await supabase.from("chat_ai_audit_logs").insert(entry);
  } catch (err) {
    // Fallback: always log to console
    console.log("[Chat AI Audit]", JSON.stringify(entry));
  }
}

/**
 * Get audit logs for a user (with pagination).
 */
export async function getAuditLogs(
  userId: string,
  opts?: { limit?: number; offset?: number; action?: string }
): Promise<AuditLogEntry[]> {
  try {
    const supabase = await createAdminClient();
    let query = supabase
      .from("chat_ai_audit_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(opts?.limit || 50);

    if (opts?.offset) query = query.range(opts.offset, opts.offset + (opts?.limit || 50) - 1);
    if (opts?.action) query = query.eq("action", opts.action);

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as AuditLogEntry[];
  } catch (err) {
    console.error("[Chat AI Audit] Failed to fetch logs:", err);
    return [];
  }
}

/**
 * Export all audit logs for a user as JSON.
 */
export async function exportAuditLogs(userId: string): Promise<string> {
  const logs = await getAuditLogs(userId, { limit: 10000 });
  return JSON.stringify(logs, null, 2);
}
