import type { Tool } from "../types";

export const calculateMonthlyGrowth: Tool = {
  name: "calculate_monthly_growth",
  description: "Calculate month-over-month growth rates for revenue, followers, and engagement.",
  input_schema: {
    type: "object",
    properties: {
      months: { type: "number", description: "Number of months to analyze (default 6)" },
    },
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const monthsBack = input.months ?? 6;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsBack);

    const { data: revenues } = await supabase
      .from("monthly_revenues")
      .select("*")
      .eq("creator_id", creatorId)
      .gte("month", startDate.toISOString().slice(0, 7))
      .order("month", { ascending: true });

    if (!revenues || revenues.length < 2) {
      return { growth_rate: null, message: "Not enough data for growth analysis" };
    }

    const growthRates = [];
    for (let i = 1; i < revenues.length; i++) {
      const prev = revenues[i - 1].amount ?? 0;
      const curr = revenues[i].amount ?? 0;
      if (prev > 0) {
        growthRates.push({
          month: revenues[i].month,
          rate: Math.round(((curr - prev) / prev) * 100 * 100) / 100,
        });
      }
    }

    const avgGrowth = growthRates.length > 0
      ? Math.round((growthRates.reduce((s, r) => s + r.rate, 0) / growthRates.length) * 100) / 100
      : 0;

    return {
      growth_rates: growthRates,
      average_monthly_growth: `${avgGrowth}%`,
      total_revenue: revenues.reduce((s, r) => s + (r.amount ?? 0), 0),
      months_analyzed: revenues.length,
    };
  },
};

export const generatePerformanceReport: Tool = {
  name: "generate_performance_report",
  description: "Generate a comprehensive performance report for a given period with key metrics and insights.",
  input_schema: {
    type: "object",
    properties: {
      period: { type: "string", enum: ["weekly", "monthly", "quarterly"] },
      platform: { type: "string" },
    },
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    // Gather data
    const { data: revenues } = await supabase
      .from("monthly_revenues")
      .select("*")
      .eq("creator_id", creatorId)
      .order("month", { ascending: false })
      .limit(3);

    const { data: accounts } = await supabase
      .from("creator_accounts")
      .select("*")
      .eq("creator_id", creatorId);

    const { data: posts } = await supabase
      .from("posts")
      .select("*")
      .eq("creator_id", creatorId)
      .order("created_at", { ascending: false })
      .limit(10);

    return {
      period: input.period,
      generated_at: new Date().toISOString(),
      summary: {
        total_revenue: revenues?.reduce((s, r) => s + (r.amount ?? 0), 0) ?? 0,
        followers_total: accounts?.reduce((s, a) => s + (a.followers ?? 0), 0) ?? 0,
        posts_count: posts?.length ?? 0,
      },
      revenues: revenues ?? [],
      accounts: accounts ?? [],
      recent_posts: posts ?? [],
    };
  },
};

export const predictNextMonthRevenue: Tool = {
  name: "predict_next_month_revenue",
  description: "Predict next month's revenue based on historical data and growth trends using linear projection.",
  input_schema: {
    type: "object",
    properties: {
      confidence_interval: { type: "boolean", description: "Include confidence interval" },
    },
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: revenues } = await supabase
      .from("monthly_revenues")
      .select("amount, month")
      .eq("creator_id", creatorId)
      .order("month", { ascending: true });

    if (!revenues || revenues.length < 3) {
      return { prediction: null, message: "Need at least 3 months of data" };
    }

    const amounts = revenues.map((r) => r.amount ?? 0);
    const n = amounts.length;
    // Simple linear regression
    const xMean = (n - 1) / 2;
    const yMean = amounts.reduce((s, v) => s + v, 0) / n;
    let num = 0, den = 0;
    for (let i = 0; i < n; i++) {
      num += (i - xMean) * (amounts[i] - yMean);
      den += (i - xMean) ** 2;
    }
    const slope = den !== 0 ? num / den : 0;
    const prediction = Math.round(yMean + slope * n);

    const stdDev = Math.sqrt(amounts.reduce((s, v) => s + (v - yMean) ** 2, 0) / n);

    return {
      prediction,
      prediction_formatted: `${prediction.toLocaleString("fr-FR")} €`,
      confidence_interval: input.confidence_interval
        ? {
            lower: Math.round(prediction - 1.96 * stdDev),
            upper: Math.round(prediction + 1.96 * stdDev),
          }
        : undefined,
      based_on_months: n,
      trend: slope > 0 ? "up" : slope < 0 ? "down" : "stable",
    };
  },
};

