"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  ChevronDown,
  ArrowRight,
  Camera,
  Heart,
  Mic,
  Music2,
  Dumbbell,
  AlertTriangle,
  Users,
  MessageCircle,
  TrendingUp,
  Shield,
  BarChart3,
  Calendar,
  Lightbulb,
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

type Scenario = {
  profil: string;
  icone: typeof Camera;
  contexte: string;
  probleme: string;
  usages: { outil: string; description: string; icone: typeof Lightbulb }[];
  resultatAttendu: string;
};

const SCENARIOS: Scenario[] = [
  {
    profil: "Créatrice Glamour Premium",
    icone: Camera,
    contexte: "Une créatrice de contenu mode et beauté qui publie sur OnlyFans et Instagram. Elle a 2 500 abonnés payants, publie 3 à 4 fois par semaine, et gère elle-même ses messages fans (environ 40 conversations par jour). Elle travaille avec deux marques de cosmétiques en partenariat.",
    probleme: "Elle passe 4 heures par jour à répondre aux messages. Elle a du mal à identifier les fans prêts à acheter du contenu additionnel. Ses partenariats sont mal suivis : elle ne sait plus quelle marque a quels droits sur quel contenu. Elle a refusé deux collaborations par peur de signer un mauvais contrat.",
    usages: [
      { outil: "Chat Copilot", description: "Répond aux questions fréquentes et détecte les intentions d'achat. Temps de réponse divisé par 3.", icone: MessageCircle },
      { outil: "Revenue Radar", description: "Identifie les fans les plus rentables et ceux à risque de désabonnement.", icone: TrendingUp },
      { outil: "Bouclier Légal", description: "Analyse les contrats de partenariat avant signature et signale les clauses problématiques.", icone: Shield },
      { outil: "Media Kit Generator", description: "Génère un kit presse professionnel pour décrocher plus de partenariats.", icone: BarChart3 },
    ],
    resultatAttendu: "Temps de gestion réduit de 4h à 1h30 par jour. Meilleure identification des opportunités de vente. Partenariats signés avec des contrats vérifiés. Ces résultats dépendent de l'engagement du créateur et ne sont pas garantis.",
  },
  {
    profil: "Influenceuse Lifestyle",
    icone: Heart,
    contexte: "Une créatrice lifestyle présente sur TikTok, Instagram et MYM. Elle produit du contenu quotidien (stories, reels, posts) et gère une communauté de 8 000 abonnés. Elle a une audience jeune et très engagée, mais ses revenus sont irréguliers.",
    probleme: "Elle crée du contenu au fil de l'eau, sans calendrier. Elle a du mal à monétiser son audience au-delà des abonnements. Ses messages privés s'accumulent et elle perd des opportunités de vente. Elle ne sait pas quel contenu performe le mieux.",
    usages: [
      { outil: "Studio IA", description: "Planifie et génère des variantes de contenu dans son style. Calendrier éditorial intégré.", icone: Calendar },
      { outil: "PPV Copilot", description: "Suggère le bon contenu PPV au bon prix pour chaque segment de fans.", icone: TrendingUp },
      { outil: "Fan Brain", description: "Analyse le comportement de l'audience pour identifier les formats et thèmes les plus performants.", icone: Lightbulb },
      { outil: "Chat Copilot", description: "Automatise les réponses aux questions fréquentes et relance les fans inactifs.", icone: MessageCircle },
    ],
    resultatAttendu: "Calendrier éditorial structuré sur 4 semaines. Revenus PPV plus réguliers grâce à la segmentation. Ces résultats dépendent de l'engagement du créateur et ne sont pas garantis.",
  },
  {
    profil: "Podcaster",
    icone: Mic,
    contexte: "Un créateur qui produit un podcast hebdomadaire sur la culture numérique. Il a 1 200 abonnés payants sur Patreon et OnlyFans. Il produit aussi des contenus écrits et des vidéos. Il travaille avec un sponsor récurrent.",
    probleme: "Il peine à organiser ses contenus (audio, texte, vidéo) de manière cohérente. La gestion de ses sponsors est chronophage. Il perd du temps à chercher d'anciens contenus à réutiliser. Ses données fans sont dispersées entre Patreon, OnlyFans et son site.",
    usages: [
      { outil: "Content Vault", description: "Centralise tous ses contenus (audio, texte, vidéo) avec tags et recherche. Archivage sécurisé.", icone: Calendar },
      { outil: "Atlas CRM", description: "Unifie les données fans de toutes les plateformes en un seul tableau de bord.", icone: Users },
      { outil: "Studio IA", description: "Génère des déclinaisons de ses épisodes en posts, stories et extraits vidéo.", icone: Lightbulb },
      { outil: "Revenue Radar", description: "Suit les performances par plateforme et identifie les tendances de revenus.", icone: TrendingUp },
    ],
    resultatAttendu: "Tout le contenu accessible en 3 secondes. Vue unifiée de ses fans. Production de déclinaisons 2x plus rapide. Ces résultats dépendent de l'engagement du créateur et ne sont pas garantis.",
  },
  {
    profil: "Musicien",
    icone: Music2,
    contexte: "Un artiste musical qui monétise son processus créatif (sessions studio, composition, coulisses) sur OnlyFans et MYM. Il a 900 abonnés très fidèles et propose régulièrement des contenus exclusifs (morceaux inédits, samples, tutoriels).",
    probleme: "Il a du mal à suivre les demandes de contenus personnalisés (fans qui demandent des compositions spécifiques). Il ne sait pas quel prix proposer pour ses PPV. La gestion de ses droits musicaux le préoccupe. Il voudrait collaborer avec d'autres artistes mais ne sait pas comment encadrer ces collaborations.",
    usages: [
      { outil: "PPV Copilot", description: "L'aide à fixer le prix de ses contenus exclusifs (morceaux, samples) selon le profil du fan.", icone: TrendingUp },
      { outil: "WTF Lex", description: "Fournit un cadre juridique pour ses collaborations et protège ses droits sur ses créations.", icone: Shield },
      { outil: "Chat Copilot", description: "Gère les demandes de contenu personnalisé avec des réponses types et un suivi des commandes.", icone: MessageCircle },
      { outil: "Content Vault", description: "Stocke et organise ses créations par type, date, droits associés.", icone: Calendar },
    ],
    resultatAttendu: "Prix PPV optimisés. Demandes personnalisées traitées sans dépassement de capacité. Collaborations encadrées juridiquement. Ces résultats dépendent de l'engagement du créateur et ne sont pas garantis.",
  },
  {
    profil: "Sportive Fitness",
    icone: Dumbbell,
    contexte: "Une coach sportive qui partage ses entraînements, programmes nutritionnels et routines bien-être sur OnlyFans, YouTube et une application dédiée. Elle a 3 500 abonnés et propose des programmes personnalisés en PPV.",
    probleme: "La création de contenu (vidéos d'entraînement, fiches programmes, photos) est très chronophage. Elle a du mal à estimer la valeur de ses programmes personnalisés. Ses contenus sont parfois republiés sans son autorisation sur des comptes concurrents. Sa communauté est très demandeuse mais sa capacité de réponse est limitée.",
    usages: [
      { outil: "Studio IA", description: "Génère des fiches programmes et visuels dans son style. Réduit le temps de production.", icone: Lightbulb },
      { outil: "PPV Copilot", description: "Suggère des prix adaptés pour les programmes personnalisés selon le profil de chaque fan.", icone: TrendingUp },
      { outil: "Content Vault", description: "Stocke sécurisément tous ses contenus. Facilite la détection des réutilisations non autorisées.", icone: Shield },
      { outil: "Chat Copilot", description: "Gère les questions fréquentes et les demandes de programmes. Détecte les intentions d'achat.", icone: MessageCircle },
    ],
    resultatAttendu: "Production de contenu 2x plus rapide. Programmes personnalisés tarifés de façon cohérente. Réutilisation non autorisée détectée plus rapidement. Ces résultats dépendent de l'engagement du créateur et ne sont pas garantis.",
  },
];

