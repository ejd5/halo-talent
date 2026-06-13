// ─── Atlas Rules Engine v2, Types ──────────────────────────

export type TriggerType =
  | "fan_created" | "fan_updated" | "fan_deleted"
  | "tag_added" | "tag_removed"
  | "tier_change"
  | "email_opened" | "email_clicked" | "email_not_opened"
  | "sms_received"
  | "comment_posted"
  | "purchase_made"
  | "webhook_received"
  | "scheduled_cron"
  | "inactive_since";

export const TRIGGER_LABELS: Record<TriggerType, string> = {
  fan_created: "Fan créé",
  fan_updated: "Fan mis à jour",
  fan_deleted: "Fan supprimé",
  tag_added: "Tag ajouté",
  tag_removed: "Tag retiré",
  tier_change: "Changement de tier",
  email_opened: "Email ouvert",
  email_clicked: "Email cliqué",
  email_not_opened: "Email non ouvert",
  sms_received: "SMS reçu (inbound)",
  comment_posted: "Commentaire posté",
  purchase_made: "Achat enregistré",
  webhook_received: "Webhook externe reçu",
  scheduled_cron: "Date/heure programmée",
  inactive_since: "Inactif depuis X jours",
};

export const TRIGGER_DESCRIPTIONS: Record<TriggerType, string> = {
  fan_created: "Quand un nouveau fan est ajouté à la base",
  fan_updated: "Quand un fan existant est modifié",
  fan_deleted: "Quand un fan est supprimé",
  tag_added: "Quand un tag spécifique est ajouté à un fan",
  tag_removed: "Quand un tag est retiré d'un fan",
  tier_change: "Quand le tier d'un fan change",
  email_opened: "Quand un fan ouvre un email",
  email_clicked: "Quand un fan clique dans un email",
  email_not_opened: "Quand un fan n'ouvre pas un email dans un délai",
  sms_received: "Quand un fan répond par SMS",
  comment_posted: "Quand un commentaire est posté sur une plateforme",
  purchase_made: "Quand un achat est enregistré",
  webhook_received: "Quand un webhook externe est reçu",
  scheduled_cron: "Déclenché à une date/heure spécifique",
  inactive_since: "Quand un fan est inactif depuis X jours",
};

export type ActionType =
  | "update_field" | "add_tag" | "remove_tag" | "change_tier"
  | "send_email" | "send_sms" | "send_push" | "send_dm"
  | "create_draft" | "notify_creator"
  | "trigger_funnel"
  | "http_webhook"
  | "update_segment";

export const ACTION_LABELS: Record<ActionType, string> = {
  update_field: "Modifier un champ",
  add_tag: "Ajouter un tag",
  remove_tag: "Retirer un tag",
  change_tier: "Changer le tier",
  send_email: "Envoyer un email",
  send_sms: "Envoyer un SMS",
  send_push: "Envoyer une push",
  send_dm: "Envoyer un DM",
  create_draft: "Créer un draft pour le créateur",
  notify_creator: "Notifier le créateur",
  trigger_funnel: "Déclencher un funnel",
  http_webhook: "Appel webhook HTTP",
  update_segment: "Mettre à jour un segment",
};

export const ACTION_DESCRIPTIONS: Record<ActionType, string> = {
  update_field: "Met à jour un champ personnalisé du fan",
  add_tag: "Ajoute un tag à la fiche du fan",
  remove_tag: "Retire un tag de la fiche du fan",
  change_tier: "Change le tier du fan",
  send_email: "Envoie un email via un template",
  send_sms: "Envoie un SMS au fan",
  send_push: "Envoie une notification push",
  send_dm: "Envoie un DM sur la plateforme",
  create_draft: "Crée un brouillon que le créateur valide",
  notify_creator: "Envoie une notification au créateur",
  trigger_funnel: "Déclenche un funnel existant",
  http_webhook: "Appelle une API externe",
  update_segment: "Ajoute/retire le fan d'un segment",
};

export type Operator = "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "contains" | "starts_with" | "in";

export interface Condition {
  field: string;
  operator: Operator;
  value: string | number | boolean;
  logic?: "and" | "or";
}

export interface TriggerConfig {
  type: TriggerType;
  value?: string;              // tag name, tier name, days count, hook name
  time_event?: string;         // birthday, anniversary, custom
  cron_expr?: string;
  days_threshold?: number;
}

export interface ActionConfig {
  type: ActionType;
  field_name?: string;
  field_value?: string;
  tag?: string;
  target_tier?: string;
  subject?: string;
  content?: string;
  template_id?: string;
  message?: string;
  via?: "in_app" | "telegram" | "email";
  funnel_id?: string;
  webhook_url?: string;
  webhook_method?: "GET" | "POST" | "PUT";
  segment_id?: string;
  delay_minutes?: number;
}

