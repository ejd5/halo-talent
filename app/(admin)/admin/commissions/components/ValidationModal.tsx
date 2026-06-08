"use client";

import { X, CheckCircle, XCircle } from "lucide-react";
import { formatEuro } from "../../creators/utils";
import type { CommissionAdjustment } from "../types";

type Props = {
  adjustment: CommissionAdjustment;
  onConfirm: (adjId: string) => void;
  onClose: () => void;
};

export function ValidationModal({ adjustment, onConfirm, onClose }: Props) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="w-full max-w-md" style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.08)" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <p className="font-display text-base font-bold" style={{ color: "#F5F0EB" }}>
                Valider l'ajustement
              </p>
              <p className="text-[11px] font-sans mt-0.5" style={{ color: "#7A736B" }}>
                {adjustment.creator_name} · {adjustment.month}
              </p>
            </div>
            <button onClick={onClose} className="p-1 transition-colors hover:bg-white/5" style={{ color: "#7A736B" }}>
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <p className="text-[10px] uppercase tracking-[0.08em] mb-1" style={{ color: "#5A544C" }}>Commission originale</p>
                <p style={{ color: "#D0CCC6" }}>{formatEuro(adjustment.original_commission_eur)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.08em] mb-1" style={{ color: "#5A544C" }}>Commission ajustée</p>
                <p style={{ color: "#F5F0EB" }}>{formatEuro(adjustment.adjusted_commission_eur)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.08em] mb-1" style={{ color: "#5A544C" }}>Différence</p>
                <p style={{ color: adjustment.difference > 0 ? "#C75B39" : "#C44536" }}>
                  {adjustment.difference >= 0 ? "+" : ""}{formatEuro(adjustment.difference)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.08em] mb-1" style={{ color: "#5A544C" }}>Motif</p>
                <p style={{ color: "#9A9590" }}>{adjustment.reason}</p>
              </div>
            </div>

            <div className="p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
              <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.08em] mb-1" style={{ color: "#5A544C" }}>
                Justification
              </p>
              <p className="text-xs font-sans leading-relaxed" style={{ color: "#9A9590" }}>
                {adjustment.justification}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-white/5"
              style={{ color: "#C44536" }}
            >
              <XCircle size={13} strokeWidth={1.5} />
              Rejeter
            </button>
            <button
              onClick={() => onConfirm(adjustment.id)}
              className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:opacity-90"
              style={{ background: "#7A9A65", color: "#F5F0EB" }}
            >
              <CheckCircle size={13} strokeWidth={1.5} />
              Valider
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
