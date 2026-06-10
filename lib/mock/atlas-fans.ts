// ─── Fan Intelligence Mock Data ─────────────────────────────
// Types + 35 fans + 13 auto-segments + helpers

export type Platform = "onlyfans" | "fansly" | "mym" | "fanvue" | "instagram" | "tiktok";
export type ConsentStatus = "active" | "withdrawn" | "missing";
export type LifecycleStage = "new" | "active" | "dormant" | "at-risk" | "churned";
export type SubscriptionStatus = "active" | "expired" | "cancelled" | "never";
export type RecommendedAction =
  | "upsell_ppv"
  | "renew_subscription"
  | "win_back"
  | "send_free_preview"
  | "personal_message"
  | "do_not_contact"
  | "compliance_review"
  | "ask_consent"
  | "nurture"
  | "none";

export interface FanIntelEvent {
  id: string;
  type: "message" | "purchase" | "tier_change" | "note" | "consent_change";
  occurredAt: string;
  description: string;
  detail?: string;
  channel?: string;
  amount?: number;
  author?: string;
}

export interface FanIntelNote {
  content: string;
  author: string;
  timestamp: string;
}

export interface FanIntel {
  id: string;
  pseudonyme: string;
  platform: Platform;
  country: string;
  language: string;
  timezone: string;
  status: "active" | "unsubscribed" | "blocked" | "deleted";
  lifecycleStage: LifecycleStage;
  totalSpend: number;
  spendLast7d: number;
  spendLast30d: number;
  averageOrderValue: number;
  lastPurchase: string | null;
  lastMessage: string | null;
  subscriptionStatus: SubscriptionStatus;
  renewalDate: string | null;
  consentStatus: ConsentStatus;
  tags: string[];
  interests: string[];
  blockedTopics: string[];
  purchasedContentIds: { id: string; title: string; type: "image" | "video" | "audio" | "document"; amount: number; date: string }[];
  sentContentIds: { id: string; title: string; type: "image" | "video" | "audio" | "document"; date: string; isPPV: boolean }[];
  notes: FanIntelNote[];
  assignedChatter: string | null;
  relationshipScore: number;   // 0-100
  commercialScore: number;     // 0-100
  churnRisk: number;           // 0-100
  complianceRisk: number;      // 0-100
  recommendedAction: RecommendedAction;
  events: FanIntelEvent[];
}

export interface FanSegment {
  id: string;
  name: string;
  description: string;
  icon: string;
  fanIds: string[];
  blockedReason?: string;
}

const now = new Date();
function daysAgo(d: number): string {
  const date = new Date(now);
  date.setDate(date.getDate() - d);
  return date.toISOString();
}

// ─── 35 Fans ────────────────────────────────────────────────

