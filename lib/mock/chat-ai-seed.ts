// ─── Seed Demo Data, Conversations, Messages, PPV, Vault, Followups, Playbooks, QA, Pricing, Audit ──
// Realistic, demo-ready, multilingual

import type {
  Conversation, Message, AIDraft, PPVRecommendation, VaultAsset,
  FollowUp, Playbook, QAItem, AuditLogEntry, ChatAIPlan,
} from "@/lib/types/chat-ai";
import { demoFans } from "./chat-ai-fans";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000";
const now = new Date().toISOString();

// ─── 25 Conversations ────────────────────────────────────

export const demoConversations: Conversation[] = demoFans
  .filter(f => f.status !== "do_not_contact")
  .slice(0, 25)
  .map((f, i) => ({
    id: `conv-${i + 1}`,
    userId: DEMO_USER_ID,
    fanId: f.id,
    platform: f.platform,
    priorityScore: f.status === "whale" ? 95 :
      f.status === "vip" ? 80 :
      f.status === "churn_risk" ? 85 :
      f.status === "dormant" ? 60 :
      f.status === "new" ? 40 : 50,
    lastMessagePreview: f.status === "whale" ? "Merci pour le contenu d'hier !" :
      f.status === "churn_risk" ? "Je ne suis pas sûr de continuer..." :
      "Salut, comment ça va ?",
    unread: f.status === "whale" ? 2 : f.status === "vip" ? 1 : 0,
    recommendedAction: f.status === "dormant" ? "reactivate" :
      f.status === "churn_risk" ? "retention_offer" :
      f.status === "whale" ? "ppv_upsell" : "engage",
    recommendedPPVId: f.status === "whale" || f.status === "vip" ? "ppv-recommendation-1" : null,
    vaultWarnings: [],
    complianceFlags: f.riskFlags?.includes("vulnerable_fan") ? ["blocked_commercial"] : [],
    status: "open",
    createdAt: now,
    updatedAt: now,
  }));

// ─── Messages (sample for first 5 conversations) ─────────

export const demoMessages: Message[] = [];
const sampleConvs = demoConversations.slice(0, 5);
const messagesTemplates: { direction: "in" | "out"; texts: string[] }[] = [
  { direction: "in", texts: ["Salut ! J'adore ton contenu", "Tu proposes quoi comme exclusivité ?", "Merci pour la réponse"] },
  { direction: "out", texts: ["Merci beaucoup ! Ça me fait plaisir", "J'ai un contenu exclusif qui sort cette semaine", "Tu veux un aperçu ?"] },
  { direction: "in", texts: ["Oui je suis intéressé !", "C'est quel prix ?", "OK je prends"] },
];

let msgSeq = 0;
for (const conv of sampleConvs) {
  for (let i = 0; i < 8; i++) {
    const tmpl = messagesTemplates[i % messagesTemplates.length];
    const text = tmpl.texts[i % tmpl.texts.length];
    demoMessages.push({
      id: `msg-${++msgSeq}`,
      conversationId: conv.id,
      direction: tmpl.direction,
      text,
      source: tmpl.direction === "in" ? "fan" : "human",
      approvedBy: null,
      aiMeta: null,
      seq: i + 1,
      createdAt: new Date(Date.now() - (8 - i) * 3600000).toISOString(),
    });
  }
}

// ─── 20 Vault Assets ─────────────────────────────────────

