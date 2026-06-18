"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Search, Send, Zap, Star, TrendingUp, DollarSign,
  Users, ShieldCheck, Target, Link, Globe, List,
  Workflow, BarChart3, UserCheck, AlertTriangle,
  Eye, Lock, Settings, FileCheck, Clock, MessageCircle,
  X, CheckCircle, ChevronRight, Play, Mail, Smartphone,
  Bell, MoreHorizontal, Plus, Filter, ArrowRight,
  ArrowLeft, Activity, Copy, ExternalLink, RefreshCcw,
  Edit3, ThumbsUp, ThumbsDown, Loader, Image, Inbox,
  Sliders, GitBranch, Layers, BookOpen, Ban,
  UserCog, Megaphone, Video, Lightbulb, Brain,
  Cpu, MessageSquare, Percent, TrendingDown,
  Sparkles, Radio, Palette,
  Info, ChevronDown, Menu,
} from "lucide-react";
import {
  mockConversations, mockPricingScenarios, mockSavedSegments,
  mockAutomationRules, mockTrackingLinks, mockBrowserTabs,
  mockFeedPosts, mockDMs, mockCampaigns, mockFanJourneyStages,
  mockOpportunities, mockTeamMembers, mockTeamActivity,
  mockComplianceItems, mockSafetyReasons, mockGuardSettings,
  mockAiCoreSettings, mockHandoffRules, mockPpvLadderScripts,
  mockMessageLedger, mockBannedKeywords, mockCreatorProfile,
  mockNotifications, mockAiReels, mockEmployeeStats, mockFeatureRequests,
  NAV_GROUPS, FAN_TIER_LABELS, FAN_TIER_COLORS,
  STATUS_LABELS, STATUS_COLORS, PLATFORM_LABELS,
  OPPORTUNITY_STAGE_LABELS, OPPORTUNITY_STAGE_COLORS,
  OPPORTUNITY_TYPE_LABELS, OPPORTUNITY_TYPE_COLORS,
  CAMPAIGN_STEP_LABELS, CAMPAIGN_STEP_ORDER, CAMPAIGN_TYPE_LABELS,
  TRIGGER_EVENT_LABELS, TRIGGER_ACTION_LABELS,
  GUARD_CATEGORY_LABELS, RISK_CATEGORY_LABELS,
  AVAILABLE_FILTER_FIELDS,
  AI_CORE_MODE_LABELS, AI_CORE_MODE_COLORS, HANDOFF_ACTION_LABELS,
  BANNED_CATEGORY_LABELS, BANNED_APPLIES_TO_LABELS, CREATOR_TONE_LABELS,
  NOTIF_TYPE_LABELS, NOTIF_CHANNEL_LABELS, REEL_PLATFORM_LABELS,
  FEATURE_CATEGORY_LABELS, FEATURE_STATUS_LABELS,
  formatEuro, formatRelative, ONBOARDING_STEPS, SECTION_DESCRIPTIONS,
  type SectionId, type AIConversation, type AIDraft,
  type PricingScenario, type CampaignBuild,
  type CampaignStep, type OpportunityStage,
  type SalesOpportunity, type AutomationRule,
  type TrackingLink, type TeamMember,
  type ComplianceReviewItem, type SafetyGuardSetting,
  type SafetyReason, type FanFilter, type SavedSegment,
  type AiCoreSettings, type HandoffRuleGroup,
  type PpvLadderScript, type MessageLedgerEntry,
  type BannedKeyword, type CreatorProfile,
  type NotificationItem, type AiReel,
  type EmployeeStats, type FeatureRequest,
} from "./data";
import { AtlasLocaleProvider, useT, useAtlasLocale, LocaleSwitcher } from "./i18n";

// ═══ Nav Label → i18n Key Mapping ══════════════════════

const GROUP_KEY_MAP: Record<string, string> = {
  "INBOX": "nav.inbox",
  "AI SALES ENGINE": "nav.aiSalesEngine",
  "CAMPAIGNS": "nav.campaigns",
  "SCRIPTS": "nav.scripts",
  "VAULT": "nav.vault",
  "TEAM": "nav.team",
  "SAFETY": "nav.safety",
  "SETTINGS": "nav.settings",
  "ROADMAP": "nav.roadmap",
};

const SECTION_KEY_MAP: Record<string, string> = {
  "AI Sales Engine": "nav.salesEngine",
  "Message Ledger": "nav.messageLedger",
  "Opportunity Queue": "nav.opportunityQueue",
  "Dynamic Lists": "nav.dynamicLists",
  "Script Builder / PPV": "nav.scriptBuilder",
  "Campaign Builder": "nav.campaignBuilder",
  "Creative Engine / Reels": "nav.creativeEngine",
  "Dynamic Pricing": "nav.dynamicPricing",
  "Hybrid Handoff Rules": "nav.hybridHandoff",
  "AI Core Settings": "nav.aiCoreSettings",
  "Creator Profile": "nav.creatorProfile",
  "Banned Keywords": "nav.bannedKeywords",
  "Tracking & Attribution": "nav.tracking",
  "Fan Journey": "nav.fanJourney",
  "Team Control Room": "nav.teamControl",
  "Notifications Center": "nav.notifications",
  "Compliance Review": "nav.complianceReview",
  "Safety Guard": "nav.safetyGuard",
  "Automation Triggers": "nav.automationTriggers",
  "Why Atlas is Safer": "nav.whyAtlasSafer",
  "Browser Workspace": "nav.browserWorkspace",
  "Feature Requests": "nav.featureRequests",
};

// ═══ Label Key Maps (data key → translation key suffix) ══

const FAN_TIER_KEY: Record<string, string> = {
  whale: "fanTier.whale", vip: "fanTier.vip", engaged: "fanTier.engaged",
  new: "fanTier.newFan", at_risk: "fanTier.atRisk", dormant: "fanTier.dormant",
};
const STATUS_KEY: Record<string, string> = {
  ai_draft_ready: "status.aiDraftReady", human_reviewing: "status.reviewing",
  approved: "status.approved", sent: "status.sent", rejected: "status.rejected", waiting: "status.waiting",
};
const TRIGGER_EVENT_KEY: Record<string, string> = {
  fan_message_received: "trigger.fanMessage", fan_subscribed: "trigger.newSub",
  fan_unsubscribed: "trigger.unsub", purchase_completed: "trigger.purchase",
  fan_inactive_7d: "trigger.inactive7", fan_inactive_30d: "trigger.inactive30",
  ppv_viewed: "trigger.ppvViewed", birthday: "trigger.fanBirthday", vip_milestone: "trigger.vipTier",
};
const TRIGGER_ACTION_KEY: Record<string, string> = {
  send_welcome_message: "action.welcome", send_ppv_offer: "action.proposePpv",
  send_reengagement: "action.reengage", assign_to_chatter: "action.assignChatter",
  add_tag: "action.addTag", flag_for_review: "action.flagReview",
  send_discount: "action.sendDiscount", send_birthday_gift: "action.birthdayGift",
};

const ONBOARDING_KEY: Record<string, string> = {
  step1: "onboarding.configureAi", step2: "onboarding.createScript",
  step3: "onboarding.reviewHandoff", step4: "onboarding.inviteChatter",
  step5: "onboarding.checkCompliance",
};

// ═══ Main Component ═══════════════════════════════════════

export function AtlasInboxV2() {
  return (
    <AtlasLocaleProvider>
      <AtlasInboxV2Inner />
    </AtlasLocaleProvider>
  );
}

function AtlasInboxV2Inner() {
  const t = useT();
  const [activeSection, setActiveSection] = useState<SectionId>("sales_engine");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set(["VAULT", "SETTINGS", "ROADMAP"]));
  const toggleGroup = (label: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const [onboardingVisible, setOnboardingVisible] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  return (
    <div
      className="flex flex-col lg:flex-row h-screen overflow-hidden max-w-full"
      style={{ backgroundColor: "#F6F1E8", overflowX: "hidden" }}
    >
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="lg:hidden flex items-center gap-2 px-4 py-2 text-[11px] border-b shrink-0"
        style={{ borderColor: "#E5D7C3", color: "#5F5145" }}
      >
        <Menu size={14} />
        <span>{t("sidebar.menu")}</span>
        <span className="text-[12px] ml-auto" style={{ color: "#C9973F" }}>{activeSection}</span>
      </button>

      {/* ─── Sidebar (Dark) ────────────────────────────── */}
      <aside
        className={`${
          sidebarCollapsed ? "w-[48px]" : "w-[220px]"
        } shrink-0 flex-col border-r transition-all duration-200 hidden lg:flex`}
        style={{ backgroundColor: "#110D09", borderColor: "rgba(255,255,255,0.06)" }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-2 px-4 py-3.5 border-b shrink-0"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="text-[14px] font-display font-semibold tracking-widest" style={{ color: "#F4EEE3" }}>
                ATLAS<span style={{ color: "#C9973F" }}>.</span>OS
              </h1>
              <p className="text-[12px] mt-0.5 tracking-[0.15em] uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>{t("sidebar.agencyOs")}</p>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded-sm hover:bg-white/[0.04] transition-colors shrink-0"
            style={{ color: "rgba(255,255,255,0.30)" }}
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronRight size={14} className="rotate-180" />}
          </button>
        </div>

        {/* Nav Groups */}
        <div className="flex-1 py-2 overflow-y-auto">
          {NAV_GROUPS.map((group) => {
            const isCollapsed = collapsedGroups.has(group.label);
            return (
            <div key={group.label} className="mb-1">
              {!sidebarCollapsed && (
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center gap-1 text-[10px] font-medium tracking-widest px-4 py-1.5 hover:bg-white/[0.02] transition-colors"
                  style={{ color: "rgba(255,255,255,0.20)" }}
                >
                  <span className="flex-1 text-left">{t(GROUP_KEY_MAP[group.label] || group.label)}</span>
                  <ChevronDown size={10} style={{ transform: isCollapsed ? "rotate(-90deg)" : undefined, transition: "transform 0.15s" }} />
                </button>
              )}
              {!isCollapsed && group.sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    title={section.description || t(SECTION_KEY_MAP[section.label] || section.label)}
                    className={`w-full flex items-center gap-2 text-left transition-colors ${
                      sidebarCollapsed ? "px-3 py-2.5 justify-center" : "px-4 py-2"
                    }`}
                    style={{
                      backgroundColor: isActive ? "rgba(201,151,63,0.10)" : "transparent",
                      borderLeft: isActive ? "2px solid #C9973F" : "2px solid transparent",
                      color: isActive ? "#F4EEE3" : "rgba(255,255,255,0.35)",
                    }}
                  >
                    <Icon size={14} style={{ color: isActive ? "#C9973F" : "rgba(255,255,255,0.30)" }} />
                    {!sidebarCollapsed && (
                      <span className="text-[12px] font-medium truncate">{t(SECTION_KEY_MAP[section.label] || section.label)}</span>
                    )}
                    {isActive && !sidebarCollapsed && (
                      <div className="ml-auto w-1 h-1 rounded-full" style={{ backgroundColor: "#C9973F" }} />
                    )}
                  </button>
                );
              })}
            </div>
          );
          })}
        </div>

        {/* Footer badge */}
        {!sidebarCollapsed && (
          <div className="px-4 py-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm"
              style={{ backgroundColor: "rgba(201,151,63,0.08)" }}
            >
              <ShieldCheck size={11} style={{ color: "#C9973F" }} />
              <span className="text-[13px] font-medium" style={{ color: "#C9973F" }}>
                {t("sidebar.footerBadge")}
              </span>
            </div>
          </div>
        )}
      </aside>

      {/* ─── Content Area ─────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-y-auto" style={{ backgroundColor: "#F6F1E8" }}>
        {/* Topbar */}
        <div className="shrink-0 px-6 py-4 border-b" style={{ backgroundColor: "#FFFBF4", borderColor: "#E5D7C3", boxShadow: "0 1px 2px rgba(23,18,12,0.03)" }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[28px] font-display font-semibold tracking-tight" style={{ color: "#17120C" }}>
                Atlas Inbox
              </h1>
              <p className="text-[14px] mt-0.5" style={{ color: "#5F5145" }}>
                {t("topbar.subtitle")}
              </p>
            </div>
            <div className="flex items-center gap-3 text-[12px] font-medium">
              <LocaleSwitcher />
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm" style={{ backgroundColor: "#E8F2EA", color: "#2F7D4E" }}>
                <ShieldCheck size={13} /> {t("topbar.badge.noAutoSend")}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm" style={{ backgroundColor: "#E8F2EA", color: "#2F7D4E" }}>
                <Lock size={13} /> {t("topbar.badge.noScraping")}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm" style={{ backgroundColor: "#E8F2EA", color: "#2F7D4E" }}>
                <UserCheck size={13} /> {t("topbar.badge.humanApproved")}
              </span>
            </div>
          </div>
        </div>

        {/* Safety banner */}
        <div className="flex items-center justify-center gap-4 lg:gap-6 px-4 py-1.5 border-b shrink-0"
          style={{ backgroundColor: "#F8F6F2", borderColor: "#E5D7C3" }}>
          <span className="text-[12px] flex items-center gap-1.5 font-medium" style={{ color: "#5F5145" }}>
            <ShieldCheck size={12} style={{ color: "#C9973F" }} /> {t("safety.propose")}
          </span>
          <span className="text-[12px] hidden sm:inline" style={{ color: "#5F5145" }}>{t("safety.noAuto")}</span>
          <span className="text-[12px] hidden sm:inline" style={{ color: "#5F5145" }}>{t("safety.noScraping")}</span>
          <span className="text-[12px] hidden sm:inline" style={{ color: "#5F5145" }}>{t("safety.noUsurpation")}</span>
        </div>

        {/* Onboarding: Launch Atlas OS */}
        {onboardingVisible && completedSteps.size < ONBOARDING_STEPS.length && (
          <AtlasLaunchBlock
            steps={ONBOARDING_STEPS}
            completedSteps={completedSteps}
            onToggleStep={(id) => setCompletedSteps((prev) => {
              const next = new Set(prev);
              if (next.has(id)) next.delete(id);
              else next.add(id);
              return next;
            })}
            onNavigate={(id) => setActiveSection(id as SectionId)}
            onDismiss={() => setOnboardingVisible(false)}
          />
        )}

        <div className="animate-fade-in">
          {activeSection === "sales_engine" && <SalesEngineSection />}
          {activeSection === "campaign_builder" && <CampaignBuilderSection />}
          {activeSection === "opportunity_queue" && <OpportunityQueueSection />}
          {activeSection === "pricing_lab" && <PricingLabSection />}
          {activeSection === "tracking_links" && <TrackingLinksSection />}
          {activeSection === "lists_builder" && <ListsBuilderSection />}
          {activeSection === "fan_journey" && <FanJourneySection />}
          {activeSection === "automation_triggers" && <AutomationTriggersSection />}
          {activeSection === "browser_mock" && <BrowserMockSection />}
          {activeSection === "team_control" && <TeamControlRoomSection />}
          {activeSection === "compliance_review" && <ComplianceReviewSection />}
          {activeSection === "why_atlas_safer" && <WhyAtlasSaferSection />}
          {activeSection === "safety_guard" && <SafetyGuardSection />}
          {activeSection === "ai_core_settings" && <AiCoreSettingsSection />}
          {activeSection === "hybrid_handoff" && <HybridHandoffSection />}
          {activeSection === "script_builder" && <ScriptBuilderSection />}
          {activeSection === "message_ledger" && <MessageLedgerSection />}
          {activeSection === "banned_keywords" && <BannedKeywordsSection />}
          {activeSection === "creator_profile" && <CreatorProfileSection />}
          {activeSection === "notifications_center" && <NotificationsCenterSection />}
          {activeSection === "creative_engine" && <CreativeEngineSection />}
          {activeSection === "roadmap" && <RoadmapSection />}
        </div>
      </main>
    </div>
  );
}

// ═══ Shared UI Components ═════════════════════════════════

