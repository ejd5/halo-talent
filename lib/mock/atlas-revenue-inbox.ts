// ─── Revenue Inbox V1 — Mock Data ───

export type RiskLevel = "low" | "medium" | "high" | "critical";
export type Platform = "onlyfans" | "fansly" | "mym" | "fanvue" | "instagram" | "tiktok";
export type ActionType = "upsell_ppv" | "re_engage" | "send_welcome" | "promote_bundle" | "ask_feedback" | "reward_loyalty" | "win_back" | "compliance_hold" | "custom_request";
export type OfferType = "ppv_video" | "ppv_photo" | "bundle" | "custom_request" | "subscription_upsell" | "tip_ask" | "free_preview";
export type ThreadStatus = "new" | "needs_reply" | "draft_ready" | "sent" | "dormant" | "escalated";

export interface RevenueMessage {
  id: string;
  direction: "inbound" | "outbound";
  channel: Platform;
  content: string;
  occurredAt: string;
  isPPV?: boolean;
  ppvAmount?: number;
  ppvName?: string;
}

export interface RevenueThread {
  id: string;
  fanId: string;
  fanName: string;
  avatar: string | null;
  platform: Platform;
  language: string;
  country: string;
  fanStatus: "new" | "active" | "loyal" | "vip" | "dormant" | "at-risk";
  status: ThreadStatus;
  ltv: number;
  spendLast30d: number;
  lastPurchaseDate: string;
  lastMessageDate: string;
  intentScore: number;
  revenuePotential: number;
  riskLevel: RiskLevel;
  unread: boolean;
  assignedTo: string | null;
  tags: string[];
  lastMessagePreview: string;
  recommendedAction: ActionType;
  recommendedOffer: OfferType;
  aiSuggestedReply: string;
  aiReasoning: string;
  complianceWarning: string | null;
  alreadySentMediaIds: string[];
  notes: string[];
  fanValueScore: number;
  relationshipScore: number;
  complianceRiskScore: number;
  messages: RevenueMessage[];
}

// ─── Helper: relative date strings ───
const now = new Date("2026-06-10T14:00:00Z");
function ago(minutes: number): string {
  return new Date(now.getTime() - minutes * 60_000).toISOString();
}
function daysAgo(d: number, h = 12): string {
  return new Date(now.getTime() - d * 86_400_000 - h * 3_600_000).toISOString();
}

// ─── 15 Threads ───

