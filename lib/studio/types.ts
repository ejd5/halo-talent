export type PlatformType =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "twitter"
  | "threads"
  | "linkedin"
  | "bluesky"
  | "onlyfans"
  | "mym"
  | "fansly";

export type PlatformSubType =
  | "post"
  | "story"
  | "reel"
  | "carousel"
  | "short"
  | "long_video"
  | "tweet"
  | "thread"
  | "photo"
  | "video";

export interface PlatformDefinition {
  type: PlatformType;
  label: string;
  icon: string;
  subtypes: { value: PlatformSubType; label: string }[];
}

export const PLATFORMS: PlatformDefinition[] = [
  {
    type: "instagram",
    label: "Instagram",
    icon: "Camera",
    subtypes: [
      { value: "post", label: "Post" },
      { value: "story", label: "Story" },
      { value: "reel", label: "Reel" },
      { value: "carousel", label: "Carousel" },
    ],
  },
  {
    type: "tiktok",
    label: "TikTok",
    icon: "Music2",
    subtypes: [
      { value: "video", label: "Vidéo" },
      { value: "photo", label: "Photo" },
    ],
  },
  {
    type: "youtube",
    label: "YouTube",
    icon: "Video",
    subtypes: [
      { value: "short", label: "Short" },
      { value: "long_video", label: "Vidéo longue" },
    ],
  },
  {
    type: "twitter",
    label: "Twitter / X",
    icon: "MessageCircle",
    subtypes: [
      { value: "tweet", label: "Tweet" },
      { value: "thread", label: "Thread" },
    ],
  },
  {
    type: "threads",
    label: "Threads",
    icon: "MessageCircle",
    subtypes: [{ value: "post", label: "Post" }],
  },
  {
    type: "linkedin",
    label: "LinkedIn",
    icon: "Briefcase",
    subtypes: [
      { value: "post", label: "Post" },
      { value: "long_video", label: "Vidéo" },
    ],
  },
  {
    type: "bluesky",
    label: "Bluesky",
    icon: "MessageCircle",
    subtypes: [{ value: "post", label: "Post" }],
  },
  {
    type: "onlyfans",
    label: "OnlyFans",
    icon: "Lock",
    subtypes: [
      { value: "post", label: "Post" },
      { value: "video", label: "Vidéo" },
    ],
  },
  {
    type: "mym",
    label: "MYM",
    icon: "Lock",
    subtypes: [
      { value: "post", label: "Post" },
      { value: "video", label: "Vidéo" },
    ],
  },
  {
    type: "fansly",
    label: "Fansly",
    icon: "Lock",
    subtypes: [
      { value: "post", label: "Post" },
      { value: "video", label: "Vidéo" },
    ],
  },
];

export interface PlatformConfig {
  platform: PlatformType;
  subType: PlatformSubType;
  enabled: boolean;
}

export interface ComposerMedia {
  id: string;
  file?: File;
  previewUrl: string;
  type: "image" | "video" | "carousel";
  mediaId?: string;
  name?: string;
}

export interface ComposerCaption {
  text: string;
  hashtags: string[];
  mentions: string[];
}

export interface ComposerGeo {
  lat: number;
  lng: number;
  place: string;
}

export interface ComposerConfig {
  scheduledAt: Date | null;
  visibility: "public" | "followers" | "private";
  geo: ComposerGeo | null;
}

export type PublishStatus = "idle" | "saving" | "confirm" | "publishing" | "done" | "error";

export interface SourceMetadata {
  source: string;
  type: "hashtag" | "song";
  hashtag?: string;
  song_id?: string;
  song_title?: string;
  artist?: string;
  region?: string;
}

export interface ComposerState {
  platforms: PlatformConfig[];
  media: ComposerMedia[];
  caption: ComposerCaption;
  config: ComposerConfig;
  activeTab: "content" | "caption" | "config";
  isDirty: boolean;
  lastSaved: Date | null;
  publishStatus: PublishStatus;
  draftId: string | null;
  sourceMetadata: SourceMetadata | null;
}

