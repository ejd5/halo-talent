import { createClient } from "@/lib/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

// ─── Action → Provider mapping ───

const ACTION_TO_PROVIDER: Record<string, string> = {
  text_generation: "anthropic",
  image_generation: "replicate",
  video_generation: "runway",
  audio_generation: "elevenlabs",
  music_generation: "elevenlabs",
  voice_clone_setup: "elevenlabs",
  voice_generate: "elevenlabs",
  transcribe_audio: "openai",
};

// ─── Credit costs ───

export const CREDIT_COSTS: Record<string, number> = {
  // Image
  generate_image: 1,
  generate_image_wide: 2,
  upscale_2x: 2,
  upscale_4x: 4,
  variation: 1,
  inpaint: 2,
  remove_bg: 1,
  // Text
  generate_text: 1,
  // Video (per second)
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

export function getCreditCost(action: string): number {
  return CREDIT_COSTS[action] ?? 1;
}

// ─── Check if user has BYOK for this action ───

async function hasByokForAction(
  supabase: SupabaseClient,
  userId: string,
  action: string
): Promise<{ hasByok: boolean; provider?: string }> {
  const providerKey = ACTION_TO_PROVIDER[action];
  if (!providerKey) return { hasByok: false };

  const { data: apiKeys } = await supabase
    .from("user_api_keys")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!apiKeys) return { hasByok: false };

  const keyFieldMap: Record<string, string> = {
    anthropic: "anthropic_key",
    replicate: "replicate_key",
    runway: "runway_key",
    elevenlabs: "elevenlabs_key",
    openai: "openai_key",
  };

  const field = keyFieldMap[providerKey];
  if (!field) return { hasByok: false };

  // Check if key exists AND BYOK is enabled for this provider
  const byokEnabled = (apiKeys.byok_enabled_for ?? []) as string[];
  if (apiKeys[field] && byokEnabled.includes(providerKey)) {
    return { hasByok: true, provider: providerKey };
  }

  return { hasByok: false };
}

// ─── Check and deduct credits ───

export async function checkAndDeductCredits(
  userId: string,
  action: string,
  amount?: number
): Promise<{ success: boolean; remaining?: number; error?: string }> {
  const supabase = await createClient();

  // 1. Verify user exists
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, subscription_tier")
    .eq("id", userId)
    .single();

  if (!profile) {
    return { success: false, error: "user_not_found" };
  }

  // Admin bypass
  if (profile.role === "admin") {
    return { success: true, remaining: -1 };
  }

  const cost = amount ?? getCreditCost(action);

  // 2. Check BYOK — if user has their own key, no deduction
  const byok = await hasByokForAction(supabase, userId, action);
  if (byok.hasByok) {
    return { success: true, remaining: -1, error: undefined };
  }

  // 3. Icon tier = unlimited
  if (profile.subscription_tier === "icon") {
    return { success: true, remaining: -1 };
  }

  // 4. Check wallet balance
  const { data: wallet } = await supabase
    .from("credits_wallet")
    .select("current_balance")
    .eq("user_id", userId)
    .single();

  if (!wallet) {
    // No wallet yet — they're on a free tier or not initialized
    return { success: false, error: "insufficient_credits" };
  }

  if (wallet.current_balance < cost) {
    return {
      success: false,
      error: "insufficient_credits",
    };
  }

  // 5. Deduct atomically via RPC
  try {
    const { data: remaining } = await supabase.rpc("deduct_credits", {
      p_user_id: userId,
      p_amount: cost,
      p_reason: action,
    });

    return {
      success: true,
      remaining: remaining as number,
    };
  } catch (err: any) {
    if (err?.message?.includes("insufficient_credits")) {
      return { success: false, error: "insufficient_credits" };
    }
    return { success: false, error: "deduction_failed" };
  }
}

// ─── Grant monthly credits ───

export async function grantMonthlyCredits(userId: string): Promise<void> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", userId)
    .single();

  if (!profile) return;

  const { data: tier } = await supabase
    .from("subscription_tiers")
    .select("monthly_credits, id")
    .eq("id", profile.subscription_tier ?? "free")
    .single();

  if (!tier || tier.monthly_credits === null) {
    // Icon tier or unknown — set unlimited-like balance
    await supabase.from("credits_wallet").upsert({
      user_id: userId,
      current_balance: 999999,
      monthly_quota: 999999,
      reset_at: nextMonth().toISOString(),
    });
    return;
  }

  await supabase.rpc("grant_credits", {
    p_user_id: userId,
    p_amount: tier.monthly_credits,
    p_monthly_quota: tier.monthly_credits,
    p_reset_at: nextMonth().toISOString(),
    p_reason: "monthly_grant",
  });
}

// ─── Get wallet balance with history ───

export async function getWalletBalance(userId: string) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, subscription_tier")
    .eq("id", userId)
    .single();

  const isAdmin = profile?.role === "admin";
  const tierId = profile?.subscription_tier ?? "free";

  const { data: tier } = await supabase
    .from("subscription_tiers")
    .select("*")
    .eq("id", tierId)
    .single();

  const { data: wallet } = await supabase
    .from("credits_wallet")
    .select("*")
    .eq("user_id", userId)
    .single();

  const { data: transactions } = await supabase
    .from("credits_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(100);

  const { data: usageByCategory } = await supabase
    .from("credits_transactions")
    .select("reason, amount")
    .eq("user_id", userId)
    .eq("type", "deduct")
    .gte("created_at", wallet?.reset_at?.toISOString() ?? new Date(0).toISOString());

  const balance = wallet?.current_balance ?? 0;
  const monthlyQuota = wallet?.monthly_quota ?? tier?.monthly_credits ?? 0;
  const isUnlimited = tier?.features?.unlimited === true || isAdmin;

  // Build per-category consumption
  const categoryConsumption: Record<string, number> = {};
  (usageByCategory ?? []).forEach((t: any) => {
    const cat = t.reason?.split("_").slice(0, 2).join("_") ?? "other";
    categoryConsumption[cat] = (categoryConsumption[cat] ?? 0) + Math.abs(t.amount);
  });

  // 30-day chart data
  const chart30d = buildChartData(transactions ?? []);

  return {
    balance,
    monthly_quota: isUnlimited ? -1 : monthlyQuota,
    reset_at: wallet?.reset_at?.toISOString() ?? nextMonth().toISOString(),
    total_purchased: wallet?.total_purchased ?? 0,
    tier: tier ?? { id: tierId, name: "Free", features: {} },
    is_admin: isAdmin,
    is_unlimited: isUnlimited,
    transactions: (transactions ?? []).slice(0, 50),
    category_consumption: categoryConsumption,
    chart_30d: chart30d,
  };
}

// ─── Chart builder ───

function buildChartData(transactions: any[]) {
  const days: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days[key] = 0;
  }
  (transactions ?? [])
    .filter((t: any) => t.type === "deduct")
    .forEach((t: any) => {
      const key = t.created_at?.slice(0, 10);
      if (key && key in days) {
        days[key] += Math.abs(t.amount);
      }
    });
  return Object.entries(days).map(([date, value]) => ({ date, value }));
}

// ─── Utils ───

function nextMonth(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0));
}
