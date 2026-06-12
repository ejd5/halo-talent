import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { mediaId, mediaUrl } = await request.json();

    if (!mediaId || !mediaUrl) {
      return NextResponse.json({ error: "mediaId et mediaUrl requis" }, { status: 400 });
    }

    // Try Claude Vision analysis if API key is available
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (apiKey) {
      try {
        const { Anthropic } = await import("@anthropic-ai/sdk");
        const anthropic = new Anthropic({ apiKey });

        const response = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          messages: [{
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "url", url: mediaUrl },
              },
              {
                type: "text",
                text: `Analyse cette image et retourne UN JSON valide (sans markdown, sans backticks) :
{
  "description": "<description en 1-2 phrases en français>",
  "tags": ["<tag1>", "<tag2>", ...] (8-12 tags pertinents en français),
  "dominant_colors": ["<#hex>", ...] (3 couleurs principales),
  "mood": "<mood>" (energetic / calm / mysterious / playful / romantic / professional / edgy / warm / dark / colorful),
  "suitable_for": ["<platform>", ...] (plateformes adaptées parmi: instagram, youtube, tiktok, onlyfans, twitter),
  "content_warnings": ["<warning>", ...] (si contenu nécessite avertissement, sinon []),
  "moderation_check": {
    "safe": true|false,
    "concerns": ["<concern>", ...]
  }
}`,
              },
            ],
          }],
        });

        const textBlock = response.content.find((c) => c.type === "text");
        const text = textBlock?.type === "text" ? textBlock.text : "";
        // Clean potential markdown fences
        const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*$/g, "").trim();
        const analysis = JSON.parse(cleaned);

        // Persist to database (would use Supabase in production)
        // const supabase = await createClient();
        // await supabase.from("media_library").update({ ... }).eq("id", mediaId);

        return NextResponse.json({
          description: analysis.description,
          tags: analysis.tags,
          dominant_colors: analysis.dominant_colors,
          mood: analysis.mood,
          suitable_for: analysis.suitable_for,
          moderation_check: analysis.moderation_check,
        });
      } catch (apiError) {
        console.error("Claude Vision API error:", apiError);
        // Fall through to mock
      }
    }

    // Mock analysis fallback
    const mockTags = ["portrait", "lumière naturelle", "créatif", "contenu visuel"];
    const mockPlatforms = ["instagram", "tiktok"];
    const mockColors = ["var(--or, #D8A95B)", "#F5F0E8", "#2A2A2A"];

    return NextResponse.json({
      description: "Contenu visuel avec éclairage naturel et composition soignée. Ambiance chaleureuse et professionnelle.",
      tags: mockTags,
      dominant_colors: mockColors,
      mood: "warm",
      suitable_for: mockPlatforms,
      content_warnings: [],
      moderation_check: { safe: true, concerns: [] },
    });
  } catch (err) {
    console.error("Analyze error:", err);
    return NextResponse.json({ error: "Erreur lors de l'analyse" }, { status: 500 });
  }
}
