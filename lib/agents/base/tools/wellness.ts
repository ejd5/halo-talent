import type { Tool } from "../types";

async function sendTelegramAlert(creatorId: string, message: string) {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    await supabase.from("notifications").insert({
      user_id: creatorId,
      type: "wellness_alert",
      title: "Alerte bien-être",
      message,
      severity: "critical",
    });
  } catch {
    console.warn("[Wellness] Alert failed");
  }
}

export const getWorkPatterns: Tool = {
  name: "get_work_patterns",
  description: "Get the creator's work patterns: hours active, posts published, messages handled",
  input_schema: {
    type: "object",
    properties: {
      timeframe_days: { type: "number", default: 14 },
    },
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const days = input.timeframe_days ?? 14;
    const since = new Date(Date.now() - days * 86400000).toISOString();

    const { data: posts } = await supabase
      .from("posts")
      .select("created_at, platform")
      .eq("creator_id", creatorId)
      .gte("created_at", since);

    const { data: messages } = await supabase
      .from("messages")
      .select("created_at")
      .eq("creator_id", creatorId)
      .gte("created_at", since);

    const { data: wellnessLogs } = await supabase
      .from("wellness_logs")
      .select("*")
      .eq("creator_id", creatorId)
      .order("date", { ascending: false })
      .limit(days);

    // Estimate patterns
    const postsPerWeek = posts ? Math.round((posts.length / days) * 7) : 0;
    const dmsPerDay = messages ? Math.round(messages.length / days) : 0;

    // Estimate late night activity (messages/posts between 22h-6h)
    const allItems = [...(posts?.map((p) => p.created_at) ?? []), ...(messages?.map((m) => m.created_at) ?? [])];
    const lateNightCount = allItems.filter((d) => {
      const h = new Date(d).getHours();
      return h >= 22 || h < 6;
    }).length;
    const lateNightPct = allItems.length > 0 ? lateNightCount / allItems.length : 0;

    // Days off (no activity)
    const activeDays = new Set(allItems.map((d) => new Date(d).toISOString().slice(0, 10)));
    const daysOff = days - activeDays.size;

    const avgWorkHours = wellnessLogs && wellnessLogs.length > 0
      ? wellnessLogs.reduce((s, l) => s + (l.work_hours ?? 9), 0) / wellnessLogs.length
      : 9.2;

    return {
      avg_hours_per_day: Math.round(avgWorkHours * 10) / 10,
      posts_per_week: postsPerWeek,
      dms_handled_per_day: dmsPerDay,
      days_off_last_period: daysOff,
      late_night_activity_pct: Math.round(lateNightPct * 100) / 100,
      days_analyzed: days,
    };
  },
};

export const getWellnessHistory: Tool = {
  name: "get_wellness_history",
  description: "Get the creator's wellness history (mood scores, sleep quality, work hours)",
  input_schema: {
    type: "object",
    properties: {
      period: { type: "string", enum: ["week", "month", "quarter"] },
    },
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const daysBack = input.period === "week" ? 7 : input.period === "month" ? 30 : 90;
    const since = new Date(Date.now() - daysBack * 86400000).toISOString();

    const { data: logs } = await supabase
      .from("wellness_logs")
      .select("*")
      .eq("creator_id", creatorId)
      .gte("date", since)
      .order("date", { ascending: false });

    if (!logs || logs.length === 0) {
      return { history: null, message: "No wellness data yet. Commence par un daily check-in !" };
    }

    const avgMood = logs.reduce((s, l) => s + (l.mood_score ?? 5), 0) / logs.length;
    const avgSleep = logs.filter((l) => l.sleep_good).length / logs.length;
    const avgHours = logs.reduce((s, l) => s + (l.work_hours ?? 0), 0) / logs.length;

    return {
      period: input.period,
      entries_count: logs.length,
      average_mood: Math.round(avgMood * 10) / 10,
      sleep_quality_pct: Math.round(avgSleep * 100),
      average_work_hours: Math.round(avgHours * 10) / 10,
      streak: calculateStreak(logs),
      history: logs.map((l) => ({
        date: l.date,
        mood: l.mood_score,
        sleep_good: l.sleep_good,
        work_hours: l.work_hours,
        note: l.note,
      })),
    };
  },
};

function calculateStreak(logs: any[]): number {
  if (!logs || logs.length === 0) return 0;
  let streak = 0;
  const today = new Date().toISOString().slice(0, 10);
  for (let i = 0; i < logs.length; i++) {
    const expected = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    if (logs[i]?.date === expected) streak++;
    else break;
  }
  return streak;
}

