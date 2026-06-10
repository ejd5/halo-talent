// ─── Chat Analytics Mock Data ─────────────────────────────
// Dashboard analytics pour le Chat Copilot
// 5 KPIs, courbe 30j, top messages, insights, heatmap

export interface ChatAnalyticsKPIs {
  messagesSent: number;
  messagesSentChange: number; // % vs last month
  avgFanResponseRate: number;
  avgFanResponseRateChange: number;
  chatRevenue: number;
  chatRevenueChange: number;
  avgCreatorResponseTime: number; // seconds
  avgCreatorResponseTimeChange: number; // %
  avgToneGuardScore: number;
  avgToneGuardScoreChange: number;
}

export interface ChatRevenueDay {
  date: string; // ISO date
  ppv: number;
  tips: number;
  resubs: number;
}

export interface TopMessage {
  id: string;
  text: string;
  revenue: number;
  timesUsed: number;
  conversionRate: number; // 0-100
}

export interface AIInsight {
  id: string;
  type: "timing" | "emoji" | "script" | "churn" | "custom";
  message: string;
  ctaLabel: string;
  ctaAction: string;
}

export interface ChatterPerformance {
  id: string;
  name: string;
  avatarInitials: string;
  messagesSent: number;
  revenueGenerated: number;
  avgResponseTime: number; // seconds
  toneGuardScore: number;
}

export interface ActivityCell {
  day: number; // 0=Mon..6=Sun
  hour: number; // 0-23
  count: number;
  revenue: number;
}

export const mockAnalyticsKPIs: ChatAnalyticsKPIs = {
  messagesSent: 1247,
  messagesSentChange: 12.5,
  avgFanResponseRate: 68,
  avgFanResponseRateChange: 3.2,
  chatRevenue: 8450,
  chatRevenueChange: 18.7,
  avgCreatorResponseTime: 184,
  avgCreatorResponseTimeChange: -8.3,
  avgToneGuardScore: 92,
  avgToneGuardScoreChange: 1.5,
};

function generateRevenueDays(): ChatRevenueDay[] {
  const days: ChatRevenueDay[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date("2026-06-10");
    d.setDate(d.getDate() - i);
    days.push({
      date: d.toISOString().slice(0, 10),
      ppv: Math.round(80 + Math.random() * 250),
      tips: Math.round(30 + Math.random() * 120),
      resubs: Math.round(20 + Math.random() * 80),
    });
  }
  return days;
}

export const mockRevenueDays: ChatRevenueDay[] = generateRevenueDays();

export const mockTopMessages: TopMessage[] = [
  { id: "m1", text: "J'ai quelque chose de spécial pour toi... un aperçu de mon prochain contenu. Dis-moi si tu veux voir 👀", revenue: 1240, timesUsed: 23, conversionRate: 34 },
  { id: "m2", text: "Tu fais partie de mes abonnés les plus fidèles, alors j'ai pensé te montrer ça en exclusivité...", revenue: 980, timesUsed: 18, conversionRate: 28 },
  { id: "m3", text: "Je prépare une surprise rien que pour toi cette semaine. Devine ce que c'est ? 😉", revenue: 850, timesUsed: 31, conversionRate: 22 },
  { id: "m4", text: "Cette photo n'a été envoyée qu'à 3 personnes. Tu veux la voir ? 🔥", revenue: 720, timesUsed: 15, conversionRate: 41 },
  { id: "m5", text: "Mon PPV de la semaine est à -50% pour mes abonnés. Dernier jour pour en profiter !", revenue: 680, timesUsed: 12, conversionRate: 19 },
  { id: "m6", text: "Il me reste 2 places pour un appel privé cette semaine. Tu veux réserver la tienne ?", revenue: 590, timesUsed: 8, conversionRate: 45 },
  { id: "m7", text: "J'ai remarqué que tu aimais mes photos en lingerie. J'en ai un set spécial que je n'ai posté nulle part...", revenue: 540, timesUsed: 14, conversionRate: 36 },
  { id: "m8", text: "Abonne-toi maintenant et je t'envoie un cadeau exclusif en MP 🎁", revenue: 480, timesUsed: 42, conversionRate: 11 },
  { id: "m9", text: "Stories interactives cette semaine — vote pour la prochaine tenue que je porterai !", revenue: 420, timesUsed: 9, conversionRate: 16 },
  { id: "m10", text: "Bonne nuit de la part de ta créatrice préférée 💤 Bisous", revenue: 350, timesUsed: 55, conversionRate: 7 },
];

