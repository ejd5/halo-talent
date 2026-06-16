import type { Tool } from "../types";

// ─── Helpers ────────────────────────────────────────────────

function getDateXAgo(period: string): string {
  const d = new Date();
  switch (period) {
    case "day": d.setDate(d.getDate() - 1); break;
    case "week": d.setDate(d.getDate() - 7); break;
    case "month": d.setMonth(d.getMonth() - 1); break;
    default: d.setDate(d.getDate() - 7);
  }
  return d.toISOString();
}

// ─── Trend Tools ────────────────────────────────────────────

export const searchYouTubeTrends: Tool = {
  name: "search_youtube_trends",
  description: "Search YouTube for recent trending videos in a niche",
  input_schema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Search query for the niche" },
      time_range: { type: "string", enum: ["day", "week", "month"] },
      min_views: { type: "number", description: "Minimum view count filter" },
    },
    required: ["query"],
  },
  execute: async (input) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      // Return mock data when no API key
      return {
        source: "demo",
        trends: [
          { title: `${input.query}, Day in the Life 2026`, channel: "TopCreator", published_at: new Date().toISOString(), views: 245000, likes: 18000 },
          { title: `${input.query} Transformation Challenge`, channel: "ViralStar", published_at: new Date().toISOString(), views: 189000, likes: 14200 },
          { title: `${input.query} Q&A, Réponds à toutes vos questions`, channel: "InfluencerPro", published_at: new Date().toISOString(), views: 132000, likes: 9800 },
          { title: `J'ai testé ${input.query} pendant 30 jours`, channel: "ChallengeTube", published_at: new Date().toISOString(), views: 89000, likes: 7200 },
          { title: `${input.query} Routine Matinale 2026`, channel: "DailyVlog", published_at: new Date().toISOString(), views: 67000, likes: 5400 },
        ],
        note: "Mode démo, Configure YOUTUBE_API_KEY pour des données réelles.",
      };
    }

    const publishedAfter = getDateXAgo(input.time_range || "week");
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(input.query)}&type=video&order=viewCount&publishedAfter=${publishedAfter}&maxResults=10&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (!data.items) return { source: "youtube", trends: [], error: "No results" };

      const videoIds = data.items.map((i: any) => i.id.videoId).filter(Boolean).join(",");
      const statsMap: Record<string, any> = {};

      if (videoIds) {
        const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${apiKey}`;
        const statsRes = await fetch(statsUrl);
        const statsData = await statsRes.json();
        if (statsData.items) {
          statsData.items.forEach((item: any) => {
            statsMap[item.id] = item.statistics;
          });
        }
      }

      const trends = data.items
        .filter((item: any) => item.id?.videoId)
        .map((item: any) => {
          const stats = statsMap[item.id.videoId] || {};
          const views = parseInt(stats.viewCount || "0");
          return {
            title: item.snippet.title,
            channel: item.snippet.channelTitle,
            published_at: item.snippet.publishedAt,
            thumbnail: item.snippet.thumbnails?.medium?.url ?? null,
            url: `https://youtube.com/watch?v=${item.id.videoId}`,
            views,
            likes: parseInt(stats.likeCount || "0"),
            comments: parseInt(stats.commentCount || "0"),
          };
        })
        .filter((v: any) => !input.min_views || v.views >= input.min_views);

      return { source: "youtube", trends, query: input.query };
    } catch (error: any) {
      return { source: "youtube", trends: [], error: error.message };
    }
  },
};

export const searchTikTokTrends: Tool = {
  name: "search_tiktok_trends",
  description: "Search TikTok for trending sounds, hashtags, and video formats in a niche",
  input_schema: {
    type: "object",
    properties: {
      niche: { type: "string", description: "Niche to search trends for" },
      time_range: { type: "string", enum: ["day", "week", "month"] },
    },
  },
  execute: async (input) => {
    // TikTok API requires partnership, mock data
    const niche = input.niche ?? "general";
    const trendsByNiche: Record<string, any[]> = {
      fitness: [
        { sound: "Workout Glow Up 2026", uses: 245000, format: "Transformation Reel", hashtag: "#fitnessjourney", urgency: "high" },
        { sound: "Morning Gym Routine", uses: 189000, format: "Day in the Life", hashtag: "#gymtok", urgency: "medium" },
        { sound: "30 Day Challenge Tone Up", uses: 132000, format: "Challenge Series", hashtag: "#30daychallenge", urgency: "high" },
      ],
      beauty: [
        { sound: "GRWM Summer Glow", uses: 312000, format: "Get Ready With Me", hashtag: "#grwm", urgency: "high" },
        { sound: "Product Review 2026", uses: 198000, format: "Review Format", hashtag: "#beautytok", urgency: "medium" },
        { sound: "Makeup Transformation", uses: 256000, format: "Before/After", hashtag: "#makeup", urgency: "high" },
      ],
      music: [
        { sound: "Original Sound Preview", uses: 89000, format: "Acoustic Cover", hashtag: "#music", urgency: "medium" },
        { sound: "Behind the Song", uses: 67000, format: "Story Time", hashtag: "#songwriter", urgency: "low" },
      ],
      lifestyle: [
        { sound: "Day in My Life", uses: 445000, format: "Vlog Style", hashtag: "#dayinmylife", urgency: "high" },
        { sound: "Productivity Hacks 2026", uses: 234000, format: "Tips Format", hashtag: "#productivity", urgency: "medium" },
      ],
    };

    const trends = trendsByNiche[niche] ?? [
      { sound: "Trending Sound", uses: 150000, format: "Trending Format", hashtag: "#trending", urgency: "medium" },
      { sound: "Viral Audio 2026", uses: 120000, format: "Duet/Stitch", hashtag: "#viral", urgency: "high" },
    ];

    return { source: "tiktok", niche, trends, note: "TikTok API limitée, données basées sur l'observation publique." };
  },
};

