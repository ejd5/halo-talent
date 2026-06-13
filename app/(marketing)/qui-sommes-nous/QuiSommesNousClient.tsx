"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Shield, Sparkles, TrendingUp, Building2, Heart } from "lucide-react";
import { CoutureEmblem } from "@/components/home/CoutureEmblem";

// ═══════════════════════════════════════════════════════
// Animation helpers
// ═══════════════════════════════════════════════════════

function useReveal(amount = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  return { ref, inView };
}

const riseItem = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const, delay },
  }),
};

const fadeItem = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const, delay },
  }),
};

// ═══════════════════════════════════════════════════════
// Data
// ═══════════════════════════════════════════════════════

const CONSTATS = [
  {
    label: "Explosion du secteur",
    text: "Le management de créateurs est devenu un marché mondial. Des centaines d'agences émergent chaque année, attirées par les revenus rapides, sans vision long terme.",
  },
  {
    label: "Agences opportunistes",
    text: "Beaucoup promettent la richesse, offrent des cadeaux, achètent la confiance, puis disparaissent ou ne livrent rien. Les créateurs changent d'agence tous les 3 à 6 mois.",
  },
  {
    label: "Opacité des commissions",
    text: "La plupart des agences ne publient pas leurs tarifs. Le créateur découvre ce qu'on lui prélève après avoir signé. Les marges sont floues, les justifications inexistantes.",
  },
  {
    label: "Outils confisqués",
    text: "Quand un créateur quitte son agence, il perd l'accès aux outils, aux données, aux analytics. On le désarme pour le retenir. C'est de la rétention par privation.",
  },
  {
    label: "Contrats incompris",
    text: "Des clauses juridiques complexes, des engagements longs, des exclusivités floues. Le créateur signe sans comprendre ce à quoi il s'engage, parfois pour des années.",
  },
  {
    label: "Pression à produire",
    text: "Certaines agences poussent à produire toujours plus, quitte à dégrader l'image du créateur. Le contenu devient une marchandise, le créateur un outil de production.",
  },
];

const REFUS = [
  { icon: EyeOff, text: "La promesse de richesse comme argument commercial" },
  { icon: EyeOff, text: "La manipulation psychologique pour fidéliser un talent" },
  { icon: EyeOff, text: "Les cadeaux et avantages matériels pour acheter la confiance" },
  { icon: EyeOff, text: "La pression à produire du contenu dégradant ou hors-marque" },
  { icon: EyeOff, text: "L'opacité sur les commissions, les méthodes et les résultats" },
  { icon: EyeOff, text: "Les stratégies court terme qui épuisent les créateurs" },
  { icon: EyeOff, text: "L'agence qui garde tous les outils, toutes les données, tout le contrôle" },
];

const CONSTRUCTIONS = [
  { icon: Building2, text: "Une maison créative pensée pour durer, pas pour flamber" },
  { icon: Sparkles, text: "Un système d'exploitation complet pour créateurs (Creator OS)" },
  { icon: TrendingUp, text: "Un dashboard centralisé qui donne une vue claire sur toute l'activité" },
  { icon: Heart, text: "Un CRM conçu pour la relation fan, pas pour le spam" },
  { icon: Shield, text: "Une IA contrôlée : elle propose, l'humain valide" },
  { icon: Eye, text: "Un accompagnement juridique préparatoire (WTF Lex, Bouclier Légal)" },
  { icon: Shield, text: "Une protection documentée, plateforme par plateforme" },
  { icon: TrendingUp, text: "Des commissions modulaires, transparentes, dégressives" },
  { icon: Heart, text: "Une relation durable fondée sur la confiance, pas sur la dépendance" },
];

