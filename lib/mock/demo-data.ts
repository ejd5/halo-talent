// ─── Interactive Demo Mock Data ───

export type PersonaId = "solo" | "agency" | "premium" | "manager";

export interface DemoPersona {
  id: PersonaId;
  labelKey: string;
  descriptionKey: string;
  emoji: string;
  features: string[];
}

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: "solo",
    labelKey: "demo_new.persona.solo.label",
    descriptionKey: "demo_new.persona.solo.desc",
    emoji: "🎨",
    features: ["demo_new.persona.solo.f1", "demo_new.persona.solo.f2", "demo_new.persona.solo.f3"],
  },
  {
    id: "agency",
    labelKey: "demo_new.persona.agency.label",
    descriptionKey: "demo_new.persona.agency.desc",
    emoji: "🏢",
    features: ["demo_new.persona.agency.f1", "demo_new.persona.agency.f2", "demo_new.persona.agency.f3"],
  },
  {
    id: "premium",
    labelKey: "demo_new.persona.premium.label",
    descriptionKey: "demo_new.persona.premium.desc",
    emoji: "⭐",
    features: ["demo_new.persona.premium.f1", "demo_new.persona.premium.f2", "demo_new.persona.premium.f3"],
  },
  {
    id: "manager",
    labelKey: "demo_new.persona.manager.label",
    descriptionKey: "demo_new.persona.manager.desc",
    emoji: "📊",
    features: ["demo_new.persona.manager.f1", "demo_new.persona.manager.f2", "demo_new.persona.manager.f3"],
  },
];

// ─── Steps ───

export type StepId = "dna" | "studio" | "inbox" | "campaign" | "ppv" | "vault" | "protection" | "commission";

export interface DemoStep {
  id: StepId;
  titleKey: string;
  descriptionKey: string;
}

export const DEMO_STEPS: DemoStep[] = [
  { id: "dna", titleKey: "demo_new.step.dna.title", descriptionKey: "demo_new.step.dna.desc" },
  { id: "studio", titleKey: "demo_new.step.studio.title", descriptionKey: "demo_new.step.studio.desc" },
  { id: "inbox", titleKey: "demo_new.step.inbox.title", descriptionKey: "demo_new.step.inbox.desc" },
  { id: "campaign", titleKey: "demo_new.step.campaign.title", descriptionKey: "demo_new.step.campaign.desc" },
  { id: "ppv", titleKey: "demo_new.step.ppv.title", descriptionKey: "demo_new.step.ppv.desc" },
  { id: "vault", titleKey: "demo_new.step.vault.title", descriptionKey: "demo_new.step.vault.desc" },
  { id: "protection", titleKey: "demo_new.step.protection.title", descriptionKey: "demo_new.step.protection.desc" },
  { id: "commission", titleKey: "demo_new.step.commission.title", descriptionKey: "demo_new.step.commission.desc" },
];

// ─── DNA per persona ───

export interface DnaAttributes {
  voice: string;
  style: string;
  audience: string;
  completion: number;
}

export const PERSONA_DNA: Record<PersonaId, DnaAttributes> = {
  solo: { voice: "Naturel, authentique", style: "Storytelling visuel", audience: "18-34 ans, mode & lifestyle", completion: 72 },
  agency: { voice: "Professionnel, scalable", style: "Branding multicompte", audience: "B2B, créateurs & marques", completion: 85 },
  premium: { voice: "Proche, exclusif", style: "Contenu premium, teasing", audience: "25-45 ans, haut revenu", completion: 90 },
  manager: { voice: "Stratégique, data-driven", style: "Reporting & optimisation", audience: "Équipe & talents", completion: 78 },
};

// ─── Captions per persona ───

export interface CaptionSuggestion {
  text: string;
  platform: string;
  hashtags: string[];
}

export const PERSONA_CAPTIONS: Record<PersonaId, CaptionSuggestion> = {
  solo: {
    text: "✨ Nouveau chapitre ! Après des semaines de préparation, je suis enfin prête à vous montrer ce sur quoi j'ai travaillé. Merci à @halo_talent pour l'accompagnement 💫 Qui veut voir la suite en exclusivité ? Lien en bio 🔗",
    platform: "Instagram",
    hashtags: ["#NouveauDepart", "#Créatrice", "#HaloTalent"],
  },
  agency: {
    text: "🚀 Résultats du mois pour notre réseau de créateurs : +34% d'engagement moyen, 12 nouveaux contrats signés, 3 campagnes virales. Notre secret ? Une approche data-driven associée à une liberté créative totale. Prêts à rejoindre l'aventure ?",
    platform: "LinkedIn",
    hashtags: ["#AgenceCréateurs", "#DataDriven", "#Croissance"],
  },
  premium: {
    text: "🔥 Exclusive preview for my VIPs ! This weekend's content is something special. You asked, I delivered 😏 Make sure your notifications are ON because this one won't last long. Link in bio for early access 🖤",
    platform: "OnlyFans",
    hashtags: ["#Exclusive", "#VIP", "#BehindTheScenes"],
  },
  manager: {
    text: "📊 Tableau de bord de la semaine : 4 créateurs en progression, 2 campagnes à valider, 1 alerte compliance. Les outils WTF nous permettent de tout piloter en temps réel. Réunion d'équipe demain 10h pour préparer la stratégie juillet.",
    platform: "Dashboard",
    hashtags: ["#Management", "#Pilotage", "#HaloAtlas"],
  },
};

