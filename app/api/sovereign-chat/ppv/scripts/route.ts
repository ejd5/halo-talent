import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) {
    const { data: script } = await supabase
      .from("atlas_ppv_scripts")
      .select("*")
      .eq("id", id)
      .eq("creator_id", user.id)
      .single();
    return NextResponse.json({ script });
  }

  // Include performance stats from sends
  const { data: scripts } = await supabase
    .from("atlas_ppv_scripts")
    .select("*")
    .eq("creator_id", user.id)
    .order("uses_count", { ascending: false });

  return NextResponse.json({ scripts: scripts || [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await request.json();
  if (!body.script_text) {
    return NextResponse.json({ error: "script_text requis" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("atlas_ppv_scripts")
    .insert({
      creator_id: user.id,
      name: body.name || null,
      script_text: body.script_text,
      target_segment_type: body.target_segment_type || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Erreur de création" }, { status: 500 });
  return NextResponse.json({ script: data });
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: "id requis" }, { status: 400 });

  const updates: Record<string, any> = {};
  for (const key of ["name", "script_text", "target_segment_type"]) {
    if (body[key] !== undefined) updates[key] = body[key];
  }

  const { data, error } = await supabase
    .from("atlas_ppv_scripts")
    .update(updates)
    .eq("id", body.id)
    .eq("creator_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
  return NextResponse.json({ script: data });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

  await supabase.from("atlas_ppv_scripts").delete().eq("id", id).eq("creator_id", user.id);
  return NextResponse.json({ ok: true });
}
