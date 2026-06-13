import type { Metadata } from "next";
import { PlatformProtectionClient, type PlatformProtectionData } from "../PlatformProtectionClient";

export const metadata: Metadata = {
  title: "Protection TikTok pour créateurs, Where Talent Forms",
  description:
    "Politiques de contenu, modération et monétisation sur TikTok. Protégez votre compte et votre contenu avec notre guide créateur.",
  openGraph: {
    title: "Protection TikTok, Guide créateur | Where Talent Forms",
    description:
      "CGU, droits des créateurs, politiques de contenu et bonnes pratiques sur TikTok. Sécurisez votre compte et votre audience.",
  },
};

const DATA: PlatformProtectionData = {
  id: "tiktok",
  name: "TikTok",
  description:
    "TikTok est la plateforme à la croissance la plus rapide, avec des règles de contenu et de monétisation qui évoluent constamment. Comprendre ces règles pour protéger votre compte.",
  freshnessDate: "2026-01-15",
  risques: [
    { titre: "Modération opaque et suspensions", description: "TikTok applique une modération automatisée qui peut entraîner des suspensions sans explication claire. Les critères de retrait de contenu ne sont pas toujours transparents." },
    { titre: "Shadowban et limitation de portée", description: "Les créateurs signalent des baisses soudaines de portée sans notification. TikTok peut limiter la visibilité d'un compte sans l'en informer." },
    { titre: "Restrictions de monétisation", description: "Le Creator Fund et les outils de monétisation ont des critères d'éligibilité stricts qui peuvent changer. L'accès peut être révoqué sans préavis." },
    { titre: "Utilisation de musique sans licence", description: "La bibliothèque musicale TikTok est limitée. Utiliser de la musique hors bibliothèque expose à des réclamations de droits d'auteur et au retrait du son." },
    { titre: "Collecte de données et vie privée", description: "TikTok collecte des données étendues sur les utilisateurs. Les régulations européennes (DSA, RGPD) imposent des obligations mais leur application varie." },
    { titre: "Contenu repris sans consentement", description: "Le format de TikTok facilite la reprise de vidéos (duets, stitches). Votre contenu peut être utilisé sans votre accord explicite." },
  ],
  bonnesPratiques: [
    { titre: "Comprenez les guidelines de contenu", description: "Lisez les Community Guidelines de TikTok. Certains types de contenu sont restreints ou interdits même s'ils sont acceptés sur d'autres plateformes." },
    { titre: "Utilisez uniquement la bibliothèque musicale TikTok", description: "Pour le contenu monétisé, n'utilisez que les sons de la bibliothèque TikTok. Les musiques sous copyright peuvent entraîner le mute ou le retrait de vos vidéos." },
    { titre: "Activez toutes les options de confidentialité", description: "Paramétrez la confidentialité de votre compte, limitez les duets/stitches si vous ne voulez pas que votre contenu soit réutilisé." },
    { titre: "Diversifiez au-delà du Creator Fund", description: "Le Creator Fund a des limitations connues. Développez d'autres sources de revenus : partenariats, dons en direct, vente de produits." },
    { titre: "Documentez vos performances", description: "Capturez régulièrement vos analytics TikTok. En cas de suspension, ces données prouvent la valeur de votre compte." },
    { titre: "Conservez vos vidéos originales", description: "Sauvegardez vos vidéos en haute qualité avant de les publier. TikTok compresse les vidéos et vous pourriez avoir besoin des originaux." },
  ],
  aDocumenter: [
    "Captures d'écran de vos analytics (vues, followers, engagement)",
    "Liste des vidéos publiées avec dates et statistiques",
    "Relevés du Creator Fund et autres revenus de monétisation",
    "Notifications de modération et avertissements reçus",
    "Correspondances avec le support TikTok Creator",
    "Vidéos originales sauvegardées en local avant publication",
  ],
  aNePasFaire: [
    "Ne publiez pas de contenu qui enfreint les Community Guidelines, même s'il est populaire",
    "N'utilisez pas de musique protégée par copyright hors bibliothèque TikTok",
    "Ne comptez pas exclusivement sur le Creator Fund pour vos revenus",
    "N'ignorez pas les notifications d'avertissement de TikTok",
    "Ne partagez pas vos identifiants de compte avec des services tiers non vérifiés",
    "Ne reproduisez pas le contenu d'autres créateurs sans autorisation",
  ],
  commentHaloAide: [
    "Veille CGU : nous surveillons les Community Guidelines TikTok et les évolutions du Creator Fund",
    "Bouclier Légal : analysez votre contrat d'agence pour vérifier les clauses liées à TikTok",
    "Documentation : guides pour archiver vos preuves de création et de performance",
    "Diversification : conseils pour développer votre présence au-delà de TikTok",
    "Lex AI : préparez vos contrats de partenariat TikTok avant signature",
  ],
  checklist: [
    "J'ai lu les Community Guidelines TikTok dans leur dernière version",
    "Ma musique provient uniquement de la bibliothèque TikTok",
    "Les options de confidentialité de mon compte sont configurées",
    "Je sauvegarde mes vidéos originales avant publication",
    "Je capture mes analytics chaque mois",
    "J'ai diversifié mes sources de revenus au-delà du Creator Fund",
    "Je connais la procédure de recours en cas de suspension",
    "Mon adresse email de récupération est à jour",
  ],
  faq: [
    { q: "Comment contester une suspension de compte TikTok ?", r: "Utilisez le formulaire de recours dans l'application (Paramètres > Signaler un problème). Documentez votre contestation. Les délais de réponse varient. Si vous avez un gestionnaire TikTok, contactez-le directement." },
    { q: "Le Creator Fund TikTok est-il intéressant ?", r: "Le Creator Fund a des paiements modestes par vue. Il peut être un complément mais ne doit pas être votre seule source de revenus. Les partenariats directs avec des marques sont souvent plus rémunérateurs." },
    { q: "Puis-je contrôler qui fait des duets avec mes vidéos ?", r: "Oui, dans les paramètres de confidentialité de chaque vidéo, vous pouvez désactiver les duets et les stitches. Vous pouvez aussi limiter ces options à vos amis uniquement." },
    { q: "Comment TikTok détecte-t-il les violations de contenu ?", r: "TikTok utilise une combinaison d'IA et de modération humaine. Les critères exacts ne sont pas publics. La détection peut générer des faux positifs, d'où l'importance de documenter votre activité." },
    { q: "Les CGU de TikTok sont-elles différentes selon les pays ?", r: "Oui, TikTok adapte ses conditions aux législations locales. En Europe, le DSA et le RGPD renforcent vos droits. Consultez les CGU applicables à votre région." },
  ],
  ctaLabel: "Analyser mon contrat",
  ctaLink: "/protection",
  ctaSecondaryLabel: "Journal des changements",
  ctaSecondaryLink: "/lex/changements",
  cguLink: "https://www.tiktok.com/legal/terms-of-service",
};

export default function TikTokPage() {
  return <PlatformProtectionClient data={DATA} />;
}
