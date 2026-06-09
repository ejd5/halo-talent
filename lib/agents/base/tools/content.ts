import type { Tool } from "../types";

// ─── Helper ──────────────────────────────────────────────

function analyzeOptimalTimes(posts: any[]) {
  if (!posts?.length) {
    return { best_hours: ["18:00", "20:00"], best_days: ["Friday", "Saturday"], note: "Données insuffisantes. Recommandations par défaut." };
  }
  const hourPerformance: Record<number, number[]> = {};
  const dayPerformance: Record<number, number[]> = {};

  posts.forEach((p) => {
    if (!p.published_at || p.engagement_rate == null) return;
    const d = new Date(p.published_at);
    const hour = d.getHours();
    const day = d.getDay();
    if (!hourPerformance[hour]) hourPerformance[hour] = [];
    hourPerformance[hour].push(p.engagement_rate);
    if (!dayPerformance[day]) dayPerformance[day] = [];
    dayPerformance[day].push(p.engagement_rate);
  });

  const avgHour = Object.entries(hourPerformance)
    .map(([h, rates]) => ({ hour: parseInt(h), avg: rates.reduce((a, b) => a + b, 0) / rates.length }))
    .sort((a, b) => b.avg - a.avg);

  const avgDay = Object.entries(dayPerformance)
    .map(([d, rates]) => ({ day: parseInt(d), avg: rates.reduce((a, b) => a + b, 0) / rates.length }))
    .sort((a, b) => b.avg - a.avg);

  const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  return {
    best_hours: avgHour.slice(0, 3).map((h) => `${h.hour.toString().padStart(2, "0")}:00`),
    best_days: avgDay.slice(0, 3).map((d) => dayNames[d.day]),
    analyzed_posts: posts.length,
  };
}

// ─── Existing Tools ──────────────────────────────────────

export const generateContentIdeas: Tool = {
  name: "generate_content_ideas",
  description: "Generate content ideas based on the creator's niche, platform, and current trends.",
  input_schema: {
    type: "object",
    properties: {
      platform: { type: "string", enum: ["onlyfans", "instagram", "tiktok", "youtube", "all"] },
      niche: { type: "string", description: "The creator's niche" },
      count: { type: "number", description: "Number of ideas to generate (max 10)" },
    },
  },
  execute: async (input) => {
    const { Anthropic } = await import("@anthropic-ai/sdk");
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: "You are a creative content strategist. Generate specific, actionable content ideas. Return as JSON array.",
      messages: [{
        role: "user",
        content: `Generate ${input.count ?? 5} content ideas for ${input.platform ?? "social media"} in the ${input.niche ?? "general"} niche. For each idea, include: title, description, estimated production time, and why it would perform well. Return as JSON.`,
      }],
    });
    const text = response.content.filter((c) => c.type === "text").map((c) => c.text).join("");
    try {
      return JSON.parse(text);
    } catch {
      return { ideas: text, note: "Raw text — JSON parsing failed" };
    }
  },
};

export const generateCaption: Tool = {
  name: "generate_caption",
  description: "Generate an optimized caption for a social media post with hashtags.",
  input_schema: {
    type: "object",
    properties: {
      topic: { type: "string", description: "What the post is about" },
      platform: { type: "string", enum: ["onlyfans", "instagram", "tiktok", "youtube"] },
      tone: { type: "string", enum: ["casual", "professional", "funny", "inspirational", "teaser"] },
      include_hashtags: { type: "boolean" },
      language: { type: "string", enum: ["fr", "en"] },
    },
    required: ["topic", "platform"],
  },
  execute: async (input) => {
    const { Anthropic } = await import("@anthropic-ai/sdk");
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `Write a ${input.tone ?? "casual"} caption (in ${input.language ?? "fr"}) for a ${input.platform} post about: "${input.topic}". ${input.include_hashtags ? "Include 10 relevant hashtags at the end." : ""} Keep it under 300 characters.`,
      }],
    });
    return {
      caption: response.content.filter((c) => c.type === "text").map((c) => c.text).join(""),
      platform: input.platform,
      topic: input.topic,
    };
  },
};

export const schedulePost: Tool = {
  name: "schedule_post",
  description: "Schedule a content post on a specific platform at a given time.",
  input_schema: {
    type: "object",
    properties: {
      platform: { type: "string", enum: ["onlyfans", "instagram", "tiktok", "youtube"] },
      content_type: { type: "string", enum: ["post", "story", "reel", "video", "live"] },
      caption: { type: "string" },
      media_url: { type: "string" },
      scheduled_at: { type: "string", description: "ISO 8601 datetime" },
    },
    required: ["platform", "content_type", "scheduled_at"],
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase.from("calendar_posts").insert({
      creator_id: creatorId,
      platform: input.platform,
      content_type: input.content_type,
      caption: input.caption ?? "",
      media_url: input.media_url ?? null,
      scheduled_at: input.scheduled_at,
      status: "scheduled",
    }).select().single();
    if (error) throw new Error(`Failed to schedule: ${error.message}`);
    return { success: true, post: data };
  },
};

