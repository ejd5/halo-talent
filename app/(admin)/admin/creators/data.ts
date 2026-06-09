import type {
  Creator,
  Contract,
  Message,
  CalendarPost,
  AIReport,
  CreatorDocument,
  InternalNote,
  AuditLog,
  MonthlyRevenue,
} from "./types";

const months = [
  "Juil", "Août", "Sep", "Oct", "Nov", "Déc",
  "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
];

function makeRevenue(base: number, volatility: number): MonthlyRevenue[] {
  return months.map((month, i) => {
    const gross = Math.round(base + Math.sin(i * 1.2) * volatility + Math.random() * volatility * 0.3);
    const commission = Math.round(gross * 0.15);
    return {
      month,
      platforms: [
        {
          name: i % 3 === 0 ? "YouTube" : i % 3 === 1 ? "Instagram" : "TikTok",
          gross,
          commission_pct: 15,
          commission_eur: commission,
          net: gross - commission,
        },
      ],
      total_gross: gross,
      total_commission: commission,
      total_net: gross - commission,
    };
  });
}

export const creators: Creator[] = [
  {
    id: "c1",
    full_name: "Clara W.",
    email: "clara.w@example.com",
    phone: "+33 6 11 22 33 44",
    avatar_url: null,
    department: "Digital Creators",
    tier: "scale",
    status: "active",
    manager_id: "m1",
    manager_name: "Marc A.",
    start_date: "2024-03-15",
    country: "FR",
    age: 26,
    social_links: {
      YouTube: "https://youtube.com/@clara.w",
      Instagram: "https://instagram.com/clara.w",
    },
    platforms: [
      { name: "YouTube", username: "@clara.w", followers: 125000, api_connected: true, last_sync: new Date(Date.now() - 1000 * 60 * 30).toISOString(), verified: true },
      { name: "Instagram", username: "@clara.w", followers: 82000, api_connected: true, last_sync: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), verified: true },
    ],
    monthly_revenue: makeRevenue(12400, 3000),
    current_month_revenue: 14200,
    total_followers: 207000,
    engagement_rate: 4.2,
    growth_rate: 18,
    tags: ["beauté", "lifestyle", "marque-blanche"],
  },
  {
    id: "c2",
    full_name: "Marc T.",
    email: "marc.t@example.com",
    phone: null,
    avatar_url: null,
    department: "Digital Creators",
    tier: "elite",
    status: "active",
    manager_id: "m1",
    manager_name: "Marc A.",
    start_date: "2023-09-01",
    country: "FR",
    age: 29,
    social_links: {
      Instagram: "https://instagram.com/marc.t",
      TikTok: "https://tiktok.com/@marc.t",
    },
    platforms: [
      { name: "Instagram", username: "@marc.t", followers: 240000, api_connected: true, last_sync: new Date().toISOString(), verified: true },
      { name: "TikTok", username: "@marc.t", followers: 580000, api_connected: true, last_sync: new Date(Date.now() - 1000 * 60 * 15).toISOString(), verified: true },
    ],
    monthly_revenue: makeRevenue(22000, 5000),
    current_month_revenue: 25800,
    total_followers: 820000,
    engagement_rate: 3.8,
    growth_rate: 24,
    tags: ["voyage", "photographie", "luxe"],
  },
  {
    id: "c3",
    full_name: "Léa R.",
    email: "lea.r@example.com",
    phone: "+33 6 55 66 77 88",
    avatar_url: null,
    department: "Music & Performing Arts",
    tier: "growth",
    status: "active",
    manager_id: "m2",
    manager_name: "Sophie L.",
    start_date: "2024-06-01",
    country: "FR",
    age: 23,
    social_links: {
      TikTok: "https://tiktok.com/@lea.r",
      YouTube: "https://youtube.com/@lea.r",
    },
    platforms: [
      { name: "TikTok", username: "@lea.r", followers: 340000, api_connected: true, last_sync: new Date(Date.now() - 1000 * 60 * 45).toISOString(), verified: true },
      { name: "YouTube", username: "@lea.r", followers: 45000, api_connected: false, last_sync: null, verified: false },
    ],
    monthly_revenue: makeRevenue(8200, 2000),
    current_month_revenue: 9400,
    total_followers: 385000,
    engagement_rate: 5.1,
    growth_rate: 32,
    tags: ["musique", "chant", "cover"],
  },
  {
    id: "c4",
    full_name: "Inès D.",
    email: "ines.d@example.com",
    phone: "+33 6 99 88 77 66",
    avatar_url: null,
    department: "Digital Creators",
    tier: "icon",
    status: "active",
    manager_id: "m1",
    manager_name: "Marc A.",
    start_date: "2023-06-15",
    country: "FR",
    age: 27,
    social_links: {
      OnlyFans: "https://onlyfans.com/ines.d",
      Instagram: "https://instagram.com/ines.d",
      Twitter: "https://twitter.com/ines.d",
    },
    platforms: [
      { name: "OnlyFans", username: "@ines.d", followers: 23000, api_connected: true, last_sync: new Date(Date.now() - 1000 * 60 * 10).toISOString(), verified: true },
      { name: "Instagram", username: "@ines.d", followers: 95000, api_connected: true, last_sync: new Date(Date.now() - 1000 * 60 * 120).toISOString(), verified: true },
      { name: "Twitter", username: "@ines.d", followers: 42000, api_connected: false, last_sync: null, verified: false },
    ],
    monthly_revenue: makeRevenue(35000, 8000),
    current_month_revenue: 38200,
    total_followers: 160000,
    engagement_rate: 6.2,
    growth_rate: 8,
    tags: ["création-digitale", "brand-deals", "exclusivité"],
  },
  {
    id: "c5",
    full_name: "Alex M.",
    email: "alex.m@example.com",
    phone: null,
    avatar_url: null,
    department: "Sport & Lifestyle",
    tier: "discovery",
    status: "alert",
    manager_id: "m3",
    manager_name: "Thomas R.",
    start_date: "2024-10-01",
    country: "FR",
    age: 22,
    social_links: {
      Instagram: "https://instagram.com/alex.m",
      TikTok: "https://tiktok.com/@alex.m",
    },
    platforms: [
      { name: "Instagram", username: "@alex.m", followers: 18000, api_connected: true, last_sync: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), verified: true },
      { name: "TikTok", username: "@alex.m", followers: 35000, api_connected: false, last_sync: null, verified: false },
    ],
    monthly_revenue: makeRevenue(3400, 1200),
    current_month_revenue: 2100,
    total_followers: 53000,
    engagement_rate: 1.8,
    growth_rate: -12,
    tags: ["fitness", "sport"],
  },
  {
    id: "c6",
    full_name: "Emma V.",
    email: "emma.v@example.com",
    phone: "+32 4 77 88 99 00",
    avatar_url: null,
    department: "Music & Performing Arts",
    tier: "elite",
    status: "active",
    manager_id: "m2",
    manager_name: "Sophie L.",
    start_date: "2023-01-10",
    country: "BE",
    age: 31,
    social_links: {
      YouTube: "https://youtube.com/@emma.v",
    },
    platforms: [
      { name: "YouTube", username: "@emma.v", followers: 420000, api_connected: true, last_sync: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), verified: true },
    ],
    monthly_revenue: makeRevenue(28000, 6000),
    current_month_revenue: 31200,
    total_followers: 420000,
    engagement_rate: 4.5,
    growth_rate: 6,
    tags: ["musique", "production", "tutoriel"],
  },
  {
    id: "c7",
    full_name: "Hugo P.",
    email: "hugo.p@example.com",
    phone: null,
    avatar_url: null,
    department: "Business & Thought Leadership",
    tier: "growth",
    status: "pause",
    manager_id: "m4",
    manager_name: "Clara W.",
    start_date: "2024-11-01",
    country: "FR",
    age: 34,
    social_links: {
      YouTube: "https://youtube.com/@hugo.p",
      LinkedIn: "https://linkedin.com/in/hugo.p",
    },
    platforms: [
      { name: "YouTube", username: "@hugo.p", followers: 28000, api_connected: true, last_sync: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), verified: true },
      { name: "LinkedIn", username: "hugo.p", followers: 12000, api_connected: false, last_sync: null, verified: false },
    ],
    monthly_revenue: makeRevenue(6800, 1500),
    current_month_revenue: 7200,
    total_followers: 40000,
    engagement_rate: 2.5,
    growth_rate: 4,
    tags: ["business", "leadership", "conseil"],
  },
];

