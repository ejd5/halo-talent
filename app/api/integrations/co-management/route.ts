import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { data } = await supabase
    .from("platform_co_management")
    .select("*")
    .eq("creator_id", user.id)
    .order("invited_at", { ascending: false });

  return NextResponse.json({ co_managements: data ?? [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await request.json();
  const { platform, manager_email, manager_name, access_level, notes } = body;

  if (!platform || !manager_email) {
    return NextResponse.json({ error: "Plateforme et email requis" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("platform_co_management")
    .insert({
      creator_id: user.id,
      platform,
      manager_email,
      manager_name,
      access_level: access_level || "content_creator",
      status: "active",
      notes,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
  }

  // Log audit
  await supabase.from("co_management_audit").insert({
    co_management_id: data.id,
    creator_id: user.id,
    action: "created",
    performed_by: manager_email,
    device_info: { source: "web" },
  });

  return NextResponse.json({ co_management: data });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  const { data: existing } = await supabase
    .from("platform_co_management")
    .select("manager_email")
    .eq("id", id)
    .eq("creator_id", user.id)
    .single();

  if (!existing) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  await supabase
    .from("platform_co_management")
    .update({ status: "revoked", revoked_at: new Date().toISOString() })
    .eq("id", id);

  // Log audit
  await supabase.from("co_management_audit").insert({
    co_management_id: id,
    creator_id: user.id,
    action: "revoked",
    performed_by: existing.manager_email,
    device_info: { source: "web" },
  });

  return NextResponse.json({ ok: true });
}
