// ─── Dynamic PPV Pricing, Mock Data + Engine ──────────────

import { mockFans, type FanIntel } from "./atlas-fans";

// ─── Types ──────────────────────────────────────────────────

export interface PPVProduct {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: "photos" | "videos" | "audio" | "bundles" | "custom";
  tags: string[];
  basePrice: number;
  totalSends: number;
  totalUnlocks: number;
  unlockRate: number;
}

export interface FanPPVProfile {
  fanId: string;
  pseudonyme: string;
  tier: string;
  acceptedPrices: number[];
  rejectedPrices: number[];
  lastPPVSend: string | null;
  ppvCount: number;
  ppvConversionRate: number;
  preferredCategories: string[];
  avgAcceptedPrice: number;
  maxAcceptedPrice: number;
  ppvSendDates: string[];
}

export interface PPVRecommendation {
  fanId: string;
  pseudonyme: string;
  tier: string;
  minPrice: number;
  recPrice: number;
  maxPrice: number;
  expectedRevenue: number;
  estimatedConversion: number;
  confidenceScore: number;
  fanLTV: number;
  lastPurchaseDays: number;
  lastMessageDays: number;
  daySinceLastPPV: number;
  justification: string;
  justificationDetails: string[];
}

export type GuardrailStatus = "pass" | "warn" | "block";

export interface PPVGuardrailCheck {
  id: string;
  label: string;
  status: GuardrailStatus;
  detail: string;
  category: "sold" | "price" | "frequency" | "consent" | "disclaimer";
  applicableFansCount: number;
}

export interface PPVABVariant {
  id: "A" | "B" | "C";
  label: string;
  labelKey: string;
  price: number;
  expectedRevenue: number;
  estimatedConversion: number;
  totalRevenue: number;
  fanCount: number;
}

export interface PPVRevenueForecast {
  totalRevenue: number;
  bestVariant: "A" | "B" | "C" | null;
  targetedFans: number;
  avgConversion: number;
  avgConfidence: number;
  confidenceInterval: string;
  variantBreakdown: PPVABVariant[];
}

// ─── 6 Mock PPV Products ────────────────────────────────────

export const mockPPVProducts: PPVProduct[] = [
  {
    id: "ppv-prod-001",
    name: "Séance photo exclusive",
    description: "Série de 8 photos haute résolution en exclusivité",
    thumbnail: "photos",
    category: "photos",
    tags: ["premium", "exclusive", "photoset"],
    basePrice: 25,
    totalSends: 342,
    totalUnlocks: 198,
    unlockRate: 0.58,
  },
  {
    id: "ppv-prod-002",
    name: "Vidéo behind-the-scenes",
    description: "Coulisses du dernier shooting (12 min)",
    thumbnail: "videos",
    category: "videos",
    tags: ["behind-scenes", "exclusive"],
    basePrice: 35,
    totalSends: 210,
    totalUnlocks: 135,
    unlockRate: 0.64,
  },
  {
    id: "ppv-prod-003",
    name: "Message audio personnalisé",
    description: "Message audio personnalisé de 2 minutes",
    thumbnail: "audio",
    category: "audio",
    tags: ["custom", "personal"],
    basePrice: 20,
    totalSends: 95,
    totalUnlocks: 72,
    unlockRate: 0.76,
  },
  {
    id: "ppv-prod-004",
    name: "Bundle VIP du mois",
    description: "Pack mensuel: 15 photos + 2 vidéos exclusives",
    thumbnail: "bundles",
    category: "bundles",
    tags: ["bundle", "vip", "monthly"],
    basePrice: 45,
    totalSends: 150,
    totalUnlocks: 112,
    unlockRate: 0.75,
  },
  {
    id: "ppv-prod-005",
    name: "Série photos lingerie",
    description: "Collection de 12 photos lingerie haute qualité",
    thumbnail: "photos",
    category: "photos",
    tags: ["lingerie", "premium", "photoset"],
    basePrice: 30,
    totalSends: 280,
    totalUnlocks: 185,
    unlockRate: 0.66,
  },
  {
    id: "ppv-prod-006",
    name: "Vidéo one-on-one",
    description: "Vidéo personnalisée dédiée (5 min)",
    thumbnail: "videos",
    category: "custom",
    tags: ["custom", "personal", "premium"],
    basePrice: 75,
    totalSends: 48,
    totalUnlocks: 38,
    unlockRate: 0.79,
  },
];

