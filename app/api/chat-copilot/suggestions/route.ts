import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  buildSuggestionPrompt,
  parseSuggestionResponse,
  getContextualMockSuggestions,
} from "@/lib/chat-copilot/suggestion-engine";
import type { SuggestionSet } from "@/lib/chat-copilot/types";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { fanId, messages, fanBrain } = await request.json();

  if (!fanId || !fanBrain) {
    return NextResponse.json(
      { error: "fanId et fanBrain requis" },
      { status: 400 },
    );
  }

  try {
    // Try loading creator DNA for context (graceful fallback)
    let dnaContext: string | null = null;
    try {
      const { data: dna } = await supabase
        .from("creator_dna")
        .select("voice_profile, section_6")
        .eq("creator_id", user.id)
        .single();
      dnaContext = dna?.voice_profile
        ? `Style: tonalité ${JSON.stringify((dna.voice_profile as Record<string, unknown>).tone)}, énergie: ${(dna.voice_profile as Record<string, unknown>).energy_level}`
        : null;
    } catch {
      // Graceful fallback, continue without DNA context
    }

    const prompt = buildSuggestionPrompt(fanBrain, messages || [], dnaContext);

    // Call DeepSeek via existing AI chat infra
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/ai/chat`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          systemPrompt:
            "Tu es un assistant de messagerie. Génère UNIQUEMENT du JSON valide, pas de texte avant/après.",
        }),
      },
    );

    if (!response.ok) {
      // Fallback to mock suggestions on API failure
      const fallback = getContextualMockSuggestions(fanBrain);
      return NextResponse.json(fallback);
    }

    const data = await response.json();
    const aiText = data.message || "";

    // Try parsing AI response
    const parsed = parseSuggestionResponse(aiText);
    if (parsed) {
      return NextResponse.json(parsed);
    }

    // If AI response is not valid JSON, try to extract JSON from it
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const extracted = parseSuggestionResponse(jsonMatch[0]);
      if (extracted) return NextResponse.json(extracted);
    }

    // Fallback
    const fallback = getContextualMockSuggestions(fanBrain);
    return NextResponse.json(fallback);
  } catch {
    const fallback = getContextualMockSuggestions(fanBrain);
    return NextResponse.json(fallback);
  }
}
