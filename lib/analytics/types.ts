export type PlatformType =
  | "instagram" | "tiktok" | "youtube" | "twitter" | "threads"
  | "linkedin" | "bluesky" | "onlyfans" | "mym" | "fansly";

export type ContentType =
  | "post" | "story" | "reel" | "carousel" | "short"
  | "long_video" | "tweet" | "thread" | "video" | "photo";

export interface ContentMetric {
  id: string;
  creator_id: string;
  publication_id: string;
  platform: PlatformType;
  content_type: ContentType;
  metric_date: string;
  impressions: number;
  reach: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks_link: number;
  clicks_profile: number;
  followers_gained: number;
  followers_lost: number;
  engagement_rate: number;
  watch_time_seconds: number;
  avg_watch_percent: number;
  completion_rate: number;
  revenue_eur: number;
  tips_eur: number;
  new_subs: number;
  messages_count: number;
  ppv_sales: number;
  synced_at: string;
}

export interface AnalyticsInsight {
  id: string;
  creator_id: string;
  category: "pattern" | "recommendation" | "warning" | "opportunity" | "trend" | "milestone";
  title: string;
  description: string;
  metric_name: string | null;
  metric_value: number | null;
  comparison_value: number | null;
  change_percent: number | null;
  is_positive: boolean;
  tags: string[];
  is_read: boolean;
  is_actioned: boolean;
  created_at: string;
}

export interface AbTest {
  id: string;
  creator_id: string;
  name: string;
  description: string | null;
  variant_a_data: Record<string, unknown>;
  variant_b_data: Record<string, unknown>;
  variant_a_publication_id: string | null;
  variant_b_publication_id: string | null;
  platform: PlatformType;
  content_type: ContentType;
  variant_a_impressions: number;
  variant_b_impressions: number;
  variant_a_engagement: number;
  variant_b_engagement: number;
  variant_a_conversion: number;
  variant_b_conversion: number;
  winner: "a" | "b" | "draw" | "pending" | null;
  confidence: number;
  insight_learned: string | null;
  status: "draft" | "running" | "completed" | "cancelled";
  published_at: string | null;
  concluded_at: string | null;
  created_at: string;
}

export interface ContentFeedback {
  id: string;
  analysis_date: string;
  period_start: string;
  period_end: string;
  top_performers: PerformanceEntry[];
  top_patterns: Record<string, unknown>;
  top_common_tags: string[];
  top_common_moods: string[];
  top_common_styles: string[];
  top_avg_engagement: number;
  bottom_performers: PerformanceEntry[];
  bottom_patterns: Record<string, unknown>;
  bottom_common_tags: string[];
  bottom_common_moods: string[];
  bottom_common_styles: string[];
  bottom_avg_engagement: number;
  dna_updates: Record<string, unknown>;
  dna_applied: boolean;
  insights_generated: string[];
  created_at: string;
}

export interface PerformanceEntry {
  publication_id: string;
  platform: PlatformType;
  content_type: ContentType;
  metric_date: string;
  engagement_rate: number;
  percentile_rank: number;
  tier?: "top_20" | "bottom_20" | "middle";
  metrics?: Partial<ContentMetric>;
}

export interface CoachSession {
  id: string;
  session_type: "weekly_review" | "pattern_analysis" | "recommendation" | "custom";
  insights_count: number;
  created_at: string;
}

export interface PeriodComparison {
  current: {
    total_posts: number;
    avg_engagement: number;
    total_impressions: number;
    total_likes: number;
    total_comments: number;
    total_shares: number;
    total_saves: number;
  };
  previous: {
    total_posts: number;
    avg_engagement: number;
    total_impressions: number;
    total_likes: number;
    total_comments: number;
    total_shares: number;
    total_saves: number;
  };
  changes: {
    engagement_change: number;
    impressions_change: number;
    likes_change: number;
    comments_change: number;
  };
}

export const INSIGHT_CATEGORY_LABELS: Record<string, string> = {
  pattern: "Pattern détecté",
  recommendation: "Recommandation",
  warning: "Alerte",
  opportunity: "Opportunité",
  trend: "Tendance",
  milestone: "Palier atteint",
};

export const INSIGHT_CATEGORY_COLORS: Record<string, string> = {
  pattern: "#C75B39",
  recommendation: "#10B981",
  warning: "#E5484D",
  opportunity: "#8B5CF6",
  trend: "#3B82F6",
  milestone: "#F59E0B",
};

export const PLATFORM_COLORS: Record<PlatformType, string> = {
  instagram: "#E4405F",
  tiktok: "#000000",
  youtube: "#FF0000",
  twitter: "#1DA1F2",
  threads: "#000000",
  linkedin: "#0A66C2",
  bluesky: "#0085FF",
  onlyfans: "#00AFF0",
  mym: "#E91E63",
  fansly: "#FF69B4",
};
