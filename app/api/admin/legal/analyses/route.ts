import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createAdminClient();
    const { searchParams } = new URL(request.url);

    const platform = searchParams.get("platform");
    const riskLevel = searchParams.get("risk_level");
    const id = searchParams.get("id");

    // Single analysis detail
    if (id) {
      const { data: analysis, error } = await supabase
        .from("contract_analyses")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      const { data: clauses } = await supabase
        .from("abusive_clauses")
        .select("*")
        .in("id", analysis?.clauses_checked || []);

      const { data: letters } = await supabase
        .from("generated_letters")
        .select("*")
        .eq("analysis_id", id);

      return NextResponse.json({
        analysis: { ...analysis, clauses_details: clauses || [], letters: letters || [] },
      });
    }

    // List with filters
    let query = supabase
      .from("contract_analyses")
      .select("id, created_at, platform, total_score, risk_level, clauses_checked, agency_name, letter_generated, is_anonymous, user_id", { count: "exact" })
      .order("created_at", { ascending: false });

    if (platform) query = query.eq("platform", platform);
    if (riskLevel) query = query.eq("risk_level", riskLevel);

    const { data: analyses, error, count } = await query.limit(100);

    if (error) throw error;

    // Fetch all rows for aggregate stats (no limit)
    const { data: allRaw } = await supabase
      .from("contract_analyses")
      .select("platform, total_score, risk_level, created_at, letter_generated, clauses_checked, converted_to_lead, converted_to_member");

    const platformBreakdown: Record<string, number> = {};
    const riskBreakdown: Record<string, number> = {};
    const dailyCount: Record<string, number> = {};

    for (const a of allRaw || []) {
      platformBreakdown[a.platform] = (platformBreakdown[a.platform] || 0) + 1;
      riskBreakdown[a.risk_level] = (riskBreakdown[a.risk_level] || 0) + 1;
      const day = a.created_at?.slice(0, 10);
      if (day) dailyCount[day] = (dailyCount[day] || 0) + 1;
    }

    // ── Average score ──
    const scores = (allRaw || []).map((a) => a.total_score).filter((s): s is number => s != null);
    const averageScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    // ── Max possible score (sum of all clause severities) ──
    const { data: allClauses } = await supabase
      .from("abusive_clauses")
      .select("severity");
    const maxPossibleScore = (allClauses || []).reduce((sum, c) => sum + c.severity, 0);

    // ── Top 10 most checked predefined clauses ──
    const clauseFreq: Record<string, number> = {};
    for (const a of allRaw || []) {
      for (const clauseId of a.clauses_checked || []) {
        if (clauseId) clauseFreq[clauseId] = (clauseFreq[clauseId] || 0) + 1;
      }
    }
    const topClauseIds = Object.entries(clauseFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([id]) => id);

    const { data: clauseLabels } = await supabase
      .from("abusive_clauses")
      .select("id, label, severity")
      .in("id", topClauseIds);

    const clauseMap = new Map((clauseLabels || []).map((c) => [c.id, c]));
    const topClausesChecked = topClauseIds
      .map((id) => ({
        id,
        label: clauseMap.get(id)?.label || id,
        severity: clauseMap.get(id)?.severity || 0,
        count: clauseFreq[id],
      }))
      .sort((a, b) => b.count - a.count);

    // ── Funnel ──
    const funnel = {
      total_analyses: allRaw?.length || 0,
      with_letters: allRaw?.filter((a) => a.letter_generated).length || 0,
      converted_to_lead: allRaw?.filter((a) => a.converted_to_lead).length || 0,
      converted_to_member: allRaw?.filter((a) => a.converted_to_member).length || 0,
    };

    // Find frequent "other clause" texts
    const { data: withOthers } = await supabase
      .from("contract_analyses")
      .select("other_clause_text")
      .not("other_clause_text", "is", null);

    const otherClauseFreq: Record<string, number> = {};
    for (const a of withOthers || []) {
      const text = a.other_clause_text?.trim();
      if (text && text.length > 10) {
        otherClauseFreq[text] = (otherClauseFreq[text] || 0) + 1;
      }
    }

    const topOtherClauses = Object.entries(otherClauseFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([text, count]) => ({ text, count }));

    return NextResponse.json({
      analyses: analyses || [],
      total: count || 0,
      stats: {
        platform_breakdown: platformBreakdown,
        risk_breakdown: riskBreakdown,
        daily_counts: dailyCount,
        top_other_clauses: topOtherClauses,
        average_score: averageScore,
        max_possible_score: maxPossibleScore,
        top_clauses_checked: topClausesChecked,
        funnel,
      },
    });
  } catch (error) {
    console.error("Admin legal analyses GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
