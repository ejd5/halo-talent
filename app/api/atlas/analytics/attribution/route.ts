import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const model = req.nextUrl.searchParams.get("model") ?? "last_touch";
    const fanId = req.nextUrl.searchParams.get("fan_id");

    // Build query for conversions
    let query = supabase
      .from("atlas_analytics_conversions")
      .select("*, fan:fan_id(id, display_name, fan_tier, total_spent)")
      .eq("creator_id", user.id)
      .eq("attribution_model", model)
      .order("converted_at", { ascending: false })
      .limit(100);

    if (fanId) query = query.eq("fan_id", fanId);

    const { data: conversions } = await query;

    // For fan journey timeline: get all interactions for a specific fan
    let fanJourney: any[] = [];
    if (fanId) {
      const { data: interactions } = await supabase
        .from("atlas_interactions")
        .select("*, campaign:campaign_id(name)")
        .eq("fan_id", fanId)
        .eq("creator_id", user.id)
        .order("occurred_at", { ascending: true })
        .limit(50);

      const { data: convs } = await supabase
        .from("atlas_analytics_conversions")
        .select("*")
        .eq("fan_id", fanId)
        .eq("creator_id", user.id)
        .order("converted_at", { ascending: true });

      // Merge interactions + conversions into a timeline
      const timeline: any[] = [];
      (interactions ?? []).forEach((i: any) => {
        timeline.push({
          type: "interaction",
          channel: i.channel,
          date: i.occurred_at,
          content: i.content?.slice(0, 100) ?? i.type,
        });
      });
      (convs ?? []).forEach((c: any) => {
        timeline.push({
          type: "conversion",
          channel: c.channel,
          date: c.converted_at,
          revenue: c.revenue,
          weight: c.touch_weight,
        });
      });
      timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      fanJourney = timeline;
    }

    return NextResponse.json({
      model,
      conversions: (conversions ?? []).map((c: any) => ({
        ...c,
        fan_name: c.fan?.display_name ?? "Inconnu",
        fan_tier: c.fan?.fan_tier,
      })),
      fanJourney,
    });
  } catch (err) {
    console.error("[ATLAS ANALYTICS ATTRIBUTION] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
