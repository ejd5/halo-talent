import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { data: funnels } = await supabase
      .from("atlas_funnels")
      .select("id, name, description, status, entry_count, conversion_count, conversion_rate, revenue_generated, created_at")
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false });

    return NextResponse.json({ funnels: funnels ?? [] });
  } catch (err) {
    console.error("[FUNNELS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await request.json();
    const { name, description, steps, from_preset } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });
    }

    const { data: funnel, error } = await supabase
      .from("atlas_funnels")
      .insert({
        creator_id: user.id,
        name: name.trim(),
        description: description || null,
        steps: steps || { nodes: [], edges: [] },
        status: "draft",
      })
      .select("id, name, description, status, entry_count, conversion_count, conversion_rate, revenue_generated, created_at")
      .single();

    if (error) {
      console.error("[FUNNELS] Insert error:", error);
      return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
    }

    return NextResponse.json({ funnel }, { status: 201 });
  } catch (err) {
    console.error("[FUNNELS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
