"use client";

import { CreditCard, Building, Banknote, CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import { formatDate, formatEuro } from "../../creators/utils";
import type { Payout } from "../types";

type Props = {
  payouts: Payout[];
  onSelect: (p: Payout) => void;
  onUpdate: (id: string, updates: Partial<Payout>) => void;
};

const methodIcons: Record<string, React.ElementType> = {
  stripe: CreditCard,
  wire: Building,
  other: Banknote,
};

const methodLabels: Record<string, string> = {
  stripe: "Stripe",
  wire: "Virement",
  other: "Autre",
};

const statusStyles: Record<string, { icon: React.ElementType; label: string; bg: string; fg: string }> = {
  pending: { icon: Loader2, label: "En attente", bg: "rgba(199,91,57,0.12)", fg: "#C75B39" },
  validated: { icon: CheckCircle, label: "Validé", bg: "rgba(122,154,101,0.12)", fg: "#7A9A65" },
  completed: { icon: CheckCircle, label: "Effectué", bg: "rgba(255,255,255,0.06)", fg: "#E0D8D0" },
  error: { icon: XCircle, label: "Erreur", bg: "rgba(196,69,54,0.12)", fg: "#C44536" },
};

export function PayoutTable({ payouts, onSelect, onUpdate }: Props) {
  const handleAction = (
    e: React.MouseEvent,
    payoutId: string,
    action: "validate" | "execute" | "error"
  ) => {
    e.stopPropagation();
    const payout = payouts.find((p) => p.id === payoutId);
    if (!payout) return;

    switch (action) {
      case "validate":
        if (payout.amount > 5000 && !payout.double_validated_by) {
          onUpdate(payoutId, {
            status: "validated",
            validated_by: "Moi",
            validated_at: new Date().toISOString(),
            double_validated_by: null,
          });
        } else {
          onUpdate(payoutId, {
            status: "validated",
            validated_by: "Moi",
            validated_at: new Date().toISOString(),
            double_validated_by: payout.amount > 5000 ? "Sophie L. (validation secondaire)" : null,
            double_validated_at: payout.amount > 5000 ? new Date().toISOString() : null,
          });
        }
        break;
      case "execute":
        onUpdate(payoutId, {
          status: "completed",
          executed_at: new Date().toISOString(),
        });
        break;
      case "error":
        onUpdate(payoutId, { status: "error", error_message: "Signalé manuellement" });
        break;
    }
  };

  if (payouts.length === 0) {
    return (
      <div className="text-center py-12" style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.04)" }}>
        <p className="text-sm font-sans" style={{ color: "#E0D8D0" }}>Aucun payout trouvé</p>
      </div>
    );
  }

  return (
    <div className="card-accent" style={{ border: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-sans font-semibold uppercase tracking-[0.12em]"
              style={{ color: "#E0D8D0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <th className="py-3 px-4 font-medium">Créateur</th>
              <th className="py-3 px-4 font-medium">Montant</th>
              <th className="py-3 px-4 font-medium">Période</th>
              <th className="py-3 px-4 font-medium">Méthode</th>
              <th className="py-3 px-4 font-medium">Date prévue</th>
              <th className="py-3 px-4 font-medium">Statut</th>
              <th className="py-3 px-4 font-medium w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((po) => {
              const st = statusStyles[po.status];
              const StatusIcon = st.icon;
              const MethodIcon = methodIcons[po.method] || Banknote;

              return (
                <tr
                  key={po.id}
                  onClick={() => onSelect(po)}
                  className="cursor-pointer transition-colors hover:bg-white/[0.02]"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 flex items-center justify-center text-[10px] font-sans font-semibold"
                        style={{ background: "rgba(199,91,57,0.15)", color: "#C75B39" }}>
                        {po.creator_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-sans font-medium" style={{ color: "#D0CCC6" }}>
                          {po.creator_name}
                        </p>
                        <p className="text-[9px] font-sans" style={{ color: "#E0D8D0" }}>{po.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-sans font-semibold tabular-nums" style={{ color: "#F5F0EB" }}>
                        {formatEuro(po.amount)}
                      </span>
                      {po.amount > 5000 && (
                        <AlertTriangle size={9} strokeWidth={1.5} style={{ color: "#C75B39" }} />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs font-sans" style={{ color: "#E0D8D0" }}>{po.period}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <MethodIcon size={11} strokeWidth={1.5} style={{ color: "#F5F0EB" }} />
                      <span className="text-[10px] font-sans" style={{ color: "#F5F0EB" }}>
                        {methodLabels[po.method]}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[11px] font-sans" style={{ color: "#F5F0EB" }}>
                    {new Date(po.scheduled_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                  </td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1 text-[10px] font-sans font-semibold uppercase tracking-[0.08em] px-2 py-0.5"
                      style={{ background: st.bg, color: st.fg }}>
                      <StatusIcon size={9} strokeWidth={1.5} />
                      {st.label}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      {po.status === "pending" && (
                        <button
                          onClick={(e) => handleAction(e, po.id, "validate")}
                          className="px-2 py-1 text-[9px] font-sans font-semibold uppercase tracking-[0.08em] transition-colors"
                          style={{ background: "rgba(199,91,57,0.12)", color: "#C75B39" }}
                        >
                          Valider
                        </button>
                      )}
                      {po.status === "validated" && (
                        <button
                          onClick={(e) => handleAction(e, po.id, "execute")}
                          className="px-2 py-1 text-[9px] font-sans font-semibold uppercase tracking-[0.08em] transition-colors"
                          style={{ background: "rgba(122,154,101,0.15)", color: "#7A9A65" }}
                        >
                          Exécuter
                        </button>
                      )}
                      {(po.status === "pending" || po.status === "validated") && (
                        <button
                          onClick={(e) => handleAction(e, po.id, "error")}
                          className="px-2 py-1 text-[9px] font-sans font-semibold uppercase tracking-[0.08em] transition-colors"
                          style={{ background: "rgba(196,69,54,0.1)", color: "#C44536" }}
                        >
                          Erreur
                        </button>
                      )}
                    </div>
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
