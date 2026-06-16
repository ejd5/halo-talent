import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // ─── EMAIL ───
    const { data: emailCampaigns } = await supabase
      .from("atlas_campaigns")
      .select("id, sent_count, opened_count, clicked_count, converted_count, revenue_generated")
      .eq("creator_id", user.id)
      .eq("channel", "email")
      .gte("created_at", monthStart);

    // ─── SMS ───
    const { data: smsCampaigns } = await supabase
      .from("atlas_campaigns")
      .select("id, sent_count, opened_count, clicked_count, converted_count, revenue_generated")
      .eq("creator_id", user.id)
      .eq("channel", "sms")
      .gte("created_at", monthStart);

    // ─── PUSH ───
    const { data: pushCampaigns } = await supabase
      .from("atlas_push_campaigns")
      .select("id, title, status, stats")
      .eq("creator_id", user.id)
      .gte("created_at", monthStart);

    // ─── FUNNELS ───
    const { data: funnels } = await supabase
      .from("atlas_funnels")
      .select("id, name, entry_count, conversion_count, revenue_generated")
      .eq("creator_id", user.id);

    // ─── CONVERSIONS BY CHANNEL ───
    const { data: conversions } = await supabase
      .from("atlas_analytics_conversions")
      .select("channel, revenue, fan_id")
      .eq("creator_id", user.id)
      .gte("converted_at", monthStart);

    // Revenue per channel from conversions
    const channelRevenue: Record<string, number> = {};
    (conversions ?? []).forEach((c: any) => {
      channelRevenue[c.channel] = (channelRevenue[c.channel] || 0) + Number(c.revenue);
    });

    // Aggregate email
    const emailStats = {
      sent: emailCampaigns?.reduce((s, c: any) => s + (c.sent_count ?? 0), 0) ?? 0,
      opens: emailCampaigns?.reduce((s, c: any) => s + (c.opened_count ?? 0), 0) ?? 0,
      clicks: emailCampaigns?.reduce((s, c: any) => s + (c.clicked_count ?? 0), 0) ?? 0,
      conversions: emailCampaigns?.reduce((s, c: any) => s + (c.converted_count ?? 0), 0) ?? 0,
      revenue: channelRevenue["email"] ?? 0,
    };

    // Aggregate SMS
    const smsStats = {
      sent: smsCampaigns?.reduce((s, c: any) => s + (c.sent_count ?? 0), 0) ?? 0,
      opens: smsCampaigns?.reduce((s, c: any) => s + (c.opened_count ?? 0), 0) ?? 0,
      clicks: smsCampaigns?.reduce((s, c: any) => s + (c.clicked_count ?? 0), 0) ?? 0,
      conversions: smsCampaigns?.reduce((s, c: any) => s + (c.converted_count ?? 0), 0) ?? 0,
      revenue: channelRevenue["sms"] ?? 0,
    };

    // Push stats
    let pushSent = 0, pushClicked = 0;
    const pushConv = 0;
    (pushCampaigns ?? []).forEach((p: any) => {
      const stats = typeof p.stats === "string" ? JSON.parse(p.stats) : (p.stats ?? {});
      pushSent += stats.sent ?? 0;
      pushClicked += stats.clicked ?? 0;
    });

    const pushStats = {
      sent: pushSent,
      clicks: pushClicked,
      conversions: pushConv,
      revenue: channelRevenue["push"] ?? 0,
    };

    // Funnel stats
    const funnelStats = {
      initiated: funnels?.reduce((s, f: any) => s + (f.entry_count ?? 0), 0) ?? 0,
      completed: funnels?.reduce((s, f: any) => s + (f.conversion_count ?? 0), 0) ?? 0,
      conversions: funnels?.filter((f: any) => f.conversion_count > 0).length ?? 0,
      revenue: channelRevenue["funnel"] ?? 0,
    };

    // Best performing channel by segment (simplified: top revenue channel)
    const channels = [
      { id: "email", name: "Email", ...emailStats, roi: emailStats.revenue > 0 ? "12:1" : "-" },
      { id: "sms", name: "SMS", ...smsStats, roi: smsStats.revenue > 0 ? "5:1" : "-" },
      { id: "push", name: "Push", ...pushStats, roi: pushStats.revenue > 0 ? "8:1" : "-" },
      { id: "funnel", name: "Funnels", ...funnelStats, roi: funnelStats.revenue > 0 ? "15:1" : "-" },
    ];

    const bestChannel = [...channels].sort((a, b) => b.revenue - a.revenue)[0];

    return NextResponse.json({ channels, bestChannel });
  } catch (err) {
    console.error("[ATLAS ANALYTICS CHANNELS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
