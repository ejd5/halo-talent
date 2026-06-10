// ─── Studio Dashboard Mock Data ───

export type SDImpact = "high" | "medium" | "low";
export type SDDifficulty = "easy" | "medium" | "hard";

export interface SDMission {
  id: string;
  titleKey: string;
  descriptionKey: string;
  impact: SDImpact;
  durationMin: number;
  difficulty: SDDifficulty;
  rewardEmoji: string;
  ctaLabelKey: string;
  ctaHref: string;
  completed: boolean;
}

export interface SDQuickAction {
  id: string;
  labelKey: string;
  descriptionKey: string;
  icon: string;
  href: string;
  color: string;
}

export type SDInsightType = "format" | "time" | "topic" | "hook" | "platform" | "risk";

export interface SDInsight {
  id: string;
  type: SDInsightType;
  titleKey: string;
  descriptionKey: string;
  sourceKey: string;
  confidence: number;
  actionLabelKey: string;
  actionHref: string;
}

export interface SDPost {
  title: string;
  platform: string;
  time: string;
  status: "posted" | "scheduled" | "draft";
}

export interface SDCalendarEvent {
  day: number;
  posts: SDPost[];
  suggestions: string[];
}

export interface SDDnaProfile {
  voice: string;
  style: string;
  audience: string;
  taboos: string;
  goals: string;
  completionPct: number;
}

export interface SDConsumptionByType {
  text: number;
  image: number;
  video: number;
  audio: number;
}

export interface SDWallet {
  balance: number;
  monthlyQuota: number;
  tier: string;
  resetAt: string;
  isUnlimited: boolean;
  byokEnabled: boolean;
  consumptionByType: SDConsumptionByType;
}

export interface SDDraft {
  id: string;
  title: string;
  type: "image" | "video" | "text";
  platform: string;
  thumbnail: string;
  dnaScore: number;
  status: "draft" | "ready" | "review";
  updatedAt: string;
}

export interface SDPlatformStatus {
  platform: string;
  connected: boolean;
  lastPostAt: string;
  followers: string;
  numericFollowers: number;
  engagementTrend: string;
  numericTrend: number;
}

// ─── Mini Stats (4 KPI cards) ───

export interface SDMiniStat {
  id: string;
  labelKey: string;
  value: string;
  variation: number;
  icon: string;
  prefix: string;
}

export const MINI_STATS: SDMiniStat[] = [
  { id: "revenue", labelKey: "studio_dashboard.stats.revenue", value: "€8 240", variation: 12.5, icon: "TrendingUp", prefix: "+" },
  { id: "followers", labelKey: "studio_dashboard.stats.followers", value: "90,1K", variation: 4.2, icon: "Users", prefix: "+" },
  { id: "engagement", labelKey: "studio_dashboard.stats.engagement", value: "6,8%", variation: -0.3, icon: "Heart", prefix: "" },
  { id: "content", labelKey: "studio_dashboard.stats.content", value: "24", variation: 8, icon: "FileText", prefix: "+" },
];

// ─── Missions (7, picked by day of week) ───

export const MISSIONS: SDMission[] = [
  {
    id: "reel",
    titleKey: "studio_dashboard.mission.reel.title",
    descriptionKey: "studio_dashboard.mission.reel.desc",
    impact: "high",
    durationMin: 30,
    difficulty: "medium",
    rewardEmoji: "🎬",
    ctaLabelKey: "studio_dashboard.mission.cta.composer",
    ctaHref: "/studio/composer",
    completed: false,
  },
  {
    id: "dna",
    titleKey: "studio_dashboard.mission.dna.title",
    descriptionKey: "studio_dashboard.mission.dna.desc",
    impact: "high",
    durationMin: 15,
    difficulty: "easy",
    rewardEmoji: "🧬",
    ctaLabelKey: "studio_dashboard.mission.cta.dna",
    ctaHref: "/onboarding/dna",
    completed: false,
  },
  {
    id: "fans",
    titleKey: "studio_dashboard.mission.fans.title",
    descriptionKey: "studio_dashboard.mission.fans.desc",
    impact: "medium",
    durationMin: 20,
    difficulty: "medium",
    rewardEmoji: "💤",
    ctaLabelKey: "studio_dashboard.mission.cta.fans",
    ctaHref: "/dashboard/atlas/ppv-pricing",
    completed: false,
  },
  {
    id: "ppv",
    titleKey: "studio_dashboard.mission.ppv.title",
    descriptionKey: "studio_dashboard.mission.ppv.desc",
    impact: "high",
    durationMin: 25,
    difficulty: "hard",
    rewardEmoji: "💰",
    ctaLabelKey: "studio_dashboard.mission.cta.ppv",
    ctaHref: "/dashboard/atlas/ppv-pricing",
    completed: false,
  },
  {
    id: "schedule",
    titleKey: "studio_dashboard.mission.schedule.title",
    descriptionKey: "studio_dashboard.mission.schedule.desc",
    impact: "medium",
    durationMin: 10,
    difficulty: "easy",
    rewardEmoji: "📅",
    ctaLabelKey: "studio_dashboard.mission.cta.schedule",
    ctaHref: "/studio/scheduled",
    completed: false,
  },
  {
    id: "legal",
    titleKey: "studio_dashboard.mission.legal.title",
    descriptionKey: "studio_dashboard.mission.legal.desc",
    impact: "medium",
    durationMin: 10,
    difficulty: "easy",
    rewardEmoji: "🛡️",
    ctaLabelKey: "studio_dashboard.mission.cta.legal",
    ctaHref: "/dashboard/atlas/legal",
    completed: false,
  },
  {
    id: "story",
    titleKey: "studio_dashboard.mission.story.title",
    descriptionKey: "studio_dashboard.mission.story.desc",
    impact: "medium",
    durationMin: 15,
    difficulty: "easy",
    rewardEmoji: "✨",
    ctaLabelKey: "studio_dashboard.mission.cta.story",
    ctaHref: "/studio/composer",
    completed: false,
  },
];

