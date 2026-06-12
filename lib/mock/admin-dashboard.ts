// ─── Admin Command Center Mock Data ───

export type UrgencyPriority = "critical" | "high" | "medium" | "low";

export interface UrgentAction {
  id: string;
  labelKey: string;
  descriptionKey: string;
  priority: UrgencyPriority;
  owner: string;
  deadline: string;
  impactKey: string;
  ctaLabelKey: string;
  ctaHref: string;
}

export interface AdminMetric {
  id: string;
  labelKey: string;
  value: number;
  prefix?: string;
  suffix?: string;
  variation: number;
  href: string;
  sparkline?: number[];
}

export interface ActivityItem {
  id: string;
  type: "new_creator" | "revenue" | "message" | "contract";
  user: string;
  descriptionKey: string;
  timestamp: string;
  relatedHref: string;
}

export interface TopCreator {
  id: string;
  name: string;
  avatar: string;
  revenue: number;
  variation: number;
  href: string;
}

export interface AlertItem {
  id: string;
  type: "contract" | "inactive" | "revenue";
  titleKey: string;
  descriptionKey: string;
  severity: "warning" | "danger";
  href: string;
}

export interface RevenueEvent {
  label: string;
  date: string;
  type: "recruitment" | "campaign" | "expansion";
}

export interface RevenueDataPoint {
  month: string;
  brut: number;
  commission: number;
  net: number;
  byPlatform: { of: number; fansly: number; ig: number; tt: number };
  byRegion: { fr: number; br: number; us: number; other: number };
}

export interface CreatorHealthRow {
  name: string;
  country: string;
  language: string;
  department: string;
  revenue: number;
  variation: number;
  audienceHealth: number;
  churnRisk: "low" | "medium" | "high";
  manager: string;
  lastAction: string;
  nextAction: string;
}

export type PipelineStage = "new" | "qualified" | "call" | "contract" | "onboarding" | "active";

export interface PipelineItem {
  id: string;
  name: string;
  stage: PipelineStage;
  country: string;
  department: string;
  daysInStage: number;
  value?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: "manager" | "chatter";
  conversations: number;
  revenue: number;
  responseTime: number;
  quality: number;
  complianceErrors: number;
  workload: number;
}

export interface ComplianceItem {
  id: string;
  labelKey: string;
  value: number;
  status: "ok" | "warning" | "critical";
  detailKey: string;
}

export interface InternationalLanguage {
  language: string;
  localeKey: string;
  traffic: number;
  conversion: number;
  revenue: number;
  supportTickets: number;
}

// ─── Urgent Actions ───

