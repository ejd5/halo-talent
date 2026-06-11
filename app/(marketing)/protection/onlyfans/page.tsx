import { PlatformLegalPage, type PlatformData } from "@/components/legal/PlatformLegalPage";

const DATA: PlatformData = {
  id: "onlyfans",
  name: "OnlyFans",
  icon: "OF",
  description: "Tout savoir sur vos droits et les CGU OnlyFans pour protéger votre compte et votre contenu.",
  freshnessDate: "2026-04-10",
  rights: [
    {
      title: "Propriété du compte",
      items: [
        "Vous êtes l'unique propriétaire de votre compte OnlyFans — l'agence ne peut pas le posséder",
        "Le partage d'identifiants avec votre agence viole les CGU et vous expose à un risque de suspension",
        "Vous pouvez récupérer l'accès à tout moment via le support OF avec votre pièce d'identité",
      ],
    },
    {
      title: "Propriété du contenu",
      items: [
        "Vous conservez l'intégralité de vos droits d'auteur sur chaque publication",
        "OnlyFans obtient une simple licence d'affichage, pas de transfert de propriété",
        "Une clause 'work for hire' dans un contrat d'agence contredit les CGU OnlyFans",
      ],
    },
    {
      title: "Revenus et paiements",
      items: [
        "Les paiements sont versés directement sur votre compte bancaire vérifié",
        "Votre agence ne peut pas intercepter ou rediriger vos paiements OF",
        "Le partage de revenus avec l'agence est un accord privé, en dehors de la plateforme",
      ],
    },
  ],
  cguPoints: [
    {
      title: "Partage de compte interdit",
      points: [
        "OnlyFans exige un compte par personne, vérifié par pièce d'identité",
        "Si votre agence utilise votre compte, vous êtes tous deux en infraction",
        "En cas de litige, le titulaire vérifié est le seul reconnu par le support",
      ],
      sources: [{ label: "OnlyFans ToS § Account Requirements", url: "https://onlyfans.com/terms", date: "avr. 2026" }],
    },
    {
      title: "IA et chat : obligations de transparence",
      points: [
        "Tout contenu généré ou assisté par IA doit être étiqueté depuis avril 2026",
        "L'utilisation d'IA dans le chat (réponses automatiques) doit être divulguée aux abonnés",
        "Les deepfakes sont strictement interdits, même à des fins promotionnelles",
      ],
      sources: [
        { label: "OnlyFans AI Policy 2026", url: "https://onlyfans.com/terms", date: "avr. 2026" },
      ],
    },
    {
      title: "Usurpation d'identité interdite",
      points: [
        "L'agence ne peut pas se faire passer pour vous dans les messages privés",
        "Toute interaction avec les abonnés doit être clairement identifiée",
        "Le non-respect peut entraîner la suspension du compte",
      ],
      sources: [{ label: "OnlyFans ToS § No Impersonation", url: "https://onlyfans.com/terms", date: "avr. 2026" }],
    },
  ],
  linkUrl: "https://onlyfans.com/terms",
};

export default function OnlyFansPage() {
  return <PlatformLegalPage data={DATA} />;
}
