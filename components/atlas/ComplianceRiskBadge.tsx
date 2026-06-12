"use client";

import { AlertTriangle } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { RiskLevel } from "@/lib/mock/atlas-revenue-inbox";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const RISK_CONFIG: Record<RiskLevel, { bg: string; text: string; key: string }> = {
  low: { bg: "rgba(16,185,129,0.15)", text: "var(--success)", key: "revenue_inbox.risk_low" },
  medium: { bg: "rgba(245,158,11,0.15)", text: "#F59E0B", key: "revenue_inbox.risk_medium" },
  high: { bg: "rgba(249,115,22,0.15)", text: "var(--or, #D8A95B)", key: "revenue_inbox.risk_high" },
  critical: { bg: "rgba(229,72,77,0.18)", text: "var(--danger)", key: "revenue_inbox.risk_critical" },
};

interface ComplianceRiskBadgeProps {
  level: RiskLevel;
  warning?: string | null;
  compact?: boolean;
}

export function ComplianceRiskBadge({ level, warning, compact }: ComplianceRiskBadgeProps) {
  const locale = useLocale();
  const l = norm(locale);
  const cfg = RISK_CONFIG[level];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm ${compact ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-[11px]"}`}
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
      title={warning ?? undefined}
    >
      <AlertTriangle size={compact ? 10 : 12} />
      {t(cfg.key, l)}
    </span>
  );
}
