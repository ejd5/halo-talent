"use client";

import { ShieldCheck, ShieldAlert, ShieldOff } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { ConsentStatus } from "@/lib/mock/atlas-fans";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

interface ConsentItem {
  key: string;
  labelKey: string;
  status: boolean | ConsentStatus;
}

interface FanConsentPanelProps {
  consentStatus: ConsentStatus;
  emailConsent?: boolean;
  smsConsent?: boolean;
  pushConsent?: boolean;
  dataProcessingConsent?: boolean;
}

export function FanConsentPanel({
  consentStatus,
  emailConsent,
  smsConsent,
  pushConsent,
  dataProcessingConsent,
}: FanConsentPanelProps) {
  const locale = useLocale();
  const l = norm(locale);

  const items: ConsentItem[] = [
    { key: "email", labelKey: "fan_intel.consent.email", status: emailConsent ?? consentStatus === "active" },
    { key: "sms", labelKey: "fan_intel.consent.sms", status: smsConsent ?? false },
    { key: "push", labelKey: "fan_intel.consent.push", status: pushConsent ?? false },
    { key: "data_processing", labelKey: "fan_intel.consent.data_processing", status: dataProcessingConsent ?? false },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Overall status */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-sm" style={{
        backgroundColor:
          consentStatus === "active" ? "rgba(16,185,129,0.08)" :
          consentStatus === "withdrawn" ? "rgba(229,72,77,0.08)" :
          "rgba(255,255,255,0.04)",
      }}>
        {consentStatus === "active" ? (
          <ShieldCheck size={16} style={{ color: "var(--success)" }} />
        ) : consentStatus === "withdrawn" ? (
          <ShieldAlert size={16} style={{ color: "var(--danger)" }} />
        ) : (
          <ShieldOff size={16} style={{ color: "rgba(255,255,255,0.3)" }} />
        )}
        <div>
          <p className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>
            {consentStatus === "active"
              ? t("fan_intel.consent.active", l)
              : consentStatus === "withdrawn"
                ? t("fan_intel.consent.revoked", l)
                : t("fan_intel.consent.missing", l)}
          </p>
        </div>
      </div>

      {/* Consent toggles */}
      <div className="space-y-2">
        {items.map((item) => {
          const isActive = typeof item.status === "boolean" ? item.status : item.status === "active";
          return (
            <div
              key={item.key}
              className="flex items-center justify-between px-3 py-2.5 rounded-sm"
              style={{ backgroundColor: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.04)" }}
            >
              <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                {t(item.labelKey, l)}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-sm font-medium"
                  style={{
                    backgroundColor: isActive ? "rgba(16,185,129,0.1)" : "rgba(229,72,77,0.1)",
                    color: isActive ? "var(--success)" : "var(--danger)",
                  }}
                >
                  {isActive ? t("fan_intel.consent.active", l) : t("fan_intel.consent.revoked", l)}
                </span>
                {/* Toggle visual (read-only) */}
                <div
                  className="w-7 h-4 rounded-full relative transition-colors"
                  style={{ backgroundColor: isActive ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.08)" }}
                >
                  <div
                    className="w-3 h-3 rounded-full absolute top-0.5 transition-all"
                    style={{
                      backgroundColor: isActive ? "var(--success)" : "rgba(255,255,255,0.3)",
                      left: isActive ? "14px" : "2px",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RGPD footer */}
      <p className="text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,0.15)" }}>
        {t("fan_intel.consent.rgpd_footer", l)}
      </p>
    </div>
  );
}
