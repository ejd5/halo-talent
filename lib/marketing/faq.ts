export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategory {
  categorie: string;
  description: string;
  items: FAQItem[];
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    categorie: "Général",
    description: "Tout savoir sur Where Talent Forms, sa mission et son fonctionnement.",
    items: [
      {
        question: "Qu'est-ce que Where Talent Forms ?",
        answer:
          "Where Talent Forms est une plateforme d'outils conçue pour les créateurs de contenu. Elle regroupe un CRM (Atlas), une IA de création (Studio IA), un assistant juridique (WTF Lex), un outil de protection (Bouclier Légal), et un assistant conversationnel (Chat AI). L'objectif : vous aider à structurer votre activité avec plus de clarté et de contrôle.",
      },
      {
        question: "Where Talent Forms est-il une agence ?",
        answer:
          "Non. Where Talent Forms n'est pas une agence. Nous ne gérons pas votre carrière, ne prenons pas de décisions à votre place et ne vous imposons pas de collaborations. Nous fournissons des outils que vous utilisez en autonomie pour piloter votre activité.",
      },
      {
        question: "Qui est derrière Where Talent Forms ?",
        answer:
          "Where Talent Forms est un projet indépendant. Les informations administratives complètes (raison sociale, SIRET, adresse) sont disponibles sur notre page Mentions légales.",
      },
      {
        question: "Est-ce que Where Talent Forms remplace mon manager ou mon agence ?",
        answer:
          "Cela dépend de vos besoins. Pour certains créateurs, Where Talent Forms peut remplacer une agence traditionnelle en fournissant des outils plus efficaces et moins coûteux. Pour d'autres, WTF complète l'accompagnement humain d'un manager ou d'une agence. C'est vous qui décidez.",
      },
      {
        question: "Combien coûte Where Talent Forms ?",
        answer:
          "Where Talent Forms propose différents niveaux d'accès selon les services utilisés. La commission WTF est réduite et transparente (5 à 15 % selon les services activés). Contactez-nous pour une simulation personnalisée ou utilisez notre simulateur de commissions.",
      },
      {
        question: "Puis-je tester Where Talent Forms avant de m'engager ?",
        answer:
          "Oui. Vous pouvez demander une démonstration personnalisée via notre page Démo. Nous vous montrerons comment les outils fonctionnent et répondrons à vos questions avant toute décision.",
      },
      {
        question: "Where Talent Forms est-il disponible dans le monde entier ?",
        answer:
          "Where Talent Forms est conçu pour les créateurs francophones, quel que soit leur pays de résidence. Certains outils (comme WTF Lex) sont optimisés pour le droit français et européen. Contactez-nous si vous avez des besoins spécifiques liés à votre juridiction.",
      },
      {
        question: "Comment Where Talent Forms se différencie-t-il des autres plateformes ?",
        answer:
          "Where Talent Forms se distingue par son approche intégrée : CRM + IA + juridique + protection dans une seule maison. Nous ne faisons pas de promesses de revenus. Nous ne gérons pas votre carrière à votre place. Nous vous donnons les outils pour la gérer vous-même.",
      },
      {
        question: "Qui utilise Where Talent Forms ?",
        answer:
          "Where Talent Forms s'adresse aux créateurs de contenu qui souhaitent professionnaliser leur activité : créateurs OnlyFans, influenceurs, podcasteurs, musiciens, coachs sportifs, et plus largement toute personne qui monétise son contenu et son image.",
      },
      {
        question: "Where Talent Forms fonctionne-t-il sur mobile ?",
        answer:
          "Oui. La plateforme est conçue pour être utilisée sur ordinateur, tablette et mobile. L'interface s'adapte à votre écran pour que vous puissiez accéder à vos outils où que vous soyez.",
      },
    ],
  },
  {
    categorie: "Commissions",
    description: "Tout comprendre sur le modèle de commission Where Talent Forms.",
    items: [
      {
        question: "Quel est le pourcentage de commission de Where Talent Forms ?",
        answer:
          "La commission WTF varie de 5 à 15 % selon les services que vous activez. Ce taux est transparent et visible dans votre tableau de bord Revenue Radar. Il n'y a pas de frais cachés.",
      },
      {
        question: "Sur quoi porte la commission WTF ?",
        answer:
          "La commission s'applique uniquement sur les revenus générés via les plateformes que vous connectez à WTF. Les revenus issus de collaborations externes, de sponsoring direct ou d'autres sources non connectées ne sont pas commissionnés par WTF.",
      },
      {
        question: "Comment puis-je voir combien WTF prélève ?",
        answer:
          "Le tableau de bord Revenue Radar affiche en temps réel vos revenus par plateforme, les commissions appliquées, et le montant net que vous conservez. Chaque euro est tracé.",
      },
      {
        question: "Y a-t-il des frais cachés ?",
        answer:
          "Non. Le modèle de commission WTF est transparent. Le taux convenu est appliqué et visible. Il n'y a pas de frais d'inscription, de frais de dossier, ou de coûts additionnels non annoncés.",
      },
      {
        question: "La commission WTF est-elle négociable ?",
        answer:
          "Les conditions standard sont claires et transparentes. Pour les créateurs à très haut volume, des modalités spécifiques peuvent être discutées. Contactez-nous pour en parler.",
      },
      {
        question: "Comment WTF se compare-t-il aux commissions des agences traditionnelles ?",
        answer:
          "Les agences traditionnelles prélèvent généralement 20 à 50 % des revenus des créateurs, parfois davantage. WTF propose un modèle à commission réduite (5-15 %) car notre approche repose sur l'IA et l'automatisation, pas sur une armée d'intermédiaires.",
      },
      {
        question: "Puis-je utiliser le simulateur de commissions sans créer de compte ?",
        answer:
          "Oui. Le simulateur de commissions est accessible librement sur notre site. Il vous permet de comparer différents scénarios de rémunération et de visualiser l'impact d'un changement de commission sur vos revenus annuels.",
      },
      {
        question: "Quand la commission est-elle prélevée ?",
        answer:
          "La commission est prélevée au moment où les revenus sont versés par la plateforme. Vous voyez en temps réel le montant brut, la part WTF, et votre net, sans attendre une facture ou un décompte mensuel.",
      },
      {
        question: "La commission couvre-t-elle tous les outils ?",
        answer:
          "Le taux de commission dépend des services que vous activez. Certains outils peuvent être inclus dans votre formule, d'autres peuvent être ajoutés en option. Le détail vous sera présenté avant toute activation.",
      },
    ],
  },
  {
    categorie: "Atlas",
    description: "Le CRM créateur : gérez vos fans, segmentez, analysez.",
    items: [
      {
        question: "Qu'est-ce qu'Atlas CRM ?",
        answer:
          "Atlas est le CRM (Customer Relationship Management) de Where Talent Forms, conçu spécifiquement pour les créateurs de contenu. Il vous permet de gérer votre communauté de fans, de les segmenter, d'analyser leurs comportements et de créer des campagnes ciblées.",
      },
      {
        question: "Quelles données Atlas collecte-t-il sur mes fans ?",
        answer:
          "Atlas collecte les données d'interaction disponibles via les plateformes que vous connectez : pseudonymes, historique de conversations, achats, abonnements, préférences déclarées. Ces données vous appartiennent et ne sont jamais partagées avec des tiers.",
      },
      {
        question: "Puis-je exporter mes données Atlas ?",
        answer:
          "Oui. Vous pouvez exporter vos données Atlas à tout moment dans un format standard. Vos données vous appartiennent. Si vous décidez de quitter Where Talent Forms, vous repartez avec l'intégralité de votre base.",
      },
      {
        question: "Atlas remplace-t-il mon compte plateforme ?",
        answer:
          "Non. Atlas se connecte à vos comptes plateformes (OnlyFans, etc.) mais ne les remplace pas. Vous continuez à utiliser votre compte normalement. Atlas vous donne une couche supplémentaire d'analyse et de gestion.",
      },
      {
        question: "Comment Fan Brain fonctionne-t-il ?",
        answer:
          "Fan Brain analyse les données de votre communauté pour identifier des tendances : quels segments sont les plus actifs, quels types de contenu génèrent le plus d'engagement, quels fans sont les plus fidèles. Ces analyses vous aident à prendre des décisions éclairées.",
      },
      {
        question: "Atlas est-il sécurisé ?",
        answer:
          "Oui. Les données sont chiffrées en transit (TLS) et au repos. L'accès à vos données est strictement limité. Les sous-traitants (Supabase, Vercel) appliquent des standards de sécurité élevés. Consultez notre Politique de confidentialité pour plus de détails.",
      },
      {
        question: "Combien de fans puis-je gérer avec Atlas ?",
        answer:
          "Atlas est conçu pour évoluer avec votre communauté. Que vous ayez 100 fans ou 100 000, l'outil s'adapte. La segmentation et les analyses restent performantes quelle que soit la taille de votre base.",
      },
      {
        question: "Puis-je créer des campagnes marketing avec Atlas ?",
        answer:
          "Oui. Atlas vous permet de créer des campagnes ciblées par segment : promotions, contenus exclusifs, messages personnalisés. Vous pilotez vos actions marketing depuis un seul tableau de bord.",
      },
    ],
  },
  {
    categorie: "Chat AI",
    description: "L'assistant IA conversationnel disponible 24/7.",
    items: [
      {
        question: "Qu'est-ce que Chat AI ?",
        answer:
          "Chat AI est l'assistant conversationnel de Where Talent Forms. Il est disponible 24/7 pour répondre à vos questions, vous aider à prioriser vos actions, analyser des situations, et vous suggérer des pistes d'amélioration dans votre activité.",
      },
      {
        question: "Quel modèle d'IA utilise Chat AI ?",
        answer:
          "Chat AI utilise les modèles Claude d'Anthropic. Ces modèles ne sont pas entraînés sur vos conversations. Vos échanges restent privés et confidentiels.",
      },
      {
        question: "Chat AI peut-il prendre des décisions à ma place ?",
        answer:
          "Non. Chat AI vous fournit des analyses, des suggestions et des informations pour éclairer vos décisions. La décision finale vous appartient toujours. L'IA est un outil d'aide, pas un substitut à votre jugement.",
      },
      {
        question: "Mes conversations avec Chat AI sont-elles privées ?",
        answer:
          "Oui. Vos conversations avec Chat AI sont strictement confidentielles. Elles ne sont pas partagées avec des tiers, ne sont pas utilisées pour entraîner des modèles, et sont stockées de manière sécurisée.",
      },
      {
        question: "Chat AI peut-il m'aider sur des sujets juridiques ?",
        answer:
          "Chat AI peut vous orienter et vous aider à comprendre des concepts généraux, mais il ne remplace pas un avocat. Pour une analyse juridique approfondie, utilisez WTF Lex, notre outil dédié à l'analyse de contrats, ou consultez un avocat partenaire.",
      },
      {
        question: "Chat AI est-il disponible en français ?",
        answer:
          "Oui. Chat AI est optimisé pour le français et comprend les spécificités culturelles et juridiques francophones. Il peut également converser dans d'autres langues si nécessaire.",
      },
      {
        question: "Puis-je utiliser Chat AI sans les autres outils WTF ?",
        answer:
          "Chat AI fait partie intégrante de l'écosystème Where Talent Forms. Il est le plus utile lorsqu'il peut accéder aux données de vos autres outils (CRM, Revenue Radar) pour vous fournir des réponses contextualisées.",
      },
      {
        question: "Y a-t-il une limite de messages avec Chat AI ?",
        answer:
          "Chat AI est disponible sans limite de messages dans le cadre d'un usage normal de la plateforme. Un usage abusif ou automatisé peut être soumis à des limitations, comme précisé dans nos CGU.",
      },
    ],
  },
  {
    categorie: "Lex",
    description: "Analyse de contrats par IA, protection juridique.",
    items: [
      {
        question: "Qu'est-ce que WTF Lex ?",
        answer:
          "WTF Lex est un outil d'analyse de contrats par IA. Vous uploadez un contrat, et WTF Lex l'analyse clause par clause, identifie les points de vigilance, et vous donne des recommandations pour mieux comprendre vos droits et obligations.",
      },
      {
        question: "WTF Lex remplace-t-il un avocat ?",
        answer:
          "Non. WTF Lex est un outil d'aide à la compréhension des contrats. Il ne constitue pas un conseil juridique. Pour les situations complexes ou à fort enjeu, nous recommandons de faire appel à un avocat. Where Talent Forms peut vous mettre en relation avec des avocats partenaires.",
      },
      {
        question: "Que deviennent les contrats que j'uploade dans WTF Lex ?",
        answer:
          "Les contrats sont traités de manière strictement confidentielle. Ils ne sont pas conservés au-delà de la durée nécessaire à l'analyse, ne sont pas utilisés pour entraîner des modèles d'IA, et ne sont jamais partagés avec des tiers sans votre consentement explicite.",
      },
      {
        question: "Quels types de contrats WTF Lex peut-il analyser ?",
        answer:
          "WTF Lex est optimisé pour les contrats fréquents dans l'économie des créateurs : contrats de collaboration, contrats de sponsoring, accords d'exclusivité, contrats de licence d'image, conditions générales de plateformes. Il peut également analyser d'autres types de contrats.",
      },
      {
        question: "WTF Lex détecte-t-il les clauses abusives ?",
        answer:
          "WTF Lex identifie les clauses qui méritent votre attention : clauses d'exclusivité, clauses de cession de droits, pénalités, durées d'engagement, conditions de résiliation. Il les signale et vous explique pourquoi elles sont importantes.",
      },
      {
        question: "Combien de temps prend une analyse WTF Lex ?",
        answer:
          "L'analyse initiale par IA est quasi instantanée (quelques secondes à quelques minutes selon la longueur du contrat). Si vous demandez une validation par un avocat partenaire, le délai dépend de sa disponibilité.",
      },
      {
        question: "WTF Lex est-il disponible pour les créateurs hors France ?",
        answer:
          "WTF Lex est optimisé pour le droit français et européen. Si vous êtes basé hors d'Europe, l'outil peut vous aider à comprendre la structure d'un contrat, mais les analyses juridiques spécifiques à votre juridiction peuvent être limitées.",
      },
      {
        question: "Puis-je utiliser WTF Lex ponctuellement ?",
        answer:
          "Oui. WTF Lex est accessible selon les services que vous activez. Vous pouvez l'utiliser pour une analyse ponctuelle sans engagement à long terme.",
      },
    ],
  },
  {
    categorie: "Protection",
    description: "Bouclier Légal, conformité, sécurité des comptes.",
    items: [
      {
        question: "Qu'est-ce que le Bouclier Légal ?",
        answer:
          "Le Bouclier Légal est un outil préventif qui vérifie la conformité de vos contenus et de vos pratiques par rapport aux CGU des plateformes et aux réglementations applicables. Il vous alerte en cas de risque détecté.",
      },
      {
        question: "Le Bouclier Légal garantit-il que mon compte ne sera jamais banni ?",
        answer:
          "Non. Le Bouclier Légal réduit les risques en vous aidant à respecter les CGU, mais il ne peut pas garantir l'absence de restriction. Les décisions des plateformes leur appartiennent. Le Bouclier Légal est un outil de prévention, pas une immunité.",
      },
      {
        question: "Quels types de risques le Bouclier Légal détecte-t-il ?",
        answer:
          "Le Bouclier Légal analyse vos contenus et pratiques par rapport aux CGU des plateformes connectées (OnlyFans, Instagram, TikTok, etc.) et aux réglementations (RGPD, droit à l'image, etc.). Il signale les contenus qui pourraient enfreindre ces règles.",
      },
      {
        question: "À quelle fréquence le Bouclier Légal vérifie-t-il mes contenus ?",
        answer:
          "La vérification peut être configurée selon vos besoins : analyse en continu, vérification périodique, ou analyse à la demande avant publication. Vous choisissez le niveau de surveillance qui vous convient.",
      },
      {
        question: "Le Bouclier Légal peut-il m'aider si mon compte a déjà été restreint ?",
        answer:
          "Le Bouclier Légal est conçu comme un outil préventif. Si votre compte a déjà subi une restriction, nos outils peuvent vous aider à comprendre la cause et à ajuster vos pratiques pour l'avenir, mais ils ne peuvent pas annuler une décision de plateforme.",
      },
      {
        question: "Comment WTF protège-t-il mes données personnelles ?",
        answer:
          "Vos données sont protégées par chiffrement (TLS en transit, chiffrement au repos), authentification forte, accès restreint, et audits réguliers. Consultez notre Politique de confidentialité pour le détail des mesures.",
      },
      {
        question: "Puis-je utiliser le Bouclier Légal sans les autres outils WTF ?",
        answer:
          "Le Bouclier Légal est le plus efficace lorsqu'il est couplé à l'écosystème WTF (notamment WTF Lex pour l'analyse juridique approfondie). Il peut néanmoins être activé comme service indépendant.",
      },
      {
        question: "Le Bouclier Légal couvre-t-il les questions de droit à l'image ?",
        answer:
          "Oui. Le Bouclier Légal inclut des vérifications liées au droit à l'image : consentement des personnes apparaissant dans vos contenus, utilisation de marques ou logos, respect des droits de propriété intellectuelle.",
      },
    ],
  },
  {
    categorie: "Départements",
    description: "Comment Where Talent Forms est organisé.",
    items: [
      {
        question: "Comment Where Talent Forms est-il structuré ?",
        answer:
          "Where Talent Forms est organisé en départements, comme une maison. Chaque département couvre un aspect de l'activité créateur : Stratégie, Image, Protection, CRM, IA Studio, Chat AI, Juridique. Cette structure vous permet d'activer les services dont vous avez besoin.",
      },
      {
        question: "Puis-je n'activer qu'un seul département ?",
        answer:
          "Oui. Vous choisissez les départements qui correspondent à vos besoins. Vous n'êtes pas obligé d'activer tous les services. Vous pouvez commencer avec un département et en ajouter d'autres au fur et à mesure.",
      },
      {
        question: "Qu'est-ce que le département Stratégie ?",
        answer:
          "Le département Stratégie regroupe les outils d'analyse et de pilotage : Revenue Radar, Fan Brain, simulateur de commissions. Il vous aide à prendre des décisions éclairées basées sur vos données réelles.",
      },
      {
        question: "Qu'est-ce que le département Image ?",
        answer:
          "Le département Image regroupe les outils de création et de positionnement : Studio IA (génération de contenu), Media Kit Generator, Content Vault. Il vous aide à produire et organiser votre contenu de manière cohérente et premium.",
      },
      {
        question: "Y a-t-il un département pour les débutants ?",
        answer:
          "Tous les départements sont conçus pour être accessibles aux débutants comme aux créateurs expérimentés. Chat AI vous accompagne dans la prise en main. Des guides sont disponibles pour chaque outil.",
      },
      {
        question: "De nouveaux départements seront-ils créés ?",
        answer:
          "Where Talent Forms évolue avec les besoins des créateurs. De nouveaux outils et départements pourront voir le jour. Les créateurs existants seront informés des nouveautés et pourront les activer s'ils le souhaitent.",
      },
      {
        question: "Comment les départements communiquent-ils entre eux ?",
        answer:
          "Les départements WTF sont intégrés : vos données CRM alimentent les suggestions du Chat AI, les analyses de Fan Brain informent le Studio IA, les alertes du Bouclier Légal sont accessibles depuis votre tableau de bord central.",
      },
      {
        question: "Puis-je changer de départements en cours de route ?",
        answer:
          "Oui, tout à fait. Vous pouvez activer ou désactiver des départements selon l'évolution de vos besoins. Il n'y a pas d'engagement rigide.",
      },
    ],
  },
  {
    categorie: "Candidature",
    description: "Comment rejoindre Where Talent Forms.",
    items: [
      {
        question: "Comment postuler pour rejoindre Where Talent Forms ?",
        answer:
          "Rendez-vous sur notre page Candidature (/apply). Remplissez le formulaire avec vos informations, vos plateformes, vos revenus déclarés, et vos objectifs. Notre équipe étudiera votre dossier.",
      },
      {
        question: "Quels sont les critères pour être accepté ?",
        answer:
          "Nous évaluons chaque candidature individuellement. Nous regardons votre activité, votre potentiel, et surtout votre motivation à professionnaliser votre démarche. Il n'y a pas de seuil minimum de revenus ou d'abonnés.",
      },
      {
        question: "Combien de temps prend l'étude d'une candidature ?",
        answer:
          "Nous nous efforçons de répondre sous 5 à 10 jours ouvrés. Les candidatures sont étudiées avec attention, ce qui peut prendre un peu de temps. Vous recevrez une réponse quel que soit le résultat.",
      },
      {
        question: "Y a-t-il des frais de candidature ?",
        answer:
          "Non. La candidature est entièrement gratuite. Il n'y a aucun frais de dossier, d'inscription ou d'étude de votre profil.",
      },
      {
        question: "Puis-je candidater si je débute ?",
        answer:
          "Oui. Nous étudions les candidatures de créateurs à tous les stades de développement. Si vous débutez mais avez une vision claire et une forte motivation, votre candidature sera étudiée avec la même attention.",
      },
      {
        question: "Que se passe-t-il après l'acceptation de ma candidature ?",
        answer:
          "Après acceptation, vous recevrez un accès à la plateforme et pourrez activer les départements qui vous intéressent. Un onboarding vous guidera dans la prise en main des outils.",
      },
      {
        question: "Ma candidature peut-elle être refusée ?",
        answer:
          "Oui, une candidature peut ne pas aboutir si le profil ne correspond pas à notre accompagnement actuel. Un refus ne signifie pas que votre travail n'est pas valable, simplement que notre proposition n'est peut-être pas la plus adaptée à votre situation à ce moment.",
      },
      {
        question: "Puis-je re-candidater en cas de refus ?",
        answer:
          "Oui. Si votre situation évolue (nouvelle plateforme, croissance d'audience, nouveau projet), vous pouvez tout à fait soumettre une nouvelle candidature.",
      },
    ],
  },
  {
    categorie: "Juridique",
    description: "Contrats, conformité, droits et obligations.",
    items: [
      {
        question: "Where Talent Forms fournit-il des conseils juridiques ?",
        answer:
          "Non. Where Talent Forms fournit des outils d'aide à la compréhension (WTF Lex) et de prévention (Bouclier Légal), mais ne constitue pas un conseil juridique. Pour un avis juridique engageant, vous devez consulter un avocat.",
      },
      {
        question: "Puis-je obtenir un avocat via Where Talent Forms ?",
        answer:
          "Where Talent Forms peut vous mettre en relation avec des avocats partenaires spécialisés dans l'économie des créateurs. Cette mise en relation se fait sur demande et avec votre consentement explicite.",
      },
      {
        question: "Qui est responsable du contenu que je publie ?",
        answer:
          "Vous êtes seul responsable du contenu que vous créez et publiez. Where Talent Forms vous fournit des outils pour vous aider à respecter les règles, mais la responsabilité finale du contenu vous appartient.",
      },
      {
        question: "Que se passe-t-il si je viole les CGU d'une plateforme ?",
        answer:
          "Where Talent Forms n'est pas responsable des violations des CGU des plateformes tierces. Nos outils (Bouclier Légal) vous aident à les respecter, mais la décision d'une plateforme de restreindre votre compte lui appartient.",
      },
      {
        question: "Comment WTF gère-t-il les droits d'auteur ?",
        answer:
          "Le contenu que vous créez via nos outils vous appartient. Where Talent Forms ne revendique aucun droit de propriété sur vos créations. Vous nous concédez une licence limitée d'utilisation aux seules fins de fournir le service.",
      },
      {
        question: "Where Talent Forms est-il conforme au RGPD ?",
        answer:
          "Nous nous engageons à respecter le RGPD et la Loi Informatique et Libertés. Notre Politique de confidentialité détaille nos pratiques. Nous vous recommandons de la faire valider par votre propre conseil juridique.",
      },
      {
        question: "Que faire si je trouve mes contenus utilisés sans autorisation ?",
        answer:
          "Contactez-nous. Nos outils peuvent vous aider à documenter l'utilisation non autorisée et à préparer un dossier. Pour les démarches légales, nous vous orienterons vers un avocat partenaire si nécessaire.",
      },
      {
        question: "Les analyses WTF Lex sont-elles juridiquement opposables ?",
        answer:
          "Non. Les analyses WTF Lex sont fournies à titre informatif et ne constituent pas un document juridiquement opposable. Seul un avocat peut produire un avis juridique engageant.",
      },
    ],
  },
  {
    categorie: "Sécurité",
    description: "Protection de vos données, confidentialité, bonnes pratiques.",
    items: [
      {
        question: "Comment Where Talent Forms protège-t-il mes données ?",
        answer:
          "Nous utilisons le chiffrement TLS pour les données en transit, le chiffrement au repos pour les données stockées, l'authentification forte, et des contrôles d'accès stricts. Des audits de sécurité sont réalisés régulièrement.",
      },
      {
        question: "Où sont stockées mes données ?",
        answer:
          "Vos données sont stockées sur les infrastructures de Vercel (Edge Network, USA) et Supabase (base de données, UE/USA). Des garanties contractuelles (DPA) encadrent ces sous-traitances.",
      },
      {
        question: "Puis-je supprimer toutes mes données ?",
        answer:
          "Oui. Vous pouvez demander la suppression de vos données à tout moment. Conformément au RGPD, nous supprimerons vos données dans les délais légaux, sous réserve des obligations de conservation légales.",
      },
      {
        question: "Comment sont gérés les mots de passe ?",
        answer:
          "Les mots de passe sont hashés (c'est-à-dire transformés de manière irréversible) avant stockage. Personne chez Where Talent Forms ne peut voir votre mot de passe en clair. Nous utilisons Supabase Auth pour l'authentification.",
      },
      {
        question: "Where Talent Forms a-t-il déjà subi une violation de données ?",
        answer:
          "Nous mettons tout en œuvre pour protéger vos données. En cas de violation, nous nous engageons à notifier les personnes concernées et l'autorité de contrôle dans les délais légaux, conformément au RGPD.",
      },
      {
        question: "Puis-je activer l'authentification à deux facteurs ?",
        answer:
          "L'authentification à deux facteurs (2FA) fait partie des mesures de sécurité que nous recommandons et qui sont en cours de déploiement. Contactez-nous pour connaître les options disponibles.",
      },
      {
        question: "Les employés de WTF peuvent-ils accéder à mes données ?",
        answer:
          "L'accès aux données est strictement limité aux personnes qui en ont besoin pour fournir le service (support technique, maintenance). Cet accès est tracé et contrôlé. Personne ne consulte vos données par curiosité.",
      },
      {
        question: "Comment puis-je signaler un problème de sécurité ?",
        answer:
          "Si vous découvrez une vulnérabilité ou un problème de sécurité, contactez-nous immédiatement via le formulaire de contact en choisissant le sujet 'Sécurité'. Nous traitons les signalements de sécurité en priorité.",
      },
    ],
  },
];