// ─── Mock inbox conversations ───

export interface DemoConversation {
  id: string;
  name: string;
  platform: string;
  platformIcon: string;
  preview: string;
  priority: "high" | "medium" | "low";
  revenuePotential: number;
  aiSuggestion: string;
}

export const DEMO_CONVERSATIONS: DemoConversation[] = [
  {
    id: "conv1",
    name: "Sophie Martin",
    platform: "Instagram",
    platformIcon: "IG",
    preview: "Salut ! Je suis intéressée par ton abonnement premium. Est-ce que...",
    priority: "high",
    revenuePotential: 149,
    aiSuggestion: "Proposer un abonnement mensuel à 14.99€ avec 3 jours d'essai gratuit. Mentionner le contenu exclusif.",
  },
  {
    id: "conv2",
    name: "Thomas Dubois",
    platform: "OnlyFans",
    platformIcon: "OF",
    preview: "J'ai vu ton dernier PPV et j'aimerais acheter le pack complet...",
    priority: "high",
    revenuePotential: 89,
    aiSuggestion: "Vente incitative : proposer le bundle 5 PPV à 59.99€ au lieu de l'achat unitaire à 89€.",
  },
  {
    id: "conv3",
    name: "Léa Richard",
    platform: "TikTok",
    platformIcon: "TT",
    preview: "Coucou ! Je t'ai découverte via la tendance #été et j'adore...",
    priority: "medium",
    revenuePotential: 29,
    aiSuggestion: "Accueil chaleureux, puis proposer un lien vers le contenu gratuit pour commencer.",
  },
  {
    id: "conv4",
    name: "Marc Lefèvre",
    platform: "Fansly",
    platformIcon: "FL",
    preview: "Abonné depuis 3 mois, j'aimerais savoir si tu fais des...",
    priority: "medium",
    revenuePotential: 45,
    aiSuggestion: "Remercier pour la fidélité, proposer un contenu personnalisé à 24.99€.",
  },
];

// ─── Campaign mock ───

export const DEMO_CAMPAIGN = {
  name: "Promotion Été 2026",
  segment: "Fans actifs (30 derniers jours)",
  stats: { sent: 1250, opened: 842, clicked: 312, revenue: 4230 },
  channels: ["Email", "SMS", "Push"],
};

// ─── PPV recommendation mock ───

export const DEMO_PPV = {
  currentPrice: 12.99,
  recommendedPrice: 14.99,
  reason: "Votre taux d'engagement est 23% supérieur à la moyenne. Un prix à 14.99€ maximise vos revenus sans réduire les ventes.",
  projectedRevenue: 1875,
};

// ─── Vault items mock ───

export interface VaultItem {
  id: string;
  type: "image" | "video";
  title: string;
  rightsStatus: "validated" | "pending";
  fatigueScore: number;
}

export const DEMO_VAULT_ITEMS: VaultItem[] = [
  { id: "v1", type: "image", title: "Shooting plage #1", rightsStatus: "validated", fatigueScore: 12 },
  { id: "v2", type: "video", title: "Behind the scenes", rightsStatus: "validated", fatigueScore: 45 },
  { id: "v3", type: "image", title: "Lookbook été", rightsStatus: "pending", fatigueScore: 8 },
  { id: "v4", type: "video", title: "Tutoriel maquillage", rightsStatus: "validated", fatigueScore: 67 },
];

// ─── Bouclier Légal mock ───

export const DEMO_LEGAL = {
  score: 14,
  maxScore: 25,
  riskLevel: "high" as const,
  clauses: [
    { label: "Clause d'exclusivité totale", severity: 4 },
    { label: "Commission sur revenus passifs", severity: 3 },
    { label: "Propriété intellectuelle du contenu", severity: 5 },
    { label: "Clause de non-concurrence abusive", severity: 2 },
  ],
};

// ─── Commission simulator config ───

export interface CommissionTier {
  label: string;
  min: number;
  max: number;
  rate: number;
}

export const COMMISSION_TIERS: CommissionTier[] = [
  { label: "Découverte", min: 0, max: 5000, rate: 30 },
  { label: "Croissance", min: 5000, max: 20000, rate: 25 },
  { label: "Scale", min: 20000, max: 50000, rate: 20 },
  { label: "Élite", min: 50000, max: 150000, rate: 15 },
  { label: "Icon", min: 150000, max: Infinity, rate: 10 },
];

export function calculateCommission(revenue: number): {
  tiers: { label: string; amount: number; commission: number }[];
  totalCommission: number;
  effectiveRate: number;
} {
  const tiers = COMMISSION_TIERS.map((t) => {
    const min = t.min;
    const max = t.max === Infinity ? revenue : t.max;
    const taxable = Math.max(0, Math.min(revenue, max) - min);
    const commission = Math.round(taxable * t.rate) / 100;
    return { label: t.label, amount: Math.round(taxable), commission: Math.round(commission) };
  });

  const totalCommission = tiers.reduce((a, t) => a + t.commission, 0);
  const effectiveRate = revenue > 0 ? Math.round((totalCommission / revenue) * 100 * 10) / 10 : 0;

  return { tiers, totalCommission, effectiveRate };
}

// ─── Tracking ───

export type TrackEvent = "demo_started" | "persona_selected" | "step_completed" | "cta_clicked" | "demo_completed";

export function track(event: TrackEvent, data?: Record<string, string>) {
  console.log(`[Demo Track] ${event}`, { timestamp: new Date().toISOString(), ...data });
}
