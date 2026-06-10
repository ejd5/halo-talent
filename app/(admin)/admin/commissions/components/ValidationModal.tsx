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
        <div className="w-full max-w-md card-accent" style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <p className="font-display text-base font-bold" style={{ color: "var(--text-primary)" }}>
                Valider l'ajustement
              </p>
              <p className="text-[11px] font-sans mt-0.5" style={{ color: "var(--text-primary)" }}>
                {adjustment.creator_name} · {adjustment.month}
              </p>
            </div>
            <button onClick={onClose} className="p-1 transition-colors hover:bg-white/5" style={{ color: "var(--text-primary)" }}>
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <p className="text-[10px] uppercase tracking-[0.08em] mb-1" style={{ color: "var(--text-secondary)" }}>Commission originale</p>
                <p style={{ color: "#D0CCC6" }}>{formatEuro(adjustment.original_commission_eur)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.08em] mb-1" style={{ color: "var(--text-secondary)" }}>Commission ajustée</p>
                <p style={{ color: "var(--text-primary)" }}>{formatEuro(adjustment.adjusted_commission_eur)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.08em] mb-1" style={{ color: "var(--text-secondary)" }}>Différence</p>
                <p style={{ color: adjustment.difference > 0 ? "var(--accent)" : "var(--danger)" }}>
                  {adjustment.difference >= 0 ? "+" : ""}{formatEuro(adjustment.difference)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.08em] mb-1" style={{ color: "var(--text-secondary)" }}>Motif</p>
                <p style={{ color: "var(--text-secondary)" }}>{adjustment.reason}</p>
              </div>
            </div>

            <div className="p-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
              <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.08em] mb-1" style={{ color: "var(--text-secondary)" }}>
                Justification
              </p>
              <p className="text-xs font-sans leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {adjustment.justification}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-white/5"
              style={{ color: "var(--danger)" }}
            >
              <XCircle size={13} strokeWidth={1.5} />
              Rejeter
            </button>
            <button
              onClick={() => onConfirm(adjustment.id)}
              className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:opacity-90"
              style={{ background: "var(--success)", color: "var(--text-primary)" }}
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
