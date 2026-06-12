import Link from "next/link";
import { ArrowRight, Wand2, BarChart3, Users, ShieldCheck } from "lucide-react";

const produits = [
  {
    nom: "Studio",
    description:
      "L&apos;outil de création de contenu augmenté par IA. Générez des visuels, des vidéos, des légendes et des stratégies éditoriales optimisées pour chaque plateforme — Instagram, TikTok, YouTube, OnlyFans et plus encore.",
    fonctionnalites: [
      "Compositeur de contenu assisté par IA",
      "Génération vidéo et image",
      "Planification éditoriale multi-plateforme",
      "Analyse de tendances en temps réel",
      "Bibliothèque de templates personnalisables",
    ],
    lien: "/studio",
    couleur: "var(--or, #D8A95B)",
  },
  {
    nom: "Atlas",
    description:
      "Le CRM et la suite marketing conçus pour les créateurs. Centralisez votre audience, automatisez vos campagnes email et SMS, et mesurez votre ROI en temps réel — sans complexité enterprise.",
    fonctionnalites: [
      "CRM avec scoring et segmentation",
      "Campagnes email, SMS et push automatisées",
      "Messagerie unifiée multi-plateforme",
      "Funnels de conversion prêts à l&apos;emploi",
      "Analytics et rapports exportables",
    ],
    lien: "/atlas",
    couleur: "#7A9A65",
  },
];

const atouts = [
  {
    icon: Wand2,
    titre: "IA intégrée",
    description:
      "Des agents IA spécialisés dans la création de contenu, l&apos;analyse de tendances et l&apos;optimisation éditoriale. Pas besoin d&apos;être expert en prompting.",
  },
  {
    icon: BarChart3,
    titre: "Données actionnables",
    description:
      "Chaque action est mesurée, chaque conversion est tracée. Vous savez exactement quel contenu génère quel revenu, sur quelle plateforme.",
  },
  {
    icon: Users,
    titre: "Multi-comptes",
    description:
      "Gérez plusieurs profils, plusieurs plateformes et plusieurs marques depuis un seul tableau de bord. Sans risque de ban.",
  },
  {
    icon: ShieldCheck,
    titre: "Conformité intégrée",
    description:
      "Nos outils respectent les CGU de chaque plateforme. Zéro automation risquée, zéro shadowban : nous utilisons exclusivement les APIs officielles.",
  },
];

export default function SaasPage() {
  return (
    <div style={{ background: "#1A1614", color: "#F5F0EB" }}>
      {/* Hero */}
      <section className="py-28 md:py-36">
        <div className="mx-auto w-full max-w-5xl px-6 md:px-12 text-center">
          <p
            className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] mb-6"
            style={{ color: "var(--or, #D8A95B)" }}
          >
            Technologie
          </p>
          <h1 className="font-display text-[2.8rem] md:text-[5rem] font-bold uppercase tracking-[-0.02em] leading-[1.05]">
            Suite SaaS
          </h1>
          <p
            className="text-lg mt-6 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "rgba(245, 240, 235, 0.55)" }}
          >
            Studio et Atlas forment une suite intégrée qui couvre toute la
            chaîne de valeur du créateur : de la production de contenu à la
            monétisation, en passant par la relation fans et l&apos;analyse de
            performance.
          </p>
        </div>
      </section>

      {/* Produits */}
      <section className="pb-20">
        <div className="mx-auto w-full max-w-5xl px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {produits.map((p) => (
              <div
                key={p.nom}
                className="p-8 flex flex-col"
                style={{
                  border: "1px solid rgba(245, 240, 235, 0.06)",
                  background: "rgba(245, 240, 235, 0.02)",
                }}
              >
                <div
                  className="w-10 h-1 mb-6"
                  style={{ background: p.couleur }}
                />
                <h2 className="font-display text-2xl font-bold uppercase tracking-[-0.01em] mb-3">
                  {p.nom}
                </h2>
                <p
                  className="text-sm leading-relaxed mb-6 flex-1"
                  style={{ color: "rgba(245, 240, 235, 0.55)" }}
                >
                  {p.description}
                </p>
                <ul className="space-y-2 mb-8">
                  {p.fonctionnalites.map((f) => (
                    <li
                      key={f}
                      className="text-xs flex items-start gap-2"
                      style={{ color: "rgba(245, 240, 235, 0.5)" }}
                    >
                      <span style={{ color: p.couleur }}>&#x2022;</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.lien}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] transition-all hover:opacity-70"
                  style={{ color: p.couleur }}
                >
                  Découvrir {p.nom}
                  <ArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Atouts */}
      <section className="py-20" style={{ background: "rgba(245, 240, 235, 0.02)" }}>
        <div className="mx-auto w-full max-w-5xl px-6 md:px-12">
          <h2 className="font-display text-2xl font-bold text-center uppercase tracking-[-0.01em] mb-12">
            Une suite pensée pour les créateurs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {atouts.map((a) => {
              const Icon = a.icon;
              return (
                <div key={a.titre} className="text-center">
                  <div
                    className="w-12 h-12 flex items-center justify-center mx-auto mb-4"
                    style={{
                      background: "rgba(199, 91, 57, 0.1)",
                      color: "var(--or, #D8A95B)",
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 className="font-display text-sm font-bold uppercase tracking-[0.02em] mb-2">
                    {a.titre}
                  </h3>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "rgba(245, 240, 235, 0.45)" }}
                  >
                    {a.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-20">
        <div className="mx-auto w-full max-w-3xl px-6 md:px-12 text-center">
          <h2 className="font-display text-2xl font-bold uppercase tracking-[-0.01em] mb-4">
            Des offres gratuites disponibles
          </h2>
          <p
            className="text-sm leading-relaxed mb-8"
            style={{ color: "rgba(245, 240, 235, 0.55)" }}
          >
            Studio et Atlas proposent chacun un tier Free avec des crédits IA
            mensuels. Parfait pour tester la suite avant de passer aux plans
            payants qui débloquent plus de crédits, le multi-publish et les
            fonctionnalités avancées.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/studio"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.08em] transition-all hover:opacity-90"
              style={{ background: "var(--or, #D8A95B)", color: "#F5F0EB" }}
            >
              Essayer Studio
              <ArrowRight size={12} />
            </Link>
            <Link
              href="/atlas"
              className="inline-flex items-center justify-center px-8 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.08em] transition-all hover:opacity-80"
              style={{
                border: "2px solid rgba(245, 240, 235, 0.15)",
                color: "#F5F0EB",
              }}
            >
              Découvrir Atlas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
