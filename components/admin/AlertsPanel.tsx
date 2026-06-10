"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { ALERTS } from "@/lib/mock/admin-dashboard";
import { FileSignature, UserX, TrendingDown, AlertTriangle } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const TYPE_CONFIG: Record<string, { icon: React.ElementType; label: string }> = {
  contract: { icon: FileSignature, label: "Contrat" },
  inactive: { icon: UserX, label: "Inactif" },
  revenue: { icon: TrendingDown, label: "Revenu" },
};

export function AlertsPanel() {
  const locale = useLocale();
  const l = norm(locale);

  return (
    <div>
      <h2 className="text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
        {t("admin_dashboard.alerts.title", l)}
      </h2>
      <div
        className="divide-y"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-default)",
        }}
      >
        {ALERTS.map((alert) => {
          const config = TYPE_CONFIG[alert.type];
          const Icon = config?.icon || AlertTriangle;
          const isDanger = alert.severity === "danger";
          const borderColor = isDanger ? "var(--danger)" : "var(--warning)";
          const bgColor = isDanger ? "var(--danger-bg, rgba(220,38,38,0.08))" : "var(--warning-bg, rgba(245,158,11,0.08))";

          return (
            <Link
              key={alert.id}
              href={alert.href}
              className="flex items-start gap-3 p-3 transition-all hover:translate-y-[-1px]"
              style={{
                borderLeft: `2px solid ${borderColor}`,
                backgroundColor: bgColor,
              }}
            >
              <div
                className="w-7 h-7 flex items-center justify-center rounded-sm shrink-0 mt-0.5"
                style={{ backgroundColor: isDanger ? "rgba(220,38,38,0.12)" : "rgba(245,158,11,0.12)" }}
              >
                <Icon size={12} style={{ color: borderColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium" style={{ color: "var(--text-primary)" }}>
                  {t(alert.titleKey, l)}
                </p>
                <p className="text-[8px] mt-0.5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {t(alert.descriptionKey, l)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
      <Link
        href="/admin/alerts"
        className="text-[10px] font-medium mt-2 inline-flex items-center gap-1 transition-colors"
        style={{ color: "var(--accent)" }}
      >
        {t("admin_dashboard.alerts.view", l)}
      </Link>
    </div>
  );
}
