// ─── Revenue Radar — Types + Mock Data ──────────────────────

import { mockFans } from "./atlas-fans";
import type { FanIntel } from "./atlas-fans";

// ─── Types ──────────────────────────────────────────────────

export type RadarOpportunityType = "ppv" | "tip" | "reabonnement" | "upsell";
export type RadarKanbanStatus = "identifie" | "prepare" | "envoye" | "converti";
export type RadarTiming = "maintenant" | "ce_soir" | "cette_semaine";

export interface RadarOpportunity {
  id: string;
  fanId: string;
  fanName: string;
  segment: string;
  platform: string;
  opportunityType: RadarOpportunityType;
  totalSpend: number;
  spendLast30d: number;
  averageOrderValue: number;
  lastPurchase: string | null;
  lastMessage: string | null;
  relationshipScore: number;
  commercialScore: number;
  churnRisk: number;
  potentialRevenue: number;
  aiInsight: string;
  aiSuggestion: string;
  kanbanStatus: RadarKanbanStatus;
  timing: RadarTiming;
  ignored: boolean;
  converted: boolean;
  createdAt: string;
}

export interface RadarStats {
  potentialRevenueToday: number;
  pendingOpportunities: number;
  conversionRate: number;
  bestTimeSlot: string;
}

// ─── Color map for opportunity types ────────────────────────

export const OPPORTUNITY_COLORS: Record<RadarOpportunityType, string> = {
  ppv: "#3B82F6",
  tip: "#10B981",
  reabonnement: "#8B5CF6",
  upsell: "#F59E0B",
};

// ─── Helpers ────────────────────────────────────────────────

const now = new Date();

function daysAgo(d: number): string {
  const date = new Date(now);
  date.setDate(date.getDate() - d);
  return date.toISOString();
}

function pick<T>(arr: T[], index: number): T {
  return arr[index % arr.length];
}

function randBetween(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min));
}

// ─── AI insight generation ──────────────────────────────────

function generateInsight(fan: FanIntel): string {
  const insights: string[] = [];

  if (fan.churnRisk > 60) {
    insights.push("Risque de désabonnement — agir dans les 48h");
  }
  if (fan.relationshipScore > 80 && fan.purchasedContentIds.length > 3) {
    insights.push("Achète systématiquement les nouveautés");
  }
  if (fan.averageOrderValue > 80) {
    insights.push("Élasticité prix jusqu'à " + Math.round(fan.averageOrderValue * 1.3) + "€");
  }
  if (fan.lastMessage && fan.lastPurchase) {
    const msgHour = new Date(fan.lastMessage).getHours();
    if (msgHour >= 19 && msgHour <= 23) {
      insights.push("Répond principalement en soirée (21h-23h)");
    }
  }
  if (fan.lifecycleStage === "dormant" || fan.lifecycleStage === "at-risk") {
    insights.push("Baisse d'activité détectée — relance recommandée");
  }
  if (fan.commercialScore > 70 && fan.spendLast30d > 200) {
    insights.push("Fort potentiel d'upsell mensuel");
  }
  if (fan.purchasedContentIds.length > 5) {
    insights.push("Consommateur régulier de contenu exclusif");
  }
  if (fan.commercialScore < 30 && fan.relationshipScore > 60) {
    insights.push("Relation chaleureuse mais peu monétisée — opportunité PPV");
  }

  return insights.length > 0
    ? insights[Math.floor(Math.random() * insights.length)]
    : "Profil standard — opportunité de monétisation";
}

// ─── AI suggestion templates ────────────────────────────────

const PPV_SUGGESTIONS = [
  "Salut {name} ! J'ai un nouveau contenu exclusif qui devrait te plaire. Je peux t'envoyer un aperçu si tu veux !",
  "Hey {name}, je viens de sortir un set photo incroyable. Envoi PPV à 20€, dis-moi si tu es intéressé !",
  "Coucou {name} ! Mon nouveau contenu est dispo en exclusivité pour mes meilleurs fans. Prix spécial pour toi !",
];

const TIP_SUGGESTIONS = [
  "{name}, ton soutien me touche énormément ! Si mon contenu te plaît, tu peux aussi laisser un tip 💕",
  "Merci pour tout {name} ! Les tips m'aident à créer encore plus de contenu pour toi 🙏",
];

const REABONNEMENT_SUGGESTIONS = [
  "Ca te manque {name} ? J'ai préparé une offre spéciale pour ton retour avec -20% sur ton abonnement !",
  "Hey {name} ! Tu me manques ici. J'aimerais beaucoup te revoir parmi mes abonnés 🥺",
];

