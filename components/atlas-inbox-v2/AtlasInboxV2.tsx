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
} from "lucide-react";
import {
  mockConversations, mockPricingScenarios, mockSavedSegments,
  mockAutomationRules, mockTrackingLinks, mockBrowserTabs,
  mockFeedPosts, mockDMs, mockCampaigns, mockFanJourneyStages,
  mockOpportunities, mockTeamMembers, mockTeamActivity,
  mockComplianceItems, mockSafetyReasons, mockGuardSettings,
  NAV_GROUPS, FAN_TIER_LABELS, FAN_TIER_COLORS,
  STATUS_LABELS, STATUS_COLORS, PLATFORM_LABELS,
  OPPORTUNITY_STAGE_LABELS, OPPORTUNITY_STAGE_COLORS,
  OPPORTUNITY_TYPE_LABELS, OPPORTUNITY_TYPE_COLORS,
  CAMPAIGN_STEP_LABELS, CAMPAIGN_STEP_ORDER, CAMPAIGN_TYPE_LABELS,
  TRIGGER_EVENT_LABELS, TRIGGER_ACTION_LABELS,
  GUARD_CATEGORY_LABELS, RISK_CATEGORY_LABELS,
  AVAILABLE_FILTER_FIELDS,
  formatEuro, formatRelative,
  type SectionId, type AIConversation, type AIDraft,
  type PricingScenario, type CampaignBuild,
  type CampaignStep, type OpportunityStage,
  type SalesOpportunity, type AutomationRule,
  type TrackingLink, type TeamMember,
  type ComplianceReviewItem, type SafetyGuardSetting,
  type SafetyReason, type FanFilter, type SavedSegment,
} from "./data";

// ═══ Main Component ═══════════════════════════════════════

