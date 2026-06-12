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
      { data: drafts },
      { data: ppvRecs },
      { data: auditLogs },
    ] = await Promise.all([
      supabase.from("chat_ai_user_config").select("user_id, mode, demo_mode, plan"),
      supabase.from("chat_ai_drafts").select("user_id, created_at, status"),
      supabase.from("chat_ai_ppv_recommendations").select("user_id, created_at"),
      supabase.from("chat_ai_audit_logs").select("user_id, action, created_at"),
    ]);

    const totalConfigs = configs?.length || 0;

    // Demo vs production users
    const demoUsers = configs?.filter((c) => c.demo_mode).length || 0;
    const productionUsers = totalConfigs - demoUsers;

    // Mode distribution
    const modeDistribution: Record<string, number> = {};
    configs?.forEach((c) => {
      modeDistribution[c.mode] = (modeDistribution[c.mode] || 0) + 1;
    });

    // Plan distribution
    const planDistribution: Record<string, number> = {};
    configs?.forEach((c) => {
      const plan = c.plan || "unknown";
      planDistribution[plan] = (planDistribution[plan] || 0) + 1;
    });

    // Drafts over time (last 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const dailyDrafts: Record<string, number> = {};
    drafts?.forEach((d) => {
      const date = d.created_at?.split("T")[0];
      if (date && new Date(date) >= thirtyDaysAgo) {
        dailyDrafts[date] = (dailyDrafts[date] || 0) + 1;
      }
    });

    // PPV recommendations over time
    const dailyPpv: Record<string, number> = {};
    ppvRecs?.forEach((p) => {
      const date = p.created_at?.split("T")[0];
      if (date && new Date(date) >= thirtyDaysAgo) {
        dailyPpv[date] = (dailyPpv[date] || 0) + 1;
      }
    });

    // Top actions from audit
    const topActions: Record<string, number> = {};
    auditLogs?.forEach((l) => {
      topActions[l.action] = (topActions[l.action] || 0) + 1;
    });

    const totalDrafts = drafts?.length || 0;
    const totalPpvRecommendations = ppvRecs?.length || 0;
    const totalAuditEvents = auditLogs?.length || 0;

    // Drafts per user avg
    const draftsPerUser = totalConfigs > 0 ? (totalDrafts / totalConfigs).toFixed(1) : "0";

    return NextResponse.json({
      usage: {
        totalUsers: totalConfigs,
        demoUsers,
        productionUsers,
        totalDrafts,
        totalPpvRecommendations,
        totalAuditEvents,
        draftsPerUser: parseFloat(draftsPerUser),
        modeDistribution,
        planDistribution,
        dailyDrafts,
        dailyPpv,
        topActions,
      },
    });
  } catch (error) {
    console.error("[Admin Chat AI] Usage error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
