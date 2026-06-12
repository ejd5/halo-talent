// ─── Admin Notifications API (Task 81) ────────────────────
// GET  /api/admin/lex/notifications          — Trigger notifications check
// GET  /api/admin/lex/notifications?type=X   — Specific notification type
//
// Types: daily_recap, deadline_4h, late_alert, all

import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import {
  sendAdminDailyRecap,
  sendDeadlineReminder4h,
  sendLateAlert,
  checkAdminNotifications,
} from "@/lib/halo-lex/letters/letter-delivery";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createAdminClient();

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Non authentifié" }), { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !["admin", "manager"].includes(profile.role)) {
      return new Response(JSON.stringify({ error: "Accès refusé" }), { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";
    const cronSecret = searchParams.get("secret");

    // Allow cron trigger with secret
    if (cronSecret) {
      const expectedSecret = process.env.CRON_SECRET || process.env.ADMIN_API_SECRET;
      if (cronSecret !== expectedSecret) {
        return new Response(JSON.stringify({ error: "Secret invalide" }), { status: 403 });
      }
    }

    let result: any;

    switch (type) {
      case "daily_recap":
        result = await sendAdminDailyRecap();
        break;
      case "deadline_4h":
        result = await sendDeadlineReminder4h();
        break;
      case "late_alert":
        result = await sendLateAlert();
        break;
      default:
        result = await checkAdminNotifications();
    }

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[Admin Notifications] Error:", error);
    return new Response(JSON.stringify({ error: "Erreur interne" }), { status: 500 });
  }
}