export const CATEGORY_LABELS: Record<string, string> = {
  photos: "Photos",
  videos: "Vidéos",
  audio: "Audio",
  bundles: "Bundles",
  custom: "Sur-mesure",
};

export const CATEGORY_COLORS: Record<string, string> = {
  photos: "#3B82F6",
  videos: "#8B5CF6",
  audio: "#10B981",
  bundles: "#F59E0B",
  custom: "#E5484D",
};

// ─── Fan PPV Profiles ───────────────────────────────────────

function buildFanProfiles(): FanPPVProfile[] {
  return mockFans.map((f) => {
    const ppvPurchases = f.purchasedContentIds;
    const boughtPrices = ppvPurchases.map((c) => c.amount);
    const avgPrice = boughtPrices.length > 0 ? boughtPrices.reduce((a, b) => a + b, 0) / boughtPrices.length : f.averageOrderValue;

    // Simulate rejection history based on relationship score
    const rejectionRatio = Math.max(0.1, 1 - f.relationshipScore / 120);
    const rejectCount = Math.min(3, Math.floor(ppvPurchases.length * rejectionRatio));
    const rejectedPrices = Array.from({ length: rejectCount }, (_, i) =>
      Math.round(avgPrice * (0.8 + i * 0.15)),
    );

    // Determine preferred categories
    const categories = ppvPurchases.length > 0
      ? [...new Set(ppvPurchases.map((c) => c.type === "video" ? "videos" : c.type === "audio" ? "audio" : "photos"))]
      : ["photos"];

    // Calculate overall conversion rate
    const convRate = f.purchasedContentIds.length > 0
      ? Math.min(1, (f.purchasedContentIds.length / (f.purchasedContentIds.length + Math.max(1, rejectCount)))) * 0.5 + 0.35
      : 0.15 + Math.random() * 0.15;

    // Get last PPV send date (most recent purchase)
    const purchaseDates = ppvPurchases.map((c) => c.date).sort();
    const lastPPV = purchaseDates.length > 0 ? purchaseDates[purchaseDates.length - 1] : null;

    return {
      fanId: f.id,
      pseudonyme: f.pseudonyme,
      tier: f.churnRisk >= 60 ? "at-risk" : f.relationshipScore >= 70 ? "high" : f.relationshipScore >= 50 ? "medium" : "low",
      acceptedPrices: boughtPrices,
      rejectedPrices,
      lastPPVSend: lastPPV,
      ppvCount: ppvPurchases.length,
      ppvConversionRate: Math.round(convRate * 100),
      preferredCategories: categories,
      avgAcceptedPrice: Math.round(avgPrice),
      maxAcceptedPrice: boughtPrices.length > 0 ? Math.max(...boughtPrices) : Math.round(avgPrice),
      ppvSendDates: purchaseDates,
    };
  });
}

export const fanPPVProfiles = buildFanProfiles();

function getFanProfile(fanId: string): FanPPVProfile {
  return fanPPVProfiles.find((p) => p.fanId === fanId) || fanPPVProfiles[0];
}

// ─── Pricing Engine ─────────────────────────────────────────

export interface PricingEngineInput {
  fanId: string;
  product: PPVProduct;
  segmentFanIds: string[];
}

