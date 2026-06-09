import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Fan stats by tier
    const { data: tierData } = await supabase
      .from("atlas_fans")
      .select("fan_tier, total_spent")
      .eq("creator_id", user.id)
      .eq("status", "active");

    const counts: Record<string, number> = { total: 0, whales: 0, vip: 0, engaged: 0, warm: 0, cold: 0, churned: 0 };
    let totalRevenue = 0;
    for (const row of tierData ?? []) {
      counts.total++;
      counts[row.fan_tier] = (counts[row.fan_tier] ?? 0) + 1;
      totalRevenue += Number(row.total_spent) || 0;
    }

    // Recent activity (interactions)
    const { data: recentActivity } = await supabase
      .from("atlas_interactions")
      .select("id, direction, channel, type, subject, occurred_at")
      .eq("creator_id", user.id)
      .order("occurred_at", { ascending: false })
      .limit(20);

    const activityTexts = (recentActivity ?? []).map((a) => ({
      id: a.id,
      text: a.direction === "inbound"
        ? `📩 Nouveau message ${a.subject ? `: ${a.subject}` : ""} (${a.channel})`
        : `📤 ${a.type === "campaign" ? "Campagne envoyée" : "Message envoyé"} ${a.subject ? `: ${a.subject}` : ""} (${a.channel})`,
      occurred_at: a.occurred_at,
    }));

    // Pending drafts count
    const { count: draftCount } = await supabase
      .from("atlas_drafts")
      .select("*", { count: "exact", head: true })
      .eq("creator_id", user.id)
      .eq("status", "pending");

    return NextResponse.json({
      fanStats: { ...counts, total_revenue: totalRevenue },
      recentActivity: activityTexts,
      draftCount: draftCount ?? 0,
    });
  } catch (err) {
    console.error("[ATLAS OVERVIEW] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
