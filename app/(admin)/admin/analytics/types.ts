import type { ReactNode } from "react";

export type AnalyticsTab = "business" | "creators" | "web" | "acquisition" | "cohorts";

export const TAB_LABELS: Record<AnalyticsTab, string> = {
  business: "Business",
  creators: "Créateurs",
  web: "Site web",
  acquisition: "Acquisition",
  cohorts: "Cohortes",
};

export type MonthlyRevenue = {
  month: string; // "2024-06"
  brut: number;
  commission: number;
  net: number;
  creators_count: number;
};

export type MoMGrowth = {
  month: string;
  growth_pct: number;
};

export type CreatorRetention = {
  month: string;
  active_creators: number;
  total_creators: number;
  retention_pct: number;
};

export type LTVData = {
  months: number;
  average_ltv: number;
};

export type CACData = {
  source: string;
  cost: number;
  conversions: number;
  cac: number;
};

export type RevenueDistribution = {
  range: string;
  count: number;
};

export type CommissionTier = {
  tier: string;
  count: number;
  total_revenue: number;
};

export type DepartmentDist = {
  department: string;
  count: number;
  total_revenue: number;
};

export type SeniorityDist = {
  range: string;
  count: number;
};

export type ActivityHeatMap = {
  day: string;
  hour: number;
  value: number;
};

export type CreatorAlert = {
  type: "disengaged" | "upsell" | "burnout";
  severity: "low" | "medium" | "high";
  message: string;
  creator_name: string;
};

export type WebTraffic = {
  page: string;
  views: number;
  unique_visitors: number;
  avg_time_seconds: number;
  bounce_rate: number;
};

export type TrafficSource = {
  source: string;
  visits: number;
  percentage: number;
  trend: "up" | "down" | "stable";
};

export type FunnelStage = {
  stage: string;
  count: number;
  conversion_pct: number;
};

export type CohortRow = {
  cohort: string; // "2024-01"
  months: number[];
  sizes: number[];
  retention: number[];
};

export type DeviceBreakdown = {
  device: string;
  percentage: number;
};

export type AnalyticsData = {
  executiveSummary: {
    text: string;
    generated_at: string;
    period: string;
  };
  monthlyRevenue: MonthlyRevenue[];
  momGrowth: MoMGrowth[];
  retention: CreatorRetention[];
  ltv: LTVData[];
  cac: CACData[];
  revenueDistribution: RevenueDistribution[];
  commissionTiers: CommissionTier[];
  departmentDist: DepartmentDist[];
  seniorityDist: SeniorityDist[];
  activityHeatMap: ActivityHeatMap[];
  alerts: CreatorAlert[];
  webTraffic: WebTraffic[];
  trafficSources: TrafficSource[];
  funnel: FunnelStage[];
  cohorts: CohortRow[];
  devices: DeviceBreakdown[];
};

export type ChartProps = {
  data: Record<string, unknown>[];
  height?: number;
};

export type StatCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  trend?: "up" | "down";
  trendValue?: string;
  icon?: ReactNode;
};
