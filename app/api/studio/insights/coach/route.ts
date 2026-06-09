import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPeriodComparison, generateInsights } from "@/lib/analytics/coach";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const now = new Date();

    const currentStart = body.current_start ??
      new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    const currentEnd = body.current_end ?? now.toISOString().split("T")[0];
    const previousStart = body.previous_start ??
      new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split("T")[0];
    const previousEnd = body.previous_end ??
      new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split("T")[0];

    const comparison = await getPeriodComparison(
      supabase, user.id, currentStart, currentEnd, previousStart, previousEnd
    );

    const insights = await generateInsights(supabase, user.id, comparison);

    // Save generated insights
    if (insights.length > 0) {
      const { error: insertError } = await supabase
        .from("analytics_insights")
        .insert(
          insights.map((i) => ({
            creator_id: user.id,
            category: i.category ?? "recommendation",
            title: i.title ?? "Insight",
            description: i.description ?? "",
            metric_name: i.metric_name,
            metric_value: i.metric_value,
            comparison_value: i.comparison_value,
            change_percent: i.change_percent,
            is_positive: i.is_positive ?? true,
            tags: i.tags ?? [],
          }))
        );

      if (insertError) {
        console.error("[INSIGHTS COACH] Insert error:", insertError);
      }
    }

    // Log coach session
    await supabase.from("coach_sessions").insert({
      creator_id: user.id,
      session_type: "weekly_review",
      input_summary: `Period: ${currentStart} to ${currentEnd} vs ${previousStart} to ${previousEnd}`,
      output_summary: `${insights.length} insights generated`,
      insights_count: insights.length,
    });

    return NextResponse.json({
      comparison,
      insights,
      generated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[INSIGHTS COACH] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
