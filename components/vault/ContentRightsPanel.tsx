"use client";

import { ShieldCheck, ShieldAlert, Globe, AlertTriangle, ShieldOff, Ban, Info } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { ContentAsset, RightsStatus } from "@/lib/mock/content-vault";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const STATUS_BADGE: Record<RightsStatus, { labelKey: string; color: string; bg: string }> = {
  validated: { labelKey: "content_vault.rights.validated", color: "var(--success)", bg: "rgba(16,185,129,0.1)" },
  pending: { labelKey: "content_vault.rights.pending", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  expired: { labelKey: "content_vault.rights.expired", color: "var(--danger)", bg: "rgba(229,72,77,0.1)" },
  disputed: { labelKey: "content_vault.rights.disputed", color: "var(--danger)", bg: "rgba(229,72,77,0.1)" },
};

const RESTRICTION_ICONS: Record<string, React.ElementType> = {
  platform_block: Ban,
  geo_block: Globe,
  expired_rights: AlertTriangle,
  sensitive_content: ShieldOff,
  compliance_hold: AlertTriangle,
};

const RESTRICTION_LABEL_KEYS: Record<string, string> = {
  platform_block: "content_vault.rights.restriction_platform",
  geo_block: "content_vault.rights.restriction_geo",
  expired_rights: "content_vault.rights.restriction_expired",
  sensitive_content: "content_vault.rights.restriction_sensitive",
  compliance_hold: "content_vault.rights.restriction_compliance",
};

interface ContentRightsPanelProps {
  asset: ContentAsset;
}

export function ContentRightsPanel({ asset }: ContentRightsPanelProps) {
  const locale = useLocale();
  const l = norm(locale);
  const statusBadge = STATUS_BADGE[asset.rightsStatus];
  const activeRestrictions = asset.restrictions.filter((r) => r.isActive);

  return (
    <div className="space-y-4">
      {/* Rights status */}
      <div>
        <p className="text-[9px] uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.25)" }}>
          {t("content_vault.rights.title", l)}
        </p>
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-sm"
          style={{ backgroundColor: statusBadge.bg, border: `1px solid ${statusBadge.color}20` }}
        >
          {asset.rightsStatus === "validated" ? (
            <ShieldCheck size={16} style={{ color: statusBadge.color }} />
          ) : (
            <ShieldAlert size={16} style={{ color: statusBadge.color }} />
          )}
          <span className="text-[11px] font-medium" style={{ color: statusBadge.color }}>
            {t(statusBadge.labelKey, l)}
          </span>
        </div>
      </div>

      {/* Sensitivity + Premium */}
      <div className="grid grid-cols-2 gap-2">
        <BadgeBox
          label={t("content_vault.rights.sensitivity", l)}
          value={asset.sensitivityLevel}
          color={asset.sensitivityLevel === "standard" ? "var(--success)" : asset.sensitivityLevel === "sensitive" ? "#F59E0B" : "var(--danger)"}
        />
        <BadgeBox
          label={t("content_vault.rights.premium", l)}
          value={asset.premiumLevel}
          color="#8B5CF6"
        />
      </div>

      {/* Restrictions */}
      <div>
        <p className="text-[9px] uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.25)" }}>
          Restrictions
        </p>
        {activeRestrictions.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-6 px-4 rounded-sm text-center"
            style={{ backgroundColor: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.1)" }}
          >
            <ShieldCheck size={22} style={{ color: "rgba(16,185,129,0.3)" }} />
            <p className="text-[10px] mt-2" style={{ color: "var(--success)" }}>
              {t("content_vault.rights.all_valid", l)}
            </p>
            <p className="text-[8px] mt-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>
              {t("content_vault.rights.no_restrictions", l)}
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {activeRestrictions.map((restriction) => {
              const Icon = RESTRICTION_ICONS[restriction.type] || AlertTriangle;
              const labelKey = RESTRICTION_LABEL_KEYS[restriction.type] || "content_vault.rights.restriction_compliance";
              return (
                <div
                  key={restriction.id}
                  className="flex items-start gap-2.5 px-3 py-2 rounded-sm"
                  style={{ backgroundColor: "rgba(229,72,77,0.06)", border: "1px solid rgba(229,72,77,0.1)" }}
                >
                  <Icon size={13} className="mt-0.5 shrink-0" style={{ color: "var(--danger)" }} />
                  <div className="min-w-0">
                    <span className="text-[10px] font-medium" style={{ color: "var(--danger)" }}>
                      {t(labelKey, l)}
                    </span>
                    <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {restriction.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Compliance warning */}
      {asset.rightsStatus !== "validated" && (
        <div
          className="flex items-start gap-2 px-3 py-2.5 rounded-sm text-[10px]"
          style={{ backgroundColor: "rgba(229,72,77,0.08)", border: "1px solid rgba(229,72,77,0.15)" }}
        >
          <Info size={12} className="mt-0.5 shrink-0" style={{ color: "var(--danger)" }} />
          <span style={{ color: "var(--danger)" }}>
            {t("content_vault.rights.blocked_campaign", l)}
          </span>
        </div>
      )}
    </div>
  );
}

function BadgeBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      className="px-3 py-2 rounded-sm"
      style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
    >
      <p className="text-[8px] uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.25)" }}>{label}</p>
      <span
        className="text-[10px] font-medium px-2 py-0.5 rounded-sm capitalize"
        style={{ backgroundColor: `${color}15`, color }}
      >
        {value}
      </span>
    </div>
  );
}
