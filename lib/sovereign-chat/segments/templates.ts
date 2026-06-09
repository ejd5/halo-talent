export interface SegmentRule {
  field: string;
  operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "contains" | "between" | "is_null" | "not_null";
  value: any;
}

export interface SegmentTemplate {
  id: string;
  name: string;
  description: string;
  rules: SegmentRule[];
  type: "smart";
  estimated_match: string;
  icon: string;
}

export const SEGMENT_TEMPLATES: SegmentTemplate[] = [
  {
    id: "whales_active",
    name: "Whales actifs",
    description: "Fans à forte valeur, engagés récemment",
    rules: [
      { field: "total_spent", operator: "gte", value: 1000 },
      { field: "last_interaction_at", operator: "gte", value: "now-7d" },
    ],
    type: "smart",
    estimated_match: "2-15% de tes fans",
    icon: "🐋",
  },
  {
    id: "whales_sleeping",
    name: "Whales endormis",
    description: "Fans à forte valeur mais plus engagés",
    rules: [
      { field: "total_spent", operator: "gte", value: 1000 },
      { field: "last_interaction_at", operator: "gte", value: "now-14d" },
    ],
    type: "smart",
    estimated_match: "1-8% de tes fans",
    icon: "💤",
  },
  {
    id: "vip_at_risk",
    name: "VIP à risque",
    description: "Tier VIP mais pas d'achat ce mois",
    rules: [
      { field: "fan_tier", operator: "eq", value: "vip" },
      { field: "last_purchase_at", operator: "gte", value: "now-30d" },
    ],
    type: "smart",
    estimated_match: "3-10% de tes fans",
    icon: "⚠️",
  },
  {
    id: "new_fans_qualified",
    name: "Nouveaux fans qualifiés",
    description: "Inscrits récemment avec engagement",
    rules: [
      { field: "days_since_signup", operator: "lte", value: 30 },
      { field: "total_interactions", operator: "gte", value: 5 },
    ],
    type: "smart",
    estimated_match: "5-20% de tes fans",
    icon: "✨",
  },
  {
    id: "churn_risk",
    name: "Risque de churn",
    description: "Baisse d'activité significative",
    rules: [
      { field: "last_interaction_at", operator: "gte", value: "now-30d" },
      { field: "total_interactions", operator: "lte", value: 2 },
    ],
    type: "smart",
    estimated_match: "8-25% de tes fans",
    icon: "📉",
  },
  {
    id: "collectors",
    name: "Collectionneurs",
    description: "Achètent des items variés",
    rules: [
      { field: "unique_items_purchased", operator: "gte", value: 5 },
    ],
    type: "smart",
    estimated_match: "1-5% de tes fans",
    icon: "🏆",
  },
  {
    id: "lurkers_high_value",
    name: "Lurkeurs à valeur",
    description: "Dépensent mais peu d'interactions",
    rules: [
      { field: "total_spent", operator: "gte", value: 500 },
      { field: "total_interactions", operator: "lte", value: 3 },
    ],
    type: "smart",
    estimated_match: "3-12% de tes fans",
    icon: "👻",
  },
  {
    id: "recent_reactivations",
    name: "Réactivations récentes",
    description: "Revenus après une période d'inactivité",
    rules: [
      { field: "last_purchase_at", operator: "gte", value: "now-7d" },
      { field: "total_spent", operator: "lte", value: 100 },
    ],
    type: "smart",
    estimated_match: "2-8% de tes fans",
    icon: "🔄",
  },
];