export const demoVaultAssets: VaultAsset[] = [
  { id: "vault-1", userId: DEMO_USER_ID, title: "Set Photo Exclusif Été 2026", type: "photo", sensitivity: "standard", priceHistory: [{ date: "2026-06-01", price: 19.99, soldTo: 12 }, { date: "2026-05-01", price: 24.99, soldTo: 8 }], soldToFanIds: [], metadata: {}, createdAt: now, updatedAt: now },
  { id: "vault-2", userId: DEMO_USER_ID, title: "Vidéo Personnalisée Bonjour", type: "video", sensitivity: "standard", priceHistory: [{ date: "2026-06-05", price: 29.99, soldTo: 6 }], soldToFanIds: [], metadata: {}, createdAt: now, updatedAt: now },
  { id: "vault-3", userId: DEMO_USER_ID, title: "Bundle VIP Mensuel Juin", type: "bundle", sensitivity: "standard", priceHistory: [{ date: "2026-06-01", price: 49.99, soldTo: 15 }], soldToFanIds: [], metadata: {}, createdAt: now, updatedAt: now },
  { id: "vault-4", userId: DEMO_USER_ID, title: "Audio Exclusif Bonne Nuit", type: "audio", sensitivity: "standard", priceHistory: [{ date: "2026-06-10", price: 14.99, soldTo: 4 }], soldToFanIds: [], metadata: {}, createdAt: now, updatedAt: now },
  { id: "vault-5", userId: DEMO_USER_ID, title: "Contenu Sensible, Sur Demande", type: "photo", sensitivity: "sensitive", priceHistory: [{ date: "2026-06-08", price: 39.99, soldTo: 3 }], soldToFanIds: ["fan-alex"], metadata: { requiresConsent: true }, createdAt: now, updatedAt: now },
  { id: "vault-6", userId: DEMO_USER_ID, title: "Set Photo Fitness", type: "photo", sensitivity: "standard", priceHistory: [{ date: "2026-05-20", price: 17.99, soldTo: 9 }], soldToFanIds: [], metadata: {}, createdAt: now, updatedAt: now },
  { id: "vault-7", userId: DEMO_USER_ID, title: "Vidéo Behind The Scenes", type: "video", sensitivity: "standard", priceHistory: [{ date: "2026-06-03", price: 22.99, soldTo: 7 }], soldToFanIds: [], metadata: {}, createdAt: now, updatedAt: now },
  { id: "vault-8", userId: DEMO_USER_ID, title: "Photo Exclusive Anniversaire", type: "photo", sensitivity: "standard", priceHistory: [{ date: "2026-06-01", price: 15.99, soldTo: 5 }], soldToFanIds: [], metadata: {}, createdAt: now, updatedAt: now },
  { id: "vault-9", userId: DEMO_USER_ID, title: "Pack 3 Vidéos Premium", type: "bundle", sensitivity: "standard", priceHistory: [{ date: "2026-05-15", price: 59.99, soldTo: 10 }], soldToFanIds: [], metadata: {}, createdAt: now, updatedAt: now },
  { id: "vault-10", userId: DEMO_USER_ID, title: "Audio ASMR Personnalisé", type: "audio", sensitivity: "standard", priceHistory: [{ date: "2026-06-07", price: 12.99, soldTo: 3 }], soldToFanIds: [], metadata: {}, createdAt: now, updatedAt: now },
  { id: "vault-11", userId: DEMO_USER_ID, title: "Photo Cosplay Mai", type: "photo", sensitivity: "standard", priceHistory: [{ date: "2026-05-28", price: 21.99, soldTo: 6 }], soldToFanIds: [], metadata: {}, createdAt: now, updatedAt: now },
  { id: "vault-12", userId: DEMO_USER_ID, title: "Vidéo Q&A Exclusive", type: "video", sensitivity: "standard", priceHistory: [{ date: "2026-05-25", price: 18.99, soldTo: 8 }], soldToFanIds: [], metadata: {}, createdAt: now, updatedAt: now },
  { id: "vault-13", userId: DEMO_USER_ID, title: "Set Photo Plage", type: "photo", sensitivity: "standard", priceHistory: [{ date: "2026-06-02", price: 25.99, soldTo: 11 }], soldToFanIds: [], metadata: {}, createdAt: now, updatedAt: now },
  { id: "vault-14", userId: DEMO_USER_ID, title: "Bundle Nouvel An", type: "bundle", sensitivity: "standard", priceHistory: [{ date: "2026-01-01", price: 79.99, soldTo: 20 }], soldToFanIds: [], metadata: {}, createdAt: now, updatedAt: now },
  { id: "vault-15", userId: DEMO_USER_ID, title: "Photo Exclusive N&B", type: "photo", sensitivity: "standard", priceHistory: [{ date: "2026-04-15", price: 16.99, soldTo: 4 }], soldToFanIds: [], metadata: {}, createdAt: now, updatedAt: now },
  { id: "vault-16", userId: DEMO_USER_ID, title: "Vidéo Tutoriel Makeup", type: "video", sensitivity: "standard", priceHistory: [{ date: "2026-05-10", price: 27.99, soldTo: 5 }], soldToFanIds: [], metadata: {}, createdAt: now, updatedAt: now },
  { id: "vault-17", userId: DEMO_USER_ID, title: "Contenu Ultra Premium", type: "bundle", sensitivity: "sensitive", priceHistory: [{ date: "2026-06-01", price: 99.99, soldTo: 2 }], soldToFanIds: ["fan-alex", "fan-james"], metadata: { requiresConsent: true }, createdAt: now, updatedAt: now },
  { id: "vault-18", userId: DEMO_USER_ID, title: "Photo Sportwear", type: "photo", sensitivity: "standard", priceHistory: [{ date: "2026-06-04", price: 18.99, soldTo: 7 }], soldToFanIds: [], metadata: {}, createdAt: now, updatedAt: now },
  { id: "vault-19", userId: DEMO_USER_ID, title: "Vidéo Voyage Bali", type: "video", sensitivity: "standard", priceHistory: [{ date: "2026-05-30", price: 23.99, soldTo: 9 }], soldToFanIds: [], metadata: {}, createdAt: now, updatedAt: now },
  { id: "vault-20", userId: DEMO_USER_ID, title: "Audio Message Personnalisé", type: "audio", sensitivity: "standard", priceHistory: [{ date: "2026-06-09", price: 9.99, soldTo: 14 }], soldToFanIds: [], metadata: {}, createdAt: now, updatedAt: now },
];