export const mockFans: FanIntel[] = [
  // ═══ VIP (5) ═══
  {
    id: "fan-001",
    pseudonyme: "Marc L.",
    platform: "onlyfans",
    country: "FR",
    language: "fr",
    timezone: "Europe/Paris",
    status: "active",
    lifecycleStage: "active",
    totalSpend: 4850,
    spendLast7d: 320,
    spendLast30d: 980,
    averageOrderValue: 85,
    lastPurchase: daysAgo(1),
    lastMessage: daysAgo(0.5),
    subscriptionStatus: "active",
    renewalDate: daysAgo(-18),
    consentStatus: "active",
    tags: ["vip", "ppv-buyer", "loyal"],
    interests: ["exclusive", "behind-scenes", "custom"],
    blockedTopics: [],
    purchasedContentIds: [
      { id: "c-001", title: "Séance photo exclusive", type: "image", amount: 120, date: daysAgo(1) },
      { id: "c-002", title: "Vidéo personnalisée anniversaire", type: "video", amount: 200, date: daysAgo(7) },
      { id: "c-003", title: "Pack VIP mensuel", type: "image", amount: 75, date: daysAgo(15) },
      { id: "c-004", title: "Audio message personnalisé", type: "audio", amount: 50, date: daysAgo(28) },
    ],
    sentContentIds: [
      { id: "s-001", title: "Merci pour ta fidélité", type: "image", date: daysAgo(2), isPPV: false },
      { id: "s-002", title: "Preview pack été", type: "video", date: daysAgo(10), isPPV: true },
    ],
    notes: [
      { content: "Fan très fidèle, adore le contenu exclusif. Lui proposer un accès anticipé aux nouveautés.", author: "Sophie", timestamp: daysAgo(3) },
    ],
    assignedChatter: "Sophie",
    relationshipScore: 92,
    commercialScore: 88,
    churnRisk: 5,
    complianceRisk: 5,
    recommendedAction: "upsell_ppv",
    events: [
      { id: "e-001", type: "purchase", occurredAt: daysAgo(1), description: "Achat PPV", detail: "Séance photo exclusive", amount: 120 },
      { id: "e-002", type: "message", occurredAt: daysAgo(0.5), description: "Message reçu", detail: "Merci pour le contenu !", channel: "onlyfans" },
      { id: "e-003", type: "tier_change", occurredAt: daysAgo(90), description: "Passage VIP", detail: "Froid → VIP" },
      { id: "e-004", type: "note", occurredAt: daysAgo(3), description: "Note interne", detail: "Fan très fidèle", author: "Sophie" },
    ],
  },
  {
    id: "fan-002",
    pseudonyme: "Thomas B.",
    platform: "fansly",
    country: "FR",
    language: "fr",
    timezone: "Europe/Paris",
    status: "active",
    lifecycleStage: "active",
    totalSpend: 3200,
    spendLast7d: 150,
    spendLast30d: 650,
    averageOrderValue: 65,
    lastPurchase: daysAgo(3),
    lastMessage: daysAgo(1),
    subscriptionStatus: "active",
    renewalDate: daysAgo(-8),
    consentStatus: "active",
    tags: ["vip", "early-adopter"],
    interests: ["bundles", "lives"],
    blockedTopics: [],
    purchasedContentIds: [
      { id: "c-005", title: "Bundle été complet", type: "video", amount: 180, date: daysAgo(3) },
      { id: "c-006", title: "Live privé replay", type: "video", amount: 45, date: daysAgo(14) },
    ],
    sentContentIds: [
      { id: "s-003", title: "Offre bundle spécial", type: "video", date: daysAgo(5), isPPV: true },
    ],
    notes: [],
    assignedChatter: "Thomas",
    relationshipScore: 85,
    commercialScore: 78,
    churnRisk: 8,
    complianceRisk: 3,
    recommendedAction: "upsell_ppv",
    events: [
      { id: "e-005", type: "purchase", occurredAt: daysAgo(3), description: "Achat PPV", detail: "Bundle été complet", amount: 180 },
      { id: "e-006", type: "message", occurredAt: daysAgo(1), description: "Message reçu", detail: "Quand est le prochain live ?", channel: "fansly" },
    ],
  },
  {
    id: "fan-003",
    pseudonyme: "Elena R.",
    platform: "onlyfans",
    country: "FR",
    language: "fr",
    timezone: "Europe/Paris",
    status: "active",
    lifecycleStage: "active",
    totalSpend: 5600,
    spendLast7d: 450,
    spendLast30d: 1200,
    averageOrderValue: 110,
    lastPurchase: daysAgo(0),
    lastMessage: daysAgo(0.2),
    subscriptionStatus: "active",
    renewalDate: daysAgo(-25),
    consentStatus: "active",
    tags: ["vip", "whale", "top-spender"],
    interests: ["custom", "one-on-one", "exclusive"],
    blockedTopics: [],
    purchasedContentIds: [
      { id: "c-007", title: "Séance one-on-one", type: "video", amount: 350, date: daysAgo(0) },
      { id: "c-008", title: "Album photo premium", type: "image", amount: 90, date: daysAgo(5) },
      { id: "c-009", title: "Message vocal personnalisé", type: "audio", amount: 80, date: daysAgo(12) },
    ],
    sentContentIds: [
      { id: "s-004", title: "Offre one-on-one exclusive", type: "video", date: daysAgo(1), isPPV: true },
    ],
    notes: [
      { content: "Top 3 des dépensiers. Aime les interactions personnalisées.", author: "Sophie", timestamp: daysAgo(1) },
    ],
    assignedChatter: "Sophie",
    relationshipScore: 95,
    commercialScore: 95,
    churnRisk: 2,
    complianceRisk: 2,
    recommendedAction: "personal_message",
    events: [
      { id: "e-007", type: "purchase", occurredAt: daysAgo(0), description: "Achat PPV", detail: "Séance one-on-one", amount: 350 },
      { id: "e-008", type: "message", occurredAt: daysAgo(0.2), description: "Message reçu", detail: "Génial la session !", channel: "onlyfans" },
    ],
  },
  {
    id: "fan-004",
    pseudonyme: "James W.",
    platform: "onlyfans",
    country: "US",
    language: "en",
    timezone: "America/New_York",
    status: "active",
    lifecycleStage: "active",
    totalSpend: 2800,
    spendLast7d: 180,
    spendLast30d: 550,
    averageOrderValue: 70,
    lastPurchase: daysAgo(2),
    lastMessage: daysAgo(0.8),
    subscriptionStatus: "active",
    renewalDate: daysAgo(-12),
    consentStatus: "active",
    tags: ["vip", "international"],
    interests: ["behind-scenes", "exclusive"],
    blockedTopics: [],
    purchasedContentIds: [
      { id: "c-010", title: "Behind the scenes special", type: "video", amount: 90, date: daysAgo(2) },
      { id: "c-011", title: "Photo album exclusive", type: "image", amount: 60, date: daysAgo(20) },
    ],
    sentContentIds: [],
    notes: [],
    assignedChatter: "Thomas",
    relationshipScore: 78,
    commercialScore: 72,
    churnRisk: 12,
    complianceRisk: 8,
    recommendedAction: "upsell_ppv",
    events: [
      { id: "e-009", type: "purchase", occurredAt: daysAgo(2), description: "Achat PPV", detail: "Behind the scenes special", amount: 90 },
      { id: "e-010", type: "message", occurredAt: daysAgo(0.8), description: "Message reçu", detail: "Love the content!", channel: "onlyfans" },
    ],
  },
  {
    id: "fan-005",
    pseudonyme: "Klaus M.",
    platform: "mym",
    country: "DE",
    language: "de",
    timezone: "Europe/Berlin",
    status: "active",
    lifecycleStage: "active",
    totalSpend: 4100,
    spendLast7d: 250,
    spendLast30d: 800,
    averageOrderValue: 95,
    lastPurchase: daysAgo(1),
    lastMessage: daysAgo(1.5),
    subscriptionStatus: "active",
    renewalDate: daysAgo(-15),
    consentStatus: "active",
    tags: ["vip", "german-market"],
    interests: ["exclusive", "bundles"],
    blockedTopics: [],
    purchasedContentIds: [
      { id: "c-012", title: "VIP Paket Monat", type: "image", amount: 150, date: daysAgo(1) },
    ],
    sentContentIds: [
      { id: "s-005", title: "VIP Angebot", type: "image", date: daysAgo(2), isPPV: true },
    ],
    notes: [],
    assignedChatter: null,
    relationshipScore: 80,
    commercialScore: 85,
    churnRisk: 6,
    complianceRisk: 4,
    recommendedAction: "upsell_ppv",
    events: [
      { id: "e-011", type: "purchase", occurredAt: daysAgo(1), description: "Achat PPV", detail: "VIP Paket Monat", amount: 150 },
    ],
  },

  // ═══ Engaged/Warm (5) ═══
  {
    id: "fan-006",
    pseudonyme: "Camille D.",
    platform: "instagram",
    country: "FR",
    language: "fr",
    timezone: "Europe/Paris",
    status: "active",
    lifecycleStage: "active",
    totalSpend: 450,
    spendLast7d: 30,
    spendLast30d: 120,
    averageOrderValue: 35,
    lastPurchase: daysAgo(5),
    lastMessage: daysAgo(1),
    subscriptionStatus: "active",
    renewalDate: daysAgo(-5),
    consentStatus: "active",
    tags: ["engaged", "regular"],
    interests: ["lives", "stories"],
    blockedTopics: [],
    purchasedContentIds: [
      { id: "c-013", title: "Live replay", type: "video", amount: 30, date: daysAgo(5) },
    ],
    sentContentIds: [],
    notes: [],
    assignedChatter: "Léa",
    relationshipScore: 65,
    commercialScore: 55,
    churnRisk: 20,
    complianceRisk: 5,
    recommendedAction: "upsell_ppv",
    events: [
      { id: "e-012", type: "purchase", occurredAt: daysAgo(5), description: "Achat PPV", detail: "Live replay", amount: 30 },
      { id: "e-013", type: "message", occurredAt: daysAgo(1), description: "Message reçu", detail: "Trop cool le live !", channel: "instagram" },
    ],
  },
  {
    id: "fan-007",
    pseudonyme: "Lucas P.",
    platform: "onlyfans",
    country: "BE",
    language: "fr",
    timezone: "Europe/Brussels",
    status: "active",
    lifecycleStage: "active",
    totalSpend: 620,
    spendLast7d: 45,
    spendLast30d: 180,
    averageOrderValue: 40,
    lastPurchase: daysAgo(4),
    lastMessage: daysAgo(2),
    subscriptionStatus: "active",
    renewalDate: daysAgo(-10),
    consentStatus: "active",
    tags: ["engaged", "belgian"],
    interests: ["behind-scenes"],
    blockedTopics: [],
    purchasedContentIds: [
      { id: "c-014", title: "Behind the scenes", type: "image", amount: 40, date: daysAgo(4) },
    ],
    sentContentIds: [],
    notes: [],
    assignedChatter: null,
    relationshipScore: 58,
    commercialScore: 50,
    churnRisk: 25,
    complianceRisk: 3,
    recommendedAction: "send_free_preview",
    events: [
      { id: "e-014", type: "message", occurredAt: daysAgo(2), description: "Message reçu", detail: "Vous faites du contenu cette semaine ?", channel: "onlyfans" },
    ],
  },
  {
    id: "fan-008",
    pseudonyme: "Anna S.",
    platform: "fansly",
    country: "IT",
    language: "it",
    timezone: "Europe/Rome",
    status: "active",
    lifecycleStage: "active",
    totalSpend: 380,
    spendLast7d: 0,
    spendLast30d: 60,
    averageOrderValue: 30,
    lastPurchase: daysAgo(12),
    lastMessage: daysAgo(3),
    subscriptionStatus: "active",
    renewalDate: daysAgo(-3),
    consentStatus: "active",
    tags: ["warm", "italian"],
    interests: ["stories"],
    blockedTopics: [],
    purchasedContentIds: [],
    sentContentIds: [],
    notes: [],
    assignedChatter: null,
    relationshipScore: 42,
    commercialScore: 35,
    churnRisk: 45,
    complianceRisk: 10,
    recommendedAction: "send_free_preview",
    events: [
      { id: "e-015", type: "message", occurredAt: daysAgo(3), description: "Message reçu", detail: "Ciao! Novità questa settimana?", channel: "fansly" },
    ],
  },
  {
    id: "fan-009",
    pseudonyme: "Mei L.",
    platform: "fanvue",
    country: "CA",
    language: "en",
    timezone: "America/Toronto",
    status: "active",
    lifecycleStage: "active",
    totalSpend: 520,
    spendLast7d: 80,
    spendLast30d: 200,
    averageOrderValue: 45,
    lastPurchase: daysAgo(6),
    lastMessage: daysAgo(1.5),
    subscriptionStatus: "active",
    renewalDate: daysAgo(-7),
    consentStatus: "active",
    tags: ["engaged", "canadian"],
    interests: ["exclusive", "custom"],
    blockedTopics: [],
    purchasedContentIds: [
      { id: "c-015", title: "Custom photo set", type: "image", amount: 55, date: daysAgo(6) },
    ],
    sentContentIds: [],
    notes: [],
    assignedChatter: "Thomas",
    relationshipScore: 60,
    commercialScore: 52,
    churnRisk: 18,
    complianceRisk: 6,
    recommendedAction: "nurture",
    events: [],
  },
  {
    id: "fan-010",
    pseudonyme: "Pierre T.",
    platform: "onlyfans",
    country: "FR",
    language: "fr",
    timezone: "Europe/Paris",
    status: "active",
    lifecycleStage: "active",
    totalSpend: 290,
    spendLast7d: 15,
    spendLast30d: 55,
    averageOrderValue: 25,
    lastPurchase: daysAgo(18),
    lastMessage: daysAgo(4),
    subscriptionStatus: "active",
    renewalDate: daysAgo(-20),
    consentStatus: "active",
    tags: ["warm"],
    interests: [],
    blockedTopics: [],
    purchasedContentIds: [],
    sentContentIds: [],
    notes: [],
    assignedChatter: null,
    relationshipScore: 38,
    commercialScore: 28,
    churnRisk: 50,
    complianceRisk: 3,
    recommendedAction: "nurture",
    events: [],
  },

  // ═══ Nouveaux (4) ═══
  {
    id: "fan-011",
    pseudonyme: "Julie V.",
    platform: "instagram",
    country: "FR",
    language: "fr",
    timezone: "Europe/Paris",
    status: "active",
    lifecycleStage: "new",
    totalSpend: 15,
    spendLast7d: 15,
    spendLast30d: 15,
    averageOrderValue: 15,
    lastPurchase: daysAgo(5),
    lastMessage: daysAgo(2),
    subscriptionStatus: "never",
    renewalDate: null,
    consentStatus: "active",
    tags: ["new", "instagram-lead"],
    interests: ["discovery"],
    blockedTopics: [],
    purchasedContentIds: [],
    sentContentIds: [],
    notes: [],
    assignedChatter: null,
    relationshipScore: 15,
    commercialScore: 25,
    churnRisk: 30,
    complianceRisk: 2,
    recommendedAction: "send_free_preview",
    events: [
      { id: "e-016", type: "message", occurredAt: daysAgo(2), description: "Premier message", detail: "Salut, je découvre !", channel: "instagram" },
    ],
  },
  {
    id: "fan-012",
    pseudonyme: "Carlos R.",
    platform: "tiktok",
    country: "ES",
    language: "es",
    timezone: "Europe/Madrid",
    status: "active",
    lifecycleStage: "new",
    totalSpend: 0,
    spendLast7d: 0,
    spendLast30d: 0,
    averageOrderValue: 0,
    lastPurchase: null,
    lastMessage: daysAgo(1),
    subscriptionStatus: "never",
    renewalDate: null,
    consentStatus: "missing",
    tags: ["new", "tiktok-lead"],
    interests: [],
    blockedTopics: [],
    purchasedContentIds: [],
    sentContentIds: [],
    notes: [],
    assignedChatter: null,
    relationshipScore: 8,
    commercialScore: 10,
    churnRisk: 25,
    complianceRisk: 15,
    recommendedAction: "ask_consent",
    events: [
      { id: "e-017", type: "message", occurredAt: daysAgo(1), description: "Message reçu", detail: "Hola! Me encanta tu contenido", channel: "tiktok" },
    ],
  },
  {
    id: "fan-013",
    pseudonyme: "Yuki T.",
    platform: "onlyfans",
    country: "JP",
    language: "en",
    timezone: "Asia/Tokyo",
    status: "active",
    lifecycleStage: "new",
    totalSpend: 25,
    spendLast7d: 25,
    spendLast30d: 25,
    averageOrderValue: 25,
    lastPurchase: daysAgo(8),
    lastMessage: daysAgo(3),
    subscriptionStatus: "never",
    renewalDate: null,
    consentStatus: "active",
    tags: ["new", "international"],
    interests: ["exclusive"],
    blockedTopics: [],
    purchasedContentIds: [],
    sentContentIds: [],
    notes: [],
    assignedChatter: null,
    relationshipScore: 12,
    commercialScore: 30,
    churnRisk: 28,
    complianceRisk: 8,
    recommendedAction: "nurture",
    events: [],
  },
  {
    id: "fan-014",
    pseudonyme: "Aïcha B.",
    platform: "instagram",
    country: "FR",
    language: "fr",
    timezone: "Europe/Paris",
    status: "active",
    lifecycleStage: "new",
    totalSpend: 0,
    spendLast7d: 0,
    spendLast30d: 0,
    averageOrderValue: 0,
    lastPurchase: null,
    lastMessage: daysAgo(0.3),
    subscriptionStatus: "never",
    renewalDate: null,
    consentStatus: "active",
    tags: ["new", "instagram-lead"],
    interests: ["stories", "behind-scenes"],
    blockedTopics: [],
    purchasedContentIds: [],
    sentContentIds: [],
    notes: [],
    assignedChatter: "Léa",
    relationshipScore: 20,
    commercialScore: 40,
    churnRisk: 15,
    complianceRisk: 2,
    recommendedAction: "nurture",
    events: [
      { id: "e-018", type: "message", occurredAt: daysAgo(0.3), description: "Message reçu", detail: "Je viens de m'abonner, hâte de voir !", channel: "instagram" },
    ],
  },

  // ═══ Dormants (4) ═══
  {
    id: "fan-015",
    pseudonyme: "Didier M.",
    platform: "onlyfans",
    country: "FR",
    language: "fr",
    timezone: "Europe/Paris",
    status: "active",
    lifecycleStage: "dormant",
    totalSpend: 340,
    spendLast7d: 0,
    spendLast30d: 0,
    averageOrderValue: 55,
    lastPurchase: daysAgo(75),
    lastMessage: daysAgo(70),
    subscriptionStatus: "expired",
    renewalDate: daysAgo(45),
    consentStatus: "active",
    tags: ["dormant", "ex-subscriber"],
    interests: ["exclusive"],
    blockedTopics: [],
    purchasedContentIds: [
      { id: "c-016", title: "Pack mensuel", type: "image", amount: 55, date: daysAgo(75) },
    ],
    sentContentIds: [],
    notes: [],
    assignedChatter: null,
    relationshipScore: 25,
    commercialScore: 30,
    churnRisk: 75,
    complianceRisk: 5,
    recommendedAction: "win_back",
    events: [
      { id: "e-019", type: "purchase", occurredAt: daysAgo(75), description: "Dernier achat", detail: "Pack mensuel", amount: 55 },
      { id: "e-020", type: "message", occurredAt: daysAgo(70), description: "Dernier message", channel: "onlyfans" },
    ],
  },
  {
    id: "fan-016",
    pseudonyme: "Nina K.",
    platform: "fansly",
    country: "DE",
    language: "de",
    timezone: "Europe/Berlin",
    status: "active",
    lifecycleStage: "dormant",
    totalSpend: 180,
    spendLast7d: 0,
    spendLast30d: 0,
    averageOrderValue: 35,
    lastPurchase: daysAgo(90),
    lastMessage: daysAgo(85),
    subscriptionStatus: "cancelled",
    renewalDate: null,
    consentStatus: "active",
    tags: ["dormant"],
    interests: [],
    blockedTopics: [],
    purchasedContentIds: [],
    sentContentIds: [],
    notes: [],
    assignedChatter: null,
    relationshipScore: 15,
    commercialScore: 15,
    churnRisk: 85,
    complianceRisk: 3,
    recommendedAction: "win_back",
    events: [],
  },
  {
    id: "fan-017",
    pseudonyme: "Omar F.",
    platform: "onlyfans",
    country: "MA",
    language: "fr",
    timezone: "Africa/Casablanca",
    status: "active",
    lifecycleStage: "dormant",
    totalSpend: 520,
    spendLast7d: 0,
    spendLast30d: 0,
    averageOrderValue: 65,
    lastPurchase: daysAgo(65),
    lastMessage: daysAgo(62),
    subscriptionStatus: "expired",
    renewalDate: daysAgo(55),
    consentStatus: "active",
    tags: ["dormant", "ex-whale"],
    interests: ["bundles", "custom"],
    blockedTopics: [],
    purchasedContentIds: [
      { id: "c-017", title: "Bundle premium", type: "video", amount: 120, date: daysAgo(65) },
      { id: "c-018", title: "Custom request", type: "image", amount: 80, date: daysAgo(80) },
    ],
    sentContentIds: [],
    notes: [
      { content: "C'était un bon client. Essayer une offre de retour avec réduction pour le réactiver.", author: "Sophie", timestamp: daysAgo(60) },
    ],
    assignedChatter: "Sophie",
    relationshipScore: 30,
    commercialScore: 45,
    churnRisk: 68,
    complianceRisk: 5,
    recommendedAction: "win_back",
    events: [
      { id: "e-021", type: "purchase", occurredAt: daysAgo(65), description: "Dernier achat", detail: "Bundle premium", amount: 120 },
    ],
  },
  {
    id: "fan-018",
    pseudonyme: "Laura G.",
    platform: "instagram",
    country: "IT",
    language: "it",
    timezone: "Europe/Rome",
    status: "active",
    lifecycleStage: "dormant",
    totalSpend: 60,
    spendLast7d: 0,
    spendLast30d: 0,
    averageOrderValue: 20,
    lastPurchase: daysAgo(100),
    lastMessage: daysAgo(95),
    subscriptionStatus: "never",
    renewalDate: null,
    consentStatus: "active",
    tags: ["dormant", "italian"],
    interests: [],
    blockedTopics: [],
    purchasedContentIds: [],
    sentContentIds: [],
    notes: [],
    assignedChatter: null,
    relationshipScore: 10,
    commercialScore: 8,
    churnRisk: 90,
    complianceRisk: 2,
    recommendedAction: "win_back",
    events: [],
  },

  // ═══ À risque churn (4) ═══
  {
    id: "fan-019",
    pseudonyme: "Romain J.",
    platform: "onlyfans",
    country: "FR",
    language: "fr",
    timezone: "Europe/Paris",
    status: "active",
    lifecycleStage: "at-risk",
    totalSpend: 280,
    spendLast7d: 0,
    spendLast30d: 10,
    averageOrderValue: 35,
    lastPurchase: daysAgo(35),
    lastMessage: daysAgo(28),
    subscriptionStatus: "active",
    renewalDate: daysAgo(-2),
    consentStatus: "active",
    tags: ["at-risk", "declining"],
    interests: ["exclusive"],
    blockedTopics: [],
    purchasedContentIds: [],
    sentContentIds: [],
    notes: [],
    assignedChatter: null,
    relationshipScore: 25,
    commercialScore: 20,
    churnRisk: 72,
    complianceRisk: 8,
    recommendedAction: "send_free_preview",
    events: [
      { id: "e-022", type: "message", occurredAt: daysAgo(28), description: "Dernier message", detail: "Je suis un peu moins dispo en ce moment", channel: "onlyfans" },
    ],
  },
  {
    id: "fan-020",
    pseudonyme: "Sophia A.",
    platform: "mym",
    country: "BR",
    language: "pt",
    timezone: "America/Sao_Paulo",
    status: "active",
    lifecycleStage: "at-risk",
    totalSpend: 195,
    spendLast7d: 0,
    spendLast30d: 0,
    averageOrderValue: 25,
    lastPurchase: daysAgo(42),
    lastMessage: daysAgo(35),
    subscriptionStatus: "active",
    renewalDate: daysAgo(-1),
    consentStatus: "active",
    tags: ["at-risk", "brazilian"],
    interests: [],
    blockedTopics: [],
    purchasedContentIds: [],
    sentContentIds: [],
    notes: [],
    assignedChatter: null,
    relationshipScore: 18,
    commercialScore: 15,
    churnRisk: 78,
    complianceRisk: 10,
    recommendedAction: "nurture",
    events: [],
  },
  {
    id: "fan-021",
    pseudonyme: "Max H.",
    platform: "onlyfans",
    country: "CH",
    language: "de",
    timezone: "Europe/Zurich",
    status: "active",
    lifecycleStage: "at-risk",
    totalSpend: 450,
    spendLast7d: 0,
    spendLast30d: 20,
    averageOrderValue: 50,
    lastPurchase: daysAgo(38),
    lastMessage: daysAgo(30),
    subscriptionStatus: "active",
    renewalDate: daysAgo(-5),
    consentStatus: "active",
    tags: ["at-risk", "swiss"],
    interests: ["exclusive", "bundles"],
    blockedTopics: [],
    purchasedContentIds: [
      { id: "c-019", title: "Bundle starter", type: "image", amount: 50, date: daysAgo(38) },
    ],
    sentContentIds: [],
    notes: [],
    assignedChatter: null,
    relationshipScore: 28,
    commercialScore: 35,
    churnRisk: 65,
    complianceRisk: 5,
    recommendedAction: "upsell_ppv",
    events: [],
  },
  {
    id: "fan-022",
    pseudonyme: "Inès M.",
    platform: "instagram",
    country: "MX",
    language: "es",
    timezone: "America/Mexico_City",
    status: "active",
    lifecycleStage: "at-risk",
    totalSpend: 70,
    spendLast7d: 0,
    spendLast30d: 0,
    averageOrderValue: 15,
    lastPurchase: daysAgo(50),
    lastMessage: daysAgo(40),
    subscriptionStatus: "never",
    renewalDate: null,
    consentStatus: "active",
    tags: ["at-risk", "mexican"],
    interests: [],
    blockedTopics: [],
    purchasedContentIds: [],
    sentContentIds: [],
    notes: [],
    assignedChatter: null,
    relationshipScore: 12,
    commercialScore: 10,
    churnRisk: 82,
    complianceRisk: 5,
    recommendedAction: "win_back",
    events: [],
  },

  // ═══ Acheteurs PPV (3) ═══
  {
    id: "fan-023",
    pseudonyme: "Victor H.",
    platform: "onlyfans",
    country: "FR",
    language: "fr",
    timezone: "Europe/Paris",
    status: "active",
    lifecycleStage: "active",
    totalSpend: 890,
    spendLast7d: 120,
    spendLast30d: 350,
    averageOrderValue: 45,
    lastPurchase: daysAgo(2),
    lastMessage: daysAgo(3),
    subscriptionStatus: "active",
    renewalDate: daysAgo(-14),
    consentStatus: "active",
    tags: ["ppv-buyer", "regular"],
    interests: ["exclusive", "custom"],
    blockedTopics: [],
    purchasedContentIds: [
      { id: "c-020", title: "PPV set hebdo", type: "image", amount: 45, date: daysAgo(2) },
      { id: "c-021", title: "PPV vidéo exclusive", type: "video", amount: 90, date: daysAgo(9) },
      { id: "c-022", title: "PPV audio message", type: "audio", amount: 30, date: daysAgo(16) },
      { id: "c-023", title: "PPV pack photo", type: "image", amount: 55, date: daysAgo(23) },
    ],
    sentContentIds: [
      { id: "s-006", title: "PPV exclusif hebdo", type: "image", date: daysAgo(2), isPPV: true },
    ],
    notes: [],
    assignedChatter: "Léa",
    relationshipScore: 70,
    commercialScore: 75,
    churnRisk: 10,
    complianceRisk: 4,
    recommendedAction: "upsell_ppv",
    events: [
      { id: "e-023", type: "purchase", occurredAt: daysAgo(2), description: "Achat PPV", detail: "PPV set hebdo", amount: 45 },
    ],
  },
  {
    id: "fan-024",
    pseudonyme: "Fátima S.",
    platform: "fanvue",
    country: "PT",
    language: "pt",
    timezone: "Europe/Lisbon",
    status: "active",
    lifecycleStage: "active",
    totalSpend: 430,
    spendLast7d: 60,
    spendLast30d: 180,
    averageOrderValue: 35,
    lastPurchase: daysAgo(4),
    lastMessage: daysAgo(2),
    subscriptionStatus: "active",
    renewalDate: daysAgo(-6),
    consentStatus: "active",
    tags: ["ppv-buyer", "portuguese"],
    interests: [],
    blockedTopics: [],
    purchasedContentIds: [
      { id: "c-024", title: "Pack PPV semanal", type: "image", amount: 35, date: daysAgo(4) },
      { id: "c-025", title: "Vídeo exclusivo", type: "video", amount: 70, date: daysAgo(11) },
    ],
    sentContentIds: [
      { id: "s-007", title: "Oferta PPV", type: "image", date: daysAgo(5), isPPV: true },
    ],
    notes: [],
    assignedChatter: null,
    relationshipScore: 62,
    commercialScore: 60,
    churnRisk: 22,
    complianceRisk: 5,
    recommendedAction: "upsell_ppv",
    events: [],
  },
  {
    id: "fan-025",
    pseudonyme: "Ravi P.",
    platform: "onlyfans",
    country: "IN",
    language: "en",
    timezone: "Asia/Kolkata",
    status: "active",
    lifecycleStage: "active",
    totalSpend: 310,
    spendLast7d: 40,
    spendLast30d: 130,
    averageOrderValue: 30,
    lastPurchase: daysAgo(6),
    lastMessage: daysAgo(1),
    subscriptionStatus: "active",
    renewalDate: daysAgo(-9),
    consentStatus: "active",
    tags: ["ppv-buyer", "international"],
    interests: ["exclusive"],
    blockedTopics: [],
    purchasedContentIds: [
      { id: "c-026", title: "Exclusive set", type: "image", amount: 30, date: daysAgo(6) },
      { id: "c-027", title: "Special video", type: "video", amount: 65, date: daysAgo(20) },
    ],
    sentContentIds: [
      { id: "s-008", title: "New exclusive offer", type: "video", date: daysAgo(7), isPPV: true },
    ],
    notes: [],
    assignedChatter: "Thomas",
    relationshipScore: 55,
    commercialScore: 50,
    churnRisk: 30,
    complianceRisk: 7,
    recommendedAction: "nurture",
    events: [],
  },

  // ═══ Sans consentement (3) ═══
  {
    id: "fan-026",
    pseudonyme: "Karim D.",
    platform: "instagram",
    country: "FR",
    language: "fr",
    timezone: "Europe/Paris",
    status: "active",
    lifecycleStage: "active",
    totalSpend: 80,
    spendLast7d: 0,
    spendLast30d: 20,
    averageOrderValue: 20,
    lastPurchase: daysAgo(25),
    lastMessage: daysAgo(5),
    subscriptionStatus: "never",
    renewalDate: null,
    consentStatus: "missing",
    tags: ["no-consent", "instagram-lead"],
    interests: ["stories"],
    blockedTopics: [],
    purchasedContentIds: [],
    sentContentIds: [],
    notes: [],
    assignedChatter: null,
    relationshipScore: 22,
    commercialScore: 18,
    churnRisk: 40,
    complianceRisk: 45,
    recommendedAction: "ask_consent",
    events: [
      { id: "e-024", type: "message", occurredAt: daysAgo(5), description: "Message reçu", detail: "Envoyez-moi plus d'infos !", channel: "instagram" },
    ],
  },
  {
    id: "fan-027",
    pseudonyme: "Jorge L.",
    platform: "tiktok",
    country: "CO",
    language: "es",
    timezone: "America/Bogota",
    status: "active",
    lifecycleStage: "new",
    totalSpend: 0,
    spendLast7d: 0,
    spendLast30d: 0,
    averageOrderValue: 0,
    lastPurchase: null,
    lastMessage: daysAgo(2),
    subscriptionStatus: "never",
    renewalDate: null,
    consentStatus: "missing",
    tags: ["no-consent", "tiktok-lead"],
    interests: [],
    blockedTopics: [],
    purchasedContentIds: [],
    sentContentIds: [],
    notes: [],
    assignedChatter: null,
    relationshipScore: 5,
    commercialScore: 8,
    churnRisk: 20,
    complianceRisk: 50,
    recommendedAction: "ask_consent",
    events: [],
  },
  {
    id: "fan-028",
    pseudonyme: "Saskia V.",
    platform: "onlyfans",
    country: "NL",
    language: "en",
    timezone: "Europe/Amsterdam",
    status: "unsubscribed",
    lifecycleStage: "dormant",
    totalSpend: 150,
    spendLast7d: 0,
    spendLast30d: 0,
    averageOrderValue: 30,
    lastPurchase: daysAgo(60),
    lastMessage: daysAgo(55),
    subscriptionStatus: "cancelled",
    renewalDate: null,
    consentStatus: "withdrawn",
    tags: ["no-consent", "churned"],
    interests: [],
    blockedTopics: ["all"],
    purchasedContentIds: [],
    sentContentIds: [],
    notes: [],
    assignedChatter: null,
    relationshipScore: 8,
    commercialScore: 10,
    churnRisk: 95,
    complianceRisk: 90,
    recommendedAction: "do_not_contact",
    events: [
      { id: "e-025", type: "consent_change", occurredAt: daysAgo(55), description: "Consentement révoqué", detail: "Email + SMS révoqués" },
    ],
  },

  // ═══ Fans sensibles (3) ═══
  {
    id: "fan-029",
    pseudonyme: "Stefan K.",
    platform: "onlyfans",
    country: "DE",
    language: "de",
    timezone: "Europe/Berlin",
    status: "active",
    lifecycleStage: "active",
    totalSpend: 250,
    spendLast7d: 30,
    spendLast30d: 100,
    averageOrderValue: 40,
    lastPurchase: daysAgo(7),
    lastMessage: daysAgo(0.5),
    subscriptionStatus: "active",
    renewalDate: daysAgo(-4),
    consentStatus: "active",
    tags: ["sensitive", "german-market"],
    interests: ["custom"],
    blockedTopics: [],
    purchasedContentIds: [
      { id: "c-028", title: "Custom request", type: "image", amount: 55, date: daysAgo(7) },
    ],
    sentContentIds: [],
    notes: [
      { content: "A fait des demandes à la limite en DM. Vérifier conformité avant chaque réponse.", author: "Sophie", timestamp: daysAgo(2) },
    ],
    assignedChatter: "Sophie",
    relationshipScore: 45,
    commercialScore: 40,
    churnRisk: 25,
    complianceRisk: 65,
    recommendedAction: "compliance_review",
    events: [
      { id: "e-026", type: "message", occurredAt: daysAgo(0.5), description: "Message reçu", detail: "Demande spécifique nécessitant vérification", channel: "onlyfans" },
    ],
  },
  {
    id: "fan-030",
    pseudonyme: "Chloé F.",
    platform: "fansly",
    country: "FR",
    language: "fr",
    timezone: "Europe/Paris",
    status: "active",
    lifecycleStage: "active",
    totalSpend: 180,
    spendLast7d: 10,
    spendLast30d: 45,
    averageOrderValue: 25,
    lastPurchase: daysAgo(12),
    lastMessage: daysAgo(1),
    subscriptionStatus: "active",
    renewalDate: daysAgo(-7),
    consentStatus: "active",
    tags: ["sensitive"],
    interests: [],
    blockedTopics: ["financial-advice", "personal-meetup"],
    purchasedContentIds: [],
    sentContentIds: [],
    notes: [],
    assignedChatter: "Léa",
    relationshipScore: 35,
    commercialScore: 25,
    churnRisk: 35,
    complianceRisk: 75,
    recommendedAction: "compliance_review",
    events: [
      { id: "e-027", type: "consent_change", occurredAt: daysAgo(30), description: "Sujets bloqués ajoutés", detail: "financial-advice, personal-meetup" },
    ],
  },
  {
    id: "fan-031",
    pseudonyme: "Marco B.",
    platform: "mym",
    country: "IT",
    language: "it",
    timezone: "Europe/Rome",
    status: "active",
    lifecycleStage: "active",
    totalSpend: 350,
    spendLast7d: 20,
    spendLast30d: 80,
    averageOrderValue: 35,
    lastPurchase: daysAgo(8),
    lastMessage: daysAgo(1.5),
    subscriptionStatus: "active",
    renewalDate: daysAgo(-3),
    consentStatus: "active",
    tags: ["sensitive", "italian"],
    interests: ["custom"],
    blockedTopics: [],
    purchasedContentIds: [],
    sentContentIds: [],
    notes: [
      { content: "Historique de chargebacks sur d'autres plateformes. Surveiller.", author: "Thomas", timestamp: daysAgo(15) },
    ],
    assignedChatter: "Thomas",
    relationshipScore: 40,
    commercialScore: 35,
    churnRisk: 30,
    complianceRisk: 55,
    recommendedAction: "compliance_review",
    events: [
      { id: "e-028", type: "note", occurredAt: daysAgo(15), description: "Note interne", detail: "Historique de chargebacks" },
    ],
  },

  // ═══ À ne pas contacter (2) ═══
  {
    id: "fan-032",
    pseudonyme: "Dennis R.",
    platform: "onlyfans",
    country: "US",
    language: "en",
    timezone: "America/Chicago",
    status: "blocked",
    lifecycleStage: "churned",
    totalSpend: 120,
    spendLast7d: 0,
    spendLast30d: 0,
    averageOrderValue: 30,
    lastPurchase: daysAgo(120),
    lastMessage: daysAgo(90),
    subscriptionStatus: "cancelled",
    renewalDate: null,
    consentStatus: "withdrawn",
    tags: ["do-not-contact", "blocked"],
    interests: [],
    blockedTopics: ["all"],
    purchasedContentIds: [],
    sentContentIds: [],
    notes: [
      { content: "Fan bloqué pour comportement inapproprié. Ne jamais recontacter.", author: "Sophie", timestamp: daysAgo(90) },
    ],
    assignedChatter: null,
    relationshipScore: 2,
    commercialScore: 5,
    churnRisk: 100,
    complianceRisk: 100,
    recommendedAction: "do_not_contact",
    events: [
      { id: "e-029", type: "consent_change", occurredAt: daysAgo(90), description: "Fan bloqué", detail: "Comportement inapproprié" },
    ],
  },
  {
    id: "fan-033",
    pseudonyme: "Olga P.",
    platform: "instagram",
    country: "RU",
    language: "en",
    timezone: "Europe/Moscow",
    status: "unsubscribed",
    lifecycleStage: "churned",
    totalSpend: 45,
    spendLast7d: 0,
    spendLast30d: 0,
    averageOrderValue: 15,
    lastPurchase: daysAgo(150),
    lastMessage: daysAgo(100),
    subscriptionStatus: "cancelled",
    renewalDate: null,
    consentStatus: "withdrawn",
    tags: ["do-not-contact", "churned"],
    interests: [],
    blockedTopics: ["personal-meetup", "financial-advice", "all"],
    purchasedContentIds: [],
    sentContentIds: [],
    notes: [],
    assignedChatter: null,
    relationshipScore: 1,
    commercialScore: 2,
    churnRisk: 100,
    complianceRisk: 95,
    recommendedAction: "do_not_contact",
    events: [],
  },

  // ═══ Fort potentiel (2) ═══
  {
    id: "fan-034",
    pseudonyme: "Amandine R.",
    platform: "onlyfans",
    country: "FR",
    language: "fr",
    timezone: "Europe/Paris",
    status: "active",
    lifecycleStage: "active",
    totalSpend: 380,
    spendLast7d: 80,
    spendLast30d: 220,
    averageOrderValue: 60,
    lastPurchase: daysAgo(3),
    lastMessage: daysAgo(0.5),
    subscriptionStatus: "active",
    renewalDate: daysAgo(-12),
    consentStatus: "active",
    tags: ["high-potential", "rising"],
    interests: ["exclusive", "bundles", "custom"],
    blockedTopics: [],
    purchasedContentIds: [
      { id: "c-029", title: "Pack découverte", type: "image", amount: 60, date: daysAgo(3) },
    ],
    sentContentIds: [
      { id: "s-009", title: "Offre spéciale nouveau fan", type: "image", date: daysAgo(4), isPPV: true },
    ],
    notes: [],
    assignedChatter: "Léa",
    relationshipScore: 72,
    commercialScore: 82,
    churnRisk: 12,
    complianceRisk: 5,
    recommendedAction: "upsell_ppv",
    events: [
      { id: "e-030", type: "purchase", occurredAt: daysAgo(3), description: "Achat PPV", detail: "Pack découverte", amount: 60 },
    ],
  },
  {
    id: "fan-035",
    pseudonyme: "Hugo C.",
    platform: "fansly",
    country: "FR",
    language: "fr",
    timezone: "Europe/Paris",
    status: "active",
    lifecycleStage: "new",
    totalSpend: 120,
    spendLast7d: 50,
    spendLast30d: 120,
    averageOrderValue: 40,
    lastPurchase: daysAgo(2),
    lastMessage: daysAgo(1),
    subscriptionStatus: "active",
    renewalDate: daysAgo(-18),
    consentStatus: "active",
    tags: ["high-potential", "new", "rising"],
    interests: ["exclusive", "behind-scenes"],
    blockedTopics: [],
    purchasedContentIds: [
      { id: "c-030", title: "Welcome pack", type: "image", amount: 50, date: daysAgo(2) },
      { id: "c-031", title: "Stories exclusives", type: "video", amount: 70, date: daysAgo(10) },
    ],
    sentContentIds: [],
    notes: [],
    assignedChatter: null,
    relationshipScore: 68,
    commercialScore: 78,
    churnRisk: 15,
    complianceRisk: 3,
    recommendedAction: "personal_message",
    events: [
      { id: "e-031", type: "purchase", occurredAt: daysAgo(2), description: "Achat PPV", detail: "Welcome pack", amount: 50 },
    ],
  },
];

