export type Tier = "discovery" | "growth" | "scale" | "elite" | "icon";

export type CreatorStatus = "active" | "pause" | "alert";

export type Creator = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  department: string;
  tier: Tier;
  status: CreatorStatus;
  manager_id: string;
  manager_name: string;
  start_date: string;
  country: string;
  age: number | null;
  social_links: Record<string, string>;
  platforms: CreatorPlatform[];
  monthly_revenue: MonthlyRevenue[];
  current_month_revenue: number;
  total_followers: number;
  engagement_rate: number;
  growth_rate: number;
  tags: string[];
};

export type CreatorPlatform = {
  name: string;
  username: string;
  followers: number;
  api_connected: boolean;
  last_sync: string | null;
  verified: boolean;
};

export type MonthlyRevenue = {
  month: string;
  platforms: {
    name: string;
    gross: number;
    commission_pct: number;
    commission_eur: number;
    net: number;
  }[];
  total_gross: number;
  total_commission: number;
  total_net: number;
};

export type Contract = {
  id: string;
  title: string;
  status: "active" | "expired" | "terminated";
  signed_date: string;
  end_date: string | null;
  commission_rate: number;
  pdf_url: string | null;
  created_at: string;
};

export type Message = {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  created_at: string;
  read: boolean;
};

export type CalendarPost = {
  id: string;
  platform: string;
  content_preview: string;
  scheduled_date: string;
  status: "planned" | "published" | "failed";
};

export type AIReport = {
  id: string;
  generated_at: string;
  performance_score: number;
  trends: string[];
  suggestions: string[];
  risks: string[];
};

export type CreatorDocument = {
  id: string;
  title: string;
  type: "contract" | "photo" | "report" | "other";
  url: string;
  uploaded_at: string;
  uploaded_by: string;
};

export type InternalNote = {
  id: string;
  author: string;
  content: string;
  created_at: string;
};

export type AuditLog = {
  id: string;
  creator_id: string;
  action: string;
  actor: string;
  created_at: string;
  metadata?: Record<string, unknown>;
};