export const logWellnessCheck: Tool = {
  name: "log_wellness_check",
  description: "Log a daily wellness check-in with mood score, sleep quality, and optional note",
  input_schema: {
    type: "object",
    properties: {
      mood_score: { type: "number", description: "Mood on a scale of 1-10", minimum: 1, maximum: 10 },
      sleep_good: { type: "boolean", description: "Did the creator sleep well?" },
      work_hours: { type: "number", description: "Hours worked today" },
      note: { type: "string", description: "Optional note about the day" },
    },
    required: ["mood_score", "sleep_good"],
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const today = new Date().toISOString().slice(0, 10);

    // Upsert — only one entry per day
    const { data, error } = await supabase.from("wellness_logs").upsert({
      creator_id: creatorId,
      date: today,
      mood_score: input.mood_score,
      sleep_good: input.sleep_good,
      work_hours: input.work_hours ?? null,
      note: input.note ?? null,
    }).select().single();

    if (error) throw new Error(`Failed to log check-in: ${error.message}`);

    // Generate wellness score
    const { data: history } = await supabase
      .from("wellness_logs")
      .select("*")
      .eq("creator_id", creatorId)
      .order("date", { ascending: false })
      .limit(7);

    const avgMood = history ? history.reduce((s, l) => s + (l.mood_score ?? 5), 0) / history.length : input.mood_score;
    const avgSleep = history ? history.filter((l) => l.sleep_good).length / history.length : (input.sleep_good ? 1 : 0);
    const wellnessScore = Math.round(((avgMood / 10) * 60 + avgSleep * 40));

    return {
      logged: true,
      date: today,
      wellness_score: wellnessScore,
      message: "Check-in enregistré ! " + (wellnessScore >= 70 ? "Belle journée continue 🌟" : wellnessScore >= 50 ? "Pas mal ! Quelques ajustements et ce sera top 💪" : "Prends soin de toi aujourd'hui 🌱"),
    };
  },
};

export const suggestBreak: Tool = {
  name: "suggest_break",
  description: "Suggest a break activity based on the creator's current state and preferences",
  input_schema: {
    type: "object",
    properties: {
      duration_minutes: { type: "number", default: 15, description: "Break duration in minutes" },
      activity_type: { type: "string", enum: ["walk", "stretch", "meditation", "nap", "snack", "music", "social"] },
    },
  },
  execute: async (input) => {
    const duration = input.duration_minutes ?? 15;
    const activityType = input.activity_type ?? "walk";

    const suggestions: Record<string, { emoji: string; name: string; description: string }> = {
      walk: { emoji: "🚶", name: "Marche", description: "Marche dehors sans téléphone. Respire et observe." },
      stretch: { emoji: "🤸", name: "Étirements", description: "Étirements du cou, des épaules et du dos. Parfait après des heures assis." },
      meditation: { emoji: "🧘", name: "Méditation", description: "Ferme les yeux. 5 minutes de respiration profonde. Application gratuite : Petit BamBou." },
      nap: { emoji: "😴", name: "Micro-siestes", description: "Sieste de ${duration} minutes max. Idéal pour recharger sans perturber le sommeil nocturne." },
      snack: { emoji: "🥗", name: "Snack sain", description: "Prends une collation équilibrée : fruits, oléagineux, ou un smoothie." },
      music: { emoji: "🎵", name: "Pause musicale", description: "Mets ta playlist préférée et déconnecte ${duration} minutes." },
      social: { emoji: "💬", name: "Social call", description: "Appelle un ami ou un proche. Le contact humain est essentiel." },
    };

    const activity = suggestions[activityType] ?? suggestions.walk;

    return {
      break_type: activityType,
      duration_minutes: duration,
      activity: activity,
      message: `Fais une pause ${activity.name} de ${duration} minutes : ${activity.description}`,
      tip: "L'important est de QUITTER ton écran. Pas de téléphone, pas d'ordinateur.",
    };
  },
};

export const escalateToHuman: Tool = {
  name: "escalate_to_human",
  description: "Escalate a wellness concern to the human manager for follow-up",
  input_schema: {
    type: "object",
    properties: {
      concern: { type: "string", description: "Description of the wellness concern" },
      urgency: { type: "string", enum: ["low", "medium", "high", "critical"] },
      suggested_action: { type: "string", description: "Suggested follow-up action" },
    },
    required: ["concern", "urgency"],
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: creator } = await supabase
      .from("profiles")
      .select("id, display_name, assigned_manager")
      .eq("id", creatorId)
      .single();

    // Create notification for manager
    const managerId = (creator as any)?.assigned_manager ?? creatorId;
    await supabase.from("notifications").insert({
      user_id: managerId,
      type: "wellness_alert",
      title: `Alerte bien-être : ${(creator as any)?.display_name ?? "Créateur"}`,
      message: input.concern,
      severity: input.urgency,
    });

    if (input.urgency === "critical") {
      await sendTelegramAlert(managerId, `🆘 ALERTE CRITIQUE BIEN-ÊTRE : ${(creator as any)?.display_name ?? "Créateur"}`);
    }

    const urgencyMessages: Record<string, string> = {
      low: "Note transmise au manager.",
      medium: "Alerce transmise. Le manager sera informé.",
      high: "Alerte envoyée au manager. Attends un retour rapide.",
      critical: "⚠️ ALERTE CRITIQUE — Le manager et l'équipe sont notifiés.",
    };

    const crisisResources = input.urgency === "critical"
      ? {
          emergency: "Si urgence immédiate, appelle le 3114 (ligne prévention suicide) ou le 15 (SAMU).",
          mental_health: "SOS Amitié : 09 72 39 40 50 (24h/24)",
        }
      : undefined;

    return {
      escalated: true,
      manager_notified: true,
      urgency: input.urgency,
      message: urgencyMessages[input.urgency] ?? "Alerte transmise.",
      resources: crisisResources,
      disclaimer: "Tu n'es pas seul·e. L'équipe Halo prend ça très au sérieux.",
    };
  },
};
