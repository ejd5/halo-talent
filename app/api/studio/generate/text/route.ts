import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCreatorDNA } from "@/lib/dna/helpers";
import { checkCredits, deductCredits, logGeneration } from "@/lib/studio/credits";

const PLATFORM_LIMITS: Record<string, number> = {
  instagram_caption: 2200, instagram_story: 200, tiktok_caption: 2200,
  twitter: 280, youtube_description: 5000, linkedin: 3000,
  threads: 500, onlyfans_post: 10000, mym_post: 10000, fansly_post: 10000,
};

const CONTENT_TYPE_LABELS: Record<string, string> = {
  caption: "caption Instagram", tweet: "tweet", thread_tweet: "tweet de thread",
  youtube_description: "description YouTube", story: "story Instagram",
  dm_reply: "réponse DM", linkedin_post: "post LinkedIn",
  tiktok_caption: "caption TikTok", onlyfans_post: "post OnlyFans", general: "texte",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { brief, type, platform, tone, length, count = 3 } = body;

    if (!brief || !type) {
      return NextResponse.json({ error: "brief et type requis" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const creditsNeeded = count;
    const creditCheck = await checkCredits(supabase, user.id, creditsNeeded, "generate_text");
    if (!creditCheck.allowed) {
      return NextResponse.json({
        error: creditCheck.message || "Crédits insuffisants",
        credits_available: creditCheck.credits_available ?? 0,
        credits_needed: creditCheck.credits_needed ?? creditsNeeded,
        cta: creditCheck.cta,
      }, { status: 402 });
    }

    const dna = await getCreatorDNA(user.id).catch(() => null);
    const voiceProfile = dna?.voice_profile || null;

    const contentType = CONTENT_TYPE_LABELS[type] || "texte";
    const maxLength = PLATFORM_LIMITS[type] || 500;

    const bannedWords = (voiceProfile as any)?.vocabulary?.banned_words?.join(", ") || "aucun";
    const signOff = (voiceProfile as any)?.vocabulary?.sign_off || null;
    const emojiStyle = (voiceProfile as any)?.vocabulary?.emoji_usage || "modéré";
    const signatureEmojis = (voiceProfile as any)?.vocabulary?.signature_emojis || [];

    const prompt = `Génère ${count} variations de ${contentType} pour la plateforme ${platform}.

BRIEF : ${brief}
TON : ${tone || "naturel"}
LONGUEUR CIBLE : ${length || "moyenne"} (${maxLength} caractères max)

ADN DU CRÉATEUR — VOICE PROFILE :
${JSON.stringify(voiceProfile, null, 2)}

INSTRUCTIONS DE STYLE :
- Respecte EXACTEMENT la voice du créateur (ton, vocabulaire, structure de phrases)
- Utilise les emojis de manière ${emojiStyle}${signatureEmojis.length ? ` — emojis signature : ${signatureEmojis.join(" ")}` : ""}
- ÉVITE ces mots et expressions : ${bannedWords}
${signOff ? `- Termine par une variante de : "${signOff}"` : ""}
- Écris dans un français naturel et authentique

Pour chaque variation, propose un angle DIFFÉRENT :
- Variation 1 : Approche authentique / vulnérable (ce qui marche le mieux sur les réseaux)
- Variation 2 : Approche storytelling / narrative
- Variation 3 : Approche directe / call-to-action

Retourne UNIQUEMENT un JSON valide (pas de markdown, pas de texte autour) :
{
  "variations": [
    {
      "angle": "titre de l'angle",
      "text": "contenu généré",
      "estimated_engagement_score": <0-100>,
      "hashtags_suggested": ["tag1", "tag2"]
    }
  ]
}`;

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) {
      return NextResponse.json({ error: "API key non configurée" }, { status: 500 });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[GENERATE TEXT] Claude API error:", errText);
      return NextResponse.json({ error: "Erreur de génération IA" }, { status: 502 });
    }

    const claudeData = await response.json();
    const content = claudeData.content?.[0]?.text || "";

    let result: { variations: any[] };
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch {
      return NextResponse.json({ error: "Erreur de parsing de la réponse", raw: content }, { status: 502 });
    }

    const remaining = await deductCredits(supabase, user.id, creditsNeeded);
    await logGeneration(supabase, {
      creator_id: user.id, action: "generate_text", credits_used: creditsNeeded,
      provider: "anthropic", model: "claude-sonnet-4-20250514",
      prompt: `[${type}] ${brief?.slice(0, 200)}`, status: "success",
    });

    const { error: aiGenError } = await supabase.from("ai_generations").insert({
      creator_id: user.id, type: "text", subtype: type,
      input: { brief, type, platform, tone, length }, output: result,
      credits_used: creditsNeeded, created_at: new Date().toISOString(),
    });
    if (aiGenError) console.error("[TEXT GEN] ai_generations error:", aiGenError);

    return NextResponse.json({
      variations: result.variations || [],
      credits_used: creditsNeeded,
      credits_remaining: remaining,
      model: "claude-sonnet-4-20250514",
    });
  } catch (err) {
    console.error("[GENERATE TEXT] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
