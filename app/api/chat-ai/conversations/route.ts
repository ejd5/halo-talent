import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform");
    const status = searchParams.get("status");
    const fanStatus = searchParams.get("fanStatus");
    const risk = searchParams.get("risk");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("chat_ai_conversations")
      .select("*, chat_ai_fans!inner(status, pseudonym, language, churn_risk, risk_flags)")
      .order("priority_score", { ascending: false })
      .range(offset, offset + limit - 1);

    if (platform) query = query.eq("platform", platform);
    if (status) query = query.eq("status", status);
    if (fanStatus) query = query.eq("chat_ai_fans.status", fanStatus);

    const { data, error } = await query;
    if (error) throw error;

    // Post-filter for params not supported by the join
    let results = data || [];
    if (risk && risk === "high") {
      results = results.filter((c: Record<string, unknown>) => {
        const fan = c.chat_ai_fans as Record<string, unknown> | null;
        return fan && (fan.churn_risk as number) >= 70;
      });
    }

    return NextResponse.json({ conversations: results, total: results.length });
  } catch (error) {
    console.error("[Chat AI] Conversations GET error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
