// ═════════════════════════════════════════
// Credit packs pricing (hors abonnement)
// ═════════════════════════════════════════

export interface CreditPack {
  id: string;
  credits: number;
  price_eur: number;
  label: string;
  popular?: boolean;
}

export const CREDIT_PACKS: CreditPack[] = [
  { id: "credits_100", credits: 100, price_eur: 9, label: "100 crédits" },
  { id: "credits_500", credits: 500, price_eur: 39, label: "500 crédits", popular: true },
  { id: "credits_2000", credits: 2000, price_eur: 129, label: "2000 crédits" },
];

export function getPackById(id: string): CreditPack | undefined {
  return CREDIT_PACKS.find((p) => p.id === id);
}

// ─── Price per credit breakdown ───

export function pricePerCredit(pack: CreditPack): number {
  return Math.round((pack.price_eur / pack.credits) * 100) / 100;
}

// ─── Stripe price IDs (set in env) ───

export function getStripePriceId(packId: string): string | undefined {
  const map: Record<string, string | undefined> = {
    credits_100: process.env.STRIPE_PRICE_CREDITS_100,
    credits_500: process.env.STRIPE_PRICE_CREDITS_500,
    credits_2000: process.env.STRIPE_PRICE_CREDITS_2000,
  };
  return map[packId];
}
