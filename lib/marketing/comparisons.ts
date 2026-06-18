// ─── Tableau 1 : Agence traditionnelle vs Where Talent Forms ───
export interface ComparisonRow {
  critere: string;
  agenceTraditionnelle: string;
  halo: string;
}

export const AGENCE_VS_HALO: ComparisonRow[] = [
  {
    critere: "Commission",
    agenceTraditionnelle:
      "20 à 50 % selon les agences, parfois davantage sur les revenus de plateforme.",
    halo:
      "Commission WTF réduite et transparente : 5 à 15 % selon les services activés. Vous gardez le contrôle de vos revenus.",
  },
  {
    critere: "Transparence",
    agenceTraditionnelle:
      "Modèles de rémunération parfois opaques. Le créateur ne sait pas toujours combien l'agence prélève réellement.",
    halo:
      "Tableau de bord Reporting intégré. Chaque euro est tracé. Vous voyez exactement ce que vous générez et ce que WTF perçoit.",
  },
  {
    critere: "Accès aux outils",
    agenceTraditionnelle:
      "Le créateur dépend des outils de l'agence. Pas d'accès direct aux données de gestion ou aux analyses.",
    halo:
      "Vous accédez directement à Atlas CRM, Studio IA, WTF Lex, Revenue Radar. Vos données vous appartiennent, exportables à tout moment.",
  },
  {
    critere: "Contrôle du créateur",
    agenceTraditionnelle:
      "L'agence peut imposer des choix éditoriaux, des collaborations, ou des directions de contenu.",
    halo:
      "Vous restez seul décideur de votre image, de vos collaborations et de votre ligne éditoriale. WTF est un outil, pas un patron.",
  },
  {
    critere: "Stratégie long terme",
    agenceTraditionnelle:
      "Approche parfois court-termiste : maximiser les revenus immédiats plutôt que construire une marque durable.",
    halo:
      "Outils pensés pour la structuration longue : Content Vault, Fan Brain, analyse de tendances. Construisez une image premium qui dure.",
  },
  {
    critere: "Accompagnement humain",
    agenceTraditionnelle:
      "Variable selon les agences. Certaines offrent un suivi personnalisé, d'autres un service standardisé.",
    halo:
      "CHATEENG disponible 24/7. Accompagnement humain ponctuel pour les décisions stratégiques. Pas de dépendance.",
  },
  {
    critere: "Gestion juridique préparatoire",
    agenceTraditionnelle:
      "Rarement incluse dans le package de base. Le créateur doit gérer ses contrats seul ou payer un avocat.",
    halo:
      "WTF Lex analyse vos contrats et détecte les clauses à risque. Bouclier Légal vérifie votre conformité. Prévention intégrée.",
  },
  {
    critere: "IA",
    agenceTraditionnelle:
      "L'IA, si utilisée, est un outil interne à l'agence. Le créateur n'y a pas accès directement.",
    halo:
      "Studio IA, CHATEENG, WTF Lex, PPV Copilot : l'IA est entre vos mains. Vous l'utilisez comme vous l'entendez, quand vous voulez.",
  },
  {
    critere: "CRM créateur",
    agenceTraditionnelle:
      "La gestion de la communauté est souvent centralisée par l'agence. Le créateur perd le lien direct avec ses fans.",
    halo:
      "Atlas CRM : segmentez, analysez et engagez votre communauté vous-même. Fan Brain vous aide à comprendre vos audiences.",
  },
  {
    critere: "Protection",
    agenceTraditionnelle:
      "La protection des comptes et de l'image relève généralement de la responsabilité du créateur.",
    halo:
      "Bouclier Légal, Media Kit Generator, vérification de conformité : une couche de protection proactive intégrée.",
  },
  {
    critere: "Image premium",
    agenceTraditionnelle:
      "Le positionnement premium dépend du carnet d'adresses et de la réputation de l'agence.",
    halo:
      "Outils de création et de stratégie pour construire votre propre image premium, indépendamment d'un intermédiaire.",
  },
  {
    critere: "Reporting",
    agenceTraditionnelle:
      "Reporting périodique, souvent mensuel, avec le niveau de détail choisi par l'agence.",
    halo:
      "Revenue Radar en temps réel. Croisement revenus × segments × campagnes. Vous pilotez vos données au jour le jour.",
  },
];

