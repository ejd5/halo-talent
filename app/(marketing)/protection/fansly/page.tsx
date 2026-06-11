import { PlatformLegalPage, type PlatformData } from "@/components/legal/PlatformLegalPage";

const DATA: PlatformData = {
  id: "fansly",
  name: "Fansly",
  icon: "FL",
  description: "Comprendre les spécificités de Fansly : droits des créateurs, CGU et bonnes pratiques.",
  freshnessDate: "2025-11-01",
  rights: [
    {
      title: "Propriété du compte",
      items: [
        "Votre compte Fansly vous appartient — vérification d'identité obligatoire",
        "Les agences ne peuvent pas posséder ou contrôler votre compte",
        "Le partage d'accès est contraire aux CGU de la plateforme",
      ],
    },
    {
      title: "Propriété du contenu",
      items: [
        "Vous conservez la propriété de tout le contenu que vous publiez",
        "Fansly est plus permissif que OnlyFans sur certains types de contenu (fétichisme notamment)",
        "Le contenu doit rester conforme aux lois en vigueur dans votre pays",
      ],
    },
    {
      title: "Revenus et commissions",
      items: [
        "La plateforme prélève 20% de commission (identique à OnlyFans)",
        "Les paiements vous sont versés directement en tant que créateur vérifié",
        "Vous avez droit à la transparence totale sur vos gains et relevés",
      ],
    },
  ],
  cguPoints: [
    {
      title: "Compte individuel obligatoire",
      points: [
        "Un compte par personne, vérification d'identité requise",
        "Les comptes multi-utilisateurs ne sont pas autorisés",
        "Le titulaire du compte est seul responsable de son activité",
      ],
      sources: [{ label: "Fansly ToS", url: "https://fansly.com/terms", date: "nov. 2025" }],
    },
    {
      title: "IA et contenu généré",
      points: [
        "Fansly applique une politique moins stricte qu'OnlyFans sur l'IA",
        "Le marquage du contenu IA est recommandé mais pas obligatoire",
        "Restez attentif aux évolutions — la régulation se renforce",
      ],
      sources: [{ label: "Fansly ToS", url: "https://fansly.com/terms", date: "nov. 2025" }],
    },
  ],
  linkUrl: "https://fansly.com/terms",
};

export default function FanslyPage() {
  return <PlatformLegalPage data={DATA} />;
}
