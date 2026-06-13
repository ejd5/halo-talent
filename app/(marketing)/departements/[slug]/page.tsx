import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DepartementDetailClient } from "./DepartementDetailClient";

const SLUGS = [
  "glamour-premium",
  "influenceurs",
  "youtube-podcast",
  "musique",
  "sport-fitness",
] as const;

const META: Record<
  string,
  { title: string; description: string; ogTitle: string; ogDescription: string }
> = {
  "glamour-premium": {
    title: "Glamour Premium, Département Where Talent Forms",
    description:
      "Image haut de gamme, direction artistique, production premium et protection juridique pour mannequins, créateurs mode, beauté, luxe. Découvrez le département Glamour Premium.",
    ogTitle: "Glamour Premium, L'image haut de gamme, de la stratégie à la production | Where Talent Forms",
    ogDescription:
      "Mannequins, créateurs mode et beauté, photographes, marques luxe. Direction artistique, Studio IA, protection de l'image, partenariats premium. Construisez une image qui dure.",
  },
  influenceurs: {
    title: "Influenceurs, Département Where Talent Forms",
    description:
      "Stratégie de contenu, monétisation, brand deals et protection juridique pour influenceurs, streamers, TikTokers. Transformer l'audience en actif stratégique.",
    ogTitle: "Influenceurs, Transformer l'audience en actif stratégique | Where Talent Forms",
    ogDescription:
      "Créateurs de contenu, streamers, TikTokers, podcasteurs. Stratégie éditoriale, diversification des revenus, outils IA, protection juridique. Sans perdre votre authenticité.",
  },
  "youtube-podcast": {
    title: "YouTube / Podcast, Département Where Talent Forms",
    description:
      "Production IA, référencement, monétisation et gestion des droits pour youtubeurs, podcasteurs, documentaristes. Produire mieux, publier plus intelligemment.",
    ogTitle: "YouTube / Podcast, Produire mieux, publier plus intelligemment | Where Talent Forms",
    ogDescription:
      "Youtubeurs, podcasteurs, documentaristes. Studio IA, stratégie de référencement, diversification des revenus, Content ID, protection juridique. Formats longs, impact durable.",
  },
  musique: {
    title: "Musique, Département Where Talent Forms",
    description:
      "Production musicale IA, distribution, droits et royalties, marketing pour artistes, producteurs, beatmakers, DJs. L'industrie musicale réinventée, sans perdre l'âme artistique.",
    ogTitle: "Musique, L'industrie musicale réinventée par la technologie | Where Talent Forms",
    ogDescription:
      "Musiciens, producteurs, beatmakers, DJs, labels. Studio IA, gestion des droits, distribution, sync, marketing. Construisez une carrière durable sans dépendre d'un major.",
  },
  "sport-fitness": {
    title: "Sport / Fitness, Département Where Talent Forms",
    description:
      "Marque personnelle, diversification des revenus, gestion de communauté pour athlètes, coaches, nutritionnistes. Une marque qui survit aux blessures et aux saisons.",
    ogTitle: "Sport / Fitness, Une marque qui survit aux blessures et aux saisons | Where Talent Forms",
    ogDescription:
      "Athlètes, coaches, professeurs de yoga, nutritionnistes. Construction de marque, diversification, programmes en ligne, sponsoring, préparation post-carrière.",
  },
};

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = META[slug];
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
    },
  };
}

export default async function DepartementDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!SLUGS.includes(slug as (typeof SLUGS)[number])) notFound();
  return <DepartementDetailClient slug={slug} />;
}