// ─── Tableau 2 : Argument courant / Limite / Réponse WTF ───
export interface MarketArgument {
  argument: string;
  limite: string;
  reponseHalo: string;
}

export const MARKET_ARGUMENTS: MarketArgument[] = [
  {
    argument: "« On va te rendre riche »",
    limite:
      "Aucune agence ni outil ne garantit un niveau de revenus. Les résultats dépendent du créateur, de son audience et de son engagement.",
    reponseHalo:
      "WTF ne promet pas de revenus. Nous fournissons des outils pour structurer votre activité, analyser vos performances et prendre de meilleures décisions. Les résultats vous appartiennent.",
  },
  {
    argument: "« On gère tout pour toi »",
    limite:
      "Déléguer intégralement sa carrière peut conduire à une perte de contrôle et de compréhension de sa propre activité.",
    reponseHalo:
      "WTF vous donne les outils pour gérer vous-même, avec plus d'efficacité. Vous restez maître de vos décisions. Nous vous aidons à monter en compétence, pas à dépendre.",
  },
  {
    argument: "« On a déjà des modèles qui font X »",
    limite:
      "Les performances passées d'autres créateurs ne prédisent pas vos résultats. Chaque audience, niche et stratégie est unique.",
    reponseHalo:
      "Nous ne communiquons pas sur les revenus d'autres créateurs. Nous présentons des scénarios d'usage illustratifs, clairement identifiés comme tels, pour vous aider à imaginer ce que nos outils peuvent vous apporter.",
  },
  {
    argument: "« On prend en charge ton image »",
    limite:
      "Quand une agence contrôle l'image, le créateur peut perdre son authenticité, qui est souvent la raison pour laquelle son audience le suit.",
    reponseHalo:
      "Studio IA et Media Kit Generator vous aident à produire une image cohérente et premium, mais c'est vous qui la définissez. Votre authenticité reste votre meilleur atout.",
  },
  {
    argument: "« On t'offre des cadeaux »",
    limite:
      "Les avantages ponctuels (produits offerts, invitations) peuvent masquer des commissions élevées ou des clauses d'exclusivité contraignantes.",
    reponseHalo:
      "Nous ne faisons pas de cadeaux. Nous construisons des outils. La valeur que vous retirez de WTF vient de ce que vous créez avec, pas de perks temporaires.",
  },
  {
    argument: "« On a une équipe énorme »",
    limite:
      "La taille d'une équipe ne garantit pas la qualité du service. Les grands effectifs peuvent entraîner des coûts élevés répercutés sur le créateur.",
    reponseHalo:
      "Notre approche repose sur l'IA et l'automatisation intelligente, pas sur une armée d'intermédiaires. Des coûts plus bas, une efficacité plus élevée, et vous gardez plus de vos revenus.",
  },
  {
    argument: "« On fait du contenu qui vend vite »",
    limite:
      "Les contenus clickbait ou à fort taux de conversion immédiate peuvent dégrader votre image de marque sur la durée.",
    reponseHalo:
      "Nous privilégions une approche de structuration long terme. Content Vault, analyse de tendances et Media Kit Generator sont pensés pour construire une marque durable, pas pour épuiser votre audience.",
  },
];

// ─── Tableau 3 : Besoin / Solution WTF / Pour qui / Option / Niveau autonomie ───
export interface BesoinSolution {
  besoin: string;
  solutionHalo: string;
  pourQui: string;
  optionPossible: string;
  niveauAutonomie: string;
}