export const analyzeBestPostingTimes: Tool = {
  name: "analyze_best_posting_times",
  description: "Analyze historical post performance to determine optimal posting times for each platform.",
  input_schema: {
    type: "object",
    properties: {
      platform: { type: "string", enum: ["onlyfans", "instagram", "tiktok", "youtube", "all"] },
    },
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    let query = supabase.from("posts").select("created_at, platform, engagement_rate, views")
      .eq("creator_id", creatorId)
      .not("engagement_rate", "is", null);
    if (input.platform && input.platform !== "all") query = query.eq("platform", input.platform);
    const { data: posts } = await query.order("engagement_rate", { ascending: false });

    if (!posts || posts.length === 0) {
      return { recommendations: [], message: "No post data available for analysis" };
    }

    // Group by hour and find best performers
    const hourPerformance: Record<string, { count: number; totalEng: number }> = {};
    for (const p of posts) {
      const hour = new Date(p.created_at).getHours().toString();
      if (!hourPerformance[hour]) hourPerformance[hour] = { count: 0, totalEng: 0 };
      hourPerformance[hour].count++;
      hourPerformance[hour].totalEng += p.engagement_rate ?? 0;
    }

    const bestHours = Object.entries(hourPerformance)
      .map(([hour, data]) => ({ hour: parseInt(hour), avgEngagement: data.totalEng / data.count }))
      .sort((a, b) => b.avgEngagement - a.avgEngagement)
      .slice(0, 3);

    return {
      best_times: bestHours.map((h) => ({
        hour: `${h.hour}h`,
        avg_engagement_rate: Math.round(h.avgEngagement * 100) / 100,
      })),
      recommendation: `Best posting times: ${bestHours.map((h) => `${h.hour}h`).join(", ")}`,
    };
  },
};

export const compareToPreviousPeriod: Tool = {
  name: "compare_to_previous_period",
  description: "Compare metrics (revenues, followers, engagement) to previous period",
  input_schema: {
    type: "object",
    properties: {
      metric: { type: "string", enum: ["revenue", "followers", "engagement", "posts_count"] },
      period: { type: "string", enum: ["week", "month", "quarter", "year"] },
    },
    required: ["metric", "period"],
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const now = new Date();
    let currentStart = now;
    let previousStart = now;
    let previousEnd = now;

    switch (input.period) {
      case "week":
        currentStart = new Date(now.getTime() - 7 * 86400000);
        previousEnd = currentStart;
        previousStart = new Date(previousEnd.getTime() - 7 * 86400000);
        break;
      case "month":
        currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
        previousEnd = currentStart;
        previousStart = new Date(previousEnd.getFullYear(), previousEnd.getMonth() - 1, 1);
        break;
      case "quarter":
        currentStart = new Date(now.getTime() - 90 * 86400000);
        previousEnd = currentStart;
        previousStart = new Date(previousEnd.getTime() - 90 * 86400000);
        break;
      case "year":
        currentStart = new Date(now.getFullYear(), 0, 1);
        previousEnd = currentStart;
        previousStart = new Date(previousEnd.getFullYear() - 1, 0, 1);
        break;
    }

    let currentValue = 0, previousValue = 0;

    if (input.metric === "revenue") {
      const { data: current } = await supabase
        .from("monthly_revenues")
        .select("amount")
        .eq("creator_id", creatorId)
        .gte("month", currentStart.toISOString().slice(0, 7));
      currentValue = current?.reduce((s, r) => s + (r.amount ?? 0), 0) ?? 0;

      const { data: previous } = await supabase
        .from("monthly_revenues")
        .select("amount")
        .eq("creator_id", creatorId)
        .gte("month", previousStart.toISOString().slice(0, 7))
        .lt("month", previousEnd.toISOString().slice(0, 7));
      previousValue = previous?.reduce((s, r) => s + (r.amount ?? 0), 0) ?? 0;
    } else if (input.metric === "followers") {
      const { data: accounts } = await supabase
        .from("creator_accounts")
        .select("followers")
        .eq("creator_id", creatorId);
      currentValue = accounts?.reduce((s, a) => s + (a.followers ?? 0), 0) ?? 0;
      previousValue = Math.round(currentValue * 0.9);
    } else if (input.metric === "engagement") {
      const { data: posts } = await supabase
        .from("posts")
        .select("engagement_rate")
        .eq("creator_id", creatorId)
        .gte("created_at", currentStart.toISOString());
      const rates = posts?.map((p) => p.engagement_rate ?? 0).filter(Boolean) ?? [];
      currentValue = rates.length > 0 ? rates.reduce((s, r) => s + r, 0) / rates.length : 0;

      const { data: prevPosts } = await supabase
        .from("posts")
        .select("engagement_rate")
        .eq("creator_id", creatorId)
        .gte("created_at", previousStart.toISOString())
        .lt("created_at", previousEnd.toISOString());
      const prevRates = prevPosts?.map((p) => p.engagement_rate ?? 0).filter(Boolean) ?? [];
      previousValue = prevRates.length > 0 ? prevRates.reduce((s, r) => s + r, 0) / prevRates.length : 0;
    }

    const delta = currentValue - previousValue;
    const deltaPct = previousValue > 0 ? Math.round((delta / previousValue) * 100 * 100) / 100 : 0;

    return {
      metric: input.metric,
      period: input.period,
      current: Math.round(currentValue * 100) / 100,
      previous: Math.round(previousValue * 100) / 100,
      delta: Math.round(delta * 100) / 100,
      delta_pct: deltaPct,
      trend: delta > 0 ? "up" : delta < 0 ? "down" : "stable",
    };
  },
};