const COMMENT_COLLECTER = [
  "Les témoignages seront collectés auprès des créateurs actifs sur la plateforme, avec leur consentement écrit explicite.",
  "Un formulaire dédié permettra aux créateurs de partager leur expérience de manière structurée.",
  "Chaque témoignage sera vérifié (identité, utilisation réelle, résultats documentés) avant publication.",
  "Les créateurs pourront choisir d'être identifiés (prénom, département) ou de rester anonymes.",
  "Aucun témoignage ne sera publié sans relecture et approbation par le créateur concerné.",
  "Nous ne publierons jamais de faux témoignages, de faux noms, ou de résultats inventés.",
];

const FAQ = [
  { q: "Pourquoi n'y a-t-il pas de témoignages sur cette page ?", r: "Parce que nous refusons de publier de faux témoignages. Les scénarios ci-dessus sont illustratifs. De vrais témoignages seront ajoutés dès que nous aurons obtenu les consentements nécessaires." },
  { q: "Ces scénarios sont-ils réels ?", r: "Non. Ce sont des scénarios illustratifs construits à partir de cas d'usage typiques observés dans l'industrie. Ils montrent comment Atlas pourrait être utilisé dans ces situations, sans garantir de résultat." },
  { q: "Quand y aura-t-il de vrais témoignages ?", r: "Dès que nous aurons suffisamment de retours documentés et de consentements écrits de créateurs utilisant Atlas activement. Nous ne publierons rien sans vérification préalable." },
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

export function TestimonialsClient() {
  return (
    <main>
      <HeroSection />
      <PourquoiSection />
      <ScenariosSection />
      <CommentCollecterSection />
      <FAQSection_ />
      <CTASection />
    </main>
  );
}

function HeroSection() {
  const { ref, inView } = useReveal(0.2);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 160, paddingBottom: 90 }}>
      <div className="wrap-eco text-center" style={{ maxWidth: 640, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.6, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <Image src="/wtf-logo-rond.png" alt="WTF Talent" width={140} height={140} style={{ height: 140, width: "auto" }} />
        </motion.div>
        <motion.p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-6" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Atlas
        </motion.p>
        <motion.h1 className="display-large mx-auto mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          Scénarios d'usage Atlas
        </motion.h1>
        <motion.p className="text-[1.15rem] leading-relaxed mx-auto" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic", maxWidth: 500 }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          Comment les créateurs utilisent Atlas CRM pour structurer leur activité. Des scénarios illustratifs, pas des témoignages.
        </motion.p>
      </div>
    </section>
  );
}

