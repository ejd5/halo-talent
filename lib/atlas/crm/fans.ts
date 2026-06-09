import { createClient } from "@/lib/supabase/server";

export interface AtlasFan {
  id: string;
  creator_id: string;
  email: string | null;
  phone: string | null;
  username_onlyfans: string | null;
  username_instagram: string | null;
  username_tiktok: string | null;
  username_other: Record<string, string>;
  first_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  country: string | null;
  language: string;
  timezone: string | null;
  total_spent: number;
  lifetime_value: number;
  last_purchase_at: string | null;
  purchases_count: number;
  avg_order_value: number;
  first_seen_at: string;
  last_interaction_at: string | null;
  total_interactions: number;
  fan_score: number;
  fan_tier: "cold" | "warm" | "engaged" | "whale" | "vip" | "churned";
  email_consent: boolean;
  sms_consent: boolean;
  push_consent: boolean;
  data_processing_consent: boolean;
  acquired_via: string | null;
  tags: string[];
  custom_fields: Record<string, unknown>;
  status: "active" | "unsubscribed" | "blocked" | "deleted";
  blocked_reason: string | null;
  created_at: string;
  updated_at: string;
}

export type FanTier = AtlasFan["fan_tier"];

export const TIER_LABELS: Record<FanTier, string> = {
  cold: "Froid",
  warm: "Tède",
  engaged: "Engagé",
  whale: "Gros dépensier",
  vip: "VIP",
  churned: "Perdu",
};

export const TIER_COLORS: Record<FanTier, string> = {
  cold: "rgba(255,255,255,0.3)",
  warm: "#F59E0B",
  engaged: "#3B82F6",
  whale: "#8B5CF6",
  vip: "#10B981",
  churned: "#E5484D",
};

export async function getFans(
  supabase: ReturnType<typeof createClient> extends Promise<infer T> ? T : never,
  creatorId: string,
  options?: {
    tier?: FanTier;
    status?: string;
    search?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
  }
) {
  let query = supabase
    .from("atlas_fans")
    .select("*", { count: "exact" })
    .eq("creator_id", creatorId);

  if (options?.tier) query = query.eq("fan_tier", options.tier);
  if (options?.status) query = query.eq("status", options.status);
  if (options?.search) {
    query = query.or(
      `email.ilike.%${options.search}%,display_name.ilike.%${options.search}%,first_name.ilike.%${options.search}%`
    );
  }
  if (options?.tags && options.tags.length > 0) {
    query = query.contains("tags", options.tags);
  }

  const limit = options?.limit ?? 50;
  const offset = options?.offset ?? 0;

  const { data, count } = await query
    .order("fan_score", { ascending: false })
    .range(offset, offset + limit - 1);

  return { fans: (data ?? []) as AtlasFan[], total: count ?? 0 };
}

export async function getFanById(
  supabase: ReturnType<typeof createClient> extends Promise<infer T> ? T : never,
  fanId: string,
  creatorId: string
) {
  const { data } = await supabase
    .from("atlas_fans")
    .select("*")
    .eq("id", fanId)
    .eq("creator_id", creatorId)
    .single();
  return data as AtlasFan | null;
}

export async function updateFanTier(
  supabase: ReturnType<typeof createClient> extends Promise<infer T> ? T : never,
  fanId: string,
  creatorId: string,
  tier: FanTier
) {
  const { data } = await supabase
    .from("atlas_fans")
    .update({ fan_tier: tier, updated_at: new Date().toISOString() })
    .eq("id", fanId)
    .eq("creator_id", creatorId)
    .select()
    .single();
  return data as AtlasFan | null;
}

export async function getFanStats(
  supabase: ReturnType<typeof createClient> extends Promise<infer T> ? T : never,
  creatorId: string
) {
  const { data: tierCounts } = await supabase
    .from("atlas_fans")
    .select("fan_tier")
    .eq("creator_id", creatorId)
    .eq("status", "active");

  const counts: Record<string, number> = {};
  for (const row of tierCounts ?? []) {
    counts[row.fan_tier] = (counts[row.fan_tier] ?? 0) + 1;
  }

  const { data: totals } = await supabase
    .from("atlas_fans")
    .select("count:id, total:total_spent.sum()")
    .eq("creator_id", creatorId)
    .eq("status", "active")
    .single();

  return {
    total: (totals as any)?.count ?? 0,
    whales: counts["whale"] ?? 0,
    vip: counts["vip"] ?? 0,
    engaged: counts["engaged"] ?? 0,
    warm: counts["warm"] ?? 0,
    cold: counts["cold"] ?? 0,
    churned: counts["churned"] ?? 0,
    total_revenue: (totals as any)?.total ?? 0,
  };
}
