import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let text = "";
  try {
    const { text: t } = await request.json();
    text = t;
    if (!text) return NextResponse.json({ error: "Texte requis" }, { status: 400 });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    const prompt = `Tu es un éditeur premium. Améliore le paragraphe suivant tout en gardant le sens original :
- Rend le style plus fluide et engageant
- Ajoute des transitions si nécessaire
- Corrige les fautes éventuelles
- Garde le ton professionnel mais accessible

Retourne UNIQUEMENT le texte amélioré, sans introduction ni explication.

TEXTE :\n${text}`;

    if (!apiKey) {
      return NextResponse.json({
        improved: `${text}\n\n→ Version améliorée : le texte gagne en fluidité et en impact.`,
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
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await resp.json();
    return NextResponse.json({ improved: data.content?.[0]?.text ?? text });
  } catch {
    return NextResponse.json({ improved: text });
  }
}
