import Link from "next/link";
import { ArrowRight, Eye, Shield, TrendingUp, Lock } from "lucide-react";

const valeurs = [
  {
    icon: Eye,
    titre: "Transparence",
    description:
      "Nous croyons que la confiance se construit dans la lumière. Chaque commission, chaque processus, chaque décision est documentée et accessible à nos talents. Nous publions nos tarifs, nos méthodes et nos résultats sans filtre — parce que vous avez le droit de savoir exactement comment votre carrière est gérée.",
  },
  {
    icon: Shield,
    titre: "Souveraineté",
    description:
      "Vous restez propriétaire de votre contenu, de votre image et de vos données. Notre rôle est de vous donner les outils et l'accompagnement pour maximiser votre indépendance, pas de vous enfermer dans un écosystème propriétaire. Vous pouvez partir à tout moment, avec vos données, en 30 jours.",
  },
  {
    icon: TrendingUp,
    titre: "Élévation",
    description:
      "Nous existons pour élever nos talents au-dessus du bruit. Notre approche combine technologie de pointe et accompagnement humain pour transformer chaque créateur en entrepreneur de sa propre marque. Nous ne prenons que des commissions indexées sur votre succès — nous gagnons quand vous gagnez.",
  },
  {
    icon: Lock,
    titre: "Discrétion",
    description:
      "La vie privée de nos talents est sacrée. Nous appliquons les standards de confidentialité les plus exigeants, de la sécurisation des données à la protection de l'identité numérique. Ce qui se passe chez Halo reste chez Halo — c'est une condition non négociable de notre partenariat.",
  },
];

export default function ManifestePage() {
  return (
    <div style={{ background: "#1A1614", color: "#F5F0EB" }}>
      {/* Hero */}
      <section className="py-28 md:py-36">
        <div className="mx-auto w-full max-w-5xl px-6 md:px-12 text-center">
          <p
            className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] mb-6"
            style={{ color: "var(--or, #D8A95B)" }}
          >
            Nos convictions
          </p>
          <h1 className="font-display text-[2.8rem] md:text-[5rem] font-bold uppercase tracking-[-0.02em] leading-[1.05]">
            Notre Manifeste
          </h1>
          <p
            className="text-lg mt-6 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "rgba(245, 240, 235, 0.55)" }}
          >
            Halo est né d&apos;une conviction simple : les créateurs méritent
            mieux. Mieux qu&apos;une agence qui prend 50%. Mieux que des outils
            qui les enferment. Mieux que des contrats qu&apos;ils ne comprennent
            pas. Voici ce en quoi nous croyons.
          </p>
        </div>
      </section>

      {/* Valeurs */}
      <section className="pb-28 md:pb-36">
        <div className="mx-auto w-full max-w-5xl px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {valeurs.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.titre}
                  className="p-8"
                  style={{
                    border: "1px solid rgba(245, 240, 235, 0.06)",
                    background: "rgba(245, 240, 235, 0.02)",
                  }}
                >
                  <div
                    className="w-12 h-12 flex items-center justify-center mb-5"
                    style={{
                      background: "rgba(199, 91, 57, 0.1)",
                      color: "var(--or, #D8A95B)",
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <h2 className="font-display text-xl font-bold uppercase tracking-[-0.01em] mb-3">
                    {v.titre}
                  </h2>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(245, 240, 235, 0.55)" }}
                  >
                    {v.description}
                  </p>
                </div>
              );
            })}
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
            Ces valeurs vous parlent ?
          </h2>
          <p
            className="text-base mb-10 max-w-xl mx-auto"
            style={{ color: "rgba(245, 240, 235, 0.55)" }}
          >
            Rejoignez une agence qui met ses principes en pratique.
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
