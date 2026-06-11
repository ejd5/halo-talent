import { Construction, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TikTokPage() {
  return (
    <div className="py-24 max-w-2xl mx-auto px-4 text-center">
      <div
        className="w-16 h-16 flex items-center justify-center mx-auto mb-6"
        style={{ backgroundColor: "var(--color-accent-soft)" }}
      >
        <Construction size={30} style={{ color: "var(--color-accent)" }} />
      </div>

      <h1 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
        Protection TikTok — Bientôt disponible
      </h1>

      <p className="text-sm leading-relaxed mb-2" style={{ color: "var(--text-secondary)" }}>
        Nous travaillons actuellement sur l&apos;analyse des CGU TikTok pour vous fournir
        un guide complet sur vos droits en tant que créateur sur la plateforme.
      </p>

      <p className="text-xs mb-8" style={{ color: "var(--text-tertiary)" }}>
        Cette page sera alimentée dès que notre base juridique aura intégré les CGU TikTok.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/protection"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-all hover:scale-[1.02]"
          style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
        >
          Analyser mon contrat
          <ArrowRight size={16} />
        </Link>
        <Link
          href="/protection/onlyfans"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-all"
          style={{
            backgroundColor: "transparent",
            color: "var(--text-primary)",
            border: "1px solid var(--border-default)",
          }}
        >
          Voir OnlyFans
        </Link>
      </div>
    </div>
  );
}
