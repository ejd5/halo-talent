"use client";

import { Zap, DollarSign, Clock, UserCheck } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { ActionType, OfferType, ThreadStatus } from "@/lib/mock/atlas-revenue-inbox";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

interface NextBestActionProps {
  action: ActionType;
  offer: OfferType;
  expectedRevenueImpact?: number;
  threadStatus?: ThreadStatus;
}

export function NextBestAction({ action, offer, expectedRevenueImpact, threadStatus }: NextBestActionProps) {
  const locale = useLocale();
  const l = norm(locale);

  const isDormant = threadStatus === "dormant";
  const isEscalated = threadStatus === "escalated";

  return (
    <div
      className="p-4 rounded-sm"
      style={{ backgroundColor: "rgba(199,91,57,0.06)", border: "1px solid rgba(199,91,57,0.12)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        {isEscalated ? (
          <UserCheck size={14} style={{ color: "#F59E0B" }} />
        ) : isDormant ? (
          <Clock size={14} style={{ color: "rgba(255,255,255,0.4)" }} />
        ) : (
          <Zap size={14} style={{ color: "var(--color-accent, #C75B39)" }} />
        )}
        <span className="text-[11px] font-medium" style={{ color: "var(--color-accent, #C75B39)" }}>
          {isEscalated
            ? t("revenue_inbox.status_escalated", l)
            : t(`revenue_inbox.action_${action}` as any, l)}
        </span>
      </div>

      {/* Offer */}
      <div className="flex items-center gap-1.5 mb-2">
        <DollarSign size={12} style={{ color: "rgba(255,255,255,0.4)" }} />
        <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.6)" }}>
          {t(`revenue_inbox.offer_${offer}` as any, l)}
        </span>
      </div>

      {/* Impact */}
      {expectedRevenueImpact && expectedRevenueImpact > 0 && (
        <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
          {t("revenue_inbox.expected_impact", l)}: +{expectedRevenueImpact}€
        </p>
      )}
      {(!expectedRevenueImpact || expectedRevenueImpact <= 0) && (
        <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
          {t("revenue_inbox.no_impact_estimate", l)}
        </p>
      )}
    </div>
  );
}
