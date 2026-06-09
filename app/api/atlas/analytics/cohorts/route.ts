import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    // Get stored cohort data
    const { data: cohortData } = await supabase
      .from("atlas_analytics_cohorts")
      .select("*")
      .eq("creator_id", user.id)
      .order("cohort_month", { ascending: false })
      .order("month_offset", { ascending: true })
      .limit(200);

    // Get fan acquisition by month for cohorts not yet computed
    const { data: rawCohorts } = await supabase
      .from("atlas_fans")
      .select("id, acquired_at, last_interaction_at, lifetime_value, status")
      .eq("creator_id", user.id)
      .order("acquired_at", { ascending: false })
      .limit(500);

    // Compute monthly cohorts from raw data
    const monthlyCohorts: Record<string, { acquired: any[]; months: Record<number, { retained: number; revenue: number }> }> = {};
    (rawCohorts ?? []).forEach((fan: any) => {
      if (!fan.acquired_at) return;
      const cohortKey = fan.acquired_at.slice(0, 7); // YYYY-MM
      if (!monthlyCohorts[cohortKey]) monthlyCohorts[cohortKey] = { acquired: [], months: {} };
      monthlyCohorts[cohortKey].acquired.push(fan);
    });

    // Compute retention per month offset for each cohort
    Object.entries(monthlyCohorts).forEach(([cohort, data]) => {
      const cohortDate = new Date(cohort + "-01");
      data.acquired.forEach((fan: any) => {
        if (fan.status === "active" || fan.status === "whale" || fan.status === "vip" || fan.status === "engaged") {
          // Still active = retained every month since acquisition
          const monthsSince = Math.max(0, Math.floor(
            (Date.now() - cohortDate.getTime()) / (30 * 24 * 60 * 60 * 1000)
          ));
          for (let i = 0; i <= monthsSince && i <= 12; i++) {
            if (!data.months[i]) data.months[i] = { retained: 0, revenue: 0 };
            data.months[i].retained++;
            data.months[i].revenue += Number(fan.lifetime_value ?? 0) / Math.max(monthsSince, 1);
          }
        } else if (fan.last_interaction_at) {
          // Churned: retained until last interaction
          const lastMonth = Math.max(0, Math.floor(
            (new Date(fan.last_interaction_at).getTime() - cohortDate.getTime()) / (30 * 24 * 60 * 60 * 1000)
          ));
          for (let i = 0; i <= lastMonth && i <= 12; i++) {
            if (!data.months[i]) data.months[i] = { retained: 0, revenue: 0 };
            data.months[i].retained++;
          }
        }
      });
    });

    // Build response
    const cohorts = Object.entries(monthlyCohorts).map(([cohort, data]) => {
      const totalAcquired = data.acquired.length;
      const retention: { offset: number; rate: number; revenue: number }[] = [];
      Object.entries(data.months)
        .sort(([a], [b]) => Number(a) - Number(b))
        .forEach(([offset, m]) => {
          retention.push({
            offset: Number(offset),
            rate: totalAcquired > 0 ? Math.round((m.retained / totalAcquired) * 100) : 0,
            revenue: Math.round(m.revenue * 100) / 100,
          });
        });
      return { cohort, acquired: totalAcquired, retention };
    });

    // Merge with stored data
    const storedMap: Record<string, any> = {};
    (cohortData ?? []).forEach((c: any) => {
      const key = c.cohort_month.slice(0, 7);
      if (!storedMap[key]) storedMap[key] = {};
      storedMap[key][c.month_offset] = c;
    });

    return NextResponse.json({
      cohorts: cohorts.slice(0, 12), // last 12 months
      stored: cohortData ?? [],
    });
  } catch (err) {
    console.error("[ATLAS ANALYTICS COHORTS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
