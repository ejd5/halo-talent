import Link from "next/link";
import { ArrowRight, Check, Clock, FileText, Eye, Download } from "lucide-react";

const principes = [
  {
    icon: Clock,
    titre: "Préavis de 30 jours",
    description:
      "Vous pouvez résilier le contrat à tout moment avec un préavis de 30 jours calendaires. Pas de période d&apos;engagement minimum, pas de pénalités de sortie, pas de clause d&apos;exclusivité abusive. Vous êtes libre.",
  },
  {
    icon: FileText,
    titre: "Aucune cession de propriété intellectuelle",
    description:
      "Vous restez l&apos;unique propriétaire de votre contenu, de votre image et de vos données. Halo ne revendique aucun droit de propriété sur vos créations. Nous sommes un prestataire de services, pas un éditeur.",
  },
  {
    icon: Eye,
    titre: "Commissions transparentes",
    description:
      "Notre barème de commission est public, progressif et marginal. Chaque mois, vous recevez un décompte détaillé indiquant exactement quels revenus ont généré quelle commission. Aucun frais caché, aucune retenue opaque.",
  },
  {
    icon: Download,
    titre: "Export de données garanti",
    description:
      "À tout moment, vous pouvez exporter l&apos;intégralité de vos données : historique de revenus, liste de fans, analytics, contenus. Format CSV et JSON. Vos données vous appartiennent et voyagent avec vous.",
  },
];

export default function ContratTypePage() {
  return (
    <div style={{ background: "#1A1614", color: "#F5F0EB" }}>
      {/* Hero */}
      <section className="py-28 md:py-36">
        <div className="mx-auto w-full max-w-5xl px-6 md:px-12 text-center">
          <p
            className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] mb-6"
            style={{ color: "var(--or, #D8A95B)" }}
          >
            Engagement
          </p>
          <h1 className="font-display text-[2.8rem] md:text-[5rem] font-bold uppercase tracking-[-0.02em] leading-[1.05]">
            Contrat Type
          </h1>
          <p
            className="text-lg mt-6 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "rgba(245, 240, 235, 0.55)" }}
          >
            Un contrat conçu pour protéger le créateur, pas pour l&apos;enfermer.
            Voici les principes fondamentaux qui guident notre relation avec
            chaque talent.
          </p>
        </div>
      </section>

      {/* Statut */}
      <section className="pb-16">
        <div className="mx-auto w-full max-w-4xl px-6 md:px-12">
          <div
            className="p-6 md:p-8 mb-12"
            style={{
              border: "1px solid rgba(199, 91, 57, 0.2)",
              background: "rgba(199, 91, 57, 0.04)",
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(199, 91, 57, 0.15)",
                  color: "var(--or, #D8A95B)",
                }}
              >
                <FileText size={18} />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold mb-2" style={{ color: "var(--or, #D8A95B)" }}>
                  Document en cours de finalisation
                </h2>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(245, 240, 235, 0.55)" }}
                >
                  Notre contrat type est actuellement en révision par notre
                  cabinet juridique partenaire pour intégrer les dernières
                  évolutions réglementaires de 2026. La version définitive sera
                  publiée ici prochainement. En attendant, les principes
                  ci-dessous reflètent fidèlement les engagements que nous
                  prenons avec chaque talent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principes */}
      <section className="pb-20">
        <div className="mx-auto w-full max-w-4xl px-6 md:px-12">
          <h2 className="font-display text-2xl font-bold uppercase tracking-[-0.01em] mb-8">
            Nos engagements contractuels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {principes.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.titre}
                  className="p-6"
                  style={{
                    border: "1px solid rgba(245, 240, 235, 0.06)",
                    background: "rgba(245, 240, 235, 0.02)",
                  }}
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center mb-4"
                    style={{
                      background: "rgba(199, 91, 57, 0.1)",
                      color: "var(--or, #D8A95B)",
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <h3 className="font-display text-base font-bold mb-2 flex items-center gap-2">
                    <Check size={14} style={{ color: "#7A9A65" }} />
                    {p.titre}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(245, 240, 235, 0.5)" }}
                  >
                    {p.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparaison */}
      <section className="py-16" style={{ background: "rgba(245, 240, 235, 0.02)" }}>
        <div className="mx-auto w-full max-w-4xl px-6 md:px-12">
          <h2 className="font-display text-2xl font-bold uppercase tracking-[-0.01em] mb-8">
            Pourquoi notre contrat est différent
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ borderBottom: "2px solid var(--or, #D8A95B)" }}>
                  <th className="py-3 px-4 text-xs uppercase tracking-[0.08em] font-semibold" style={{ color: "rgba(245, 240, 235, 0.4)" }}>Critère</th>
                  <th className="py-3 px-4 text-xs uppercase tracking-[0.08em] font-semibold" style={{ color: "rgba(245, 240, 235, 0.4)" }}>Agence classique</th>
                  <th className="py-3 px-4 text-xs uppercase tracking-[0.08em] font-semibold" style={{ color: "var(--or, #D8A95B)" }}>Halo</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Préavis de sortie", "3 à 12 mois", "30 jours"],
                  ["Propriété du contenu", "Souvent cédée", "100% au créateur"],
                  ["Commissions", "Opaques ou forfaitaires", "Publiques et marginales"],
                  ["Export des données", "Refusé ou payant", "Gratuit, CSV + JSON"],
                  ["Clause d&apos;exclusivité", "Standard, abusive", "Limitée, transparente"],
                ].map(([critere, classique, halo], i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom: "1px solid rgba(245, 240, 235, 0.06)",
                      background: i % 2 === 0 ? "transparent" : "rgba(245, 240, 235, 0.02)",
                    }}
                  >
                    <td className="py-3 px-4 text-sm" style={{ color: "rgba(245, 240, 235, 0.7)" }}>{critere}</td>
                    <td className="py-3 px-4 text-xs" style={{ color: "rgba(245, 240, 235, 0.4)" }}>{classique}</td>
                    <td className="py-3 px-4 text-xs font-semibold" style={{ color: "#7A9A65" }}>{halo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="mx-auto w-full max-w-4xl px-6 md:px-12 text-center">
          <h2 className="font-display text-[1.8rem] md:text-[2.4rem] font-bold uppercase tracking-[-0.01em] mb-4">
            Prêt à rejoindre une agence qui vous respecte ?
          </h2>
          <p
            className="text-base mb-10 max-w-xl mx-auto"
            style={{ color: "rgba(245, 240, 235, 0.55)" }}
          >
            Postulez dès maintenant. Nous vous enverrons le contrat type
            complet avant toute signature.
          </p>
          <Link
            href="/apply"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 text-[0.8rem] font-semibold uppercase tracking-[0.08em] transition-all hover:opacity-90"
            style={{ background: "var(--or, #D8A95B)", color: "#F5F0EB" }}
          >
            Postuler
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
