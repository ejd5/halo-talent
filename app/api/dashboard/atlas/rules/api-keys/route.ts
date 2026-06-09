import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { data: keys } = await supabase
      .from("atlas_api_keys")
      .select("*")
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false });

    return NextResponse.json({ keys: keys ?? [] });
  } catch (err) {
    console.error("[ATLAS API KEYS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await request.json();
    const { name } = body;
    if (!name) return NextResponse.json({ error: "Nom requis" }, { status: 400 });

    const { data: key, error } = await supabase
      .from("atlas_api_keys")
      .insert({ creator_id: user.id, name })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ key }, { status: 201 });
  } catch (err) {
    console.error("[ATLAS API KEYS CREATE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { keyId } = await request.json();
    if (!keyId) return NextResponse.json({ error: "keyId requis" }, { status: 400 });

    const { error } = await supabase
      .from("atlas_api_keys")
      .delete()
      .eq("id", keyId)
      .eq("creator_id", user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[ATLAS API KEYS DELETE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