export const URGENT_ACTIONS: UrgentAction[] = [
  {
    id: "applications",
    labelKey: "admin_dashboard.urgent.applications",
    descriptionKey: "admin_dashboard.urgent.applications_desc",
    priority: "critical",
    owner: "Sophie",
    deadline: "admin_dashboard.urgent.deadline_today",
    impactKey: "admin_dashboard.urgent.impact_pipeline",
    ctaLabelKey: "admin_dashboard.urgent.cta_review",
    ctaHref: "/admin/applications",
  },
  {
    id: "contracts",
    labelKey: "admin_dashboard.urgent.contracts",
    descriptionKey: "admin_dashboard.urgent.contracts_desc",
    priority: "critical",
    owner: "Thomas",
    deadline: "admin_dashboard.urgent.deadline_2d",
    impactKey: "admin_dashboard.urgent.impact_revenue",
    ctaLabelKey: "admin_dashboard.urgent.cta_sign",
    ctaHref: "/admin/contracts",
  },
  {
    id: "payouts",
    labelKey: "admin_dashboard.urgent.payouts",
    descriptionKey: "admin_dashboard.urgent.payouts_desc",
    priority: "high",
    owner: "Compta",
    deadline: "admin_dashboard.urgent.deadline_1d",
    impactKey: "admin_dashboard.urgent.impact_trust",
    ctaLabelKey: "admin_dashboard.urgent.cta_resolve",
    ctaHref: "/admin/payouts",
  },
  {
    id: "declining",
    labelKey: "admin_dashboard.urgent.declining",
    descriptionKey: "admin_dashboard.urgent.declining_desc",
    priority: "high",
    owner: "Managers",
    deadline: "admin_dashboard.urgent.deadline_this_week",
    impactKey: "admin_dashboard.urgent.impact_retention",
    ctaLabelKey: "admin_dashboard.urgent.cta_contact",
    ctaHref: "/admin/creators",
  },
  {
    id: "campaigns",
    labelKey: "admin_dashboard.urgent.campaigns",
    descriptionKey: "admin_dashboard.urgent.campaigns_desc",
    priority: "high",
    owner: "Marketing",
    deadline: "admin_dashboard.urgent.deadline_3d",
    impactKey: "admin_dashboard.urgent.impact_revenue",
    ctaLabelKey: "admin_dashboard.urgent.cta_validate",
    ctaHref: "/admin/content-calendar",
  },
  {
    id: "accounts",
    labelKey: "admin_dashboard.urgent.accounts",
    descriptionKey: "admin_dashboard.urgent.accounts_desc",
    priority: "high",
    owner: "Support",
    deadline: "admin_dashboard.urgent.deadline_1d",
    impactKey: "admin_dashboard.urgent.impact_visibility",
    ctaLabelKey: "admin_dashboard.urgent.cta_reconnect",
    ctaHref: "/admin/social/accounts",
  },
  {
    id: "messages",
    labelKey: "admin_dashboard.urgent.messages",
    descriptionKey: "admin_dashboard.urgent.messages_desc",
    priority: "medium",
    owner: "Chatters",
    deadline: "admin_dashboard.urgent.deadline_today",
    impactKey: "admin_dashboard.urgent.impact_sales",
    ctaLabelKey: "admin_dashboard.urgent.cta_reply",
    ctaHref: "/admin/messages",
  },
  {
    id: "compliance",
    labelKey: "admin_dashboard.urgent.compliance",
    descriptionKey: "admin_dashboard.urgent.compliance_desc",
    priority: "medium",
    owner: "Juridique",
    deadline: "admin_dashboard.urgent.deadline_5d",
    impactKey: "admin_dashboard.urgent.impact_legal",
    ctaLabelKey: "admin_dashboard.urgent.cta_review",
    ctaHref: "/admin/legal/knowledge",
  },
  {
    id: "translations",
    labelKey: "admin_dashboard.urgent.translations",
    descriptionKey: "admin_dashboard.urgent.translations_desc",
    priority: "low",
    owner: "Content",
    deadline: "admin_dashboard.urgent.deadline_7d",
    impactKey: "admin_dashboard.urgent.impact_reach",
    ctaLabelKey: "admin_dashboard.urgent.cta_translate",
    ctaHref: "/admin/site/pages",
  },
  {
    id: "invoices",
    labelKey: "admin_dashboard.urgent.invoices",
    descriptionKey: "admin_dashboard.urgent.invoices_desc",
    priority: "low",
    owner: "Compta",
    deadline: "admin_dashboard.urgent.deadline_3d",
    impactKey: "admin_dashboard.urgent.impact_finance",
    ctaLabelKey: "admin_dashboard.urgent.cta_fix",
    ctaHref: "/admin/revenue",
  },
  {
    id: "copilot",
    labelKey: "admin_dashboard.urgent.copilot",
    descriptionKey: "admin_dashboard.urgent.copilot_desc",
    priority: "medium",
    owner: "IA",
    deadline: "admin_dashboard.urgent.deadline_today",
    impactKey: "admin_dashboard.urgent.impact_productivity",
    ctaLabelKey: "admin_dashboard.urgent.cta_copilot",
    ctaHref: "/admin/copilot",
  },
];

// ─── KPIs (5 main with sparklines) ───

function generateSparkline(length: number, base: number, amplitude: number): number[] {
  return Array.from({ length }, (_, i) =>
    Math.round((base + Math.sin(i * 0.5 + Math.random() * 0.5) * amplitude + (Math.random() - 0.5) * amplitude * 0.3) * 100) / 100
  );
}

export const ADMIN_METRICS: AdminMetric[] = [
  { id: "brut", labelKey: "admin_dashboard.metrics.brut", value: 284340, prefix: "€", variation: 12.5, href: "/admin/revenue", sparkline: generateSparkline(30, 23000, 6000) },
  { id: "commission", labelKey: "admin_dashboard.metrics.commission", value: 41230, prefix: "€", variation: 8.3, href: "/admin/commissions", sparkline: generateSparkline(30, 3800, 800) },
  { id: "active", labelKey: "admin_dashboard.metrics.active", value: 18, suffix: "/24", variation: 2, href: "/admin/creators", sparkline: generateSparkline(30, 16, 3) },
  { id: "app_conv", labelKey: "admin_dashboard.metrics.app_conv", value: 34, suffix: "%", variation: 5.2, href: "/admin/pipeline", sparkline: generateSparkline(30, 28, 8) },
  { id: "churn", labelKey: "admin_dashboard.metrics.churn", value: 6.2, suffix: "%", variation: -1.4, href: "/admin/analytics", sparkline: generateSparkline(30, 7, 2) },
];

