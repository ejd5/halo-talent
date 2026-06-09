"use client";

import { useState, useEffect, use, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft, Loader, Mail, Phone, Globe, Calendar, Tag, Shield,
  MessageSquare, DollarSign, Activity, Send, ChevronRight,
  Plus, CheckCircle, XCircle, AlertTriangle, Download, Trash2,
  UserCheck, Clock, Target, TrendingUp, Zap, Edit3, Star,
  MessageCircle, FileText, Image, Smartphone, ThumbsUp, AlertCircle,
  X, Search, Filter, TrendingDown, Package, BarChart3,
} from "lucide-react";
import { TIER_LABELS, TIER_COLORS } from "@/lib/atlas/crm/fans";
import type { AtlasFan } from "@/lib/atlas/crm/fans";

// ─── Types ──────────────────────────────────────────────────

interface AtlasInteraction {
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

interface AtlasPurchase {
  id: string;
  fan_id: string;
  creator_id: string;
  platform: string;
  type: "ppv" | "tip" | "subscription" | "custom" | "bundle";
  amount: number;
  description: string | null;
  status: string;
  purchased_at: string;
}

interface AtlasNote {
  id: string;
  fan_id: string;
  creator_id: string;
  content: string;
  rich_text: Record<string, unknown>;
  images: string[];
  pin_order: number;
  created_at: string;
  updated_at: string;
}

interface AtlasDocument {
  id: string;
  fan_id: string;
  creator_id: string;
  type: string;
  name: string;
  file_url: string | null;
  notes: string | null;
  status: string;
  uploaded_at: string;
  expires_at: string | null;
}

interface AtlasDraft {
  id: string;
  fan_id: string;
  channel: string;
  content: string;
  created_at: string;
}

type TabId = "timeline" | "conversations" | "purchases" | "notes" | "documents";

const TAB_LABELS: Record<TabId, string> = {
  timeline: "Timeline",
  conversations: "Conversations",
  purchases: "Achats",
  notes: "Notes",
  documents: "Documents",
};

const PURCHASE_TYPE_LABELS: Record<string, string> = {
  ppv: "PPV",
  tip: "Tip",
  subscription: "Abonnement",
  custom: "Custom",
  bundle: "Bundle",
};

// ─── Country flags (basic) ──────────────────────────────────

const COUNTRY_FLAGS: Record<string, string> = {
  FR: "🇫🇷", US: "🇺🇸", GB: "🇬🇧", DE: "🇩🇪", IT: "🇮🇹", ES: "🇪🇸",
  PT: "🇵🇹", CH: "🇨🇭", BE: "🇧🇪", CA: "🇨🇦", AU: "🇦🇺", BR: "🇧🇷",
  MX: "🇲🇽", JP: "🇯🇵", KR: "🇰🇷", NL: "🇳🇱", SE: "🇸🇪", NO: "🇳🇴",
  DK: "🇩🇰", PL: "🇵🇱", AT: "🇦🇹", IE: "🇮🇪", NZ: "🇳🇿",
};

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  onlyfans: Shield,
  instagram: InstaIcon,
  tiktok: MessageCircle,
};

// ─── Timeline event builder ─────────────────────────────────

interface TimelineEvent {
  id: string;
  date: Date;
  icon: string;
  title: string;
  subtitle?: string;
  meta?: string;
  metaType?: "success" | "warning" | "neutral";
}

function buildTimeline(
  interactions: AtlasInteraction[],
  purchases: AtlasPurchase[],
  drafts: AtlasDraft[],
): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  for (const ix of interactions) {
    const icon = ix.direction === "inbound" ? "💬" : ix.ai_generated ? "✎" : "✉️";
    const title = ix.direction === "inbound"
      ? `Message reçu via ${ix.channel}`
      : `Message envoyé via ${ix.channel}`;
    events.push({
      id: `ix-${ix.id}`,
      date: new Date(ix.occurred_at),
      icon,
      title,
      subtitle: ix.content ? ix.content.slice(0, 80) + (ix.content.length > 80 ? "…" : "") : undefined,
      meta: ix.ai_generated && ix.ai_validated_by_human ? "Brouillon IA validé" : ix.ai_generated ? "Généré IA" : undefined,
      metaType: ix.ai_generated && ix.ai_validated_by_human ? "success" : ix.ai_generated ? "warning" : undefined,
    });
  }

  for (const p of purchases) {
    events.push({
      id: `pch-${p.id}`,
      date: new Date(p.purchased_at),
      icon: "💰",
      title: `Achat : ${p.description || PURCHASE_TYPE_LABELS[p.type] || p.type}`,
      subtitle: `${p.amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })} · ${p.platform}`,
      meta: p.status === "refunded" ? "Remboursé" : undefined,
      metaType: p.status === "refunded" ? "warning" : undefined,
    });
  }

  for (const d of drafts) {
    events.push({
      id: `dft-${d.id}`,
      date: new Date(d.created_at),
      icon: "📝",
      title: `Brouillon en attente · ${d.channel}`,
      subtitle: d.content.slice(0, 80) + (d.content.length > 80 ? "…" : ""),
      meta: "À valider",
      metaType: "warning",
    });
  }

  events.sort((a, b) => b.date.getTime() - a.date.getTime());
  return events;
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "à l'instant";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `il y a ${days}j`;
  const months = Math.floor(days / 30);
  if (months < 12) return `il y a ${months} mois`;
  const years = Math.floor(months / 12);
  return `il y a ${years} ans`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

// ─── AI Insights generator ──────────────────────────────────

interface AiInsight {
  type: "opportunity" | "pattern" | "alert" | "suggestion";
  icon: string;
  title: string;
  description: string;
}