// ─── 12 PPV Recommendations ──────────────────────────────

export const demoPPVRecommendations: PPVRecommendation[] = [
  { id: "ppv-1", userId: DEMO_USER_ID, vaultAssetId: "vault-1", targetFanIds: ["fan-alex"], segmentId: null, recommendedPrice: 24.99, minPrice: 14.99, maxPrice: 34.99, justification: "Fan VIP, a déjà acheté des sets photo à ce prix.", fatigueRisk: "Faible, dernier achat il y a 10 jours.", alreadySoldTo: [], conversionEstimate: "Estimation indicative non garantie : 70-80%", status: "draft", createdAt: now },
  { id: "ppv-2", userId: DEMO_USER_ID, vaultAssetId: "vault-3", targetFanIds: ["fan-james"], segmentId: null, recommendedPrice: 49.99, minPrice: 39.99, maxPrice: 59.99, justification: "Whale avec historique d'achats bundle. Prix standard.", fatigueRisk: "Faible.", alreadySoldTo: [], conversionEstimate: "Estimation indicative non garantie : 60-70%", status: "draft", createdAt: now },
  { id: "ppv-3", userId: DEMO_USER_ID, vaultAssetId: "vault-4", targetFanIds: [], segmentId: "segment-active", recommendedPrice: 14.99, minPrice: 9.99, maxPrice: 19.99, justification: "Prix attractif pour fans actifs, audio accessible.", fatigueRisk: "Moyen, déjà proposé à certains.", alreadySoldTo: ["fan-chris"], conversionEstimate: "Estimation indicative non garantie : 40-50%", status: "draft", createdAt: now },
  { id: "ppv-4", userId: DEMO_USER_ID, vaultAssetId: "vault-5", targetFanIds: ["fan-alex"], segmentId: null, recommendedPrice: 39.99, minPrice: 29.99, maxPrice: 49.99, justification: "Contenu sensible, prix premium. Consentement requis.", fatigueRisk: "Faible.", alreadySoldTo: [], conversionEstimate: "Estimation indicative non garantie : 50-60%", status: "draft", createdAt: now },
  { id: "ppv-5", userId: DEMO_USER_ID, vaultAssetId: "vault-2", targetFanIds: ["fan-rico"], segmentId: null, recommendedPrice: 29.99, minPrice: 19.99, maxPrice: 35.99, justification: "Vidéo personnalisée, fan brésilien actif.", fatigueRisk: "Faible.", alreadySoldTo: [], conversionEstimate: "Estimation indicative non garantie : 65-75%", status: "draft", createdAt: now },
  { id: "ppv-6", userId: DEMO_USER_ID, vaultAssetId: "vault-9", targetFanIds: [], segmentId: "segment-vip", recommendedPrice: 59.99, minPrice: 49.99, maxPrice: 69.99, justification: "Bundle premium pour VIP, bonne valeur perçue.", fatigueRisk: "Faible.", alreadySoldTo: [], conversionEstimate: "Estimation indicative non garantie : 55-65%", status: "draft", createdAt: now },
  { id: "ppv-7", userId: DEMO_USER_ID, vaultAssetId: "vault-13", targetFanIds: ["fan-emma"], segmentId: null, recommendedPrice: 25.99, minPrice: 19.99, maxPrice: 29.99, justification: "Photo plage, saisonnier, bonne saison.", fatigueRisk: "Faible, saisonnier.", alreadySoldTo: [], conversionEstimate: "Estimation indicative non garantie : 60-70%", status: "draft", createdAt: now },
  { id: "ppv-8", userId: DEMO_USER_ID, vaultAssetId: "vault-7", targetFanIds: [], segmentId: "segment-all", recommendedPrice: 19.99, minPrice: 14.99, maxPrice: 24.99, justification: "Behind the scenes, prix accessible pour tous.", fatigueRisk: "Élevé, déjà envoyé à plusieurs.", alreadySoldTo: ["fan-chris", "fan-marco", "fan-sofia"], conversionEstimate: "Estimation indicative non garantie : 30-40%", status: "draft", createdAt: now },
  { id: "ppv-9", userId: DEMO_USER_ID, vaultAssetId: "vault-17", targetFanIds: ["fan-alex"], segmentId: null, recommendedPrice: 99.99, minPrice: 79.99, maxPrice: 129.99, justification: "Ultra premium, pour top whale uniquement.", fatigueRisk: "Très faible.", alreadySoldTo: ["fan-alex", "fan-james"], conversionEstimate: "Estimation indicative non garantie : 30-40% (niche)", status: "draft", createdAt: now },
  { id: "ppv-10", userId: DEMO_USER_ID, vaultAssetId: "vault-20", targetFanIds: [], segmentId: "segment-new", recommendedPrice: 9.99, minPrice: 5.99, maxPrice: 14.99, justification: "Prix d'entrée pour nouveaux fans, conversion facile.", fatigueRisk: "Faible.", alreadySoldTo: [], conversionEstimate: "Estimation indicative non garantie : 50-60%", status: "draft", createdAt: now },
  { id: "ppv-11", userId: DEMO_USER_ID, vaultAssetId: "vault-6", targetFanIds: ["fan-tommy"], segmentId: null, recommendedPrice: 17.99, minPrice: 12.99, maxPrice: 22.99, justification: "Set fitness, fan actif intéressé par le sport.", fatigueRisk: "Faible.", alreadySoldTo: [], conversionEstimate: "Estimation indicative non garantie : 55-65%", status: "draft", createdAt: now },
  { id: "ppv-12", userId: DEMO_USER_ID, vaultAssetId: "vault-19", targetFanIds: [], segmentId: "segment-active", recommendedPrice: 23.99, minPrice: 18.99, maxPrice: 28.99, justification: "Vidéo voyage, storytelling, bonne saison été.", fatigueRisk: "Faible.", alreadySoldTo: [], conversionEstimate: "Estimation indicative non garantie : 45-55%", status: "draft", createdAt: now },
];

