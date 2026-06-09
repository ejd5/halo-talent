"use client";

import { X, CreditCard, Building, Banknote, CheckCircle, XCircle, Loader2, Clock, User, AlertTriangle } from "lucide-react";
import { formatDate, formatEuro } from "../../creators/utils";
import type { Payout } from "../types";

type Props = {
  payout: Payout;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Payout>) => void;
};

const methodIcons: Record<string, React.ElementType> = {
  stripe: CreditCard,
  wire: Building,
  other: Banknote,
};

const methodLabels: Record<string, string> = {
  stripe: "Stripe",
  wire: "Virement SEPA",
  other: "Autre",
};

const statusLabels: Record<string, string> = {
  pending: "En attente",
  validated: "Validé",
  completed: "Effectué",
  error: "Erreur",
};

export function PayoutDetailPanel({ payout, onClose, onUpdate }: Props) {
  const MethodIcon = methodIcons[payout.method] || Banknote;

  const timeline = [
    {
      icon: Clock,
      label: "Créé",
      value: formatDate(payout.created_at),
      color: "#F5F0EB",
    },
    ...(payout.validated_by
      ? [
          {
            icon: User,
            label: "Validé par",
            value: `${payout.validated_by}${payout.validated_at ? ` · ${formatDate(payout.validated_at)}` : ""}`,
            color: "#7A9A65",
          },
        ]
      : []),
    ...(payout.double_validated_by
      ? [
          {
            icon: User,
            label: "Double validation",
            value: `${payout.double_validated_by}${payout.double_validated_at ? ` · ${formatDate(payout.double_validated_at)}` : ""}`,
            color: "#7A9A65",
          },
        ]
      : []),
    ...(payout.executed_at
      ? [
          {
            icon: CheckCircle,
            label: "Exécuté",
            value: formatDate(payout.executed_at),
            color: "#7A9A65",
          },
        ]
      : []),
    ...(payout.error_message
      ? [
          {
            icon: XCircle,
            label: "Erreur",
            value: payout.error_message,
            color: "#C44536",
          },
        ]
      : []),
  ];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      <div
        className="fixed top-0 right-0 z-50 h-full w-full max-w-md overflow-y-auto card-accent"
        style={{ background: "#0F0D0B", borderLeft: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <p className="font-display text-lg font-bold" style={{ color: "#F5F0EB" }}>
              {payout.creator_name}
            </p>
            <p className="text-[11px] font-sans mt-0.5" style={{ color: "#F5F0EB" }}>{payout.department}</p>
          </div>
          <button onClick={onClose} className="p-1 transition-colors hover:bg-white/5" style={{ color: "#F5F0EB" }}>
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Amount */}
          <div className="p-5" style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.04)" }}>
            <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.08em] mb-1" style={{ color: "#F5F0EB" }}>
              Montant
            </p>
            <p className="font-display text-3xl font-bold tabular-nums" style={{ color: "#F5F0EB" }}>
              {formatEuro(payout.amount)}
            </p>
            <p className="text-[11px] font-sans mt-2" style={{ color: "#E0D8D0" }}>
              Période : {payout.period}
            </p>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.08em] mb-1" style={{ color: "#E0D8D0" }}>
                Méthode
              </p>
              <div className="flex items-center gap-1.5">
                <MethodIcon size={12} strokeWidth={1.5} style={{ color: "#F5F0EB" }} />
                <span className="text-xs font-sans" style={{ color: "#D0CCC6" }}>
                  {methodLabels[payout.method]}
                </span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.08em] mb-1" style={{ color: "#E0D8D0" }}>
                Statut
              </p>
              <span className="text-xs font-sans" style={{ color: "#D0CCC6" }}>
                {statusLabels[payout.status]}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.08em] mb-1" style={{ color: "#E0D8D0" }}>
                Date prévue
              </p>
              <span className="text-xs font-sans" style={{ color: "#D0CCC6" }}>
                {new Date(payout.scheduled_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.08em] mb-1" style={{ color: "#E0D8D0" }}>
                Double validation
              </p>
              <span className="text-xs font-sans" style={{ color: payout.double_validated_by ? "#7A9A65" : "#E0D8D0" }}>
                {payout.double_validated_by ? "✓ Effectuée" : payout.amount > 5000 ? "Requis (>5000€)" : "N/A"}
              </span>
            </div>
          </div>

          {/* >5000€ warning */}
          {payout.amount > 5000 && !payout.double_validated_by && (
            <div className="flex items-center gap-2 px-4 py-3" style={{ background: "rgba(199,91,57,0.08)" }}>
              <AlertTriangle size={13} strokeWidth={1.5} style={{ color: "#C75B39" }} />
              <span className="text-[10px] font-sans" style={{ color: "#C75B39" }}>
                Double validation requise pour les montants &gt;5000€
              </span>
            </div>
          )}

          {/* Notes */}
          {payout.notes && (
            <div className="p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
              <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.08em] mb-1" style={{ color: "#E0D8D0" }}>
                Notes
              </p>
              <p className="text-xs font-sans leading-relaxed" style={{ color: "#E0D8D0" }}>
                {payout.notes}
              </p>
            </div>
          )}

          {/* Error */}
          {payout.error_message && (
            <div className="p-3" style={{ background: "rgba(196,69,54,0.06)", border: "1px solid rgba(196,69,54,0.15)" }}>
              <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.08em] mb-1" style={{ color: "#C44536" }}>
                Message d'erreur
              </p>
              <p className="text-xs font-sans leading-relaxed" style={{ color: "#D0CCC6" }}>
                {payout.error_message}
              </p>
            </div>
          )}

          {/* Timeline */}
          <div>
            <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.08em] mb-3" style={{ color: "#E0D8D0" }}>
              Chronologie
            </p>
            <div className="space-y-3">
              {timeline.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <Icon size={11} strokeWidth={1.5} style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.08em]" style={{ color: "#E0D8D0" }}>
                        {item.label}
                      </p>
                      <p className="text-xs font-sans mt-0.5" style={{ color: item.color }}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
