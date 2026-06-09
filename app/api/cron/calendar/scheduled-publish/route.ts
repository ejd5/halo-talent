import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  // Check every 15 min for events due to publish
  const now = new Date();
  const windowStart = new Date(now.getTime() - 15 * 60000).toISOString();
  const windowEnd = new Date(now.getTime() + 15 * 60000).toISOString();

  const { data: dueEvents } = await supabase
    .from("content_calendar_events")
    .select("*, creator:profiles!creator_id(id, full_name, display_name, email)")
    .eq("status", "scheduled")
    .gte("scheduled_for", windowStart)
    .lte("scheduled_for", windowEnd);

  if (!dueEvents || dueEvents.length === 0) {
    return NextResponse.json({ checked: true, due: 0 });
  }

  // For each due event, attempt auto-publish or notify
  const results = [];
  for (const event of dueEvents) {
    // If linked to a draft, trigger publish
    if (event.draft_id) {
      const { data: draft } = await supabase
        .from("atlas_drafts")
        .select("id, status")
        .eq("id", event.draft_id)
        .single();

      if (draft && draft.status === "approved") {
        // Mark as published
        await supabase
          .from("content_calendar_events")
          .update({ status: "published", published_at: new Date().toISOString() })
          .eq("id", event.id);

        results.push({ event_id: event.id, action: "published" });
      } else {
        // Notify creator
        await supabase
          .from("content_calendar_events")
          .update({ status: "failed", notes: "Draft not approved" })
          .eq("id", event.id);

        results.push({ event_id: event.id, action: "failed", reason: "Draft pending approval" });
      }
    } else {
      // Just notify
      results.push({ event_id: event.id, action: "notified" });
    }
  }

  return NextResponse.json({ checked: true, due: dueEvents.length, results });
}
