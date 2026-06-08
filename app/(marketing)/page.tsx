import Link from "next/link";

const departments = [
  {
    name: "Music & Performing Arts",
    description: "Musiciens, chanteurs, performers",
  },
  {
    name: "Sport & Lifestyle",
    description: "Athlètes, coachs, lifestyle",
  },
  {
    name: "Business & Thought Leadership",
    description: "Entrepreneurs, speakers",
  },
  {
    name: "Digital Creators",
    description: "Influenceurs, créateurs de contenu",
  },
  {
    name: "Talent Premium",
    description: "Créateurs adultes haut de gamme",
  },
];

const commissionTiers = [
  { tier: "Découverte", range: "0 - 5 000€", commission: "30%", keeps: "70%" },
  { tier: "Croissance", range: "5 000 - 20 000€", commission: "25%", keeps: "75%" },
  { tier: "Scale", range: "20 000 - 50 000€", commission: "20%", keeps: "80%" },
  { tier: "Elite", range: "50 000 - 150 000€", commission: "15%", keeps: "85%" },
  { tier: "Icon", range: "150 000€+", commission: "10%", keeps: "90%" },
];

export default function HomePage() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center bg-brand-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.08)_0%,_transparent_70%)]" />
        <div className="mx-auto w-full max-w-7xl px-6 md:px-12 py-32">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-gold mb-6">
              Maison de management créatif
            </p>
            <h1 className="font-display text-6xl md:text-8xl italic leading-[1.1] text-brand-ivory">
              Vous créez.
              <br />
              Nous protégeons.
              <br />
              <span className="text-brand-gold">Vous gardez.</span>
            </h1>
            <p className="mt-8 text-lg text-brand-taupe leading-relaxed max-w-xl">
              Une maison qui rééquilibre le rapport entre créateurs et management.
              Transparence radicale, commissions dégressives, souveraineté garantie.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/manifeste"
                className="inline-flex items-center justify-center px-8 py-3 border border-brand-gold text-brand-gold text-sm uppercase tracking-[0.15em] hover:bg-brand-gold hover:text-brand-black transition-all"
              >
                Découvrir notre approche
              </Link>
              <Link
                href="/apply"
                className="inline-flex items-center justify-center px-8 py-3 bg-brand-gold text-brand-black text-sm uppercase tracking-[0.15em] hover:bg-brand-gold-light transition-all"
              >
                Postuler à la maison
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MANIFESTE COURT ─── */}
      <section className="py-30 md:py-40 bg-brand-espresso">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
          <blockquote className="font-display text-2xl md:text-4xl italic text-center leading-relaxed max-w-4xl mx-auto opacity-90">
            &ldquo;Le marché du management créatif est cassé. 50% de commission.
            Contrats opaques. Créateurs qui perdent le contrôle de leur propre
            travail. Nous avons construit l&apos;opposé.&rdquo;
          </blockquote>
          <div className="mt-20 grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Transparence",
                desc: "Commission publique, contrat téléchargeable",
              },
              {
                title: "Souveraineté",
                desc: "Le créateur garde le contrôle total",
              },
              {
                title: "Dégressivité",
                desc: "Plus vous grandissez, moins vous payez",
              },
            ].map((pillar) => (
              <div key={pillar.title} className="text-center">
                <h3 className="font-display text-xl md:text-2xl text-brand-gold mb-3">
                  {pillar.title}
                </h3>
                <p className="text-brand-taupe">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DÉPARTEMENTS ─── */}
      <section className="py-30 md:py-40 bg-brand-black">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
          <h2 className="font-display text-3xl md:text-5xl text-brand-ivory mb-16">
            Cinq départements.
            <br />
            <span className="italic">Une seule maison.</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {departments.map((dept, i) => (
              <div
                key={dept.name}
                className="group relative aspect-[4/3] bg-brand-espresso border border-white/5 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-xs text-brand-gold uppercase tracking-[0.15em]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-xl md:text-2xl text-brand-ivory mt-2 group-hover:text-brand-gold transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-sm text-brand-taupe mt-1">
                    {dept.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMMISSIONS ─── */}
      <section className="py-30 md:py-40 bg-brand-ivory text-brand-black">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
          <h2 className="font-display text-3xl md:text-5xl text-brand-black mb-4">
            Notre structure de commissions.
          </h2>
          <p className="text-lg text-brand-taupe mb-12">
            Publique. Sans astérisque.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-sm">
              <thead>
                <tr className="border-b border-brand-black/10">
                  <th className="pb-4 font-medium text-brand-taupe uppercase tracking-[0.1em] text-xs">
                    Palier
                  </th>
                  <th className="pb-4 font-medium text-brand-taupe uppercase tracking-[0.1em] text-xs">
                    Revenus mensuels
                  </th>
                  <th className="pb-4 font-medium text-brand-taupe uppercase tracking-[0.1em] text-xs">
                    Commission
                  </th>
                  <th className="pb-4 font-medium text-brand-taupe uppercase tracking-[0.1em] text-xs">
                    Vous gardez
                  </th>
                </tr>
              </thead>
              <tbody>
                {commissionTiers.map((tier) => (
                  <tr
                    key={tier.tier}
                    className="border-b border-brand-black/5 hover:bg-brand-black/5 transition-colors"
                  >
                    <td className="py-4 font-semibold">{tier.tier}</td>
                    <td className="py-4 text-brand-taupe">{tier.range}</td>
                    <td className="py-4">{tier.commission}</td>
                    <td className="py-4 text-brand-success">{tier.keeps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-8 text-sm text-brand-taupe">
            À titre comparatif, la commission moyenne du secteur est de 40-50%,
            sans dégressivité.
          </p>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="py-30 md:py-40 bg-brand-black relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.12)_0%,_transparent_60%)]" />
        <div className="mx-auto w-full max-w-7xl px-6 md:px-12 text-center relative z-10">
          <h2 className="font-display text-4xl md:text-7xl italic text-brand-ivory mb-6">
            Postulez à la maison.
          </h2>
          <p className="text-brand-taupe max-w-xl mx-auto mb-10">
            Nous étudions chaque candidature avec attention. Nous travaillons avec
            un nombre limité de créateurs pour garantir la qualité de
            l&apos;accompagnement.
          </p>
          <Link
            href="/apply"
            className="inline-flex items-center justify-center px-10 py-4 bg-brand-gold text-brand-black text-sm uppercase tracking-[0.15em] hover:bg-brand-gold-light transition-all"
          >
            Commencer ma candidature
          </Link>
          <p className="mt-4 text-xs text-brand-taupe">
            Sélection rigoureuse. Nous acceptons environ 1 candidature sur 10.
          </p>
        </div>
      </section>
    </>
  );
}