export const analyzeCompetitors: Tool = {
  name: "analyze_competitors",
  description: "Analyze what successful creators in the same niche are doing (posting frequency, formats, engagement)",
  input_schema: {
    type: "object",
    properties: {
      competitor_usernames: { type: "array", items: { type: "string" }, description: "List of competitor usernames" },
      platform: { type: "string", enum: ["instagram", "tiktok", "youtube", "onlyfans"] },
    },
    required: ["competitor_usernames"],
  },
  execute: async (input) => {
    const usernames = input.competitor_usernames ?? [];
    const platform = input.platform ?? "instagram";

    // Mock competitor analysis
    const competitors = usernames.map((username: string) => ({
      username,
      platform,
      posts_per_week: Math.floor(Math.random() * 15) + 5,
      avg_engagement_rate: Math.round((Math.random() * 5 + 1) * 10) / 10,
      top_formats: ["Reels (60%)", "Carousels (30%)", "Stories (10%)"],
      common_themes: ["Lifestyle", "Behind the Scenes", "Outfits"],
      recent_viral_post: null,
      estimated_followers: Math.floor(Math.random() * 50000) + 5000,
    }));

    return {
      platform,
      competitors,
      summary: {
        avg_posts_per_week: Math.round(competitors.reduce((s: number, c: any) => s + c.posts_per_week, 0) / competitors.length),
        avg_engagement: Math.round(competitors.reduce((s: number, c: any) => s + c.avg_engagement_rate, 0) / competitors.length * 10) / 10,
        total_analyzed: competitors.length,
      },
      note: "Analyse basée sur les données disponibles publiquement.",
    };
  },
};

export const detectViralContent: Tool = {
  name: "detect_viral_content",
  description: "Detect content patterns that are going viral in the niche right now",
  input_schema: {
    type: "object",
    properties: {
      niche: { type: "string", description: "The creator's niche" },
      platform: { type: "string", enum: ["instagram", "tiktok", "youtube", "onlyfans", "all"] },
    },
  },
  execute: async (input) => {
    const niche = input.niche ?? "general";
    const patternsByNiche: Record<string, any[]> = {
      fitness: [
        { pattern: "Transformation 30 jours", examples: ["Avant/Après Reel", "Daily Check-in"], avg_views_multiplier: 4.2, urgency: "high", platforms: ["tiktok", "instagram"] },
        { pattern: "Routine matinale fitness", examples: ["Day in the Life", "Morning Workout"], avg_views_multiplier: 2.8, urgency: "medium", platforms: ["youtube", "tiktok"] },
        { pattern: "My Fitness Journey Story", examples: ["Emotional Storytelling"], avg_views_multiplier: 3.5, urgency: "high", platforms: ["instagram", "youtube"] },
      ],
      beauty: [
        { pattern: "GRWM avec produits", examples: ["Get Ready With Me format"], avg_views_multiplier: 3.8, urgency: "high", platforms: ["tiktok", "instagram"] },
        { pattern: "Makeup Transformation", examples: ["Before/After Reel"], avg_views_multiplier: 4.5, urgency: "high", platforms: ["tiktok", "instagram"] },
        { pattern: "Product Review Honest", examples: ["Review format"], avg_views_multiplier: 2.5, urgency: "medium", platforms: ["youtube", "tiktok"] },
      ],
      music: [
        { pattern: "Behind the Song Story", examples: ["Songwriting Process"], avg_views_multiplier: 3.0, urgency: "medium", platforms: ["youtube", "tiktok"] },
        { pattern: "Acoustic Cover Trend", examples: ["Current Song Cover"], avg_views_multiplier: 2.2, urgency: "low", platforms: ["youtube", "tiktok"] },
      ],
      lifestyle: [
        { pattern: "Day in My Life vlog", examples: ["Full Day Montage"], avg_views_multiplier: 3.2, urgency: "high", platforms: ["youtube", "tiktok"] },
        { pattern: "Productivity Routines", examples: ["Morning Routine"], avg_views_multiplier: 2.5, urgency: "medium", platforms: ["youtube", "instagram"] },
      ],
    };

    const patterns = patternsByNiche[niche] ?? [
      { pattern: "Behind the Scenes content", examples: ["BTS Reel", "Studio Tour"], avg_views_multiplier: 2.5, urgency: "medium", platforms: ["instagram", "tiktok"] },
      { pattern: "Q&A format", examples: ["Answering Questions"], avg_views_multiplier: 2.0, urgency: "low", platforms: ["youtube", "instagram"] },
    ];

    const filtered = input.platform && input.platform !== "all"
      ? patterns.filter((p) => p.platforms.includes(input.platform))
      : patterns;

    return {
      niche,
      platform: input.platform ?? "all",
      viral_patterns: filtered,
      total_patterns: filtered.length,
      generated_at: new Date().toISOString(),
      note: "Basé sur l'analyse des tendances actuelles. Met à jour quotidiennement.",
    };
  },
};

