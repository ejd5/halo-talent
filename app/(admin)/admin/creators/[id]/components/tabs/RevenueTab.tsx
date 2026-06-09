"use client";

import { useState } from "react";
import type { Creator } from "../../../types";
import { formatEuro } from "../../../utils";
import { Download, Plus, Filter } from "lucide-react";

type Props = { creator: Creator };

export function RevenueTab({ creator }: Props) {
  const [filterPlatform, setFilterPlatform] = useState("all");

  const months = creator.monthly_revenue;

  return (
    <div className="space-y-6 card-accent">
      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-white/5"
          style={{ color: "#C75B39", border: "1px solid rgba(199,91,57,0.3)" }}
        >
          <Plus size={12} strokeWidth={1.5} />
          Saisir un revenu manuel
        </button>
        <button
          className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-white/5"
          style={{ color: "#E0D8D0", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Download size={12} strokeWidth={1.5} />
          Export CSV
        </button>
        <select
          value={filterPlatform}
          onChange={(e) => setFilterPlatform(e.target.value)}
          className="ml-auto bg-transparent text-[10px] font-sans px-2 py-2 outline-none"
          style={{ color: "#F5F0EB", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <option value="all" style={{ background: "#1A1614" }}>Toutes les plateformes</option>
          {creator.platforms.map((p) => (
            <option key={p.name} value={p.name} style={{ background: "#1A1614" }}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Stacked bar chart (simplified) */}
      <div className="p-5" style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.04)" }}>
        <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.1em] mb-4" style={{ color: "#F5F0EB" }}>
          Répartition par plateforme
        </p>
        <div className="flex items-end gap-2 h-40">
          {months.map((m) => {
            const max = Math.max(...months.map((r) => r.total_gross));
            const h = (m.total_gross / max) * 100;
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[8px] font-sans tabular-nums" style={{ color: "#E0D8D0" }}>
                  {formatEuro(m.total_gross)}
                </span>
                <div
                  className="w-full rounded-none"
                  style={{ height: `${Math.max(h, 3)}%`, background: "rgba(199,91,57,0.4)" }}
                />
                <span className="text-[9px] font-sans" style={{ color: "#E0D8D0" }}>{m.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly table */}
      <div className="overflow-x-auto" style={{ border: "1px solid rgba(255,255,255,0.04)" }}>
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-sans font-semibold uppercase tracking-[0.12em]" style={{ color: "#E0D8D0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <th className="py-3 px-4 font-medium">Mois</th>
              <th className="py-3 px-4 font-medium">Plateforme</th>
              <th className="py-3 px-4 font-medium">Revenu brut</th>
              <th className="py-3 px-4 font-medium">Commission %</th>
              <th className="py-3 px-4 font-medium">Commission €</th>
              <th className="py-3 px-4 font-medium">Net créateur</th>
            </tr>
          </thead>
          <tbody>
            {months.map((m) => {
              const items = filterPlatform === "all"
                ? m.platforms
                : m.platforms.filter((p) => p.name === filterPlatform);
              return items.length === 0
                ? null
                : items.map((p, idx) => (
                    <tr
                      key={`${m.month}-${p.name}`}
                      className="transition-colors hover:bg-white/[0.02]"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                    >
                      {idx === 0 && (
                        <td
                          rowSpan={items.length}
                          className="py-3 px-4 text-sm font-sans font-medium"
                          style={{ color: "#D0CCC6", verticalAlign: "top" }}
                        >
                          {m.month}
                        </td>
                      )}
                      <td className="py-3 px-4">
                        <span className="text-xs font-sans" style={{ color: "#C75B39" }}>{p.name}</span>
                      </td>
                      <td className="py-3 px-4 text-sm font-sans font-medium" style={{ color: "#F5F0EB" }}>
                        {formatEuro(p.gross)}
                      </td>
                      <td className="py-3 px-4 text-xs font-sans" style={{ color: "#F5F0EB" }}>
                        {p.commission_pct}%
                      </td>
                      <td className="py-3 px-4 text-sm font-sans font-medium" style={{ color: "#C75B39" }}>
                        {formatEuro(p.commission_eur)}
                      </td>
                      <td className="py-3 px-4 text-sm font-sans font-semibold" style={{ color: "#7A9A65" }}>
                        {formatEuro(p.net)}
                      </td>
                    </tr>
                  ));
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
