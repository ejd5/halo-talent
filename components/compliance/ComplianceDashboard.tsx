"use client";

import { useMemo } from "react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { COMPLIANCE_SCORE, COMPLIANCE_ALERTS } from "@/lib/mock/atlas-compliance";
import { SensitiveWordsPanel } from "./SensitiveWordsPanel";
import { AutomationReviewQueue } from "./AutomationReviewQueue";
import { ConsentOverview } from "./ConsentOverview";
import { PlatformRulesPanel } from "./PlatformRulesPanel";
import { AuditLogTable } from "./AuditLogTable";
import { RiskPolicyEditor } from "./RiskPolicyEditor";
import { DataRequestPanel } from "./DataRequestPanel";
import { Shield, AlertTriangle, Download } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const ALERT_LEVEL_COLORS: Record<string, string> = {
  critical: "var(--danger)",
  warning: "#F59E0B",
  info: "#3B82F6",
};

export function ComplianceDashboard() {
  const locale = useLocale();
  const l = norm(locale);

  const scoreColor = useMemo(() => {
    if (COMPLIANCE_SCORE >= 80) return "var(--success)";
    if (COMPLIANCE_SCORE >= 60) return "#F59E0B";
    return "var(--danger)";
  }, []);

  const handleExport = () => {
    const report = {
      exportedAt: new Date().toISOString(),
      complianceScore: COMPLIANCE_SCORE,
      alerts: COMPLIANCE_ALERTS,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compliance-report-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1
              className="text-[1.8rem] md:text-[2.2rem] font-semibold mb-1"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              {t("compliance.title", l)}
            </h1>
            <p className="text-sm max-w-xl" style={{ color: "var(--color-ink-secondary)" }}>
              {t("compliance.subtitle", l)}
            </p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] transition-colors"
            style={{ background: "rgba(199,91,57,0.1)", color: "var(--accent)" }}
          >
            <Download size={12} />
            {t("compliance.export_report", l)}
          </button>
        </div>

        {/* GDPR/ePrivacy disclaimer banner */}
        <div
          className="p-3 text-[9px] leading-relaxed"
          style={{ background: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.1)", color: "rgba(255,255,255,0.5)" }}
        >
          <span style={{ color: "#3B82F6" }}>ⓘ</span> {t("compliance.copy_banner", l)}
        </div>

        {/* Score + Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Score card */}
          <div
            className="p-5 flex flex-col items-center justify-center"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
          >
            <Shield size={24} style={{ color: scoreColor, marginBottom: 8 }} />
            <p className="text-[36px] font-bold" style={{ fontFamily: "var(--font-display)", color: scoreColor }}>
              {COMPLIANCE_SCORE}%
            </p>
            <p className="text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
              {t("compliance.score_label", l)}
            </p>
            <p className="text-[7px] mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>
              {t("compliance.last_evaluated", l)} : {new Date().toLocaleDateString("fr-FR")}
            </p>
          </div>

          {/* Alerts */}
          <div className="md:col-span-2">
            <p className="text-[10px] font-medium mb-2 flex items-center gap-1" style={{ color: "rgba(255,255,255,0.5)" }}>
              <AlertTriangle size={11} />
              {t("compliance.alert.priority", l)}
            </p>
            <div className="grid grid-cols-1 gap-2">
              {COMPLIANCE_ALERTS.map((alert) => {
                const alertColor = ALERT_LEVEL_COLORS[alert.level];
                return (
                  <div
                    key={alert.id}
                    className="flex items-start gap-2 p-3"
                    style={{
                      background: `${alertColor}08`,
                      border: `1px solid ${alertColor}20`,
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full mt-0.5 shrink-0" style={{ background: alertColor }} />
                    <p className="text-[9px]" style={{ color: "var(--text-primary)" }}>
                      {t(alert.messageKey, l)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2-col: Sensitive Words (1/2) + Review Queue (1/2) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <SensitiveWordsPanel />
          <AutomationReviewQueue />
        </div>

        {/* Consent Overview */}
        <ConsentOverview />

        {/* Platform Rules */}
        <PlatformRulesPanel />

        {/* 2-col: Risk Policies (1/2) + Data Requests (1/2) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <RiskPolicyEditor />
          <DataRequestPanel />
        </div>

        {/* Audit Log */}
        <AuditLogTable />
      </div>
    </div>
  );
}
