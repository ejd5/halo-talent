import { PlatformLegalPage, type PlatformData } from "@/components/legal/PlatformLegalPage";

const DATA: PlatformData = {
  id: "instagram",
  name: "Instagram",
  icon: "IG",
  description: "Protégez votre compte Instagram et comprenez les règles applicables aux créateurs et agences.",
  freshnessDate: "2026-01-15",
  rights: [
    {
      title: "Propriété du compte",
      items: [
        "Instagram (Meta) exige un compte par personne réelle — pas de comptes 'agence'",
        "Le partage de compte avec votre agence n'est pas conforme aux CGU",
        "En cas de litige, la personne vérifiée (vous) est la seule propriétaire reconnue",
      ],
    },
    {
      title: "Branded Content et partenariats",
      items: [
        "Toute publication sponsorisée doit utiliser l'outil 'Branded Content' d'Instagram",
        "La mention de partenariat payant est obligatoire — son absence peut entraîner des restrictions",
        "Votre agence doit déclarer tout partenariat via les outils Meta",
      ],
    },
    {
      title: "Protection contre l'automation",
      items: [
        "L'utilisation de bots, auto-DM, auto-like est strictement interdite",
        "Les comptes utilisant des outils non autorisés peuvent être restreints ou supprimés",
        "Si votre agence utilise des automations, vous êtes responsable et risquez le bannissement",
      ],
    },
  ],
  cguPoints: [
    {
      title: "Pas d'automation ni de bots",
      points: [
        "Les termes de l'API Instagram interdisent toute automatisation non autorisée",
        "Les outils de croissance automatique (follow/unfollow, auto-comment) sont prohibés",
        "Les agences utilisant ces outils mettent votre compte en danger",
      ],
      sources: [{ label: "Instagram ToS", url: "https://help.instagram.com/terms", date: "janv. 2026" }],
    },
    {
      title: "Gestion par l'agence : risques",
      points: [
        "Si votre agence gère votre compte, elle le fait via un accès direct — ce qui est contraire aux CGU",
        "Meta recommande d'utiliser Business Manager pour déléguer sans partager le mot de passe",
        "Toute action effectuée par l'agence engage votre responsabilité",
      ],
      sources: [{ label: "Instagram ToS", url: "https://help.instagram.com/terms", date: "janv. 2026" }],
    },
  ],
  linkUrl: "https://help.instagram.com/terms",
};

export default function InstagramPage() {
  return <PlatformLegalPage data={DATA} />;
}
