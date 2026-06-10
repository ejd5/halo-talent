"use client";

import { useState, useMemo } from "react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { AUDIT_LOGS, AUDIT_ENTITY_TYPES, type AuditLog, type SeverityLevel } from "@/lib/mock/atlas-compliance";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const SEVERITY_DOT: Record<SeverityLevel, string> = {
  info: "#3B82F6",
  warning: "#F59E0B",
  critical: "var(--danger)",
};

const PAGE_SIZE = 10;

interface AuditLogTableProps {
  logs?: AuditLog[];
}

export function AuditLogTable({ logs = AUDIT_LOGS }: AuditLogTableProps) {
  const locale = useLocale();
  const l = norm(locale);
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState<SeverityLevel | "">("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        !search ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.entity.toLowerCase().includes(search.toLowerCase()) ||
        log.user.toLowerCase().includes(search.toLowerCase());
      const matchesEntity = !entityFilter || log.entityType === entityFilter;
      const matchesSeverity = !severityFilter || log.severity === severityFilter;
      return matchesSearch && matchesEntity && matchesSeverity;
    });
  }, [logs, search, entityFilter, severityFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div>
      <h2 className="text-[13px] font-display font-bold mb-3" style={{ color: "var(--text-primary)" }}>
        {t("compliance.audit.title", l)}
      </h2>
      <div
        className="p-4"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
      >
        {/* Filters */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <div className="relative flex-1 min-w-[140px]">
            <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.2)" }} />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder={t("compliance.audit.search", l)}
              className="w-full py-1.5 pl-7 pr-2 text-[10px]"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-default)", color: "var(--text-primary)", outline: "none" }}
            />
          </div>
          <select
            value={entityFilter}
            onChange={(e) => { setEntityFilter(e.target.value); setPage(0); }}
            className="text-[8px] px-2 py-1.5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-default)", color: "rgba(255,255,255,0.5)", outline: "none" }}
          >
            <option value="">{t("compliance.audit.filter_entity", l)}</option>
            {AUDIT_ENTITY_TYPES.map((et) => (
              <option key={et} value={et}>{et}</option>
            ))}
          </select>
          <select
            value={severityFilter}
            onChange={(e) => { setSeverityFilter(e.target.value as SeverityLevel | ""); setPage(0); }}
            className="text-[8px] px-2 py-1.5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-default)", color: "rgba(255,255,255,0.5)", outline: "none" }}
          >
            <option value="">Sévérité</option>
            {(["info", "warning", "critical"] as SeverityLevel[]).map((s) => (
              <option key={s} value={s}>{t(`compliance.audit.severity_${s}`, l)}</option>
            ))}
          </select>
          <button className="flex items-center gap-1 text-[8px] px-2 py-1.5 transition-colors" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
            <Download size={9} />
            {t("compliance.audit.export_csv", l)}
          </button>
        </div>

        {/* Table */}
        {paged.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
              {t("compliance.audit.empty", l)}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[9px]" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--bg-card)" }}>
                  <th className="text-left px-2 py-1.5 font-medium min-w-[80px]" style={{ color: "rgba(255,255,255,0.4)" }}>{t("compliance.audit.date", l)}</th>
                  <th className="text-left px-2 py-1.5 font-medium min-w-[100px]" style={{ color: "rgba(255,255,255,0.4)" }}>{t("compliance.audit.action", l)}</th>
                  <th className="text-left px-2 py-1.5 font-medium min-w-[80px]" style={{ color: "rgba(255,255,255,0.4)" }}>{t("compliance.audit.entity", l)}</th>
                  <th className="text-left px-2 py-1.5 font-medium min-w-[70px]" style={{ color: "rgba(255,255,255,0.4)" }}>{t("compliance.audit.user", l)}</th>
                  <th className="text-left px-2 py-1.5 font-medium min-w-[120px]" style={{ color: "rgba(255,255,255,0.4)" }}>{t("compliance.audit.details", l)}</th>
                  <th className="text-left px-2 py-1.5 font-medium min-w-[40px]" style={{ color: "rgba(255,255,255,0.4)" }}>{t("compliance.audit.severity", l)}</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((log) => (
                  <tr key={log.id} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                    <td className="px-2 py-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {new Date(log.timestamp).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-2 py-1" style={{ color: "var(--text-primary)" }}>{log.action}</td>
                    <td className="px-2 py-1" style={{ color: "rgba(255,255,255,0.5)" }}>{log.entity}</td>
                    <td className="px-2 py-1" style={{ color: "rgba(255,255,255,0.5)" }}>{log.user}</td>
                    <td className="px-2 py-1" style={{ color: "rgba(255,255,255,0.35)" }}>{log.details}</td>
                    <td className="px-2 py-1">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: SEVERITY_DOT[log.severity] }} />
                        <span className="text-[7px]" style={{ color: SEVERITY_DOT[log.severity] }}>
                          {t(`compliance.audit.severity_${log.severity}`, l)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between mt-3">
            <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              {t("compliance.audit.page", l).replace("{n}", `${page + 1}/${totalPages}`)}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="text-[8px] px-2 py-1 transition-colors disabled:opacity-30"
                style={{ background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.3)" }}
              >
                <ChevronLeft size={10} />
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="text-[8px] px-2 py-1 transition-colors disabled:opacity-30"
                style={{ background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.3)" }}
              >
                <ChevronRight size={10} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
