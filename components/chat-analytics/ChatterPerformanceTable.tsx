"use client";

import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Users } from "lucide-react";
import type { ChatterPerformance } from "@/lib/mock/chat-analytics";

type SortKey = "name" | "messagesSent" | "revenueGenerated" | "avgResponseTime" | "toneGuardScore";

function formatResponseTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

export function ChatterPerformanceTable({ data }: { data: ChatterPerformance[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("revenueGenerated");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const cmp = typeof aVal === "string" ? (aVal as string).localeCompare(bVal as string) : (aVal as number) - (bVal as number);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const SortIcon = sortDir === "asc" ? ChevronUp : ChevronDown;

  const columns: { key: SortKey; label: string }[] = [
    { key: "name", label: "Chatter" },
    { key: "messagesSent", label: "Messages" },
    { key: "revenueGenerated", label: "Revenus" },
    { key: "avgResponseTime", label: "Temps réponse" },
    { key: "toneGuardScore", label: "Score TG" },
  ];

  const getPerformanceColor = (score: number, type: "revenue" | "time" | "tg") => {
    if (type === "revenue") return score >= 2400 ? "var(--success)" : score >= 2000 ? "var(--warning)" : "var(--danger)";
    if (type === "time") return score <= 120 ? "var(--success)" : score <= 180 ? "var(--warning)" : "var(--danger)";
    return score >= 90 ? "var(--success)" : score >= 80 ? "var(--warning)" : "var(--danger)";
  };

  return (
    <div
      className="rounded-lg p-4"
      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users size={14} style={{ color: "var(--text-secondary)" }} />
          <div>
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Performance des chatters
            </h3>
            <p className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
              Classement et performance de votre équipe (mode agence)
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[10px]">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-default)" }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="text-left font-medium py-2 px-2 cursor-pointer select-none transition-colors first:pl-0 last:pr-0"
                  style={{ color: sortKey === col.key ? "var(--text-primary)" : "var(--text-tertiary)" }}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key && <SortIcon size={10} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((chatter) => (
              <tr
                key={chatter.id}
                style={{ borderBottom: "1px solid var(--border-default)" }}
                className="hover:opacity-80 transition-opacity"
              >
                <td className="py-2.5 px-2 first:pl-0">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 flex items-center justify-center text-[8px] font-semibold rounded-full shrink-0"
                      style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}
                    >
                      {chatter.avatarInitials}
                    </div>
                    <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                      {chatter.name}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-2" style={{ color: "var(--text-secondary)" }}>
                  {chatter.messagesSent.toLocaleString()}
                </td>
                <td
                  className="py-2.5 px-2 font-medium"
                  style={{ color: getPerformanceColor(chatter.revenueGenerated, "revenue") }}
                >
                  {chatter.revenueGenerated.toLocaleString()} €
                </td>
                <td
                  className="py-2.5 px-2"
                  style={{ color: getPerformanceColor(chatter.avgResponseTime, "time") }}
                >
                  {formatResponseTime(chatter.avgResponseTime)}
                </td>
                <td
                  className="py-2.5 px-2 font-medium"
                  style={{ color: getPerformanceColor(chatter.toneGuardScore, "tg") }}
                >
                  {chatter.toneGuardScore}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
