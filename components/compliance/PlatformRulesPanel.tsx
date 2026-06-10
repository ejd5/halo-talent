"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { PLATFORM_RULES, PLATFORM_COLORS, type PlatformRules } from "@/lib/mock/atlas-compliance";
import { Shield } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const RISK_COLORS: Record<string, string> = {
  low: "var(--success)",
  medium: "#F59E0B",
  high: "var(--danger)",
};

interface PlatformRulesPanelProps {
  rules?: PlatformRules[];
}

export function PlatformRulesPanel({ rules = PLATFORM_RULES }: PlatformRulesPanelProps) {
  const locale = useLocale();
  const l = norm(locale);
  const [platformRules, setPlatformRules] = useState(rules);

  const toggleRule = (platformIdx: number, ruleIdx: number) => {
    setPlatformRules((prev) => {
      const next = [...prev];
      next[platformIdx] = {
        ...next[platformIdx],
        rules: next[platformIdx].rules.map((r, i) => (i === ruleIdx ? { ...r, enabled: !r.enabled } : r)),
      };
      return next;
    });
  };

  return (
    <div>
      <h2 className="text-[13px] font-display font-bold mb-3" style={{ color: "var(--text-primary)" }}>
        {t("compliance.rules.title", l)}
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
        {platformRules.map((pr, pi) => {
          const platformColor = PLATFORM_COLORS[pr.platform] || "var(--accent)";
          const riskColor = RISK_COLORS[pr.riskLevel];
          return (
            <div
              key={pr.platform}
              className="shrink-0 w-[220px]"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-default)",
              }}
            >
              {/* Platform header */}
              <div
                className="flex items-center justify-between px-3 py-2"
                style={{ borderBottom: "1px solid var(--border-default)" }}
              >
                <div className="flex items-center gap-1.5">
                  <Shield size={10} style={{ color: platformColor }} />
                  <span className="text-[10px] font-medium" style={{ color: "var(--text-primary)" }}>{pr.platform}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: riskColor }} />
                  <span className="text-[7px]" style={{ color: riskColor }}>
                    {t(`compliance.rules.risk_${pr.riskLevel}`, l)}
                  </span>
                </div>
              </div>

              {/* Rules */}
              <div className="p-2 space-y-1">
                {pr.rules.map((rule, ri) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between px-2 py-1"
                    style={{ background: "var(--bg-card)" }}
                  >
                    <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {t(rule.labelKey, l)}
                    </span>
                    <button
                      onClick={() => toggleRule(pi, ri)}
                      className="text-[7px] px-1.5 py-0.5 transition-colors"
                      style={{
                        background: rule.enabled ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.03)",
                        color: rule.enabled ? "var(--success)" : "rgba(255,255,255,0.3)",
                      }}
                    >
                      {rule.enabled ? t("compliance.rules.enabled", l) : t("compliance.rules.disabled", l)}
                    </button>
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
