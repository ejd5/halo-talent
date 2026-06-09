import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const monthParam = req.nextUrl.searchParams.get("month");
    const targetMonth = monthParam
      ? new Date(monthParam + "-01").toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 7) + "-01";

    // Current month ROI via RPC
    const { data: roiData } = await supabase.rpc("atlas_calculate_roi", {
      p_creator_id: user.id,
      p_month: targetMonth,
    });

    const roi = roiData?.[0];

    // Monthly breakdown (last 12 months)
    const months: { month: string; revenue: number; cost: number; roi: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const m = d.toISOString().slice(0, 7) + "-01";
      const { data: mRoi } = await supabase.rpc("atlas_calculate_roi", {
        p_creator_id: user.id,
        p_month: m,
      });
      const mr = mRoi?.[0];
      months.push({
        month: d.toISOString().slice(0, 7),
        revenue: Number(mr?.total_revenue ?? 0),
        cost: Number(mr?.total_cost ?? 0),
        roi: Number(mr?.roi_percent ?? 0),
      });
    }

    // All cost entries
    const { data: costEntries } = await supabase
      .from("atlas_analytics_costs")
      .select("*")
      .eq("creator_id", user.id)
      .order("month", { ascending: false })
      .limit(12);

    // All conversions
    const { data: convs } = await supabase
      .from("atlas_analytics_conversions")
      .select("channel, revenue")
      .eq("creator_id", user.id)
      .gte("converted_at", targetMonth);

    const revenueBySource: Record<string, number> = {};
    (convs ?? []).forEach((c: any) => {
      const label =
        c.channel === "email" ? "Email campaigns"
        : c.channel === "sms" ? "SMS campaigns"
        : c.channel === "push" ? "Push notifications"
        : c.channel === "funnel" ? "Funnels"
        : c.channel === "dm" ? "Messages directs"
        : "Autres";
      revenueBySource[label] = (revenueBySource[label] || 0) + Number(c.revenue);
    });

    return NextResponse.json({
      currentMonth: {
        month: targetMonth.slice(0, 7),
        totalRevenue: Number(roi?.total_revenue ?? 0),
        totalCost: Number(roi?.total_cost ?? 0),
        roiPercent: Number(roi?.roi_percent ?? 0),
        revenueBySource,
        costBreakdown: roi?.cost_by_channel ?? {},
      },
      months,
      costEntries: (costEntries ?? []).map((c: any) => ({
        ...c,
        total: Number(c.subscription) + Number(c.ai_api_costs) + Number(c.twilio_sms)
             + Number(c.resend_email) + Number(c.other_costs),
      })),
    });
  } catch (err) {
    console.error("[ATLAS ANALYTICS ROI] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