const DEPARTEMENTS = [
  {
    nom: "Glamour Premium",
    profil: "Créateurs mode, beauté, lifestyle haut de gamme",
    besoin: "Image contrôlée, partnerships luxe, personal branding sophistiqué",
    accompagnement: "Direction artistique, stratégie éditoriale, relations marques premium",
    outils: "Studio IA, Atlas CRM, Chat AI",
    objectif: "Construire une marque personnelle désirable et durable dans l'univers du luxe",
    gradient: "rgba(216,169,91,0.08)",
  },
  {
    nom: "Influenceurs",
    profil: "Créateurs contenu digital, réseaux sociaux, UGC",
    besoin: "Volume maîtrisé, diversification des revenus, protection d'image",
    accompagnement: "Stratégie de contenu, monétisation cross-plateforme, gestion de communauté",
    outils: "Chat AI, Atlas CRM, Dashboard WTF",
    objectif: "Transformer une audience en entreprise, sans perdre son authenticité",
    gradient: "rgba(216,169,91,0.06)",
  },
  {
    nom: "YouTube & Podcast",
    profil: "Vidéastes, podcasteurs, créateurs de formats longs",
    besoin: "Production exigeante, monétisation publicitaire, protection des droits",
    accompagnement: "Stratégie de chaîne, diversification revenus (pub, sponsoring, abonnements)",
    outils: "Studio IA, WTF Lex, Atlas CRM",
    objectif: "Bâtir un média indépendant, rentable, avec un contrôle éditorial total",
    gradient: "rgba(216,169,91,0.04)",
  },
  {
    nom: "Musique",
    profil: "Artistes, producteurs, compositeurs, DJs",
    besoin: "Gestion des droits, distribution, image publique, collaborations",
    accompagnement: "Stratégie de sortie, négociation contrats, protection propriété intellectuelle",
    outils: "WTF Lex, Dashboard WTF, Chat AI",
    objectif: "Développer une carrière musicale maîtrisée, de la production à la monétisation",
    gradient: "rgba(216,169,91,0.07)",
  },
  {
    nom: "Sport & Fitness",
    profil: "Athlètes, coachs, personnalités sportives",
    besoin: "Image de marque, contrats sponsoring, présence digitale, reconversion",
    accompagnement: "Personal branding athlète, négociation partenariats, stratégie post-carrière",
    outils: "Atlas CRM, Dashboard WTF, Studio IA",
    objectif: "Transformer la notoriété sportive en marque personnelle pérenne",
    gradient: "rgba(216,169,91,0.05)",
  },
];

// ═══════════════════════════════════════════════════════
// Section Components
// ═══════════════════════════════════════════════════════

