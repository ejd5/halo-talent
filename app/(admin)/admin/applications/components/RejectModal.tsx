"use client";

import { useState } from "react";
import type { Application } from "../types";
import { X, Send } from "lucide-react";

type Props = {
  application: Application;
  onClose: () => void;
  onRejected: () => void;
};

const rejectionTemplates = [
  {
    label: "Standard — Poli mais clair",
    text: `Bonjour [Prénom],

Nous vous remercions sincèrement pour le temps et l'énergie que vous avez consacrés à votre candidature auprès de Halo Talent.

Après une étude approfondie de votre profil, nous avons pris la décision de ne pas donner suite à votre candidature pour le moment.

Cette décision n'est en rien un reflet de votre talent ou de votre potentiel. Nous recevons un nombre très important de candidatures et nous devons faire des choix difficiles qui correspondent à nos besoins immédiats et à notre capacité d'accompagnement.

Nous vous souhaitons beaucoup de succès dans vos projets créatifs.

Bien cordialement,
L'équipe Halo Talent`,
  },
  {
    label: "Encourageant — Pas le bon moment",
    text: `Bonjour [Prénom],

Merci beaucoup pour votre candidature et pour l'intérêt que vous portez à Halo Talent.

Nous sommes impressionnés par votre parcours, mais nous pensons que ce n'est pas encore le moment idéal pour un accompagnement. Nous vous invitons à retenter votre chance dans quelques mois, lorsque votre audience et vos revenus auront encore grandi.

Nous restons à votre disposition pour un entretien conseil si vous le souhaitez.

A très bientôt,
L'équipe Halo Talent`,
  },
  {
    label: "Court — Candidature incomplète",
    text: `Bonjour [Prénom],

Nous vous remercions pour votre candidature.

Après examen, nous avons constaté que votre dossier est incomplet. Nous vous invitons à postuler à nouveau avec des informations plus détaillées sur votre parcours et vos objectifs.

Bien cordialement,
L'équipe Halo Talent`,
  },
];

export function RejectModal({ application, onClose, onRejected }: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [customMessage, setCustomMessage] = useState("");
  const [sending, setSending] = useState(false);

  const template = rejectionTemplates[selectedTemplate];
  const finalMessage =
    customMessage.trim() ||
    template.text.replace("[Prénom]", application.full_name.split(" ")[0]);

  const handleReject = async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    onRejected();
  };

  return (
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
            Refuser avec message
          </h2>
          <button onClick={onClose} className="p-1 transition-colors hover:bg-white/5" style={{ color: "var(--text-secondary)" }}>
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-sm font-sans" style={{ color: "#D0CCC6" }}>
            Refuser <strong style={{ color: "var(--text-primary)" }}>{application.full_name}</strong>. Un email de refus lui sera envoyé.
          </p>

          {/* Templates */}
          <div>
            <label className="text-[11px] font-sans font-medium mb-2 block" style={{ color: "var(--text-secondary)" }}>
              Template de refus
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(Number(e.target.value))}
              className="w-full px-3 py-2.5 text-xs font-sans outline-none"
              style={{
                background: "transparent",
                color: "var(--text-primary)",
                border: "1px solid var(--border-default)",
              }}
            >
              {rejectionTemplates.map((t, i) => (
                <option key={i} value={i} style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Message preview / edit */}
          <div>
            <label className="text-[11px] font-sans font-medium mb-2 block" style={{ color: "var(--text-secondary)" }}>
              Message personnalisé
            </label>
            <textarea
              value={customMessage || finalMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={8}
              className="w-full bg-transparent text-xs font-sans outline-none resize-none p-3 leading-relaxed"
              style={{
                color: "#D0CCC6",
                border: "1px solid var(--border-default)",
              }}
            />
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
              onClick={handleReject}
              disabled={sending}
              className="flex-1 py-2.5 text-[11px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:opacity-90 disabled:opacity-30"
              style={{ background: "var(--danger)", color: "var(--text-primary)" }}
            >
              {sending ? (
                "Envoi en cours..."
              ) : (
                <>
                  <Send size={14} strokeWidth={1.5} className="inline mr-1.5" />
                  Refuser et envoyer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
