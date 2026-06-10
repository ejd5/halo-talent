"use client";

import { useMemo, useState } from "react";
import { creators } from "../../creators/data";
import { commissionAdjustments } from "../data";
import { buildCommissionRows } from "../utils";
import type { CommissionRow, CommissionAdjustment } from "../types";
import { CommissionTable } from "./CommissionTable";
import { AdjustmentModal } from "./AdjustmentModal";
import { ValidationModal } from "./ValidationModal";

export function CommissionsPage() {
  const [adjustments, setAdjustments] = useState<CommissionAdjustment[]>(commissionAdjustments);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showValidateModal, setShowValidateModal] = useState<CommissionAdjustment | null>(null);
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);

  const rows = useMemo(
    () => buildCommissionRows(creators, adjustments),
    [adjustments]
  );

  const pendingAdjustments = adjustments.filter((a) => a.status === "pending");
  const totalPendingValidation = pendingAdjustments.filter(
    (a) => Math.abs(a.difference) > 1000
  ).length;

  const handleAdjust = (creatorId: string) => {
    setSelectedCreator(creatorId);
    setShowAdjustModal(true);
  };

  const handleSaveAdjustment = (adj: CommissionAdjustment) => {
    setAdjustments((prev) => [adj, ...prev]);
    setShowAdjustModal(false);
    setSelectedCreator(null);
  };

  const handleValidate = (adj: CommissionAdjustment) => {
    setShowValidateModal(adj);
  };

  const handleConfirmValidation = (adjId: string) => {
    setAdjustments((prev) =>
      prev.map((a) =>
        a.id === adjId
          ? { ...a, status: "validated" as const, validated_by: "Moi", validated_at: new Date().toISOString() }
          : a
      )
    );
    setShowValidateModal(null);
  };

  return (
    <div className="card-accent">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Commissions
          </h1>
          <p className="text-xs font-sans mt-1" style={{ color: "var(--text-primary)" }}>
            Calcul détaillé des commissions par créateur
          </p>
        </div>
        {totalPendingValidation > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 text-[10px] font-sans font-semibold"
            style={{ background: "rgba(199,91,57,0.1)", color: "var(--accent)" }}>
            <span className="w-1.5 h-1.5 bg-current" />
            {totalPendingValidation} ajustement{totalPendingValidation > 1 ? "s" : ""} &gt;1000€ à valider
          </div>
        )}
      </div>

      <CommissionTable
        rows={rows}
        onAdjust={handleAdjust}
        pendingAdjustments={pendingAdjustments}
        onValidate={handleValidate}
      />

      {showAdjustModal && selectedCreator && (
        <AdjustmentModal
          creatorId={selectedCreator}
          creatorName={creators.find((c) => c.id === selectedCreator)?.full_name ?? ""}
          currentCommission={rows.find((r) => r.creator_id === selectedCreator)?.contract_commission_eur ?? 0}
          onSave={handleSaveAdjustment}
          onClose={() => { setShowAdjustModal(false); setSelectedCreator(null); }}
        />
      )}

      {showValidateModal && (
        <ValidationModal
          adjustment={showValidateModal}
          onConfirm={handleConfirmValidation}
          onClose={() => setShowValidateModal(null)}
        />
      )}
    </div>
  );
}
