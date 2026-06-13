"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  ChevronDown,
  ArrowRight,
  Image,
  Shield,
  Sparkles,
  Scale,
  LayoutGrid,
  Percent,
  BookOpen,
  FileText,
  Calendar,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
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

const CATEGORIES = [
  { id: "image-strategie", label: "Image &amp; stratégie", description: "Branding, positionnement, direction artistique et stratégie de contenu.", icon: Image, couleur: "#BFA07A" },
  { id: "protection", label: "Protection", description: "Sécurité des comptes, confidentialité, prévention des intrusions et bonnes pratiques.", icon: Shield, couleur: "#8B9D83" },
  { id: "ia-crm", label: "IA &amp; CRM", description: "Intelligence artificielle, CRM créateur, automatisation et outils intelligents.", icon: Sparkles, couleur: "#C4A35A" },
  { id: "juridique", label: "Juridique préparatoire", description: "Contrats, clauses, droits, conformité et anticipation juridique.", icon: Scale, couleur: "#9B8E7A" },
  { id: "departements", label: "Départements", description: "Guides par secteur : Glamour, Influence, Musique, Sport, YouTube/Podcast.", icon: LayoutGrid, couleur: "#A08070" },
  { id: "commissions", label: "Commissions", description: "Calcul, comparaison, optimisation et transparence des commissions de management.", icon: Percent, couleur: "#C09060" },
  { id: "guides-plateformes", label: "Guides plateformes", description: "OnlyFans, MYM, Fansly : TOS, fonctionnalités, algorithmes et bonnes pratiques.", icon: BookOpen, couleur: "#7A8A95" },
];

type ArticlePrioritaire = {
  titre: string;
  description: string;
  categorie: string;
  temps: string;
  slug: string;
  plan: string[];
  lieInternes: { label: string; href: string }[];
};

