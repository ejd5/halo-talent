export type DNASection = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type DNASectionKey = `section_${DNASection}`;

export const SECTION_LABELS: Record<DNASection, string> = {
  1: "Identité",
  2: "Voice",
  3: "Audience",
  4: "Esthétique",
  5: "Contenu",
  6: "Tabous",
  7: "Objectifs",
  8: "Rythme",
};

export const ALL_SECTIONS: DNASection[] = [1, 2, 3, 4, 5, 6, 7, 8];

// ─── Voice Profile ───

export type ToneAxis = {
  formality: number;
  humor: number;
  mystery: number;
  warmth: number;
  boldness: number;
  luxury: number;
};

export type EmojiUsage = "never" | "rare" | "moderate" | "frequent";
export type SentenceLength = "short" | "medium" | "long" | "varied";
export type PunctuationStyle = "minimal" | "standard" | "expressive";
export type Frequency = "rare" | "moderate" | "frequent";
export type PronounStyle = "uses je" | "uses nous" | "formal vous" | "mixed";
export type EnergyLevel = "calm" | "moderate" | "high" | "intense";

export type VoiceProfile = {
  tone: ToneAxis;
  vocabulary: {
    signature_phrases: string[];
    favorite_words: string[];
    banned_words: string[];
    emoji_usage: EmojiUsage;
    signature_emojis: string[];
    sign_off: string;
  };
  writing_style: {
    sentence_length: SentenceLength;
    punctuation_style: PunctuationStyle;
    use_of_questions: Frequency;
    use_of_exclamations: Frequency;
    personal_pronouns: PronounStyle;
  };
  examples: {
    greeting: string;
    thank_you: string;
    vulnerable_moment: string;
    promo_message: string;
    response_to_compliment: string;
  };
  personality_traits: string[];
  energy_level: EnergyLevel;
  communication_dna_summary: string;
};

// ─── Style Profile ───

export type StyleProfile = {
  visual_universe: string;
  dominant_colors: string[];
  aesthetic_tags: string[];
  photography_style: string;
  editing_vibe: string;
  inspiration_sources: string[];
  content_categories: string[];
  signature_elements: string[];
  style_dna_summary: string;
};

// ─── Audience Profile ───

export type AudiencePersona = {
  name: string;
  description: string;
  pain_points: string[];
  what_they_love: string[];
};

export type AudienceProfile = {
  primary_demographic: {
    age_range: string;
    gender_skew: string;
    location: string;
    language: string;
  };
  audience_personas: AudiencePersona[];
  engagement_patterns: {
    best_time_to_post: string;
    best_content_types: string[];
    comment_style: string;
    community_vibe: string;
  };
  audience_dna_summary: string;
};

// ─── Creator DNA ───

export type CreatorDNA = {
  id: string;
  creator_id: string;
  section_1?: Record<string, unknown> | null;
  section_2?: Record<string, unknown> | null;
  section_3?: Record<string, unknown> | null;
  section_4?: Record<string, unknown> | null;
  section_5?: Record<string, unknown> | null;
  section_6?: Record<string, unknown> | null;
  section_7?: Record<string, unknown> | null;
  section_8?: Record<string, unknown> | null;
  voice_profile?: VoiceProfile | null;
  style_profile?: StyleProfile | null;
  audience_profile?: AudienceProfile | null;
  voice_embedding?: number[] | null;
  style_embedding?: number[] | null;
  is_complete: boolean;
  completion_pct: number;
  last_updated_section: number | null;
  created_at: string;
  updated_at: string;
};

// ─── DNA Version ───

export type DNAVersion = {
  id: string;
  creator_id: string;
  version_number: number;
  snapshot: CreatorDNA;
  created_at: string;
};

// ─── API types ───

export type DNAStatusResponse = {
  exists: boolean;
  is_complete: boolean;
  completion_pct: number;
  last_updated_section: number | null;
  sections_filled: number[];
  sections_missing: number[];
  studio_access: boolean;
};

export type SaveSectionInput = {
  creator_id: string;
  section: DNASection;
  data: Record<string, unknown>;
};

export type FinalizeResponse = {
  success: boolean;
  voice_profile?: VoiceProfile | null;
  style_profile?: StyleProfile | null;
  audience_profile?: AudienceProfile | null;
  error?: string;
};
