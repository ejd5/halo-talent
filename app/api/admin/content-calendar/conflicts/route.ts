import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

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
    .select("id, title, hashtags, scheduled_for, creator_id, platform, content_type")
    .gte("scheduled_for", from)
    .lte("scheduled_for", to)
    .neq("status", "cancelled");

  if (creatorIds) query = query.in("creator_id", creatorIds.split(","));

  const { data: events } = await query;
  if (!events || events.length < 2) {
    return NextResponse.json({ conflicts: [], suggestions: [] });
  }

  // Detect same-hashtag conflicts
  const conflicts: any[] = [];
  const hashtagTimings: Record<string, any[]> = {};
  for (const e of events) {
    for (const tag of e.hashtags || []) {
      const tagLower = tag.toLowerCase().replace(/^#/, "");
      if (!hashtagTimings[tagLower]) hashtagTimings[tagLower] = [];
      hashtagTimings[tagLower].push({
        event_id: e.id,
        creator_id: e.creator_id,
        title: e.title,
        platform: e.platform,
        scheduled_for: e.scheduled_for,
      });
    }
  }

  for (const [tag, items] of Object.entries(hashtagTimings)) {
    if (items.length >= 2) {
      // Check if within same hour
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const timeA = new Date(items[i].scheduled_for).getTime();
          const timeB = new Date(items[j].scheduled_for).getTime();
          if (Math.abs(timeA - timeB) < 3600000 && items[i].creator_id !== items[j].creator_id) {
            conflicts.push({
              type: "hashtag_overlap",
              severity: "warning",
              hashtag: `#${tag}`,
              creators: [items[i].creator_id, items[j].creator_id],
              events: [items[i], items[j]],
              message: `2 créateurs utilisent #${tag} à la même heure`,
            });
          }
        }
      }
    }
  }

  // Cross-creator optimization suggestions
  const suggestions: any[] = [];
  const typePlatformByWeek: Record<string, Set<string>> = {};
  for (const e of events) {
    const d = new Date(e.scheduled_for);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const weekKey = weekStart.toISOString().slice(0, 10);
    const combo = `${e.content_type}_${e.platform}`;
    if (!typePlatformByWeek[weekKey]) typePlatformByWeek[weekKey] = new Set();
    typePlatformByWeek[weekKey].add(combo);
  }

  // Group by content type for coordination suggestions
  const typeGroups: Record<string, any[]> = {};
  for (const e of events) {
    const key = e.content_type || "post";
    if (!typeGroups[key]) typeGroups[key] = [];
    typeGroups[key].push(e);
  }

  for (const [type, items] of Object.entries(typeGroups)) {
    const uniqueCreators = new Set(items.map((i) => i.creator_id));
    if (uniqueCreators.size >= 3) {
      suggestions.push({
        type: "coordination",
        content_type: type,
        creator_count: uniqueCreators.size,
        total_events: items.length,
        message: `${uniqueCreators.size} créateurs ont du contenu ${type} prévu cette semaine. Coordonnez hashtags pour maximiser la visibilité.`,
      });
    }
  }

  return NextResponse.json({ conflicts, suggestions });
}
