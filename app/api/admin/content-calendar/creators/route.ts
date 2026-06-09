import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const url = new URL(request.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  // Get all active creators with their recent calendar activity
  let creatorQuery = supabase
    .from("profiles")
    .select("id, full_name, display_name, email, avatar_url, department")
    .eq("role", "creator")
    .eq("status", "active");

  const { data: creators } = await creatorQuery;
  if (!creators) return NextResponse.json({ creators: [] });

  // Get event counts per creator for the period
  let eventQuery = supabase
    .from("content_calendar_events")
    .select("creator_id, status")
    .gte("scheduled_for", from || new Date().toISOString().slice(0, 10))
    .lte("scheduled_for", to || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));

  const { data: events } = await eventQuery;

  const eventCounts: Record<string, { total: number; scheduled: number }> = {};
  for (const e of events || []) {
    if (!eventCounts[e.creator_id]) eventCounts[e.creator_id] = { total: 0, scheduled: 0 };
    eventCounts[e.creator_id].total++;
    if (e.status === "scheduled") eventCounts[e.creator_id].scheduled++;
  }

  const enriched = creators.map((c) => ({
    ...c,
    events: eventCounts[c.id] || { total: 0, scheduled: 0 },
    has_planning: (eventCounts[c.id]?.total || 0) > 0,
  }));

  // Creators without planning (for notifications)
  const noPlanning = enriched.filter((c) => !c.has_planning);

  return NextResponse.json({
    creators: enriched,
    no_planning: noPlanning,
    stats: {
      total_creators: creators.length,
      with_planning: enriched.filter((c) => c.has_planning).length,
      without_planning: noPlanning.length,
    },
  });
}
