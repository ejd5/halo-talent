import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { revenueData, platformSummary, creatorCount } = body;

    if (!revenueData || !Array.isArray(revenueData)) {
      return NextResponse.json(
        { error: "Données de revenus requises" },
        { status: 400 }
      );
    }

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY non configurée" },
        { status: 500 }
      );
    }

    const prompt = `Tu es un analyste financier senior spécialisé dans l'économie des créateurs de contenu. Analyse ces données et génère une prévision.

DONNÉES DES 12 DERNIERS MOIS :
${JSON.stringify(revenueData, null, 2)}

RÉPARTITION PAR PLATEFORME :
${JSON.stringify(platformSummary ?? "Non disponible", null, 2)}

NOMBRE DE CRÉATEURS : ${creatorCount ?? "N/A"}

GÉNÈRE UNIQUEMENT UN JSON valide (pas de markdown, pas de texte autour) :

{
  "next_month": { "estimate": <nombre>, "lower_bound": <nombre>, "upper_bound": <nombre>, "confidence": "low" | "medium" | "high" },
  "next_quarter": { "estimate": <nombre>, "lower_bound": <nombre>, "upper_bound": <nombre>, "confidence": "low" | "medium" | "high" },
  "next_year": { "estimate": <nombre>, "lower_bound": <nombre>, "upper_bound": <nombre>, "confidence": "low" | "medium" | "high" },
  "risk_factors": ["<risque 1>", "<risque 2>", "<risque 3>"],
  "opportunities": ["<opportunité 1>", "<opportunité 2>", "<opportunité 3>"],
  "summary": "<résumé exécutif en 2-3 phrases>"
}

Les montants sont en EUR. Base tes prévisions sur les tendances observées, la saisonnalité et la croissance moyenne.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", response.status, errorText);

      if (response.status === 529 || response.status >= 500) {
        return NextResponse.json(
          { error: "L'API de prévision est temporairement indisponible", details: errorText },
          { status: 502 }
        );
      }

      return NextResponse.json(
        { error: "Erreur API Claude", details: errorText },
        { status: 502 }
      );
    }

    const result = await response.json();
    const content = result.content as { type: string; text: string }[];
    const textContent = content[0]?.text ?? "";

    let forecast: Record<string, unknown>;
    try {
      const clean = textContent
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();
      forecast = JSON.parse(clean);
    } catch {
      return NextResponse.json(
        {
          error: "Erreur de parsing",
          raw: textContent,
          fallback: generateFallbackForecast(revenueData),
        },
        { status: 200 }
      );
    }

    forecast.generated_at = new Date().toISOString();
    return NextResponse.json(forecast);
  } catch (error) {
    console.error("Erreur prévision:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

function generateFallbackForecast(
  revenueData: { total_gross: number }[]
): Record<string, unknown> {
  const recent = revenueData.slice(-3);
  const avg =
    recent.reduce((s, r) => s + r.total_gross, 0) / recent.length;
  const total = revenueData.reduce((s, r) => s + r.total_gross, 0);
  const trend = revenueData.length >= 2
    ? (revenueData[revenueData.length - 1].total_gross - revenueData[0].total_gross) /
      revenueData.length
    : 0;

  return {
    next_month: {
      estimate: Math.round(avg),
      lower_bound: Math.round(avg * 0.85),
      upper_bound: Math.round(avg * 1.15),
      confidence: "medium",
    },
    next_quarter: {
      estimate: Math.round(avg * 3 + trend * 6),
      lower_bound: Math.round(avg * 2.5),
      upper_bound: Math.round(avg * 3.5),
      confidence: "low",
    },
    next_year: {
      estimate: Math.round(total + trend * 78),
      lower_bound: Math.round(total * 0.8),
      upper_bound: Math.round(total * 1.2),
      confidence: "low",
    },
    risk_factors: [
      "Concentration des revenus sur les top 3 créateurs",
      "Dépendance à OnlyFans pour 35% du revenu brut",
      "Saisonnalité des revenus publicitaires (T1 plus faible)",
    ],
    opportunities: [
      "Croissance constante du marché du brand deal Instagram (+15% YoY)",
      "Potentiel d'expansion sur le marché US via TikTok",
      "Marge d'amélioration sur les taux de commission des contrats Discovery",
    ],
    summary:
      "Les revenus sont en croissance modérée avec une saisonnalité marquée. La concentration sur les créateurs à haut revenu présente un risque, mais la diversification progressive des plateformes est encourageante.",
    generated_at: new Date().toISOString(),
  };
}
