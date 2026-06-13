// ─── Chat Copilot, Mock Data ─────────────────────────────
// 12 conversations covering all segments, platforms, and priority levels

import type {
  ChatConversation,
  ChatMessage,
  FanBrain,
} from "@/lib/chat-copilot/types";

const now = new Date("2026-06-10T14:00:00Z");

function ago(minutes: number): string {
  return new Date(now.getTime() - minutes * 60_000).toISOString();
}

function daysAgo(d: number): string {
  return new Date(now.getTime() - d * 86_400_000).toISOString();
}

// ─── Conversations ─────────────────────────────────────────

export const mockConversations: ChatConversation[] = [
  // ── Whales ──
  {
    id: "conv-1", fanId: "fan-1", fanName: "Lucas", nickname: "Lucas_24",
    avatarInitials: "LU", platform: "onlyfans", segment: "whale",
    lastMessage: "Merci pour la vidéo exclusive, elle est incroyable 🔥",
    lastMessageTimestamp: ago(15), unreadCount: 2, priority: "urgent", priorityScore: 92,
    aiPriorityReason: "Forte intention d'achat détectée", revenuePotential: 850,
  },
  {
    id: "conv-2", fanId: "fan-2", fanName: "Thomas", nickname: "Tom_pv",
    avatarInitials: "TO", platform: "onlyfans", segment: "whale",
    lastMessage: "Tu veux qu'on fasse un call privé cette semaine ?",
    lastMessageTimestamp: ago(120), unreadCount: 0, priority: "opportunity", priorityScore: 78,
    aiPriorityReason: "Demande de service premium", revenuePotential: 1200,
  },
  {
    id: "conv-3", fanId: "fan-3", fanName: "Romain", nickname: null,
    avatarInitials: "RO", platform: "fansly", segment: "whale",
    lastMessage: "Abonnement renouvelé pour 6 mois !",
    lastMessageTimestamp: ago(300), unreadCount: 1, priority: "normal", priorityScore: 45,
    revenuePotential: 600,
  },
  // ── Tippers ──
  {
    id: "conv-4", fanId: "fan-4", fanName: "Maxime", nickname: "Max_off92",
    avatarInitials: "MA", platform: "onlyfans", segment: "tipper",
    lastMessage: "Combien pour un contenu personnalisé de 10 min ?",
    lastMessageTimestamp: ago(45), unreadCount: 3, priority: "urgent", priorityScore: 85,
    aiPriorityReason: "Demande PPV avec budget élevé", revenuePotential: 200,
  },
  {
    id: "conv-5", fanId: "fan-5", fanName: "Nina", nickname: "Nina_bzh",
    avatarInitials: "NI", platform: "mym", segment: "tipper",
    lastMessage: "Super contenu cette semaine, continue comme ça ✨",
    lastMessageTimestamp: ago(600), unreadCount: 0, priority: "normal", priorityScore: 25,
    revenuePotential: 80,
  },
  {
    id: "conv-6", fanId: "fan-6", fanName: "Stéphane", nickname: "Stephane_off",
    avatarInitials: "ST", platform: "onlyfans", segment: "tipper",
    lastMessage: "Est-ce que tu fais des lives privés ?",
    lastMessageTimestamp: ago(1440), unreadCount: 1, priority: "opportunity", priorityScore: 70,
    aiPriorityReason: "Fidèle, potentiel d'upsell", revenuePotential: 150,
  },
  // ── New ──
  {
    id: "conv-7", fanId: "fan-7", fanName: "Julie", nickname: "Julie_crea",
    avatarInitials: "JU", platform: "instagram", segment: "new",
    lastMessage: "Coucou ! Tu utilises quel matos pour tes vidéos ?",
    lastMessageTimestamp: ago(240), unreadCount: 1, priority: "opportunity", priorityScore: 55,
    aiPriorityReason: "Nouvelle fan, à convertir", revenuePotential: 40,
  },
  {
    id: "conv-8", fanId: "fan-8", fanName: "Alexandre", nickname: "Alex_design",
    avatarInitials: "AL", platform: "instagram", segment: "new",
    lastMessage: "Je peux faire tes covers et bannières. Tarif : 50€",
    lastMessageTimestamp: ago(2880), unreadCount: 0, priority: "normal", priorityScore: 30,
    revenuePotential: 50,
  },
  {
    id: "conv-9", fanId: "fan-9", fanName: "Camille", nickname: null,
    avatarInitials: "CA", platform: "fansly", segment: "new",
    lastMessage: "Je viens de m'abonner, hâte de découvrir ton contenu !",
    lastMessageTimestamp: ago(4320), unreadCount: 0, priority: "normal", priorityScore: 35,
    revenuePotential: 25,
  },
  // ── Churning ──
  {
    id: "conv-10", fanId: "fan-10", fanName: "Julien", nickname: "anon_789",
    avatarInitials: "JU", platform: "onlyfans", segment: "churning",
    lastMessage: "Désolé je suis pas très actif en ce moment...",
    lastMessageTimestamp: ago(10080), unreadCount: 0, priority: "urgent", priorityScore: 88,
    aiPriorityReason: "Risque de perte élevé, 7j sans activité", revenuePotential: 60,
  },
  {
    id: "conv-11", fanId: "fan-11", fanName: "Pierre", nickname: "Pyerre_off",
    avatarInitials: "PI", platform: "onlyfans", segment: "churning",
    lastMessage: "Je réfléchis à résilier mon abonnement...",
    lastMessageTimestamp: ago(14400), unreadCount: 0, priority: "urgent", priorityScore: 95,
    aiPriorityReason: "Intention de résiliation explicite", revenuePotential: 45,
  },
  {
    id: "conv-12", fanId: "fan-12", fanName: "Sophie", nickname: "Soso_off",
    avatarInitials: "SO", platform: "mym", segment: "churning",
    lastMessage: "Pas vu ton message désolée, je suis débordée en ce moment",
    lastMessageTimestamp: ago(7200), unreadCount: 0, priority: "opportunity", priorityScore: 65,
    aiPriorityReason: "À réengager avec message personnalisé", revenuePotential: 30,
  },
];

