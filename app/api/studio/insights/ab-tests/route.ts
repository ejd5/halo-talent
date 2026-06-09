import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { data: tests } = await supabase
      .from("ab_tests")
      .select("*")
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false });

    return NextResponse.json({ tests: tests ?? [] });
  } catch (err) {
    console.error("[AB TESTS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, platform, content_type, variant_a_data, variant_b_data } = body;

    if (!name || !platform || !content_type) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const { data: test, error } = await supabase
      .from("ab_tests")
      .insert({
        creator_id: user.id,
        name,
        description: description ?? null,
        platform,
        content_type,
        variant_a_data: variant_a_data ?? {},
        variant_b_data: variant_b_data ?? {},
        status: "draft",
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ test });
  } catch (err) {
    console.error("[AB TESTS CREATE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
