import Link from "next/link";
import { notFound } from "next/navigation";

const departments = [
  {
    slug: "music",
    name: "Music & Performing Arts",
    description: "Musiciens, chanteurs, performers",
    hero: "Nous représentons les artistes qui façonnent la culture. Musicien·ne·s, chanteur·euse·s, performeur·euse·s — nous construisons des carrières durables dans l&apos;industrie musicale et du spectacle vivant.",
    image: "1511671782779-c97d3d27a1d4",
    services: [
      "Management artistique global",
      "Stratégie de carrière & branding",
      "Production & diffusion",
      "Sync & édition musicale",
      "Tour management",
    ],
  },
  {
    slug: "sport",
    name: "Sport & Lifestyle",
    description: "Athlètes, coachs, lifestyle",
    hero: "Du terrain aux plateformes. Nous accompagnons les athlètes, coachs et influenceurs lifestyle dans le développement de leur marque personnelle et la diversification de leurs revenus.",
    image: "1461896836934-bd45ba8fcf0b",
    services: [
      "Personal branding",
      "Partenariats & sponsoring",
      "Création de contenu",
      "Coaching & programmes",
      "Gestion d&apos;image",
    ],
  },
  {
    slug: "business",
    name: "Business & Thought Leadership",
    description: "Entrepreneurs, speakers",
    hero: "Nous travaillons avec les voix qui comptent. Entrepreneurs, conférencier·ère·s, expert·e·s — nous amplifions votre influence et structurons votre leadership d&apos;opinion.",
    image: "1540575467063-178a50c2df87",
    services: [
      "Stratégie de contenus",
      "Prise de parole publique",
      "Édition & publications",
      "Community building",
      "Monétisation d&apos;audience",
    ],
  },
  {
    slug: "digital-creators",
    name: "Digital Creators",
    description: "Influenceurs, créateurs de contenu",
    hero: "La nouvelle garde de la création. Influenceur·euse·s, vidéastes, podcasteur·euse·s — nous transformons votre audience en actif économique tout en préservant votre authenticité.",
    image: "1519389950473-47ba0277781c",
    services: [
      "Stratégie de plateforme",
      "Monétisation multicanal",
      "Production & post-production",
      "Brand deals & négociation",
      "Protection juridique",
    ],
  },
  {
    slug: "talent-premium",
    name: "Talent Premium",
    description: "Créateurs adultes haut de gamme",
    hero: "L&apos;excellence dans la discrétion. Nous représentons les créateur·rice·s adultes premium avec le professionnalisme et la confidentialité que mérite leur activité.",
    image: "1534528741775-53994a69daeb",
    services: [
      "Stratégie de marque haut de gamme",
      "Production éditoriale",
      "Sécurité & confidentialité",
      "Monétisation exclusive",
      "Accompagnement juridique spécialisé",
    ],
  },
];

export function generateStaticParams() {
  return departments.map((dept) => ({ slug: dept.slug }));
}

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dept = departments.find((d) => d.slug === slug);
  if (!dept) notFound();

  return (
    <div className="bg-base">
      {/* Hero image */}
      <section className="relative h-[50vh] min-h-[400px] bg-surface overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-${dept.image}?w=1400&q=80&auto=format&fit=crop)`,
            filter: "brightness(0.85) saturate(0.7)",
          }}
        />
        <div className="absolute inset-0 bg-amber-900/15 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-base via-base/20 to-transparent" />
      </section>

      {/* Content */}
      <section className="py-20 md:py-28">
        <div className="mx-auto w-full max-w-4xl px-6 md:px-12">
          <Link
            href="/#departements"
            className="text-xs uppercase tracking-[0.12em] text-accent font-sans font-semibold hover:text-accent-hover transition-colors mb-8 inline-block"
          >
            ← Retour
          </Link>
          <h1 className="font-display text-[36px] md:text-[48px] font-bold text-ink tracking-tight mt-4 mb-6">
            {dept.name}
          </h1>
          <p className="text-lg text-ink-muted leading-relaxed max-w-3xl">
            {dept.hero}
          </p>

          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold text-ink mb-6">
              Nos services
            </h2>
            <ul className="grid md:grid-cols-2 gap-4">
              {dept.services.map((service) => (
                <li
                  key={service}
                  className="flex items-center gap-3 text-ink-muted"
                >
                  <span className="w-1.5 h-1.5 bg-accent shrink-0" />
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-16 pt-12 border-t border-ink/10">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center px-8 py-3 bg-accent text-white text-[13px] font-sans font-semibold uppercase tracking-[0.08em] hover:bg-accent-hover"
            >
              Postuler à ce département
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
