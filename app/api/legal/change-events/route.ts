import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createAdminClient();
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform");
    const impact = searchParams.get("impact");
    const pending = searchParams.get("pending");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 200);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    // Build query
    let query = supabase
      .from("legal_change_events")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (platform) query = query.eq("platform", platform);
    if (impact) query = query.eq("impact_level", impact);
    if (pending === "true") {
      query = query.eq("human_reviewed", false);
    } else if (pending === "false") {
      query = query.eq("human_reviewed", true);
    }

    const { data: events, error } = await query;
    if (error) throw error;

    // Count changes this month
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const { count: changesThisMonth } = await supabase
      .from("legal_change_events")
      .select("*", { count: "exact", head: true })
      .gte("created_at", monthStart.toISOString());

    // Count total pending
    const { count: pendingCount } = await supabase
      .from("legal_change_events")
      .select("*", { count: "exact", head: true })
      .eq("human_reviewed", false);

    // Get last scan date from legal_updates_log
    const { data: lastScan } = await supabase
      .from("legal_updates_log")
      .select("created_at")
      .eq("source", "legal_scanner")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Fetch snapshot URLs for events that have new_snapshot_id
    const snapshotIds = events
      ?.filter((e) => e.new_snapshot_id)
      .map((e) => e.new_snapshot_id) || [];

    let snapshotUrls: Record<string, string> = {};
    if (snapshotIds.length > 0) {
      const { data: snapshots } = await supabase
        .from("legal_source_snapshots")
        .select("id, source_url")
        .in("id", snapshotIds);

      if (snapshots) {
        for (const s of snapshots) {
          snapshotUrls[s.id] = s.source_url;
        }
      }
    }

    return NextResponse.json({
      events: events || [],
      snapshot_urls: snapshotUrls,
      meta: {
        changes_this_month: changesThisMonth || 0,
        pending_count: pendingCount || 0,
        last_scan_at: lastScan?.created_at || null,
        total_sources: 8,
      },
    });
  } catch (error) {
    console.error("Change events GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
