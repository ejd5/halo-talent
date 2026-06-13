export interface Feature {
  title: string;
  description: string;
  benefit: string;
}

export interface WorkflowStep {
  step: string;
  title: string;
  description: string;
}

export interface ComparisonRow {
  category: string;
  chatAiIsolated: string;
  chatterFreelance: string;
  crmClassic: string;
  haloSovereign: string;
}

export interface ProfileCard {
  title: string;
  problem: string;
  solution: string;
}

export interface NoPromiseItem {
  title: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const features: Feature[] = [
  {
    title: "Revenue Inbox",
    description: "Toutes les conversations sont priorisées automatiquement selon le potentiel de revenu du fan.",
    benefit: "Concentrez-vous sur les fans qui génèrent le plus de valeur.",
  },
  {
    title: "Fan Brain",
    description: "Chaque fan a une fiche contexte : historique d'achat, préférences, sujets à éviter, score relationnel.",
    benefit: "Plus besoin de chercher dans 5 onglets avant de répondre.",
  },
  {
    title: "AI Draft Composer",
    description: "L'IA prépare un brouillon de réponse adapté au contexte du fan, au ton du créateur et aux règles de la plateforme.",
    benefit: "Gagnez du temps sans perdre votre voix.",
  },
  {
    title: "PPV Sales Copilot",
    description: "Recommande le contenu PPV le plus pertinent pour chaque fan, avec un prix optimisé et une vérification déjà-vendu.",
    benefit: "Ne proposez jamais deux fois le même contenu au même fan.",
  },
  {
    title: "Content Vault Check",
    description: "Visualisez tout votre catalogue PPV, l'historique des ventes, et identifiez les contenus sous-exploités.",
    benefit: "Transformez votre bibliothèque en machine à revenus.",
  },
  {
    title: "QA Review",
    description: "Chaque brouillon IA est scanné pour détecter les risques : ton inapproprié, promesses non autorisées, fans vulnérables.",
    benefit: "Dormez tranquille : un filet de sécurité vérifie chaque message.",
  },
  {
    title: "Compliance Center",
    description: "Checklist de consentement, module pause d'urgence, registre des règles de chaque plateforme.",
    benefit: "Votre conformité est documentée et auditée.",
  },
  {
    title: "Audit Logs",
    description: "Chaque action, brouillon généré, message approuvé, QA revue, est horodatée et traçable.",
    benefit: "Trace complète en cas de litige ou de contrôle.",
  },
];

export const workflowSteps: WorkflowStep[] = [
  {
    step: "1",
    title: "WTF priorise",
    description: "Les conversations sont classées par potentiel de revenu, urgence et historique du fan.",
  },
  {
    step: "2",
    title: "Fan Brain résume",
    description: "Contexte complet du fan : achats, préférences, sujets sensibles, ton recommandé.",
  },
  {
    step: "3",
    title: "L'IA prépare",
    description: "Un brouillon est généré selon le playbook du créateur, sans jamais envoyer automatiquement.",
  },
  {
    step: "4",
    title: "Compliance Gate vérifie",
    description: "Le brouillon passe au crible : risques, conformité, règles plateforme, ton approprié.",
  },
  {
    step: "5",
    title: "L'humain valide",
    description: "Le créateur ou son équipe approuve, modifie, copie ou bloque. Rien ne part sans validation.",
  },
];

export const comparisonRows: ComparisonRow[] = [
  { category: "Contexte fan complet", chatAiIsolated: "Non", chatterFreelance: "Variable", crmClassic: "Partiel", haloSovereign: "Oui" },
  { category: "Vérification PPV déjà vendu", chatAiIsolated: "Non", chatterFreelance: "Variable", crmClassic: "Non", haloSovereign: "Oui" },
  { category: "Validation humaine obligatoire", chatAiIsolated: "Non", chatterFreelance: "Variable", crmClassic: "Non", haloSovereign: "Oui" },
  { category: "Revue qualité automatisée", chatAiIsolated: "Non", chatterFreelance: "Non", crmClassic: "Non", haloSovereign: "Oui" },
  { category: "Traçabilité complète (audit logs)", chatAiIsolated: "Non", chatterFreelance: "Non", crmClassic: "Partiel", haloSovereign: "Oui" },
  { category: "Contrôle conformité intégré", chatAiIsolated: "Non", chatterFreelance: "Non", crmClassic: "Non", haloSovereign: "Oui" },
  { category: "Supervision admin d'équipe", chatAiIsolated: "Non", chatterFreelance: "Variable", crmClassic: "Partiel", haloSovereign: "Oui" },
  { category: "Contrôle créateur total", chatAiIsolated: "Variable", chatterFreelance: "Partiel", crmClassic: "Partiel", haloSovereign: "Oui" },
  { category: "Export des données", chatAiIsolated: "Partiel", chatterFreelance: "Non", crmClassic: "Oui", haloSovereign: "Oui" },
  { category: "Aucun envoi automatique par défaut", chatAiIsolated: "Variable", chatterFreelance: "Variable", crmClassic: "Variable", haloSovereign: "Oui" },
];

export const profiles: ProfileCard[] = [
  {
    title: "Créateur solo",
    problem: "Vous gérez tout seul et les messages s'accumulent. Impossible de prioriser les fans qui rapportent.",
    solution: "WTF priorise vos conversations et prépare des brouillons. Vous restez aux commandes.",
  },
  {
    title: "Agence OFM",
    problem: "Vous managez plusieurs créateurs avec des équipes de chatters. Difficile de garder le contrôle qualité.",
    solution: "WTF donne à chaque manager une vue d'ensemble, des logs d'audit et des contrôles QA par créateur.",
  },
  {
    title: "Manager d'équipe",
    problem: "Vos chatters passent plus de temps à chercher le contexte qu'à écrire. La qualité varie selon les personnes.",
    solution: "Fan Brain fournit le contexte instantanément. Compliance Gate uniformise la qualité.",
  },
  {
    title: "Équipe chatting",
    problem: "Vous écrivez des dizaines de messages par jour sans visibilité sur ce qui convertit vraiment.",
    solution: "WTF suggère des brouillons optimisés et vous aide à suivre ce qui génère des ventes PPV.",
  },
  {
    title: "Créateur premium",
    problem: "Votre volume de fans rend impossible une gestion personnalisée. Vous risquez de manquer des opportunités.",
    solution: "Revenue Inbox identifie les fans à fort potentiel. PPV Copilot optimise vos recommandations.",
  },
];

export const noPromiseItems: NoPromiseItem[] = [
  {
    title: "Aucun revenu garanti",
    description: "Les recommandations PPV et les brouillons IA sont des outils d'aide à la décision. Les résultats dépendent de nombreux facteurs propres à chaque créateur.",
  },
  {
    title: "Aucune garantie de sécurité de compte",
    description: "WTF ne promet pas une immunité contre les restrictions de plateforme. Nous aidons à structurer les contrôles, mais le risque zéro n'existe pas.",
  },
  {
    title: "Pas un substitut d'avocat",
    description: "WTF Sovereign Chat AI n'est pas un conseiller juridique. Pour toute question légale, rapprochez-vous d'un professionnel du droit ou consultez WTF Lex.",
  },
  {
    title: "Aucun envoi automatique non contrôlé",
    description: "Par défaut, aucun message n'est envoyé sans validation humaine. L'automatisation est une option configurable, jamais une obligation.",
  },
  {
    title: "Pas de contournement des règles plateformes",
    description: "WTF ne fournit aucun outil pour contourner les conditions d'utilisation d'OnlyFans, Fansly, MYM ou toute autre plateforme.",
  },
  {
    title: "Pas de scraping de données fans",
    description: "WTF n'extrait pas, n'aspire pas et ne scrape pas les données des plateformes. Toutes les données sont fournies et contrôlées par le créateur.",
  },
];

export const faqItems: FAQItem[] = [
  {
    question: "Est-ce que WTF répond automatiquement aux fans ?",
    answer: "Non, par défaut. WTF prépare des brouillons que l'humain doit approuver avant de copier et d'envoyer manuellement. L'automatisation est une option configurable qui reste sous contrôle du créateur.",
  },
  {
    question: "Est-ce que l'humain doit valider chaque réponse ?",
    answer: "Oui, c'est le fonctionnement par défaut. Chaque brouillon généré par l'IA passe par une validation humaine. Le créateur ou son équipe approuve, modifie ou bloque chaque message.",
  },
  {
    question: "Est-ce que WTF garantit des revenus ?",
    answer: "Non. WTF fournit des recommandations indicatives basées sur l'historique du fan et les prix pratiqués. Les résultats réels dépendent de nombreux facteurs propres à chaque créateur et à son audience.",
  },
  {
    question: "Est-ce que WTF peut éviter les restrictions de plateforme ?",
    answer: "Non. WTF aide à structurer la conformité (consentement, audit, contrôle qualité) mais ne peut pas garantir l'absence de restrictions. Chaque créateur reste responsable du respect des conditions d'utilisation de sa plateforme.",
  },
  {
    question: "Est-ce que WTF remplace un chatter humain ?",
    answer: "Non. WTF est un copilote qui assiste les chatters humains en préparant des brouillons et en fournissant du contexte. L'humain garde le contrôle éditorial et relationnel.",
  },
  {
    question: "Est-ce que WTF remplace une agence ?",
    answer: "Non. WTF est un outil qui peut être utilisé par des créateurs indépendants ou par des agences pour améliorer la productivité de leurs équipes. Il ne remplace pas le conseil stratégique.",
  },
  {
    question: "Est-ce que WTF fonctionne avec plusieurs plateformes ?",
    answer: "Oui. WTF est conçu pour accompagner les créateurs sur OnlyFans, Fansly, MYM et d'autres plateformes. Les règles spécifiques à chaque plateforme sont prises en compte dans les contrôles de conformité.",
  },
  {
    question: "Est-ce que les données sont exportables ?",
    answer: "Oui. Toutes vos données, conversations, brouillons, logs d'audit, historique PPV, sont exportables à tout moment. Vous gardez le contrôle total de vos informations.",
  },
  {
    question: "Quelle est la différence avec ChatGPT ou Claude ?",
    answer: "Contrairement à un LLM généraliste, WTF est spécialisé dans le chatting créateur. Il intègre le contexte fan (historique d'achat, préférences), les règles des plateformes, un contrôle conformité automatisé, et une validation humaine obligatoire.",
  },
  {
    question: "Quelle est la différence avec un CRM classique ?",
    answer: "Un CRM classique organise les contacts. WTF va plus loin : il analyse le potentiel de chaque fan, génère des brouillons contextuels, vérifie la conformité, et garde une trace de chaque action. C'est un CRM augmenté par l'IA, spécialisé pour le chatting créateur.",
  },
];
