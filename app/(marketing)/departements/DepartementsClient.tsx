"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown, Music, Star, TrendingUp, Video, Dumbbell, Sparkles, X } from "lucide-react";
import { CoutureEmblem } from "@/components/home/CoutureEmblem";

function useReveal(amount = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  return { ref, inView };
}

const riseItem = {
  hidden: { opacity: 0, y: 32 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const, delay: d } }),
};
const fadeItem = {
  hidden: { opacity: 0, y: 16 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const, delay: d } }),
};

const DEPARTEMENTS = [
  {
    slug: "glamour-premium",
    nom: "Glamour Premium",
    icon: Star,
    baseline: "L'image haut de gamme, de la stratégie à la production.",
    profils: "Mannequins, créateurs mode et beauté, photographes, directeurs artistiques, marques personnelles positionnées luxe.",
    problemes: [
      "Difficulté à maintenir une image cohérente sur plusieurs plateformes",
      "Manque de temps pour produire du contenu à la hauteur de l'image de marque",
      "Gestion des partenariats luxe sans trahir son identité",
      "Protection de l'image contre les utilisations non autorisées",
    ],
    reponse: "Un accompagnement qui comprend les codes du luxe : direction artistique, production photo et vidéo premium, gestion des relations marques, et protection juridique de l'image.",
    outils: ["Studio IA générative", "Chat AI personnalisé", "WTF Lex", "Atlas CRM", "Plateformes sociales"],
    parcours: "Une créatrice mode arrive avec 50K followers. En 6 mois : identité visuelle unifiée, partenariat avec deux marques luxe, revenus ×3, communauté à 200K.",
  },
  {
    slug: "influenceurs",
    nom: "Influenceurs",
    icon: TrendingUp,
    baseline: "Transformer l'audience en actif stratégique, sans perdre son authenticité.",
    profils: "Créateurs de contenu, influenceurs lifestyle, streamers, TikTokers, podcasteurs, youtubeurs.",
    problemes: [
      "Difficulté à monétiser sans trahir sa communauté",
      "Gestion du temps entre création et administration",
      "Négociation des partenariats et brand deals",
      "Dépendance aux algorithmes des plateformes",
    ],
    reponse: "Nous vous aidons à structurer votre activité comme une entreprise : stratégie de contenu, monétisation diversifiée, gestion des partenariats, protection juridique, et outils IA pour gagner du temps.",
    outils: ["Chat AI", "Studio IA", "Atlas CRM", "WTF Lex", "Sovereign Chat"],
    parcours: "Un streamer gaming avec 20K abonnés. En 6 mois : diversification YouTube + TikTok, monétisation ×4, première collaboration marque gaming, communauté Discord structurée.",
  },
  {
    slug: "youtube-podcast",
    nom: "YouTube / Podcast",
    icon: Video,
    baseline: "Produire mieux, publier plus intelligemment, monétiser durablement.",
    profils: "Youtubeurs, podcasteurs, producteurs de contenu long, documentaristes, chaînes éducatives.",
    problemes: [
      "Temps de production trop long pour une rentabilité suffisante",
      "Difficulté à percer dans un marché saturé",
      "Gestion du Content ID et des droits d'auteur",
      "Monétisation uniquement dépendante de la publicité",
    ],
    reponse: "Production assistée par IA, stratégie de référencement, diversification des revenus (sponsoring, abonnements, produits dérivés), et gestion des droits avec WTF Lex.",
    outils: ["Studio IA (texte, audio, vidéo)", "Atlas CRM", "WTF Lex", "Chat AI", "Sovereign Chat"],
    parcours: "Un podcasteur tech avec 5K écoutes par épisode. En 6 mois : chaîne YouTube lancée, 3 sponsors récurrents, équipe de production externalisée, revenus ×5.",
  },
  {
    slug: "musique",
    nom: "Musique",
    icon: Music,
    baseline: "L'industrie musicale réinventée par la technologie, sans perdre l'âme artistique.",
    profils: "Musiciens, producteurs, compositeurs, beatmakers, DJs, labels indépendants.",
    problemes: [
      "Difficulté à émerger sans label majeur",
      "Gestion des droits d'auteur et des royalties",
      "Production musicale coûteuse en temps et en argent",
      "Absence de stratégie marketing structurée",
    ],
    reponse: "Studio IA pour la production musicale, stratégie de distribution multi-plateforme, gestion des droits et royalties avec WTF Lex, marketing digital et community building.",
    outils: ["Studio IA (musique et audio)", "WTF Lex", "Atlas CRM", "Chat AI", "Plateformes streaming"],
    parcours: "Un beatmaker autodidacte avec 500 followers. En 6 mois : premier EP distribué sur 5 plateformes, 3 placements synchro, communauté 15K, signature avec un label partenaire.",
  },
  {
    slug: "sport-fitness",
    nom: "Sport / Fitness",
    icon: Dumbbell,
    baseline: "Athlètes et coaches : construire une marque qui survit aux blessures et aux saisons.",
    profils: "Athlètes, coaches sportifs, professeurs de yoga, nutritionnistes, créateurs fitness.",
    problemes: [
      "Carrière courte et imprévisible",
      "Difficulté à monétiser au-delà du sponsoring",
      "Gestion de la réputation et des réseaux sociaux",
      "Transition post-carrière non préparée",
    ],
    reponse: "Construction de marque personnelle, diversification des revenus (programmes, produits, consulting), gestion de communauté, et préparation de l'après-carrière avec Atlas.",
    outils: ["Atlas CRM", "Chat AI", "Studio IA", "WTF Lex", "Sovereign Chat"],
    parcours: "Un coach fitness avec 10K followers. En 6 mois : programme en ligne lancé, 200 clients payants, marque de compléments en développement, revenus ×3.",
  },
];

