import { ApifyClient } from "apify-client";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { TrendItem } from "../types";

const apifyClient = process.env.APIFY_TOKEN
  ? new ApifyClient({ token: process.env.APIFY_TOKEN })
  : null;

// ─── Types ───────────────────────────────────────────────────────

export interface TrendQuery {
  keyword: string;
  geo?: string;
  timeframe?: string;
  includeRelated?: boolean;
}

export interface InterestPoint {
  date: string;
  value: number;
}

export interface TrendData {
  keyword: string;
  geo: string;
  timeframe: string;
  interest_over_time: InterestPoint[];
  related_queries?: { top: RelatedQuery[]; rising: RelatedQuery[] };
  interest_by_region?: RegionInterest[];
  peak_value: number;
  current_value: number;
  source: "apify" | "serpapi" | "cache" | "mock";
}

export interface RelatedQuery {
  query: string;
  value: number;
}

export interface RegionInterest {
  region: string;
  value: number;
}

// ─── Rate limiter (in-memory, per creator) ───────────────────────

const rateMap = new Map<string, number[]>();

function checkRateLimit(creatorId: string): boolean {
  const now = Date.now();
  const window = now - 60_000;
  const hits = (rateMap.get(creatorId) ?? []).filter((t) => t > window);
  if (hits.length >= 5) return false;
  hits.push(now);
  rateMap.set(creatorId, hits);
  return true;
}

// ─── Provider ────────────────────────────────────────────────────

export class GoogleTrendsProvider {
  async getTrend(
    params: TrendQuery,
    creatorId?: string,
  ): Promise<TrendData> {
    if (creatorId && !checkRateLimit(creatorId)) {
      throw new Error("RATE_LIMIT");
    }

    // 1. Cache check (6h TTL)
    const cached = await this.getCached(params);
    if (cached) return { ...cached, source: "cache" as const };

    // 2. Apify (production)
    if (apifyClient) {
      try {
        const data = await this.fetchFromApify(params);
        await this.saveCache(params, data);
        return data;
      } catch (e) {
        console.warn("[GoogleTrends] Apify failed, falling back to SerpApi", e);
      }
    }

    // 3. SerpApi fallback
    if (process.env.SERPAPI_KEY) {
      try {
        const data = await this.fetchFromSerpApi(params);
        await this.saveCache(params, data);
        return data;
      } catch (e: any) {
        if (String(e?.message ?? "").includes("quota") || String(e?.message ?? "").includes("402")) {
          await this.alertAdminQuotaExhausted();
        }
        console.warn("[GoogleTrends] SerpApi failed", e);
      }
    }

    // 4. Mock fallback (dev)
    const mock = this.getMockData(params);
    const mockWithSource = { ...mock, source: "mock" as const };
    await this.saveCache(params, mockWithSource);
    return mockWithSource;
  }

  async getDailyTrends(geo: string): Promise<TrendData[]> {
    const keywords =
      geo === "FR"
        ? [
            "IA création contenu",
            "OnlyFans marketing",
            "newsletter créateur",
            "automatisation marketing",
            "personal branding",
          ]
        : [
            "AI content creation",
            "creator economy",
            "short form video",
            "email marketing creators",
            "audience building",
          ];

    const results: TrendData[] = [];
    for (const keyword of keywords) {
      const trend = await this.getTrend({ keyword, geo, timeframe: "now 7-d" });
      results.push(trend);
    }
    return results;
  }

  async getRelatedQueries(
    keyword: string,
    geo?: string,
  ): Promise<{ top: RelatedQuery[]; rising: RelatedQuery[] } | undefined> {
    const trend = await this.getTrend({
      keyword,
      geo,
      timeframe: "today 1-m",
      includeRelated: true,
    });
    return trend.related_queries;
  }

  // ─── Apify ──────────────────────────────────────────────────

