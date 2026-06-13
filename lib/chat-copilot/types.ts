// ─── Fan Brain, Types ─────────────────────────────────────
// Persistent knowledge graph per fan for Chat Copilot

export type FanSegment =
  | "whale"
  | "tipper"
  | "regular"
  | "lurker"
  | "churning";

export type CommunicationStyle =
  | "flirty"
  | "friendly"
  | "shy"
  | "demanding"
  | "casual";

export type SentimentTrend = "positive" | "neutral" | "declining";

export type EngagementTrend = "rising" | "stable" | "declining";

export type PreferredContentType =
  | "photo"
  | "video"
  | "audio"
  | "text";

export type MemoryType =
  | "conversation_summary"
  | "topic"
  | "preference"
  | "purchase_context"
  | "trigger_event"
  | "manual_note"
  | "interaction";

export type BrainSegment =
  | "profile"
  | "financial"
  | "personality"
  | "conversation"
  | "risk"
  | "tags";

// ─── Profile ───────────────────────────────────────────────

export interface FanBrainProfile {
  nickname: string | null;
  custom_name: string | null;
  first_contact: string | null; // ISO date
  last_active: string | null; // ISO date
  language: string;
  timezone_estimate: string | null;
}

// ─── Financial ────────────────────────────────────────────

export interface FanBrainFinancial {
  total_spent: number;
  ltv_predicted: number;
  segment: FanSegment;
  last_purchase: string | null; // ISO date
  average_ppv_price: number;
  tip_history: number[];
  subscription_months: number;
}

// ─── Personality ──────────────────────────────────────────

export interface FanBrainPersonality {
  communication_style: CommunicationStyle;
  interests: string[];
  triggers_positive: string[];
  triggers_negative: string[];
  preferred_content_type: PreferredContentType;
  preferred_tone: string;
  notes_manuelles: string;
}

// ─── Conversation ─────────────────────────────────────────

export interface FanBrainConversation {
  total_messages: number;
  topics_discussed: string[];
  last_messages_summary: string;
  sentiment_trend: SentimentTrend;
  open_threads: string[];
  best_performing_messages: string[];
}

// ─── Risk ─────────────────────────────────────────────────

export interface FanBrainRisk {
  churn_score: number; // 0-100
  days_since_last_message: number;
  days_since_last_purchase: number;
  engagement_trend: EngagementTrend;
}

// ─── FanBrain aggregate ───────────────────────────────────

export interface FanBrain {
  fan_id: string;
  creator_id: string;

  // Enriched profile
  custom_name: string | null;
  language_detected: string;
  timezone_estimate: string | null;

  // Financial enrichment
  ltv_predicted: number;
  segment: FanSegment;
  tip_history: number[];
  average_ppv_price: number;
  subscription_months: number;

  // Nested objects
  personality: FanBrainPersonality;
  conversation: FanBrainConversation;
  risk: FanBrainRisk;

  // Tags
  tags: string[];

