"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Star,
  TrendingUp,
  Video,
  Music,
  Dumbbell,
  Sparkles,
  Shield,
  Image,
  Users,
  Clock,
  Zap,
  X,
  Check,
} from "lucide-react";

function useReveal(amount = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  return { ref, inView };
}

const riseItem = {
  hidden: { opacity: 0, y: 32 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const, delay: d } }),
};
const fadeItem = {
  hidden: { opacity: 0, y: 16 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const, delay: d } }),
};

interface DepartementData {
  slug: string;
  nom: string;
  icon: React.ElementType;
  heroBaseline: string;
  heroSubtitle: string;
  heroMicro: string;
  pourQui: string;
  profilsListe: string[];
  problemes: { titre: string; description: string }[];
  reponseIntro: string;
  piliers: { titre: string; description: string; icon: React.ElementType }[];
  outils: { nom: string; description: string }[];
  parcours: string;
  refus: { titre: string; description: string }[];
  faq: { q: string; r: string }[];
}

const DEPARTEMENTS_DATA: Record<string, DepartementData> = {
  "glamour-premium": {
    slug: "glamour-premium",
    nom: "Glamour Premium",
    icon: Star,
    heroBaseline: "L'image haut de gamme, de la stratégie à la production.",
    heroSubtitle:
      "Dans les industries de la mode, de la beauté et du luxe, l'image n'est pas un accessoire, c'est le produit. Le département Glamour Premium accompagne les créateurs dont l'esthétique est l'actif principal.",
    heroMicro: "IMAGE &middot; LUXE &middot; ESTHÉTIQUE",
    pourQui:
      "Le département Glamour Premium s'adresse aux créateurs et professionnels pour qui l'image est le cœur de la proposition de valeur : direction artistique exigeante, production premium, et contrôle absolu de l'image de marque.",
    profilsListe: [
      "Mannequins et tops models",
      "Créateurs mode, stylistes, directeurs artistiques",
      "Photographes et réalisateurs mode",
      "Marques personnelles positionnées luxe et beauté",
      "Influenceurs premium (fashion, beauty, lifestyle haut de gamme)",
    ],
    problemes: [
      {
        titre: "Image incohérente entre plateformes",
        description:
          "Instagram dit luxe, TikTok dit accessible, YouTube est délaissé. L'absence de cohérence visuelle dilue la perception de marque et réduit le pouvoir de négociation avec les maisons de luxe.",
      },
      {
        titre: "Production coûteuse et lente",
        description:
          "Une séance photo professionnelle coûte 2&nbsp;000&ndash;10&nbsp;000€ et prend 3 semaines. Le rythme des réseaux sociaux exige du contenu quotidien. L'équation est intenable sans infrastructure.",
      },
      {
        titre: "Partenariats qui dégradent l'image",
        description:
          "Accepter le mauvais partenariat peut détruire des années de positionnement. Sans guidance stratégique, les créateurs cèdent aux offres rapides au détriment de leur valeur de marque.",
      },
      {
        titre: "Protection de l'image inexistante",
        description:
          "Utilisation non autorisée des photos, republication sans crédit, deepfakes, usurpation d'identité. Sans protection juridique, l'image devient un bien public que n'importe qui peut exploiter.",
      },
      {
        titre: "Dépendance aux agences traditionnelles",
        description:
          "Les agences de mannequins prélèvent 30&ndash;40% et contrôlent les castings. Le créateur n'a ni autonomie stratégique ni transparence sur sa propre carrière.",
      },
    ],
    reponseIntro:
      "Le département Glamour Premium combine direction artistique, production IA, gestion des partenariats luxe, et protection juridique pour construire une image premium qui attire les bonnes collaborations et résiste au temps.",
    piliers: [
      { titre: "Direction artistique", description: "Identité visuelle unifiée, charte graphique, moodboards, cohérence multi-plateforme.", icon: Image },
      { titre: "Production premium IA", description: "Studio IA pour générer du contenu photo et vidéo esthétique en heures, pas en semaines.", icon: Sparkles },
      { titre: "Protection juridique", description: "Dépôts de preuves, contrats de cession de droits, lutte contre les usages non autorisés.", icon: Shield },
      { titre: "Gestion des partenariats", description: "Sélection, négociation et structuration des collaborations avec les marques luxe et beauté.", icon: Users },
      { titre: "Stratégie long terme", description: "Construction d'une marque personnelle qui survit aux tendances et aux changements de plateforme.", icon: Clock },
    ],
    outils: [
      { nom: "Studio IA générative", description: "Production de visuels photo et vidéo en qualité éditoriale, sans shooting physique." },
      { nom: "Atlas CRM", description: "Gestion de la communauté et des relations marques avec segmentation premium." },
      { nom: "WTF Lex", description: "Protection juridique : dépôts, contrats, veille sur les utilisations non autorisées de votre image." },
      { nom: "CHATEENG personnalisé", description: "Un assistant qui connaît votre univers et répond à vos fans dans votre tonalité." },
      { nom: "Sovereign Chat", description: "Communications confidentielles avec l'équipe WTF, chiffrées de bout en bout." },
    ],
    parcours:
      "Une créatrice mode arrive avec 50K followers et un partenariat isolé. En 6 mois avec WTF : identité visuelle unifiée sur 4 plateformes, production de contenu quotidien via Studio IA, deux collaborations signées avec des maisons de luxe, revenus multipliés par 3, et une communauté de 200K abonnés. Sans céder aux codes du fast content. Sans brader son image.",
    refus: [
      { titre: "Contenu dégradant", description: "Nous ne produisons pas de contenu qui abaisse la valeur perçue de votre marque pour gagner des vues." },
      { titre: "Fast content sans âme", description: "Nous refusons de publier du volume sans qualité. Chaque pièce de contenu doit servir votre image, pas la diluer." },
      { titre: "Partenariats toxiques", description: "Nous déclinons les collaborations avec des marques incompatibles avec votre positionnement, quel que soit le montant." },
      { titre: "Promesses de célébrité", description: "Nous ne vendons pas la gloire. Nous construisons une image durable, pas une tendance éphémère." },
    ],
    faq: [
      { q: "Faut-il déjà être connu pour intégrer le département Glamour Premium ?", r: "Non. Nous accompagnons des créateurs à tous les stades, du mannequin qui débute au créateur établi qui cherche à structurer sa marque. Ce que nous regardons, c'est la qualité du travail et la volonté de construire une image haut de gamme." },
      { q: "Proposez-vous des shootings photo physiques ?", r: "Where Talent Forms n'est pas une agence de production photo traditionnelle. Notre Studio IA permet de générer du contenu visuel premium sans shooting physique, en complément de votre propre production. Pour les besoins de shooting physique, nous pouvons vous orienter vers nos partenaires." },
      { q: "Comment protégez-vous mon image contre les utilisations non autorisées ?", r: "WTF Lex permet de constituer des dépôts de preuves horodatés, de surveiller les utilisations de votre image en ligne, et de générer les documents juridiques nécessaires (mises en demeure, contrats de cession). Pour les contentieux complexes, nous travaillons avec des avocats partenaires." },
      { q: "Quelle est la différence avec une agence de mannequins ?", r: "Une agence de mannequins vous place sur des castings et prélève une commission. Where Talent Forms vous donne les outils et l'accompagnement pour construire votre propre marque, gérer vos partenariats en direct, et garder le contrôle de votre carrière." },
      { q: "Puis-je garder mon identité actuelle ou dois-je tout reconstruire ?", r: "Vous gardez votre identité et votre authenticité. Notre travail est de révéler et structurer ce qui existe déjà, pas de créer une persona artificielle. L'authenticité est précisément ce qui attire les marques de luxe." },
    ],
  },

  influenceurs: {
    slug: "influenceurs",
    nom: "Influenceurs",
    icon: TrendingUp,
    heroBaseline: "Transformer l'audience en actif stratégique, sans perdre son authenticité.",
    heroSubtitle:
      "Les créateurs de contenu, streamers, et influenceurs d'aujourd'hui sont des entrepreneurs à part entière. Le département Influenceurs vous aide à structurer votre activité, diversifier vos revenus, et reprendre le contrôle de votre trajectoire.",
    heroMicro: "CRÉATION &middot; MONÉTISATION &middot; CROISSANCE ORGANIQUE",
    pourQui:
      "Le département Influenceurs accompagne les créateurs de contenu digital dont l'audience et l'authenticité sont les principaux moteurs de valeur : influenceurs lifestyle, streameurs, TikTokers, et tous ceux qui construisent une communauté engagée.",
    profilsListe: [
      "Créateurs de contenu lifestyle, mode, beauté",
      "Streamers gaming et IRL (Twitch, YouTube Live)",
      "TikTokers et créateurs de formats courts",
      "Podcasteurs et youtubeurs en développement",
      "Influenceurs en transition vers l'entrepreneuriat",
    ],
    problemes: [
      {
        titre: "Monétisation fragile et unidimensionnelle",
        description:
          "Dépendance aux programmes de monétisation des plateformes (YouTube Partner, TikTok Creator Fund) dont les critères changent sans préavis. Un changement d'algorithme peut diviser les revenus par deux.",
      },
      {
        titre: "Brand deals mal négociés",
        description:
          "Sans expérience en négociation, les créateurs acceptent des partenariats sous-valorisés ou signent des clauses d'exclusivité qui bloquent d'autres opportunités.",
      },
      {
        titre: "Temps de création absorbé par l'administratif",
        description:
          "Un créateur passe en moyenne 40% de son temps sur des tâches non-créatives : comptabilité, emails, négociation, gestion de communauté, planification.",
      },
      {
        titre: "Algorithme-dépendance",
        description:
          "Construction d'une audience entièrement sur une plateforme tierce, sans canal propriétaire. En cas de shadowban, de baisse de reach, ou de fermeture de compte, tout s'effondre.",
      },
      {
        titre: "Absence de stratégie de contenu",
        description:
          "Publication réactive plutôt que stratégique. Sans calendrier éditorial ni analyse de performance, la croissance stagne et la fatigue créative s'installe.",
      },
    ],
    reponseIntro:
      "Le département Influenceurs vous équipe pour fonctionner comme une entreprise : stratégie de contenu, diversification des revenus, outils IA pour récupérer du temps, et protection juridique pour sécuriser vos actifs.",
    piliers: [
      { titre: "Stratégie de contenu", description: "Calendrier éditorial, analyse de performance, identification des formats gagnants, planification multiplateforme.", icon: Zap },
      { titre: "Monétisation diversifiée", description: "Brand deals, abonnements, produits dérivés, consulting, contenu exclusif ,  ne dépendre d'aucune source unique.", icon: TrendingUp },
      { titre: "Négociation de marque", description: "Valorisation de l'audience, structuration des partenariats, relecture des contrats, optimisation des revenus par deal.", icon: Check },
      { titre: "Outils IA", description: "Studio IA pour la production de contenu, CHATEENG pour la gestion de communauté, Atlas pour le CRM et les relations marques.", icon: Sparkles },
      { titre: "Protection et conformité", description: "Déclaration des partenariats commerciaux, contrats de cession de droits, protection contre le shadowban.", icon: Shield },
    ],
    outils: [
      { nom: "CHATEENG personnalisé", description: "Automatisez les réponses aux fans tout en gardant votre voix. Gagnez 10+ heures par semaine." },
      { nom: "Studio IA", description: "Générez des visuels, des miniatures, des scripts et des descriptions optimisées pour chaque plateforme." },
      { nom: "Atlas CRM", description: "Gérez vos contacts marques, vos partenariats en cours, et votre communauté dans un seul outil." },
      { nom: "WTF Lex", description: "Contrats de partenariat, dépôts de preuves, conformité réglementaire (mentions obligatoires, droits d'auteur)." },
      { nom: "Sovereign Chat", description: "Un canal sécurisé pour vos échanges confidentiels avec l'équipe WTF." },
    ],
    parcours:
      "Un streamer gaming de 22 ans avec 20K abonnés sur Twitch, des revenus instables, et pas de présence YouTube. En 6 mois : chaîne YouTube structurée (montage via Studio IA), présence TikTok active, revenus ×4 grâce à deux sponsors gaming et un programme d'abonnement, communauté Discord structurée avec 3K membres actifs. Le tout sans sacrifier l'authenticité du stream.",
    refus: [
      { titre: "Croissance artificielle", description: "Nous n'achetons pas de followers, de vues ou d'engagement. La croissance que nous construisons est organique et mesurable." },
      { titre: "Contenu clickbait", description: "Nous ne sacrifions pas l'intégrité pour des métriques. Un bon taux d'engagement vaut plus qu'un million de vues creuses." },
      { titre: "Dépendance aux tendances", description: "Nous ne construisons pas une stratégie autour d'une tendance qui disparaîtra dans 3 mois. Nous construisons une marque qui survit aux modes." },
      { titre: "Promesses de viralité", description: "Nous ne promettons pas de rendre un contenu viral. Nous promettons une croissance structurée, durable, et indépendante des algorithmes." },
    ],
    faq: [
      { q: "Combien de followers faut-il pour intégrer le département ?", r: "Il n'y a pas de seuil minimum. Nous regardons la qualité de l'engagement, la cohérence du contenu, et le potentiel de développement, pas le nombre de followers. Nous avons accompagné des créateurs avec 2K comme avec 500K abonnés." },
      { q: "Allez-vous gérer mes réseaux sociaux à ma place ?", r: "Non. Nous vous donnons la stratégie, les outils et l'accompagnement pour mieux gérer vos réseaux vous-même. Nous ne publions pas à votre place. L'authenticité est votre principal actif, nous vous aidons à la préserver, pas à la déléguer." },
      { q: "Comment m'aidez-vous à trouver des sponsors ?", r: "Nous vous aidons à structurer un dossier de partenariat professionnel, à identifier les marques alignées avec votre audience, à négocier les conditions, et à relire les contrats. Nous ne démarchons pas les marques à votre place, mais nous vous donnons tout pour le faire efficacement." },
      { q: "Puis-je continuer à travailler avec mes sponsors actuels ?", r: "Oui. Nous analysons vos partenariats existants pour identifier les opportunités d'optimisation et les risques juridiques. Si un partenariat est sain, nous vous aidons à le renforcer." },
      { q: "Quelle est la différence avec une agence d'influence ?", r: "Une agence d'influence vous place sur des campagnes, prélève une commission, et passe au client suivant. Where Talent Forms construit avec vous une infrastructure durable : stratégie, outils, protection juridique, autonomie." },
    ],
  },

  "youtube-podcast": {
    slug: "youtube-podcast",
    nom: "YouTube / Podcast",
    icon: Video,
    heroBaseline: "Produire mieux, publier plus intelligemment, monétiser durablement.",
    heroSubtitle:
      "YouTube et le podcast sont les formats les plus puissants pour construire une relation de confiance avec une audience. Mais ce sont aussi les plus exigeants en temps, en compétences, et en régularité. Le département YouTube / Podcast vous donne l'infrastructure pour durer.",
    heroMicro: "STUDIO &middot; FORMATS LONGS &middot; COMMUNAUTÉ",
    pourQui:
      "Le département YouTube / Podcast accompagne les créateurs de formats longs et audio : youtubeurs, podcasteurs, documentaristes, chaînes éducatives, et tous ceux qui misent sur la profondeur plutôt que le scroll.",
    profilsListe: [
      "Youtubeurs (quel que soit le format : essai, vlog, tech, éducation, culture)",
      "Podcasteurs indépendants et networks",
      "Documentaristes et créateurs de formats longs",
      "Chaînes éducatives et de vulgarisation",
      "Producteurs de contenu audio et vidéo à forte valeur ajoutée",
    ],
    problemes: [
      {
        titre: "Temps de production insoutenable",
        description:
          "Un épisode de 20 minutes peut demander 15&ndash;20 heures de travail : recherche, tournage, montage, vignette, titrage, publication, promotion. Le rythme épuise les créateurs solo.",
      },
      {
        titre: "Découverte et référencement",
        description:
          "Dans un marché saturé (500 heures de vidéo uploadées par minute sur YouTube, 3 millions de podcasts actifs), être bon ne suffit plus. Sans stratégie de référencement, le contenu reste invisible.",
      },
      {
        titre: "Monétisation limitée au CPM publicitaire",
        description:
          "Dépendre uniquement des revenus publicitaires (YouTube AdSense, régies podcast) plafonne la rentabilité. Les CPM varient, les marques se retirent, les revenus sont imprévisibles.",
      },
      {
        titre: "Content ID et droits d'auteur",
        description:
          "Les revendications Content ID abusives, les problèmes de droits musicaux, et les réutilisations non autorisées menacent la monétisation et la visibilité des vidéos.",
      },
      {
        titre: "Croissance de l'audience stagnante",
        description:
          "Le passage de 10K à 100K abonnés est le plus difficile. Les formats qui ont marché au début ne suffisent plus, et la stratégie de croissance doit être repensée.",
      },
    ],
    reponseIntro:
      "Le département YouTube / Podcast réduit le temps de production grâce à l'IA, diversifie les revenus au-delà de la publicité, sécurise les droits, et met en place une stratégie de référencement pour que votre contenu trouve son public.",
    piliers: [
      { titre: "Production assistée par IA", description: "Studio IA pour le montage, les vignettes, les descriptions SEO, les transcriptions, et la déclinaison en formats courts.", icon: Sparkles },
      { titre: "Référencement stratégique", description: "Optimisation des titres, descriptions, tags, vignettes. Stratégie de mots-clés et analyse concurrentielle.", icon: Zap },
      { titre: "Diversification des revenus", description: "Sponsoring, abonnements, produits dérivés, contenu exclusif, consulting. Multiplier les canaux pour ne dépendre d'aucun.", icon: TrendingUp },
      { titre: "Gestion des droits", description: "Content ID, droits d'auteur, licences musicales, contrats de collaboration. WTF Lex sécurise votre catalogue.", icon: Shield },
      { titre: "Communauté et engagement", description: "Atlas CRM pour structurer votre communauté, identifier les super fans, et créer des offres sur mesure.", icon: Users },
    ],
    outils: [
      { nom: "Studio IA (vidéo et audio)", description: "Montage, nettoyage audio, génération de sous-titres, vignettes optimisées, déclinaison en shorts." },
      { nom: "Atlas CRM", description: "Gestion des sponsors, des invitations, des collaborations, et segmentation de votre communauté." },
      { nom: "WTF Lex", description: "Protection contre les revendications Content ID abusives, contrats de sponsoring, gestion des droits musicaux." },
      { nom: "CHATEENG", description: "Assistant pour répondre aux commentaires, modérer la communauté, et interagir avec votre audience 24/7." },
      { nom: "Sovereign Chat", description: "Communications confidentielles avec vos collaborateurs et l'équipe WTF." },
    ],
    parcours:
      "Un podcasteur tech indépendant avec 5K écoutes par épisode, un emploi du temps saturé par le montage, et des revenus limités au crowdfunding. En 6 mois avec WTF : chaîne YouTube lancée (extraits montés via Studio IA), 3 sponsors récurrents, production externalisée grâce aux outils IA, rythme de publication ×2, revenus ×5. 50K abonnés combinés.",
    refus: [
      { titre: "Contenu sans substance", description: "Nous ne produisons pas des formats calibrés pour l'algorithme au détriment de la qualité. Votre crédibilité ne se brade pas." },
      { titre: "Titres putaclic", description: "Un titre qui promet ce que la vidéo ne tient pas détruit la confiance. Nous ne le faisons pas." },
      { titre: "Production low-cost en volume", description: "Nous ne poussons pas à publier plus au prix de publier moins bien. La régularité compte, la qualité aussi." },
      { titre: "Monétisation agressive", description: "Placer 4 sponsors par épisode de 20 minutes détruit l'expérience. Nous privilégions des partenariats intégrés et respectueux de l'audience." },
    ],
    faq: [
      { q: "Est-ce que l'IA va remplacer mon travail de créateur ?", r: "Absolument pas. L'IA remplace les tâches répétitives (transcription, synchronisation, nettoyage audio, vignettes) pour vous libérer du temps de création. Votre voix, votre regard, votre personnalité restent irremplaçables." },
      { q: "Pouvez-vous m'aider si je suis déjà bien établi ?", r: "Oui. Nous travaillons avec des créateurs de toutes tailles. Les enjeux changent avec l'échelle : à 100K abonnés, les priorités sont la structuration, la diversification, et la protection juridique." },
      { q: "Comment gérez-vous les droits musicaux dans les vidéos YouTube ?", r: "WTF Lex vous aide à identifier les musiques libres de droits, à comprendre les implications des licences, et à répondre aux revendications Content ID. Nous ne fournissons pas de bibliothèque musicale, mais nous vous aidons à naviguer le système." },
      { q: "Proposez-vous un studio d'enregistrement physique ?", r: "Non, Where Talent Forms n'est pas un studio d'enregistrement. Nous fournissons les outils IA pour améliorer la qualité de votre production depuis votre propre installation, et nous pouvons vous orienter vers des studios partenaires." },
      { q: "Quels formats de podcast couvrez-vous ?", r: "Tous les formats : interview, narration, table ronde, solo, fiction. L'essentiel est la qualité du contenu et la régularité de publication." },
    ],
  },

  musique: {
    slug: "musique",
    nom: "Musique",
    icon: Music,
    heroBaseline: "L'industrie musicale réinventée par la technologie, sans perdre l'âme artistique.",
    heroSubtitle:
      "L'industrie musicale a changé. Les majors ne sont plus le seul chemin, mais l'autoproduction exige des compétences que personne n'enseigne. Le département Musique comble ce vide pour les artistes indépendants.",
    heroMicro: "ARTISTIQUE &middot; DISTRIBUTION &middot; STORYTELLING",
    pourQui:
      "Le département Musique accompagne les artistes, producteurs, et professionnels de la musique qui veulent construire une carrière durable en dehors du circuit traditionnel des majors.",
    profilsListe: [
      "Musiciens, chanteurs, compositeurs",
      "Producteurs et beatmakers",
      "DJs et artistes électroniques",
      "Labels indépendants",
      "Compositeurs pour l'image (sync, publicité, jeux vidéo)",
    ],
    problemes: [
      {
        titre: "Invisibilité dans l'océan streaming",
        description:
          "120&nbsp;000 nouveaux titres par jour sur Spotify. Sans stratégie de sortie, un morceau, même excellent, est noyé dans la masse en quelques heures.",
      },
      {
        titre: "Complexité des droits et royalties",
        description:
          "Droits d'auteur, droits voisins, édition, synchronisation, performance, reproduction mécanique. La répartition des royalties est un labyrinthe que peu d'artistes maîtrisent.",
      },
      {
        titre: "Production coûteuse",
        description:
          "Un morceau en studio coûte 500&ndash;5&nbsp;000€. Un clip 2&nbsp;000&ndash;20&nbsp;000€. Sans label pour financer, l'artiste autoproduit porte seul l'investissement.",
      },
      {
        titre: "Absence de stratégie marketing",
        description:
          "Faire de la bonne musique ne suffit pas. Sans storytelling, sans plan de sortie, sans stratégie de contenu, l'artiste reste un secret bien gardé.",
      },
      {
        titre: "Droits de sync inaccessibles",
        description:
          "Les placements en synchronisation (pub, cinéma, TV, jeux vidéo) sont une source de revenus majeure, mais sans connexions et sans catalogue bien géré, l'accès est fermé.",
      },
    ],
    reponseIntro:
      "Le département Musique fournit une infrastructure complète pour l'artiste indépendant : production IA, distribution, gestion des droits, stratégie marketing, et développement de communauté.",
    piliers: [
      { titre: "Production musicale IA", description: "Studio IA pour la composition, le mixage, le mastering. Créez et peaufinez vos morceaux plus rapidement.", icon: Sparkles },
      { titre: "Distribution stratégique", description: "Planification des sorties, choix des plateformes, playlisting, promotion croisée avec le réseau WTF.", icon: Zap },
      { titre: "Gestion des droits", description: "Royalties, édition, synchronisation, Content ID. WTF Lex structure et sécurise vos actifs musicaux.", icon: Shield },
      { titre: "Marketing et storytelling", description: "Direction artistique, récit de marque, contenus sociaux, construction de fanbase.", icon: Users },
      { titre: "Sync et placements", description: "Préparation du catalogue pour la synchronisation, identification des opportunités, négociation des licences.", icon: Music },
    ],
    outils: [
      { nom: "Studio IA (musique et audio)", description: "Génération, arrangement, mixage et mastering assistés par IA. Réduisez le temps de production sans sacrifier la qualité." },
      { nom: "WTF Lex", description: "Dépôt SACEM, contrats d'édition, licences sync, gestion des royalties et des droits voisins." },
      { nom: "Atlas CRM", description: "Gestion des contacts professionnels, des playlists, des médias, et de votre communauté de fans." },
      { nom: "CHATEENG", description: "Interagissez avec vos fans 24/7 dans votre univers, partagez des exclusivités, construisez une relation directe." },
      { nom: "Sovereign Chat", description: "Échanges confidentiels avec vos collaborateurs, managers, et l'équipe WTF." },
    ],
    parcours:
      "Un beatmaker autodidacte de 19 ans, 500 followers sur Instagram, zéro revenu musical. En 6 mois avec WTF : premier EP 5 titres distribué sur toutes les plateformes, clips générés via Studio IA, 3 placements sync (2 pubs, 1 jeu mobile), communauté 15K, collaboration initiée avec un label partenaire. L'artiste conserve 100% de ses droits.",
    refus: [
      { titre: "Musique générique", description: "Le Studio IA est un outil d'assistance, pas de remplacement. Nous ne produisons pas de musique sans âme ni signature artistique." },
      { titre: "Contrats d'avance sur recettes", description: "Nous ne finançons pas les artistes par des avances remboursables sur royalties. Nous préférons la transparence et l'autonomie." },
      { titre: "Playlists artificielles", description: "Nous n'achetons pas de placements en playlists. La croissance organique est plus lente mais plus solide." },
      { titre: "Dépendance aux plateformes", description: "Nous ne construisons pas une stratégie qui repose entièrement sur Spotify. La diversification est la règle." },
    ],
    faq: [
      { q: "Faut-il déjà avoir sorti de la musique pour être accompagné ?", r: "Non. Nous accompagnons les artistes à tous les stades, du premier single à l'album. L'important est la qualité du travail et la volonté de construire une carrière." },
      { q: "Le Studio IA peut-il vraiment m'aider pour la musique ?", r: "Le Studio IA excelle en assistance : génération d'idées, arrangements, mixage, nettoyage audio. Il ne remplace pas votre créativité, il l'amplifie. Les meilleurs résultats viennent des artistes qui utilisent l'IA comme un instrument, pas comme un pilote automatique." },
      { q: "Gardez-vous un pourcentage sur mes droits musicaux ?", r: "Non. Where Talent Forms ne prend aucun pourcentage sur vos droits d'auteur, vos royalties, ou vos revenus. Nous vendons un accompagnement et des outils, pas une participation dans votre carrière." },
      { q: "Pouvez-vous m'aider à signer avec un label ?", r: "Nous vous aidons à structurer votre projet pour qu'il soit attractif aux yeux des labels, et nous vous accompagnons dans l'évaluation des offres. Mais notre mission est de vous rendre autonome, pas de vous rendre dépendant d'un label." },
      { q: "Comment gérez-vous les droits de sync ?", r: "WTF Lex vous aide à structurer votre catalogue, à identifier les opportunités de sync, et à négocier les licences. Nous ne remplaçons pas un éditeur musical, mais nous vous donnons les outils pour gérer vos droits." },
    ],
  },

  "sport-fitness": {
    slug: "sport-fitness",
    nom: "Sport / Fitness",
    icon: Dumbbell,
    heroBaseline: "Athlètes et coaches : construire une marque qui survit aux blessures et aux saisons.",
    heroSubtitle:
      "Les athlètes et les professionnels du fitness ont une fenêtre de carrière limitée et des revenus souvent linéaires (heure contre argent). Le département Sport / Fitness transforme une performance physique en marque pérenne.",
    heroMicro: "PERFORMANCE &middot; DISCIPLINE &middot; HÉRITAGE",
    pourQui:
      "Le département Sport / Fitness accompagne les athlètes, coaches et professionnels du bien-être qui veulent dépasser le modèle «&nbsp;un client, une heure, un revenu&nbsp;» pour construire une marque, des produits, et une communauté.",
    profilsListe: [
      "Athlètes professionnels et semi-professionnels",
      "Coaches sportifs et préparateurs physiques",
      "Professeurs de yoga, pilates, et disciplines corporelles",
      "Nutritionnistes et coachs bien-être",
      "Créateurs fitness sur les réseaux sociaux",
    ],
    problemes: [
      {
        titre: "Carrière courte et revenus linéaires",
        description:
          "Un athlète a 10&ndash;15 ans au sommet. Un coach est payé à l'heure. Dans les deux cas, le revenu s'arrête quand le corps s'arrête. Sans diversification, il n'y a pas d'après.",
      },
      {
        titre: "Absence de marque personnelle",
        description:
          "Beaucoup d'athlètes sont connus pour leurs résultats, pas pour leur personnalité. Quand les résultats baissent, la visibilité disparaît. Sans marque, pas de transition.",
      },
      {
        titre: "Sponsoring sous-valorisé",
        description:
          "Sans connaissance du marché et sans outils de mesure d'audience, les athlètes acceptent des sponsors mal rémunérés ou signent des exclusivités qui les enferment.",
      },
      {
        titre: "Gestion de réputation",
        description:
          "Une controverse, une blessure médiatisée, une déclaration mal interprétée. La réputation d'un athlète est fragile et les réseaux sociaux amplifient chaque faux pas.",
      },
      {
        titre: "Transition post-carrière improvisée",
        description:
          "La plupart des athlètes commencent à penser à l'après quand il est trop tard. Sans infrastructure construite pendant la carrière, la transition est brutale.",
      },
    ],
    reponseIntro:
      "Le département Sport / Fitness construit une marque personnelle autour de votre discipline, diversifie vos revenus (programmes, produits, contenu), gère votre réputation, et prépare votre transition post-carrière.",
    piliers: [
      { titre: "Construction de marque", description: "De l'athlète à la marque : identité, valeurs, storytelling, univers visuel cohérent.", icon: Image },
      { titre: "Diversification des revenus", description: "Programmes en ligne, produits, sponsoring, événements. Ne plus dépendre d'une seule source.", icon: TrendingUp },
      { titre: "Gestion de communauté", description: "Atlas CRM pour engager votre communauté, structurer vos offres, et convertir l'audience en clients.", icon: Users },
      { titre: "Protection et réputation", description: "Veille médiatique, gestion de crise, protection juridique contre les usages non autorisés de votre image.", icon: Shield },
      { titre: "Préparation de l'après", description: "Formation, diversification, marque personnelle. Tout ce qui rendra la transition naturelle, pas brutale.", icon: Clock },
    ],
    outils: [
      { nom: "Atlas CRM", description: "Gérez vos clients, vos élèves, vos sponsors, et votre communauté. Segmentez, automatisez, personnalisez." },
      { nom: "CHATEENG", description: "Un assistant qui répond aux questions de votre communauté (conseils fitness, programmes, nutrition) dans votre tonalité." },
      { nom: "Studio IA", description: "Générez du contenu visuel et vidéo pour vos réseaux sociaux, vos programmes en ligne, et vos offres commerciales." },
      { nom: "WTF Lex", description: "Contrats de sponsoring, droit à l'image, conformité réglementaire (allégations santé), protection de la réputation." },
      { nom: "Sovereign Chat", description: "Communications confidentielles avec votre entourage professionnel et l'équipe WTF." },
    ],
    parcours:
      "Un coach fitness de 28 ans avec 10K followers, des clients en one-to-one (40€/h), et aucun produit. En 6 mois avec WTF : programme en ligne structuré (200 clients payants à 29€/mois), contenu quotidien via Studio IA, deux partenariats marque de compléments, revenus ×3. La marque survit au coach : même quand il ne travaille pas, le programme tourne.",
    refus: [
      { titre: "Promesses de résultats physiques", description: "Nous ne promettons pas de transformation physique. Nous ne sommes pas des coachs sportifs et nous ne vendons pas de résultats corporels." },
      { titre: "Programmes miracle", description: "Nous n'associons pas la marque WTF à des promesses de perte de poids rapide, de gain musculaire garanti, ou de solutions non fondées scientifiquement." },
      { titre: "Dopage et pratiques douteuses", description: "Nous n'accompagnons pas les athlètes ou coaches qui promeuvent le dopage, les substances non réglementées, ou les pratiques dangereuses." },
      { titre: "Buzz court terme", description: "Nous ne construisons pas de buzz autour d'une performance isolée. Nous construisons une marque qui survit aux défaites et aux blessures." },
    ],
    faq: [
      { q: "Faut-il être athlète professionnel pour intégrer le département ?", r: "Non. Nous accompagnons aussi bien des athlètes confirmés que des coaches, des professeurs de yoga, ou des nutritionnistes. Le point commun est la volonté de construire une marque durable autour de sa discipline." },
      { q: "Comment m'aidez-vous concrètement à diversifier mes revenus ?", r: "Nous identifions avec vous les opportunités : programme en ligne, contenu premium, sponsoring, événements, produits dérivés. Nous vous aidons à structurer l'offre, à produire le contenu nécessaire, et à gérer la communauté avec Atlas CRM." },
      { q: "Pouvez-vous m'aider à trouver des sponsors ?", r: "Nous vous aidons à construire un dossier de sponsoring professionnel (mesure d'audience, proposition de valeur, activations), à identifier les marques pertinentes, et à négocier les contrats. Nous ne démarchons pas les marques à votre place." },
      { q: "Comment préparez-vous ma transition post-carrière ?", r: "Dès le début, nous travaillons sur votre marque personnelle au-delà de votre performance sportive. Programmes en ligne, formation, contenu, consulting : nous construisons les actifs qui continueront à générer de la valeur quand votre carrière athlétique évoluera." },
      { q: "Faites-vous du coaching sportif ?", r: "Non. Where Talent Forms ne fait pas de coaching sportif. Nous accompagnons la stratégie de marque, la production de contenu, la monétisation, et la protection juridique des professionnels du sport et du fitness." },
    ],
  },
};