export const BESOIN_SOLUTIONS: BesoinSolution[] = [
  {
    besoin: "Comprendre et maximiser mes revenus",
    solutionHalo:
      "Revenue Radar : visualisez vos revenus par plateforme, par période, par type de contenu. Croisez avec vos campagnes CRM.",
    pourQui: "Tout créateur générant des revenus sur au moins une plateforme",
    optionPossible: "Tableau de bord seul ou avec analyse assistée CHATEENG",
    niveauAutonomie: "Autonome",
  },
  {
    besoin: "Gérer ma communauté de fans",
    solutionHalo:
      "Atlas CRM : segmentez vos fans, suivez leurs interactions, créez des campagnes ciblées. Fan Brain analyse les tendances.",
    pourQui: "Créateurs avec une communauté active (dès 100 fans)",
    optionPossible: "CRM seul ou couplé au CHATEENG pour les suggestions",
    niveauAutonomie: "Autonome",
  },
  {
    besoin: "Créer du contenu régulièrement sans perdre de temps",
    solutionHalo:
      "Studio IA : génération assistée de contenu, templates, planification. Content Vault pour organiser vos idées et votre calendrier.",
    pourQui: "Créateurs produisant du contenu de façon régulière",
    optionPossible: "Studio IA en autonomie ou avec révision humaine",
    niveauAutonomie: "Autonome",
  },
  {
    besoin: "Protéger mes comptes des restrictions",
    solutionHalo:
      "Bouclier Légal : vérification de conformité, alertes sur les contenus à risque, recommandations préventives.",
    pourQui: "Tout créateur sur des plateformes à risque de restriction (OnlyFans, Instagram, TikTok)",
    optionPossible: "Automatique ou avec escalade vers un avocat partenaire",
    niveauAutonomie: "Guidé",
  },
  {
    besoin: "Analyser un contrat avant de signer",
    solutionHalo:
      "WTF Lex : uploader un contrat, recevoir une analyse clause par clause, identifier les points de vigilance.",
    pourQui: "Créateurs recevant des contrats de collaboration, sponsoring ou partenariat",
    optionPossible: "Analyse IA seule ou avec validation avocat partenaire",
    niveauAutonomie: "Guidé",
  },
  {
    besoin: "Construire une image de marque premium",
    solutionHalo:
      "Media Kit Generator : créez un dossier de présentation professionnel. Studio IA pour des visuels cohérents.",
    pourQui: "Créateurs souhaitant monter en gamme et attirer des collaborations premium",
    optionPossible: "Templates guidés ou création libre",
    niveauAutonomie: "Autonome",
  },
  {
    besoin: "Être accompagné au quotidien",
    solutionHalo:
      "CHATEENG : disponible 24/7 pour répondre à vos questions, suggérer des actions, vous aider à prioriser.",
    pourQui: "Tout utilisateur WTF, quel que soit son niveau",
    optionPossible: "CHATEENG seul ou en complément d'un accompagnement humain",
    niveauAutonomie: "Assisté",
  },
  {
    besoin: "Préparer ma stratégie de contenu",
    solutionHalo:
      "Content Vault + CHATEENG : stockez vos idées, planifiez votre calendrier éditorial, recevez des suggestions basées sur les tendances.",
    pourQui: "Créateurs souhaitant professionnaliser leur production de contenu",
    optionPossible: "Planification manuelle ou suggestions IA",
    niveauAutonomie: "Autonome",
  },
  {
    besoin: "Comprendre ce que veulent mes fans",
    solutionHalo:
      "Fan Brain : analyse des segments d'audience, des interactions, des tendances de consommation de contenu.",
    pourQui: "Créateurs avec une base de fans segmentable (dès 200 fans actifs)",
    optionPossible: "Analyse automatique avec rapports périodiques",
    niveauAutonomie: "Autonome",
  },
  {
    besoin: "Trouver un avocat si nécessaire",
    solutionHalo:
      "Mise en relation avec des avocats partenaires via WTF Lex, après analyse préparatoire de votre situation.",
    pourQui: "Créateurs confrontés à une situation juridique complexe",
    optionPossible: "Escalade ponctuelle (pas un abonnement juridique permanent)",
    niveauAutonomie: "Accompagné",
  },
  {
    besoin: "Simuler l'impact d'un changement de commissions",
    solutionHalo:
      "Simulateur de commissions intégré : visualisez ce que vous gagneriez avec différents modèles de répartition.",
    pourQui: "Créateurs qui évaluent différentes offres d'agences ou de plateformes",
    optionPossible: "Simulation libre, résultats exportables",
    niveauAutonomie: "Autonome",
  },
  {
    besoin: "Suivre mes obligations légales",
    solutionHalo:
      "Bouclier Légal + WTF Lex : veille sur les évolutions réglementaires, alertes de conformité, modèles de documents.",
    pourQui: "Créateurs professionnels soumis à des obligations déclaratives et contractuelles",
    optionPossible: "Suivi automatisé ou accompagnement ponctuel",
    niveauAutonomie: "Guidé",
  },
];
