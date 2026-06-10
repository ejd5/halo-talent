"use client";

import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { CreatorHealthRow } from "@/lib/mock/admin-dashboard";
import { TrendingUp, TrendingDown } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const CHURN_COLORS: Record<string, { bg: string; text: string }> = {
  low: { bg: "rgba(16,185,129,0.15)", text: "var(--success)" },
  medium: { bg: "rgba(245,158,11,0.15)", text: "#F59E0B" },
  high: { bg: "rgba(229,72,77,0.15)", text: "var(--danger)" },
};

interface CreatorHealthTableProps {
  creators: CreatorHealthRow[];
}

export function CreatorHealthTable({ creators }: CreatorHealthTableProps) {
  const locale = useLocale();
  const l = norm(locale);

  const columns = [
    { key: "name", labelKey: "admin_dashboard.creators.col.name", width: "min-w-[100px]" },
    { key: "country", labelKey: "admin_dashboard.creators.col.country", width: "min-w-[50px]" },
    { key: "department", labelKey: "admin_dashboard.creators.col.department", width: "min-w-[100px]" },
    { key: "revenue", labelKey: "admin_dashboard.creators.col.revenue", width: "min-w-[80px]" },
    { key: "variation", labelKey: "admin_dashboard.creators.col.variation", width: "min-w-[70px]" },
    { key: "health", labelKey: "admin_dashboard.creators.col.health", width: "min-w-[70px]" },
    { key: "churn", labelKey: "admin_dashboard.creators.col.churn", width: "min-w-[70px]" },
    { key: "manager", labelKey: "admin_dashboard.creators.col.manager", width: "min-w-[80px]" },
    { key: "lastAction", labelKey: "admin_dashboard.creators.col.last_action", width: "min-w-[100px]" },
    { key: "nextAction", labelKey: "admin_dashboard.creators.col.next_action", width: "min-w-[100px]" },
  ];

  if (creators.length === 0) {
    return (
      <div>
        <h2 className="text-[13px] font-display font-bold mb-3" style={{ color: "var(--text-primary)" }}>
          {t("admin_dashboard.creators.title", l)}
        </h2>
        <div className="flex flex-col items-center justify-center py-8 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
          <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            {t("admin_dashboard.creators.empty", l)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-[13px] font-display font-bold mb-3" style={{ color: "var(--text-primary)" }}>
        {t("admin_dashboard.creators.title", l)}
      </h2>
      <div
        className="overflow-x-auto scrollbar-thin"
        style={{ border: "1px solid var(--border-default)" }}
      >
        <table className="w-full text-[9px]" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--bg-card)" }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`${col.width} text-left px-2 py-2 font-medium sticky top-0`}
                  style={{ color: "rgba(255,255,255,0.4)", background: "var(--bg-primary)" }}
                >
                  {t(col.labelKey, l)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {creators.map((creator, i) => {
              const churnStyle = CHURN_COLORS[creator.churnRisk];
              return (
                <tr
                  key={i}
                  className="transition-colors"
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.03)",
                  }}
                >
                  <td className="px-2 py-1.5 font-medium" style={{ color: "var(--text-primary)" }}>{creator.name}</td>
                  <td className="px-2 py-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>{creator.country}</td>
                  <td className="px-2 py-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>{creator.department}</td>
                  <td className="px-2 py-1.5" style={{ color: "var(--text-primary)" }}>€{creator.revenue.toLocaleString()}</td>
                  <td className="px-2 py-1.5">
                    <span className="flex items-center gap-0.5" style={{ color: creator.variation >= 0 ? "var(--success)" : "var(--danger)" }}>
                      {creator.variation >= 0 ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
                      {creator.variation >= 0 ? "+" : ""}{creator.variation}%
                    </span>
                  </td>
                  <td className="px-2 py-1.5">
                    <div className="flex items-center gap-1">
                      <div
                        className="h-1.5 w-12"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                      >
                        <div
                          className="h-full"
                          style={{
                            width: `${creator.audienceHealth}%`,
                            background: creator.audienceHealth >= 70 ? "var(--success)" : creator.audienceHealth >= 50 ? "#F59E0B" : "var(--danger)",
                          }}
                        />
                      </div>
                      <span style={{ color: "rgba(255,255,255,0.4)" }}>{creator.audienceHealth}%</span>
                    </div>
                  </td>
                  <td className="px-2 py-1.5">
                    <span className="text-[7px] px-1 py-0.5" style={{ background: churnStyle.bg, color: churnStyle.text }}>
                      {t(`admin_dashboard.creators.churn.${creator.churnRisk}`, l)}
                    </span>
                  </td>
                  <td className="px-2 py-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>{creator.manager}</td>
                  <td className="px-2 py-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>{creator.lastAction}</td>
                  <td className="px-2 py-1.5" style={{ color: "var(--accent)" }}>{creator.nextAction}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
