import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || !["admin", "manager"].includes(profile.role)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  // Get all active creators with their monthly revenues
  const { data: creators } = await supabase
    .from("profiles")
    .select("id, full_name, display_name, department, commission_tier, joined_at")
    .eq("role", "creator")
    .in("status", ["active", "paused"]);

  if (!creators || creators.length === 0) {
    return NextResponse.json({ top_performers: [], top_growth: [], top_regression: [], top_efficiency: [] });
  }

  const currentMonth = new Date().toISOString().slice(0, 7) + "-01";
  const prevMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().slice(0, 7) + "-01";

  // Aggregate all data
  const enriched = await Promise.all(
    creators.map(async (c) => {
      const { data: revs } = await supabase
        .from("monthly_revenues")
        .select("gross_revenue")
        .eq("creator_id", c.id)
        .eq("month", currentMonth);

      const currentRevenue = (revs || []).reduce((s, r) => s + Number(r.gross_revenue || 0), 0);

      const { data: prevRevs } = await supabase
        .from("monthly_revenues")
        .select("gross_revenue")
        .eq("creator_id", c.id)
        .eq("month", prevMonth);

      const prevRevenue = (prevRevs || []).reduce((s, r) => s + Number(r.gross_revenue || 0), 0);
      const growth = prevRevenue > 0 ? Math.round(((currentRevenue - prevRevenue) / prevRevenue) * 100) : currentRevenue > 0 ? 100 : 0;

      // Fan count for efficiency
      const { count: activeFans } = await supabase
        .from("atlas_fans")
        .select("id", { count: "exact", head: true })
        .eq("creator_id", c.id)
        .eq("status", "active");

      // Engagement proxy: count of interactions (drafts + sends)
      const { count: draftsCount } = await supabase
        .from("atlas_drafts")
        .select("id", { count: "exact", head: true })
        .eq("creator_id", c.id);

      const perfScore = calcPerfScore(currentRevenue, growth, activeFans || 0);

      return {
        id: c.id,
        name: c.display_name || c.full_name || "—",
        department: c.department || "—",
        tier: c.commission_tier || "—",
        revenue: currentRevenue,
        prev_revenue: prevRevenue,
        growth,
        active_fans: activeFans || 0,
        engagement_score: draftsCount || 0,
        perf_score: perfScore,
        revenue_per_fan: (activeFans || 0) > 0 ? Math.round(currentRevenue / (activeFans || 1)) : 0,
        joined_at: c.joined_at,
      };
    }),
  );

  const topPerformers = [...enriched].sort((a, b) => b.perf_score - a.perf_score).slice(0, 20);
  const topGrowth = [...enriched].filter((c) => c.revenue > 0).sort((a, b) => b.growth - a.growth).slice(0, 20);
  const topRegression = [...enriched].filter((c) => c.revenue > 0).sort((a, b) => a.growth - b.growth).slice(0, 20);
  const topEfficiency = [...enriched].filter((c) => c.revenue_per_fan > 0).sort((a, b) => b.revenue_per_fan - a.revenue_per_fan).slice(0, 20);

  return NextResponse.json({
    top_performers: topPerformers,
    top_growth: topGrowth,
    top_regression: topRegression,
    top_efficiency: topEfficiency,
  });
}

function calcPerfScore(revenue: number, growth: number, activeFans: number): number {
  const revScore = Math.min(revenue / 1000, 50);
  const growthScore = Math.max(Math.min(growth + 50, 30), 0);
  const fanScore = Math.min(activeFans / 10, 20);
  return Math.round(revScore + growthScore + fanScore);
}
