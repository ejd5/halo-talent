import { createClient } from "@/lib/supabase/server";
import { getPlan, isUnlimited } from "./plans";
import type { CreditCheckResult, CreditBalance, CreditUsage, PlanTier } from "./types";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

// ─── Checks avant génération ───

export async function checkCredits(
  supabase: SupabaseClient,
  userId: string,
  cost: number,
  action?: string
): Promise<CreditCheckResult> {
  if (!userId) {
    return { allowed: false, reason: "no_auth", message: "Authentification requise" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, credits_ia, generation_suspended, credit_reset_at")
    .eq("id", userId)
    .single();

  if (!profile) {
    return { allowed: false, reason: "no_auth", message: "Profil introuvable" };
  }

  const p = profile as any;

  // Admin bypass total
  if (p.role === "admin") {
    return { allowed: true, reason: "ok", credits_available: 999999, credits_needed: cost, plan_tier: "elite" };
  }

  // Suspended check
  if (p.generation_suspended) {
    return {
      allowed: false,
      reason: "suspended",
      message: "Votre accès à la génération IA a été suspendu. Contactez le support.",
    };
  }

  // Free plan check
  const plan = getPlan(p.subscription_tier || "creator");
  if (plan.tier === "free") {
    return {
      allowed: false,
      reason: "free_plan",
      message: "Le plan Free n'inclut pas la génération d'images. Passez à un plan supérieur pour accéder à l'IA créative.",
      cta: { label: "Voir les plans", href: "/dashboard/upgrade?reason=studio" },
    };
  }

  // Unlimited check (Icon plan)
  if (isUnlimited(plan)) {
    return { allowed: true, reason: "ok", credits_available: -1, credits_needed: cost, plan_tier: plan.tier };
  }

  // Get current monthly usage
  const resetDate = p.credit_reset_at
    ? new Date(p.credit_reset_at)
    : getNextResetDate();

  const { data: monthlyUsage } = await supabase
    .from("credit_usage")
    .select("credits_used")
    .eq("creator_id", userId)
    .eq("status", "success")
    .gte("created_at", resetDate.toISOString());

  const usedThisMonth = (monthlyUsage as any[])?.reduce((sum, r) => sum + (r.credits_used || 0), 0) ?? 0;
  const remaining = Math.max(0, plan.credits_monthly - usedThisMonth);

  if (remaining < cost) {
    return {
      allowed: false,
      reason: "insufficient_credits",
      credits_available: remaining,
      credits_needed: cost,
      plan_tier: plan.tier,
      message: `Vous n'avez plus assez de crédits. Il vous manque ${cost - remaining} crédits pour générer.`,
      cta: { label: "Acheter des crédits", href: "/studio/credits" },
    };
  }

  // Daily limit check
  if (plan.max_daily_generations > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { data: dailyUsage } = await supabase
      .from("credit_usage")
      .select("credits_used")
      .eq("creator_id", userId)
      .eq("status", "success")
      .gte("created_at", today.toISOString());

    const usedToday = (dailyUsage as any[])?.reduce((sum, r) => sum + (r.credits_used || 0), 0) ?? 0;
    if (usedToday >= plan.max_daily_generations) {
      return {
        allowed: false,
        reason: "daily_limit",
        credits_available: remaining,
        credits_needed: cost,
        plan_tier: plan.tier,
        message: `Vous avez atteint votre limite journalière de ${plan.max_daily_generations} générations. Revenez demain ou passez à un plan supérieur.`,
        cta: { label: "Changer de plan", href: "/dashboard/upgrade" },
      };
    }
  }

  // Also check the raw credits_ia balance for backward compat
  const rawBalance = p.credits_ia ?? 0;
  if (rawBalance !== -1 && rawBalance < cost) {
    return {
      allowed: false,
      reason: "insufficient_credits",
      credits_available: remaining,
      credits_needed: cost,
      plan_tier: plan.tier,
      message: `Crédits insuffisants. Solde: ${remaining}, requis: ${cost}.`,
      cta: { label: "Acheter des crédits", href: "/studio/credits" },
    };
  }

  return { allowed: true, reason: "ok", credits_available: remaining, credits_needed: cost, plan_tier: plan.tier };
}

// ─── Deduction après succès ───

export async function deductCredits(
  supabase: SupabaseClient,
  userId: string,
  cost: number
): Promise<number> {
  // Atomic deduction
  const { data } = await supabase.rpc("decrement_credits", {
    user_id: userId,
    amount: cost,
  });

  if (data !== undefined) return data as number;

  // Fallback: manual update if RPC not available
  const { data: profile } = await supabase
    .from("profiles")
    .select("credits_ia")
    .eq("id", userId)
    .single();

  const current = (profile as any)?.credits_ia ?? 0;
  if (current === -1) return -1; // unlimited

  const remaining = Math.max(0, current - cost);
  await supabase.from("profiles").update({ credits_ia: remaining }).eq("id", userId);
  return remaining;
}

// ─── Logging ───

export async function logGeneration(
  supabase: SupabaseClient,
  params: {
    creator_id: string;
    action: string;
    credits_used: number;
    provider?: string | null;
    model?: string | null;
    prompt?: string | null;
    image_url?: string | null;
    status: "pending" | "success" | "failed";
    error?: string | null;
    metadata?: Record<string, unknown>;
  }
): Promise<void> {
  const { error } = await supabase.from("credit_usage").insert({
    creator_id: params.creator_id,
    action: params.action,
    credits_used: params.credits_used,
    provider: params.provider ?? null,
    model: params.model ?? null,
    cost_estimate: null,
    prompt: params.prompt ?? null,
    image_url: params.image_url ?? null,
    status: params.status,
    error: params.error ?? null,
    metadata: params.metadata ?? {},
  });

  if (error) {
    console.error("[CREDITS] Log error:", error.message);
  }
}

// ─── Get full balance ───

export async function getCreditBalance(
  supabase: SupabaseClient,
  userId: string
): Promise<CreditBalance> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, credits_ia, credit_reset_at")
    .eq("id", userId)
    .single();

  const p = profile as any;
  const isAdmin = p?.role === "admin";
  const plan = getPlan(p?.subscription_tier || "creator");
  const isUnlimitedCredits = isAdmin || isUnlimited(plan);

  const resetDate = p?.credit_reset_at ? new Date(p.credit_reset_at) : getNextResetDate();

  // Get monthly usage
  const { data: monthlyData } = await supabase
    .from("credit_usage")
    .select("credits_used, status, created_at, action, prompt, provider, image_url, error, id")
    .eq("creator_id", userId)
    .gte("created_at", resetDate.toISOString())
    .order("created_at", { ascending: false })
    .limit(100);

  const records = (monthlyData as any[]) ?? [];
  const usedThisMonth = records
    .filter((r) => r.status === "success")
    .reduce((sum, r) => sum + (r.credits_used || 0), 0);

  // Daily usage
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const usedToday = records
    .filter((r) => r.status === "success" && new Date(r.created_at) >= today)
    .reduce((sum, r) => sum + (r.credits_used || 0), 0);

  const history: CreditUsage[] = records.map((r) => ({
    id: r.id,
    creator_id: userId,
    action: r.action,
    credits_used: r.credits_used,
    provider: r.provider,
    model: r.model ?? null,
    cost_estimate: null,
    prompt: r.prompt,
    image_url: r.image_url,
    status: r.status,
    error: r.error,
    created_at: r.created_at,
  }));

  const creditsTotal = isUnlimitedCredits ? -1 : plan.credits_monthly;
  const creditsRemaining = isUnlimitedCredits
    ? -1
    : Math.max(0, plan.credits_monthly - usedThisMonth);

  return {
    tier: plan.tier,
    credits_remaining: creditsRemaining,
    credits_total: creditsTotal,
    credits_used_this_month: usedThisMonth,
    reset_date: resetDate.toISOString(),
    usage_today: usedToday,
    daily_limit: plan.max_daily_generations,
    is_admin: isAdmin,
    is_unlimited: isUnlimitedCredits,
    history,
  };
}

// ─── Utils ───

function getNextResetDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}
