// ─── Seed Demo Data, 40 Fans ────────────────────────────
// Realistic, multilingual, covering all statuses

import type { Fan } from "@/lib/types/chat-ai";

const now = new Date().toISOString();

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000";

function fan(overrides: Partial<Fan> & { pseudonym: string }): Fan {
  return {
    id: overrides.id || crypto.randomUUID?.() || `fan-${Math.random().toString(36).slice(2, 10)}`,
    userId: DEMO_USER_ID,
    platform: "onlyfans",
    country: "FR",
    language: "fr",
    status: "active",
    ltv: 120,
    totalSpend: 180,
    spend7d: 25,
    spend30d: 80,
    purchaseHistory: [],
    contentSentIds: [],
    preferences: [],
    avoidTopics: [],
    notes: "",
    sentiment: 0.3,
    relationshipScore: 60,
    commercialScore: 45,
    churnRisk: 20,
    intentScore: 50,
    riskFlags: [],
    lastMessageAt: now,
    lastPurchaseAt: null,
    assignedChatterId: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export const demoFans: Fan[] = [
  // ── Whales (3) ──────────────────────────────────────────
  fan({
    pseudonym: "Alex.M", status: "whale", country: "FR", language: "fr",
    ltv: 4820, totalSpend: 5240, spend7d: 340, spend30d: 1280,
    relationshipScore: 88, commercialScore: 92, churnRisk: 5, intentScore: 85,
    sentiment: 0.9, notes: "Fan le plus fidèle. Aime les contenus exclusifs photo.",
    purchaseHistory: [
      { date: "2026-06-10", amount: 49.99, item: "Bundle Exclusif Été", type: "bundle" },
      { date: "2026-06-05", amount: 29.99, item: "Set Photo Premium", type: "ppv" },
      { date: "2026-06-01", amount: 19.99, item: "Vidéo Personnalisée", type: "ppv" },
      { date: "2026-05-20", amount: 39.99, item: "Pack VIP Mensuel", type: "subscription" },
      { date: "2026-05-10", amount: 24.99, item: "Photo Exclusive", type: "ppv" },
    ],
  }),
  fan({
    pseudonym: "James.W", status: "whale", country: "US", language: "en",
    ltv: 3150, totalSpend: 3450, spend7d: 150, spend30d: 890,
    relationshipScore: 75, commercialScore: 88, churnRisk: 12, intentScore: 80,
    sentiment: 0.7, notes: "Américain, préfère les vidéos. Achète en dollars.",
  }),
  fan({
    pseudonym: "Rico_Brasil", status: "whale", country: "BR", language: "pt-BR",
    ltv: 2800, totalSpend: 3100, spend7d: 200, spend30d: 750,
    relationshipScore: 70, commercialScore: 85, churnRisk: 8, intentScore: 78,
    sentiment: 0.8, notes: "Brésilien, très actif le soir (fuseau -4h).",
  }),

  // ── VIP (8) ─────────────────────────────────────────────
  fan({ pseudonym: "Luna_Star", status: "vip", country: "FR", language: "fr", ltv: 980, totalSpend: 1100, relationshipScore: 82, commercialScore: 70, churnRisk: 10, intentScore: 72 }),
  fan({ pseudonym: "ChrisFit", status: "vip", country: "DE", language: "de", ltv: 850, totalSpend: 920, relationshipScore: 65, commercialScore: 68, churnRisk: 15, intentScore: 65 }),
  fan({ pseudonym: "Emma.B", status: "vip", country: "UK", language: "en", ltv: 720, totalSpend: 800, relationshipScore: 78, commercialScore: 62, churnRisk: 8, intentScore: 70 }),
  fan({ pseudonym: "Marco94", status: "vip", country: "IT", language: "it", ltv: 680, totalSpend: 750, relationshipScore: 72, commercialScore: 60, churnRisk: 12, intentScore: 68 }),
  fan({ pseudonym: "Sofia_Lux", status: "vip", country: "ES", language: "es", ltv: 650, totalSpend: 700, relationshipScore: 74, commercialScore: 58, churnRisk: 14, intentScore: 62 }),
  fan({ pseudonym: "Diamond_D", status: "vip", country: "FR", language: "fr", ltv: 590, totalSpend: 620, relationshipScore: 68, commercialScore: 55, churnRisk: 18, intentScore: 55 }),
  fan({ pseudonym: "KingKai", status: "vip", country: "DE", language: "de", ltv: 540, totalSpend: 580, relationshipScore: 60, commercialScore: 52, churnRisk: 20, intentScore: 50 }),
  fan({ pseudonym: "Mia.Paris", status: "vip", country: "FR", language: "fr", ltv: 510, totalSpend: 540, relationshipScore: 71, commercialScore: 50, churnRisk: 10, intentScore: 60 }),

  // ── Active (12) ─────────────────────────────────────────
  fan({ pseudonym: "Tommy_G", status: "active", country: "FR", language: "fr", ltv: 280, totalSpend: 320, relationshipScore: 55, commercialScore: 40, churnRisk: 25, intentScore: 45 }),
  fan({ pseudonym: "Nico_Beast", status: "active", country: "FR", language: "fr", ltv: 240, totalSpend: 260, relationshipScore: 50, commercialScore: 38, churnRisk: 30, intentScore: 40 }),
  fan({ pseudonym: "Raul_MX", status: "active", country: "MX", language: "es", ltv: 210, totalSpend: 230, relationshipScore: 48, commercialScore: 35, churnRisk: 28, intentScore: 42 }),
  fan({ pseudonym: "Leo_88", status: "active", country: "IT", language: "it", ltv: 190, totalSpend: 200, relationshipScore: 45, commercialScore: 32, churnRisk: 32, intentScore: 38 }),
  fan({ pseudonym: "Sam_Sun", status: "active", country: "US", language: "en", ltv: 170, totalSpend: 180, relationshipScore: 42, commercialScore: 30, churnRisk: 35, intentScore: 35 }),
  fan({ pseudonym: "Jade.Rose", status: "active", country: "FR", language: "fr", ltv: 150, totalSpend: 160, relationshipScore: 40, commercialScore: 28, churnRisk: 38, intentScore: 32 }),
  fan({ pseudonym: "Benji.Pro", status: "active", country: "DE", language: "de", ltv: 130, totalSpend: 140, relationshipScore: 38, commercialScore: 25, churnRisk: 40, intentScore: 30 }),
  fan({ pseudonym: "Anna_Bella", status: "active", country: "ES", language: "es", ltv: 120, totalSpend: 130, relationshipScore: 35, commercialScore: 22, churnRisk: 42, intentScore: 28 }),
  fan({ pseudonym: "Max_Power", status: "active", country: "UK", language: "en", ltv: 110, totalSpend: 115, relationshipScore: 32, commercialScore: 20, churnRisk: 45, intentScore: 25 }),
  fan({ pseudonym: "Victor_7", status: "active", country: "BR", language: "pt-BR", ltv: 90, totalSpend: 95, relationshipScore: 30, commercialScore: 18, churnRisk: 48, intentScore: 22 }),
  fan({ pseudonym: "Pierre.D", status: "active", country: "FR", language: "fr", ltv: 80, totalSpend: 85, relationshipScore: 28, commercialScore: 15, churnRisk: 50, intentScore: 20 }),
  fan({ pseudonym: "Hugo_Boss", status: "active", country: "FR", language: "fr", ltv: 70, totalSpend: 72, relationshipScore: 25, commercialScore: 12, churnRisk: 55, intentScore: 18 }),

  // ── New (6) ─────────────────────────────────────────────
  fan({ pseudonym: "New_Fan_01", status: "new", country: "FR", language: "fr", ltv: 0, totalSpend: 0, spend7d: 0, spend30d: 0, relationshipScore: 10, commercialScore: 5, churnRisk: 80, intentScore: 30, purchaseHistory: [] }),
  fan({ pseudonym: "Nuevo_ES", status: "new", country: "ES", language: "es", ltv: 0, totalSpend: 0, spend7d: 0, spend30d: 0, relationshipScore: 8, commercialScore: 5, churnRisk: 85, intentScore: 25, purchaseHistory: [] }),
  fan({ pseudonym: "Neu_Berlin", status: "new", country: "DE", language: "de", ltv: 0, totalSpend: 0, spend7d: 0, spend30d: 0, relationshipScore: 12, commercialScore: 8, churnRisk: 75, intentScore: 35, purchaseHistory: [] }),
  fan({ pseudonym: "Newbie_US", status: "new", country: "US", language: "en", ltv: 15, totalSpend: 15, spend7d: 15, spend30d: 15, relationshipScore: 15, commercialScore: 10, churnRisk: 70, intentScore: 40, purchaseHistory: [{ date: "2026-06-09", amount: 15, item: "Bienvenue PPV", type: "ppv" }] }),
  fan({ pseudonym: "Novo_BR", status: "new", country: "BR", language: "pt-BR", ltv: 10, totalSpend: 10, spend7d: 10, spend30d: 10, relationshipScore: 10, commercialScore: 8, churnRisk: 72, intentScore: 32, purchaseHistory: [{ date: "2026-06-08", amount: 10, item: "Welcome Tip", type: "tip" }] }),
  fan({ pseudonym: "Nouveau_IT", status: "new", country: "IT", language: "it", ltv: 0, totalSpend: 0, spend7d: 0, spend30d: 0, relationshipScore: 5, commercialScore: 3, churnRisk: 90, intentScore: 15, purchaseHistory: [] }),

  // ── Dormant (6) ─────────────────────────────────────────
  fan({ pseudonym: "Sleepy_J", status: "dormant", country: "FR", language: "fr", ltv: 350, totalSpend: 380, spend7d: 0, spend30d: 0, relationshipScore: 30, commercialScore: 25, churnRisk: 85, intentScore: 12, lastMessageAt: "2026-04-15T10:00:00Z", lastPurchaseAt: "2026-04-01T08:00:00Z" }),
  fan({ pseudonym: "Ghost_Fan", status: "dormant", country: "US", language: "en", ltv: 420, totalSpend: 450, spend7d: 0, spend30d: 0, relationshipScore: 25, commercialScore: 22, churnRisk: 90, intentScore: 8, lastMessageAt: "2026-03-20T14:00:00Z", lastPurchaseAt: "2026-03-15T10:00:00Z" }),
  fan({ pseudonym: "MIA_2025", status: "dormant", country: "DE", language: "de", ltv: 280, totalSpend: 300, spend7d: 0, spend30d: 0, relationshipScore: 20, commercialScore: 18, churnRisk: 88, intentScore: 10, lastMessageAt: "2026-05-01T09:00:00Z" }),
  fan({ pseudonym: "Old_School", status: "dormant", country: "FR", language: "fr", ltv: 550, totalSpend: 600, spend7d: 0, spend30d: 0, relationshipScore: 35, commercialScore: 28, churnRisk: 82, intentScore: 15, lastMessageAt: "2026-02-10T11:00:00Z", lastPurchaseAt: "2026-02-01T07:00:00Z" }),
  fan({ pseudonym: "Inactive_BR", status: "dormant", country: "BR", language: "pt-BR", ltv: 180, totalSpend: 200, spend7d: 0, spend30d: 0, relationshipScore: 18, commercialScore: 15, churnRisk: 92, intentScore: 5, lastMessageAt: "2026-03-01T16:00:00Z" }),
  fan({ pseudonym: "Silent_ES", status: "dormant", country: "ES", language: "es", ltv: 220, totalSpend: 240, spend7d: 0, spend30d: 0, relationshipScore: 22, commercialScore: 20, churnRisk: 87, intentScore: 8, lastMessageAt: "2026-04-20T12:00:00Z" }),

  // ── Churn Risk (4) ──────────────────────────────────────
  fan({ pseudonym: "Angry_Mike", status: "churn_risk", country: "FR", language: "fr", ltv: 450, totalSpend: 500, spend7d: 0, spend30d: 15, relationshipScore: 18, commercialScore: 20, churnRisk: 95, intentScore: 8, sentiment: -0.6, notes: "Mécontent du dernier contenu. A envoyé un message négatif.", riskFlags: ["negative_sentiment"] }),
  fan({ pseudonym: "Fading_Fan", status: "churn_risk", country: "US", language: "en", ltv: 380, totalSpend: 400, spend7d: 0, spend30d: 5, relationshipScore: 15, commercialScore: 15, churnRisk: 92, intentScore: 10, sentiment: -0.4, notes: "Diminution progressive des interactions." }),
  fan({ pseudonym: "Price_Watch", status: "churn_risk", country: "DE", language: "de", ltv: 320, totalSpend: 350, spend7d: 0, spend30d: 10, relationshipScore: 20, commercialScore: 18, churnRisk: 88, intentScore: 12, sentiment: -0.3, notes: "S'est plaint des prix." }),
  fan({ pseudonym: "Leaving_Soon", status: "churn_risk", country: "IT", language: "it", ltv: 290, totalSpend: 310, spend7d: 0, spend30d: 0, relationshipScore: 10, commercialScore: 10, churnRisk: 98, intentScore: 3, sentiment: -0.8, notes: "Plus de réponse aux messages depuis 3 semaines." }),

  // ── Do Not Contact (2) ──────────────────────────────────
  fan({
    pseudonym: "Blocked_User", status: "do_not_contact", country: "FR", language: "fr",
    ltv: 50, totalSpend: 60, spend7d: 0, spend30d: 0,
    relationshipScore: 0, commercialScore: 0, churnRisk: 100, intentScore: 0,
    sentiment: -1, notes: "A demandé explicitement à ne plus être contacté.",
    riskFlags: ["do_not_contact", "explicit_request"],
  }),
  fan({
    pseudonym: "Vulnerable_Fan", status: "do_not_contact", country: "FR", language: "fr",
    ltv: 890, totalSpend: 950, spend7d: 0, spend30d: 0,
    relationshipScore: 5, commercialScore: 0, churnRisk: 100, intentScore: 0,
    sentiment: -0.9, notes: "Détection automatique : signaux de détresse financière dans les messages.",
    riskFlags: ["vulnerable_fan", "financial_distress", "blocked_commercial"],
  }),

  // ── Edge cases (1) ──────────────────────────────────────
  fan({
    pseudonym: "Multi_Plat_Fan", status: "active", country: "FR", language: "fr",
    platform: "mym", ltv: 340, totalSpend: 360,
    relationshipScore: 58, commercialScore: 42, churnRisk: 22, intentScore: 48,
    notes: "Présent sur MYM et OnlyFans. Préfère MYM.",
  }),
];
