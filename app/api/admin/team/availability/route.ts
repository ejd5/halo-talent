import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const url = new URL(request.url);
  const memberId = url.searchParams.get("member_id");
  const type = url.searchParams.get("type");

  let query = supabase
    .from("team_member_availability")
    .select("*")
    .order("date_from", { ascending: true });

  if (memberId) query = query.eq("member_id", memberId);
  if (type) query = query.eq("type", type);

  const { data: availability } = await query;

  return NextResponse.json({ availability: availability || [] });
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

  const body = await request.json();
  const { member_id, date_from, date_to, type, notes } = body;

  // Members can set their own availability, admins can set anyone's
  const isAdmin = profile?.role === "admin" || profile?.role === "owner";
  const { data: self } = await supabase
    .from("team_members")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!isAdmin && (!self || self.id !== member_id)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  if (!member_id || !date_from || !date_to) {
    return NextResponse.json({ error: "member_id, date_from, date_to requis" }, { status: 400 });
  }

  const { data: availability, error } = await supabase
    .from("team_member_availability")
    .insert({ member_id, date_from, date_to, type: type || "vacation", notes })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Erreur création" }, { status: 500 });

  return NextResponse.json({ availability });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

  await supabase.from("team_member_availability").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
