"use client";

import { useState } from "react";
import { X, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { PLATFORM_LABELS, PLATFORM_COLORS, CHURN_RISK_COLORS, COMPLIANCE_RISK_COLORS } from "@/lib/mock/atlas-fans";
import type { FanIntel } from "@/lib/mock/atlas-fans";
import { FanScoreBreakdown } from "./FanScoreBreakdown";
import { FanTimeline } from "./FanTimeline";
import { FanConsentPanel } from "./FanConsentPanel";
import { FanNotes } from "./FanNotes";
import { FanContentHistory } from "./FanContentHistory";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

type Tab = "profile" | "activity" | "content" | "consent" | "notes";

interface FanProfileDrawerProps {
  fan: FanIntel | null;
  onClose: () => void;
  onAddNote: (fanId: string, content: string) => void;
}

export function FanProfileDrawer({ fan, onClose, onAddNote }: FanProfileDrawerProps) {
  const locale = useLocale();
  const l = norm(locale);
  const [tab, setTab] = useState<Tab>("profile");

  if (!fan) return null;

  const tabs: { key: Tab; labelKey: string }[] = [
    { key: "profile", labelKey: "fan_intel.drawer.profile" },
    { key: "activity", labelKey: "fan_intel.drawer.activity" },
    { key: "content", labelKey: "fan_intel.drawer.content" },
    { key: "consent", labelKey: "fan_intel.drawer.consent" },
    { key: "notes", labelKey: "fan_intel.drawer.notes" },
  ];

  const platformColor = PLATFORM_COLORS[fan.platform] || "rgba(255,255,255,0.3)";

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose} />

      {/* Drawer */}
      <div
        className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] lg:w-[560px] flex flex-col overflow-hidden animate-slide-in-right"
        style={{ backgroundColor: "var(--color-ink, #1A1614)", borderLeft: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Header */}
        <div
          className="shrink-0 flex items-center gap-3 px-4 py-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", minHeight: 56 }}
        >
          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-display font-bold shrink-0"
            style={{ backgroundColor: "var(--color-accent, var(--or, #D8A95B))", color: "#fff" }}
          >
            {fan.pseudonyme.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium truncate" style={{ color: "var(--text-primary)" }}>
                {fan.pseudonyme}
              </span>
              <Link
                href={`/dashboard/atlas/fans/${fan.id}`}
                className="shrink-0 p-0.5 transition-opacity hover:opacity-70"
                style={{ color: "rgba(255,255,255,0.3)" }}
                title="Voir la fiche complète"
              >
                <ExternalLink size={13} />
              </Link>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="text-[9px] px-1.5 py-0.5 rounded-sm font-medium"
                style={{ backgroundColor: `${platformColor}20`, color: platformColor }}
              >
                {PLATFORM_LABELS[fan.platform] || fan.platform}
              </span>
              <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                {fan.country}
              </span>
            </div>
          </div>

          {/* KPI quick view */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <div className="text-center">
              <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>Total</p>
              <p className="text-[11px] font-medium" style={{ color: "var(--success)" }}>€{fan.totalSpend}</p>
            </div>
            <div className="text-center">
              <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>Churn</p>
              <p className="text-[11px] font-medium" style={{ color: CHURN_RISK_COLORS(fan.churnRisk) }}>{fan.churnRisk}%</p>
            </div>
            <div className="text-center">
              <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>Conform</p>
              <p className="text-[11px] font-medium" style={{ color: COMPLIANCE_RISK_COLORS(fan.complianceRisk) }}>{fan.complianceRisk}%</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 shrink-0 transition-opacity hover:opacity-70"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab bar */}
        <div className="shrink-0 flex" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {tabs.map((tb) => (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className="flex-1 px-2 py-2.5 text-[10px] font-medium uppercase tracking-wider transition-colors"
              style={{
                color: tab === tb.key ? "var(--color-accent, var(--or, #D8A95B))" : "rgba(255,255,255,0.25)",
                borderBottom: tab === tb.key ? "2px solid var(--color-accent, var(--or, #D8A95B))" : "2px solid transparent",
              }}
            >
              {t(tb.labelKey, l)}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          {tab === "profile" && <FanScoreBreakdown fan={fan} />}
          {tab === "activity" && <FanTimeline events={fan.events} />}
          {tab === "content" && <FanContentHistory fan={fan} />}
          {tab === "consent" && (
            <FanConsentPanel
              consentStatus={fan.consentStatus}
              emailConsent={fan.consentStatus === "active"}
              smsConsent={fan.consentStatus === "active" && fan.tags.includes("vip")}
              pushConsent={fan.consentStatus === "active"}
              dataProcessingConsent={fan.consentStatus === "active"}
            />
          )}
          {tab === "notes" && (
            <FanNotes
              notes={fan.notes}
              onAddNote={(content) => onAddNote(fan.id, content)}
            />
          )}
        </div>
      </div>
    </>
  );
}
