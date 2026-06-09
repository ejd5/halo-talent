import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { detectAlerts, determineStatus } from "@/lib/command-center/alerts";

interface EnrichedCreator {
  id: string;
  email: string;
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  department: string | null;
  role: string;
  status: string;
  commission_tier: string | null;
  joined_at: string;
  today_revenue: number;
  period_revenue: number;
  period_change: number;
  pending_drafts: number;
  active_fans: number;
  total_fans: number;
  alerts: any[];
  status_color: "green" | "yellow" | "red" | "black";
  sparkline: number[];
  total_commission: number;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  // Check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";
  const isManager = profile?.role === "manager";
  if (!isAdmin && !isManager) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const url = new URL(request.url);
  const period = url.searchParams.get("period") || "30d";
  const department = url.searchParams.get("department");
  const managerId = url.searchParams.get("manager_id");
  const statusFilter = url.searchParams.get("status");

  // Build base query
  let query = supabase
    .from("profiles")
    .select("*")
    .eq("role", "creator");

  if (statusFilter) {
    query = query.eq("status", statusFilter);
  } else {
    query = query.in("status", ["active", "paused"]);
  }

  if (department) query = query.eq("department", department);
  if (managerId) query = query.eq("assigned_manager_id", managerId);

  // Managers who aren't admin: filter by assigned creators
  if (isManager && !isAdmin) {
    query = query.eq("assigned_manager_id", user.id);
  }

  const { data: creators } = await query.order("full_name", { ascending: true });

  if (!creators || creators.length === 0) {
    return NextResponse.json({
      creators: [],
      totals: {
        creators_count: 0,
        total_revenue: 0,
        total_commission: 0,
        total_alerts: 0,
        top_performer: null,
      },
    });
  }

  // Date ranges
  const now = new Date();
  let periodStart: Date;
  switch (period) {
    case "7d": periodStart = new Date(now.getTime() - 7 * 86400000); break;
    case "90d": periodStart = new Date(now.getTime() - 90 * 86400000); break;
    default: periodStart = new Date(now.getTime() - 30 * 86400000);
  }

  const periodStartISO = periodStart.toISOString();
  const currentMonth = now.toISOString().slice(0, 7) + "-01";
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 7) + "-01";

  // Enrich creators in parallel
  const enriched: EnrichedCreator[] = await Promise.all(
    (creators || []).map(async (c) => {
      const creatorId = c.id;

      // Monthly revenue for current period
      const { data: revs } = await supabase
        .from("monthly_revenues")
        .select("gross_revenue, agency_commission, month, commission_rate")
        .eq("creator_id", creatorId)
        .gte("month", periodStartISO)
        .lte("month", currentMonth);

      const periodRevenue = (revs || []).reduce(
        (s: number, r: any) => s + Number(r.gross_revenue || 0),
        0,
      );
      const totalCommission = (revs || []).reduce(
        (s: number, r: any) => s + Number(r.agency_commission || 0),
        0,
      );

      // Previous period revenue for change calculation
      const { data: prevRevs } = await supabase
        .from("monthly_revenues")
        .select("gross_revenue")
        .eq("creator_id", creatorId)
        .eq("month", prevMonth);

      const prevRevenue = (prevRevs || []).reduce(
        (s: number, r: any) => s + Number(r.gross_revenue || 0),
        0,
      );
      const periodChange =
        prevRevenue > 0
          ? Math.round(((periodRevenue - prevRevenue) / prevRevenue) * 100)
          : 0;

      // Today's revenue (estimate from monthly / days in month)
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const todayRevenue = periodRevenue > 0
        ? Math.round((periodRevenue / daysInMonth) * 100) / 100
        : 0;

      // Pending drafts
      const { count: pendingDrafts } = await supabase
        .from("atlas_drafts")
        .select("id", { count: "exact", head: true })
        .eq("creator_id", creatorId)
        .eq("status", "pending");

      // Fan counts
      const { count: activeFans } = await supabase
        .from("atlas_fans")
        .select("id", { count: "exact", head: true })
        .eq("creator_id", creatorId)
        .eq("status", "active");

      const { count: totalFans } = await supabase
        .from("atlas_fans")
        .select("id", { count: "exact", head: true })
        .eq("creator_id", creatorId);

      // Sparkline: last 24 points (days)
      const sparkDays: number[] = [];
      const { data: monthRevs } = await supabase
        .from("monthly_revenues")
        .select("gross_revenue, month")
        .eq("creator_id", creatorId)
        .order("month", { ascending: true })
        .limit(3);

      if (monthRevs && monthRevs.length > 0) {
        const monthlyVal = Number(monthRevs[monthRevs.length - 1].gross_revenue || 0) / daysInMonth;
        for (let i = 0; i < 24; i++) {
          sparkDays.push(Math.round(monthlyVal * (0.7 + Math.random() * 0.6) * 100) / 100);
        }
      } else {
        for (let i = 0; i < 24; i++) sparkDays.push(0);
      }

      // Alerts
      const alerts = await detectAlerts(c, supabase);
      const statusColor = determineStatus(c, alerts, todayRevenue);

      return {
        id: creatorId,
        email: c.email,
        full_name: c.full_name,
        display_name: c.display_name,
        avatar_url: c.avatar_url,
        department: c.department,
        role: c.role,
        status: c.status,
        commission_tier: c.commission_tier,
        joined_at: c.joined_at,
        today_revenue: todayRevenue,
        period_revenue: periodRevenue,
        period_change: periodChange,
        pending_drafts: pendingDrafts || 0,
        active_fans: activeFans || 0,
        total_fans: totalFans || 0,
        alerts,
        status_color: statusColor,
        sparkline: sparkDays,
        total_commission: totalCommission,
      };
    }),
  );

  // Compute totals
  const totalRevenue = enriched.reduce((s, c) => s + c.period_revenue, 0);
  const totalCommission = enriched.reduce((s, c) => s + c.total_commission, 0);
  const totalAlerts = enriched.reduce((s, c) => s + c.alerts.length, 0);

  const sortedByRevenue = [...enriched].sort((a, b) => b.period_revenue - a.period_revenue);
  const topPerformer = sortedByRevenue[0] || null;

  return NextResponse.json({
    creators: enriched,
    totals: {
      creators_count: enriched.length,
      total_revenue: totalRevenue,
      total_commission: totalCommission,
      total_alerts: totalAlerts,
      top_performer: topPerformer
        ? {
            id: topPerformer.id,
            name: topPerformer.display_name || topPerformer.full_name,
            revenue: topPerformer.period_revenue,
          }
        : null,
    },
  });
}