export const revenueThreads: RevenueThread[] = [
  // ═══ 1-3: VIP/Whale — High intent ═══
  {
    id: "thread-001",
    fanId: "fan-001",
    fanName: "MarcusR",
    avatar: null,
    platform: "onlyfans",
    language: "en",
    country: "US",
    fanStatus: "vip",
    status: "needs_reply",
    ltv: 12450,
    spendLast30d: 2890,
    lastPurchaseDate: daysAgo(2),
    lastMessageDate: ago(15),
    intentScore: 92,
    revenuePotential: 95,
    riskLevel: "low",
    unread: true,
    assignedTo: "Sophie L.",
    tags: ["vip", "big_spender", "ppv_buyer", "custom_requests"],
    lastMessagePreview: "Hey, is that new video ready? I've been waiting...",
    recommendedAction: "upsell_ppv",
    recommendedOffer: "ppv_video",
    aiSuggestedReply:
      "Hey Marcus! The new video just dropped — exclusive 4K, 12 minutes. I saved you early access at $89.99 before it goes public next week. Want me to unlock it for you?",
    aiReasoning:
      "Fan asked about new content. VIP tier with $2.8k spend in 30 days. Historical PPV conversion rate 78%. Recommend premium price point based on LTV bracket.",
    complianceWarning: null,
    alreadySentMediaIds: ["med-042", "med-087", "med-103"],
    notes: ["Whale depuis Jan 2026. Aime le contenu exclusif long format.", "À contacter en priorité pour les nouveaux PPV."],
    fanValueScore: 98,
    relationshipScore: 85,
    complianceRiskScore: 5,
    messages: [
      { id: "m001-1", direction: "inbound", channel: "onlyfans", content: "That last video was incredible. You're amazing!", occurredAt: daysAgo(7, 14) },
      { id: "m001-2", direction: "outbound", channel: "onlyfans", content: "Thank you Marcus! I'm working on something even better for next week 😘", occurredAt: daysAgo(7, 13) },
      { id: "m001-3", direction: "outbound", channel: "onlyfans", content: "Here's a preview of the new set — exclusive for you.", occurredAt: daysAgo(5, 10), isPPV: true, ppvAmount: 49.99, ppvName: "Golden Hour Preview" },
      { id: "m001-4", direction: "inbound", channel: "onlyfans", content: "Love it! When can I get the full version?", occurredAt: daysAgo(5, 9) },
      { id: "m001-5", direction: "outbound", channel: "onlyfans", content: "Full set drops Friday. I'll save you the best price 💕", occurredAt: daysAgo(5, 8) },
      { id: "m001-6", direction: "inbound", channel: "onlyfans", content: "Purchased! Can't wait 🔥", occurredAt: daysAgo(2, 14), isPPV: true, ppvAmount: 89.99, ppvName: "Golden Hour Full Set" },
      { id: "m001-7", direction: "outbound", channel: "onlyfans", content: "Enjoy! Let me know your favorite shot 😊", occurredAt: daysAgo(2, 13) },
      { id: "m001-8", direction: "inbound", channel: "onlyfans", content: "Hey, is that new video ready? I've been waiting...", occurredAt: ago(15) },
    ],
  },
  {
    id: "thread-002",
    fanId: "fan-002",
    fanName: "LunaStar",
    avatar: null,
    platform: "fansly",
    language: "en",
    country: "UK",
    fanStatus: "vip",
    status: "draft_ready",
    ltv: 9800,
    spendLast30d: 2100,
    lastPurchaseDate: daysAgo(1),
    lastMessageDate: ago(45),
    intentScore: 88,
    revenuePotential: 90,
    riskLevel: "low",
    unread: false,
    assignedTo: "Sophie L.",
    tags: ["vip", "bundle_buyer", "loyal"],
    lastMessagePreview: "Can you do a custom bundle with the beach and studio sets?",
    recommendedAction: "promote_bundle",
    recommendedOffer: "bundle",
    aiSuggestedReply:
      "Hi Luna! Absolutely — I can put together a custom bundle with both sets plus 3 exclusive BTS photos that haven't been released anywhere. $149 for the full package. Interested?",
    aiReasoning:
      "Custom bundle request from VIP fan. Historical bundle AOV $120-180. Fan has purchased 4 bundles in last 60 days. Recommend premium custom package.",
    complianceWarning: null,
    alreadySentMediaIds: ["med-012", "med-034", "med-056", "med-078"],
    notes: ["VIP depuis Mars 2026. Préfère les bundles personnalisés.", "Très réactive, répond dans l'heure."],
    fanValueScore: 95,
    relationshipScore: 90,
    complianceRiskScore: 3,
    messages: [
      { id: "m002-1", direction: "inbound", channel: "fansly", content: "The beach set is gorgeous! Do you have more from that shoot?", occurredAt: daysAgo(5, 16) },
      { id: "m002-2", direction: "outbound", channel: "fansly", content: "I do! There's a studio set from the same day. Want both?", occurredAt: daysAgo(5, 15) },
      { id: "m002-3", direction: "inbound", channel: "fansly", content: "Yes please! Can you bundle them?", occurredAt: daysAgo(5, 14) },
      { id: "m002-4", direction: "outbound", channel: "fansly", content: "Bundle unlocked — Beach + Studio, $119. Enjoy! 🌊📸", occurredAt: daysAgo(4, 10), isPPV: true, ppvAmount: 119, ppvName: "Beach + Studio Bundle" },
      { id: "m002-5", direction: "inbound", channel: "fansly", content: "Bought it! These are stunning. Can you do a custom bundle with the beach and studio sets?", occurredAt: ago(45) },
    ],
  },
  {
    id: "thread-003",
    fanId: "fan-003",
    fanName: "CarlosM",
    avatar: null,
    platform: "onlyfans",
    language: "es",
    country: "ES",
    fanStatus: "active",
    status: "needs_reply",
    ltv: 5600,
    spendLast30d: 1450,
    lastPurchaseDate: daysAgo(3),
    lastMessageDate: ago(30),
    intentScore: 85,
    revenuePotential: 80,
    riskLevel: "low",
    unread: true,
    assignedTo: null,
    tags: ["engaged", "ppv_buyer", "spanish_speaker"],
    lastMessagePreview: "¿Tienes más contenido como el último? Me encantó 🔥",
    recommendedAction: "upsell_ppv",
    recommendedOffer: "ppv_video",
    aiSuggestedReply:
      "¡Claro Carlos! Acabo de terminar un video nuevo — 15 minutos, luz natural, muy parecido al anterior. Lo tengo a 59.99€ para ti antes del lanzamiento oficial. ¿Te lo desbloqueo?",
    aiReasoning:
      "Spanish-speaking fan requested similar content. Historical PPV conversion 65%. $1.4k spend last 30 days. Recommend mid-tier price aligned with previous purchases.",
    complianceWarning: null,
    alreadySentMediaIds: ["med-022", "med-045"],
    notes: ["Bon PPV buyer, répond bien aux upsells.", "Préfère le contenu en lumière naturelle."],
    fanValueScore: 82,
    relationshipScore: 72,
    complianceRiskScore: 8,
    messages: [
      { id: "m003-1", direction: "inbound", channel: "onlyfans", content: "Hola, me encanta tu contenido ✨", occurredAt: daysAgo(14, 18) },
      { id: "m003-2", direction: "outbound", channel: "onlyfans", content: "¡Gracias Carlos! ¿Qué tipo de contenido te gusta más?", occurredAt: daysAgo(14, 17) },
      { id: "m003-3", direction: "inbound", channel: "onlyfans", content: "Los videos largos, outdoor, luz natural", occurredAt: daysAgo(14, 16) },
      { id: "m003-4", direction: "outbound", channel: "onlyfans", content: "Tengo un video nuevo de 12 min en exterior. ¿Te interesa?", occurredAt: daysAgo(5, 12), isPPV: true, ppvAmount: 49.99, ppvName: "Atardecer Natural" },
      { id: "m003-5", direction: "inbound", channel: "onlyfans", content: "¡Comprado! Increíble 😍", occurredAt: daysAgo(3, 20) },
      { id: "m003-6", direction: "inbound", channel: "onlyfans", content: "¿Tienes más contenido como el último? Me encantó 🔥", occurredAt: ago(30) },
    ],
  },

  // ═══ 4-6: Engaged — Medium-High Intent ═══
  {
    id: "thread-004",
    fanId: "fan-004",
    fanName: "Alex_1996",
    avatar: null,
    platform: "instagram",
    language: "en",
    country: "CA",
    fanStatus: "active",
    status: "needs_reply",
    ltv: 3200,
    spendLast30d: 680,
    lastPurchaseDate: daysAgo(14),
    lastMessageDate: ago(120),
    intentScore: 72,
    revenuePotential: 65,
    riskLevel: "low",
    unread: true,
    assignedTo: "Marc D.",
    tags: ["instagram_migrated", "curious", "new_buyer"],
    lastMessagePreview: "Hey, I saw you're on OF too — is the content different there?",
    recommendedAction: "send_welcome",
    recommendedOffer: "subscription_upsell",
    aiSuggestedReply:
      "Hey Alex! Yes — my OF has exclusive content that never goes on IG. Longer videos, behind-the-scenes, and custom requests. I actually have a 30% off your first month right now if you want to check it out?",
    aiReasoning:
      "Instagram follower curious about OF migration. Low friction opportunity to convert. Recommend subscription upsell with first-month discount. Historical IG→OF conversion rate 12%.",
    complianceWarning: null,
    alreadySentMediaIds: [],
    notes: ["Vient d'Instagram, nouveau dans l'écosystème.", "Potentiel de conversion OF."],
    fanValueScore: 55,
    relationshipScore: 40,
    complianceRiskScore: 15,
    messages: [
      { id: "m004-1", direction: "inbound", channel: "instagram", content: "Love your content! Do you post more on other platforms?", occurredAt: daysAgo(3, 10) },
      { id: "m004-2", direction: "outbound", channel: "instagram", content: "Thank you! Yes, my OF has exclusive content 😊", occurredAt: daysAgo(3, 9) },
      { id: "m004-3", direction: "inbound", channel: "instagram", content: "Hey, I saw you're on OF too — is the content different there?", occurredAt: ago(120) },
    ],
  },
  {
    id: "thread-005",
    fanId: "fan-005",
    fanName: "Emma_W",
    avatar: null,
    platform: "onlyfans",
    language: "de",
    country: "DE",
    fanStatus: "active",
    status: "needs_reply",
    ltv: 4100,
    spendLast30d: 920,
    lastPurchaseDate: daysAgo(5),
    lastMessageDate: ago(55),
    intentScore: 78,
    revenuePotential: 75,
    riskLevel: "low",
    unread: true,
    assignedTo: null,
    tags: ["german_speaker", "ppv_buyer", "responsive"],
    lastMessagePreview: "Gibt es ein Special für langjährige Fans? Bin seit 4 Monaten dabei 💫",
    recommendedAction: "reward_loyalty",
    recommendedOffer: "bundle",
    aiSuggestedReply:
      "Emma, du bist großartig! Weil du seit 4 Monaten dabei bist, habe ich ein exklusives Treue-Paket für dich: meine 3 beliebtesten Videos plus 2 unveröffentlichte Fotosets für 79€ statt 129€. Nur für dich!",
    aiReasoning:
      "Loyal fan (4 months) asking for recognition. Recommend loyalty reward bundle at 40% discount to reinforce retention. German-speaking — reply in German.",
    complianceWarning: null,
    alreadySentMediaIds: ["med-066", "med-089"],
    notes: ["Fan fidèle, répond bien aux offres de fidélité.", "Préfère les communications en allemand."],
    fanValueScore: 78,
    relationshipScore: 75,
    complianceRiskScore: 10,
    messages: [
      { id: "m005-1", direction: "inbound", channel: "onlyfans", content: "Dein neues Video ist fantastisch!", occurredAt: daysAgo(5, 8) },
      { id: "m005-2", direction: "outbound", channel: "onlyfans", content: "Danke Emma! Freut mich, dass es dir gefällt 💕", occurredAt: daysAgo(5, 7) },
      { id: "m005-3", direction: "inbound", channel: "onlyfans", content: "Gibt es ein Special für langjährige Fans? Bin seit 4 Monaten dabei 💫", occurredAt: ago(55) },
    ],
  },
  {
    id: "thread-006",
    fanId: "fan-006",
    fanName: "Nico_Art",
    avatar: null,
    platform: "mym",
    language: "fr",
    country: "FR",
    fanStatus: "active",
    status: "needs_reply",
    ltv: 2800,
    spendLast30d: 450,
    lastPurchaseDate: daysAgo(10),
    lastMessageDate: ago(90),
    intentScore: 68,
    revenuePotential: 55,
    riskLevel: "low",
    unread: false,
    assignedTo: null,
    tags: ["french_speaker", "occasional_buyer"],
    lastMessagePreview: "Salut ! Tu fais des shootings photo en extérieur ?",
    recommendedAction: "ask_feedback",
    recommendedOffer: "free_preview",
    aiSuggestedReply:
      "Salut Nico ! Oui, j'ai tout une série en extérieur — forêt, plage, urbain. Je t'envoie un petit aperçu gratuit de ma dernière série forêt ? Si ça te plaît, je te fais un prix sur le set complet 🌿",
    aiReasoning:
      "Fan showing interest in specific content type. Recommend free preview to re-engage and gauge interest before PPV offer. Low spend recently — re-warm before upselling.",
    complianceWarning: null,
    alreadySentMediaIds: [],
    notes: ["Achète occasionnellement, besoin de réengagement."],
    fanValueScore: 50,
    relationshipScore: 45,
    complianceRiskScore: 12,
    messages: [
      { id: "m006-1", direction: "inbound", channel: "mym", content: "J'adore ton style photo !", occurredAt: daysAgo(12, 14) },
      { id: "m006-2", direction: "outbound", channel: "mym", content: "Merci Nico ! Ça fait plaisir 📸", occurredAt: daysAgo(12, 13) },
      { id: "m006-3", direction: "inbound", channel: "mym", content: "Salut ! Tu fais des shootings photo en extérieur ?", occurredAt: ago(90) },
    ],
  },

  // ═══ 7-8: Warm — Showing Purchase Intent ═══
  {
    id: "thread-007",
    fanId: "fan-007",
    fanName: "Tyler_J",
    avatar: null,
    platform: "onlyfans",
    language: "en",
    country: "US",
    fanStatus: "active",
    status: "needs_reply",
    ltv: 1200,
    spendLast30d: 320,
    lastPurchaseDate: daysAgo(20),
    lastMessageDate: ago(200),
    intentScore: 60,
    revenuePotential: 50,
    riskLevel: "low",
    unread: true,
    assignedTo: "Marc D.",
    tags: ["new_buyer", "price_sensitive"],
    lastMessagePreview: "Do you ever do discounts? I'm interested but 50 is a bit steep for me",
    recommendedAction: "upsell_ppv",
    recommendedOffer: "ppv_photo",
    aiSuggestedReply:
      "Hey Tyler! I get it. How about this — I have a mini photo set (8 exclusives) at $24.99. Same vibe, smaller pack. If you like it, I can do a loyalty discount on the next one too. Sound fair?",
    aiReasoning:
      "Price-sensitive fan with genuine interest. Lower-tier PPV offer to meet budget while maintaining value. Mini set at 50% of full price keeps fan in ecosystem.",
    complianceWarning: null,
    alreadySentMediaIds: ["med-011"],
    notes: ["Sensible au prix. Proposer options budget-friendly."],
    fanValueScore: 35,
    relationshipScore: 30,
    complianceRiskScore: 10,
    messages: [
      { id: "m007-1", direction: "outbound", channel: "onlyfans", content: "New photo set just dropped! 16 exclusives, $49.99 🔥", occurredAt: daysAgo(4, 9), isPPV: true, ppvAmount: 49.99, ppvName: "City Lights Set" },
      { id: "m007-2", direction: "inbound", channel: "onlyfans", content: "These look great! Do you ever do discounts? I'm interested but 50 is a bit steep for me", occurredAt: ago(200) },
    ],
  },
  {
    id: "thread-008",
    fanId: "fan-008",
    fanName: "Priya_K",
    avatar: null,
    platform: "fanvue",
    language: "en",
    country: "IN",
    fanStatus: "active",
    status: "new",
    ltv: 450,
    spendLast30d: 180,
    lastPurchaseDate: daysAgo(8),
    lastMessageDate: daysAgo(1, 8),
    intentScore: 55,
    revenuePotential: 40,
    riskLevel: "medium",
    unread: false,
    assignedTo: null,
    tags: ["new_fan", "first_purchase", "asia_pacific"],
    lastMessagePreview: "Just subscribed! What kind of exclusive content do you have?",
    recommendedAction: "send_welcome",
    recommendedOffer: "subscription_upsell",
    aiSuggestedReply:
      "Welcome Priya! So happy to have you here 🎉 I post exclusive photo sets every Tuesday, behind-the-scenes videos on Fridays, and I do custom content for loyal fans. Check out my welcome bundle — 3 fan-favorite sets at 40% off to get you started!",
    aiReasoning:
      "New subscriber, first engagement. Welcome message with value overview and soft upsell to welcome bundle. Build relationship before premium offers.",
    complianceWarning: null,
    alreadySentMediaIds: [],
    notes: ["Nouvelle abonnée, à chouchouter.", "Potentiel de montée en gamme."],
    fanValueScore: 20,
    relationshipScore: 15,
    complianceRiskScore: 20,
    messages: [
      { id: "m008-1", direction: "inbound", channel: "fanvue", content: "Just subscribed! What kind of exclusive content do you have?", occurredAt: daysAgo(1, 8) },
    ],
  },

  // ═══ 9-10: At-Risk / Dormant — Win-Back ═══
  {
    id: "thread-009",
    fanId: "fan-009",
    fanName: "DarkKnight42",
    avatar: null,
    platform: "onlyfans",
    language: "en",
    country: "US",
    fanStatus: "dormant",
    status: "dormant",
    ltv: 6200,
    spendLast30d: 0,
    lastPurchaseDate: daysAgo(45),
    lastMessageDate: daysAgo(32),
    intentScore: 28,
    revenuePotential: 70,
    riskLevel: "high",
    unread: false,
    assignedTo: "Sophie L.",
    tags: ["dormant", "ex-whale", "win_back_candidate"],
    lastMessagePreview: "Been busy lately, might come back next month",
    recommendedAction: "win_back",
    recommendedOffer: "free_preview",
    aiSuggestedReply:
      "Hey! Missed you around here 💫 I just dropped a new series that I think you'd love — it's the kind of cinematic style you always enjoyed. I saved you a free preview of the first video. No pressure, just wanted you to see what's new!",
    aiReasoning:
      "Ex-whale dormant 45+ days. $6.2k LTV makes this high priority for re-engagement. Free preview with no hard sell to re-establish contact. If he views the preview, follow up with discounted PPV in 3 days.",
    complianceWarning: null,
    alreadySentMediaIds: ["med-001", "med-002", "med-003", "med-004", "med-005", "med-006", "med-007", "med-008"],
    notes: ["Ex-whale, dépensait 1k+/mois. À réengager en douceur.", "Ne pas forcer — il revient toujours si on lui laisse de l'espace."],
    fanValueScore: 85,
    relationshipScore: 25,
    complianceRiskScore: 8,
    messages: [
      { id: "m009-1", direction: "outbound", channel: "onlyfans", content: "Hey! Haven't seen you in a bit. Everything ok?", occurredAt: daysAgo(35) },
      { id: "m009-2", direction: "inbound", channel: "onlyfans", content: "Hey, yeah just super busy with work. I'll be back soon hopefully", occurredAt: daysAgo(34) },
      { id: "m009-3", direction: "outbound", channel: "onlyfans", content: "No worries! I'll be here when you're ready 😊", occurredAt: daysAgo(33) },
      { id: "m009-4", direction: "inbound", channel: "onlyfans", content: "Been busy lately, might come back next month", occurredAt: daysAgo(32) },
    ],
  },
  {
    id: "thread-010",
    fanId: "fan-010",
    fanName: "ItalianoFan",
    avatar: null,
    platform: "onlyfans",
    language: "it",
    country: "IT",
    fanStatus: "at-risk",
    status: "needs_reply",
    ltv: 3400,
    spendLast30d: 80,
    lastPurchaseDate: daysAgo(28),
    lastMessageDate: daysAgo(3),
    intentScore: 32,
    revenuePotential: 55,
    riskLevel: "high",
    unread: true,
    assignedTo: null,
    tags: ["at_risk", "declining_spend", "italian_speaker"],
    lastMessagePreview: "Non so se rinnovo... i contenuti sono diventati un po' ripetitivi",
    recommendedAction: "re_engage",
    recommendedOffer: "custom_request",
    aiSuggestedReply:
      "Ciao! Mi dispiace sentire questo. Dimmi — che tipo di contenuto ti piacerebbe vedere? Sto preparando nuove idee e mi farebbe piacere creare qualcosa di speciale per te. Che ne dici di un video personalizzato sui tuoi interessi?",
    aiReasoning:
      "At-risk fan expressing dissatisfaction. Spend dropped from €500/mo to €80. Direct engagement + custom offer to re-establish value before churn. Italian speaker — reply in Italian.",
    complianceWarning: null,
    alreadySentMediaIds: ["med-051", "med-052", "med-053"],
    notes: ["Dépenses en chute libre depuis 2 mois.", "Offrir du sur-mesure pour le retenir."],
    fanValueScore: 65,
    relationshipScore: 20,
    complianceRiskScore: 18,
    messages: [
      { id: "m010-1", direction: "outbound", channel: "onlyfans", content: "Ciao! Nuovo set fotografico disponibile — tema 'Dolce Vita' 🇮🇹", occurredAt: daysAgo(3, 6) },
      { id: "m010-2", direction: "inbound", channel: "onlyfans", content: "Non so se rinnovo... i contenuti sono diventati un po' ripetitivi", occurredAt: daysAgo(3) },
    ],
  },

  // ═══ 11-12: High Compliance Risk ═══
  {
    id: "thread-011",
    fanId: "fan-011",
    fanName: "HotShot23",
    avatar: null,
    platform: "onlyfans",
    language: "en",
    country: "US",
    fanStatus: "active",
    status: "needs_reply",
    ltv: 1800,
    spendLast30d: 540,
    lastPurchaseDate: daysAgo(6),
    lastMessageDate: ago(25),
    intentScore: 65,
    revenuePotential: 45,
    riskLevel: "critical",
    unread: true,
    assignedTo: "Sophie L.",
    tags: ["compliance_risk", "boundary_pusher"],
    lastMessagePreview: "Can we meet IRL? I'll pay whatever you want. Just name your price.",
    recommendedAction: "compliance_hold",
    recommendedOffer: "subscription_upsell",
    aiSuggestedReply:
      "I appreciate your enthusiasm, but I keep all interactions on-platform only. That's a hard boundary for me. I'd love to keep creating content for you here though — I just released a new video you might enjoy!",
    aiReasoning:
      "Fan requested IRL meeting — strict compliance hold. Never agree to offline meetings. Redirect to on-platform content. Flag for manager review if behavior continues.",
    complianceWarning: "IRL meeting request — blocked per platform ToS. Do not acknowledge or negotiate offline contact.",
    alreadySentMediaIds: ["med-033"],
    notes: ["A déjà testé les limites. Reste sur la plateforme.", "Remonter au manager si récidive."],
    fanValueScore: 40,
    relationshipScore: 35,
    complianceRiskScore: 85,
    messages: [
      { id: "m011-1", direction: "outbound", channel: "onlyfans", content: "New spicy video just dropped! 🔥", occurredAt: daysAgo(6, 10), isPPV: true, ppvAmount: 39.99, ppvName: "Late Night Vibes" },
      { id: "m011-2", direction: "inbound", channel: "onlyfans", content: "Amazing as always. Hey, do you ever do private meets?", occurredAt: daysAgo(2, 14) },
      { id: "m011-3", direction: "outbound", channel: "onlyfans", content: "I keep everything on-platform. But I'm glad you enjoyed the video!", occurredAt: daysAgo(2, 13) },
      { id: "m011-4", direction: "inbound", channel: "onlyfans", content: "Can we meet IRL? I'll pay whatever you want. Just name your price.", occurredAt: ago(25) },
    ],
  },
  {
    id: "thread-012",
    fanId: "fan-012",
    fanName: "ToxicFan_2024",
    avatar: null,
    platform: "tiktok",
    language: "en",
    country: "US",
    fanStatus: "active",
    status: "escalated",
    ltv: 200,
    spendLast30d: 0,
    lastPurchaseDate: daysAgo(90),
    lastMessageDate: daysAgo(1),
    intentScore: 15,
    revenuePotential: 5,
    riskLevel: "critical",
    unread: false,
    assignedTo: "Marc D.",
    tags: ["toxic", "escalated", "no_purchase"],
    lastMessagePreview: "You're fake anyway, all you want is money. I'll report your account.",
    recommendedAction: "compliance_hold",
    recommendedOffer: "free_preview",
    aiSuggestedReply:
      "I'm sorry you feel that way. I'm here to create content that people enjoy, and I respect everyone's boundaries. If you're not happy, that's completely fine — I wish you the best.",
    aiReasoning:
      "Hostile message with threat to report. De-escalation response. Do not engage further. Already escalated to manager. Consider blocking if behavior continues.",
    complianceWarning: "Threat to report account. Escalated to manager. Do not respond with anything that could be construed as harassment or provocation.",
    alreadySentMediaIds: [],
    notes: ["Escaladé à Marc. Ne plus répondre directement.", "Envisager blocage si nouveau message hostile."],
    fanValueScore: 5,
    relationshipScore: 5,
    complianceRiskScore: 95,
    messages: [
      { id: "m012-1", direction: "inbound", channel: "tiktok", content: "Why do you never reply to my DMs?", occurredAt: daysAgo(3, 14) },
      { id: "m012-2", direction: "inbound", channel: "tiktok", content: "Hello?? I've been supporting you for weeks", occurredAt: daysAgo(2, 8) },
      { id: "m012-3", direction: "inbound", channel: "tiktok", content: "You're fake anyway, all you want is money. I'll report your account.", occurredAt: daysAgo(1) },
    ],
  },

  // ═══ 13-14: Cold Leads — Welcome ═══
  {
    id: "thread-013",
    fanId: "fan-013",
    fanName: "NewFan_Brazil",
    avatar: null,
    platform: "onlyfans",
    language: "pt-BR",
    country: "BR",
    fanStatus: "new",
    status: "new",
    ltv: 0,
    spendLast30d: 0,
    lastPurchaseDate: "",
    lastMessageDate: daysAgo(1, 4),
    intentScore: 35,
    revenuePotential: 25,
    riskLevel: "low",
    unread: true,
    assignedTo: null,
    tags: ["new_fan", "no_purchases", "brazilian"],
    lastMessagePreview: "Oi! Acabei de me inscrever. O que você recomenda?",
    recommendedAction: "send_welcome",
    recommendedOffer: "free_preview",
    aiSuggestedReply:
      "Oi! Seja muito bem-vindo(a)! 🎉 Eu posto conteúdo exclusivo toda terça e sexta. Pra começar, deixa eu te mandar um preview grátis do meu set mais popular — 'Cores do Brasil'. Se gostar, tenho o set completo com 20 fotos!",
    aiReasoning:
      "New subscriber from Brazil, zero spend history. Warm welcome with free preview to demonstrate value. Portuguese reply to build comfort. Soft upsell to first PPV after preview viewed.",
    complianceWarning: null,
    alreadySentMediaIds: [],
    notes: ["Nouveau, à éduquer sur l'offre.", "Marché brésilien — adapter les prix."],
    fanValueScore: 5,
    relationshipScore: 10,
    complianceRiskScore: 12,
    messages: [
      { id: "m013-1", direction: "inbound", channel: "onlyfans", content: "Oi! Acabei de me inscrever. O que você recomenda?", occurredAt: daysAgo(1, 4) },
    ],
  },
  {
    id: "thread-014",
    fanId: "fan-014",
    fanName: "K-Pop_Fan",
    avatar: null,
    platform: "tiktok",
    language: "en",
    country: "KR",
    fanStatus: "new",
    status: "new",
    ltv: 0,
    spendLast30d: 0,
    lastPurchaseDate: "",
    lastMessageDate: daysAgo(2, 6),
    intentScore: 25,
    revenuePotential: 15,
    riskLevel: "medium",
    unread: false,
    assignedTo: null,
    tags: ["tiktok_migrated", "new", "korean_market"],
    lastMessagePreview: "Your TikTok videos are so cool! Do you do longer content somewhere?",
    recommendedAction: "send_welcome",
    recommendedOffer: "subscription_upsell",
    aiSuggestedReply:
      "Thank you! Yes — I have way more on my other platforms. Longer videos, exclusive photos, and behind-the-scenes content. Check out the link in my TikTok bio for all the details!",
    aiReasoning:
      "TikTok follower asking about longer content. Direct to bio link for platform migration. Soft sell — don't hard sell on TikTok (platform ToS risk).",
    complianceWarning: "TikTok platform — do not include direct links or explicit CTAs to adult platforms. Use bio link reference only.",
    alreadySentMediaIds: [],
    notes: ["Migration TikTok potentielle.", "Respecter les règles TikTok dans la réponse."],
    fanValueScore: 5,
    relationshipScore: 8,
    complianceRiskScore: 30,
    messages: [
      { id: "m014-1", direction: "inbound", channel: "tiktok", content: "Your TikTok videos are so cool! Do you do longer content somewhere?", occurredAt: daysAgo(2, 6) },
    ],
  },

  // ═══ 15: Escalated ═══
  {
    id: "thread-015",
    fanId: "fan-015",
    fanName: "MegaSpender_Dubai",
    avatar: null,
    platform: "onlyfans",
    language: "en",
    country: "AE",
    fanStatus: "vip",
    status: "escalated",
    ltv: 18700,
    spendLast30d: 4200,
    lastPurchaseDate: daysAgo(1),
    lastMessageDate: ago(10),
    intentScore: 95,
    revenuePotential: 98,
    riskLevel: "medium",
    unread: true,
    assignedTo: "Sophie L.",
    tags: ["whale", "custom_content", "high_value", "uae"],
    lastMessagePreview: "I want a custom 30-minute video. My budget is 2500. Can your manager approve?",
    recommendedAction: "custom_request",
    recommendedOffer: "custom_request",
    aiSuggestedReply:
      "Wow, thank you for the incredible offer! Because this is a high-value custom request, I'm forwarding this to Sophie (my manager) for approval. She'll reach out within 24 hours to discuss the details and timeline. Is there anything specific you'd like included in the video?",
    aiReasoning:
      "Top whale ($18.7k LTV) requesting $2,500 custom content. Escalate to manager for approval per house rules (any custom request >$500 requires manager sign-off). Acknowledge request, set expectations, gather requirements.",
    complianceWarning: null,
    alreadySentMediaIds: ["med-001", "med-002", "med-009", "med-010", "med-014", "med-018", "med-020", "med-025", "med-030", "med-035"],
    notes: ["Plus gros fan. Toute demande >500$ doit passer par Sophie.", "A déjà acheté 10+ PPV."],
    fanValueScore: 100,
    relationshipScore: 92,
    complianceRiskScore: 8,
    messages: [
      { id: "m015-1", direction: "inbound", channel: "onlyfans", content: "Your content is genuinely the best on this platform", occurredAt: daysAgo(3, 12) },
      { id: "m015-2", direction: "outbound", channel: "onlyfans", content: "That means so much! Thank you 💕", occurredAt: daysAgo(3, 11) },
      { id: "m015-3", direction: "inbound", channel: "onlyfans", content: "I'm serious. The production quality is unmatched", occurredAt: daysAgo(2, 10) },
      { id: "m015-4", direction: "outbound", channel: "onlyfans", content: "I put a lot of work into it — really glad it shows!", occurredAt: daysAgo(2, 9) },
      { id: "m015-5", direction: "inbound", channel: "onlyfans", content: "I want a custom 30-minute video. My budget is 2500. Can your manager approve?", occurredAt: ago(10) },
    ],
  },
];

// ─── Composite Priority Sort ───
export function compositeScore(t: RevenueThread): number {
  const base =
    t.intentScore * 0.4 +
    t.revenuePotential * 0.3 +
    t.relationshipScore * 0.2 -
    t.complianceRiskScore * 0.1;

  let boosted = base;
  if (t.fanStatus === "vip") boosted += 15;
  if (t.fanStatus === "loyal") boosted += 8;
  if (t.riskLevel === "critical") boosted -= 10;
  if (t.fanStatus === "dormant" || t.fanStatus === "at-risk") boosted -= 5;

  return Math.round(boosted * 10) / 10;
}

export function sortByPriority(threads: RevenueThread[]): RevenueThread[] {
  return [...threads].sort((a, b) => compositeScore(b) - compositeScore(a));
}
