import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || !["admin", "manager", "owner"].includes(profile.role)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const url = new URL(request.url);
  const role = url.searchParams.get("role");
  const status = url.searchParams.get("status");
  const search = url.searchParams.get("search");

  let query = supabase
    .from("team_members")
    .select("*, assignments:creator_manager_assignments(creator:profiles(id, full_name, display_name, email, department, status))")
    .order("role", { ascending: true })
    .order("full_name", { ascending: true });

  if (role) query = query.eq("role", role);
  if (status) query = query.eq("status", status);
  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data: members, error } = await query;
  if (error) return NextResponse.json({ error: "Erreur chargement" }, { status: 500 });

  // Compute load for each manager
  const enriched = (members || []).map((m: any) => ({
    ...m,
    current_load: m.assignments?.length || 0,
    max_capacity: { senior_manager: 20, manager: 12 }[m.role] || null,
  }));

  return NextResponse.json({ members: enriched });
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
  const { email, full_name, role, notes } = body;

  if (!email || !role) {
    return NextResponse.json({ error: "email et role requis" }, { status: 400 });
  }

  const validRoles = ["senior_manager", "manager", "drafter_assistant", "analyst", "compliance_officer"];
  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });
  }

  // Vérifier si l'utilisateur auth existe avec cet email
  const { data: authUser } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  const { data: member, error } = await supabase
    .from("team_members")
    .insert({
      email,
      full_name,
      role,
      notes,
      user_id: authUser?.id || null,
      hired_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Erreur création" }, { status: 500 });

  // Audit log
  await supabase.from("team_audit_log").insert({
    member_id: member.id,
    action: "member_created",
    metadata: { by: user.id, role, email },
  });

  return NextResponse.json({ member });
}
