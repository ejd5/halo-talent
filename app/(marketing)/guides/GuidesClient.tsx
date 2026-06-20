"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  ChevronDown,
  ArrowRight,
  BookOpen,
  Image as LucideImage,
  Shield,
  FileText,
  Users,
  FolderOpen,
  Building2,
  Sparkles,
  Clock,
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

const NIVEAU_LABELS: Record<string, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
  tous: "Tous niveaux",
};

type Guide = {
  id: string;
  titre: string;
  description: string;
  categorie: string;
  publicCible: string;
  niveau: string;
  temps: string;
  cta: { label: string; href: string };
};

type CategorieMeta = {
  id: string;
  label: string;
  description: string;
  icon: typeof BookOpen;
};

const CATEGORIES: CategorieMeta[] = [
  { id: "image", label: "Construire son image", description: "Positionnement, branding, direction artistique et stratégie de contenu.", icon: LucideImage },
  { id: "protection", label: "Protéger ses accès", description: "Sécurité des comptes, authentification, confidentialité numérique.", icon: Shield },
  { id: "contrats", label: "Comprendre les contrats", description: "Clauses, droits, obligations, négociation et sortie d'agence.", icon: FileText },
  { id: "communaute", label: "Gérer sa communauté", description: "Engagement, modération, fidélisation, service fans.", icon: Users },
  { id: "contenus", label: "Organiser ses contenus", description: "Calendrier éditorial, archivage, workflows et réutilisation.", icon: FolderOpen },
  { id: "agence", label: "Choisir une agence", description: "Critères, comparatifs, signaux d'alerte et alternatives.", icon: Building2 },
  { id: "ia", label: "Utiliser l'IA avec contrôle", description: "Création assistée, prompts, deepfakes, éthique et transparence.", icon: Sparkles },
];

