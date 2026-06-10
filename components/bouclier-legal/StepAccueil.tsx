"use client";

import { ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";

export function StepAccueil({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-16">
      {/* Accent shield icon */}
      <div
        className="w-20 h-20 flex items-center justify-center mb-8 animate-float"
        style={{ backgroundColor: "var(--color-accent-soft)" }}
      >
        <ShieldCheck size={40} style={{ color: "var(--color-accent)" }} />
      </div>

      {/* Title */}
      <h1
        className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight max-w-3xl mb-6"
        style={{ color: "var(--text-primary)" }}
      >
        Votre contrat d&apos;agence vous protège-t-il vraiment&nbsp;?
      </h1>

      {/* Subtitle */}
      <p
        className="text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        En 2 minutes, découvrez si votre contrat contient des clauses abusives.
        Gratuit, anonyme, sans inscription.
      </p>

      {/* CTA */}
      <button
        onClick={onStart}
        className="inline-flex items-center gap-3 px-10 py-5 text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
        style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
      >
        Analyser mon contrat
        <ArrowRight size={20} />
      </button>

      {/* Legal disclaimer */}
      <div
        className="mt-8 max-w-2xl px-5 py-4 text-sm leading-relaxed"
        style={{ backgroundColor: "var(--color-accent-soft)", color: "var(--text-tertiary)" }}
      >
        <div className="flex items-start gap-2">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" style={{ color: "var(--color-accent)" }} />
          <span>
            Cet outil fournit une information générale et ne remplace pas l&apos;avis d&apos;un
            avocat. Les résultats sont basés sur une analyse automatisée de clauses
            courantes et ne constituent pas un conseil juridique.
          </span>
        </div>
      </div>

      {/* Stat */}
      <div
        className="mt-12 px-8 py-5 border max-w-lg"
        style={{
          borderColor: "rgba(199,91,57,0.2)",
          backgroundColor: "rgba(199,91,57,0.04)",
        }}
      >
        <span className="text-3xl font-bold" style={{ color: "var(--color-accent)" }}>
          73%
        </span>
        <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
          des contrats d&apos;agence OFM contiennent{" "}
          <span className="font-semibold">au moins 1 clause abusive</span>
        </p>
      </div>
    </div>
  );
}
