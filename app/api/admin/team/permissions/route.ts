import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const url = new URL(request.url);
  const memberId = url.searchParams.get("member_id");

  let query = supabase
    .from("team_member_permissions")
    .select("*, granted_by_member:team_members!granted_by(full_name)");

  if (memberId) query = query.eq("member_id", memberId);

  const { data: permissions } = await query.order("permission", { ascending: true });

  const grouped: Record<string, string[]> = {};
  for (const p of permissions || []) {
    if (!grouped[p.member_id]) grouped[p.member_id] = [];
    grouped[p.member_id].push(p.permission);
  }

  return NextResponse.json({ permissions: permissions || [], grouped });
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
  const { member_id, permission } = body;

  if (!member_id || !permission) {
    return NextResponse.json({ error: "member_id et permission requis" }, { status: 400 });
  }

  const { data: result, error } = await supabase
    .from("team_member_permissions")
    .insert({ member_id, permission, granted_by: user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Erreur ajout permission" }, { status: 500 });

  // Audit log
  await supabase.from("team_audit_log").insert({
    member_id,
    action: "permission_granted",
    target_type: "permission",
    metadata: { by: user.id, permission },
  });

  return NextResponse.json({ permission: result });
}

export async function DELETE(request: NextRequest) {
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

  const url = new URL(request.url);
  const memberId = url.searchParams.get("member_id");
  const permission = url.searchParams.get("permission");

  if (!memberId || !permission) {
    return NextResponse.json({ error: "member_id et permission requis" }, { status: 400 });
  }

  await supabase
    .from("team_member_permissions")
    .delete()
    .eq("member_id", memberId)
    .eq("permission", permission);

  // Audit log
  await supabase.from("team_audit_log").insert({
    member_id: memberId,
    action: "permission_revoked",
    target_type: "permission",
    metadata: { by: user.id, permission },
  });

  return NextResponse.json({ ok: true });
}
