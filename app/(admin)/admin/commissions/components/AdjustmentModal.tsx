"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { formatEuro } from "../../creators/utils";
import type { CommissionAdjustment } from "../types";

type Props = {
  creatorId: string;
  creatorName: string;
  currentCommission: number;
  onSave: (adj: CommissionAdjustment) => void;
  onClose: () => void;
};

const REASONS = [
  "Erreur de calcul",
  "Remise commerciale",
  "Avenant contrat",
  "Révision de palier",
  "Autre",
];

export function AdjustmentModal({ creatorId, creatorName, currentCommission, onSave, onClose }: Props) {
  const [adjustmentAmount, setAdjustmentAmount] = useState(0);
  const [reason, setReason] = useState(REASONS[0]);
  const [justification, setJustification] = useState("");

  const difference = adjustmentAmount - currentCommission;
  const needsValidation = Math.abs(difference) > 1000;
  const isValid = justification.trim().length > 0 && adjustmentAmount > 0;

  const handleSave = () => {
    if (!isValid) return;
    onSave({
      id: `adj-${Date.now()}`,
      creator_id: creatorId,
      creator_name: creatorName,
      month: "Jun 2026",
      original_commission_eur: currentCommission,
      adjusted_commission_eur: adjustmentAmount,
      difference,
      reason,
      justification: justification.trim(),
      status: needsValidation ? "pending" : "validated",
      requested_by: "Moi",
      validated_by: needsValidation ? null : "Moi",
      validated_at: needsValidation ? null : new Date().toISOString(),
      created_at: new Date().toISOString(),
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="w-full max-w-lg card-accent" style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.08)" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <p className="font-display text-base font-bold" style={{ color: "#F5F0EB" }}>
                Ajuster la commission
              </p>
              <p className="text-[11px] font-sans mt-0.5" style={{ color: "#F5F0EB" }}>{creatorName}</p>
            </div>
            <button onClick={onClose} className="p-1 transition-colors hover:bg-white/5" style={{ color: "#F5F0EB" }}>
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>

          <div className="px-6 py-5 space-y-4">
            {/* Current */}
            <div>
              <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.08em] mb-1" style={{ color: "#E0D8D0" }}>
                Commission actuelle
              </p>
              <p className="font-display text-xl font-bold" style={{ color: "#F5F0EB" }}>
                {formatEuro(currentCommission)}
              </p>
            </div>

            {/* New amount */}
            <div>
              <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.08em] mb-1" style={{ color: "#E0D8D0" }}>
                Nouveau montant (€)
              </p>
              <input
                type="number"
                value={adjustmentAmount || ""}
                onChange={(e) => setAdjustmentAmount(Number(e.target.value))}
                placeholder="0"
                className="w-full bg-transparent text-sm font-sans py-2 px-3 outline-none tabular-nums"
                style={{ color: "#F5F0EB", border: "1px solid rgba(255,255,255,0.06)" }}
              />
            </div>

            {/* Difference warning */}
            {difference !== 0 && (
              <div className="flex items-center gap-2 px-3 py-2" style={{
                background: needsValidation ? "rgba(196,69,54,0.08)" : "rgba(199,91,57,0.08)",
              }}>
                <AlertTriangle size={12} strokeWidth={1.5}
                  style={{ color: needsValidation ? "#C44536" : "#C75B39" }} />
                <span className="text-[10px] font-sans" style={{ color: needsValidation ? "#C44536" : "#C75B39" }}>
                  {difference >= 0 ? "+" : ""}{formatEuro(difference)}
                  {needsValidation ? " — Validation requise (>1000€)" : ""}
                </span>
              </div>
            )}

            {/* Reason */}
            <div>
              <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.08em] mb-1" style={{ color: "#E0D8D0" }}>
                Motif
              </p>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-transparent text-xs font-sans py-2 px-3 outline-none"
                style={{ color: "#D0CCC6", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {REASONS.map((r) => (
                  <option key={r} value={r} style={{ background: "#1A1614" }}>{r}</option>
                ))}
              </select>
            </div>

            {/* Justification */}
            <div>
              <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.08em] mb-1" style={{ color: "#E0D8D0" }}>
                Justification
              </p>
              <textarea
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Expliquez la raison de cet ajustement..."
                rows={3}
                className="w-full bg-transparent text-xs font-sans py-2 px-3 outline-none resize-none"
                style={{ color: "#D0CCC6", border: "1px solid rgba(255,255,255,0.06)" }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button
              onClick={onClose}
              className="px-4 py-2 text-[11px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-white/5"
              style={{ color: "#F5F0EB" }}
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={!isValid}
              className="px-4 py-2 text-[11px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:opacity-90 disabled:opacity-30"
              style={{ background: "#C75B39", color: "#F5F0EB" }}
            >
              {needsValidation ? "Soumettre pour validation" : "Appliquer"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