export type ComposerAction =
  | { type: "TOGGLE_PLATFORM"; platform: PlatformType }
  | { type: "SET_PLATFORM_SUBTYPE"; platform: PlatformType; subType: PlatformSubType }
  | { type: "SET_MEDIA"; media: ComposerMedia[] }
  | { type: "ADD_MEDIA"; media: ComposerMedia }
  | { type: "REMOVE_MEDIA"; id: string }
  | { type: "SET_CAPTION_TEXT"; text: string }
  | { type: "SET_HASHTAGS"; hashtags: string[] }
  | { type: "SET_MENTIONS"; mentions: string[] }
  | { type: "SET_CONFIG"; config: Partial<ComposerConfig> }
  | { type: "SET_SCHEDULED_AT"; scheduledAt: Date | null }
  | { type: "SET_VISIBILITY"; visibility: ComposerConfig["visibility"] }
  | { type: "SET_GEO"; geo: ComposerGeo | null }
  | { type: "SET_ACTIVE_TAB"; activeTab: ComposerState["activeTab"] }
  | { type: "SET_DIRTY" }
  | { type: "SET_SAVED"; lastSaved: Date }
  | { type: "SET_PUBLISH_STATUS"; publishStatus: PublishStatus }
  | { type: "SET_DRAFT_ID"; draftId: string }
  | { type: "SET_SOURCE_METADATA"; sourceMetadata: SourceMetadata | null }
  | { type: "RESET" }
  | { type: "LOAD_DRAFT"; draft: Partial<ComposerState> };

export interface PublishResult {
  platform: PlatformType;
  subType: PlatformSubType;
  success: boolean;
  postId?: string;
  error?: string;
}

export interface PublishRequest {
  platforms: { platform: PlatformType; subType: PlatformSubType }[];
  media: { previewUrl: string; type: ComposerMedia["type"]; name?: string }[];
  caption: ComposerCaption;
  config: ComposerConfig;
}

export interface PublishResponse {
  success: boolean;
  results: PublishResult[];
  failed: PublishResult[];
}

export const CHAR_LIMITS: Record<PlatformType, number> = {
  instagram: 2200,
  tiktok: 2200,
  youtube: 5000,
  twitter: 280,
  threads: 500,
  linkedin: 3000,
  bluesky: 300,
  onlyfans: 10000,
  mym: 10000,
  fansly: 10000,
};

export const PLATFORM_LABELS: Record<PlatformType, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  twitter: "Twitter / X",
  threads: "Threads",
  linkedin: "LinkedIn",
  bluesky: "Bluesky",
  onlyfans: "OnlyFans",
  mym: "MYM",
  fansly: "Fansly",
};

// ─── Platform Connection Types ───

export type PlatformConnectionStatus = "active" | "expired" | "revoked" | "error";

export interface PlatformConnection {
  id: string;
  creator_id: string;
  platform: PlatformType;
  platform_user_id: string | null;
  platform_username: string | null;
  platform_followers: number;
  access_token: string | null;
  refresh_token: string | null;
  expires_at: string | null;
  scopes: string[] | null;
  metadata: Record<string, unknown>;
  status: PlatformConnectionStatus;
  last_sync_at: string | null;
  connected_at: string;
}

export interface OAuthProvider {
  type: PlatformType;
  label: string;
  icon: string;
  docs: string;
  authType: "oauth" | "manual" | "api_key";
  scopes: string[];
  hasRefresh: boolean;
}

export const OAUTH_PROVIDERS: OAuthProvider[] = [
  { type: "instagram", label: "Instagram", icon: "Camera", docs: "https://developers.facebook.com/docs/instagram-api", authType: "oauth", scopes: ["instagram_basic", "instagram_content_publish", "pages_show_list"], hasRefresh: true },
  { type: "tiktok", label: "TikTok", icon: "Music2", docs: "https://developers.tiktok.com/doc/content-posting-api-get-started", authType: "oauth", scopes: ["video.upload", "video.publish"], hasRefresh: true },
  { type: "youtube", label: "YouTube", icon: "Video", docs: "https://developers.google.com/youtube/v3", authType: "oauth", scopes: ["youtube.upload"], hasRefresh: true },
  { type: "threads", label: "Threads", icon: "MessageCircle", docs: "https://developers.facebook.com/docs/threads", authType: "oauth", scopes: ["threads_basic", "threads_content_publish"], hasRefresh: true },
  { type: "twitter", label: "Twitter / X", icon: "MessageCircle", docs: "https://developer.x.com/en/docs", authType: "oauth", scopes: ["tweet.read", "tweet.write", "users.read"], hasRefresh: true },
  { type: "linkedin", label: "LinkedIn", icon: "Briefcase", docs: "https://learn.microsoft.com/en-us/linkedin", authType: "oauth", scopes: ["w_member_social"], hasRefresh: true },
  { type: "bluesky", label: "Bluesky", icon: "MessageCircle", docs: "https://atproto.com", authType: "api_key", scopes: [], hasRefresh: false },
  { type: "onlyfans", label: "OnlyFans", icon: "Lock", docs: "", authType: "manual", scopes: [], hasRefresh: false },
  { type: "mym", label: "MYM", icon: "Lock", docs: "", authType: "manual", scopes: [], hasRefresh: false },
  { type: "fansly", label: "Fansly", icon: "Lock", docs: "", authType: "manual", scopes: [], hasRefresh: false },
];