function generateInsights(fan: AtlasFan, interactions: AtlasInteraction[], purchases: AtlasPurchase[]): AiInsight[] {
  const insights: AiInsight[] = [];

  // LTV insight
  const topThreshold = 1847;
  if (fan.lifetime_value >= topThreshold * 0.5) {
    const pct = fan.lifetime_value >= topThreshold ? "top 2%" : "top 10%";
    insights.push({
      type: "opportunity",
      icon: "💎",
      title: `Whale potentiel · ${pct} de vos fans`,
      description: `LTV de ${fan.lifetime_value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}`,
    });
  }

  // Purchase pattern
  if (purchases.length >= 2) {
    const sorted = [...purchases].sort((a, b) => new Date(a.purchased_at).getTime() - new Date(b.purchased_at).getTime());
    const intervals: number[] = [];
    for (let i = 1; i < sorted.length; i++) {
      intervals.push(
        (new Date(sorted[i].purchased_at).getTime() - new Date(sorted[i - 1].purchased_at).getTime()) / (1000 * 60 * 60 * 24)
      );
    }
    const avgInterval = intervals.length > 0 ? Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length) : 0;
    const topType = purchases.reduce<Record<string, number>>((acc, p) => {
      acc[p.type] = (acc[p.type] || 0) + 1;
      return acc;
    }, {});
    const favType = Object.entries(topType).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
    insights.push({
      type: "pattern",
      icon: "📊",
      title: "Pattern d'achat détecté",
      description: `${favType ? `1 ${PURCHASE_TYPE_LABELS[favType] || favType}` : "Achat"} tous les ${avgInterval} jours environ`,
    });
  }

  // Inactivity alert
  if (fan.last_interaction_at) {
    const daysSince = Math.floor((Date.now() - new Date(fan.last_interaction_at).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince > 7) {
      insights.push({
        type: "alert",
        icon: "⚠️",
        title: `${daysSince} jours sans interaction`,
        description: daysSince > 30
          ? "Risque de churn élevé — action de réengagement recommandée"
          : "Intervalle anormal — envisager un message personnalisé",
      });
    }
  }

  // Preferred content from tags
  if (fan.tags && fan.tags.length > 0) {
    insights.push({
      type: "suggestion",
      icon: "🎯",
      title: "Préférences détectées",
      description: `Tags : ${fan.tags.slice(0, 3).join(", ")}`,
    });
  }

  return insights;
}

// ===================================================================
//  LEFT COLUMN — Identity & Actions
// ===================================================================

