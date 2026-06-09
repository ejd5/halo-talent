import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
  const { creator_id, manager_id, is_primary, is_backup, notes } = body;

  if (!creator_id || !manager_id) {
    return NextResponse.json({ error: "creator_id et manager_id requis" }, { status: 400 });
  }

  // Check manager exists and is active
  const { data: manager } = await supabase
    .from("team_members")
    .select("id, role, status")
    .eq("id", manager_id)
    .single();

  if (!manager || !["senior_manager", "manager"].includes(manager.role)) {
    return NextResponse.json({ error: "Le membre sélectionné n'est pas un manager" }, { status: 400 });
  }
  if (manager.status !== "active") {
    return NextResponse.json({ error: "Ce manager n'est pas actif" }, { status: 400 });
  }

  // Check current load
  const { count: currentLoad } = await supabase
    .from("creator_manager_assignments")
    .select("id", { count: "exact", head: true })
    .eq("manager_id", manager_id);

  const maxCapacity = manager.role === "senior_manager" ? 20 : 12;
  if ((currentLoad || 0) >= maxCapacity) {
    return NextResponse.json({ error: "Ce manager a atteint sa capacité maximale" }, { status: 400 });
  }

  // If is_primary, unset other primary assignments for this creator
  if (is_primary) {
    await supabase
      .from("creator_manager_assignments")
      .update({ is_primary: false })
      .eq("creator_id", creator_id)
      .eq("is_primary", true);
  }

  const { data: assign, error } = await supabase
    .from("creator_manager_assignments")
    .insert({
      creator_id,
      manager_id,
      is_primary: is_primary ?? true,
      is_backup: is_backup ?? false,
      assigned_by: user.id,
      notes,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Erreur assignation" }, { status: 500 });

  // Audit log
  await supabase.from("team_audit_log").insert({
    member_id: manager_id,
    action: "creator_assigned",
    target_type: "creator",
    target_id: creator_id,
    metadata: { by: user.id, is_primary, is_backup },
  });

  return NextResponse.json({ assignment: assign });
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
  const assignmentId = url.searchParams.get("id");

  if (!assignmentId) return NextResponse.json({ error: "id requis" }, { status: 400 });

  // Get assignment for audit
  const { data: assignment } = await supabase
    .from("creator_manager_assignments")
    .select("manager_id, creator_id")
    .eq("id", assignmentId)
    .single();

  if (!assignment) return NextResponse.json({ error: "Assignation introuvable" }, { status: 404 });

  await supabase.from("creator_manager_assignments").delete().eq("id", assignmentId);

  // Audit log
  await supabase.from("team_audit_log").insert({
    member_id: assignment.manager_id,
    action: "creator_unassigned",
    target_type: "creator",
    target_id: assignment.creator_id,
    metadata: { by: user.id },
  });

  return NextResponse.json({ ok: true });
}
