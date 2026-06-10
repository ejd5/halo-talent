/* ─── ADN Créatif — Onboarding Types ─── */

export type VoiceTone =
  | "chaleureuse"
  | "provocante"
  | "mysterieuse"
  | "professionnelle"
  | "droledetendue"
  | "glamour";

export const VOICE_TONE_OPTIONS: { id: VoiceTone; emoji: string; label: string }[] = [
  { id: "chaleureuse", emoji: "🤗", label: "Chaleureuse & authentique" },
  { id: "provocante", emoji: "🔥", label: "Provocante & directe" },
  { id: "mysterieuse", emoji: "🔮", label: "Mystérieuse & intrigante" },
  { id: "professionnelle", emoji: "💼", label: "Professionnelle & posée" },
  { id: "droledetendue", emoji: "😄", label: "Drôle & décontractée" },
  { id: "glamour", emoji: "💎", label: "Glamour & premium" },
];

export interface VoiceSection {
  tone: VoiceTone;
  customDescription: string; // filled if tone is custom
  isCustom: boolean;
}

/* ─── Section 2: Style ─── */

export type VisualStyle =
  | "lifestyle-premium"
  | "street-urban"
  | "nature-outdoor"
  | "dark-moody"
  | "colore-pop"
  | "minimaliste-clean"
  | "vintage-retro"
  | "luxe-glamour";

export const STYLE_OPTIONS: { id: VisualStyle; emoji: string; label: string }[] = [
  { id: "lifestyle-premium", emoji: "🌴", label: "Lifestyle premium" },
  { id: "street-urban", emoji: "🏙️", label: "Street / Urban" },
  { id: "nature-outdoor", emoji: "🌿", label: "Nature / Outdoor" },
  { id: "dark-moody", emoji: "🌑", label: "Dark / Moody" },
  { id: "colore-pop", emoji: "🌈", label: "Coloré / Pop" },
  { id: "minimaliste-clean", emoji: "⬜", label: "Minimaliste / Clean" },
  { id: "vintage-retro", emoji: "📻", label: "Vintage / Retro" },
  { id: "luxe-glamour", emoji: "💎", label: "Luxe / Glamour" },
];

export interface StyleSection {
  styles: VisualStyle[];
}

/* ─── Section 3: Audience ─── */

export type Gender = "femmes" | "hommes" | "tous";
export type AgeRange = "18-24" | "25-34" | "35-44" | "45+";

export const AGE_RANGES: AgeRange[] = ["18-24", "25-34", "35-44", "45+"];

export const INTEREST_TAGS = [
  "Fitness & Sport",
  "Mode & Beauté",
  "Voyages & Aventure",
  "Gastronomie & Cuisine",
  "Tech & Gadgets",
  "Business & Entrepreneuriat",
  "Développement personnel",
  "Gaming & Esport",
  "Musique & Concerts",
  "Cinéma & Séries",
  "Art & Design",
  "Animal & Nature",
  "Parentalité & Famille",
  "Santé & Bien-être",
  "Littérature & Écriture",
];

export const GEO_ZONES = [
  "France métropolitaine",
  "Belgique & Suisse",
  "Canada (Québec)",
  "Afrique francophone",
  "Europe (hors France)",
  "Amérique du Nord",
  "Amérique latine",
  "Asie & Océanie",
  "Moyen-Orient",
  "Monde entier",
];

export interface AudienceSection {
  gender: Gender | null;
  ageRange: AgeRange | null;
  geoZones: string[];
  interests: string[];
}

/* ─── Section 4: Plateformes ─── */

export interface PlatformEntry {
  name: string;
  followers: number;
  isMain: boolean;
}

export const PLATFORM_OPTIONS = [
  "Instagram",
  "TikTok",
  "YouTube",
  "OnlyFans",
  "MYM",
  "Twitter / X",
  "Threads",
  "LinkedIn",
  "Bluesky",
  "Snapchat",
  "Twitch",
  "Patreon",
];

export interface PlatformsSection {
  platforms: PlatformEntry[];
}

/* ─── Section 5: Contenu ─── */

export type ContentType =
  | "photos"
  | "videos-courtes"
  | "videos-longues"
  | "stories"
  | "lives"
  | "audio"
  | "texte";

