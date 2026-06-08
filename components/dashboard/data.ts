import type { CreatorProfile, DailyBrief, KpiData, AgentCard, ActivityEvent, EvolutionData, NavSection } from "./types";

export const mockCreator: CreatorProfile = {
  id: "creator-1",
  full_name: "Jean Dupont",
  email: "jean@halotalent.com",
  avatar_url: null,
  department: "Digital Creators",
  commission_tier: "Croissance",
  commission_rate: 25,
  next_tier: { label: "Scale", threshold: 20000 },
  monthly_revenue: 12450,
  joined_at: "2024-03-15T00:00:00Z",
};

export const mockBrief: DailyBrief = {
  greeting: "Jean",
  date: new Date().toISOString(),
  summary:
    "Voici votre matinée du 8 décembre. Hier vous avez généré 487€ (+12% vs avant-hier). Votre post Instagram de 19h a atteint 4 200 vues.",
  yesterday_revenue: 487,
  revenue_change_pct: 12,
  top_post_platform: "Instagram",
  top_post_views: 4200,
  suggestions: [
    {
      id: "s1",
      text: "Répondre aux 12 DMs prioritaires de votre messagerie OnlyFans",
      action: "messages",
    },
    {
      id: "s2",
      text: 'Publier le reel que nous avons planifié pour 18h',
      action: "calendar",
    },
    {
      id: "s3",
      text: "Réviser les prix de votre offre PPV de la semaine prochaine",
      action: "pricing",
    },
  ],
};

export const mockKpi: KpiData = {
  month_revenue: 12450,
  month_revenue_change_pct: 18,
  total_followers: 28400,
  follower_change_pct: 5,
  avg_engagement_rate: 4.7,
  engagement_change_pct: 1.2,
  commission_tier: "Croissance",
  commission_rate: 25,
  next_tier_name: "Scale",
  next_tier_progress_pct: 62,
};

export const agentCards: AgentCard[] = [
  {
    id: "agent-1",
    title: "Content Strategist",
    emoji: "📝",
    description: "Je planifie vos contenus pour maximiser l'engagement",
    status: "3 idées prêtes pour cette semaine",
    action_label: "Ouvrir",
    href: "/dashboard/agents/content",
  },
  {
    id: "agent-2",
    title: "Analytics Coach",
    emoji: "📊",
    description: "J'analyse vos performances et identifie les leviers",
    status: "Nouveau rapport hebdo disponible",
    action_label: "Ouvrir",
    href: "/dashboard/agents/analytics",
  },
  {
    id: "agent-3",
    title: "Engagement Helper",
    emoji: "💬",
    description: "Je drafte vos réponses aux DMs pour vous (vous validez toujours)",
    status: "12 brouillons prêts",
    action_label: "Ouvrir",
    href: "/dashboard/agents/engagement",
  },
  {
    id: "agent-4",
    title: "Trend Spotter",
    emoji: "🔍",
    description: "Je surveille les tendances et la concurrence",
    status: "5 tendances détectées dans votre niche",
    action_label: "Ouvrir",
    href: "/dashboard/agents/trends",
  },
  {
    id: "agent-5",
    title: "Pricing Advisor",
    emoji: "💰",
    description: "J'optimise vos prix selon le marché",
    status: "Suggestion : augmenter votre abonnement de 12€ à 15€",
    action_label: "Ouvrir",
    href: "/dashboard/agents/pricing",
  },
  {
    id: "agent-6",
    title: "Wellness Coach",
    emoji: "🌱",
    description: "Je veille sur votre équilibre",
    status: "Vous travaillez 9h/jour en moyenne. Normal.",
    action_label: "Ouvrir",
    href: "/dashboard/agents/wellness",
  },
];

