import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { data: stats } = await supabase.rpc("atlas_overview_stats", {
      p_creator_id: user.id,
    });
    const snap = stats?.[0];

    const { data: snapshots } = await supabase
      .from("atlas_snapshots")
      .select("*")
      .eq("creator_id", user.id)
      .order("snapshot_date", { ascending: false })
      .limit(30);

    return NextResponse.json({
      totalFans: snap?.total_fans ?? 0,
      activeFans: snap?.active_fans ?? 0,
      totalRevenue: snap?.total_revenue ?? 0,
      totalCost: snap?.total_cost ?? 0,
      roiPercent: snap?.roi_value ?? 0,
      avgLtv: snap?.avg_ltv ?? 0,
      newFans30d: snap?.new_fans_30d ?? 0,
      churnRate: snap?.churn_rate ?? 0,
      revenue12m: snap?.revenue_12m ?? [],
      aiInsight: snap?.ai_insight ?? null,
      snapshots: snapshots ?? [],
    });
  } catch (err) {
    console.error("[ATLAS ANALYTICS OVERVIEW] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
