import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { title, content } = await request.json();
    if (!title) return NextResponse.json({ error: "Titre requis" }, { status: 400 });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    const prompt = `À partir du titre et du contenu d'un article, suggère 5 tags pertinents pour le référencement.
Titre : "${title}"
Contenu : "${(content ?? "").slice(0, 300)}..."

Retourne UNIQUEMENT un tableau JSON de tags, rien d'autre. Format : ["tag1", "tag2", "tag3", "tag4", "tag5"]`;

    if (!apiKey) {
      return NextResponse.json({
        tags: ["management", "créateurs", "tendances", "stratégie", "conseils"],
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
        max_tokens: 512,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await resp.json();
    const tags = JSON.parse(data.content?.[0]?.text ?? "[]");
    return NextResponse.json({ tags });
  } catch {
    return NextResponse.json({ tags: ["management", "créateurs", "conseils"] });
  }
}
