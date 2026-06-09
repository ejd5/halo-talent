import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/admin/atlas/monitoring
// Returns global Atlas usage stats for the admin dashboard
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    // Total creators using Atlas
    const { data: creators } = await supabase
      .from("atlas_fans")
      .select("creator_id");

    const uniqueCreators = [...new Set((creators ?? []).map((c) => c.creator_id))];

    // Total fans managed
    const { count: totalFans } = await supabase
      .from("atlas_fans")
      .select("*", { count: "exact", head: true });

    // Campaign stats
    const { count: totalCampaigns } = await supabase
      .from("atlas_campaigns")
      .select("*", { count: "exact", head: true });

    // Total sends
    const { data: sends } = await supabase
      .from("atlas_campaign_sends")
      .select("channel");

    // Messages by channel
    const channelCounts: Record<string, number> = { email: 0, sms: 0, push: 0 };
    for (const s of sends ?? []) {
      channelCounts[s.channel] = (channelCounts[s.channel] ?? 0) + 1;
    }

    // Active rules
    const { count: activeRules } = await supabase
      .from("atlas_rules")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    // Rule executions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const { count: recentExecutions } = await supabase
      .from("atlas_rule_executions")
      .select("*", { count: "exact", head: true })
      .gte("created_at", thirtyDaysAgo.toISOString());

    // Cost estimation
    const emailCost = (channelCounts.email ?? 0) * 0.003; // Resend: $0.003/email
    const smsCost = (channelCounts.sms ?? 0) * 0.079; // Twilio: $0.079/SMS
    const pushCost = (channelCounts.push ?? 0) * 0.001; // Push: negligible
    const estimatedCosts = {
      email: Math.round(emailCost * 100) / 100,
      sms: Math.round(smsCost * 100) / 100,
      push: Math.round(pushCost * 100) / 100,
      total: Math.round((emailCost + smsCost + pushCost) * 100) / 100,
    };

    // Recent errors
    const { data: recentErrors } = await supabase
      .from("atlas_rule_executions")
      .select("id, error_message, created_at")
      .not("error_message", "is", null)
      .order("created_at", { ascending: false })
      .limit(10);

    return NextResponse.json({
      stats: {
        creators_using_atlas: uniqueCreators.length,
        total_fans: totalFans ?? 0,
        total_campaigns: totalCampaigns ?? 0,
        active_rules: activeRules ?? 0,
        recent_executions_30d: recentExecutions ?? 0,
      },
      channel_volume: channelCounts,
      estimated_costs_usd: estimatedCosts,
      recent_errors: recentErrors ?? [],
    });
  } catch (err) {
    console.error("[ATLAS MONITORING] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
