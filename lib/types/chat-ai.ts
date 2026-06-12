// ─── Halo Sovereign Chat AI — TypeScript Types ────────────
// All interfaces, enums, and type aliases for the Chat AI module

// ============================================================
// ENUMS
// ============================================================

export type ChatAIMode = "copilot_only" | "assisted_sales" | "agency" | "elite";

export type DisclosureMode =
  | "private_copilot"
  | "team_assisted"
  | "disclosed_assistant"
  | "platform_restricted";

export type Platform = "onlyfans" | "mym" | "fansly" | "fanvue" | "other";

export type FanStatus =
  | "new"
  | "active"
  | "vip"
  | "whale"
  | "dormant"
  | "churn_risk"
  | "do_not_contact";

export type MessageDirection = "in" | "out";

export type MessageSource = "fan" | "human" | "ai_draft_approved";

export type RiskLevel = "low" | "medium" | "high";

export type ComplianceStatus = "ok" | "needs_review" | "blocked";

export type DeepSeekModel = "deepseek-v4-flash" | "deepseek-v4-pro";

export type AIDraftStatus =
  | "draft"
  | "reviewed"
  | "approved"
  | "copied"
  | "blocked"
  | "escalated";

export type FollowUpType =
  | "welcome"
  | "discovery"
  | "inactive"
  | "vip_checkin"
  | "ppv_interest"
  | "renewal"
  | "thank_you"
  | "soft_upsell"
  | "reactivation";

export type FollowUpStatus = "draft" | "pending_approval" | "approved" | "paused";

export type QAReason =
  | "risky_message"
  | "off_tone"
  | "excessive_pressure"
  | "duplicate_content"
  | "vulnerable_fan"
  | "missing_disclosure"
  | "unauthorized_promise"
  | "inconsistent_price";

export type QAStatus =
  | "pending"
  | "approved"
  | "revised"
  | "blocked"
  | "escalated"
  | "false_positive";

export type VaultSensitivity = "standard" | "sensitive";

export type VaultType = "photo" | "video" | "audio" | "bundle";

export type TaskType =
  | "draft"
  | "rewrite"
  | "translate"
  | "shorten"
  | "ppv_strategy"
  | "fan_scoring"
  | "churn_analysis"
  | "playbook_gen"
  | "compliance_analysis";

// ============================================================
// CORE INTERFACES
// ============================================================

export interface Fan {
  id: string;
  userId: string;
  pseudonym: string;
  platform: Platform;
  country: string;
  language: string;
  status: FanStatus;

  ltv: number;
  totalSpend: number;
  spend7d: number;
  spend30d: number;

  purchaseHistory: PurchaseRecord[];
  contentSentIds: string[];
  preferences: string[];
  avoidTopics: string[];
  notes: string;

  sentiment: number;
  relationshipScore: number;
  commercialScore: number;
  churnRisk: number;
  intentScore: number;

