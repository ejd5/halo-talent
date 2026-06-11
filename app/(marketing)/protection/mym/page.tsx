import { PlatformLegalPage, type PlatformData } from "@/components/legal/PlatformLegalPage";

const DATA: PlatformData = {
  id: "mym",
  name: "MYM",
  icon: "MYM",
  description: "Découvrez vos droits sur MYM, plateforme française aux exigences légales renforcées.",
  freshnessDate: "2025-09-01",
  rights: [
    {
      title: "Protection par le droit français",
      items: [
        "MYM est une plateforme française — le droit français et le RGPD s'appliquent intégralement",
        "Vous bénéficiez d'une protection renforcée par rapport aux plateformes internationales",
        "Les clauses abusives sont plus facilement contestables devant un juge français",
      ],
    },
    {
      title: "Propriété du compte et du contenu",
      items: [
        "Votre compte vous appartient — comme toutes les plateformes, les comptes sont individuels",
        "Vous conservez vos droits d'auteur sur chaque publication (Code de la Propriété Intellectuelle)",
        "L'agence ne peut pas revendiquer la propriété de votre contenu ou de votre compte",
      ],
    },
    {
      title: "Paiements sécurisés",
      items: [
        "Commission plateforme : 20%, paiements traités via prestataires européens",
        "Conformité DSP2 (Directive Européenne sur les Paiements) — sécurité renforcée",
        "Les montants vous sont versés directement, pas à votre agence",
      ],
    },
  ],
  cguPoints: [
    {
      title: "Modération et conformité française",
      points: [
        "MYM applique une modération renforcée pour la conformité avec le droit français",
        "Signalement possible auprès de l'ARCOM en cas de manquement",
        "Les contenus illicites sont retirés plus rapidement qu'OF — cadre légal clair",
      ],
      sources: [{ label: "MYM ToS", url: "https://mym.com/terms", date: "sept. 2025" }],
    },
    {
      title: "RGPD applicable",
      points: [
        "MYM est soumis au Règlement Général sur la Protection des Données",
        "Vous avez droit à l'accès, la rectification et la suppression de vos données",
        "Votre agence doit être conforme RGPD si elle traite vos données (sous-traitance)",
      ],
      sources: [
        { label: "MYM ToS", url: "https://mym.com/terms", date: "sept. 2025" },
        { label: "RGPD Art. 5-7", date: "2018" },
      ],
    },
  ],
  linkUrl: "https://mym.com/terms",
};

export default function MYMPage() {
  return <PlatformLegalPage data={DATA} />;
}