// ─── Messages ─────────────────────────────────────────────

export const mockMessages: Record<string, ChatMessage[]> = {
  "conv-1": [
    { id: "msg-1", role: "fan", content: "Salut ! J'ai adoré ton dernier post, t'es trop belle 😍", timestamp: ago(120), platform: "onlyfans", read: true, delivered: true },
    { id: "msg-2", role: "creator", content: "Merci Lucas ! Ravie que ça te plaise 🥰", timestamp: ago(118), platform: "onlyfans", read: true, delivered: true },
    { id: "msg-3", role: "fan", content: "Tu penses faire d'autres vidéos comme celle de la semaine dernière ?", timestamp: ago(90), platform: "onlyfans", read: true, delivered: true },
    { id: "msg-4", role: "creator", content: "Oui j'en prépare une nouvelle ! Tu veux un aperçu ?", timestamp: ago(88), platform: "onlyfans", read: true, delivered: true },
    { id: "msg-5", role: "fan", content: "Carrément ! Envoie moi le teaser stp", timestamp: ago(60), platform: "onlyfans", read: true, delivered: true },
    { id: "msg-6", role: "creator", content: "Tadaa 🎬 Voici un petit extrait de ce qui arrive...", timestamp: ago(58), platform: "onlyfans", read: true, delivered: true, isPPV: true, ppvPrice: 25, ppvPreviewBlurred: true },
    { id: "msg-7", role: "fan", content: "Woah j'ai trop hâte ! Je l'achète direct", timestamp: ago(30), platform: "onlyfans", read: true, delivered: true },
    { id: "msg-8", role: "creator", content: "Génial, merci Lucas ! Tu vas adorer 😘", timestamp: ago(28), platform: "onlyfans", read: true, delivered: true },
    { id: "msg-9", role: "fan", content: "Merci pour la vidéo exclusive, elle est incroyable 🔥", timestamp: ago(15), platform: "onlyfans", read: true, delivered: true },
  ],
  "conv-2": [
    { id: "msg-10", role: "fan", content: "Salut, ça va ?", timestamp: daysAgo(3), platform: "onlyfans", read: true, delivered: true },
    { id: "msg-11", role: "creator", content: "Ça va super et toi ? 😊", timestamp: daysAgo(3), platform: "onlyfans", read: true, delivered: true },
    { id: "msg-12", role: "fan", content: "Tu veux qu'on fasse un call privé cette semaine ?", timestamp: ago(120), platform: "onlyfans", read: true, delivered: true },
  ],
  "conv-3": [
    { id: "msg-13", role: "fan", content: "Salut ! Je viens de renouveler mon abonnement", timestamp: daysAgo(5), platform: "fansly", read: true, delivered: true },
    { id: "msg-14", role: "creator", content: "Merci Romain ! Tu es génial 🎉", timestamp: daysAgo(5), platform: "fansly", read: true, delivered: true },
    { id: "msg-15", role: "fan", content: "Abonnement renouvelé pour 6 mois !", timestamp: ago(300), platform: "fansly", read: true, delivered: true },
  ],
  "conv-4": [
    { id: "msg-16", role: "fan", content: "Bonjour, je voudrais savoir combien coûte un contenu personnalisé ?", timestamp: ago(60), platform: "onlyfans", read: true, delivered: true },
    { id: "msg-17", role: "fan", content: "Je cherche une vidéo de 10 minutes environ", timestamp: ago(58), platform: "onlyfans", read: true, delivered: true },
    { id: "msg-18", role: "fan", content: "Avec un thème spécifique si possible", timestamp: ago(56), platform: "onlyfans", read: false, delivered: false },
  ],
  "conv-5": [
    { id: "msg-19", role: "fan", content: "Hey ! Super contenu cette semaine, continue comme ça ✨", timestamp: ago(600), platform: "mym", read: true, delivered: true },
  ],
  "conv-6": [
    { id: "msg-20", role: "fan", content: "Bonjour, je suis abonné depuis 3 mois et j'adore ton contenu.", timestamp: daysAgo(2), platform: "onlyfans", read: true, delivered: true },
    { id: "msg-21", role: "creator", content: "Merci beaucoup Stéphane ! Ravie que tu apprécies 😊", timestamp: daysAgo(2), platform: "onlyfans", read: true, delivered: true },
    { id: "msg-22", role: "fan", content: "Est-ce que tu fais des lives privés ?", timestamp: ago(1440), platform: "onlyfans", read: true, delivered: true },
  ],
  "conv-7": [
    { id: "msg-23", role: "fan", content: "Coucou ! Tu utilises quel matos pour tes vidéos ? Je débute 😊", timestamp: ago(240), platform: "instagram", read: true, delivered: true },
  ],
  "conv-8": [
    { id: "msg-24", role: "fan", content: "Je suis graphiste et je peux faire tes covers et bannières. Tarif : 50€/set. Intéressée ?", timestamp: ago(2880), platform: "instagram", read: true, delivered: true },
  ],
  "conv-9": [
    { id: "msg-25", role: "fan", content: "Je viens de m'abonner, hâte de découvrir ton contenu !", timestamp: ago(4320), platform: "fansly", read: true, delivered: true },
  ],
  "conv-10": [
    { id: "msg-26", role: "fan", content: "Salut, juste te dire que je suis moins présent en ce moment", timestamp: daysAgo(10), platform: "onlyfans", read: true, delivered: true },
    { id: "msg-27", role: "creator", content: "Oh mince, tout va bien ? Tu me manques ici ! 💔", timestamp: daysAgo(10), platform: "onlyfans", read: true, delivered: true },
    { id: "msg-28", role: "fan", content: "Oui oui désolé je suis pas très actif en ce moment...", timestamp: ago(10080), platform: "onlyfans", read: true, delivered: true },
  ],
  "conv-11": [
    { id: "msg-29", role: "fan", content: "Salut, je voudrais te parler de mon abonnement", timestamp: daysAgo(10), platform: "onlyfans", read: true, delivered: true },
    { id: "msg-30", role: "creator", content: "Bien sûr, je t'écoute 🤗", timestamp: daysAgo(10), platform: "onlyfans", read: true, delivered: true },
    { id: "msg-31", role: "fan", content: "Je réfléchis à résilier mon abonnement... Les finances sont serrées en ce moment", timestamp: ago(14400), platform: "onlyfans", read: true, delivered: true },
  ],
  "conv-12": [
    { id: "msg-32", role: "fan", content: "Hey tu as vu mon dernier message ?", timestamp: daysAgo(5), platform: "mym", read: true, delivered: true },
    { id: "msg-33", role: "creator", content: "Non pas encore ! Je te réponds de suite 😊", timestamp: daysAgo(5), platform: "mym", read: true, delivered: true },
    { id: "msg-34", role: "fan", content: "Pas vu ton message désolée, je suis débordée en ce moment", timestamp: ago(7200), platform: "mym", read: true, delivered: true },
  ],
};

