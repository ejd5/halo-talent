"use client";

import { MessageCircle, DollarSign, Clock, X, Sparkles, Lightbulb } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { OPPORTUNITY_COLORS } from "@/lib/mock/atlas-revenue-radar";
import type { RadarOpportunity } from "@/lib/mock/atlas-revenue-radar";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ", ";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "aujourd'hui";
  if (days === 1) return "hier";
  return `il y a ${days}j`;
}

function formatEUR(amount: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount);
}

export function RadarOpportunityCard({
  opportunity: opp,
  variant,
  onOpenConversation,
  onPreparePPV,
  onSchedule21h,
  onIgnore,
}: {
  opportunity: RadarOpportunity;
  variant: "list" | "kanban";
  onOpenConversation?: () => void;
  onPreparePPV?: () => void;
  onSchedule21h?: () => void;
  onIgnore?: () => void;
}) {
  const locale = useLocale();
  const l = norm(locale);
  const borderColor = OPPORTUNITY_COLORS[opp.opportunityType] || "var(--border-default)";
  const isCompact = variant === "kanban";

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        borderLeft: `4px solid ${borderColor}`,
        borderTop: "1px solid var(--border-default)",
        borderRight: "1px solid var(--border-default)",
        borderBottom: "1px solid var(--border-default)",
        backgroundColor: "var(--bg-surface)",
      }}
    >
      <div className="px-3 py-2.5">
        {/* Header row */}
        <div className="flex items-center gap-2 mb-1.5">
          <div
            className="w-7 h-7 flex items-center justify-center text-[10px] font-semibold shrink-0 rounded-full"
            style={{ backgroundColor: `${borderColor}20`, color: borderColor }}
          >
            {opp.fanName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                {opp.fanName}
              </span>
              <span
                className="text-[9px] font-medium px-1.5 py-0.5 rounded shrink-0"
                style={{
                  backgroundColor: `${borderColor}15`,
                  color: borderColor,
                }}
              >
                {opp.opportunityType === "ppv" ? t("revenue_radar.type_ppv", l)
                  : opp.opportunityType === "tip" ? t("revenue_radar.type_tip", l)
                  : opp.opportunityType === "reabonnement" ? t("revenue_radar.type_reabonnement", l)
                  : t("revenue_radar.type_upsell", l)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px]" style={{ color: "var(--text-tertiary)" }}>
                {opp.segment} · {opp.platform}
              </span>
            </div>
          </div>
          {!isCompact && (
            <div className="text-right shrink-0">
              <span className="text-[13px] font-bold" style={{ color: "var(--accent)" }}>
                {formatEUR(opp.potentialRevenue)}
              </span>
              <p className="text-[8px]" style={{ color: "var(--text-tertiary)" }}>
                {t("revenue_radar.card_revenue_potential", l)}
              </p>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 mb-1.5 text-[10px]" style={{ color: "var(--text-secondary)" }}>
          <span>{t("revenue_radar.card_last_purchase", l)} : {formatDate(opp.lastPurchase)}</span>
          {!isCompact && (
            <>
              <span>{t("revenue_radar.card_total_spend", l)} : {formatEUR(opp.totalSpend)}</span>
              <span>{t("revenue_radar.card_avg_order", l)} : {formatEUR(opp.averageOrderValue)}</span>
            </>
          )}
        </div>

        {/* AI Insight */}
        <div
          className="flex items-start gap-1.5 mb-1.5 px-2 py-1.5 rounded text-[10px] leading-relaxed"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <Lightbulb size={10} className="shrink-0 mt-0.5" style={{ color: "var(--warning-text)" }} />
          <span style={{ color: "var(--text-secondary)" }}>
            <span className="font-medium" style={{ color: "var(--text-primary)" }}>
              {t("revenue_radar.card_ai_insight", l)} :
            </span>{" "}
            {opp.aiInsight}
          </span>
        </div>

        {/* AI Suggestion (only in list mode) */}
        {!isCompact && (
          <details className="mb-1.5">
            <summary className="text-[10px] font-medium cursor-pointer" style={{ color: "var(--text-secondary)" }}>
              <Sparkles size={10} className="inline mr-1" style={{ color: "var(--accent)" }} />
              {t("revenue_radar.card_ai_suggestion", l)}
            </summary>
            <p
              className="mt-1 text-[10px] leading-relaxed px-2 py-1.5 rounded"
              style={{ backgroundColor: "var(--bg-card)", color: "var(--text-secondary)" }}
            >
              {opp.aiSuggestion}
            </p>
          </details>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-1 mt-1.5 flex-wrap">
          <ActionButton
            icon={MessageCircle}
            label={t("revenue_radar.card_open_conversation", l)}
            onClick={onOpenConversation}
            compact={isCompact}
          />
          {opp.opportunityType === "ppv" && (
            <ActionButton
              icon={DollarSign}
              label={t("revenue_radar.card_prepare_ppv", l)}
              onClick={onPreparePPV}
              accent
              compact={isCompact}
            />
          )}
          <ActionButton
            icon={Clock}
            label={t("revenue_radar.card_schedule_21h", l)}
            onClick={onSchedule21h}
            compact={isCompact}
          />
          <ActionButton
            icon={X}
            label={t("revenue_radar.card_ignore", l)}
            onClick={onIgnore}
            compact={isCompact}
            subtle
          />
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  accent,
  subtle,
  compact,
}: {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  accent?: boolean;
  subtle?: boolean;
  compact?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-1.5 py-1 text-[9px] font-medium transition-colors rounded"
      style={{
        color: subtle ? "var(--text-tertiary)" : accent ? "#fff" : "var(--text-secondary)",
        backgroundColor: accent ? "var(--accent)" : "transparent",
        opacity: subtle ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (!accent && !subtle) e.currentTarget.style.backgroundColor = "var(--bg-hover)";
      }}
      onMouseLeave={(e) => {
        if (!accent && !subtle) e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <Icon size={compact ? 10 : 11} />
      {!compact && <span>{label}</span>}
    </button>
  );
}