const GUIDES: Guide[] = [
  {
    id: "construire-image-marque",
    titre: "Construire une image de marque mémorable",
    description: "Définissez votre identité visuelle, votre ton éditorial et votre positionnement pour vous démarquer durablement sur les plateformes.",
    categorie: "image",
    publicCible: "Créateurs qui débutent ou souhaitent rebrander leur présence.",
    niveau: "debutant",
    temps: "12 min",
    cta: { label: "Lire le guide", href: "/guides/construire-image-marque" },
  },
  {
    id: "strategie-reseaux-sociaux",
    titre: "Stratégie réseaux sociaux pour créateurs indépendants",
    description: "Choisir les bonnes plateformes, définir sa fréquence de publication et construire une audience cross-platform sans s'épuiser.",
    categorie: "image",
    publicCible: "Créateurs actifs sur 2 plateformes ou plus, cherchant à rationaliser leur présence.",
    niveau: "intermediaire",
    temps: "15 min",
    cta: { label: "Lire le guide", href: "/guides/strategie-reseaux-sociaux" },
  },
  {
    id: "securite-comptes-createurs",
    titre: "Sécuriser vos comptes de créateur en 10 étapes",
    description: "Guide pratique : 2FA, mots de passe, vérification des tiers, prévention du phishing et plans de récupération.",
    categorie: "protection",
    publicCible: "Tout créateur ayant des comptes sur des plateformes de contenu.",
    niveau: "tous",
    temps: "10 min",
    cta: { label: "Lire le guide", href: "/guides/securite-comptes-createurs" },
  },
  {
    id: "protection-identite-numerique",
    titre: "Protéger votre identité numérique",
    description: "Séparation vie pro / vie perso, WHOIS privé, alias email, prévention du doxxing et bonnes pratiques de discrétion.",
    categorie: "protection",
    publicCible: "Créateurs exposés souhaitant maîtriser leur empreinte numérique.",
    niveau: "tous",
    temps: "10 min",
    cta: { label: "Lire le guide", href: "/guides/protection-identite-numerique" },
  },
  {
    id: "clauses-essentielles-contrat",
    titre: "Les 10 clauses essentielles d'un contrat de management",
    description: "Durée, exclusivité, commission, propriété des comptes, résiliation : décryptage clause par clause.",
    categorie: "contrats",
    publicCible: "Créateurs qui signent ou renégocient un contrat d'agence.",
    niveau: "intermediaire",
    temps: "14 min",
    cta: { label: "Lire le guide", href: "/guides/clauses-essentielles-contrat" },
  },
  {
    id: "negocier-sortie-agence",
    titre: "Négocier sa sortie d'agence sans conflit",
    description: "Préparer son départ, communiquer proprement, récupérer ses accès et éviter les représailles juridiques.",
    categorie: "contrats",
    publicCible: "Créateurs souhaitant quitter leur agence actuelle dans de bonnes conditions.",
    niveau: "avance",
    temps: "16 min",
    cta: { label: "Lire le guide", href: "/guides/negocier-sortie-agence" },
  },
  {
    id: "engager-communaute",
    titre: "Engager sa communauté sans s'épuiser",
    description: "Stratégies de conversation, rituels de communauté, gestion des trolls et équilibre entre distance et proximité.",
    categorie: "communaute",
    publicCible: "Créateurs avec une communauté active cherchant à mieux gérer les interactions.",
    niveau: "intermediaire",
    temps: "11 min",
    cta: { label: "Lire le guide", href: "/guides/engager-communaute" },
  },
  {
    id: "monetiser-fans-fideliser",
    titre: "Monétiser sans pression : fidéliser vos fans sur la durée",
    description: "Stratégies de rétention, offres progressives, événements communautaires et programmes de fidélité.",
    categorie: "communaute",
    publicCible: "Créateurs cherchant à augmenter la valeur vie de leurs abonnés.",
    niveau: "intermediaire",
    temps: "13 min",
    cta: { label: "Lire le guide", href: "/guides/monetiser-fans-fideliser" },
  },
  {
    id: "calendrier-editorial-efficace",
    titre: "Créer un calendrier éditorial efficace",
    description: "Planification mensuelle, thèmes, séries, recyclage de contenu et outils pour automatiser sans perdre en authenticité.",
    categorie: "contenus",
    publicCible: "Créateurs voulant structurer leur production de contenu.",
    niveau: "debutant",
    temps: "10 min",
    cta: { label: "Lire le guide", href: "/guides/calendrier-editorial-efficace" },
  },
  {
    id: "reutiliser-contenu",
    titre: "Réutiliser son contenu sans se répéter",
    description: "Comment décliner un même contenu sur 5 plateformes, adapter les formats et prolonger la durée de vie de chaque création.",
    categorie: "contenus",
    publicCible: "Créateurs multi-plateformes cherchant à optimiser leur production.",
    niveau: "intermediaire",
    temps: "12 min",
    cta: { label: "Lire le guide", href: "/guides/reutiliser-contenu" },
  },
  {
    id: "reconnaitre-bonne-agence",
    titre: "Reconnaître une bonne agence en 8 signaux",
    description: "Transparence, références vérifiables, contrat-type, sortie facile : les critères objectifs pour choisir votre agence.",
    categorie: "agence",
    publicCible: "Créateurs à la recherche d'un management pour la première fois.",
    niveau: "debutant",
    temps: "12 min",
    cta: { label: "Lire le guide", href: "/guides/reconnaitre-bonne-agence" },
  },
  {
    id: "signaux-alerte-agence",
    titre: "Les 7 signaux d'alerte d'une agence toxique",
    description: "Frais cachés, clauses abusives, absence de reporting, pression psychologique : apprenez à repérer les drapeaux rouges avant de signer.",
    categorie: "agence",
    publicCible: "Créateurs en négociation avec une agence ou en cours de contrat.",
    niveau: "tous",
    temps: "11 min",
    cta: { label: "Lire le guide", href: "/guides/signaux-alerte-agence" },
  },
  {
    id: "ia-creation-contenu",
    titre: "IA et création de contenu : le guide complet",
    description: "Génération texte, image, vidéo : ce que l'IA peut faire pour vous, ce qu'elle ne peut pas, et comment garder le contrôle créatif.",
    categorie: "ia",
    publicCible: "Créateurs curieux d'intégrer l'IA dans leur workflow sans perdre leur authenticité.",
    niveau: "tous",
    temps: "15 min",
    cta: { label: "Lire le guide", href: "/guides/ia-creation-contenu" },
  },
  {
    id: "deepfakes-protection-createurs",
    titre: "Deepfakes et créateurs : se protéger et réagir",
    description: "Comprendre la menace, détecter les deepfakes, faire valoir ses droits, et les outils juridiques à votre disposition.",
    categorie: "ia",
    publicCible: "Tout créateur exposé au risque d'usurpation d'identité numérique.",
    niveau: "tous",
    temps: "14 min",
    cta: { label: "Lire le guide", href: "/guides/deepfakes-protection-createurs" },
  },
];

