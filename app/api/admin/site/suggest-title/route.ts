import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { topic, currentTitle } = await request.json();
    if (!topic && !currentTitle) {
      return NextResponse.json({ error: "Sujet requis" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    const prompt = `Tu es un rédacteur SEO expert. Propose 5 titres d'articles percutants et optimisés SEO pour le sujet suivant : "${topic || currentTitle}".
Retourne UNIQUEMENT un tableau JSON, rien d'autre. Format : ["titre 1", "titre 2", "titre 3", "titre 4", "titre 5"]`;

    if (!apiKey) {
      return NextResponse.json({
        suggestions: [
          `Comment ${(topic || currentTitle).toLowerCase()} peut transformer votre carrière`,
          `Le guide ultime pour ${(topic || currentTitle).toLowerCase()} en 2026`,
          `5 secrets sur ${(topic || currentTitle).toLowerCase()} que personne ne vous dit`,
          `Pourquoi ${(topic || currentTitle).toLowerCase()} est l'avenir du management`,
          `${(topic || currentTitle)} : le guide complet pour les créateurs`,
        ],
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
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await resp.json();
    const suggestions = JSON.parse(data.content?.[0]?.text ?? "[]");
    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({
      suggestions: [
        "L'impact du sujet sur votre stratégie",
        "Guide complet : tout savoir sur le sujet",
        "5 points clés pour maîtriser le sujet",
      ],
    });
  }
}