// ─── 10 Follow-ups ───────────────────────────────────────

export const demoFollowUps: FollowUp[] = [
  { id: "fu-1", userId: DEMO_USER_ID, type: "welcome", segmentId: "segment-new", objective: "Accueillir les nouveaux fans avec un message chaleureux", delayHours: 1, draftText: "Bienvenue dans mon univers ! Je suis ravie de t'avoir ici. N'hésite pas si tu as des questions.", riskLevel: "low", status: "draft", humanApprovalRequired: true, createdAt: now, updatedAt: now },
  { id: "fu-2", userId: DEMO_USER_ID, type: "vip_checkin", segmentId: "segment-vip", objective: "Check-in hebdomadaire pour les VIP", delayHours: 168, draftText: "Coucou ! Juste un petit mot pour prendre de tes nouvelles. Ta présence compte beaucoup pour moi.", riskLevel: "low", status: "approved", humanApprovalRequired: true, createdAt: now, updatedAt: now },
  { id: "fu-3", userId: DEMO_USER_ID, type: "inactive", segmentId: "segment-dormant", objective: "Relancer les fans inactifs depuis 2 semaines", delayHours: 336, draftText: "Hey ! Ça fait un moment, tu me manques. J'ai plein de nouveaux contenus à te montrer.", riskLevel: "low", status: "draft", humanApprovalRequired: true, createdAt: now, updatedAt: now },
  { id: "fu-4", userId: DEMO_USER_ID, type: "ppv_interest", segmentId: "segment-whale", objective: "Proposer un PPV aux whales", delayHours: 72, draftText: "J'ai préparé quelque chose de vraiment spécial pour toi. Intéressé ?", riskLevel: "medium", status: "pending_approval", humanApprovalRequired: true, createdAt: now, updatedAt: now },
  { id: "fu-5", userId: DEMO_USER_ID, type: "renewal", segmentId: "segment-active", objective: "Rappel de renouvellement d'abonnement", delayHours: 48, draftText: "Ton abonnement arrive bientôt à expiration. J'aimerais vraiment que tu restes.", riskLevel: "low", status: "draft", humanApprovalRequired: true, createdAt: now, updatedAt: now },
  { id: "fu-6", userId: DEMO_USER_ID, type: "thank_you", segmentId: "segment-all", objective: "Remercier les fans après un achat", delayHours: 2, draftText: "Merci du fond du cœur pour ton achat. Ça me permet de continuer à créer.", riskLevel: "low", status: "approved", humanApprovalRequired: true, createdAt: now, updatedAt: now },
  { id: "fu-7", userId: DEMO_USER_ID, type: "soft_upsell", segmentId: "segment-vip", objective: "Upsell doux vers le contenu premium", delayHours: 96, draftText: "Tu as aimé le dernier contenu ? J'ai une version encore plus exclusive.", riskLevel: "medium", status: "draft", humanApprovalRequired: true, createdAt: now, updatedAt: now },
  { id: "fu-8", userId: DEMO_USER_ID, type: "discovery", segmentId: "segment-new", objective: "Découvrir les préférences du fan", delayHours: 24, draftText: "Qu'est-ce que tu préfères dans mon contenu ? Photos, vidéos, messages perso ?", riskLevel: "low", status: "draft", humanApprovalRequired: true, createdAt: now, updatedAt: now },
  { id: "fu-9", userId: DEMO_USER_ID, type: "reactivation", segmentId: "segment-dormant", objective: "Offre de réactivation avec réduction", delayHours: 720, draftText: "Tu me manques ! Première semaine à -30% si tu reviens.", riskLevel: "medium", status: "draft", humanApprovalRequired: true, createdAt: now, updatedAt: now },
  { id: "fu-10", userId: DEMO_USER_ID, type: "reactivation", segmentId: "segment-churn", objective: "Dernière tentative de rétention", delayHours: 504, draftText: "Je vois que tu es moins actif. Dis-moi ce que je peux améliorer.", riskLevel: "medium", status: "draft", humanApprovalRequired: true, createdAt: now, updatedAt: now },
];