export function calculatePriceTiers(input: PricingEngineInput): PPVRecommendation {
  const profile = getFanProfile(input.fanId);
  const fan = mockFans.find((f) => f.id === input.fanId)!;

  // Segment max price
  const segmentAvgPrices = input.segmentFanIds
    .map((sid) => getFanProfile(sid).avgAcceptedPrice)
    .filter((p) => p > 0);
  const segmentMaxPrice = segmentAvgPrices.length > 0
    ? Math.max(...segmentAvgPrices)
    : input.product.basePrice;

  // Min: never below basePrice × 0.5, never below 5€
  const rawMin = Math.round(profile.avgAcceptedPrice * 0.65);
  const minPrice = Math.max(5, Math.round(rawMin / 5) * 5);

  // Recommended: avg accepted price × 1.1, capped at segment max × 0.9
  const rawRec = Math.round(profile.avgAcceptedPrice * 1.1);
  const capRec = Math.round(segmentMaxPrice * 0.9);
  const recPrice = Math.min(rawRec, capRec, Math.round(input.product.basePrice * 1.4));

  // Max: avg × 1.4, capped at basePrice × 2
  const rawMax = Math.round(profile.avgAcceptedPrice * 1.4);
  const capMax = Math.round(input.product.basePrice * 2);
  const maxPrice = Math.min(rawMax, capMax);

  // Ensure min ≤ rec ≤ max
  const finalRec = Math.max(minPrice, Math.min(recPrice, maxPrice));
  const finalMax = Math.max(finalRec, maxPrice);
  const finalMin = Math.min(minPrice, finalRec);

  // Conversion estimate based on fan history + segment average
  const segmentConv = input.segmentFanIds.length > 0
    ? input.segmentFanIds.reduce((sum, sid) => sum + getFanProfile(sid).ppvConversionRate, 0) / input.segmentFanIds.length
    : 0.4;
  const fanConv = profile.ppvConversionRate / 100;
  const pricePenalty = finalRec / profile.avgAcceptedPrice > 1.5 ? 0.2 : finalRec / profile.avgAcceptedPrice > 1.2 ? 0.1 : 0;
  const estimatedConversion = Math.max(0.05, Math.min(0.95, fanConv * 0.7 + segmentConv / 100 * 0.3 - pricePenalty));
  const estConvPercent = Math.round(estimatedConversion * 100);

  // Expected revenue
  const expectedRevenue = Math.round(finalRec * estimatedConversion * 100) / 100;

  // Confidence score
  let confidenceScore = 20;
  if (profile.ppvCount >= 10) confidenceScore = 90;
  else if (profile.ppvCount >= 6) confidenceScore = 75;
  else if (profile.ppvCount >= 3) confidenceScore = 60;
  else if (profile.ppvCount >= 1) confidenceScore = 40;

  // Last purchase days
  const lastPurchaseDays = fan.lastPurchase
    ? Math.round((Date.now() - new Date(fan.lastPurchase).getTime()) / 86400000)
    : 999;
  const lastMessageDays = fan.lastMessage
    ? Math.round((Date.now() - new Date(fan.lastMessage).getTime()) / 86400000)
    : 999;
  const daysSinceLastPPV = profile.lastPPVSend
    ? Math.round((Date.now() - new Date(profile.lastPPVSend || fan.lastPurchase || Date.now()).getTime()) / 86400000)
    : 999;

  // Justification
  const details: string[] = [];
  details.push(`Prix moyen accepté: ${profile.avgAcceptedPrice}€ (${profile.ppvCount} achats)`);
  details.push(`Dernier achat: il y a ${lastPurchaseDays}j`);
  if (fan.lastMessage) details.push(`Dernier message: il y a ${lastMessageDays}j`);
  details.push(`Taux de conversion PPV: ${profile.ppvConversionRate}%`);
  details.push(`LTV estimée: ${fan.totalSpend}€`);
  details.push(`Engagement: score relationnel ${fan.relationshipScore}/100`);
  if (fan.consentStatus === "active") details.push(`Consentement RGPD: OK`);

  let justification = "";
  if (confidenceScore >= 75) justification = `Recommandation fiable basée sur ${profile.ppvCount} achats PPV`;
  else if (confidenceScore >= 40) justification = `Recommandation basée sur ${profile.ppvCount} achats PPV`;
  else justification = "Recommandation exploratoire (nouveau fan PPV)";

  return {
    fanId: fan.id,
    pseudonyme: fan.pseudonyme,
    tier: fan.relationshipScore >= 70 ? "VIP" : fan.relationshipScore >= 50 ? "Engagé" : "Standard",
    minPrice: finalMin,
    recPrice: finalRec,
    maxPrice: finalMax,
    expectedRevenue,
    estimatedConversion: estConvPercent,
    confidenceScore,
    fanLTV: fan.totalSpend,
    lastPurchaseDays,
    lastMessageDays,
    daySinceLastPPV: daysSinceLastPPV,
    justification,
    justificationDetails: details,
  };
}

