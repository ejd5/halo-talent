"use client";

import { useState } from "react";
import { Search, Filter, TrendingUp, AlertTriangle, DollarSign, Clock, X, Inbox } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { RevenueThread } from "@/lib/mock/atlas-revenue-inbox";
import { ComplianceRiskBadge } from "./ComplianceRiskBadge";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

export interface ThreadFilters {
  platform: string;
  language: string;
  fanStatus: string;
  riskLevel: string;
  vipOnly: boolean;
  dormantOnly: boolean;
  search: string;
}

export type SortMode = "composite" | "intent" | "revenue" | "risk" | "recency";

interface RevenueThreadListProps {
  threads: RevenueThread[];
  selectedThreadId: string | null;
  onSelectThread: (thread: RevenueThread) => void;
  sortMode: SortMode;
  onSortChange: (mode: SortMode) => void;
  filters: ThreadFilters;
  onFiltersChange: (filters: ThreadFilters) => void;
}

const SORT_OPTIONS: { value: SortMode; key: string }[] = [
  { value: "composite", key: "revenue_inbox.sort_priority" },
  { value: "intent", key: "revenue_inbox.sort_intent" },
  { value: "revenue", key: "revenue_inbox.sort_revenue" },
  { value: "risk", key: "revenue_inbox.sort_risk" },
  { value: "recency", key: "revenue_inbox.sort_recency" },
];

const CHANNEL_ICONS: Record<string, string> = {
  onlyfans: "OF",
  fansly: "FY",
  mym: "MY",
  fanvue: "FV",
  instagram: "IG",
  tiktok: "TK",
};

