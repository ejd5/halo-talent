"use client";

import { ArrowLeft, TrendingUp, DollarSign, Calendar, BarChart3, Tag, X } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { RevenueThread } from "@/lib/mock/atlas-revenue-inbox";
import { ComplianceRiskBadge } from "./ComplianceRiskBadge";
import { NextBestAction } from "./NextBestAction";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function formatAmount(n: number): string {
  if (n >= 1000) return `€${(n / 1000).toFixed(1)}k`;
  return `€${n}`;
}

interface FanOpportunityCardProps {
  thread: RevenueThread | null;
  onClose: () => void;
}

export function FanOpportunityCard({ thread, onClose }: FanOpportunityCardProps) {
  const locale = useLocale();
  const l = norm(locale);

  if (!thread) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <BarChart3 size={32} style={{ color: "rgba(255,255,255,0.1)" }} />
        <p className="text-[12px] mt-3" style={{ color: "rgba(255,255,255,0.3)" }}>
          {t("revenue_inbox.select_thread_profile", l)}
        </p>
      </div>
    );
  }

  const ppvCount = thread.messages.filter((m) => m.isPPV).length;
  const ppvTotal = thread.messages.reduce((sum, m) => sum + (m.ppvAmount || 0), 0);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Mobile back */}
      <button
        onClick={onClose}
        className="lg:hidden flex items-center gap-2 p-3 text-[12px]"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        <ArrowLeft size={14} />
        {t("revenue_inbox.back_to_list", l)}
      </button>

      {/* Fan identity */}
      <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-display font-bold shrink-0"
            style={{ backgroundColor: "var(--color-accent, var(--or, #D8A95B))", color: "#fff" }}
          >
            {thread.fanName.charAt(0)}
          </div>
          <div>
            <h3
              className="text-sm font-display font-semibold"
              style={{ color: "var(--color-base, #F5F0EB)" }}
            >
              {thread.fanName}
            </h3>
            <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              {thread.country} · {thread.language.toUpperCase()}
            </span>
          </div>
        </div>

        {/* KPI grid 2×2 */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
            <div className="flex items-center gap-1 text-[10px] mb-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>
              <TrendingUp size={10} />
              LTV
            </div>
            <span className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
              {formatAmount(thread.ltv)}
            </span>
          </div>
          <div className="p-2 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
            <div className="flex items-center gap-1 text-[10px] mb-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>
              <Calendar size={10} />
              30j
            </div>
            <span className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
              {formatAmount(thread.spendLast30d)}
            </span>
          </div>
          <div className="p-2 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
            <div className="flex items-center gap-1 text-[10px] mb-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>
              <DollarSign size={10} />
              PPV ({ppvCount})
            </div>
            <span className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
              {formatAmount(ppvTotal)}
            </span>
          </div>
          <div className="p-2 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
            <div className="flex items-center gap-1 text-[10px] mb-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>
              <Calendar size={10} />
              {t("revenue_inbox.last_purchase", l)}
            </div>
            <span className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
              {formatDate(thread.lastPurchaseDate)}
            </span>
          </div>
        </div>
      </div>

      {/* Scores */}
      <div className="p-4 border-b space-y-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        {[
          { label: t("revenue_inbox.intent_score", l), value: thread.intentScore, color: "var(--color-accent, var(--or, #D8A95B))" },
          { label: t("revenue_inbox.fan_value_score", l), value: thread.fanValueScore, color: "#8B5CF6" },
          { label: t("revenue_inbox.relationship_score", l), value: thread.relationshipScore, color: "#3B82F6" },
          { label: t("revenue_inbox.compliance_risk_score", l), value: thread.complianceRiskScore, color: "var(--danger)", reverse: true },
        ].map((score) => (
          <div key={score.label} className="flex items-center gap-2">
            <span className="text-[10px] w-28 shrink-0" style={{ color: "rgba(255,255,255,0.35)" }}>
              {score.label}
            </span>
            <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: `${score.value}%`,
                  backgroundColor: score.color,
                  opacity: score.reverse ? 0.6 + (score.value / 100) * 0.4 : undefined,
                }}
              />
            </div>
            <span className="text-[10px] w-6 text-right" style={{ color: "rgba(255,255,255,0.4)" }}>
              {score.value}
            </span>
          </div>
        ))}
      </div>

      {/* Risk + Tags */}
      <div className="p-4 border-b space-y-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <ComplianceRiskBadge level={thread.riskLevel} warning={thread.complianceWarning} />
        <div className="flex flex-wrap gap-1.5">
          {thread.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-sm"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Next Best Action */}
      <div className="p-4">
        <NextBestAction
          action={thread.recommendedAction}
          offer={thread.recommendedOffer}
          expectedRevenueImpact={thread.revenuePotential}
          threadStatus={thread.status}
        />
      </div>
    </div>
  );
}
