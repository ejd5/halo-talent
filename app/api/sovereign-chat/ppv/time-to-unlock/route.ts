import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  // Get all unlocked sends with TTU
  const { data: sends } = await supabase
    .from("atlas_ppv_sends")
    .select("time_to_unlock_seconds, unlocked_at, sent_at")
    .eq("creator_id", user.id)
    .eq("unlocked", true)
    .not("time_to_unlock_seconds", "is", null);

  const buckets = {
    under_5min: 0,
    "5_30min": 0,
    "30min_1h": 0,
    "1h_3h": 0,
    "3h_12h": 0,
    "12h_24h": 0,
    over_24h: 0,
  };

  const total = sends?.length || 0;

  // Hourly heatmap: day_of_week x hour
  const heatmap: Record<string, Record<number, { sends: number; unlocks: number }>> = {};
  const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  for (const s of sends || []) {
    const ttu = s.time_to_unlock_seconds;
    if (ttu === null) continue;

    if (ttu < 300) buckets.under_5min++;
    else if (ttu < 1800) buckets["5_30min"]++;
    else if (ttu < 3600) buckets["30min_1h"]++;
    else if (ttu < 10800) buckets["1h_3h"]++;
    else if (ttu < 43200) buckets["3h_12h"]++;
    else if (ttu < 86400) buckets["12h_24h"]++;
    else buckets.over_24h++;

    // Heatmap by day+hour of sent_at
    if (s.sent_at) {
      const d = new Date(s.sent_at);
      const day = d.getDay();
      const hour = d.getHours();
      const key = days[day];
      if (!heatmap[key]) heatmap[key] = {};
      if (!heatmap[key][hour]) heatmap[key][hour] = { sends: 0, unlocks: 0 };
      heatmap[key][hour].sends++;
      if (s.unlocked_at) heatmap[key][hour].unlocks++;
    }
  }

  const distribution = {
    buckets: {
      "< 5 min": { count: buckets.under_5min, pct: total > 0 ? Math.round((buckets.under_5min / total) * 100) : 0 },
      "5-30 min": { count: buckets["5_30min"], pct: total > 0 ? Math.round((buckets["5_30min"] / total) * 100) : 0 },
      "30 min-1h": { count: buckets["30min_1h"], pct: total > 0 ? Math.round((buckets["30min_1h"] / total) * 100) : 0 },
      "1h-3h": { count: buckets["1h_3h"], pct: total > 0 ? Math.round((buckets["1h_3h"] / total) * 100) : 0 },
      "3h-12h": { count: buckets["3h_12h"], pct: total > 0 ? Math.round((buckets["3h_12h"] / total) * 100) : 0 },
      "12h-24h": { count: buckets["12h_24h"], pct: total > 0 ? Math.round((buckets["12h_24h"] / total) * 100) : 0 },
      "> 24h": { count: buckets.over_24h, pct: total > 0 ? Math.round((buckets.over_24h / total) * 100) : 0 },
    },
    total_unlocks_with_ttu: total,
  };

  // Best window analysis
  let bestDay = "";
  let bestHour = 0;
  let bestRate = 0;
  for (const [day, hours] of Object.entries(heatmap)) {
    for (const [hourStr, data] of Object.entries(hours)) {
      const rate = data.sends > 0 ? (data.unlocks / data.sends) * 100 : 0;
      if (rate > bestRate) {
        bestRate = rate;
        bestDay = day;
        bestHour = parseInt(hourStr);
      }
    }
  }

  return NextResponse.json({
    distribution,
    heatmap,
    insights: {
      under_30min_pct: total > 0
        ? Math.round(((buckets.under_5min + buckets["5_30min"]) / total) * 100)
        : 0,
      best_window: bestDay ? `${bestDay} ${bestHour}h-${bestHour + 1}h` : null,
      best_window_rate: Math.round(bestRate * 10) / 10,
    },
  });
}
