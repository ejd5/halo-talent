import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/require-admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const supabase = await createAdminClient();
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10) || 50, 200);
    const page = parseInt(searchParams.get("page") || "1", 10) || 1;
    const offset = (page - 1) * limit;
    const action = searchParams.get("action") || undefined;
    const userId = searchParams.get("userId") || undefined;
    const exportCsv = searchParams.get("export") === "true";

    let query = supabase
      .from("chat_ai_audit_logs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (!exportCsv) {
      query = query.range(offset, offset + limit - 1);
    }

    if (action) query = query.eq("action", action);
    if (userId) query = query.eq("user_id", userId);

    const { data: logs, error, count } = await query;

    if (error) {
      console.error("[Admin Chat AI] Audit error:", error);
      return NextResponse.json({ error: "Erreur chargement audit" }, { status: 500 });
    }

    // Get distinct action types for filtering
    const { data: actionTypes } = await supabase
      .from("chat_ai_audit_logs")
      .select("action")
      .order("action");

    const uniqueActions = [...new Set((actionTypes || []).map((a) => a.action))];

    return NextResponse.json({
      logs: logs || [],
      total: count || 0,
      page: exportCsv ? 0 : page,
      limit: exportCsv ? count || 0 : limit,
      availableActions: uniqueActions,
    });
  } catch (error) {
    console.error("[Admin Chat AI] Audit error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
