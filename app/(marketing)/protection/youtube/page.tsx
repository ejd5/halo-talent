import type { Metadata } from "next";
import { PlatformProtectionClient, type PlatformProtectionData } from "../PlatformProtectionClient";

export const metadata: Metadata = {
  title: "Protection YouTube pour créateurs, Where Talent Forms",
  description:
    "Copyright, Content ID, monétisation : tout savoir pour protéger votre chaîne YouTube. Risques, bonnes pratiques, checklist et FAQ.",
  openGraph: {
    title: "Protection YouTube, Guide créateur | Where Talent Forms",
    description:
      "CGU, droits des créateurs, copyright et monétisation sur YouTube. Protégez votre chaîne, votre contenu et vos revenus publicitaires.",
  },
};

const DATA: PlatformProtectionData = {
  id: "youtube",
  name: "YouTube",
  description:
    "YouTube est la plus grande plateforme vidéo mondiale, avec un système de monétisation et de droits d'auteur complexe. Comprendre ces mécanismes pour protéger votre chaîne.",
  freshnessDate: "2026-01-15",
  risques: [
    { titre: "Réclamations Content ID abusives", description: "Le système automatisé Content ID peut générer des réclamations injustifiées sur vos vidéos. Les revenus peuvent être détournés vers le réclamant pendant la procédure de contestation." },
    { titre: "Démonétisation sans préavis", description: "YouTube peut démonétiser une vidéo ou une chaîne entière si le contenu est jugé non conforme aux guidelines pour les annonceurs. Les critères évoluent régulièrement." },
    { titre: "Strikes et suppression de chaîne", description: "Trois strikes de droits d'auteur ou de non-conformité entraînent la suppression définitive de votre chaîne. La procédure de recours est longue et l'issue incertaine." },
    { titre: "Changements de l'algorithme", description: "Les modifications de l'algorithme de recommandation peuvent réduire drastiquement vos vues et vos revenus du jour au lendemain." },
    { titre: "Vol de contenu et reupload", description: "Vos vidéos peuvent être reuploadées sur d'autres chaînes sans autorisation. Le détournement de contenu est fréquent sur YouTube." },
    { titre: "Fermeture du Programme Partenaire", description: "YouTube peut fermer votre accès au Programme Partenaire (YPP) si vous ne respectez plus les critères d'éligibilité ou les guidelines." },
  ],
  bonnesPratiques: [
    { titre: "Comprenez le système Content ID", description: "Sachez comment fonctionne Content ID : quels contenus déclenchent des réclamations, comment contester, quels sont les délais. La connaissance du système est votre première protection." },
    { titre: "Utilisez de la musique et des visuels libres de droits", description: "Pour éviter les réclamations Content ID, utilisez la bibliothèque audio YouTube, des musiques sous licence Creative Commons, ou achetez des licences commerciales." },
    { titre: "Activez la validation en deux étapes", description: "Protégez votre compte Google associé avec la 2FA. Votre chaîne YouTube est liée à votre compte Google, sa sécurité est primordiale." },
    { titre: "Documentez vos sources et licences", description: "Conservez les preuves d'achat de vos licences musicales, visuelles et logicielles. En cas de réclamation, vous pourrez prouver vos droits." },
    { titre: "Diversifiez vos revenus", description: "Ne dépendez pas uniquement des revenus publicitaires YouTube. Développez les Super Chats, les abonnements, le merchandising, et les partenariats externes." },
    { titre: "Sauvegardez vos vidéos en local", description: "Conservez une copie de toutes vos vidéos en qualité originale. En cas de suppression de chaîne, vous ne perdrez pas votre travail." },
  ],
  aDocumenter: [
    "Licences et preuves d'achat de musique et visuels utilisés",
    "Captures d'écran de vos analytics YouTube (YouTube Studio)",
    "Relevés de revenus AdSense mensuels",
    "Historique des réclamations Content ID et contestations",
    "Correspondances avec le support YouTube Creator",
    "Copies locales de toutes vos vidéos en qualité originale",
  ],
  aNePasFaire: [
    "N'utilisez pas de musique ou de vidéos protégées sans licence",
    "Ne contestez pas une réclamation Content ID sans être certain de vos droits",
    "N'ignorez pas les emails de YouTube concernant des strikes ou des avertissements",
    "Ne publiez pas de contenu qui enfreint les guidelines pour les annonceurs",
    "Ne partagez pas votre compte Google avec quiconque",
    "Ne supprimez pas vos vidéos originales après les avoir publiées",
  ],
  commentHaloAide: [
    "Veille CGU : nous surveillons les conditions YouTube et les changements du Programme Partenaire",
    "Bouclier Légal : analysez votre contrat d'agence ou de réseau MCN",
    "Documentation : guides pour archiver vos preuves et licences",
    "Content ID : conseils pour gérer les réclamations et les contestations",
    "Lex AI : analysez vos contrats de partenariat et de sponsoring",
  ],
  checklist: [
    "La validation en deux étapes est activée sur mon compte Google",
    "Je conserve les licences de toute la musique et les visuels utilisés",
    "Je sauvegarde mes vidéos en qualité originale avant publication",
    "J'ai lu les dernières guidelines pour les annonceurs YouTube",
    "Je documente mes revenus AdSense chaque mois",
    "Je connais la procédure de contestation Content ID",
    "Mes sources de revenus sont diversifiées au-delà des pubs",
    "Je n'ai pas de strike de droits d'auteur actif",
  ],
  faq: [
    { q: "Comment contester une réclamation Content ID ?", r: "Dans YouTube Studio, allez dans 'Contenu' > 'Réclamations'. Sélectionnez la vidéo et cliquez sur 'Contester'. Vous devrez indiquer le motif (licence, usage loyal, contenu original). La contestation est examinée par le réclamant, qui a 30 jours pour répondre." },
    { q: "Quelle est la différence entre un strike et un avertissement ?", r: "Un avertissement est une notification sans conséquence immédiate. Un strike entraîne des restrictions (impossibilité de publier, de monétiser). Trois strikes = suppression de la chaîne. Les strikes expirent après 90 jours." },
    { q: "Puis-je récupérer ma chaîne YouTube supprimée ?", r: "Vous pouvez faire appel de la suppression via le formulaire de recours YouTube. Les chances de succès dépendent du motif de suppression. Documentez tout votre processus de création pour démontrer votre bonne foi." },
    { q: "Comment fonctionne le Programme Partenaire YouTube (YPP) ?", r: "Le YPP permet de monétiser vos vidéos via la publicité. Les critères d'entrée : 1000 abonnés et 4000 heures de visionnage sur 12 mois (ou 10M de vues sur Shorts). Les critères peuvent évoluer, vérifiez régulièrement." },
    { q: "Le fair use (usage loyal) s'applique-t-il sur YouTube ?", r: "Le fair use est un concept juridique américain. YouTube n'arbitre pas le fair use, c'est aux tribunaux de le faire. En pratique, les réclamations Content ID priment souvent sur vos arguments de fair use. En cas de litige, consultez un avocat." },
  ],
  ctaLabel: "Analyser mon contrat",
  ctaLink: "/protection",
  ctaSecondaryLabel: "Journal des changements",
  ctaSecondaryLink: "/lex/changements",
  cguLink: "https://www.youtube.com/t/terms",
};

export default function YouTubePage() {
  return <PlatformProtectionClient data={DATA} />;
}
