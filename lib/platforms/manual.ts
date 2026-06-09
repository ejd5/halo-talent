import { createAdminClient } from "@/lib/supabase/server";
import type { PlatformType } from "@/lib/studio/types";

export type ManualPlatform = "onlyfans" | "mym" | "fansly";

interface ManualPublishParams {
  creator_id: string;
  platform: ManualPlatform;
  content: {
    caption: string;
    media_urls: string[];
    ppv_price?: number;
    ppv_message?: string;
  };
  scheduled_for: string;
}

interface ManualPublication {
  id: string;
  creator_id: string;
  platform: ManualPlatform;
  content: {
    caption: string;
    media_urls: string[];
    ppv_price?: number;
    ppv_message?: string;
  };
  scheduled_for: string;
  published_at: string | null;
  status: "scheduled" | "copied" | "published" | "cancelled";
  created_at: string;
}

export class ManualPublicationPreparer {
  /**
   * Prépare le contenu et crée une entrée pour publication manuelle
   */
  async prepare(params: ManualPublishParams): Promise<ManualPublication> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("manual_publications")
      .insert({
        creator_id: params.creator_id,
        platform: params.platform,
        content: params.content,
        scheduled_for: params.scheduled_for,
        status: "scheduled",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  /**
   * Récupère une publication manuelle
   */
  async getById(id: string, creatorId: string): Promise<ManualPublication | null> {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("manual_publications")
      .select("*")
      .eq("id", id)
      .eq("creator_id", creatorId)
      .single();
    return data;
  }

  /**
   * Marque comme copié (caption copiée dans le presse-papier)
   */
  async markCopied(id: string, creatorId: string): Promise<void> {
    const supabase = createAdminClient();
    await supabase
      .from("manual_publications")
      .update({ status: "copied" })
      .eq("id", id)
      .eq("creator_id", creatorId);
  }

  /**
   * Marque comme publié
   */
  async markPublished(id: string, creatorId: string): Promise<void> {
    const supabase = createAdminClient();
    await supabase
      .from("manual_publications")
      .update({ status: "published", published_at: new Date().toISOString() })
      .eq("id", id)
      .eq("creator_id", creatorId);
  }

  /**
   * Annule une publication manuelle
   */
  async cancel(id: string, creatorId: string): Promise<void> {
    const supabase = createAdminClient();
    await supabase
      .from("manual_publications")
      .update({ status: "cancelled" })
      .eq("id", id)
      .eq("creator_id", creatorId);
  }

  /**
   * Récupère les publications à venir pour un créateur
   */
  async getUpcoming(creatorId: string): Promise<ManualPublication[]> {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("manual_publications")
      .select("*")
      .eq("creator_id", creatorId)
      .in("status", ["scheduled", "copied"])
      .order("scheduled_for", { ascending: true });
    return data || [];
  }
}