const ARTICLES_PRIORITAIRES: ArticlePrioritaire[] = [
  {
    titre: "Comment choisir une agence de management créateur",
    description: "Les critères objectifs pour évaluer une agence, les questions à poser avant de signer, et les alternatives au management traditionnel.",
    categorie: "commissions",
    temps: "12 min",
    slug: "comment-choisir-agence-management-createur",
    plan: [
      "Les 3 modèles de management : agence traditionnelle, maison de management, indépendant",
      "Les 8 critères pour évaluer une agence (transparence, contrats, références, outils, équipe, sortie, reporting, spécialisation)",
      "Questions à poser lors du premier appel avec une agence",
      "Les signaux d'alerte qui doivent vous faire fuir",
      "Checklist de comparaison entre 2 ou 3 agences",
      "Pourquoi la commission marginale change la donne",
    ],
    lieInternes: [
      { label: "Simulateur de commission", href: "/pricing" },
      { label: "Départements", href: "/departements" },
    ],
  },
  {
    titre: "Pourquoi la transparence des commissions compte",
    description: "Comment les commissions opaques pénalisent les créateurs, l'impact réel d'une commission à 50%, et ce que la transparence change concrètement.",
    categorie: "commissions",
    temps: "10 min",
    slug: "pourquoi-transparence-commissions-compte",
    plan: [
      "Commission forfaitaire vs marginale : explication visuelle",
      "Le coût caché d'une commission à 50% sur 12 mois",
      "Frais annexes : ce que les agences ne disent pas",
      "Comment vérifier la transparence de votre agence actuelle",
      "L'impact psychologique de savoir exactement combien vous gagnez",
      "Le modèle WTF : commission marginale dégressive expliquée",
    ],
    lieInternes: [
      { label: "Simulateur de commission", href: "/pricing" },
      { label: "Contrat-type WTF", href: "/contrat-type" },
    ],
  },
  {
    titre: "CRM créateur : pourquoi centraliser ses données",
    description: "Centraliser ses données fans dans un CRM permet de mieux comprendre son audience, personnaliser ses offres et augmenter ses revenus sans travailler plus.",
    categorie: "ia-crm",
    temps: "11 min",
    slug: "crm-createur-centraliser-donnees",
    plan: [
      "Qu'est-ce qu'un CRM créateur et en quoi il diffère d'un CRM classique",
      "Les 5 données fans essentielles à suivre",
      "Segmentation : comment diviser votre base pour mieux vendre",
      "Automatisation : les séquences qui font gagner du temps",
      "Détection du churn : repérer un fan qui va partir avant qu'il ne parte",
      "Cas concret : comment Atlas CRM a structuré l'activité d'un créateur",
    ],
    lieInternes: [
      { label: "Atlas CRM", href: "/features" },
      { label: "Chat AI", href: "/chat-ai" },
    ],
  },
  {
    titre: "IA et créateurs : préparer sans perdre le contrôle",
    description: "L'IA générative transforme la création de contenu. Comment l'utiliser comme un outil sans perdre votre authenticité ni votre contrôle créatif.",
    categorie: "ia-crm",
    temps: "14 min",
    slug: "ia-createurs-preparer-sans-perdre-controle",
    plan: [
      "Ce que l'IA peut faire pour un créateur aujourd'hui (et ce qu'elle ne peut pas)",
      "IA texte, image, vidéo : comparatif des outils et de leurs limites",
      "L'ADN Créatif : comment WTF personnalise l'IA à votre identité",
      "Deepfakes et usurpation : les risques réels et comment s'en protéger",
      "Transparence avec votre audience : faut-il dire que vous utilisez l'IA ?",
      "Le futur : ce que l'IA va changer dans les 2 prochaines années pour les créateurs",
    ],
    lieInternes: [
      { label: "Studio IA", href: "/studio" },
      { label: "Chat AI", href: "/chat-ai" },
    ],
  },
  {
    titre: "Droit d'image : les questions à poser avant une collaboration",
    description: "Checklist juridique essentielle pour protéger votre image lors de toute collaboration avec une marque, un photographe ou un autre créateur.",
    categorie: "juridique",
    temps: "10 min",
    slug: "droit-image-questions-avant-collaboration",
    plan: [
      "Droit d'image : définition simple et cadre légal en France",
      "Les 7 questions à poser avant d'autoriser l'utilisation de votre image",
      "Durée, territoire, supports : les 3 dimensions à toujours négocier",
      "Le cas particulier des réseaux sociaux et du contenu éphémère",
      "Que faire si votre image est utilisée sans autorisation ?",
      "Modèle de clause de droit d'image à insérer dans vos contrats",
    ],
    lieInternes: [
      { label: "WTF Lex", href: "/lex" },
      { label: "Protection juridique", href: "/protection" },
    ],
  },
  {
    titre: "Sécurité des comptes créateurs : checklist essentielle",
    description: "Une checklist complète en 12 points pour sécuriser vos comptes de créateur et éviter les intrusions, les usurpations et les pertes de revenus.",
    categorie: "protection",
    temps: "9 min",
    slug: "securite-comptes-createurs-checklist",
    plan: [
      "Pourquoi les comptes de créateurs sont des cibles privilégiées",
      "Les 3 vecteurs d'attaque les plus fréquents (phishing, force brute, ingénierie sociale)",
      "Checklist 12 points : 2FA, mots de passe, vérification des tiers, emails de récupération, etc.",
      "Que faire en cas de piratage : les 5 premières actions",
      "Sécurité physique : protéger vos appareils et vos sauvegardes",
      "Les outils WTF pour la sécurité : audit log, alertes de connexion, 2FA obligatoire",
    ],
    lieInternes: [
      { label: "Sécurité WTF", href: "/security" },
      { label: "Protection", href: "/protection" },
    ],
  },
  {
    titre: "Construire une image premium sur la durée",
    description: "Les principes d'une image de marque forte et cohérente pour les créateurs : identité visuelle, ton éditorial, storytelling et cohérence cross-platform.",
    categorie: "image-strategie",
    temps: "13 min",
    slug: "construire-image-premium-duree",
    plan: [
      "Image de marque pour créateur : pourquoi c'est votre actif le plus précieux",
      "Les 4 piliers d'une identité visuelle cohérente (palette, typo, photo, filtre)",
      "Trouver votre ton éditorial et vous y tenir",
      "Storytelling créateur : comment raconter votre parcours sans tout dévoiler",
      "Cohérence cross-platform : adapter sans se trahir",
      "Rebranding : quand et comment faire évoluer votre image",
    ],
    lieInternes: [
      { label: "Studio IA", href: "/studio" },
      { label: "Media Kit Generator", href: "/studio/mediakit" },
    ],
  },
  {
    titre: "Les erreurs fréquentes dans les collaborations créateur-agence",
    description: "Absence de contrat écrit, exclusivité disproportionnée, commissions opaques : les pièges les plus courants et comment les éviter.",
    categorie: "juridique",
    temps: "11 min",
    slug: "erreurs-frequentes-collaborations-createur-agence",
    plan: [
      "Erreur n°1 : Travailler sans contrat écrit",
      "Erreur n°2 : Accepter une exclusivité sans contrepartie",
      "Erreur n°3 : Ne pas vérifier la propriété de ses comptes",
      "Erreur n°4 : Ignorer les clauses de non-concurrence post-contractuelles",
      "Erreur n°5 : Ne pas documenter les échanges avec son agence",
      "Erreur n°6 : Rester par peur ou par méconnaissance de ses droits",
      "Ce que WTF fait différemment : contrat-type, transparence, sortie 30 jours",
    ],
    lieInternes: [
      { label: "Bouclier Légal", href: "/protection" },
      { label: "WTF Lex", href: "/lex" },
    ],
  },
  {
    titre: "Comment préparer un dossier avant de consulter un avocat",
    description: "Un guide pratique pour préparer efficacement votre dossier juridique : documents à rassembler, chronologie, questions à poser, budget à anticiper.",
    categorie: "juridique",
    temps: "10 min",
    slug: "preparer-dossier-avant-consulter-avocat",
    plan: [
      "Pourquoi un dossier bien préparé réduit vos frais d'avocat",
      "Les 8 documents à rassembler avant le premier rendez-vous",
      "Comment rédiger une chronologie claire des faits",
      "Les questions à poser à votre avocat (et celles qu'il vous posera)",
      "Budget : combien coûte une consultation et une procédure",
      "Alternative : le Bouclier Légal pour analyser votre contrat avant d'aller voir un avocat",
    ],
    lieInternes: [
      { label: "WTF Lex", href: "/lex" },
      { label: "Protection", href: "/protection" },
    ],
  },
  {
    titre: "Pourquoi WTF refuse les promesses de richesse rapide",
    description: "Dans un secteur où les promesses de gains mirobolants sont monnaie courante, WTF revendique une approche sobre et réaliste du management de créateur.",
    categorie: "image-strategie",
    temps: "8 min",
    slug: "pourquoi-halo-refuse-promesses-richesse-rapide",
    plan: [
      "Le problème des promesses de richesse rapide dans l'industrie du management créateur",
      "Pourquoi ces promesses attirent mais détruisent la confiance",
      "L'approche WTF : poser des fondations solides plutôt que promettre la lune",
      "Ce que signifie construire une activité durable de créateur",
      "Transparence sur les revenus réalistes par département et par profil",
      "Notre engagement : dire la vérité, même quand elle est moins vendeuse",
    ],
    lieInternes: [
      { label: "Qui sommes-nous", href: "/qui-sommes-nous" },
      { label: "Manifeste", href: "/manifeste" },
    ],
  },
];

