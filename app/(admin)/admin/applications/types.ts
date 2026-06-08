export type AIAnalysis = {
  score_total: number;
  scores: {
    coherence: number;
    potential: number;
    communication: number;
    alignment: number;
    feasibility: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendation: "approve" | "review" | "reject";
  reasoning: string;
};

export type ApplicationStatus =
  | "pending"
  | "review"
  | "approved"
  | "rejected";

export type Application = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string | null;
  department: string;
  platforms: string[];
  current_monthly_revenue: string;
  ai_score: number;
  ai_analysis: AIAnalysis | null;
  status: ApplicationStatus;
  avatar_url: string | null;
  country: string | null;
  age: number | null;
  social_links: Record<string, string> | null;
  goals: string;
  why_us: string;
  concerns: string | null;
  manager_id: string | null;
  manager_name: string | null;
};

export type AuditLog = {
  id: string;
  application_id: string;
  action: string;
  actor: string;
  created_at: string;
  metadata?: Record<string, unknown>;
};

export type InternalNote = {
  id: string;
  application_id: string;
  author: string;
  content: string;
  created_at: string;
};
