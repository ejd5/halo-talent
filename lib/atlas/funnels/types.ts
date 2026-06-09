/* ─── Types du système de Funnels ─── */

export type TriggerType =
  | "tier_change"
  | "tag_added"
  | "tag_removed"
  | "purchase_made"
  | "new_fan"
  | "time_based"
  | "inactivity"
  | "form_submitted"
  | "webhook_received";

export type ActionType =
  | "send_email"
  | "send_sms"
  | "send_push"
  | "add_tag"
  | "remove_tag"
  | "update_field"
  | "change_tier"
  | "notify_creator"
  | "wait"
  | "webhook_call";

export type LogicType = "if_else" | "split_test" | "random" | "wait_until";

export type NodeType = "trigger" | "action" | "logic";

export interface NodePosition {
  x: number;
  y: number;
}

export interface TriggerConfig {
  trigger_type: TriggerType;
  /** Tag name, tier name, etc. */
  value?: string;
  /** For time_based: "birthday", "anniversary", "custom" */
  time_event?: string;
  /** For inactivity: number of days */
  days_threshold?: number;
  /** For webhook_received: URL or event name */
  webhook_url?: string;
  /** For form_submitted: form ID */
  form_id?: string;
}

export interface ActionNodeConfig {
  action_type: ActionType;
  subject?: string;
  content?: string;
  template_id?: string;
  /** For send_email/send_sms: the from name/address */
  from_name?: string;
  /** For add_tag/remove_tag: tag name */
  tag?: string;
  /** For update_field: field name and value */
  field_name?: string;
  field_value?: string;
  /** For change_tier: target tier */
  target_tier?: string;
  /** For wait: duration */
  wait_days?: number;
  wait_hours?: number;
  /** For webhook_call: URL */
  webhook_url?: string;
  method?: "GET" | "POST" | "PUT";
  /** For notify_creator: message */
  message?: string;
  /** For send_push: push notification fields */
  push_title?: string;
  push_body?: string;
  push_icon_url?: string;
  push_image_url?: string;
  push_target_url?: string;
}

export interface LogicNodeConfig {
  logic_type: LogicType;
  /** For if_else */
  field?: string;
  operator?: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "contains";
  compare_value?: string;
  /** For split_test: percentage for branch A */
  split_a_percent?: number;
  /** For wait_until */
  wait_field?: string;
  wait_operator?: string;
  wait_value?: string;
}

export interface FunnelNode {
  id: string;
  type: NodeType;
  /** Sub-type discriminator */
  trigger_type?: TriggerType;
  action_type?: ActionType;
  logic_type?: LogicType;
  label: string;
  position: NodePosition;
  config: TriggerConfig | ActionNodeConfig | LogicNodeConfig;
}

export interface FunnelEdge {
  id: string;
  source: string;  // source node id
  target: string;  // target node id
  /** For logic nodes: which branch */
  label?: string;
}

export interface FunnelSteps {
  nodes: FunnelNode[];
  edges: FunnelEdge[];
}

export interface Funnel {
  id: string;
  creator_id?: string;
  name: string;
  description?: string;
  steps: FunnelSteps;
  status: "draft" | "active" | "paused" | "completed";
  entry_count: number;
  conversion_count: number;
  conversion_rate: number;
  revenue_generated: number;
  created_at?: string;
}

/* ─── Constants ─── */

export const TRIGGER_LABELS: Record<TriggerType, string> = {
  tier_change: "Changement de tier",
  tag_added: "Tag ajouté",
  tag_removed: "Tag retiré",
  purchase_made: "Achat effectué",
  new_fan: "Nouveau fan",
  time_based: "Date/répétition",
  inactivity: "Inactivité",
  form_submitted: "Formulaire soumis",
  webhook_received: "Webhook reçu",
};

export const TRIGGER_DESCRIPTIONS: Record<TriggerType, string> = {
  tier_change: "Quand le tier d'un fan change",
  tag_added: "Quand un tag est ajouté à un fan",
  tag_removed: "Quand un tag est retiré d'un fan",
  purchase_made: "Quand un fan effectue un achat",
  new_fan: "Quand un nouveau fan est capté",
  time_based: "Date anniversaire, date définie, ou répétition",
  inactivity: "Quand un fan est inactif depuis X jours",
  form_submitted: "Quand un fan soumet un formulaire",
  webhook_received: "Quand un webhook externe est reçu",
};

export const ACTION_LABELS: Record<ActionType, string> = {
  send_email: "Envoyer un email",
  send_sms: "Envoyer un SMS",
  send_push: "Envoyer une notification push",
  add_tag: "Ajouter un tag",
  remove_tag: "Retirer un tag",
  update_field: "Modifier un champ",
  change_tier: "Changer le tier",
  notify_creator: "Notifier le créateur",
  wait: "Attendre",
  webhook_call: "Appel webhook",
};

export const ACTION_DESCRIPTIONS: Record<ActionType, string> = {
  send_email: "Envoie un email au fan via un template",
  send_sms: "Envoie un SMS au fan",
  send_push: "Envoie une notification push",
  add_tag: "Ajoute un tag à la fiche du fan",
  remove_tag: "Retire un tag de la fiche du fan",
  update_field: "Met à jour un champ personnalisé",
  change_tier: "Change le tier du fan (cold, warm, engaged, etc.)",
  notify_creator: "Envoie une notification au créateur",
  wait: "Pause la séquence pendant une durée définie",
  webhook_call: "Appelle un webhook externe",
};

