import { type NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { finalizeDNA } from "@/lib/dna/finalizer";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    let body: Record<string, unknown> = {};
    try {
      body = await request.json();
    } catch {
      // No body or invalid JSON, use defaults
    }
    const creatorId = (body.creator_id as string) ?? user.id;

    // Vérifier l'accès (seul le créateur ou admin/manager peut finaliser)
    if (creatorId !== user.id) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (!profile || !["manager", "admin"].includes(profile.role)) {
        return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
      }
    }

    // Vérifier que toutes les sections sont remplies (admin client bypass RLS)
    const adminDb = createAdminClient();
    const { data: dna } = await adminDb
      .from("creator_dna")
      .select("*")
      .eq("creator_id", creatorId)
      .single();

    if (!dna) {
      return NextResponse.json(
        { success: false, error: "Aucune section remplie. Commencez par le questionnaire." },
        { status: 400 },
      );
    }

    const missingSections = [1, 2, 3, 4, 5, 6, 7, 8].filter((s) => {
      const key = `section_${s}`;
      return !dna[key];
    });

    if (missingSections.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Sections manquantes : ${missingSections.join(", ")}. Complétez d'abord toutes les sections.`,
          missing_sections: missingSections,
        },
        { status: 400 },
      );
    }

    // Exécuter le pipeline de finalisation
    const result = await finalizeDNA(creatorId);

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[DNA Finalize] Error:", message, err);
    return NextResponse.json(
      { success: false, error: `Erreur serveur lors de la finalisation: ${message}` },
      { status: 500 },
    );
  }
}
