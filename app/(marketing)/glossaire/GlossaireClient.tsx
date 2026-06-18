"use client";

import { useRef, useState, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Search, ArrowRight, X, BookOpen } from "lucide-react";

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

type GlossaireEntry = {
  terme: string;
  lettre: string;
  definition: string;
  importance: string;
  exemple: string;
  lien: { label: string; href: string };
};

const GLOSSAIRE: GlossaireEntry[] = [
  {
    terme: "Audit log",
    lettre: "A",
    definition: "Journal chronologique de tous les accès et actions effectués sur un compte ou une plateforme. Chaque connexion, modification ou téléchargement est enregistré avec la date, l'heure et l'adresse IP.",
    importance: "L'audit log permet de détecter une connexion suspecte, de prouver un accès non autorisé, et de garder une trace en cas de litige avec une agence ou un tiers.",
    exemple: "Vous recevez une alerte WTF vous indiquant une connexion à votre compte depuis un pays étranger à 3h du matin. L'audit log confirme l'intrusion et vous permet de réagir immédiatement.",
    lien: { label: "Sécurité WTF", href: "/security" },
  },
  {
    terme: "CHATEENG",
    lettre: "C",
    definition: "Assistant conversationnel WTF qui aide les créateurs à gérer leurs conversations avec les fans : réponses personnalisées, détection des intentions d'achat, relances automatiques et vérification de conformité (Tone Guard).",
    importance: "Le CHATEENG réduit le temps passé en messages de 60 à 80%, tout en augmentant le taux de conversion des conversations en ventes, grâce à des réponses plus rapides et mieux ciblées.",
    exemple: "Un fan demande un contenu personnalisé. Le CHATEENG détecte l'intention d'achat, propose un prix adapté au profil du fan, et rédige une réponse dans le ton du créateur.",
    lien: { label: "CHATEENG WTF", href: "/chat-ai" },
  },
  {
    terme: "Commission",
    lettre: "C",
    definition: "Pourcentage des revenus d'un créateur prélevé par une agence, une maison de management ou une plateforme en échange de services. Peut être forfaitaire (ex: 50% sur tout) ou marginale (taux dégressif par tranche).",
    importance: "La structure de commission détermine vos revenus nets. Une commission marginale comme celle de WTF (30% à 10%) peut vous faire économiser des dizaines de milliers d'euros par an par rapport à un forfait 50%.",
    exemple: "Sur 100 000 € de revenus annuels, la commission WTF est d'environ 17 750 € (17,75% effectif). Avec une agence à 50%, vous paieriez 50 000 €.",
    lien: { label: "Simuler ma commission", href: "/pricing" },
  },
  {
    terme: "Consentement",
    lettre: "C",
    definition: "Accord explicite, libre et éclairé d'une personne pour l'utilisation de son image, de ses données ou de son contenu. Dans le contexte OFM, le consentement est crucial pour tout contenu impliquant un tiers.",
    importance: "Publier du contenu impliquant une autre personne sans son consentement écrit peut entraîner des poursuites judiciaires, la suppression du contenu, voire la suspension du compte.",
    exemple: "Avant de publier une collaboration avec un autre créateur, WTF recommande de signer un formulaire de consentement écrit précisant l'étendue de l'utilisation, la durée et les plateformes concernées.",
    lien: { label: "Protection juridique", href: "/protection" },
  },
  {
    terme: "Content Vault",
    lettre: "C",
    definition: "Coffre-fort numérique sécurisé où les créateurs stockent, organisent et retrouvent tous leurs contenus (photos, vidéos, textes) avec métadonnées, tags et dates.",
    importance: "Un Content Vault évite la perte de contenu en cas de suppression de compte, simplifie la réutilisation de contenus anciens, et constitue une preuve de propriété en cas de litige.",
    exemple: "Vous recherchez une photo publiée il y a 8 mois pour la réutiliser. Avec le Content Vault WTF, vous la trouvez en 3 secondes grâce aux tags et à la recherche visuelle.",
    lien: { label: "Studio IA WTF", href: "/studio" },
  },
  {
    terme: "Contrat de collaboration",
    lettre: "C",
    definition: "Accord écrit entre un créateur et une marque, une agence ou un autre créateur, définissant les conditions d'une collaboration : livrables, rémunération, droits d'utilisation, durée, exclusivité.",
    importance: "Un contrat clair protège les deux parties. Sans contrat, les malentendus sur la rémunération, les droits d'image ou les délais sont fréquents et difficiles à résoudre.",
    exemple: "Une marque vous propose 2 000 € pour 3 stories Instagram. Le contrat précise : stories de 24h, mention #partenariat, droit d'utilisation limité à 30 jours, pas de sous-licence.",
    lien: { label: "Lex, Analyse de contrats", href: "/lex" },
  },
  {
    terme: "Creator OS",
    lettre: "C",
    definition: "Système d'exploitation du créateur : l'ensemble des outils, workflows, automatisations et tableaux de bord qui structurent l'activité quotidienne d'un créateur indépendant.",
    importance: "Un Creator OS bien structuré fait gagner 10 à 20 heures par semaine en éliminant les tâches répétitives et en centralisant l'information. C'est la différence entre un hobby et une entreprise.",
    exemple: "Le Creator OS WTF intègre : Studio IA (création), Atlas CRM (fans et marketing), WTF Lex (juridique), et un dashboard de pilotage. Le tout synchronisé.",
    lien: { label: "Découvrir WTF", href: "/" },
  },
  {
    terme: "CRM créateur",
    lettre: "C",
    definition: "Outil de gestion de la relation fans (Customer Relationship Management) conçu spécifiquement pour les créateurs de contenu. Centralise les données fans, l'historique des interactions, les achats et les préférences.",
    importance: "Un CRM créateur permet de segmenter vos fans, personnaliser vos offres, détecter les risques de désabonnement et automatiser les relances, augmentant significativement vos revenus.",
    exemple: "Atlas CRM vous montre que 15% de vos abonnés n'ont jamais acheté de PPV. Vous leur envoyez une offre de bienvenue ciblée avec 30% de réduction. Taux de conversion : 22%.",
    lien: { label: "Atlas CRM", href: "/features" },
  },
  {
    terme: "Droit d'image",
    lettre: "D",
    definition: "Droit fondamental qui protège toute personne contre l'utilisation non autorisée de son image (photo, vidéo, reproduction). Toute publication de l'image d'une personne nécessite son consentement.",
    importance: "Pour un créateur, le droit d'image joue dans les deux sens : vous devez protéger votre propre image contre les usurpations, et obtenir l'autorisation des personnes que vous filmez ou photographiez.",
    exemple: "Un compte pirate utilise vos photos pour créer un faux compte. Vous pouvez exiger le retrait immédiat sur la base du droit à l'image et, si nécessaire, engager une procédure.",
    lien: { label: "Protection juridique", href: "/protection" },
  },
  {
    terme: "Exclusivité",
    lettre: "E",
    definition: "Clause contractuelle qui interdit à un créateur de travailler avec d'autres plateformes, agences ou marques pendant la durée du contrat, et parfois au-delà (clause de non-concurrence post-contractuelle).",
    importance: "L'exclusivité peut limiter vos revenus et votre liberté. Une clause de non-concurrence supérieure à 6 mois ou sans contrepartie financière est généralement considérée comme abusive.",
    exemple: "Votre contrat d'agence vous interdit de publier sur une autre plateforme pendant 2 ans après la rupture. Cette clause est probablement nulle car disproportionnée et sans contrepartie.",
    lien: { label: "Bouclier Légal", href: "/protection" },
  },
  {
    terme: "Fan Brain",
    lettre: "F",
    definition: "Module d'intelligence artificielle d'Atlas CRM qui analyse en continu le comportement des fans pour identifier des patterns : intentions d'achat, signaux de désabonnement, fans les plus rentables.",
    importance: "Fan Brain transforme des données brutes en actions concrètes. Il vous dit quoi faire (relancer tel fan, proposer tel PPV) plutôt que de vous noyer dans des tableaux de chiffres.",
    exemple: "Fan Brain détecte qu'un fan habituellement très actif n'a plus interagi depuis 12 jours. Il vous suggère de lui envoyer un message personnalisé avec une offre spéciale.",
    lien: { label: "Atlas CRM, Revenue Radar", href: "/features" },
  },
  {
    terme: "Management créateur",
    lettre: "M",
    definition: "Activité de conseil et d'accompagnement d'un créateur de contenu par une agence ou une maison de management. Couvre la stratégie de carrière, la négociation de partenariats, la gestion administrative et la protection juridique.",
    importance: "Un bon management libère le créateur des tâches non-créatives pour qu'il se concentre sur son contenu. Un mauvais management peut capter la majorité des revenus sans apporter de valeur.",
    exemple: "Where Talent Forms propose un management à commission marginale dégressive, avec des services clairement listés dans un contrat-type transparent, sans frais cachés.",
    lien: { label: "Découvrir Where Talent Forms", href: "/qui-sommes-nous" },
  },
  {
    terme: "Pack à la carte",
    lettre: "P",
    definition: "Offre modulaire où le créateur choisit les services dont il a besoin, sans être obligé de souscrire à un package complet. Chaque service est tarifé individuellement ou par combinaison.",
    importance: "Le pack à la carte évite de payer pour des services dont vous n'avez pas besoin. Vous pouvez commencer avec un seul module (ex: Studio IA) et ajouter des services au fur et à mesure.",
    exemple: "Avec WTF, vous pouvez choisir uniquement Studio IA (création de contenu), ou uniquement Atlas CRM (gestion fans), ou les deux. Chaque module a son propre plan tarifaire.",
    lien: { label: "Offres WTF", href: "/pricing" },
  },
  {
    terme: "Plateforme",
    lettre: "P",
    definition: "Service en ligne qui héberge le contenu des créateurs et gère la relation avec les abonnés (abonnements, paiements, messagerie). Les principales plateformes sont OnlyFans, MYM et Fansly.",
    importance: "Dépendre d'une seule plateforme est un risque : un changement de conditions, une suspension de compte ou une panne peut couper tous vos revenus du jour au lendemain.",
    exemple: "Un créateur présent uniquement sur OnlyFans voit son compte suspendu sans préavis. Avec une stratégie multi-plateforme et un Content Vault externe, il aurait pu continuer son activité ailleurs.",
    lien: { label: "Sécurité des comptes", href: "/security" },
  },
  {
    terme: "PPV Copilot",
    lettre: "P",
    definition: "Assistant intelligent d'Atlas CRM qui optimise les ventes de contenus payants (Pay Per View). Il analyse le profil de chaque fan et suggère le contenu, le prix et le moment idéal pour proposer un PPV.",
    importance: "Le PPV Copilot augmente le revenu par fan en personnalisant les offres. Plutôt que d'envoyer le même PPV à tout le monde, il adapte le prix et le contenu au profil et à l'historique de chaque fan.",
    exemple: "Le PPV Copilot suggère de proposer votre vidéo premium à 49 € aux fans qui ont déjà acheté un PPV, et une version à 29 € à ceux qui n'en ont jamais acheté.",
    lien: { label: "Atlas CRM", href: "/features" },
  },
  {
    terme: "Reporting",
    lettre: "R",
    definition: "Ensemble des tableaux de bord, graphiques et indicateurs qui permettent au créateur de suivre ses performances : revenus, abonnés, engagement, taux de conversion, tendances.",
    importance: "Sans reporting, vous pilotez votre activité à l'aveugle. Un bon reporting vous aide à identifier ce qui fonctionne, ce qui décline, et où concentrer vos efforts.",
    exemple: "Le dashboard WTF vous montre que vos revenus PPV ont augmenté de 35% ce mois-ci grâce à la nouvelle stratégie de prix suggérée par le PPV Copilot.",
    lien: { label: "Dashboard WTF", href: "/dashboard" },
  },
  {
    terme: "Segmentation",
    lettre: "S",
    definition: "Technique marketing qui consiste à diviser votre base de fans en groupes homogènes selon des critères pertinents : niveau de dépense, ancienneté, fréquence d'interaction, préférences de contenu.",
    importance: "La segmentation permet d'envoyer le bon message au bon fan au bon moment. Les campagnes segmentées génèrent en moyenne 2 à 3 fois plus de revenus que les campagnes non ciblées.",
    exemple: "Vous segmentez vos fans en 3 groupes : nouveaux abonnés (&lt;30j), fans actifs, fans dormants (&gt;30j sans achat). Chaque groupe reçoit une offre et un message différents.",
    lien: { label: "Atlas CRM", href: "/features" },
  },
  {
    terme: "Shadowban",
    lettre: "S",
    definition: "Restriction invisible imposée par une plateforme à un compte, qui limite sa visibilité sans que le créateur en soit informé. Le contenu continue d'apparaître sur le profil mais n'est plus recommandé aux non-abonnés.",
    importance: "Le shadowban peut réduire drastiquement la croissance d'un compte sans explication. Les causes sont souvent opaques : contenu jugé sensible, liens externes, pics d'activité suspects.",
    exemple: "Vos nouveaux posts reçoivent soudainement 80% de vues en moins, alors que vos abonnés n'ont pas changé. Vous pourriez être shadowban. Vérifiez vos analytics et espacez vos publications.",
    lien: { label: "Sécurité des comptes", href: "/security" },
  },
  {
    terme: "Sécurité compte",
    lettre: "S",
    definition: "Ensemble des mesures qui protègent les comptes d'un créateur contre les intrusions : authentification à deux facteurs (2FA), mots de passe forts, vérification régulière des appareils connectés, alertes de connexion.",
    importance: "Un compte piraté peut entraîner la perte de revenus, le vol de contenu, l'usurpation d'identité, voire le chantage. La sécurité des comptes est la première ligne de défense du créateur.",
    exemple: "Activez la 2FA sur tous vos comptes (OnlyFans, MYM, Instagram, email). WTF recommande d'utiliser une clé de sécurité physique (YubiKey) pour les comptes à forts revenus.",
    lien: { label: "Guide sécurité WTF", href: "/security" },
  },
  {
    terme: "Studio IA",
    lettre: "S",
    definition: "Suite intégrée de création de contenu assistée par intelligence artificielle de WTF. Permet de générer, éditer et publier du texte, des images, des vidéos et de l'audio depuis une interface unique.",
    importance: "Le Studio IA réduit le temps de production de contenu tout en maintenant la qualité et la cohérence de votre identité visuelle, grâce à l'ADN Créatif qui personnalise chaque génération.",
    exemple: "Vous voulez publier 3 posts cette semaine. Vous décrivez l'idée dans le Studio IA, qui génère 5 variantes d'images, 3 légendes et 2 stories dans votre style visuel.",
    lien: { label: "Studio IA WTF", href: "/studio" },
  },
];