// ─── Fan Brains (full data for key fans) ────────────────────

export const mockFanBrains: Record<string, FanBrain> = {
  "fan-1": {
    fan_id: "fan-1",
    creator_id: "creator-1",
    custom_name: "Lucas (VIP)",
    language_detected: "fr",
    timezone_estimate: "Europe/Paris",
    ltv_predicted: 5200,
    segment: "whale",
    tip_history: [25, 50, 100, 50, 30, 75],
    average_ppv_price: 35,
    subscription_months: 14,
    personality: {
      communication_style: "friendly",
      interests: ["fitness", "voyages", "photographie", "contenu exclusif"],
      triggers_positive: ["vidéos personnalisées", "messages vocaux", "accès anticipé"],
      triggers_negative: ["réponses génériques", "contenu répétitif"],
      preferred_content_type: "video",
      preferred_tone: "chaleureuse",
      notes_manuelles: "[08/06/2026] A demandé une vidéo anniversaire pour sa copine\n[01/06/2026] Client fidèle, toujours respectueux",
    },
    conversation: {
      total_messages: 156,
      topics_discussed: ["vidéos PPV", "fitness", "voyages", "anniversaire", "contenu exclusif"],
      last_messages_summary: "Lucas a acheté une vidéo PPV exclusive. Très enthousiaste, feedback positif. Fidèle de longue date.",
      sentiment_trend: "positive",
      open_threads: ["Prochaine vidéo personnalisée en préparation"],
      best_performing_messages: ["Merci pour la vidéo exclusive, elle est incroyable 🔥"],
    },
    risk: {
      churn_score: 8,
      days_since_last_message: 0,
      days_since_last_purchase: 0,
      engagement_trend: "rising",
    },
    tags: ["VIP", "achats réguliers", "friendly", "PPV"],
    last_brain_update: ago(10),
    last_analysis_at: ago(15),
    created_at: daysAgo(180),
    updated_at: ago(10),
  },
  "fan-4": {
    fan_id: "fan-4",
    creator_id: "creator-1",
    custom_name: null,
    language_detected: "fr",
    timezone_estimate: null,
    ltv_predicted: 1200,
    segment: "tipper",
    tip_history: [10, 20, 15],
    average_ppv_price: 25,
    subscription_months: 4,
    personality: {
      communication_style: "casual",
      interests: ["contenu personnalisé", "vidéos", "photographie"],
      triggers_positive: ["réponses rapides", "contenu sur mesure", "tarifs clairs"],
      triggers_negative: ["ignorer ses questions", "prix trop élevés"],
      preferred_content_type: "video",
      preferred_tone: "professionnelle",
      notes_manuelles: "",
    },
    conversation: {
      total_messages: 28,
      topics_discussed: ["PPV personnalisé", "tarifs", "vidéos"],
      last_messages_summary: "Maxime demande un contenu personnalisé de 10 min. En attente de réponse. Fort potentiel d'achat.",
      sentiment_trend: "neutral",
      open_threads: ["Demande PVP en cours"],
      best_performing_messages: [],
    },
    risk: {
      churn_score: 25,
      days_since_last_message: 0,
      days_since_last_purchase: 14,
      engagement_trend: "stable",
    },
    tags: ["PPV", "en attente", "potentiel"],
    last_brain_update: ago(45),
    last_analysis_at: ago(50),
    created_at: daysAgo(120),
    updated_at: ago(45),
  },
  "fan-10": {
    fan_id: "fan-10",
    creator_id: "creator-1",
    custom_name: "Julien (à risque)",
    language_detected: "fr",
    timezone_estimate: "Europe/Paris",
    ltv_predicted: 480,
    segment: "churning",
    tip_history: [5, 10],
    average_ppv_price: 10,
    subscription_months: 3,
    personality: {
      communication_style: "shy",
      interests: ["lecture", "cinéma"],
      triggers_positive: ["messages doux", "attention personnalisée"],
      triggers_negative: ["messages trop pushy", "contenu trop explicite"],
      preferred_content_type: "text",
      preferred_tone: "douce",
      notes_manuelles: "[01/06/2026] Fan réservé mais gentil. À réengager avec douceur.",
    },
    conversation: {
      total_messages: 18,
      topics_discussed: ["films", "lecture", "quotidien"],
      last_messages_summary: "Julien s'est excusé pour son absence. Semble traverser une période chargée. À réengager avec un message personnalisé et bienveillant.",
      sentiment_trend: "declining",
      open_threads: [],
      best_performing_messages: [],
    },
    risk: {
      churn_score: 78,
      days_since_last_message: 7,
      days_since_last_purchase: 21,
      engagement_trend: "declining",
    },
    tags: ["à risque", "réservé", "réengagement"],
    last_brain_update: ago(10080),
    last_analysis_at: ago(10080),
    created_at: daysAgo(90),
    updated_at: ago(10080),
  },
  "fan-11": {
    fan_id: "fan-11",
    creator_id: "creator-1",
    custom_name: "Pierre",
    language_detected: "fr",
    timezone_estimate: "Europe/Paris",
    ltv_predicted: 320,
    segment: "churning",
    tip_history: [10],
    average_ppv_price: 15,
    subscription_months: 2,
    personality: {
      communication_style: "demanding",
      interests: [],
      triggers_positive: ["offres spéciales", "réduction"],
      triggers_negative: ["prix élevés", "absence de réponse"],
      preferred_content_type: "photo",
      preferred_tone: "directe",
      notes_manuelles: "",
    },
    conversation: {
      total_messages: 12,
      topics_discussed: ["prix", "abonnement", "finances"],
      last_messages_summary: "Pierre envisage de résilier son abonnement pour raisons financières. À traiter en priorité avec une offre de fidélité.",
      sentiment_trend: "declining",
      open_threads: ["Négociation abonnement en cours"],
      best_performing_messages: [],
    },
    risk: {
      churn_score: 92,
      days_since_last_message: 10,
      days_since_last_purchase: 30,
      engagement_trend: "declining",
    },
    tags: ["à risque critique", "résiliation", "urgence"],
    last_brain_update: ago(14400),
    last_analysis_at: ago(14400),
    created_at: daysAgo(60),
    updated_at: ago(14400),
  },
};