export const CONTENT_TYPE_OPTIONS: { id: ContentType; emoji: string; label: string }[] = [
  { id: "photos", emoji: "📸", label: "Photos" },
  { id: "videos-courtes", emoji: "🎬", label: "Vidéos courtes (Reels / TikTok)" },
  { id: "videos-longues", emoji: "▶️", label: "Vidéos longues (YouTube)" },
  { id: "stories", emoji: "⏳", label: "Stories" },
  { id: "lives", emoji: "🔴", label: "Lives" },
  { id: "audio", emoji: "🎙️", label: "Audio / Podcast" },
  { id: "texte", emoji: "✍️", label: "Texte / Newsletter" },
];

export const FREQ_OPTIONS = [
  "Plusieurs fois par jour",
  "1 fois par jour",
  "3-5 fois par semaine",
  "1-2 fois par semaine",
  "Quelques fois par mois",
];

export interface ContentSection {
  types: ContentType[];
  frequency: string;
}

/* ─── Section 6: Tabous ─── */

export const TABOO_TAGS = [
  "Politique",
  "Religion",
  "Drogue",
  "Violence",
  "Contenu extrême",
  "Nudité",
  "Vie privée détaillée",
];

export interface TaboosSection {
  tags: string[];
  custom: string[];
}

/* ─── Section 7: Objectifs ─── */

export type GoalType = "revenue" | "followers" | "diversification" | "engagement" | "automation" | "custom";

export const GOAL_OPTIONS: { id: GoalType; emoji: string; label: string; hint: string }[] = [
  { id: "revenue", emoji: "💰", label: "Augmenter mes revenus", hint: "Gagner plus avec mon activité" },
  { id: "followers", emoji: "📈", label: "Gagner des abonnés", hint: "Développer ma communauté" },
  { id: "diversification", emoji: "🌐", label: "Diversifier mes plateformes", hint: " être présent sur de nouveaux canaux" },
  { id: "engagement", emoji: "💬", label: "Améliorer mon engagement", hint: "Créer plus d'interactions" },
  { id: "automation", emoji: "🤖", label: "Automatiser mon chatting", hint: "Gagner du temps au quotidien" },
  { id: "custom", emoji: "🎯", label: "Objectif personnalisé", hint: "Autre" },
];

export interface GoalsSection {
  goalType: GoalType | null;
  customText: string;
  targetValue?: string;
}

/* ─── Section 8: Exemples ─── */

export interface ExamplesSection {
  examples: string[];
}

/* ─── Overall State ─── */

export interface OnboardingState {
  voice: VoiceSection | null;
  style: StyleSection | null;
  audience: AudienceSection | null;
  platforms: PlatformsSection | null;
  content: ContentSection | null;
  taboos: TaboosSection | null;
  goals: GoalsSection | null;
  examples: ExamplesSection | null;
}

export type OnboardingStep =
  | "intro"
  | "voice"
  | "style"
  | "audience"
  | "platforms"
  | "content"
  | "taboos"
  | "goals"
  | "examples"
  | "recap";

export const STEP_ORDER: { id: OnboardingStep; label: string; number: number }[] = [
  { id: "intro", label: "Bienvenue", number: 0 },
  { id: "voice", label: "Voix", number: 1 },
  { id: "style", label: "Style", number: 2 },
  { id: "audience", label: "Audience", number: 3 },
  { id: "platforms", label: "Plateformes", number: 4 },
  { id: "content", label: "Contenu", number: 5 },
  { id: "taboos", label: "Tabous", number: 6 },
  { id: "goals", label: "Objectifs", number: 7 },
  { id: "examples", label: "Exemples", number: 8 },
  { id: "recap", label: "Récapitulatif", number: 9 },
];

export function calcCompletion(state: OnboardingState): number {
  const sections = [
    state.voice,
    state.style,
    state.audience,
    state.platforms,
    state.content,
    state.taboos,
    state.goals,
    state.examples,
  ];
  const filled = sections.filter(Boolean).length;
  return Math.round((filled / sections.length) * 100);
}

export function initialState(): OnboardingState {
  return {
    voice: null,
    style: null,
    audience: null,
    platforms: null,
    content: null,
    taboos: null,
    goals: null,
    examples: null,
  };
}
