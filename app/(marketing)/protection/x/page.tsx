import type { Metadata } from "next";
import { PlatformProtectionClient, type PlatformProtectionData } from "../PlatformProtectionClient";

export const metadata: Metadata = {
  title: "Protection X (Twitter) pour créateurs, Where Talent Forms",
  description:
    "Conditions, monétisation et droits des créateurs sur X (Twitter). Protégez votre compte et votre contenu avec notre guide complet.",
  openGraph: {
    title: "Protection X (Twitter), Guide créateur | Where Talent Forms",
    description:
      "CGU, droits des créateurs, monétisation et bonnes pratiques sur X. Sécurisez votre compte et votre audience.",
  },
};

const DATA: PlatformProtectionData = {
  id: "x",
  name: "X (Twitter)",
  description:
    "X (anciennement Twitter) a considérablement fait évoluer ses conditions d'utilisation et ses outils de monétisation. Comprendre ces changements pour protéger votre compte et vos revenus.",
  freshnessDate: "2026-01-15",
  risques: [
    { titre: "Changements fréquents des CGU", description: "X modifie régulièrement ses conditions d'utilisation et ses politiques de contenu. Des fonctionnalités peuvent apparaître ou disparaître sans préavis." },
    { titre: "Suspension ou restriction de compte", description: "La modération de X peut entraîner des suspensions ou des restrictions de visibilité (shadowban). Les critères de décision ne sont pas toujours transparents." },
    { titre: "Usurpation d'identité", description: "Les comptes parodiques ou usurpateurs sont fréquents sur X. L'usurpation d'identité d'un créateur peut nuire à votre réputation et à vos revenus." },
    { titre: "Monétisation instable", description: "Les programmes de partage de revenus publicitaires de X ont des critères d'éligibilité qui évoluent. Les paiements peuvent varier considérablement." },
    { titre: "Harcèlement et brigading", description: "Les créateurs peuvent être la cible de campagnes de harcèlement coordonnées. Les outils de protection de X existent mais leur efficacité est variable." },
    { titre: "Contenu repris sans attribution", description: "Vos publications peuvent être screenshotées et partagées sans crédit sur X même ou sur d'autres plateformes." },
  ],
  bonnesPratiques: [
    { titre: "Activez la 2FA et vérifiez votre compte", description: "L'authentification à deux facteurs est essentielle. La vérification (badge bleu) offre une couche de protection supplémentaire contre l'usurpation." },
    { titre: "Configurez vos paramètres de confidentialité", description: "Limitez les personnes pouvant vous mentionner, vous envoyer des messages privés, et interagir avec vos publications." },
    { titre: "Utilisez les outils anti-harcèlement", description: "Bloquez, masquez et signalez les comptes abusifs. Utilisez les listes de mots masqués et les filtres de notifications." },
    { titre: "Documentez les usurpations d'identité", description: "Capturez tout compte se faisant passer pour vous. Signalez à X et conservez les preuves pour d'éventuelles actions juridiques." },
    { titre: "Diversifiez au-delà de X", description: "La monétisation sur X est encore naissante. Développez votre présence sur d'autres plateformes et vos propres canaux (newsletter, site)." },
    { titre: "Archivez vos publications importantes", description: "Téléchargez régulièrement votre archive X. En cas de suspension, vous conservez l'historique de votre contenu." },
  ],
  aDocumenter: [
    "Téléchargement régulier de votre archive X (données complètes)",
    "Captures des statistiques d'impression et d'engagement",
    "Relevés de revenus publicitaires X",
    "Preuves de signalement d'usurpation (numéros de ticket)",
    "Correspondances avec le support X",
    "Liste des publications virales et leurs dates",
  ],
  aNePasFaire: [
    "Ne partagez pas d'informations personnelles sensibles publiquement",
    "Ne vous engagez pas dans des échanges conflictuels qui pourraient être signalés",
    "N'utilisez pas de bots d'engagement automatique (follow/unfollow de masse)",
    "N'ignorez pas les notifications officielles de X concernant votre compte",
    "Ne publiez pas de contenu qui pourrait enfreindre les lois sur le droit d'auteur",
    "Ne comptez pas exclusivement sur la monétisation X pour vos revenus",
  ],
  commentHaloAide: [
    "Veille CGU : nous surveillons les évolutions des conditions de X et vous alertons",
    "Bouclier Légal : analysez votre contrat d'agence pour les clauses liées à X",
    "Protection anti-usurpation : guides pour signaler et documenter les faux comptes",
    "Documentation : méthodes pour archiver vos preuves de création",
    "Lex AI : analysez vos contrats de partenariat avant signature",
  ],
  checklist: [
    "L'authentification à deux facteurs est activée",
    "Mes paramètres de confidentialité sont configurés",
    "J'ai téléchargé mon archive X récemment",
    "Je surveille les comptes usurpateurs potentiels",
    "Je connais les derniers critères de monétisation X",
    "J'ai diversifié ma présence au-delà de X",
    "Mon adresse email de récupération est vérifiée",
    "Je documente mes revenus X mensuellement",
  ],
  faq: [
    { q: "Comment obtenir le badge de vérification sur X ?", r: "X propose le badge bleu via l'abonnement X Premium. Les critères incluent un compte actif, un numéro de téléphone vérifié, et l'absence de violations récentes. Le badge n'est pas une garantie contre la suspension." },
    { q: "Comment fonctionne le partage de revenus publicitaires sur X ?", r: "X partage une partie des revenus publicitaires avec les créateurs éligibles (abonnés X Premium, minimum d'impressions). Les critères et les montants évoluent régulièrement. Consultez les conditions officielles." },
    { q: "Que faire si un compte se fait passer pour moi ?", r: "Signalez immédiatement le compte via le formulaire d'usurpation d'identité de X. Documentez le signalement. Si le compte nuit à votre réputation ou à vos revenus, une action juridique peut être nécessaire." },
    { q: "Puis-je récupérer mon compte X s'il est suspendu ?", r: "Utilisez le formulaire de recours de X. Fournissez un maximum d'informations : date de création, email associé, numéro de téléphone. Les délais de réponse sont variables. Documentez toutes vos démarches." },
    { q: "X est-il adapté aux créateurs de contenu adulte ?", r: "X autorise le contenu adulte avec un marquage approprié, contrairement à d'autres plateformes comme Instagram. Cependant, les règles peuvent évoluer. Marquez toujours votre compte et vos publications comme sensibles si applicable." },
  ],
  ctaLabel: "Analyser mon contrat",
  ctaLink: "/protection",
  ctaSecondaryLabel: "Journal des changements",
  ctaSecondaryLink: "/lex/changements",
  cguLink: "https://x.com/tos",
};

export default function XPage() {
  return <PlatformProtectionClient data={DATA} />;
}