// ─── 3 Playbooks ─────────────────────────────────────────

export const demoPlaybooks: Playbook[] = [
  {
    id: "playbook-solo", userId: DEMO_USER_ID, name: "Solo Standard",
    globalTone: "Chaleureux et complice", allowedWords: ["merci", "exclusif", "VIP", "spécial", "surprise", "cœur"],
    forbiddenWords: ["explicite", "nu", "tarif", "négocie", "garanti"],
    emojiPolicy: "moderate", signaturePhrases: ["À très vite 💫", "Ravie de te compter parmi nous 🌸"],
    boundaries: ["Pas de contenu explicite", "Pas de promesse de rencontre", "Pas d'échange perso hors plateforme"],
    forbiddenTopics: ["politique", "religion", "rencontre physique", "échange hors plateforme"],
    boldnessLevel: 3, ppvMinPrice: 5, ppvMaxPrice: 100,
    vipRules: { discountRate: 0, priorityResponse: true, exclusiveContent: true },
    dormantRules: { maxRecontactAttempts: 3, cooldownDays: 14 },
    customRequestRules: { maxPrice: 200, requiresPrepayment: true },
    escalationRules: { afterNoResponse: "pause", autoPauseHours: 72 },
    noContactRules: { blockAll: true, logReason: true },
    isActive: true, createdAt: now, updatedAt: now,
  },
  {
    id: "playbook-vip", userId: DEMO_USER_ID, name: "VIP Premium",
    globalTone: "Premium et exclusif", allowedWords: ["privilège", "avant-première", "sur-mesure", "élite", "confidentiel"],
    forbiddenWords: ["promo", "réduction", "gratuit", "pas cher", "bradé"],
    emojiPolicy: "premium", signaturePhrases: ["Avec toute mon attention ✨", "Exclusivement pour vous 💎"],
    boundaries: ["Pas de contenu hors limites créateur", "Prix minimum 15€", "Pas de rabais"],
    forbiddenTopics: ["négociation de prix", "contenu gratuit"],
    boldnessLevel: 4, ppvMinPrice: 15, ppvMaxPrice: 200,
    vipRules: { discountRate: 5, priorityResponse: true, exclusiveContent: true, personalVideos: true },
    dormantRules: { maxRecontactAttempts: 2, cooldownDays: 21 },
    customRequestRules: { maxPrice: 500, requiresPrepayment: true, requiresQuote: true },
    escalationRules: { afterNoResponse: "pause", autoPauseHours: 48 },
    noContactRules: { blockAll: true, logReason: true },
    isActive: false, createdAt: now, updatedAt: now,
  },
  {
    id: "playbook-agency", userId: DEMO_USER_ID, name: "Agency Safe",
    globalTone: "Professionnel et engageant",
    allowedWords: ["apprécie", "qualité", "professionnel", "sur-mesure", "attentionné"],
    forbiddenWords: ["explicite", "garanti", "promis", "toujours", "argent facile"],
    emojiPolicy: "minimal",
    signaturePhrases: ["L'équipe vous remercie", "À votre disposition"],
    boundaries: ["Tout message relu par un superviseur", "Conformité stricte CGU plateforme", "Aucune conversation hors script"],
    forbiddenTopics: ["rencontre", "échange perso", "promesses de revenus", "conseil financier"],
    boldnessLevel: 2, ppvMinPrice: 10, ppvMaxPrice: 150,
    vipRules: { discountRate: 0, priorityResponse: true, exclusiveContent: false },
    dormantRules: { maxRecontactAttempts: 3, cooldownDays: 30 },
    customRequestRules: { maxPrice: 300, requiresPrepayment: true },
    escalationRules: { afterNoResponse: "escalate_to_supervisor", autoPauseHours: 24 },
    noContactRules: { blockAll: true, logReason: true },
    isActive: false, createdAt: now, updatedAt: now,
  },
];

