import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let title = "";
  try {
    const { title: t, content } = await request.json();
    title = t;
    if (!title) return NextResponse.json({ error: "Titre requis" }, { status: 400 });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    const prompt = `Génère les métadonnées SEO pour un article de blog avec :
Titre : "${title}"
Contenu : "${(content ?? "").slice(0, 500)}..."

Retourne UNIQUEMENT un objet JSON strict au format :
{
  "seo_title": "titre optimisé max 60 caractères",
  "seo_description": "description max 160 caractères"
}`;

    if (!apiKey) {
      return NextResponse.json({
        seo_title: title.slice(0, 60),
        seo_description: `Découvrez ${title.toLowerCase()} - Un article Halo Talent sur le management créatif.`,
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
    const seo = JSON.parse(data.content?.[0]?.text ?? "{}");
    return NextResponse.json(seo);
  } catch {
    return NextResponse.json({
      seo_title: title.slice(0, 60),
      seo_description: "Article Halo Talent",
    });
  }
}
