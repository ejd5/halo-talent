import { createClient } from "@/lib/supabase/server";
import type { ContentMetric, AnalyticsInsight, PeriodComparison, PerformanceEntry, ContentFeedback } from "./types";

// ─── Period Comparison ───

export async function getPeriodComparison(
  supabase: ReturnType<typeof createClient> extends Promise<infer T> ? T : never,
  creatorId: string,
  currentStart: string,
  currentEnd: string,
  previousStart: string,
  previousEnd: string
): Promise<PeriodComparison> {
  async function aggregate(start: string, end: string) {
    const { data } = await supabase
      .from("content_metrics")
      .select("impressions, likes, comments, shares, saves, engagement_rate")
      .eq("creator_id", creatorId)
      .gte("metric_date", start)
      .lte("metric_date", end);

    const rows = data ?? [];
    return {
      total_posts: rows.length,
      avg_engagement: rows.length > 0
        ? rows.reduce((s, r) => s + (r.engagement_rate ?? 0), 0) / rows.length
        : 0,
      total_impressions: rows.reduce((s, r) => s + (r.impressions ?? 0), 0),
      total_likes: rows.reduce((s, r) => s + (r.likes ?? 0), 0),
      total_comments: rows.reduce((s, r) => s + (r.comments ?? 0), 0),
      total_shares: rows.reduce((s, r) => s + (r.shares ?? 0), 0),
      total_saves: rows.reduce((s, r) => s + (r.saves ?? 0), 0),
    };
  }

  const [current, previous] = await Promise.all([
    aggregate(currentStart, currentEnd),
    aggregate(previousStart, previousEnd),
  ]);

  const p = (c: number, p: number) => (p > 0 ? Math.round(((c - p) / p) * 100) : 0);

  return {
    current,
    previous,
    changes: {
      engagement_change: p(current.avg_engagement, previous.avg_engagement),
      impressions_change: p(current.total_impressions, previous.total_impressions),
      likes_change: p(current.total_likes, previous.total_likes),
      comments_change: p(current.total_comments, previous.total_comments),
    },
  };
}

// ─── Top / Bottom 20% Analysis ───

export async function getPerformanceQuartiles(
  supabase: ReturnType<typeof createClient> extends Promise<infer T> ? T : never,
  creatorId: string,
  startDate: string,
  endDate: string
): Promise<{ top: PerformanceEntry[]; bottom: PerformanceEntry[]; middle: PerformanceEntry[] }> {
  const { data } = await supabase
    .rpc("get_performance_quartiles", {
      p_creator_id: creatorId,
      p_start_date: startDate,
      p_end_date: endDate,
    });

  const rows = (data ?? []) as PerformanceEntry[];
  return {
    top: rows.filter((r) => r.tier === "top_20"),
    bottom: rows.filter((r) => r.tier === "bottom_20"),
    middle: rows.filter((r) => r.tier === "middle"),
  };
}

// ─── Insight Generation ───

export async function generateInsights(
  supabase: ReturnType<typeof createClient> extends Promise<infer T> ? T : never,
  creatorId: string,
  comparison: PeriodComparison
): Promise<Partial<AnalyticsInsight>[]> {
  const insights: Partial<AnalyticsInsight>[] = [];
  const { changes } = comparison;
  const { current } = comparison;

  // Engagement trend
  if (Math.abs(changes.engagement_change) >= 10) {
    insights.push({
      category: changes.engagement_change > 0 ? "trend" : "warning",
      title: changes.engagement_change > 0
        ? "Engagement en hausse"
        : "Baisse d'engagement",
      description: changes.engagement_change > 0
        ? `L'engagement a augmenté de ${changes.engagement_change}% par rapport à la période précédente. Continue sur cette lancée !`
        : `L'engagement a baissé de ${Math.abs(changes.engagement_change)}%. Analyse les contenus récents pour identifier ce qui n'a pas fonctionné.`,
      metric_name: "engagement_rate",
      metric_value: current.avg_engagement,
      comparison_value: comparison.previous.avg_engagement,
      change_percent: changes.engagement_change,
      is_positive: changes.engagement_change > 0,
      tags: changes.engagement_change > 0 ? ["croissance", "engagement"] : ["alerte", "engagement"],
    });
  }

  // Impressions milestone
  if (current.total_impressions > 10000 && changes.impressions_change > 20) {
    insights.push({
      category: "milestone",
      title: "Cap des 10k impressions franchi",
      description: `Tu as généré ${current.total_impressions.toLocaleString()} impressions, soit ${changes.impressions_change}% de plus que la période précédente.`,
      metric_name: "impressions",
      metric_value: current.total_impressions,
      change_percent: changes.impressions_change,
      is_positive: true,
      tags: ["milestone", "reach"],
    });
  }

  // Comment engagement
  if (current.total_comments > 50 && changes.comments_change > 15) {
    insights.push({
      category: "pattern",
      title: "Boost des commentaires",
      description: `Les commentaires ont augmenté de ${changes.comments_change}%. Tes appels à l'action fonctionnent bien.`,
      metric_name: "comments",
      metric_value: current.total_comments,
      change_percent: changes.comments_change,
      is_positive: true,
      tags: ["commentaires", "engagement"],
    });
  }

  // Low engagement warning
  if (current.avg_engagement < 1 && current.total_posts >= 5) {
    insights.push({
      category: "warning",
      title: "Engagement faible",
      description: `L'engagement moyen est de ${current.avg_engagement.toFixed(2)}%. Essaie des formats plus interactifs (sondages, questions, Reels).`,
      metric_name: "engagement_rate",
      metric_value: current.avg_engagement,
      is_positive: false,
      tags: ["alerte", "stratégie"],
    });
  }

  // Empty state
  if (current.total_posts === 0) {
    insights.push({
      category: "opportunity",
      title: "Commence à publier",
      description: "Aucune donnée de performance sur cette période. Publie du contenu pour débloquer tes analytics.",
      is_positive: true,
      tags: ["démarrage"],
    });
  }

  return insights;
}