const IDEES_ARTICLES = [
  { titre: "Comment réagir face à une suspension de compte OnlyFans", categorie: "guides-plateformes", temps: "10 min" },
  { titre: "MYM vs OnlyFans vs Fansly : quel plateforme choisir en 2026", categorie: "guides-plateformes", temps: "15 min" },
  { titre: "Les TOS OnlyFans 2026 décryptées clause par clause", categorie: "guides-plateformes", temps: "18 min" },
  { titre: "Comment migrer d'une plateforme à l'autre sans perdre ses fans", categorie: "guides-plateformes", temps: "12 min" },
  { titre: "Comprendre l'algorithme de recommandation de chaque plateforme", categorie: "guides-plateformes", temps: "14 min" },
  { titre: "Checklist sécurité : protéger son compte en 15 minutes", categorie: "protection", temps: "8 min" },
  { titre: "Le guide complet de l'authentification à deux facteurs pour créateurs", categorie: "protection", temps: "7 min" },
  { titre: "Que faire si votre contenu fuit sur des sites pirates", categorie: "protection", temps: "10 min" },
  { titre: "Les clauses abusives les plus fréquentes dans les contrats d'agence", categorie: "juridique", temps: "11 min" },
  { titre: "Négocier un contrat de sponsoring : les points clés", categorie: "juridique", temps: "13 min" },
  { titre: "Propriété intellectuelle : qui possède votre contenu ?", categorie: "juridique", temps: "12 min" },
  { titre: "Comment fonctionne le Content Vault WTF", categorie: "ia-crm", temps: "6 min" },
  { titre: "Chat AI vs réponses manuelles : comparatif temps et qualité", categorie: "ia-crm", temps: "9 min" },
  { titre: "Comment l'ADN Créatif personnalise l'IA à votre style", categorie: "ia-crm", temps: "8 min" },
  { titre: "Les outils d'automatisation qui font gagner 10h par semaine", categorie: "ia-crm", temps: "10 min" },
  { titre: "Comment construire un média kit professionnel en 2026", categorie: "image-strategie", temps: "9 min" },
  { titre: "Stratégie de contenu : comment planifier 3 mois de publications", categorie: "image-strategie", temps: "13 min" },
  { titre: "Trouver sa niche sans s'enfermer : le guide du positionnement", categorie: "image-strategie", temps: "11 min" },
  { titre: "Glamour Premium : construire une image luxe et durable", categorie: "departements", temps: "10 min" },
  { titre: "Influenceurs : gérer sa communauté à grande échelle", categorie: "departements", temps: "10 min" },
  { titre: "YouTube / Podcast : structurer sa production de contenu long", categorie: "departements", temps: "12 min" },
  { titre: "Musique : protéger ses droits et monétiser son catalogue", categorie: "departements", temps: "11 min" },
  { titre: "Sport / Fitness : transformer sa performance en contenu rentable", categorie: "departements", temps: "10 min" },
  { titre: "Commission marginale vs forfaitaire : le guide visuel", categorie: "commissions", temps: "8 min" },
  { titre: "Comment calculer votre revenu net avec une commission dégressive", categorie: "commissions", temps: "7 min" },
  { titre: "Frais cachés des agences : ce qu'il faut vérifier", categorie: "commissions", temps: "9 min" },
  { titre: "Optimiser sa fiscalité en tant que créateur indépendant", categorie: "commissions", temps: "12 min" },
  { titre: "Comment négocier son contrat d'agence point par point", categorie: "commissions", temps: "14 min" },
  { titre: "Les obligations légales du créateur en 2026", categorie: "juridique", temps: "10 min" },
  { titre: "Portrait-robot d'une agence toxique : les 10 signaux", categorie: "commissions", temps: "9 min" },
];

