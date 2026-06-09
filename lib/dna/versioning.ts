import { createAdminClient } from "@/lib/supabase/server";
import type { CreatorDNA, DNAVersion } from "./types";

// ─── Sauvegarder une version ───

export async function saveVersion(
  creatorId: string,
  dna: CreatorDNA,
): Promise<DNAVersion | null> {
  try {
    const supabase = createAdminClient();

    // Trouver le prochain numéro de version
    const { data: last } = await supabase
      .from("creator_dna_versions")
      .select("version_number")
      .eq("creator_id", creatorId)
      .order("version_number", { ascending: false })
      .limit(1)
      .single();

    const nextVersion = (last?.version_number ?? 0) + 1;

    const { data, error } = await supabase
      .from("creator_dna_versions")
      .insert({
        creator_id: creatorId,
        version_number: nextVersion,
        snapshot: dna,
      })
      .select()
      .single();

    if (error) {
      console.error("[DNA Versioning] Failed to save version:", error);
      return null;
    }

    return data as DNAVersion;
  } catch (err) {
    console.error("[DNA Versioning] Error saving version:", err);
    return null;
  }
}

// ─── Récupérer l'historique des versions ───

export async function getVersionHistory(
  creatorId: string,
  limit = 10,
): Promise<DNAVersion[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("creator_dna_versions")
      .select("*")
      .eq("creator_id", creatorId)
      .order("version_number", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("[DNA Versioning] Failed to get history:", error);
      return [];
    }

    return data as DNAVersion[];
  } catch (err) {
    console.error("[DNA Versioning] Error getting history:", err);
    return [];
  }
}

// ─── Restaurer une version ───

export async function restoreVersion(
  versionId: string,
  creatorId: string,
): Promise<boolean> {
  try {
    const supabase = createAdminClient();

    // Charger la version
    const { data: version, error: fetchError } = await supabase
      .from("creator_dna_versions")
      .select("*")
      .eq("id", versionId)
      .eq("creator_id", creatorId)
      .single();

    if (fetchError || !version) {
      console.error("[DNA Versioning] Version not found:", fetchError);
      return false;
    }

    const snapshot = version.snapshot as CreatorDNA;

    // Restaurer le snapshot dans creator_dna
    const { error: updateError } = await supabase
      .from("creator_dna")
      .update({
        section_1: snapshot.section_1,
        section_2: snapshot.section_2,
        section_3: snapshot.section_3,
        section_4: snapshot.section_4,
        section_5: snapshot.section_5,
        section_6: snapshot.section_6,
        section_7: snapshot.section_7,
        section_8: snapshot.section_8,
        voice_profile: snapshot.voice_profile,
        style_profile: snapshot.style_profile,
        audience_profile: snapshot.audience_profile,
        voice_embedding: snapshot.voice_embedding,
        style_embedding: snapshot.style_embedding,
        is_complete: snapshot.is_complete,
        completion_pct: snapshot.completion_pct,
        last_updated_section: snapshot.last_updated_section,
      })
      .eq("creator_id", creatorId);

    if (updateError) {
      console.error("[DNA Versioning] Failed to restore version:", updateError);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[DNA Versioning] Error restoring version:", err);
    return false;
  }
}
