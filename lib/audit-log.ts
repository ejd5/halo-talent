import { createClient } from "./supabase/client";

type LogParams = {
  userId: string;
  action: string;
  actionType?: "create" | "update" | "delete" | "view" | "login" | "export" | "system" | "other";
  resourceType?: string;
  resourceId?: string;
  oldValue?: unknown;
  newValue?: unknown;
  severity?: "info" | "warning" | "critical";
  success?: boolean;
  error?: string;
  metadata?: Record<string, unknown>;
};

/**
 * Log an action to the audit trail.
 * In production, inserts into the `audit_logs` Supabase table
 * and sends Telegram alerts for critical events.
 */
export async function logAction(params: LogParams) {
  try {
    const supabase = createClient();

    const payload = {
      user_id: params.userId,
      action: params.action,
      action_type: params.actionType ?? "other",
      resource_type: params.resourceType ?? null,
      resource_id: params.resourceId ?? null,
      old_value: params.oldValue ?? null,
      new_value: params.newValue ?? null,
      severity: params.severity ?? "info",
      success: params.success ?? true,
      error_message: params.error ?? null,
      metadata: params.metadata ?? null,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("audit_logs").insert(payload);

    if (error) {
      console.error("[audit-log] Supabase insert error:", error);
    }

    // Send Telegram alert for critical events
    if (params.severity === "critical") {
      await sendTelegramAlert({
        text: `🚨 *Action critique*: ${params.action}\nUtilisateur: ${params.userId}\nRessource: ${params.resourceType ?? "N/A"}/${params.resourceId ?? ""}\n${params.error ? `Erreur: ${params.error}` : ""}`,
      }).catch(() => {});
    }

    return payload;
  } catch (err) {
    console.error("[audit-log] Failed to log action:", err);
  }
}

/**
 * Send an alert via Telegram bot.
 * Configure bot token and chat ID in environment variables.
 */
async function sendTelegramAlert({ text }: { text: string }) {
  const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN ?? process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID ?? process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    // Silent, Telegram not configured
    return;
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
    }),
  });
}

/**
 * Check conditions and send alert if suspicious.
 * Call from login/ auth flows.
 */
export function checkSuspiciousActivity(params: {
  ip: string;
  userId: string;
  action: string;
  previousIps: string[];
}): { suspicious: boolean; reason?: string } {
  const { ip, userId, action, previousIps } = params;

  // New IP for user
  if (previousIps.length > 0 && !previousIps.includes(ip)) {
    return { suspicious: true, reason: "Nouvelle adresse IP détectée" };
  }

  // Rapid repeated action (brute force signal)
  if (action === "login_failed" && previousIps.filter((p) => p === ip).length > 5) {
    return { suspicious: true, reason: "Tentatives multiples depuis la même IP" };
  }

  return { suspicious: false };
}