// ─── Feedback Loop Analysis ───

export async function runFeedbackLoop(
  supabase: ReturnType<typeof createClient> extends Promise<infer T> ? T : never,
  creatorId: string,
  startDate: string,
  endDate: string
): Promise<ContentFeedback> {
  const quartiles = await getPerformanceQuartiles(supabase, creatorId, startDate, endDate);

  // Fetch full metrics for top and bottom performers
  async function enrichEntries(entries: PerformanceEntry[]): Promise<PerformanceEntry[]> {
    if (entries.length === 0) return [];
    const ids = entries.map((e) => e.publication_id);
    const { data: metrics } = await supabase
      .from("content_metrics")
      .select("*")
      .in("publication_id", ids);

    const metricMap = new Map((metrics ?? []).map((m: any) => [m.publication_id, m]));
    return entries.map((e) => ({
      ...e,
      metrics: metricMap.get(e.publication_id) as Partial<ContentMetric>,
    }));
  }

  const [topEnriched, bottomEnriched] = await Promise.all([
    enrichEntries(quartiles.top),
    enrichEntries(quartiles.bottom),
  ]);

  const topAvg =
    topEnriched.length > 0
      ? topEnriched.reduce((s, e) => s + e.engagement_rate, 0) / topEnriched.length
      : 0;
  const bottomAvg =
    bottomEnriched.length > 0
      ? bottomEnriched.reduce((s, e) => s + e.engagement_rate, 0) / bottomEnriched.length
      : 0;

  // Extract patterns from top performers
  const topTags = extractCommonTags(topEnriched, "content_type");
  const bottomTags = extractCommonTags(bottomEnriched, "content_type");

  const feedback: ContentFeedback = {
    id: "",
    analysis_date: new Date().toISOString().split("T")[0],
    period_start: startDate,
    period_end: endDate,
    top_performers: topEnriched,
    top_patterns: {
      dominant_type: topTags.length > 0 ? topTags[0] : "mixed",
      avg_engagement: topAvg,
    },
    top_common_tags: topTags,
    top_common_moods: [],
    top_common_styles: [],
    top_avg_engagement: topAvg,
    bottom_performers: bottomEnriched,
    bottom_patterns: {
      dominant_type: bottomTags.length > 0 ? bottomTags[0] : "mixed",
      avg_engagement: bottomAvg,
    },
    bottom_common_tags: bottomTags,
    bottom_common_moods: [],
    bottom_common_styles: [],
    bottom_avg_engagement: bottomAvg,
    dna_updates: {
      recommended_focus: topTags.length > 0 ? topTags : [],
      avoid_focus: bottomTags.length > 0 ? bottomTags : [],
      engagement_gap: topAvg - bottomAvg,
    },
    dna_applied: false,
    insights_generated: [],
    created_at: new Date().toISOString(),
  };

  // Generate insight text
  const insights: string[] = [];
  if (topEnriched.length > 0 && topTags.length > 0) {
    insights.push(
      `Les formats qui performent le mieux : ${topTags.join(", ")}. ` +
      `Engagement moyen : ${topAvg.toFixed(2)}%`
    );
  }
  if (bottomEnriched.length > 0 && bottomTags.length > 0) {
    insights.push(
      `Formats à éviter : ${bottomTags.join(", ")}. ` +
      `Engagement moyen : ${bottomAvg.toFixed(2)}%`
    );
  }
  if (topAvg - bottomAvg > 5) {
    insights.push(
      `Écart d'engagement significatif (${(topAvg - bottomAvg).toFixed(2)} points). ` +
      `Concentre-toi sur ce qui marche.`
    );
  }
  feedback.insights_generated = insights;

  // Save to DB
  const { data: saved } = await supabase
    .from("content_feedback")
    .insert({
      creator_id: creatorId,
      period_start: startDate,
      period_end: endDate,
      top_performers: JSON.parse(JSON.stringify(topEnriched)),
      top_patterns: feedback.top_patterns,
      top_common_tags: topTags,
      top_avg_engagement: topAvg,
      bottom_performers: JSON.parse(JSON.stringify(bottomEnriched)),
      bottom_patterns: feedback.bottom_patterns,
      bottom_common_tags: bottomTags,
      bottom_avg_engagement: bottomAvg,
      dna_updates: feedback.dna_updates,
      insights_generated: insights,
    })
    .select()
    .single();

  // Apply DNA updates to profile
  if (saved) {
    // Fetch current dna_version and increment
    const { data: profile } = await supabase
      .from("profiles")
      .select("dna_version")
      .eq("id", creatorId)
      .single();
    await supabase
      .from("profiles")
      .update({
        dna_version: ((profile as any)?.dna_version ?? 1) + 1,
        last_feedback_date: new Date().toISOString().split("T")[0],
      })
      .eq("id", creatorId);
  }

  return saved ?? feedback;
}

