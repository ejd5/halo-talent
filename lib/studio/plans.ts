import type { Plan, PlanTier } from "./types";

export const PLANS: Plan[] = [
  {
    tier: "free",
    name: "Free",
    price_monthly: 0,
    credits_monthly: 0,
    max_daily_generations: 0,
    priority: 0,
    has_advanced_models: false,
    has_byok: false,
    history_retention_days: 0,
    can_buy_addons: false,
  },
  {
    tier: "creator",
    name: "Creator",
    price_monthly: 0,
    credits_monthly: 5,
    max_daily_generations: 5,
    priority: 1,
    has_advanced_models: false,
    has_byok: false,
    history_retention_days: 30,
    can_buy_addons: true,
  },
  {
    tier: "premium",
    name: "Premium",
    price_monthly: 29,
    credits_monthly: 100,
    max_daily_generations: 50,
    priority: 2,
    has_advanced_models: true,
    has_byok: false,
    history_retention_days: 90,
    can_buy_addons: true,
  },
  {
    tier: "elite",
    name: "Elite",
    price_monthly: 79,
    credits_monthly: 500,
    max_daily_generations: 100,
    priority: 3,
    has_advanced_models: true,
    has_byok: true,
    history_retention_days: 180,
    can_buy_addons: true,
  },
  {
    tier: "icon",
    name: "Icon",
    price_monthly: 199,
    credits_monthly: -1, // illimité
    max_daily_generations: -1,
    priority: 4,
    has_advanced_models: true,
    has_byok: true,
    history_retention_days: 365,
    can_buy_addons: false,
  },
];

const PLAN_MAP = new Map<PlanTier, Plan>(PLANS.map((p) => [p.tier, p]));

export function getPlan(tier: string | null | undefined): Plan {
  const key = (tier ?? "free") as PlanTier;
  return PLAN_MAP.get(key) ?? PLAN_MAP.get("free")!;
}

export function isUnlimited(plan: Plan): boolean {
  return plan.credits_monthly === -1;
}

export function hasDailyLimit(plan: Plan): boolean {
  return plan.max_daily_generations !== -1;
}

export function getUpgradeFrom(tier: string | null | undefined): Plan | null {
  const current = getPlan(tier);
  const idx = PLANS.indexOf(current);
  const next = PLANS[idx + 1];
  return next ?? null;
}

export function getPlanPricingLabel(tier: string | null | undefined): string {
  const plan = getPlan(tier);
  if (plan.price_monthly === 0 && plan.tier === "free") return "Gratuit";
  if (plan.price_monthly === 0) return "Gratuit";
  return `${plan.price_monthly} € / mois`;
}
