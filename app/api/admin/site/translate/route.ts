import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang } = await request.json();
    if (!text) return NextResponse.json({ error: "Texte requis" }, { status: 400 });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      // Fallback mock translation
      const mockTranslations: Record<string, string> = {
        en: `[English] ${text}`,
        es: `[Español] ${text}`,
      };
      return NextResponse.json({ translated: mockTranslations[targetLang] ?? text });
    }

    const langNames: Record<string, string> = { en: "English", es: "Spanish" };
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [{
          role: "user",
          content: `Translate the following text to ${langNames[targetLang] ?? targetLang}. Preserve all markdown formatting and structure. Return ONLY the translated text, no explanations.\n\n${text}`,
        }],
      }),
    });

    const data = await resp.json();
    return NextResponse.json({ translated: data.content?.[0]?.text ?? text });
  } catch {
    return NextResponse.json({ error: "Erreur de traduction" }, { status: 500 });
  }
}
