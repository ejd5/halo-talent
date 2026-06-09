// ─── Fan Scoring Engine ─────────────────────────────────────
// Calcule le score 0-100 et détermine le tier en temps réel
// Scoring is CONFIDENTIAL — never exposed to fans

import type { AtlasFan, FanTier } from "./fans";

export type { FanTier };

export interface FanInteraction {
  id: string;
  channel: string;
  direction: "inbound" | "outbound";
  occurred_at: string;
}

export interface FanPurchase {
  id: string;
  type: "ppv" | "tip" | "subscription" | "custom" | "bundle";
  amount: number;
  status: string;
  purchased_at: string;
}

export interface ScoringFactors {
  total_spent: number;
  purchases_count: number;
  last_purchase_recency: number;
  avg_order_value: number;
  interaction_frequency: number;
  interaction_recency: number;
  multi_channel: number;
  duration_as_fan: number;
  loyalty_streak: number;
}

export const TIER_THRESHOLDS = {
  churned: { maxScore: Infinity, minDaysInactive: 90 },
  vip:     { minScore: 90, minSpent: 3000 },
  whale:   { minScore: 75, minSpent: 1000 },
  engaged: { minScore: 50, mustHavePurchased: true },
  warm:    { minScore: 30 },
  cold:    { minScore: 0 },
} as const;

// ─── Main scoring function ─────────────────────────────────
//
// Weight distribution:
//   Purchases (40 pts)  — total spent, count, recency, AOV
//   Engagement (30 pts) — frequency, recency, multi-channel
//   Loyalty   (20 pts)  — tenure, consecutive purchase months
//   Signals   (10 pts)  — positive interactions, referrals (future)

export function calculateFanScore(
  fan: Pick<AtlasFan, "total_spent" | "purchases_count" | "last_purchase_at" | "avg_order_value" | "first_seen_at" | "last_interaction_at" | "username_onlyfans" | "username_instagram" | "username_tiktok" | "email" | "phone">,
  interactions: FanInteraction[],
  purchases: FanPurchase[],
): number {
  let score = 0;

  // ══════════════════════════════════════════════
  // PURCHASES (40 pts max)
  // ══════════════════════════════════════════════

  // Total spent (0-15 pts)
  if (fan.total_spent > 5000) score += 15;
  else if (fan.total_spent > 1000) score += 12;
  else if (fan.total_spent > 500) score += 8;
  else if (fan.total_spent > 100) score += 5;
  else if (fan.total_spent > 0) score += 2;

  // Purchase count (0-10 pts)
  const completedPurchases = purchases.filter((p) => p.status === "completed").length;
  if (completedPurchases > 50) score += 10;
  else if (completedPurchases > 20) score += 7;
  else if (completedPurchases > 10) score += 5;
  else if (completedPurchases > 3) score += 3;
  else if (completedPurchases > 0) score += 1;

  // Last purchase recency (0-10 pts)
  if (fan.last_purchase_at) {
    const daysSince = daysBetween(fan.last_purchase_at);
    if (daysSince < 7) score += 10;
    else if (daysSince < 30) score += 7;
    else if (daysSince < 90) score += 4;
    else if (daysSince < 180) score += 1;
  }

  // Average order value (0-5 pts)
  if (fan.avg_order_value > 100) score += 5;
  else if (fan.avg_order_value > 50) score += 3;
  else if (fan.avg_order_value > 20) score += 1;

  // ══════════════════════════════════════════════
  // ENGAGEMENT (30 pts max)
  // ══════════════════════════════════════════════

  // Interaction frequency — last 30 days (0-15 pts)
  const recentInteractions = interactions.filter((i) => {
    return daysBetween(i.occurred_at) < 30;
  }).length;

  if (recentInteractions > 20) score += 15;
  else if (recentInteractions > 10) score += 10;
  else if (recentInteractions > 5) score += 6;
  else if (recentInteractions > 0) score += 3;

  // Interaction recency (0-10 pts)
  if (fan.last_interaction_at) {
    const daysSince = daysBetween(fan.last_interaction_at);
    if (daysSince < 3) score += 10;
    else if (daysSince < 7) score += 7;
    else if (daysSince < 14) score += 4;
    else if (daysSince < 30) score += 1;
  }

  // Multi-channel presence (0-5 pts)
  const channelCount = countActiveChannels(fan);
  if (channelCount >= 3) score += 5;
  else if (channelCount >= 2) score += 3;
  else if (channelCount >= 1) score += 1;

  // ══════════════════════════════════════════════
  // LOYALTY (20 pts max)
  // ══════════════════════════════════════════════

  // Tenure (0-10 pts)
  const daysSinceFirstSeen = daysBetween(fan.first_seen_at);
  if (daysSinceFirstSeen > 730) score += 10;   // 2+ years
  else if (daysSinceFirstSeen > 365) score += 8; // 1+ year
  else if (daysSinceFirstSeen > 180) score += 5;
  else if (daysSinceFirstSeen > 90) score += 3;
  else if (daysSinceFirstSeen > 30) score += 1;

  // Loyalty streak — consecutive months with purchase (0-10 pts)
  const streak = calculateMonthlyPurchaseStreak(purchases);
  score += Math.min(streak * 2, 10);

  return Math.min(score, 100);
}

// ─── Tier determination ────────────────────────────────────
//
// Tier is a function of: score, total spent, and recency.
// Churned is a hard override when inactive >90 days.