// ─── 9 QA Items ──────────────────────────────────────────

export const demoQAItems: QAItem[] = [
  { id: "qa-1", userId: DEMO_USER_ID, messageId: "msg-3", draftId: null, reason: "risky_message", severity: 3, status: "pending", reviewerId: null, notes: "Message au fan churn_risk, ton potentiellement trop commercial.", createdAt: now, updatedAt: now },
  { id: "qa-2", userId: DEMO_USER_ID, messageId: "msg-7", draftId: null, reason: "off_tone", severity: 2, status: "approved", reviewerId: null, notes: "Vérifié, ton ok après relecture.", createdAt: now, updatedAt: now },
  { id: "qa-3", userId: DEMO_USER_ID, messageId: null, draftId: "draft-1", reason: "excessive_pressure", severity: 4, status: "pending", reviewerId: null, notes: "Draft contient 'offre limitée' → peut être perçu comme pression.", createdAt: now, updatedAt: now },
  { id: "qa-4", userId: DEMO_USER_ID, messageId: "msg-12", draftId: null, reason: "duplicate_content", severity: 2, status: "false_positive", reviewerId: null, notes: "Similaire mais contexte différent, faux positif.", createdAt: now, updatedAt: now },
  { id: "qa-5", userId: DEMO_USER_ID, messageId: null, draftId: "draft-3", reason: "vulnerable_fan", severity: 5, status: "blocked", reviewerId: null, notes: "Fan détecté comme vulnérable, blocage automatique des ventes.", createdAt: now, updatedAt: now },
  { id: "qa-6", userId: DEMO_USER_ID, messageId: "msg-18", draftId: null, reason: "missing_disclosure", severity: 3, status: "revised", reviewerId: null, notes: "Ajout du disclosure requis dans le message.", createdAt: now, updatedAt: now },
  { id: "qa-7", userId: DEMO_USER_ID, messageId: null, draftId: "draft-5", reason: "unauthorized_promise", severity: 5, status: "blocked", reviewerId: null, notes: "Draft promet 'contenu que personne d'autre n'aura', bloqué.", createdAt: now, updatedAt: now },
  { id: "qa-8", userId: DEMO_USER_ID, messageId: "msg-22", draftId: null, reason: "inconsistent_price", severity: 3, status: "escalated", reviewerId: null, notes: "Prix PPV proposé 49€ alors que limite playbook = 100€ → ok mais signalé.", createdAt: now, updatedAt: now },
  { id: "qa-9", userId: DEMO_USER_ID, messageId: null, draftId: "draft-8", reason: "off_tone", severity: 2, status: "pending", reviewerId: null, notes: "Ton trop formel pour le playbook Solo Standard chaleureux.", createdAt: now, updatedAt: now },
];

// ─── 4 Pricing Plans ─────────────────────────────────────

