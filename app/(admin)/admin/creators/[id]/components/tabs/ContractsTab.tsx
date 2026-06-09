"use client";

import { contracts } from "../../../data";
import { formatDate } from "../../../utils";
import { FileText, Download, Plus, CheckCircle, XCircle, Clock } from "lucide-react";

type Props = { creatorId: string };

const statusStyles: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  active: { icon: CheckCircle, label: "Actif", color: "#7A9A65" },
  expired: { icon: Clock, label: "Expiré", color: "#E0D8D0" },
  terminated: { icon: XCircle, label: "Résilié", color: "#C44536" },
};

export function ContractsTab({ creatorId }: Props) {
  const list = contracts[creatorId] ?? [];

  return (
    <div className="space-y-4 card-accent">
      {list.length === 0 ? (
        <p className="text-sm font-sans text-center py-8" style={{ color: "#E0D8D0" }}>
          Aucun contrat pour ce créateur.
        </p>
      ) : (
        list.map((contract) => {
          const st = statusStyles[contract.status];
          const Icon = st.icon;
          return (
            <div
              key={contract.id}
              className="p-5"
              style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.04)" }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText size={14} strokeWidth={1.5} style={{ color: "#C75B39" }} />
                    <h3 className="font-display text-base font-bold" style={{ color: "#F5F0EB" }}>
                      {contract.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-[10px] font-sans font-semibold uppercase tracking-[0.08em]" style={{ color: st.color }}>
                      <Icon size={10} strokeWidth={1.5} />
                      {st.label}
                    </span>
                    <span className="text-[10px] font-sans" style={{ color: "#E0D8D0" }}>
                      Commission : {contract.commission_rate}%
                    </span>
                  </div>
                </div>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-white/5"
                  style={{ color: "#C75B39", border: "1px solid rgba(199,91,57,0.3)" }}
                >
                  <Download size={11} strokeWidth={1.5} />
                  PDF
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs font-sans" style={{ color: "#F5F0EB" }}>
                <div>
                  <span style={{ color: "#E0D8D0" }}>Signé le :</span> {formatDate(contract.signed_date)}
                </div>
                <div>
                  <span style={{ color: "#E0D8D0" }}>Expire le :</span> {contract.end_date ? formatDate(contract.end_date) : "—"}
                </div>
              </div>
            </div>
          );
        })
      )}

      <button
        className="flex items-center gap-2 w-full justify-center py-3 text-[11px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-white/5"
        style={{ color: "#F5F0EB", border: "1px dashed rgba(255,255,255,0.1)" }}
      >
        <Plus size={14} strokeWidth={1.5} />
        Créer un avenant
      </button>
    </div>
  );
}
