import { type NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { computeCompletionPct, getDNAFilledSections } from "@/lib/dna/helpers";
import { ALL_SECTIONS } from "@/lib/dna/types";
import type { DNASection } from "@/lib/dna/types";

// ─── GET : lire une section ───

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
    const section = searchParams.get("section");
    const creatorId = searchParams.get("creator_id") ?? user.id;

    // Vérifier l'accès (créateur ou manager/admin)
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

    // Utiliser l'admin client pour lire (cohérent avec le PUT qui écrit via admin)
    const adminDb = createAdminClient();
    const { data: dna, error } = await adminDb
      .from("creator_dna")
      .select("*")
      .eq("creator_id", creatorId)
      .single();

    if (error && error.code === "PGRST116") {
      return NextResponse.json({ data: null, exists: false });
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (section) {
      const key = `section_${section}` as keyof typeof dna;
      return NextResponse.json({
        data: dna?.[key] ?? null,
        section: Number(section),
        exists: true,
      });
    }

    return NextResponse.json({ data: dna, exists: true });
  } catch (err) {
    console.error("[DNA API] GET error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// ─── PUT : sauvegarder une section ───

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { section, data: sectionData, creator_id } = body;

    if (!section || !sectionData) {
      return NextResponse.json(
        { error: "Champs requis : section, data" },
        { status: 400 },
      );
    }

    const sectionNum = Number(section) as DNASection;
    if (!ALL_SECTIONS.includes(sectionNum)) {
      return NextResponse.json(
        { error: `Section invalide. Utilisez 1-${ALL_SECTIONS.length}` },
        { status: 400 },
      );
    }

    const targetCreatorId = creator_id ?? user.id;

    // Vérifier l'accès
    if (targetCreatorId !== user.id) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (!profile || !["manager", "admin"].includes(profile.role)) {
        return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
      }
    }

    const adminDb = createAdminClient();

    // Upsert : créer la ligne si elle n'existe pas
    const { data: existing } = await adminDb
      .from("creator_dna")
      .select("id, *")
      .eq("creator_id", targetCreatorId)
      .single();

    const key = `section_${sectionNum}`;

    if (existing) {
      const updates: Record<string, unknown> = {
        [key]: sectionData,
        last_updated_section: sectionNum,
      };

      const filled = getDNAFilledSections({
        ...existing,
        [key]: sectionData,
      } as any);
      updates.completion_pct = computeCompletionPct(filled);

      if (updates.completion_pct === 100) {
        updates.is_complete = true;
      }

      const { error: updateError } = await adminDb
        .from("creator_dna")
        .update(updates)
        .eq("creator_id", targetCreatorId);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    } else {
      const insertData: Record<string, unknown> = {
        creator_id: targetCreatorId,
        [key]: sectionData,
        last_updated_section: sectionNum,
        completion_pct: computeCompletionPct([sectionNum]),
        is_complete: false,
      };

      const { error: insertError } = await adminDb
        .from("creator_dna")
        .insert(insertData);

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, section: sectionNum });
  } catch (err) {
    console.error("[DNA API] PUT error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
