import type { Metadata } from "next";
import { PlatformProtectionClient, type PlatformProtectionData } from "../PlatformProtectionClient";

export const metadata: Metadata = {
  title: "Protection MYM pour créateurs, Where Talent Forms",
  description:
    "Réglementation française, obligations légales et bonnes pratiques sur MYM. Protégez votre compte et votre contenu avec notre guide.",
  openGraph: {
    title: "Protection MYM, Guide créateur | Where Talent Forms",
    description:
      "CGU, droits des créateurs et spécificités de la réglementation française sur MYM. Sécurisez votre activité de créateur.",
  },
};

const DATA: PlatformProtectionData = {
  id: "mym",
  name: "MYM",
  description:
    "MYM est une plateforme française avec des obligations légales spécifiques. Comprendre vos droits et la réglementation applicable pour protéger votre activité.",
  freshnessDate: "2025-09-01",
  risques: [
    { titre: "Obligations légales françaises", description: "En tant que plateforme française, MYM est soumise à des obligations strictes (vérification d'âge, déclarations fiscales). Le non-respect peut avoir des conséquences juridiques pour vous." },
    { titre: "Statut fiscal du créateur", description: "Sur MYM, vos revenus sont imposables en France. Vous devez déclarer vos revenus correctement et choisir le bon statut (auto-entrepreneur, entreprise, etc.)." },
    { titre: "Partage de compte et usurpation", description: "Comme sur les autres plateformes, le partage d'identifiants est interdit. En cas de litige, le titulaire vérifié est le seul reconnu." },
    { titre: "Contenu et droit à l'image", description: "Le droit à l'image est particulièrement protégé en France. Toute utilisation non autorisée de votre image peut faire l'objet de poursuites." },
    { titre: "Évolution des conditions d'utilisation", description: "Les CGU de MYM évoluent, notamment en fonction des évolutions réglementaires françaises et européennes (DSA, RGPD)." },
    { titre: "Dépendance économique", description: "Concentrer tous vos revenus sur une seule plateforme, même française, présente un risque. Diversifiez vos sources de revenus." },
  ],
  bonnesPratiques: [
    { titre: "Choisissez le bon statut juridique", description: "Consultez un expert-comptable pour déterminer le statut le plus adapté à vos revenus MYM. Auto-entrepreneur, EURL, SASU : chaque statut a ses avantages et obligations." },
    { titre: "Déclarez vos revenus mensuellement ou trimestriellement", description: "En France, les revenus des plateformes doivent être déclarés. MYM fournit des relevés mais la responsabilité de la déclaration vous incombe." },
    { titre: "Protégez votre droit à l'image", description: "Le droit français protège fortement votre image. En cas d'utilisation non autorisée, vous disposez de recours juridiques efficaces. Documentez toute violation." },
    { titre: "Vérifiez votre compte avec votre identité réelle", description: "Ne laissez personne d'autre vérifier un compte à votre nom. C'est une obligation légale et une protection essentielle." },
    { titre: "Conservez tous vos justificatifs", description: "Relevés MYM, déclarations fiscales, correspondances : conservez tout pendant au moins 3 ans (délai de prescription fiscale)." },
    { titre: "Suivez l'actualité réglementaire", description: "Les obligations des plateformes évoluent avec la réglementation européenne (DSA, DMA) et française. Restez informé via le Journal des changements WTF." },
  ],
  aDocumenter: [
    "Relevés de revenus mensuels fournis par MYM",
    "Déclarations fiscales et accusés de réception",
    "Justificatifs de votre statut juridique (SIRET, etc.)",
    "Preuves de vérification d'identité sur la plateforme",
    "Correspondances avec le support MYM",
    "Toute utilisation non autorisée de votre image (captures, URLs)",
  ],
  aNePasFaire: [
    "Ne négligez pas vos obligations fiscales, les plateformes transmettent vos revenus à l'administration",
    "Ne partagez pas vos identifiants MYM avec un tiers",
    "Ne publiez pas de contenu mettant en scène des tiers sans leur consentement écrit",
    "Ne vous fiez pas uniquement à MYM pour la conservation de vos documents",
    "N'ignorez pas les communications officielles de MYM concernant les CGU",
    "Ne créez pas de compte sans avoir défini votre statut fiscal au préalable",
  ],
  commentHaloAide: [
    "Veille réglementaire : nous suivons les évolutions du DSA, du RGPD et de la réglementation française",
    "Bouclier Légal : analysez votre contrat d'agence pour identifier les clauses à risque",
    "Documentation : guides pour constituer un dossier de conformité",
    "Journal des changements : restez informé des modifications de CGU",
    "Lex AI : préparez vos contrats et vérifiez les clauses importantes",
  ],
  checklist: [
    "Mon statut juridique est adapté à mes revenus MYM",
    "Je déclare mes revenus régulièrement",
    "Mon compte est vérifié avec ma propre identité",
    "Je conserve tous mes justificatifs fiscaux",
    "J'ai activé l'authentification à deux facteurs",
    "Je documente mes revenus mensuels",
    "Je connais mes obligations sous le DSA et le RGPD",
    "J'ai un expert-comptable ou un conseiller fiscal identifié",
  ],
  faq: [
    { q: "Quel statut juridique choisir pour MYM en France ?", r: "Cela dépend de vos revenus. L'auto-entrepreneur est simple pour débuter (plafond de CA). Au-delà, une EURL ou SASU peut être plus adaptée. Consultez un expert-comptable, ce choix a des implications fiscales et sociales importantes." },
    { q: "MYM déclare-t-il mes revenus aux impôts ?", r: "MYM a l'obligation de transmettre certaines informations à l'administration fiscale française. Cependant, la déclaration de vos revenus reste de votre responsabilité. Ne comptez pas sur la plateforme pour vos obligations déclaratives." },
    { q: "Le droit à l'image français s'applique-t-il sur MYM ?", r: "Oui. MYM étant une plateforme française, le droit français s'applique pleinement. Vous bénéficiez d'une protection forte de votre image, mais vous devez aussi respecter le droit à l'image des personnes qui apparaissent dans vos contenus." },
    { q: "Comment gérer la TVA sur mes revenus MYM ?", r: "La question de la TVA dépend de votre statut et de votre chiffre d'affaires. Les auto-entrepreneurs bénéficient d'une franchise de TVA sous certains seuils. Au-delà, vous devez facturer et déclarer la TVA. Consultez un expert-comptable." },
    { q: "Puis-je utiliser MYM en parallèle d'OnlyFans ou Fansly ?", r: "Techniquement oui, mais vérifiez votre contrat d'agence : certaines clauses d'exclusivité peuvent vous l'interdire. Sans clause d'exclusivité, rien ne vous empêche d'être présent sur plusieurs plateformes." },
  ],
  ctaLabel: "Analyser mon contrat",
  ctaLink: "/protection",
  ctaSecondaryLabel: "Guide pratique",
  ctaSecondaryLink: "/protection/guide",
  cguLink: "https://mym.fans/terms",
};

export default function MYMPage() {
  return <PlatformProtectionClient data={DATA} />;
}
