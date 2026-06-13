import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * OnlyFans / MYM / Fansly, Pas d'API publique.
 *
 * SOLUTIONS :
 * 1. Saisie manuelle : le créateur entre ses revenus mensuels dans le dashboard
 * 2. Saisie manager : l'admin/metteur entre les chiffres pour le créateur
 * 3. Browser extension : (future) scraping avec consentement explicite
 *
 * NE JAMAIS demander les credentials OnlyFans du créateur.
 * Le scraping sans autorisation explicite est illégal.
 */

export async function POST(request: NextRequest) {
  try {
    const { creatorId, platform, grossRevenue, commissionRate, month, notes } = await request.json();

    if (!creatorId || !platform || !grossRevenue || !month) {
      return NextResponse.json(
        { error: "creatorId, platform, grossRevenue et month requis" },
        { status: 400 }
      );
    }

    if (!["onlyfans", "mym", "fansly", "reveal"].includes(platform)) {
      return NextResponse.json({ error: "Plateforme non supportée" }, { status: 400 });
    }

    const rate = commissionRate || 15;
    const commission = grossRevenue * (rate / 100);
    const net = grossRevenue - commission;

    const supabase = createAdminClient();

    // Mettre à jour le compte créateur
    await supabase.from("creator_accounts").upsert(
      {
        creator_id: creatorId,
        platform,
        platform_data: {
          notes: notes || null,
          last_sync: new Date().toISOString(),
          manual_entry: true,
        },
      },
      { onConflict: "creator_id, platform" }
    );

    // Ajouter ou mettre à jour la ligne de revenu mensuel
    const monthDate = new Date(month + "-01").toISOString().slice(0, 10);

    const { error: revenueError } = await supabase.from("monthly_revenues").upsert(
      {
        creator_id: creatorId,
        platform,
        month: monthDate,
        gross_revenue: grossRevenue,
        agency_commission: commission,
        net_to_creator: net,
        commission_rate: rate,
      },
      { onConflict: "creator_id, platform, month" }
    );

    if (revenueError) {
      console.error("Erreur sauvegarde revenu:", revenueError);
      return NextResponse.json({ error: "Erreur lors de l'enregistrement" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        platform,
        month: monthDate,
        gross: grossRevenue,
        commission,
        net,
        rate,
      },
    });
  } catch (error: any) {
    console.error("Erreur sync manuelle:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