  riskFlags: string[];
  lastMessageAt: string | null;
  lastPurchaseAt: string | null;
  assignedChatterId: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface PurchaseRecord {
  date: string;
  amount: number;
  item: string;
  type: "ppv" | "tip" | "subscription" | "bundle";
}

export interface Conversation {
  id: string;
  userId: string;
  fanId: string | null;
  platform: Platform;
  priorityScore: number;
  lastMessagePreview: string;
  unread: number;
  recommendedAction: string | null;
  recommendedPPVId: string | null;
  vaultWarnings: VaultWarning[];
  complianceFlags: string[];
  status: "open" | "archived" | "paused";
  createdAt: string;
  updatedAt: string;
}

export interface VaultWarning {
  type: "already_sold" | "cooldown_active" | "sensitive_content" | "price_anomaly";
  message: string;
  assetId?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  direction: MessageDirection;
  text: string;
  source: MessageSource;
  approvedBy: string | null;
  aiMeta: AIMessageMeta | null;
  seq: number;
  createdAt: string;
}

export interface AIMessageMeta {
  model: DeepSeekModel;
  objective: string;
  tone: string;
  tokensUsed: number;
  latencyMs: number;
}

export interface AIDraft {
  id: string;
  conversationId: string;
  userId: string;
  text: string;
  objective: string;
  tone: string;
  contextSources: ContextSource[];
  riskLevel: RiskLevel;
  complianceStatus: ComplianceStatus;
  requiresValidation: true; // Always true — never auto-send
  model: DeepSeekModel;
  explanation: string;
  status: AIDraftStatus;
  createdAt: string;
}

export interface ContextSource {
  type: "fan_brain" | "playbook" | "conversation_history" | "vault" | "compliance";
  reference: string;
  snippet: string;
}

export interface PPVRecommendation {
  id: string;
  userId: string;
  vaultAssetId: string | null;
  targetFanIds: string[];
  segmentId: string | null;
  recommendedPrice: number;
  minPrice: number;
  maxPrice: number;
  justification: string;
  fatigueRisk: string;
  alreadySoldTo: string[];
  conversionEstimate: string; // "Estimation non garantie"
  status: "draft" | "proposed" | "accepted" | "rejected";
  createdAt: string;
}

export interface VaultAsset {
  id: string;
  userId: string;
  title: string;
  type: VaultType;
  sensitivity: VaultSensitivity;
  priceHistory: PricePoint[];
  soldToFanIds: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface PricePoint {
  date: string;
  price: number;
  soldTo: number; // fan count
}

export interface FollowUp {
  id: string;
  userId: string;
  type: FollowUpType;
  segmentId: string | null;
  objective: string;
  delayHours: number;
  draftText: string;
  riskLevel: RiskLevel;
  status: FollowUpStatus;
  humanApprovalRequired: true; // Always true
  createdAt: string;
  updatedAt: string;
}

export interface Playbook {
  id: string;
  userId: string;
  name: string;
  globalTone: string;
  allowedWords: string[];
  forbiddenWords: string[];
  emojiPolicy: string;
  signaturePhrases: string[];
  boundaries: string[];
  forbiddenTopics: string[];
  boldnessLevel: number; // 1-5
  ppvMinPrice: number;
  ppvMaxPrice: number;
  vipRules: Record<string, unknown>;
  dormantRules: Record<string, unknown>;
  customRequestRules: Record<string, unknown>;
  escalationRules: Record<string, unknown>;
  noContactRules: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QAItem {
  id: string;
  userId: string;
  messageId: string | null;
  draftId: string | null;
  reason: QAReason;
  severity: number; // 1-5
  status: QAStatus;
  reviewerId: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceCheckResult {
  allowed: boolean;
  riskLevel: RiskLevel;
  reasons: string[];
  requiredActions: string[];
  suggestedSafeAlternative: string | null;
}

export interface AuditLogEntry {
  id: string;
  userId: string | null;
  actorId: string | null;
  actorType: "creator" | "chatter" | "admin" | "system";
  action: string;
  targetType: string | null;
  targetId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface ConsentChecklist {
  id: string;
  userId: string;
  version: number;
  item1Authorized: boolean;
  item2PlatformRules: boolean;
  item3IALimitations: boolean;
  item4NoGuarantee: boolean;
  item5NoRevenueGuarantee: boolean;
  item6HumanApproval: boolean;
  item7Disclosure: boolean;
  item8Boundaries: boolean;
  item9AuditLogged: boolean;
  item10CanDisable: boolean;
  item11LegalInfoOnly: boolean;
  completedAt: string | null;

  /** Whether all 11 items are checked */
  isComplete: boolean;
}

export interface ChatAIPlan {
  id: "starter" | "growth" | "pro_agency" | "elite";
  nameKey: string;
  price: number;
  currency: string;
  commission: string; // e.g. "0%", "5%", "5-8%", "3-5%"
  features: string[];
  limits: ChatAIPlanLimits;
}

export interface ChatAIPlanLimits {
  maxFans: number;
  maxConversations: number;
  maxDraftsPerDay: number;
  maxPPVRecommendations: number;
  maxChatters: number;
  includesVault: boolean;
  includesPlaybooks: boolean;
  includesQA: boolean;
  includesCompliance: boolean;
}

export interface UserConfig {
  id: string;
  userId: string;
  mode: ChatAIMode;
  disclosure: DisclosureMode;
  platforms: Platform[];
  activePlaybookId: string | null;
  isPaused: boolean;
  isActive: boolean;
  demoMode: boolean;
  wizardStep: number;
  wizardCompleted: boolean;
  cooldownMinutes: number;
  maxDailyDrafts: number;
  plan: string;
  updatedAt: string;
  createdAt: string;
}

export interface TrackingEvent {
  name: string;
  payload: Record<string, unknown>;
  timestamp: string;
  sessionId?: string;
}

// ============================================================
// API TYPES
// ============================================================

export interface DeepSeekRequest {
  model: DeepSeekModel;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  temperature?: number;
  maxTokens?: number;
  json?: boolean;
}

export interface DeepSeekResponse {
  text: string;
  model: DeepSeekModel;
  tokensUsed: number;
  latencyMs: number;
  parsed?: Record<string, unknown>;
}

export interface GenerateDraftInput {
  conversationId: string;
  fanId: string;
  objective: string;
  tone?: string;
  action?: "generate" | "rewrite_warmer" | "rewrite_premium" | "shorten" | "translate" | "naturalize";
  targetLanguage?: string;
}

export interface GenerateDraftOutput {
  draft: AIDraft;
  text: string;
  riskLevel: RiskLevel;
  complianceNotes: string[];
  explanation: string;
  model: DeepSeekModel;
  tokensUsed: number;
  latencyMs: number;
}

export interface PPVStrategyInput {
  vaultAssetId: string;
  targetFanIds?: string[];
  segmentId?: string;
}

export interface PPVStrategyOutput {
  recommendations: PPVRecommendation[];
  reasoning: string;
  model: DeepSeekModel;
}

export interface FanInsightInput {
  fanId: string;
  includeHistory?: boolean;
}

export interface FanInsightOutput {
  scoring: {
    intentScore: number;
    churnRisk: number;
    commercialScore: number;
    relationshipScore: number;
  };
  nextBestAction: string;
  talkingPoints: string[];
  warnings: string[];
  model: DeepSeekModel;
}

export interface ComplianceScanInput {
  text: string;
  fanId: string;
  playbookId: string;
  action: string;
}

export interface ComplianceScanOutput {
  allowed: boolean;
  riskLevel: RiskLevel;
  reasons: string[];
  requiredActions: string[];
  suggestedSafeAlternative: string | null;
  model: DeepSeekModel;
}

// ============================================================
// CHAT AI ACTION TYPES (for compliance gate)
// ============================================================

export type ChatAIAction =
  | "generate_draft"
  | "approve_draft"
  | "create_ppv"
  | "create_followup"
  | "activate_module"
  | "change_mode"
  | "export_data";

export interface ChatAIActionContext {
  userId: string;
  fanId?: string;
  playbookId?: string;
  platform?: Platform;
  mode?: ChatAIMode;
  disclosure?: DisclosureMode;
  consentCompleted?: boolean;
  cooldownSince?: string;
  draftCount?: number;
  isPaused?: boolean;
}
