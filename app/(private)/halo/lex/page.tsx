import { LexInterface } from "@/components/halo-lex/LexInterface";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Halo Lex — Conseiller juridique IA",
  description: "Votre conseiller juridique IA spécialisé créateurs de contenu",
};

export default function HaloLexPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Halo Studio › Bouclier Légal › Halo Lex
            </span>
          </div>
          <h1 className="text-2xl font-display font-semibold" style={{ color: "var(--text-primary)" }}>
            Halo Lex
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs px-2 py-1 font-medium" style={{ background: "rgba(212,162,76,0.12)", color: "#D4A24C" }}>
            Premium
          </span>
        </div>
      </div>

      <LexInterface locale="fr" />
    </div>
  );
}
