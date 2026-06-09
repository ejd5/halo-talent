import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || !["admin", "manager"].includes(profile.role)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const currentMonth = new Date().toISOString().slice(0, 7) + "-01";
  const prevMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().slice(0, 7) + "-01";

  // Get all active creators grouped by department
  const { data: creators } = await supabase
    .from("profiles")
    .select("id, full_name, display_name, department, joined_at, status")
    .eq("role", "creator")
    .in("status", ["active", "paused"]);

  if (!creators) return NextResponse.json({ departments: [] });

  const deptMap = new Map<string, any[]>();

  for (const c of creators) {
    const dept = c.department || "Non assigné";
    if (!deptMap.has(dept)) deptMap.set(dept, []);

    const { data: revs } = await supabase
      .from("monthly_revenues")
      .select("gross_revenue, month")
      .eq("creator_id", c.id)
      .in("month", [currentMonth, prevMonth]);

    const currentRev = (revs || []).filter((r) => r.month === currentMonth).reduce((s, r) => s + Number(r.gross_revenue || 0), 0);
    const prevRev = (revs || []).filter((r) => r.month === prevMonth).reduce((s, r) => s + Number(r.gross_revenue || 0), 0);
    const growth = prevRev > 0 ? Math.round(((currentRev - prevRev) / prevRev) * 100) : currentRev > 0 ? 100 : 0;

    // 6-month history
    const { data: history } = await supabase
      .from("monthly_revenues")
      .select("gross_revenue, month")
      .eq("creator_id", c.id)
      .order("month", { ascending: true })
      .limit(6);

    deptMap.get(dept)!.push({
      id: c.id,
      name: c.display_name || c.full_name || "—",
      revenue: currentRev,
      growth,
      joined_at: c.joined_at,
      status: c.status,
      history: (history || []).map((h) => ({ month: h.month, revenue: Number(h.gross_revenue || 0) })),
    });
  }

  // Monthly series for chart
  const months: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(new Date().getFullYear(), new Date().getMonth() - i, 1);
    months.push(d.toISOString().slice(0, 7) + "-01");
  }

  const departments = [...deptMap.entries()].map(([name, members]) => {
    const avgRevenue = members.length > 0 ? Math.round(members.reduce((s, m) => s + m.revenue, 0) / members.length) : 0;
    const avgGrowth = members.length > 0 ? Math.round(members.reduce((s, m) => s + m.growth, 0) / members.length) : 0;
    const churned = members.filter((m) => m.status !== "active").length;
    const churnRate = members.length > 0 ? Math.round((churned / members.length) * 100) : 0;

    // Monthly aggregated revenue for this dept
    const monthlySeries = months.map((month) => {
      const total = members.reduce((s, m) => {
        const match = (m.history || []).find((h: any) => h.month === month);
        return s + (match ? match.revenue : 0);
      }, 0);
      return { month, revenue: total };
    });

    return {
      name,
      creator_count: members.length,
      avg_revenue: avgRevenue,
      avg_growth: avgGrowth,
      churn_rate: churnRate,
      total_revenue: members.reduce((s, m) => s + m.revenue, 0),
      revenue_series: monthlySeries,
      best_practices: [] as string[],
    };
  });

  departments.sort((a, b) => b.total_revenue - a.total_revenue);

  return NextResponse.json({ departments });
}