export const contracts: Record<string, Contract[]> = {
  c1: [
    { id: "ct1", title: "Contrat de management principal", status: "active", signed_date: "2024-03-15", end_date: "2025-03-15", commission_rate: 15, pdf_url: null, created_at: "2024-03-15" },
  ],
  c4: [
    { id: "ct2", title: "Contrat de management principal", status: "active", signed_date: "2023-06-15", end_date: "2024-06-15", commission_rate: 10, pdf_url: null, created_at: "2023-06-15" },
    { id: "ct3", title: "Avenant n°1 — Nouveau palier Icon", status: "active", signed_date: "2024-01-01", end_date: "2025-01-01", commission_rate: 8, pdf_url: null, created_at: "2024-01-01" },
  ],
  c6: [
    { id: "ct4", title: "Contrat de management principal", status: "active", signed_date: "2023-01-10", end_date: "2024-01-10", commission_rate: 12, pdf_url: null, created_at: "2023-01-10" },
    { id: "ct5", title: "Renouvellement — Année 2", status: "active", signed_date: "2024-01-10", end_date: "2025-01-10", commission_rate: 10, pdf_url: null, created_at: "2024-01-10" },
  ],
};

export const messages: Record<string, Message[]> = {
  c1: [
    { id: "msg1", from: "Clara W.", to: "Marc A.", subject: "Nouveau partenariat potentiel", content: "J'ai été contactée par une marque de cosmétiques pour un partenariat. Tu peux jeter un œil au brief ?", created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: false },
    { id: "msg2", from: "Marc A.", to: "Clara W.", subject: "Re: Planning mars", content: "On valide les dates. Je bloque le 15 pour le tournage.", created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), read: true },
  ],
  c4: [
    { id: "msg3", from: "Inès D.", to: "Marc A.", subject: "Question sur ma commission", content: "Bonjour Marc, j'aimerais discuter de mon palier de commission actuel. Je pense qu'au vu de mes résultats, on pourrait revoir ça.", created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), read: false },
    { id: "msg4", from: "Marc A.", to: "Inès D.", subject: "Re: Question sur ma commission", content: "Bien sûr Inès, on peut planifier un call cette semaine pour en parler.", created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), read: true },
  ],
};

