// ─── User API: Letter Feedback ────────────────────────────
// POST /api/lex/requests/feedback, Submit rating + comment

import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { recordFeedback } from "@/lib/halo-lex/letters/letter-delivery";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Authentification requise" }), { status: 401 });
    }

    const body = await request.json();
    const { letter_request_id, rating, comment, outcome } = body;

    if (!letter_request_id || !rating || rating < 1 || rating > 5) {
      return new Response(JSON.stringify({ error: "ID demande et note (1-5) requis" }), { status: 400 });
    }

    // Verify ownership
    const { data: reqData } = await supabase
      .from("letter_requests")
      .select("id")
      .eq("id", letter_request_id)
      .eq("user_id", user.id)
      .single();

    if (!reqData) {
      return new Response(JSON.stringify({ error: "Demande introuvable" }), { status: 404 });
    }

    const result = await recordFeedback(letter_request_id, user.id, rating, comment, outcome);

    return new Response(JSON.stringify({ success: true, feedback: result }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[Lex Feedback] POST error:", error);
    return new Response(JSON.stringify({ error: "Erreur interne" }), { status: 500 });
  }
}
