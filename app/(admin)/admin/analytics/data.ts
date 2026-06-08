import type { AnalyticsData } from "./types";

const MONTHS_24 = Array.from({ length: 24 }, (_, i) => {
  const d = new Date(2024, 6 + i, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
});

export const analyticsData: AnalyticsData = {
  executiveSummary: {
    text: "Cette semaine, vos revenus ont augmenté de 12% (62 340€ vs 55 670€). Trois créateurs sont en forte croissance : Marc T. (+45%), Léa R. (+38%), Inès D. (+22%). Une alerte : 2 créateurs du département Music ont vu leurs revenus baisser de plus de 30%, à investiguer. Recommandation : organiser un point avec elles cette semaine. Le taux de rétention à 6 mois est stable à 89%. Le CAC moyen est de 420€, en baisse de 8% par rapport au trimestre dernier.",
    generated_at: "2026-06-08T06:00:00Z",
    period: "Semaine du 1 au 7 juin 2026",
  },
  monthlyRevenue: MONTHS_24.map((month, i) => ({
    month,
    brut: Math.round(45000 + Math.sin(i * 0.3) * 15000 + i * 2000 + Math.random() * 8000),
    commission: Math.round(8000 + Math.sin(i * 0.3) * 3000 + i * 400 + Math.random() * 1500),
    net: Math.round(37000 + Math.sin(i * 0.3) * 12000 + i * 1600 + Math.random() * 6500),
    creators_count: Math.min(12 + Math.floor(i * 0.3), 22),
  })),
  momGrowth: MONTHS_24.slice(1).map((month, i) => ({
    month,
    growth_pct: Math.round((Math.sin(i * 0.5 + 1) * 8 + 3) * 10) / 10,
  })),
  retention: MONTHS_24.filter((_, i) => i % 2 === 0).map((month, i) => ({
    month,
    active_creators: 18 - i,
    total_creators: 20 - i,
    retention_pct: Math.round((((18 - i) / (20 - i)) * 100) * 10) / 10,
  })),
  ltv: [
    { months: 1, average_ltv: 3200 },
    { months: 3, average_ltv: 8900 },
    { months: 6, average_ltv: 16200 },
    { months: 12, average_ltv: 28500 },
    { months: 24, average_ltv: 48200 },
  ],
  cac: [
    { source: "Organic", cost: 3200, conversions: 12, cac: 267 },
    { source: "Social", cost: 5800, conversions: 9, cac: 644 },
    { source: "Referral", cost: 1500, conversions: 8, cac: 188 },
    { source: "Direct", cost: 800, conversions: 4, cac: 200 },
    { source: "Paid", cost: 4200, conversions: 5, cac: 840 },
  ],
  revenueDistribution: [
    { range: "0-2k€", count: 3 },
    { range: "2-5k€", count: 5 },
    { range: "5-10k€", count: 6 },
    { range: "10-20k€", count: 4 },
    { range: "20-50k€", count: 2 },
    { range: "50k€+", count: 1 },
  ],
  commissionTiers: [
    { tier: "10% (Premium)", count: 3, total_revenue: 125000 },
    { tier: "15% (Standard)", count: 8, total_revenue: 248000 },
    { tier: "20% (Débutant)", count: 6, total_revenue: 72000 },
  ],
  departmentDist: [
    { department: "Music", count: 5, total_revenue: 185000 },
    { department: "Beauté & Mode", count: 6, total_revenue: 142000 },
    { department: "Sport", count: 4, total_revenue: 68000 },
    { department: "Business", count: 3, total_revenue: 45000 },
    { department: "Lifestyle", count: 2, total_revenue: 28000 },
  ],
  seniorityDist: [
    { range: "< 3 mois", count: 3 },
    { range: "3-6 mois", count: 4 },
    { range: "6-12 mois", count: 5 },
    { range: "1-2 ans", count: 4 },
    { range: "2 ans+", count: 2 },
  ],
  activityHeatMap: [
    ...["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].flatMap((day, di) =>
      Array.from({ length: 12 }, (_, hi) => ({
        day, hour: hi + 8, value: Math.round(Math.random() * (di < 5 ? 100 : 60)),
      }))
    ),
  ],
  alerts: [
    { type: "disengaged", severity: "high", message: "Montre des signes de désengagement (baisse activité -40%, revenus -28%)", creator_name: "Emma V." },
    { type: "upsell", severity: "medium", message: "Prêt à passer au palier supérieur (seuil 15k€ atteint 3 mois consécutifs)", creator_name: "Marc T." },
    { type: "burnout", severity: "medium", message: "Risque de burnout détecté (volume contenu x3, pause 0 jour depuis 45 jours)", creator_name: "Inès D." },
    { type: "disengaged", severity: "low", message: "Baisse d'activité modérée sur les stories (-22% engagement)", creator_name: "Hugo P." },
    { type: "upsell", severity: "high", message: "Prêt à passer au palier Premium (seuil 50k€ dépassé)", creator_name: "Clara W." },
  ],
  webTraffic: [
    { page: "/", views: 12450, unique_visitors: 8900, avg_time_seconds: 145, bounce_rate: 32 },
    { page: "/apply", views: 3200, unique_visitors: 2800, avg_time_seconds: 280, bounce_rate: 18 },
    { page: "/manifeste", views: 2100, unique_visitors: 1800, avg_time_seconds: 210, bounce_rate: 25 },
    { page: "/talents", views: 5400, unique_visitors: 4200, avg_time_seconds: 195, bounce_rate: 22 },
    { page: "/departements", views: 3800, unique_visitors: 3100, avg_time_seconds: 170, bounce_rate: 28 },
    { page: "/saas", views: 1800, unique_visitors: 1400, avg_time_seconds: 310, bounce_rate: 15 },
  ],
  trafficSources: [
    { source: "Organic (SEO)", visits: 8520, percentage: 38, trend: "up" },
    { source: "Direct", visits: 6240, percentage: 28, trend: "stable" },
    { source: "Instagram", visits: 3800, percentage: 17, trend: "up" },
    { source: "Referral", visits: 2200, percentage: 10, trend: "up" },
    { source: "YouTube", visits: 1100, percentage: 5, trend: "down" },
    { source: "Paid", visits: 450, percentage: 2, trend: "stable" },
  ],
  funnel: [
    { stage: "Visite page apply", count: 3200, conversion_pct: 100 },
    { stage: "Étape 1 (infos)", count: 1800, conversion_pct: 56.3 },
    { stage: "Étape 2 (questionnaire)", count: 1200, conversion_pct: 66.7 },
    { stage: "Étape 3 (vidéo)", count: 800, conversion_pct: 66.7 },
    { stage: "Soumission", count: 650, conversion_pct: 81.3 },
    { stage: "Approbation", count: 180, conversion_pct: 27.7 },
    { stage: "Signature contrat", count: 150, conversion_pct: 83.3 },
    { stage: "Premier revenu", count: 120, conversion_pct: 80.0 },
  ],
  cohorts: [
    { cohort: "2024-07", months: [1, 3, 6, 12], sizes: [8, 8, 7, 7], retention: [100, 87.5, 75, 62.5] },
    { cohort: "2024-10", months: [1, 3, 6, 12], sizes: [10, 10, 9, 8], retention: [100, 90, 80, 70] },
    { cohort: "2025-01", months: [1, 3, 6, 12], sizes: [12, 12, 11, 10], retention: [100, 91.7, 83.3, 75] },
    { cohort: "2025-04", months: [1, 3, 6, 12], sizes: [10, 10, 9, 8], retention: [100, 90, 80, 70] },
    { cohort: "2025-07", months: [1, 3, 6, 12], sizes: [14, 14, 13, 12], retention: [100, 92.9, 85.7, 78.6] },
    { cohort: "2025-10", months: [1, 3, 6, 12], sizes: [16, 16, 15, 14], retention: [100, 93.8, 87.5, 81.3] },
    { cohort: "2026-01", months: [1, 3, 6, 12], sizes: [18, 18, 17, 16], retention: [100, 94.4, 88.9, 83.3] },
    { cohort: "2026-04", months: [1, 3, 6], sizes: [15, 15, 14], retention: [100, 93.3, 86.7] },
  ],
  devices: [
    { device: "Mobile", percentage: 62 },
    { device: "Desktop", percentage: 31 },
    { device: "Tablette", percentage: 7 },
  ],
};
