"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Eye,
  Target,
  Shield,
  Star,
  Clock,
  X,
  Check,
  TrendingUp,
  MessageCircle,
  Send,
} from "lucide-react";

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

const A_QUI = {
  titre: "Where Talent Forms s'adresse aux créateurs qui veulent construire plus qu'une audience.",
  texte:
    "Vous avez déjà une audience, un talent, une communauté. Vous sentez que vous pourriez aller plus loin, mais vous butez sur les mêmes obstacles : manque de temps, manque d'outils, manque de protection. Where Talent Forms est la première maison de stratégie créateur qui combine direction artistique, production IA, gestion de communauté, et protection juridique dans une seule infrastructure.",
  piliers: [
    {
      titre: "Vous créez déjà",
      description: "Vous avez une audience, un style, une voix. Vous n'êtes pas au début du chemin, vous cherchez à passer à l'étape suivante.",
    },
    {
      titre: "Vous voulez plus de contrôle",
      description: "Vous ne voulez pas déléguer votre image à une agence qui ne vous comprend pas. Vous voulez des outils pour rester aux commandes.",
    },
    {
      titre: "Vous pensez long terme",
      description: "Vous ne cherchez pas le buzz d'un mois. Vous construisez quelque chose qui doit durer des années, une carrière, une marque, un héritage.",
    },
    {
      titre: "Vous acceptez la discipline",
      description: "La création est un métier. Vous êtes prêt à investir du temps, de l'énergie, et de la rigueur pour atteindre vos objectifs.",
    },
  ],
};

const PROFILS = [
  {
    categorie: "Image & Esthétique",
    icon: Star,
    profils: ["Mannequins", "Créateurs mode et beauté", "Photographes", "Directeurs artistiques", "Marques personnelles luxe"],
    description: "Pour ceux dont l'image est l'actif principal. Direction artistique, production premium, collaborations luxe.",
  },
  {
    categorie: "Contenu & Influence",
    icon: TrendingUp,
    profils: ["Influenceurs lifestyle", "Streamers", "TikTokers", "Youtubeurs", "Podcasteurs"],
    description: "Pour ceux qui construisent une communauté engagée. Stratégie de contenu, monétisation, brand deals.",
  },
  {
    categorie: "Musique & Audio",
    icon: MessageCircle,
    profils: ["Musiciens", "Producteurs", "Beatmakers", "DJs", "Labels indépendants"],
    description: "Pour les artistes qui veulent l'indépendance. Production IA, distribution, droits, sync.",
  },
  {
    categorie: "Sport & Performance",
    icon: Target,
    profils: ["Athlètes", "Coaches sportifs", "Professeurs de yoga", "Nutritionnistes", "Créateurs fitness"],
    description: "Pour les professionnels du corps et de la discipline. Marque personnelle, diversification, transition post-carrière.",
  },
];

const CE_QUE_NOUS_REGARDONS = [
  { titre: "La qualité de l'image", description: "Pas le nombre de followers. Nous regardons la cohérence visuelle, l'esthétique, la direction artistique. Une belle image avec 2K abonnés vaut plus qu'une image négligée avec 200K.", icon: Eye },
  { titre: "La discipline", description: "La régularité, la constance, la capacité à produire dans la durée. Le talent sans discipline est un feu de paille. La discipline sans talent est une carrière.", icon: Clock },
  { titre: "Le potentiel de développement", description: "Où serez-vous dans 3 ans ? Nous évaluons la trajectoire, pas la position actuelle. Un créateur en croissance avec une vision claire nous intéresse plus qu'un créateur établi sans projet.", icon: TrendingUp },
  { titre: "La cohérence", description: "Entre ce que vous dites et ce que vous montrez. Entre vos valeurs affichées et votre contenu. L'authenticité n'est pas un mot, c'est une cohérence observable.", icon: Check },
  { titre: "L'ambition", description: "Pas la taille du rêve, mais la volonté de le réaliser. Nous cherchons des créateurs qui ne se contentent pas de ce qu'ils ont déjà, mais qui sont prêts à travailler pour aller plus loin.", icon: Star },
  { titre: "La volonté long terme", description: "Construire une image qui dure prend du temps. Nous recherchons des créateurs qui comprennent que la carrière est un marathon, pas un sprint. Qui sont prêts à investir 6, 12, 24 mois pour poser des fondations solides.", icon: Shield },
];