// ─── Revenue Data (12 months) ───

export const MONTHS_SHORT = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

function smoothRevenue(index: number, base: number, amplitude: number, noise: number): number {
  return Math.round((base + Math.sin(index * 0.6) * amplitude + (Math.random() - 0.5) * noise) * 100) / 100;
}

export function generateRevenueData(): RevenueDataPoint[] {
  return Array.from({ length: 12 }, (_, i) => {
    const brut = smoothRevenue(i, 23000, 8000, 3000);
    const commission = smoothRevenue(i, 3500, 1200, 500);
    return {
      month: MONTHS_SHORT[i],
      brut,
      commission,
      net: brut - commission,
      byPlatform: {
        of: smoothRevenue(i, 12000, 4000, 1500),
        fansly: smoothRevenue(i, 4000, 1500, 800),
        ig: smoothRevenue(i, 5000, 2000, 1000),
        tt: smoothRevenue(i, 3000, 1200, 600),
      },
      byRegion: {
        fr: smoothRevenue(i, 14000, 5000, 2000),
        br: smoothRevenue(i, 5000, 2000, 800),
        us: smoothRevenue(i, 3000, 1000, 500),
        other: smoothRevenue(i, 2000, 800, 400),
      },
    };
  });
}

export const REVENUE_EVENTS: RevenueEvent[] = [
  { label: "admin_dashboard.chart.event.recruitment", date: "Mar", type: "recruitment" },
  { label: "admin_dashboard.chart.event.summer", date: "Jun", type: "campaign" },
  { label: "admin_dashboard.chart.event.brasil", date: "Sep", type: "expansion" },
];

// ─── Creator Health ───

export const CREATOR_HEALTH: CreatorHealthRow[] = [
  { name: "Clara W.", country: "FR", language: "fr", department: "Digital Creators", revenue: 12400, variation: 18.2, audienceHealth: 92, churnRisk: "low", manager: "Sophie", lastAction: "Contrat signé", nextAction: "Revue mensuelle" },
  { name: "Marc T.", country: "FR", language: "fr", department: "Digital Creators", revenue: 9800, variation: 15.4, audienceHealth: 88, churnRisk: "low", manager: "Sophie", lastAction: "Campagne PPV", nextAction: "Ajustement pricing" },
  { name: "Léa R.", country: "FR", language: "fr", department: "Lifestyle", revenue: 8200, variation: -3.2, audienceHealth: 65, churnRisk: "medium", manager: "Thomas", lastAction: "Brief créatif", nextAction: "Call stratégie" },
  { name: "Inès D.", country: "FR", language: "fr", department: "Digital Creators", revenue: 7900, variation: 22.1, audienceHealth: 95, churnRisk: "low", manager: "Sophie", lastAction: "Onboarding", nextAction: "Plan contenu" },
  { name: "Hugo P.", country: "FR", language: "fr", department: "Sport & Lifestyle", revenue: 6500, variation: -8.5, audienceHealth: 45, churnRisk: "high", manager: "Thomas", lastAction: "Alerte baisse", nextAction: "Call urgences" },
  { name: "Alex M.", country: "FR", language: "fr", department: "Sport & Lifestyle", revenue: 5800, variation: -12.3, audienceHealth: 38, churnRisk: "high", manager: "Thomas", lastAction: "Relance PPV", nextAction: "Plan de retention" },
  { name: "Emma V.", country: "BR", language: "pt", department: "Music & Arts", revenue: 7200, variation: 8.9, audienceHealth: 78, churnRisk: "medium", manager: "Sophie", lastAction: "Renouvellement contrat", nextAction: "Signature avenant" },
  { name: "Sarah K.", country: "US", language: "en", department: "Digital Creators", revenue: 4500, variation: 34.2, audienceHealth: 85, churnRisk: "low", manager: "Sophie", lastAction: "Candidature reçue", nextAction: "Call découverte" },
  { name: "Lucas B.", country: "BR", language: "pt", department: "Lifestyle", revenue: 5100, variation: 5.8, audienceHealth: 72, churnRisk: "low", manager: "Thomas", lastAction: "Validation contrat", nextAction: "Kickoff" },
  { name: "Camille N.", country: "FR", language: "fr", department: "Digital Creators", revenue: 11000, variation: 11.4, audienceHealth: 90, churnRisk: "low", manager: "Sophie", lastAction: "Campagne été", nextAction: "Bilan mensuel" },
  { name: "Nina V.", country: "BR", language: "pt", department: "Music & Arts", revenue: 3600, variation: -4.1, audienceHealth: 55, churnRisk: "medium", manager: "Thomas", lastAction: "Post sponsorisé", nextAction: "Revue contenu" },
  { name: "Jade L.", country: "FR", language: "fr", department: "Lifestyle", revenue: 8900, variation: 6.7, audienceHealth: 82, churnRisk: "low", manager: "Sophie", lastAction: "Shooting photo", nextAction: "Publication" },
  { name: "Tom S.", country: "US", language: "en", department: "Sport & Lifestyle", revenue: 2800, variation: -18.5, audienceHealth: 30, churnRisk: "high", manager: "Thomas", lastAction: "Alerte churn", nextAction: "Call rétention" },
  { name: "Manon R.", country: "FR", language: "fr", department: "Digital Creators", revenue: 10300, variation: 9.2, audienceHealth: 87, churnRisk: "low", manager: "Sophie", lastAction: "PPV campagne", nextAction: "Analyse perf" },
  { name: "Rafael M.", country: "BR", language: "pt", department: "Music & Arts", revenue: 4200, variation: 14.8, audienceHealth: 80, churnRisk: "low", manager: "Thomas", lastAction: "Signature", nextAction: "Onboarding" },
];