export function determineTier(
  score: number,
  totalSpent: number,
  lastInteractionAt: string | null,
  completedPurchaseCount: number,
): FanTier {
  const daysSinceLastInteraction = lastInteractionAt
    ? daysBetween(lastInteractionAt)
    : Infinity;

  // Churned override — no interaction for 90+ days
  if (daysSinceLastInteraction > 90) return "churned";

  // VIP — top spenders or near-perfect score
  if (totalSpent > 3000 || score >= 90) return "vip";

  // Whale — high spenders
  if (totalSpent > 1000 || score >= 75) return "whale";

  // Engaged — active and has purchased
  if (score >= 50 && completedPurchaseCount > 0) return "engaged";

  // Warm — some activity but no purchase yet
  if (score >= 30) return "warm";

  return "cold";
}

// ─── Helpers ───────────────────────────────────────────────

function daysBetween(dateStr: string): number {
  return (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24);
}

function countActiveChannels(
  fan: Pick<AtlasFan, "username_onlyfans" | "username_instagram" | "username_tiktok" | "email" | "phone">,
): number {
  let count = 0;
  if (fan.email) count++;
  if (fan.phone) count++;
  if (fan.username_onlyfans) count++;
  if (fan.username_instagram) count++;
  if (fan.username_tiktok) count++;
  return count;
}

export function calculateMonthlyPurchaseStreak(purchases: FanPurchase[]): number {
  if (purchases.length === 0) return 0;

  const completed = purchases.filter((p) => p.status === "completed");
  if (completed.length === 0) return 0;

  // Build set of (year, month) pairs where purchases occurred
  const monthSet = new Set<string>();
  for (const p of completed) {
    const d = new Date(p.purchased_at);
    monthSet.add(`${d.getFullYear()}-${d.getMonth()}`);
  }

  // Sort unique months descending, find streak from most recent
  const sortedMonths = Array.from(monthSet).sort().reverse();
  let streak = 1;
  for (let i = 1; i < sortedMonths.length; i++) {
    const [curY, curM] = sortedMonths[i - 1].split("-").map(Number);
    const [prevY, prevM] = sortedMonths[i].split("-").map(Number);

    // Check if consecutive month
    if (prevY === curY && prevM === curM - 1) {
      streak++;
    } else if (prevY === curY - 1 && prevM === 11 && curM === 0) {
      streak++; // December → January
    } else {
      break; // Gap found
    }
  }

  return streak;
}

// ─── Get scoring factors breakdown (for UI) ────────────────

export function getScoringBreakdown(
  fan: Pick<AtlasFan, "total_spent" | "purchases_count" | "last_purchase_at" | "avg_order_value" | "first_seen_at" | "last_interaction_at" | "username_onlyfans" | "username_instagram" | "username_tiktok" | "email" | "phone">,
  interactions: FanInteraction[],
  purchases: FanPurchase[],
): ScoringFactors {
  const completedPurchases = purchases.filter((p) => p.status === "completed");
  const recentInteractions = interactions.filter((i) => daysBetween(i.occurred_at) < 30);

  return {
    total_spent: fan.total_spent,
    purchases_count: completedPurchases.length,
    last_purchase_recency: fan.last_purchase_at ? Math.round(daysBetween(fan.last_purchase_at)) : Infinity,
    avg_order_value: fan.avg_order_value,
    interaction_frequency: recentInteractions.length,
    interaction_recency: fan.last_interaction_at ? Math.round(daysBetween(fan.last_interaction_at)) : Infinity,
    multi_channel: countActiveChannels(fan),
    duration_as_fan: Math.round(daysBetween(fan.first_seen_at)),
    loyalty_streak: calculateMonthlyPurchaseStreak(purchases),
  };
}

// ─── Tier change events ────────────────────────────────────

export interface TierChangeEvent {
  fanId: string;
  creatorId: string;
  previousTier: FanTier | null;
  newTier: FanTier;
  score: number;
  timestamp: Date;
}

export const TIER_CHANGE_ACTIONS: Record<string, { label: string; description: string }> = {
  "cold→warm": {
    label: "Activation",
    description: "Email de bienvenue avec un avant-premium gratuit",
  },
  "warm→engaged": {
    label: "Premier achat",
    description: "Félicitations + offre spéciale premier achat",
  },
  "engaged→whale": {
    label: "Upgrade Whale",
    description: "Accès bundles exclusifs + contenu premium",
  },
  "whale→vip": {
    label: "Upgrade VIP",
    description: "Notifier le créateur pour note personnalisée",
  },
  "active→churned": {
    label: "Win-back",
    description: "Campagne de réengagement automatique",
  },
};

// Apply tier change: log, trigger automation, notify creator if needed
export async function applyTierChange(
  event: TierChangeEvent,
  supabase: any,
): Promise<void> {
  const key = `${event.previousTier || "new"}→${event.newTier}` as string;
  const action = TIER_CHANGE_ACTIONS[key as keyof typeof TIER_CHANGE_ACTIONS];

  // Log tier change
  await supabase.from("atlas_interactions").insert({
    fan_id: event.fanId,
    creator_id: event.creatorId,
    channel: "system",
    direction: "outbound",
    type: "tier_change",
    content: `Changement de tier : ${event.previousTier || "nouveau"} → ${event.newTier} (score: ${event.score})`,
    occurred_at: event.timestamp.toISOString(),
  });

  // For VIP upgrades, notify creator
  if (event.newTier === "vip") {
    // In production this would send a push notification / in-app alert
    console.log(
      `[VIP DETECTED] Fan ${event.fanId} → Créateur ${event.creatorId}. ` +
      `Ajoutez une note personnalisée. Action: ${action?.description || "Notification"}`,
    );
  }
}
