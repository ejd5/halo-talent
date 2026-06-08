export type AggregatedMonthlyRevenue = {
  month: string;
  total_gross: number;
  total_commission: number;
  total_net: number;
  platform_fees: number;
  platforms: Record<string, { gross: number; commission: number; net: number }>;
};

export type RevenueSummary = {
  total_gross: number;
  total_commission: number;
  total_net: number;
  total_platform_fees: number;
  avg_margin: number;
  creator_count: number;
  active_creator_count: number;
  margin_variation: number;
};

export type PlatformRevenueSummary = {
  name: string;
  total_revenue: number;
  share_pct: number;
  active_creators: number;
  avg_revenue_per_creator: number;
  monthly_history: number[];
  growth_rate: number;
};

export type CreatorRevenueRow = {
  creator_id: string;
  creator_name: string;
  creator_avatar: string | null;
  department: string;
  tier: string;
  current_month: number;
  last_month: number;
  variation_pct: number;
  ytd_total: number;
  commission_rate: number;
  commission_eur: number;
  payment_status: "paid" | "pending" | "overdue";
};

export type ForecastPeriod = {
  estimate: number;
  lower_bound: number;
  upper_bound: number;
  confidence: "low" | "medium" | "high";
};

export type Forecast = {
  next_month: ForecastPeriod;
  next_quarter: ForecastPeriod;
  next_year: ForecastPeriod;
  risk_factors: string[];
  opportunities: string[];
  summary: string;
  generated_at: string;
};

export type FinancialAlert = {
  id: string;
  type: "revenue_drop" | "payment_pending" | "contract_expiring" | "forecast_risk";
  severity: "low" | "medium" | "high";
  message: string;
  creator_id: string | null;
  creator_name: string | null;
  created_at: string;
};

export type ExportRecord = {
  id: string;
  type: "global" | "by_creator" | "by_platform";
  format: "csv" | "pdf" | "xlsx";
  period_start: string;
  period_end: string;
  generated_at: string;
  status: "generating" | "ready" | "error";
};

export const PLATFORM_COLORS: Record<string, string> = {
  YouTube: "#FF0000",
  Instagram: "#E4405F",
  TikTok: "#000000",
  OnlyFans: "#00AFF0",
  Twitter: "#1DA1F2",
  LinkedIn: "#0A66C2",
  Twitch: "#9146FF",
  Snapchat: "#FFFC00",
};