function IdentityCard({ fan }: { fan: AtlasFan }) {
  return (
    <div className="p-5 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="w-20 h-20 border-2 border-[var(--color-border)] flex items-center justify-center text-xl font-bold"
          style={{ backgroundColor: "var(--color-surface)" }}>
          {(fan.display_name || fan.email || "?").charAt(0).toUpperCase()}
        </div>

        {/* Name */}
        <h2 className="text-lg font-bold mt-3" style={{ fontFamily: "var(--font-display)", color: "#FFFFFF" }}>
          {fan.display_name || "Anonyme"}
        </h2>
        {fan.email && (
          <p className="text-sm mt-0.5" style={{ color: "#FFFFFF" }}>{fan.email}</p>
        )}

        {/* Tier badge */}
        <span className="text-xs px-2.5 py-1 rounded-sm font-semibold mt-2" style={{
          background: `${TIER_COLORS[fan.fan_tier]}20`,
          color: TIER_COLORS[fan.fan_tier],
        }}>
          {TIER_LABELS[fan.fan_tier]}
        </span>

        {/* Score bar */}
        <div className="w-full mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: "#FFFFFF" }}>Score</span>
            <span className="font-bold" style={{ color: "#F59E0B" }}>{fan.fan_score}/100</span>
          </div>
          <div className="w-full h-2 rounded-sm" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-sm transition-all" style={{
              width: `${fan.fan_score}%`,
              background: "linear-gradient(90deg, #F59E0B, #D97706)",
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActionsCard({ fan, onAction }: { fan: AtlasFan; onAction: (action: string) => void }) {
  return (
    <div className="p-4 border border-[var(--color-border)] space-y-2" style={{ backgroundColor: "var(--color-card)" }}>
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#FFFFFF" }}>Actions rapides</h3>

      <QuickActionBtn
        icon={Mail} label="Envoyer un email"
        disabled={!fan.email_consent}
        onClick={() => onAction("email")}
      />
      <QuickActionBtn
        icon={Smartphone} label="Envoyer un SMS"
        disabled={!fan.sms_consent}
        onClick={() => onAction("sms")}
      />
      <QuickActionBtn
        icon={InstaIcon} label="Drafter un DM Instagram"
        onClick={() => onAction("dm_instagram")}
      />
      <QuickActionBtn
        icon={Shield} label="Drafter un DM OnlyFans"
        onClick={() => onAction("dm_onlyfans")}
      />
    </div>
  );
}

function QuickActionBtn({ icon: Icon, label, disabled, onClick }: { icon: any; label: string; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-80"
      style={{
        background: disabled ? "rgba(255,255,255,0.03)" : "rgba(199,91,57,0.1)",
        color: disabled ? "#FFFFFF" : "#C75B39",
      }}
    >
      <Icon size={14} />
      <span className="flex-1 text-left">{label}</span>
      {disabled && <span className="text-[10px] opacity-60">Consent requis</span>}
    </button>
  );
}

function PlatformIdentitiesCard({ fan }: { fan: AtlasFan }) {
  const platforms: { label: string; value: string | null; icon: React.ElementType; href?: string }[] = [
    { label: "OnlyFans", value: fan.username_onlyfans ? `@${fan.username_onlyfans}` : null, icon: Shield },
    { label: "Instagram", value: fan.username_instagram ? `@${fan.username_instagram}` : null, icon: InstaIcon },
    { label: "TikTok", value: fan.username_tiktok ? `@${fan.username_tiktok}` : null, icon: MessageCircle },
    { label: "Email", value: fan.email, icon: Mail },
    { label: "Téléphone", value: fan.phone, icon: Phone },
  ];

  const others = fan.username_other as Record<string, string> | undefined;

  return (
    <div className="p-4 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: "#FFFFFF" }}>
        <UserCheck size={12} /> Identités
      </h3>
      <div className="space-y-2.5">
        {platforms.map((p) => (
          <div key={p.label} className="flex items-center gap-2.5 text-sm">
            <p.icon size={13} style={{ color: "#FFFFFF" }} />
            <span className="text-xs" style={{ color: "#FFFFFF" }}>{p.label}</span>
            <span className={`text-xs ml-auto ${p.value ? "font-medium" : "italic"}`} style={{ color: p.value ? "#FFFFFF" : "rgba(255,255,255,0.3)" }}>
              {p.value || "Non lié"}
            </span>
          </div>
        ))}
        {others && Object.entries(others).map(([key, val]) => (
          <div key={key} className="flex items-center gap-2.5 text-sm">
            <Link2Icon size={13} style={{ color: "#FFFFFF" }} />
            <span className="text-xs" style={{ color: "#FFFFFF" }}>{key}</span>
            <span className="text-xs ml-auto font-medium" style={{ color: "#FFFFFF" }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Link2Icon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function GeographyCard({ fan }: { fan: AtlasFan }) {
  const flag = fan.country ? COUNTRY_FLAGS[fan.country] || "🌍" : "🌍";
  return (
    <div className="p-4 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#FFFFFF" }}>
        <Globe size={12} className="inline mr-1" /> Géographie
      </h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span style={{ color: "#FFFFFF" }}>Pays</span>
          <span style={{ color: "#FFFFFF" }}>{flag} {fan.country || "Inconnu"}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: "#FFFFFF" }}>Timezone</span>
          <span style={{ color: "#FFFFFF" }}>{fan.timezone || "—"}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: "#FFFFFF" }}>Langue</span>
          <span style={{ color: "#FFFFFF" }}>{fan.language === "fr" ? "Français" : fan.language === "en" ? "English" : fan.language || "—"}</span>
        </div>
      </div>
    </div>
  );
}

function ConsentsCard({ fan }: { fan: AtlasFan }) {
  const items: { label: string; icon: any; granted: boolean }[] = [
    { label: "Email", icon: Mail, granted: fan.email_consent },
    { label: "SMS", icon: Smartphone, granted: fan.sms_consent },
    { label: "Push", icon: BellIcon, granted: fan.push_consent },
    { label: "Traitement données", icon: Shield, granted: fan.data_processing_consent },
  ];

  return (
    <div className="p-4 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: "#FFFFFF" }}>
        <CheckCircle size={12} /> Consentements RGPD
      </h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <item.icon size={12} style={{ color: "#FFFFFF" }} />
              <span className="text-sm" style={{ color: "#FFFFFF" }}>{item.label}</span>
            </div>
            {item.granted ? (
              <CheckCircle size={14} style={{ color: "#10B981" }} />
            ) : (
              <XCircle size={14} style={{ color: "#E5484D" }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function BellIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function InstaIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

// ===================================================================
//  CENTER COLUMN — Tabs & Content
// ===================================================================

function TimelineTab({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <Clock size={28} style={{ color: "rgba(255,255,255,0.06)" }} />
        <p className="text-sm mt-3" style={{ color: "rgba(255,255,255,0.15)" }}>Aucune activité</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[19px] top-0 bottom-0 w-px" style={{ background: "rgba(255,255,255,0.06)" }} />

      <div className="space-y-0">
        {events.map((evt) => (
          <div key={evt.id} className="relative flex gap-4 pb-5 last:pb-0">
            {/* Dot */}
            <div className="relative z-10 shrink-0 w-[38px] h-[38px] flex items-center justify-center text-sm border border-[var(--color-border)]"
              style={{ backgroundColor: "var(--color-card)" }}>
              {evt.icon}
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium" style={{ color: "#FFFFFF" }}>{evt.title}</p>
                <span className="text-[11px] shrink-0" style={{ color: "rgba(255,255,255,0.3)" }}>{timeAgo(evt.date)}</span>
              </div>
              {evt.subtitle && (
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{evt.subtitle}</p>
              )}
              {evt.meta && (
                <span className="inline-block text-[10px] px-1.5 py-0.5 rounded-sm mt-1 font-medium" style={{
                  background: evt.metaType === "success" ? "rgba(16,185,129,0.1)" : evt.metaType === "warning" ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.05)",
                  color: evt.metaType === "success" ? "#10B981" : evt.metaType === "warning" ? "#F59E0B" : "#FFFFFF",
                }}>
                  {evt.meta}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConversationsTab({ interactions }: { interactions: AtlasInteraction[] }) {
  const msgs = interactions.filter((i) => ["dm", "instagram", "onlyfans", "direct"].includes(i.channel) || i.type === "dm");

  if (msgs.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <MessageSquare size={28} style={{ color: "rgba(255,255,255,0.06)" }} />
        <p className="text-sm mt-3" style={{ color: "rgba(255,255,255,0.15)" }}>Aucune conversation</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {msgs.map((msg) => (
        <div key={msg.id} className="p-3 border border-[var(--color-border)]"
          style={{
            backgroundColor: "var(--color-card)",
            borderLeft: `3px solid ${msg.direction === "inbound" ? "rgba(255,255,255,0.2)" : "#C75B39"}`,
          }}>
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] px-1.5 py-0.5 rounded-sm font-medium"
                style={{
                  background: msg.direction === "inbound" ? "rgba(255,255,255,0.06)" : "rgba(199,91,57,0.15)",
                  color: msg.direction === "inbound" ? "#FFFFFF" : "#C75B39",
                }}>
                {msg.direction === "inbound" ? "Inbound" : "Outbound"}
              </span>
              <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>{msg.channel}</span>
              {msg.ai_generated && (
                <span className="text-[10px]" style={{ color: "#8B5CF6" }}>✎ IA</span>
              )}
            </div>
            <span className="text-[11px] shrink-0" style={{ color: "rgba(255,255,255,0.3)" }}>
              {timeAgo(new Date(msg.occurred_at))}
            </span>
          </div>
          <p className="text-sm" style={{ color: "#FFFFFF" }}>{msg.content || msg.subject || "—"}</p>
        </div>
      ))}
    </div>
  );
}

function PurchasesTab({ purchases }: { purchases: AtlasPurchase[] }) {
  const total = purchases.reduce((sum, p) => sum + (p.status === "completed" ? p.amount : 0), 0);

  if (purchases.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <DollarSign size={28} style={{ color: "rgba(255,255,255,0.06)" }} />
        <p className="text-sm mt-3" style={{ color: "rgba(255,255,255,0.15)" }}>Aucun achat</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 p-3 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
        <span className="text-sm font-medium" style={{ color: "#FFFFFF" }}>Total LTV (achats affichés)</span>
        <span className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "#C75B39" }}>
          {total.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
        </span>
      </div>
      <div className="space-y-1">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-3 py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#FFFFFF" }}>
          <span>Description</span>
          <span>Type</span>
          <span>Montant</span>
          <span>Date</span>
        </div>
        {purchases.map((p) => (
          <div key={p.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-3 py-2.5 text-sm border-b border-[var(--color-border)] last:border-0 items-center"
            style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            <div>
              <span style={{ color: "#FFFFFF" }}>{p.description || PURCHASE_TYPE_LABELS[p.type] || p.type}</span>
              <span className="text-[10px] ml-2" style={{ color: "rgba(255,255,255,0.3)" }}>{p.platform}</span>
            </div>
            <span className="text-xs px-1.5 py-0.5 rounded-sm" style={{
              background: "rgba(255,255,255,0.05)",
              color: "#FFFFFF",
            }}>{PURCHASE_TYPE_LABELS[p.type] || p.type}</span>
            <span className="font-medium" style={{ color: "#FFFFFF" }}>
              {p.amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
            </span>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              {new Date(p.purchased_at).toLocaleDateString("fr-FR")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotesTab({ notes, fanId }: { notes: AtlasNote[]; fanId: string }) {
  const [newNote, setNewNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [localNotes, setLocalNotes] = useState(notes);

  async function addNote() {
    if (!newNote.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/dashboard/atlas/fans/${fanId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote }),
      });
      if (res.ok) {
        const result = await res.json();
        setLocalNotes((prev) => [result.note, ...prev]);
        setNewNote("");
      }
    } catch {} finally {
      setSaving(false);
    }
  }

  if (localNotes.length === 0 && !newNote) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-4">
          <input
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Ajouter une note privée..."
            className="flex-1 text-sm bg-transparent px-3 py-2 border border-[var(--color-border)] outline-none focus:border-[var(--color-accent)]"
            style={{ color: "#FFFFFF" }}
            onKeyDown={(e) => e.key === "Enter" && addNote()}
          />
          <button onClick={addNote} disabled={saving || !newNote.trim()}
            className="px-3 py-2 text-sm rounded-sm transition-opacity disabled:opacity-30"
            style={{ background: "#C75B39", color: "#FFFFFF" }}>
            {saving ? "..." : "Ajouter"}
          </button>
        </div>
        <div className="flex flex-col items-center py-8 text-center">
          <Edit3 size={28} style={{ color: "rgba(255,255,255,0.06)" }} />
          <p className="text-sm mt-3" style={{ color: "rgba(255,255,255,0.15)" }}>Aucune note privée</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.1)" }}>
            Les notes sont visibles uniquement par vous et votre manager
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <input
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Ajouter une note privée..."
          className="flex-1 text-sm bg-transparent px-3 py-2 border border-[var(--color-border)] outline-none focus:border-[var(--color-accent)]"
          style={{ color: "#FFFFFF" }}
          onKeyDown={(e) => e.key === "Enter" && addNote()}
        />
        <button onClick={addNote} disabled={saving || !newNote.trim()}
          className="px-3 py-2 text-sm rounded-sm transition-opacity disabled:opacity-30"
          style={{ background: "#C75B39", color: "#FFFFFF" }}>
          {saving ? "..." : "Ajouter"}
        </button>
      </div>
      <div className="space-y-2">
        {localNotes.map((note) => (
          <div key={note.id} className="p-3 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
            <p className="text-sm whitespace-pre-wrap" style={{ color: "#FFFFFF" }}>{note.content}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                {new Date(note.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
              {note.images && note.images.length > 0 && (
                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  📷 {note.images.length}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentsTab({ documents, fanId }: { documents: AtlasDocument[]; fanId: string }) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <FileText size={28} style={{ color: "rgba(255,255,255,0.06)" }} />
        <p className="text-sm mt-3" style={{ color: "rgba(255,255,255,0.15)" }}>Aucun document</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div key={doc.id} className="flex items-center gap-3 p-3 border border-[var(--color-border)]"
          style={{ backgroundColor: "var(--color-card)" }}>
          <div className="p-2" style={{ background: "rgba(199,91,57,0.1)" }}>
            <FileText size={16} style={{ color: "#C75B39" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium" style={{ color: "#FFFFFF" }}>{doc.name}</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              {doc.type === "contract" ? "Contrat" : doc.type === "id_verification" ? "Vérification ID" : doc.type === "release_form" ? "Release form" : "Document"} · {new Date(doc.uploaded_at).toLocaleDateString("fr-FR")}
            </p>
          </div>
          {doc.file_url && (
            <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
              className="text-xs transition-opacity hover:opacity-70"
              style={{ color: "#C75B39" }}>
              Voir
            </a>
          )}
          {doc.expires_at && new Date(doc.expires_at) < new Date() && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-sm" style={{ background: "rgba(229,72,77,0.1)", color: "#E5484D" }}>
              Expiré
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// ===================================================================
//  RIGHT COLUMN — Insights & Stats
// ===================================================================

function AiInsightsCard({ insights }: { insights: AiInsight[] }) {
  if (insights.length === 0) return null;

  return (
    <div className="p-4 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: "#FFFFFF" }}>
        <Zap size={12} style={{ color: "#F59E0B" }} /> Insights IA
      </h3>
      <div className="space-y-2.5">
        {insights.map((insight, i) => (
          <div key={i} className="p-2.5 border border-[var(--color-border)] text-sm"
            style={{
              backgroundColor: insight.type === "alert" ? "rgba(229,72,77,0.04)" : "rgba(255,255,255,0.02)",
              borderColor: insight.type === "alert" ? "rgba(229,72,77,0.15)" : insight.type === "opportunity" ? "rgba(16,185,129,0.15)" : "var(--color-border)",
            }}>
            <div className="flex items-start gap-2">
              <span>{insight.icon}</span>
              <div>
                <p className="text-xs font-semibold" style={{ color: "#FFFFFF" }}>{insight.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecommendedActionsCard({ fan, onAction }: { fan: AtlasFan; onAction: (action: string) => void }) {
  return (
    <div className="p-4 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: "#FFFFFF" }}>
        <Target size={12} /> Actions recommandées
      </h3>
      <div className="space-y-1.5">
        <RecActionBtn icon={Send} label="Drafter un message de réengagement" onClick={() => onAction("reengage")} />
        <RecActionBtn icon={Zap} label="Proposer une offre exclusive" onClick={() => onAction("offer")} />
        <RecActionBtn icon={Star} label="Inviter au nouveau bundle" onClick={() => onAction("bundle")} />
        <RecActionBtn icon={Filter} label="Fusionner des identités" onClick={() => onAction("merge")} />
      </div>
    </div>
  );
}

function RecActionBtn({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-sm transition-all hover:opacity-80"
      style={{ background: "rgba(255,255,255,0.03)", color: "#FFFFFF" }}>
      <Icon size={13} />
      <span className="flex-1 text-left">{label}</span>
      <ChevronRight size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
    </button>
  );
}

function QuickStatsCard({ fan }: { fan: AtlasFan }) {
  const daysSinceFirst = Math.floor((Date.now() - new Date(fan.first_seen_at).getTime()) / (1000 * 60 * 60 * 24));
  const daysSinceLast = fan.last_interaction_at
    ? Math.floor((Date.now() - new Date(fan.last_interaction_at).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="p-4 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#FFFFFF" }}>
        <Activity size={12} className="inline mr-1" /> Statistiques rapides
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <StatItem label="Total dépensé" value={fan.total_spent.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })} />
        <StatItem label="Transactions" value={String(fan.purchases_count)} />
        <StatItem label="Panier moyen" value={fan.avg_order_value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })} />
        <StatItem label="Engagement" value={`${fan.total_interactions > 0 ? Math.round((fan.purchases_count / Math.max(fan.total_interactions, 1)) * 100) : 0}%`} />
        <StatItem label="Premier contact" value={daysSinceFirst > 30 ? `il y a ${Math.round(daysSinceFirst / 30)} mois` : `il y a ${daysSinceFirst}j`} />
        <StatItem label="Dernier contact" value={daysSinceLast !== null ? (daysSinceLast === 0 ? "Aujourd'hui" : `il y a ${daysSinceLast}j`) : "Jamais"} />
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
      <p className="text-sm font-semibold mt-0.5" style={{ color: "#FFFFFF" }}>{value}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  VAULT RECOMMENDATIONS WIDGET
// ═══════════════════════════════════════════════════════════════

function VaultRecommendationsCard({ recommendations, loading }: { recommendations: any[]; loading: boolean }) {
  if (loading) return (
    <div className="p-4 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: "#FFFFFF" }}>
        <Package size={12} style={{ color: "#C75B39" }} /> Recommandations Vault
      </h3>
      {[1,2,3].map(i => <div key={i} className="h-6 animate-pulse mb-2" style={{ backgroundColor: "rgba(255,255,255,0.03)" }} />)}
    </div>
  );

  if (recommendations.length === 0) return null;

  return (
    <div className="p-4 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: "#FFFFFF" }}>
        <Package size={12} style={{ color: "#C75B39" }} /> Vault recommendations
      </h3>
      <div className="space-y-2">
        {recommendations.slice(0, 5).map((rec, i) => (
          <div key={i} className="p-2 border border-[var(--color-border)]" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium truncate" style={{ color: "#FFFFFF" }}>
                  {(rec.product as any)?.name || "Produit"}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{rec.reason}</p>
              </div>
              <span className="text-xs font-semibold shrink-0" style={{ color: "#C75B39" }}>
                {(rec.product as any)?.price}€
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex-1 h-1" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                <div className="h-full" style={{ width: `${rec.score}%`, backgroundColor: "#C75B39", opacity: 0.7 }} />
              </div>
              <span className="text-[9px] shrink-0" style={{ color: "rgba(255,255,255,0.3)" }}>{rec.score}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  IA PREDICTIONS WIDGET
// ═══════════════════════════════════════════════════════════════

function PredictionsCard({ ltv, churn, loading }: { ltv: any; churn: any; loading: boolean }) {
  if (loading) return (
    <div className="p-4 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: "#FFFFFF" }}>
        <BarChart3 size={12} style={{ color: "#8B5CF6" }} /> Prédictions IA
      </h3>
      {[1,2].map(i => <div key={i} className="h-12 animate-pulse mb-2" style={{ backgroundColor: "rgba(255,255,255,0.03)" }} />)}
    </div>
  );

  if (!ltv && !churn) return null;

  return (
    <div className="p-4 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: "#FFFFFF" }}>
        <BarChart3 size={12} style={{ color: "#8B5CF6" }} /> Prédictions IA
      </h3>
      <div className="space-y-3">

        {/* LTV */}
        {ltv && (
          <div className="p-2.5 border border-[var(--color-border)]" style={{ backgroundColor: "rgba(16,185,129,0.04)" }}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <TrendingUp size={11} style={{ color: "#10B981" }} />
              <span className="text-[10px] font-semibold" style={{ color: "#10B981" }}>LTV Projection</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-base font-bold" style={{ color: "#FFFFFF" }}>
                {Math.round(ltv.predicted_ltv_12m)}€
              </span>
              <span className="text-[10px] mb-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                /12 mois
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1.5 text-[10px]">
              <span style={{ color: "rgba(255,255,255,0.4)" }}>
                Actuel: <strong style={{ color: "#FFFFFF" }}>{Math.round(ltv.current_ltv)}€</strong>
              </span>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>
                Confiance: <strong style={{ color: "#FFFFFF" }}>{ltv.confidence}</strong>
              </span>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>
                Vélocité: <strong style={{ color: "#FFFFFF" }}>{Math.round(ltv.monthly_velocity)}€/mois</strong>
              </span>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>
                Tendance: <strong style={{
                  color: ltv.trend_direction === "growing" ? "#10B981" : ltv.trend_direction === "declining" ? "#E5484D" : "#FFFFFF",
                }}>
                  {ltv.trend_direction === "growing" ? "Croissante ↑" : ltv.trend_direction === "declining" ? "Décroissante ↓" : "Stable"}
                </strong>
              </span>
            </div>
            {ltv.range && (
              <p className="text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>
                Fourchette: {Math.round(ltv.range.low)}€ – {Math.round(ltv.range.high)}€
              </p>
            )}
          </div>
        )}

        {/* Churn */}
        {churn && (
          <div className="p-2.5 border border-[var(--color-border)]" style={{
            backgroundColor: churn.score > 40 ? "rgba(229,72,77,0.04)" : "rgba(16,185,129,0.04)",
          }}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <TrendingDown size={11} style={{ color: churn.score > 40 ? "#E5484D" : "#10B981" }} />
              <span className="text-[10px] font-semibold" style={{ color: churn.score > 40 ? "#E5484D" : "#10B981" }}>
                Risque de churn
              </span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-base font-bold" style={{ color: "#FFFFFF" }}>{churn.score}/100</span>
              <span className="text-[10px] mb-0.5" style={{
                color: churn.score > 70 ? "#E5484D" : churn.score > 40 ? "#C75B39" : churn.score > 20 ? "#F59E0B" : "#10B981",
              }}>
                {churn.level}
              </span>
            </div>
            {churn.factors && churn.factors.length > 0 && (
              <div className="mt-1.5 space-y-0.5">
                {churn.factors.map((f: string, i: number) => (
                  <p key={i} className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>• {f}</p>
                ))}
              </div>
            )}
            <p className="text-[9px] mt-1.5" style={{ color: "#C75B39" }}>
              → {churn.recommended_action === "win_back_campaign_high_value" && "Campagne win-back"}
              {churn.recommended_action === "personal_outreach" && "Contact personnalisé"}
              {churn.recommended_action === "engagement_content" && "Contenu d'engagement"}
              {churn.recommended_action === "continue_normal" && "Continuer stratégie actuelle"}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

// ===================================================================
//  DIALOGS
// ===================================================================

function MergeDialog({ fan, open, onClose }: { fan: AtlasFan; open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [searching, setSearching] = useState(false);
  const [matches, setMatches] = useState<AtlasFan[]>([]);

  async function handleSearch() {
    if (!email.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/dashboard/atlas/fans?search=${encodeURIComponent(email)}&limit=5`);
      const d = await res.json();
      setMatches((d.fans ?? []).filter((f: AtlasFan) => f.id !== fan.id));
    } catch {} finally {
      setSearching(false);
    }
  }

  return (
    <DialogOverlay open={open} onClose={onClose} title="Fusionner des identités">
      <p className="text-sm mb-3" style={{ color: "#FFFFFF" }}>
        Rechercher un fan à fusionner avec <strong>{fan.display_name || fan.email}</strong>.
        Les interactions et achats seront regroupés.
      </p>
      <div className="flex items-center gap-2 mb-3">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email du doublon..."
          className="flex-1 text-sm bg-transparent px-3 py-2 border border-[var(--color-border)] outline-none"
          style={{ color: "#FFFFFF" }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
        <button onClick={handleSearch} disabled={searching}
          className="px-3 py-2 text-sm rounded-sm"
          style={{ background: "#C75B39", color: "#FFFFFF" }}>
          <Search size={14} />
        </button>
      </div>
      {matches.length > 0 && (
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {matches.map((m) => (
            <div key={m.id} className="flex items-center justify-between p-2 border border-[var(--color-border)] text-sm"
              style={{ backgroundColor: "var(--color-surface)" }}>
              <span style={{ color: "#FFFFFF" }}>{m.display_name || m.email}</span>
              <button className="text-xs px-2 py-1 rounded-sm" style={{ background: "rgba(199,91,57,0.2)", color: "#C75B39" }}>
                Fusionner
              </button>
            </div>
          ))}
        </div>
      )}
      {searching && <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Recherche...</p>}
    </DialogOverlay>
  );
}

function ExportDialog({ fan, open, onClose }: { fan: AtlasFan; open: boolean; onClose: () => void }) {
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    // Simulate export — in real app would trigger a server-side ZIP generation
    setTimeout(() => {
      setExporting(false);
      onClose();
    }, 1500);
  }

  return (
    <DialogOverlay open={open} onClose={onClose} title="Exporter les données RGPD">
      <p className="text-sm mb-4" style={{ color: "#FFFFFF" }}>
        Toutes les données de <strong>{fan.display_name || fan.email}</strong> seront exportées :
        interactions, achats, notes, documents et métadonnées.
      </p>
      <div className="text-xs space-y-1 mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
        <p>✓ Historique des interactions ({fan.total_interactions} entrées)</p>
        <p>✓ Achats et transactions ({fan.purchases_count} entrées)</p>
        <p>✓ Notes privées</p>
        <p>✓ Documents uploadés</p>
      </div>
      <button onClick={handleExport} disabled={exporting}
        className="flex items-center gap-2 px-4 py-2 text-sm rounded-sm transition-opacity disabled:opacity-40"
        style={{ background: "#C75B39", color: "#FFFFFF" }}>
        <Download size={14} />
        {exporting ? "Génération du ZIP..." : "Exporter toutes les données"}
      </button>
    </DialogOverlay>
  );
}

function DeleteDialog({ fan, open, onClose }: { fan: AtlasFan; open: boolean; onClose: () => void }) {
  const [confirm, setConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  async function handleDelete() {
    if (confirm !== "SUPPRIMER") return;
    setDeleting(true);
    try {
      await fetch(`/api/dashboard/atlas/fans/${fan.id}`, { method: "DELETE" });
      setDeleted(true);
    } catch {} finally {
      setDeleting(false);
    }
  }

  if (deleted) {
    return (
      <DialogOverlay open={open} onClose={onClose} title="Fan supprimé">
        <div className="flex flex-col items-center py-4 text-center">
          <CheckCircle size={32} style={{ color: "#10B981" }} />
          <p className="text-sm mt-3 font-medium" style={{ color: "#FFFFFF" }}>Données anonymisées</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            Conforme RGPD — un log de suppression a été conservé
          </p>
          <Link href="/dashboard/atlas/fans"
            className="mt-4 px-4 py-2 text-sm rounded-sm"
            style={{ background: "#C75B39", color: "#FFFFFF" }}>
            Retour à la liste
          </Link>
        </div>
      </DialogOverlay>
    );
  }

  return (
    <DialogOverlay open={open && !deleted} onClose={onClose} title="Supprimer ce fan ?">
      <div className="p-3 mb-4 border border-[#E5484D]/20 flex items-start gap-2"
        style={{ background: "rgba(229,72,77,0.05)" }}>
        <AlertTriangle size={16} style={{ color: "#E5484D", marginTop: 1 }} />
        <div>
          <p className="text-sm font-medium" style={{ color: "#E5484D" }}>Action irréversible</p>
          <p className="text-xs mt-1" style={{ color: "#FFFFFF" }}>
            Toutes les données de <strong>{fan.display_name || fan.email}</strong> seront anonymisées :
            interactions, achats, notes et documents. Un log de suppression sera conservé pour conformité RGPD.
          </p>
        </div>
      </div>
      <p className="text-xs mb-2" style={{ color: "#FFFFFF" }}>
        Tape <strong>SUPPRIMER</strong> pour confirmer :
      </p>
      <input value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="SUPPRIMER"
        className="w-full text-sm bg-transparent px-3 py-2 border border-[var(--color-border)] outline-none mb-3"
        style={{ color: "#FFFFFF" }} />
      <button onClick={handleDelete} disabled={confirm !== "SUPPRIMER" || deleting}
        className="flex items-center gap-2 px-4 py-2 text-sm rounded-sm transition-opacity disabled:opacity-40"
        style={{ background: "#E5484D", color: "#FFFFFF" }}>
        <Trash2 size={14} />
        {deleting ? "Suppression..." : "Supprimer définitivement"}
      </button>
    </DialogOverlay>
  );
}

function DialogOverlay({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="w-full max-w-md mx-4 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <h3 className="text-sm font-bold" style={{ color: "#FFFFFF" }}>{title}</h3>
          <button onClick={onClose} className="p-1 transition-opacity hover:opacity-70"><X size={14} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ===================================================================
//  MAIN PAGE
// ===================================================================

export default function FanProfilePage({ params }: { params: Promise<{ fanId: string }> }) {
  const { fanId } = use(params);
  const [fan, setFan] = useState<AtlasFan | null>(null);
  const [interactions, setInteractions] = useState<AtlasInteraction[]>([]);
  const [purchases, setPurchases] = useState<AtlasPurchase[]>([]);
  const [notes, setNotes] = useState<AtlasNote[]>([]);
  const [documents, setDocuments] = useState<AtlasDocument[]>([]);
  const [pendingDrafts, setPendingDrafts] = useState<AtlasDraft[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<TabId>("timeline");
  const [mergeOpen, setMergeOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Vault recommendations + predictions
  const [vaultRecs, setVaultRecs] = useState<any[]>([]);
  const [vaultRecsLoading, setVaultRecsLoading] = useState(false);
  const [ltvPrediction, setLtvPrediction] = useState<any>(null);
  const [churnPrediction, setChurnPrediction] = useState<any>(null);
  const [predictionsLoading, setPredictionsLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/dashboard/atlas/fans/${fanId}`);
        const d = await res.json();
        if (d.fan) {
          setFan(d.fan);
          setInteractions(d.interactions ?? []);
          setPurchases(d.purchases ?? []);
          setNotes(d.notes ?? []);
          setDocuments(d.documents ?? []);
          setPendingDrafts(d.pending_drafts ?? []);
        }
      } catch {} finally {
        setLoading(false);
      }
    }
    load();
  }, [fanId]);

  // Load vault recommendations + predictions in parallel
  useEffect(() => {
    if (!fanId) return;
    setVaultRecsLoading(true);
    setPredictionsLoading(true);

    Promise.all([
      fetch("/api/sovereign-chat/vault/recommend-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fan_id: fanId }),
      }).then((r) => r.json()).catch(() => ({ recommendations: [] })),
      fetch(`/api/sovereign-chat/predict/ltv?fan_id=${fanId}`)
        .then((r) => r.json()).catch(() => ({ prediction: null })),
      fetch(`/api/sovereign-chat/predict/churn?fan_id=${fanId}`)
        .then((r) => r.json()).catch(() => ({ prediction: null })),
    ]).then(([vault, ltv, churn]) => {
      setVaultRecs(vault.recommendations || []);
      setVaultRecsLoading(false);
      setLtvPrediction(ltv.prediction);
      setChurnPrediction(churn.prediction);
      setPredictionsLoading(false);
    }).catch(() => {
      setVaultRecsLoading(false);
      setPredictionsLoading(false);
    });
  }, [fanId]);

  const events = buildTimeline(interactions, purchases, pendingDrafts);
  const insights = fan ? generateInsights(fan, interactions, purchases) : [];

  const handleAction = useCallback((action: string) => {
    switch (action) {
      case "merge": setMergeOpen(true); break;
      case "export": setExportOpen(true); break;
      case "delete": setDeleteOpen(true); break;
      case "reengage":
      case "offer":
      case "bundle":
      case "dm_instagram":
      case "dm_onlyfans":
      case "email":
      case "sms":
        // These would trigger the AI drafter or appropriate flow
        break;
    }
  }, []);

  if (loading) {
    return <div className="flex justify-center py-16"><Loader size={16} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} /></div>;
  }

  if (!fan) {
    return (
      <div className="flex flex-col items-center py-16">
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Fan introuvable</p>
        <Link href="/dashboard/atlas/fans" className="text-sm mt-2" style={{ color: "#C75B39" }}>Retour</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/atlas/fans" className="p-1 transition-opacity hover:opacity-70" style={{ color: "#FFFFFF" }}>
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-[var(--color-border)] flex items-center justify-center text-sm font-semibold"
              style={{ backgroundColor: "var(--color-card)" }}>
              {(fan.display_name || fan.email || "?").charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "#FFFFFF" }}>
                {fan.display_name || fan.email || "Fan anonyme"}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] px-2 py-0.5 rounded-sm font-medium" style={{
                  background: `${TIER_COLORS[fan.fan_tier]}20`,
                  color: TIER_COLORS[fan.fan_tier],
                }}>{TIER_LABELS[fan.fan_tier]}</span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Score: {fan.fan_score}/100</span>
                <span className={`text-xs ${fan.status === "active" ? "text-[#10B981]" : "text-[#E5484D]"}`}>
                  ● {fan.status === "active" ? "Actif" : fan.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Header actions */}
        <div className="flex items-center gap-2">
          <button onClick={() => handleAction("export")}
            className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-sm transition-opacity hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.06)", color: "#FFFFFF" }}>
            <Download size={14} /> Exporter
          </button>
          <button onClick={() => handleAction("delete")}
            className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-sm transition-opacity hover:opacity-80"
            style={{ background: "rgba(229,72,77,0.15)", color: "#E5484D" }}>
            <Trash2 size={14} /> Supprimer
          </button>
        </div>
      </div>

      {/* ── 3-Column Layout ── */}
      <div className="grid grid-cols-[320px_1fr_340px] gap-4">

        {/* LEFT COLUMN */}
        <div className="space-y-3">
          <IdentityCard fan={fan} />
          <QuickActionsCard fan={fan} onAction={handleAction} />
          <PlatformIdentitiesCard fan={fan} />
          <GeographyCard fan={fan} />
          <ConsentsCard fan={fan} />
        </div>

        {/* CENTER COLUMN */}
        <div className="border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
          {/* Tabs */}
          <div className="flex border-b border-[var(--color-border)] overflow-x-auto">
            {(Object.entries(TAB_LABELS) as [TabId, string][]).map(([id, label]) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className="px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap"
                style={{
                  color: activeTab === id ? "#C75B39" : "#FFFFFF",
                  borderBottom: activeTab === id ? "2px solid #C75B39" : "2px solid transparent",
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-4 max-h-[600px] overflow-y-auto">
            {activeTab === "timeline" && <TimelineTab events={events} />}
            {activeTab === "conversations" && <ConversationsTab interactions={interactions} />}
            {activeTab === "purchases" && <PurchasesTab purchases={purchases} />}
            {activeTab === "notes" && <NotesTab notes={notes} fanId={fanId} />}
            {activeTab === "documents" && <DocumentsTab documents={documents} fanId={fanId} />}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-3">
          <AiInsightsCard insights={insights} />
          <RecommendedActionsCard fan={fan} onAction={handleAction} />
          <VaultRecommendationsCard recommendations={vaultRecs} loading={vaultRecsLoading} />
          <PredictionsCard ltv={ltvPrediction} churn={churnPrediction} loading={predictionsLoading} />
          <QuickStatsCard fan={fan} />
        </div>
      </div>

      {/* Dialogs */}
      <MergeDialog fan={fan} open={mergeOpen} onClose={() => setMergeOpen(false)} />
      <ExportDialog fan={fan} open={exportOpen} onClose={() => setExportOpen(false)} />
      <DeleteDialog fan={fan} open={deleteOpen} onClose={() => setDeleteOpen(false)} />
    </div>
  );
}
