import type { Metadata } from "next";
import { PlatformProtectionClient, type PlatformProtectionData } from "../PlatformProtectionClient";

export const metadata: Metadata = {
  title: "Protection OnlyFans pour créateurs, Where Talent Forms",
  description:
    "Tout savoir sur vos droits et les CGU OnlyFans pour protéger votre compte et votre contenu. Risques, bonnes pratiques, checklist et FAQ.",
  openGraph: {
    title: "Protection OnlyFans, Guide créateur | Where Talent Forms",
    description:
      "CGU, droits des créateurs, risques fréquents et bonnes pratiques sur OnlyFans. Protégez votre compte, votre contenu et vos revenus.",
  },
};

const DATA: PlatformProtectionData = {
  id: "onlyfans",
  name: "OnlyFans",
  description:
    "Tout savoir sur vos droits et les CGU OnlyFans pour protéger votre compte, votre contenu et vos revenus. Guide complet pour créateurs.",
  freshnessDate: "2026-04-10",
  risques: [
    { titre: "Partage de compte non autorisé", description: "Partager vos identifiants avec une agence viole les CGU OnlyFans. En cas de litige, seul le titulaire vérifié par pièce d'identité est reconnu par le support." },
    { titre: "Suspension pour contenu non conforme", description: "Les règles de contenu évoluent régulièrement. Un contenu accepté hier peut être refusé demain. La modération est automatisée et les recours sont limités." },
    { titre: "Usurpation d'identité par l'agence", description: "Une agence qui se fait passer pour vous dans les messages privés viole les CGU. Vous êtes responsable de toutes les interactions sur votre compte." },
    { titre: "Obligations IA non respectées", description: "Depuis avril 2026, tout contenu généré ou assisté par IA doit être étiqueté. Les deepfakes sont strictement interdits, même promotionnels." },
    { titre: "Blocage des paiements", description: "En cas de signalement ou de suspicion, OnlyFans peut geler vos revenus sans préavis. La procédure de déblocage peut prendre des semaines." },
    { titre: "Fuite de contenus exclusifs", description: "Les contenus publiés peuvent être copiés et diffusés hors plateforme. La protection DMCA existe mais le retrait effectif peut être lent." },
  ],
  bonnesPratiques: [
    { titre: "Gardez le contrôle exclusif de vos identifiants", description: "Ne partagez jamais votre mot de passe OnlyFans. Utilisez les outils de gestion de réseaux sociaux pour les publications programmées sans céder l'accès." },
    { titre: "Activez l'authentification à deux facteurs (2FA)", description: "La 2FA protège votre compte contre les accès non autorisés. Activez-la dans les paramètres de sécurité de votre compte." },
    { titre: "Vérifiez votre compte avec votre propre pièce d'identité", description: "Le titulaire vérifié est le seul reconnu juridiquement par la plateforme. Ne laissez jamais une agence vérifier un compte à votre place." },
    { titre: "Documentez vos publications et vos revenus", description: "Capturez régulièrement vos statistiques, vos revenus et vos publications. En cas de litige, ces preuves sont essentielles." },
    { titre: "Étiquetez vos contenus assistés par IA", description: "Depuis avril 2026, l'étiquetage IA est obligatoire. Le non-respect peut entraîner la suspension du compte." },
    { titre: "Lisez les mises à jour des CGU", description: "OnlyFans modifie ses conditions régulièrement. Utilisez le Journal des changements WTF pour rester informé." },
  ],
  aDocumenter: [
    "Capture d'écran de votre page de vérification d'identité",
    "Historique mensuel de vos revenus (onglet Statements)",
    "Liste de vos abonnés et montants par abonné",
    "Captures des messages importants avec le support OnlyFans",
    "Copies de vos contenus originaux avec dates de publication",
    "Toute correspondance écrite avec votre agence concernant votre compte",
  ],
  aNePasFaire: [
    "Ne donnez jamais vos identifiants OnlyFans à quiconque, même temporairement",
    "Ne laissez pas une agence créer ou vérifier un compte à votre nom",
    "N'utilisez pas de deepfakes ou de contenus générés par IA sans étiquetage",
    "Ne publiez pas de contenu qui pourrait violer les droits d'un tiers",
    "N'ignorez pas les notifications officielles de la plateforme",
    "Ne répondez pas aux messages des abonnés en vous faisant passer pour quelqu'un d'autre",
  ],
  commentHaloAide: [
    "Veille juridique : nous surveillons les CGU OnlyFans et signalons les changements importants",
    "Bouclier Légal : analysez votre contrat d'agence pour détecter les clauses abusives",
    "Documentation : nos guides vous aident à savoir quoi documenter et comment",
    "Lex AI : importez votre contrat pour une analyse clause par clause avant de signer",
    "Journal des changements : restez informé des évolutions des CGU en temps réel",
  ],
  checklist: [
    "Mon compte est vérifié avec ma propre pièce d'identité",
    "L'authentification à deux facteurs est activée",
    "Je n'ai pas partagé mes identifiants avec une agence",
    "Mes contenus IA sont correctement étiquetés",
    "Je documente mes revenus et statistiques chaque mois",
    "J'ai lu et compris les dernières CGU OnlyFans",
    "J'ai une copie locale de tous mes contenus publiés",
    "Je connais la procédure de signalement DMCA en cas de fuite",
  ],
  faq: [
    { q: "Une agence peut-elle posséder mon compte OnlyFans ?", r: "Non. Les CGU OnlyFans interdisent le partage de compte. Vous êtes l'unique titulaire vérifié, et seul le titulaire vérifié est reconnu par le support. Une agence qui exige vos identifiants viole les CGU." },
    { q: "Que faire si mon compte est suspendu ?", r: "Contactez immédiatement le support OnlyFans avec votre pièce d'identité. Documentez tous vos échanges. Si la suspension est liée à une action de votre agence, rassemblez les preuves et consultez un avocat spécialisé." },
    { q: "Puis-je utiliser l'IA pour mes contenus OnlyFans ?", r: "Oui, mais tout contenu généré ou assisté par IA doit être étiqueté comme tel depuis avril 2026. Les deepfakes (visages générés de personnes réelles) sont strictement interdits. Consultez les CGU pour les règles à jour." },
    { q: "Comment récupérer mes revenus si mon agence ne me paie pas ?", r: "Les paiements OnlyFans sont versés directement sur votre compte bancaire vérifié. L'agence ne peut pas intercepter ces paiements. Si vous avez un accord de partage de revenus avec l'agence, c'est un contrat privé, documentez les impayés et consultez un avocat." },
    { q: "Les contenus que je supprime sont-ils vraiment effacés ?", r: "OnlyFans supprime les contenus de ses serveurs, mais des copies peuvent avoir été faites par des tiers avant la suppression. Une fois publié, vous ne contrôlez plus totalement la diffusion. Documentez les URLs de republication non autorisée pour les signalements DMCA." },
    { q: "Comment WTF surveille-t-il les changements de CGU OnlyFans ?", r: "Notre veille juridique scanne régulièrement les CGU OnlyFans et détecte les modifications. Chaque changement est analysé, résumé et publié dans le Journal des changements avec son niveau d'impact." },
  ],
  ctaLabel: "Analyser mon contrat",
  ctaLink: "/protection",
  ctaSecondaryLabel: "Journal des changements",
  ctaSecondaryLink: "/lex/changements",
  cguLink: "https://onlyfans.com/terms",
};

export default function OnlyFansPage() {
  return <PlatformProtectionClient data={DATA} />;
}