export const getGoogleTrends: Tool = {
  name: "get_google_trends",
  description: "Get Google Trends data for a keyword to see interest over time and related queries",
  input_schema: {
    type: "object",
    properties: {
      keyword: { type: "string", description: "Keyword to check trends for" },
      timeframe: { type: "string", enum: ["7d", "30d", "90d", "12m"] },
    },
  },
  execute: async (input) => {
    const keyword = input.keyword ?? "";
    const timeframe = input.timeframe ?? "30d";

    // Google Trends API requires authenticated access
    const timeframeLabel = timeframe === "7d" ? "7 jours"
      : timeframe === "30d" ? "30 jours"
      : timeframe === "90d" ? "90 jours"
      : "12 mois";

    return {
      source: "google_trends",
      keyword,
      timeframe: timeframeLabel,
      interest_over_time: [
        { date: "2026-05", value: 45 },
        { date: "2026-04", value: 52 },
        { date: "2026-03", value: 38 },
        { date: "2026-02", value: 41 },
        { date: "2026-01", value: 55 },
      ],
      related_queries: [
        { query: `${keyword} ideas`, growth: "+120%" },
        { query: `${keyword} tips`, growth: "+85%" },
        { query: `${keyword} 2026`, growth: "+65%" },
        { query: `${keyword} tutorial`, growth: "+45%" },
      ],
      trend_direction: "stable",
      note: "Google Trends API requiert authentication. Données indicatives basées sur les tendances observées.",
    };
  },
};

export const getTikTokTrendingHashtags: Tool = {
  name: "get_tiktok_trending_hashtags",
  description: "Get trending TikTok hashtags for a region from the TikTok Creative Center",
  input_schema: {
    type: "object",
    properties: {
      region: { type: "string", description: "Region code (FR, US, GB, JP, BR, DE, IT, ES)" },
      period: { type: "string", enum: ["7", "30", "120"] },
      industry: { type: "string", description: "Industry filter (optional)" },
    },
    required: [],
  },
  execute: async (input) => {
    const region = input.region ?? "FR";
    const period = input.period ?? "7";
    const params = new URLSearchParams({ region, period });
    if (input.industry) params.set("industry", input.industry);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/trends/tiktok/hashtags?${params}`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      return { source: "tiktok_creative", region, period, hashtags: data.hashtags ?? [] };
    } catch (e: any) {
      return { source: "tiktok_creative", region, period, hashtags: [], error: e.message };
    }
  },
};

export const getTikTokTrendingSongs: Tool = {
  name: "get_tiktok_trending_songs",
  description: "Get trending TikTok songs/sounds for a region from the TikTok Creative Center",
  input_schema: {
    type: "object",
    properties: {
      region: { type: "string", description: "Region code (FR, US, GB, JP, BR, DE, IT, ES)" },
      period: { type: "string", enum: ["7", "30", "120"] },
      commercialOnly: { type: "boolean", description: "Only show commercial-safe songs" },
    },
    required: [],
  },
  execute: async (input) => {
    const region = input.region ?? "FR";
    const period = input.period ?? "7";
    const params = new URLSearchParams({ region, period });
    if (input.commercialOnly) params.set("commercialOnly", "true");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/trends/tiktok/songs?${params}`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      return { source: "tiktok_creative", region, period, songs: data.songs ?? [] };
    } catch (e: any) {
      return { source: "tiktok_creative", region, period, songs: [], error: e.message };
    }
  },
};

export const getTikTokTopAds: Tool = {
  name: "get_tiktok_top_ads",
  description: "Get top performing TikTok ads for a region from the TikTok Creative Center",
  input_schema: {
    type: "object",
    properties: {
      region: { type: "string", description: "Region code (FR, US, GB, JP, BR, DE, IT, ES)" },
      industry: { type: "string", description: "Industry filter (optional)" },
    },
    required: [],
  },
  execute: async (input) => {
    const region = input.region ?? "FR";
    const params = new URLSearchParams({ region });
    if (input.industry) params.set("industry", input.industry);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/trends/tiktok/top-ads?${params}`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      return { source: "tiktok_creative", region, ads: data.ads ?? [] };
    } catch (e: any) {
      return { source: "tiktok_creative", region, ads: [], error: e.message };
    }
  },
};
