import { ApifyClient } from "apify-client";
import { createClient, createAdminClient } from "@/lib/supabase/server";

const apifyClient = new ApifyClient({ token: process.env.APIFY_TOKEN! });

function shouldUseScrapeCreators(): boolean {
  return process.env.TIKTOK_PROVIDER === "scrapecreators";
}

export class TikTokCreativeProvider {
  private readonly ACTOR_ID = "doliz/tiktok-creative-center-scraper";
  private readonly CACHE_TTL_HOURS = 6;

  async getTrendingHashtags(params: {
    region?: string;
    industry?: string;
    period?: "7" | "30" | "120";
  }) {
    const cached = await this.getCached("hashtags", params);
    if (cached) return cached;

    if (shouldUseScrapeCreators()) {
      return this.fetchViaScrapeCreators("hashtags", params);
    }

    const run = await apifyClient.actor(this.ACTOR_ID).call({
      contentType: "hashtags",
      country: params.region || "FR",
      period: parseInt(params.period || "7"),
      industry: params.industry,
      limit: 100,
    });

    const { items } = await apifyClient
      .dataset(run.defaultDatasetId)
      .listItems();
    const normalized = items.map((item: any) => ({
      name: item.hashtag_name || item.name,
      videos_count: item.video_views || item.publish_cnt || item.posts,
      rank: item.rank,
      rank_diff: item.rank_diff || 0,
      country: params.region,
      industry: item.industry || params.industry,
    }));

    await Promise.all([
      this.logApifyUsage(this.ACTOR_ID),
      this.saveCache("hashtags", params, normalized),
    ]);
    return normalized;
  }

  async getTrendingSongs(params: {
    region?: string;
    period?: "7" | "30" | "120";
    commercialOnly?: boolean;
  }) {
    const cached = await this.getCached("songs", params);
    if (cached) return cached;

    if (shouldUseScrapeCreators()) {
      return this.fetchViaScrapeCreators("songs", params);
    }

    const run = await apifyClient.actor(this.ACTOR_ID).call({
      contentType: "songs",
      country: params.region || "FR",
      period: parseInt(params.period || "7"),
      commercialMusic: params.commercialOnly || false,
      limit: 50,
    });

    const { items } = await apifyClient
      .dataset(run.defaultDatasetId)
      .listItems();
    const normalized = items.map((item: any) => ({
      title: item.title || item.song_name,
      author: item.author,
      cover_url: item.cover,
      duration: item.duration,
      videos_using: item.video_count,
      rank: item.rank,
      rank_diff: item.rank_diff || 0,
      is_commercial: item.is_commercial,
      preview_url: item.preview_url,
      tiktok_song_id: item.song_id,
    }));

    await Promise.all([
      this.logApifyUsage(this.ACTOR_ID),
      this.saveCache("songs", params, normalized),
    ]);
    return normalized;
  }

  async getTopAds(params: {
    region?: string;
    industry?: string;
    period?: "7" | "30";
  }) {
    const cached = await this.getCached("top_ads", params);
    if (cached) return cached;

    if (shouldUseScrapeCreators()) {
      return this.fetchViaScrapeCreators("top_ads", params);
    }

    const run = await apifyClient.actor(this.ACTOR_ID).call({
      contentType: "topAds",
      country: params.region || "FR",
      period: parseInt(params.period || "7"),
      industry: params.industry,
      limit: 30,
    });

    const { items } = await apifyClient
      .dataset(run.defaultDatasetId)
      .listItems();
    const normalized = items.map((ad: any) => ({
      brand_name: ad.brand_name,
      industry: ad.industry,
      video_url: ad.video_url,
      cover_url: ad.cover_url,
      likes: ad.like_count,
      ctr: ad.ctr,
      cvr: ad.cvr,
      view_rate_6s: ad.view_rate_6s,
      duration: ad.duration,
    }));

    await Promise.all([
      this.logApifyUsage(this.ACTOR_ID),
      this.saveCache("top_ads", params, normalized),
    ]);
    return normalized;
  }

  async getTopCreators(params: { region?: string; industry?: string }) {
    const cached = await this.getCached("top_creators", params);
    if (cached) return cached;

    if (shouldUseScrapeCreators()) {
      return this.fetchViaScrapeCreators("top_creators", params);
    }

    const run = await apifyClient.actor(this.ACTOR_ID).call({
      contentType: "topCreators",
      country: params.region || "FR",
      industry: params.industry,
      limit: 30,
    });

    const { items } = await apifyClient
      .dataset(run.defaultDatasetId)
      .listItems();
    const normalized = items.map((c: any) => ({
      username: c.unique_id || c.username,
      nickname: c.nickname,
      avatar: c.avatar,
      followers: c.follower_count,
      avg_likes: c.avg_like_count,
      industry: c.industry || params.industry,
    }));

    await Promise.all([
      this.logApifyUsage(this.ACTOR_ID),
      this.saveCache("top_creators", params, normalized),
    ]);
    return normalized;
  }

  async getHashtagDetails(hashtagName: string) {
    const cached = await this.getCached("hashtag_detail", { hashtag: hashtagName });
    if (cached) return cached;

    const run = await apifyClient.actor(this.ACTOR_ID).call({
      contentType: "hashtagDetail",
      hashtag: hashtagName,
      limit: 50,
    });

    const { items } = await apifyClient
      .dataset(run.defaultDatasetId)
      .listItems();

    await Promise.all([
      this.logApifyUsage(this.ACTOR_ID),
      this.saveCache("hashtag_detail", { hashtag: hashtagName }, items),
    ]);
    return items;
  }

  private async fetchViaScrapeCreators(_type: string, _params: any): Promise<any[]> {
    // Placeholder for ScrapeCreators fallback (future integration)
    console.warn("[TikTok] ScrapeCreators fallback not implemented yet");
    return [];
  }

  private async getCached(type: string, params: any) {
    try {
      const supabase = await createClient();
      const key = JSON.stringify({ type, ...params });
      const { data } = await supabase
        .from("trends_cache")
        .select("data")
        .eq("source", "tiktok_creative")
        .eq("query", key)
        .gt("expires_at", new Date().toISOString())
        .single();
      return (data?.data as any[]) ?? null;
    } catch {
      // If cache read fails, try expired cache as fallback
      try {
        const supabase = await createClient();
        const key = JSON.stringify({ type, ...params });
        const { data } = await supabase
          .from("trends_cache")
          .select("data")
          .eq("source", "tiktok_creative")
          .eq("query", key)
          .single();
        if (data?.data) {
          console.warn("[TikTok] Returning expired cache for", type);
          return data.data as any[];
        }
      } catch {}
      return null;
    }
  }

  private async saveCache(type: string, params: any, data: any) {
    try {
      const admin = createAdminClient();
      const key = JSON.stringify({ type, ...params });
      const expiresAt = new Date(
        Date.now() + this.CACHE_TTL_HOURS * 3600 * 1000,
      );
      await admin.from("trends_cache").upsert(
        {
          source: "tiktok_creative",
          query: key,
          geo: params.region || "",
          timeframe: params.period || "7",
          data,
          expires_at: expiresAt,
        },
        { onConflict: "source,query,geo,timeframe" },
      );
    } catch (e) {
      console.warn("[TikTok] Cache write failed", e);
    }
  }

  private async logApifyUsage(actorId: string) {
    try {
      const admin = createAdminClient();
      await admin.from("apify_usage_logs").insert({
        actor_id: actorId,
        cost_estimate: 0.05, // rough estimate per call
      });
    } catch (e) {
      console.warn("[TikTok] Usage log failed", e);
    }
  }
}
