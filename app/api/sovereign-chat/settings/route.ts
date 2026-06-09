import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  // Get or create default settings
  const { data } = await supabase
    .from("sovereign_chat_settings")
    .select("*")
    .eq("creator_id", user.id)
    .single();

  if (data) return NextResponse.json({ settings: data });

  // Create default settings
  const { data: created } = await supabase
    .from("sovereign_chat_settings")
    .insert({ creator_id: user.id })
    .select()
    .single();

  return NextResponse.json({ settings: created ?? null });
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await request.json();
  const allowed = ["auto_disclaimer_email", "watermark_ai_assisted", "detailed_audit_logging", "reject_on_ai_warning"];

  const updates: Record<string, any> = {};
  for (const key of allowed) {
    if (typeof body[key] === "boolean") updates[key] = body[key];
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Aucun champ valide" }, { status: 400 });
  }

  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("sovereign_chat_settings")
    .upsert({ creator_id: user.id, ...updates })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Erreur de sauvegarde" }, { status: 500 });
  }

  return NextResponse.json({ settings: data });
}