const CATEGORIE_META: Record<string, { label: string; icon: typeof Image }> = {
  "image-strategie": { label: "Image &amp; stratégie", icon: Image },
  protection: { label: "Protection", icon: Shield },
  "ia-crm": { label: "IA &amp; CRM", icon: Sparkles },
  juridique: { label: "Juridique préparatoire", icon: Scale },
  departements: { label: "Départements", icon: LayoutGrid },
  commissions: { label: "Commissions", icon: Percent },
  "guides-plateformes": { label: "Guides plateformes", icon: BookOpen },
};

const FAQ = [
  { q: "Qui rédige les articles du blog WTF ?", r: "L'équipe éditoriale WTF, avec relecture par des spécialistes du domaine concerné (juristes pour les articles juridiques, consultants en stratégie pour les articles image, etc.)." },
  { q: "À quelle fréquence publiez-vous ?", r: "Nous publions un nouvel article par semaine en moyenne. Les articles sont evergreen et mis à jour régulièrement pour rester pertinents." },
  { q: "Puis-je proposer un sujet d'article ?", r: "Absolument. Utilisez le formulaire de contact avec le sujet «&nbsp;Proposition d'article&nbsp;». Nous lisons toutes les suggestions." },
  { q: "Les articles sont-ils gratuits ?", r: "Oui, tous les articles du blog WTF sont en accès libre et gratuit. Aucune inscription nécessaire." },
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

export function BlogClient() {
  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <ArticlesPrioritairesSection />
      <CalendrierEditorialSection />
      <LiensInternesSection />
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
          <CoutureEmblem size={28} color="var(--or)" />
        </motion.div>
        <motion.p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-6" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Éditorial
        </motion.p>
        <motion.h1 className="display-large mx-auto mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          Le journal WTF
        </motion.h1>
        <motion.p className="text-[1.15rem] leading-relaxed mx-auto" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic", maxWidth: 500 }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          Articles, guides et analyses pour les créateurs qui veulent comprendre et maîtriser leur activité. Sans promesses, sans raccourcis.
        </motion.p>
      </div>
    </section>
  );
}

