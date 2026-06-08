"use client";

import { formatEuro } from "../../creators/utils";
import { AlertTriangle, Pencil } from "lucide-react";
import type { CommissionRow, CommissionAdjustment } from "../types";

type Props = {
  rows: CommissionRow[];
  onAdjust: (creatorId: string) => void;
  pendingAdjustments: CommissionAdjustment[];
  onValidate: (adj: CommissionAdjustment) => void;
};

export function CommissionTable({ rows, onAdjust, pendingAdjustments, onValidate }: Props) {
  return (
    <div style={{ border: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-sans font-semibold uppercase tracking-[0.12em]"
              style={{ color: "#5A544C", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <th className="py-3 px-4 font-medium">Créateur</th>
              <th className="py-3 px-4 font-medium">Département</th>
              <th className="py-3 px-4 font-medium">Palier</th>
              <th className="py-3 px-4 font-medium">Brut</th>
              <th className="py-3 px-4 font-medium">Taux contrat</th>
              <th className="py-3 px-4 font-medium">Commission contrat</th>
              <th className="py-3 px-4 font-medium">Palier min.</th>
              <th className="py-3 px-4 font-medium">Justification palier</th>
              <th className="py-3 px-4 font-medium">Ajustement</th>
              <th className="py-3 px-4 font-medium">Commission effective</th>
              <th className="py-3 px-4 font-medium w-10"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const pendingAdj = pendingAdjustments.find((a) => a.creator_id === row.creator_id);
              const needsValidation = pendingAdj && Math.abs(pendingAdj.difference) > 1000;

              return (
                <tr key={row.creator_id} className="transition-colors hover:bg-white/[0.02]"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <td className="py-3 px-4">
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
                  <td className="py-3 px-4 text-xs font-sans" style={{ color: "#9A9590" }}>{row.department}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-sans capitalize" style={{ color: "#7A736B" }}>{row.tier}</span>
                  </td>
                  <td className="py-3 px-4 text-xs font-sans tabular-nums" style={{ color: "#F5F0EB" }}>
                    {formatEuro(row.gross)}
                  </td>
                  <td className="py-3 px-4 text-xs font-sans tabular-nums" style={{ color: "#9A9590" }}>
                    {row.contract_rate}%
                  </td>
                  <td className="py-3 px-4 text-xs font-sans tabular-nums" style={{ color: "#D0CCC6" }}>
                    {formatEuro(row.contract_commission_eur)}
                  </td>
                  <td className="py-3 px-4 text-xs font-sans tabular-nums" style={{ color: "#9A9590" }}>
                    {formatEuro(row.tier_min_revenue)}
                  </td>
                  <td className="py-3 px-4 text-[10px] font-sans" style={{ color: "#7A736B" }}>
                    {row.tier_reason}
                  </td>
                  <td className="py-3 px-4">
                    {pendingAdj ? (
                      <div className="flex items-center gap-1">
                        <AlertTriangle size={10} strokeWidth={1.5}
                          style={{ color: needsValidation ? "#C44536" : "#C75B39" }} />
                        <span className="text-[10px] font-sans" style={{ color: needsValidation ? "#C44536" : "#C75B39" }}>
                          {pendingAdj.difference >= 0 ? "+" : ""}{formatEuro(pendingAdj.difference)}
                        </span>
                        {needsValidation && (
                          <button
                            onClick={() => onValidate(pendingAdj)}
                            className="ml-1 text-[9px] font-sans font-semibold uppercase tracking-[0.08em] px-1.5 py-0.5"
                            style={{ background: "rgba(196,69,54,0.15)", color: "#C44536" }}
                          >
                            Valider
                          </button>
                        )}
                      </div>
                    ) : row.adjustment ? (
                      <span className="text-[10px] font-sans" style={{ color: "#7A9A65" }}>
                        {row.adjustment.difference >= 0 ? "+" : ""}{formatEuro(row.adjustment.difference)}
                      </span>
                    ) : (
                      <span className="text-[10px] font-sans" style={{ color: "#5A544C" }}>—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-xs font-sans font-semibold tabular-nums" style={{ color: "#C75B39" }}>
                    {formatEuro(row.effective_commission_eur)}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onAdjust(row.creator_id)}
                      className="p-1 transition-colors hover:bg-white/5"
                      style={{ color: "#7A736B" }}
                      title="Ajuster la commission"
                    >
                      <Pencil size={12} strokeWidth={1.5} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