function FAQItem({ q, r, fond = "creme" }: { q: string; r: string; fond?: "creme" | "encre" }) {
  const [ouvert, setOuvert] = useState(false);
  const isEncre = fond === "encre";
  return (
    <div style={{ border: `1px solid ${isEncre ? "var(--ligne-faible)" : "var(--ligne-faible)"}` }}>
      <button
        type="button"
        className="w-full flex items-center justify-between p-5 text-left"
        style={{
          background: ouvert ? (isEncre ? "rgba(216,169,91,0.06)" : "rgba(216,169,91,0.04)") : "transparent",
          transition: "background 0.3s ease",
        }}
        onClick={() => setOuvert(!ouvert)}
      >
        <span
          className="text-[14px] font-medium pr-4"
          style={{ color: isEncre ? "var(--ivoire)" : "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}
        >
          {q}
        </span>
        <ChevronDown
          size={14}
          style={{
            color: "var(--or)",
            transform: ouvert ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
            flexShrink: 0,
          }}
        />
      </button>
      {ouvert && (
        <div className="px-5 pb-5">
          <p className="text-[13px] leading-relaxed" style={{ color: isEncre ? "var(--pierre)" : "var(--encre)", opacity: isEncre ? 1 : 0.65, fontFamily: "var(--font-body), sans-serif" }}>
            {r}
          </p>
        </div>
      )}
    </div>
  );
}

export function DepartementDetailClient({ slug }: { slug: string }) {
  const data = DEPARTEMENTS_DATA[slug];
  if (!data) return null;

  const Icon = data.icon;

  return (
    <main>
      <HeroSection data={data} Icon={Icon} />
      <PourQuiSection data={data} />
      <ProblemesSection data={data} />
      <ReponseHaloSection data={data} />
      <OutilsSection data={data} />
      <ParcoursSection data={data} />
      <CeQueNousNeFaisonsPasSection data={data} />
      <FAQSection data={data} />
      <CTASection data={data} />
    </main>
  );
}

function HeroSection({ data, Icon }: { data: DepartementData; Icon: React.ElementType }) {
  const { ref, inView } = useReveal(0.2);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 160, paddingBottom: 100 }}>
      <div className="wrap-eco" style={{ maxWidth: 780, margin: "0 auto" }}>
        <motion.div className="flex flex-col items-center text-center" initial="hidden" animate={inView ? "visible" : "hidden"}>
          <motion.div variants={fadeItem} custom={0} className="mb-6">
            <div className="w-16 h-16 flex items-center justify-center" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)" }}>
              <Icon size={30} />
            </div>
          </motion.div>
          <motion.p
            className="text-[0.6rem] font-bold uppercase tracking-[0.18em] mb-6"
            style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}
            variants={fadeItem}
            custom={0.08}
          >
            Département
          </motion.p>
          <motion.h1 className="display-large mb-6" style={{ color: "var(--ivoire)" }} variants={riseItem} custom={0.1}>
            {data.nom}
          </motion.h1>
          <motion.p
            className="text-[1.1rem] leading-relaxed mb-6"
            style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }}
            variants={fadeItem}
            custom={0.2}
          >
            {data.heroBaseline}
          </motion.p>
          <motion.p
            className="text-[0.85rem] leading-relaxed mb-4 max-w-xl"
            style={{ color: "var(--pierre)", opacity: 0.8, fontFamily: "var(--font-body), sans-serif" }}
            variants={fadeItem}
            custom={0.28}
          >
            {data.heroSubtitle}
          </motion.p>
          <motion.p
            className="text-[0.55rem] font-bold uppercase tracking-[0.2em]"
            style={{ color: "var(--or)", opacity: 0.6, fontFamily: "var(--font-util), monospace" }}
            variants={fadeItem}
            custom={0.35}
            dangerouslySetInnerHTML={{ __html: data.heroMicro }}
          />
        </motion.div>
      </div>
    </section>
  );
}

