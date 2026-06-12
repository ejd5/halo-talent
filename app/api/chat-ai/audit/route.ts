import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const targetType = searchParams.get("targetType");
    const exportJson = searchParams.get("export") === "true";
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 500);
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("chat_ai_audit_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (action) query = query.eq("action", action);
    if (targetType) query = query.eq("target_type", targetType);

    if (exportJson) {
      const { data, error } = await query.limit(10000);
      if (error) throw error;
      return NextResponse.json({ logs: data || [], exportedAt: new Date().toISOString() });
    }

    const { data, error } = await query.range(offset, offset + limit - 1);
    if (error) throw error;

    return NextResponse.json({
      logs: data || [],
      total: data?.length || 0,
      offset,
      limit,
    });
  } catch (error) {
    console.error("[Chat AI] Audit GET error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