// ─── 13 Auto-Segments ───────────────────────────────────────

export function computeSegments(fans: FanIntel[]): FanSegment[] {
  const segments: FanSegment[] = [];

  // 1. VIP 30 jours
  const vip30 = fans.filter((f) => f.totalSpend > 1000 && f.spendLast30d > 200);
  segments.push({
    id: "seg-vip-30j",
    name: "VIP 30 jours",
    description: "Fans ayant dépensé plus de 1000€ au total et plus de 200€ ce mois",
    icon: "Zap",
    fanIds: vip30.map((f) => f.id),
  });

  // 2. Nouveaux fans
  const newFans = fans.filter((f) => f.lifecycleStage === "new");
  segments.push({
    id: "seg-new",
    name: "Nouveaux fans",
    description: "Fans arrivés il y a moins de 30 jours",
    icon: "Sparkles",
    fanIds: newFans.map((f) => f.id),
  });

  // 3. Fans dormants
  const dormant = fans.filter((f) => f.lifecycleStage === "dormant");
  segments.push({
    id: "seg-dormant",
    name: "Fans dormants",
    description: "Aucune interaction depuis plus de 60 jours",
    icon: "Clock",
    fanIds: dormant.map((f) => f.id),
  });

  // 4. Fans chauds
  const hot = fans.filter((f) => f.relationshipScore >= 70 && f.lastMessage && new Date(f.lastMessage) > new Date(Date.now() - 7 * 86400000));
  segments.push({
    id: "seg-hot",
    name: "Fans chauds",
    description: "Score relationnel ≥ 70 et actifs cette semaine",
    icon: "Flame",
    fanIds: hot.map((f) => f.id),
  });

  // 5. Acheteurs PPV
  const ppvBuyers = fans.filter((f) => f.purchasedContentIds.length > 0);
  segments.push({
    id: "seg-ppv",
    name: "Acheteurs PPV",
    description: "Fans ayant déjà acheté du contenu PPV",
    icon: "DollarSign",
    fanIds: ppvBuyers.map((f) => f.id),
  });

  // 6. Fort potentiel
  const highPotential = fans.filter((f) => f.commercialScore >= 70 && f.totalSpend < 500);
  segments.push({
    id: "seg-potential",
    name: "Fort potentiel",
    description: "Score commercial ≥ 70 mais dépenses < 500€ — gros potentiel à exploiter",
    icon: "TrendingUp",
    fanIds: highPotential.map((f) => f.id),
  });

  // 7. À risque churn
  const churnRisk = fans.filter((f) => f.churnRisk >= 60);
  segments.push({
    id: "seg-churn",
    name: "À risque churn",
    description: "Score de risque d'attrition ≥ 60 — action urgente recommandée",
    icon: "AlertTriangle",
    fanIds: churnRisk.map((f) => f.id),
  });

  // 8. Sans consentement
  const noConsent = fans.filter((f) => f.consentStatus === "missing" || f.consentStatus === "withdrawn");
  segments.push({
    id: "seg-no-consent",
    name: "Sans consentement",
    description: "Fans sans consentement RGPD valide — campagne bloquée",
    icon: "ShieldAlert",
    fanIds: noConsent.map((f) => f.id),
    blockedReason: "Présence de fans sans consentement RGPD valide dans ce segment",
  });

  // 9. Par langue
  const langs = [...new Set(fans.map((f) => f.language))];
  for (const lang of langs) {
    const langFans = fans.filter((f) => f.language === lang);
    const langNames: Record<string, string> = { fr: "Francophones", en: "Anglophones", es: "Hispanophones", pt: "Lusophones", de: "Germanophones", it: "Italophones" };
    segments.push({
      id: `seg-lang-${lang}`,
      name: langNames[lang] || `Langue: ${lang}`,
      description: `Fans communiquant en ${lang === "fr" ? "français" : lang === "en" ? "anglais" : lang === "es" ? "espagnol" : lang === "de" ? "allemand" : lang === "it" ? "italien" : lang === "pt" ? "portugais" : lang}`,
      icon: "Globe",
      fanIds: langFans.map((f) => f.id),
    });
  }

  // 10. Par pays
  const countries = [...new Set(fans.map((f) => f.country))];
  for (const country of countries.slice(0, 8)) {
    const countryFans = fans.filter((f) => f.country === country);
    const countryNames: Record<string, string> = { FR: "France", BE: "Belgique", CH: "Suisse", CA: "Canada", US: "États-Unis", BR: "Brésil", DE: "Allemagne", IT: "Italie", ES: "Espagne", MX: "Mexique", CO: "Colombie", PT: "Portugal", MA: "Maroc", JP: "Japon", IN: "Inde", NL: "Pays-Bas", RU: "Russie" };
    segments.push({
      id: `seg-country-${country}`,
      name: countryNames[country] || country,
      description: `Fans basés en ${countryNames[country] || country}`,
      icon: "MapPin",
      fanIds: countryFans.map((f) => f.id),
    });
  }

  // 11. Par plateforme
  const platforms: Platform[] = ["onlyfans", "fansly", "mym", "fanvue", "instagram", "tiktok"];
  for (const platform of platforms) {
    const pf = fans.filter((f) => f.platform === platform);
    if (pf.length > 0) {
      const pNames: Record<string, string> = { onlyfans: "OnlyFans", fansly: "Fansly", mym: "MYM", fanvue: "Fanvue", instagram: "Instagram", tiktok: "TikTok" };
      segments.push({
        id: `seg-platform-${platform}`,
        name: pNames[platform] || platform,
        description: `Fans sur ${pNames[platform] || platform}`,
        icon: "MessageCircle",
        fanIds: pf.map((f) => f.id),
      });
    }
  }

  // 12. Fans sensibles
  const sensitive = fans.filter((f) => f.complianceRisk >= 50);
  segments.push({
    id: "seg-sensitive",
    name: "Fans sensibles",
    description: "Score de risque conformité ≥ 50 — vigilance requise",
    icon: "ShieldCheck",
    fanIds: sensitive.map((f) => f.id),
    blockedReason: "Présence de fans avec risque conformité élevé dans ce segment",
  });

  // 13. Fans à ne pas contacter
  const doNotContact = fans.filter((f) => f.blockedTopics.length > 0 || f.consentStatus === "withdrawn");
  segments.push({
    id: "seg-dnc",
    name: "Fans à ne pas contacter",
    description: "Fans bloqués ou avec sujets interdits — ne jamais contacter",
    icon: "UserX",
    fanIds: doNotContact.map((f) => f.id),
    blockedReason: "Ce segment contient des fans à ne pas contacter",
  });

  return segments;
}

