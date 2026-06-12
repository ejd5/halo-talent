import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/require-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const supabase = await createAdminClient();

    const [
      { count: totalCreators },
      { count: totalFans },
      { count: totalConversations },
      { count: totalDrafts },
      { count: totalPpvRecs },
      { count: totalQaItems },
      { count: pendingQa },
      { count: activeUsers },
      { count: pausedUsers },
      { count: consentComplete },
    ] = await Promise.all([
      supabase.from("chat_ai_user_config").select("*", { count: "exact", head: true }),
      supabase.from("chat_ai_fans").select("*", { count: "exact", head: true }),
      supabase.from("chat_ai_conversations").select("*", { count: "exact", head: true }),
      supabase.from("chat_ai_drafts").select("*", { count: "exact", head: true }),
      supabase.from("chat_ai_ppv_recommendations").select("*", { count: "exact", head: true }),
      supabase.from("chat_ai_qa_items").select("*", { count: "exact", head: true }),
      supabase.from("chat_ai_qa_items").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("chat_ai_user_config").select("*", { count: "exact", head: true }).eq("is_paused", false).eq("is_active", true),
      supabase.from("chat_ai_user_config").select("*", { count: "exact", head: true }).eq("is_paused", true),
      supabase.from("chat_ai_consent_checklists").select("*", { count: "exact", head: true }).not("completed_at", "is", null),
    ]);

    return NextResponse.json({
      overview: {
        totalCreators: totalCreators || 0,
        totalFans: totalFans || 0,
        totalConversations: totalConversations || 0,
        totalDrafts: totalDrafts || 0,
        totalPpvRecommendations: totalPpvRecs || 0,
        totalQaItems: totalQaItems || 0,
        pendingQaItems: pendingQa || 0,
        activeUsers: activeUsers || 0,
        pausedUsers: pausedUsers || 0,
        consentComplete: consentComplete || 0,
        consentRate: totalCreators ? Math.round(((consentComplete || 0) / (totalCreators || 1)) * 100) : 0,
      },
    });
  } catch (error) {
    console.error("[Admin Chat AI] Overview error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
