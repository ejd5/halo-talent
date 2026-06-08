"use client";

import { useState, useMemo } from "react";
import { Search, TrendingUp, TrendingDown, Download, SlidersHorizontal } from "lucide-react";
import { formatEuro } from "../../creators/utils";
import type { CreatorRevenueRow } from "../types";

type Props = { rows: CreatorRevenueRow[] };
type SortKey = keyof CreatorRevenueRow;
type SortDir = "asc" | "desc";

const paymentStatusStyles: Record<string, { label: string; color: string }> = {
  paid: { label: "Payé", color: "#7A9A65" },
  pending: { label: "En attente", color: "#C75B39" },
  overdue: { label: "En retard", color: "#C44536" },
};

export function ByCreatorTab({ rows }: Props) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("current_month");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...rows];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.creator_name.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q) ||
          r.tier.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      const aStr = String(aVal);
      const bStr = String(bVal);
      return sortDir === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
    return result;
  }, [rows, search, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const handleExport = () => {
    const headers = [
      "Créateur", "Département", "Palier",
      "Mois en cours", "Mois dernier", "Variation %",
      "Année cumulé", "Commission %", "Commission €", "Statut",
    ];
    const csvRows = [headers.join(",")];
    filtered.forEach((r) => {
      csvRows.push(
        [
          r.creator_name, r.department, r.tier,
          r.current_month, r.last_month, r.variation_pct,
          r.ytd_total, r.commission_rate, r.commission_eur, r.payment_status,
        ].join(",")
      );
    });
    const csv = csvRows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "revenue-par-createur.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const SortHeader = ({ label, sortKey: sk }: { label: string; sortKey: SortKey }) => (
    <th
      className="py-3 px-3 font-medium cursor-pointer hover:opacity-80 select-none"
      onClick={() => handleSort(sk)}
      style={{ color: "#5A544C" }}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortKey === sk && (
          <span className="text-[8px]" style={{ color: "#C75B39" }}>
            {sortDir === "asc" ? "▲" : "▼"}
          </span>
        )}
      </div>
    </th>
  );

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 flex items-center gap-2 px-3" style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.06)" }}>
          <Search size={14} strokeWidth={1.5} style={{ color: "#5A544C" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un créateur..."
            className="flex-1 bg-transparent text-xs font-sans py-2.5 outline-none"
            style={{ color: "#F5F0EB" }}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 transition-colors hover:bg-white/5"
          style={{ color: "#7A736B", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <SlidersHorizontal size={14} strokeWidth={1.5} />
        </button>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-white/5"
          style={{ color: "#C75B39", border: "1px solid rgba(199,91,57,0.3)" }}
        >
          <Download size={11} strokeWidth={1.5} />
          CSV
        </button>
      </div>

      {/* Table */}
      <div style={{ border: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-sans font-semibold uppercase tracking-[0.12em]" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <SortHeader label="Créateur" sortKey="creator_name" />
                <SortHeader label="Département" sortKey="department" />
                <SortHeader label="Palier" sortKey="tier" />
                <SortHeader label="Mois en cours" sortKey="current_month" />
                <SortHeader label="Mois dernier" sortKey="last_month" />
                <SortHeader label="Variation" sortKey="variation_pct" />
                <SortHeader label="Année" sortKey="ytd_total" />
                <SortHeader label="Commission %" sortKey="commission_rate" />
                <SortHeader label="Commission €" sortKey="commission_eur" />
                <SortHeader label="Statut" sortKey="payment_status" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-xs font-sans" style={{ color: "#5A544C" }}>
                    Aucun résultat
                  </td>
                </tr>
              ) : (
                filtered.map((row) => {
                  const ps = paymentStatusStyles[row.payment_status];
                  return (
                    <tr
                      key={row.creator_id}
                      className="transition-colors hover:bg-white/[0.02]"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 flex items-center justify-center text-[10px] font-sans font-semibold"
                            style={{ background: "rgba(199,91,57,0.15)", color: "#C75B39" }}>
                            {row.creator_name.charAt(0)}
                          </div>
                          <span className="text-xs font-sans font-medium" style={{ color: "#D0CCC6" }}>
                            {row.creator_name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-xs font-sans" style={{ color: "#9A9590" }}>{row.department}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-sans capitalize" style={{ color: "#7A736B" }}>{row.tier}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-xs font-sans font-medium tabular-nums" style={{ color: "#F5F0EB" }}>
                          {formatEuro(row.current_month)}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-xs font-sans tabular-nums" style={{ color: "#9A9590" }}>
                          {formatEuro(row.last_month)}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          {row.variation_pct >= 0 ? (
                            <TrendingUp size={10} strokeWidth={1.5} style={{ color: "#7A9A65" }} />
                          ) : (
                            <TrendingDown size={10} strokeWidth={1.5} style={{ color: "#C44536" }} />
                          )}
                          <span className="text-xs font-sans tabular-nums" style={{ color: row.variation_pct >= 0 ? "#7A9A65" : "#C44536" }}>
                            {row.variation_pct >= 0 ? "+" : ""}{row.variation_pct}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-xs font-sans tabular-nums" style={{ color: "#D0CCC6" }}>
                          {formatEuro(row.ytd_total)}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-xs font-sans tabular-nums" style={{ color: "#9A9590" }}>
                          {row.commission_rate}%
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-xs font-sans tabular-nums" style={{ color: "#C75B39" }}>
                          {formatEuro(row.commission_eur)}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-sans font-semibold px-2 py-0.5"
                          style={{ background: `${ps.color}15`, color: ps.color }}>
                          {ps.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-3 py-2 text-[10px] font-sans text-right" style={{ color: "#5A544C", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          {filtered.length} créateurs
        </div>
      </div>
    </div>
  );
}
