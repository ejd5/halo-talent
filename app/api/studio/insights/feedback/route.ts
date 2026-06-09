import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runFeedbackLoop } from "@/lib/analytics/coach";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const now = new Date();
    const endDate = body.end_date ?? now.toISOString().split("T")[0];
    const startDate = body.start_date ??
      new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split("T")[0];

    const feedback = await runFeedbackLoop(supabase, user.id, startDate, endDate);
    return NextResponse.json({ feedback });
  } catch (err) {
    console.error("[INSIGHTS FEEDBACK] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { data: feedbacks } = await supabase
      .from("content_feedback")
      .select("*")
      .eq("creator_id", user.id)
      .order("analysis_date", { ascending: false })
      .limit(10);

    return NextResponse.json({ feedbacks: feedbacks ?? [] });
  } catch (err) {
    console.error("[INSIGHTS FEEDBACK] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