const FAQ = [
  { q: "Ces guides sont-ils gratuits ?", r: "Oui, tous les guides du hub WTF sont en accès libre et gratuit. Aucune inscription n'est nécessaire pour les consulter." },
  { q: "Les guides sont-ils rédigés par des experts ?", r: "Ils sont produits par l'équipe éditoriale WTF, avec relecture par des spécialistes du domaine (juristes pour les guides contrats, consultants en stratégie pour les guides image, etc.)." },
  { q: "De nouveaux guides sont-ils ajoutés régulièrement ?", r: "Oui. Nous publions un à deux nouveaux guides par mois. Les guides existants sont mis à jour dès qu'un changement réglementaire ou sectoriel le nécessite." },
  { q: "Puis-je suggérer un sujet de guide ?", r: "Absolument. Utilisez le formulaire de contact en précisant «&nbsp;Suggestion de guide&nbsp;» comme sujet. Nous étudions chaque proposition." },
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

export function GuidesClient() {
  return (
    <main>
      <HeroSection />
      <CategoriesOverviewSection />
      <GuidesByCategorySection />
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
          Ressources
        </motion.p>
        <motion.h1 className="display-large mx-auto mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          Guides pratiques pour créateurs
        </motion.h1>
        <motion.p className="text-[1.15rem] leading-relaxed mx-auto" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic", maxWidth: 460 }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          Des guides evergreen, rédigés par des experts, pour maîtriser tous les aspects de votre activité de créateur.
        </motion.p>
      </div>
    </section>
  );
}

function CategoriesOverviewSection() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 50 }}>
      <div className="wrap-eco" style={{ maxWidth: 960, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Catégories
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Tous les sujets couverts
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
                  <h3 className="text-[13px] font-bold mb-2" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{cat.label}</h3>
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

function GuidesByCategorySection() {
  const { ref, inView } = useReveal(0.04);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 40, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 880, margin: "0 auto" }}>
        {CATEGORIES.map((cat, ci) => {
          const guides = GUIDES.filter((g) => g.categorie === cat.id);
          if (guides.length === 0) return null;
          const Icon = cat.icon;
          return (
            <motion.div key={cat.id} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.05 * ci} style={{ marginBottom: 48 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 flex items-center justify-center" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)" }}>
                  <Icon size={13} />
                </div>
                <h3 className="text-[15px] font-bold" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{cat.label}</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {guides.map((guide, gi) => (
                  <motion.div key={guide.id} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.05 * ci + 0.03 * gi}>
                    <GuideCard guide={guide} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function GuideCard({ guide }: { guide: Guide }) {
  return (
    <div className="p-5" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(12,10,8,0.015)" }}>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h4 className="text-[14px] font-bold" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{guide.titre}</h4>
            <span className="text-[9px] font-semibold uppercase tracking-[0.08em] px-2 py-0.5" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)", fontFamily: "var(--font-util), monospace", whiteSpace: "nowrap" }}>
              {NIVEAU_LABELS[guide.niveau]}
            </span>
            <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--pierre)", fontFamily: "var(--font-util), monospace" }}>
              <Clock size={10} />
              {guide.temps}
            </span>
          </div>
          <p className="text-[12px] leading-relaxed mb-3" style={{ color: "var(--encre)", opacity: 0.55, fontFamily: "var(--font-body), sans-serif" }}>{guide.description}</p>
          <p className="text-[11px] leading-relaxed mb-3" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif", fontStyle: "italic" }}>
            Pour : {guide.publicCible}
          </p>
        </div>
        <Link
          href={guide.cta.href}
          className="flex items-center gap-2 text-[12px] font-medium shrink-0 self-start px-4 py-2 transition-colors duration-300"
          style={{
            color: "var(--ivoire)",
            backgroundColor: "var(--encre)",
            border: "1px solid var(--encre)",
            fontFamily: "var(--font-util), monospace",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            whiteSpace: "nowrap",
          }}
        >
          {guide.cta.label}
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}

function FAQSection_() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 700, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Questions fréquentes
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Guides
        </motion.h2>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <motion.div key={i} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1 + i * 0.05}>
              <FAQItem q={item.q} r={item.r} fond="encre" />
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
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 110 }}>
      <div className="wrap-eco text-center" style={{ maxWidth: 520, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          <Image src="/wtf-logo-rond.png" alt="WTF Talent" width={120} height={120} style={{ height: 120, width: "auto" }} />
        </motion.div>
        <motion.h2 className="display-medium mb-6" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Un sujet que vous ne trouvez pas ?
        </motion.h2>
        <motion.p className="text-[1rem] leading-relaxed mb-8" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          Dites-nous quel sujet vous intéresse et notre équipe éditoriale l'étudiera pour un prochain guide.
        </motion.p>
        <motion.div variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          <Link href="/contact" className="btn-eco inline-flex items-center gap-2">
            Suggérer un sujet
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