export const demoPricingPlans: ChatAIPlan[] = [
  {
    id: "starter", nameKey: "chatAI.plans.starter.name", price: 79, currency: "EUR", commission: "0%",
    features: ["Revenue Inbox (20 conversations)", "Fan Brain (20 fans)", "AI Draft Composer (Flash)", "Tone Guard basique", "1 playbook"],
    limits: { maxFans: 20, maxConversations: 20, maxDraftsPerDay: 20, maxPPVRecommendations: 5, maxChatters: 1, includesVault: false, includesPlaybooks: true, includesQA: false, includesCompliance: false },
  },
  {
    id: "growth", nameKey: "chatAI.plans.growth.name", price: 149, currency: "EUR", commission: "5%",
    features: ["Revenue Inbox illimité", "Fan Brain (100 fans)", "AI Draft Composer (Flash + Pro)", "PPV Sales Copilot", "Smart Follow-ups", "Content Vault Check", "Tone Guard + Boundary Guard", "3 playbooks"],
    limits: { maxFans: 100, maxConversations: 500, maxDraftsPerDay: 100, maxPPVRecommendations: 20, maxChatters: 2, includesVault: true, includesPlaybooks: true, includesQA: true, includesCompliance: true },
  },
  {
    id: "pro_agency", nameKey: "chatAI.plans.pro_agency.name", price: 299, currency: "EUR", commission: "5-8%",
    features: ["Tout Growth +", "Fan Brain (500 fans)", "Chatter Assignment (5 chatters)", "QA Review complet", "Compliance Center", "Revenue Attribution", "Audit logs avancés", "Playbooks illimités"],
    limits: { maxFans: 500, maxConversations: 2000, maxDraftsPerDay: 500, maxPPVRecommendations: 50, maxChatters: 5, includesVault: true, includesPlaybooks: true, includesQA: true, includesCompliance: true },
  },
  {
    id: "elite", nameKey: "chatAI.plans.elite.name", price: 499, currency: "EUR", commission: "3-5%",
    features: ["Tout Pro Agency +", "Fan Brain illimité", "Chatters illimités", "Mode Excellence (double-passe)", "API BYOK prioritaire", "Support dédié", "SLA prioritaire", "Custom playbooks"],
    limits: { maxFans: 10000, maxConversations: 50000, maxDraftsPerDay: 2000, maxPPVRecommendations: 200, maxChatters: 50, includesVault: true, includesPlaybooks: true, includesQA: true, includesCompliance: true },
  },
];

// ─── 30 Audit Log Entries ────────────────────────────────