function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}j`;
  return `${Math.floor(days / 30)}mo`;
}

function formatAmount(n: number): string {
  if (n >= 1000) return `€${(n / 1000).toFixed(1)}k`;
  return `€${n}`;
}

export function RevenueThreadList({
  threads,
  selectedThreadId,
  onSelectThread,
  sortMode,
  onSortChange,
  filters,
  onFiltersChange,
}: RevenueThreadListProps) {
  const locale = useLocale();
  const l = norm(locale);
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters =
    filters.platform || filters.language || filters.fanStatus || filters.riskLevel || filters.vipOnly || filters.dormantOnly;

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "var(--color-ink, #1A1614)" }}>
      {/* Header */}
      <div className="shrink-0 p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} style={{ color: "var(--color-accent, #C75B39)" }} />
            <h2 className="text-sm font-display font-semibold" style={{ color: "var(--color-base, #F5F0EB)" }}>
              {t("revenue_inbox.title", l)}
            </h2>
          </div>
          <span
            className="text-[11px] px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}
          >
            {threads.length}
          </span>
        </div>

        {/* Search + Filter toggle */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2"
              style={{ color: "rgba(255,255,255,0.2)" }}
            />
            <input
              type="text"
              placeholder={t("revenue_inbox.search_placeholder", l)}
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="w-full pl-7 pr-3 py-1.5 rounded-sm text-[12px] outline-none border"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                borderColor: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.7)",
              }}
            />
            {filters.search && (
              <button
                onClick={() => onFiltersChange({ ...filters, search: "" })}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <X size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1.5 rounded-sm transition-colors ${hasActiveFilters ? "" : ""}`}
            style={{
              backgroundColor: hasActiveFilters
                ? "rgba(199,91,57,0.15)"
                : "rgba(255,255,255,0.04)",
            }}
          >
            <Filter
              size={14}
              style={{ color: hasActiveFilters ? "var(--color-accent, #C75B39)" : "rgba(255,255,255,0.4)" }}
            />
          </button>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1.5 mt-2 overflow-x-auto">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSortChange(opt.value)}
              className="shrink-0 text-[10px] px-2 py-0.5 rounded-sm transition-colors"
              style={{
                backgroundColor:
                  sortMode === opt.value ? "rgba(199,91,57,0.15)" : "transparent",
                color: sortMode === opt.value ? "var(--color-accent, #C75B39)" : "rgba(255,255,255,0.35)",
              }}
            >
              {t(opt.key, l)}
            </button>
          ))}
        </div>

        {/* Filter drawer */}
        {showFilters && (
          <div className="mt-3 p-3 rounded-sm space-y-2" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={filters.platform}
                onChange={(e) => onFiltersChange({ ...filters, platform: e.target.value })}
                className="text-[11px] px-2 py-1 rounded-sm outline-none"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "none" }}
              >
                <option value="">{t("revenue_inbox.filter_platform", l)}</option>
                <option value="onlyfans">OnlyFans</option>
                <option value="fansly">Fansly</option>
                <option value="mym">MYM</option>
                <option value="fanvue">Fanvue</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
              </select>
              <select
                value={filters.language}
                onChange={(e) => onFiltersChange({ ...filters, language: e.target.value })}
                className="text-[11px] px-2 py-1 rounded-sm outline-none"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "none" }}
              >
                <option value="">{t("revenue_inbox.filter_language", l)}</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
                <option value="pt-BR">Português</option>
                <option value="it">Italiano</option>
              </select>
              <select
                value={filters.fanStatus}
                onChange={(e) => onFiltersChange({ ...filters, fanStatus: e.target.value })}
                className="text-[11px] px-2 py-1 rounded-sm outline-none"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "none" }}
              >
                <option value="">{t("revenue_inbox.filter_tier", l)}</option>
                <option value="vip">VIP</option>
                <option value="loyal">Loyal</option>
                <option value="active">Active</option>
                <option value="new">New</option>
                <option value="dormant">Dormant</option>
                <option value="at-risk">At-risk</option>
              </select>
              <select
                value={filters.riskLevel}
                onChange={(e) => onFiltersChange({ ...filters, riskLevel: e.target.value })}
                className="text-[11px] px-2 py-1 rounded-sm outline-none"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "none" }}
              >
                <option value="">{t("revenue_inbox.filter_risk", l)}</option>
                <option value="low">{t("revenue_inbox.risk_low", l)}</option>
                <option value="medium">{t("revenue_inbox.risk_medium", l)}</option>
                <option value="high">{t("revenue_inbox.risk_high", l)}</option>
                <option value="critical">{t("revenue_inbox.risk_critical", l)}</option>
              </select>
            </div>
            <div className="flex gap-3">
              <label className="flex items-center gap-1.5 text-[11px] cursor-pointer" style={{ color: "rgba(255,255,255,0.4)" }}>
                <input
                  type="checkbox"
                  checked={filters.vipOnly}
                  onChange={(e) => onFiltersChange({ ...filters, vipOnly: e.target.checked })}
                  className="accent-[var(--accent)]"
                />
                {t("revenue_inbox.filter_vip_only", l)}
              </label>
              <label className="flex items-center gap-1.5 text-[11px] cursor-pointer" style={{ color: "rgba(255,255,255,0.4)" }}>
                <input
                  type="checkbox"
                  checked={filters.dormantOnly}
                  onChange={(e) => onFiltersChange({ ...filters, dormantOnly: e.target.checked })}
                  className="accent-[var(--accent)]"
                />
                {t("revenue_inbox.filter_dormant_only", l)}
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto">
        {threads.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full px-4 text-center">
            <Inbox size={32} style={{ color: "rgba(255,255,255,0.1)" }} />
            <p className="text-[12px] mt-3" style={{ color: "rgba(255,255,255,0.3)" }}>
              {hasActiveFilters
                ? t("revenue_inbox.no_results", l)
                : t("revenue_inbox.no_threads", l)}
            </p>
            <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.15)" }}>
              {hasActiveFilters
                ? t("revenue_inbox.no_results_desc", l)
                : t("revenue_inbox.no_threads_desc", l)}
            </p>
          </div>
        ) : (
          threads.map((thread) => {
            const isSelected = selectedThreadId === thread.id;
            return (
              <button
                key={thread.id}
                onClick={() => onSelectThread(thread)}
                className="w-full text-left p-3 border-b transition-colors"
                style={{
                  borderColor: "rgba(255,255,255,0.04)",
                  backgroundColor: isSelected ? "rgba(199,91,57,0.08)" : "transparent",
                  borderLeft: isSelected ? "2px solid var(--color-accent, #C75B39)" : "2px solid transparent",
                }}
              >
                {/* Row 1: Avatar + Name + Platform + Unread */}
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-display font-bold shrink-0"
                    style={{ backgroundColor: "var(--color-accent, #C75B39)", color: "#fff" }}
                  >
                    {thread.fanName.charAt(0)}
                  </div>
                  <span
                    className="text-[12px] font-medium truncate flex-1"
                    style={{ color: "var(--color-base, #F5F0EB)" }}
                  >
                    {thread.fanName}
                  </span>
                  <span
                    className="text-[9px] px-1 py-0.5 rounded-sm font-display shrink-0"
                    style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}
                  >
                    {CHANNEL_ICONS[thread.platform] || thread.platform}
                  </span>
                  {thread.unread && (
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: "var(--color-accent, #C75B39)" }}
                    />
                  )}
                </div>

                {/* Row 2: Preview */}
                <p
                  className="text-[11px] truncate mb-2 pl-9"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {thread.lastMessagePreview}
                </p>

                {/* Row 3: Intent bar + Risk badge + Revenue + Time */}
                <div className="flex items-center gap-2 pl-9">
                  {/* Intent score mini bar */}
                  <div className="flex items-center gap-1 flex-1">
                    <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                      <div
                        className="h-1 rounded-full transition-all"
                        style={{
                          width: `${thread.intentScore}%`,
                          backgroundColor:
                            thread.intentScore >= 70
                              ? "var(--success)"
                              : thread.intentScore >= 40
                              ? "#F59E0B"
                              : "rgba(255,255,255,0.3)",
                        }}
                      />
                    </div>
                    <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                      {thread.intentScore}
                    </span>
                  </div>

                  <ComplianceRiskBadge level={thread.riskLevel} compact />

                  <span
                    className="text-[10px] shrink-0 font-medium"
                    style={{ color: "var(--color-accent, #C75B39)" }}
                  >
                    {formatAmount(thread.revenuePotential * 10)}
                  </span>

                  <span className="text-[10px] shrink-0" style={{ color: "rgba(255,255,255,0.2)" }}>
                    {formatRelativeTime(thread.lastMessageDate)}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
