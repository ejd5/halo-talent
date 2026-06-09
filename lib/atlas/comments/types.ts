/* ─── Comment Moderation Types ─── */

export type Platform = "instagram" | "tiktok" | "youtube" | "twitter" | "facebook";

export type Sentiment = "very_positive" | "positive" | "neutral" | "negative" | "very_negative";
export type Intent = "compliment" | "question" | "complaint" | "spam" | "promotion" | "general" | "harassment";
export type CommentStatus = "new" | "approved" | "replied" | "hidden" | "deleted" | "flagged";
export type ModerationAction = "none" | "auto_approved" | "auto_hidden" | "auto_replied" | "flagged_review";

export interface AtlasComment {
  id: string;
  creator_id: string;
  platform: Platform;
  external_comment_id?: string;
  post_id?: string;
  post_url?: string;
  parent_comment_id?: string;
  author_external_id?: string;
  author_username?: string;
  author_display_name?: string;
  author_avatar?: string;
  fan_id?: string;
  content: string;
  detected_language: string;
  sentiment?: Sentiment;
  intent?: Intent;
  is_spam: boolean;
  contains_link: boolean;
  ai_analysis: Record<string, any>;
  like_count: number;
  reply_count: number;
  status: CommentStatus;
  moderation_action: ModerationAction;
  auto_reply_id?: string;
  auto_reply_content?: string;
  replied_at?: string;
  occurred_at?: string;
  created_at: string;
}

export interface RuleCondition {
  field: string;
  operator: "eq" | "neq" | "in" | "contains" | "gt" | "gte" | "lt" | "lte";
  value: any;
}

export interface RuleActions {
  type: "like" | "auto_reply" | "hide" | "notify" | "flag_spam";
  enabled: boolean;
  template_id?: string;
  probability?: number; // 0-100
  variations?: boolean;
  message?: string;
}

export interface CommentRule {
  id: string;
  creator_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  priority: number;
  conditions: {
    operator: "and" | "or";
    conditions: RuleCondition[];
  };
  actions: RuleActions[];
  execution_count: number;
  last_executed_at?: string;
  created_at: string;
}

export interface CommentTemplate {
  id: string;
  creator_id: string;
  name: string;
  responses: string[];
  language: string;
  is_active: boolean;
}

/* ─── Platform labels ─── */

export const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  twitter: "Twitter / X",
  facebook: "Facebook",
};

export const PLATFORM_COLORS: Record<Platform, string> = {
  instagram: "#E4405F",
  tiktok: "#000000",
  youtube: "#FF0000",
  twitter: "#1DA1F2",
  facebook: "#1877F2",
};

export const SENTIMENT_LABELS: Record<Sentiment, string> = {
  very_positive: "Très positif",
  positive: "Positif",
  neutral: "Neutre",
  negative: "Négatif",
  very_negative: "Très négatif",
};

export const SENTIMENT_COLORS: Record<Sentiment, string> = {
  very_positive: "#10B981",
  positive: "#7A9A65",
  neutral: "#B0A89E",
  negative: "#F59E0B",
  very_negative: "#C44536",
};

export const INTENT_LABELS: Record<Intent, string> = {
  compliment: "Compliment",
  question: "Question",
  complaint: "Réclamation",
  spam: "Spam",
  promotion: "Promotion",
  general: "Général",
  harassment: "Harcèlement",
};

export const INTENT_COLORS: Record<Intent, string> = {
  compliment: "#10B981",
  question: "#5B8FA8",
  complaint: "#F59E0B",
  spam: "#C44536",
  promotion: "#C44536",
  general: "#B0A89E",
  harassment: "#C44536",
};

export const STATUS_LABELS: Record<CommentStatus, string> = {
  new: "Nouveau",
  approved: "Approuvé",
  replied: "Répondu",
  hidden: "Masqué",
  deleted: "Supprimé",
  flagged: "Signalé",
};

/* ─── Default templates ─── */

export const DEFAULT_TEMPLATES: { name: string; responses: string[] }[] = [
  {
    name: "Merci pour le compliment",
    responses: [
      "Merci beaucoup 🌹",
      "Tu es adorable, merci !",
      "Ça me touche, merci ❤️",
      "Trop gentil(le) 🥰",
      "Merci, ça me fait vraiment plaisir ✨",
    ],
  },
  {
    name: "Réponse aux questions",
    responses: [
      "Bonne question ! Je prépare quelque chose là-dessus, stay tuned 🔥",
      "Merci pour ta question, je vais y répondre bientôt !",
      "Je note, je ferai un post là-dessus très vite 📝",
    ],
  },
  {
    name: "Remerciement soutien",
    responses: [
      "Merci pour ton soutien, ça compte énormément 🙏",
      "Chaque like et chaque commentaire me motive, merci ❤️",
      "Tellement reconnaissant(e) pour votre soutien 🌟",
    ],
  },
];

/* ─── Rule presets ─── */

export const RULE_PRESETS = [
  {
    name: "Répondre aux compliments",
    description: "Like + réponse automatique aux commentaires positifs avec variations",
    conditions: {
      operator: "and" as const,
      conditions: [
        { field: "sentiment", operator: "in" as const, value: ["very_positive", "positive"] },
        { field: "intent", operator: "eq" as const, value: "compliment" },
      ],
    },
    actions: [
      { type: "like" as const, enabled: true },
      { type: "auto_reply" as const, enabled: true, probability: 80, variations: true },
    ],
  },
  {
    name: "Modération spam",
    description: "Cache automatiquement les commentaires spam ou contenant des liens",
    conditions: {
      operator: "or" as const,
      conditions: [
        { field: "intent", operator: "eq" as const, value: "spam" },
        { field: "contains_link", operator: "eq" as const, value: true },
        { field: "is_spam", operator: "eq" as const, value: true },
      ],
    },
    actions: [
      { type: "hide" as const, enabled: true },
      { type: "notify" as const, enabled: true, message: "Spam masqué automatiquement" },
    ],
  },
  {
    name: "Alerte question",
    description: "Détecte les questions et crée une notification pour réponse manuelle",
    conditions: {
      operator: "and" as const,
      conditions: [
        { field: "intent", operator: "eq" as const, value: "question" },
      ],
    },
    actions: [
      { type: "notify" as const, enabled: true, message: "Un fan a posé une question sur ton post" },
    ],
  },
  {
    name: "Priorité VIP",
    description: "Notification immédiate quand un fan VIP ou Whale commente",
    conditions: {
      operator: "and" as const,
      conditions: [
        { field: "fan_tier", operator: "in" as const, value: ["whale", "vip"] },
      ],
    },
    actions: [
      { type: "notify" as const, enabled: true, message: "Un fan VIP a commenté ton post !" },
    ],
  },
  {
    name: "Anti-harcèlement",
    description: "Détecte et masque les commentaires négatifs ou de harcèlement",
    conditions: {
      operator: "or" as const,
      conditions: [
        { field: "intent", operator: "eq" as const, value: "harassment" },
        { field: "sentiment", operator: "in" as const, value: ["very_negative"] },
      ],
    },
    actions: [
      { type: "hide" as const, enabled: true },
      { type: "notify" as const, enabled: true, message: "Commentaire masqué pour harcèlement potentiel" },
    ],
  },
];