export function getRecommendations(
  product: PPVProduct,
  segmentFanIds: string[],
): PPVRecommendation[] {
  return segmentFanIds.map((fanId) =>
    calculatePriceTiers({ fanId, product, segmentFanIds }),
  ).sort((a, b) => b.expectedRevenue - a.expectedRevenue);
}

// ─── Guardrails ─────────────────────────────────────────────

export function runGuardrails(
  product: PPVProduct,
  recommendations: PPVRecommendation[],
  segmentFanIds: string[],
): PPVGuardrailCheck[] {
  const checks: PPVGuardrailCheck[] = [];

  // 1. Already-sold check
  const alreadySoldCount = segmentFanIds.filter((fanId) => {
    const fan = mockFans.find((f) => f.id === fanId);
    return fan?.purchasedContentIds.some((c) => c.id === product.id) ?? false;
  }).length;

  if (alreadySoldCount > 0) {
    checks.push({
      id: "already-sold",
      label: "Contenu déjà vendu",
      status: "block",
      detail: `${alreadySoldCount} fan(s) ont déjà acheté ce contenu.`,
      category: "sold",
      applicableFansCount: alreadySoldCount,
    });
  } else {
    checks.push({
      id: "already-sold",
      label: "Contenu déjà vendu",
      status: "pass",
      detail: "Aucun fan du segment n'a déjà acheté ce contenu.",
      category: "sold",
      applicableFansCount: 0,
    });
  }

  // 2. Price too high
  const priceWarnCount = recommendations.filter((r) => {
    const profile = getFanProfile(r.fanId);
    return profile.maxAcceptedPrice > 0 && r.recPrice > profile.maxAcceptedPrice * 1.3;
  }).length;

  if (priceWarnCount > 0) {
    checks.push({
      id: "price-high",
      label: "Prix trop élevé",
      status: "warn",
      detail: `${priceWarnCount} fan(s), le prix recommandé dépasse de 30% leur maximum historique.`,
      category: "price",
      applicableFansCount: priceWarnCount,
    });
  } else {
    checks.push({
      id: "price-high",
      label: "Prix trop élevé",
      status: "pass",
      detail: "Le prix recommandé est dans la fourchette historique de tous les fans.",
      category: "price",
      applicableFansCount: 0,
    });
  }

  // 3. Excessive frequency
  const freqBlockCount = recommendations.filter((r) => r.daySinceLastPPV < 2).length;

  if (freqBlockCount > 0) {
    checks.push({
      id: "frequency",
      label: "Fréquence excessive",
      status: "block",
      detail: `${freqBlockCount} fan(s) ont reçu un PPV il y a moins de 48h. Délai minimum requis: 48h.`,
      category: "frequency",
      applicableFansCount: freqBlockCount,
    });
  } else {
    checks.push({
      id: "frequency",
      label: "Fréquence excessive",
      status: "pass",
      detail: "Délai de 48h respecté pour tous les fans du segment.",
      category: "frequency",
      applicableFansCount: 0,
    });
  }

  // 4. Missing consent
  const consentBlockCount = segmentFanIds.filter((fanId) => {
    const fan = mockFans.find((f) => f.id === fanId);
    return fan?.consentStatus === "missing" || fan?.consentStatus === "withdrawn";
  }).length;

  if (consentBlockCount > 0) {
    checks.push({
      id: "consent",
      label: "Consentement manquant",
      status: "block",
      detail: `${consentBlockCount} fan(s) sans consentement RGPD valide. Action RGPD non conforme.`,
      category: "consent",
      applicableFansCount: consentBlockCount,
    });
  } else {
    checks.push({
      id: "consent",
      label: "Consentement RGPD",
      status: "pass",
      detail: "Tous les fans du segment ont un consentement RGPD actif.",
      category: "consent",
      applicableFansCount: 0,
    });
  }

  // 5. Disclaimer (always info)
  checks.push({
    id: "disclaimer",
    label: "Promesse trompeuse",
    status: "block" as GuardrailStatus,
    detail: "Les revenus estimés sont des projections basées sur l'historique. Aucune garantie de revenu.",
    category: "disclaimer",
    applicableFansCount: segmentFanIds.length,
  });

  return checks;
}

