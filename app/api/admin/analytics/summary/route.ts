import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        summary: "Cette semaine, vos revenus ont augmenté de 12% (62 340€ vs 55 670€). Trois créateurs sont en forte croissance : Marc T. (+45%), Léa R. (+38%), Inès D. (+22%). Le taux de rétention à 6 mois est stable à 89%.",
        generated_at: new Date().toISOString(),
      });
    }

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `Génère un résumé exécutif hebdomadaire pour l'agence Halo Talent. Données actuelles :
- 21 créateurs actifs, 18 actifs, 3 inactifs
- Revenus totaux : 468 000€ brut, 385 600€ net
- Top créateur : Clara W. (42 500€/mois)
- Croissance : Marc T. +45%, Léa R. +38%, Inès D. +22%
- Baisses : Emma V. -28%
- Rétention 6 mois : 89%
- CAC moyen : 420€
- Conversion site : 3.8%

Format : 3-4 phrases concises en français, style naturel et professionnel. Inclus recommandation.`,
        }],
      }),
    });

    const data = await resp.json();
    const text = data.content?.[0]?.text ?? "Résumé non disponible";

    return NextResponse.json({ summary: text, generated_at: new Date().toISOString() });
  } catch {
    return NextResponse.json({
      summary: "Résumé non disponible pour le moment.",
      generated_at: new Date().toISOString(),
    });
  }
}