export const calendarPosts: Record<string, CalendarPost[]> = {
  c1: [
    { id: "cal1", platform: "YouTube", content_preview: "Ma routine beauté automne/hiver", scheduled_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), status: "planned" },
    { id: "cal2", platform: "Instagram", content_preview: "Sponsorisé : soin visage", scheduled_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), status: "planned" },
    { id: "cal3", platform: "YouTube", content_preview: "Ma morning routine", scheduled_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), status: "published" },
  ],
  c4: [
    { id: "cal4", platform: "OnlyFans", content_preview: "Shooting exclusif décembre", scheduled_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), status: "planned" },
    { id: "cal5", platform: "Instagram", content_preview: "Behind the scenes shooting", scheduled_date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), status: "published" },
    { id: "cal6", platform: "Instagram", content_preview: "Collaboration marque lingerie", scheduled_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), status: "planned" },
  ],
};

export const aiReports: Record<string, AIReport[]> = {
  c1: [
    {
      id: "ai1",
      generated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      performance_score: 87,
      trends: ["Hausse de l'engagement Instagram (+22%)", "Croissance régulière des revenus YouTube", "Nouvelle audience asiatique émergente"],
      suggestions: ["Diversifier sur TikTok pour toucher une audience plus jeune", "Proposer un programme d'affiliation beauté", "Planifier une collaboration croisée avec Marc T."],
      risks: ["Dépendance à une seule marque de cosmétiques (40% des revenus)", "Baisse d'engagement sur les shorts YouTube"],
    },
  ],
  c4: [
    {
      id: "ai2",
      generated_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      performance_score: 94,
      trends: ["Revenus OnlyFans en hausse constante (+8% ce mois)", "Très fort taux de rétention abonnés (92%)", "Brand deals Instagram en progression"],
      suggestions: ["Lancer un programme de parrainage", "Créer du contenu long-format exclusif", "Explorer le marché US"],
      risks: ["Dépendance OnlyFans (65% des revenus totaux)", "Risque de saturation du marché francophone"],
    },
  ],
  c6: [
    {
      id: "ai3",
      generated_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      performance_score: 82,
      trends: ["Audience YouTube stable et fidèle", "Bonne monétisation via les super thanks"],
      suggestions: ["Lancer une chaîne secondaire", "Développer le merchandising"],
      risks: ["Absence de diversification des plateformes", "Ralentissement de la croissance des abonnés"],
    },
  ],
};

