import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/cron/atlas/weekly-report
// Appelé chaque semaine par CRON pour générer les rapports automatiques
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const supabase = await createClient();
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() - 6); // Lundi dernier
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const startStr = weekStart.toISOString().slice(0, 10);
    const endStr = weekEnd.toISOString().slice(0, 10);

    // Get all creators with active fans
    const { data: creators } = await supabase
      .from("profiles")
      .select("id, email");

    if (!creators) return NextResponse.json({ error: "Aucun créateur" }, { status: 404 });

    const reports: any[] = [];

    for (const creator of creators) {
      const { data: stats } = await supabase.rpc("atlas_overview_stats", {
        p_creator_id: creator.id,
      });
      const s = stats?.[0];

      // Get top campaigns this week
      const { data: campaigns } = await supabase
        .from("atlas_campaigns")
        .select("name, channel, revenue_generated")
        .eq("creator_id", creator.id)
        .gte("created_at", startStr)
        .order("revenue_generated", { ascending: false })
        .limit(3);

      // Get conversions this week
      const { data: weeklyConvs } = await supabase
        .from("atlas_analytics_conversions")
        .select("revenue")
        .eq("creator_id", creator.id)
        .gte("converted_at", startStr);

      const weeklyRevenue = (weeklyConvs ?? []).reduce((sum, c: any) => sum + Number(c.revenue), 0);
      const totalRevenue = Number(s?.total_revenue ?? 0);

      // Generate recommendations
      const recommendations: string[] = [];
      if ((s?.new_fans_30d ?? 0) === 0) {
        recommendations.push("Crée une campagne de lead capture pour recruter de nouveaux fans");
      }
      if ((s?.churn_rate ?? 0) > 10) {
        recommendations.push("Ton taux de churn est élevé — lance une séquence win-back pour les fans inactifs");
      }
      if (totalRevenue > 0 && weeklyRevenue < totalRevenue / 4) {
        recommendations.push("Les revenus de cette semaine sont en baisse — relance tes meilleurs segments");
      }
      if (recommendations.length === 0) {
        recommendations.push("Continue à entretenir tes fans whales avec des messages personnalisés");
        recommendations.push("Teste un nouveau canal (push ou SMS) pour diversifier tes touchpoints");
      }

      // Check for KPI alerts
      const alerts: string[] = [];
      if ((s?.churn_rate ?? 0) > 15) alerts.push(`Churn rate élevé : ${s.churn_rate}%`);
      if (weeklyRevenue === 0 && totalRevenue > 0) alerts.push("Aucun revenu cette semaine — campagne nécessaire");
      if ((s?.active_fans ?? 0) < 10) alerts.push("Base fans faible (< 10 actifs) — priorise l'acquisition");

      const report = {
        creator_id: creator.id,
        week_start: startStr,
        week_end: endStr,
        summary: `Bilan du ${startStr} au ${endStr} : ${weeklyRevenue.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })} de revenus générés via Atlas.`,
        top_campaigns: (campaigns ?? []).map((c: any) => ({
          name: c.name,
          channel: c.channel,
          revenue: c.revenue_generated,
        })),
        recommendations,
        kpi_alerts: alerts,
        ai_generated: true,
      };

      // Upsert report
      const { data: existing } = await supabase
        .from("atlas_weekly_reports")
        .select("id")
        .eq("creator_id", creator.id)
        .eq("week_start", startStr)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("atlas_weekly_reports")
          .update(report)
          .eq("id", existing.id);
      } else {
        await supabase
          .from("atlas_weekly_reports")
          .insert(report);
      }

      reports.push({ creator_id: creator.id, week: startStr, revenue: weeklyRevenue });
    }

    return NextResponse.json({
      success: true,
      week: { start: startStr, end: endStr },
      reportsGenerated: reports.length,
      summary: reports,
    });
  } catch (err) {
    console.error("[ATLAS WEEKLY REPORT] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