export const getContentSuggestions: Tool = {
  name: "get_content_suggestions",
  description: "Get AI-powered suggestions to improve existing content (title, thumbnail, timing, hashtags).",
  input_schema: {
    type: "object",
    properties: {
      content_type: { type: "string", enum: ["post", "video", "reel"] },
      current_title: { type: "string" },
      platform: { type: "string" },
    },
  },
  execute: async (input) => {
    const { Anthropic } = await import("@anthropic-ai/sdk");
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const systemPrompt = "You are a content optimization expert. Provide specific, actionable suggestions.";
    const userPrompt = `Analyze this ${input.content_type} titled "${input.current_title}" for ${input.platform}. Suggest: 1) Title optimization, 2) Best posting time, 3) Hashtag strategy, 4) Thumbnail notes. Return as JSON.`;
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });
    const text = response.content.filter((c) => c.type === "text").map((c) => c.text).join("");
    try {
      return JSON.parse(text);
    } catch {
      return { suggestions: text };
    }
  },
};

// ─── New Tools ────────────────────────────────────────────

export const getContentHistory: Tool = {
  name: "get_content_history",
  description: "Get the last N posts of the creator across all platforms with engagement metrics.",
  input_schema: {
    type: "object",
    properties: {
      limit: { type: "number", default: 20 },
      platform: { type: "string", enum: ["onlyfans", "instagram", "tiktok", "youtube", "twitter", "all"] },
    },
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    let query = supabase.from("posts").select("*").eq("creator_id", creatorId);
    if (input.platform && input.platform !== "all") query = query.eq("platform", input.platform);
    const { data } = await query.order("published_at", { ascending: false }).limit(input.limit || 20);
    return data ?? [];
  },
};

export const generateHook: Tool = {
  name: "generate_hook",
  description: "Generate an attention-grabbing hook for a post. Returns multiple options.",
  input_schema: {
    type: "object",
    properties: {
      topic: { type: "string", description: "What the post is about" },
      platform: { type: "string", enum: ["instagram", "tiktok", "youtube", "twitter", "onlyfans"] },
      content_type: { type: "string", enum: ["post", "story", "reel", "video"] },
      count: { type: "number", default: 5 },
    },
    required: ["topic", "platform"],
  },
  execute: async (input) => {
    const { Anthropic } = await import("@anthropic-ai/sdk");
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      messages: [{
        role: "user",
        content: `Generate ${input.count ?? 5} hooks for a ${input.platform} ${input.content_type ?? "post"} about: "${input.topic}".
Each hook should be short, attention-grabbing, and adapted to the platform format.
Return as a JSON array of strings. Only the array, no introduction.`,
      }],
    });
    const text = response.content.filter((c) => c.type === "text").map((c) => c.text).join("");
    try {
      return { hooks: JSON.parse(text) };
    } catch {
      return { hooks: [text], note: "Raw output" };
    }
  },
};

export const suggestPostingTime: Tool = {
  name: "suggest_posting_time",
  description: "Analyze when the creator gets the best engagement and suggest optimal posting times by platform.",
  input_schema: {
    type: "object",
    properties: {
      platform: { type: "string", enum: ["onlyfans", "instagram", "tiktok", "youtube", "twitter"] },
    },
    required: ["platform"],
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: posts } = await supabase
      .from("posts")
      .select("published_at, engagement_rate")
      .eq("creator_id", creatorId)
      .eq("platform", input.platform)
      .not("published_at", "is", null)
      .gte("published_at", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

    return {
      platform: input.platform,
      ...analyzeOptimalTimes(posts ?? []),
    };
  },
};

export const saveContentIdea: Tool = {
  name: "save_content_idea",
  description: "Save a content idea for the creator to review later.",
  input_schema: {
    type: "object",
    properties: {
      title: { type: "string", description: "Title of the content idea" },
      description: { type: "string", description: "Detailed description" },
      platform: { type: "string", enum: ["onlyfans", "instagram", "tiktok", "youtube", "twitter"] },
      content_type: { type: "string", enum: ["post", "story", "reel", "video", "live"] },
      suggested_caption: { type: "string" },
      suggested_hashtags: { type: "array", items: { type: "string" } },
      suggested_publish_time: { type: "string", description: "ISO datetime" },
    },
    required: ["title", "description", "platform"],
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase.from("content_ideas").insert({
      creator_id: creatorId,
      ...input,
      status: "suggested",
      created_by_agent: "content_strategist",
    }).select().single();
    if (error) throw new Error(`Failed to save idea: ${error.message}`);
    return { success: true, idea_id: data.id };
  },
};