// ─── Pipeline ───

export const PIPELINE_ITEMS: PipelineItem[] = [
  { id: "p1", name: "Marie L.", stage: "new", country: "FR", department: "Lifestyle", daysInStage: 2, value: undefined },
  { id: "p2", name: "Juan P.", stage: "new", country: "ES", department: "Digital Creators", daysInStage: 5, value: undefined },
  { id: "p3", name: "Anna K.", stage: "qualified", country: "DE", department: "Sport & Lifestyle", daysInStage: 3, value: 4500 },
  { id: "p4", name: "Sofia R.", stage: "call", country: "BR", department: "Music & Arts", daysInStage: 1, value: 6000 },
  { id: "p5", name: "James W.", stage: "contract", country: "US", department: "Digital Creators", daysInStage: 4, value: 8000 },
  { id: "p6", name: "Olivia F.", stage: "onboarding", country: "FR", department: "Lifestyle", daysInStage: 7, value: 5500 },
];

export const PIPELINE_STAGE_CONFIG: { key: PipelineStage; labelKey: string; color: string }[] = [
  { key: "new", labelKey: "admin_dashboard.pipeline.stage.new", color: "#3B82F6" },
  { key: "qualified", labelKey: "admin_dashboard.pipeline.stage.qualified", color: "#8B5CF6" },
  { key: "call", labelKey: "admin_dashboard.pipeline.stage.call", color: "#F59E0B" },
  { key: "contract", labelKey: "admin_dashboard.pipeline.stage.contract", color: "#EC4899" },
  { key: "onboarding", labelKey: "admin_dashboard.pipeline.stage.onboarding", color: "#10B981" },
  { key: "active", labelKey: "admin_dashboard.pipeline.stage.active", color: "var(--or, #D8A95B)" },
];

// ─── Team Performance ───

export const TEAM_MEMBERS: TeamMember[] = [
  { id: "t1", name: "Sophie M.", role: "manager", conversations: 142, revenue: 34500, responseTime: 3.2, quality: 94, complianceErrors: 1, workload: 75 },
  { id: "t2", name: "Thomas L.", role: "manager", conversations: 98, revenue: 22100, responseTime: 5.8, quality: 87, complianceErrors: 3, workload: 60 },
  { id: "t3", name: "Julie R.", role: "chatter", conversations: 215, revenue: 18200, responseTime: 1.8, quality: 96, complianceErrors: 0, workload: 85 },
  { id: "t4", name: "Alexandre P.", role: "chatter", conversations: 178, revenue: 15100, responseTime: 2.4, quality: 91, complianceErrors: 2, workload: 70 },
];

// ─── Compliance ───

export const COMPLIANCE_ITEMS: ComplianceItem[] = [
  { id: "c1", labelKey: "admin_dashboard.compliance.risk_clauses", value: 3, status: "critical", detailKey: "admin_dashboard.compliance.risk_clauses_desc" },
  { id: "c2", labelKey: "admin_dashboard.compliance.blocked_messages", value: 7, status: "warning", detailKey: "admin_dashboard.compliance.blocked_messages_desc" },
  { id: "c3", labelKey: "admin_dashboard.compliance.sensitive_campaigns", value: 2, status: "warning", detailKey: "admin_dashboard.compliance.sensitive_campaigns_desc" },
  { id: "c4", labelKey: "admin_dashboard.compliance.suspicious_access", value: 1, status: "critical", detailKey: "admin_dashboard.compliance.suspicious_access_desc" },
  { id: "c5", labelKey: "admin_dashboard.compliance.deletion_requests", value: 4, status: "warning", detailKey: "admin_dashboard.compliance.deletion_requests_desc" },
  { id: "c6", labelKey: "admin_dashboard.compliance.recent_exports", value: 12, status: "ok", detailKey: "admin_dashboard.compliance.recent_exports_desc" },
];

