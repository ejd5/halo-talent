import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildDNAStatusResponse } from "@/lib/dna/helpers";
import type { CreatorDNA } from "@/lib/dna/types";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get("creator_id") ?? user.id;

    // Vérifier l'accès
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

    // Charger le DNA et le profil en parallèle
    const [dnaResult, profileResult] = await Promise.all([
      supabase
        .from("creator_dna")
        .select("*")
        .eq("creator_id", creatorId)
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("studio_access")
        .eq("id", creatorId)
        .single(),
    ]);

    const dna = (dnaResult.data ?? null) as CreatorDNA | null;
    const studioAccess = profileResult.data?.studio_access ?? false;

    const status = buildDNAStatusResponse(dna, studioAccess);

    return NextResponse.json(status);
  } catch (err) {
    console.error("[DNA Status] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
