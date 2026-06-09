import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // Revenue breakdown by channel (current month)
    const { data: channelRevenue } = await supabase
      .from("atlas_analytics_conversions")
      .select("channel, revenue")
      .eq("creator_id", user.id)
      .gte("converted_at", monthStart);

    // Aggregate by channel
    const revenueMap: Record<string, number> = {};
    let totalMonth = 0;
    (channelRevenue ?? []).forEach((r: any) => {
      revenueMap[r.channel] = (revenueMap[r.channel] || 0) + Number(r.revenue);
      totalMonth += Number(r.revenue);
    });

    // Campaign detail
    const { data: campaigns } = await supabase
      .from("atlas_campaigns")
      .select("id, name, channel, sent_count, opened_count, clicked_count, converted_count, revenue_generated, status, created_at")
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    // Email campaign sends stats
    const { data: emailSends } = await supabase
      .from("atlas_campaign_sends")
      .select("campaign_id, status")
      .in("campaign_id", (campaigns ?? []).map((c: any) => c.id).filter(Boolean));

    const sendStats: Record<string, { sent: number; opened: number; clicked: number }> = {};
    (emailSends ?? []).forEach((s: any) => {
      if (!sendStats[s.campaign_id]) sendStats[s.campaign_id] = { sent: 0, opened: 0, clicked: 0 };
      sendStats[s.campaign_id].sent++;
      if (s.status === "opened" || s.status === "clicked") sendStats[s.campaign_id].opened++;
      if (s.status === "clicked") sendStats[s.campaign_id].clicked++;
    });

    // Funnel stats
    const { data: funnels } = await supabase
      .from("atlas_funnels")
      .select("id, name, entry_count, conversion_count, revenue_generated, status")
      .eq("creator_id", user.id);

    // Push campaign stats
    const { data: pushCampaigns } = await supabase
      .from("atlas_push_campaigns")
      .select("id, title, status, stats, created_at")
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    return NextResponse.json({
      totalMonth,
      byChannel: Object.entries(revenueMap).map(([channel, revenue]) => ({
        channel,
        revenue,
      })),
      campaigns: (campaigns ?? []).map((c: any) => ({
        ...c,
        revenue: Number(c.revenue_generated ?? 0),
        ...(sendStats[c.id] ?? { sent: 0, opened: 0, clicked: 0 }),
      })),
      pushCampaigns: (pushCampaigns ?? []).map((p: any) => ({
        ...p,
        stats: typeof p.stats === "string" ? JSON.parse(p.stats) : p.stats,
      })),
      funnels: (funnels ?? []).map((f: any) => ({
        ...f,
        revenue: Number(f.revenue_generated ?? 0),
      })),
    });
  } catch (err) {
    console.error("[ATLAS ANALYTICS REVENUE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