export interface Rule {
  id: string;
  creator_id?: string;
  name: string;
  description?: string;
  trigger_event: TriggerType;
  trigger_config: TriggerConfig;
  conditions: Condition[];
  conditions_logic: "all" | "any";
  actions: ActionConfig[];
  is_active: boolean;
  test_mode: boolean;
  rate_limit_per_hour: number;
  logging_level: "verbose" | "normal" | "errors_only";
  total_executions: number;
  total_errors: number;
  last_executed_at?: string;
  schedule_at?: string;
  created_at?: string;
}

export interface RuleExecution {
  id: string;
  rule_id: string;
  trigger_event: any;
  fan_id?: string;
  conditions_evaluation: any[];
  actions_executed: any[];
  success: boolean;
  duration_ms: number;
  error_message?: string;
  dry_run: boolean;
  executed_at: string;
}

export interface WebhookEvent {
  id: string;
  hook_name: string;
  payload: any;
  matched_rules: number;
  created_at: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  active: boolean;
  last_used_at?: string;
  created_at: string;
}

export interface OutgoingWebhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  last_sent_at?: string;
  failure_count: number;
}

// ─── Rule Templates ──────────────────────────────────────────

export interface RuleTemplate {
  name: string;
  description: string;
  trigger_event: TriggerType;
  trigger_config: TriggerConfig;
  conditions: Condition[];
  actions: ActionConfig[];
}

export const RULE_TEMPLATES: RuleTemplate[] = [
  {
    name: "Auto-upgrade VIP",
    description: "LTV > 1000€ → tier VIP + email félicitation",
    trigger_event: "fan_updated",
    trigger_config: { type: "fan_updated" },
    conditions: [{ field: "lifetime_value", operator: "gt", value: 1000 }],
    actions: [
      { type: "change_tier", target_tier: "vip" },
      { type: "send_email", subject: "Félicitations ! 🎉", content: "Tu es désormais membre VIP. Merci pour ta fidélité !" },
    ],
  },
  {
    name: "Win-back lapsed",
    description: "Inactif 60j + LTV > 100€ → SMS personnalisé",
    trigger_event: "inactive_since",
    trigger_config: { type: "inactive_since", days_threshold: 60 },
    conditions: [{ field: "lifetime_value", operator: "gt", value: 100 }],
    actions: [
      { type: "change_tier", target_tier: "warm" },
      { type: "send_sms", content: "Tu nous manques ! Reviens avec -20% 🔥" },
    ],
  },
  {
    name: "Birthday automation",
    description: "Date anniversaire → SMS + offre gratuite",
    trigger_event: "scheduled_cron",
    trigger_config: { type: "scheduled_cron", time_event: "birthday" },
    conditions: [],
    actions: [
      { type: "send_sms", content: "Joyeux anniversaire ! 🎂 Profite d'un cadeau rien que pour toi 🎁" },
    ],
  },
  {
    name: "Stripe → Funnel onboarding",
    description: "Nouvelle souscription Stripe → funnel onboarding",
    trigger_event: "purchase_made",
    trigger_config: { type: "purchase_made" },
    conditions: [],
    actions: [
      { type: "add_tag", tag: "new_subscriber" },
      { type: "trigger_funnel", funnel_id: "" },
    ],
  },
  {
    name: "Fan to friend",
    description: "5 achats → segment VIP + invitation Discord",
    trigger_event: "purchase_made",
    trigger_config: { type: "purchase_made" },
    conditions: [{ field: "purchases_count", operator: "gte", value: 5 }],
    actions: [
      { type: "update_segment", segment_id: "" },
      { type: "notify_creator", message: "Fan fidèle détecté ! Envisage une invitation Discord." },
    ],
  },
  {
    name: "Comment to DM",
    description: "Like sur compliment Insta → draft DM",
    trigger_event: "comment_posted",
    trigger_config: { type: "comment_posted", value: "instagram" },
    conditions: [{ field: "sentiment", operator: "eq", value: "positive" }],
    actions: [
      { type: "create_draft", content: "Merci pour ton soutien ! ❤️ Ça me touche vraiment." },
    ],
  },
  {
    name: "Engagement boost",
    description: "Si comment Reel < 24h → like + reply auto",
    trigger_event: "comment_posted",
    trigger_config: { type: "comment_posted" },
    conditions: [{ field: "post_type", operator: "eq", value: "reel" }],
    actions: [
      { type: "http_webhook", webhook_url: "https://graph.facebook.com/v18.0/me/likes" },
      { type: "create_draft", content: "Merci d'avoir regardé ! 🎬" },
    ],
  },
];

// ─── Utils ───────────────────────────────────────────────────

export function getDefaultTriggerConfig(type: TriggerType): TriggerConfig {
  return { type };
}