export function AtlasInboxV2() {
  const [activeSection, setActiveSection] = useState<SectionId>("sales_engine");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div
      className="flex h-[calc(100vh-4rem)] overflow-hidden -m-4 md:-m-8"
      style={{ backgroundColor: "var(--bg-primary, #0C0A08)" }}
    >
      {/* ─── Sidebar ──────────────────────────────────── */}
      <aside
        className={`${
          sidebarCollapsed ? "w-[52px]" : "w-[230px]"
        } shrink-0 flex flex-col border-r transition-all duration-200 overflow-y-auto`}
        style={{ borderColor: "var(--border-default)" }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-2 px-4 py-3.5 border-b shrink-0"
          style={{ borderColor: "var(--border-default)" }}
        >
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="text-[11px] font-display font-semibold tracking-wider" style={{ color: "var(--text-primary)" }}>
                ATLAS INBOX
              </h1>
              <p className="text-[9px] mt-0.5 tracking-wide" style={{ color: "var(--accent)" }}>V2 — Sales Engine</p>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded-sm hover:bg-white/[0.04] transition-colors shrink-0"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronRight size={14} className="rotate-180" />}
          </button>
        </div>

        {/* Nav Groups */}
        <div className="flex-1 py-2">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-2">
              {!sidebarCollapsed && (
                <p
                  className="text-[9px] font-medium tracking-widest px-4 py-1.5"
                  style={{ color: "rgba(255,255,255,0.18)" }}
                >
                  {group.label}
                </p>
              )}
              {group.sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-2.5 text-left transition-colors ${
                      sidebarCollapsed ? "px-3 py-2.5 justify-center" : "px-4 py-2"
                    }`}
                    style={{
                      backgroundColor: isActive ? "rgba(216,169,91,0.08)" : "transparent",
                      borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                      color: isActive ? "var(--text-primary)" : "rgba(255,255,255,0.35)",
                    }}
                  >
                    <Icon size={14} style={{ color: isActive ? "var(--accent)" : "rgba(255,255,255,0.25)" }} />
                    {!sidebarCollapsed && (
                      <span className="text-[11px] font-medium truncate">{section.label}</span>
                    )}
                    {isActive && !sidebarCollapsed && (
                      <div className="ml-auto w-1 h-1 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer badge */}
        {!sidebarCollapsed && (
          <div className="px-4 py-3 border-t" style={{ borderColor: "var(--border-default)" }}>
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm"
              style={{ backgroundColor: "rgba(216,169,91,0.06)" }}
            >
              <ShieldCheck size={11} style={{ color: "var(--accent)" }} />
              <span className="text-[9px] font-medium" style={{ color: "var(--accent)" }}>
                IA propose → Humain valide
              </span>
            </div>
          </div>
        )}
      </aside>

      {/* ─── Content Area ─────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
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
        </div>
      </main>
    </div>
  );
}

// ═══ 1. AI Sales Engine ═════════════════════════════════

function SalesEngineSection() {
  const [conversations] = useState<AIConversation[]>(mockConversations);
  const [selectedId, setSelectedId] = useState<string | null>(null);
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
      <div className="w-[320px] shrink-0 border-r flex flex-col" style={{ borderColor: "var(--border-default)" }}>
        <div className="p-4 border-b shrink-0" style={{ borderColor: "var(--border-default)" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold font-display" style={{ color: "var(--text-primary)" }}>Sales Engine</h2>
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
              {conversations.length} conversations
            </span>
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.2)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un fan..."
              className="w-full pl-8 pr-3 py-1.5 text-[11px] rounded-sm outline-none bg-transparent"
              style={{ color: "var(--text-primary)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedId(conv.id)}
              className="w-full text-left px-4 py-3 transition-colors"
              style={{
                backgroundColor: selectedId === conv.id ? "rgba(216,169,91,0.06)" : "transparent",
                borderLeft: selectedId === conv.id ? "2px solid var(--accent)" : "2px solid transparent",
              }}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className="w-8 h-8 rounded-sm flex items-center justify-center text-xs font-semibold shrink-0"
                  style={{ backgroundColor: `${FAN_TIER_COLORS[conv.fanTier]}20`, color: FAN_TIER_COLORS[conv.fanTier], border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  {conv.fanName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-medium truncate" style={{ color: "var(--text-primary)" }}>{conv.fanName}</span>
                    <span className="text-[9px] shrink-0" style={{ color: "rgba(255,255,255,0.2)" }}>{formatRelative(conv.lastActivity)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] px-1.5 py-0.5 rounded-sm font-medium" style={{ backgroundColor: `${FAN_TIER_COLORS[conv.fanTier]}20`, color: FAN_TIER_COLORS[conv.fanTier] }}>
                      {FAN_TIER_LABELS[conv.fanTier]}
                    </span>
                    <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>{PLATFORM_LABELS[conv.platform]}</span>
                  </div>
                  <p className="text-[11px] mt-1.5 leading-relaxed line-clamp-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {conv.lastMessagePreview}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {conv.complianceFlags.length > 0 && (
                      <span className="flex items-center gap-0.5 text-[9px]" style={{ color: "var(--warning)" }}>
                        <AlertTriangle size={9} /> {conv.complianceFlags.length}
                      </span>
                    )}
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded-sm font-medium"
                      style={{ backgroundColor: `${STATUS_COLORS[conv.status]}15`, color: STATUS_COLORS[conv.status] }}
                    >
                      {STATUS_LABELS[conv.status]}
                    </span>
                    {conv.unread && (
                      <span className="w-1.5 h-1.5 rounded-full ml-auto" style={{ backgroundColor: "var(--accent)" }} />
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
            <MessageCircle size={32} style={{ color: "rgba(255,255,255,0.04)" }} />
            <p className="text-sm mt-3 font-medium" style={{ color: "rgba(255,255,255,0.15)" }}>Sélectionne une conversation</p>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.08)" }}>L&apos;IA te proposera des suggestions de réponse</p>
          </div>
        ) : (
          <>
            {/* Conversation Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b shrink-0" style={{ borderColor: "var(--border-default)" }}>
              <div className="w-9 h-9 rounded-sm flex items-center justify-center text-xs font-semibold shrink-0" style={{ backgroundColor: `${FAN_TIER_COLORS[selectedConv.fanTier]}20`, color: FAN_TIER_COLORS[selectedConv.fanTier], border: "1px solid rgba(255,255,255,0.06)" }}>
                {selectedConv.fanName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{selectedConv.fanName}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-medium" style={{ backgroundColor: `${FAN_TIER_COLORS[selectedConv.fanTier]}20`, color: FAN_TIER_COLORS[selectedConv.fanTier] }}>
                    {FAN_TIER_LABELS[selectedConv.fanTier]}
                  </span>
                </div>
                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                  {PLATFORM_LABELS[selectedConv.platform]} · {formatEuro(selectedConv.totalSpent)} dépensé · Score {selectedConv.intentScore}/100
                </span>
              </div>
              {selectedConv.complianceFlags.length > 0 && (
                <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-sm" style={{ backgroundColor: "rgba(201,106,74,0.1)", color: "var(--warning)" }}>
                  <AlertTriangle size={10} /> {selectedConv.complianceFlags.join(", ")}
                </span>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {selectedConv.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.direction === "inbound" ? "justify-start" : "justify-end"}`}>
                  <div
                    className="max-w-[70%] rounded-sm px-3.5 py-2.5"
                    style={{
                      backgroundColor: msg.direction === "inbound" ? "rgba(255,255,255,0.05)" : "rgba(216,169,91,0.12)",
                      borderBottomLeftRadius: msg.direction === "inbound" ? 0 : undefined,
                      borderBottomRightRadius: msg.direction === "outbound" ? 0 : undefined,
                    }}
                  >
                    <p className="text-[13px] leading-relaxed break-words" style={{ color: "var(--text-primary)" }}>{msg.content}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                        {new Date(msg.occurredAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {msg.aiGenerated && (
                        <span className="text-[8px] px-1 py-0.5 rounded-sm" style={{ backgroundColor: "rgba(216,169,91,0.12)", color: "var(--accent)" }}>IA</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* AI Drafts Section */}
              {selectedConv.drafts.length > 0 && (
                <div className="space-y-2.5 mt-6 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
                    <span className="text-[10px] font-medium flex items-center gap-1" style={{ color: "var(--accent)" }}>
                      <Zap size={10} /> Brouillons IA · {selectedConv.drafts.length} suggestions
                    </span>
                    <div className="h-px flex-1" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
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
                  <Loader size={16} className="animate-spin" style={{ color: "var(--accent)" }} />
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="px-4 py-3 border-t shrink-0" style={{ borderColor: "var(--border-default)" }}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleGenerate(selectedConv.id)}
                  disabled={generatingId === selectedConv.id || selectedConv.drafts.length === 0}
                  className="flex items-center gap-1.5 text-[11px] px-3 py-2 rounded-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "rgba(216,169,91,0.12)", color: "var(--accent)" }}
                >
                  {generatingId === selectedConv.id ? (
                    <><Loader size={13} className="animate-spin" /> Génération...</>
                  ) : (
                    <><Zap size={13} /> Régénérer les drafts IA</>
                  )}
                </button>
                <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.15)" }}>
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
  const approachColors: Record<string, string> = {
    chaleureuse: "var(--success)",
    directe: "var(--accent)",
    joueuse: "#F59E0B",
    professionnelle: "#3B82F6",
    complice: "#8B5CF6",
  };

  if (isApproved) {
    return (
      <div className="p-3 rounded-sm border" style={{ backgroundColor: "rgba(143,181,138,0.06)", borderColor: "rgba(143,181,138,0.15)" }}>
        <div className="flex items-center gap-1.5">
          <CheckCircle size={13} style={{ color: "var(--success)" }} />
          <span className="text-[11px] font-medium" style={{ color: "var(--success)" }}>Approuvé — prêt à envoyer</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-3.5 rounded-sm border transition-all"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: isRejected ? "rgba(255,255,255,0.06)" : "rgba(216,169,91,0.15)",
        opacity: isRejected ? 0.4 : 1,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="text-[9px] font-medium px-1.5 py-0.5 rounded-sm capitalize"
            style={{ backgroundColor: `${approachColors[draft.approach] || "rgba(255,255,255,0.05)"}20`, color: approachColors[draft.approach] || "rgba(255,255,255,0.4)" }}
          >
            {draft.approach}
          </span>
          <span className="text-[9px] flex items-center gap-1" style={{ color: "rgba(255,255,255,0.2)" }}>
            <TrendingUp size={9} /> {draft.estimatedEngagement}% engagement est.
          </span>
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={editText}
          onChange={(e) => onEditTextChange(e.target.value)}
          className="w-full bg-transparent text-[13px] leading-relaxed rounded-sm p-2 outline-none resize-none"
          style={{ color: "var(--text-primary)", border: "1px solid rgba(216,169,91,0.3)", minHeight: "80px" }}
          rows={3}
        />
      ) : (
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-primary)" }}>{draft.draftText}</p>
      )}

      {draft.aiWarning && (
        <p className="text-[10px] mt-1.5 flex items-center gap-1" style={{ color: "var(--warning)" }}>
          <AlertTriangle size={10} /> {draft.aiWarning}
        </p>
      )}

      <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t" style={{ borderColor: "var(--border-default)" }}>
        {isEditing ? (
          <>
            <button onClick={onSaveEdit} className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-sm" style={{ backgroundColor: "rgba(143,181,138,0.1)", color: "var(--success)" }}>
              <CheckCircle size={12} /> Sauver
            </button>
            <button onClick={onCancelEdit} className="text-[11px] px-2 py-1" style={{ color: "rgba(255,255,255,0.25)" }}>
              Annuler
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onApprove}
              disabled={isGenerating}
              className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-sm transition-colors"
              style={{ backgroundColor: "rgba(143,181,138,0.1)", color: "var(--success)" }}
            >
              <CheckCircle size={12} /> Approuver
            </button>
            <button
              onClick={onEdit}
              disabled={isGenerating}
              className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-sm transition-colors"
              style={{ backgroundColor: "rgba(59,130,246,0.1)", color: "#3B82F6" }}
            >
              <Edit3 size={12} /> Modifier
            </button>
            <button
              onClick={onReject}
              disabled={isGenerating}
              className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-sm transition-colors"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              <X size={12} /> Ignorer
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ═══ 2. Pricing Lab ════════════════════════════════════

function PricingLabSection() {
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

  const currentTier = selectedProduct.commissionTiers.findLast((t) => totalRevenue >= t.threshold) || selectedProduct.commissionTiers[0];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-sm font-display font-semibold" style={{ color: "var(--text-primary)" }}>Pricing & Commission Simulator</h2>
        <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Simule les prix et commissions pour maximiser ton revenu net</p>
      </div>

      {/* Product selector */}
      <div className="grid grid-cols-3 gap-2">
        {mockPricingScenarios.map((p) => (
          <button
            key={p.id}
            onClick={() => handleProductChange(p.id)}
            className="text-left p-3 rounded-sm border transition-all"
            style={{
              backgroundColor: selectedProduct.id === p.id ? "rgba(216,169,91,0.06)" : "var(--bg-card)",
              borderColor: selectedProduct.id === p.id ? "var(--accent)" : "var(--border-default)",
            }}
          >
            <span className="text-[11px] font-medium block" style={{ color: "var(--text-primary)" }}>{p.productName}</span>
            <span className="text-[9px] mt-1 block" style={{ color: "rgba(255,255,255,0.3)" }}>{p.type.replace(/_/g, " ")} · {p.audienceSize} fans</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Price slider */}
        <div className="col-span-2 space-y-4 p-5 rounded-sm border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-default)" }}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>Prix de vente</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setPrice(selectedProduct.suggestedPriceLow); setPriceLevel("low"); }}
                className={`text-[10px] px-2 py-1 rounded-sm ${priceLevel === "low" ? "" : ""}`}
                style={{ backgroundColor: priceLevel === "low" ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)", color: priceLevel === "low" ? "#3B82F6" : "rgba(255,255,255,0.3)" }}
              >Bas</button>
              <button
                onClick={() => { setPrice(selectedProduct.suggestedPriceMid); setPriceLevel("mid"); }}
                className={`text-[10px] px-2 py-1 rounded-sm`}
                style={{ backgroundColor: priceLevel === "mid" ? "rgba(216,169,91,0.15)" : "rgba(255,255,255,0.04)", color: priceLevel === "mid" ? "var(--accent)" : "rgba(255,255,255,0.3)" }}
              >Moyen</button>
              <button
                onClick={() => { setPrice(selectedProduct.suggestedPriceHigh); setPriceLevel("high"); }}
                className={`text-[10px] px-2 py-1 rounded-sm`}
                style={{ backgroundColor: priceLevel === "high" ? "rgba(143,181,138,0.15)" : "rgba(255,255,255,0.04)", color: priceLevel === "high" ? "var(--success)" : "rgba(255,255,255,0.3)" }}
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
            className="w-full accent-[var(--accent)]"
          />

          <div className="flex items-center justify-between text-[11px]">
            <span style={{ color: "rgba(255,255,255,0.3)" }}>{formatEuro(selectedProduct.suggestedPriceLow)}</span>
            <span className="text-lg font-semibold font-mono" style={{ color: "var(--accent)" }}>{formatEuro(price)}</span>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>{formatEuro(selectedProduct.suggestedPriceHigh)}</span>
          </div>

          {/* Revenue breakdown */}
          <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t" style={{ borderColor: "var(--border-default)" }}>
            <div className="text-center">
              <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>Frais plateforme</p>
              <p className="text-sm font-mono font-semibold mt-0.5" style={{ color: "var(--text-primary)" }}>{formatEuro(platformFeeAmount)}</p>
              <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.15)" }}>{(selectedProduct.platformFee * 100).toFixed(0)}%</p>
            </div>
            <div className="text-center">
              <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>Coût base</p>
              <p className="text-sm font-mono font-semibold mt-0.5" style={{ color: "var(--text-primary)" }}>{formatEuro(selectedProduct.costBase)}</p>
            </div>
            <div className="text-center">
              <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>Net / vente</p>
              <p className="text-sm font-mono font-semibold mt-0.5" style={{ color: "var(--success)" }}>{formatEuro(netRevenue)}</p>
              <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.15)" }}>{margin.toFixed(0)}% marge</p>
            </div>
            <div className="text-center">
              <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>Ventes estimées</p>
              <p className="text-sm font-mono font-semibold mt-0.5" style={{ color: "var(--text-primary)" }}>{conversions}</p>
              <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.15)" }}>{((conversions / selectedProduct.audienceSize) * 100).toFixed(1)}% de l&apos;audience</p>
            </div>
          </div>
        </div>

        {/* Commission tiers + totals */}
        <div className="space-y-4">
          <div className="p-5 rounded-sm border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-default)" }}>
            <h3 className="text-[11px] font-medium mb-3" style={{ color: "var(--text-primary)" }}>Tiers de commission</h3>
            <div className="space-y-2">
              {selectedProduct.commissionTiers.map((tier) => {
                const isActive = totalRevenue >= tier.threshold;
                return (
                  <div key={tier.label} className="flex items-center justify-between text-[11px] py-1.5 px-2 rounded-sm"
                    style={{ backgroundColor: isActive ? "rgba(216,169,91,0.06)" : "transparent" }}>
                    <span style={{ color: isActive ? "var(--text-primary)" : "rgba(255,255,255,0.3)" }}>{tier.label}</span>
                    <span style={{ color: isActive ? "var(--accent)" : "rgba(255,255,255,0.2)" }}>{(tier.rate * 100).toFixed(0)}% · &gt;{formatEuro(tier.threshold)}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--border-default)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>Tier actuel</span>
                <span className="text-[11px] font-semibold" style={{ color: "var(--accent)" }}>{currentTier.label} ({(currentTier.rate * 100).toFixed(0)}%)</span>
              </div>
            </div>
          </div>

          {/* Totals */}
          <div className="p-5 rounded-sm border" style={{ backgroundColor: "rgba(143,181,138,0.04)", borderColor: "rgba(143,181,138,0.1)" }}>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>Revenu brut estimé</p>
            <p className="text-xl font-mono font-semibold mt-0.5" style={{ color: "var(--text-primary)" }}>{formatEuro(totalRevenue)}</p>
            <p className="text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>Revenu net estimé</p>
            <p className="text-xl font-mono font-semibold mt-0.5" style={{ color: "var(--success)" }}>{formatEuro(totalNet)}</p>
            <p className="text-[9px] mt-2" style={{ color: "rgba(255,255,255,0.15)" }}>
              {conversions} ventes × {formatEuro(netRevenue)} net = {formatEuro(totalNet)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══ 3. Dynamic Lists Builder ═══════════════════════════

function ListsBuilderSection() {
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
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-sm font-display font-semibold" style={{ color: "var(--text-primary)" }}>Dynamic Lists Builder</h2>
        <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Crée des segments de fans dynamiques avec filtres pour campagnes ciblées</p>
      </div>

      {/* Filter builder */}
      <div className="p-4 rounded-sm border space-y-3" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-default)" }}>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={newFilterField}
            onChange={(e) => { setNewFilterField(e.target.value); setNewFilterOp(""); }}
            className="text-[11px] px-2.5 py-1.5 rounded-sm outline-none"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", color: newFilterField ? "var(--text-primary)" : "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <option value="">Champ...</option>
            {AVAILABLE_FILTER_FIELDS.map((f) => (
              <option key={f.field} value={f.field}>{f.label}</option>
            ))}
          </select>

          {currentField && (
            <select
              value={newFilterOp}
              onChange={(e) => setNewFilterOp(e.target.value)}
              className="text-[11px] px-2.5 py-1.5 rounded-sm outline-none"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", color: newFilterOp ? "var(--text-primary)" : "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <option value="">Opérateur...</option>
              {currentField.operators.map((op) => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          )}

          <input
            value={newFilterValue}
            onChange={(e) => setNewFilterValue(e.target.value)}
            placeholder={currentField?.hint || "Valeur..."}
            className="flex-1 min-w-[120px] text-[11px] px-2.5 py-1.5 rounded-sm outline-none bg-transparent"
            style={{ color: "var(--text-primary)", border: "1px solid rgba(255,255,255,0.08)" }}
            onKeyDown={(e) => { if (e.key === "Enter") addFilter(); }}
          />

          <button
            onClick={addFilter}
            disabled={!newFilterField || !newFilterOp || !newFilterValue}
            className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-sm transition-all disabled:opacity-30"
            style={{ backgroundColor: "rgba(216,169,91,0.12)", color: "var(--accent)" }}
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
                    style={{ backgroundColor: "rgba(216,169,91,0.08)", color: "var(--accent)" }}>
                    {fieldLabel} {f.operator} {f.value}
                    <button onClick={() => removeFilter(f.id)} style={{ color: "rgba(255,255,255,0.3)" }}><X size={10} /></button>
                  </span>
                );
              })}
            </div>
            <div className="flex items-center gap-4 pt-2 border-t" style={{ borderColor: "var(--border-default)" }}>
              <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                Fans estimés: <span className="font-semibold font-mono" style={{ color: "var(--text-primary)" }}>{estimatedFans}</span>
              </span>
              <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                Revenu potentiel: <span className="font-semibold font-mono" style={{ color: "var(--accent)" }}>{formatEuro(estimatedFans * 45)}</span>
              </span>
              <button className="text-[10px] px-2.5 py-1 rounded-sm ml-auto" style={{ backgroundColor: "rgba(216,169,91,0.12)", color: "var(--accent)" }}>
                Sauvegarder le segment
              </button>
            </div>
          </>
        )}
      </div>

      {/* Saved segments */}
      <div>
        <h3 className="text-[11px] font-medium mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>Segments sauvegardés</h3>
        <div className="grid grid-cols-2 gap-3">
          {savedSegments.map((seg) => (
            <div key={seg.id} className="p-4 rounded-sm border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-default)" }}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>{seg.name}</h4>
                <span className="text-[11px] font-mono font-semibold" style={{ color: "var(--accent)" }}>{seg.fanCount}</span>
              </div>
              <p className="text-[10px] mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>{seg.description}</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {seg.filters.slice(0, 3).map((f, i) => (
                  <span key={i} className="text-[9px] px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)" }}>
                    {f.field} {f.operator} {f.value}
                  </span>
                ))}
                {seg.filters.length > 3 && (
                  <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>+{seg.filters.length - 3}</span>
                )}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: "var(--border-default)" }}>
                <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>{formatEuro(seg.estimatedRevenue)} potentiel</span>
                <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.15)" }}>Créé {formatRelative(seg.createdAt)}</span>
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
  const [rules, setRules] = useState<AutomationRule[]>(mockAutomationRules);

  const toggleRule = (id: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, isEnabled: !r.isEnabled } : r)));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-display font-semibold" style={{ color: "var(--text-primary)" }}>Automation Triggers</h2>
          <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Règles WHEN → THEN pour automatiser les actions de vente</p>
        </div>
        <button className="flex items-center gap-1.5 text-[11px] px-3 py-2 rounded-sm" style={{ backgroundColor: "rgba(216,169,91,0.12)", color: "var(--accent)" }}>
          <Plus size={12} /> Nouvelle règle
        </button>
      </div>

      <div className="rounded-sm border overflow-hidden" style={{ borderColor: "var(--border-default)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-default)" }}>
              <th className="text-left text-[10px] font-medium px-4 py-2.5" style={{ color: "rgba(255,255,255,0.2)" }}>Règle</th>
              <th className="text-left text-[10px] font-medium px-4 py-2.5" style={{ color: "rgba(255,255,255,0.2)" }}>WHEN</th>
              <th className="text-left text-[10px] font-medium px-4 py-2.5" style={{ color: "rgba(255,255,255,0.2)" }}>IF</th>
              <th className="text-left text-[10px] font-medium px-4 py-2.5" style={{ color: "rgba(255,255,255,0.2)" }}>THEN</th>
              <th className="text-left text-[10px] font-medium px-4 py-2.5" style={{ color: "rgba(255,255,255,0.2)" }}>Statut</th>
              <th className="text-right text-[10px] font-medium px-4 py-2.5" style={{ color: "rgba(255,255,255,0.2)" }}>Déclenché</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.id} className="transition-colors hover:bg-white/[0.02]" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td className="px-4 py-3">
                  <span className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>{rule.name}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[11px] font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>{TRIGGER_EVENT_LABELS[rule.when]}</span>
                </td>
                <td className="px-4 py-3">
                  <code className="text-[10px] px-1.5 py-0.5 rounded-sm font-mono" style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)" }}>{rule.condition}</code>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[11px]" style={{ color: "var(--accent)" }}>{TRIGGER_ACTION_LABELS[rule.then]}</span>
                  <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>{rule.thenDetail}</p>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className="w-9 h-5 rounded-full transition-colors relative"
                    style={{ backgroundColor: rule.isEnabled ? "var(--accent)" : "rgba(255,255,255,0.1)" }}
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full absolute top-[3px] transition-all"
                      style={{ backgroundColor: "#fff", left: rule.isEnabled ? "18px" : "3px" }}
                    />
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-[11px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>{rule.triggeredCount}</span>
                  {rule.lastTriggered && (
                    <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.15)" }}>{formatRelative(rule.lastTriggered)}</p>
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
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-sm font-display font-semibold" style={{ color: "var(--text-primary)" }}>Tracking Links & Attribution</h2>
        <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Suis les clics, conversions et revenus par lien de tracking</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Clics totaux", value: totalClicks.toLocaleString(), color: "var(--text-primary)" },
          { label: "Conversions", value: totalConversions.toLocaleString(), color: "var(--success)" },
          { label: "Taux de conversion", value: `${avgRate.toFixed(1)}%`, color: "var(--accent)" },
          { label: "Revenu attribué", value: formatEuro(totalRevenue), color: "var(--success)" },
        ].map((kpi) => (
          <div key={kpi.label} className="p-4 rounded-sm border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-default)" }}>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>{kpi.label}</p>
            <p className="text-lg font-mono font-semibold mt-1" style={{ color: kpi.color }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Links table */}
      <div className="rounded-sm border overflow-hidden" style={{ borderColor: "var(--border-default)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-default)" }}>
              <th className="text-left text-[10px] font-medium px-4 py-2.5" style={{ color: "rgba(255,255,255,0.2)" }}>Nom</th>
              <th className="text-left text-[10px] font-medium px-4 py-2.5" style={{ color: "rgba(255,255,255,0.2)" }}>Campagne</th>
              <th className="text-left text-[10px] font-medium px-4 py-2.5" style={{ color: "rgba(255,255,255,0.2)" }}>Plateforme</th>
              <th className="text-right text-[10px] font-medium px-4 py-2.5" style={{ color: "rgba(255,255,255,0.2)" }}>Clics</th>
              <th className="text-right text-[10px] font-medium px-4 py-2.5" style={{ color: "rgba(255,255,255,0.2)" }}>Conv.</th>
              <th className="text-right text-[10px] font-medium px-4 py-2.5" style={{ color: "rgba(255,255,255,0.2)" }}>Taux</th>
              <th className="text-right text-[10px] font-medium px-4 py-2.5" style={{ color: "rgba(255,255,255,0.2)" }}>Revenu</th>
              <th className="text-center text-[10px] font-medium px-4 py-2.5" style={{ color: "rgba(255,255,255,0.2)" }}>Copier</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.id} className="transition-colors hover:bg-white/[0.02]" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td className="px-4 py-3">
                  <span className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>{link.name}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>{link.campaign}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)" }}>{PLATFORM_LABELS[link.platform]}</span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-[11px]" style={{ color: "var(--text-primary)" }}>{link.clicks.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-mono text-[11px]" style={{ color: "var(--success)" }}>{link.conversions}</td>
                <td className="px-4 py-3 text-right font-mono text-[11px]" style={{ color: "var(--accent)" }}>{link.conversionRate.toFixed(1)}%</td>
                <td className="px-4 py-3 text-right font-mono text-[11px]" style={{ color: "var(--text-primary)" }}>{formatEuro(link.revenue)}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleCopy(link.url, link.id)}
                    className="p-1.5 rounded-sm transition-colors"
                    style={{ color: copiedId === link.id ? "var(--success)" : "rgba(255,255,255,0.2)" }}
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
  const [activeTabId, setActiveTabId] = useState(mockBrowserTabs[0].id);
  const activeTab = mockBrowserTabs.find((t) => t.id === activeTabId) || mockBrowserTabs[0];

  return (
    <div className="p-6 space-y-4 h-full flex flex-col">
      <div>
        <h2 className="text-sm font-display font-semibold" style={{ color: "var(--text-primary)" }}>Browser Workspace</h2>
        <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Mock — Interface de navigation simulée des plateformes</p>
      </div>

      {/* Mock watermark banner */}
      <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-sm"
        style={{ backgroundColor: "rgba(201,106,74,0.08)", border: "1px dashed rgba(201,106,74,0.2)" }}>
        <AlertTriangle size={12} style={{ color: "var(--warning)" }} />
        <span className="text-[10px] font-medium" style={{ color: "var(--warning)" }}>MOCK — Aucune donnée réelle. Aucune connexion aux plateformes.</span>
      </div>

      {/* Browser chrome */}
      <div className="flex-1 rounded-sm border overflow-hidden flex flex-col" style={{ borderColor: "var(--border-default)" }}>
        {/* Tabs */}
        <div className="flex items-center border-b" style={{ borderColor: "var(--border-default)", backgroundColor: "rgba(255,255,255,0.02)" }}>
          {mockBrowserTabs.map((tab) => {
            const isActive = activeTabId === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className="flex items-center gap-1.5 text-[11px] px-4 py-2 transition-colors"
                style={{
                  backgroundColor: isActive ? "var(--bg-card)" : "transparent",
                  color: isActive ? "var(--text-primary)" : "rgba(255,255,255,0.3)",
                  borderBottom: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                }}
              >
                <Globe size={11} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* URL bar */}
        <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: "var(--border-default)", backgroundColor: "rgba(255,255,255,0.02)" }}>
          <div className="flex items-center gap-1">
            <button className="p-0.5 opacity-30"><ArrowLeft size={12} style={{ color: "rgba(255,255,255,0.3)" }} /></button>
            <button className="p-0.5 opacity-30"><ArrowRight size={12} style={{ color: "rgba(255,255,255,0.3)" }} /></button>
            <button className="p-0.5"><RefreshCcw size={12} style={{ color: "rgba(255,255,255,0.3)" }} /></button>
          </div>
          <div className="flex-1 flex items-center gap-1.5 px-3 py-1 rounded-sm text-[10px] font-mono" style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)" }}>
            <Lock size={10} style={{ color: "var(--success)" }} />
            {activeTab.url}
          </div>
        </div>

        {/* Mock content */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4">
          {/* Feed posts */}
          <div className="space-y-3">
            <p className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.2)" }}>Posts récents</p>
            {mockFeedPosts.map((post) => (
              <div key={post.id} className="p-3 rounded-sm border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-default)" }}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>{post.author}</span>
                  {post.isPpv && (
                    <span className="text-[8px] px-1 py-0.5 rounded-sm" style={{ backgroundColor: "rgba(216,169,91,0.12)", color: "var(--accent)" }}>PPV {post.ppvPrice ? `$${post.ppvPrice}` : ""}</span>
                  )}
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{post.content}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>❤ {post.likes}</span>
                  <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>💬 {post.comments}</span>
                  <span className="text-[9px] ml-auto" style={{ color: "rgba(255,255,255,0.15)" }}>{post.timeAgo}</span>
                </div>
              </div>
            ))}
          </div>

          {/* DMs */}
          <div className="space-y-3">
            <p className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.2)" }}>Messages directs</p>
            {mockDMs.map((dm) => (
              <div key={dm.id} className="p-3 rounded-sm border transition-colors"
                style={{
                  backgroundColor: dm.isUnread ? "rgba(216,169,91,0.04)" : "var(--bg-card)",
                  borderColor: dm.isUnread ? "rgba(216,169,91,0.15)" : "var(--border-default)",
                }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    {dm.isUnread && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} />}
                    <span className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>{dm.from}</span>
                  </div>
                  <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.15)" }}>{dm.timeAgo}</span>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{dm.content}</p>
                {dm.hasPPVInterest && (
                  <span className="inline-block text-[8px] px-1.5 py-0.5 rounded-sm mt-1.5" style={{ backgroundColor: "rgba(143,181,138,0.1)", color: "var(--success)" }}>
                    Intérêt PPV détecté
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
  const [campaigns] = useState<CampaignBuild[]>(mockCampaigns);
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaigns[0]?.id || null);
  const [currentStep, setCurrentStep] = useState<CampaignStep>("audience");

  const campaign = campaigns.find((c) => c.id === selectedCampaignId) || null;
  const stepIndex = CAMPAIGN_STEP_ORDER.indexOf(currentStep);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-sm font-display font-semibold" style={{ color: "var(--text-primary)" }}>Campaign Builder</h2>
        <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Crée et lance des campagnes de vente en 6 étapes</p>
      </div>

      {/* Campaign selector */}
      <div className="flex items-center gap-2">
        {campaigns.map((c) => (
          <button
            key={c.id}
            onClick={() => { setSelectedCampaignId(c.id); setCurrentStep(c.currentStep); }}
            className="text-left px-3 py-2 rounded-sm border transition-all"
            style={{
              backgroundColor: selectedCampaignId === c.id ? "rgba(216,169,91,0.06)" : "var(--bg-card)",
              borderColor: selectedCampaignId === c.id ? "var(--accent)" : "var(--border-default)",
            }}
          >
            <span className="text-[11px] font-medium block" style={{ color: "var(--text-primary)" }}>{c.name}</span>
            <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>{CAMPAIGN_TYPE_LABELS[c.type]}</span>
          </button>
        ))}
        <button className="flex items-center gap-1 text-[10px] px-3 py-2 rounded-sm" style={{ color: "rgba(255,255,255,0.25)", border: "1px dashed rgba(255,255,255,0.1)" }}>
          <Plus size={11} /> Nouvelle
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
                      backgroundColor: isActive ? "rgba(216,169,91,0.12)" : isDone ? "rgba(143,181,138,0.06)" : "transparent",
                      color: isActive ? "var(--accent)" : isDone ? "var(--success)" : "rgba(255,255,255,0.2)",
                    }}
                  >
                    {isDone ? <CheckCircle size={10} className="inline mr-1" /> : null}
                    {CAMPAIGN_STEP_LABELS[step]}
                  </button>
                  {!isLast && (
                    <div className="w-4 h-px" style={{ backgroundColor: isDone ? "var(--success)" : "rgba(255,255,255,0.08)" }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step content */}
          <div className="p-5 rounded-sm border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-default)" }}>
            {currentStep === "audience" && (
              <div className="space-y-3">
                <h3 className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>Audience</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                    <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>Segment</span>
                    <p className="text-[12px] font-medium mt-0.5" style={{ color: "var(--text-primary)" }}>{campaign.audience.segmentName}</p>
                  </div>
                  <div className="p-3 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                    <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>Fans ciblés</span>
                    <p className="text-lg font-mono font-semibold mt-0.5" style={{ color: "var(--accent)" }}>{campaign.audience.fanCount}</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === "content" && (
              <div className="space-y-3">
                <h3 className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>Contenu</h3>
                <div className="p-3 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                  <p className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>{campaign.content.productName}</p>
                  <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{campaign.content.description}</p>
                  <span className="inline-block text-[9px] px-1.5 py-0.5 rounded-sm mt-2" style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)" }}>
                    {campaign.content.mediaCount} médias
                  </span>
                </div>
              </div>
            )}

            {currentStep === "pricing" && (
              <div className="space-y-3">
                <h3 className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>Tarification</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                    <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>Prix de base</span>
                    <p className="text-lg font-mono font-semibold mt-0.5" style={{ color: "var(--text-primary)" }}>{formatEuro(campaign.pricing.basePrice)}</p>
                  </div>
                  <div className="p-3 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                    <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>Remise</span>
                    <p className="text-lg font-mono font-semibold mt-0.5" style={{ color: "var(--accent)" }}>{campaign.pricing.discountPercent}%</p>
                  </div>
                  <div className="p-3 rounded-sm" style={{ backgroundColor: "rgba(143,181,138,0.04)" }}>
                    <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>Revenu estimé</span>
                    <p className="text-lg font-mono font-semibold mt-0.5" style={{ color: "var(--success)" }}>{formatEuro(campaign.pricing.expectedRevenue)}</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === "compliance" && (
              <div className="space-y-3">
                <h3 className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>Conformité</h3>
                <div className="p-4 rounded-sm" style={{
                  backgroundColor: campaign.complianceStatus === "passed" ? "rgba(143,181,138,0.06)" :
                    campaign.complianceStatus === "flagged" ? "rgba(201,106,74,0.06)" : "rgba(255,255,255,0.02)",
                  borderColor: campaign.complianceStatus === "passed" ? "rgba(143,181,138,0.15)" :
                    campaign.complianceStatus === "flagged" ? "rgba(201,106,74,0.15)" : "rgba(255,255,255,0.06)",
                  border: "1px solid",
                }}>
                  <div className="flex items-center gap-2">
                    {campaign.complianceStatus === "passed" ? <CheckCircle size={16} style={{ color: "var(--success)" }} /> :
                      campaign.complianceStatus === "flagged" ? <AlertTriangle size={16} style={{ color: "var(--warning)" }} /> :
                      <Clock size={16} style={{ color: "rgba(255,255,255,0.3)" }} />}
                    <span className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>
                      {campaign.complianceStatus === "passed" ? "Conforme" : campaign.complianceStatus === "flagged" ? "Problème détecté" : "En attente de vérification"}
                    </span>
                  </div>
                  {campaign.complianceNotes && (
                    <p className="text-[11px] mt-2 ml-7" style={{ color: "rgba(255,255,255,0.35)" }}>{campaign.complianceNotes}</p>
                  )}
                </div>
              </div>
            )}

            {currentStep === "review" && (
              <div className="space-y-3">
                <h3 className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>Résumé de la campagne</h3>
                <div className="space-y-2 p-4 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                  {[
                    { label: "Type", value: CAMPAIGN_TYPE_LABELS[campaign.type] },
                    { label: "Audience", value: `${campaign.audience.segmentName} (${campaign.audience.fanCount} fans)` },
                    { label: "Contenu", value: campaign.content.productName },
                    { label: "Prix", value: `${formatEuro(campaign.pricing.basePrice)} (-${campaign.pricing.discountPercent}%)` },
                    { label: "Conformité", value: campaign.complianceStatus },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-[11px] py-1.5 border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                      <span style={{ color: "rgba(255,255,255,0.25)" }}>{item.label}</span>
                      <span style={{ color: "var(--text-primary)" }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === "launch" && (
              <div className="text-center py-8">
                <Send size={28} style={{ color: "var(--accent)" }} />
                <h3 className="text-sm font-semibold mt-3" style={{ color: "var(--text-primary)" }}>Prêt à lancer</h3>
                <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Tout est vérifié. La campagne sera envoyée à {campaign.audience.fanCount} fans.</p>
                <button className="mt-4 px-4 py-2 rounded-sm text-[11px] font-medium" style={{ backgroundColor: "var(--accent)", color: "var(--bg-primary)" }}>
                  Lancer la campagne
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
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              <ArrowLeft size={12} /> Précédent
            </button>
            <button
              onClick={() => { const next = CAMPAIGN_STEP_ORDER[stepIndex + 1]; if (next) setCurrentStep(next); }}
              disabled={stepIndex === CAMPAIGN_STEP_ORDER.length - 1}
              className="flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-sm transition-opacity disabled:opacity-20"
              style={{ backgroundColor: "rgba(216,169,91,0.12)", color: "var(--accent)" }}
            >
              Suivant <ArrowRight size={12} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ═══ 8. Fan Journey ════════════════════════════════════

function FanJourneySection() {
  const stages = mockFanJourneyStages;
  const maxFans = Math.max(...stages.map((s) => s.fanCount));

  const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = { Eye, UserCheck, DollarSign, Zap, Star, ShieldCheck };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-sm font-display font-semibold" style={{ color: "var(--text-primary)" }}>Fan Journey</h2>
        <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Visualise le parcours fan de la découverte à l&apos;ambassadeur</p>
      </div>

      <div className="space-y-3">
        {stages.map((stage, i) => {
          const Icon = iconMap[stage.icon] || Eye;
          const barWidth = (stage.fanCount / maxFans) * 100;
          return (
            <div key={stage.id}>
              <div className="flex items-center gap-4 p-4 rounded-sm border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-default)" }}>
                <div className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(216,169,91,0.1)", color: "var(--accent)" }}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>{stage.name}</h3>
                    <div className="flex items-center gap-3 text-[10px]">
                      <span className="font-mono font-semibold" style={{ color: "var(--accent)" }}>{stage.fanCount.toLocaleString()} fans</span>
                      <span style={{ color: "rgba(255,255,255,0.3)" }}>{stage.avgDaysInStage}j en moyenne</span>
                      <span style={{ color: "var(--success)" }}>{formatEuro(stage.avgRevenueInStage)}/fan</span>
                    </div>
                  </div>
                  <p className="text-[10px] mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>{stage.description}</p>
                  {/* Bar */}
                  <div className="h-1.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.05)", width: "100%" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${barWidth}%`, backgroundColor: "var(--accent)", opacity: 0.6 + (i * 0.08) }}
                    />
                  </div>
                </div>
                {i < stages.length - 1 && stage.conversionToNext > 0 && (
                  <div className="text-center shrink-0 px-4">
                    <p className="text-lg font-mono font-semibold" style={{ color: "var(--accent)" }}>{stage.conversionToNext}%</p>
                    <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>→ {stages[i + 1].name}</p>
                  </div>
                )}
              </div>
              {i < stages.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowRight size={14} style={{ color: "rgba(255,255,255,0.1)", transform: "rotate(90deg)" }} />
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
  const [opportunities] = useState<SalesOpportunity[]>(mockOpportunities);
  const [typeFilter, setTypeFilter] = useState("");

  const stages: OpportunityStage[] = ["to_review", "in_progress", "sent", "converted", "dismissed"];

  const filtered = typeFilter
    ? opportunities.filter((o) => o.type === typeFilter)
    : opportunities;

  const opsByStage = (stage: OpportunityStage) =>
    filtered.filter((o) => o.stage === stage);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-display font-semibold" style={{ color: "var(--text-primary)" }}>Opportunity Queue</h2>
          <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>File d&apos;opportunités de vente priorisées par l&apos;IA</p>
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="text-[11px] px-2.5 py-1.5 rounded-sm outline-none"
          style={{ backgroundColor: "rgba(255,255,255,0.04)", color: typeFilter ? "var(--text-primary)" : "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <option value="">Tous les types</option>
          {Object.entries(OPPORTUNITY_TYPE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {stages.map((stage) => {
          const items = opsByStage(stage);
          return (
            <div key={stage} className="rounded-sm border" style={{ borderColor: "var(--border-default)", backgroundColor: "rgba(255,255,255,0.01)" }}>
              <div className="px-3 py-2.5 border-b flex items-center justify-between" style={{ borderColor: "var(--border-default)" }}>
                <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>{OPPORTUNITY_STAGE_LABELS[stage]}</span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: `${OPPORTUNITY_STAGE_COLORS[stage]}20`, color: OPPORTUNITY_STAGE_COLORS[stage] }}>
                  {items.length}
                </span>
              </div>
              <div className="p-2 space-y-2 max-h-[400px] overflow-y-auto">
                {items.map((op) => (
                  <div key={op.id} className="p-3 rounded-sm border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-default)" }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-medium truncate" style={{ color: "var(--text-primary)" }}>{op.fanName}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-sm shrink-0" style={{ backgroundColor: `${OPPORTUNITY_TYPE_COLORS[op.type]}20`, color: OPPORTUNITY_TYPE_COLORS[op.type] }}>
                        {OPPORTUNITY_TYPE_LABELS[op.type]}
                      </span>
                    </div>
                    <p className="text-[10px] leading-relaxed line-clamp-2 mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>{op.aiSuggestion}</p>
                    <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "var(--border-default)" }}>
                      <span className="text-[10px] font-mono font-semibold" style={{ color: "var(--accent)" }}>{formatEuro(op.potentialRevenue)}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>{op.confidence}%</span>
                        <span className="w-8 h-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                          <div className="h-full rounded-full" style={{ width: `${op.confidence}%`, backgroundColor: op.confidence > 75 ? "var(--success)" : op.confidence > 50 ? "var(--accent)" : "var(--warning)" }} />
                        </span>
                      </div>
                    </div>
                    {op.deadline && (
                      <div className="flex items-center gap-1 mt-1.5 text-[9px]" style={{ color: "var(--warning)" }}>
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
  const [members] = useState<TeamMember[]>(mockTeamMembers);
  const [activities] = useState(mockTeamActivity);

  const statusDot = (status: TeamMember["status"]) => {
    const color = status === "online" ? "var(--success)" : status === "away" ? "#F59E0B" : "var(--text-tertiary)";
    return <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />;
  };

  const totalRevenue = members.reduce((s, m) => s + m.revenueGenerated, 0);
  const totalActive = members.reduce((s, m) => s + m.conversationsActive, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-display font-semibold" style={{ color: "var(--text-primary)" }}>Team Control Room</h2>
          <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Vue d&apos;ensemble de l&apos;activité de l&apos;équipe</p>
        </div>
        <div className="flex items-center gap-4 text-[10px]">
          <span style={{ color: "rgba(255,255,255,0.25)" }}>{totalActive} conversations actives</span>
          <span className="font-mono font-semibold" style={{ color: "var(--success)" }}>{formatEuro(totalRevenue)} généré</span>
        </div>
      </div>

      {/* Team member cards */}
      <div className="grid grid-cols-5 gap-3">
        {members.map((member) => (
          <div key={member.id} className="p-4 rounded-sm border text-center" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-default)" }}>
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 rounded-sm flex items-center justify-center text-sm font-semibold relative" style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
                {member.name.charAt(0)}
                <span className="absolute -bottom-0.5 -right-0.5">{statusDot(member.status)}</span>
              </div>
            </div>
            <p className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>{member.name}</p>
            <p className="text-[9px] mt-0.5 capitalize" style={{ color: "rgba(255,255,255,0.25)" }}>{member.role}</p>
            <div className="grid grid-cols-2 gap-1 mt-3 pt-3 border-t" style={{ borderColor: "var(--border-default)" }}>
              <div>
                <p className="text-[8px]" style={{ color: "rgba(255,255,255,0.15)" }}>Actives</p>
                <p className="text-[11px] font-mono font-semibold mt-0.5" style={{ color: "var(--text-primary)" }}>{member.conversationsActive}</p>
              </div>
              <div>
                <p className="text-[8px]" style={{ color: "rgba(255,255,255,0.15)" }}>Drafts</p>
                <p className="text-[11px] font-mono font-semibold mt-0.5" style={{ color: "var(--accent)" }}>{member.draftsReady}</p>
              </div>
            </div>
            <p className="text-[10px] font-mono font-semibold mt-2" style={{ color: "var(--success)" }}>{formatEuro(member.revenueGenerated)}</p>
          </div>
        ))}
      </div>

      {/* Activity feed */}
      <div>
        <h3 className="text-[11px] font-medium mb-3" style={{ color: "rgba(255,255,255,0.2)" }}>Activité récente</h3>
        <div className="space-y-1.5">
          {activities.slice(0, 10).map((activity) => {
            const member = members.find((m) => m.id === activity.memberId);
            return (
              <div key={activity.id} className="flex items-center gap-3 px-3 py-2 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                <span className="text-[10px] font-medium w-[80px] shrink-0 truncate" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {member?.name || "—"}
                </span>
                <span className="text-[10px] w-[140px] shrink-0 truncate" style={{ color: "rgba(255,255,255,0.3)" }}>{activity.action}</span>
                <span className="text-[10px] flex-1 truncate" style={{ color: "rgba(255,255,255,0.2)" }}>{activity.detail}</span>
                {activity.revenue !== null && (
                  <span className="text-[10px] font-mono shrink-0" style={{ color: "var(--success)" }}>+{formatEuro(activity.revenue)}</span>
                )}
                <span className="text-[9px] shrink-0" style={{ color: "rgba(255,255,255,0.15)" }}>{formatRelative(activity.timestamp)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══ 11. Compliance Review Queue ═══════════════════════

function ComplianceReviewSection() {
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-display font-semibold" style={{ color: "var(--text-primary)" }}>Compliance Review Queue</h2>
          <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Contenus et messages nécessitant une révision humaine</p>
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-[11px] px-2.5 py-1.5 rounded-sm outline-none"
          style={{ backgroundColor: "rgba(255,255,255,0.04)", color: categoryFilter ? "var(--text-primary)" : "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <option value="">Toutes les catégories</option>
          {Object.entries(RISK_CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        {filtered.map((item) => {
          const isExpanded = expandedId === item.id;
          const riskColor = item.riskScore > 70 ? "var(--danger)" : item.riskScore > 40 ? "var(--warning)" : "var(--success)";
          return (
            <div key={item.id} className="rounded-sm border" style={{ backgroundColor: "var(--bg-card)", borderColor: isExpanded ? "rgba(216,169,91,0.15)" : "var(--border-default)" }}>
              <button
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="w-full text-left px-4 py-3 flex items-center gap-4"
              >
                <div className="flex items-center gap-2 w-[120px] shrink-0">
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-sm" style={{ backgroundColor: `${riskColor}15`, color: riskColor }}>
                    {item.riskScore}/100
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)" }}>
                    {RISK_CATEGORY_LABELS[item.riskCategory]}
                  </span>
                </div>
                <span className="flex-1 text-[11px] truncate" style={{ color: "var(--text-primary)" }}>{item.content}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-sm shrink-0"
                  style={{
                    backgroundColor: item.status === "pending" ? "rgba(216,169,91,0.1)" :
                      item.status === "approved" ? "rgba(143,181,138,0.1)" :
                      item.status === "escalated" ? "rgba(201,106,74,0.1)" : "rgba(255,255,255,0.03)",
                    color: item.status === "pending" ? "var(--accent)" :
                      item.status === "approved" ? "var(--success)" :
                      item.status === "escalated" ? "var(--warning)" : "rgba(255,255,255,0.3)",
                  }}>
                  {item.status === "pending" ? "En attente" : item.status === "approved" ? "Approuvé" : item.status === "escalated" ? "Escaladé" : "Rejeté"}
                </span>
                <ChevronRight size={12} style={{ color: "rgba(255,255,255,0.2)", transform: isExpanded ? "rotate(90deg)" : undefined }} />
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t pt-3" style={{ borderColor: "var(--border-default)" }}>
                  <div className="grid grid-cols-2 gap-3 mb-3 text-[10px]">
                    <div>
                      <span style={{ color: "rgba(255,255,255,0.2)" }}>Détecté par: </span>
                      <span style={{ color: "rgba(255,255,255,0.4)" }}>{item.flaggedBy === "ai" ? "IA" : item.flaggedBy === "human" ? "Humain" : "Plateforme"}</span>
                    </div>
                    <div>
                      <span style={{ color: "rgba(255,255,255,0.2)" }}>Créé: </span>
                      <span style={{ color: "rgba(255,255,255,0.4)" }}>{formatRelative(item.createdAt)}</span>
                    </div>
                    {item.reviewer && (
                      <div>
                        <span style={{ color: "rgba(255,255,255,0.2)" }}>Réviseur: </span>
                        <span style={{ color: "rgba(255,255,255,0.4)" }}>{item.reviewer}</span>
                      </div>
                    )}
                  </div>
                  {item.notes && (
                    <p className="text-[10px] mb-3 p-2 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.3)" }}>
                      Notes: {item.notes}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    {item.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleAction(item.id, "approved")}
                          className="flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-sm"
                          style={{ backgroundColor: "rgba(143,181,138,0.1)", color: "var(--success)" }}
                        >
                          <CheckCircle size={12} /> Approuver
                        </button>
                        <button
                          onClick={() => handleAction(item.id, "rejected")}
                          className="flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-sm"
                          style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)" }}
                        >
                          <X size={12} /> Rejeter
                        </button>
                        <button
                          onClick={() => handleAction(item.id, "escalated")}
                          className="flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-sm"
                          style={{ backgroundColor: "rgba(201,106,74,0.1)", color: "var(--warning)" }}
                        >
                          <AlertTriangle size={12} /> Escalader
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
  const reasons = mockSafetyReasons;
  const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = { UserCheck, ShieldCheck, Settings, FileCheck, Lock, AlertTriangle };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-sm font-display font-semibold" style={{ color: "var(--text-primary)" }}>Why Atlas is Safer</h2>
        <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Pourquoi les créatrices choisissent Atlas pour gérer leurs ventes en toute sécurité</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {reasons.map((reason) => {
          const Icon = iconMap[reason.icon] || ShieldCheck;
          return (
            <div key={reason.id} className="p-5 rounded-sm border flex gap-4" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-default)" }}>
              <div className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(216,169,91,0.1)", color: "var(--accent)" }}>
                <Icon size={18} />
              </div>
              <div>
                <h3 className="text-[12px] font-medium mb-1" style={{ color: "var(--text-primary)" }}>{reason.title}</h3>
                <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{reason.description}</p>
                <p className="text-[11px] font-semibold mt-2 flex items-center gap-1" style={{ color: "var(--accent)" }}>
                  <CheckCircle size={10} /> {reason.highlight}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="p-4 rounded-sm border text-center" style={{ backgroundColor: "rgba(216,169,91,0.04)", borderColor: "rgba(216,169,91,0.1)" }}>
        <p className="text-[12px] font-medium mb-1" style={{ color: "var(--text-primary)" }}>IA propose → Humain vérifie → Humain valide → Envoi humain</p>
        <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>Aucun envoi automatique. 100% des messages sont validés par un humain.</p>
      </div>
    </div>
  );
}

// ═══ 13. Safety Guard ══════════════════════════════════

function SafetyGuardSection() {
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
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-sm font-display font-semibold" style={{ color: "var(--text-primary)" }}>Safety Guard</h2>
        <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Barrières de sécurité configurables pour protéger la créatrice</p>
      </div>

      {categories.map((category) => {
        const categorySettings = settings.filter((s) => s.category === category);
        return (
          <div key={category} className="space-y-2">
            <h3 className="text-[10px] font-medium tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.18)" }}>
              {GUARD_CATEGORY_LABELS[category] || category}
            </h3>
            {categorySettings.map((setting) => (
              <div key={setting.id} className="flex items-center gap-4 px-4 py-3 rounded-sm border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-default)" }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>{setting.name}</span>
                    <span className="text-[8px] px-1.5 py-0.5 rounded-sm font-medium"
                      style={{
                        backgroundColor: setting.severity === "critical" ? "rgba(232,99,74,0.12)" :
                          setting.severity === "high" ? "rgba(201,106,74,0.1)" :
                          setting.severity === "medium" ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.03)",
                        color: setting.severity === "critical" ? "var(--danger)" :
                          setting.severity === "high" ? "var(--warning)" :
                          setting.severity === "medium" ? "#F59E0B" : "rgba(255,255,255,0.3)",
                      }}>
                      {setting.severity}
                    </span>
                    {setting.adminOnly && (
                      <span className="text-[8px] px-1 py-0.5 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.2)" }}>Admin only</span>
                    )}
                  </div>
                  <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{setting.description}</p>
                </div>
                <button
                  onClick={() => toggleSetting(setting.id)}
                  className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${setting.adminOnly ? "cursor-not-allowed" : ""}`}
                  style={{ backgroundColor: setting.enabled ? "var(--accent)" : "rgba(255,255,255,0.1)", opacity: setting.adminOnly ? 0.6 : 1 }}
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

export default AtlasInboxV2;