export const mockAIInsights: AIInsight[] = [
  {
    id: "i1",
    type: "timing",
    message: "Vos fans répondent 3× plus entre 20h et 22h. Envoyez vos messages importants dans cette fenêtre.",
    ctaLabel: "Planifier en soirée",
    ctaAction: "schedule_evening",
  },
  {
    id: "i2",
    type: "emoji",
    message: "Les messages avec emoji génèrent 40% de réponses en plus. Ajoutez-en à vos prochains envois.",
    ctaLabel: "Voir les stats",
    ctaAction: "view_emoji_stats",
  },
  {
    id: "i3",
    type: "script",
    message: "Le script « Teaser mystère » a le meilleur taux de conversion (23%). Utilisez-le plus souvent.",
    ctaLabel: "Utiliser ce script",
    ctaAction: "use_mystery_script",
  },
  {
    id: "i4",
    type: "churn",
    message: "17 fans sont à risque de churn cette semaine. Réagissez avant qu'ils ne se désabonnent.",
    ctaLabel: "Voir la liste",
    ctaAction: "view_churn_risk",
  },
];

export const mockChatterPerformance: ChatterPerformance[] = [
  { id: "c1", name: "Sophie Martin", avatarInitials: "SM", messagesSent: 412, revenueGenerated: 3240, avgResponseTime: 95, toneGuardScore: 96 },
  { id: "c2", name: "Lucas Dubois", avatarInitials: "LD", messagesSent: 387, revenueGenerated: 2890, avgResponseTime: 142, toneGuardScore: 88 },
  { id: "c3", name: "Emma Petit", avatarInitials: "EP", messagesSent: 356, revenueGenerated: 2650, avgResponseTime: 78, toneGuardScore: 94 },
  { id: "c4", name: "Hugo Bernard", avatarInitials: "HB", messagesSent: 298, revenueGenerated: 1980, avgResponseTime: 210, toneGuardScore: 82 },
  { id: "c5", name: "Léa Moreau", avatarInitials: "LM", messagesSent: 334, revenueGenerated: 2410, avgResponseTime: 115, toneGuardScore: 91 },
  { id: "c6", name: "Thomas Roux", avatarInitials: "TR", messagesSent: 275, revenueGenerated: 1750, avgResponseTime: 165, toneGuardScore: 79 },
];

// Generate realistic heatmap data (7 days × 24 hours)
export function generateHeatmapData(): ActivityCell[] {
  const cells: ActivityCell[] = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      // Simulate activity pattern: low at night, peaks in evening
      let base = 0;
      if (hour >= 8 && hour < 12) base = 5 + Math.random() * 10;
      else if (hour >= 12 && hour < 14) base = 8 + Math.random() * 8;
      else if (hour >= 14 && hour < 18) base = 10 + Math.random() * 12;
      else if (hour >= 18 && hour < 20) base = 15 + Math.random() * 15;
      else if (hour >= 20 && hour < 23) base = 20 + Math.random() * 20; // peak
      else if (hour >= 23 || hour < 6) base = 1 + Math.random() * 4;
      else if (hour >= 6 && hour < 8) base = 2 + Math.random() * 5;

      const count = Math.round(base);
      const avgRevenue = 3.5 + Math.random() * 8;
      cells.push({ day, hour, count, revenue: Math.round(count * avgRevenue) });
    }
  }
  return cells;
}
