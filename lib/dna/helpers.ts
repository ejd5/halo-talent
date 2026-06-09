import { createClient } from "@/lib/supabase/server";
import type { CreatorDNA, DNASection, DNAStatusResponse } from "./types";
import { ALL_SECTIONS } from "./types";

// ─── Récupération ADN (mode dégradé : retourne null si pas de ligne ou pas complété) ───

export async function getCreatorDNA(
  creatorId: string,
): Promise<CreatorDNA | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("creator_dna")
      .select(
        "id, creator_id, section_1, section_2, section_3, section_4, section_5, section_6, section_7, section_8, voice_profile, style_profile, audience_profile, voice_embedding, style_embedding, is_complete, completion_pct, last_updated_section, created_at, updated_at",
      )
      .eq("creator_id", creatorId)
      .single();

    if (error || !data) return null;
    return data as CreatorDNA;
  } catch {
    return null;
  }
}

// ─── Injection ADN dans un prompt ───

export function injectDNAIntoPrompt(
  prompt: string,
  dna: CreatorDNA | null,
): string {
  if (!dna?.is_complete || !dna.voice_profile) return prompt;

  const vp = dna.voice_profile;
  const sp = dna.style_profile;
  const ap = dna.audience_profile;

  const parts: string[] = [prompt];

  parts.push(`

═══ CONTEXTE ADN DU CRÉATEUR ═══
Ce créateur a un ADN unique que tu dois IMPÉRATIVEMENT respecter dans toutes tes générations.

── VOICE PROFILE ──
Tonalité : formality=${vp.tone.formality}% · humor=${vp.tone.humor}% · warmth=${vp.tone.warmth}% · boldness=${vp.tone.boldness}%
Énergie : ${vp.energy_level}
Phrases fétiches : ${vp.vocabulary.signature_phrases.join(", ") || "aucune"}
Mots favoris : ${vp.vocabulary.favorite_words.join(", ") || "aucun"}
Mots interdits : ${vp.vocabulary.banned_words.join(", ") || "aucun"}
Emojis : ${vp.vocabulary.emoji_usage === "never" ? "NE JAMAIS utiliser d'emojis" : `${vp.vocabulary.emoji_usage} · signature : ${vp.vocabulary.signature_emojis.join(" ")}`}
Longueur de phrases : ${vp.writing_style.sentence_length}
Style de ponctuation : ${vp.writing_style.punctuation_style}
Pronoms : ${vp.writing_style.personal_pronouns}
Formule de fin : "${vp.vocabulary.sign_off}"

Personnalité : ${vp.personality_traits.join(" · ")}

Traits de personnalité : ${vp.personality_traits.join(", ")}
Résumé communication : ${vp.communication_dna_summary}`);

  if (sp) {
    parts.push(`
── STYLE PROFILE ──
Univers visuel : ${sp.visual_universe}
Couleurs dominantes : ${sp.dominant_colors.join(", ")}
Style photo : ${sp.photography_style}
Ambiance retouche : ${sp.editing_vibe}
Éléments signature : ${sp.signature_elements.join(", ")}
Sources d'inspiration : ${sp.inspiration_sources.join(", ")}
Catégories de contenu : ${sp.content_categories.join(", ")}`);
  }

  if (ap) {
    parts.push(`
── AUDIENCE PROFILE ──
Tranche d'âge : ${ap.primary_demographic.age_range}
Genre : ${ap.primary_demographic.gender_skew}
Localisation : ${ap.primary_demographic.location}
Langue : ${ap.primary_demographic.language}
Meilleur moment pour poster : ${ap.engagement_patterns.best_time_to_post}
Types de contenu préférés : ${ap.engagement_patterns.best_content_types.join(", ")}
Vibe communauté : ${ap.engagement_patterns.community_vibe}`);
  }

  parts.push(`
RÈGLES :
- Imite EXACTEMENT le ton, le vocabulaire et la longueur de phrases ci-dessus
- Utilise les emojis selon les préférences (${vp.vocabulary.emoji_usage === "never" ? "JAMAIS d'emoji" : "oui, avec modération"})
- Évite ABSOLUMENT les mots interdits listés
- Reste cohérent avec l'énergie : "${vp.energy_level}"
- Si tu hésites entre deux options, choisis celle qui colle au "communication_dna_summary"`);

  return parts.join("\n");
}

// ─── Helpers ───

export function isDNAComplete(dna: CreatorDNA | null): boolean {
  return dna?.is_complete === true;
}

export function getDNAMissingSections(dna: CreatorDNA | null): DNASection[] {
  if (!dna) return [...ALL_SECTIONS];
  return ALL_SECTIONS.filter((s) => {
    const key = `section_${s}` as keyof CreatorDNA;
    return !dna[key];
  });
}

export function getDNAFilledSections(dna: CreatorDNA | null): DNASection[] {
  if (!dna) return [];
  return ALL_SECTIONS.filter((s) => {
    const key = `section_${s}` as keyof CreatorDNA;
    return dna[key] != null;
  });
}

export function computeCompletionPct(
  filledSections: DNASection[],
): number {
  return Math.round((filledSections.length / ALL_SECTIONS.length) * 100);
}

export function buildDNAStatusResponse(
  dna: CreatorDNA | null,
  studioAccess: boolean,
): DNAStatusResponse {
  const filledSections = getDNAFilledSections(dna);
  const missingSections = getDNAMissingSections(dna);
  return {
    exists: dna != null,
    is_complete: dna?.is_complete ?? false,
    completion_pct: dna?.completion_pct ?? 0,
    last_updated_section: dna?.last_updated_section ?? null,
    sections_filled: filledSections,
    sections_missing: missingSections,
    studio_access: studioAccess,
  };
}
