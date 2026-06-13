import type { Metadata } from "next";
import { PlatformProtectionClient, type PlatformProtectionData } from "../PlatformProtectionClient";

export const metadata: Metadata = {
  title: "Protection Fansly pour créateurs, Where Talent Forms",
  description:
    "Conditions, bonnes pratiques et risques sur Fansly. Protégez votre compte, votre contenu et vos revenus avec notre guide complet.",
  openGraph: {
    title: "Protection Fansly, Guide créateur | Where Talent Forms",
    description:
      "CGU, droits des créateurs, risques et bonnes pratiques sur Fansly. Sécurisez votre compte et votre contenu.",
  },
};

const DATA: PlatformProtectionData = {
  id: "fansly",
  name: "Fansly",
  description:
    "Fansly est une alternative à OnlyFans avec ses propres règles. Comprendre les CGU pour protéger votre compte, votre contenu et vos revenus.",
  freshnessDate: "2025-11-01",
  risques: [
    { titre: "Partage de compte interdit", description: "Comme sur la plupart des plateformes, le partage de vos identifiants avec un tiers viole les CGU Fansly et expose votre compte à une suspension." },
    { titre: "Contenu non conforme aux CGU", description: "Les règles de contenu de Fansly peuvent différer de celles d'autres plateformes. Un contenu accepté ailleurs peut être refusé sur Fansly." },
    { titre: "Gestion des abonnements et chargebacks", description: "Les chargebacks (rétrofacturations) peuvent impacter vos revenus. Fansly a sa propre politique de protection contre les chargebacks." },
    { titre: "Évolutions des conditions d'utilisation", description: "Les CGU Fansly évoluent. Une fonctionnalité ou un type de contenu peut être restreint sans préavis." },
    { titre: "Vol de contenu et republication", description: "Le contenu exclusif publié sur Fansly peut être copié et diffusé sur d'autres sites sans votre consentement." },
    { titre: "Dépendance à une seule plateforme", description: "Concentrer toute votre activité sur une seule plateforme vous rend vulnérable à un changement de politique ou une suspension." },
  ],
  bonnesPratiques: [
    { titre: "Vérifiez votre compte avec votre propre identité", description: "Le titulaire vérifié est le seul reconnu par la plateforme. Ne laissez jamais un tiers vérifier un compte à votre place." },
    { titre: "Utilisez les niveaux d'abonnement (tiers) intelligemment", description: "Fansly permet de créer différents niveaux d'accès. Utilisez cette fonctionnalité pour segmenter votre contenu et limiter les risques." },
    { titre: "Activez toutes les sécurités disponibles", description: "2FA, vérification en deux étapes, notifications de connexion : activez tout ce que la plateforme propose." },
    { titre: "Gardez une copie locale de tous vos contenus", description: "Ne dépendez pas uniquement de Fansly pour la conservation de vos créations. Sauvegardez tout en local." },
    { titre: "Suivez les mises à jour des CGU", description: "Les conditions de Fansly évoluent. Consultez régulièrement les CGU ou utilisez le Journal des changements WTF." },
    { titre: "Diversifiez vos plateformes", description: "Ne mettez pas tous vos contenus sur une seule plateforme. Une présence multi-plateforme réduit votre risque global." },
  ],
  aDocumenter: [
    "Capture d'écran de votre page de vérification d'identité",
    "Relevés de revenus mensuels et par niveau d'abonnement",
    "Liste de vos abonnés par tier",
    "Toute communication avec le support Fansly",
    "Copies de vos contenus originaux avec dates",
    "Captures des CGU au moment de votre inscription et après chaque mise à jour",
  ],
  aNePasFaire: [
    "Ne partagez pas vos identifiants de connexion avec quiconque",
    "Ne laissez pas une agence gérer votre compte à votre place",
    "Ne publiez pas de contenu que vous n'avez pas créé vous-même",
    "Ne dépendez pas d'une seule plateforme pour tous vos revenus",
    "N'ignorez pas les emails officiels de Fansly concernant les CGU",
    "Ne publiez pas de contenu qui pourrait enfreindre les lois locales de vos abonnés",
  ],
  commentHaloAide: [
    "Veille CGU : nous surveillons les conditions de Fansly et vous alertons des changements",
    "Bouclier Légal : vérifiez si votre contrat d'agence contient des clauses abusives",
    "Documentation : conseils pour constituer un dossier de preuves en cas de litige",
    "Comparaison plateformes : nous vous aidons à comprendre les différences entre les CGU",
    "Lex AI : analysez vos contrats avant signature",
  ],
  checklist: [
    "Mon compte est vérifié avec ma propre pièce d'identité",
    "L'authentification à deux facteurs est activée",
    "Je conserve des copies locales de tous mes contenus",
    "Je documente mes revenus chaque mois",
    "J'ai lu les CGU Fansly dans leur dernière version",
    "Je diversifie ma présence sur plusieurs plateformes",
    "Mes niveaux d'abonnement sont configurés correctement",
    "Je connais la procédure de contact du support Fansly",
  ],
  faq: [
    { q: "Fansly est-il plus sûr qu'OnlyFans ?", r: "Les deux plateformes ont des approches différentes. Fansly propose des fonctionnalités de niveaux d'abonnement multiples. La sécurité dépend surtout de vos pratiques : 2FA, non-partage d'identifiants, documentation. Aucune plateforme n'est 'plus sûre' par nature." },
    { q: "Fansly protège-t-il contre les chargebacks ?", r: "Fansly a mis en place des mesures de protection contre les chargebacks, mais aucune plateforme ne peut les éliminer totalement. Consultez les CGU Fansly pour connaître leur politique actuelle en matière de rétrofacturations." },
    { q: "Puis-je utiliser le même contenu sur Fansly et OnlyFans ?", r: "Oui, vous restez propriétaire de votre contenu. Vérifiez cependant votre contrat d'agence : certaines agences incluent des clauses d'exclusivité qui pourraient vous empêcher de publier sur plusieurs plateformes." },
    { q: "Que faire si mon contenu est republié sans autorisation ?", r: "Signalez immédiatement à Fansly et déposez une notification DMCA auprès du site qui héberge le contenu. Documentez toutes les URLs de republication. Si la situation persiste, consultez un avocat." },
    { q: "Comment transférer mes abonnés vers Fansly ?", r: "La migration d'abonnés se fait par la communication sur vos réseaux sociaux existants. Ne partagez pas les données personnelles de vos abonnés sans leur consentement, c'est une obligation RGPD." },
  ],
  ctaLabel: "Analyser mon contrat",
  ctaLink: "/protection",
  ctaSecondaryLabel: "Comparer les plateformes",
  ctaSecondaryLink: "/protection/onlyfans",
  cguLink: "https://fansly.com/terms",
};

export default function FanslyPage() {
  return <PlatformProtectionClient data={DATA} />;
}
