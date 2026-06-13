"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search, Loader, MessageCircle, Mail, Smartphone,
  Send, Star, ArrowLeft, X, CheckCircle,
  AlertCircle, Clock, Tag, DollarSign, Activity,
  Globe, Plus, Filter, Bell, Pin, Inbox,
  Zap, Edit3, ThumbsUp, Play, FileText, UserCheck, Image,
} from "lucide-react";
import { TIER_LABELS, TIER_COLORS, type FanTier } from "@/lib/atlas/crm/fans";

function tierColor(tier: string): string {
  return TIER_COLORS[tier as FanTier] || "rgba(255,255,255,0.3)";
}
function tierLabel(tier: string): string {
  return TIER_LABELS[tier as FanTier] || tier;
}

// ─── Types ──────────────────────────────────────────────────

interface FanInfo {
  id: string;
  display_name: string;
  email: string | null;
  fan_tier: string;
  fan_score: number;
  avatar_url: string | null;
  country: string | null;
  language: string | null;
  total_spent: number;
  total_interactions: number;
  tags: string[] | null;
  channels: {
    email: boolean;
    sms: boolean;
    onlyfans: boolean;
    instagram: boolean;
    tiktok: boolean;
  };
}

interface LastMessage {
  content: string;
  channel: string;
  direction: "inbound" | "outbound";
  occurred_at: string;
}

interface Conversation {
  fan: FanInfo;
  last_message: LastMessage | null;
  unread_count: number;
  has_pending_draft: boolean;
  is_pinned: boolean;
  is_unread: boolean;
}

interface AtlasMessage {
  id: string;
  fan_id: string;
  creator_id: string;
  channel: string;
  direction: "inbound" | "outbound";
  type: string | null;
  subject: string | null;
  content: string | null;
  metadata: Record<string, unknown>;
  ai_generated: boolean;
  ai_validated_by_human: boolean;
  occurred_at: string;
}

interface AtlasDraft {
  id: string;
  fan_id: string;
  creator_id: string;
  channel: string;
  approach: string;
  draft_text: string;
  content: string;
  estimated_engagement: number;
  ai_warning: string | null;
  status: string;
  generated_at: string;
}

// ─── Constants ──────────────────────────────────────────────

const CHANNEL_LABELS: Record<string, string> = {
  email: "Email",
  sms: "SMS",
  dm: "DM",
  push: "Push",
  onlyfans: "OnlyFans",
  instagram: "Instagram",
  tiktok: "TikTok",
};

const CHANNEL_ICONS: Record<string, any> = {
  email: Mail,
  sms: Smartphone,
  dm: MessageCircle,
  push: Bell,
  onlyfans: MessageCircle,
  instagram: Image,
  tiktok: Play,
};

const APPROACH_COLORS: Record<string, string> = {
  chaleureuse: "var(--success)",
  joueuse: "#F59E0B",
  directe: "var(--accent)",
};

