import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await req.json();
    const { sections } = body; // array of sections to include: ["overview","revenue","roi","channels"]

    const data: Record<string, any> = {};

    if (!sections || sections.includes("overview")) {
      const { data: stats } = await supabase.rpc("atlas_overview_stats", {
        p_creator_id: user.id,
      });
      data.overview = stats?.[0] ?? {};
    }

    if (!sections || sections.includes("revenue")) {
      const { data: convs } = await supabase
        .from("atlas_analytics_conversions")
        .select("channel, revenue, converted_at")
        .eq("creator_id", user.id)
        .order("converted_at", { ascending: false })
        .limit(100);
      data.revenue = convs ?? [];
    }

    if (!sections || sections.includes("roi")) {
      const m = new Date().toISOString().slice(0, 7) + "-01";
      const { data: roiData } = await supabase.rpc("atlas_calculate_roi", {
        p_creator_id: user.id, p_month: m,
      });
      data.roi = roiData?.[0] ?? {};
    }

    if (!sections || sections.includes("channels")) {
      const { data: channels } = await supabase
        .from("atlas_campaigns")
        .select("name, channel, sent_count, opened_count, clicked_count, converted_count, revenue_generated")
        .eq("creator_id", user.id)
        .limit(50);
      data.channels = channels ?? [];
    }

    // Generate a simple text/HTML report (in production, use a PDF library)
    const reportHtml = generateReportHtml(data, user.email ?? user.id);

    return NextResponse.json({
      success: true,
      html: reportHtml,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[ATLAS ANALYTICS EXPORT] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

function generateReportHtml(data: Record<string, any>, userLabel: string): string {
  const overview = data.overview ?? {};
  const revenue = data.revenue ?? [];
  const roi = data.roi ?? {};
  const channels = data.channels ?? [];

  const eur = (n: number) =>
    (n ?? 0).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Rapport Atlas</title>
<style>
  body { font-family: 'Plus Jakarta Sans', sans-serif; color: #1A1614; background: #F5F0EB; padding: 40px; }
  h1 { font-family: Syne, sans-serif; font-size: 2rem; }
  h2 { font-family: Syne, sans-serif; font-size: 1.2rem; margin-top: 40px; }
  .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 20px 0; }
  .kpi { background: white; padding: 16px; border: 1px solid rgba(26,22,20,0.08); }
  .kpi-label { font-size: 0.7rem; text-transform: uppercase; color: #6B5E54; }
  .kpi-value { font-size: 2rem; font-family: Syne, sans-serif; font-weight: 700; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  th { text-align: left; font-size: 0.7rem; text-transform: uppercase; color: #6B5E54; border-bottom: 1px solid rgba(26,22,20,0.08); padding: 8px; }
  td { padding: 8px; border-bottom: 1px solid rgba(26,22,20,0.04); }
  .footer { margin-top: 60px; font-size: 0.8rem; color: #6B5E54; }
</style>
</head>
<body>
  <h1>Rapport Atlas</h1>
  <p>Généré le ${new Date().toLocaleDateString("fr-FR")} pour ${userLabel}</p>

  <h2>Vue d'ensemble</h2>
  <div class="kpi-grid">
    <div class="kpi"><div class="kpi-label">Fans actifs</div><div class="kpi-value">${overview.active_fans ?? 0}</div></div>
    <div class="kpi"><div class="kpi-label">Revenus totaux</div><div class="kpi-value">${eur(overview.total_revenue)}</div></div>
    <div class="kpi"><div class="kpi-label">ROI</div><div class="kpi-value">${overview.roi_value ?? 0}%</div></div>
  </div>

  <h2>Détail des revenus</h2>
  <table>
    <tr><th>Canal</th><th>Revenu</th></tr>
    ${(revenue as any[]).map((r: any) =>
      `<tr><td>${r.channel}</td><td>${eur(r.revenue)}</td></tr>`
    ).join("")}
  </table>

  <h2>ROI mensuel</h2>
  <div class="kpi-grid">
    <div class="kpi"><div class="kpi-label">Revenus</div><div class="kpi-value">${eur(roi.total_revenue)}</div></div>
    <div class="kpi"><div class="kpi-label">Coûts</div><div class="kpi-value">${eur(roi.total_cost)}</div></div>
    <div class="kpi"><div class="kpi-label">ROI</div><div class="kpi-value">${roi.roi_percent ?? 0}%</div></div>
  </div>

  <h2>Performance par campagne</h2>
  <table>
    <tr><th>Nom</th><th>Canal</th><th>Envoyés</th><th>Ouverts</th><th>Clics</th><th>Revenu</th></tr>
    ${(channels as any[]).map((c: any) =>
      `<tr><td>${c.name}</td><td>${c.channel}</td><td>${c.sent_count ?? 0}</td><td>${c.opened_count ?? 0}</td><td>${c.clicked_count ?? 0}</td><td>${eur(c.revenue_generated)}</td></tr>`
    ).join("")}
  </table>

  <div class="footer">Halo Talent — Rapport généré automatiquement. Données confidentielles.</div>
</body>
</html>`.trim();
}