function CategoriesSection() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 960, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Catégories
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Tous les sujets
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div key={cat.id} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08 + i * 0.04}>
                <div className="p-5 h-full" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(12,10,8,0.02)" }}>
                  <div className="w-9 h-9 flex items-center justify-center mb-3" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)" }}>
                    <Icon size={16} />
                  </div>
                  <h3 className="text-[13px] font-bold mb-2" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }} dangerouslySetInnerHTML={{ __html: cat.label }} />
                  <p className="text-[11px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.55, fontFamily: "var(--font-body), sans-serif" }}>{cat.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ArticlesPrioritairesSection() {
  const { ref, inView } = useReveal(0.04);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 880, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Articles prioritaires
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Les 10 articles essentiels
        </motion.h2>
        <div className="space-y-6">
          {ARTICLES_PRIORITAIRES.map((article, i) => {
            const catMeta = CATEGORIE_META[article.categorie];
            const CatIcon = catMeta?.icon || FileText;
            return (
              <motion.div key={article.slug} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.06 * i}>
                <div className="p-6" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(244,238,227,0.02)" }}>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.08em] px-2 py-0.5 flex items-center gap-1" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>
                      <CatIcon size={10} />
                      {catMeta?.label ? <span dangerouslySetInnerHTML={{ __html: catMeta.label }} /> : null}
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--pierre)", fontFamily: "var(--font-util), monospace" }}>{article.temps}</span>
                  </div>
                  <h3 className="text-[16px] font-bold mb-2" style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}>
                    <span className="text-[12px] mr-2" style={{ color: "var(--pierre)", fontFamily: "var(--font-util), monospace" }}>{(i + 1).toString().padStart(2, "0")}.</span>
                    {article.titre}
                  </h3>
                  <p className="text-[12px] leading-relaxed mb-4" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{article.description}</p>
                  <div className="mb-4 p-4" style={{ borderLeft: "2px solid var(--or)", background: "rgba(244,238,227,0.03)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] mb-2" style={{ color: "var(--pierre)", fontFamily: "var(--font-util), monospace" }}>Plan de l'article</p>
                    <ul className="space-y-1">
                      {article.plan.map((item, j) => (
                        <li key={j} className="text-[11px] leading-relaxed flex items-start gap-2" style={{ color: "var(--ivoire)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>
                          <span className="mt-1 w-1 h-1 shrink-0" style={{ background: "var(--or)", borderRadius: "50%" }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {article.lieInternes.map((lien, j) => (
                      <Link key={j} href={lien.href} className="inline-flex items-center gap-1 text-[10px] transition-colors duration-200" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        <ExternalLink size={9} />
                        {lien.label}
                      </Link>
                    ))}
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

function CalendrierEditorialSection() {
  const { ref, inView } = useReveal(0.04);
  const [afficherTout, setAfficherTout] = useState(false);
  const articlesVisibles = afficherTout ? IDEES_ARTICLES : IDEES_ARTICLES.slice(0, 15);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 880, margin: "0 auto" }}>
        <motion.div className="flex items-center gap-3 mb-4 justify-center" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          <Calendar size={14} style={{ color: "var(--or)" }} />
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em]" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>Calendrier éditorial</p>
        </motion.div>
        <motion.h2 className="display-medium mb-4 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          30 idées d'articles
        </motion.h2>
        <motion.p className="text-[1rem] leading-relaxed mb-8 text-center" style={{ color: "var(--encre)", opacity: 0.55, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          Notre calendrier éditorial evergreen. Chaque article est conçu pour rester pertinent sur la durée.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {articlesVisibles.map((idee, i) => {
            const catMeta = CATEGORIE_META[idee.categorie];
            const CatIcon = catMeta?.icon || FileText;
            return (
              <motion.div key={i} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.03 * Math.min(i, 15)}>
                <div className="flex items-start gap-3 p-3" style={{ border: "1px solid var(--ligne-faible)" }}>
                  <Lightbulb size={13} style={{ color: "var(--or)", flexShrink: 0, marginTop: 2 }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium leading-snug mb-1" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{idee.titre}</p>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-[9px]" style={{ color: "var(--pierre)", fontFamily: "var(--font-util), monospace" }}>
                        <CatIcon size={9} />
                        <span dangerouslySetInnerHTML={{ __html: catMeta?.label || "" }} />
                      </span>
                      <span className="text-[9px]" style={{ color: "var(--pierre)", fontFamily: "var(--font-util), monospace" }}>{idee.temps}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        {IDEES_ARTICLES.length > 15 && (
          <motion.div className="text-center mt-8" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.2}>
            <button
              type="button"
              onClick={() => setAfficherTout(!afficherTout)}
              className="text-[11px] font-medium uppercase tracking-[0.08em] transition-colors duration-200 inline-flex items-center gap-2"
              style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}
            >
              {afficherTout ? "Voir moins" : `Voir les ${IDEES_ARTICLES.length} idées`}
              <ChevronDown size={12} style={{ transform: afficherTout ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }} />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function LiensInternesSection() {
  const { ref, inView } = useReveal(0.1);
  const liens = [
    { label: "Atlas CRM", description: "CRM créateur pour gérer vos fans, vos revenus et votre croissance.", href: "/features" },
    { label: "WTF Lex", description: "Analyse et protection juridique préparatoire pour créateurs.", href: "/lex" },
    { label: "Protection", description: "Bouclier Légal, sécurité des comptes et contrats types.", href: "/protection" },
    { label: "Départements", description: "Guides par secteur : Glamour, Influence, Musique, Sport, YouTube.", href: "/departements" },
    { label: "Studio IA", description: "Suite de création de contenu assistée par IA.", href: "/studio" },
    { label: "Guides pratiques", description: "Guides evergreen pour maîtriser votre activité.", href: "/guides" },
  ];
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 780, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Explorer WTF
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Liens utiles
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {liens.map((lien, i) => (
            <motion.div key={lien.href} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08 + i * 0.04}>
              <Link href={lien.href} className="block p-5 h-full transition-all duration-200 group" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(244,238,227,0.02)" }}>
                <h3 className="text-[14px] font-bold mb-2 flex items-center gap-2" style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}>
                  {lien.label}
                  <ArrowRight size={12} style={{ color: "var(--or)", opacity: 0, transform: "translateX(-4px)", transition: "all 0.2s ease" }} className="group-hover:opacity-100 group-hover:translate-x-0" />
                </h3>
                <p className="text-[11px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{lien.description}</p>
              </Link>
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
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 40 }}>
      <div className="wrap-eco" style={{ maxWidth: 700, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Questions fréquentes
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Blog
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
          <CoutureEmblem size={24} color="var(--or)" />
        </motion.div>
        <motion.h2 className="display-medium mb-6" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Un sujet vous intéresse ?
        </motion.h2>
        <motion.p className="text-[1rem] leading-relaxed mb-8" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          Dites-nous quel sujet vous souhaitez voir traité dans le journal WTF.
        </motion.p>
        <motion.div variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          <Link href="/contact" className="btn-eco inline-flex items-center gap-2">
            Proposer un sujet
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
