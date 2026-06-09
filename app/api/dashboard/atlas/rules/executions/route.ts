import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const ruleId = req.nextUrl.searchParams.get("rule_id");
    const success = req.nextUrl.searchParams.get("success");
    const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") ?? "50"), 200);

    let query = supabase
      .from("atlas_rule_executions")
      .select("*, rule:rule_id(name)")
      .eq("creator_id", user.id)
      .order("executed_at", { ascending: false })
      .limit(limit);

    if (ruleId) query = query.eq("rule_id", ruleId);
    if (success === "true") query = query.eq("success", true);
    if (success === "false") query = query.eq("success", false);

    const { data: executions } = await query;

    return NextResponse.json({ executions: executions ?? [] });
  } catch (err) {
    console.error("[ATLAS RULES EXECUTIONS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
