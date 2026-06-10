"use client";

import { useState } from "react";
import { ArrowRight, AlertTriangle, Info } from "lucide-react";
import { CLAUSE_GROUPS } from "@/lib/bouclier-legal/clauses-data";
import type { ClauseDef } from "@/lib/bouclier-legal/types";

function SeverityBadge({ severity }: { severity: number }) {
  const colors: Record<number, { bg: string; text: string; label: string }> = {
    3: { bg: "rgba(245,158,11,0.12)", text: "#F59E0B", label: "Moyen" },
    4: { bg: "rgba(239,68,68,0.12)", text: "#EF4444", label: "Élevé" },
    5: { bg: "rgba(17,24,39,0.12)", text: "#111827", label: "Critique" },
  };
  const c = colors[severity as keyof typeof colors] || colors[3];
  return (
    <span
      className="text-[11px] font-semibold px-2 py-0.5 rounded shrink-0"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {c.label}
    </span>
  );
}

export function StepClauses({
  onNext,
}: {
  onNext: (clauseIds: string[]) => void;
}) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [showInfo, setShowInfo] = useState<Set<string>>(new Set());

  const toggleClause = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    // Auto-show info when checking
    if (!checked.has(id)) {
      setShowInfo((prev) => new Set(prev).add(id));
    }
  };

  const toggleInfo = (id: string) => {
    setShowInfo((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="py-8 max-w-4xl mx-auto px-2">
      {/* Header */}
      <div className="text-center mb-10">
        <div
          className="w-12 h-12 flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: "var(--color-accent-soft)" }}
        >
          <AlertTriangle size={22} style={{ color: "var(--color-accent)" }} />
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Cochez les clauses présentes dans votre contrat
        </h2>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Soyez honnête — l&apos;analyse n&apos;est visible que par vous
        </p>
      </div>

      {/* Clause groups */}
      <div className="space-y-6 mb-8">
        {CLAUSE_GROUPS.map((group) => {
          const groupChecked = group.clauses.filter((c) => checked.has(c.id));
          return (
            <div
              key={group.category}
              className="overflow-hidden"
              style={{ border: "1px solid var(--border-default)" }}
            >
              {/* Group header */}
              <div
                className="px-5 py-4 flex items-center justify-between"
                style={{ backgroundColor: "var(--bg-surface)" }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{group.icon}</span>
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {group.label}
                  </span>
                  <span
                    className="text-[11px] font-medium px-2 py-0.5 rounded"
                    style={{
                      backgroundColor:
                        group.severityLabel === "haute"
                          ? "rgba(239,68,68,0.1)"
                          : "rgba(245,158,11,0.1)",
                      color:
                        group.severityLabel === "haute" ? "#EF4444" : "#F59E0B",
                    }}
                  >
                    sévérité {group.severityLabel}
                  </span>
                </div>
                {groupChecked.length > 0 && (
                  <span className="text-xs font-medium" style={{ color: "var(--color-accent)" }}>
                    {groupChecked.length} cochée{groupChecked.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Clauses — 2-column grid */}
              <div className="p-3" style={{ backgroundColor: "var(--bg-primary)" }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {group.clauses.map((clause) => (
                    <div
                      key={clause.id}
                      className="overflow-hidden transition-all"
                      style={{
                        border: `1px solid ${checked.has(clause.id) ? "rgba(199,91,57,0.3)" : "var(--border-default)"}`,
                        backgroundColor: checked.has(clause.id)
                          ? "rgba(199,91,57,0.04)"
                          : "var(--bg-surface)",
                      }}
                    >
                      {/* Checkbox row */}
                      <div
                        className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors select-none"
                        onClick={() => toggleClause(clause.id)}
                      >
                        {/* Hidden real checkbox for accessibility */}
                        <input
                          type="checkbox"
                          id={`clause-${clause.id}`}
                          checked={checked.has(clause.id)}
                          onChange={() => toggleClause(clause.id)}
                          className="sr-only"
                        />

                        {/* Custom checkbox visual */}
                        <div
                          className="shrink-0 w-5 h-5 flex items-center justify-center mt-0.5 transition-all pointer-events-none"
                          style={{
                            backgroundColor: checked.has(clause.id)
                              ? "var(--color-accent)"
                              : "var(--bg-surface)",
                            border: `1.5px solid ${
                              checked.has(clause.id) ? "var(--color-accent)" : "var(--border-default)"
                            }`,
                          }}
                        >
                          {checked.has(clause.id) && (
                            <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                              <path
                                d="M3 7L6 10L11 4"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>

                        {/* Clause label */}
                        <div className="flex-1 min-w-0 pointer-events-none">
                          <span
                            className="text-xs font-medium leading-snug line-clamp-2"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {clause.label}
                          </span>
                        </div>

                        {/* Info button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleInfo(clause.id);
                          }}
                          type="button"
                          className="shrink-0 p-1 rounded transition-colors"
                          style={{
                            color: showInfo.has(clause.id)
                              ? "var(--color-accent)"
                              : "var(--text-tertiary)",
                          }}
                        >
                          <Info size={14} />
                        </button>
                      </div>

                      {/* Severity badge */}
                      <div className="px-4 pb-2 flex justify-end">
                        <SeverityBadge severity={clause.severity} />
                      </div>

                      {/* Info panel (expandable) */}
                      {showInfo.has(clause.id) && (
                        <div
                          className="px-4 py-3 text-xs leading-relaxed space-y-2 animate-slide-up border-t"
                          style={{
                            backgroundColor: "rgba(199,91,57,0.03)",
                            borderColor: "var(--border-default)",
                          }}
                        >
                          <p style={{ color: "var(--text-secondary)" }}>
                            <span className="font-semibold">Pourquoi c&apos;est abusif :</span>{" "}
                            {clause.legalArgument}
                          </p>
                          {clause.legalRef && (
                            <p style={{ color: "var(--warning)" }}>
                              <span className="font-semibold">Réf. légale :</span> {clause.legalRef}
                            </p>
                          )}
                          <div className="flex items-start gap-2 mt-2 p-2" style={{ backgroundColor: "rgba(199,91,57,0.06)" }}>
                            <span className="text-[11px] font-semibold shrink-0 mt-0.5" style={{ color: "var(--color-accent)" }}>
                              ✓ SAIN :
                            </span>
                            <span style={{ color: "var(--text-secondary)" }}>
                              {clause.sanaReformulation}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4 flex-wrap px-2">
        <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          {checked.size} clause{checked.size !== 1 ? "s" : ""} cochée{checked.size !== 1 ? "s" : ""}
          {checked.size >= 3 && (
            <span className="ml-1" style={{ color: "#F59E0B" }}>
              — analyse disponible
            </span>
          )}
        </span>
        <button
          onClick={() => onNext(Array.from(checked))}
          disabled={checked.size === 0}
          className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold transition-all disabled:opacity-40"
          style={{
            backgroundColor: checked.size > 0 ? "var(--color-accent)" : "var(--border-default)",
            color: checked.size > 0 ? "#fff" : "var(--text-tertiary)",
          }}
        >
          Analyser mon contrat
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