const UPSELL_SUGGESTIONS = [
  "{name}, j'ai une offre premium qui pourrait t'intéresser. Accès à tout mon contenu exclusif pour seulement {price}€ !",
  "Hey {name}, je lance un pack VIP avec du contenu inédit chaque semaine. Intéressé ?",
];

function generateSuggestion(name: string, type: RadarOpportunityType, aov: number): string {
  const pool =
    type === "ppv" ? PPV_SUGGESTIONS
    : type === "tip" ? TIP_SUGGESTIONS
    : type === "reabonnement" ? REABONNEMENT_SUGGESTIONS
    : UPSELL_SUGGESTIONS;
  const template = pick(pool, name.length + aov);
  return template.replace("{name}", name).replace("{price}", String(Math.round(aov * 0.8)));
}

// ─── Opportunity builder ────────────────────────────────────

const KANBAN_STATUSES: RadarKanbanStatus[] = ["identifie", "identifie", "identifie", "identifie", "identifie", "prepare", "prepare", "prepare", "envoye", "converti"];
const TIMINGS: RadarTiming[] = ["maintenant", "ce_soir", "cette_semaine"];

function generateOpportunityType(fan: FanIntel, index: number): RadarOpportunityType {
  if (fan.subscriptionStatus === "expired" || fan.subscriptionStatus === "cancelled") return "reabonnement";
  if (fan.commercialScore > 50 && fan.averageOrderValue < 100) return "upsell";
  if (fan.purchasedContentIds.length > 0 || fan.averageOrderValue > 20) return "ppv";
  return "tip";
}

export function buildOpportunities(): RadarOpportunity[] {
  const eligible = mockFans.filter(
    (f) => f.status !== "blocked" && f.recommendedAction !== "do_not_contact" && f.consentStatus !== "withdrawn",
  );

  const opps: RadarOpportunity[] = [];

  eligible.forEach((fan, i) => {
    const type = generateOpportunityType(fan, i);

    let potentialRevenue = 0;
    if (type === "ppv") {
      potentialRevenue = Math.round(fan.averageOrderValue * (1.2 + Math.random() * 1.8));
    } else if (type === "tip") {
      potentialRevenue = randBetween(15, Math.min(100, fan.averageOrderValue));
    } else if (type === "reabonnement") {
      potentialRevenue = Math.round(fan.averageOrderValue * 0.8);
    } else if (type === "upsell") {
      potentialRevenue = Math.round(fan.averageOrderValue * 0.5 + randBetween(10, 30));
    }

    opps.push({
      id: `ropp-${String(i + 1).padStart(3, "0")}`,
      fanId: fan.id,
      fanName: fan.pseudonyme,
      segment: fan.lifecycleStage === "new" ? "nouveau" : fan.lifecycleStage === "at-risk" ? "a-risque" : fan.lifecycleStage === "dormant" ? "regular" : fan.totalSpend > 2000 ? "whale" : fan.spendLast30d > 100 ? "tipper" : "regular",
      platform: fan.platform,
      opportunityType: type,
      totalSpend: fan.totalSpend,
      spendLast30d: fan.spendLast30d,
      averageOrderValue: fan.averageOrderValue,
      lastPurchase: fan.lastPurchase,
      lastMessage: fan.lastMessage,
      relationshipScore: fan.relationshipScore,
      commercialScore: fan.commercialScore,
      churnRisk: fan.churnRisk,
      potentialRevenue,
      aiInsight: generateInsight(fan),
      aiSuggestion: generateSuggestion(fan.pseudonyme, type, fan.averageOrderValue),
      kanbanStatus: KANBAN_STATUSES[i % KANBAN_STATUSES.length],
      timing: pick(TIMINGS, i),
      ignored: false,
      converted: false,
      createdAt: daysAgo(randBetween(0, 14)),
    });
  });

  // Sort by potential revenue descending
  opps.sort((a, b) => b.potentialRevenue - a.potentialRevenue);

  return opps;
}

// ─── Stats computation ─────────────────────────────────────

export function computeRadarStats(opportunities: RadarOpportunity[]): RadarStats {
  const active = opportunities.filter((o) => !o.ignored);
  const pending = active.filter((o) => o.kanbanStatus === "identifie" || o.kanbanStatus === "prepare");
  const potentialRevenueToday = active.reduce((sum, o) => sum + o.potentialRevenue, 0);
  const pendingOpportunities = pending.length;
  const conversionRate = 34; // mock: global average
  const bestTimeSlot = "21h-23h";
  return { potentialRevenueToday, pendingOpportunities, conversionRate, bestTimeSlot };
}

// ─── Exported mock data ─────────────────────────────────────

export const mockRadarOpportunities: RadarOpportunity[] = buildOpportunities();
export const mockRadarStats: RadarStats = computeRadarStats(mockRadarOpportunities);