function PourquoiSection() {
  const { ref, inView } = useReveal(0.1);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 50 }}>
      <div className="wrap-eco" style={{ maxWidth: 640, margin: "0 auto" }}>
        <motion.div className="p-6" style={{ border: "1px solid var(--ligne)", background: "rgba(216,169,91,0.03)" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={18} style={{ color: "var(--or)" }} />
            <h2 className="text-[15px] font-bold" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>Pourquoi nous ne publions pas de faux témoignages</h2>
          </div>
          <div className="space-y-3 text-[13px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }}>
            <p>Dans l'industrie du management créateur, les faux témoignages sont monnaie courante. Des photos libres de droits, des prénoms inventés, des résultats fabriqués. Cette pratique est trompeuse pour les créateurs qui cherchent des informations fiables.</p>
            <p>Nous avons fait le choix de ne pas publier de témoignages tant que nous n'en avons pas de vrais, vérifiés et consentis. En attendant, nous vous présentons des scénarios d'usage illustratifs, clairement identifiés comme tels.</p>
            <p>Ces scénarios sont construits à partir de cas d'usage réels observés dans l'industrie. Ils montrent comment Atlas pourrait être utilisé dans différentes situations. Aucun résultat n'est garanti.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ScenariosSection() {
  const { ref, inView } = useReveal(0.04);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 50, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 880, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Scénarios illustratifs
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          5 profils, 5 usages d'Atlas
        </motion.h2>
        <div className="space-y-8">
          {SCENARIOS.map((scenario, i) => {
            const Icone = scenario.icone;
            return (
              <motion.div key={i} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.06 * i}>
                <div className="p-6" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(12,10,8,0.01)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 flex items-center justify-center" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)" }}>
                      <Icone size={18} />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{(i + 1).toString().padStart(2, "0")}. {scenario.profil}</h3>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>Scénario illustratif</p>
                    </div>
                  </div>

                  <div className="mb-4 p-4" style={{ background: "rgba(12,10,8,0.02)", border: "1px solid var(--ligne-faible)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] mb-2" style={{ color: "var(--pierre)", fontFamily: "var(--font-util), monospace" }}>Contexte</p>
                    <p className="text-[12px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }}>{scenario.contexte}</p>
                  </div>

                  <div className="mb-4 p-4" style={{ borderLeft: "2px solid var(--or)", background: "rgba(216,169,91,0.03)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] mb-2" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>Problème rencontré</p>
                    <p className="text-[12px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }}>{scenario.probleme}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] mb-3" style={{ color: "var(--pierre)", fontFamily: "var(--font-util), monospace" }}>Comment Atlas est utilisé</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {scenario.usages.map((usage, j) => {
                        const UsageIcone = usage.icone;
                        return (
                          <div key={j} className="p-3" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(12,10,8,0.02)" }}>
                            <div className="flex items-center gap-2 mb-1">
                              <UsageIcone size={11} style={{ color: "var(--or)" }} />
                              <span className="text-[11px] font-semibold" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{usage.outil}</span>
                            </div>
                            <p className="text-[11px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.55, fontFamily: "var(--font-body), sans-serif" }}>{usage.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-4" style={{ background: "rgba(216,169,91,0.02)", border: "1px solid var(--ligne-faible)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] mb-2" style={{ color: "var(--pierre)", fontFamily: "var(--font-util), monospace" }}>Résultat attendu (non garanti)</p>
                    <p className="text-[12px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.55, fontFamily: "var(--font-accent), serif", fontStyle: "italic" }}>{scenario.resultatAttendu}</p>
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

function CommentCollecterSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 640, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Transparence
        </motion.p>
        <motion.h2 className="display-medium mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Comment nous collecterons de vrais témoignages
        </motion.h2>
        <div className="space-y-2">
          {COMMENT_COLLECTER.map((item, i) => (
            <motion.div key={i} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08 + i * 0.05}>
              <div className="flex items-start gap-3 p-4" style={{ border: "1px solid var(--ligne-faible)" }}>
                <span className="w-6 h-6 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold" style={{ background: "rgba(216,169,91,0.15)", color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[13px] leading-relaxed" style={{ color: "var(--ivoire)", fontFamily: "var(--font-body), sans-serif" }}>{item}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection_() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 700, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Questions fréquentes
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Transparence
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
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 40, paddingBottom: 110 }}>
      <div className="wrap-eco text-center" style={{ maxWidth: 520, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          <Image src="/wtf-logo-rond.png" alt="WTF Talent" width={120} height={120} style={{ height: 120, width: "auto" }} />
        </motion.div>
        <motion.h2 className="display-medium mb-6" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Prêt à explorer Atlas ?
        </motion.h2>
        <motion.p className="text-[1rem] leading-relaxed mb-8" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          Découvrez comment Atlas CRM peut structurer votre activité. Sans promesses, sans engagements.
        </motion.p>
        <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          <Link href="/features" className="btn-eco inline-flex items-center gap-2">
            Découvrir Atlas
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