// ─── Credit System Types ───

export type PlanTier = "free" | "creator" | "premium" | "elite" | "icon";

export interface Plan {
  tier: PlanTier;
  name: string;
  price_monthly: number;
  credits_monthly: number;   // -1 = illimité
  max_daily_generations: number; // -1 = illimité
  priority: number;
  has_advanced_models: boolean;
  has_byok: boolean;
  history_retention_days: number;
  can_buy_addons: boolean;
}

export interface CreditCheckResult {
  allowed: boolean;
  reason?: "ok" | "no_auth" | "suspended" | "plan_blocked" | "insufficient_credits" | "daily_limit" | "no_provider" | "free_plan";
  credits_available?: number;
  credits_needed?: number;
  plan_tier?: PlanTier;
  message?: string;
  cta?: { label: string; href: string };
}

export interface CreditUsage {
  id: string;
  creator_id: string;
  action: string;
  credits_used: number;
  provider: string | null;
  model: string | null;
  cost_estimate: number | null;
  prompt: string | null;
  image_url: string | null;
  status: "pending" | "success" | "failed";
  error: string | null;
  created_at: string;
}

export interface CreditBalance {
  tier: PlanTier;
  credits_remaining: number;
  credits_total: number;
  credits_used_this_month: number;
  reset_date: string;
  usage_today: number;
  daily_limit: number;
  is_admin: boolean;
  is_unlimited: boolean;
  history: CreditUsage[];
}

// ─── New Wallet Types ───

export interface SubscriptionTier {
  id: string;
  name: string;
  monthly_price_eur: number | null;
  yearly_price_eur: number | null;
  monthly_credits: number | null;
  features: Record<string, unknown>;
}

export interface CreditsWallet {
  id: string;
  user_id: string;
  current_balance: number;
  monthly_quota: number;
  reset_at: string | null;
  total_purchased: number;
  created_at: string;
}

