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
        <div className="w-full max-w-md card-accent" style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.08)" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <p className="font-display text-base font-bold" style={{ color: "#F5F0EB" }}>
                Valider l'ajustement
              </p>
              <p className="text-[11px] font-sans mt-0.5" style={{ color: "#F5F0EB" }}>
                {adjustment.creator_name} · {adjustment.month}
              </p>
            </div>
            <button onClick={onClose} className="p-1 transition-colors hover:bg-white/5" style={{ color: "#F5F0EB" }}>
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <p className="text-[10px] uppercase tracking-[0.08em] mb-1" style={{ color: "#E0D8D0" }}>Commission originale</p>
                <p style={{ color: "#D0CCC6" }}>{formatEuro(adjustment.original_commission_eur)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.08em] mb-1" style={{ color: "#E0D8D0" }}>Commission ajustée</p>
                <p style={{ color: "#F5F0EB" }}>{formatEuro(adjustment.adjusted_commission_eur)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.08em] mb-1" style={{ color: "#E0D8D0" }}>Différence</p>
                <p style={{ color: adjustment.difference > 0 ? "#C75B39" : "#C44536" }}>
                  {adjustment.difference >= 0 ? "+" : ""}{formatEuro(adjustment.difference)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.08em] mb-1" style={{ color: "#E0D8D0" }}>Motif</p>
                <p style={{ color: "#E0D8D0" }}>{adjustment.reason}</p>
              </div>
            </div>

            <div className="p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
              <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.08em] mb-1" style={{ color: "#E0D8D0" }}>
                Justification
              </p>
              <p className="text-xs font-sans leading-relaxed" style={{ color: "#E0D8D0" }}>
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
