// ─── Atlas Inbox V2 — Types + Mock Data ─────────────────────

import type React from "react";
import type { ComponentType, CSSProperties } from "react";
import {
  MessageCircle, Send, Star, TrendingUp, DollarSign,
  Users, ShieldCheck, Zap, Target, Link, Globe,
  List, Workflow, BarChart3, UserCheck, AlertTriangle,
  Eye, Lock, Settings, FileCheck, Activity, Play,
  Mail, Smartphone, Bell, Image, Clock, Sliders,
  GitBranch, FileText, Layers, BookOpen, Ban,
  UserCog, Megaphone, Video, Lightbulb, Brain,
  Cpu, MessageSquare, Palette, ThumbsUp, Percent,
  TrendingDown, Sparkles, Radio, Info, CheckCircle,
  X, ChevronRight, ChevronDown, Menu, Shield,
} from "lucide-react";

// ═══ Helpers ═══════════════════════════════════════════════

const now = new Date("2026-06-15T10:00:00Z");
function daysAgo(d: number, h = 0): string {
  return new Date(now.getTime() - d * 86_400_000 - h * 3_600_000).toISOString();
}
function ago(minutes: number): string {
  return new Date(now.getTime() - minutes * 60_000).toISOString();
}
function formatEuro(n: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}
function formatRelative(dateStr: string): string {
  const d = new Date(dateStr).getTime();
  const diff = now.getTime() - d;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}j`;
}

// ═══ Onboarding ════════════════════════════════════════════

interface OnboardingStep {
  id: string;
  label: string;
  description: string;
  sectionTarget: SectionId | null;
  icon: ComponentType<{ size?: number; className?: string; style?: CSSProperties }>;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: "step1", label: "Configure AI safety", description: "Définir les barrières de sécurité et les modes IA", sectionTarget: "safety_guard", icon: Lock },
  { id: "step2", label: "Create first PPV script", description: "Créer un entonnoir PPV pour automatiser les ventes", sectionTarget: "script_builder", icon: Layers },
  { id: "step3", label: "Review handoff rules", description: "Configurer quand l'IA passe la main à l'humain", sectionTarget: "hybrid_handoff", icon: GitBranch },
  { id: "step4", label: "Invite first chatter", description: "Ajouter un membre de l'équipe de vente", sectionTarget: "team_control", icon: Users },
  { id: "step5", label: "Check compliance queue", description: "Vérifier les alertes conformité en attente", sectionTarget: "compliance_review", icon: ShieldCheck },
];

// ═══ Section Descriptions ═════════════════════════════════════

const SECTION_DESCRIPTIONS: Record<SectionId, string> = {
  sales_engine: "L'IA génère des brouillons de réponses pour chaque fan. Tu relis, modifies si besoin, puis valides l'envoi. Aucun message ne part sans ton approbation explicite.",
  campaign_builder: "Crée des campagnes marketing multi-étapes avec templates et planification. Visualise le flow avant lancement.",
  opportunity_queue: "L'IA identifie les opportunités de vente (upsell, cross-sell, réengagement) et les priorise par potentiel de revenu.",
  pricing_lab: "Teste différents scénarios de prix pour maximiser le revenu sans perdre de fans. Simulation de pricing PPV avec taux de conversion.",
  tracking_links: "Génère des liens traqués pour mesurer la performance de chaque canal d'acquisition.",
  lists_builder: "Crée des segments dynamiques de fans basés sur plus de 30 critères comportementaux et transactionnels.",
  fan_journey: "Visualise le parcours de tes fans, de la découverte à l'ambassadeur, avec les taux de conversion par étape.",
  automation_triggers: "Configure des actions automatiques basées sur des événements (anniversaire, silence, achat...).",
  browser_mock: "Simule l'apparence de tes messages sur les plateformes avant envoi. Aucune connexion réelle.",
  team_control: "Supervise l'activité de ton équipe, les performances, et le Golden Ratio de chaque membre.",
  compliance_review: "Les contenus à risque sont automatiquement détectés et placés en file d'attente pour révision humaine.",
  why_atlas_safer: "Découvre pourquoi le modèle Atlas (IA propose, humain valide, humain envoie) est le plus sûr du marché.",
  safety_guard: "Configure les barrières de sécurité qui bloquent automatiquement les contenus interdits et protègent tes comptes.",
  ai_core_settings: "Choisis le niveau d'assistance IA : manuel, brouillons, hybride ou simulation complète. L'envoi reste toujours humain.",
  hybrid_handoff: "Définis les règles qui déterminent quand une conversation passe de l'IA à un humain (seuils, segments, conditions).",
  script_builder: "Crée des entonnoirs PPV progressifs avec étapes, prix et délais. Templates réutilisables par ton équipe.",
  message_ledger: "Registre complet de tous les messages envoyés et reçus, avec statuts et revenus associés.",
  banned_keywords: "Liste des mots et expressions interdits dans les brouillons IA et messages manuels. Appliqué à tous les canaux.",
  creator_profile: "Profil IA de la créatrice : persona, ton, limites strictes, règles éditoriales et préférences.",
  notifications_center: "Toutes les alertes et notifications (achats, messages, conformité, milestones) centralisées.",
  creative_engine: "L'IA génère des scripts Reels/TikTok basés sur les tendances. Approbation humaine obligatoire avant publication.",
  roadmap: "Propositions de fonctionnalités par la communauté d'agences. Vote pour prioriser les développements.",
};

// ═══ Shared Types ══════════════════════════════════════════

export type FanTier = "whale" | "vip" | "engaged" | "new" | "at_risk" | "dormant";
export type Platform = "OF" | "Fansly" | "MYM" | "Fanvue" | "IG" | "TT";

export const FAN_TIER_LABELS: Record<FanTier, string> = {
  whale: "Whale",
  vip: "VIP",
  engaged: "Engagé",
  new: "Nouveau",
  at_risk: "À risque",
  dormant: "Dormant",
};

export const FAN_TIER_COLORS: Record<FanTier, string> = {
  whale: "#C9973F",
  vip: "#B45309",
  engaged: "#2F7D4E",
  new: "#1D4ED8",
  at_risk: "#B7791F",
  dormant: "#9A8D7C",
};

export const PLATFORM_LABELS: Record<Platform, string> = {
  OF: "OnlyFans",
  Fansly: "Fansly",
  MYM: "MYM",
  Fanvue: "Fanvue",
  IG: "Instagram",
  TT: "TikTok",
};

// ═══ 1. AI Sales Engine ════════════════════════════════════

export type ConversationStatus = "ai_draft_ready" | "human_reviewing" | "approved" | "sent" | "rejected" | "waiting";

export const STATUS_LABELS: Record<ConversationStatus, string> = {
  ai_draft_ready: "Brouillon IA prêt",
  human_reviewing: "En révision",
  approved: "Approuvé",
  sent: "Envoyé",
  rejected: "Rejeté",
  waiting: "En attente",
};

export const STATUS_COLORS: Record<ConversationStatus, string> = {
  ai_draft_ready: "#C9973F",
  human_reviewing: "#6D28D9",
  approved: "#2F7D4E",
  sent: "#1D4ED8",
  rejected: "#9A8D7C",
  waiting: "#9A8D7C",
};

export interface AIMessage {
  id: string;
  direction: "inbound" | "outbound";
  channel: string;
  content: string;
  occurredAt: string;
  aiGenerated?: boolean;
}

export interface AIDraft {
  id: string;
  approach: string;
  draftText: string;
  estimatedEngagement: number;
  aiWarning: string | null;
  generatedAt: string;
}

export interface AIConversation {
  id: string;
  fanName: string;
  fanTier: FanTier;
  platform: Platform;
  country: string;
  language: string;
  totalSpent: number;
  lastMessagePreview: string;
  lastActivity: string;
  status: ConversationStatus;
  intentScore: number;
  revenuePotential: number;
  complianceFlags: string[];
  assignedTo: string | null;
  unread: boolean;
  messages: AIMessage[];
  drafts: AIDraft[];
}

const APPROACH_LABELS: Record<string, string> = {
  chaleureuse: "Chaleureuse",
  directe: "Directe",
  joueuse: "Joueuse",
  professionnelle: "Pro",
  complice: "Complice",
};

const APPROACH_COLORS: Record<string, string> = {
  chaleureuse: "#2F7D4E",
  directe: "#C9973F",
  joueuse: "#B45309",
  professionnelle: "#1D4ED8",
  complice: "#6D28D9",
};

export const mockConversations: AIConversation[] = [
  {
    id: "cv1",
    fanName: "MarcusR",
    fanTier: "whale",
    platform: "OF",
    country: "US",
    language: "en",
    totalSpent: 12450,
    lastMessagePreview: "Hey, is that new video ready? I've been waiting...",
    lastActivity: ago(15),
    status: "ai_draft_ready",
    intentScore: 92,
    revenuePotential: 250,
    complianceFlags: [],
    assignedTo: "Sophie L.",
    unread: true,
    messages: [
      { id: "m1-1", direction: "inbound", channel: "OF", content: "That last video was incredible!", occurredAt: daysAgo(5) },
      { id: "m1-2", direction: "outbound", channel: "OF", content: "Thank you Marcus! I'm working on something even better.", occurredAt: daysAgo(5, 1), aiGenerated: true },
      { id: "m1-3", direction: "inbound", channel: "OF", content: "Hey, is that new video ready? I've been waiting...", occurredAt: ago(15), aiGenerated: false },
    ],
    drafts: [
      { id: "d1-1", approach: "chaleureuse", draftText: "Hey Marcus! The new video just dropped — exclusive 4K, 12 minutes. I saved you early access at $89.99 before it goes public next week. Want me to unlock it for you?", estimatedEngagement: 85, aiWarning: null, generatedAt: ago(2) },
      { id: "d1-2", approach: "directe", draftText: "Marcus — new 4K video ready. 12min, exclusive. $89.99 early access. Yours before anyone else. Want it?", estimatedEngagement: 72, aiWarning: null, generatedAt: ago(2) },
      { id: "d1-3", approach: "joueuse", draftText: "Guess what just finished rendering? 🔥 12 minutes of pure cinematic goodness. I'm giving you first dibs at $89.99 before the official drop. Ready? 😏", estimatedEngagement: 78, aiWarning: null, generatedAt: ago(2) },
    ],
  },
  {
    id: "cv2",
    fanName: "LunaStar",
    fanTier: "vip",
    platform: "Fansly",
    country: "UK",
    language: "en",
    totalSpent: 9800,
    lastMessagePreview: "Can you do a custom bundle with the beach and studio sets?",
    lastActivity: ago(45),
    status: "approved",
    intentScore: 88,
    revenuePotential: 180,
    complianceFlags: [],
    assignedTo: "Sophie L.",
    unread: false,
    messages: [
      { id: "m2-1", direction: "inbound", channel: "Fansly", content: "The beach set is gorgeous! Do you have more?", occurredAt: daysAgo(5) },
      { id: "m2-2", direction: "outbound", channel: "Fansly", content: "I do! There's a studio set from the same day. Want both?", occurredAt: daysAgo(5, 1), aiGenerated: true },
      { id: "m2-3", direction: "inbound", channel: "Fansly", content: "Can you do a custom bundle with the beach and studio sets?", occurredAt: ago(45), aiGenerated: false },
    ],
    drafts: [
      { id: "d2-1", approach: "chaleureuse", draftText: "Hi Luna! Absolutely, I can put together a custom bundle with both sets plus 3 exclusive BTS photos. $149 for the full package. Interested?", estimatedEngagement: 90, aiWarning: null, generatedAt: ago(5) },
    ],
  },
  {
    id: "cv3",
    fanName: "CarlosM",
    fanTier: "engaged",
    platform: "OF",
    country: "ES",
    language: "es",
    totalSpent: 5600,
    lastMessagePreview: "¿Tienes más contenido como el último? Me encantó 🔥",
    lastActivity: ago(30),
    status: "ai_draft_ready",
    intentScore: 85,
    revenuePotential: 120,
    complianceFlags: [],
    assignedTo: null,
    unread: true,
    messages: [
      { id: "m3-1", direction: "inbound", channel: "OF", content: "Hola, me encanta tu contenido ✨", occurredAt: daysAgo(14) },
      { id: "m3-2", direction: "outbound", channel: "OF", content: "¡Gracias Carlos! ¿Qué tipo de contenido te gusta más?", occurredAt: daysAgo(14, 1), aiGenerated: true },
      { id: "m3-3", direction: "inbound", channel: "OF", content: "¿Tienes más contenido como el último? Me encantó 🔥", occurredAt: ago(30), aiGenerated: false },
    ],
    drafts: [
      { id: "d3-1", approach: "directe", draftText: "¡Claro Carlos! Acabo de terminar un video nuevo, 15 minutos, luz natural. Lo tengo a 59.99€ para ti antes del lanzamiento oficial. ¿Te lo desbloqueo?", estimatedEngagement: 80, aiWarning: null, generatedAt: ago(3) },
    ],
  },
  {
    id: "cv4",
    fanName: "Emma_W",
    fanTier: "engaged",
    platform: "OF",
    country: "DE",
    language: "de",
    totalSpent: 4100,
    lastMessagePreview: "Gibt es ein Special für langjährige Fans? Bin seit 4 Monaten dabei 💫",
    lastActivity: ago(55),
    status: "ai_draft_ready",
    intentScore: 78,
    revenuePotential: 95,
    complianceFlags: [],
    assignedTo: null,
    unread: true,
    messages: [
      { id: "m4-1", direction: "inbound", channel: "OF", content: "Dein neues Video ist fantastisch!", occurredAt: daysAgo(5) },
      { id: "m4-2", direction: "outbound", channel: "OF", content: "Danke Emma! Freut mich, dass es dir gefällt 💕", occurredAt: daysAgo(5, 1), aiGenerated: true },
      { id: "m4-3", direction: "inbound", channel: "OF", content: "Gibt es ein Special für langjährige Fans? Bin seit 4 Monaten dabei 💫", occurredAt: ago(55), aiGenerated: false },
    ],
    drafts: [
      { id: "d4-1", approach: "chaleureuse", draftText: "Emma, du bist großartig! Weil du seit 4 Monaten dabei bist, habe ich ein exklusives Treue-Paket: meine 3 beliebtesten Videos plus 2 unveröffentlichte Fotosets für 79€ statt 129€. Nur für dich!", estimatedEngagement: 88, aiWarning: null, generatedAt: ago(4) },
    ],
  },
  {
    id: "cv5",
    fanName: "Nico_Art",
    fanTier: "new",
    platform: "MYM",
    country: "FR",
    language: "fr",
    totalSpent: 450,
    lastMessagePreview: "Salut ! Tu fais des shootings photo en extérieur ?",
    lastActivity: ago(90),
    status: "waiting",
    intentScore: 55,
    revenuePotential: 60,
    complianceFlags: [],
    assignedTo: null,
    unread: false,
    messages: [
      { id: "m5-1", direction: "inbound", channel: "MYM", content: "J'adore ton style photo !", occurredAt: daysAgo(12) },
      { id: "m5-2", direction: "outbound", channel: "MYM", content: "Merci Nico ! Ça fait plaisir 📸", occurredAt: daysAgo(12, 1), aiGenerated: true },
      { id: "m5-3", direction: "inbound", channel: "MYM", content: "Salut ! Tu fais des shootings photo en extérieur ?", occurredAt: ago(90), aiGenerated: false },
    ],
    drafts: [],
  },
  {
    id: "cv6",
    fanName: "Tyler_J",
    fanTier: "engaged",
    platform: "OF",
    country: "US",
    language: "en",
    totalSpent: 1200,
    lastMessagePreview: "Do you ever do discounts? I'm interested but 50 is a bit steep",
    lastActivity: ago(200),
    status: "ai_draft_ready",
    intentScore: 60,
    revenuePotential: 45,
    complianceFlags: [],
    assignedTo: "Marc D.",
    unread: true,
    messages: [
      { id: "m6-1", direction: "outbound", channel: "OF", content: "New photo set just dropped! 16 exclusives, $49.99 🔥", occurredAt: daysAgo(4), aiGenerated: true },
      { id: "m6-2", direction: "inbound", channel: "OF", content: "Do you ever do discounts? I'm interested but 50 is a bit steep", occurredAt: ago(200), aiGenerated: false },
    ],
    drafts: [
      { id: "d6-1", approach: "chaleureuse", draftText: "Hey Tyler! I get it. How about a mini photo set (8 exclusives) at $24.99? Same vibe, smaller pack. If you like it, I can do a loyalty discount on the next one too.", estimatedEngagement: 75, aiWarning: null, generatedAt: ago(6) },
    ],
  },
  {
    id: "cv7",
    fanName: "DarkKnight42",
    fanTier: "dormant",
    platform: "OF",
    country: "US",
    language: "en",
    totalSpent: 6200,
    lastMessagePreview: "Been busy lately, might come back next month",
    lastActivity: daysAgo(32),
    status: "ai_draft_ready",
    intentScore: 28,
    revenuePotential: 80,
    complianceFlags: [],
    assignedTo: "Sophie L.",
    unread: false,
    messages: [
      { id: "m7-1", direction: "outbound", channel: "OF", content: "Hey! Haven't seen you in a bit. Everything ok?", occurredAt: daysAgo(35), aiGenerated: true },
      { id: "m7-2", direction: "inbound", channel: "OF", content: "Been busy lately, might come back next month", occurredAt: daysAgo(32), aiGenerated: false },
    ],
    drafts: [
      { id: "d7-1", approach: "complice", draftText: "Hey! Missed you around here 💫 I just dropped a new series in the cinematic style you always loved. Free preview of the first video — no pressure, just wanted you to see what's new!", estimatedEngagement: 65, aiWarning: "Fan dormant 45j+, éviter le hard-sell", generatedAt: ago(8) },
    ],
  },
  {
    id: "cv8",
    fanName: "HotShot23",
    fanTier: "engaged",
    platform: "OF",
    country: "US",
    language: "en",
    totalSpent: 1800,
    lastMessagePreview: "Can we meet IRL? I'll pay whatever you want.",
    lastActivity: ago(25),
    status: "human_reviewing",
    intentScore: 65,
    revenuePotential: 0,
    complianceFlags: ["irl_request", "boundary_push"],
    assignedTo: "Sophie L.",
    unread: true,
    messages: [
      { id: "m8-1", direction: "outbound", channel: "OF", content: "New spicy video just dropped! 🔥", occurredAt: daysAgo(6), aiGenerated: true },
      { id: "m8-2", direction: "inbound", channel: "OF", content: "Can we meet IRL? I'll pay whatever you want.", occurredAt: ago(25), aiGenerated: false },
    ],
    drafts: [
      { id: "d8-1", approach: "professionnelle", draftText: "I appreciate your enthusiasm, but I keep all interactions on-platform only. That's a hard boundary. I'd love to keep creating content for you here though — I just released a new video you might enjoy!", estimatedEngagement: 40, aiWarning: "⚠️ Demande IRL — refuser fermement, rediriger vers contenu on-platform", generatedAt: ago(2) },
    ],
  },
  {
    id: "cv9",
    fanName: "Priya_K",
    fanTier: "new",
    platform: "Fanvue",
    country: "IN",
    language: "en",
    totalSpent: 180,
    lastMessagePreview: "Just subscribed! What kind of exclusive content do you have?",
    lastActivity: daysAgo(1),
    status: "ai_draft_ready",
    intentScore: 45,
    revenuePotential: 35,
    complianceFlags: [],
    assignedTo: null,
    unread: false,
    messages: [
      { id: "m9-1", direction: "inbound", channel: "Fanvue", content: "Just subscribed! What kind of exclusive content do you have?", occurredAt: daysAgo(1), aiGenerated: false },
    ],
    drafts: [
      { id: "d9-1", approach: "chaleureuse", draftText: "Welcome Priya! So happy to have you 🎉 I post exclusive photo sets every Tuesday, BTS videos on Fridays, and custom content for loyal fans. Check out my welcome bundle — 3 fan-favorite sets at 40% off!", estimatedEngagement: 82, aiWarning: null, generatedAt: ago(1) },
    ],
  },
  {
    id: "cv10",
    fanName: "MegaSpender_Dubai",
    fanTier: "whale",
    platform: "OF",
    country: "AE",
    language: "en",
    totalSpent: 18700,
    lastMessagePreview: "I want a custom 30-minute video. My budget is 2500. Can your manager approve?",
    lastActivity: ago(10),
    status: "human_reviewing",
    intentScore: 95,
    revenuePotential: 2500,
    complianceFlags: [],
    assignedTo: "Sophie L.",
    unread: true,
    messages: [
      { id: "m10-1", direction: "inbound", channel: "OF", content: "Your content is genuinely the best on this platform", occurredAt: daysAgo(3) },
      { id: "m10-2", direction: "outbound", channel: "OF", content: "That means so much! Thank you 💕", occurredAt: daysAgo(3, 1), aiGenerated: true },
      { id: "m10-3", direction: "inbound", channel: "OF", content: "I want a custom 30-minute video. My budget is 2500. Can your manager approve?", occurredAt: ago(10), aiGenerated: false },
    ],
    drafts: [
      { id: "d10-1", approach: "professionnelle", draftText: "Wow, thank you for this incredible offer! Because this is a high-value custom request, I'm forwarding this to Sophie (my manager) for approval. She'll reach out within 24h to discuss details and timeline. Any specific themes you'd like included?", estimatedEngagement: 92, aiWarning: "Custom >500€ → approbation manager obligatoire", generatedAt: ago(3) },
    ],
  },
];

// ═══ 2. Pricing / Commission Simulator ═════════════════════

export interface CommissionTier {
  threshold: number;
  rate: number;
  label: string;
}

export interface PricingScenario {
  id: string;
  productName: string;
  type: "ppv_video" | "ppv_photo" | "bundle" | "subscription" | "custom";
  costBase: number;
  platformFee: number;
  suggestedPriceLow: number;
  suggestedPriceMid: number;
  suggestedPriceHigh: number;
  estimatedConversions: { low: number; mid: number; high: number };
  commissionTiers: CommissionTier[];
  audienceSize: number;
}

export const mockPricingScenarios: PricingScenario[] = [
  {
    id: "ps1",
    productName: "Golden Hour — Full Set (20 photos)",
    type: "ppv_photo",
    costBase: 15,
    platformFee: 0.20,
    suggestedPriceLow: 29.99,
    suggestedPriceMid: 49.99,
    suggestedPriceHigh: 79.99,
    estimatedConversions: { low: 85, mid: 55, high: 25 },
    commissionTiers: [
      { threshold: 500, rate: 0.15, label: "Bronze" },
      { threshold: 2000, rate: 0.12, label: "Silver" },
      { threshold: 5000, rate: 0.10, label: "Gold" },
      { threshold: 15000, rate: 0.08, label: "Platinum" },
    ],
    audienceSize: 1200,
  },
  {
    id: "ps2",
    productName: "Cinematic BTS — 15min Video",
    type: "ppv_video",
    costBase: 30,
    platformFee: 0.20,
    suggestedPriceLow: 59.99,
    suggestedPriceMid: 89.99,
    suggestedPriceHigh: 129.99,
    estimatedConversions: { low: 60, mid: 35, high: 15 },
    commissionTiers: [
      { threshold: 500, rate: 0.15, label: "Bronze" },
      { threshold: 2000, rate: 0.12, label: "Silver" },
      { threshold: 5000, rate: 0.10, label: "Gold" },
      { threshold: 15000, rate: 0.08, label: "Platinum" },
    ],
    audienceSize: 800,
  },
  {
    id: "ps3",
    productName: "Beach + Studio Bundle",
    type: "bundle",
    costBase: 25,
    platformFee: 0.20,
    suggestedPriceLow: 79.99,
    suggestedPriceMid: 119.99,
    suggestedPriceHigh: 159.99,
    estimatedConversions: { low: 45, mid: 28, high: 12 },
    commissionTiers: [
      { threshold: 500, rate: 0.15, label: "Bronze" },
      { threshold: 2000, rate: 0.12, label: "Silver" },
      { threshold: 5000, rate: 0.10, label: "Gold" },
      { threshold: 15000, rate: 0.08, label: "Platinum" },
    ],
    audienceSize: 600,
  },
  {
    id: "ps4",
    productName: "Abonnement mensuel VIP",
    type: "subscription",
    costBase: 5,
    platformFee: 0.20,
    suggestedPriceLow: 9.99,
    suggestedPriceMid: 14.99,
    suggestedPriceHigh: 24.99,
    estimatedConversions: { low: 200, mid: 120, high: 50 },
    commissionTiers: [
      { threshold: 500, rate: 0.15, label: "Bronze" },
      { threshold: 2000, rate: 0.12, label: "Silver" },
      { threshold: 5000, rate: 0.10, label: "Gold" },
      { threshold: 15000, rate: 0.08, label: "Platinum" },
    ],
    audienceSize: 3000,
  },
  {
    id: "ps5",
    productName: "Custom Request — 10min Video",
    type: "custom",
    costBase: 50,
    platformFee: 0.20,
    suggestedPriceLow: 149.99,
    suggestedPriceMid: 249.99,
    suggestedPriceHigh: 399.99,
    estimatedConversions: { low: 15, mid: 8, high: 3 },
    commissionTiers: [
      { threshold: 500, rate: 0.15, label: "Bronze" },
      { threshold: 2000, rate: 0.12, label: "Silver" },
      { threshold: 5000, rate: 0.10, label: "Gold" },
      { threshold: 15000, rate: 0.08, label: "Platinum" },
    ],
    audienceSize: 200,
  },
  {
    id: "ps6",
    productName: "Welcome Pack — 5 Best-Sellers",
    type: "bundle",
    costBase: 10,
    platformFee: 0.20,
    suggestedPriceLow: 19.99,
    suggestedPriceMid: 34.99,
    suggestedPriceHigh: 49.99,
    estimatedConversions: { low: 150, mid: 90, high: 40 },
    commissionTiers: [
      { threshold: 500, rate: 0.15, label: "Bronze" },
      { threshold: 2000, rate: 0.12, label: "Silver" },
      { threshold: 5000, rate: 0.10, label: "Gold" },
      { threshold: 15000, rate: 0.08, label: "Platinum" },
    ],
    audienceSize: 2500,
  },
];

// ═══ 3. Dynamic Lists Builder ══════════════════════════════

export interface FanFilter {
  id: string;
  field: "spend" | "last_active" | "platform" | "tier" | "country" | "language" | "tags";
  operator: ">" | "<" | "=" | "contains" | "in";
  value: string;
}

export interface SavedSegment {
  id: string;
  name: string;
  description: string;
  filters: FanFilter[];
  fanCount: number;
  estimatedRevenue: number;
  createdAt: string;
  lastUsed: string | null;
}

export const AVAILABLE_FILTER_FIELDS = [
  { field: "spend" as const, label: "Dépenses totales", operators: [">", "<"] as const, hint: "Montant en EUR" },
  { field: "last_active" as const, label: "Dernière activité", operators: [">", "<"] as const, hint: "Jours d'inactivité" },
  { field: "platform" as const, label: "Plateforme", operators: ["="] as const, hint: "OF, Fansly, MYM..." },
  { field: "tier" as const, label: "Niveau fan", operators: ["="] as const, hint: "Whale, VIP, Engagé..." },
  { field: "country" as const, label: "Pays", operators: ["="] as const, hint: "Code pays (FR, US...)" },
  { field: "language" as const, label: "Langue", operators: ["="] as const, hint: "fr, en, es, de..." },
  { field: "tags" as const, label: "Tags", operators: ["contains"] as const, hint: "Mot-clé" },
];

export const mockSavedSegments: SavedSegment[] = [
  { id: "sg1", name: "Whales + VIP actifs", description: "Fans à forte valeur, actifs récemment", filters: [{ id: "f1", field: "tier", operator: "in", value: "whale,vip" }, { id: "f2", field: "last_active", operator: "<", value: "7" }], fanCount: 48, estimatedRevenue: 28500, createdAt: daysAgo(30), lastUsed: daysAgo(1) },
  { id: "sg2", name: "Fans dormants à réengager", description: "Ex-acheteurs inactifs depuis 30+ jours", filters: [{ id: "f3", field: "tier", operator: "=", value: "dormant" }, { id: "f4", field: "last_active", operator: ">", value: "30" }], fanCount: 215, estimatedRevenue: 12000, createdAt: daysAgo(14), lastUsed: daysAgo(3) },
  { id: "sg3", name: "Marché francophone", description: "Tous les fans francophones", filters: [{ id: "f5", field: "language", operator: "=", value: "fr" }], fanCount: 340, estimatedRevenue: 45000, createdAt: daysAgo(60), lastUsed: daysAgo(1) },
  { id: "sg4", name: "Nouveaux abonnés (7j)", description: "Abonnés récents, à accueillir", filters: [{ id: "f6", field: "tier", operator: "=", value: "new" }, { id: "f7", field: "last_active", operator: "<", value: "7" }], fanCount: 89, estimatedRevenue: 3200, createdAt: daysAgo(3), lastUsed: daysAgo(1) },
  { id: "sg5", name: "Gros dépensiers US", description: "Whales et VIP basés aux États-Unis", filters: [{ id: "f8", field: "tier", operator: "in", value: "whale,vip" }, { id: "f9", field: "country", operator: "=", value: "US" }], fanCount: 32, estimatedRevenue: 18500, createdAt: daysAgo(21), lastUsed: daysAgo(7) },
  { id: "sg6", name: "À risque de churn", description: "Fans dont les dépenses baissent", filters: [{ id: "f10", field: "tier", operator: "=", value: "at_risk" }], fanCount: 67, estimatedRevenue: 4800, createdAt: daysAgo(7), lastUsed: null },
];

// ═══ 4. Automation Triggers ════════════════════════════════

export type TriggerEvent = "fan_message_received" | "fan_subscribed" | "fan_unsubscribed" | "purchase_completed" | "fan_inactive_7d" | "fan_inactive_30d" | "ppv_viewed" | "birthday" | "vip_milestone";
export type TriggerAction = "send_welcome_message" | "send_ppv_offer" | "send_reengagement" | "assign_to_chatter" | "add_tag" | "flag_for_review" | "send_discount" | "send_birthday_gift";

export const TRIGGER_EVENT_LABELS: Record<TriggerEvent, string> = {
  fan_message_received: "Message fan reçu",
  fan_subscribed: "Nouvel abonnement",
  fan_unsubscribed: "Désabonnement",
  purchase_completed: "Achat effectué",
  fan_inactive_7d: "Inactif depuis 7 jours",
  fan_inactive_30d: "Inactif depuis 30 jours",
  ppv_viewed: "PPV consulté",
  birthday: "Anniversaire fan",
  vip_milestone: "Palier VIP atteint",
};

export const TRIGGER_ACTION_LABELS: Record<TriggerAction, string> = {
  send_welcome_message: "Envoyer message de bienvenue",
  send_ppv_offer: "Proposer un PPV",
  send_reengagement: "Envoyer message de réengagement",
  assign_to_chatter: "Assigner à un chatter",
  add_tag: "Ajouter un tag",
  flag_for_review: "Marquer pour révision",
  send_discount: "Envoyer une remise",
  send_birthday_gift: "Envoyer cadeau d'anniv.",
};

export interface AutomationRule {
  id: string;
  name: string;
  when: TriggerEvent;
  condition: string;
  then: TriggerAction;
  thenDetail: string;
  isEnabled: boolean;
  lastTriggered: string | null;
  triggeredCount: number;
}

export const mockAutomationRules: AutomationRule[] = [
  { id: "ar1", name: "Bienvenue nouveaux abonnés", when: "fan_subscribed", condition: "tier = new", then: "send_welcome_message", thenDetail: "Template: Bienvenue Standard", isEnabled: true, lastTriggered: ago(45), triggeredCount: 234 },
  { id: "ar2", name: "Offre PPV après consultation", when: "ppv_viewed", condition: "fan n'a pas acheté sous 24h", then: "send_ppv_offer", thenDetail: "Relance: -20% sur le même PPV", isEnabled: true, lastTriggered: ago(120), triggeredCount: 567 },
  { id: "ar3", name: "Réengagement dormants 30j", when: "fan_inactive_30d", condition: "ltv > 500", then: "send_reengagement", thenDetail: "Template: Tu nous manques + preview gratuit", isEnabled: true, lastTriggered: daysAgo(1), triggeredCount: 89 },
  { id: "ar4", name: "Alerte demande IRL", when: "fan_message_received", condition: "message contient 'meet' ou 'rencontrer'", then: "flag_for_review", thenDetail: "Priorité: Haute → File de conformité", isEnabled: true, lastTriggered: ago(25), triggeredCount: 12 },
  { id: "ar5", name: "Cadeau anniversaire", when: "birthday", condition: "tier = whale OR vip", then: "send_birthday_gift", thenDetail: "Template: Joyeux anniv + -30% bundle", isEnabled: true, lastTriggered: daysAgo(2), triggeredCount: 45 },
  { id: "ar6", name: "Assignation auto nouveaux messages", when: "fan_message_received", condition: "non assigné", then: "assign_to_chatter", thenDetail: "Round-robin: Sophie → Marc → Julie", isEnabled: true, lastTriggered: ago(5), triggeredCount: 890 },
  { id: "ar7", name: "Promo après 3 achats", when: "purchase_completed", condition: "achat_count >= 3 ce mois", then: "send_discount", thenDetail: "Code: -25% sur prochain achat", isEnabled: false, lastTriggered: daysAgo(14), triggeredCount: 34 },
  { id: "ar8", name: "Tag VIP automatique", when: "vip_milestone", condition: "ltv > 5000", then: "add_tag", thenDetail: "Tag: 'vip_upgrade' + priorité inbox", isEnabled: true, lastTriggered: daysAgo(5), triggeredCount: 23 },
];

// ═══ 5. Tracking Links / Attribution ═══════════════════════

export interface TrackingLink {
  id: string;
  name: string;
  campaign: string;
  url: string;
  platform: Platform;
  clicks: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  createdAt: string;
}

export const mockTrackingLinks: TrackingLink[] = [
  { id: "tl1", name: "Lien bio OF — Pin", campaign: "Evergreen", url: "https://onlyfans.com/creator?ref=pin-bio", platform: "OF", clicks: 4520, conversions: 678, conversionRate: 15.0, revenue: 12500, createdAt: daysAgo(90) },
  { id: "tl2", name: "Story IG — Beach Bundle", campaign: "Beach Bundle Launch", url: "https://onlyfans.com/creator?ref=ig-beach", platform: "OF", clicks: 2100, conversions: 245, conversionRate: 11.7, revenue: 8900, createdAt: daysAgo(14) },
  { id: "tl3", name: "TikTok — BTS teaser", campaign: "BTS Campaign", url: "https://fans.ly/creator?ref=tt-bts", platform: "Fansly", clicks: 3400, conversions: 180, conversionRate: 5.3, revenue: 4200, createdAt: daysAgo(7) },
  { id: "tl4", name: "Email — Welcome Series", campaign: "Welcome Flow", url: "https://onlyfans.com/creator?ref=email-welcome", platform: "OF", clicks: 1200, conversions: 320, conversionRate: 26.7, revenue: 7800, createdAt: daysAgo(30) },
  { id: "tl5", name: "MYM — Promo post", campaign: "MYM Growth", url: "https://mym.fans/creator?ref=promo1", platform: "MYM", clicks: 890, conversions: 67, conversionRate: 7.5, revenue: 1800, createdAt: daysAgo(21) },
  { id: "tl6", name: "Twitter/X — Teaser", campaign: "Social Push", url: "https://onlyfans.com/creator?ref=x-teaser", platform: "OF", clicks: 670, conversions: 45, conversionRate: 6.7, revenue: 1500, createdAt: daysAgo(5) },
  { id: "tl7", name: "DM auto — Réengagement", campaign: "Winback Dormants", url: "https://onlyfans.com/creator?ref=dm-winback", platform: "OF", clicks: 340, conversions: 89, conversionRate: 26.2, revenue: 3400, createdAt: daysAgo(10) },
  { id: "tl8", name: "Lien bio Fanvue", campaign: "Evergreen", url: "https://fanvue.com/creator?ref=bio", platform: "Fanvue", clicks: 1200, conversions: 95, conversionRate: 7.9, revenue: 2100, createdAt: daysAgo(60) },
];

// ═══ 6. Browser OF / MYM Workspace Mock ════════════════════

export interface BrowserTab {
  id: string;
  label: string;
  platform: Platform;
  url: string;
}

export interface MockFeedPost {
  id: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  timeAgo: string;
  isPpv: boolean;
  ppvPrice?: number;
}

export interface MockDM {
  id: string;
  from: string;
  content: string;
  timeAgo: string;
  isUnread: boolean;
  hasPPVInterest: boolean;
}

export const mockBrowserTabs: BrowserTab[] = [
  { id: "bt1", label: "OnlyFans", platform: "OF", url: "https://onlyfans.com/creator/messages" },
  { id: "bt2", label: "Fansly", platform: "Fansly", url: "https://fansly.com/creator/messages" },
  { id: "bt3", label: "MYM", platform: "MYM", url: "https://mym.fans/creator/messages" },
  { id: "bt4", label: "Fanvue", platform: "Fanvue", url: "https://fanvue.com/creator/messages" },
];

export const mockFeedPosts: MockFeedPost[] = [
  { id: "fp1", author: "Toi", content: "Nouveau set photo 'Golden Hour' dispo ! 20 exclusivités ✨", likes: 234, comments: 45, timeAgo: "2h", isPpv: true, ppvPrice: 49.99 },
  { id: "fp2", author: "Toi", content: "Behind the scenes du shooting d'aujourd'hui 📸", likes: 189, comments: 23, timeAgo: "5h", isPpv: false },
  { id: "fp3", author: "Toi", content: "Quel style de contenu vous préférez ?", likes: 312, comments: 89, timeAgo: "1j", isPpv: false },
];

export const mockDMs: MockDM[] = [
  { id: "dm1", from: "MarcusR", content: "Hey, is that new video ready? I've been waiting...", timeAgo: "15min", isUnread: true, hasPPVInterest: true },
  { id: "dm2", from: "LunaStar", content: "Can you do a custom bundle with the beach and studio sets?", timeAgo: "45min", isUnread: false, hasPPVInterest: true },
  { id: "dm3", from: "CarlosM", content: "¿Tienes más contenido como el último? Me encantó 🔥", timeAgo: "30min", isUnread: true, hasPPVInterest: true },
  { id: "dm4", from: "HotShot23", content: "Can we meet IRL? I'll pay whatever you want.", timeAgo: "25min", isUnread: true, hasPPVInterest: false },
  { id: "dm5", from: "Emma_W", content: "Gibt es ein Special für langjährige Fans?", timeAgo: "55min", isUnread: true, hasPPVInterest: true },
];

// ═══ 7. Campaign Builder ═══════════════════════════════════

export type CampaignStep = "audience" | "content" | "pricing" | "compliance" | "review" | "launch";
export type CampaignType = "ppv_drop" | "bundle_launch" | "reengagement" | "welcome_series";

export const CAMPAIGN_STEP_LABELS: Record<CampaignStep, string> = {
  audience: "Audience",
  content: "Contenu",
  pricing: "Tarification",
  compliance: "Conformité",
  review: "Révision",
  launch: "Lancement",
};

export const CAMPAIGN_STEP_ORDER: CampaignStep[] = ["audience", "content", "pricing", "compliance", "review", "launch"];

export const CAMPAIGN_TYPE_LABELS: Record<CampaignType, string> = {
  ppv_drop: "Drop PPV",
  bundle_launch: "Lancement Bundle",
  reengagement: "Réengagement",
  welcome_series: "Série Bienvenue",
};

export interface CampaignBuild {
  id: string;
  name: string;
  type: CampaignType;
  currentStep: CampaignStep;
  audience: { segmentId: string; segmentName: string; fanCount: number };
  content: { productName: string; description: string; mediaCount: number };
  pricing: { basePrice: number; discountPercent: number; expectedRevenue: number };
  complianceStatus: "pending" | "passed" | "flagged";
  complianceNotes: string | null;
  createdAt: string;
  estimatedSendDate: string | null;
}

export const mockCampaigns: CampaignBuild[] = [
  {
    id: "cb1", name: "Summer Drop 2026", type: "ppv_drop",
    currentStep: "pricing",
    audience: { segmentId: "sg1", segmentName: "Whales + VIP actifs", fanCount: 48 },
    content: { productName: "Summer Collection — 30 photos", description: "Shooting été exclusif, lumière naturelle, 3 lieux différents", mediaCount: 30 },
    pricing: { basePrice: 89.99, discountPercent: 10, expectedRevenue: 3900 },
    complianceStatus: "pending", complianceNotes: null,
    createdAt: daysAgo(5), estimatedSendDate: null,
  },
  {
    id: "cb2", name: "Pack Fidélité Q2", type: "bundle_launch",
    currentStep: "compliance",
    audience: { segmentId: "sg1", segmentName: "Whales + VIP actifs", fanCount: 48 },
    content: { productName: "Bundle Best-Of — 5 vidéos + 2 photosets", description: "Compilation des meilleurs contenus du trimestre", mediaCount: 7 },
    pricing: { basePrice: 149.99, discountPercent: 25, expectedRevenue: 5400 },
    complianceStatus: "flagged", complianceNotes: "Vérifier les droits musique de la vidéo #3",
    createdAt: daysAgo(10), estimatedSendDate: daysAgo(1),
  },
  {
    id: "cb3", name: "Winback — Anciens whales", type: "reengagement",
    currentStep: "review",
    audience: { segmentId: "sg5", segmentName: "Gros dépensiers US", fanCount: 32 },
    content: { productName: "Preview gratuit + offre spéciale", description: "Message personnel de réengagement avec preview offert", mediaCount: 3 },
    pricing: { basePrice: 0, discountPercent: 40, expectedRevenue: 2400 },
    complianceStatus: "passed", complianceNotes: null,
    createdAt: daysAgo(14), estimatedSendDate: daysAgo(2),
  },
];

// ═══ 8. Fan Journey ═══════════════════════════════════════

export interface FanJourneyStage {
  id: string;
  name: string;
  description: string;
  icon: string;
  fanCount: number;
  conversionToNext: number;
  avgDaysInStage: number;
  avgRevenueInStage: number;
}

export const mockFanJourneyStages: FanJourneyStage[] = [
  { id: "fj1", name: "Découverte", description: "Découvre le contenu via réseaux sociaux", icon: "Eye", fanCount: 5000, conversionToNext: 25, avgDaysInStage: 3, avgRevenueInStage: 0 },
  { id: "fj2", name: "Abonnement", description: "S'abonne à la plateforme", icon: "UserCheck", fanCount: 1250, conversionToNext: 60, avgDaysInStage: 14, avgRevenueInStage: 12 },
  { id: "fj3", name: "Premier achat", description: "Achète son premier PPV ou contenu", icon: "DollarSign", fanCount: 750, conversionToNext: 45, avgDaysInStage: 30, avgRevenueInStage: 35 },
  { id: "fj4", name: "Engagement", description: "Achète régulièrement, interagit", icon: "Zap", fanCount: 338, conversionToNext: 30, avgDaysInStage: 60, avgRevenueInStage: 120 },
  { id: "fj5", name: "Fidélisation", description: "VIP/Whale, achats fréquents", icon: "Star", fanCount: 101, conversionToNext: 15, avgDaysInStage: 180, avgRevenueInStage: 450 },
  { id: "fj6", name: "Ambassadeur", description: "Recommande, achète tout, fidèle absolu", icon: "ShieldCheck", fanCount: 15, conversionToNext: 0, avgDaysInStage: 365, avgRevenueInStage: 2500 },
];

// ═══ 9. Opportunity Queue ══════════════════════════════════

export type OpportunityStage = "to_review" | "in_progress" | "sent" | "converted" | "dismissed";
export type OpportunityType = "ppv_upsell" | "reengage" | "upsell_sub" | "custom_request" | "tip_ask" | "welcome_new";

export const OPPORTUNITY_STAGE_LABELS: Record<OpportunityStage, string> = {
  to_review: "À examiner",
  in_progress: "En cours",
  sent: "Envoyé",
  converted: "Converti",
  dismissed: "Ignoré",
};

export const OPPORTUNITY_STAGE_COLORS: Record<OpportunityStage, string> = {
  to_review: "#C9973F",
  in_progress: "#6D28D9",
  sent: "#1D4ED8",
  converted: "#2F7D4E",
  dismissed: "#9A8D7C",
};

export const OPPORTUNITY_TYPE_LABELS: Record<OpportunityType, string> = {
  ppv_upsell: "Upsell PPV",
  reengage: "Réengagement",
  upsell_sub: "Upsell Abo",
  custom_request: "Demande custom",
  tip_ask: "Demande de tip",
  welcome_new: "Accueil nouveau",
};

export const OPPORTUNITY_TYPE_COLORS: Record<OpportunityType, string> = {
  ppv_upsell: "#1D4ED8",
  reengage: "#B45309",
  upsell_sub: "#6D28D9",
  custom_request: "#C9973F",
  tip_ask: "#2F7D4E",
  welcome_new: "#9A8D7C",
};

export interface SalesOpportunity {
  id: string;
  fanName: string;
  fanTier: FanTier;
  type: OpportunityType;
  stage: OpportunityStage;
  potentialRevenue: number;
  confidence: number;
  aiSuggestion: string;
  deadline: string | null;
  assignedTo: string | null;
  createdAt: string;
}

export const mockOpportunities: SalesOpportunity[] = [
  { id: "op1", fanName: "MarcusR", fanTier: "whale", type: "ppv_upsell", stage: "to_review", potentialRevenue: 250, confidence: 92, aiSuggestion: "Nouveau PPV vidéo 4K prêt — early access à $89.99", deadline: daysAgo(-2), assignedTo: "Sophie L.", createdAt: daysAgo(3) },
  { id: "op2", fanName: "LunaStar", fanTier: "vip", type: "custom_request", stage: "in_progress", potentialRevenue: 180, confidence: 88, aiSuggestion: "Bundle personnalisé beach+studio+BTS à $149", deadline: daysAgo(-1), assignedTo: "Sophie L.", createdAt: daysAgo(5) },
  { id: "op3", fanName: "CarlosM", fanTier: "engaged", type: "ppv_upsell", stage: "to_review", potentialRevenue: 120, confidence: 80, aiSuggestion: "Vidéo 15min lumière naturelle à 59.99€", deadline: null, assignedTo: null, createdAt: daysAgo(2) },
  { id: "op4", fanName: "DarkKnight42", fanTier: "dormant", type: "reengage", stage: "to_review", potentialRevenue: 80, confidence: 55, aiSuggestion: "Preview gratuit + soft re-engagement", deadline: daysAgo(-3), assignedTo: "Sophie L.", createdAt: daysAgo(7) },
  { id: "op5", fanName: "MegaSpender_Dubai", fanTier: "whale", type: "custom_request", stage: "in_progress", potentialRevenue: 2500, confidence: 95, aiSuggestion: "Custom 30min — approbation manager obligatoire", deadline: daysAgo(-1), assignedTo: "Sophie L.", createdAt: daysAgo(1) },
  { id: "op6", fanName: "Emma_W", fanTier: "engaged", type: "upsell_sub", stage: "to_review", potentialRevenue: 95, confidence: 75, aiSuggestion: "Pack fidélité 4 mois: bundle spécial à 79€", deadline: null, assignedTo: null, createdAt: daysAgo(2) },
  { id: "op7", fanName: "Tyler_J", fanTier: "engaged", type: "ppv_upsell", stage: "in_progress", potentialRevenue: 45, confidence: 60, aiSuggestion: "Mini set photo 8 exclusivités à $24.99", deadline: null, assignedTo: "Marc D.", createdAt: daysAgo(4) },
  { id: "op8", fanName: "Priya_K", fanTier: "new", type: "welcome_new", stage: "sent", potentialRevenue: 35, confidence: 70, aiSuggestion: "Welcome bundle 3 best-sellers à -40%", deadline: daysAgo(-1), assignedTo: null, createdAt: daysAgo(1) },
  { id: "op9", fanName: "Nico_Art", fanTier: "new", type: "reengage", stage: "dismissed", potentialRevenue: 60, confidence: 40, aiSuggestion: "Preview gratuit shooting extérieur forêt", deadline: null, assignedTo: null, createdAt: daysAgo(10) },
  { id: "op10", fanName: "ItalianoFan", fanTier: "at_risk", type: "reengage", stage: "to_review", potentialRevenue: 70, confidence: 45, aiSuggestion: "Message personnalisé + contenu sur-mesure proposé", deadline: daysAgo(-1), assignedTo: null, createdAt: daysAgo(3) },
  { id: "op11", fanName: "Alex_1996", fanTier: "engaged", type: "upsell_sub", stage: "sent", potentialRevenue: 50, confidence: 65, aiSuggestion: "Offre promo -30% premier mois OF", deadline: daysAgo(-2), assignedTo: "Marc D.", createdAt: daysAgo(5) },
  { id: "op12", fanName: "K-Pop_Fan", fanTier: "new", type: "welcome_new", stage: "converted", potentialRevenue: 25, confidence: 85, aiSuggestion: "Migration TikTok → OF, lien bio + preview gratuit", deadline: null, assignedTo: null, createdAt: daysAgo(7) },
];

// ═══ 10. Team Control Room ═════════════════════════════════

export interface TeamMember {
  id: string;
  name: string;
  role: "manager" | "chatter" | "compliance";
  avatar: string | null;
  conversationsActive: number;
  draftsReady: number;
  revenueGenerated: number;
  lastActive: string;
  status: "online" | "away" | "offline";
}

export interface TeamActivity {
  id: string;
  memberId: string;
  action: string;
  detail: string;
  timestamp: string;
  revenue: number | null;
}

export const mockTeamMembers: TeamMember[] = [
  { id: "tm1", name: "Sophie L.", role: "manager", avatar: null, conversationsActive: 12, draftsReady: 8, revenueGenerated: 14500, lastActive: ago(2), status: "online" },
  { id: "tm2", name: "Marc D.", role: "chatter", avatar: null, conversationsActive: 8, draftsReady: 3, revenueGenerated: 6800, lastActive: ago(15), status: "online" },
  { id: "tm3", name: "Julie M.", role: "chatter", avatar: null, conversationsActive: 5, draftsReady: 6, revenueGenerated: 4200, lastActive: ago(45), status: "away" },
  { id: "tm4", name: "Thomas R.", role: "compliance", avatar: null, conversationsActive: 0, draftsReady: 0, revenueGenerated: 0, lastActive: daysAgo(1), status: "offline" },
  { id: "tm5", name: "Léa K.", role: "chatter", avatar: null, conversationsActive: 10, draftsReady: 4, revenueGenerated: 8900, lastActive: ago(5), status: "online" },
];

export const mockTeamActivity: TeamActivity[] = [
  { id: "ta1", memberId: "tm1", action: "Approbation draft", detail: "A validé le message pour MarcusR — PPV $89.99", timestamp: ago(15), revenue: 89.99 },
  { id: "ta2", memberId: "tm2", action: "Message envoyé", detail: "Réponse à Tyler_J — Mini set $24.99", timestamp: ago(25), revenue: 24.99 },
  { id: "ta3", memberId: "tm5", action: "Draft généré", detail: "3 suggestions pour Emma_W — Pack fidélité", timestamp: ago(30), revenue: null },
  { id: "ta4", memberId: "tm1", action: "Escalade", detail: "Custom request MegaSpender_Dubai → validation manager", timestamp: ago(45), revenue: null },
  { id: "ta5", memberId: "tm3", action: "Revue conformité", detail: "A vérifié campagne 'Pack Fidélité Q2' — flagged musique", timestamp: ago(60), revenue: null },
  { id: "ta6", memberId: "tm2", action: "Tag ajouté", detail: "Alex_1996 taggé 'ig_migrated'", timestamp: ago(90), revenue: null },
  { id: "ta7", memberId: "tm5", action: "Message envoyé", detail: "Réponse à CarlosM — Vidéo 59.99€", timestamp: ago(120), revenue: 59.99 },
  { id: "ta8", memberId: "tm1", action: "Règle modifiée", detail: "A activé 'Promo après 3 achats'", timestamp: daysAgo(1), revenue: null },
  { id: "ta9", memberId: "tm4", action: "Revue conformité", detail: "A vérifié demande IRL HotShot23 → refusé", timestamp: daysAgo(1, 2), revenue: null },
  { id: "ta10", memberId: "tm5", action: "Approbation draft", detail: "A validé le message pour Priya_K — Welcome bundle", timestamp: daysAgo(1, 4), revenue: 34.99 },
  { id: "ta11", memberId: "tm3", action: "Message envoyé", detail: "Réponse à LunaStar — Bundle $149", timestamp: daysAgo(2), revenue: 149 },
  { id: "ta12", memberId: "tm1", action: "Rapport généré", detail: "Rapport hebdo: 28 ventes, 4.2k€ CA", timestamp: daysAgo(3), revenue: 4200 },
];

// ═══ 11. Compliance Review Queue ═══════════════════════════

export interface ComplianceReviewItem {
  id: string;
  type: "message" | "ppv_content" | "campaign" | "fan_request";
  content: string;
  riskScore: number;
  riskCategory: "language" | "pricing" | "boundary" | "tos" | "copyright";
  flaggedBy: "ai" | "human" | "platform";
  status: "pending" | "approved" | "rejected" | "escalated";
  createdAt: string;
  reviewer: string | null;
  notes: string | null;
}

export const RISK_CATEGORY_LABELS: Record<ComplianceReviewItem["riskCategory"], string> = {
  language: "Langage",
  pricing: "Tarification",
  boundary: "Limite",
  tos: "CGU",
  copyright: "Droits d'auteur",
};

export const mockComplianceItems: ComplianceReviewItem[] = [
  { id: "cr1", type: "message", content: "Draft pour HotShot23: réponse à demande IRL — refuse fermement, redirige vers contenu", riskScore: 85, riskCategory: "boundary", flaggedBy: "ai", status: "pending", createdAt: ago(25), reviewer: null, notes: "Demande IRL répétée. Vérifier le ton de la réponse." },
  { id: "cr2", type: "ppv_content", content: "Vidéo 'Late Night Vibes' — vérifier les droits de la musique de fond (claim automatique)", riskScore: 60, riskCategory: "copyright", flaggedBy: "platform", status: "pending", createdAt: daysAgo(2), reviewer: null, notes: "Détection automatique OF. Remplacer ou licence." },
  { id: "cr3", type: "campaign", content: "Campagne 'Pack Fidélité Q2' — musique vidéo #3 flagged", riskScore: 50, riskCategory: "copyright", flaggedBy: "platform", status: "escalated", createdAt: daysAgo(3), reviewer: "Thomas R.", notes: "En attente de licence ou remplacement piste audio." },
  { id: "cr4", type: "message", content: "Draft pour Emma_W: 'exklusives Treue-Paket' — vérifier pricing conforme CGU", riskScore: 25, riskCategory: "pricing", flaggedBy: "ai", status: "approved", createdAt: daysAgo(1), reviewer: "Sophie L.", notes: "Prix conforme, pas de problème." },
  { id: "cr5", type: "fan_request", content: "MegaSpender_Dubai demande custom 30min à $2500 — approbation manager + vérification âge", riskScore: 70, riskCategory: "tos", flaggedBy: "ai", status: "pending", createdAt: ago(60), reviewer: null, notes: "Vérifier âge fan + limites de prix plateforme." },
  { id: "cr6", type: "message", content: "Draft pour DarkKnight42: message de réengagement — éviter language trop commercial (spam risk)", riskScore: 30, riskCategory: "language", flaggedBy: "ai", status: "approved", createdAt: daysAgo(2), reviewer: "Sophie L.", notes: "Ton OK, soft re-engagement." },
  { id: "cr7", type: "ppv_content", content: "Photo set 'Golden Hour' — vérifier qu'aucune métadonnée de localisation n'est présente", riskScore: 45, riskCategory: "tos", flaggedBy: "human", status: "pending", createdAt: daysAgo(1), reviewer: null, notes: "Check EXIF avant publication." },
  { id: "cr8", type: "message", content: "Draft pour K-Pop_Fan: lien TikTok → OF — vérifier conformité CGU TikTok", riskScore: 55, riskCategory: "tos", flaggedBy: "ai", status: "pending", createdAt: daysAgo(1, 6), reviewer: null, notes: "Pas de lien direct. Utiliser 'lien dans la bio'." },
];

// ═══ 12. Why Atlas is safer ════════════════════════════════

export interface SafetyReason {
  id: string;
  title: string;
  description: string;
  icon: string;
  highlight: string;
}

export const mockSafetyReasons: SafetyReason[] = [
  { id: "sr1", title: "Validation humaine obligatoire", description: "Chaque message proposé par l'IA doit être relu, modifié si besoin, et validé par un humain avant envoi. Aucun envoi automatique.", icon: "UserCheck", highlight: "100% des messages validés par un humain" },
  { id: "sr2", title: "Conformité automatisée", description: "L'IA analyse chaque conversation en temps réel et détecte les risques: demandes IRL, langage interdit, pricing hors normes.", icon: "ShieldCheck", highlight: "98.5% des risques détectés avant envoi" },
  { id: "sr3", title: "Barrières de sécurité programmables", description: "Définis tes propres règles: mots interdits, limites de prix, fréquence maximale d'envoi. La plateforme bloque automatiquement.", icon: "Settings", highlight: "12 règles de sécurité actives" },
  { id: "sr4", title: "Traçabilité complète", description: "Chaque action est horodatée et attribuée: qui a généré, qui a modifié, qui a validé, qui a envoyé. Audit trail complet.", icon: "FileCheck", highlight: "100% des actions tracées" },
  { id: "sr5", title: "Respect des CGU plateformes", description: "Base de connaissance des CGU OnlyFans, Fansly, MYM, Fanvue. L'IA vérifie chaque contenu avant publication.", icon: "Lock", highlight: "0 infractions CGU depuis le lancement" },
  { id: "sr6", title: "Protection des créatrices", description: "Détection proactive du harcèlement, des demandes abusives, et des comportements toxiques. Escalade automatique au manager.", icon: "AlertTriangle", highlight: "45 incidents évités ce mois" },
];

// ═══ 13. Safety Guard ══════════════════════════════════════

export interface SafetyGuardSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: "low" | "medium" | "high" | "critical";
  category: "content" | "pricing" | "frequency" | "language" | "boundary" | "tos";
  adminOnly: boolean;
}

export const GUARD_CATEGORY_LABELS: Record<SafetyGuardSetting["category"], string> = {
  content: "Contenu",
  pricing: "Tarification",
  frequency: "Fréquence",
  language: "Langage",
  boundary: "Limites",
  tos: "CGU",
};

export const mockGuardSettings: SafetyGuardSetting[] = [
  { id: "gs1", name: "Blocage demande IRL", description: "Détecte et bloque les messages contenant des demandes de rencontre physique", enabled: true, severity: "critical", category: "boundary", adminOnly: true },
  { id: "gs2", name: "Limite de prix PPV", description: "Alerte si un prix suggéré dépasse 500€ (custom) ou 200€ (standard)", enabled: true, severity: "high", category: "pricing", adminOnly: false },
  { id: "gs3", name: "Filtre langage abusif", description: "Détecte les insultes, menaces, et langage toxique dans les deux sens", enabled: true, severity: "critical", category: "language", adminOnly: true },
  { id: "gs4", name: "Limite fréquence envoi", description: "Max 3 messages par fan par jour pour éviter le spam", enabled: true, severity: "medium", category: "frequency", adminOnly: false },
  { id: "gs5", name: "Détection coordonnées perso", description: "Bloque les messages contenant numéro de téléphone, adresse, email personnel", enabled: true, severity: "high", category: "boundary", adminOnly: true },
  { id: "gs6", name: "Vérification âge contenu", description: "Vérifie que le contenu PPV est adapté et ne contient pas de matériel restreint", enabled: true, severity: "critical", category: "content", adminOnly: true },
  { id: "gs7", name: "Alerte prix anormal", description: "Alerte si un prix est 50% au-dessus ou en-dessous de la moyenne du marché", enabled: true, severity: "medium", category: "pricing", adminOnly: false },
  { id: "gs8", name: "Détection spam", description: "Détecte les messages répétitifs ou trop similaires envoyés à plusieurs fans", enabled: true, severity: "medium", category: "frequency", adminOnly: false },
  { id: "gs9", name: "Vérification copyright musique", description: "Analyse automatique des pistes audio dans les PPV vidéo", enabled: true, severity: "high", category: "content", adminOnly: false },
  { id: "gs10", name: "Protection mineurs", description: "Vérification renforcée de l'âge des fans pour tout contenu sensible", enabled: true, severity: "critical", category: "tos", adminOnly: true },
];

// ═══ 14. AI Core Settings ═══════════════════════════════════

type AiCoreMode = "manual_only" | "ai_draft_assist" | "hybrid_qualification" | "full_ai_simulation";

const AI_CORE_MODE_LABELS: Record<AiCoreMode, string> = {
  manual_only: "Manual Only — Aucune IA, 100% humain",
  ai_draft_assist: "AI Draft Assist — L'IA suggère, l'humain valide",
  hybrid_qualification: "Hybrid Qualification — IA qualifie + draft, humain approuve",
  full_ai_simulation: "Full AI Simulation — Preview only, aucun envoi",
};

const AI_CORE_MODE_COLORS: Record<AiCoreMode, string> = {
  manual_only: "#9A8D7C",
  ai_draft_assist: "#C9973F",
  hybrid_qualification: "#6D28D9",
  full_ai_simulation: "#1D4ED8",
};

interface AiCoreSettings {
  mode: AiCoreMode;
  autoGenerateOnNewMessage: boolean;
  maxDraftsPerConversation: number;
  requireHumanApproval: boolean;
  simulationPreviewOnly: boolean;
  modelTemperature: number;
  languages: string[];
}

const mockAiCoreSettings: AiCoreSettings = {
  mode: "ai_draft_assist",
  autoGenerateOnNewMessage: true,
  maxDraftsPerConversation: 3,
  requireHumanApproval: true,
  simulationPreviewOnly: false,
  modelTemperature: 0.7,
  languages: ["fr", "en", "es", "de"],
};

// ═══ 15. Hybrid Handoff Rules ════════════════════════════════

interface HandoffRule {
  id: string;
  name: string;
  condition: "spend_threshold" | "subscription_age" | "vip_segment" | "custom";
  operator: ">" | "<" | ">=" | "<=" | "=";
  value: string;
  action: "human_only" | "ai_suggest" | "ai_full" | "flag_review";
  isEnabled: boolean;
}

interface HandoffRuleGroup {
  id: string;
  label: string;
  logic: "AND" | "OR";
  rules: HandoffRule[];
}

const HANDOFF_ACTION_LABELS: Record<HandoffRule["action"], string> = {
  human_only: "Humain uniquement",
  ai_suggest: "IA suggère",
  ai_full: "IA gère (preview)",
  flag_review: "Marquer révision",
};

const mockHandoffRules: HandoffRuleGroup[] = [
  {
    id: "hg1", label: "Gros dépensiers", logic: "OR",
    rules: [
      { id: "hr1", name: "Dépenses > 5 000€", condition: "spend_threshold", operator: ">", value: "5000", action: "human_only", isEnabled: true },
      { id: "hr2", name: "VIP depuis 6+ mois", condition: "subscription_age", operator: ">=", value: "180", action: "human_only", isEnabled: true },
    ],
  },
  {
    id: "hg2", label: "Nouveaux fans", logic: "AND",
    rules: [
      { id: "hr3", name: "Abonnement < 30j", condition: "subscription_age", operator: "<", value: "30", action: "ai_suggest", isEnabled: true },
      { id: "hr4", name: "Dépenses < 500€", condition: "spend_threshold", operator: "<", value: "500", action: "ai_suggest", isEnabled: true },
    ],
  },
  {
    id: "hg3", label: "Fans à risque", logic: "OR",
    rules: [
      { id: "hr5", name: "Segment VIP inactif 30j", condition: "vip_segment", operator: "=", value: "at_risk", action: "flag_review", isEnabled: true },
      { id: "hr6", name: "Dépenses en baisse -50%", condition: "custom", operator: "<", value: "-50", action: "flag_review", isEnabled: true },
    ],
  },
  {
    id: "hg4", label: "Demandes custom complexes", logic: "AND",
    rules: [
      { id: "hr7", name: "Custom > 500€", condition: "spend_threshold", operator: ">", value: "500", action: "human_only", isEnabled: true },
      { id: "hr8", name: "Fan non-VIP", condition: "vip_segment", operator: "=", value: "non_vip", action: "human_only", isEnabled: false },
    ],
  },
];

// ═══ 16. Script Builder / PPV Ladder ═════════════════════════

interface PpvLadderStep {
  id: string;
  order: number;
  type: "free_teaser" | "ppv_step" | "upsell" | "cta";
  title: string;
  content: string;
  price: number | null;
  delayAfterPrevious: string;
  isRequired: boolean;
}

interface PpvLadderScript {
  id: string;
  name: string;
  description: string;
  targetTier: FanTier;
  totalSteps: number;
  estimatedRevenue: number;
  conversionRate: number;
  isActive: boolean;
  steps: PpvLadderStep[];
}

const ppvSteps1: PpvLadderStep[] = [
  { id: "ps1-1", order: 1, type: "free_teaser", title: "Teaser gratuit — Photo preview", content: "Hey ! J'ai préparé un shooting exclusif rien que pour mes fans fidèles. Regarde ce petit aperçu gratuit 👇", price: null, delayAfterPrevious: "0h", isRequired: true },
  { id: "ps1-2", order: 2, type: "ppv_step", title: "PPV Step 1 — Mini set (8 photos)", content: "Le set complet est dispo ! 8 photos exclusives, lumière naturelle. Prix early access réservé aux premiers.", price: 19.99, delayAfterPrevious: "4h", isRequired: true },
  { id: "ps1-3", order: 3, type: "ppv_step", title: "PPV Step 2 — Set complet (20 photos + BTS)", content: "Tu as aimé le mini set ? Le pack complet avec 20 photos et les coulisses du shooting est prêt. Qualité 4K.", price: 49.99, delayAfterPrevious: "24h", isRequired: false },
  { id: "ps1-4", order: 4, type: "upsell", title: "Upsell — Bundle fidélité", content: "Vu que tu es un fan engagé, j'ai un bundle spécial : les 3 derniers shootings + 2 vidéos inédites. Offre limitée.", price: 89.99, delayAfterPrevious: "48h", isRequired: false },
  { id: "ps1-5", order: 5, type: "cta", title: "CTA final — Rappel + remerciement", content: "Merci pour ton soutien ! Les offres exclusives expirent dans 24h. Reste connecté pour la suite 🔥", price: null, delayAfterPrevious: "72h", isRequired: false },
];

const ppvSteps2: PpvLadderStep[] = [
  { id: "ps2-1", order: 1, type: "free_teaser", title: "Teaser — Preview vidéo 15s", content: "Salut ! Nouveau contenu en préparation. Un petit extrait de 15 secondes pour te donner l'eau à la bouche 🎬", price: null, delayAfterPrevious: "0h", isRequired: true },
  { id: "ps2-2", order: 2, type: "ppv_step", title: "PPV — Vidéo 5min", content: "La vidéo complète de 5 minutes est disponible. Qualité cinéma, scénario exclusif. Early access à prix réduit.", price: 29.99, delayAfterPrevious: "6h", isRequired: true },
  { id: "ps2-3", order: 3, type: "ppv_step", title: "PPV Premium — Vidéo 15min + photos", content: "Version longue 15 minutes + 10 photos exclusives du tournage. Contenu jamais publié ailleurs.", price: 69.99, delayAfterPrevious: "24h", isRequired: false },
  { id: "ps2-4", order: 4, type: "cta", title: "CTA — Dernière chance", content: "Dernière chance pour l'offre premium ! Les prix remontent dans 12h. Prochaine sortie dans 2 semaines.", price: null, delayAfterPrevious: "72h", isRequired: false },
];

const mockPpvLadderScripts: PpvLadderScript[] = [
  { id: "pps1", name: "Photo Set — Ladder Standard", description: "Entonnoir PPV progressif pour lancement de set photo", targetTier: "engaged", totalSteps: 5, estimatedRevenue: 2450, conversionRate: 12.5, isActive: true, steps: ppvSteps1 },
  { id: "pps2", name: "Vidéo Cinéma — Ladder Premium", description: "Entonnoir PPV 2 niveaux pour contenu vidéo premium", targetTier: "vip", totalSteps: 4, estimatedRevenue: 4800, conversionRate: 8.2, isActive: true, steps: ppvSteps2 },
  { id: "pps3", name: "Welcome — Ladder Nouveaux", description: "Séquence d'accueil pour nouveaux abonnés", targetTier: "new", totalSteps: 3, estimatedRevenue: 1200, conversionRate: 22.0, isActive: false, steps: [ppvSteps1[0], ppvSteps1[1], ppvSteps1[4]] },
];

// ═══ 17. Message Ledger ══════════════════════════════════════

interface MessageLedgerEntry {
  id: string;
  fanName: string;
  fanTier: FanTier;
  contentPreview: string;
  direction: "inbound" | "outbound";
  creatorName: string;
  status: "draft" | "approved" | "sent" | "flagged";
  revenue: number | null;
  channel: string;
  createdAt: string;
  approvedBy: string | null;
}

const mockMessageLedger: MessageLedgerEntry[] = [
  { id: "ml1", fanName: "MarcusR", fanTier: "whale", contentPreview: "Hey Marcus! The new video just dropped — exclusive 4K...", direction: "outbound", creatorName: "Sophie L.", status: "sent", revenue: 89.99, channel: "OF", createdAt: daysAgo(1), approvedBy: "Sophie L." },
  { id: "ml2", fanName: "LunaStar", fanTier: "vip", contentPreview: "Hi Luna! Absolutely, I can put together a custom bundle...", direction: "outbound", creatorName: "Sophie L.", status: "approved", revenue: 149, channel: "Fansly", createdAt: daysAgo(1, 4), approvedBy: "Sophie L." },
  { id: "ml3", fanName: "CarlosM", fanTier: "engaged", contentPreview: "¡Claro Carlos! Acabo de terminar un video nuevo...", direction: "outbound", creatorName: "Marc D.", status: "draft", revenue: 59.99, channel: "OF", createdAt: ago(30), approvedBy: null },
  { id: "ml4", fanName: "HotShot23", fanTier: "engaged", contentPreview: "I appreciate your enthusiasm, but I keep all interactions...", direction: "outbound", creatorName: "Sophie L.", status: "flagged", revenue: null, channel: "OF", createdAt: ago(25), approvedBy: null },
  { id: "ml5", fanName: "Emma_W", fanTier: "engaged", contentPreview: "Emma, du bist großartig! Weil du seit 4 Monaten...", direction: "outbound", creatorName: "Léa K.", status: "sent", revenue: 79, channel: "OF", createdAt: daysAgo(2), approvedBy: "Sophie L." },
  { id: "ml6", fanName: "MegaSpender_Dubai", fanTier: "whale", contentPreview: "Wow, thank you for this incredible offer! Because this is...", direction: "outbound", creatorName: "Sophie L.", status: "approved", revenue: 2500, channel: "OF", createdAt: daysAgo(1), approvedBy: "Sophie L." },
  { id: "ml7", fanName: "Tyler_J", fanTier: "engaged", contentPreview: "Hey Tyler! I get it. How about a mini photo set...", direction: "outbound", creatorName: "Marc D.", status: "sent", revenue: 24.99, channel: "OF", createdAt: daysAgo(1, 12), approvedBy: "Marc D." },
  { id: "ml8", fanName: "Priya_K", fanTier: "new", contentPreview: "Welcome Priya! So happy to have you 🎉 I post exclusive...", direction: "outbound", creatorName: "Léa K.", status: "sent", revenue: 34.99, channel: "Fanvue", createdAt: daysAgo(1), approvedBy: "Léa K." },
  { id: "ml9", fanName: "DarkKnight42", fanTier: "dormant", contentPreview: "Hey! Missed you around here 💫 I just dropped a new series...", direction: "outbound", creatorName: "Julie M.", status: "draft", revenue: null, channel: "OF", createdAt: daysAgo(2), approvedBy: null },
  { id: "ml10", fanName: "MarcusR", fanTier: "whale", contentPreview: "That last video was incredible!", direction: "inbound", creatorName: "—", status: "sent", revenue: null, channel: "OF", createdAt: daysAgo(5), approvedBy: null },
  { id: "ml11", fanName: "Nico_Art", fanTier: "new", contentPreview: "Salut ! Tu fais des shootings photo en extérieur ?", direction: "inbound", creatorName: "—", status: "sent", revenue: null, channel: "MYM", createdAt: ago(90), approvedBy: null },
  { id: "ml12", fanName: "LunaStar", fanTier: "vip", contentPreview: "Can you do a custom bundle with the beach and studio...", direction: "inbound", creatorName: "—", status: "sent", revenue: null, channel: "Fansly", createdAt: ago(45), approvedBy: null },
];

// ═══ 18. Banned Keywords / Safety Rules ══════════════════════

interface BannedKeyword {
  id: string;
  keyword: string;
  category: "system" | "custom";
  severity: "critical" | "high" | "medium" | "low";
  appliesTo: ("drafts" | "templates" | "manual")[];
  replacement: string | null;
  isEnabled: boolean;
  createdAt: string;
}

const BANNED_CATEGORY_LABELS: Record<BannedKeyword["category"], string> = {
  system: "Système",
  custom: "Personnalisé",
};

const BANNED_APPLIES_TO_LABELS: Record<string, string> = {
  drafts: "Brouillons IA",
  templates: "Templates",
  manual: "Messages manuels",
};

const mockBannedKeywords: BannedKeyword[] = [
  { id: "bk1", keyword: "meet", category: "system", severity: "critical", appliesTo: ["drafts", "templates", "manual"], replacement: "interagir sur la plateforme", isEnabled: true, createdAt: daysAgo(90) },
  { id: "bk2", keyword: "WhatsApp", category: "system", severity: "critical", appliesTo: ["drafts", "templates", "manual"], replacement: "messagerie de la plateforme", isEnabled: true, createdAt: daysAgo(90) },
  { id: "bk3", keyword: "phone number", category: "system", severity: "high", appliesTo: ["drafts", "templates", "manual"], replacement: null, isEnabled: true, createdAt: daysAgo(90) },
  { id: "bk4", keyword: "Instagram", category: "custom", severity: "high", appliesTo: ["drafts", "manual"], replacement: "réseau social", isEnabled: true, createdAt: daysAgo(30) },
  { id: "bk5", keyword: "discount", category: "custom", severity: "medium", appliesTo: ["drafts"], replacement: "offre spéciale", isEnabled: true, createdAt: daysAgo(14) },
  { id: "bk6", keyword: "free", category: "custom", severity: "medium", appliesTo: ["drafts", "templates"], replacement: "offert", isEnabled: true, createdAt: daysAgo(7) },
  { id: "bk7", keyword: "address", category: "system", severity: "critical", appliesTo: ["drafts", "templates", "manual"], replacement: null, isEnabled: true, createdAt: daysAgo(90) },
  { id: "bk8", keyword: "PayPal", category: "system", severity: "high", appliesTo: ["drafts", "templates", "manual"], replacement: "paiement via la plateforme", isEnabled: true, createdAt: daysAgo(90) },
  { id: "bk9", keyword: "irl", category: "system", severity: "critical", appliesTo: ["drafts", "templates", "manual"], replacement: null, isEnabled: true, createdAt: daysAgo(90) },
  { id: "bk10", keyword: "baby", category: "custom", severity: "low", appliesTo: ["drafts"], replacement: null, isEnabled: false, createdAt: daysAgo(45) },
];

// ═══ 19. Creator Intelligence Profile ════════════════════════

interface CreatorProfile {
  id: string;
  persona: string;
  timezone: string;
  activeHours: string;
  languages: string[];
  tone: "chaleureux" | "professionnel" | "joueuse" | "intime" | "minimal";
  boundaries: string[];
  doRules: string[];
  dontRules: string[];
  platforms: Platform[];
  bio: string;
}

const CREATOR_TONE_LABELS: Record<CreatorProfile["tone"], string> = {
  chaleureux: "Chaleureux",
  professionnel: "Professionnel",
  joueuse: "Joueuse",
  intime: "Intime",
  minimal: "Minimal",
};

const mockCreatorProfile: CreatorProfile = {
  id: "cp1",
  persona: "Créatrice lifestyle & bien-être, 28 ans, Paris",
  timezone: "Europe/Paris (UTC+2)",
  activeHours: "10h-13h, 15h-19h, 21h-23h",
  languages: ["fr", "en"],
  tone: "chaleureux",
  boundaries: [
    "Pas de rencontre IRL",
    "Pas de partage d'informations personnelles",
    "Pas de contenu hors plateforme",
    "Respect des limites de prix minimum",
  ],
  doRules: [
    "Toujours remercier les fans fidèles",
    "Proposer des offres personnalisées aux whales",
    "Utiliser le ton chaleureux pour les premiers messages",
    "Partager des aperçus exclusifs en premier",
  ],
  dontRules: [
    "Ne jamais répondre aux demandes de rencontre",
    "Ne pas partager de numéro de téléphone",
    "Ne pas faire de prix en dessous du minimum",
    "Ne pas spammer les fans inactifs",
  ],
  platforms: ["OF", "Fansly", "IG", "TT"],
  bio: "Créatrice de contenu lifestyle depuis 3 ans. Spécialisée en photographie naturelle et bien-être. Communauté de 15k+ fans fidèles.",
};

// ═══ 20. Notifications Center ════════════════════════════════

type NotificationChannel = "in_app" | "email" | "push" | "slack";

interface NotificationItem {
  id: string;
  type: "purchase" | "new_message" | "handover" | "new_subscriber" | "draft_ready" | "compliance_flag" | "revenue_milestone";
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  priority: "high" | "medium" | "low";
  channels: NotificationChannel[];
  revenue: number | null;
}

const NOTIF_TYPE_LABELS: Record<NotificationItem["type"], string> = {
  purchase: "Achat",
  new_message: "Nouveau message",
  handover: "Transfert",
  new_subscriber: "Nouvel abonné",
  draft_ready: "Brouillon IA prêt",
  compliance_flag: "Alerte conformité",
  revenue_milestone: "Palier de revenu",
};

const NOTIF_CHANNEL_LABELS: Record<NotificationChannel, string> = {
  in_app: "In-app",
  email: "Email",
  push: "Push",
  slack: "Slack",
};

const mockNotifications: NotificationItem[] = [
  { id: "not1", type: "purchase", title: "MarcusR a acheté le PPV 4K", description: "Achat de 89.99€ — Vidéo 'Cinematic BTS'", timestamp: ago(15), isRead: false, priority: "high", channels: ["in_app", "email"], revenue: 89.99 },
  { id: "not2", type: "new_message", title: "Nouveau message de LunaStar", description: "Demande de bundle personnalisé beach+studio", timestamp: ago(45), isRead: false, priority: "medium", channels: ["in_app"], revenue: null },
  { id: "not3", type: "handover", title: "MegaSpender_Dubai transféré à Sophie", description: "Custom request 2 500€ — approbation manager", timestamp: ago(60), isRead: true, priority: "high", channels: ["in_app", "push", "slack"], revenue: 2500 },
  { id: "not4", type: "new_subscriber", title: "3 nouveaux abonnés aujourd'hui", description: "Priya_K (Fanvue), Alex_1996 (OF), K-Pop_Fan (OF)", timestamp: daysAgo(1), isRead: true, priority: "low", channels: ["in_app", "email"], revenue: null },
  { id: "not5", type: "draft_ready", title: "Brouillons IA prêts — 5 conversations", description: "Drafts générés pour MarcusR, CarlosM, Emma_W, Tyler_J, Priya_K", timestamp: ago(5), isRead: false, priority: "medium", channels: ["in_app"], revenue: null },
  { id: "not6", type: "compliance_flag", title: "⚠️ Alerte conformité — HotShot23", description: "Demande IRL détectée — révision humaine obligatoire", timestamp: ago(25), isRead: false, priority: "high", channels: ["in_app", "push", "email", "slack"], revenue: null },
  { id: "not7", type: "revenue_milestone", title: "Palier 15 000€ atteint ce mois ! 🎉", description: "+23% vs mois dernier. Top performer: Sophie L.", timestamp: daysAgo(2), isRead: true, priority: "medium", channels: ["in_app", "email", "slack"], revenue: 15000 },
  { id: "not8", type: "purchase", title: "LunaStar a acheté le bundle 149€", description: "Bundle personnalisé beach+studio+BTS", timestamp: daysAgo(1), isRead: true, priority: "high", channels: ["in_app", "email"], revenue: 149 },
  { id: "not9", type: "new_message", title: "Nouveau message de CarlosM", description: "Demande contenu en espagnol", timestamp: ago(30), isRead: true, priority: "low", channels: ["in_app"], revenue: null },
  { id: "not10", type: "draft_ready", title: "Brouillon prêt — DarkKnight42", description: "Message de réengagement soft pour fan dormant", timestamp: daysAgo(1), isRead: true, priority: "low", channels: ["in_app"], revenue: null },
  { id: "not11", type: "compliance_flag", title: "⚠️ Copyright musique — Vidéo #3", description: "Campagne 'Pack Fidélité Q2' — piste audio à vérifier", timestamp: daysAgo(3), isRead: true, priority: "high", channels: ["in_app", "email"], revenue: null },
  { id: "not12", type: "handover", title: "3 conversations réassignées à Léa K.", description: "Round-robin automatique — charge équilibrée", timestamp: daysAgo(1, 8), isRead: true, priority: "low", channels: ["in_app"], revenue: null },
];

// ═══ 21. Creative Engine / AI Reels ═══════════════════════════

interface AiReel {
  id: string;
  title: string;
  description: string;
  platform: "IG" | "TT" | "YT_Shorts";
  duration: string;
  hook: string;
  body: string;
  cta: string;
  viralScore: number;
  trendAlignment: string;
  status: "draft" | "reviewed" | "approved" | "published";
  reviewedBy: string | null;
  createdAt: string;
  thumbnailConcept: string;
}

const REEL_PLATFORM_LABELS: Record<AiReel["platform"], string> = {
  IG: "Instagram Reels",
  TT: "TikTok",
  YT_Shorts: "YouTube Shorts",
};

const mockAiReels: AiReel[] = [
  {
    id: "ar1", title: "Morning Routine — Behind the Content", description: "Aperçu authentique du processus créatif matinal", platform: "IG",
    hook: "Tu te demandes comment je crée mon contenu ? Voici les coulisses de ma morning routine ✨", body: "Plan de la vidéo : 1) Réveil et setup lumière naturelle, 2) Sélection des tenues pour le shooting, 3) Test des angles caméra, 4) Premier clic du jour, 5) Résultat final vs making-of",
    cta: "Abonne-toi pour voir le résultat complet sur ma plateforme 🔗 lien en bio", duration: "45s", viralScore: 87, trendAlignment: "Morning routines, BTS creator, Authentic content", status: "draft", reviewedBy: null, createdAt: daysAgo(2), thumbnailConcept: "Split screen — gauche: pyjama/cheveux en désordre, droite: maquillée/prête, texte 'The Glow Up'",
  },
  {
    id: "ar2", title: "PPV Teaser — Golden Hour Set", description: "Teaser cinématique pour le nouveau set photo", platform: "TT",
    hook: "POV : Tu viens de découvrir le set photo le plus attendu de l'année 🔥", body: "Montage rapide des 5 meilleurs clichés du set Golden Hour, transition fluides, musique tendance. Texte overlay : 'Golden Hour Collection — Disponible maintenant'",
    cta: "Lien dans ma bio pour le set complet 💛", duration: "30s", viralScore: 92, trendAlignment: "POV trend, Cinematic transitions, Photo dump", status: "reviewed", reviewedBy: "Sophie L.", createdAt: daysAgo(4), thumbnailConcept: "Photo la plus striking du set avec filtre doré et texte 'GOLDEN HOUR' en typo élégante",
  },
  {
    id: "ar3", title: "Fan Q&A — They Asked, I Answered", description: "Réponse aux questions les plus demandées par les fans", platform: "TT",
    hook: "Vous m'avez posé 500+ questions... voici les réponses aux 5 plus demandées 💬", body: "Questions: 1) Comment j'ai commencé, 2) Mon setup photo, 3) Combien de temps pour un shooting, 4) Mes inspirations, 5) Conseils pour débuter. Format: face cam, ton authentique, fond neutre.",
    cta: "Plus de contenu exclusif sur ma page 👆", duration: "60s", viralScore: 75, trendAlignment: "Q&A format, Transparency trend", status: "draft", reviewedBy: null, createdAt: daysAgo(1), thumbnailConcept: "Photo portrait souriante avec bulles de questions en overlay",
  },
  {
    id: "ar4", title: "The BTS No One Sees", description: "Les coulisses drôles et les ratés du shooting", platform: "IG",
    hook: "Ce que les fans ne voient jamais... Les coulisses (pas toujours glamour) d'un shooting photo 😂", body: "Compilation des moments drôles: trébucher sur le décor, le vent qui ruine la coiffure, les poses ratées, le chat qui entre dans le cadre. Ton humoristique et authentique.",
    cta: "Le résultat final (bien meilleur!) est dispo sur mon profil 🤍", duration: "35s", viralScore: 95, trendAlignment: "BTS fails, Relatable content, Bloopers", status: "reviewed", reviewedBy: "Sophie L.", createdAt: daysAgo(5), thumbnailConcept: "Photo drôle d'un 'raté' avec texte 'Expectation vs Reality'",
  },
];

// ═══ 22. Employee Statistics / Golden Ratio ══════════════════

interface EmployeeStats {
  memberId: string;
  name: string;
  role: string;
  revenueGenerated: number;
  conversationsHandled: number;
  draftsApproved: number;
  draftsRejected: number;
  approvalRate: number;
  avgResponseTime: string;
  goldenRatio: number;
  messagesSent: number;
  revenuePerConversation: number;
}

const mockEmployeeStats: EmployeeStats[] = [
  { memberId: "tm1", name: "Sophie L.", role: "Manager", revenueGenerated: 14500, conversationsHandled: 45, draftsApproved: 38, draftsRejected: 7, approvalRate: 84.4, avgResponseTime: "12min", goldenRatio: 92, messagesSent: 128, revenuePerConversation: 322 },
  { memberId: "tm2", name: "Marc D.", role: "Chatter", revenueGenerated: 6800, conversationsHandled: 32, draftsApproved: 22, draftsRejected: 10, approvalRate: 68.8, avgResponseTime: "28min", goldenRatio: 71, messagesSent: 95, revenuePerConversation: 212 },
  { memberId: "tm5", name: "Léa K.", role: "Chatter", revenueGenerated: 8900, conversationsHandled: 38, draftsApproved: 31, draftsRejected: 7, approvalRate: 81.6, avgResponseTime: "18min", goldenRatio: 78, messagesSent: 112, revenuePerConversation: 234 },
  { memberId: "tm3", name: "Julie M.", role: "Chatter", revenueGenerated: 4200, conversationsHandled: 22, draftsApproved: 15, draftsRejected: 7, approvalRate: 68.2, avgResponseTime: "35min", goldenRatio: 58, messagesSent: 64, revenuePerConversation: 191 },
  { memberId: "tm4", name: "Thomas R.", role: "Compliance", revenueGenerated: 0, conversationsHandled: 0, draftsApproved: 12, draftsRejected: 3, approvalRate: 80.0, avgResponseTime: "N/A", goldenRatio: 0, messagesSent: 0, revenuePerConversation: 0 },
];

// ═══ 23. Roadmap / Feature Requests ══════════════════════════

interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  category: "ai" | "automation" | "compliance" | "revenue" | "team" | "platforms" | "creative";
  upvotes: number;
  status: "planned" | "in_progress" | "shipped" | "under_review";
  requestedBy: string;
  createdAt: string;
  agencyRequest: boolean;
}

const FEATURE_CATEGORY_LABELS: Record<FeatureRequest["category"], string> = {
  ai: "IA",
  automation: "Automation",
  compliance: "Conformité",
  revenue: "Revenu",
  team: "Équipe",
  platforms: "Plateformes",
  creative: "Création",
};

const FEATURE_STATUS_LABELS: Record<FeatureRequest["status"], string> = {
  planned: "Planifié",
  in_progress: "En cours",
  shipped: "Livré",
  under_review: "En revue",
};

const mockFeatureRequests: FeatureRequest[] = [
  { id: "fr1", title: "Multi-plateforme OF + Fansly + MYM", description: "Gérer toutes les plateformes depuis une seule interface unifiée", category: "platforms", upvotes: 89, status: "in_progress", requestedBy: "Top 10 agences", createdAt: daysAgo(60), agencyRequest: true },
  { id: "fr2", title: "Auto-translation des drafts IA", description: "Traduction automatique des brouillons dans la langue du fan", category: "ai", upvotes: 67, status: "planned", requestedBy: "Agences internationales", createdAt: daysAgo(45), agencyRequest: true },
  { id: "fr3", title: "Dashboard revenu temps réel par chatter", description: "Voir le CA généré par chaque membre de l'équipe en direct", category: "revenue", upvotes: 54, status: "under_review", requestedBy: "Managers d'agence", createdAt: daysAgo(30), agencyRequest: true },
  { id: "fr4", title: "IA Reels — Génération automatique", description: "Génération de scripts Reels/TikTok basés sur les tendances", category: "creative", upvotes: 48, status: "in_progress", requestedBy: "Créatrices solo", createdAt: daysAgo(20), agencyRequest: false },
  { id: "fr5", title: "Rapports PDF automatiques hebdomadaires", description: "Génération et envoi automatique de rapports de performance", category: "revenue", upvotes: 43, status: "planned", requestedBy: "Agences", createdAt: daysAgo(35), agencyRequest: true },
  { id: "fr6", title: "Détection de sentiments avancée", description: "Analyse du ton et de l'humeur des fans dans les messages", category: "ai", upvotes: 38, status: "under_review", requestedBy: "Chatters", createdAt: daysAgo(25), agencyRequest: false },
  { id: "fr7", title: "Intégration calendrier éditorial", description: "Planifier les drops et campagnes sur un calendrier visuel", category: "automation", upvotes: 35, status: "planned", requestedBy: "Créatrices", createdAt: daysAgo(15), agencyRequest: false },
  { id: "fr8", title: "Mode vacances intelligent", description: "Désactiver temporairement l'IA et activer un répondeur automatique", category: "automation", upvotes: 29, status: "under_review", requestedBy: "Créatrices solo", createdAt: daysAgo(10), agencyRequest: false },
  { id: "fr9", title: "Split testing des messages IA", description: "A/B test automatique de deux versions d'un même message", category: "ai", upvotes: 27, status: "planned", requestedBy: "Agences", createdAt: daysAgo(12), agencyRequest: true },
  { id: "fr10", title: "Export données fans (GDPR compliant)", description: "Export complet des données fans au format CSV/JSON", category: "compliance", upvotes: 22, status: "shipped", requestedBy: "Top 5 agences", createdAt: daysAgo(50), agencyRequest: true },
  { id: "fr11", title: "Template builder visuel", description: "Créer des templates de messages avec un éditeur visuel drag-and-drop", category: "creative", upvotes: 19, status: "under_review", requestedBy: "Équipes marketing", createdAt: daysAgo(8), agencyRequest: false },
  { id: "fr12", title: "Whale prediction score", description: "Score prédictif identifiant les fans susceptibles de devenir whales", category: "ai", upvotes: 16, status: "in_progress", requestedBy: "Data analysts", createdAt: daysAgo(5), agencyRequest: false },
];

// ═══ Section Navigation Config ═════════════════════════════

export type SectionId =
  | "sales_engine"
  | "campaign_builder"
  | "opportunity_queue"
  | "pricing_lab"
  | "tracking_links"
  | "lists_builder"
  | "fan_journey"
  | "automation_triggers"
  | "browser_mock"
  | "team_control"
  | "compliance_review"
  | "why_atlas_safer"
  | "safety_guard"
  | "ai_core_settings"
  | "hybrid_handoff"
  | "script_builder"
  | "message_ledger"
  | "banned_keywords"
  | "creator_profile"
  | "notifications_center"
  | "creative_engine"
  | "roadmap";

export interface NavSection {
  id: SectionId;
  label: string;
  icon: ComponentType<{ size?: number; className?: string; style?: CSSProperties }>;
  description?: string;
}

export interface NavGroup {
  label: string;
  sections: NavSection[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "INBOX",
    sections: [
            { id: "sales_engine", label: "AI Sales Engine", icon: MessageCircle, description: "Priorise les conversations qui peuvent générer du revenu" },
            { id: "message_ledger", label: "Message Ledger", icon: BookOpen, description: "Historique des brouillons, validations et messages envoyés" },
    ],
  },
  {
    label: "AI SALES ENGINE",
    sections: [
            { id: "opportunity_queue", label: "Opportunity Queue", icon: Target, description: "Kanban des opportunités de vente détectées par l'IA" },
            { id: "lists_builder", label: "Dynamic Lists", icon: List, description: "Segments de fans dynamiques basés sur 30+ critères" },
            { id: "script_builder", label: "Script Builder / PPV", icon: Layers, description: "Entonnoirs PPV progressifs avec étapes et pricing" },
    ],
  },
  {
    label: "CAMPAIGNS",
    sections: [
            { id: "campaign_builder", label: "Campaign Builder", icon: Send, description: "Campagnes marketing multi-étapes avec templates" },
            { id: "creative_engine", label: "Creative Engine / Reels", icon: Video, description: "Scripts Reels/TikTok générés par IA, validation humaine" },
    ],
  },
  {
    label: "SCRIPTS",
    sections: [
            { id: "pricing_lab", label: "Dynamic Pricing", icon: DollarSign, description: "Simule les offres PPV selon l'intention d'achat" },
            { id: "hybrid_handoff", label: "Hybrid Handoff Rules", icon: GitBranch, description: "Définit quand l'IA passe le relais à un chatter humain" },
            { id: "ai_core_settings", label: "AI Core Settings", icon: Sliders, description: "Contrôle le niveau d'assistance IA, sans envoi automatique" },
    ],
  },
  {
    label: "VAULT",
    sections: [
            { id: "creator_profile", label: "Creator Profile", icon: UserCog, description: "Persona, ton, limites et règles de la créatrice" },
            { id: "banned_keywords", label: "Banned Keywords", icon: Ban, description: "Mots interdits bloqués dans les brouillons et messages" },
            { id: "tracking_links", label: "Tracking & Attribution", icon: Link, description: "Liens traqués et performance par canal d'acquisition" },
            { id: "fan_journey", label: "Fan Journey", icon: TrendingUp, description: "Parcours fan : découverte → achat → ambassadeur" },
    ],
  },
  {
    label: "TEAM",
    sections: [
            { id: "team_control", label: "Team Control Room", icon: Users, description: "Activité, perfs et Golden Ratio de chaque chatter" },
            { id: "notifications_center", label: "Notifications Center", icon: Bell, description: "Alertes achats, messages, conformité et milestones" },
    ],
  },
  {
    label: "SAFETY",
    sections: [
            { id: "compliance_review", label: "Compliance Review", icon: ShieldCheck, description: "Contenus à risque détectés, file d'attente de révision humaine" },
            { id: "safety_guard", label: "Safety Guard", icon: Lock, description: "Barrières qui bloquent promesses interdites, impersonation et risques" },
            { id: "automation_triggers", label: "Automation Triggers", icon: Workflow, description: "Actions automatiques sur événements (anniversaire, silence, achat)" },
            { id: "why_atlas_safer", label: "Why Atlas is Safer", icon: Eye, description: "Pourquoi le modèle Atlas est le plus sûr du marché" },
    ],
  },
  {
    label: "SETTINGS",
    sections: [
            { id: "browser_mock", label: "Browser Workspace", icon: Globe, description: "Simule l'apparence des messages sur les plateformes" },
    ],
  },
  {
    label: "ROADMAP",
    sections: [
            { id: "roadmap", label: "Feature Requests", icon: Lightbulb, description: "Propositions de la communauté, vote pour prioriser" },
    ],
  },
];

export type {
  AiCoreMode, AiCoreSettings, HandoffRule, HandoffRuleGroup,
  PpvLadderStep, PpvLadderScript, MessageLedgerEntry, BannedKeyword,
  CreatorProfile, NotificationItem, NotificationChannel, AiReel,
  EmployeeStats, FeatureRequest, OnboardingStep,
};
export {
  AI_CORE_MODE_LABELS, AI_CORE_MODE_COLORS, HANDOFF_ACTION_LABELS,
  BANNED_CATEGORY_LABELS, BANNED_APPLIES_TO_LABELS, CREATOR_TONE_LABELS,
  NOTIF_TYPE_LABELS, NOTIF_CHANNEL_LABELS, REEL_PLATFORM_LABELS,
  FEATURE_CATEGORY_LABELS, FEATURE_STATUS_LABELS,
  mockAiCoreSettings, mockHandoffRules, mockPpvLadderScripts,
  mockMessageLedger, mockBannedKeywords, mockCreatorProfile,
  mockNotifications, mockAiReels, mockEmployeeStats, mockFeatureRequests,
  ONBOARDING_STEPS, SECTION_DESCRIPTIONS,
};
export { formatEuro, formatRelative, ago, daysAgo };
