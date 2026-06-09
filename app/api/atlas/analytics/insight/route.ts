import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { data: stats } = await supabase.rpc("atlas_overview_stats", {
      p_creator_id: user.id,
    });

    const s = stats?.[0];
    if (!s) return NextResponse.json({ insight: null });

    const revenue = Number(s.total_revenue ?? 0);
    const cost = Number(s.total_cost ?? 0);
    const roi = cost > 0 ? ((revenue - cost) / cost * 100).toFixed(1) : "0";
    const fans = s.active_fans ?? 0;
    const newFans = s.new_fans_30d ?? 0;
    const ltv = Number(s.avg_ltv ?? 0);

    // Generate insight text based on actual data
    let insight = "";

    if (revenue === 0 && fans === 0) {
      insight = "Bienvenue dans Atlas Analytics ! Commence par importer tes fans et lancer ta première campagne pour voir tes premiers résultats.";
    } else if (revenue === 0) {
      insight = `Tu as ${fans} fans actifs mais aucun revenu attribué via Atlas. Active le tracking des conversions dans les paramètres pour mesurer ton ROI.`;
    } else if (roi && parseFloat(roi) > 100) {
      insight = `Atlas a généré ${revenue.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })} avec un ROI de ${roi}%. Tes campagnes performantes méritent d'être scaling — augmente tes envois.`;
    } else if (roi && parseFloat(roi) > 0) {
      insight = `Atlas génère ${revenue.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })} avec un ROI de ${roi}%. Pour améliorer, teste des segments plus précis et des follow-up automatisés.`;
    } else {
      insight = `Tu as ${fans} fans actifs (dont ${newFans} nouveaux ce mois) avec un LTV moyen de ${ltv.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}. Continue à développer ta base fans.`;
    }

    return NextResponse.json({ insight });
  } catch (err) {
    console.error("[ATLAS ANALYTICS INSIGHT] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