export const mockActivities: ActivityEvent[] = [
  { id: "act-1", emoji: "🎉", text: "Nouveau revenu : 47€ sur OnlyFans", platform: "OnlyFans", created_at: new Date(Date.now() - 4 * 60000).toISOString() },
  { id: "act-2", emoji: "👥", text: "+12 nouveaux abonnés Instagram", platform: "Instagram", created_at: new Date(Date.now() - 23 * 60000).toISOString() },
  { id: "act-3", emoji: "💌", text: "8 nouveaux messages dans votre boîte", platform: "Messages", created_at: new Date(Date.now() - 60 * 60000).toISOString() },
  { id: "act-4", emoji: "📌", text: "Votre post 'Coucher de soleil' a 1 200 likes", platform: "Instagram", created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: "act-5", emoji: "📈", text: "Objectif mensuel atteint à 72%", platform: "Analytics", created_at: new Date(Date.now() - 3 * 3600000).toISOString() },
  { id: "act-6", emoji: "🎯", text: "Nouvelle offre PPV publiée avec succès", platform: "OnlyFans", created_at: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: "act-7", emoji: "📝", text: "Brouillon 'Ma routine matinale' sauvegardé", platform: "Content", created_at: new Date(Date.now() - 7 * 3600000).toISOString() },
  { id: "act-8", emoji: "🤖", text: "Rapport hebdo Analytics Coach généré", platform: "AI", created_at: new Date(Date.now() - 9 * 3600000).toISOString() },
];

export const mockEvolution: EvolutionData = {
  revenue: [
    { month: "Jan", value: 8900 },
    { month: "Fév", value: 9200 },
    { month: "Mar", value: 10100 },
    { month: "Avr", value: 10800 },
    { month: "Mai", value: 11500 },
    { month: "Juin", value: 12450 },
  ],
  followers: [
    { month: "Jan", value: 22000 },
    { month: "Fév", value: 23500 },
    { month: "Mar", value: 24800 },
    { month: "Avr", value: 25900 },
    { month: "Mai", value: 27100 },
    { month: "Juin", value: 28400 },
  ],
  wellness_score: [
    { month: "Jan", value: 7.5 },
    { month: "Fév", value: 7.0 },
    { month: "Mar", value: 6.5 },
    { month: "Avr", value: 7.0 },
    { month: "Mai", value: 7.5 },
    { month: "Juin", value: 8.0 },
  ],
};

export const navSections: NavSection[] = [
  {
    title: "Pilotage",
    items: [
      { label: "Vue d'ensemble", href: "/dashboard", icon: "LayoutDashboard" },
      { label: "Mes revenus", href: "/dashboard/revenues", icon: "TrendingUp" },
      { label: "Mes objectifs", href: "/dashboard/goals", icon: "Target" },
    ],
  },
  {
    title: "Contenu",
    items: [
      { label: "Calendrier", href: "/dashboard/calendar", icon: "Calendar" },
      { label: "Brouillons", href: "/dashboard/drafts", icon: "FileText" },
      { label: "Bibliothèque", href: "/dashboard/library", icon: "Image" },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { label: "Mes agents IA", href: "/dashboard/agents", icon: "Bot" },
      { label: "Insights", href: "/dashboard/insights", icon: "Lightbulb" },
      { label: "Tendances", href: "/dashboard/trends", icon: "Sparkles" },
    ],
  },
  {
    title: "Plateformes",
    items: [
      { label: "Mes comptes", href: "/dashboard/platforms", icon: "Monitor" },
      { label: "Analytics", href: "/dashboard/analytics", icon: "BarChart3" },
    ],
  },
  {
    title: "Relations",
    items: [
      { label: "Mon manager", href: "/dashboard/manager", icon: "UserCircle" },
      { label: "Mes messages", href: "/dashboard/messages", icon: "MessageSquare" },
      { label: "Communauté", href: "/dashboard/community", icon: "Users" },
    ],
  },
  {
    title: "Ressources",
    items: [
      { label: "Mes contrats", href: "/dashboard/contracts", icon: "FileSignature" },
      { label: "Apprentissage", href: "/dashboard/learn", icon: "GraduationCap" },
      { label: "Wellness", href: "/dashboard/wellness", icon: "Heart" },
    ],
  },
  {
    title: "Paramètres",
    items: [
      { label: "Profil", href: "/dashboard/profile", icon: "User" },
      { label: "Plateformes connectées", href: "/dashboard/integrations", icon: "Link" },
      { label: "Préférences", href: "/dashboard/preferences", icon: "Settings" },
    ],
  },
];

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 30) return `il y a ${days}j`;
  return new Date(dateStr).toLocaleDateString("fr-FR");
}

export function formatEuro(n: number): string {
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}
