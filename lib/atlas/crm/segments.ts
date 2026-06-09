import { createClient } from "@/lib/supabase/server";

export interface SegmentDefinition {
  id?: string;
  name: string;
  description?: string;
  filters: SegmentFilter[];
  fan_count?: number;
}

export interface SegmentFilter {
  field: string;       // 'fan_tier','tags','total_spent','country','language','last_interaction','status'
  operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "contains" | "between";
  value: any;
}

export function buildSegmentQuery(
  supabase: ReturnType<typeof createClient> extends Promise<infer T> ? T : never,
  creatorId: string,
  filters: SegmentFilter[]
) {
  let query = supabase.from("atlas_fans").select("*", { count: "exact" }).eq("creator_id", creatorId);

  for (const f of filters) {
    switch (f.operator) {
      case "eq": query = query.eq(f.field, f.value); break;
      case "neq": query = query.neq(f.field, f.value); break;
      case "gt": query = query.gt(f.field, f.value); break;
      case "gte": query = query.gte(f.field, f.value); break;
      case "lt": query = query.lt(f.field, f.value); break;
      case "lte": query = query.lte(f.field, f.value); break;
      case "in": query = query.in(f.field, f.value); break;
      case "contains": query = query.contains(f.field, f.value); break;
    }
  }

  return query;
}

export async function getSegmentFanCount(
  supabase: ReturnType<typeof createClient> extends Promise<infer T> ? T : never,
  creatorId: string,
  filters: SegmentFilter[]
) {
  const query = buildSegmentQuery(supabase, creatorId, filters);
  const { count, error } = await (query as any).select("*", { count: "exact", head: true });
  if (error) console.error("[SEGMENTS] Count error:", error);
  return count ?? 0;
}

export const SEGMENT_PRESETS: SegmentDefinition[] = [
  {
    name: "Whales (top 10%)",
    description: "Fans les plus dépensiers",
    filters: [{ field: "fan_tier", operator: "in", value: ["whale", "vip"] }],
  },
  {
    name: "À relancer",
    description: "Inactifs depuis plus de 30 jours",
    filters: [
      { field: "status", operator: "eq", value: "active" },
      { field: "fan_tier", operator: "neq", value: "churned" },
    ],
  },
  {
    name: "Nouveaux leads",
    description: "Arrivés ce mois",
    filters: [{ field: "fan_tier", operator: "eq", value: "cold" }],
  },
  {
    name: "Abonnés consentants email",
    description: "Avec consent email actif",
    filters: [
      { field: "email_consent", operator: "eq", value: true },
      { field: "status", operator: "eq", value: "active" },
    ],
  },
  {
    name: "Fans français",
    description: "Basés en France",
    filters: [
      { field: "country", operator: "eq", value: "FR" },
      { field: "status", operator: "eq", value: "active" },
    ],
  },
];