export const demoAuditLogs: AuditLogEntry[] = [
  { id: "audit-1", userId: DEMO_USER_ID, actorId: DEMO_USER_ID, actorType: "creator", action: "module_activated", targetType: "chat_ai_config", targetId: null, metadata: { mode: "copilot_only" }, createdAt: now },
  { id: "audit-2", userId: DEMO_USER_ID, actorId: DEMO_USER_ID, actorType: "creator", action: "consent_checklist_completed", targetType: "consent_checklist", targetId: null, metadata: { version: 1 }, createdAt: now },
  { id: "audit-3", userId: DEMO_USER_ID, actorId: DEMO_USER_ID, actorType: "creator", action: "playbook_created", targetType: "playbook", targetId: "playbook-solo", metadata: { name: "Solo Standard" }, createdAt: now },
  { id: "audit-4", userId: DEMO_USER_ID, actorId: DEMO_USER_ID, actorType: "creator", action: "disclosure_mode_selected", targetType: "chat_ai_config", targetId: null, metadata: { mode: "private_copilot" }, createdAt: now },
  { id: "audit-5", userId: DEMO_USER_ID, actorId: DEMO_USER_ID, actorType: "creator", action: "ai_draft_generated", targetType: "draft", targetId: "draft-1", metadata: { model: "deepseek-v4-flash" }, createdAt: now },
  { id: "audit-6", userId: DEMO_USER_ID, actorId: DEMO_USER_ID, actorType: "creator", action: "ai_draft_approved", targetType: "draft", targetId: "draft-1", metadata: { approved: true }, createdAt: now },
  { id: "audit-7", userId: DEMO_USER_ID, actorId: DEMO_USER_ID, actorType: "creator", action: "ai_draft_copied", targetType: "draft", targetId: "draft-1", metadata: { copied: true }, createdAt: now },
  { id: "audit-8", userId: DEMO_USER_ID, actorId: DEMO_USER_ID, actorType: "creator", action: "ppv_recommendation_created", targetType: "ppv", targetId: "ppv-1", metadata: { price: 24.99 }, createdAt: now },
  { id: "audit-9", userId: DEMO_USER_ID, actorId: DEMO_USER_ID, actorType: "creator", action: "followup_created", targetType: "followup", targetId: "fu-1", metadata: { type: "welcome" }, createdAt: now },
  { id: "audit-10", userId: DEMO_USER_ID, actorId: DEMO_USER_ID, actorType: "creator", action: "followup_approved", targetType: "followup", targetId: "fu-2", metadata: { approved: true }, createdAt: now },
  { id: "audit-11", userId: DEMO_USER_ID, actorId: DEMO_USER_ID, actorType: "creator", action: "qa_review_completed", targetType: "qa", targetId: "qa-2", metadata: { status: "approved" }, createdAt: now },
  { id: "audit-12", userId: DEMO_USER_ID, actorId: null, actorType: "system", action: "compliance_block_triggered", targetType: "draft", targetId: "draft-3", metadata: { reason: "vulnerable_fan" }, createdAt: now },
  { id: "audit-13", userId: DEMO_USER_ID, actorId: DEMO_USER_ID, actorType: "creator", action: "emergency_pause_clicked", targetType: "chat_ai_config", targetId: null, metadata: {}, createdAt: now },
  { id: "audit-14", userId: DEMO_USER_ID, actorId: DEMO_USER_ID, actorType: "creator", action: "module_resumed", targetType: "chat_ai_config", targetId: null, metadata: {}, createdAt: now },
  { id: "audit-15", userId: DEMO_USER_ID, actorId: DEMO_USER_ID, actorType: "creator", action: "mode_changed", targetType: "chat_ai_config", targetId: null, metadata: { from: "copilot_only", to: "assisted_sales" }, createdAt: now },
  { id: "audit-16", userId: DEMO_USER_ID, actorId: DEMO_USER_ID, actorType: "creator", action: "ai_draft_generated", targetType: "draft", targetId: "draft-2", metadata: { model: "deepseek-v4-pro" }, createdAt: now },
  { id: "audit-17", userId: DEMO_USER_ID, actorId: DEMO_USER_ID, actorType: "creator", action: "ai_draft_generated", targetType: "draft", targetId: "draft-4", metadata: { model: "deepseek-v4-flash" }, createdAt: now },
  { id: "audit-18", userId: DEMO_USER_ID, actorId: DEMO_USER_ID, actorType: "creator", action: "ppv_recommendation_created", targetType: "ppv", targetId: "ppv-3", metadata: { price: 14.99 }, createdAt: now },
  { id: "audit-19", userId: DEMO_USER_ID, actorId: DEMO_USER_ID, actorType: "creator", action: "data_exported", targetType: "chat_ai_config", targetId: null, metadata: { format: "json" }, createdAt: now },
  { id: "audit-20", userId: DEMO_USER_ID, actorId: DEMO_USER_ID, actorType: "creator", action: "playbook_updated", targetType: "playbook", targetId: "playbook-solo", metadata: { field: "boldnessLevel", from: 2, to: 3 }, createdAt: now },
  { id: "audit-21", userId: DEMO_USER_ID, actorId: null, actorType: "system", action: "compliance_scan_passed", targetType: "draft", targetId: "draft-6", metadata: { riskLevel: "low" }, createdAt: now },
  { id: "audit-22", userId: DEMO_USER_ID, actorId: DEMO_USER_ID, actorType: "creator", action: "fan_notes_updated", targetType: "fan", targetId: "fan-alex", metadata: {}, createdAt: now },
  { id: "audit-23", userId: DEMO_USER_ID, actorId: DEMO_USER_ID, actorType: "creator", action: "vault_asset_added", targetType: "vault", targetId: "vault-1", metadata: { title: "Set Photo Exclusif Été 2026" }, createdAt: now },
  { id: "audit-24", userId: DEMO_USER_ID, actorId: null, actorType: "system", action: "vulnerable_fan_detected", targetType: "fan", targetId: "fan-vulnerable", metadata: { signals: ["financial_distress"] }, createdAt: now },
  { id: "audit-25", userId: DEMO_USER_ID, actorId: DEMO_USER_ID, actorType: "creator", action: "followup_paused", targetType: "followup", targetId: "fu-7", metadata: {}, createdAt: now },
  { id: "audit-26", userId: DEMO_USER_ID, actorId: DEMO_USER_ID, actorType: "creator", action: "ai_draft_escalated", targetType: "draft", targetId: "draft-5", metadata: { reason: "unauthorized_promise" }, createdAt: now },
  { id: "audit-27", userId: DEMO_USER_ID, actorId: DEMO_USER_ID, actorType: "creator", action: "settings_updated", targetType: "chat_ai_config", targetId: null, metadata: { field: "cooldown_minutes", value: 60 }, createdAt: now },
  { id: "audit-28", userId: DEMO_USER_ID, actorId: DEMO_USER_ID, actorType: "creator", action: "wizard_completed", targetType: "chat_ai_config", targetId: null, metadata: { step: 12 }, createdAt: now },
  { id: "audit-29", userId: DEMO_USER_ID, actorId: null, actorType: "system", action: "daily_draft_limit_warning", targetType: "draft", targetId: null, metadata: { current: 45, limit: 50 }, createdAt: now },
  { id: "audit-30", userId: DEMO_USER_ID, actorId: DEMO_USER_ID, actorType: "creator", action: "ai_draft_generated", targetType: "draft", targetId: "draft-9", metadata: { model: "deepseek-v4-flash", objective: "discovery" }, createdAt: now },
];
