import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const tranches = [
  { plafond: "0 € – 10 000 €", taux: "30%", cumul: "3 000 €" },
  { plafond: "10 001 € – 20 000 €", taux: "25%", cumul: "2 500 €" },
  { plafond: "20 001 € – 50 000 €", taux: "20%", cumul: "6 000 €" },
  { plafond: "50 001 € – 100 000 €", taux: "15%", cumul: "7 500 €" },
  { plafond: "> 100 000 €", taux: "10%", cumul: "—" },
];

export default function CommissionsPage() {
  return (
    <div style={{ background: "#1A1614", color: "#F5F0EB" }}>
      {/* Hero */}
      <section className="py-28 md:py-36">
        <div className="mx-auto w-full max-w-5xl px-6 md:px-12 text-center">
          <p
            className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] mb-6"
            style={{ color: "#C75B39" }}
          >
            Tarification transparente
          </p>
          <h1 className="font-display text-[2.8rem] md:text-[5rem] font-bold uppercase tracking-[-0.02em] leading-[1.05]">
            Commissions
          </h1>
          <p
            className="text-lg mt-6 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "rgba(245, 240, 235, 0.55)" }}
          >
            Nous sommes payés uniquement quand vous l&apos;êtes. Notre barème
            est progressif et marginal : plus vous gagnez, moins nous prenons.
          </p>
        </div>
      </section>

      {/* Tableau des tranches */}
      <section className="pb-16">
        <div className="mx-auto w-full max-w-4xl px-6 md:px-12">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ borderBottom: "2px solid #C75B39" }}>
                  <th
                    className="py-4 px-6 text-xs uppercase tracking-[0.1em] font-semibold"
                    style={{ color: "rgba(245, 240, 235, 0.4)" }}
                  >
                    Tranche de revenus mensuels
                  </th>
                  <th
                    className="py-4 px-6 text-xs uppercase tracking-[0.1em] font-semibold"
                    style={{ color: "rgba(245, 240, 235, 0.4)" }}
                  >
                    Taux marginal
                  </th>
                  <th
                    className="py-4 px-6 text-xs uppercase tracking-[0.1em] font-semibold"
                    style={{ color: "rgba(245, 240, 235, 0.4)" }}
                  >
                    Commission max sur la tranche
                  </th>
                </tr>
              </thead>
              <tbody>
                {tranches.map((t, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom: "1px solid rgba(245, 240, 235, 0.06)",
                      background:
                        i % 2 === 0
                          ? "transparent"
                          : "rgba(245, 240, 235, 0.02)",
                    }}
                  >
                    <td className="py-4 px-6 text-sm font-medium">
                      {t.plafond}
                    </td>
                    <td
                      className="py-4 px-6 text-sm font-bold"
                      style={{ color: "#C75B39" }}
                    >
                      {t.taux}
                    </td>
                    <td
                      className="py-4 px-6 text-sm font-mono"
                      style={{ color: "rgba(245, 240, 235, 0.5)" }}
                    >
                      {t.cumul}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Explication du système marginal */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-4xl px-6 md:px-12">
          <h2 className="font-display text-2xl font-bold uppercase tracking-[-0.01em] mb-6">
            Comment fonctionne le système marginal
          </h2>
          <p
            className="text-sm leading-relaxed mb-8"
            style={{ color: "rgba(245, 240, 235, 0.55)" }}
          >
            Le taux s&apos;applique uniquement sur la partie des revenus qui
            tombe dans chaque tranche, pas sur la totalité. C&apos;est le même
            principe que l&apos;impôt sur le revenu : vous ne payez jamais le
            taux le plus élevé sur l&apos;ensemble de vos gains.
          </p>

          {/* Exemple concret */}
          <div
            className="p-6 md:p-8 mb-8"
            style={{
              border: "1px solid rgba(199, 91, 57, 0.2)",
              background: "rgba(199, 91, 57, 0.04)",
            }}
          >
            <h3 className="font-display text-lg font-bold mb-4" style={{ color: "#C75B39" }}>
              Exemple : 25 000 € de revenus mensuels
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1" style={{ borderBottom: "1px solid rgba(245, 240, 235, 0.05)" }}>
                <span style={{ color: "rgba(245, 240, 235, 0.6)" }}>Sur les premiers 10 000 € à 30%</span>
                <span className="font-mono font-semibold">3 000 €</span>
              </div>
              <div className="flex justify-between py-1" style={{ borderBottom: "1px solid rgba(245, 240, 235, 0.05)" }}>
                <span style={{ color: "rgba(245, 240, 235, 0.6)" }}>Sur les 10 000 € suivants à 25%</span>
                <span className="font-mono font-semibold">2 500 €</span>
              </div>
              <div className="flex justify-between py-1" style={{ borderBottom: "1px solid rgba(245, 240, 235, 0.05)" }}>
                <span style={{ color: "rgba(245, 240, 235, 0.6)" }}>Sur les 5 000 € restants à 20%</span>
                <span className="font-mono font-semibold">1 000 €</span>
              </div>
              <div className="flex justify-between py-2 mt-2" style={{ borderTop: "1px solid #C75B39" }}>
                <span className="font-semibold">Total commission Halo</span>
                <span className="font-mono font-bold text-lg" style={{ color: "#C75B39" }}>6 500 €</span>
              </div>
              <div className="flex justify-between py-1">
                <span style={{ color: "rgba(245, 240, 235, 0.6)" }}>Taux effectif</span>
                <span className="font-mono" style={{ color: "#7A9A65" }}>26%</span>
              </div>
              <div className="flex justify-between py-1">
                <span style={{ color: "rgba(245, 240, 235, 0.6)" }}>Ce qui vous reste</span>
                <span className="font-mono font-semibold">18 500 €</span>
              </div>
            </div>
          </div>

          {/* Comparaison agence */}
          <div
            className="p-6 md:p-8"
            style={{
              border: "1px solid rgba(245, 240, 235, 0.06)",
              background: "rgba(245, 240, 235, 0.02)",
            }}
          >
            <h3 className="font-display text-lg font-bold mb-3">
              Comparaison avec une agence traditionnelle à 50%
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div>
                <p className="text-xs uppercase tracking-[0.08em] mb-2" style={{ color: "rgba(245, 240, 235, 0.3)" }}>
                  Agence classique (50% fixe)
                </p>
                <p className="font-mono text-xl font-bold" style={{ color: "#C44536" }}>12 500 €</p>
                <p className="text-xs mt-1" style={{ color: "rgba(245, 240, 235, 0.3)" }}>
                  Commission prélevée
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.08em] mb-2" style={{ color: "rgba(245, 240, 235, 0.3)" }}>
                  Halo (barème marginal)
                </p>
                <p className="font-mono text-xl font-bold" style={{ color: "#7A9A65" }}>6 500 €</p>
                <p className="text-xs mt-1" style={{ color: "rgba(245, 240, 235, 0.3)" }}>
                  Commission prélevée
                </p>
              </div>
            </div>
            <p
              className="text-sm mt-6 font-semibold"
              style={{ color: "#C75B39" }}
            >
              Vous gardez 6 000 € de plus chaque mois avec Halo.
            </p>
          </div>
        </div>
      </section>

      {/* Ce qui est inclus */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-4xl px-6 md:px-12">
          <h2 className="font-display text-2xl font-bold uppercase tracking-[-0.01em] mb-6">
            Ce que nos commissions incluent
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Management de carrière personnalisé",
              "Accès à la suite SaaS (Studio + Atlas)",
              "Agents IA de création de contenu",
              "Négociation de partenariats et brand deals",
              "Protection juridique (Bouclier Légal)",
              "Stratégie de marque et personal branding",
              "Formation continue et workshops",
              "Support prioritaire 7j/7",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 py-2">
                <Check size={14} className="shrink-0 mt-0.5" style={{ color: "#7A9A65" }} />
                <span className="text-sm" style={{ color: "rgba(245, 240, 235, 0.65)" }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-24 md:py-32"
        style={{ background: "rgba(245, 240, 235, 0.02)" }}
      >
        <div className="mx-auto w-full max-w-4xl px-6 md:px-12 text-center">
          <h2 className="font-display text-[1.8rem] md:text-[2.4rem] font-bold uppercase tracking-[-0.01em] mb-4">
            Prêt à maximiser vos revenus ?
          </h2>
          <p
            className="text-base mb-10 max-w-xl mx-auto"
            style={{ color: "rgba(245, 240, 235, 0.55)" }}
          >
            Une commission juste, indexée sur votre succès. Pas de frais cachés.
          </p>
          <Link
            href="/apply"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 text-[0.8rem] font-semibold uppercase tracking-[0.08em] transition-all hover:opacity-90"
            style={{ background: "#C75B39", color: "#F5F0EB" }}
          >
            Postuler
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