const CE_QUE_NOUS_NE_CHERCHONS_PAS = [
  { titre: "Le buzz court terme", description: "Nous ne travaillons pas avec des créateurs dont la seule ambition est un pic de viralité. Le buzz s'éteint, la marque reste. Nous construisons la marque." },
  { titre: "Le contenu dégradant", description: "Nous refusons les contenus qui exploitent, rabaissent, ou compromettent la dignité des personnes. L'image durable ne se construit pas sur la dégradation." },
  { titre: "La promesse irréaliste", description: "Nous ne travaillons pas avec des créateurs qui promettent des résultats impossibles à leur audience. La confiance est le seul actif qui ne se rachète pas." },
  { titre: "L'absence de projet", description: "Nous ne prenons pas en charge des créateurs qui n'ont pas d'idée de ce qu'ils veulent construire. Nous accompagnons, nous ne décidons pas à votre place." },
];

const PARCOURS = [
  {
    etape: "01",
    titre: "Vous candidatez",
    description: "Vous remplissez le formulaire de candidature. Nous vous demandons qui vous êtes, ce que vous faites, ce que vous cherchez. Pas de données excessives, juste ce qui nous permet de comprendre votre situation.",
    duree: "~10 minutes",
  },
  {
    etape: "02",
    titre: "Nous analysons",
    description: "Notre équipe examine votre profil, votre contenu, et votre potentiel. Nous regardons la qualité, la cohérence, et l'alignement avec notre approche. Cette analyse est humaine, pas algorithmique.",
    duree: "3&ndash;5 jours ouvrés",
  },
  {
    etape: "03",
    titre: "Nous échangeons",
    description: "Si votre profil correspond, nous vous invitons à un échange. Pas un entretien, une conversation. Nous explorons vos objectifs, vos blocages, et ce que WTF pourrait vous apporter.",
    duree: "30&ndash;45 minutes",
  },
  {
    etape: "04",
    titre: "Nous proposons",
    description: "Si l'échange confirme l'alignement, nous vous proposons un accompagnement sur mesure : département, outils, rythme, priorités. Pas de package standard. Pas de contrat fermé.",
    duree: "2&ndash;3 jours après l'échange",
  },
  {
    etape: "05",
    titre: "Vous décidez",
    description: "Vous prenez le temps de réfléchir. Pas de pression, pas d'offre limitée dans le temps. Si la proposition vous convient, nous démarrons. Sinon, vous repartez avec une analyse utile de votre situation.",
    duree: "À votre rythme",
  },
];

const FAQ = [
  { q: "Qui peut candidater ?", r: "Tout créateur de contenu, artiste, ou professionnel de l'image qui a déjà une activité et cherche à la structurer. Nous ne prenons pas de débutants complets : vous devez avoir un minimum de contenu publié et une audience, même modeste." },
  { q: "Combien de followers faut-il pour être accepté ?", r: "Il n'y a pas de seuil minimum. Nous avons accompagné des créateurs avec 1K followers comme avec 500K. Ce qui compte, c'est la qualité de votre travail, votre discipline, et votre potentiel de développement." },
  { q: "La candidature est-elle confidentielle ?", r: "Oui. Toutes les candidatures sont traitées de manière strictement confidentielle. Nous ne partageons jamais vos informations avec des tiers. Si vous n'êtes pas retenu, vos données sont supprimées sous 30 jours." },
  { q: "Quels sont les critères de refus ?", r: "Nous refusons les profils qui cherchent du buzz court terme, qui produisent du contenu dégradant, qui font des promesses irréalistes à leur audience, ou qui n'ont pas de projet clair. Nous refusons aussi quand nous estimons ne pas pouvoir vous aider." },
  { q: "Y a-t-il des frais de candidature ?", r: "Non. La candidature est gratuite et sans engagement. Vous ne payez rien tant que vous n'avez pas accepté une proposition d'accompagnement." },
  { q: "Combien de temps dure l'accompagnement ?", r: "Il n'y a pas de durée minimale ni maximale. Nous travaillons avec un préavis de 30 jours, sans période d'engagement. Certains créateurs restent 6 mois, d'autres plusieurs années." },
];

