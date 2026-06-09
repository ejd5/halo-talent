import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const url = new URL(request.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const creatorIds = url.searchParams.get("creator_ids");

  if (!from || !to) {
    return NextResponse.json({ error: "from et to requis" }, { status: 400 });
  }

  let query = supabase
    .from("content_calendar_events")
    .select("creator_id, platform, content_type, status, scheduled_for")
    .gte("scheduled_for", from)
    .lte("scheduled_for", to);

  if (creatorIds) {
    query = query.in("creator_id", creatorIds.split(","));
  }

  const { data: events } = await query;
  if (!events) return NextResponse.json({ analytics: {} });

  // Total events
  const total = events.length;
  const published = events.filter((e) => e.status === "published").length;
  const scheduled = events.filter((e) => e.status === "scheduled").length;
  const failed = events.filter((e) => e.status === "failed").length;

  // Publish rate
  const publishRate = total > 0 ? Math.round((published / total) * 100) : 0;

  // By creator
  const byCreator: Record<string, { total: number; published: number; scheduled: number }> = {};
  for (const e of events) {
    if (!byCreator[e.creator_id]) byCreator[e.creator_id] = { total: 0, published: 0, scheduled: 0 };
    byCreator[e.creator_id].total++;
    if (e.status === "published") byCreator[e.creator_id].published++;
    if (e.status === "scheduled") byCreator[e.creator_id].scheduled++;
  }

  // By platform
  const byPlatform: Record<string, number> = {};
  for (const e of events) {
    byPlatform[e.platform] = (byPlatform[e.platform] || 0) + 1;
  }

  // By content type
  const byType: Record<string, number> = {};
  for (const e of events) {
    byType[e.content_type || "post"] = (byType[e.content_type || "post"] || 0) + 1;
  }

  // Day-of-week distribution
  const byDay: Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (const e of events) {
    const d = days[new Date(e.scheduled_for).getDay()];
    byDay[d] = (byDay[d] || 0) + 1;
  }

  // Hour distribution
  const byHour: Record<string, number> = {};
  for (const e of events) {
    const h = new Date(e.scheduled_for).getHours().toString().padStart(2, "0");
    byHour[h] = (byHour[h] || 0) + 1;
  }

  // Weekly volume trend (number of events per week)
  const weeklyVolume: { week: string; count: number }[] = [];
  const weekMap: Record<string, number> = {};
  for (const e of events) {
    const d = new Date(e.scheduled_for);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toISOString().slice(0, 10);
    weekMap[key] = (weekMap[key] || 0) + 1;
  }
  for (const [week, count] of Object.entries(weekMap)) {
    weeklyVolume.push({ week, count });
  }
  weeklyVolume.sort((a, b) => a.week.localeCompare(b.week));

  return NextResponse.json({
    analytics: {
      total,
      published,
      scheduled,
      failed,
      publish_rate: publishRate,
      by_creator: byCreator,
      by_platform: byPlatform,
      by_type: byType,
      by_day: byDay,
      by_hour: byHour,
      weekly_volume: weeklyVolume,
    },
  });
}