const TABLEAU_COMPARATIF = [
  { besoin: "Image de marque", glamour: "Essentiel", influenceurs: "Important", youtube: "Modéré", musique: "Essentiel", sport: "Important" },
  { besoin: "Production IA", glamour: "Élevé", influenceurs: "Élevé", youtube: "Élevé", musique: "Essentiel", sport: "Modéré" },
  { besoin: "Protection juridique", glamour: "Essentiel", influenceurs: "Élevé", youtube: "Élevé", musique: "Essentiel", sport: "Élevé" },
  { besoin: "Gestion fans/CRM", glamour: "Élevé", influenceurs: "Essentiel", youtube: "Élevé", musique: "Élevé", sport: "Essentiel" },
  { besoin: "Monétisation", glamour: "Important", influenceurs: "Essentiel", youtube: "Essentiel", musique: "Essentiel", sport: "Essentiel" },
  { besoin: "Chat AI fans", glamour: "Modéré", influenceurs: "Élevé", youtube: "Modéré", musique: "Modéré", sport: "Élevé" },
];

const CE_QUE_NOUS_REFUSONS = [
  { titre: "Contenu non authentique", description: "Nous ne produisons pas de contenu qui ne reflète pas qui vous êtes vraiment. Pas de faux avis, pas de faux témoignages, pas de mise en scène trompeuse." },
  { titre: "Croissance artificielle", description: "Nous n'achetons pas de followers, de vues ou d'engagement. Nous ne manipulons pas les algorithmes. La croissance que nous construisons est organique et durable." },
  { titre: "Contrats abusifs", description: "Nous refusons les partenariats qui exploitent les créateurs. Pas de clauses d'exclusivité abusive, pas de commissions opaques, pas de cession de droits perpétuelle." },
  { titre: "Dépendance toxique", description: "Notre objectif est de vous rendre autonome, pas dépendant. Nous refusons les modèles qui enferment le créateur dans une relation exclusive et asymétrique." },
  { titre: "Promesses impossibles", description: "Nous ne promettons pas la célébrité, des revenus garantis, ou un succès sans effort. Nous promettons des outils, une méthode, et un accompagnement professionnel." },
];

const FAQ = [
  { q: "Comment choisir le bon département pour moi ?", r: "Chaque créateur est unique. Lors de votre candidature, nous échangeons avec vous pour comprendre votre activité, vos objectifs et vos besoins. Nous vous orientons ensuite vers le département le plus pertinent. Il est possible de bénéficier de l'expertise de plusieurs départements." },
  { q: "Puis-je changer de département en cours d'accompagnement ?", r: "Oui, l'accompagnement WTF est flexible. Si votre activité évolue ou si un autre département correspond mieux à vos nouveaux objectifs, nous adaptons votre accompagnement." },
  { q: "Les départements travaillent-ils ensemble ?", r: "Absolument. Les cinq départements partagent leurs expertises. Un athlète peut bénéficier de la direction artistique Glamour, un musicien de la stratégie de monétisation Influenceurs. C'est la force de la maison WTF." },
  { q: "Quels sont les critères pour intégrer un département ?", r: "Nous évaluons votre motivation, la qualité de votre travail, et votre potentiel de développement. Il n'y a pas de seuil minimum de followers. Nous recherchons des créateurs qui veulent construire une image qui dure." },
  { q: "Y a-t-il un engagement minimum ?", r: "Notre contrat type prévoit un préavis de 30 jours, sans période d'engagement minimum. Nous voulons que vous restiez parce que l'accompagnement vous est utile, pas parce qu'un contrat vous y oblige." },
];

