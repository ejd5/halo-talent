"use client";

import { ShieldCheck, ShieldAlert, ShieldOff, Info, CheckCircle, XCircle } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { PPVGuardrailCheck, GuardrailStatus } from "@/lib/mock/atlas-ppv";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

interface PPVGuardrailsProps {
  checks: PPVGuardrailCheck[];
  hasWarnOrBlock: boolean;
}

const STATUS_ICONS: Record<GuardrailStatus, React.ElementType> = {
  pass: CheckCircle,
  warn: ShieldAlert,
  block: XCircle,
};

const STATUS_COLORS: Record<GuardrailStatus, string> = {
  pass: "var(--success)",
  warn: "#F59E0B",
  block: "var(--danger)",
};

const STATUS_BG: Record<GuardrailStatus, string> = {
  pass: "rgba(16,185,129,0.08)",
  warn: "rgba(245,158,11,0.08)",
  block: "rgba(229,72,77,0.08)",
};

export function PPVGuardrails({ checks, hasWarnOrBlock }: PPVGuardrailsProps) {
  const locale = useLocale();
  const l = norm(locale);

  return (
    <div className="p-4 space-y-4">
      {/* Human approval badge */}
      {hasWarnOrBlock && (
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-sm text-[11px] font-medium"
          style={{
            backgroundColor: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.2)",
            color: "#F59E0B",
          }}
        >
          <ShieldAlert size={15} />
          {t("ppv_pricing.guardrails.human_approval_required", l)}
        </div>
      )}

      {/* Checklist */}
      <div className="space-y-2">
        {checks.map((check) => {
          const Icon = STATUS_ICONS[check.status];
          const color = STATUS_COLORS[check.status];
          const bg = STATUS_BG[check.status];

          return (
            <div
              key={check.id}
              className="flex items-start gap-3 px-3 py-2.5 rounded-sm"
              style={{ backgroundColor: bg, border: `1px solid ${color}20` }}
            >
              <Icon size={15} className="mt-0.5 shrink-0" style={{ color }} />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                    {check.label}
                  </span>
                  {check.applicableFansCount > 0 && (
                    <span
                      className="text-[9px] px-1.5 py-px rounded-sm"
                      style={{ backgroundColor: `${color}20`, color }}
                    >
                      {check.applicableFansCount} fan{check.applicableFansCount > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <p className="text-[10px] mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {check.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div
        className="flex items-start gap-2 px-3 py-2 rounded-sm text-[9px]"
        style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
      >
        <Info size={10} className="mt-0.5 shrink-0" style={{ color: "rgba(255,255,255,0.2)" }} />
        <p style={{ color: "rgba(255,255,255,0.2)" }}>
          {t("ppv_pricing.guardrails.false_promises", l)}
        </p>
      </div>
    </div>
  );
}
