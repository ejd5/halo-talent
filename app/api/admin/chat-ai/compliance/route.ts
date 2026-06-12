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
      { data: configs },
      { data: consents },
      { data: qaCounts },
      { count: totalCreators },
      { count: totalPaused },
    ] = await Promise.all([
      supabase.from("chat_ai_user_config").select("user_id, mode, is_paused, is_active, plan, created_at"),
      supabase.from("chat_ai_consent_checklists").select("user_id, completed_at, version"),
      supabase.from("chat_ai_qa_items").select("status"),
      supabase.from("chat_ai_user_config").select("*", { count: "exact", head: true }),
      supabase.from("chat_ai_user_config").select("*", { count: "exact", head: true }).eq("is_paused", true),
    ]);

    const consentMap = new Map<string, { completed: boolean; version: number }>();
    consents?.forEach((c) => consentMap.set(c.user_id, { completed: !!c.completed_at, version: c.version }));

    let consentComplete = 0;
    let consentIncomplete = 0;
    consents?.forEach((c) => {
      if (c.completed_at) consentComplete++;
      else consentIncomplete++;
    });

    const statusCounts: Record<string, number> = {
      pending: 0, approved: 0, revised: 0, blocked: 0, escalated: 0, false_positive: 0,
    };
    qaCounts?.forEach((q) => {
      if (statusCounts.hasOwnProperty(q.status)) statusCounts[q.status]++;
    });

    const totalQa = Object.values(statusCounts).reduce((a, b) => a + b, 0);
    const riskRatio = totalQa > 0 ? ((statusCounts.blocked + statusCounts.escalated) / totalQa * 100).toFixed(1) : "0";

    const creators = (configs || []).map((c) => {
      const consent = consentMap.get(c.user_id);
      return {
        userId: c.user_id,
        mode: c.mode,
        isPaused: c.is_paused,
        isActive: c.is_active,
        plan: c.plan,
        consentCompleted: consent?.completed || false,
        consentVersion: consent?.version || 0,
        createdAt: c.created_at,
      };
    });

    return NextResponse.json({
      compliance: {
        totalCreators: totalCreators || 0,
        totalPaused: totalPaused || 0,
        consentComplete,
        consentIncomplete,
        consentRate: (totalCreators || 0) > 0 ? Math.round((consentComplete / (totalCreators || 1)) * 100) : 0,
        qaBreakdown: statusCounts,
        totalQaItems: totalQa,
        riskRatio: `${riskRatio}%`,
      },
      creators,
    });
  } catch (error) {
    console.error("[Admin Chat AI] Compliance error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