const MISSION_ORDER = ["reel", "dna", "fans", "ppv", "schedule", "legal", "story"];

export function pickDailyMission(): SDMission {
  const dayIndex = new Date().getDay(); // 0=Sun, 1=Mon, ...
  const missionId = MISSION_ORDER[dayIndex % MISSION_ORDER.length];
  const mission = MISSIONS.find((m) => m.id === missionId)!;
  return { ...mission, completed: false };
}

// ─── Quick Actions (6, mapped to real routes) ───

export const QUICK_ACTIONS: SDQuickAction[] = [
  {
    id: "create",
    labelKey: "studio_dashboard.quick.create",
    descriptionKey: "studio_dashboard.quick.create_desc",
    icon: "PenSquare",
    href: "/studio/composer",
    color: "#C75B39",
  },
  {
    id: "caption",
    labelKey: "studio_dashboard.quick.caption",
    descriptionKey: "studio_dashboard.quick.caption_desc",
    icon: "Sparkles",
    href: "/studio/generate/text",
    color: "#8B5CF6",
  },
  {
    id: "video",
    labelKey: "studio_dashboard.quick.video",
    descriptionKey: "studio_dashboard.quick.video_desc",
    icon: "Video",
    href: "/studio/generate/video",
    color: "#3B82F6",
  },
  {
    id: "schedule",
    labelKey: "studio_dashboard.quick.schedule",
    descriptionKey: "studio_dashboard.quick.schedule_desc",
    icon: "Calendar",
    href: "/studio/scheduled",
    color: "#10B981",
  },
  {
    id: "revenue",
    labelKey: "studio_dashboard.quick.revenue",
    descriptionKey: "studio_dashboard.quick.revenue_desc",
    icon: "DollarSign",
    href: "/dashboard/atlas/revenue-inbox",
    color: "#F59E0B",
  },
  {
    id: "contract",
    labelKey: "studio_dashboard.quick.contract",
    descriptionKey: "studio_dashboard.quick.contract_desc",
    icon: "ShieldCheck",
    href: "/dashboard/atlas/legal",
    color: "#EC4899",
  },
];

// ─── Insights (6) ───

export const INSIGHTS: SDInsight[] = [
  {
    id: "format",
    type: "format",
    titleKey: "studio_dashboard.insight.format.title",
    descriptionKey: "studio_dashboard.insight.format.desc",
    sourceKey: "studio_dashboard.insight.source.analytics",
    confidence: 85,
    actionLabelKey: "studio_dashboard.insight.action.create",
    actionHref: "/studio/composer",
  },
  {
    id: "time",
    type: "time",
    titleKey: "studio_dashboard.insight.time.title",
    descriptionKey: "studio_dashboard.insight.time.desc",
    sourceKey: "studio_dashboard.insight.source.analytics",
    confidence: 78,
    actionLabelKey: "studio_dashboard.insight.action.schedule",
    actionHref: "/studio/scheduled",
  },
  {
    id: "topic",
    type: "topic",
    titleKey: "studio_dashboard.insight.topic.title",
    descriptionKey: "studio_dashboard.insight.topic.desc",
    sourceKey: "studio_dashboard.insight.source.trends",
    confidence: 72,
    actionLabelKey: "studio_dashboard.insight.action.create",
    actionHref: "/studio/composer",
  },
  {
    id: "hook",
    type: "hook",
    titleKey: "studio_dashboard.insight.hook.title",
    descriptionKey: "studio_dashboard.insight.hook.desc",
    sourceKey: "studio_dashboard.insight.source.ai",
    confidence: 65,
    actionLabelKey: "studio_dashboard.insight.action.try",
    actionHref: "/studio/generate/text",
  },
  {
    id: "platform",
    type: "platform",
    titleKey: "studio_dashboard.insight.platform.title",
    descriptionKey: "studio_dashboard.insight.platform.desc",
    sourceKey: "studio_dashboard.insight.source.trends",
    confidence: 80,
    actionLabelKey: "studio_dashboard.insight.action.explore",
    actionHref: "/studio/composer",
  },
  {
    id: "risk",
    type: "risk",
    titleKey: "studio_dashboard.insight.risk.title",
    descriptionKey: "studio_dashboard.insight.risk.desc",
    sourceKey: "studio_dashboard.insight.source.ai",
    confidence: 90,
    actionLabelKey: "studio_dashboard.insight.action.vary",
    actionHref: "/studio/generate/text",
  },
];