const APPROACH_LABELS: Record<string, string> = {
  chaleureuse: "Chaleureuse",
  joueuse: "Joueuse",
  directe: "Directe",
};

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const d = new Date(dateStr).getTime();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}j`;
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount);
}

// ─── Main Inbox Page ────────────────────────────────────────

export default function InboxPage() {
  // Conversation list state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [channelFilter, setChannelFilter] = useState("");
  const [tierFilter, setTierFilter] = useState("");

  // Active conversation state
  const [selectedFanId, setSelectedFanId] = useState<string | null>(null);
  const [activeFan, setActiveFan] = useState<FanInfo | null>(null);
  const [messages, setMessages] = useState<AtlasMessage[]>([]);
  const [pendingDrafts, setPendingDrafts] = useState<AtlasDraft[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  // Draft generation state
  const [generatingDrafts, setGeneratingDrafts] = useState(false);
  const [generatedDrafts, setGeneratedDrafts] = useState<AtlasDraft[]>([]);
  const [draftGoal, setDraftGoal] = useState("");
  const [showDraftInput, setShowDraftInput] = useState(false);

  // Mobile responsive state
  const [mobileView, setMobileView] = useState<"list" | "conv" | "profile">("list");

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // ─── Fetch conversations ──────────────────────────────────

  const fetchConversations = useCallback(async (query?: string) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (unreadOnly) params.set("unread", "true");
      if (channelFilter) params.set("channel", channelFilter);
      if (tierFilter) params.set("tier", tierFilter);
      if (query) params.set("search", query);

      const res = await fetch(`/api/dashboard/atlas/inbox?${params}`);
      if (!res.ok) throw new Error("Erreur lors du chargement");
      const data = await res.json();
      setConversations(data.conversations ?? []);
    } catch (e: any) {
      setError(e.message || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  }, [unreadOnly, channelFilter, tierFilter]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Debounced search
  const handleSearchChange = (val: string) => {
    setSearch(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => fetchConversations(val || undefined), 400);
  };

  // ─── Select conversation ──────────────────────────────────

  const selectConversation = useCallback(async (conv: Conversation) => {
    setSelectedFanId(conv.fan.id);
    setActiveFan(conv.fan);
    setMobileView("conv");
    setGeneratedDrafts([]);
    setShowDraftInput(false);

    try {
      setMessagesLoading(true);
      setMessagesError(null);
      const res = await fetch(`/api/dashboard/atlas/inbox/${conv.fan.id}`);
      if (!res.ok) throw new Error("Erreur chargement messages");
      const data = await res.json();
      setMessages(data.messages ?? []);
      setPendingDrafts(data.pending_drafts ?? []);
    } catch (e: any) {
      setMessagesError(e.message || "Erreur serveur");
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  // ─── Generate drafts ──────────────────────────────────────

  const generateDrafts = useCallback(async (goal?: string) => {
    if (!selectedFanId) return;
    try {
      setGeneratingDrafts(true);
      const res = await fetch("/api/dashboard/atlas/inbox/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fanId: selectedFanId, goal: goal || draftGoal || undefined }),
      });
      if (!res.ok) throw new Error("Erreur génération");
      const data = await res.json();
      setGeneratedDrafts(data.drafts ?? []);
    } catch (e: any) {
      console.error("Draft generation error:", e);
    } finally {
      setGeneratingDrafts(false);
      setDraftGoal("");
    }
  }, [selectedFanId, draftGoal]);

  // ─── Approve draft ────────────────────────────────────────

  const approveDraft = useCallback(async (draftId: string) => {
    try {
      const res = await fetch("/api/dashboard/atlas/inbox/draft", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId, action: "approve" }),
      });
      if (!res.ok) throw new Error("Erreur approbation");
      setGeneratedDrafts((prev) => prev.filter((d) => d.id !== draftId));
      setPendingDrafts((prev) => prev.filter((d) => d.id !== draftId));
    } catch (e: any) {
      console.error("Draft approve error:", e);
    }
  }, []);

  const rejectDraft = useCallback(async (draftId: string) => {
    try {
      await fetch("/api/dashboard/atlas/inbox/draft", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId, action: "reject" }),
      });
      setGeneratedDrafts((prev) => prev.filter((d) => d.id !== draftId));
    } catch (e: any) {
      console.error("Draft reject error:", e);
    }
  }, []);

  // ─── Auto-scroll to bottom on new messages ────────────────

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, generatedDrafts]);

  // ─── Refresh conversation list periodically ───────────────

  useEffect(() => {
    const interval = setInterval(() => fetchConversations(), 30000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  // ─── Filtered conversations for display ───────────────────

  const displayConversations = conversations;

  // ─── Render ───────────────────────────────────────────────

  return (
    <div className="flex -m-4 md:-m-8 h-[calc(100vh-4rem)]" style={{ backgroundColor: "var(--color-base)" }}>
      {/* ─── LEFT PANEL, Conversation List ─────────────── */}
      <div className={`${mobileView === "conv" || mobileView === "profile" ? "hidden lg:flex" : "flex"} flex-col w-full lg:w-[340px] xl:w-[380px] shrink-0 border-r`} style={{ borderColor: "var(--color-border)" }}>

        {/* Header */}
        <div className="p-4 border-b shrink-0" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Messages</h2>
            <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              {conversations.length} conversations
            </span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.2)" }} />
            <input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Rechercher un fan..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-sm outline-none transition-colors placeholder:text-[rgba(255,255,255,0.15)]"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--text-primary)", border: "1px solid transparent" }}
              onFocus={(e) => e.target.style.borderColor = "rgba(199,91,57,0.3)"}
              onBlur={(e) => e.target.style.borderColor = "transparent"}
            />
          </div>

          {/* Filters row */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => setUnreadOnly(!unreadOnly)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] rounded-sm transition-colors ${unreadOnly ? "bg-[var(--accent)]/20 text-[var(--accent)]" : "text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.6)]"}`}
              style={{ backgroundColor: unreadOnly ? "rgba(199,91,57,0.15)" : "rgba(255,255,255,0.04)" }}
            >
              <Mail size={12} /> Non lus
            </button>

            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="flex-1 min-w-0 px-2.5 py-1.5 text-[11px] rounded-sm outline-none cursor-pointer"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", color: channelFilter ? "var(--text-primary)" : "rgba(255,255,255,0.3)", border: "1px solid transparent" }}
            >
              <option value="">Tous les canaux</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="onlyfans">OnlyFans</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
            </select>

            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="min-w-0 px-2.5 py-1.5 text-[11px] rounded-sm outline-none cursor-pointer"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", color: tierFilter ? "var(--text-primary)" : "rgba(255,255,255,0.3)", border: "1px solid transparent" }}
            >
              <option value="">Tous</option>
              {Object.entries(TIER_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center py-16">
              <Loader size={16} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center py-16 px-4 text-center">
              <AlertCircle size={24} style={{ color: "rgba(239,68,68,0.3)" }} />
              <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.3)" }}>{error}</p>
              <button onClick={() => fetchConversations()} className="mt-3 text-xs px-3 py-1.5 rounded-sm" style={{ backgroundColor: "rgba(199,91,57,0.15)", color: "var(--accent)" }}>
                Réessayer
              </button>
            </div>
          ) : displayConversations.length === 0 ? (
            <div className="flex flex-col items-center py-16 px-4 text-center">
              <Inbox size={28} style={{ color: "rgba(255,255,255,0.06)" }} />
              <p className="text-sm mt-3" style={{ color: "rgba(255,255,255,0.2)" }}>
                {search || unreadOnly || channelFilter || tierFilter
                  ? "Aucune conversation ne correspond aux filtres"
                  : "Aucune conversation pour le moment"}
              </p>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.1)" }}>
                {search || unreadOnly || channelFilter || tierFilter
                  ? "Modifie tes filtres pour voir plus de conversations"
                  : "Les messages apparaîtront quand tes fans interagiront"}
              </p>
            </div>
          ) : (
            displayConversations.map((conv) => (
              <ConversationCard
                key={conv.fan.id}
                conversation={conv}
                isActive={conv.fan.id === selectedFanId}
                onSelect={() => selectConversation(conv)}
              />
            ))
          )}
        </div>
      </div>

      {/* ─── CENTER PANEL, Active Conversation ────────── */}
      <div className={`${mobileView === "list" || mobileView === "profile" ? "hidden lg:flex" : "flex"} flex-1 flex-col min-w-0`}>
        {!selectedFanId || !activeFan ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <MessageCircle size={36} style={{ color: "rgba(255,255,255,0.04)" }} />
            <p className="text-sm mt-4 font-medium" style={{ color: "rgba(255,255,255,0.15)" }}>
              Sélectionne une conversation
            </p>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.08)" }}>
              Tous les messages de tes fans apparaîtront ici
            </p>
            <button
              onClick={() => setMobileView("list")}
              className="mt-4 lg:hidden text-xs px-3 py-1.5 rounded-sm"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)" }}
            >
              Voir les conversations
            </button>
          </div>
        ) : messagesError ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <AlertCircle size={24} style={{ color: "rgba(239,68,68,0.3)" }} />
            <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.3)" }}>{messagesError}</p>
            <button onClick={() => selectedFanId && selectConversation({ fan: activeFan, last_message: null, unread_count: 0, has_pending_draft: false, is_pinned: false, is_unread: false })} className="mt-3 text-xs px-3 py-1.5 rounded-sm" style={{ backgroundColor: "rgba(199,91,57,0.15)", color: "var(--accent)" }}>
              Réessayer
            </button>
          </div>
        ) : (
          <>
            {/* Conversation header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b shrink-0" style={{ borderColor: "var(--color-border)" }}>
              <button
                onClick={() => setMobileView("list")}
                className="lg:hidden mr-1 p-1 -ml-1 rounded-sm hover:bg-white/[0.05] transition-colors"
              >
                <ArrowLeft size={16} style={{ color: "rgba(255,255,255,0.4)" }} />
              </button>

              <div className="w-9 h-9 rounded-sm flex items-center justify-center text-xs font-semibold shrink-0 border" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
                {(activeFan.display_name || "?").charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{activeFan.display_name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-medium" style={{ backgroundColor: tierColor(activeFan.fan_tier) || "rgba(255,255,255,0.05)", color: "#000", opacity: 0.8 }}>
                    {tierLabel(activeFan.fan_tier) || activeFan.fan_tier}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                  {activeFan.country && (
                    <span className="flex items-center gap-1"><Globe size={10} />{activeFan.country}</span>
                  )}
                  {activeFan.total_spent > 0 && (
                    <span className="flex items-center gap-1">{formatAmount(activeFan.total_spent)} dépensé</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setMobileView("profile")}
                className="hidden lg:flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-sm transition-colors hover:bg-white/[0.05]"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                <FileText size={12} /> Profil
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messagesLoading ? (
                <div className="flex justify-center py-16">
                  <Loader size={16} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} />
                </div>
              ) : messages.length === 0 && pendingDrafts.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center">
                  <MessageCircle size={24} style={{ color: "rgba(255,255,255,0.06)" }} />
                  <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.15)" }}>Aucun message dans cette conversation</p>
                  <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.08)" }}>Génère des suggestions de réponse ci-dessous</p>
                </div>
              ) : (
                <>
                  {/* Pending drafts banner */}
                  {pendingDrafts.length > 0 && (
                    <div className="p-3 rounded-sm text-xs border" style={{ backgroundColor: "rgba(245,158,11,0.08)", borderColor: "rgba(245,158,11,0.15)", color: "rgba(255,255,255,0.6)" }}>
                      <div className="flex items-center gap-1.5 font-medium mb-1" style={{ color: "#F59E0B" }}>
                        <Clock size={12} /> {pendingDrafts.length} brouillon{pendingDrafts.length > 1 ? "s" : ""} en attente
                      </div>
                      {pendingDrafts.slice(0, 2).map((d) => (
                        <p key={d.id} className="text-[11px] mt-1 line-clamp-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                          {d.approach}: {d.content?.substring(0, 80)}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Message bubbles */}
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.direction === "inbound" ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[75%] min-w-[120px] rounded-sm px-3.5 py-2.5 text-sm leading-relaxed ${msg.direction === "inbound" ? "rounded-bl-sm" : "rounded-br-sm"}`}
                        style={{
                          backgroundColor: msg.direction === "inbound" ? "rgba(255,255,255,0.06)" : "rgba(199,91,57,0.2)",
                          color: "var(--text-primary)",
                          borderBottomLeftRadius: msg.direction === "inbound" ? 0 : undefined,
                          borderBottomRightRadius: msg.direction === "outbound" ? 0 : undefined,
                        }}
                      >
                        {msg.content && (
                          <p className="text-[13px] leading-relaxed break-words">{msg.content}</p>
                        )}
                        <div className={`flex items-center gap-1.5 mt-1.5 ${msg.direction === "inbound" ? "justify-start" : "justify-end"}`}>
                          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                            {new Date(msg.occurred_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {msg.ai_generated && (
                            <span className="text-[9px] px-1 py-0.5 rounded-sm" style={{ backgroundColor: "rgba(199,91,57,0.15)", color: "var(--accent)" }}>IA</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Generated drafts inline */}
                  {generatedDrafts.length > 0 && (
                    <div className="space-y-2 mt-4 mb-2">
                      <p className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>Suggestions de réponse</p>
                      {generatedDrafts.map((draft) => (
                        <div key={draft.id} className="p-3 rounded-sm border" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: `${APPROACH_COLORS[draft.approach] || "rgba(255,255,255,0.05)"}20`, color: APPROACH_COLORS[draft.approach] || "rgba(255,255,255,0.5)" }}>
                              {APPROACH_LABELS[draft.approach] || draft.approach}
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                                ✦ {draft.estimated_engagement}%
                              </span>
                            </div>
                          </div>
                          <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-primary)" }}>
                            {draft.draft_text || draft.content}
                          </p>
                          {draft.ai_warning && (
                            <p className="text-[10px] mt-1.5 flex items-center gap-1" style={{ color: "rgba(245,158,11,0.6)" }}>
                              <AlertCircle size={10} /> {draft.ai_warning}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t" style={{ borderColor: "var(--color-border)" }}>
                            <button
                              onClick={() => approveDraft(draft.id)}
                              className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-sm transition-colors"
                              style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "var(--success)" }}
                            >
                              <CheckCircle size={12} /> Approuver
                            </button>
                            <button
                              onClick={() => rejectDraft(draft.id)}
                              className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-sm transition-colors"
                              style={{ color: "rgba(255,255,255,0.25)" }}
                            >
                              <X size={12} /> Ignorer
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Draft goal input */}
            {showDraftInput && (
              <div className="px-4 py-2 border-t shrink-0" style={{ borderColor: "var(--color-border)" }}>
                <div className="flex items-center gap-2">
                  <input
                    value={draftGoal}
                    onChange={(e) => setDraftGoal(e.target.value)}
                    placeholder="Objectif du message (optionnel)..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-sm outline-none"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--text-primary)", border: "1px solid transparent" }}
                    onKeyDown={(e) => { if (e.key === "Enter") { generateDrafts(); setShowDraftInput(false); } }}
                  />
                  <button
                    onClick={() => { generateDrafts(); setShowDraftInput(false); }}
                    disabled={generatingDrafts}
                    className="text-xs px-2.5 py-1.5 rounded-sm transition-colors disabled:opacity-50"
                    style={{ backgroundColor: "rgba(199,91,57,0.15)", color: "var(--accent)" }}
                  >
                    OK
                  </button>
                  <button onClick={() => setShowDraftInput(false)} className="text-xs p-1.5" style={{ color: "rgba(255,255,255,0.25)" }}>
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Input bar */}
            <div className="px-4 py-3 border-t shrink-0" style={{ borderColor: "var(--color-border)" }}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setShowDraftInput(!showDraftInput); generatingDrafts ? null : generateDrafts(); }}
                  disabled={generatingDrafts}
                  className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-sm shrink-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80"
                  style={{ backgroundColor: generatingDrafts ? "rgba(199,91,57,0.1)" : "rgba(199,91,57,0.15)", color: "var(--accent)" }}
                >
                  {generatingDrafts ? (
                    <><Loader size={14} className="animate-spin" /> Génération...</>
                  ) : (
                    <><Zap size={14} /> 3 drafts IA</>
                  )}
                </button>
                <div className="flex-1" />
                <button
                  onClick={() => setMobileView("profile")}
                  className="lg:hidden flex items-center gap-1 text-xs px-3 py-2 rounded-sm"
                  style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)" }}
                >
                  <FileText size={14} /> Fan
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ─── RIGHT PANEL, Fan Context ─────────────────── */}
      <div className={`${mobileView === "profile" ? "flex" : "hidden"} xl:flex flex-col w-full sm:w-[360px] shrink-0 border-l overflow-y-auto`} style={{ borderColor: "var(--color-border)" }}>
        {!activeFan ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <UserCheck size={28} style={{ color: "rgba(255,255,255,0.04)" }} />
            <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.12)" }}>
              Sélectionne un fan pour voir son profil
            </p>
          </div>
        ) : (
          <FanContextPanel
            fan={activeFan}
            messageCount={messages.length}
            onClose={() => setMobileView("conv")}
          />
        )}
      </div>
    </div>
  );
}

// ─── Conversation Card ──────────────────────────────────────

function ConversationCard({ conversation, isActive, onSelect }: {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
}) {
  const { fan, last_message, unread_count, has_pending_draft, is_pinned, is_unread } = conversation;
  const initial = (fan.display_name || "?").charAt(0).toUpperCase();

  return (
    <button
      onClick={onSelect}
      className="w-full text-left px-4 py-3 transition-colors relative"
      style={{
        backgroundColor: isActive ? "rgba(199,91,57,0.08)" : "transparent",
        borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent",
      }}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-sm flex items-center justify-center text-sm font-semibold shrink-0 border"
          style={{
            backgroundColor: tierColor(fan.fan_tier) ? `${tierColor(fan.fan_tier)}20` : "var(--color-card)",
            color: tierColor(fan.fan_tier) || "rgba(255,255,255,0.4)",
            borderColor: "var(--color-border)",
          }}
        >
          {initial}
        </div>

        <div className="min-w-0 flex-1">
          {/* Name + time */}
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <div className="flex items-center gap-1.5 min-w-0">
              {is_pinned && <Pin size={10} style={{ color: "var(--accent)" }} />}
              <span className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                {fan.display_name}
              </span>
              {fan.fan_tier && (
                <span className="text-[9px] px-1 py-0.5 rounded-sm font-medium shrink-0" style={{ backgroundColor: `${tierColor(fan.fan_tier) || "rgba(255,255,255,0.05)"}30`, color: tierColor(fan.fan_tier) || "rgba(255,255,255,0.3)" }}>
                  {tierLabel(fan.fan_tier) || fan.fan_tier}
                </span>
              )}
            </div>
            {last_message && (
              <span className="text-[10px] shrink-0" style={{ color: "rgba(255,255,255,0.2)" }}>
                {formatRelativeTime(last_message.occurred_at)}
              </span>
            )}
          </div>

          {/* Channel icons row */}
          <div className="flex items-center gap-1.5 mb-1">
            {Object.entries(fan.channels).filter(([, v]) => v).map(([ch]) => {
              const Icon = CHANNEL_ICONS[ch] || MessageCircle;
              return <Icon key={ch} size={10} style={{ color: "rgba(255,255,255,0.15)" }} />;
            })}
          </div>

          {/* Last message */}
          {last_message && (
            <p className="text-xs leading-relaxed line-clamp-1" style={{ color: unread_count > 0 || is_unread ? "var(--text-primary)" : "rgba(255,255,255,0.3)" }}>
              {last_message.content || "(pièce jointe)"}
            </p>
          )}

          {/* Badges row */}
          <div className="flex items-center gap-2 mt-1.5">
            {(unread_count > 0 || is_unread) && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}>
                {unread_count > 0 ? `${unread_count} nouveau${unread_count > 1 ? "x" : ""}` : "Non lu"}
              </span>
            )}
            {has_pending_draft && (
              <span className="text-[10px] flex items-center gap-0.5" style={{ color: "#F59E0B" }}>
                <Clock size={10} /> Brouillon
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Fan Context Panel ──────────────────────────────────────

function FanContextPanel({ fan, messageCount, onClose }: {
  fan: FanInfo;
  messageCount: number;
  onClose: () => void;
}) {
  const totalChannels = Object.entries(fan.channels).filter(([, v]) => v).length;
  const activeChannels = Object.entries(fan.channels).filter(([, v]) => v).map(([ch]) => ch);

  return (
    <div className="p-5 space-y-5">
      {/* Close button (mobile) */}
      <button onClick={onClose} className="xl:hidden flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
        <ArrowLeft size={12} /> Retour
      </button>

      {/* Mini profile */}
      <div className="text-center">
        <div className="w-14 h-14 rounded-sm flex items-center justify-center text-lg font-semibold mx-auto mb-3 border" style={{ backgroundColor: tierColor(fan.fan_tier) ? `${tierColor(fan.fan_tier)}20` : "var(--color-card)", color: tierColor(fan.fan_tier) || "rgba(255,255,255,0.4)", borderColor: "var(--color-border)" }}>
          {(fan.display_name || "?").charAt(0).toUpperCase()}
        </div>
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{fan.display_name}</h3>
        {(fan.email || fan.country) && (
          <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>
            {fan.email}{fan.email && fan.country ? " · " : ""}{fan.country}
          </p>
        )}
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-sm" style={{ backgroundColor: `${tierColor(fan.fan_tier) || "rgba(255,255,255,0.05)"}30`, color: tierColor(fan.fan_tier) || "rgba(255,255,255,0.3)" }}>
            {tierLabel(fan.fan_tier) || fan.fan_tier}
          </span>
          {fan.fan_score > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)" }}>
              Score: {fan.fan_score}
            </span>
          )}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
          <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>Dépenses</p>
          <p className="text-sm font-semibold mt-1" style={{ color: "var(--text-primary)" }}>{formatAmount(fan.total_spent)}</p>
        </div>
        <div className="p-3 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
          <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>Messages</p>
          <p className="text-sm font-semibold mt-1" style={{ color: "var(--text-primary)" }}>{fan.total_interactions}</p>
        </div>
      </div>

      {/* Channels */}
      <div>
        <p className="text-[10px] font-medium mb-2 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.2)" }}>Canaux actifs</p>
        <div className="space-y-1.5">
          {activeChannels.length === 0 ? (
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>Aucun canal actif</p>
          ) : (
            activeChannels.map((ch) => {
              const Icon = CHANNEL_ICONS[ch] || MessageCircle;
              return (
                <div key={ch} className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <Icon size={12} />
                  {CHANNEL_LABELS[ch] || ch}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Tags */}
      {fan.tags && fan.tags.length > 0 && (
        <div>
          <p className="text-[10px] font-medium mb-2 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.2)" }}>Tags</p>
          <div className="flex flex-wrap gap-1.5">
            {fan.tags.map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Language */}
      {fan.language && (
        <div>
          <p className="text-[10px] font-medium mb-1 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.2)" }}>Langue</p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{fan.language}</p>
        </div>
      )}

      {/* Quick links */}
      <div className="pt-3 border-t space-y-1.5" style={{ borderColor: "var(--color-border)" }}>
        <a
          href={`/dashboard/atlas/fans/${fan.id}`}
          className="flex items-center gap-2 text-xs px-3 py-2 rounded-sm transition-colors hover:bg-white/[0.03]"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          <FileText size={12} /> Voir le profil complet
        </a>
      </div>
    </div>
  );
}