// ─── AI Suggestions ────────────────────────────────────────

export const mockAISuggestions: string[] = [
  "Salut ! J'ai pensé à toi aujourd'hui, tu me manques sur mon fil 😊 Tu veux voir un petit aperçu de mon dernier contenu exclusif ?",
  "Coucou ! Je prépare une nouvelle vidéo et j'aurais aimé avoir ton avis avant de la finaliser. Tu es toujours mon fan préféré pour me conseiller 🫶",
  "Hé ! Ça fait un bail, j'espère que tout va bien de ton côté. J'ai un petit quelque chose de spécial qui pourrait te plaire, dis-moi si t'es chaud 🔥",
];

// ─── Filter/Sort helpers ──────────────────────────────────

export function filterConversations(
  convs: ChatConversation[],
  tab: string,
  search: string,
): ChatConversation[] {
  let filtered = convs;

  if (tab === "unread") {
    filtered = filtered.filter((c) => c.unreadCount > 0);
  } else if (tab === "vip") {
    filtered = filtered.filter((c) => c.segment === "whale");
  } else if (tab === "at_risk") {
    filtered = filtered.filter((c) => c.segment === "churning");
  } else if (tab === "pending") {
    filtered = filtered.filter((c) => c.unreadCount > 0 || c.priority === "urgent");
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.fanName.toLowerCase().includes(q) ||
        (c.nickname && c.nickname.toLowerCase().includes(q)) ||
        c.tags?.some((t) => t.toLowerCase().includes(q)) ||
        c.segment.toLowerCase().includes(q),
    );
  }

  return filtered;
}

export function sortConversations(
  convs: ChatConversation[],
  sortMode: string,
): ChatConversation[] {
  const sorted = [...convs];
  if (sortMode === "recent") {
    sorted.sort(
      (a, b) =>
        new Date(b.lastMessageTimestamp).getTime() -
        new Date(a.lastMessageTimestamp).getTime(),
    );
  } else if (sortMode === "ai_priority") {
    sorted.sort((a, b) => b.priorityScore - a.priorityScore);
  } else if (sortMode === "revenue_potential") {
    sorted.sort((a, b) => b.revenuePotential - a.revenuePotential);
  }
  return sorted;
}
