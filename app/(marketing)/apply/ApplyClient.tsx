"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Eye,
  Shield,
  User,
  Globe,
  Target,
  BarChart3,
  AlertTriangle,
  Check,
  Send,
  Clock,
  Lock,
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

const CE_QUE_NOUS_ANALYSONS = [
  { titre: "Votre identité", description: "Qui vous êtes, votre parcours, votre singularité. Pas de scoring automatique : une lecture humaine de votre profil.", icon: User },
  { titre: "Votre catégorie", description: "Dans quel département votre activité s'inscrit-elle ? Image, influence, musique, sport, ou une combinaison.", icon: Target },
  { titre: "Vos plateformes", description: "Où êtes-vous présent, avec quelle audience, quelle régularité ? Nous regardons la qualité de l'engagement, pas le volume.", icon: Globe },
  { titre: "Votre audience", description: "Taille, engagement, composition. Une petite audience très engagée nous intéresse plus qu'une large audience passive.", icon: BarChart3 },
  { titre: "Vos objectifs", description: "Où voulez-vous être dans 12 mois ? Nous évaluons la clarté de votre vision et l'ambition de votre projet.", icon: Eye },
  { titre: "Vos difficultés", description: "Qu'est-ce qui vous freine ? Les obstacles que vous identifiez nous aident à comprendre si nous pouvons y répondre.", icon: AlertTriangle },
  { titre: "Votre degré d'autonomie", description: "Où en êtes-vous dans votre capacité à gérer votre activité ? Nous cherchons à vous rendre plus autonome, pas dépendant.", icon: Shield },
  { titre: "Votre besoin principal", description: "Parmi tous vos besoins, lequel est le plus urgent ? Cela détermine par où nous commençons.", icon: Target },
];

const AVANT_DE_CANDIDATER = [
  "Préparez les liens vers vos plateformes principales (URLs, pseudos).",
  "Ayez en tête une estimation de votre audience actuelle.",
  "Réfléchissez à votre objectif principal pour les 12 prochains mois.",
  "Identifiez le plus gros obstacle qui vous empêche d'avancer aujourd'hui.",
  "La candidature prend environ 10 minutes. Vous pouvez la sauvegarder et la reprendre.",
];

const CHAMPS_RECOMMANDES = [
  { champ: "Identité", description: "Prénom, nom ou pseudo professionnel, email, âge, pays.", obligatoire: true },
  { champ: "Catégorie", description: "Le ou les départements qui correspondent à votre activité.", obligatoire: true },
  { champ: "Plateformes", description: "Les réseaux sur lesquels vous êtes actif, avec vos pseudos et votre audience.", obligatoire: true },
  { champ: "Audience", description: "Fourchette de followers par plateforme et estimation des revenus mensuels.", obligatoire: false },
  { champ: "Objectifs", description: "Ce que vous voulez accomplir dans les 12 prochains mois.", obligatoire: true },
  { champ: "Difficultés", description: "Les obstacles qui vous freinent aujourd'hui.", obligatoire: true },
  { champ: "Degré d'autonomie", description: "Votre niveau actuel de gestion autonome de votre activité.", obligatoire: false },
  { champ: "Besoin principal", description: "Le besoin le plus urgent parmi tous ceux que vous avez identifiés.", obligatoire: false },
];

const RASSURANCE = [
  { texte: "Votre candidature est strictement confidentielle.", icon: Lock },
  { texte: "Nous ne partageons jamais vos données avec des tiers.", icon: Shield },
  { texte: "Analyse humaine, pas un algorithme de tri automatique.", icon: Eye },
  { texte: "Aucun frais de candidature, aucun engagement.", icon: Check },
  { texte: "Nous répondons à toutes les candidatures sous 7 jours.", icon: Clock },
  { texte: "Si votre profil n'est pas retenu, vos données sont supprimées sous 30 jours.", icon: Shield },
];