export const LOGIC_LABELS: Record<LogicType, string> = {
  if_else: "Condition Si/Sinon",
  split_test: "Test A/B",
  random: "Aléatoire",
  wait_until: "Attendre condition",
};

export const LOGIC_DESCRIPTIONS: Record<LogicType, string> = {
  if_else: "Branche selon une condition sur le fan",
  split_test: "Sépare aléatoirement en deux branches",
  random: "Aiguille aléatoirement vers une branche",
  wait_until: "Attend qu'une condition soit remplie",
};

export const TIER_OPTIONS = [
  { value: "cold", label: "Cold" },
  { value: "warm", label: "Warm" },
  { value: "engaged", label: "Engaged" },
  { value: "whale", label: "Whale" },
  { value: "vip", label: "VIP" },
  { value: "churned", label: "Churned" },
];

/* ─── Node type colors ─── */

export const NODE_COLORS = {
  trigger: { bg: "rgba(199,91,57,0.12)", border: "#C75B39", text: "#C75B39" },
  action: { bg: "rgba(91,143,168,0.12)", border: "#5B8FA8", text: "#5B8FA8" },
  logic:  { bg: "rgba(122,154,101,0.12)", border: "#7A9A65", text: "#7A9A65" },
};

/* ─── Funnel presets for quick creation ─── */

export const FUNNEL_PRESETS: { name: string; description: string; steps: FunnelSteps }[] = [
  {
    name: "Welcome Series",
    description: "Séquence de bienvenue multi-étapes pour les nouveaux fans",
    steps: {
      nodes: [
        { id: "t1", type: "trigger", trigger_type: "new_fan", label: "Nouveau fan", position: { x: 80, y: 40 }, config: { trigger_type: "new_fan" } },
        { id: "a1", type: "action", action_type: "send_email", label: "Email bienvenue", position: { x: 80, y: 180 }, config: { action_type: "send_email", subject: "Bienvenue !", content: "Merci de nous rejoindre ✨" } },
        { id: "w1", type: "action", action_type: "wait", label: "Attendre 3 jours", position: { x: 80, y: 320 }, config: { action_type: "wait", wait_days: 3 } },
        { id: "a2", type: "action", action_type: "send_email", label: "Email J+3", position: { x: 80, y: 460 }, config: { action_type: "send_email", subject: "Découvre nos exclusivités", content: "Voici ce que nous proposons..." } },
        { id: "w2", type: "action", action_type: "wait", label: "Attendre 7 jours", position: { x: 80, y: 600 }, config: { action_type: "wait", wait_days: 7 } },
        { id: "a3", type: "action", action_type: "send_email", label: "Email J+10", position: { x: 80, y: 740 }, config: { action_type: "send_email", subject: "Offre spéciale", content: "Une offre rien que pour toi..." } },
      ],
      edges: [
        { id: "e1", source: "t1", target: "a1" },
        { id: "e2", source: "a1", target: "w1" },
        { id: "e3", source: "w1", target: "a2" },
        { id: "e4", source: "a2", target: "w2" },
        { id: "e5", source: "w2", target: "a3" },
      ],
    },
  },
  {
    name: "Win-back Inactifs",
    description: "Relance automatique des fans inactifs depuis 60 jours",
    steps: {
      nodes: [
        { id: "t1", type: "trigger", trigger_type: "inactivity", label: "Inactif 60 jours", position: { x: 80, y: 40 }, config: { trigger_type: "inactivity", days_threshold: 60 } },
        { id: "a1", type: "action", action_type: "send_email", label: "Email empathique", position: { x: 80, y: 180 }, config: { action_type: "send_email", subject: "Tu nous manques 💭", content: "Cela fait un moment..." } },
        { id: "w1", type: "action", action_type: "wait", label: "Attendre 7 jours", position: { x: 80, y: 320 }, config: { action_type: "wait", wait_days: 7 } },
        { id: "a2", type: "action", action_type: "send_sms", label: "SMS offre", position: { x: 80, y: 460 }, config: { action_type: "send_sms", content: "Reviens avec -20% !" } },
      ],
      edges: [
        { id: "e1", source: "t1", target: "a1" },
        { id: "e2", source: "a1", target: "w1" },
        { id: "e3", source: "w1", target: "a2" },
      ],
    },
  },
  {
    name: "New Whale Alert",
    description: "Notifie le créateur et envoie un traitement VIP quand un fan devient whale",
    steps: {
      nodes: [
        { id: "t1", type: "trigger", trigger_type: "tier_change", label: "Tier → Whale", position: { x: 80, y: 40 }, config: { trigger_type: "tier_change", value: "whale" } },
        { id: "a1", type: "action", action_type: "notify_creator", label: "Notifier créateur", position: { x: 80, y: 180 }, config: { action_type: "notify_creator", message: "Nouveau whale détecté !" } },
        { id: "a2", type: "action", action_type: "send_email", label: "Email VIP", position: { x: 80, y: 320 }, config: { action_type: "send_email", subject: "Tu es VIP 🌟", content: "Merci pour ta fidélité !" } },
      ],
      edges: [
        { id: "e1", source: "t1", target: "a1" },
        { id: "e2", source: "a1", target: "a2" },
      ],
    },
  },
];