// ─── Helpers ───

function extractCommonTags(entries: PerformanceEntry[], key: keyof PerformanceEntry): string[] {
  const counts = new Map<string, number>();
  for (const e of entries) {
    const val = String(e[key] ?? "unknown");
    counts.set(val, (counts.get(val) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag]) => tag);
}

// ─── Dashboard Summary ───

export async function getDashboardSummary(
  supabase: ReturnType<typeof createClient> extends Promise<infer T> ? T : never,
  creatorId: string
) {
  const now = new Date();
  const currentStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const currentEnd = now.toISOString().split("T")[0];
  const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split("T")[0];
  const prevEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split("T")[0];

  const [comparison, insights, feedback] = await Promise.all([
    getPeriodComparison(supabase, creatorId, currentStart, currentEnd, prevStart, prevEnd),
    supabase
      .from("analytics_insights")
      .select("*")
      .eq("creator_id", creatorId)
      .order("created_at", { ascending: false })
      .limit(10)
      .then((r) => r.data as AnalyticsInsight[] | null),
    supabase
      .from("content_feedback")
      .select("*")
      .eq("creator_id", creatorId)
      .order("analysis_date", { ascending: false })
      .limit(1)
      .then((r) => r.data?.[0] as ContentFeedback | null),
  ]);

  return {
    comparison,
    insights: insights ?? [],
    feedback,
    generated_at: new Date().toISOString(),
  };
}

// ─── 30-Day Chart Data ───

export async function getChartData(
  supabase: ReturnType<typeof createClient> extends Promise<infer T> ? T : never,
  creatorId: string,
  days: number = 30
) {
  const start = new Date();
  start.setDate(start.getDate() - days);

  const { data } = await supabase
    .from("content_metrics")
    .select("metric_date, impressions, likes, comments, shares, engagement_rate, revenue_eur")
    .eq("creator_id", creatorId)
    .gte("metric_date", start.toISOString().split("T")[0])
    .order("metric_date", { ascending: true });

  const grouped = new Map<string, any>();
  for (const row of data ?? []) {
    const date = row.metric_date;
    if (!grouped.has(date)) {
      grouped.set(date, {
        date,
        impressions: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        engagement_rate: 0,
        revenue_eur: 0,
        posts: 0,
      });
    }
    const g = grouped.get(date)!;
    g.impressions += row.impressions ?? 0;
    g.likes += row.likes ?? 0;
    g.comments += row.comments ?? 0;
    g.shares += row.shares ?? 0;
    g.revenue_eur += row.revenue_eur ?? 0;
    g.posts += 1;
  }

  const chart = [...grouped.values()].map((g) => ({
    ...g,
    engagement_rate: g.posts > 0 ? g.engagement_rate / g.posts : 0,
  }));

  return chart;
}
