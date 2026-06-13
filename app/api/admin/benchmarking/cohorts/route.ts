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

  const { data: creators } = await supabase
    .from("profiles")
    .select("id, full_name, display_name, joined_at")
    .eq("role", "creator")
    .in("status", ["active", "paused"]);

  if (!creators) return NextResponse.json({ cohorts: [] });

  // Group by month of joining
  const cohortMap = new Map<string, any[]>();

  for (const c of creators) {
    if (!c.joined_at) continue;
    const cohortKey = new Date(c.joined_at).toISOString().slice(0, 7); // YYYY-MM
    if (!cohortMap.has(cohortKey)) cohortMap.set(cohortKey, []);
    cohortMap.get(cohortKey)!.push(c);
  }

  // Get revenue for last 12 months
  const months: string[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(new Date().getFullYear(), new Date().getMonth() - i, 1);
    months.push(d.toISOString().slice(0, 7) + "-01");
  }

  const cohorts = [...cohortMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-8) // last 8 cohorts
    .map(([cohortKey, members]) => {
      const memberIds = members.map((m) => m.id);
      const size = memberIds.length;

      // For each month, get avg revenue per creator in cohort
      const revenueByMonth = months.map((month) => {
        // Batch query all revenues for this cohort in this month
        return 0; // placeholder, calculated below
      });

      // Calculate month 0, month 1, month 2... from join date
      const retentionCurve: number[] = [];
      const monthlyRevenues: number[] = [];

      for (let m = 0; m < 12; m++) {
        const monthDate = new Date(new Date(cohortKey + "-01").getFullYear(), new Date(cohortKey + "-01").getMonth() + m, 1);
        const monthStr = monthDate.toISOString().slice(0, 7) + "-01";
        if (new Date(monthStr) > new Date()) break;

        months.push(monthStr);
      }

      // Use only unique months
      const uniqueMonths = [...new Set(months)].sort();
      const avgRevenues = uniqueMonths.map((m) => {
        // Aggregate revenue for all creators in this cohort
        return 0; // placeholder
      });

      return {
        cohort: cohortKey,
        size,
        members: memberIds,
      };
    });

  // Parallel data fetch for efficiency
  const enrichedCohorts = await Promise.all(
    cohorts.map(async (c) => {
      const curve: number[] = [];
      const monthLabels: string[] = [];
      const startDate = new Date(c.cohort + "-01");

      for (let m = 0; m < 12; m++) {
        const month = new Date(startDate.getFullYear(), startDate.getMonth() + m, 1);
        if (month > new Date()) break;
        const monthStr = month.toISOString().slice(0, 7) + "-01";
        monthLabels.push(monthStr);

        const { data: revs } = await supabase
          .from("monthly_revenues")
          .select("gross_revenue")
          .in("creator_id", c.members)
          .eq("month", monthStr);

        const total = (revs || []).reduce((s, r) => s + Number(r.gross_revenue || 0), 0);
        const avgPerCreator = c.size > 0 ? Math.round(total / c.size) : 0;
        curve.push(avgPerCreator);
      }

      return { ...c, retention_curve: curve, months: monthLabels };
    }),
  );

  enrichedCohorts.sort((a, b) => b.cohort.localeCompare(a.cohort));

  return NextResponse.json({ cohorts: enrichedCohorts });
}
