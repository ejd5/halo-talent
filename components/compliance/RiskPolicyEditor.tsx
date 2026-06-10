"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { RISK_POLICIES, POLICY_ACTION_LABELS, type RiskPolicy, type PolicyAction } from "@/lib/mock/atlas-compliance";
import { Shield } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const ACTION_COLORS: Record<PolicyAction, string> = {
  block: "var(--danger)",
  flag: "#F59E0B",
  log: "#3B82F6",
};

interface RiskPolicyEditorProps {
  policies?: RiskPolicy[];
}

export function RiskPolicyEditor({ policies = RISK_POLICIES }: RiskPolicyEditorProps) {
  const locale = useLocale();
  const l = norm(locale);
  const [policyList, setPolicyList] = useState(policies);

  const togglePolicy = (id: string) => {
    setPolicyList((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
  };

  const updateThreshold = (id: string, threshold: number) => {
    setPolicyList((prev) => prev.map((p) => (p.id === id ? { ...p, threshold } : p)));
  };

  const updateAction = (id: string, action: PolicyAction) => {
    setPolicyList((prev) => prev.map((p) => (p.id === id ? { ...p, action } : p)));
  };

  return (
    <div>
      <h2 className="text-[13px] font-display font-bold mb-3" style={{ color: "var(--text-primary)" }}>
        {t("compliance.policies.title", l)}
      </h2>
      <div
        className="p-4"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
      >
        <div className="space-y-3">
          {policyList.map((policy) => {
            const actionColor = ACTION_COLORS[policy.action];
            return (
              <div
                key={policy.id}
                className="p-3"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-default)",
                  opacity: policy.enabled ? 1 : 0.5,
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Shield size={10} style={{ color: policy.enabled ? "var(--success)" : "rgba(255,255,255,0.3)" }} />
                    <span className="text-[10px] font-medium" style={{ color: "var(--text-primary)" }}>
                      {t(policy.nameKey, l)}
                    </span>
                  </div>
                  <button
                    onClick={() => togglePolicy(policy.id)}
                    className="text-[7px] px-1.5 py-0.5 transition-colors"
                    style={{
                      background: policy.enabled ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.03)",
                      color: policy.enabled ? "var(--success)" : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {policy.enabled ? t("compliance.policies.enabled", l) : t("compliance.policies.disabled", l)}
                  </button>
                </div>

                <p className="text-[8px] mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {t(policy.descriptionKey, l)}
                </p>

                <div className="flex items-center gap-3">
                  {/* Threshold slider */}
                  <div className="flex-1">
                    <input
                      type="range"
                      min={1}
                      max={100}
                      value={policy.threshold}
                      onChange={(e) => updateThreshold(policy.id, Number(e.target.value))}
                      className="w-full h-1"
                      style={{ accentColor: "var(--accent)" }}
                      disabled={!policy.enabled}
                    />
                    <span className="text-[7px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {t("compliance.policies.threshold", l).replace("{n}", String(policy.threshold))}
                    </span>
                  </div>

                  {/* Action selector */}
                  <select
                    value={policy.action}
                    onChange={(e) => updateAction(policy.id, e.target.value as PolicyAction)}
                    className="text-[8px] px-1.5 py-1"
                    style={{ background: `${actionColor}15`, border: `1px solid ${actionColor}30`, color: actionColor, outline: "none" }}
                    disabled={!policy.enabled}
                  >
                    {(["block", "flag", "log"] as PolicyAction[]).map((a) => (
                      <option key={a} value={a}>{POLICY_ACTION_LABELS[a]}</option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