function FAQItem({ q, r, fond = "creme" }: { q: string; r: string; fond?: "creme" | "encre" }) {
  const [ouvert, setOuvert] = useState(false);
  const isEncre = fond === "encre";
  return (
    <div style={{ border: `1px solid var(--ligne-faible)` }}>
      <button
        type="button"
        className="w-full flex items-center justify-between p-5 text-left"
        style={{
          background: ouvert ? (isEncre ? "rgba(216,169,91,0.06)" : "rgba(216,169,91,0.04)") : "transparent",
          transition: "background 0.3s ease",
        }}
        onClick={() => setOuvert(!ouvert)}
      >
        <span className="text-[14px] font-medium pr-4" style={{ color: isEncre ? "var(--ivoire)" : "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{q}</span>
        <ChevronDown size={14} style={{ color: "var(--or)", transform: ouvert ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", flexShrink: 0 }} />
      </button>
      {ouvert && (
        <div className="px-5 pb-5">
          <p className="text-[13px] leading-relaxed" style={{ color: isEncre ? "var(--pierre)" : "var(--encre)", opacity: isEncre ? 1 : 0.65, fontFamily: "var(--font-body), sans-serif" }}>{r}</p>
        </div>
      )}
    </div>
  );
}

export function TalentsClient() {
  return (
    <main>
      <HeroSection />
      <AQuiSection />
      <ProfilsSection />
      <CeQueNousRegardonsSection />
      <CeQueNousNeCherchonsPasSection />
      <ParcoursSection />
      <RassuranceSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}

function HeroSection() {
  const { ref, inView } = useReveal(0.2);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 160, paddingBottom: 100 }}>
      <div className="wrap-eco text-center" style={{ maxWidth: 740, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.6, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <img src="/wtf-logo-rond.png" alt="WTF Talent" style={{ height: 140, width: "auto" }} />
        </motion.div>
        <motion.p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-6" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Rejoindre WTF
        </motion.p>
        <motion.h1 className="display-large mx-auto mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          Pour les créateurs qui veulent construire plus qu'une audience.
        </motion.h1>
        <motion.p className="text-[1.15rem] leading-relaxed mx-auto mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic", maxWidth: 520 }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          Une image qui dure ne se construit pas avec des outils seuls. Elle exige une stratégie, une direction artistique, une protection, et une équipe. C'est ce que nous offrons.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.4}>
          <Link href="/apply" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Candidater <ArrowRight size={14} /></Link>
          <Link href="#parcours" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>Le parcours</Link>
        </motion.div>
      </div>
    </section>
  );
}

function AQuiSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          À qui s'adresse WTF
        </motion.p>
        <motion.h2 className="display-medium mb-8" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          {A_QUI.titre}
        </motion.h2>
        <motion.p className="text-[1rem] leading-relaxed mb-10" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          {A_QUI.texte}
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {A_QUI.piliers.map((p, i) => (
            <motion.div key={i} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.12 + i * 0.06} className="p-6" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(12,10,8,0.02)" }}>
              <h3 className="text-[15px] font-bold mb-2" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{p.titre}</h3>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>{p.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProfilsSection() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 900, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Profils
        </motion.p>
        <motion.h2 className="display-medium mb-12 text-center" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Les profils que nous accompagnons
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROFILS.map((cat, ci) => {
            const CatIcon = cat.icon;
            return (
              <motion.div key={ci} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.06 + ci * 0.06}>
                <div className="p-6 h-full" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(244,238,227,0.02)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 flex items-center justify-center" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)" }}>
                      <CatIcon size={18} />
                    </div>
                    <h3 className="text-[16px] font-bold" style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}>{cat.categorie}</h3>
                  </div>
                  <p className="text-[13px] leading-relaxed mb-4" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{cat.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.profils.map((p, pi) => (
                      <span key={pi} className="text-[10px] px-2 py-0.5" style={{ border: "1px solid var(--ligne-faible)", color: "var(--pierre)", fontFamily: "var(--font-util), monospace" }}>{p}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <motion.p className="text-center mt-8 text-[0.8rem]" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.35}>
          Vous ne vous reconnaissez dans aucune catégorie ? Candidatez quand même. Nous évaluons chaque profil individuellement.
        </motion.p>
      </div>
    </section>
  );
}

function CeQueNousRegardonsSection() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 820, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Critères
        </motion.p>
        <motion.h2 className="display-medium mb-10" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Ce que nous regardons
        </motion.h2>
        <div className="space-y-4">
          {CE_QUE_NOUS_REGARDONS.map((item, i) => {
            const ItemIcon = item.icon;
            return (
              <motion.div key={i} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.06 + i * 0.05}>
                <div className="flex items-start gap-5 p-6" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(12,10,8,0.02)" }}>
                  <div className="w-11 h-11 flex items-center justify-center shrink-0" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)" }}>
                    <ItemIcon size={20} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold mb-2" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{item.titre}</h3>
                    <p className="text-[13px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>{item.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CeQueNousNeCherchonsPasSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-5" style={{ color: "#C44536", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Nos limites
        </motion.p>
        <motion.h2 className="display-medium mb-10" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Ce que nous ne cherchons pas
        </motion.h2>
        <div className="space-y-3">
          {CE_QUE_NOUS_NE_CHERCHONS_PAS.map((item, i) => (
            <motion.div key={i} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.06 + i * 0.05}>
              <div className="flex items-start gap-4 p-5" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(196,69,54,0.02)" }}>
                <div className="w-8 h-8 flex items-center justify-center shrink-0" style={{ background: "rgba(196,69,54,0.1)", color: "#C44536" }}>
                  <X size={14} />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold mb-1" style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}>{item.titre}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ParcoursSection() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} id="parcours" className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Processus
        </motion.p>
        <motion.h2 className="display-medium mb-12 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Parcours de candidature
        </motion.h2>
        <div className="space-y-0">
          {PARCOURS.map((etape, i) => (
            <motion.div key={i} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08 + i * 0.06}>
              <div className="flex gap-5 p-6 relative" style={{ borderLeft: i < PARCOURS.length - 1 ? "2px solid var(--ligne-faible)" : "2px solid transparent" }}>
                <div className="w-14 h-14 flex items-center justify-center shrink-0" style={{ background: i === 0 ? "var(--or)" : "rgba(216,169,91,0.1)", color: i === 0 ? "var(--encre)" : "var(--or)", fontFamily: "var(--font-display-alt), serif", fontSize: "1.2rem", fontWeight: 700 }}>
                  {etape.etape}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-[16px] font-bold" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{etape.titre}</h3>
                    <span className="text-[10px] px-2 py-0.5" style={{ border: "1px solid var(--or)", color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>{etape.duree}</span>
                  </div>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>{etape.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RassuranceSection() {
  const { ref, inView } = useReveal(0.1);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 40, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 640, margin: "0 auto" }}>
        <motion.div variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0} className="p-6" style={{ border: "1px solid var(--ligne)", background: "rgba(216,169,91,0.03)" }}>
          <div className="flex items-center gap-3 mb-4">
            <Shield size={18} style={{ color: "var(--or)" }} />
            <h3 className="text-[14px] font-bold" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>Nos engagements</h3>
          </div>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-[13px]" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }}>
              <Check size={14} style={{ color: "#5A7D4A", flexShrink: 0, marginTop: 1 }} />
              Confidentialité absolue de votre candidature.
            </li>
            <li className="flex items-start gap-2 text-[13px]" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }}>
              <Check size={14} style={{ color: "#5A7D4A", flexShrink: 0, marginTop: 1 }} />
              Analyse humaine, pas un algorithme de tri.
            </li>
            <li className="flex items-start gap-2 text-[13px]" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }}>
              <Check size={14} style={{ color: "#5A7D4A", flexShrink: 0, marginTop: 1 }} />
              Aucun frais de candidature, aucun engagement.
            </li>
            <li className="flex items-start gap-2 text-[13px]" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }}>
              <Check size={14} style={{ color: "#5A7D4A", flexShrink: 0, marginTop: 1 }} />
              Pas de promesse : nous vous dirons honnêtement si nous pouvons vous aider.
            </li>
            <li className="flex items-start gap-2 text-[13px]" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }}>
              <Check size={14} style={{ color: "#5A7D4A", flexShrink: 0, marginTop: 1 }} />
              Suppression des données sous 30 jours en cas de non-retenue.
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 40, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 700, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Questions fréquentes
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Candidature
        </motion.h2>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <motion.div key={i} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1 + i * 0.05}>
              <FAQItem q={item.q} r={item.r} fond="creme" />
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
      <div className="wrap-eco" style={{ maxWidth: 600, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.6, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <img src="/wtf-logo-rond.png" alt="WTF Talent" style={{ height: 130, width: "auto" }} />
        </motion.div>
        <motion.p className="display-medium mb-6" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Prêt à construire plus qu'une audience ?
        </motion.p>
        <motion.p className="text-[1rem] leading-relaxed mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          La candidature prend 10 minutes. Elle est gratuite, confidentielle, et sans engagement.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.3}>
          <Link href="/apply" className="btn-eco inline-flex items-center gap-2" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>
            Candidater <Send size={14} />
          </Link>
          <Link href="/departements" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>
            Découvrir les départements
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