export const scheduleDraft: Tool = {
  name: "schedule_draft",
  description: "Create a draft post scheduled for a specific time. The creator MUST validate before publishing.",
  input_schema: {
    type: "object",
    properties: {
      platform: { type: "string", enum: ["onlyfans", "instagram", "tiktok", "youtube", "twitter"] },
      caption: { type: "string" },
      hashtags: { type: "array", items: { type: "string" } },
      scheduled_for: { type: "string", description: "ISO datetime" },
      content_type: { type: "string", enum: ["post", "story", "reel", "video", "live"] },
    },
    required: ["platform", "caption", "scheduled_for"],
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase.from("scheduled_posts").insert({
      creator_id: creatorId,
      platform: input.platform,
      caption: input.caption,
      hashtags: input.hashtags ?? [],
      scheduled_for: input.scheduled_for,
      content_type: input.content_type ?? "post",
      status: "pending_validation",
      created_by_agent: "content_strategist",
    }).select().single();
    if (error) throw new Error(`Failed to create draft: ${error.message}`);
    return { success: true, post_id: data.id, message: "Brouillon créé. Le créateur doit le valider dans son calendrier." };
  },
};

export const searchMediaLibrary: Tool = {
  name: "search_media_library",
  description: "Search the creator's media library by keywords, mood, colors, or platform suitability. Returns matching media items.",
  input_schema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Search in title, tags, and AI description" },
      mood: { type: "string", enum: ["energetic", "calm", "mysterious", "playful", "romantic", "professional", "edgy", "warm", "dark", "colorful"], description: "Filter by AI-detected mood" },
      platform: { type: "string", enum: ["instagram", "youtube", "tiktok", "onlyfans", "twitter"], description: "Filter by suitable platform" },
      type: { type: "string", enum: ["image", "video", "audio", "document"], description: "Filter by media type" },
      limit: { type: "number", description: "Max results (default 10)" },
    },
  },
  execute: async (input) => {
    const { mediaItems } = await import("@/lib/library/mock");
    let results = [...mediaItems];
    const q = input.query?.toLowerCase();
    if (q) {
      results = results.filter((m) =>
        m.title.toLowerCase().includes(q) ||
        m.tags.some((t) => t.includes(q)) ||
        m.ai_tags.some((t) => t.includes(q)) ||
        (m.ai_description ?? "").toLowerCase().includes(q)
      );
    }
    if (input.mood) results = results.filter((m) => m.ai_mood === input.mood);
    if (input.platform) results = results.filter((m) => m.ai_suitable_platforms.includes(input.platform));
    if (input.type) results = results.filter((m) => m.type === input.type);
    return results.slice(0, input.limit ?? 10).map((m) => ({
      id: m.id, title: m.title, url: m.url, type: m.type,
      tags: [...m.tags, ...m.ai_tags],
      mood: m.ai_mood, description: m.ai_description,
      suitable_for: m.ai_suitable_platforms,
    }));
  },
};

export const analyzePostPerformance: Tool = {
  name: "analyze_post_performance",
  description: "Analyze a specific post's performance and provide recommendations.",
  input_schema: {
    type: "object",
    properties: {
      post_id: { type: "string", description: "The post ID to analyze" },
      platform: { type: "string", enum: ["onlyfans", "instagram", "tiktok", "youtube", "twitter"] },
    },
    required: ["post_id"],
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: post } = await supabase
      .from("posts")
      .select("*")
      .eq("id", input.post_id)
      .eq("creator_id", creatorId)
      .single();

    if (!post) return { error: "Post not found" };

    const { Anthropic } = await import("@anthropic-ai/sdk");
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `Analyze this ${input.platform ?? "social media"} post performance:
- Likes: ${post.likes ?? "N/A"}
- Comments: ${post.comments ?? "N/A"}
- Views: ${post.views ?? "N/A"}
- Engagement rate: ${post.engagement_rate ?? "N/A"}%
- Posted: ${post.published_at ?? "Unknown"}

Provide: 1) What worked well, 2) What could be improved, 3) A recommendation for the next similar post.
Be specific and actionable. Return as a JSON object with keys: strengths, improvements, recommendation.`,
      }],
    });
    const text = response.content.filter((c) => c.type === "text").map((c) => c.text).join("");
    try {
      return { post_id: input.post_id, ...JSON.parse(text) };
    } catch {
      return { post_id: input.post_id, analysis: text };
    }
  },
};
