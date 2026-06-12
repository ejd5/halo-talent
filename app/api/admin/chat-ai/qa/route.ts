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
    const status = searchParams.get("status") || undefined;
    const reason = searchParams.get("reason") || undefined;
    const severityMin = searchParams.get("severityMin") || undefined;

    let query = supabase
      .from("chat_ai_qa_items")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq("status", status);
    if (reason) query = query.eq("reason", reason);
    if (severityMin) query = query.gte("severity", parseInt(severityMin, 10));

    const { data: items, error, count } = await query;

    if (error) {
      console.error("[Admin Chat AI] QA error:", error);
      return NextResponse.json({ error: "Erreur chargement QA" }, { status: 500 });
    }

    // Get status distribution
    const statusCounts: Record<string, number> = { pending: 0, approved: 0, revised: 0, blocked: 0, escalated: 0, false_positive: 0 };
    const { data: allCounts } = await supabase
      .from("chat_ai_qa_items")
      .select("status");

    allCounts?.forEach((item) => {
      if (statusCounts.hasOwnProperty(item.status)) {
        statusCounts[item.status]++;
      }
    });

    return NextResponse.json({
      items: items || [],
      total: count || 0,
      page,
      limit,
      statusCounts,
    });
  } catch (error) {
    console.error("[Admin Chat AI] QA error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
