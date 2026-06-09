// Trend types shared across the module
export interface TrendItem {
  id: string;
  title: string;
  query: string;
  source: "google" | "youtube" | "news" | "tiktok";
  score: number; // search volume / momentum 0-100
  change: number; // % change vs prior period
  geo?: string;
  category?: string;
  sparkline: number[]; // 7 data points
  url?: string;
  published_at?: string;
}

export interface TrendSourceData {
  source: TrendItem["source"];
  items: TrendItem[];
  fetched_at: string;
  cached: boolean;
}

export interface AggregatedTrend {
  id: string;
  title: string;
  query: string;
  sources: TrendItem["source"][];
  relevanceScore: number; // 0-100 based on creator ADN
  viralityScore: number; // 0-100 predictive
  momentum: number; // composite change %
  sparkline: number[];
  opportunityWindow: string; // "48h" | "1 semaine" | "2 semaines" | "1 mois"
  topSource: TrendItem["source"];
}

export interface WatchlistEntry {
  id: string;
  keyword: string;
  category: string | null;
  geo_filter: string;
  sources: string[];
  alert_threshold: number;
  last_value: number | null;
  last_checked_at: string | null;
  created_at: string;
  sparkline_7d: number[];
  recent_alerts: number;
}

export interface TrendAlert {
  id: string;
  watchlist_id: string;
  trend_data: any;
  alert_type: "spike" | "crash" | "pre_viral" | "new_trend";
  severity: "low" | "medium" | "high" | "critical";
  notified: boolean;
  created_at: string;
  keyword?: string;
}

export const SOURCE_LABELS: Record<TrendItem["source"], string> = {
  google: "Google Trends",
  youtube: "YouTube",
  news: "News",
  tiktok: "TikTok",
};

export const SOURCE_COLORS: Record<TrendItem["source"], string> = {
  google: "#4285F4",
  youtube: "#FF0000",
  news: "#F5F0EB",
  tiktok: "#00F2EA",
};