const LETTRES = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function GlossaireClient() {
  const [recherche, setRecherche] = useState("");
  const [lettreActive, setLettreActive] = useState<string | null>(null);

  const resultats = useMemo(() => {
    let filtres = GLOSSAIRE;
    if (lettreActive) {
      filtres = filtres.filter((e) => e.lettre === lettreActive);
    }
    if (recherche.trim()) {
      const q = recherche.toLowerCase();
      filtres = filtres.filter(
        (e) =>
          e.terme.toLowerCase().includes(q) ||
          e.definition.toLowerCase().includes(q) ||
          e.importance.toLowerCase().includes(q)
      );
    }
    return filtres;
  }, [recherche, lettreActive]);

  const lettresDisponibles = useMemo(
    () => LETTRES.filter((l) => l === "#" || GLOSSAIRE.some((e) => e.lettre === l)),
    []
  );

  return (
    <main>
      <HeroSection />
      <NavigationSection
        lettres={lettresDisponibles}
        lettreActive={lettreActive}
        setLettreActive={setLettreActive}
        recherche={recherche}
        setRecherche={setRecherche}
      />
      <ResultatsSection resultats={resultats} recherche={recherche} lettreActive={lettreActive} />
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
          <img src="/wtf-logo-rond.png" alt="WTF Talent" style={{ height: 140, width: "auto" }} />
        </motion.div>
        <motion.p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-6" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Référence
        </motion.p>
        <motion.h1 className="display-large mx-auto mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          Glossaire du créateur
        </motion.h1>
        <motion.p className="text-[1.15rem] leading-relaxed mx-auto" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic", maxWidth: 460 }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          Tous les termes et concepts essentiels pour comprendre et maîtriser votre activité de créateur. De A à Z.
        </motion.p>
      </div>
    </section>
  );
}