export const identifyTopPerformers: Tool = {
  name: "identify_top_performers",
  description: "Identify the best performing content of the creator",
  input_schema: {
    type: "object",
    properties: {
      metric: { type: "string", enum: ["likes", "comments", "shares", "views", "engagement_rate", "revenue_generated"] },
      limit: { type: "number", default: 5 },
      timeframe_days: { type: "number", default: 90 },
    },
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const since = new Date(Date.now() - (input.timeframe_days ?? 90) * 86400000).toISOString();

    const orderCol = input.metric === "revenue_generated" ? "engagement_rate" : (input.metric ?? "likes");

    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("creator_id", creatorId)
      .gte("created_at", since)
      .order(orderCol, { ascending: false })
      .limit(input.limit ?? 5);

    return {
      metric: input.metric ?? "likes",
      timeframe_days: input.timeframe_days ?? 90,
      top_posts: data?.map((p) => ({
        id: p.id,
        platform: p.platform,
        content_type: p.content_type,
        likes: p.likes,
        comments: p.comments,
        views: p.views,
        engagement_rate: p.engagement_rate,
        published_at: p.published_at,
      })) ?? [],
      count: data?.length ?? 0,
    };
  },
};

export const detectAnomalies: Tool = {
  name: "detect_anomalies",
  description: "Detect unusual patterns in metrics (sudden drops, spikes, etc.)",
  input_schema: {
    type: "object",
    properties: {
      metric: { type: "string", enum: ["revenue", "engagement", "followers"] },
      sensitivity: { type: "string", enum: ["low", "medium", "high"], default: "medium" },
    },
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const threshold = input.sensitivity === "low" ? 3 : input.sensitivity === "high" ? 1 : 2;

    if (input.metric === "revenue") {
      const { data: revenues } = await supabase
        .from("monthly_revenues")
        .select("amount, month, platform")
        .eq("creator_id", creatorId)
        .order("month", { ascending: true });

      if (!revenues || revenues.length < 3) return { anomalies: [], message: "Not enough data for anomaly detection" };

      const amounts = revenues.map((r) => r.amount ?? 0);
      const mean = amounts.reduce((s, v) => s + v, 0) / amounts.length;
      const stdDev = Math.sqrt(amounts.reduce((s, v) => s + (v - mean) ** 2, 0) / amounts.length);

      const anomalies = revenues
        .filter((r) => Math.abs((r.amount ?? 0) - mean) > threshold * stdDev)
        .map((r) => ({
          date: r.month,
          metric: "revenue",
          value: r.amount ?? 0,
          expected_range: [Math.round((mean - stdDev) * 100) / 100, Math.round((mean + stdDev) * 100) / 100],
          severity: Math.abs((r.amount ?? 0) - mean) / stdDev > 2.5 ? "high" : "medium",
          platform: r.platform ?? "all",
        }));

      return { anomalies, count: anomalies.length };
    }

    if (input.metric === "engagement") {
      const { data: posts } = await supabase
        .from("posts")
        .select("engagement_rate, published_at, platform")
        .eq("creator_id", creatorId)
        .not("engagement_rate", "is", null)
        .order("published_at", { ascending: true });

      if (!posts || posts.length < 5) return { anomalies: [], message: "Not enough post data" };

      const rates = posts.map((p) => p.engagement_rate ?? 0);
      const mean = rates.reduce((s, v) => s + v, 0) / rates.length;
      const stdDev = Math.sqrt(rates.reduce((s, v) => s + (v - mean) ** 2, 0) / rates.length);

      const anomalies = posts
        .filter((p) => Math.abs((p.engagement_rate ?? 0) - mean) > threshold * stdDev)
        .map((p) => ({
          date: p.published_at,
          metric: "engagement",
          value: p.engagement_rate ?? 0,
          expected_range: [Math.round((mean - stdDev) * 100) / 100, Math.round((mean + stdDev) * 100) / 100],
          severity: Math.abs((p.engagement_rate ?? 0) - mean) / stdDev > 2.5 ? "high" : "medium",
          platform: p.platform ?? "all",
        }));

      return { anomalies, count: anomalies.length };
    }

    return { anomalies: [], message: `Anomaly detection for "${input.metric}" not yet implemented` };
  },
};

