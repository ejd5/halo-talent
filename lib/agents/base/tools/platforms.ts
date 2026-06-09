import type { Tool } from "../types";

export const syncPlatformAccount: Tool = {
  name: "sync_platform_account",
  description: "Trigger a sync of a connected platform account to refresh stats and content.",
  input_schema: {
    type: "object",
    properties: {
      platform: { type: "string", enum: ["onlyfans", "instagram", "tiktok", "youtube"] },
    },
    required: ["platform"],
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    // Trigger async sync via RPC or API route
    const { data, error } = await supabase.rpc("trigger_platform_sync", {
      p_creator_id: creatorId,
      p_platform: input.platform,
    });
    if (error) throw new Error(`Sync failed: ${error.message}`);
    return { status: "syncing", platform: input.platform, message: "Sync started" };
  },
};

export const getPlatformInsights: Tool = {
  name: "get_platform_insights",
  description: "Get detailed analytics insights for a specific platform (engagement rate, best posting times, audience demographics).",
  input_schema: {
    type: "object",
    properties: {
      platform: { type: "string", enum: ["onlyfans", "instagram", "tiktok", "youtube", "all"] },
      period: { type: "string", enum: ["7d", "30d", "90d"] },
    },
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    let query = supabase.from("platform_insights").select("*").eq("creator_id", creatorId);
    if (input.platform && input.platform !== "all") query = query.eq("platform", input.platform);
    if (input.period) query = query.eq("period", input.period);
    const { data } = await query.order("fetched_at", { ascending: false }).limit(10);
    return data ?? [];
  },
};

export const getCompetitorAnalysis: Tool = {
  name: "get_competitor_analysis",
  description: "Get competitive analysis data comparing the creator to similar creators in their niche.",
  input_schema: {
    type: "object",
    properties: {
      platform: { type: "string" },
      niche: { type: "string", description: "e.g. fitness, beauty, music" },
    },
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase.from("competitive_analysis")
      .select("*")
      .eq("creator_id", creatorId)
      .maybeSingle();
    return data ?? { message: "Competitive analysis not yet generated" };
  },
};

export const getTrendingTopics: Tool = {
  name: "get_trending_topics",
  description: "Get currently trending topics, hashtags, and content formats in the creator's niche.",
  input_schema: {
    type: "object",
    properties: {
      niche: { type: "string", description: "Content niche" },
      platform: { type: "string" },
    },
  },
  execute: async (input) => {
    // In production: query trend tracking service / Redis cache
    // Mock response for now
    const trends = [
      { topic: "#summerglow", volume: 245000, growth: "+32%", platform: "instagram" },
      { topic: "Morning Routine", volume: 189000, growth: "+18%", platform: "tiktok" },
      { topic: "GRWM", volume: 312000, growth: "+45%", platform: "youtube" },
      { topic: "Behind the Scenes", volume: 98000, growth: "+67%", platform: "onlyfans" },
    ];
    const filtered = input.platform
      ? trends.filter((t) => t.platform === input.platform)
      : trends;
    return { trending: filtered, niche: input.niche ?? "general", generated_at: new Date().toISOString() };
  },
};
