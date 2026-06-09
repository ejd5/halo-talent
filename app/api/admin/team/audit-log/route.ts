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
  if (!profile || !["admin", "owner"].includes(profile.role)) {
    // Check if compliance officer
    const { data: tm } = await supabase
      .from("team_members")
      .select("role")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!tm || tm.role !== "compliance_officer") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
  }

  const url = new URL(request.url);
  const memberId = url.searchParams.get("member_id");
  const action = url.searchParams.get("action");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "50", 10);

  let query = supabase
    .from("team_audit_log")
    .select("*")
    .order("performed_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (memberId) query = query.eq("member_id", memberId);
  if (action) query = query.eq("action", action);
  if (from) query = query.gte("performed_at", from);
  if (to) query = query.lte("performed_at", to);

  // Get total count
  let countQuery = supabase
    .from("team_audit_log")
    .select("id", { count: "exact", head: true });

  if (memberId) countQuery = countQuery.eq("member_id", memberId);
  if (action) countQuery = countQuery.eq("action", action);

  const { data: logs, error } = await query;
  const { count: total } = await countQuery;

  if (error) return NextResponse.json({ error: "Erreur chargement" }, { status: 500 });

  return NextResponse.json({
    logs: logs || [],
    pagination: { page, limit, total: total || 0, pages: Math.ceil((total || 0) / limit) },
  });
}