function AtlasLaunchBlock({
  steps, completedSteps, onToggleStep, onNavigate, onDismiss,
}: {
  steps: Array<{ id: string; label: string; description: string; sectionTarget: string | null; icon: React.ComponentType<{ size?: number }> }>;
  completedSteps: Set<string>;
  onToggleStep: (id: string) => void;
  onNavigate: (id: string) => void;
  onDismiss: () => void;
}) {
  const t = useT();
  if (steps.length === 0) return null;
  const done = completedSteps.size;
  const total = steps.length;
  const pct = Math.round((done / total) * 100);
  return (
    <div className="mx-4 mt-3 px-4 py-2.5 rounded-sm border" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5D7C3", boxShadow: "0 1px 3px rgba(23,18,12,0.04)" }}>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <Sparkles size={14} style={{ color: "#C9973F" }} />
          <span className="text-[13px] font-semibold" style={{ color: "#17120C" }}>{t("onboarding.getStarted")}</span>
          <span className="text-[12px] font-mono" style={{ color: "#5F5145" }}>{done}/{total}</span>
        </div>
        {/* Progress bar */}
        <div className="h-1 flex-1 rounded-full min-w-[60px]" style={{ backgroundColor: "#EAE2D7" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: pct === 100 ? "#2F7D4E" : "#C9973F" }} />
        </div>
        {/* Compact step pills */}
        <div className="flex items-center gap-1.5 flex-wrap shrink-0">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isComplete = completedSteps.has(step.id);
            return (
              <button
                key={step.id}
                onClick={() => onToggleStep(step.id)}
                className="flex items-center gap-1 px-2 py-1 rounded-sm text-[12px] font-medium transition-colors"
                title={step.description}
                style={{
                  backgroundColor: isComplete ? "#E8F2EA" : "#F2EDE4",
                  color: isComplete ? "#2F7D4E" : "#5F5145",
                  textDecoration: isComplete ? "line-through" : "none",
                }}
              >
                {isComplete ? <CheckCircle size={11} /> : <Icon size={11} />}
                {t(ONBOARDING_KEY[step.id] || step.label)}
              </button>
            );
          })}
        </div>
        {done === total && (
          <button onClick={onDismiss} className="p-1 rounded-sm hover:bg-black/[0.04] shrink-0" style={{ color: "#5F5145" }}>
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

function SectionInfoBar({ description }: { description: string }) {
  const t = useT();
  const [expanded, setExpanded] = useState(false);
  if (!description) return null;
  return (
    <div className="mx-5 mt-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 text-[10px] py-2 px-3 rounded-sm transition-colors"
        style={{ backgroundColor: "#FFFBF4", color: "#5F5145", border: "1px solid #E5D7C3" }}
      >
        <Info size={12} style={{ color: "#C9973F" }} />
        <span className="flex-1 text-left">{t("section.howItWorks")}</span>
        <ChevronRight size={10} style={{ transform: expanded ? "rotate(90deg)" : undefined, transition: "transform 0.15s" }} />
      </button>
      {expanded && (
        <div className="px-3 pb-3 pt-2 rounded-sm" style={{ backgroundColor: "rgba(216,169,91,0.02)" }}>
          <p className="text-[11px] leading-relaxed" style={{ color: "#5F5145" }}>{description}</p>
        </div>
      )}
    </div>
  );
}

// ═══ 1. AI Sales Engine ═════════════════════════════════

function SalesEngineSection() {
  const t = useT();
  const [conversations] = useState<AIConversation[]>(mockConversations);
  const [selectedId, setSelectedId] = useState<string | null>(
    () => conversations.length > 0 ? conversations[0].id : null,
  );
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());
  const [editedDrafts, setEditedDrafts] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return conversations;
    const q = search.toLowerCase();
    return conversations.filter(
      (c) => c.fanName.toLowerCase().includes(q) || c.lastMessagePreview.toLowerCase().includes(q),
    );
  }, [conversations, search]);

  const selectedConv = useMemo(
    () => conversations.find((c) => c.id === selectedId) || null,
    [conversations, selectedId],
  );

  const handleGenerate = useCallback((convId: string) => {
    setGeneratingId(convId);
    setTimeout(() => setGeneratingId(null), 1200);
  }, []);

  const handleApproveDraft = useCallback((draftId: string) => {
    setApprovedIds((prev) => new Set(prev).add(draftId));
    setRejectedIds((prev) => { const next = new Set(prev); next.delete(draftId); return next; });
  }, []);

  const handleRejectDraft = useCallback((draftId: string) => {
    setRejectedIds((prev) => new Set(prev).add(draftId));
    setApprovedIds((prev) => { const next = new Set(prev); next.delete(draftId); return next; });
  }, []);

  const handleEditDraft = useCallback((draftId: string, currentText: string) => {
    setEditingId(draftId);
    setEditedDrafts((prev) => ({ ...prev, [draftId]: prev[draftId] || currentText }));
  }, []);

  const handleSaveEdit = useCallback((draftId: string) => {
    setEditingId(null);
    setApprovedIds((prev) => new Set(prev).add(draftId));
  }, []);

  const handleCancelEdit = useCallback((draftId: string) => {
    setEditingId(null);
    setEditedDrafts((prev) => { const next = { ...prev }; delete next[draftId]; return next; });
  }, []);

  return (
    <div className="flex h-full">
      {/* Conv list */}
      <div className="w-[300px] shrink-0 border-r flex flex-col" style={{ borderColor: "#E5D7C3", backgroundColor: "#FFFBF4" }}>
        <div className="p-4 border-b shrink-0" style={{ borderColor: "#E5D7C3" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[20px] font-semibold font-display" style={{ color: "#17120C" }}>Sales Engine</h2>
            <span className="text-[13px] font-medium px-2 py-0.5 rounded-sm" style={{ backgroundColor: "#F2EDE4", color: "#5F5145" }}>
              {conversations.length}
            </span>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#5F5145" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("salesEngine.searchPlaceholder")}
              className="w-full pl-8 pr-3 py-2 text-[14px] rounded-sm outline-none"
              style={{ color: "#17120C", backgroundColor: "#F6F1E8", border: "1px solid #E5D7C3" }}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedId(conv.id)}
              className="w-full text-left px-4 py-3 transition-colors border-b"
              style={{
                backgroundColor: selectedId === conv.id ? "#F6F1E8" : "transparent",
                borderLeft: selectedId === conv.id ? "3px solid #C9973F" : "3px solid transparent",
                borderColor: selectedId === conv.id ? "#E5D7C3" : "#F2EDE4",
              }}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className="w-9 h-9 rounded-sm flex items-center justify-center font-semibold shrink-0"
                  style={{ backgroundColor: `${FAN_TIER_COLORS[conv.fanTier]}18`, color: FAN_TIER_COLORS[conv.fanTier], border: "1px solid #E5D7C3" }}
                >
                  {conv.fanName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[14px] font-semibold truncate" style={{ color: "#17120C" }}>{conv.fanName}</span>
                    <span className="text-[11px] shrink-0" style={{ color: "#5F5145" }}>{formatRelative(conv.lastActivity)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] px-1.5 py-0.5 rounded-sm font-medium" style={{ backgroundColor: `${FAN_TIER_COLORS[conv.fanTier]}18`, color: FAN_TIER_COLORS[conv.fanTier] }}>
                      {t(FAN_TIER_KEY[conv.fanTier] || conv.fanTier)}
                    </span>
                    <span className="text-[11px]" style={{ color: "#5F5145" }}>{t(`platform.${conv.platform}`)}</span>
                  </div>
                  <p className="text-[13px] mt-1.5 leading-relaxed line-clamp-1" style={{ color: "#5F5145" }}>
                    {conv.lastMessagePreview}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {conv.complianceFlags.length > 0 && (
                      <span className="flex items-center gap-0.5 text-[10px] font-medium" style={{ color: "#B7791F" }}>
                        <AlertTriangle size={10} /> {conv.complianceFlags.length}
                      </span>
                    )}
                    <span
                      className="text-[11px] px-2 py-0.5 rounded-sm font-medium"
                      style={{ backgroundColor: `${STATUS_COLORS[conv.status]}18`, color: STATUS_COLORS[conv.status] }}
                    >
                      {t(STATUS_KEY[conv.status] || conv.status)}
                    </span>
                    {conv.unread && (
                      <span className="w-2 h-2 rounded-full ml-auto" style={{ backgroundColor: "#C9973F" }} />
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Center: Messages + Drafts */}
      <div className="flex-1 flex flex-col min-w-0">
        {!selectedConv ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <MessageCircle size={32} style={{ color: "#EBE3D7" }} />
            <p className="text-sm mt-3 font-medium" style={{ color: "#5F5145" }}>{t("salesEngine.empty")}</p>
            <p className="text-xs mt-1" style={{ color: "#D9CCBB" }}>L&apos;IA te proposera des suggestions de réponse</p>
          </div>
        ) : (
          <>
            {/* Conversation Header */}
            <div className="flex items-center gap-3 px-5 py-3 border-b shrink-0" style={{ borderColor: "#E5D7C3", backgroundColor: "#FFFBF4" }}>
              <div className="w-10 h-10 rounded-sm flex items-center justify-center font-semibold shrink-0" style={{ backgroundColor: `${FAN_TIER_COLORS[selectedConv.fanTier]}18`, color: FAN_TIER_COLORS[selectedConv.fanTier], border: "1px solid #E5D7C3" }}>
                {selectedConv.fanName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[16px] font-semibold truncate" style={{ color: "#17120C" }}>{selectedConv.fanName}</span>
                  <span className="text-[12px] px-2 py-0.5 rounded-sm font-medium" style={{ backgroundColor: `${FAN_TIER_COLORS[selectedConv.fanTier]}18`, color: FAN_TIER_COLORS[selectedConv.fanTier] }}>
                    {t(FAN_TIER_KEY[selectedConv.fanTier] || selectedConv.fanTier)}
                  </span>
                </div>
                <span className="text-[13px]" style={{ color: "#5F5145" }}>
                  {t(`platform.${selectedConv.platform}`)} · {formatEuro(selectedConv.totalSpent)} {t("salesEngine.spent")} · {t("salesEngine.score")} {selectedConv.intentScore}/100
                </span>
              </div>
              {selectedConv.complianceFlags.length > 0 && (
                <span className="flex items-center gap-1 text-[12px] px-2 py-1 rounded-sm" style={{ backgroundColor: "rgba(183,121,31,0.08)", color: "#B7791F" }}>
                  <AlertTriangle size={12} /> {selectedConv.complianceFlags.join(", ")}
                </span>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3" style={{ backgroundColor: "#F6F1E8" }}>
              {selectedConv.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.direction === "inbound" ? "justify-start" : "justify-end"}`}>
                  <div
                    className="max-w-[70%] rounded-sm px-4 py-3"
                    style={{
                      backgroundColor: msg.direction === "inbound" ? "#FFFFFF" : "rgba(201,151,63,0.12)",
                      border: msg.direction === "inbound" ? "1px solid #E5D7C3" : "1px solid rgba(201,151,63,0.15)",
                      borderBottomLeftRadius: msg.direction === "inbound" ? 0 : undefined,
                      borderBottomRightRadius: msg.direction === "outbound" ? 0 : undefined,
                      boxShadow: "0 1px 2px rgba(23,18,12,0.03)",
                    }}
                  >
                    <p className="text-[14px] leading-relaxed break-words" style={{ color: "#17120C" }}>{msg.content}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[11px]" style={{ color: "#5F5145" }}>
                        {new Date(msg.occurredAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {msg.aiGenerated && (
                        <span className="text-[13px] px-1.5 py-0.5 rounded-sm font-medium" style={{ backgroundColor: "rgba(201,151,63,0.12)", color: "#C9973F" }}>IA</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* AI Drafts Section */}
              {selectedConv.drafts.length > 0 && (
                <div className="space-y-2.5 mt-6 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1" style={{ backgroundColor: "#E5D7C3" }} />
                    <span className="text-[13px] font-semibold flex items-center gap-1.5" style={{ color: "#C9973F" }}>
                      <Zap size={13} /> {t("salesEngine.aiDrafts")} · {selectedConv.drafts.length} suggestions
                    </span>
                    <div className="h-px flex-1" style={{ backgroundColor: "#E5D7C3" }} />
                  </div>
                  {selectedConv.drafts.map((draft) => (
                    <DraftCard
                      key={draft.id}
                      draft={draft}
                      isGenerating={generatingId === selectedConv.id}
                      isApproved={approvedIds.has(draft.id)}
                      isRejected={rejectedIds.has(draft.id)}
                      isEditing={editingId === draft.id}
                      editText={editedDrafts[draft.id] || ""}
                      onApprove={() => handleApproveDraft(draft.id)}
                      onReject={() => handleRejectDraft(draft.id)}
                      onEdit={() => handleEditDraft(draft.id, draft.draftText)}
                      onSaveEdit={() => handleSaveEdit(draft.id)}
                      onCancelEdit={() => handleCancelEdit(draft.id)}
                      onEditTextChange={(t) => setEditedDrafts((prev) => ({ ...prev, [draft.id]: t }))}
                    />
                  ))}
                </div>
              )}

              {generatingId === selectedConv.id && (
                <div className="flex justify-center py-4">
                  <Loader size={16} className="animate-spin" style={{ color: "#C9973F" }} />
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="px-5 py-3 border-t shrink-0" style={{ borderColor: "#E5D7C3", backgroundColor: "#FFFBF4" }}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleGenerate(selectedConv.id)}
                  disabled={generatingId === selectedConv.id || selectedConv.drafts.length === 0}
                  className="flex items-center gap-2 text-[14px] px-4 py-2.5 rounded-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#C9973F", color: "#FFFFFF" }}
                >
                  {generatingId === selectedConv.id ? (
                    <><Loader size={15} className="animate-spin" /> {t("salesEngine.aiGenerating")}</>
                  ) : (
                    <><Zap size={15} /> {t("salesEngine.regenerate")}</>
                  )}
                </button>
                <span className="text-[12px]" style={{ color: "#5F5145" }}>
                  IA propose → tu relis → tu valides → envoi humain
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DraftCard({
  draft, isGenerating, isApproved, isRejected, isEditing,
  editText, onApprove, onReject, onEdit, onSaveEdit, onCancelEdit, onEditTextChange,
}: {
  draft: AIDraft;
  isGenerating: boolean;
  isApproved: boolean;
  isRejected: boolean;
  isEditing: boolean;
  editText: string;
  onApprove: () => void;
  onReject: () => void;
  onEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditTextChange: (text: string) => void;
}) {
  const t = useT();
  const approachColors: Record<string, string> = {
    chaleureuse: "#2F7D4E",
    directe: "#C9973F",
    joueuse: "#B45309",
    professionnelle: "#1D4ED8",
    complice: "#6D28D9",
  };

  if (isApproved) {
    return (
      <div className="p-3 rounded-sm border" style={{ backgroundColor: "#E8F2EA", borderColor: "rgba(47,125,78,0.15)", boxShadow: "0 1px 2px rgba(23,18,12,0.02)" }}>
        <div className="flex items-center gap-2">
          <CheckCircle size={14} style={{ color: "#2F7D4E" }} />
          <span className="text-[13px] font-semibold" style={{ color: "#2F7D4E" }}>{t("compliance.statusApproved")} — {t("salesEngine.readyToSend")}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-4 rounded-sm border transition-all"
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: isRejected ? "#E0D5C5" : "rgba(201,151,63,0.2)",
        boxShadow: isRejected ? "none" : "0 1px 3px rgba(23,18,12,0.04)",
        opacity: isRejected ? 0.4 : 1,
      }}
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span
            className="text-[12px] font-semibold px-2 py-0.5 rounded-sm capitalize"
            style={{ backgroundColor: `${approachColors[draft.approach] || "#EAE2D7"}20`, color: approachColors[draft.approach] || "#5F5145" }}
          >
            {draft.approach}
          </span>
          <span className="text-[12px] flex items-center gap-1 font-medium" style={{ color: "#5F5145" }}>
            <TrendingUp size={12} /> {draft.estimatedEngagement}% engagement est.
          </span>
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={editText}
          onChange={(e) => onEditTextChange(e.target.value)}
          className="w-full bg-transparent text-[14px] leading-relaxed rounded-sm p-2 outline-none resize-none"
          style={{ color: "#17120C", border: "1px solid rgba(201,151,63,0.3)", minHeight: "80px", backgroundColor: "#FFFBF4" }}
          rows={3}
        />
      ) : (
        <p className="text-[14px] leading-relaxed" style={{ color: "#17120C" }}>{draft.draftText}</p>
      )}

      {draft.aiWarning && (
        <p className="text-[12px] mt-2 flex items-center gap-1 font-medium" style={{ color: "#B7791F" }}>
          <AlertTriangle size={12} /> {draft.aiWarning}
        </p>
      )}

      <div className="flex items-center gap-2 mt-3 pt-3 border-t" style={{ borderColor: "#E5D7C3" }}>
        {isEditing ? (
          <>
            <button onClick={onSaveEdit} className="flex items-center gap-1.5 text-[13px] px-3 py-1.5 rounded-sm font-semibold" style={{ backgroundColor: "#2F7D4E", color: "#FFFFFF" }}>
              <CheckCircle size={13} /> Sauver
            </button>
            <button onClick={onCancelEdit} className="text-[13px] px-3 py-1.5 font-medium" style={{ color: "#5F5145" }}>
              Annuler
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onApprove}
              disabled={isGenerating}
              className="flex items-center gap-1.5 text-[13px] px-3 py-1.5 rounded-sm font-semibold transition-colors"
              style={{ backgroundColor: "#2F7D4E", color: "#FFFFFF" }}
            >
              <CheckCircle size={13} /> {t("salesEngine.approve")}
            </button>
            <button
              onClick={onEdit}
              disabled={isGenerating}
              className="flex items-center gap-1.5 text-[13px] px-3 py-1.5 rounded-sm font-medium transition-colors"
              style={{ backgroundColor: "rgba(29,77,216,0.08)", color: "#1D4ED8" }}
            >
              <Edit3 size={13} /> Modifier
            </button>
            <button
              onClick={onReject}
              disabled={isGenerating}
              className="flex items-center gap-1.5 text-[13px] px-3 py-1.5 rounded-sm font-medium transition-colors"
              style={{ color: "#5F5145" }}
            >
              <X size={13} /> Refuser
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ═══ 2. Pricing Lab ════════════════════════════════════

function PricingLabSection() {
  const t = useT();
  const [selectedProduct, setSelectedProduct] = useState<PricingScenario>(mockPricingScenarios[0]);
  const [price, setPrice] = useState(selectedProduct.suggestedPriceMid);
  const [priceLevel, setPriceLevel] = useState<"low" | "mid" | "high">("mid");

  const platformFeeAmount = price * selectedProduct.platformFee;
  const netRevenue = price - platformFeeAmount - selectedProduct.costBase;
  const margin = (netRevenue / price) * 100;

  const conversions = priceLevel === "low" ? selectedProduct.estimatedConversions.low
    : priceLevel === "mid" ? selectedProduct.estimatedConversions.mid
    : selectedProduct.estimatedConversions.high;

  const totalRevenue = price * conversions;
  const totalNet = netRevenue * conversions;

  const handleProductChange = (id: string) => {
    const p = mockPricingScenarios.find((x) => x.id === id);
    if (p) { setSelectedProduct(p); setPrice(p.suggestedPriceMid); setPriceLevel("mid"); }
  };

  const currentTier = [...selectedProduct.commissionTiers].reverse().find((t) => totalRevenue >= t.threshold) || selectedProduct.commissionTiers[0];

  return (
    <div className="p-5 space-y-5">
      <div>
        <h2 className="text-[20px] font-display font-semibold" style={{ color: "#17120C" }}>{t("pricing.heading")}</h2>
          <SectionInfoBar description={t("sectionDesc.pricingLab")} />
        <p className="text-[14px] mt-1.5" style={{ color: "#5F5145" }}>{t("pricing.subtitle")}</p>
      </div>

      {/* Product selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {mockPricingScenarios.map((p) => (
          <button
            key={p.id}
            onClick={() => handleProductChange(p.id)}
            className="text-left p-3 rounded-sm border transition-all"
            style={{
              backgroundColor: selectedProduct.id === p.id ? "rgba(216,169,91,0.06)" : "#FFFFFF",
              borderColor: selectedProduct.id === p.id ? "#C9973F" : "#E5D7C3",
            }}
          >
            <span className="text-[11px] font-medium block" style={{ color: "#17120C" }}>{p.productName}</span>
            <span className="text-[12px] mt-1 block" style={{ color: "#5F5145" }}>{p.type.replace(/_/g, " ")} · {p.audienceSize} fans</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Price slider */}
        <div className="col-span-2 space-y-4 p-5 rounded-sm border" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5D7C3", boxShadow: "0 1px 3px rgba(23,18,12,0.04)" }}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium" style={{ color: "#17120C" }}>{t("pricing.salesPrice")}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setPrice(selectedProduct.suggestedPriceLow); setPriceLevel("low"); }}
                className={`text-[10px] px-2 py-1 rounded-sm ${priceLevel === "low" ? "" : ""}`}
                style={{ backgroundColor: priceLevel === "low" ? "rgba(29,77,216,0.15)" : "#EBE3D7", color: priceLevel === "low" ? "#1D4ED8" : "#6E6257" }}
              >Bas</button>
              <button
                onClick={() => { setPrice(selectedProduct.suggestedPriceMid); setPriceLevel("mid"); }}
                className={`text-[10px] px-2 py-1 rounded-sm`}
                style={{ backgroundColor: priceLevel === "mid" ? "rgba(216,169,91,0.15)" : "#EBE3D7", color: priceLevel === "mid" ? "#C9973F" : "#6E6257" }}
              >Moyen</button>
              <button
                onClick={() => { setPrice(selectedProduct.suggestedPriceHigh); setPriceLevel("high"); }}
                className={`text-[10px] px-2 py-1 rounded-sm`}
                style={{ backgroundColor: priceLevel === "high" ? "rgba(47,125,78,0.15)" : "#EBE3D7", color: priceLevel === "high" ? "#2F7D4E" : "#6E6257" }}
              >Haut</button>
            </div>
          </div>

          <input
            type="range"
            min={selectedProduct.suggestedPriceLow}
            max={selectedProduct.suggestedPriceHigh}
            step={0.01}
            value={price}
            onChange={(e) => { setPrice(Number(e.target.value)); setPriceLevel("mid"); }}
            className="w-full accent-[#C9973F]"
          />

          <div className="flex items-center justify-between text-[11px]">
            <span style={{ color: "#5F5145" }}>{formatEuro(selectedProduct.suggestedPriceLow)}</span>
            <span className="text-lg font-semibold font-mono" style={{ color: "#C9973F" }}>{formatEuro(price)}</span>
            <span style={{ color: "#5F5145" }}>{formatEuro(selectedProduct.suggestedPriceHigh)}</span>
          </div>

          {/* Revenue breakdown */}
          <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t" style={{ borderColor: "#E5D7C3" }}>
            <div className="text-center">
              <p className="text-[12px]" style={{ color: "#5F5145" }}>{t("pricing.platformFees")}</p>
              <p className="text-sm font-mono font-semibold mt-0.5" style={{ color: "#17120C" }}>{formatEuro(platformFeeAmount)}</p>
              <p className="text-[12px]" style={{ color: "#5F5145" }}>{(selectedProduct.platformFee * 100).toFixed(0)}%</p>
            </div>
            <div className="text-center">
              <p className="text-[12px]" style={{ color: "#5F5145" }}>{t("pricing.baseCost")}</p>
              <p className="text-sm font-mono font-semibold mt-0.5" style={{ color: "#17120C" }}>{formatEuro(selectedProduct.costBase)}</p>
            </div>
            <div className="text-center">
              <p className="text-[12px]" style={{ color: "#5F5145" }}>{t("pricing.netPerSale")}</p>
              <p className="text-sm font-mono font-semibold mt-0.5" style={{ color: "#2F7D4E" }}>{formatEuro(netRevenue)}</p>
              <p className="text-[12px]" style={{ color: "#5F5145" }}>{margin.toFixed(0)}{t("pricing.marginPct")}</p>
            </div>
            <div className="text-center">
              <p className="text-[12px]" style={{ color: "#5F5145" }}>{t("pricing.estimatedSales")}</p>
              <p className="text-sm font-mono font-semibold mt-0.5" style={{ color: "#17120C" }}>{conversions}</p>
              <p className="text-[12px]" style={{ color: "#5F5145" }}>{((conversions / selectedProduct.audienceSize) * 100).toFixed(1)}% de l&apos;audience</p>
            </div>
          </div>
        </div>

        {/* Commission tiers + totals */}
        <div className="space-y-4">
          <div className="p-5 rounded-sm border" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5D7C3", boxShadow: "0 1px 3px rgba(23,18,12,0.04)" }}>
            <h3 className="text-[11px] font-medium mb-3" style={{ color: "#17120C" }}>{t("pricing.commissionTiers")}</h3>
            <div className="space-y-2">
              {selectedProduct.commissionTiers.map((tier) => {
                const isActive = totalRevenue >= tier.threshold;
                return (
                  <div key={tier.label} className="flex items-center justify-between text-[11px] py-1.5 px-2 rounded-sm"
                    style={{ backgroundColor: isActive ? "rgba(216,169,91,0.06)" : "transparent" }}>
                    <span style={{ color: isActive ? "#17120C" : "#6E6257" }}>{t(`commission.${tier.label.toLowerCase()}`)}</span>
                    <span style={{ color: isActive ? "#C9973F" : "#6E6257" }}>{(tier.rate * 100).toFixed(0)}% · &gt;{formatEuro(tier.threshold)}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t" style={{ borderColor: "#E5D7C3" }}>
              <div className="flex items-center justify-between">
                <span className="text-[13px]" style={{ color: "#5F5145" }}>{t("pricing.currentTier")}</span>
                <span className="text-[11px] font-semibold" style={{ color: "#C9973F" }}>{t(`commission.${currentTier.label.toLowerCase()}`)} ({(currentTier.rate * 100).toFixed(0)}%)</span>
              </div>
            </div>
          </div>

          {/* Totals */}
          <div className="p-5 rounded-sm border" style={{ backgroundColor: "rgba(47,125,78,0.04)", borderColor: "rgba(47,125,78,0.1)" }}>
            <p className="text-[13px]" style={{ color: "#5F5145" }}>{t("pricing.grossRevenue")}</p>
            <p className="text-xl font-mono font-semibold mt-0.5" style={{ color: "#17120C" }}>{formatEuro(totalRevenue)}</p>
            <p className="text-[13px] mt-2" style={{ color: "#5F5145" }}>{t("pricing.netRevenue")}</p>
            <p className="text-xl font-mono font-semibold mt-0.5" style={{ color: "#2F7D4E" }}>{formatEuro(totalNet)}</p>
            <p className="text-[12px] mt-2" style={{ color: "#5F5145" }}>
              {conversions} ventes × {formatEuro(netRevenue)} net = {formatEuro(totalNet)}
            </p>
          </div>
        </div>
      </div>

      {/* Negotiation Confidence Panel */}
      <div className="grid grid-cols-4 gap-3">
        <div className="col-span-3 p-4 rounded-sm border" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5D7C3", boxShadow: "0 1px 3px rgba(23,18,12,0.04)" }}>
          <h3 className="text-[13px] font-medium tracking-wider uppercase mb-3" style={{ color: "#8A7E72" }}>{t("pricing.negotiationEngine")}</h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-[12px]" style={{ color: "#5F5145" }}>{t("pricing.floorPrice")}</p>
              <p className="text-sm font-mono font-semibold mt-0.5" style={{ color: "#C54A3A" }}>{formatEuro(selectedProduct.suggestedPriceLow)}</p>
              <p className="text-[11px] mt-0.5" style={{ color: "#5F5145" }}>{t("pricing.minViable")}</p>
            </div>
            <div>
              <p className="text-[12px]" style={{ color: "#5F5145" }}>{t("pricing.optimalPrice")}</p>
              <p className="text-sm font-mono font-semibold mt-0.5" style={{ color: "#C9973F" }}>{formatEuro(selectedProduct.suggestedPriceMid)}</p>
              <p className="text-[11px] mt-0.5" style={{ color: "#5F5145" }}>{t("pricing.maxConversion")}</p>
            </div>
            <div>
              <p className="text-[12px]" style={{ color: "#5F5145" }}>{t("pricing.negoMargin")}</p>
              <p className="text-sm font-mono font-semibold mt-0.5" style={{ color: "#2F7D4E" }}>{formatEuro(selectedProduct.suggestedPriceHigh - selectedProduct.suggestedPriceLow)}</p>
              <p className="text-[11px] mt-0.5" style={{ color: "#5F5145" }}>{((1 - selectedProduct.suggestedPriceLow / selectedProduct.suggestedPriceHigh) * 100).toFixed(0)}{t("pricing.flexPct")}</p>
            </div>
            <div>
              <p className="text-[12px]" style={{ color: "#5F5145" }}>{t("pricing.confidence")}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-sm font-mono font-semibold" style={{ color: price >= selectedProduct.suggestedPriceMid ? "#2F7D4E" : "#B7791F" }}>
                  {price >= selectedProduct.suggestedPriceMid ? t("pricing.confidenceHigh") : t("pricing.confidenceModerate")}
                </span>
              </div>
              <div className="w-full h-1 rounded-full mt-1" style={{ backgroundColor: "#D9CCBB" }}>
                <div className="h-full rounded-full" style={{
                  width: `${Math.min(100, ((price - selectedProduct.suggestedPriceLow) / (selectedProduct.suggestedPriceHigh - selectedProduct.suggestedPriceLow)) * 100)}%`,
                  backgroundColor: price >= selectedProduct.suggestedPriceMid ? "#2F7D4E" : "#B7791F",
                }} />
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-sm border flex flex-col justify-center" style={{ backgroundColor: "rgba(216,169,91,0.04)", borderColor: "rgba(216,169,91,0.1)" }}>
          <p className="text-[12px] mb-1" style={{ color: "#5F5145" }}>{t("pricing.aiRecommendation")}</p>
          <p className="text-[11px] font-medium leading-relaxed" style={{ color: "#C9973F" }}>
            {price >= selectedProduct.suggestedPriceMid
              ? `${t("pricing.optimalPrice")}. ${t("pricing.optimalPriceReason")}`
              : t("pricing.lowerPriceWarning")}
          </p>
          <p className="text-[12px] mt-2" style={{ color: "#8A7E72" }}>Basé sur {selectedProduct.audienceSize} fans</p>
        </div>
      </div>
    </div>
  );
}

// ═══ 3. Dynamic Lists Builder ═══════════════════════════

function ListsBuilderSection() {
  const t = useT();
  const [savedSegments] = useState<SavedSegment[]>(mockSavedSegments);
  const [activeFilters, setActiveFilters] = useState<FanFilter[]>([]);
  const [newFilterField, setNewFilterField] = useState("");
  const [newFilterOp, setNewFilterOp] = useState("");
  const [newFilterValue, setNewFilterValue] = useState("");
  const [estimatedFans, setEstimatedFans] = useState(0);

  const addFilter = () => {
    if (!newFilterField || !newFilterOp || !newFilterValue) return;
    const field = AVAILABLE_FILTER_FIELDS.find((f) => f.field === newFilterField);
    if (!field) return;
    const filter: FanFilter = {
      id: `f-${Date.now()}`,
      field: field.field,
      operator: newFilterOp as FanFilter["operator"],
      value: newFilterValue,
    };
    setActiveFilters((prev) => [...prev, filter]);
    setNewFilterField(""); setNewFilterOp(""); setNewFilterValue("");
    setEstimatedFans(Math.floor(Math.random() * 500) + 20);
  };

  const removeFilter = (id: string) => {
    setActiveFilters((prev) => prev.filter((f) => f.id !== id));
    setEstimatedFans((prev) => Math.max(0, prev - Math.floor(Math.random() * 100)));
  };

  const currentField = AVAILABLE_FILTER_FIELDS.find((f) => f.field === newFilterField);

  return (
    <div className="p-5 space-y-5">
      <div>
        <h2 className="text-[20px] font-display font-semibold" style={{ color: "#17120C" }}>{t("lists.heading")}</h2>
        <SectionInfoBar description={t("sectionDesc.listsBuilder")} />
        <p className="text-[14px] mt-1.5" style={{ color: "#5F5145" }}>{t("lists.subtitle")}</p>
      </div>

      {/* Filter builder */}
      <div className="p-4 rounded-sm border space-y-3" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5D7C3", boxShadow: "0 1px 3px rgba(23,18,12,0.04)" }}>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={newFilterField}
            onChange={(e) => { setNewFilterField(e.target.value); setNewFilterOp(""); }}
            className="text-[14px] px-3 py-2 rounded-sm outline-none"
            style={{ backgroundColor: "#EBE3D7", color: newFilterField ? "#17120C" : "#6E6257", border: "1px solid #D9CCBB" }}
          >
            <option value="">{t("lists.fieldPlaceholder")}</option>
            {AVAILABLE_FILTER_FIELDS.map((f) => (
              <option key={f.field} value={f.field}>{f.label}</option>
            ))}
          </select>

          {currentField && (
            <select
              value={newFilterOp}
              onChange={(e) => setNewFilterOp(e.target.value)}
              className="text-[14px] px-3 py-2 rounded-sm outline-none"
              style={{ backgroundColor: "#EBE3D7", color: newFilterOp ? "#17120C" : "#6E6257", border: "1px solid #D9CCBB" }}
            >
              <option value="">{t("lists.operatorPlaceholder")}</option>
              {currentField.operators.map((op) => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          )}

          <input
            value={newFilterValue}
            onChange={(e) => setNewFilterValue(e.target.value)}
            placeholder={currentField?.hint || t("lists.valuePlaceholder")}
            className="flex-1 min-w-[120px] text-[11px] px-2.5 py-1.5 rounded-sm outline-none bg-transparent"
            style={{ color: "#17120C", border: "1px solid #D9CCBB" }}
            onKeyDown={(e) => { if (e.key === "Enter") addFilter(); }}
          />

          <button
            onClick={addFilter}
            disabled={!newFilterField || !newFilterOp || !newFilterValue}
            className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-sm transition-all disabled:opacity-30"
            style={{ backgroundColor: "#C9973F", color: "#FFFFFF" }}
          >
            <Plus size={12} /> Ajouter
          </button>
        </div>

        {/* Active filters */}
        {activeFilters.length > 0 && (
          <>
            <div className="flex flex-wrap gap-1.5">
              {activeFilters.map((f) => {
                const fieldLabel = AVAILABLE_FILTER_FIELDS.find((af) => af.field === f.field)?.label || f.field;
                return (
                  <span key={f.id} className="flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-sm"
                    style={{ backgroundColor: "rgba(216,169,91,0.08)", color: "#C9973F" }}>
                    {fieldLabel} {f.operator} {f.value}
                    <button onClick={() => removeFilter(f.id)} style={{ color: "#5F5145" }}><X size={10} /></button>
                  </span>
                );
              })}
            </div>
            <div className="flex items-center gap-4 pt-2 border-t" style={{ borderColor: "#E5D7C3" }}>
              <span className="text-[11px]" style={{ color: "#5F5145" }}>
                {t("lists.estimatedFans")} <span className="font-semibold font-mono" style={{ color: "#17120C" }}>{estimatedFans}</span>
              </span>
              <span className="text-[11px]" style={{ color: "#5F5145" }}>
                {t("lists.potentialRevenue")} <span className="font-semibold font-mono" style={{ color: "#C9973F" }}>{formatEuro(estimatedFans * 45)}</span>
              </span>
              <button className="text-[13px] px-2.5 py-1 rounded-sm ml-auto" style={{ backgroundColor: "#C9973F", color: "#FFFFFF", fontWeight: 600 }}>
                {t("lists.saveSegment")}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Saved segments */}
      <div>
        <h3 className="text-[11px] font-medium mb-3" style={{ color: "#5F5145" }}>{t("lists.savedSegments")}</h3>
        <div className="grid grid-cols-2 gap-3">
          {savedSegments.map((seg) => (
            <div key={seg.id} className="p-4 rounded-sm border" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5D7C3", boxShadow: "0 1px 3px rgba(23,18,12,0.04)" }}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[12px] font-medium" style={{ color: "#17120C" }}>{seg.name}</h4>
                <span className="text-[11px] font-mono font-semibold" style={{ color: "#C9973F" }}>{seg.fanCount}</span>
              </div>
              <p className="text-[13px] mb-2" style={{ color: "#5F5145" }}>{seg.description}</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {seg.filters.slice(0, 3).map((f, i) => (
                  <span key={i} className="text-[12px] px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: "#EBE3D7", color: "#5F5145" }}>
                    {f.field} {f.operator} {f.value}
                  </span>
                ))}
                {seg.filters.length > 3 && (
                  <span className="text-[12px]" style={{ color: "#5F5145" }}>+{seg.filters.length - 3}</span>
                )}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: "#E5D7C3" }}>
                <span className="text-[12px]" style={{ color: "#5F5145" }}>{formatEuro(seg.estimatedRevenue)} potentiel</span>
                <span className="text-[12px]" style={{ color: "#5F5145" }}>Créé {formatRelative(seg.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══ 4. Automation Triggers ═════════════════════════════

function AutomationTriggersSection() {
  const t = useT();
  const [rules, setRules] = useState<AutomationRule[]>(mockAutomationRules);

  const toggleRule = (id: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, isEnabled: !r.isEnabled } : r)));
  };

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-display font-semibold" style={{ color: "#17120C" }}>{t("automation.heading")}</h2>
          <SectionInfoBar description={t("sectionDesc.automationTriggers")} />
          <p className="text-[14px] mt-1.5" style={{ color: "#5F5145" }}>{t("automation.subtitle")}</p>
        </div>
        <button className="flex items-center gap-1.5 text-[11px] px-3 py-2 rounded-sm" style={{ backgroundColor: "#C9973F", color: "#FFFFFF", fontWeight: 600 }}>
          <Plus size={12} /> {t("automation.newRule")}
        </button>
      </div>

      <div className="rounded-sm border overflow-hidden" style={{ borderColor: "#E5D7C3" }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid #E5D7C3" }}>
              <th className="text-left text-[10px] font-medium px-4 py-2.5" style={{ color: "#5F5145" }}>{t("automation.rule")}</th>
              <th className="text-left text-[10px] font-medium px-4 py-2.5" style={{ color: "#5F5145" }}>{t("automation.when")}</th>
              <th className="text-left text-[10px] font-medium px-4 py-2.5" style={{ color: "#5F5145" }}>{t("automation.if")}</th>
              <th className="text-left text-[10px] font-medium px-4 py-2.5" style={{ color: "#5F5145" }}>{t("automation.then")}</th>
              <th className="text-left text-[10px] font-medium px-4 py-2.5" style={{ color: "#5F5145" }}>{t("automation.status")}</th>
              <th className="text-right text-[10px] font-medium px-4 py-2.5" style={{ color: "#5F5145" }}>{t("automation.triggered")}</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.id} className="transition-colors hover:bg-black/[0.02]" style={{ borderBottom: "1px solid #EBE3D7" }}>
                <td className="px-4 py-3">
                  <span className="text-[12px] font-medium" style={{ color: "#17120C" }}>{rule.name}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[11px] font-mono" style={{ color: "#5F5145" }}>{t(TRIGGER_EVENT_KEY[rule.when] || rule.when)}</span>
                </td>
                <td className="px-4 py-3">
                  <code className="text-[13px] px-1.5 py-0.5 rounded-sm font-mono" style={{ backgroundColor: "#EBE3D7", color: "#5F5145" }}>{rule.condition}</code>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[11px]" style={{ color: "#C9973F" }}>{t(TRIGGER_ACTION_KEY[rule.then] || rule.then)}</span>
                  <p className="text-[12px] mt-0.5" style={{ color: "#5F5145" }}>{rule.thenDetail}</p>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className="w-9 h-5 rounded-full transition-colors relative"
                    style={{ backgroundColor: rule.isEnabled ? "#C9973F" : "#B8ADA0" }}
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full absolute top-[3px] transition-all"
                      style={{ backgroundColor: "#fff", left: rule.isEnabled ? "18px" : "3px" }}
                    />
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-[11px] font-mono" style={{ color: "#5F5145" }}>{rule.triggeredCount}</span>
                  {rule.lastTriggered && (
                    <p className="text-[12px]" style={{ color: "#5F5145" }}>{formatRelative(rule.lastTriggered)}</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══ 5. Tracking Links / Attribution ════════════════════

function TrackingLinksSection() {
  const t = useT();
  const [links] = useState<TrackingLink[]>(mockTrackingLinks);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const totalClicks = links.reduce((s, l) => s + l.clicks, 0);
  const totalConversions = links.reduce((s, l) => s + l.conversions, 0);
  const totalRevenue = links.reduce((s, l) => s + l.revenue, 0);
  const avgRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100) : 0;

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-5 space-y-5">
      <div>
        <h2 className="text-[20px] font-display font-semibold" style={{ color: "#17120C" }}>{t("tracking.heading")}</h2>
        <SectionInfoBar description={t("sectionDesc.trackingLinks")} />
        <p className="text-[14px] mt-1.5" style={{ color: "#5F5145" }}>{t("tracking.subtitle")}</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: t("tracking.totalClicks"), value: totalClicks.toLocaleString(), color: "#17120C" },
          { label: t("tracking.conversions"), value: totalConversions.toLocaleString(), color: "#2F7D4E" },
          { label: t("tracking.convRate"), value: `${avgRate.toFixed(1)}%`, color: "#C9973F" },
          { label: t("tracking.attributedRevenue"), value: formatEuro(totalRevenue), color: "#2F7D4E" },
        ].map((kpi) => (
          <div key={kpi.label} className="p-4 rounded-sm border" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5D7C3", boxShadow: "0 1px 3px rgba(23,18,12,0.04)" }}>
            <p className="text-[13px]" style={{ color: "#5F5145" }}>{kpi.label}</p>
            <p className="text-lg font-mono font-semibold mt-1" style={{ color: kpi.color }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Links table */}
      <div className="rounded-sm border overflow-hidden" style={{ borderColor: "#E5D7C3" }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid #E5D7C3" }}>
              <th className="text-left text-[10px] font-medium px-4 py-2.5" style={{ color: "#5F5145" }}>Nom</th>
              <th className="text-left text-[10px] font-medium px-4 py-2.5" style={{ color: "#5F5145" }}>Campagne</th>
              <th className="text-left text-[10px] font-medium px-4 py-2.5" style={{ color: "#5F5145" }}>Plateforme</th>
              <th className="text-right text-[10px] font-medium px-4 py-2.5" style={{ color: "#5F5145" }}>Clics</th>
              <th className="text-right text-[10px] font-medium px-4 py-2.5" style={{ color: "#5F5145" }}>Conv.</th>
              <th className="text-right text-[10px] font-medium px-4 py-2.5" style={{ color: "#5F5145" }}>Taux</th>
              <th className="text-right text-[10px] font-medium px-4 py-2.5" style={{ color: "#5F5145" }}>Revenu</th>
              <th className="text-center text-[10px] font-medium px-4 py-2.5" style={{ color: "#5F5145" }}>{t("tracking.copy")}</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.id} className="transition-colors hover:bg-black/[0.02]" style={{ borderBottom: "1px solid #EBE3D7" }}>
                <td className="px-4 py-3">
                  <span className="text-[12px] font-medium" style={{ color: "#17120C" }}>{link.name}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[11px]" style={{ color: "#5F5145" }}>{link.campaign}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[13px] px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: "#EBE3D7", color: "#5F5145" }}>{t(`platform.${link.platform}`)}</span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-[11px]" style={{ color: "#17120C" }}>{link.clicks.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-mono text-[11px]" style={{ color: "#2F7D4E" }}>{link.conversions}</td>
                <td className="px-4 py-3 text-right font-mono text-[11px]" style={{ color: "#C9973F" }}>{link.conversionRate.toFixed(1)}%</td>
                <td className="px-4 py-3 text-right font-mono text-[11px]" style={{ color: "#17120C" }}>{formatEuro(link.revenue)}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleCopy(link.url, link.id)}
                    className="p-1.5 rounded-sm transition-colors"
                    style={{ color: copiedId === link.id ? "#2F7D4E" : "#6E6257" }}
                  >
                    {copiedId === link.id ? <CheckCircle size={12} /> : <Copy size={12} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══ 6. Browser OF / MYM Workspace Mock ═════════════════

function BrowserMockSection() {
  const t = useT();
  const [activeTabId, setActiveTabId] = useState(mockBrowserTabs[0].id);
  const activeTab = mockBrowserTabs.find((t) => t.id === activeTabId) || mockBrowserTabs[0];

  return (
    <div className="p-5 space-y-4 h-full flex flex-col">
      <div>
        <h2 className="text-[20px] font-display font-semibold" style={{ color: "#17120C" }}>{t("browser.heading")}</h2>
        <SectionInfoBar description={t("sectionDesc.browserMock")} />
        <p className="text-[14px] mt-1.5" style={{ color: "#5F5145" }}>{t("browser.subtitle")}</p>
      </div>

      {/* Mock watermark banner */}
      <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-sm"
        style={{ backgroundColor: "rgba(183,121,31,0.08)", border: "1px dashed rgba(183,121,31,0.2)" }}>
        <AlertTriangle size={12} style={{ color: "#B7791F" }} />
        <span className="text-[13px] font-medium" style={{ color: "#B7791F" }}>MOCK — Aucune donnée réelle. Aucune connexion aux plateformes.</span>
      </div>

      {/* Browser chrome */}
      <div className="flex-1 rounded-sm border overflow-hidden flex flex-col" style={{ borderColor: "#E5D7C3" }}>
        {/* Tabs */}
        <div className="flex items-center border-b" style={{ borderColor: "#E5D7C3", backgroundColor: "#F2EDE4" }}>
          {mockBrowserTabs.map((tab) => {
            const isActive = activeTabId === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className="flex items-center gap-1.5 text-[11px] px-4 py-2 transition-colors"
                style={{
                  backgroundColor: isActive ? "#FFFFFF" : "transparent",
                  color: isActive ? "#17120C" : "#6E6257",
                  borderBottom: isActive ? "2px solid #C9973F" : "2px solid transparent",
                }}
              >
                <Globe size={11} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* URL bar */}
        <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: "#E5D7C3", backgroundColor: "#F2EDE4" }}>
          <div className="flex items-center gap-1">
            <button className="p-0.5 opacity-30"><ArrowLeft size={12} style={{ color: "#5F5145" }} /></button>
            <button className="p-0.5 opacity-30"><ArrowRight size={12} style={{ color: "#5F5145" }} /></button>
            <button className="p-0.5"><RefreshCcw size={12} style={{ color: "#5F5145" }} /></button>
          </div>
          <div className="flex-1 flex items-center gap-1.5 px-3 py-1 rounded-sm text-[10px] font-mono" style={{ backgroundColor: "#EBE3D7", color: "#5F5145" }}>
            <Lock size={10} style={{ color: "#2F7D4E" }} />
            {activeTab.url}
          </div>
        </div>

        {/* Mock content */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4">
          {/* Feed posts */}
          <div className="space-y-3">
            <p className="text-[13px] font-medium" style={{ color: "#5F5145" }}>{t("browser.recentPosts")}</p>
            {mockFeedPosts.map((post) => (
              <div key={post.id} className="p-3 rounded-sm border" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5D7C3", boxShadow: "0 1px 3px rgba(23,18,12,0.04)" }}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[11px] font-medium" style={{ color: "#17120C" }}>{post.author}</span>
                  {post.isPpv && (
                    <span className="text-[11px] px-1 py-0.5 rounded-sm" style={{ backgroundColor: "#C9973F", color: "#FFFFFF", fontWeight: 600 }}>PPV {post.ppvPrice ? `$${post.ppvPrice}` : ""}</span>
                  )}
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: "#5F5145" }}>{post.content}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[12px]" style={{ color: "#5F5145" }}>❤ {post.likes}</span>
                  <span className="text-[12px]" style={{ color: "#5F5145" }}>💬 {post.comments}</span>
                  <span className="text-[12px] ml-auto" style={{ color: "#5F5145" }}>{post.timeAgo}</span>
                </div>
              </div>
            ))}
          </div>

          {/* DMs */}
          <div className="space-y-3">
            <p className="text-[13px] font-medium" style={{ color: "#5F5145" }}>{t("browser.directMessages")}</p>
            {mockDMs.map((dm) => (
              <div key={dm.id} className="p-3 rounded-sm border transition-colors"
                style={{
                  backgroundColor: dm.isUnread ? "rgba(216,169,91,0.04)" : "#FFFFFF",
                  borderColor: dm.isUnread ? "rgba(216,169,91,0.15)" : "#E5D7C3",
                }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    {dm.isUnread && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#C9973F" }} />}
                    <span className="text-[11px] font-medium" style={{ color: "#17120C" }}>{dm.from}</span>
                  </div>
                  <span className="text-[12px]" style={{ color: "#5F5145" }}>{dm.timeAgo}</span>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: "#5F5145" }}>{dm.content}</p>
                {dm.hasPPVInterest && (
                  <span className="inline-block text-[8px] px-1.5 py-0.5 rounded-sm mt-1.5" style={{ backgroundColor: "rgba(47,125,78,0.1)", color: "#2F7D4E" }}>
                    {t("browser.ppvInterest")}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══ 7. Campaign Builder ════════════════════════════════

function CampaignBuilderSection() {
  const t = useT();
  const [campaigns] = useState<CampaignBuild[]>(mockCampaigns);
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaigns[0]?.id || null);
  const [currentStep, setCurrentStep] = useState<CampaignStep>("audience");

  const campaign = campaigns.find((c) => c.id === selectedCampaignId) || null;
  const stepIndex = CAMPAIGN_STEP_ORDER.indexOf(currentStep);

  return (
    <div className="p-5 space-y-5">
      <div>
        <h2 className="text-[20px] font-display font-semibold" style={{ color: "#17120C" }}>{t("campaign.heading")}</h2>
        <SectionInfoBar description={t("sectionDesc.campaignBuilder")} />
        <p className="text-[14px] mt-1.5" style={{ color: "#5F5145" }}>{t("campaign.subtitle")}</p>
      </div>

      {/* Campaign selector */}
      <div className="flex items-center gap-2">
        {campaigns.map((c) => (
          <button
            key={c.id}
            onClick={() => { setSelectedCampaignId(c.id); setCurrentStep(c.currentStep); }}
            className="text-left px-3 py-2 rounded-sm border transition-all"
            style={{
              backgroundColor: selectedCampaignId === c.id ? "rgba(216,169,91,0.06)" : "#FFFFFF",
              borderColor: selectedCampaignId === c.id ? "#C9973F" : "#E5D7C3",
            }}
          >
            <span className="text-[11px] font-medium block" style={{ color: "#17120C" }}>{c.name}</span>
            <span className="text-[12px]" style={{ color: "#5F5145" }}>{t(`campaignType.${c.type}`)}</span>
          </button>
        ))}
        <button className="flex items-center gap-1 text-[10px] px-3 py-2 rounded-sm" style={{ color: "#5F5145", border: "1px dashed #B8ADA0" }}>
          <Plus size={11} /> {t("campaign.new")}
        </button>
      </div>

      {campaign && (
        <>
          {/* Stepper */}
          <div className="flex items-center gap-0">
            {CAMPAIGN_STEP_ORDER.map((step, i) => {
              const isActive = step === currentStep;
              const isDone = CAMPAIGN_STEP_ORDER.indexOf(step) < stepIndex;
              const isLast = i === CAMPAIGN_STEP_ORDER.length - 1;
              return (
                <div key={step} className="flex items-center gap-0 flex-1">
                  <button
                    onClick={() => setCurrentStep(step)}
                    className="flex-1 text-center px-2 py-2 rounded-sm text-[10px] font-medium transition-all"
                    style={{
                      backgroundColor: isActive ? "rgba(216,169,91,0.12)" : isDone ? "rgba(47,125,78,0.06)" : "transparent",
                      color: isActive ? "#C9973F" : isDone ? "#2F7D4E" : "#6E6257",
                    }}
                  >
                    {isDone ? <CheckCircle size={10} className="inline mr-1" /> : null}
                    {t(`step.${step}`)}
                  </button>
                  {!isLast && (
                    <div className="w-4 h-px" style={{ backgroundColor: isDone ? "#2F7D4E" : "#D9CCBB" }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step content */}
          <div className="p-5 rounded-sm border" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5D7C3", boxShadow: "0 1px 3px rgba(23,18,12,0.04)" }}>
            {currentStep === "audience" && (
              <div className="space-y-3">
                <h3 className="text-[12px] font-medium" style={{ color: "#17120C" }}>Audience</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-sm" style={{ backgroundColor: "#F1EBE2" }}>
                    <span className="text-[13px]" style={{ color: "#5F5145" }}>Segment</span>
                    <p className="text-[12px] font-medium mt-0.5" style={{ color: "#17120C" }}>{campaign.audience.segmentName}</p>
                  </div>
                  <div className="p-3 rounded-sm" style={{ backgroundColor: "#F1EBE2" }}>
                    <span className="text-[13px]" style={{ color: "#5F5145" }}>Fans ciblés</span>
                    <p className="text-lg font-mono font-semibold mt-0.5" style={{ color: "#C9973F" }}>{campaign.audience.fanCount}</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === "content" && (
              <div className="space-y-3">
                <h3 className="text-[12px] font-medium" style={{ color: "#17120C" }}>Contenu</h3>
                <div className="p-3 rounded-sm" style={{ backgroundColor: "#F1EBE2" }}>
                  <p className="text-[12px] font-medium" style={{ color: "#17120C" }}>{campaign.content.productName}</p>
                  <p className="text-[14px] mt-1.5" style={{ color: "#5F5145" }}>{campaign.content.description}</p>
                  <span className="inline-block text-[9px] px-1.5 py-0.5 rounded-sm mt-2" style={{ backgroundColor: "#EBE3D7", color: "#5F5145" }}>
                    {campaign.content.mediaCount} médias
                  </span>
                </div>
              </div>
            )}

            {currentStep === "pricing" && (
              <div className="space-y-3">
                <h3 className="text-[12px] font-medium" style={{ color: "#17120C" }}>Tarification</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-sm" style={{ backgroundColor: "#F1EBE2" }}>
                    <span className="text-[13px]" style={{ color: "#5F5145" }}>Prix de base</span>
                    <p className="text-lg font-mono font-semibold mt-0.5" style={{ color: "#17120C" }}>{formatEuro(campaign.pricing.basePrice)}</p>
                  </div>
                  <div className="p-3 rounded-sm" style={{ backgroundColor: "#F1EBE2" }}>
                    <span className="text-[13px]" style={{ color: "#5F5145" }}>Remise</span>
                    <p className="text-lg font-mono font-semibold mt-0.5" style={{ color: "#C9973F" }}>{campaign.pricing.discountPercent}%</p>
                  </div>
                  <div className="p-3 rounded-sm" style={{ backgroundColor: "rgba(47,125,78,0.04)" }}>
                    <span className="text-[13px]" style={{ color: "#5F5145" }}>{t("script.estimatedRevenue")}</span>
                    <p className="text-lg font-mono font-semibold mt-0.5" style={{ color: "#2F7D4E" }}>{formatEuro(campaign.pricing.expectedRevenue)}</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === "compliance" && (
              <div className="space-y-3">
                <h3 className="text-[12px] font-medium" style={{ color: "#17120C" }}>Conformité</h3>
                <div className="p-4 rounded-sm" style={{
                  backgroundColor: campaign.complianceStatus === "passed" ? "rgba(47,125,78,0.06)" :
                    campaign.complianceStatus === "flagged" ? "rgba(183,121,31,0.06)" : "#F2EDE4",
                  borderColor: campaign.complianceStatus === "passed" ? "rgba(47,125,78,0.15)" :
                    campaign.complianceStatus === "flagged" ? "rgba(183,121,31,0.15)" : "#E0D5C5",
                  border: "1px solid",
                }}>
                  <div className="flex items-center gap-2">
                    {campaign.complianceStatus === "passed" ? <CheckCircle size={16} style={{ color: "#2F7D4E" }} /> :
                      campaign.complianceStatus === "flagged" ? <AlertTriangle size={16} style={{ color: "#B7791F" }} /> :
                      <Clock size={16} style={{ color: "#5F5145" }} />}
                    <span className="text-[12px] font-medium" style={{ color: "#17120C" }}>
                      {campaign.complianceStatus === "passed" ? t("campaign.compliant") : campaign.complianceStatus === "flagged" ? t("campaign.issueDetected") : t("campaign.pendingCheck")}
                    </span>
                  </div>
                  {campaign.complianceNotes && (
                    <p className="text-[11px] mt-2 ml-7" style={{ color: "#5F5145" }}>{campaign.complianceNotes}</p>
                  )}
                </div>
              </div>
            )}

            {currentStep === "review" && (
              <div className="space-y-3">
                <h3 className="text-[12px] font-medium" style={{ color: "#17120C" }}>Résumé de la campagne</h3>
                <div className="space-y-2 p-4 rounded-sm" style={{ backgroundColor: "#F2EDE4" }}>
                  {[
                    { label: "Type", value: t(`campaignType.${campaign.type}`) },
                    { label: "Audience", value: `${campaign.audience.segmentName} (${campaign.audience.fanCount} fans)` },
                    { label: "Contenu", value: campaign.content.productName },
                    { label: "Prix", value: `${formatEuro(campaign.pricing.basePrice)} (-${campaign.pricing.discountPercent}%)` },
                    { label: "Conformité", value: campaign.complianceStatus },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-[11px] py-1.5 border-b" style={{ borderColor: "#EBE3D7" }}>
                      <span style={{ color: "#5F5145" }}>{item.label}</span>
                      <span style={{ color: "#17120C" }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === "launch" && (
              <div className="text-center py-8">
                <Send size={28} style={{ color: "#C9973F" }} />
                <h3 className="text-sm font-semibold mt-3" style={{ color: "#17120C" }}>{t("campaign.readyToLaunch")}</h3>
                <p className="text-[14px] mt-1.5" style={{ color: "#5F5145" }}>Tout est vérifié. La campagne sera envoyée à {campaign.audience.fanCount} fans.</p>
                <button className="mt-4 px-4 py-2 rounded-sm text-[11px] font-medium" style={{ backgroundColor: "#C9973F", color: "#FFFFFF" }}>
                  {t("campaign.launch")}
                </button>
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => { const prev = CAMPAIGN_STEP_ORDER[stepIndex - 1]; if (prev) setCurrentStep(prev); }}
              disabled={stepIndex === 0}
              className="flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-sm transition-opacity disabled:opacity-20"
              style={{ color: "#5F5145" }}
            >
              <ArrowLeft size={12} /> {t("campaign.previous")}
            </button>
            <button
              onClick={() => { const next = CAMPAIGN_STEP_ORDER[stepIndex + 1]; if (next) setCurrentStep(next); }}
              disabled={stepIndex === CAMPAIGN_STEP_ORDER.length - 1}
              className="flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-sm transition-opacity disabled:opacity-20"
              style={{ backgroundColor: "#C9973F", color: "#FFFFFF", fontWeight: 600 }}
            >
              {t("campaign.next")} <ArrowRight size={12} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ═══ 8. Fan Journey ════════════════════════════════════

function FanJourneySection() {
  const t = useT();
  const stages = mockFanJourneyStages;
  const maxFans = Math.max(...stages.map((s) => s.fanCount));

  const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = { Eye, UserCheck, DollarSign, Zap, Star, ShieldCheck };

  return (
    <div className="p-5 space-y-5">
      <div>
        <h2 className="text-[20px] font-display font-semibold" style={{ color: "#17120C" }}>{t("journey.heading")}</h2>
        <SectionInfoBar description={t("sectionDesc.fanJourney")} />
        <p className="text-[14px] mt-1.5" style={{ color: "#5F5145" }}>{t("journey.subtitle")}</p>
      </div>

      <div className="space-y-3">
        {stages.map((stage, i) => {
          const Icon = iconMap[stage.icon] || Eye;
          const barWidth = (stage.fanCount / maxFans) * 100;
          return (
            <div key={stage.id}>
              <div className="flex items-center gap-4 p-4 rounded-sm border" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5D7C3", boxShadow: "0 1px 3px rgba(23,18,12,0.04)" }}>
                <div className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(216,169,91,0.1)", color: "#C9973F" }}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-[12px] font-medium" style={{ color: "#17120C" }}>{stage.name}</h3>
                    <div className="flex items-center gap-3 text-[10px]">
                      <span className="font-mono font-semibold" style={{ color: "#C9973F" }}>{stage.fanCount.toLocaleString()} fans</span>
                      <span style={{ color: "#5F5145" }}>{stage.avgDaysInStage}{t("journey.daysAvg")}</span>
                      <span style={{ color: "#2F7D4E" }}>{formatEuro(stage.avgRevenueInStage)}/fan</span>
                    </div>
                  </div>
                  <p className="text-[13px] mb-2" style={{ color: "#5F5145" }}>{stage.description}</p>
                  {/* Bar */}
                  <div className="h-1.5 rounded-full" style={{ backgroundColor: "#EAE2D7", width: "100%" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${barWidth}%`, backgroundColor: "#C9973F", opacity: 0.6 + (i * 0.08) }}
                    />
                  </div>
                </div>
                {i < stages.length - 1 && stage.conversionToNext > 0 && (
                  <div className="text-center shrink-0 px-4">
                    <p className="text-lg font-mono font-semibold" style={{ color: "#C9973F" }}>{stage.conversionToNext}%</p>
                    <p className="text-[12px]" style={{ color: "#5F5145" }}>→ {stages[i + 1].name}</p>
                  </div>
                )}
              </div>
              {i < stages.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowRight size={14} style={{ color: "#B8ADA0", transform: "rotate(90deg)" }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══ 9. Opportunity Queue ══════════════════════════════

function OpportunityQueueSection() {
  const t = useT();
  const [opportunities] = useState<SalesOpportunity[]>(mockOpportunities);
  const [typeFilter, setTypeFilter] = useState("");

  const stages: OpportunityStage[] = ["to_review", "in_progress", "sent", "converted", "dismissed"];

  const filtered = typeFilter
    ? opportunities.filter((o) => o.type === typeFilter)
    : opportunities;

  const opsByStage = (stage: OpportunityStage) =>
    filtered.filter((o) => o.stage === stage);

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-display font-semibold" style={{ color: "#17120C" }}>{t("opportunity.heading")}</h2>
          <SectionInfoBar description={t("sectionDesc.opportunityQueue")} />
          <p className="text-[14px] mt-1.5" style={{ color: "#5F5145" }}>{t("opportunity.subtitle")}</p>
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="text-[14px] px-3 py-2 rounded-sm outline-none"
          style={{ backgroundColor: "#EBE3D7", color: typeFilter ? "#17120C" : "#6E6257", border: "1px solid #D9CCBB" }}
        >
          <option value="">{t("opportunity.allTypes")}</option>
          {Object.entries(OPPORTUNITY_TYPE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {stages.map((stage) => {
          const items = opsByStage(stage);
          return (
            <div key={stage} className="rounded-sm border" style={{ borderColor: "#E5D7C3", backgroundColor: "#F5F1EB" }}>
              <div className="px-3 py-2.5 border-b flex items-center justify-between" style={{ borderColor: "#E5D7C3" }}>
                <span className="text-[13px] font-medium" style={{ color: "#5F5145" }}>{t(`oppStage.${stage}`)}</span>
                <span className="text-[13px] font-mono font-semibold px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: `${OPPORTUNITY_STAGE_COLORS[stage]}20`, color: OPPORTUNITY_STAGE_COLORS[stage] }}>
                  {items.length}
                </span>
              </div>
              <div className="p-2 space-y-2 max-h-[400px] overflow-y-auto">
                {items.map((op) => (
                  <div key={op.id} className="p-3 rounded-sm border" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5D7C3", boxShadow: "0 1px 3px rgba(23,18,12,0.04)" }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-medium truncate" style={{ color: "#17120C" }}>{op.fanName}</span>
                      <span className="text-[12px] px-1.5 py-0.5 rounded-sm shrink-0" style={{ backgroundColor: `${OPPORTUNITY_TYPE_COLORS[op.type]}20`, color: OPPORTUNITY_TYPE_COLORS[op.type] }}>
                        {t(`oppType.${op.type}`)}
                      </span>
                    </div>
                    <p className="text-[13px] leading-relaxed line-clamp-2 mb-2" style={{ color: "#5F5145" }}>{op.aiSuggestion}</p>
                    <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "#E5D7C3" }}>
                      <span className="text-[13px] font-mono font-semibold" style={{ color: "#C9973F" }}>{formatEuro(op.potentialRevenue)}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12px]" style={{ color: "#5F5145" }}>{op.confidence}%</span>
                        <span className="w-8 h-1 rounded-full" style={{ backgroundColor: "#D9CCBB" }}>
                          <div className="h-full rounded-full" style={{ width: `${op.confidence}%`, backgroundColor: op.confidence > 75 ? "#2F7D4E" : op.confidence > 50 ? "#C9973F" : "#B7791F" }} />
                        </span>
                      </div>
                    </div>
                    {op.deadline && (
                      <div className="flex items-center gap-1 mt-1.5 text-[9px]" style={{ color: "#B7791F" }}>
                        <Clock size={9} /> Échéance {formatRelative(op.deadline)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══ 10. Team Control Room ═════════════════════════════

function TeamControlRoomSection() {
  const t = useT();
  const [members] = useState<TeamMember[]>(mockTeamMembers);
  const [activities] = useState(mockTeamActivity);
  const [employeeStats] = useState<EmployeeStats[]>(mockEmployeeStats);

  const statusDot = (status: TeamMember["status"]) => {
    const color = status === "online" ? "#2F7D4E" : status === "away" ? "#B45309" : "#6E6257";
    return <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />;
  };

  const totalRevenue = members.reduce((s, m) => s + m.revenueGenerated, 0);
  const totalActive = members.reduce((s, m) => s + m.conversationsActive, 0);

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-display font-semibold" style={{ color: "#17120C" }}>{t("team.heading")}</h2>
          <SectionInfoBar description={t("sectionDesc.teamControl")} />
          <p className="text-[14px] mt-1.5" style={{ color: "#5F5145" }}>{t("team.subtitle")}</p>
        </div>
        <div className="flex items-center gap-4 text-[10px]">
          <span style={{ color: "#5F5145" }}>{totalActive} conversations actives</span>
          <span className="font-mono font-semibold" style={{ color: "#2F7D4E" }}>{formatEuro(totalRevenue)} généré</span>
        </div>
      </div>

      {/* Team member cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {members.map((member) => (
          <div key={member.id} className="p-4 rounded-sm border text-center" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5D7C3", boxShadow: "0 1px 3px rgba(23,18,12,0.04)" }}>
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 rounded-sm flex items-center justify-center text-sm font-semibold relative" style={{ backgroundColor: "#E0D5C5", color: "#5F5145", border: "1px solid #E0D5C5" }}>
                {member.name.charAt(0)}
                <span className="absolute -bottom-0.5 -right-0.5">{statusDot(member.status)}</span>
              </div>
            </div>
            <p className="text-[11px] font-medium" style={{ color: "#17120C" }}>{member.name}</p>
            <p className="text-[12px] mt-0.5 capitalize" style={{ color: "#5F5145" }}>{member.role}</p>
            <div className="grid grid-cols-2 gap-1 mt-3 pt-3 border-t" style={{ borderColor: "#E5D7C3" }}>
              <div>
                <p className="text-[11px]" style={{ color: "#5F5145" }}>Actives</p>
                <p className="text-[11px] font-mono font-semibold mt-0.5" style={{ color: "#17120C" }}>{member.conversationsActive}</p>
              </div>
              <div>
                <p className="text-[11px]" style={{ color: "#5F5145" }}>Drafts</p>
                <p className="text-[11px] font-mono font-semibold mt-0.5" style={{ color: "#C9973F" }}>{member.draftsReady}</p>
              </div>
            </div>
            <p className="text-[13px] font-mono font-semibold mt-2" style={{ color: "#2F7D4E" }}>{formatEuro(member.revenueGenerated)}</p>
          </div>
        ))}
      </div>

      {/* Activity feed */}
      <div>
        <h3 className="text-[11px] font-medium mb-3" style={{ color: "#5F5145" }}>{t("team.recentActivity")}</h3>
        <div className="space-y-1.5">
          {activities.slice(0, 10).map((activity) => {
            const member = members.find((m) => m.id === activity.memberId);
            return (
              <div key={activity.id} className="flex items-center gap-3 px-3 py-2 rounded-sm" style={{ backgroundColor: "#F2EDE4" }}>
                <span className="text-[13px] font-medium w-[80px] shrink-0 truncate" style={{ color: "#5F5145" }}>
                  {member?.name || "—"}
                </span>
                <span className="text-[13px] w-[140px] shrink-0 truncate" style={{ color: "#5F5145" }}>{activity.action}</span>
                <span className="text-[13px] flex-1 truncate" style={{ color: "#5F5145" }}>{activity.detail}</span>
                {activity.revenue !== null && (
                  <span className="text-[13px] font-mono shrink-0" style={{ color: "#2F7D4E" }}>+{formatEuro(activity.revenue)}</span>
                )}
                <span className="text-[12px] shrink-0" style={{ color: "#5F5145" }}>{formatRelative(activity.timestamp)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Employee Statistics / Golden Ratio */}
      <div>
        <h3 className="text-[11px] font-medium mb-3 flex items-center gap-2" style={{ color: "#5F5145" }}>
          <Star size={11} style={{ color: "#C9973F" }} /> Employee Statistics — Golden Ratio
        </h3>
        <div className="rounded-sm border overflow-hidden overflow-x-auto" style={{ borderColor: "#E5D7C3" }}>
          <table className="w-full min-w-[800px]">
            <thead>
              <tr style={{ borderBottom: "1px solid #E5D7C3" }}>
                <th className="text-left text-[10px] font-medium px-3 py-2.5" style={{ color: "#5F5145" }}>Employé</th>
                <th className="text-left text-[10px] font-medium px-3 py-2.5" style={{ color: "#5F5145" }}>Rôle</th>
                <th className="text-right text-[10px] font-medium px-3 py-2.5" style={{ color: "#5F5145" }}>CA généré</th>
                <th className="text-right text-[10px] font-medium px-3 py-2.5" style={{ color: "#5F5145" }}>Convs.</th>
                <th className="text-right text-[10px] font-medium px-3 py-2.5" style={{ color: "#5F5145" }}>{t("ledger.approved")}</th>
                <th className="text-right text-[10px] font-medium px-3 py-2.5" style={{ color: "#5F5145" }}>Taux appro.</th>
                <th className="text-right text-[10px] font-medium px-3 py-2.5" style={{ color: "#5F5145" }}>Tps réponse</th>
                <th className="text-right text-[10px] font-medium px-3 py-2.5" style={{ color: "#5F5145" }}>CA/conv</th>
                <th className="text-right text-[10px] font-medium px-3 py-2.5" style={{ color: "#5F5145" }}>Golden Ratio</th>
              </tr>
            </thead>
            <tbody>
              {employeeStats.map((emp) => (
                <tr key={emp.memberId} className="transition-colors hover:bg-black/[0.02]" style={{ borderBottom: "1px solid #EBE3D7" }}>
                  <td className="px-3 py-2.5">
                    <span className="text-[11px] font-medium" style={{ color: "#17120C" }}>{emp.name}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-[12px] px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: "#F1EBE2", color: "#5F5145" }}>{emp.role}</span>
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <span className="text-[11px] font-mono" style={{ color: emp.revenueGenerated > 0 ? "#2F7D4E" : "#6E6257" }}>
                      {emp.revenueGenerated > 0 ? formatEuro(emp.revenueGenerated) : "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-[11px]" style={{ color: "#17120C" }}>{emp.conversationsHandled}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-[11px]" style={{ color: "#5F5145" }}>{emp.draftsApproved}/{emp.draftsApproved + emp.draftsRejected}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-[11px]" style={{ color: emp.approvalRate > 80 ? "#2F7D4E" : emp.approvalRate > 65 ? "#C9973F" : "#B7791F" }}>
                    {emp.approvalRate.toFixed(1)}%
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-[11px]" style={{ color: "#5F5145" }}>{emp.avgResponseTime}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-[11px]" style={{ color: "#C9973F" }}>{emp.revenuePerConversation > 0 ? formatEuro(emp.revenuePerConversation) : "—"}</td>
                  <td className="px-3 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-[12px] font-mono font-semibold"
                        style={{ color: emp.goldenRatio >= 80 ? "#2F7D4E" : emp.goldenRatio >= 60 ? "#C9973F" : "#B7791F" }}>
                        {emp.goldenRatio}
                      </span>
                      <div className="w-10 h-1.5 rounded-full" style={{ backgroundColor: "#E0D5C5" }}>
                        <div className="h-full rounded-full" style={{
                          width: `${Math.min(100, emp.goldenRatio)}%`,
                          backgroundColor: emp.goldenRatio >= 80 ? "#2F7D4E" : emp.goldenRatio >= 60 ? "#C9973F" : "#B7791F",
                        }} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[12px] mt-2" style={{ color: "#8A7E72" }}>
          {t("team.goldenRatioExplanation")}
        </p>
      </div>
    </div>
  );
}

// ═══ 11. Compliance Review Queue ═══════════════════════

function ComplianceReviewSection() {
  const t = useT();
  const [items, setItems] = useState<ComplianceReviewItem[]>(mockComplianceItems);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("");

  const filtered = categoryFilter
    ? items.filter((item) => item.riskCategory === categoryFilter)
    : items;

  const handleAction = (id: string, status: "approved" | "rejected" | "escalated") => {
    setItems((prev) => prev.map((item) =>
      item.id === id ? { ...item, status, reviewer: "Toi" } : item,
    ));
  };

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-display font-semibold" style={{ color: "#17120C" }}>{t("compliance.heading")}</h2>
          <SectionInfoBar description={t("sectionDesc.complianceReview")} />
          <p className="text-[14px] mt-1.5" style={{ color: "#5F5145" }}>{t("compliance.subtitle")}</p>
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-[14px] px-3 py-2 rounded-sm outline-none"
          style={{ backgroundColor: "#EBE3D7", color: categoryFilter ? "#17120C" : "#6E6257", border: "1px solid #D9CCBB" }}
        >
          <option value="">{t("compliance.allCategories")}</option>
          {Object.entries(RISK_CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        {filtered.map((item) => {
          const isExpanded = expandedId === item.id;
          const riskColor = item.riskScore > 70 ? "#C54A3A" : item.riskScore > 40 ? "#B7791F" : "#2F7D4E";
          return (
            <div key={item.id} className="rounded-sm border" style={{ backgroundColor: "#FFFFFF", borderColor: isExpanded ? "rgba(216,169,91,0.15)" : "#E5D7C3" }}>
              <button
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="w-full text-left px-4 py-3 flex items-center gap-4"
              >
                <div className="flex items-center gap-2 w-[120px] shrink-0">
                  <span className="text-[13px] font-mono font-semibold px-2 py-0.5 rounded-sm" style={{ backgroundColor: `${riskColor}15`, color: riskColor }}>
                    {item.riskScore}/100
                  </span>
                  <span className="text-[12px] px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: "#EBE3D7", color: "#5F5145" }}>
                    {t(`risk.${item.riskCategory}`)}
                  </span>
                </div>
                <span className="flex-1 text-[11px] truncate" style={{ color: "#17120C" }}>{item.content}</span>
                <span className="text-[12px] px-1.5 py-0.5 rounded-sm shrink-0"
                  style={{
                    backgroundColor: item.status === "pending" ? "rgba(216,169,91,0.1)" :
                      item.status === "approved" ? "rgba(47,125,78,0.1)" :
                      item.status === "escalated" ? "rgba(183,121,31,0.1)" : "#F1EBE2",
                    color: item.status === "pending" ? "#C9973F" :
                      item.status === "approved" ? "#2F7D4E" :
                      item.status === "escalated" ? "#B7791F" : "#6E6257",
                  }}>
                  {item.status === "pending" ? t("compliance.statusPending") : item.status === "approved" ? t("compliance.statusApproved") : item.status === "escalated" ? t("compliance.statusEscalated") : t("compliance.statusRejected")}
                </span>
                <ChevronRight size={12} style={{ color: "#5F5145", transform: isExpanded ? "rotate(90deg)" : undefined }} />
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t pt-3" style={{ borderColor: "#E5D7C3" }}>
                  <div className="grid grid-cols-2 gap-3 mb-3 text-[10px]">
                    <div>
                      <span style={{ color: "#5F5145" }}>{t("compliance.detectedBy")} </span>
                      <span style={{ color: "#5F5145" }}>{item.flaggedBy === "ai" ? "IA" : item.flaggedBy === "human" ? "Humain" : "Plateforme"}</span>
                    </div>
                    <div>
                      <span style={{ color: "#5F5145" }}>Créé: </span>
                      <span style={{ color: "#5F5145" }}>{formatRelative(item.createdAt)}</span>
                    </div>
                    {item.reviewer && (
                      <div>
                        <span style={{ color: "#5F5145" }}>Réviseur: </span>
                        <span style={{ color: "#5F5145" }}>{item.reviewer}</span>
                      </div>
                    )}
                  </div>
                  {item.notes && (
                    <p className="text-[13px] mb-3 p-2 rounded-sm" style={{ backgroundColor: "#F2EDE4", color: "#5F5145" }}>
                      Notes: {item.notes}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    {item.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleAction(item.id, "approved")}
                          className="flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-sm"
                          style={{ backgroundColor: "rgba(47,125,78,0.1)", color: "#2F7D4E" }}
                        >
                          <CheckCircle size={12} /> {t("compliance.approveCompliant")}
                        </button>
                        <button
                          onClick={() => handleAction(item.id, "rejected")}
                          className="flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-sm"
                          style={{ backgroundColor: "#EBE3D7", color: "#5F5145" }}
                        >
                          <X size={12} /> {t("compliance.rejectNonCompliant")}
                        </button>
                        <button
                          onClick={() => handleAction(item.id, "escalated")}
                          className="flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-sm"
                          style={{ backgroundColor: "rgba(183,121,31,0.1)", color: "#B7791F" }}
                        >
                          <AlertTriangle size={12} /> {t("compliance.escalate")}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══ 12. Why Atlas is safer ════════════════════════════

function WhyAtlasSaferSection() {
  const t = useT();
  const reasons = mockSafetyReasons;
  const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = { UserCheck, ShieldCheck, Settings, FileCheck, Lock, AlertTriangle };

  return (
    <div className="p-5 space-y-5">
      <div>
        <h2 className="text-[20px] font-display font-semibold" style={{ color: "#17120C" }}>{t("whySafer.heading")}</h2>
        <SectionInfoBar description={t("sectionDesc.whyAtlasSafer")} />
        <p className="text-[14px] mt-1.5" style={{ color: "#5F5145" }}>{t("whySafer.subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {reasons.map((reason) => {
          const Icon = iconMap[reason.icon] || ShieldCheck;
          return (
            <div key={reason.id} className="p-5 rounded-sm border flex gap-4" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5D7C3", boxShadow: "0 1px 3px rgba(23,18,12,0.04)" }}>
              <div className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(216,169,91,0.1)", color: "#C9973F" }}>
                <Icon size={18} />
              </div>
              <div>
                <h3 className="text-[12px] font-medium mb-1" style={{ color: "#17120C" }}>{reason.title}</h3>
                <p className="text-[11px] leading-relaxed" style={{ color: "#5F5145" }}>{reason.description}</p>
                <p className="text-[11px] font-semibold mt-2 flex items-center gap-1" style={{ color: "#C9973F" }}>
                  <CheckCircle size={10} /> {reason.highlight}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="p-4 rounded-sm border text-center" style={{ backgroundColor: "rgba(216,169,91,0.04)", borderColor: "rgba(216,169,91,0.1)" }}>
        <p className="text-[12px] font-medium mb-1" style={{ color: "#17120C" }}>{t("whySafer.bottomCta")}</p>
        <p className="text-[13px]" style={{ color: "#5F5145" }}>{t("whySafer.bottomSubtitle")}</p>
      </div>
    </div>
  );
}

// ═══ 13. Safety Guard ══════════════════════════════════

function SafetyGuardSection() {
  const t = useT();
  const [settings, setSettings] = useState<SafetyGuardSetting[]>(mockGuardSettings);

  const toggleSetting = (id: string) => {
    setSettings((prev) => prev.map((s) => {
      if (s.id !== id) return s;
      if (s.adminOnly) return s; // Cannot toggle admin-only settings
      return { ...s, enabled: !s.enabled };
    }));
  };

  const categories = [...new Set(settings.map((s) => s.category))];

  return (
    <div className="p-5 space-y-5">
      <div>
        <h2 className="text-[20px] font-display font-semibold" style={{ color: "#17120C" }}>{t("safetyGuard.heading")}</h2>
        <SectionInfoBar description={t("sectionDesc.safetyGuard")} />
        <p className="text-[14px] mt-1.5" style={{ color: "#5F5145" }}>{t("safetyGuard.subtitle")}</p>
      </div>

      {categories.map((category) => {
        const categorySettings = settings.filter((s) => s.category === category);
        return (
          <div key={category} className="space-y-2">
            <h3 className="text-[13px] font-medium tracking-wider uppercase" style={{ color: "#8A7E72" }}>
              {t(`guardCat.${category}`) || category}
            </h3>
            {categorySettings.map((setting) => (
              <div key={setting.id} className="flex items-center gap-4 px-4 py-3 rounded-sm border" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5D7C3", boxShadow: "0 1px 3px rgba(23,18,12,0.04)" }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium" style={{ color: "#17120C" }}>{setting.name}</span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded-sm font-medium"
                      style={{
                        backgroundColor: setting.severity === "critical" ? "rgba(197,74,58,0.12)" :
                          setting.severity === "high" ? "rgba(183,121,31,0.1)" :
                          setting.severity === "medium" ? "rgba(245,158,11,0.1)" : "#F1EBE2",
                        color: setting.severity === "critical" ? "#C54A3A" :
                          setting.severity === "high" ? "#B7791F" :
                          setting.severity === "medium" ? "#B45309" : "#6E6257",
                      }}>
                      {setting.severity}
                    </span>
                    {setting.adminOnly && (
                      <span className="text-[11px] px-1 py-0.5 rounded-sm" style={{ backgroundColor: "#EBE3D7", color: "#5F5145" }}>{t("safetyGuard.adminOnly")}</span>
                    )}
                  </div>
                  <p className="text-[13px] mt-0.5" style={{ color: "#5F5145" }}>{setting.description}</p>
                </div>
                <button
                  onClick={() => toggleSetting(setting.id)}
                  className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${setting.adminOnly ? "cursor-not-allowed" : ""}`}
                  style={{ backgroundColor: setting.enabled ? "#C9973F" : "#B8ADA0", opacity: setting.adminOnly ? 0.6 : 1 }}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full absolute top-[3px] transition-all"
                    style={{ backgroundColor: "#fff", left: setting.enabled ? "18px" : "3px" }}
                  />
                </button>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ═══ 14. AI Core Settings ═════════════════════════════════

function AiCoreSettingsSection() {
  const t = useT();
  const [settings, setSettings] = useState<AiCoreSettings>(mockAiCoreSettings);
  const modes: AiCoreSettings["mode"][] = ["manual_only", "ai_draft_assist", "hybrid_qualification", "full_ai_simulation"];

  const updateMode = (mode: AiCoreSettings["mode"]) => {
    setSettings((prev) => ({ ...prev, mode }));
  };

  const toggle = (key: keyof AiCoreSettings) => {
    if (typeof settings[key] === "boolean") {
      setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  return (
    <div className="p-5 space-y-5">
      <div>
        <h2 className="text-[20px] font-display font-semibold" style={{ color: "#17120C" }}>{t("aiCore.heading")}</h2>
        <SectionInfoBar description={t("sectionDesc.aiCoreSettings")} />
        <p className="text-[14px] mt-1.5" style={{ color: "#5F5145" }}>{t("aiCore.subtitle")}</p>
      </div>

      {/* Mode selector */}
      <div className="space-y-2">
        <h3 className="text-[13px] font-medium tracking-wider uppercase" style={{ color: "#8A7E72" }}>{t("aiCore.modeSelector")}</h3>
        <div className="grid grid-cols-2 gap-2">
          {modes.map((mode) => (
            <button
              key={mode}
              onClick={() => updateMode(mode)}
              className="text-left p-4 rounded-sm border transition-all"
              style={{
                backgroundColor: settings.mode === mode ? `${AI_CORE_MODE_COLORS[mode]}10` : "#FFFFFF",
                borderColor: settings.mode === mode ? AI_CORE_MODE_COLORS[mode] : "#E5D7C3",
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: AI_CORE_MODE_COLORS[mode] }} />
                <span className="text-[11px] font-medium capitalize" style={{ color: "#17120C" }}>
                  {mode.replace(/_/g, " ")}
                </span>
                {settings.mode === mode && (
                  <CheckCircle size={12} style={{ color: AI_CORE_MODE_COLORS[mode], marginLeft: "auto" }} />
                )}
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: "#5F5145" }}>
                {t(`aiMode.${mode}`)}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Configuration options */}
      <div className="p-4 rounded-sm border space-y-3" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5D7C3", boxShadow: "0 1px 3px rgba(23,18,12,0.04)" }}>
        <h3 className="text-[13px] font-medium tracking-wider uppercase mb-3" style={{ color: "#8A7E72" }}>{t("aiCore.configHeading")}</h3>
        {([
          { key: "autoGenerateOnNewMessage" as const, label: "Auto-génération sur nouveau message", desc: "L'IA génère des brouillons dès qu'un nouveau message arrive" },
          { key: "requireHumanApproval" as const, label: "Approbation humaine obligatoire", desc: "Chaque brouillon IA doit être validé avant envoi" },
          { key: "simulationPreviewOnly" as const, label: "Mode simulation uniquement", desc: "L'IA génère mais rien n'est envoyable — preview pure" },
        ]).map((opt) => (
          <div key={opt.key} className="flex items-center justify-between py-1.5">
            <div className="flex-1 min-w-0 mr-4">
              <span className="text-[11px] font-medium" style={{ color: "#17120C" }}>{opt.label}</span>
              <p className="text-[12px] mt-0.5" style={{ color: "#5F5145" }}>{opt.desc}</p>
            </div>
            <button
              onClick={() => toggle(opt.key)}
              className="w-9 h-5 rounded-full transition-colors relative shrink-0"
              style={{ backgroundColor: settings[opt.key] ? "#C9973F" : "#B8ADA0" }}
            >
              <div className="w-3.5 h-3.5 rounded-full absolute top-[3px] transition-all bg-white"
                style={{ left: settings[opt.key] ? "18px" : "3px" }} />
            </button>
          </div>
        ))}
      </div>

      {/* Advanced */}
      <div className="p-4 rounded-sm border space-y-2" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5D7C3", boxShadow: "0 1px 3px rgba(23,18,12,0.04)" }}>
        <div className="flex items-center justify-between">
          <span className="text-[11px]" style={{ color: "#17120C" }}>Temperature du modèle</span>
          <span className="text-[11px] font-mono" style={{ color: "#C9973F" }}>{settings.modelTemperature.toFixed(1)}</span>
        </div>
        <input type="range" min="0" max="1.5" step="0.1" value={settings.modelTemperature}
          onChange={(e) => setSettings((prev) => ({ ...prev, modelTemperature: Number(e.target.value) }))}
          className="w-full accent-[#C9973F]" />
        <div className="flex items-center justify-between text-[9px]" style={{ color: "#5F5145" }}>
          <span>{t("aiCore.precise")}</span><span>{t("aiCore.creative")}</span>
        </div>
        <div className="flex items-center gap-1.5 pt-2 mt-2 border-t" style={{ borderColor: "#E5D7C3" }}>
          <span className="text-[13px]" style={{ color: "#5F5145" }}>{t("aiCore.languages")}</span>
          {settings.languages.map((l) => (
            <span key={l} className="text-[12px] px-1.5 py-0.5 rounded-sm uppercase" style={{ backgroundColor: "rgba(216,169,91,0.08)", color: "#C9973F" }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══ 15. Hybrid Handoff Rules ═════════════════════════════

function HybridHandoffSection() {
  const t = useT();
  const [groups, setGroups] = useState<HandoffRuleGroup[]>(mockHandoffRules);

  const toggleRule = (groupId: string, ruleId: string) => {
    setGroups((prev) => prev.map((g) =>
      g.id === groupId ? { ...g, rules: g.rules.map((r) => r.id === ruleId ? { ...r, isEnabled: !r.isEnabled } : r) } : g,
    ));
  };

  return (
    <div className="p-5 space-y-5">
      <div>
        <h2 className="text-[20px] font-display font-semibold" style={{ color: "#17120C" }}>{t("handoff.heading")}</h2>
        <SectionInfoBar description={t("sectionDesc.hybridHandoff")} />
        <p className="text-[14px] mt-1.5" style={{ color: "#5F5145" }}>{t("handoff.subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {groups.map((group) => (
          <div key={group.id} className="rounded-sm border" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5D7C3", boxShadow: "0 1px 3px rgba(23,18,12,0.04)" }}>
            <div className="px-4 py-2.5 border-b flex items-center justify-between" style={{ borderColor: "#E5D7C3" }}>
              <h3 className="text-[11px] font-medium" style={{ color: "#17120C" }}>{group.label}</h3>
              <span className="text-[12px] font-mono px-1.5 py-0.5 rounded-sm" style={{
                backgroundColor: group.logic === "AND" ? "rgba(47,125,78,0.1)" : "rgba(216,169,91,0.1)",
                color: group.logic === "AND" ? "#2F7D4E" : "#C9973F",
              }}>
                {group.logic}
              </span>
            </div>
            <div className="p-3 space-y-1.5">
              {group.rules.map((rule) => (
                <div key={rule.id} className="flex items-center gap-3 py-1.5 px-2 rounded-sm hover:bg-black/[0.02]">
                  <button
                    onClick={() => toggleRule(group.id, rule.id)}
                    className="w-8 h-4.5 rounded-full transition-colors relative shrink-0"
                    style={{ backgroundColor: rule.isEnabled ? "#C9973F" : "#B8ADA0" }}
                  >
                    <div className="w-3 h-3 rounded-full absolute top-[3px] transition-all bg-white"
                      style={{ left: rule.isEnabled ? "17px" : "3px" }} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] block" style={{ color: rule.isEnabled ? "#17120C" : "#6E6257" }}>{rule.name}</span>
                    <span className="text-[12px]" style={{ color: "#5F5145" }}>
                      {rule.condition.replace(/_/g, " ")} {rule.operator} {rule.value}
                    </span>
                  </div>
                  <span className="text-[11px] px-1.5 py-0.5 rounded-sm shrink-0"
                    style={{ backgroundColor: "#F1EBE2", color: "#5F5145" }}>
                    {t(`handoffAction.${rule.action}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-sm border" style={{ backgroundColor: "rgba(216,169,91,0.04)", borderColor: "rgba(216,169,91,0.1)" }}>
        <p className="text-[13px] flex items-center gap-1.5" style={{ color: "#C9973F" }}>
          <Brain size={12} /> AND = toutes les règles doivent matcher · OR = au moins une règle doit matcher
        </p>
      </div>
    </div>
  );
}

// ═══ 16. Script Builder / PPV Ladder ═══════════════════════

function ScriptBuilderSection() {
  const t = useT();
  const [scripts] = useState<PpvLadderScript[]>(mockPpvLadderScripts);
  const [selectedScriptId, setSelectedScriptId] = useState(scripts[0]?.id || null);
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

  const script = scripts.find((s) => s.id === selectedScriptId) || null;

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-display font-semibold" style={{ color: "#17120C" }}>{t("script.heading")}</h2>
          <SectionInfoBar description={t("sectionDesc.scriptBuilder")} />
          <p className="text-[14px] mt-1.5" style={{ color: "#5F5145" }}>{t("script.subtitle")}</p>
        </div>
        <button className="flex items-center gap-1.5 text-[11px] px-3 py-2 rounded-sm" style={{ backgroundColor: "#C9973F", color: "#FFFFFF", fontWeight: 600 }}>
          <Plus size={12} /> {t("script.create")}
        </button>
      </div>

      {/* Script selector */}
      <div className="flex items-center gap-2 flex-wrap">
        {scripts.map((s) => (
          <button key={s.id} onClick={() => setSelectedScriptId(s.id)}
            className="text-left px-4 py-2.5 rounded-sm border transition-all"
            style={{
              backgroundColor: selectedScriptId === s.id ? "rgba(216,169,91,0.06)" : "#FFFFFF",
              borderColor: selectedScriptId === s.id ? "#C9973F" : "#E5D7C3",
            }}>
            <span className="text-[11px] font-medium block" style={{ color: "#17120C" }}>{s.name}</span>
            <span className="text-[12px] mt-0.5 block" style={{ color: "#5F5145" }}>
              {s.totalSteps} étapes · {t(FAN_TIER_KEY[s.targetTier] || s.targetTier)} · {formatEuro(s.estimatedRevenue)}
            </span>
          </button>
        ))}
      </div>

      {script && (
        <div className="space-y-4">
          {/* Header KPIs */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: t("script.etapes"), value: script.totalSteps.toString(), color: "#17120C" },
              { label: t("tracking.convRate"), value: `${script.conversionRate}%`, color: "#C9973F" },
              { label: t("script.estimatedRevenue"), value: formatEuro(script.estimatedRevenue), color: "#2F7D4E" },
              { label: t("automation.status"), value: script.isActive ? t("banned.active") : t("script.inactive"), color: script.isActive ? "#2F7D4E" : "#6E6257" },
            ].map((kpi) => (
              <div key={kpi.label} className="p-3 rounded-sm border" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5D7C3", boxShadow: "0 1px 3px rgba(23,18,12,0.04)" }}>
                <p className="text-[12px]" style={{ color: "#5F5145" }}>{kpi.label}</p>
                <p className="text-sm font-mono font-semibold mt-0.5" style={{ color: kpi.color }}>{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Ladder steps */}
          <div className="rounded-sm border overflow-hidden" style={{ borderColor: "#E5D7C3" }}>
            {script.steps.map((step, i) => {
              const isExpanded = expandedStepId === step.id;
              const isLast = i === script.steps.length - 1;
              const typeColors: Record<string, string> = {
                free_teaser: "#1D4ED8", ppv_step: "#C9973F", upsell: "#6D28D9", cta: "#2F7D4E",
              };
              return (
                <div key={step.id}>
                  <button
                    onClick={() => setExpandedStepId(isExpanded ? null : step.id)}
                    className="w-full text-left px-4 py-3 flex items-center gap-4 transition-colors hover:bg-black/[0.02]"
                    style={{ borderBottom: isLast ? "none" : "1px solid #EBE3D7" }}
                  >
                    <span className="w-6 h-6 rounded-sm flex items-center justify-center text-[10px] font-mono font-semibold shrink-0"
                      style={{ backgroundColor: "#EBE3D7", color: "#5F5145" }}>
                      {step.order}
                    </span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded-sm font-medium uppercase shrink-0"
                      style={{ backgroundColor: `${typeColors[step.type]}15`, color: typeColors[step.type] }}>
                      {step.type.replace(/_/g, " ")}
                    </span>
                    <span className="flex-1 text-[11px] font-medium truncate" style={{ color: "#17120C" }}>{step.title}</span>
                    {step.price !== null && (
                      <span className="text-[11px] font-mono font-semibold shrink-0" style={{ color: "#C9973F" }}>{formatEuro(step.price)}</span>
                    )}
                    {step.isRequired && (
                      <span className="text-[11px] px-1 py-0.5 rounded-sm shrink-0" style={{ backgroundColor: "rgba(197,74,58,0.1)", color: "#C54A3A" }}>{t("script.required")}</span>
                    )}
                    <ChevronRight size={12} style={{ color: "#5F5145", transform: isExpanded ? "rotate(90deg)" : undefined }} />
                  </button>
                  {isExpanded && (
                    <div className="px-10 pb-4 border-t mx-4 pt-3" style={{ borderColor: "#E5D7C3" }}>
                      <p className="text-[11px] leading-relaxed mb-3" style={{ color: "#5F5145" }}>{step.content}</p>
                      <div className="flex items-center gap-4 text-[10px]">
                        <span style={{ color: "#5F5145" }}>
                          {t("script.delayAfterPrevious")} <span style={{ color: "#5F5145" }}>{step.delayAfterPrevious}</span>
                        </span>
                        <div className="flex items-center gap-1.5 ml-auto">
                          <button className="text-[13px] px-2 py-1 rounded-sm" style={{ backgroundColor: "#EBE3D7", color: "#5F5145" }}>{t("script.move")}</button>
                          <button className="text-[13px] px-2 py-1 rounded-sm" style={{ backgroundColor: "rgba(29,77,216,0.1)", color: "#1D4ED8" }}>{t("salesEngine.edit")}</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mock CTA preview */}
          <div className="p-4 rounded-sm border text-center" style={{ backgroundColor: "rgba(47,125,78,0.03)", borderColor: "rgba(47,125,78,0.1)" }}>
            <p className="text-[13px] mb-1" style={{ color: "#5F5145" }}>{t("script.finalCta")}</p>
            <p className="text-[12px] font-medium" style={{ color: "#17120C" }}>
              {t("script.finalCtaText")} 🔥
            </p>
            <p className="text-[12px] mt-1" style={{ color: "#5F5145" }}>{t("script.finalCtaSub")}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══ 17. Message Ledger ══════════════════════════════════

function MessageLedgerSection() {
  const t = useT();
  const [entries] = useState<MessageLedgerEntry[]>(mockMessageLedger);
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = statusFilter ? entries.filter((e) => e.status === statusFilter) : entries;

  const statusColors: Record<string, string> = {
    draft: "#C9973F", approved: "#2F7D4E", sent: "#1D4ED8", flagged: "#B7791F",
  };

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-display font-semibold" style={{ color: "#17120C" }}>{t("ledger.heading")}</h2>
          <SectionInfoBar description={t("sectionDesc.messageLedger")} />
          <p className="text-[14px] mt-1.5" style={{ color: "#5F5145" }}>{t("ledger.subtitle")}</p>
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="text-[14px] px-3 py-2 rounded-sm outline-none"
          style={{ backgroundColor: "#EBE3D7", color: statusFilter ? "#17120C" : "#6E6257", border: "1px solid #D9CCBB" }}>
          <option value="">{t("ledger.allStatuses")}</option>
          <option value="draft">{t("ledger.drafts")}</option>
          <option value="approved">{t("compliance.statusApproved")}s</option>
          <option value="sent">{t("ledger.sent")}</option>
          <option value="flagged">{t("ledger.flagged")}</option>
        </select>
      </div>

      <div className="rounded-sm border overflow-hidden overflow-x-auto" style={{ borderColor: "#E5D7C3" }}>
        <table className="w-full min-w-[700px]">
          <thead>
            <tr style={{ borderBottom: "1px solid #E5D7C3" }}>
              <th className="text-left text-[10px] font-medium px-4 py-2.5" style={{ color: "#5F5145" }}>Fan</th>
              <th className="text-left text-[10px] font-medium px-4 py-2.5" style={{ color: "#5F5145" }}>Message</th>
              <th className="text-left text-[10px] font-medium px-4 py-2.5" style={{ color: "#5F5145" }}>Direction</th>
              <th className="text-left text-[10px] font-medium px-4 py-2.5" style={{ color: "#5F5145" }}>Créateur</th>
              <th className="text-left text-[10px] font-medium px-4 py-2.5" style={{ color: "#5F5145" }}>{t("automation.status")}</th>
              <th className="text-right text-[10px] font-medium px-4 py-2.5" style={{ color: "#5F5145" }}>Revenu</th>
              <th className="text-right text-[10px] font-medium px-4 py-2.5" style={{ color: "#5F5145" }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry) => (
              <tr key={entry.id} className="transition-colors hover:bg-black/[0.02]" style={{ borderBottom: "1px solid #EBE3D7" }}>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium" style={{ color: "#17120C" }}>{entry.fanName}</span>
                    <span className="text-[11px] px-1 py-0.5 rounded-sm" style={{ backgroundColor: `${FAN_TIER_COLORS[entry.fanTier]}20`, color: FAN_TIER_COLORS[entry.fanTier] }}>
                      {t(FAN_TIER_KEY[entry.fanTier] || entry.fanTier)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <span className="text-[11px] line-clamp-1 max-w-[220px]" style={{ color: "#5F5145" }}>{entry.contentPreview}</span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="text-[13px] flex items-center gap-1" style={{ color: entry.direction === "inbound" ? "#1D4ED8" : "#C9973F" }}>
                    {entry.direction === "inbound" ? <ArrowLeft size={10} /> : <ArrowRight size={10} />}
                    {entry.direction === "inbound" ? t("ledger.inbound") : t("ledger.outbound")}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="text-[11px]" style={{ color: "#5F5145" }}>{entry.creatorName}</span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="text-[12px] px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: `${statusColors[entry.status]}15`, color: statusColors[entry.status] }}>
                    {entry.status === "draft" ? t("ledger.draft") : entry.status === "approved" ? t("compliance.statusApproved") : entry.status === "sent" ? t("compliance.statusApproved") : t("ledger.flagged")}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span className="text-[11px] font-mono" style={{ color: entry.revenue ? "#2F7D4E" : "#6E6257" }}>
                    {entry.revenue ? formatEuro(entry.revenue) : "—"}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span className="text-[12px]" style={{ color: "#5F5145" }}>{formatRelative(entry.createdAt)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 text-[10px]">
        <span style={{ color: "#5F5145" }}>
          {entries.filter((e) => e.status === "sent").length} envoyés · {entries.filter((e) => e.status === "draft").length} brouillons · {entries.filter((e) => e.status === "flagged").length} signalés
        </span>
      </div>
    </div>
  );
}

// ═══ 18. Banned Keywords ════════════════════════════════

function BannedKeywordsSection() {
  const t = useT();
  const [keywords, setKeywords] = useState<BannedKeyword[]>(mockBannedKeywords);
  const [newKeyword, setNewKeyword] = useState("");

  const toggleKeyword = (id: string) => {
    setKeywords((prev) => prev.map((k) => k.id === id ? { ...k, isEnabled: !k.isEnabled } : k));
  };

  const severityColors: Record<string, string> = {
    critical: "#C54A3A", high: "#B7791F", medium: "#B45309", low: "#6E6257",
  };

  return (
    <div className="p-5 space-y-5">
      <div>
        <h2 className="text-[20px] font-display font-semibold" style={{ color: "#17120C" }}>{t("banned.heading")}</h2>
        <SectionInfoBar description={t("sectionDesc.bannedKeywords")} />
        <p className="text-[14px] mt-1.5" style={{ color: "#5F5145" }}>{t("banned.subtitle")}</p>
      </div>

      {/* Add custom keyword */}
      <div className="flex items-center gap-2">
        <input value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)}
          placeholder={t("banned.addKeywordPlaceholder")}
          className="flex-1 text-[11px] px-3 py-2 rounded-sm outline-none bg-transparent"
          style={{ color: "#17120C", border: "1px solid #D9CCBB" }}
          onKeyDown={(e) => { if (e.key === "Enter" && newKeyword.trim()) {
            setKeywords((prev) => [{ id: `bk-custom-${Date.now()}`, keyword: newKeyword.trim(), category: "custom", severity: "medium", appliesTo: ["drafts", "manual"], replacement: null, isEnabled: true, createdAt: new Date().toISOString() }, ...prev]);
            setNewKeyword("");
          }}} />
        <button
          onClick={() => { if (newKeyword.trim()) {
            setKeywords((prev) => [{ id: `bk-custom-${Date.now()}`, keyword: newKeyword.trim(), category: "custom", severity: "medium", appliesTo: ["drafts", "manual"], replacement: null, isEnabled: true, createdAt: new Date().toISOString() }, ...prev]);
            setNewKeyword("");
          }}}
          disabled={!newKeyword.trim()}
          className="flex items-center gap-1.5 text-[11px] px-3 py-2 rounded-sm transition-all disabled:opacity-30"
          style={{ backgroundColor: "#C9973F", color: "#FFFFFF", fontWeight: 600 }}>
          <Plus size={12} /> Ajouter
        </button>
      </div>

      {/* Keywords table */}
      <div className="rounded-sm border overflow-hidden" style={{ borderColor: "#E5D7C3" }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid #E5D7C3" }}>
              <th className="text-left text-[10px] font-medium px-4 py-2.5" style={{ color: "#5F5145" }}>{t("banned.keyword")}</th>
              <th className="text-left text-[10px] font-medium px-4 py-2.5" style={{ color: "#5F5145" }}>{t("banned.category")}</th>
              <th className="text-left text-[10px] font-medium px-4 py-2.5" style={{ color: "#5F5145" }}>{t("banned.severity")}</th>
              <th className="text-left text-[10px] font-medium px-4 py-2.5" style={{ color: "#5F5145" }}>{t("banned.appliedTo")}</th>
              <th className="text-left text-[10px] font-medium px-4 py-2.5" style={{ color: "#5F5145" }}>{t("banned.replacement")}</th>
              <th className="text-center text-[10px] font-medium px-4 py-2.5" style={{ color: "#5F5145" }}>{t("banned.active")}</th>
            </tr>
          </thead>
          <tbody>
            {keywords.map((kw) => (
              <tr key={kw.id} className="transition-colors hover:bg-black/[0.02]" style={{ borderBottom: "1px solid #EBE3D7", opacity: kw.isEnabled ? 1 : 0.5 }}>
                <td className="px-4 py-2.5">
                  <code className="text-[11px] font-mono px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: "#EBE3D7", color: "#17120C" }}>{kw.keyword}</code>
                </td>
                <td className="px-4 py-2.5">
                  <span className="text-[13px] px-1.5 py-0.5 rounded-sm" style={{
                    backgroundColor: kw.category === "system" ? "rgba(197,74,58,0.08)" : "rgba(29,77,216,0.08)",
                    color: kw.category === "system" ? "#C54A3A" : "#1D4ED8",
                  }}>{t(`bannedCat.${kw.category}`)}</span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="text-[13px] font-medium capitalize" style={{ color: severityColors[kw.severity] }}>{kw.severity}</span>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1">
                    {kw.appliesTo.map((a) => (
                      <span key={a} className="text-[11px] px-1 py-0.5 rounded-sm" style={{ backgroundColor: "#F1EBE2", color: "#5F5145" }}>
                        {t(`bannedApplies.${a}`)}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <span className="text-[13px]" style={{ color: kw.replacement ? "#2F7D4E" : "#5F5145" }}>
                    {kw.replacement || "— (bloqué)"}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-center">
                  <button onClick={() => toggleKeyword(kw.id)}
                    className="w-8 h-4.5 rounded-full transition-colors relative"
                    style={{ backgroundColor: kw.isEnabled ? "#C9973F" : "#B8ADA0" }}>
                    <div className="w-3 h-3 rounded-full absolute top-[3px] transition-all bg-white"
                      style={{ left: kw.isEnabled ? "17px" : "3px" }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══ 19. Creator Intelligence Profile ══════════════════════

function CreatorProfileSection() {
  const t = useT();
  const [profile] = useState<CreatorProfile>(mockCreatorProfile);

  return (
    <div className="p-5 space-y-5">
      <div>
        <h2 className="text-[20px] font-display font-semibold" style={{ color: "#17120C" }}>{t("creatorProfile.heading")}</h2>
        <SectionInfoBar description={t("sectionDesc.creatorProfile")} />
        <p className="text-[14px] mt-1.5" style={{ color: "#5F5145" }}>{t("creatorProfile.subtitle")}</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left column — Persona card */}
        <div className="space-y-4">
          <div className="p-5 rounded-sm border" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5D7C3", boxShadow: "0 1px 3px rgba(23,18,12,0.04)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-sm flex items-center justify-center text-lg font-semibold" style={{ backgroundColor: "rgba(216,169,91,0.12)", color: "#C9973F", border: "1px solid rgba(216,169,91,0.2)" }}>
                <UserCog size={22} />
              </div>
              <div>
                <h3 className="text-[12px] font-medium" style={{ color: "#17120C" }}>Persona</h3>
                <p className="text-[13px] mt-0.5" style={{ color: "#5F5145" }}>{profile.persona}</p>
              </div>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between"><span style={{ color: "#5F5145" }}>Timezone</span><span style={{ color: "#5F5145" }}>{profile.timezone}</span></div>
              <div className="flex justify-between"><span style={{ color: "#5F5145" }}>{t("creatorProfile.activeHours")}</span><span style={{ color: "#5F5145" }}>{profile.activeHours}</span></div>
              <div className="flex justify-between"><span style={{ color: "#5F5145" }}>Ton</span>
                <span className="px-1.5 py-0.5 rounded-sm text-[10px]" style={{ backgroundColor: "rgba(216,169,91,0.08)", color: "#C9973F" }}>{t(`tone.${profile.tone}`)}</span>
              </div>
              <div className="flex justify-between"><span style={{ color: "#5F5145" }}>Langues</span>
                <span style={{ color: "#17120C" }}>{profile.languages.map((l) => l.toUpperCase()).join(", ")}</span>
              </div>
            </div>
          </div>

          {/* Platforms */}
          <div className="p-4 rounded-sm border" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5D7C3", boxShadow: "0 1px 3px rgba(23,18,12,0.04)" }}>
            <h3 className="text-[13px] font-medium mb-2" style={{ color: "#5F5145" }}>{t("creatorProfile.activePlatforms")}</h3>
            <div className="flex flex-wrap gap-1.5">
              {profile.platforms.map((p) => (
                <span key={p} className="text-[13px] px-2 py-1 rounded-sm" style={{ backgroundColor: "#EBE3D7", color: "#5F5145" }}>
                  {t(`platform.${p}`)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Center — Bio */}
        <div className="space-y-4">
          <div className="p-4 rounded-sm border" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5D7C3", boxShadow: "0 1px 3px rgba(23,18,12,0.04)" }}>
            <h3 className="text-[13px] font-medium mb-2" style={{ color: "#5F5145" }}>Bio</h3>
            <p className="text-[11px] leading-relaxed" style={{ color: "#5F5145" }}>{profile.bio}</p>
          </div>
          {/* Boundaries */}
          <div className="p-4 rounded-sm border" style={{ backgroundColor: "rgba(197,74,58,0.04)", borderColor: "rgba(197,74,58,0.1)" }}>
            <h3 className="text-[13px] font-medium mb-2 flex items-center gap-1.5" style={{ color: "#C54A3A" }}>
              <AlertTriangle size={10} /> {t("creatorProfile.strictBoundaries")}
            </h3>
            <ul className="space-y-1">
              {profile.boundaries.map((b, i) => (
                <li key={i} className="text-[13px] flex items-start gap-1.5" style={{ color: "#5F5145" }}>
                  <X size={10} style={{ color: "#C54A3A", marginTop: "1px", flexShrink: 0 }} /> {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right — Do / Don't */}
        <div className="space-y-4">
          <div className="p-4 rounded-sm border" style={{ backgroundColor: "rgba(47,125,78,0.04)", borderColor: "rgba(47,125,78,0.1)" }}>
            <h3 className="text-[13px] font-medium mb-2 flex items-center gap-1.5" style={{ color: "#2F7D4E" }}>
              <CheckCircle size={10} /> {t("creatorProfile.toDo")}
            </h3>
            <ul className="space-y-1">
              {profile.doRules.map((r, i) => (
                <li key={i} className="text-[13px] flex items-start gap-1.5" style={{ color: "#5F5145" }}>
                  <CheckCircle size={10} style={{ color: "#2F7D4E", marginTop: "1px", flexShrink: 0 }} /> {r}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 rounded-sm border" style={{ backgroundColor: "rgba(183,121,31,0.04)", borderColor: "rgba(183,121,31,0.1)" }}>
            <h3 className="text-[13px] font-medium mb-2 flex items-center gap-1.5" style={{ color: "#B7791F" }}>
              <Ban size={10} /> {t("creatorProfile.notToDo")}
            </h3>
            <ul className="space-y-1">
              {profile.dontRules.map((r, i) => (
                <li key={i} className="text-[13px] flex items-start gap-1.5" style={{ color: "#5F5145" }}>
                  <Ban size={10} style={{ color: "#B7791F", marginTop: "1px", flexShrink: 0 }} /> {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══ 20. Notifications Center ════════════════════════════

function NotificationsCenterSection() {
  const t = useT();
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [typeFilter, setTypeFilter] = useState("");

  const filtered = typeFilter ? notifications.filter((n) => n.type === typeFilter) : notifications;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const priorityColors: Record<string, string> = {
    high: "#C54A3A", medium: "#B7791F", low: "#6E6257",
  };

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-display font-semibold" style={{ color: "#17120C" }}>{t("notifications.heading")}</h2>
          <SectionInfoBar description={t("sectionDesc.notificationsCenter")} />
          <p className="text-[14px] mt-1.5" style={{ color: "#5F5145" }}>
            {unreadCount} non lues sur {notifications.length} notifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className="text-[14px] px-3 py-2 rounded-sm outline-none"
            style={{ backgroundColor: "#EBE3D7", color: typeFilter ? "#17120C" : "#6E6257", border: "1px solid #D9CCBB" }}>
            <option value="">Tous les types</option>
            {Object.entries(NOTIF_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-[13px] px-2.5 py-1.5 rounded-sm" style={{ backgroundColor: "#EBE3D7", color: "#5F5145" }}>
              {t("notifications.markAllRead")}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        {filtered.map((notif) => (
          <button key={notif.id} onClick={() => markRead(notif.id)}
            className="w-full text-left flex items-start gap-4 px-4 py-3 rounded-sm border transition-all"
            style={{
              backgroundColor: notif.isRead ? "transparent" : "rgba(216,169,91,0.03)",
              borderColor: notif.isRead ? "#EBE3D7" : "rgba(216,169,91,0.1)",
            }}>
            <div className="flex items-center gap-2 w-[100px] shrink-0">
              {!notif.isRead && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#C9973F" }} />}
              <span className="text-[12px] px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: `${priorityColors[notif.priority]}15`, color: priorityColors[notif.priority] }}>
                {notif.priority === "high" ? t("notifications.high") : notif.priority === "medium" ? t("notifications.medium") : t("notifications.low")}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[12px] px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: "#F1EBE2", color: "#5F5145" }}>
                  {t(`notifType.${notif.type}`)}
                </span>
                <span className="text-[11px] font-medium" style={{ color: notif.isRead ? "#6E6257" : "#17120C" }}>
                  {notif.title}
                </span>
                {notif.revenue !== null && (
                  <span className="text-[13px] font-mono ml-auto shrink-0" style={{ color: "#2F7D4E" }}>+{formatEuro(notif.revenue)}</span>
                )}
              </div>
              <p className="text-[13px] truncate" style={{ color: "#5F5145" }}>{notif.description}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[12px]" style={{ color: "#5F5145" }}>{formatRelative(notif.timestamp)}</span>
                <div className="flex items-center gap-1">
                  {notif.channels.map((ch) => (
                    <span key={ch} className="text-[11px] px-1 py-0.5 rounded-sm" style={{ backgroundColor: "#F2EDE4", color: "#5F5145" }}>
                      {t(`notifChannel.${ch}`)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══ 21. Creative Engine / AI Reels ════════════════════════

function CreativeEngineSection() {
  const t = useT();
  const [reels] = useState<AiReel[]>(mockAiReels);
  const [selectedReelId, setSelectedReelId] = useState<string | null>(null);

  const selectedReel = reels.find((r) => r.id === selectedReelId) || null;

  const statusColors: Record<string, string> = {
    draft: "#C9973F", reviewed: "#6D28D9", approved: "#2F7D4E", published: "#1D4ED8",
  };

  const statusLabels: Record<string, string> = {
    draft: t("ledger.draft"), reviewed: t("creative.reviewed"), approved: t("compliance.statusApproved"), published: t("creative.published"),
  };

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-display font-semibold" style={{ color: "#17120C" }}>{t("creative.heading")}</h2>
          <SectionInfoBar description={t("sectionDesc.creativeEngine")} />
          <p className="text-[14px] mt-1.5" style={{ color: "#5F5145" }}>{t("creative.subtitle")}</p>
        </div>
      </div>

      {/* Warning banner */}
      <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-sm"
        style={{ backgroundColor: "rgba(216,169,91,0.06)", border: "1px dashed rgba(216,169,91,0.15)" }}>
        <Sparkles size={12} style={{ color: "#C9973F" }} />
        <span className="text-[13px] font-medium" style={{ color: "#C9973F" }}>{t("creative.warningBanner")}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {reels.map((reel) => (
          <button key={reel.id} onClick={() => setSelectedReelId(selectedReelId === reel.id ? null : reel.id)}
            className="text-left p-4 rounded-sm border transition-all"
            style={{
              backgroundColor: selectedReelId === reel.id ? "rgba(216,169,91,0.04)" : "#FFFFFF",
              borderColor: selectedReelId === reel.id ? "rgba(216,169,91,0.2)" : "#E5D7C3",
            }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Video size={14} style={{ color: "#C9973F" }} />
                <h3 className="text-[12px] font-medium" style={{ color: "#17120C" }}>{reel.title}</h3>
              </div>
              <span className="text-[12px] px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: `${statusColors[reel.status]}15`, color: statusColors[reel.status] }}>
                {statusLabels[reel.status]}
              </span>
            </div>

            {selectedReelId === reel.id && (
              <div className="mt-3 space-y-3 pt-3 border-t" style={{ borderColor: "#E5D7C3" }}>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div><span style={{ color: "#5F5145" }}>Plateforme</span>
                    <p style={{ color: "#5F5145" }}>{t(`reelPlatform.${reel.platform}`)}</p></div>
                  <div><span style={{ color: "#5F5145" }}>{t("creative.duration")}</span>
                    <p style={{ color: "#5F5145" }}>{reel.duration}</p></div>
                  <div><span style={{ color: "#5F5145" }}>{t("creative.viralScore")}</span>
                    <p className="font-mono font-semibold" style={{ color: reel.viralScore > 85 ? "#2F7D4E" : "#C9973F" }}>{reel.viralScore}/100</p></div>
                </div>

                <div className="space-y-2">
                  <div className="p-2 rounded-sm" style={{ backgroundColor: "rgba(29,77,216,0.06)" }}>
                    <span className="text-[12px] font-medium" style={{ color: "#1D4ED8" }}>HOOK</span>
                    <p className="text-[13px] mt-0.5 leading-relaxed" style={{ color: "#5F5145" }}>{reel.hook}</p>
                  </div>
                  <div className="p-2 rounded-sm" style={{ backgroundColor: "#F2EDE4" }}>
                    <span className="text-[12px] font-medium" style={{ color: "#5F5145" }}>BODY</span>
                    <p className="text-[13px] mt-0.5 leading-relaxed" style={{ color: "#5F5145" }}>{reel.body}</p>
                  </div>
                  <div className="p-2 rounded-sm" style={{ backgroundColor: "rgba(47,125,78,0.04)" }}>
                    <span className="text-[12px] font-medium" style={{ color: "#2F7D4E" }}>CTA</span>
                    <p className="text-[13px] mt-0.5 leading-relaxed" style={{ color: "#5F5145" }}>{reel.cta}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: "#E5D7C3" }}>
                  <span className="text-[12px]" style={{ color: "#5F5145" }}>Trend: {reel.trendAlignment}</span>
                  {reel.reviewedBy && (
                    <span className="text-[12px] ml-auto" style={{ color: "#5F5145" }}>{t("creative.reviewedBy")} {reel.reviewedBy}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-sm" style={{ backgroundColor: "rgba(47,125,78,0.1)", color: "#2F7D4E" }}>
                    <CheckCircle size={10} /> {t("creative.approveScript")}
                  </button>
                  <button className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-sm" style={{ backgroundColor: "rgba(29,77,216,0.1)", color: "#1D4ED8" }}>
                    <Edit3 size={10} /> Modifier
                  </button>
                  <button className="text-[13px] px-2 py-1" style={{ color: "#5F5145" }}>{t("creative.ignore")}</button>
                </div>
              </div>
            )}

            {selectedReelId !== reel.id && (
              <>
                <p className="text-[13px] mt-1.5 line-clamp-2" style={{ color: "#5F5145" }}>{reel.description}</p>
                <div className="flex items-center gap-3 mt-2 text-[9px]">
                  <span style={{ color: "#5F5145" }}>{t(`reelPlatform.${reel.platform}`)}</span>
                  <span style={{ color: "#5F5145" }}>{reel.duration}</span>
                  <span className="font-mono" style={{ color: "#C9973F" }}>{t("creative.viral")} {reel.viralScore}</span>
                </div>
              </>
            )}
          </button>
        ))}
      </div>

      {/* Consent reminder */}
      <div className="p-3 rounded-sm border text-center" style={{ backgroundColor: "#F5F1EB", borderColor: "#EBE3D7" }}>
        <p className="text-[12px]" style={{ color: "#8A7E72" }}>
          Toute publication nécessite l&apos;approbation explicite de la créatrice. L&apos;IA ne publie jamais automatiquement.
        </p>
      </div>
    </div>
  );
}

// ═══ 22. Roadmap / Feature Requests ════════════════════════

function RoadmapSection() {
  const t = useT();
  const [features] = useState<FeatureRequest[]>(mockFeatureRequests);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  const filtered = categoryFilter ? features.filter((f) => f.category === categoryFilter) : features;

  const handleUpvote = (id: string) => {
    setVotedIds((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };

  const statusColors: Record<string, string> = {
    planned: "#1D4ED8", in_progress: "#C9973F", shipped: "#2F7D4E", under_review: "#6D28D9",
  };

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-display font-semibold" style={{ color: "#17120C" }}>{t("roadmap.heading")}</h2>
          <SectionInfoBar description={t("sectionDesc.roadmap")} />
          <p className="text-[14px] mt-1.5" style={{ color: "#5F5145" }}>{t("roadmap.subtitle")}</p>
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-[14px] px-3 py-2 rounded-sm outline-none"
          style={{ backgroundColor: "#EBE3D7", color: categoryFilter ? "#17120C" : "#6E6257", border: "1px solid #D9CCBB" }}>
          <option value="">{t("compliance.allCategories")}</option>
          {Object.entries(FEATURE_CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Top agency requests highlight */}
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-medium px-2.5 py-1 rounded-sm" style={{ backgroundColor: "rgba(216,169,91,0.08)", color: "#C9973F" }}>
          {t("roadmap.topAgencyRequests")}
        </span>
        <div className="h-px flex-1" style={{ backgroundColor: "#EBE3D7" }} />
      </div>

      <div className="space-y-2">
        {filtered.map((feature) => {
          const hasVoted = votedIds.has(feature.id);
          return (
            <div key={feature.id} className="flex items-start gap-4 p-4 rounded-sm border"
              style={{ backgroundColor: "#FFFFFF", borderColor: feature.agencyRequest ? "rgba(216,169,91,0.1)" : "#E5D7C3" }}>
              {/* Upvote */}
              <button onClick={() => handleUpvote(feature.id)}
                className="flex flex-col items-center px-2 py-1.5 rounded-sm transition-all shrink-0 min-w-[40px]"
                style={{
                  backgroundColor: hasVoted ? "rgba(216,169,91,0.1)" : "#F2EDE4",
                  color: hasVoted ? "#C9973F" : "#6E6257",
                  border: `1px solid ${hasVoted ? "rgba(216,169,91,0.2)" : "#EBE3D7"}`,
                }}>
                <ThumbsUp size={14} />
                <span className="text-[11px] font-mono font-semibold mt-0.5">{feature.upvotes + (hasVoted ? 1 : 0)}</span>
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[12px] font-medium" style={{ color: "#17120C" }}>{feature.title}</h3>
                  {feature.agencyRequest && (
                    <span className="text-[11px] px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: "rgba(216,169,91,0.08)", color: "#C9973F" }}>
                      {t("roadmap.agencyRequest")}
                    </span>
                  )}
                </div>
                <p className="text-[13px] mb-2" style={{ color: "#5F5145" }}>{feature.description}</p>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: `${statusColors[feature.status]}15`, color: statusColors[feature.status] }}>
                    {t(`featureStatus.${feature.status}`)}
                  </span>
                  <span className="text-[12px]" style={{ color: "#5F5145" }}>{t(`featureCat.${feature.category}`)}</span>
                  <span className="text-[12px]" style={{ color: "#8A7E72" }}>{feature.requestedBy}</span>
                  <span className="text-[12px] ml-auto" style={{ color: "#B8ADA0" }}>{formatRelative(feature.createdAt)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit idea */}
      <div className="p-3 rounded-sm border text-center" style={{ backgroundColor: "#F5F1EB", borderColor: "#EBE3D7" }}>
        <button className="flex items-center gap-1.5 mx-auto text-[11px] px-3 py-2 rounded-sm" style={{ backgroundColor: "#C9973F", color: "#FFFFFF", fontWeight: 600 }}>
          <Lightbulb size={12} /> {t("roadmap.submitIdea")}
        </button>
      </div>
    </div>
  );
}

export default AtlasInboxV2;
