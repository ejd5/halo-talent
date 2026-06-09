import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();

    // Total analyses count
    const { count: totalAnalyses, error: countError } = await supabase
      .from("contract_analyses")
      .select("*", { count: "exact", head: true });

    if (countError) throw countError;

    // Average score
    const { data: scoreData } = await supabase
      .from("contract_analyses")
      .select("total_score");

    const avgScore =
      scoreData?.length
        ? Math.round(
            scoreData.reduce((sum, a) => sum + a.total_score, 0) /
              scoreData.length
          )
        : 0;

    // Top 5 most checked clauses
    const { data: allAnalyses } = await supabase
      .from("contract_analyses")
      .select("clauses_checked");

    const clauseFrequency: Record<string, number> = {};
    for (const analysis of allAnalyses || []) {
      for (const clauseId of analysis.clauses_checked || []) {
        clauseFrequency[clauseId] = (clauseFrequency[clauseId] || 0) + 1;
      }
    }

    const topClauses = Object.entries(clauseFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id, count]) => ({ id, count }));

    // Fetch labels for top clauses
    if (topClauses.length) {
      const { data: clauseNames } = await supabase
        .from("abusive_clauses")
        .select("id, label, severity")
        .in(
          "id",
          topClauses.map((c) => c.id)
        );

      const nameMap = new Map(
        (clauseNames || []).map((c) => [c.id, { label: c.label, severity: c.severity }])
      );

      for (const c of topClauses) {
        const meta = nameMap.get(c.id);
        if (meta) {
          (c as any).label = meta.label;
          (c as any).severity = meta.severity;
        }
      }
    }

    // Platform breakdown
    const { data: platformData } = await supabase
      .from("contract_analyses")
      .select("platform");

    const platformBreakdown: Record<string, number> = {};
    for (const a of platformData || []) {
      platformBreakdown[a.platform] = (platformBreakdown[a.platform] || 0) + 1;
    }

    // Cache headers (1 hour)
    const headers = new Headers();
    headers.set("Cache-Control", "public, max-age=3600, s-maxage=3600");

    return NextResponse.json(
      {
        total_analyses: totalAnalyses || 0,
        average_score: avgScore,
        top_clauses: topClauses,
        platform_breakdown: platformBreakdown,
      },
      { headers }
    );
  } catch (error) {
    console.error("Legal stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