// ─── International ───

export const INTERNATIONAL_LANGUAGES: InternationalLanguage[] = [
  { language: "Français", localeKey: "fr", traffic: 48, conversion: 3.2, revenue: 142000, supportTickets: 34 },
  { language: "English", localeKey: "en", traffic: 22, conversion: 2.8, revenue: 65100, supportTickets: 18 },
  { language: "Español", localeKey: "es", traffic: 15, conversion: 2.1, revenue: 32100, supportTickets: 22 },
  { language: "Português", localeKey: "pt-BR", traffic: 15, conversion: 4.5, revenue: 45800, supportTickets: 15 },
];

export const UNTRANSLATED_PAGES = 3;

// ─── Activity Feed ───

export const ACTIVITY_ITEMS: ActivityItem[] = [
  { id: "a1", type: "new_creator", user: "Sarah K.", descriptionKey: "admin_dashboard.activity.new_creator", timestamp: "Il y a 2 min", relatedHref: "/admin/creators/sarah-k" },
  { id: "a2", type: "revenue", user: "OnlyFans", descriptionKey: "admin_dashboard.activity.revenue_milestone", timestamp: "Il y a 15 min", relatedHref: "/admin/revenue" },
  { id: "a3", type: "contract", user: "Emma V.", descriptionKey: "admin_dashboard.activity.contract_signed", timestamp: "Il y a 1 h", relatedHref: "/admin/contracts" },
  { id: "a4", type: "message", user: "Support", descriptionKey: "admin_dashboard.activity.urgent_message", timestamp: "Il y a 2 h", relatedHref: "/admin/messages" },
  { id: "a5", type: "new_creator", user: "Lucas B.", descriptionKey: "admin_dashboard.activity.new_creator", timestamp: "Il y a 3 h", relatedHref: "/admin/creators/lucas-b" },
  { id: "a6", type: "revenue", user: "Fansly", descriptionKey: "admin_dashboard.activity.revenue_spike", timestamp: "Il y a 5 h", relatedHref: "/admin/revenue" },
  { id: "a7", type: "contract", user: "Rafael M.", descriptionKey: "admin_dashboard.activity.contract_renewal", timestamp: "Hier 14:30", relatedHref: "/admin/contracts" },
  { id: "a8", type: "message", user: "Sophie M.", descriptionKey: "admin_dashboard.activity.manager_note", timestamp: "Hier 11:00", relatedHref: "/admin/team" },
];

// ─── Top Creators Ranking ───

export const TOP_CREATORS: TopCreator[] = [
  { id: "c1", name: "Clara W.", avatar: "CW", revenue: 12400, variation: 18.2, href: "/admin/creators/clara-w" },
  { id: "c2", name: "Camille N.", avatar: "CN", revenue: 11000, variation: 11.4, href: "/admin/creators/camille-n" },
  { id: "c3", name: "Manon R.", avatar: "MR", revenue: 10300, variation: 9.2, href: "/admin/creators/manon-r" },
  { id: "c4", name: "Marc T.", avatar: "MT", revenue: 9800, variation: 15.4, href: "/admin/creators/marc-t" },
  { id: "c5", name: "Jade L.", avatar: "JL", revenue: 8900, variation: 6.7, href: "/admin/creators/jade-l" },
];

// ─── Alerts ───

export const ALERTS: AlertItem[] = [
  { id: "al1", type: "contract", titleKey: "admin_dashboard.alerts.contracts_expiring", descriptionKey: "admin_dashboard.alerts.contracts_expiring_desc", severity: "warning", href: "/admin/contracts" },
  { id: "al2", type: "inactive", titleKey: "admin_dashboard.alerts.inactive_creators", descriptionKey: "admin_dashboard.alerts.inactive_creators_desc", severity: "danger", href: "/admin/creators" },
  { id: "al3", type: "revenue", titleKey: "admin_dashboard.alerts.revenue_anomaly", descriptionKey: "admin_dashboard.alerts.revenue_anomaly_desc", severity: "warning", href: "/admin/revenue" },
];

// ─── Helper ───

export const PRIORITY_ORDER: Record<UrgencyPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};