function FAQItem({ q, r }: { q: string; r: string }) {
  const [ouvert, setOuvert] = useState(false);
  return (
    <div style={{ border: "1px solid var(--ligne-faible)" }}>
      <button
        type="button"
        className="w-full flex items-center justify-between p-5 text-left"
        style={{ background: ouvert ? "rgba(216,169,91,0.04)" : "transparent", transition: "background 0.3s ease" }}
        onClick={() => setOuvert(!ouvert)}
      >
        <span className="text-[14px] font-medium pr-4" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{q}</span>
        <ChevronDown size={14} style={{ color: "var(--or)", transform: ouvert ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", flexShrink: 0 }} />
      </button>
      {ouvert && (
        <div className="px-5 pb-5">
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }}>{r}</p>
        </div>
      )}
    </div>
  );
}

function getGraviteColor(gravite: string): string {
  if (gravite === "Essentiel") return "#C44536";
  if (gravite === "Élevé") return "#D8A95B";
  if (gravite === "Important") return "#7A9A65";
  return "var(--pierre)";
}

const ICON_MAP: Record<string, React.ElementType> = {
  "glamour-premium": Star,
  "influenceurs": TrendingUp,
  "youtube-podcast": Video,
  "musique": Music,
  "sport-fitness": Dumbbell,
};

const COLONNES = ["glamour", "influenceurs", "youtube", "musique", "sport"] as const;
const COLONNE_LABELS: Record<string, string> = {
  glamour: "Glamour",
  influenceurs: "Influence",
  youtube: "YT/Podcast",
  musique: "Musique",
  sport: "Sport",
};

export function DepartementsClient() {
  return (
    <main>
      <HeroSection />
      <DepartementsListeSection />
      <TableauComparatifSection />
      <CeQueNousRefusonsSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}

function HeroSection() {
  const { ref, inView } = useReveal(0.2);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 160, paddingBottom: 100 }}>
      <div className="wrap-eco text-center" style={{ maxWidth: 900, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.6, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <CoutureEmblem size={28} color="var(--or)" />
        </motion.div>
        <motion.p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-6" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Nos départements
        </motion.p>
        <motion.h1 className="display-large mx-auto mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          Cinq départements. Une même exigence : construire une image qui dure.
        </motion.h1>
        <motion.p className="text-[1.15rem] leading-relaxed mx-auto mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic", maxWidth: 600 }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          Chaque créateur est unique. Chaque département réunit l'expertise, les outils et l'accompagnement adaptés à votre univers. Découvrez celui qui correspond à votre ambition.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.4}>
          <Link href="#departements" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Découvrir les départements</Link>
          <Link href="/apply" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>Postuler</Link>
        </motion.div>
      </div>
    </section>
  );
}

