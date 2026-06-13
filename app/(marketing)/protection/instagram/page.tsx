import type { Metadata } from "next";
import { PlatformProtectionClient, type PlatformProtectionData } from "../PlatformProtectionClient";

export const metadata: Metadata = {
  title: "Protection Instagram pour créateurs, Where Talent Forms",
  description:
    "Modération, droits d'auteur, monétisation : tout savoir pour protéger votre compte Instagram. Risques, bonnes pratiques, checklist et FAQ.",
  openGraph: {
    title: "Protection Instagram, Guide créateur | Where Talent Forms",
    description:
      "CGU, droits des créateurs, modération et monétisation sur Instagram. Protégez votre compte, votre contenu et votre audience.",
  },
};

const DATA: PlatformProtectionData = {
  id: "instagram",
  name: "Instagram",
  description:
    "Modération opaque, shadowban, droits d'auteur et monétisation : comprenez les règles d'Instagram pour protéger votre compte et votre contenu.",
  freshnessDate: "2026-01-15",
  risques: [
    { titre: "Suspension ou shadowban inexpliqué", description: "Instagram peut limiter la portée de votre compte sans notification claire. Les critères de modération ne sont pas totalement transparents et évoluent sans préavis." },
    { titre: "Vol de compte par phishing", description: "Les créateurs sont des cibles privilégiées pour le phishing. Une fois votre compte compromis, la récupération peut prendre des semaines." },
    { titre: "Contenus signalés abusivement", description: "Des concurrents ou des personnes mal intentionnées peuvent signaler vos contenus en masse, entraînant une suspension automatique." },
    { titre: "Non-respect des règles de monétisation", description: "Les partenariats rémunérés doivent être clairement identifiés. Le non-respect des règles de branded content expose à des sanctions." },
    { titre: "Utilisation non autorisée de vos contenus", description: "Vos photos et vidéos peuvent être reprises sans votre consentement sur d'autres comptes. La procédure de signalement existe mais peut être lente." },
    { titre: "Dépendance à l'algorithme", description: "Les changements d'algorithme peuvent réduire drastiquement votre portée du jour au lendemain, impactant directement vos revenus." },
  ],
  bonnesPratiques: [
    { titre: "Activez l'authentification à deux facteurs", description: "Utilisez une application d'authentification (pas les SMS). C'est la première barrière contre le vol de compte." },
    { titre: "Identifiez clairement les partenariats rémunérés", description: "Utilisez l'outil 'Partenariat rémunéré' d'Instagram pour chaque contenu sponsorisé. C'est une obligation légale dans de nombreux pays." },
    { titre: "Diversifiez votre présence", description: "Ne dépendez pas uniquement d'Instagram. Développez votre présence sur d'autres plateformes et constituez une liste email." },
    { titre: "Sauvegardez vos contenus régulièrement", description: "Exportez vos photos, vidéos et stories. Instagram ne garantit pas la conservation de vos contenus en cas de suspension." },
    { titre: "Surveillez les utilisations non autorisées", description: "Utilisez la recherche inversée d'images pour détecter les reprises non autorisées de vos contenus. Signalez systématiquement." },
    { titre: "Documentez votre audience et vos statistiques", description: "Capturez régulièrement vos insights. En cas de suspension, ces données vous aident à démontrer votre valeur à d'autres plateformes." },
  ],
  aDocumenter: [
    "Captures d'écran régulières de vos insights d'audience",
    "Liste de vos partenariats rémunérés avec les dates de publication",
    "Preuves des signalements de contenus usurpés (numéros de ticket)",
    "Historique des modifications de nom d'utilisateur et de bio",
    "Captures des conversations avec le support Instagram",
    "Export de vos contenus originaux avec métadonnées de date",
  ],
  aNePasFaire: [
    "N'achetez pas de followers ou d'engagement, cela viole les CGU",
    "Ne publiez pas de contenu dont vous ne détenez pas les droits",
    "Ne cachez pas les partenariats rémunérés, c'est illégal dans la plupart des juridictions",
    "Ne cliquez pas sur des liens suspects dans les messages privés",
    "Ne partagez pas vos identifiants avec des outils tiers non vérifiés",
    "Ne réagissez pas aux menaces de signalement par des inconnus, documentez et signalez",
  ],
  commentHaloAide: [
    "Veille CGU : nous surveillons les conditions d'utilisation d'Instagram et signalons les changements",
    "Bouclier Légal : analysez votre contrat d'agence pour détecter les clauses problématiques",
    "Guides plateformes : conseils pratiques pour sécuriser votre compte",
    "Documentation : méthodologie pour constituer un dossier de preuves solide",
    "Lex AI : analysez vos contrats de partenariat avant signature",
  ],
  checklist: [
    "L'authentification à deux facteurs est activée avec une application",
    "Mes partenariats rémunérés sont correctement identifiés",
    "J'ai une copie sauvegardée de mes contenus originaux",
    "Je capture mes insights d'audience une fois par mois",
    "Mon adresse email de récupération est à jour",
    "J'ai vérifié les applications tierces connectées à mon compte",
    "Je connais la procédure de signalement de contenu",
    "J'ai diversifié ma présence sur au moins deux autres plateformes",
  ],
  faq: [
    { q: "Comment contester une suspension de compte Instagram ?", r: "Utilisez le formulaire de recours dans l'application (Paramètres > Aide > Signaler un problème). Documentez tous vos échanges. Si vous avez un gestionnaire de compte Meta, contactez-le directement. Les recours peuvent prendre plusieurs jours." },
    { q: "Le shadowban existe-t-il vraiment sur Instagram ?", r: "Instagram nie officiellement le terme, mais les créateurs constatent des baisses soudaines de portée. La meilleure protection : diversifier vos plateformes et constituer une audience indépendante (email, site web)." },
    { q: "Que faire si quelqu'un utilise mes photos sans autorisation ?", r: "Signalez le contenu via le formulaire de violation de droits d'auteur d'Instagram. Documentez le signalement (numéro de ticket, date). Si la situation persiste, une mise en demeure par avocat est souvent efficace." },
    { q: "Puis-je avoir plusieurs comptes Instagram ?", r: "Oui, Instagram autorise plusieurs comptes. Cependant, si un compte est suspendu pour violation, les autres comptes liés peuvent également être affectés. Séparez bien vos comptes personnels et professionnels." },
    { q: "Les stories sont-elles protégées par le droit d'auteur ?", r: "Oui, vos stories sont vos créations originales et sont protégées. Cependant, Instagram peut les utiliser dans le cadre de la licence que vous lui accordez. Les stories éphémères peuvent toujours faire l'objet de captures d'écran par des tiers." },
  ],
  ctaLabel: "Protéger mon compte",
  ctaLink: "/protection",
  ctaSecondaryLabel: "Guide pratique créateur",
  ctaSecondaryLink: "/protection/guide",
  cguLink: "https://help.instagram.com/581066165581870",
};

export default function InstagramPage() {
  return <PlatformProtectionClient data={DATA} />;
}