  private async fetchFromApify(params: TrendQuery): Promise<TrendData> {
    const run = await apifyClient!.actor(
      "s-r/free-google-trends-scraper",
    ).call({
      keywords: [params.keyword],
      geo: params.geo || "",
      timeframe: params.timeframe || "today 1-m",
      use_residential_proxy: false,
    });

    const { items } = await apifyClient!.dataset(
      run.defaultDatasetId,
    ).listItems();
    const normalized = this.normalizeApifyData(items as any[], params);
    return { ...normalized, source: "apify" as const };
  }

  private normalizeApifyData(
    items: any[],
    params: TrendQuery,
  ): Omit<TrendData, "source"> {
    const raw = items?.[0] ?? {};
    const timeline = raw.interest_over_time ?? raw.timeline ?? [];
    const topRaw = raw.related_queries_top ?? raw.top_queries ?? [];
    const risingRaw = raw.related_queries_rising ?? raw.rising_queries ?? [];

    const points: InterestPoint[] = [];
    let maxVal = 0;

    for (const point of timeline) {
      const date = point.date ?? point.time ?? "";
      const value = parseInt(point.value ?? "0", 10);
      if (date) {
        points.push({ date, value });
        if (value > maxVal) maxVal = value;
      }
    }

    const top: RelatedQuery[] = topRaw.map((q: any) => ({
      query: q.query ?? "",
      value: parseInt(q.value ?? "0", 10),
    }));

    const rising: RelatedQuery[] = risingRaw.map((q: any) => ({
      query: q.query ?? "",
      value: parseInt(q.value ?? "0", 10),
    }));

    return {
      keyword: params.keyword,
      geo: params.geo || "",
      timeframe: params.timeframe || "today 1-m",
      interest_over_time: points,
      related_queries:
        top.length || rising.length ? { top, rising } : undefined,
      peak_value: maxVal,
      current_value: points.length > 0 ? points[points.length - 1].value : 0,
    };
  }

  // ─── SerpApi ────────────────────────────────────────────────

  private async fetchFromSerpApi(params: TrendQuery): Promise<TrendData> {
    const url = new URL("https://serpapi.com/search.json");
    url.searchParams.set("engine", "google_trends");
    url.searchParams.set("q", params.keyword);
    url.searchParams.set("data_type", "TIMESERIES");
    if (params.geo) url.searchParams.set("geo", params.geo);
    if (params.timeframe) url.searchParams.set("date", params.timeframe);
    if (params.includeRelated)
      url.searchParams.set("data_type", "RELATED_QUERIES");
    url.searchParams.set("api_key", process.env.SERPAPI_KEY!);

    const response = await fetch(url.toString());
    if (!response.ok) {
      if (response.status === 402) throw new Error("SerpApi quota exhausted");
      throw new Error(`SerpApi: ${response.status}`);
    }

    const data = await response.json();
    const normalized = this.normalizeSerpApiData(data, params);
    return { ...normalized, source: "serpapi" as const };
  }

  private normalizeSerpApiData(data: any, params: TrendQuery): Omit<TrendData, "source"> {
    const points: InterestPoint[] = [];
    const timeline = data?.interest_over_time?.timeline_data ?? [];
    for (const point of timeline) {
      points.push({
        date: point.date ?? "",
        value: parseInt(point.value?.[0] ?? point.value ?? "0", 10),
      });
    }

    let relatedTop: RelatedQuery[] = [];
    let relatedRising: RelatedQuery[] = [];
    const related = data?.related_queries ?? {};
    if (related.top?.queries) {
      relatedTop = related.top.queries.map((q: any) => ({
        query: q.query ?? "",
        value: parseInt(q.value ?? "0", 10),
      }));
    }
    if (related.rising?.queries) {
      relatedRising = related.rising.queries.map((q: any) => ({
        query: q.query ?? "",
        value: parseInt(q.value ?? "0", 10),
      }));
    }

    const regions: RegionInterest[] = [];
    const geoMap = data?.interest_by_region ?? {};
    for (const [region, value] of Object.entries(geoMap)) {
      regions.push({ region, value: value as number });
    }

    const maxVal = points.reduce((m, p) => Math.max(m, p.value), 0);

    return {
      keyword: params.keyword,
      geo: params.geo || "",
      timeframe: params.timeframe || "today 1-m",
      interest_over_time: points,
      related_queries:
        relatedTop.length || relatedRising.length
          ? { top: relatedTop, rising: relatedRising }
          : undefined,
      interest_by_region: regions.length > 0 ? regions : undefined,
      peak_value: maxVal,
      current_value: points.length > 0 ? points[points.length - 1].value : 0,
    };
  }