function DepartementsListeSection() {
  const { ref, inView } = useReveal(0.05);
  return (
    <section ref={ref} id="departements" className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco">
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Expertise
        </motion.p>
        <motion.h2 className="display-medium mb-14 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Cinq départements, une maison
        </motion.h2>

        {DEPARTEMENTS.map((dept, di) => {
          const Icon = ICON_MAP[dept.slug] || Sparkles;
          return (
            <motion.div key={dept.slug} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.06 + di * 0.05}>
              <div className="mb-8 p-6 md:p-8" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(12,10,8,0.02)", maxWidth: 900, margin: "0 auto 32px" }}>
                {/* En-tête département */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 flex items-center justify-center shrink-0" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)" }}>
                    <Icon size={26} />
                  </div>
                  <div>
                    <h3 className="display-small" style={{ color: "var(--encre)" }}>{dept.nom}</h3>
                    <p className="text-[14px] leading-relaxed mt-1" style={{ color: "var(--encre)", opacity: 0.55, fontFamily: "var(--font-accent), serif", fontStyle: "italic" }}>{dept.baseline}</p>
                  </div>
                </div>

                {/* Profils */}
                <div className="mb-5">
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>Profils concernés</p>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }}>{dept.profils}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  {/* Problèmes */}
                  <div>
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: "#C44536", fontFamily: "var(--font-util), monospace" }}>Problèmes courants</p>
                    <ul className="space-y-1.5">
                      {dept.problemes.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-[12px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>
                          <span style={{ color: "#C44536", flexShrink: 0 }}>, </span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Réponse WTF */}
                  <div>
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: "#5A7D4A", fontFamily: "var(--font-util), monospace" }}>Réponse WTF</p>
                    <p className="text-[12px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>{dept.reponse}</p>
                  </div>
                </div>

                {/* Outils */}
                <div className="mb-5">
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>Outils utilisés</p>
                  <div className="flex flex-wrap gap-2">
                    {dept.outils.map((outil, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5" style={{ border: "1px solid var(--ligne-faible)", color: "var(--pierre)", fontFamily: "var(--font-util), monospace" }}>{outil}</span>
                    ))}
                  </div>
                </div>

                {/* Parcours exemple */}
                <div className="mb-5 p-4" style={{ background: "rgba(216,169,91,0.05)", borderLeft: "2px solid var(--or)" }}>
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] mb-1" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>Exemple de parcours</p>
                  <p className="text-[12px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>{dept.parcours}</p>
                </div>

                {/* CTA */}
                <Link
                  href={`/departements/${dept.slug}`}
                  className="btn-eco inline-flex items-center gap-2"
                  style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)", fontSize: "0.7rem", padding: "10px 24px" }}
                >
                  Découvrir {dept.nom} <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function TableauComparatifSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 950, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Comparaison
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Besoins par département
        </motion.h2>
        <motion.div variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" style={{ minWidth: 700 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--or)" }}>
                  <th className="py-3 px-3 text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--pierre)", fontFamily: "var(--font-util), monospace" }}>Besoin</th>
                  {COLONNES.map((col) => (
                    <th key={col} className="py-3 px-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-center" style={{ color: "var(--pierre)", fontFamily: "var(--font-util), monospace" }}>
                      {COLONNE_LABELS[col]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLEAU_COMPARATIF.map((row, i) => (
                  <tr key={row.besoin} style={{ borderBottom: "1px solid var(--ligne-faible)", background: i % 2 === 0 ? "transparent" : "rgba(244,238,227,0.02)" }}>
                    <td className="py-3 px-3 text-[12px] font-medium" style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}>{row.besoin}</td>
                    {COLONNES.map((col) => (
                      <td key={col} className="py-3 px-3 text-center text-[10px] font-semibold tracking-[0.04em]" style={{ color: getGraviteColor(row[col]), fontFamily: "var(--font-util), monospace" }}>
                        {row[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CeQueNousRefusonsSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-5" style={{ color: "#C44536", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Nos limites
        </motion.p>
        <motion.h2 className="display-medium mb-10" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Ce que nous refusons
        </motion.h2>
        <div className="space-y-3">
          {CE_QUE_NOUS_REFUSONS.map((item, i) => (
            <motion.div key={item.titre} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.06 + i * 0.05}>
              <div className="flex items-start gap-4 p-5" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(196,69,54,0.02)" }}>
                <div className="w-8 h-8 flex items-center justify-center shrink-0" style={{ background: "rgba(196,69,54,0.1)", color: "#C44536" }}>
                  <X size={14} />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold mb-1" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{item.titre}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 700, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Questions fréquentes
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Départements
        </motion.h2>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <motion.div key={i} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1 + i * 0.05}>
              <FAQItem q={item.q} r={item.r} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { ref, inView } = useReveal(0.2);
  return (
    <section ref={ref} className="couture-section text-center" style={{ backgroundColor: "var(--encre)", paddingTop: 100, paddingBottom: 100 }}>
      <div className="wrap-eco" style={{ maxWidth: 640, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.6, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <CoutureEmblem size={26} color="var(--or)" />
        </motion.div>
        <motion.p className="display-medium mb-6" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Prêt à construire une image qui dure ?
        </motion.p>
        <motion.p className="text-[1rem] leading-relaxed mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          Postulez dès maintenant. Nous vous aiderons à identifier le département qui correspond à votre ambition.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.3}>
          <Link href="/apply" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Postuler <ArrowRight size={14} /></Link>
          <Link href="/qui-sommes-nous" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>Qui sommes-nous</Link>
        </motion.div>
      </div>
    </section>
  );
}