const FAQ = [
  { q: "Qui peut candidater ?", r: "Tout créateur de contenu, artiste, ou professionnel de l'image qui a déjà une activité et une audience, même modeste. La candidature est ouverte à tous les pays." },
  { q: "Combien de temps faut-il pour remplir la candidature ?", r: "Environ 10 minutes. Vous pouvez sauvegarder votre progression et reprendre plus tard. Vos réponses sont automatiquement enregistrées dans votre navigateur." },
  { q: "Quels sont les critères de sélection ?", r: "Nous regardons la qualité de votre image, votre discipline, votre potentiel de développement, votre cohérence, votre ambition, et votre volonté long terme. Il n'y a pas de seuil minimum de followers." },
  { q: "Que se passe-t-il après ma candidature ?", r: "Nous analysons votre profil sous 3 à 5 jours ouvrés. Si votre profil correspond, nous vous invitons à un échange de 30 à 45 minutes. Si l'échange est concluant, nous vous proposons un accompagnement sur mesure." },
  { q: "Puis-je candidater pour quelqu'un d'autre ?", r: "Non. La candidature doit être remplie par le créateur lui-même. Nous avons besoin de comprendre votre vision, pas celle d'un intermédiaire." },
  { q: "Y a-t-il des frais pour candidater ?", r: "Non. La candidature est entièrement gratuite et sans engagement. Vous ne payez rien tant que vous n'avez pas accepté une proposition d'accompagnement." },
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

export function ApplyClient() {
  return (
    <main>
      <HeroSection />
      <CeQueNousAnalysonsSection />
      <AvantDeCandidaterSection />
      <ChampsRecommandesSection />
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
      <div className="wrap-eco text-center" style={{ maxWidth: 680, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.6, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <Image src="/wtf-logo-rond.png" alt="WTF Talent" width={140} height={140} style={{ height: 140, width: "auto" }} />
        </motion.div>
        <motion.p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-6" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Candidature
        </motion.p>
        <motion.h1 className="display-large mx-auto mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          Candidater chez WTF
        </motion.h1>
        <motion.p className="text-[1.15rem] leading-relaxed mx-auto mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic", maxWidth: 480 }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          Une candidature, pas un formulaire de vente. Prenez 10 minutes pour nous dire qui vous êtes, ce que vous faites, et ce que vous cherchez. Nous vous répondons sous 7 jours.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.4}>
          <Link href="/apply/form" className="btn-eco inline-flex items-center gap-2" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>
            Commencer la candidature <ArrowRight size={14} />
          </Link>
          <Link href="#processus" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>Le processus</Link>
        </motion.div>
      </div>
    </section>
  );
}

function CeQueNousAnalysonsSection() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} id="processus" className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 820, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Analyse
        </motion.p>
        <motion.h2 className="display-medium mb-6" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Ce que nous analysons
        </motion.h2>
        <motion.p className="text-[1rem] leading-relaxed mb-10" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          Chaque candidature est lue par un membre de notre équipe. Voici les dimensions que nous évaluons pour comprendre votre profil et déterminer si nous pouvons vous aider.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CE_QUE_NOUS_ANALYSONS.map((item, i) => {
            const ItemIcon = item.icon;
            return (
              <motion.div key={i} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08 + i * 0.04}>
                <div className="flex items-start gap-4 p-5 h-full" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(12,10,8,0.02)" }}>
                  <div className="w-10 h-10 flex items-center justify-center shrink-0" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)" }}>
                    <ItemIcon size={18} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold mb-1" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{item.titre}</h3>
                    <p className="text-[12px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>{item.description}</p>
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

function AvantDeCandidaterSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 640, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Préparation
        </motion.p>
        <motion.h2 className="display-medium mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Avant de candidater
        </motion.h2>
        <motion.p className="text-[1rem] leading-relaxed mb-8" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          Pour que votre candidature soit la plus utile possible, voici ce que nous vous recommandons de préparer :
        </motion.p>
        <ul className="space-y-3">
          {AVANT_DE_CANDIDATER.map((item, i) => (
            <motion.li key={i} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.12 + i * 0.05}>
              <div className="flex items-start gap-3 p-4" style={{ border: "1px solid var(--ligne-faible)" }}>
                <span className="text-[10px] font-bold shrink-0 mt-0.5 w-6 h-6 flex items-center justify-center" style={{ background: "rgba(216,169,91,0.15)", color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[14px] leading-relaxed" style={{ color: "var(--ivoire)", fontFamily: "var(--font-body), sans-serif" }}>{item}</span>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ChampsRecommandesSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Formulaire
        </motion.p>
        <motion.h2 className="display-medium mb-6" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Les informations que nous vous demandons
        </motion.h2>
        <motion.p className="text-[1rem] leading-relaxed mb-8" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          Nous nous limitons aux informations nécessaires pour évaluer votre profil. Rien de plus. Pas de données excessives, pas de questions intrusives.
        </motion.p>
        <div className="space-y-2">
          {CHAMPS_RECOMMANDES.map((champ, i) => (
            <motion.div key={i} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08 + i * 0.04}>
              <div className="flex items-center justify-between p-4" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(12,10,8,0.01)" }}>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-medium" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{champ.champ}</span>
                  <span className="text-[11px]" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{champ.description}</span>
                </div>
                <span className="text-[9px] font-semibold uppercase tracking-[0.1em] px-2 py-0.5 shrink-0 ml-4" style={{
                  background: champ.obligatoire ? "rgba(196,69,54,0.08)" : "rgba(156,145,131,0.08)",
                  color: champ.obligatoire ? "#C44536" : "var(--pierre)",
                  fontFamily: "var(--font-util), monospace",
                }}>
                  {champ.obligatoire ? "Obligatoire" : "Optionnel"}
                </span>
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
          <div className="flex items-center gap-3 mb-5">
            <Shield size={18} style={{ color: "var(--or)" }} />
            <h3 className="text-[15px] font-bold" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>Vos garanties</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {RASSURANCE.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <Icon size={14} style={{ color: "#5A7D4A", flexShrink: 0, marginTop: 1 }} />
                  <span className="text-[13px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }}>{item.texte}</span>
                </div>
              );
            })}
          </div>
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
      <div className="wrap-eco" style={{ maxWidth: 560, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.6, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <Image src="/wtf-logo-rond.png" alt="WTF Talent" width={130} height={130} style={{ height: 130, width: "auto" }} />
        </motion.div>
        <motion.p className="display-medium mb-6" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Prêt à candidater ?
        </motion.p>
        <motion.p className="text-[1rem] leading-relaxed mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          10 minutes. Gratuit. Confidentiel. Réponse sous 7 jours.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.3}>
          <Link href="/apply/form" className="btn-eco inline-flex items-center gap-2" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>
            Commencer la candidature <Send size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
