import { createAdminClient } from "@/lib/supabase/server";
import {
  buildVoiceProfilePrompt,
  buildStyleProfilePrompt,
  buildAudienceProfilePrompt,
  buildMockVoiceProfile,
  buildMockStyleProfile,
  buildMockAudienceProfile,
} from "./prompts";
import { saveVersion } from "./versioning";
import type { CreatorDNA, VoiceProfile, StyleProfile, AudienceProfile, FinalizeResponse } from "./types";

// ─── Appel Claude (fetch direct, pattern existant du projet) ───

async function callClaude(prompt: string): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      console.error("[DNA Finalizer] Claude API error:", response.status, await response.text());
      return null;
    }

    const data = await response.json();
    return data.content?.[0]?.text ?? null;
  } catch (err) {
    console.error("[DNA Finalizer] Claude request failed:", err);
    return null;
  }
}

// ─── Embeddings via OpenAI API (fetch direct) ───

async function generateEmbedding(text: string): Promise<number[] | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.log("[DNA Finalizer] No OPENAI_API_KEY, skipping embeddings");
    return null;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: text,
      }),
    });

    if (!response.ok) {
      console.error("[DNA Finalizer] OpenAI embedding error:", response.status, await response.text());
      return null;
    }

    const data = await response.json();
    return data.data?.[0]?.embedding ?? null;
  } catch (err) {
    console.error("[DNA Finalizer] Embedding request failed:", err);
    return null;
  }
}

// ─── Génération des profils IA ───

async function generateProfile<T>(
  promptBuilder: (...args: any[]) => string,
  mockBuilder: () => T,
  ...sections: (Record<string, unknown> | null | undefined)[]
): Promise<T> {
  const hasData = sections.some((s) => s != null && Object.keys(s).length > 0);
  if (!hasData) return mockBuilder();

  const raw = await callClaude(promptBuilder(...sections));

  if (!raw) {
    console.log("[DNA Finalizer] Claude unavailable, using mock profile");
    return mockBuilder();
  }

  try {
    // Extract JSON from response (handle cases where Claude wraps in markdown)
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch?.[0] ?? raw;
    return JSON.parse(jsonStr) as T;
  } catch {
    console.error("[DNA Finalizer] Failed to parse Claude response, using mock");
    return mockBuilder();
  }
}

// ─── Notifier le créateur ───

async function notifyStudioUnlocked(creatorId: string) {
  try {
    const supabase = createAdminClient();
    await supabase.from("notifications").insert({
      user_id: creatorId,
      type: "studio_unlocked",
      title: "Votre Studio est prêt",
      message:
        "Vos agents IA connaissent maintenant votre ADN. Commencez à créer.",
      link: "/dashboard/studio",
    });
  } catch (err) {
    console.error("[DNA Finalizer] Failed to send notification:", err);
  }
}

// ─── Pipeline de finalisation ───

export async function finalizeDNA(
  creatorId: string,
): Promise<FinalizeResponse> {
  try {
    const supabase = createAdminClient();

    // 1. Charger toutes les sections
    const { data: dna, error: fetchError } = await supabase
      .from("creator_dna")
      .select("*")
      .eq("creator_id", creatorId)
      .single();

    if (fetchError || !dna) {
      return {
        success: false,
        error: "ADN introuvable pour ce créateur. Complétez d'abord les sections.",
      };
    }

    // 2. Générer les profils (mock si Claude indisponible)
    const [voiceProfile, styleProfile, audienceProfile] = await Promise.all([
      generateProfile<VoiceProfile>(
        buildVoiceProfilePrompt,
        buildMockVoiceProfile,
        dna.section_1,
        dna.section_2,
      ),
      generateProfile<StyleProfile>(
        buildStyleProfilePrompt,
        buildMockStyleProfile,
        dna.section_4,
        dna.section_5,
      ),
      generateProfile<AudienceProfile>(
        buildAudienceProfilePrompt,
        buildMockAudienceProfile,
        dna.section_3,
      ),
    ]);

    // 3. Générer les embeddings (non-bloquant)
    const voiceText = JSON.stringify(voiceProfile);
    const styleText = JSON.stringify(styleProfile);

    const [voiceEmbedding, styleEmbedding] = await Promise.all([
      generateEmbedding(voiceText),
      generateEmbedding(styleText),
    ]);

    // 4. Mettre à jour creator_dna avec profils + embeddings
    const updates: Record<string, unknown> = {
      voice_profile: voiceProfile,
      style_profile: styleProfile,
      audience_profile: audienceProfile,
      is_complete: true,
      completion_pct: 100,
    };

    if (voiceEmbedding) updates.voice_embedding = voiceEmbedding;
    if (styleEmbedding) updates.style_embedding = styleEmbedding;

    const { error: updateError } = await supabase
      .from("creator_dna")
      .update(updates)
      .eq("creator_id", creatorId);

    if (updateError) {
      console.error("[DNA Finalizer] DB update error:", updateError);
      return { success: false, error: "Erreur lors de la sauvegarde des profils" };
    }

    // 5. Lire le dna à jour pour le snapshot
    const { data: updatedDna } = await supabase
      .from("creator_dna")
      .select("*")
      .eq("creator_id", creatorId)
      .single();

    // 6. Sauvegarder une version
    if (updatedDna) {
      await saveVersion(creatorId, updatedDna as CreatorDNA);
    }

    // 7. Débloquer le Studio
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        studio_access: true,
        dna_completed: true,
        onboarding_completed_at: new Date().toISOString(),
      })
      .eq("id", creatorId);

    if (profileError) {
      console.error("[DNA Finalizer] Profile update error:", profileError);
    }

    // 8. Notification
    await notifyStudioUnlocked(creatorId);

    return {
      success: true,
      voice_profile: voiceProfile,
      style_profile: styleProfile,
      audience_profile: audienceProfile,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    console.error("[DNA Finalizer] Pipeline failed:", err);
    return { success: false, error: message };
  }
}