export const mockSegments = computeSegments(mockFans);

// ─── Helpers ────────────────────────────────────────────────

export function sortFans(
  fans: FanIntel[],
  field: keyof FanIntel,
  dir: "asc" | "desc",
): FanIntel[] {
  return [...fans].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    if (typeof aVal === "number" && typeof bVal === "number") {
      return dir === "asc" ? aVal - bVal : bVal - aVal;
    }
    if (typeof aVal === "string" && typeof bVal === "string") {
      return dir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return 0;
  });
}

export function filterFans(
  fans: FanIntel[],
  filters: {
    search?: string;
    tier?: string;
    segmentFanIds?: string[];
    platform?: string;
    language?: string;
    country?: string;
    consentStatus?: string;
    lifecycleStage?: string;
  },
): FanIntel[] {
  let result = [...fans];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (f) =>
        f.pseudonyme.toLowerCase().includes(q) ||
        f.country.toLowerCase().includes(q) ||
        f.language.toLowerCase().includes(q) ||
        f.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  if (filters.segmentFanIds && filters.segmentFanIds.length > 0) {
    const idSet = new Set(filters.segmentFanIds);
    result = result.filter((f) => idSet.has(f.id));
  }

  if (filters.platform) result = result.filter((f) => f.platform === filters.platform);
  if (filters.language) result = result.filter((f) => f.language === filters.language);
  if (filters.country) result = result.filter((f) => f.country === filters.country);
  if (filters.consentStatus) result = result.filter((f) => f.consentStatus === filters.consentStatus);
  if (filters.lifecycleStage) result = result.filter((f) => f.lifecycleStage === filters.lifecycleStage);

  // Tier mapping from existing system
  if (filters.tier) {
    const tierMap: Record<string, number> = { vip: 90, whale: 75, engaged: 50, warm: 30, cold: 15 };
    const threshold = tierMap[filters.tier];
    if (threshold !== undefined) {
      result = result.filter((f) => {
        const score = (f.relationshipScore + f.commercialScore) / 2;
        return score >= threshold;
      });
    }
  }

  return result;
}