export interface CreditsTransaction {
  id: string;
  user_id: string;
  type: "grant" | "purchase" | "deduct" | "refund" | "bonus";
  amount: number;
  reason: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface WalletBalance {
  balance: number;
  monthly_quota: number;
  reset_at: string;
  total_purchased: number;
  tier: SubscriptionTier;
  is_admin: boolean;
  is_unlimited: boolean;
  transactions: CreditsTransaction[];
  category_consumption: Record<string, number>;
  chart_30d: { date: string; value: number }[];
}

export interface UserApiKey {
  id: string;
  user_id: string;
  anthropic_key: string | null;
  replicate_key: string | null;
  runway_key: string | null;
  elevenlabs_key: string | null;
  openai_key: string | null;
  huggingface_key: string | null;
  byok_enabled_for: string[];
}

// ─── Template Types ───

export type TemplateType = "photo" | "video" | "carousel" | "story" | "caption";

export interface Template {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  type: TemplateType;
  target_platforms: string[];
  target_aspect_ratios: string[];
  preview_url: string | null;
  template_data: Record<string, unknown>;
  created_by: string | null;
  department: string | null;
  style: string | null;
  mood: string | null;
  is_official: boolean;
  is_public: boolean;
  uses_count: number;
  likes_count: number;
  tags: string[];
  created_at: string;
  liked_by_me?: boolean;
}

export const CREDIT_COSTS: Record<string, number> = {
  generate_image: 1,
  generate_image_wide: 2,
  upscale_2x: 2,
  upscale_4x: 4,
  variation: 1,
  inpaint: 2,
  remove_bg: 1,
  generate_text: 1,
  video_runway_gen4: 2,
  video_kling_2: 3,
  video_luma: 4,
  video_pika_2: 3,
  video_sora_2: 10,
  video_veo_3: 15,
  // Audio
  generate_music: 3,
  voice_clone_setup: 10,
  voice_generate: 2,
  transcribe_audio: 1,
};

// ─── Video Models ───

export type VideoMode = "text-to-video" | "image-to-video" | "video-extension";

export interface VideoModelDef {
  id: string;
  name: string;
  provider: string;
  description: string;
  quality: "draft" | "standard" | "premium" | "cinema";
  costPerSec: number;
  maxDuration: number;
  minDuration: number;
  speedsMs: [number, number]; // min/max ETA in ms
  modes: VideoMode[];
  apiKeyRequired: boolean;
  available: boolean;
  color: string;
}

export const VIDEO_MODELS: VideoModelDef[] = [
  {
    id: "runway-gen4",
    name: "Runway Gen-4",
    provider: "Runway",
    description: "Excellent contrôle, rapide, meilleur rapport qualité/prix",
    quality: "standard",
    costPerSec: 2,
    maxDuration: 10,
    minDuration: 3,
    speedsMs: [30000, 90000],
    modes: ["text-to-video", "image-to-video"],
    apiKeyRequired: true,
    available: true,
    color: "#7C3AED",
  },
  {
    id: "kling-2",
    name: "Kling 2.0",
    provider: "Kling",
    description: "Très bon rapport qualité/prix, rendu naturel",
    quality: "standard",
    costPerSec: 3,
    maxDuration: 10,
    minDuration: 3,
    speedsMs: [45000, 120000],
    modes: ["text-to-video", "image-to-video", "video-extension"],
    apiKeyRequired: true,
    available: true,
    color: "#F59E0B",
  },
  {
    id: "luma",
    name: "Luma Dream Machine",
    provider: "Luma",
    description: "Rapide, idéal pour le prototypage",
    quality: "standard",
    costPerSec: 4,
    maxDuration: 10,
    minDuration: 3,
    speedsMs: [20000, 60000],
    modes: ["text-to-video", "image-to-video"],
    apiKeyRequired: true,
    available: true,
    color: "#06B6D4",
  },
  {
    id: "pika-2",
    name: "Pika 2.0",
    provider: "Pika",
    description: "Style artistique, effets créatifs uniques",
    quality: "standard",
    costPerSec: 3,
    maxDuration: 10,
    minDuration: 3,
    speedsMs: [25000, 80000],
    modes: ["text-to-video", "image-to-video", "video-extension"],
    apiKeyRequired: true,
    available: true,
    color: "#EC4899",
  },
  {
    id: "sora-2",
    name: "OpenAI Sora 2",
    provider: "OpenAI",
    description: "Très créatif, compréhension sémantique avancée",
    quality: "premium",
    costPerSec: 10,
    maxDuration: 20,
    minDuration: 5,
    speedsMs: [60000, 180000],
    modes: ["text-to-video", "image-to-video"],
    apiKeyRequired: true,
    available: true,
    color: "#10B981",
  },
  {
    id: "veo-3",
    name: "Google Veo 3",
    provider: "Google",
    description: "Qualité cinéma, photoréalisme extrême",
    quality: "cinema",
    costPerSec: 15,
    maxDuration: 60,
    minDuration: 5,
    speedsMs: [90000, 180000],
    modes: ["text-to-video", "image-to-video"],
    apiKeyRequired: true,
    available: true,
    color: "#4285F4",
  },
];

export const VIDEO_STYLES = [
  { id: "cinematic", label: "Cinematic", emoji: "🎬" },
  { id: "anime", label: "Anime", emoji: "🌸" },
  { id: "photoreal", label: "Photorealistic", emoji: "📷" },
  { id: "stylized", label: "Stylized", emoji: "🎨" },
  { id: "dark", label: "Dark & Moody", emoji: "🌑" },
  { id: "vintage", label: "Vintage", emoji: "📟" },
  { id: "3d", label: "3D Animation", emoji: "💎" },
  { id: "clay", label: "Claymation", emoji: "🧱" },
];

export interface VideoJob {
  id: string;
  creator_id: string;
  external_job_id: string | null;
  model: string;
  mode: VideoMode;
  prompt: string | null;
  params: Record<string, unknown>;
  output_url: string | null;
  thumbnail_url: string | null;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  error: string | null;
  credits_used: number;
  duration_seconds: number;
  estimated_completion_at: string | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}
