"use client";

import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { ComplianceItem } from "@/lib/mock/admin-dashboard";
import { Shield, AlertTriangle, Info } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const STATUS_CONFIG: Record<string, { dot: string; bg: string; icon: React.ElementType }> = {
  ok: { dot: "var(--success)", bg: "rgba(16,185,129,0.08)", icon: Shield },
  warning: { dot: "#F59E0B", bg: "rgba(245,158,11,0.08)", icon: AlertTriangle },
  critical: { dot: "var(--danger)", bg: "rgba(229,72,77,0.08)", icon: AlertTriangle },
};

interface CompliancePreviewProps {
  items: ComplianceItem[];
}

export function CompliancePreview({ items }: CompliancePreviewProps) {
  const locale = useLocale();
  const l = norm(locale);

  if (items.length === 0) {
    return (
      <div>
        <h2 className="text-[13px] font-display font-bold mb-3" style={{ color: "var(--text-primary)" }}>
          {t("admin_dashboard.compliance.title", l)}
        </h2>
        <div className="flex flex-col items-center justify-center py-8 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
          <Shield size={16} style={{ color: "rgba(255,255,255,0.06)" }} />
          <p className="text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>
            {t("admin_dashboard.compliance.empty", l)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-[13px] font-display font-bold mb-3" style={{ color: "var(--text-primary)" }}>
        {t("admin_dashboard.compliance.title", l)}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {items.map((item) => {
          const cfg = STATUS_CONFIG[item.status];
          const Icon = cfg.icon;
          return (
            <div
              key={item.id}
              className="p-3"
              style={{
                background: cfg.bg,
                border: "1px solid var(--border-default)",
              }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Icon size={12} style={{ color: cfg.dot }} />
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
              </div>
              <p className="text-[9px] font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                {t(item.labelKey, l)}
              </p>
              <p className="text-[18px] font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                {item.value}
              </p>
              <p className="text-[7px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                {t(item.detailKey, l)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
