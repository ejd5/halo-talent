// ─── WTF Lex, Questionnaire API ──────────────────────────────
// POST /api/lex/questionnaire, Crée/met à jour un questionnaire
// GET  /api/lex/questionnaire , Liste les questionnaires de l'utilisateur
// GET  /api/lex/questionnaire?id=xxx, Récupère un questionnaire spécifique
// DELETE /api/lex/questionnaire?id=xxx, Supprime un questionnaire

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface QuestionnaireBody {
  id?: string;
  platforms?: string[];
  problemType?: string;
  problemTiming?: string;
  problemDescription?: string;
  platformMessage?: string;
  documents?: string[];
  objectives?: string[];
  urgency?: string;
  diagnosis?: string;
  status?: string;
}

/**
 * GET /api/lex/questionnaire
 * Liste les questionnaires de l'utilisateur ou récupère un spécifique.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Questionnaire spécifique
    if (id) {
      const { data, error } = await supabase
        .from("lex_questionnaires")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) {
        return NextResponse.json({ error: "Questionnaire introuvable" }, { status: 404 });
      }

      return NextResponse.json(data);
    }

    // Liste des questionnaires
    const { data, error } = await supabase
      .from("lex_questionnaires")
      .select("id, created_at, updated_at, platforms, problem_type, objectives, urgency, status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ questionnaires: data || [] });
  } catch (error) {
    console.error("Lex questionnaire GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/lex/questionnaire
 * Crée ou met à jour un questionnaire.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
    }

    const body = (await request.json()) as QuestionnaireBody;

    // Mise à jour si ID fourni
    if (body.id) {
      const { data: existing } = await supabase
        .from("lex_questionnaires")
        .select("id")
        .eq("id", body.id)
        .eq("user_id", user.id)
        .single();

      if (!existing) {
        return NextResponse.json({ error: "Questionnaire introuvable" }, { status: 404 });
      }

      const { data, error } = await supabase
        .from("lex_questionnaires")
        .update({
          platforms: body.platforms,
          problem_type: body.problemType,
          problem_timing: body.problemTiming,
          problem_description: body.problemDescription,
          platform_message: body.platformMessage,
          documents: body.documents,
          objectives: body.objectives,
          urgency: body.urgency,
          diagnosis: body.diagnosis,
          status: body.status || "completed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", body.id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ questionnaire: data });
    }

    // Création
    const { data, error } = await supabase
      .from("lex_questionnaires")
      .insert({
        user_id: user.id,
        platforms: body.platforms || [],
        problem_type: body.problemType,
        problem_timing: body.problemTiming,
        problem_description: body.problemDescription,
        platform_message: body.platformMessage,
        documents: body.documents || [],
        objectives: body.objectives || [],
        urgency: body.urgency || "Modéré",
        diagnosis: body.diagnosis,
        status: body.status || "draft",
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ questionnaire: data });
  } catch (error) {
    console.error("Lex questionnaire POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/lex/questionnaire?id=xxx
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    const { error } = await supabase
      .from("lex_questionnaires")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lex questionnaire DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
