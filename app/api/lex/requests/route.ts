// ─── User API: Letter Request Tracking ────────────────────
// GET  /api/lex/requests         , List my requests
// GET  /api/lex/requests?id=X    , Single request with events
// POST /api/lex/requests         , Create a new request

import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { createLetterRequest } from "@/lib/halo-lex/letters/letter-delivery";

export const dynamic = "force-dynamic";

// ─── GET ──────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const supabase = await createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Authentification requise" }), { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Single request
    if (id) {
      const { data: reqData, error } = await supabase
        .from("letter_requests")
        .select(`
          *,
          letter_request_events(*),
          letter_feedback(*)
        `)
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return new Response(JSON.stringify({ error: "Demande introuvable" }), { status: 404 });
        }
        throw error;
      }

      const { letter_request_events, letter_feedback, ...requestData } = reqData as any;

      return new Response(
        JSON.stringify({
          ...requestData,
          events: letter_request_events || [],
          feedback: letter_feedback?.[0] || null,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // List user requests
    const { data, error, count } = await supabase
      .from("letter_requests")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    return new Response(
      JSON.stringify({ requests: data || [], total: count || 0 }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Lex Requests] GET error:", error);
    return new Response(JSON.stringify({ error: "Erreur interne" }), { status: 500 });
  }
}

// ─── POST ─────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const supabase = await createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Authentification requise" }), { status: 401 });
    }

    const body = await request.json();
    const {
      letter_type,
      complexity = "standard",
      priority = "standard",
      brief,
      language = "fr",
      tone,
      target_platform,
      questionnaire_id,
    } = body;

    if (!letter_type || !brief) {
      return new Response(JSON.stringify({ error: "Type de lettre et brief requis" }), { status: 400 });
    }

    // Get user profile for plan + email
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, email, first_name")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return new Response(JSON.stringify({ error: "Profil introuvable" }), { status: 404 });
    }

    // Check if user has access to Lex
    if (!profile.plan || profile.plan === "creator") {
      return new Response(
        JSON.stringify({ error: "Votre plan ne donne pas accès à WTF Lex. Passez à Premium ou supérieur." }),
        { status: 403 }
      );
    }

    // Express (4h/+50€) reserved for Elite/Icon plans
    if (priority === "express" && !["elite", "icon"].includes(profile.plan)) {
      return new Response(
        JSON.stringify({ error: "L'option Express (4h) est réservée aux plans Elite et Icon." }),
        { status: 403 }
      );
    }

    const result = await createLetterRequest({
      userId: user.id,
      email: profile.email || "",
      firstName: profile.first_name || "Utilisateur",
      letterType: letter_type,
      complexity,
      priority,
      brief,
      language,
      tone,
      targetPlatform: target_platform,
      questionnaireId: questionnaire_id,
    });

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[Lex Requests] POST error:", error);
    return new Response(JSON.stringify({ error: "Erreur interne" }), { status: 500 });
  }
}