// ─── Calendar (7 days from today) ───

const PLATFORMS = ["OF", "Fansly", "IG", "TT"];
const POST_TITLES = [
  "Photo lingerie",
  "Morning routine",
  "BTS tournage",
  "Q&A abonnés",
  "Exclusif PPV teaser",
  "Behind the scenes",
  "Photo set plage",
  "Story interactive",
  "Collab capsule",
  "Live annonce",
];
const SUGGESTIONS_POOL = [
  "Photo set plage",
  "Story Q&A",
  "Reel 15s BTS",
  "Exclusif coulisses",
  "Teaser PPV",
  "Polls stories",
];

export function generateCalendar(): SDCalendarEvent[] {
  const today = new Date();
  const days: SDCalendarEvent[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dayOfMonth = d.getDate();
    const postCount = Math.floor(Math.random() * 3);
    const posts: SDPost[] = [];
    const usedTitles = new Set<string>();
    for (let p = 0; p < postCount; p++) {
      const title = POST_TITLES[Math.floor(Math.random() * POST_TITLES.length)];
      if (usedTitles.has(title)) continue;
      usedTitles.add(title);
      posts.push({
        title,
        platform: PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)],
        time: `${8 + Math.floor(Math.random() * 12)}h`,
        status: i < 2 ? "posted" : i < 4 ? "scheduled" : "draft",
      });
    }
    const suggestionCount = Math.min(2, Math.floor(Math.random() * 3));
    const suggestions: string[] = [];
    for (let s = 0; s < suggestionCount; s++) {
      const sug = SUGGESTIONS_POOL[Math.floor(Math.random() * SUGGESTIONS_POOL.length)];
      if (!suggestions.includes(sug)) suggestions.push(sug);
    }
    days.push({ day: dayOfMonth, posts, suggestions });
  }
  return days;
}

// ─── DNA Profile ───

export const DNA_PROFILE: SDDnaProfile = {
  voice: "studio_dashboard.dna.voice_value",
  style: "studio_dashboard.dna.style_value",
  audience: "studio_dashboard.dna.audience_value",
  taboos: "studio_dashboard.dna.taboos_value",
  goals: "studio_dashboard.dna.goals_value",
  completionPct: 72,
};

// ─── Wallet / Credits ───

export const WALLET: SDWallet = {
  balance: 1840,
  monthlyQuota: 5000,
  tier: "Pro",
  resetAt: "2026-07-01",
  isUnlimited: false,
  byokEnabled: true,
  consumptionByType: {
    text: 30,
    image: 45,
    video: 20,
    audio: 5,
  },
};

// ─── Drafts (6) ───

export const DRAFTS: SDDraft[] = [
  { id: "d1", title: "Photo lingerie set", type: "image", platform: "OF", thumbnail: "", dnaScore: 88, status: "draft", updatedAt: "2026-06-09T14:30:00Z" },
  { id: "d2", title: "Morning routine Reel", type: "video", platform: "TT", thumbnail: "", dnaScore: 72, status: "draft", updatedAt: "2026-06-09T10:00:00Z" },
  { id: "d3", title: "Q&A caption", type: "text", platform: "IG", thumbnail: "", dnaScore: 95, status: "ready", updatedAt: "2026-06-08T16:45:00Z" },
  { id: "d4", title: "BTS tournage", type: "video", platform: "Fansly", thumbnail: "", dnaScore: 65, status: "review", updatedAt: "2026-06-08T09:15:00Z" },
  { id: "d5", title: "Photo set plage", type: "image", platform: "OF", thumbnail: "", dnaScore: 91, status: "draft", updatedAt: "2026-06-07T18:00:00Z" },
  { id: "d6", title: "Teaser PPV exclusif", type: "video", platform: "Fansly", thumbnail: "", dnaScore: 80, status: "ready", updatedAt: "2026-06-07T11:30:00Z" },
];

// ─── Platform Health (4) ───

export const PLATFORM_HEALTH: SDPlatformStatus[] = [
  { platform: "OnlyFans", connected: true, lastPostAt: "studio_dashboard.health.time_2h", followers: "12.4K", numericFollowers: 12400, engagementTrend: "+3.2%", numericTrend: 3.2 },
  { platform: "Fansly", connected: true, lastPostAt: "studio_dashboard.health.time_1d", followers: "3.8K", numericFollowers: 3800, engagementTrend: "-0.5%", numericTrend: -0.5 },
  { platform: "Instagram", connected: true, lastPostAt: "studio_dashboard.health.time_4h", followers: "45.2K", numericFollowers: 45200, engagementTrend: "+5.1%", numericTrend: 5.1 },
  { platform: "TikTok", connected: true, lastPostAt: "studio_dashboard.health.time_30m", followers: "28.7K", numericFollowers: 28700, engagementTrend: "+8.3%", numericTrend: 8.3 },
];

// ─── Greeting data ───

export const DNA_COMPLETION = 72;
export const AGENT_COUNT = 5;
