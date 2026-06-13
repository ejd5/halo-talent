"use client";

import { useState } from "react";
import type { Application } from "../types";
import { X, CheckCircle, FileText, Send } from "lucide-react";
import { departments } from "../data";

type Props = {
  application: Application;
  onClose: () => void;
  onApproved: () => void;
};

const commissionTiers = [
  { value: "10", label: "10%, Créateur établi (20k€+/mois)" },
  { value: "15", label: "15%, Profil en croissance (8-20k€/mois)" },
  { value: "20", label: "20%, Profil émergent (3-8k€/mois)" },
  { value: "25", label: "25%, Démarrage (<3k€/mois)" },
];

const managers = [
  { id: "m1", name: "Marc A." },
  { id: "m2", name: "Sophie L." },
  { id: "m3", name: "Thomas R." },
  { id: "m4", name: "Clara W." },
];

export function ApproveModal({ application, onClose, onApproved }: Props) {
  const [step, setStep] = useState<"confirm" | "processing" | "done">("confirm");
  const [commission, setCommission] = useState("20");
  const [manager, setManager] = useState("");

  const handleApprove = async () => {
    setStep("processing");
    // Simulate: generate contract PDF, create profile, send email, notify
    await new Promise((r) => setTimeout(r, 2500));
    setStep("done");
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.6)" }}
        onClick={onClose}
      >
        <div
          className="w-full max-w-[520px] shadow-2xl card-accent"
          style={{ background: "#0F0D0B", border: "1px solid var(--border-default)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="font-display text-lg font-bold" style={{ color: "var(--text-primary)" }}>
              {step === "done" ? "Candidature approuvée" : "Approuver la candidature"}
            </h2>
            {step !== "processing" && (
              <button onClick={onClose} className="p-1 transition-colors hover:bg-white/5" style={{ color: "var(--text-secondary)" }}>
                <X size={16} strokeWidth={1.5} />
              </button>
            )}
          </div>

          <div className="px-6 py-5">
            {step === "confirm" && (
              <div className="space-y-5">
                <p className="text-sm font-sans" style={{ color: "#D0CCC6" }}>
                  Vous allez approuver <strong style={{ color: "var(--text-primary)" }}>{application.full_name}</strong> pour le département <strong style={{ color: "var(--accent)" }}>{application.department}</strong>.
                </p>

                {/* Commission tier */}
                <div>
                  <label className="text-[11px] font-sans font-medium mb-2 block" style={{ color: "var(--text-secondary)" }}>
                    Palier de commission initial
                  </label>
                  <div className="space-y-1.5">
                    {commissionTiers.map((t) => (
                      <label
                        key={t.value}
                        className="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors hover:bg-white/5"
                        style={{
                          border: commission === t.value ? "1px solid rgba(199,91,57,0.4)" : "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <input
                          type="radio"
                          name="commission"
                          value={t.value}
                          checked={commission === t.value}
                          onChange={() => setCommission(t.value)}
                          className="accent-[var(--accent)]"
                        />
                        <span className="text-xs font-sans" style={{ color: "#D0CCC6" }}>
                          {t.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Manager */}
                <div>
                  <label className="text-[11px] font-sans font-medium mb-2 block" style={{ color: "var(--text-secondary)" }}>
                    Manager dédié
                  </label>
                  <select
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs font-sans outline-none"
                    style={{
                      background: "transparent",
                      color: manager ? "var(--text-primary)" : "var(--text-secondary)",
                      border: "1px solid var(--border-default)",
                    }}
                  >
                    <option value="">Sélectionner un manager...</option>
                    {managers.map((m) => (
                      <option key={m.id} value={m.id} style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={onClose}
                    className="flex-1 py-2.5 text-[11px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-white/5"
                    style={{ color: "var(--text-primary)", border: "1px solid var(--border-default)" }}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={!manager}
                    className="flex-1 py-2.5 text-[11px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:opacity-90 disabled:opacity-30"
                    style={{ background: "var(--accent)", color: "var(--text-primary)" }}
                  >
                    <CheckCircle size={14} strokeWidth={1.5} className="inline mr-1.5" />
                    Approuver
                  </button>
                </div>
              </div>
            )}

            {step === "processing" && (
              <div className="py-8 text-center">
                <div
                  className="w-12 h-12 flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(199,91,57,0.1)" }}
                >
                  <FileText size={24} strokeWidth={1.5} style={{ color: "var(--accent)" }} />
                </div>
                <p className="text-sm font-sans font-medium" style={{ color: "var(--text-primary)" }}>
                  Traitement en cours...
                </p>
                <ul className="mt-4 space-y-2 text-left max-w-[320px] mx-auto">
                  {[
                    "Génération du contrat PDF...",
                    "Création du profil créateur...",
                    "Envoi de l'email au créateur...",
                    "Notification à l'équipe...",
                  ].map((step, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs font-sans">
                      <span className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "rgba(199,91,57,0.15)" }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
                      </span>
                      <span style={{ color: "var(--text-secondary)" }}>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {step === "done" && (
              <div className="py-8 text-center">
                <div
                  className="w-14 h-14 flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(122,154,101,0.1)" }}
                >
                  <CheckCircle size={28} strokeWidth={1.5} style={{ color: "var(--success)" }} />
                </div>
                <p className="font-display text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                  Candidature approuvée
                </p>
                <p className="text-sm font-sans" style={{ color: "var(--text-secondary)" }}>
                  Contrat envoyé à {application.email}
                </p>
                <button
                  onClick={onApproved}
                  className="mt-6 px-6 py-2.5 text-[11px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:opacity-90"
                  style={{ background: "var(--accent)", color: "var(--text-primary)" }}
                >
                  <Send size={14} strokeWidth={1.5} className="inline mr-1.5" />
                  Retour aux candidatures
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
