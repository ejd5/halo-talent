"use client";

import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { TeamMember } from "@/lib/mock/admin-dashboard";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

interface TeamPerformancePanelProps {
  members: TeamMember[];
}

export function TeamPerformancePanel({ members }: TeamPerformancePanelProps) {
  const locale = useLocale();
  const l = norm(locale);

  if (members.length === 0) {
    return (
      <div>
        <h2 className="text-[13px] font-display font-bold mb-3" style={{ color: "var(--text-primary)" }}>
          {t("admin_dashboard.team.title", l)}
        </h2>
        <div className="flex flex-col items-center justify-center py-8 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
          <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            {t("admin_dashboard.team.empty", l)}
          </p>
        </div>
      </div>
    );
  }

  const metrics = [
    { key: "conversations" as const, labelKey: "admin_dashboard.team.conversations", format: (v: number) => v.toLocaleString() },
    { key: "revenue" as const, labelKey: "admin_dashboard.team.revenue", format: (v: number) => `€${v.toLocaleString()}` },
    { key: "responseTime" as const, labelKey: "admin_dashboard.team.response_time", format: (v: number) => `${v}min` },
    { key: "quality" as const, labelKey: "admin_dashboard.team.quality", format: (v: number) => `${v}%` },
    { key: "complianceErrors" as const, labelKey: "admin_dashboard.team.compliance_errors", format: (v: number) => String(v) },
    { key: "workload" as const, labelKey: "admin_dashboard.team.workload", format: (v: number) => `${v}%` },
  ];

  const getWorkloadColor = (wl: number) => {
    if (wl >= 85) return "var(--danger)";
    if (wl >= 70) return "#F59E0B";
    return "var(--success)";
  };

  return (
    <div>
      <h2 className="text-[13px] font-display font-bold mb-3" style={{ color: "var(--text-primary)" }}>
        {t("admin_dashboard.team.title", l)}
      </h2>
      <div
        className="overflow-x-auto scrollbar-thin"
        style={{ border: "1px solid var(--border-default)" }}
      >
        <table className="w-full text-[9px]" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--bg-card)" }}>
              <th className="text-left px-2 py-2 font-medium sticky top-0 min-w-[80px]" style={{ color: "rgba(255,255,255,0.4)", background: "var(--bg-primary)" }}>
                {t("admin_dashboard.team.member", l)}
              </th>
              {metrics.map((m) => (
                <th
                  key={m.key}
                  className="text-left px-2 py-2 font-medium sticky top-0 min-w-[70px]"
                  style={{ color: "rgba(255,255,255,0.4)", background: "var(--bg-primary)" }}
                >
                  {t(m.labelKey, l)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((member, i) => (
              <tr
                key={member.id}
                className="transition-colors"
                style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}
              >
                <td className="px-2 py-1.5">
                  <div>
                    <p className="font-medium" style={{ color: "var(--text-primary)" }}>{member.name}</p>
                    <span className="text-[7px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {t(`admin_dashboard.team.role.${member.role}`, l)}
                    </span>
                  </div>
                </td>
                {metrics.map((m) => (
                  <td key={m.key} className="px-2 py-1.5" style={{ color: "var(--text-primary)" }}>
                    {m.key === "workload" ? (
                      <div className="flex items-center gap-1.5">
                        <div className="h-1 w-8" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div
                            className="h-full"
                            style={{
                              width: `${member.workload}%`,
                              background: getWorkloadColor(member.workload),
                            }}
                          />
                        </div>
                        <span style={{ color: getWorkloadColor(member.workload) }}>{member.workload}%</span>
                      </div>
                    ) : (
                      m.format(member[m.key])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
