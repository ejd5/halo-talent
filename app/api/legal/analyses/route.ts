import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: analyses, error } = await supabase
      .from("contract_analyses")
      .select("id, created_at, platform, total_score, risk_level, ai_diagnosis, clauses_checked, agency_name, letter_generated")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Fetch clause labels for each analysis
    const allClauseIds = [...new Set((analyses || []).flatMap((a) => a.clauses_checked || []))];

    const { data: clauses } = await supabase
      .from("abusive_clauses")
      .select("id, label, severity, category")
      .in("id", allClauseIds);

    const clauseMap = new Map((clauses || []).map((c) => [c.id, c]));

    const enriched = (analyses || []).map((a) => ({
      ...a,
      clauses_details: (a.clauses_checked || []).map((id: string) => clauseMap.get(id) || null).filter(Boolean),
    }));

    // Fetch letters for these analyses
    const analysisIds = (analyses || []).map((a) => a.id);
    const { data: letters } = await supabase
      .from("generated_letters")
      .select("id, analysis_id, letter_type, created_at")
      .in("analysis_id", analysisIds)
      .order("created_at", { ascending: false });

    const letterMap = new Map<string, typeof letters>();
    for (const l of letters || []) {
      if (!letterMap.has(l.analysis_id)) letterMap.set(l.analysis_id, []);
      letterMap.get(l.analysis_id)!.push(l);
    }

    const result = enriched.map((a) => ({
      ...a,
      letters: letterMap.get(a.id) || [],
    }));

    return NextResponse.json({ analyses: result });
  } catch (error) {
    console.error("Legal analyses error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