// ─── A/B Test Helpers ───────────────────────────────────────

export function generateABVariants(
  recommendations: PPVRecommendation[],
): PPVABVariant[] {
  if (recommendations.length === 0) return [];

  const avgMin = Math.round(recommendations.reduce((s, r) => s + r.minPrice, 0) / recommendations.length);
  const avgRec = Math.round(recommendations.reduce((s, r) => s + r.recPrice, 0) / recommendations.length);
  const avgMax = Math.round(recommendations.reduce((s, r) => s + r.maxPrice, 0) / recommendations.length);
  const totalFans = recommendations.length;

  // Variant A: low price (min)
  const convA = 0.55 + (avgMin / avgRec) * 0.1;
  const revPerFanA = avgMin * convA;
  const totalA = Math.round(revPerFanA * totalFans);

  // Variant B: recommended price
  const convB = 0.42;
  const revPerFanB = avgRec * convB;
  const totalB = Math.round(revPerFanB * totalFans);

  // Variant C: premium price (max)
  const convC = 0.28 - (avgMax / avgRec - 1) * 0.08;
  const revPerFanC = avgMax * Math.max(0.12, convC);
  const totalC = Math.round(revPerFanC * totalFans);

  return [
    { id: "A", label: "Prix bas", labelKey: "ppv_pricing.abtest.low_price", price: avgMin, expectedRevenue: Math.round(revPerFanA * 100) / 100, estimatedConversion: Math.round(Math.min(0.95, convA) * 100), totalRevenue: totalA, fanCount: totalFans },
    { id: "B", label: "Prix recommandé", labelKey: "ppv_pricing.abtest.recommended_price", price: avgRec, expectedRevenue: Math.round(revPerFanB * 100) / 100, estimatedConversion: Math.round(Math.min(0.85, convB) * 100), totalRevenue: totalB, fanCount: totalFans },
    { id: "C", label: "Prix premium", labelKey: "ppv_pricing.abtest.premium_price", price: avgMax, expectedRevenue: Math.round(revPerFanC * 100) / 100, estimatedConversion: Math.round(Math.max(5, Math.min(0.7, convC * 100))), totalRevenue: totalC, fanCount: totalFans },
  ];
}

// ─── Revenue Forecast ───────────────────────────────────────

export function generateForecast(
  recommendations: PPVRecommendation[],
  variants: PPVABVariant[],
): PPVRevenueForecast {
  if (recommendations.length === 0 || variants.length === 0) {
    return {
      totalRevenue: 0,
      bestVariant: null,
      targetedFans: 0,
      avgConversion: 0,
      avgConfidence: 0,
      confidenceInterval: "N/A",
      variantBreakdown: [],
    };
  }

  const avgConv = Math.round(recommendations.reduce((s, r) => s + r.estimatedConversion, 0) / recommendations.length);
  const avgConf = Math.round(recommendations.reduce((s, r) => s + r.confidenceScore, 0) / recommendations.length);

  const bestVariant = variants.reduce((best, v) => (v.totalRevenue > (best?.totalRevenue || 0) ? v : best), variants[0]);

  return {
    totalRevenue: Math.max(...variants.map((v) => v.totalRevenue)),
    bestVariant: bestVariant?.id || null,
    targetedFans: recommendations.length,
    avgConversion: avgConv,
    avgConfidence: avgConf,
    confidenceInterval: avgConf >= 50 ? "±15%" : "±30%",
    variantBreakdown: variants,
  };
}

// ─── Exemption helpers ──────────────────────────────────────

export function getBlockedFanIds(checks: PPVGuardrailCheck[]): string[] {
  const blockChecks = checks.filter((c) => c.status === "block" && c.category !== "disclaimer");
  // For now return empty, in a real app these would map to fan IDs
  return [];
}
