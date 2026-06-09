import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { memberId } = await params;

  const { data: member } = await supabase
    .from("team_members")
    .select(`
      *,
      assignments:creator_manager_assignments(
        id, is_primary, is_backup, assigned_at, notes,
        creator:profiles(id, full_name, display_name, email, department, status, avatar_url)
      ),
      permissions:team_member_permissions(
        permission, granted_by, granted_at
      ),
      availability:team_member_availability(
        id, date_from, date_to, type, notes
      )
    `)
    .eq("id", memberId)
    .single();

  if (!member) return NextResponse.json({ error: "Membre introuvable" }, { status: 404 });

  // Compute perf stats for managers
  let performance = null;
  if (["senior_manager", "manager"].includes(member.role)) {
    const assignIds = (member.assignments || []).map((a: any) => a.creator?.id).filter(Boolean);

    if (assignIds.length > 0) {
      const currentMonth = new Date().toISOString().slice(0, 7) + "-01";
      const prevMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().slice(0, 7) + "-01";

      const { data: revs } = await supabase
        .from("monthly_revenues")
        .select("creator_id, gross_revenue, month")
        .in("creator_id", assignIds)
        .in("month", [currentMonth, prevMonth]);

      const currentRev = (revs || []).filter((r) => r.month === currentMonth);
      const prevRev = (revs || []).filter((r) => r.month === prevMonth);

      const totalCurrent = currentRev.reduce((s: number, r: any) => s + Number(r.gross_revenue || 0), 0);
      const totalPrev = prevRev.reduce((s: number, r: any) => s + Number(r.gross_revenue || 0), 0);

      // Pending drafts across assigned creators
      const { count: pendingDrafts } = await supabase
        .from("atlas_drafts")
        .select("id", { count: "exact", head: true })
        .in("creator_id", assignIds)
        .eq("status", "pending");

      performance = {
        total_creators: assignIds.length,
        total_revenue: totalCurrent,
        revenue_growth: totalPrev > 0 ? Math.round(((totalCurrent - totalPrev) / totalPrev) * 100) : 0,
        pending_drafts: pendingDrafts || 0,
        avg_revenue_per_creator: assignIds.length > 0 ? Math.round(totalCurrent / assignIds.length) : 0,
      };
    }
  }

  return NextResponse.json({ member, performance });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
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

  const { memberId } = await params;
  const body = await request.json();

  const allowed = ["full_name", "role", "status", "notes", "metadata", "avatar_url"];
  const updates: Record<string, any> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) updates[key] = body[key];
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Aucune mise à jour" }, { status: 400 });
  }

  const { data: member, error } = await supabase
    .from("team_members")
    .update(updates)
    .eq("id", memberId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 });

  // Audit log
  await supabase.from("team_audit_log").insert({
    member_id: memberId,
    action: "member_updated",
    metadata: { by: user.id, changes: updates },
  });

  return NextResponse.json({ member });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
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

  const { memberId } = await params;

  // Soft-delete: archive instead of delete
  const { error } = await supabase
    .from("team_members")
    .update({ status: "archived" })
    .eq("id", memberId);

  if (error) return NextResponse.json({ error: "Erreur archivage" }, { status: 500 });

  // Audit log
  await supabase.from("team_audit_log").insert({
    member_id: memberId,
    action: "member_archived",
    metadata: { by: user.id },
  });

  return NextResponse.json({ ok: true });
}