  // ─── Cache (Supabase) ───────────────────────────────────────

  private async getCached(params: TrendQuery): Promise<TrendData | null> {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("trends_cache")
        .select("data")
        .eq("source", "google")
        .eq("query", params.keyword)
        .eq("geo", params.geo || "")
        .eq("timeframe", params.timeframe || "today 1-m")
        .gt("expires_at", new Date().toISOString())
        .single();
      return (data?.data as TrendData) ?? null;
    } catch {
      return null;
    }
  }

  private async saveCache(
    params: TrendQuery,
    data: TrendData,
  ): Promise<void> {
    try {
      const admin = createAdminClient();
      const expiresAt = new Date(
        Date.now() + 6 * 60 * 60 * 1000,
      ).toISOString();
      await admin.from("trends_cache").upsert(
        {
          source: "google",
          query: params.keyword,
          geo: params.geo || "",
          timeframe: params.timeframe || "today 1-m",
          data,
          expires_at: expiresAt,
        },
        { onConflict: "source,query,geo,timeframe" },
      );
    } catch (e) {
      console.warn("[GoogleTrends] Cache write failed", e);
    }
  }

  // ─── Admin alert (Telegram) ─────────────────────────────────

  private async alertAdminQuotaExhausted(): Promise<void> {
    try {
      const token = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_ADMIN_ID;
      if (token && chatId) {
        await fetch(
          `https://api.telegram.org/bot${token}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: "⚠️ SerpApi quota épuisé pour Google Trends. Vérifie le compte ou bascule sur Apify.",
            }),
          },
        );
      }
    } catch {
      // silent
    }
  }

  // ─── Mock data (dev fallback) ───────────────────────────────

  private getMockData(params: TrendQuery): Omit<TrendData, "source"> {
    const seed = this.generateMockTimeSeries(20);
    const maxVal = seed.reduce((m, p) => Math.max(m, p.value), 0);
    const kw = params.keyword;

    return {
      keyword: kw,
      geo: params.geo || "",
      timeframe: params.timeframe || "today 1-m",
      interest_over_time: seed,
      related_queries: {
        top: [
          { query: `${kw} outils`, value: 100 },
          { query: `${kw} stratégie`, value: 85 },
          { query: `${kw} 2026`, value: 72 },
          { query: `${kw} tutoriel`, value: 65 },
          { query: `${kw} monétisation`, value: 58 },
        ],
        rising: [
          { query: `${kw} IA`, value: 320 },
          { query: `${kw} automatisation`, value: 210 },
          { query: `${kw} croissance`, value: 145 },
          { query: `${kw} newsletter`, value: 130 },
          { query: `${kw} communauté`, value: 115 },
        ],
      },
      interest_by_region: [
        { region: "Île-de-France", value: 100 },
        { region: "Auvergne-Rhône-Alpes", value: 78 },
        { region: "Nouvelle-Aquitaine", value: 65 },
        { region: "Occitanie", value: 62 },
        { region: "Hauts-de-France", value: 55 },
        { region: "Provence-Alpes-Côte d'Azur", value: 50 },
        { region: "Bretagne", value: 45 },
        { region: "Grand Est", value: 42 },
        { region: "Normandie", value: 38 },
        { region: "Pays de la Loire", value: 35 },
      ],
      peak_value: maxVal,
      current_value: seed.length > 0 ? seed[seed.length - 1].value : 50,
    };
  }

  private generateMockTimeSeries(count: number): InterestPoint[] {
    const points: InterestPoint[] = [];
    let val = 30 + Math.random() * 40;
    const now = new Date();
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      val += (Math.random() - 0.45) * 15;
      val = Math.max(5, Math.min(100, val));
      points.push({
        date: d.toISOString().slice(0, 10),
        value: Math.round(val),
      });
    }
    return points;
  }
}

// ─── Backward-compatible wrapper for aggregator ──────────────────

const TRENDING_CACHE = new Map<
  string,
  { data: TrendItem[]; expiry: number }
>();

export async function fetchGoogleTrends(
  geo: string = "FR",
  _timeframe: string = "7d",
): Promise<TrendItem[]> {
  const key = `google:${geo}:${_timeframe}`;
  const cached = TRENDING_CACHE.get(key);
  if (cached && cached.expiry > Date.now()) return cached.data;

  await new Promise((r) => setTimeout(r, 100));

  const data = (geo === "FR" ? frenchTrends : globalTrends).map((t, i) => ({
    ...t,
    sparkline: Array.from({ length: 7 }, () => Math.floor(Math.random() * 80 + 20)),
    geo,
  }));
  TRENDING_CACHE.set(key, { data, expiry: Date.now() + 3600_000 });
  return data;
}

const frenchTrends: Omit<TrendItem, "sparkline" | "geo">[] = [
  { id: "g1", title: "Création contenu IA", query: "IA création contenu 2026", source: "google", score: 92, change: 45 },
  { id: "g2", title: "OnlyFans marketing", query: "stratégie marketing OF 2026", source: "google", score: 88, change: 32 },
  { id: "g3", title: "Short video trends", query: "tendances vidéo courtes 2026", source: "google", score: 85, change: 28 },
  { id: "g4", title: "Newsletter créateur", query: "newsletter créateur contenu", source: "google", score: 78, change: 22 },
  { id: "g5", title: "Automation marketing", query: "automatisation marketing créateur", source: "google", score: 76, change: 18 },
  { id: "g6", title: "Revenue diversification", query: "diversification revenus créateur", source: "google", score: 74, change: 15 },
  { id: "g7", title: "Community building", query: "construire communauté fidèle", source: "google", score: 72, change: 12 },
  { id: "g8", title: "Personal branding", query: "personal branding créateur 2026", source: "google", score: 70, change: 10 },
  { id: "g9", title: "AI content tools", query: "outils IA contenu 2026", source: "google", score: 68, change: 8 },
  { id: "g10", title: "Creator economy", query: "économie créateur tendances", source: "google", score: 65, change: 5 },
];

const globalTrends: Omit<TrendItem, "sparkline" | "geo">[] = [
  { id: "gg1", title: "AI Content Creation", query: "AI content creation 2026", source: "google", score: 95, change: 52 },
  { id: "gg2", title: "Creator Economy", query: "creator economy trends", source: "google", score: 90, change: 38 },
  { id: "gg3", title: "Short Form Video", query: "short form video marketing", source: "google", score: 87, change: 30 },
  { id: "gg4", title: "Newsletter Growth", query: "newsletter growth strategies", source: "google", score: 82, change: 25 },
  { id: "gg5", title: "Membership Sites", query: "membership site creator", source: "google", score: 79, change: 20 },
  { id: "gg6", title: "Digital Products", query: "digital products sell online", source: "google", score: 75, change: 16 },
  { id: "gg7", title: "Brand Partnerships", query: "brand deal negotiation", source: "google", score: 73, change: 14 },
  { id: "gg8", title: "Audience Building", query: "audience building tips", source: "google", score: 71, change: 11 },
  { id: "gg9", title: "Email Marketing", query: "email marketing creators", source: "google", score: 69, change: 9 },
  { id: "gg10", title: "Social Media AI", query: "AI social media tools", source: "google", score: 66, change: 6 },
];
