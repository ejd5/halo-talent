import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { data: items, error } = await supabase
      .from("credit_usage")
      .select("id, action, credits_used, prompt, image_url, provider, model, status, created_at")
      .eq("creator_id", user.id)
      .eq("status", "success")
      .not("image_url", "is", null)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ images: items || [] });
  } catch (err) {
    console.error("[HISTORY] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
