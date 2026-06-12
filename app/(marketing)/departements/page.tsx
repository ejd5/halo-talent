import Link from "next/link";
import { ArrowRight, Music, Trophy, Mic, Camera, Star } from "lucide-react";

const departements = [
  {
    slug: "music",
    nom: "Music & Performing Arts",
    description:
      "Musiciens, chanteurs et performers. Nous construisons des carrières durables dans l&apos;industrie musicale et du spectacle vivant, du management artistique à la production et la diffusion.",
    icon: Music,
  },
  {
    slug: "sport",
    nom: "Sport & Lifestyle",
    description:
      "Athlètes, coachs et influenceurs lifestyle. Du terrain aux plateformes, nous développons votre marque personnelle et diversifions vos revenus.",
    icon: Trophy,
  },
  {
    slug: "business",
    nom: "Business & Thought Leadership",
    description:
      "Entrepreneurs, conférenciers et experts. Nous amplifions votre influence et structurons votre leadership d&apos;opinion à travers une stratégie de contenus sur mesure.",
    icon: Mic,
  },
  {
    slug: "digital-creators",
    nom: "Digital Creators",
    description:
      "Influenceurs, vidéastes et podcasteurs. Nous transformons votre audience en actif économique tout en préservant votre authenticité créative.",
    icon: Camera,
  },
  {
    slug: "talent-premium",
    nom: "Talent Premium",
    description:
      "Créateurs adultes haut de gamme. Nous représentons les créateurs premium avec le professionnalisme et la confidentialité que mérite leur activité.",
    icon: Star,
  },
];

export default function DepartementsPage() {
  return (
    <div style={{ background: "#1A1614", color: "#F5F0EB" }}>
      {/* Hero */}
      <section className="py-28 md:py-36">
        <div className="mx-auto w-full max-w-5xl px-6 md:px-12 text-center">
          <p
            className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] mb-6"
            style={{ color: "var(--or, #D8A95B)" }}
          >
            Notre expertise
          </p>
          <h1 className="font-display text-[2.8rem] md:text-[5rem] font-bold uppercase tracking-[-0.02em] leading-[1.05]">
            Départements
          </h1>
          <p
            className="text-lg mt-6 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "rgba(245, 240, 235, 0.55)" }}
          >
            Cinq départements spécialisés pour couvrir l&apos;ensemble des
            besoins des créateurs. Chaque département est dirigé par une équipe
            experte de son secteur.
          </p>
        </div>
      </section>

      {/* Liste des départements */}
      <section className="pb-28 md:pb-36">
        <div className="mx-auto w-full max-w-5xl px-6 md:px-12">
          <div className="space-y-4">
            {departements.map((dept) => {
              const Icon = dept.icon;
              return (
                <Link
                  key={dept.slug}
                  href={`/departements/${dept.slug}`}
                  className="block p-6 transition-all hover:border-[var(--or, #D8A95B)]/30 group"
                  style={{
                    border: "1px solid rgba(245, 240, 235, 0.06)",
                    background: "rgba(245, 240, 235, 0.02)",
                  }}
                >
                  <div className="flex items-start gap-5">
                    <div
                      className="w-12 h-12 flex items-center justify-center shrink-0 transition-colors group-hover:bg-[rgba(199,91,57,0.12)]"
                      style={{
                        background: "rgba(199, 91, 57, 0.06)",
                        color: "var(--or, #D8A95B)",
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <h2 className="font-display text-lg font-bold uppercase tracking-[-0.01em]">
                          {dept.nom}
                        </h2>
                        <ArrowRight
                          size={16}
                          className="shrink-0 transition-transform group-hover:translate-x-1"
                          style={{ color: "var(--or, #D8A95B)" }}
                        />
                      </div>
                      <p
                        className="text-sm mt-2 leading-relaxed"
                        style={{ color: "rgba(245, 240, 235, 0.5)" }}
                      >
                        {dept.description}
                      </p>
                    </div>
                  </div>
                </Link>
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
            Vous ne savez pas quel département vous correspond ?
          </h2>
          <p
            className="text-base mb-10 max-w-xl mx-auto"
            style={{ color: "rgba(245, 240, 235, 0.55)" }}
          >
            Postulez et notre équipe vous orientera vers le département le plus
            adapté à votre profil et vos objectifs.
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
