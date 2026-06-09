import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { data: campaigns } = await supabase
    .from("content_calendar_campaigns")
    .select("*, created_by_member:team_members!created_by(full_name)")
    .order("created_at", { ascending: false });

  return NextResponse.json({ campaigns: campaigns || [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || !["admin", "owner"].includes(profile.role)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await request.json();
  const { name, description, theme, starts_at, ends_at, required_hashtags, status } = body;

  if (!name) return NextResponse.json({ error: "name requis" }, { status: 400 });

  // Get team_member id for this user
  const { data: tm } = await supabase
    .from("team_members")
    .select("id")
    .eq("user_id", user.id)
    .single();

  const { data: campaign, error } = await supabase
    .from("content_calendar_campaigns")
    .insert({
      name, description, theme, starts_at, ends_at, required_hashtags,
      status: status || "active",
      created_by: tm?.id || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Erreur création" }, { status: 500 });
  return NextResponse.json({ campaign });
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

  const allowed = ["name", "description", "theme", "starts_at", "ends_at", "required_hashtags", "status"];
  const clean: Record<string, any> = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) clean[key] = updates[key];
  }

  const { data: campaign, error } = await supabase
    .from("content_calendar_campaigns")
    .update(clean)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 });
  return NextResponse.json({ campaign });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

  await supabase.from("content_calendar_campaigns").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