export const documents: Record<string, CreatorDocument[]> = {
  c4: [
    { id: "doc1", title: "Contrat signé — Inès D.", type: "contract", url: "#", uploaded_at: "2023-06-15", uploaded_by: "Marc A." },
    { id: "doc2", title: "Photos shooting branding", type: "photo", url: "#", uploaded_at: "2024-02-10", uploaded_by: "Inès D." },
    { id: "doc3", title: "Rapport trimestriel Q1 2025", type: "report", url: "#", uploaded_at: "2025-04-01", uploaded_by: "Marc A." },
  ],
  c1: [
    { id: "doc4", title: "Contrat signé — Clara W.", type: "contract", url: "#", uploaded_at: "2024-03-15", uploaded_by: "Marc A." },
    { id: "doc5", title: "Moodboard marque cosmétique", type: "photo", url: "#", uploaded_at: "2024-11-20", uploaded_by: "Clara W." },
  ],
};

export const internalNotes: Record<string, InternalNote[]> = {
  c4: [
    { id: "n1", author: "Marc A.", content: "Inès est notre créatrice la plus rentable. Priorité absolue sur la gestion de sa relation. Veiller à ce qu'elle se sente écoutée.", created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString() },
    { id: "n2", author: "Sophie L.", content: "Point mensuel programmé le 15. À discuter : diversification des revenus hors OnlyFans.", created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() },
  ],
  c1: [
    { id: "n3", author: "Marc A.", content: "Clara est très professionnelle. Attention à ne pas la sur-solliciter, elle gère déjà 3 collaborations en cours.", created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() },
  ],
  c5: [
    { id: "n4", author: "Thomas R.", content: "Alex est en baisse depuis 2 mois. Plan d'action : nouveau format de contenu à lui proposer. Point urgent à planifier.", created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() },
  ],
};

export const auditLogs: Record<string, AuditLog[]> = {
  c4: [
    { id: "al1", creator_id: "c4", action: "Créateur ajouté au roster", actor: "Marc A.", created_at: "2023-06-15" },
    { id: "al2", creator_id: "c4", action: "Changement de palier : Scale → Icon", actor: "Marc A.", created_at: "2024-01-01", metadata: { previous_tier: "scale", new_tier: "icon" } },
    { id: "al3", creator_id: "c4", action: "Rapport IA généré", actor: "Claude", created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() },
  ],
  c1: [
    { id: "al4", creator_id: "c1", action: "Créateur ajouté au roster", actor: "Marc A.", created_at: "2024-03-15" },
    { id: "al5", creator_id: "c1", action: "Changement de palier : Growth → Scale", actor: "Marc A.", created_at: "2024-09-01", metadata: { previous_tier: "growth", new_tier: "scale" } },
  ],
};

export const departments = [
  "Music & Performing Arts",
  "Sport & Lifestyle",
  "Business & Thought Leadership",
  "Digital Creators",
  "Talent Premium",
];

export const managers = [
  { id: "m1", name: "Marc A." },
  { id: "m2", name: "Sophie L." },
  { id: "m3", name: "Thomas R." },
  { id: "m4", name: "Clara W." },
];

export const tierConfig: Record<string, { label: string; color: string; minRevenue: number }> = {
  discovery: { label: "Découverte", color: "#E0D8D0", minRevenue: 0 },
  growth: { label: "Croissance", color: "#C75B39", minRevenue: 5000 },
  scale: { label: "Scale", color: "#B8860B", minRevenue: 10000 },
  elite: { label: "Elite", color: "#C75B39", minRevenue: 20000 },
  icon: { label: "Icon", color: "#C75B39", minRevenue: 30000 },
};
