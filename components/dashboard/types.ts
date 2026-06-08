export type CreatorProfile = {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  department: string;
  commission_tier: string;
  commission_rate: number;
  next_tier: { label: string; threshold: number } | null;
  monthly_revenue: number;
  joined_at: string;
};

export type DailyBrief = {
  greeting: string;
  date: string;
  summary: string;
  yesterday_revenue: number;
  revenue_change_pct: number;
  top_post_platform: string;
  top_post_views: number;
  suggestions: { id: string; text: string; action: string }[];
};

export type KpiData = {
  month_revenue: number;
  month_revenue_change_pct: number;
  total_followers: number;
  follower_change_pct: number;
  avg_engagement_rate: number;
  engagement_change_pct: number;
  commission_tier: string;
  commission_rate: number;
  next_tier_name: string | null;
  next_tier_progress_pct: number;
};

export type AgentCard = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  status: string;
  action_label: string;
  href: string;
};

export type ActivityEvent = {
  id: string;
  emoji: string;
  text: string;
  platform: string;
  created_at: string;
};

export type EvolutionData = {
  revenue: { month: string; value: number }[];
  followers: { month: string; value: number }[];
  wellness_score: { month: string; value: number }[];
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export type NavItem = {
  label: string;
  href: string;
  icon: string;
};