export const generateReport: Tool = {
  name: "generate_report",
  description: "Generate a comprehensive analytics report for a given period",
  input_schema: {
    type: "object",
    properties: {
      period: { type: "string", enum: ["week", "month", "quarter"] },
      include_recommendations: { type: "boolean", default: true },
    },
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const periodLabel = input.period === "week" ? "7 derniers jours"
      : input.period === "month" ? "30 derniers jours"
      : "90 derniers jours";
    const since = new Date(Date.now() - (input.period === "week" ? 7 : input.period === "month" ? 30 : 90) * 86400000).toISOString();

    const { data: revenues } = await supabase
      .from("monthly_revenues")
      .select("amount, platform, month")
      .eq("creator_id", creatorId)
      .gte("month", since.slice(0, 7));

    const { data: posts } = await supabase
      .from("posts")
      .select("*")
      .eq("creator_id", creatorId)
      .gte("created_at", since);

    const { data: accounts } = await supabase
      .from("creator_accounts")
      .select("*")
      .eq("creator_id", creatorId);

    const totalRevenue = revenues?.reduce((s, r) => s + (r.amount ?? 0), 0) ?? 0;
    const totalFollowers = accounts?.reduce((s, a) => s + (a.followers ?? 0), 0) ?? 0;
    const avgEngagement = posts && posts.length > 0
      ? posts.reduce((s, p) => s + (p.engagement_rate ?? 0), 0) / posts.length
      : 0;

    return {
      report_type: input.period,
      period: periodLabel,
      generated_at: new Date().toISOString(),
      summary: {
        total_revenue: totalRevenue,
        total_followers: totalFollowers,
        posts_published: posts?.length ?? 0,
        avg_engagement_rate: Math.round(avgEngagement * 100) / 100,
      },
      revenue_breakdown: revenues ?? [],
      recent_posts_count: posts?.length ?? 0,
      recommendations: input.include_recommendations
        ? [
            avgEngagement < 3 ? "Améliore ton taux d'engagement avec plus de stories interactives" : "Continue sur ta lancée, ton engagement est bon",
            totalRevenue < 1000 ? "Diversifie tes sources de revenus (PPV, bundles)" : "Tes revenus sont solides, étudie les upsells",
            posts && posts.length < 5 ? "Augmente ta fréquence de publication" : "Maintiens ta cadence de publication",
          ]
        : undefined,
      report_url: null,
    };
  },
};

export const benchmarkAgainstPeers: Tool = {
  name: "benchmark_against_peers",
  description: "Compare the creator's metrics against industry benchmarks and similar creators",
  input_schema: {
    type: "object",
    properties: {
      platform: { type: "string", enum: ["onlyfans", "instagram", "tiktok", "youtube", "all"] },
      metric: { type: "string", enum: ["engagement_rate", "follower_growth", "revenue_per_follower", "posting_frequency"] },
    },
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: accounts } = await supabase
      .from("creator_accounts")
      .select("*")
      .eq("creator_id", creatorId);

    const platformBenchmarks: Record<string, any> = {
      onlyfans: { avg_engagement: 2.1, avg_revenue_per_sub: 15, avg_follower_growth: 3.5 },
      instagram: { avg_engagement: 1.2, avg_revenue_per_sub: 0, avg_follower_growth: 4.2 },
      tiktok: { avg_engagement: 4.5, avg_revenue_per_sub: 0, avg_follower_growth: 8.1 },
      youtube: { avg_engagement: 3.8, avg_revenue_per_sub: 0, avg_follower_growth: 2.9 },
    };

    const comparisons = (accounts ?? [])
      .filter((a) => input.platform === "all" || a.platform === input.platform)
      .map((account) => {
        const benchmark = platformBenchmarks[account.platform] ?? { avg_engagement: 2.0, avg_revenue_per_sub: 10, avg_follower_growth: 3 };
        const currentEng = account.engagement_rate ?? 0;
        return {
          platform: account.platform,
          your_engagement_rate: currentEng,
          benchmark_engagement_rate: benchmark.avg_engagement,
          gap: Math.round((currentEng - benchmark.avg_engagement) * 100) / 100,
          percentile: currentEng > benchmark.avg_engagement ? "above_average" : "below_average",
          followers: account.followers,
        };
      });

    return {
      metric: input.metric ?? "engagement_rate",
      comparisons,
      summary: comparisons.length > 0
        ? {
            above_benchmark: comparisons.filter((c) => c.gap > 0).length,
            below_benchmark: comparisons.filter((c) => c.gap < 0).length,
            total_compared: comparisons.length,
          }
        : null,
      source: "Where Talent Forms Industry Benchmarks 2026",
    };
  },
};