function PourQuiSection({ data }: { data: DepartementData }) {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 780, margin: "0 auto" }}>
        <motion.p
          className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4"
          style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}
          variants={fadeItem}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0}
        >
          Pour qui
        </motion.p>
        <motion.h2 className="display-medium mb-6" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          À qui s'adresse le département {data.nom}
        </motion.h2>
        <motion.p
          className="text-[1rem] leading-relaxed mb-8"
          style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }}
          variants={fadeItem}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0.15}
        >
          {data.pourQui}
        </motion.p>
        <motion.ul className="grid grid-cols-1 md:grid-cols-2 gap-3" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.22}>
          {data.profilsListe.map((profil, i) => (
            <li
              key={i}
              className="flex items-center gap-3 p-4 text-[14px]"
              style={{ border: "1px solid var(--ligne-faible)", color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}
            >
              <span style={{ color: "var(--or)", flexShrink: 0 }}>&#9670;</span>
              {profil}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

function ProblemesSection({ data }: { data: DepartementData }) {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 820, margin: "0 auto" }}>
        <motion.p
          className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4"
          style={{ color: "#C44536", fontFamily: "var(--font-util), monospace" }}
          variants={fadeItem}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0}
        >
          Les problèmes du profil
        </motion.p>
        <motion.h2 className="display-medium mb-10" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Ce à quoi vous faites face
        </motion.h2>
        <div className="space-y-4">
          {data.problemes.map((p, i) => (
            <motion.div
              key={i}
              variants={fadeItem}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={0.08 + i * 0.05}
              className="p-6"
              style={{ border: "1px solid var(--ligne-faible)", background: "rgba(244,238,227,0.02)" }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-8 h-8 flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "rgba(196,69,54,0.12)", color: "#C44536" }}
                >
                  <span className="text-[10px] font-bold" style={{ fontFamily: "var(--font-util), monospace" }}>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold mb-2" style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}>
                    {p.titre}
                  </h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
                    {p.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReponseHaloSection({ data }: { data: DepartementData }) {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 820, margin: "0 auto" }}>
        <motion.p
          className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4"
          style={{ color: "#5A7D4A", fontFamily: "var(--font-util), monospace" }}
          variants={fadeItem}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0}
        >
          Réponse WTF
        </motion.p>
        <motion.h2 className="display-medium mb-6" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Ce que WTF apporte
        </motion.h2>
        <motion.p
          className="text-[1rem] leading-relaxed mb-10"
          style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }}
          variants={fadeItem}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0.15}
        >
          {data.reponseIntro}
        </motion.p>
        <div className="space-y-3">
          {data.piliers.map((pilier, i) => {
            const PilierIcon = pilier.icon;
            return (
              <motion.div
                key={i}
                variants={fadeItem}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                custom={0.1 + i * 0.05}
                className="flex items-start gap-5 p-6"
                style={{ border: "1px solid var(--ligne-faible)", background: "rgba(12,10,8,0.02)" }}
              >
                <div
                  className="w-11 h-11 flex items-center justify-center shrink-0"
                  style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)" }}
                >
                  <PilierIcon size={20} />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold mb-1" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>
                    {pilier.titre}
                  </h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>
                    {pilier.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function OutilsSection({ data }: { data: DepartementData }) {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 820, margin: "0 auto" }}>
        <motion.p
          className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4"
          style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}
          variants={fadeItem}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0}
        >
          Outils
        </motion.p>
        <motion.h2 className="display-medium mb-10" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Les outils utilisés
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.outils.map((outil, i) => (
            <motion.div
              key={i}
              variants={fadeItem}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={0.08 + i * 0.05}
              className="p-5"
              style={{ border: "1px solid var(--ligne-faible)", background: "rgba(244,238,227,0.02)" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Sparkles size={14} style={{ color: "var(--or)" }} />
                <h3 className="text-[14px] font-bold" style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}>
                  {outil.nom}
                </h3>
              </div>
              <p className="text-[12px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
                {outil.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ParcoursSection({ data }: { data: DepartementData }) {
  const { ref, inView } = useReveal(0.12);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 700, margin: "0 auto" }}>
        <motion.p
          className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center"
          style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}
          variants={fadeItem}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0}
        >
          Exemple de parcours
        </motion.p>
        <motion.h2 className="display-medium mb-8 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Une trajectoire possible
        </motion.h2>
        <motion.div
          variants={fadeItem}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0.15}
          className="p-8 relative"
          style={{ border: "1px solid var(--ligne)", background: "rgba(216,169,91,0.03)" }}
        >
          <div className="couture-ornament mb-6" style={{ opacity: 0.4 }}>
            <img src="/wtf-logo-rond.png" alt="WTF Talent" style={{ height: 100, width: "auto" }} />
          </div>
          <p className="text-[1rem] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }}>
            {data.parcours}
          </p>
          <p
            className="text-[0.65rem] mt-6 italic"
            style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif" }}
          >
            Exemple illustratif basé sur des trajectoires observées. Les résultats individuels dépendent de nombreux facteurs.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function CeQueNousNeFaisonsPasSection({ data }: { data: DepartementData }) {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.p
          className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-5"
          style={{ color: "#C44536", fontFamily: "var(--font-util), monospace" }}
          variants={fadeItem}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0}
        >
          Nos limites
        </motion.p>
        <motion.h2 className="display-medium mb-10" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Ce que nous ne faisons pas
        </motion.h2>
        <div className="space-y-3">
          {data.refus.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeItem}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={0.06 + i * 0.05}
              className="flex items-start gap-4 p-5"
              style={{ border: "1px solid var(--ligne-faible)", background: "rgba(196,69,54,0.02)" }}
            >
              <div
                className="w-8 h-8 flex items-center justify-center shrink-0"
                style={{ background: "rgba(196,69,54,0.1)", color: "#C44536" }}
              >
                <X size={14} />
              </div>
              <div>
                <h3 className="text-[14px] font-bold mb-1" style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}>
                  {item.titre}
                </h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection({ data }: { data: DepartementData }) {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 700, margin: "0 auto" }}>
        <motion.p
          className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center"
          style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}
          variants={fadeItem}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0}
        >
          Questions fréquentes
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          {data.nom}
        </motion.h2>
        <div className="space-y-3">
          {data.faq.map((item, i) => (
            <motion.div key={i} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1 + i * 0.05}>
              <FAQItem q={item.q} r={item.r} fond="creme" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({ data }: { data: DepartementData }) {
  const { ref, inView } = useReveal(0.2);
  return (
    <section ref={ref} className="couture-section text-center" style={{ backgroundColor: "var(--encre)", paddingTop: 100, paddingBottom: 100 }}>
      <div className="wrap-eco" style={{ maxWidth: 600, margin: "0 auto" }}>
        <motion.div
          className="couture-ornament mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 0.6, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <img src="/wtf-logo-rond.png" alt="WTF Talent" style={{ height: 130, width: "auto" }} />
        </motion.div>
        <motion.p className="display-medium mb-4" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          {data.nom} vous correspond ?
        </motion.p>
        <motion.p
          className="text-[1rem] leading-relaxed mb-10"
          style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }}
          variants={fadeItem}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0.15}
        >
          Postulez et dites-nous qui vous êtes. Nous vous dirons si ce département est fait pour vous, ou si un autre correspond mieux.
        </motion.p>
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          variants={fadeItem}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0.3}
        >
          <Link
            href="/apply"
            className="btn-eco inline-flex items-center gap-2"
            style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}
          >
            Postuler <ArrowRight size={14} />
          </Link>
          <Link
            href="/departements"
            className="btn-eco"
            style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}
          >
            Voir tous les départements
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
