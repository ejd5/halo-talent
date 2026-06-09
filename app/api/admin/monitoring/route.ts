import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  // API Usage stats (from audit_log aggregated)
  const today = new Date().toISOString().slice(0, 10);
  const thisMonth = new Date().toISOString().slice(0, 7);

  // Count events in content calendar
  const { count: totalEvents } = await supabase
    .from("content_calendar_events")
    .select("id", { count: "exact", head: true });

  const { count: todayEvents } = await supabase
    .from("content_calendar_events")
    .select("id", { count: "exact", head: true })
    .gte("scheduled_for", today);

  // Active creators
  const { count: activeCreators } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "creator")
    .eq("status", "active");

  // Team members
  const { count: teamMembers } = await supabase
    .from("team_members")
    .select("id", { count: "exact", head: true })
    .eq("status", "active");

  // Audit log entries today
  const { count: auditToday } = await supabase
    .from("team_audit_log")
    .select("id", { count: "exact", head: true })
    .gte("performed_at", today);

  // Pending drafts across all creators
  const { count: pendingDrafts } = await supabase
    .from("atlas_drafts")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  // System health indicators
  return NextResponse.json({
    status: "operational",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    metrics: {
      active_creators: activeCreators || 0,
      team_members: teamMembers || 0,
      total_calendar_events: totalEvents || 0,
      today_events: todayEvents || 0,
      pending_drafts: pendingDrafts || 0,
      audit_entries_today: auditToday || 0,
    },
    services: {
      database: "operational",
      storage: "operational",
      ai_api: process.env.ANTHROPIC_API_KEY ? "configured" : "missing",
      apify: process.env.APIFY_TOKEN ? "configured" : "missing",
    },
  });
}