function HeroSection() {
  const { ref, inView } = useReveal(0.2);
  return (
    <section
      ref={ref}
      className="couture-section"
      style={{ backgroundColor: "var(--encre, #0C0A08)", paddingTop: 160, paddingBottom: 120 }}
    >
      <div className="wrap-eco text-center">
        <motion.div
          className="couture-ornament mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 0.6, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <CoutureEmblem size={24} color="var(--or)" />
        </motion.div>
        <motion.p
          className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-6"
          style={{ color: "var(--or, #D8A95B)", fontFamily: "var(--font-util), monospace" }}
          variants={fadeItem}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0}
        >
          Maison de création, Paris · New York · Milan · Tokyo
        </motion.p>
        <motion.h1
          className="display-large mx-auto"
          style={{ maxWidth: 800, color: "var(--ivoire, #F4EEE3)" }}
          variants={riseItem}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0.1}
        >
          Qui nous sommes
        </motion.h1>
        <motion.p
          className="text-[18px] leading-relaxed mt-8 mx-auto"
          style={{ maxWidth: 640, color: "var(--pierre, #9C9183)", fontFamily: "var(--font-body), sans-serif" }}
          variants={fadeItem}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0.25}
        >
          Une maison de management créatif née d'un constat simple : le créateur doit redevenir le centre du modèle.
        </motion.p>
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mt-10"
          variants={fadeItem}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0.4}
        >
          <Link
            href="/demo"
            className="btn-eco"
            style={{ backgroundColor: "var(--or, #D8A95B)", color: "var(--encre, #0C0A08)", borderColor: "var(--or)" }}
          >
            Découvrir notre approche
          </Link>
          <Link
            href="/manifeste"
            className="btn-eco"
            style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}
          >
            Lire notre manifeste
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function LeConstat() {
  const { ref, inView } = useReveal(0.1);
  return (
    <section
      ref={ref}
      className="couture-section"
      style={{ backgroundColor: "var(--creme, #F9F6EF)", paddingTop: 100, paddingBottom: 100 }}
    >
      <div className="wrap-eco">
        <motion.div
          className="couture-ornament mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 0.4, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <CoutureEmblem size={22} color="var(--encre)" />
        </motion.div>
        <motion.h2
          className="display-medium text-center mx-auto mb-6"
          style={{ maxWidth: 700, color: "var(--encre, #0C0A08)" }}
          variants={riseItem}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0.1}
        >
          Le constat
        </motion.h2>
        <motion.p
          className="text-center text-[16px] leading-relaxed mx-auto mb-16"
          style={{ maxWidth: 600, color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}
          variants={fadeItem}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0.2}
        >
          Le management de créateurs a explosé. Mais la qualité de l'accompagnement n'a pas suivi. Voici ce que nous avons observé, et refusé.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CONSTATS.map((c, i) => (
            <motion.div
              key={c.label}
              className="p-7"
              style={{
                border: "1px solid rgba(12,10,8,0.08)",
                background: "rgba(12,10,8,0.02)",
              }}
              variants={fadeItem}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={0.2 + i * 0.08}
            >
              <h3
                className="text-[0.65rem] font-bold uppercase tracking-[0.14em] mb-3"
                style={{ color: "var(--or, #D8A95B)", fontFamily: "var(--font-util), monospace" }}
              >
                {c.label}
              </h3>
              <p
                className="text-[14px] leading-relaxed"
                style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }}
              >
                {c.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PourquoiHalo() {
  const { ref, inView } = useReveal(0.15);
  return (
    <section
      ref={ref}
      className="couture-section"
      style={{ backgroundColor: "var(--encre, #0C0A08)", paddingTop: 100, paddingBottom: 100 }}
    >
      <div className="wrap-eco">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={riseItem}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={0.1}
          >
            <p
              className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-5"
              style={{ color: "var(--or, #D8A95B)", fontFamily: "var(--font-util), monospace" }}
            >
              Notre origine
            </p>
            <h2
              className="display-medium mb-8"
              style={{ color: "var(--ivoire, #F4EEE3)" }}
            >
              Pourquoi WTF existe
            </h2>
            <div className="space-y-5">
              <p
                className="text-[15px] leading-relaxed"
                style={{ color: "var(--pierre, #9C9183)", fontFamily: "var(--font-body), sans-serif" }}
              >
                Where Talent Forms est né de profils entrepreneurs, issus du e-commerce, du commerce international, du développement produit et de la direction générale.
              </p>
              <p
                className="text-[15px] leading-relaxed"
                style={{ color: "var(--pierre, #9C9183)", fontFamily: "var(--font-body), sans-serif" }}
              >
                Nous avons vu des créateurs talentueux mal accompagnés, mal protégés, mal conseillés. Nous avons vu des agences qui confisquent les outils, opacifient les commissions, et traitent les talents comme des comptes interchangeables.
              </p>
              <p
                className="text-[15px] leading-relaxed"
                style={{ color: "var(--pierre, #9C9183)", fontFamily: "var(--font-body), sans-serif" }}
              >
                Notre but n'a jamais été de créer une agence de plus. Nous construisons une maison durable, un lieu où la technologie et l'humain travaillent ensemble pour servir le créateur, pas pour l'enfermer.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="p-10"
            style={{
              border: "1px solid var(--ligne, rgba(216,169,91,0.18))",
              background: "rgba(216,169,91,0.03)",
            }}
            variants={fadeItem}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={0.3}
          >
            <p
              className="text-[1.6rem] leading-snug italic mb-6"
              style={{ color: "var(--ivoire, #F4EEE3)", fontFamily: "var(--font-accent), serif" }}
            >
              "Nous ne voulons pas gérer des créateurs comme des comptes. Nous voulons construire des marques humaines, désirables et protégées."
            </p>
            <p
              className="text-[12px] uppercase tracking-[0.2em]"
              style={{ color: "var(--or, #D8A95B)", fontFamily: "var(--font-util), monospace" }}
            >
             , L'équipe fondatrice Where Talent Forms
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function NotreConviction() {
  const { ref, inView } = useReveal(0.2);
  return (
    <section
      ref={ref}
      className="couture-section text-center"
      style={{ backgroundColor: "var(--creme, #F9F6EF)", paddingTop: 100, paddingBottom: 100 }}
    >
      <div className="wrap-eco" style={{ maxWidth: 720, margin: "0 auto" }}>
        <motion.div
          className="couture-ornament mb-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 0.5, scale: 1 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <CoutureEmblem size={32} color="var(--or)" />
        </motion.div>
        <motion.p
          className="text-[0.6rem] font-bold uppercase tracking-[0.18em] mb-8"
          style={{ color: "var(--or, #D8A95B)", fontFamily: "var(--font-util), monospace" }}
          variants={fadeItem}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0}
        >
          Notre conviction
        </motion.p>
        <motion.blockquote
          className="display-medium mb-0"
          style={{ color: "var(--encre, #0C0A08)", fontStyle: "normal" }}
          variants={riseItem}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0.15}
        >
          Le créateur n'est pas un produit.
        </motion.blockquote>
        <motion.p
          className="text-[1.2rem] leading-relaxed mt-4"
          style={{ color: "var(--encre)", opacity: 0.55, fontFamily: "var(--font-accent), serif", fontStyle: "italic" }}
          variants={fadeItem}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0.3}
        >
          Son image est son actif. Sa confiance est la base. Son contrôle doit rester central.
        </motion.p>
      </div>
    </section>
  );
}

function CeQueNousRefusons() {
  const { ref, inView } = useReveal(0.1);
  return (
    <section
      ref={ref}
      className="couture-section"
      style={{ backgroundColor: "var(--encre, #0C0A08)", paddingTop: 100, paddingBottom: 100 }}
    >
      <div className="wrap-eco">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <motion.div
            variants={riseItem}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={0.1}
          >
            <p
              className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-4"
              style={{ color: "var(--or, #D8A95B)", fontFamily: "var(--font-util), monospace" }}
            >
              Nos lignes rouges
            </p>
            <h2
              className="display-medium mb-6"
              style={{ color: "var(--ivoire, #F4EEE3)" }}
            >
              Ce que nous refusons
            </h2>
            <p
              className="text-[15px] leading-relaxed"
              style={{ color: "var(--pierre, #9C9183)", fontFamily: "var(--font-body), sans-serif" }}
            >
              Dans un secteur où certaines pratiques sont devenues la norme, nous avons tracé nos lignes rouges. Elles ne sont pas négociables.
            </p>
          </motion.div>

          <motion.div className="space-y-3">
            {REFUS.map((r, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-4 p-4"
                style={{
                  border: "1px solid var(--ligne-faible, rgba(244,238,227,0.08))",
                  background: "rgba(244,238,227,0.02)",
                }}
                variants={fadeItem}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                custom={0.15 + i * 0.06}
              >
                <r.icon
                  size={16}
                  style={{ color: "var(--or, #D8A95B)", marginTop: 2, flexShrink: 0 }}
                />
                <span
                  className="text-[14px] leading-relaxed"
                  style={{ color: "var(--ivoire, #F4EEE3)", opacity: 0.75, fontFamily: "var(--font-body), sans-serif" }}
                >
                  {r.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CeQueNousConstruisons() {
  const { ref, inView } = useReveal(0.1);
  return (
    <section
      ref={ref}
      className="couture-section"
      style={{ backgroundColor: "var(--creme, #F9F6EF)", paddingTop: 100, paddingBottom: 100 }}
    >
      <div className="wrap-eco text-center">
        <motion.p
          className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-4"
          style={{ color: "var(--or, #D8A95B)", fontFamily: "var(--font-util), monospace" }}
          variants={fadeItem}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0}
        >
          Notre chantier
        </motion.p>
        <motion.h2
          className="display-medium mx-auto mb-4"
          style={{ maxWidth: 700, color: "var(--encre, #0C0A08)" }}
          variants={riseItem}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0.1}
        >
          Ce que nous construisons
        </motion.h2>
        <motion.p
          className="text-[16px] leading-relaxed mx-auto mb-14"
          style={{ maxWidth: 560, color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}
          variants={fadeItem}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0.2}
        >
          Chaque brique de Where Talent Forms est pensée pour renforcer l'indépendance du créateur, pas pour créer de la dépendance.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
          {CONSTRUCTIONS.map((c, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-4 p-6"
              style={{
                border: "1px solid rgba(12,10,8,0.08)",
                background: "rgba(12,10,8,0.02)",
              }}
              variants={fadeItem}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={0.2 + i * 0.07}
            >
              <c.icon
                size={18}
                style={{ color: "var(--or, #D8A95B)", marginTop: 1, flexShrink: 0 }}
              />
              <span
                className="text-[14px] leading-relaxed"
                style={{ color: "var(--encre)", opacity: 0.75, fontFamily: "var(--font-body), sans-serif" }}
              >
                {c.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DepartementsSection() {
  const { ref, inView } = useReveal(0.05);
  return (
    <section
      ref={ref}
      className="couture-section"
      style={{ backgroundColor: "var(--encre, #0C0A08)", paddingTop: 100, paddingBottom: 100 }}
    >
      <div className="wrap-eco">
        <motion.div
          className="text-center mb-16"
          variants={riseItem}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0}
        >
          <p
            className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-4"
            style={{ color: "var(--or, #D8A95B)", fontFamily: "var(--font-util), monospace" }}
          >
            Notre organisation
          </p>
          <h2
            className="display-medium mx-auto mb-4"
            style={{ maxWidth: 700, color: "var(--ivoire, #F4EEE3)" }}
          >
            Nos cinq départements
          </h2>
          <p
            className="text-[16px] leading-relaxed mx-auto"
            style={{ maxWidth: 560, color: "var(--pierre, #9C9183)", fontFamily: "var(--font-body), sans-serif" }}
          >
            Chaque département est une équipe dédiée avec une expertise spécifique. Pas de gestionnaires généralistes : des spécialistes par univers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {DEPARTEMENTS.map((d, i) => (
            <motion.div
              key={d.nom}
              className="p-8"
              style={{
                border: "1px solid var(--ligne, rgba(216,169,91,0.18))",
                background: d.gradient,
              }}
              variants={fadeItem}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={0.1 + i * 0.08}
            >
              <h3
                className="text-[1.1rem] font-bold mb-5"
                style={{ color: "var(--or, #D8A95B)", fontFamily: "var(--font-display-alt), serif" }}
              >
                {d.nom}
              </h3>
              <div className="space-y-3 mb-6">
                <div>
                  <span
                    className="text-[10px] uppercase tracking-[0.14em] block mb-1"
                    style={{ color: "var(--pierre, #9C9183)", fontFamily: "var(--font-util), monospace" }}
                  >
                    Profil type
                  </span>
                  <span
                    className="text-[14px]"
                    style={{ color: "var(--ivoire, #F4EEE3)", fontFamily: "var(--font-body), sans-serif" }}
                  >
                    {d.profil}
                  </span>
                </div>
                <div>
                  <span
                    className="text-[10px] uppercase tracking-[0.14em] block mb-1"
                    style={{ color: "var(--pierre, #9C9183)", fontFamily: "var(--font-util), monospace" }}
                  >
                    Besoin
                  </span>
                  <span
                    className="text-[14px]"
                    style={{ color: "var(--ivoire, #F4EEE3)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }}
                  >
                    {d.besoin}
                  </span>
                </div>
                <div>
                  <span
                    className="text-[10px] uppercase tracking-[0.14em] block mb-1"
                    style={{ color: "var(--pierre, #9C9183)", fontFamily: "var(--font-util), monospace" }}
                  >
                    Accompagnement WTF
                  </span>
                  <span
                    className="text-[14px]"
                    style={{ color: "var(--ivoire, #F4EEE3)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }}
                  >
                    {d.accompagnement}
                  </span>
                </div>
                <div>
                  <span
                    className="text-[10px] uppercase tracking-[0.14em] block mb-1"
                    style={{ color: "var(--pierre, #9C9183)", fontFamily: "var(--font-util), monospace" }}
                  >
                    Outils
                  </span>
                  <span
                    className="text-[13px]"
                    style={{ color: "var(--or-clair, #EBC98A)", fontFamily: "var(--font-util), monospace" }}
                  >
                    {d.outils}
                  </span>
                </div>
              </div>
              <p
                className="text-[13px] leading-relaxed pt-4"
                style={{
                  borderTop: "1px solid var(--ligne-faible, rgba(244,238,227,0.08))",
                  color: "var(--ivoire, #F4EEE3)",
                  opacity: 0.55,
                  fontFamily: "var(--font-body), sans-serif",
                  fontStyle: "italic",
                }}
              >
                Objectif : {d.objectif}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ModeleEconomique() {
  const { ref, inView } = useReveal(0.15);
  return (
    <section
      ref={ref}
      className="couture-section"
      style={{ backgroundColor: "var(--creme, #F9F6EF)", paddingTop: 100, paddingBottom: 100 }}
    >
      <div className="wrap-eco">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={riseItem}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={0.1}
          >
            <p
              className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-4"
              style={{ color: "var(--or, #D8A95B)", fontFamily: "var(--font-util), monospace" }}
            >
              Notre modèle
            </p>
            <h2
              className="display-medium mb-6"
              style={{ color: "var(--encre, #0C0A08)" }}
            >
              Un modèle économique transparent
            </h2>
            <div className="space-y-4">
              <p
                className="text-[15px] leading-relaxed"
                style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }}
              >
                Nos commissions sont publiques, marginales et dégressives. Plus vous grandissez, plus le pourcentage baisse. C'est notre manière de vous inciter à grandir, pas de vous taxer.
              </p>
              <p
                className="text-[15px] leading-relaxed"
                style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }}
              >
                Nos outils sont proposés en packs modulaires et en options à la carte. Pas d'imposition inutile : vous activez ce dont vous avez besoin, quand vous en avez besoin.
              </p>
              <p
                className="text-[15px] leading-relaxed"
                style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }}
              >
                C'est une relation business long terme, fondée sur la transparence et l'alignement d'intérêts. Nous ne gagnons que quand vous gagnez, et nous le prouvons chaque mois avec un reporting détaillé.
              </p>
            </div>
            <Link
              href="/commissions"
              className="inline-flex items-center gap-2 mt-8 text-[11px] uppercase tracking-[0.22em] transition-colors"
              style={{ color: "var(--or, #D8A95B)", fontFamily: "var(--font-util), monospace" }}
            >
              Voir le détail de nos commissions
              <ArrowRight size={14} />
            </Link>
          </motion.div>

          <motion.div
            className="p-10"
            style={{
              border: "1px solid rgba(12,10,8,0.08)",
              background: "white",
            }}
            variants={fadeItem}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={0.3}
          >
            <p
              className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-6"
              style={{ color: "var(--or, #D8A95B)", fontFamily: "var(--font-util), monospace" }}
            >
              Commissions marginales
            </p>
            <div className="space-y-4">
              {[
                { tier: "0 – 10 000 €", rate: "20%" },
                { tier: "10 001 – 25 000 €", rate: "15%" },
                { tier: "25 001 – 50 000 €", rate: "12%" },
                { tier: "50 001 – 100 000 €", rate: "10%" },
                { tier: "100 001 € et plus", rate: "8%" },
              ].map((t) => (
                <div key={t.tier} className="flex justify-between items-center py-2" style={{ borderBottom: "1px solid rgba(12,10,8,0.06)" }}>
                  <span className="text-[13px]" style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }}>
                    {t.tier}
                  </span>
                  <span className="text-[14px] font-bold" style={{ color: "var(--encre)", fontFamily: "var(--font-util), monospace" }}>
                    {t.rate}
                  </span>
                </div>
              ))}
            </div>
            <p
              className="text-[11px] leading-relaxed mt-6"
              style={{ color: "var(--encre)", opacity: 0.45, fontFamily: "var(--font-body), sans-serif" }}
            >
              Exemple : pour 25 000 € de revenus mensuels, la commission WTF est de 3 500 € (moyenne effective 14%), contre 12 500 € (50%) dans une agence traditionnelle.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Conclusion() {
  const { ref, inView } = useReveal(0.15);
  return (
    <section
      ref={ref}
      className="couture-section text-center"
      style={{ backgroundColor: "var(--encre, #0C0A08)", paddingTop: 100, paddingBottom: 100 }}
    >
      <div className="wrap-eco" style={{ maxWidth: 680, margin: "0 auto" }}>
        <motion.div
          className="couture-ornament mb-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 0.6, scale: 1 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <CoutureEmblem size={28} color="var(--or)" />
        </motion.div>
        <motion.blockquote
          className="display-medium mb-8"
          style={{ color: "var(--ivoire, #F4EEE3)", fontStyle: "normal" }}
          variants={riseItem}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0.1}
        >
          Nous ne voulons pas gérer des créateurs comme des comptes.
        </motion.blockquote>
        <motion.p
          className="text-[1.1rem] leading-relaxed mb-12"
          style={{ color: "var(--pierre, #9C9183)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }}
          variants={fadeItem}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0.25}
        >
          Nous voulons construire des marques humaines, désirables et protégées.
        </motion.p>
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          variants={fadeItem}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0.4}
        >
          <Link
            href="/demo"
            className="btn-eco"
            style={{ backgroundColor: "var(--or, #D8A95B)", color: "var(--encre, #0C0A08)", borderColor: "var(--or)" }}
          >
            Parler à WTF
          </Link>
          <Link
            href="/departements"
            className="btn-eco"
            style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}
          >
            Découvrir les départements
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
// Main Page
// ═══════════════════════════════════════════════════════

export function QuiSommesNousClient() {
  return (
    <main>
      <HeroSection />
      <LeConstat />
      <PourquoiHalo />
      <NotreConviction />
      <CeQueNousRefusons />
      <CeQueNousConstruisons />
      <DepartementsSection />
      <ModeleEconomique />
      <Conclusion />
    </main>
  );
}