  // Metadata
  last_brain_update: string | null;
  last_analysis_at: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Memory Embedding ─────────────────────────────────────

export interface MemoryEntry {
  id: string;
  fan_id: string;
  creator_id: string;
  memory_type: MemoryType;
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
  similarity?: number; // filled by vector search
}

export interface MemorySearchQuery {
  query: string;
  limit?: number;
  memory_type?: MemoryType;
  min_similarity?: number;
}

export interface MemorySearchResult {
  entries: MemoryEntry[];
  query: string;
}

// ─── API types ────────────────────────────────────────────

export interface BrainUpdateBody {
  segment: BrainSegment;
  data: Record<string, unknown>;
}

export interface AnalyzeBody {
  messages: { role: "fan" | "creator"; content: string; timestamp?: string }[];
}

export interface AnalysisResult {
  diff: {
    personality_changes: Partial<FanBrainPersonality> | null;
    conversation_updates: Partial<FanBrainConversation> | null;
    risk_update: Partial<FanBrainRisk> | null;
    new_tags: string[];
    new_topics: string[];
  };
  summary: string;
}

// ─── Chat Copilot UI types ───────────────────────────────────

export type Platform =
  | "onlyfans"
  | "fansly"
  | "mym"
  | "instagram";

export type SegmentEmoji =
  | "whale"
  | "tipper"
  | "new"
  | "churning"
  | "regular";

export type PriorityLevel =
  | "urgent"
  | "opportunity"
  | "normal";

export type FilterTab =
  | "all"
  | "unread"
  | "vip"
  | "at_risk"
  | "pending";

export type SortMode =
  | "recent"
  | "ai_priority"
  | "revenue_potential";

export interface ChatMessage {
  id: string;
  role: "fan" | "creator";
  content: string;
  timestamp: string;
  platform: Platform;
  read: boolean;
  delivered: boolean;
  isPPV?: boolean;
  ppvPrice?: number;
  ppvPreviewBlurred?: boolean;
}

export interface ChatConversation {
  id: string;
  fanId: string;
  fanName: string;
  nickname: string | null;
  avatarInitials: string;
  platform: Platform;
  segment: SegmentEmoji;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  priority: PriorityLevel;
  priorityScore: number;
  aiPriorityReason?: string;
  revenuePotential: number;
  tags?: string[];
}

// ─── AI Suggestion types ────────────────────────────────────

export type ActionType =
  | "ppv"
  | "re_engage"
  | "free_preview"
  | "upsell"
  | "churn_warning";

export type AlertCategory =
  | "vip"
  | "churn"
  | "timing"
  | "taboo";

export type AlertLevel =
  | "info"
  | "warning"
  | "danger"
  | "success";

export interface QuickReply {
  id: string;
  text: string;
  reasoning?: string;
}

export interface SuggestedAction {
  id: string;
  type: ActionType;
  icon: string;
  title: string;
  description: string;
  draftedMessage: string;
}

export interface ContextualAlert {
  id: string;
  type: AlertCategory;
  level: AlertLevel;
  message: string;
  detail?: string;
}

export interface SuggestionSet {
  quickReplies: QuickReply[];
  suggestedActions: SuggestedAction[];
  alerts: ContextualAlert[];
}

// ─── Tone Guard ────────────────────────────────────────────

export type ToneCheckSeverity = "warning" | "blocking";

export interface ToneWarning {
  type: "dna_mismatch" | "taboo_mention" | "unrealistic_promise" | "tos_violation" | "legal_issue" | "quality_issue";
  severity: ToneCheckSeverity;
  message: string;
  score?: number;
}

export interface ToneCheckResult {
  overall: "pass" | "warning" | "blocking";
  passed: boolean;
  warnings: ToneWarning[];
  scores?: {
    dna: number;
    taboo: number;
    tos: number;
    legal: number;
    quality: number;
  };
}

export type ToneGuardSensitivity = "strict" | "moderate" | "flexible";

export interface ToneGuardConfig {
  enabled: boolean;
  sensitivity: ToneGuardSensitivity;
  checks: {
    dna: boolean;
    taboo: boolean;
    tos: boolean;
    legal: boolean;
    quality: boolean;
  };
  blockedWords: string[];
  vipExceptions: string[];
}

export type SuggestionFeedbackType = "quick_reply" | "action" | "alert";

export interface SuggestionFeedback {
  suggestionId: string;
  type: SuggestionFeedbackType;
  isRelevant: boolean;
}

// ─── Context summary for AI prompts ───────────────────────

export interface BrainContextSummary {
  fan_name: string;
  segment: FanSegment;
  communication_style: CommunicationStyle;
  interests: string[];
  triggers_positive: string[];
  triggers_negative: string[];
  preferred_content_type: PreferredContentType;
  preferred_tone: string;
  sentiment_trend: SentimentTrend;
  churn_risk: number;
  last_topic: string;
  open_threads: string[];
  notes_manuelles: string;
  recent_memories: string[];
}
