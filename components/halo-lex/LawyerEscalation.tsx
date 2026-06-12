"use client";

// ─── MVP: Escalade avocat désactivée ───────────────────────
// En Phase 2 (mois 6+), quand les partenariats avocats seront
// négociés, ce composant sera réactivé avec la vraie liste.
//
// Pour l'instant : collecte des emails intéressés.

import { useState } from "react";
import { Scale, Mail, CheckCircle } from "lucide-react";

interface LawyerEscalationProps {
  locale?: string;
  questionnaireId?: string;
  onClose?: () => void;
}

export function LawyerEscalation({ locale = "fr", onClose }: LawyerEscalationProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) return;
    // TODO: Envoyer l'email à une liste d'attente (Resend, ConvertKit, etc.)
    console.log("[MVP] Interested email for lawyer escalation:", email);
    setSubmitted(true);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(212,162,76,0.12)" }}>
          <Scale size={28} style={{ color: "var(--accent)" }} />
        </div>

        {submitted ? (
          <>
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={24} style={{ color: "#22c55e" }} />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              {locale === "en" ? "You're on the list!" : "Vous êtes sur la liste !"}
            </h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {locale === "en"
                ? "We'll notify you as soon as our lawyer network is available."
                : "Nous vous notifierons dès que notre réseau d'avocats partenaires sera disponible."}
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              {locale === "en" ? "Lawyer Network — Coming Soon" : "Réseau d'avocats — Bientôt disponible"}
            </h2>
            <p className="text-sm mb-6 max-w-md mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {locale === "en"
                ? "We are currently building our network of partner law firms specialized in creator protection. This service will be available in Phase 2. Leave your email to be notified when it launches."
                : "Nous constituons actuellement notre réseau de cabinets d'avocats partenaires spécialisés dans la protection des créateurs. Ce service sera disponible en Phase 2. Laissez votre email pour être notifié du lancement."}
            </p>

            <div className="flex items-center gap-2 max-w-sm mx-auto">
              <div className="flex-1 relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={locale === "en" ? "your@email.com" : "votre@email.com"}
                  className="w-full text-sm pl-9 pr-3 py-2 rounded-md outline-none"
                  style={{ backgroundColor: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border-default)" }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={!email.includes("@")}
                className="px-4 py-2 text-sm font-medium rounded-md transition-opacity disabled:opacity-40"
                style={{ background: "var(--accent)", color: "var(--text-primary)" }}
              >
                {locale === "en" ? "Notify me" : "Me notifier"}
              </button>
            </div>
          </>
        )}

        {onClose && (
          <button onClick={onClose} className="mt-6 px-4 py-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            {locale === "en" ? "Close" : "Fermer"}
          </button>
        )}
      </div>

      <div className="mt-6 p-3 text-xs text-center" style={{ color: "var(--text-secondary)" }}>
        {locale === "en"
          ? "Halo Lex provides general legal information. This does not constitute legal advice."
          : "Halo Lex fournit une information juridique générale. Ne constitue pas un conseil juridique."}
      </div>
    </div>
  );
}