export function formatCurrency(n: number): string {
  if (n >= 1000) return `€${(n / 1000).toFixed(1)}k`;
  return `€${n}`;
}

export function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "Jamais";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "Aujourd'hui";
  if (days === 1) return "Hier";
  if (days < 7) return `Il y a ${days}j`;
  if (days < 30) return `Il y a ${Math.floor(days / 7)}sem`;
  if (days < 365) return `Il y a ${Math.floor(days / 30)}mois`;
  return `Il y a ${Math.floor(days / 365)}an${Math.floor(days / 365) > 1 ? "s" : ""}`;
}

export const PLATFORM_LABELS: Record<string, string> = {
  onlyfans: "OnlyFans",
  fansly: "Fansly",
  mym: "MYM",
  fanvue: "Fanvue",
  instagram: "Instagram",
  tiktok: "TikTok",
};

export const PLATFORM_COLORS: Record<string, string> = {
  onlyfans: "#00A7E1",
  fansly: "#E5484D",
  mym: "#C75B39",
  fanvue: "#8B5CF6",
  instagram: "#E1306C",
  tiktok: "#00F2EA",
};

export const CHURN_RISK_COLORS = (risk: number): string => {
  if (risk >= 75) return "#E5484D";
  if (risk >= 50) return "#F59E0B";
  if (risk >= 25) return "#3B82F6";
  return "#10B981";
};

export const COMPLIANCE_RISK_COLORS = (risk: number): string => {
  if (risk >= 75) return "#E5484D";
  if (risk >= 50) return "#F59E0B";
  if (risk >= 25) return "#3B82F6";
  return "#10B981";
};
