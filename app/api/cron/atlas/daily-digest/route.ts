import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/cron/atlas/daily-digest
// Called daily at 8am, sends digest to all creators using Atlas
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const supabase = await createClient();

    // Get all creators with Atlas data
    const { data: creators } = await supabase
      .from("atlas_fans")
      .select("creator_id")
      .not("creator_id", "is", null);

    const uniqueCreatorIds = [...new Set((creators ?? []).map((c) => c.creator_id))];

    const digests: any[] = [];

    for (const creatorId of uniqueCreatorIds) {
      // Stats for yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      // New fans yesterday
      const { count: newFans } = await supabase
        .from("atlas_fans")
        .select("*", { count: "exact", head: true })
        .eq("creator_id", creatorId)
        .gte("created_at", yesterdayStr);

      // Total revenue
      const { data: fans } = await supabase
        .from("atlas_fans")
        .select("total_spent")
        .eq("creator_id", creatorId);

      const totalRevenue = (fans ?? []).reduce((sum, f) => sum + Number(f.total_spent || 0), 0);

      // Pending drafts
      const { count: draftCount } = await supabase
        .from("atlas_drafts")
        .select("*", { count: "exact", head: true })
        .eq("creator_id", creatorId)
        .eq("status", "pending");

      // Recent interactions
      const { data: recentInteractions } = await supabase
        .from("atlas_interactions")
        .select("id")
        .eq("creator_id", creatorId)
        .gte("occurred_at", yesterdayStr);

      // Pending rules that errored
      const { count: errorCount } = await supabase
        .from("atlas_rules")
        .select("*", { count: "exact", head: true })
        .eq("creator_id", creatorId)
        .gt("total_errors", 0);

      digests.push({
        creator_id: creatorId,
        date: yesterdayStr,
        new_fans: newFans ?? 0,
        total_revenue: totalRevenue,
        pending_drafts: draftCount ?? 0,
        interactions_24h: recentInteractions?.length ?? 0,
        rule_errors: errorCount ?? 0,
      });
    }

    // Store the digest
    if (digests.length > 0) {
      await supabase.from("atlas_weekly_reports").insert(
        digests.map((d) => ({
          creator_id: d.creator_id,
          report_type: "daily_digest",
          period_start: d.date,
          period_end: d.date,
          content: d,
          generated_at: new Date().toISOString(),
        })),
      );
    }

    return NextResponse.json({
      ok: true,
      creators: uniqueCreatorIds.length,
      digests_generated: digests.length,
    });
  } catch (err) {
    console.error("[ATLAS DAILY DIGEST] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