function NavigationSection({
  lettres,
  lettreActive,
  setLettreActive,
  recherche,
  setRecherche,
}: {
  lettres: string[];
  lettreActive: string | null;
  setLettreActive: (l: string | null) => void;
  recherche: string;
  setRecherche: (s: string) => void;
}) {
  const { ref, inView } = useReveal(0.15);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 60, paddingBottom: 30 }}>
      <div className="wrap-eco" style={{ maxWidth: 820, margin: "0 auto" }}>
        <motion.div className="mb-8" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          <div className="relative max-w-md mx-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--pierre)" }} />
            <input
              type="text"
              placeholder="Rechercher un terme..."
              value={recherche}
              onChange={(e) => {
                setRecherche(e.target.value);
                if (e.target.value) setLettreActive(null);
              }}
              className="w-full text-[13px] py-3 pl-9 pr-9 outline-none transition-colors duration-200"
              style={{
                backgroundColor: "rgba(12,10,8,0.03)",
                border: "1px solid var(--ligne-faible)",
                color: "var(--encre)",
                fontFamily: "var(--font-body), sans-serif",
              }}
            />
            {recherche && (
              <button
                type="button"
                onClick={() => setRecherche("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--pierre)" }}
              >
                <X size={13} />
              </button>
            )}
          </div>
        </motion.div>
        <motion.div className="flex flex-wrap justify-center gap-1" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          {lettres.map((lettre) => {
            const isActive = lettreActive === lettre;
            return (
              <button
                key={lettre}
                type="button"
                onClick={() => {
                  setLettreActive(isActive ? null : lettre);
                  if (recherche) setRecherche("");
                }}
                className="w-8 h-8 text-[11px] font-semibold transition-all duration-200"
                style={{
                  backgroundColor: isActive ? "var(--encre)" : "transparent",
                  color: isActive ? "var(--ivoire)" : "var(--encre)",
                  border: isActive ? "1px solid var(--encre)" : "1px solid var(--ligne-faible)",
                  fontFamily: "var(--font-util), monospace",
                  opacity: isActive ? 1 : 0.6,
                }}
              >
                {lettre}
              </button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function ResultatsSection({
  resultats,
  recherche,
  lettreActive,
}: {
  resultats: GlossaireEntry[];
  recherche: string;
  lettreActive: string | null;
}) {
  const { ref, inView } = useReveal(0.04);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 30, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 780, margin: "0 auto" }}>
        {resultats.length > 0 ? (
          <div className="space-y-6">
            {resultats.map((entree, i) => (
              <motion.div key={entree.terme} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.03 * i}>
                <div className="p-6" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(12,10,8,0.01)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-7 h-7 flex items-center justify-center text-[10px] font-bold shrink-0" style={{ background: "rgba(216,169,91,0.12)", color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>
                      {entree.lettre}
                    </span>
                    <h3 className="text-[16px] font-bold" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{entree.terme}</h3>
                  </div>
                  <p className="text-[13px] leading-relaxed mb-3" style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }}>{entree.definition}</p>
                  <div className="mb-3 p-4" style={{ borderLeft: "2px solid var(--or)", background: "rgba(216,169,91,0.03)" }}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-1" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>Pourquoi c'est important</p>
                    <p className="text-[12px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>{entree.importance}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-1" style={{ color: "var(--pierre)", fontFamily: "var(--font-util), monospace" }}>Exemple</p>
                    <p className="text-[12px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.55, fontFamily: "var(--font-body), sans-serif", fontStyle: "italic" }}>{entree.exemple}</p>
                  </div>
                  <Link href={entree.lien.href} className="inline-flex items-center gap-2 text-[11px] font-medium transition-colors duration-200" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    <BookOpen size={11} />
                    {entree.lien.label}
                    <ArrowRight size={11} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div className="text-center py-16" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
            <p className="text-[14px]" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }}>
              Aucun résultat pour «&nbsp;{recherche || lettreActive}&nbsp;»
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function CTASection() {
  const { ref, inView } = useReveal(0.2);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 110 }}>
      <div className="wrap-eco text-center" style={{ maxWidth: 520, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          <img src="/wtf-logo-rond.png" alt="WTF Talent" style={{ height: 120, width: "auto" }} />
        </motion.div>
        <motion.h2 className="display-medium mb-6" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Un terme manque au glossaire ?
        </motion.h2>
        <motion.p className="text-[1rem] leading-relaxed mb-8" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          Dites-nous quel terme vous souhaitez voir expliqué et notre équipe éditoriale l'ajoutera au glossaire.
        </motion.p>
        <motion.div variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          <Link href="/contact" className="btn-eco inline-flex items-center gap-2">
            Suggérer un terme
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
