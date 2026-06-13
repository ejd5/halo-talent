import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ═══════════════════════════════════════════════
// CRON: Monthly credit reset
// Run on the 1st of every month at 00:00
// ═══════════════════════════════════════════════

export async function POST(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    const expected = `Bearer ${process.env.CRON_SECRET}`;
    if (!authHeader || authHeader !== expected) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const supabase = await createClient();

    // Fetch all profiles with a subscription tier
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, subscription_tier")
      .not("subscription_tier", "is", null);

    if (!profiles) {
      return NextResponse.json({ reset: 0 });
    }

    let resetCount = 0;

    for (const profile of profiles) {
      const { data: tier } = await supabase
        .from("subscription_tiers")
        .select("monthly_credits")
        .eq("id", profile.subscription_tier)
        .single();

      if (tier && tier.monthly_credits !== null) {
        await supabase.rpc("grant_credits", {
          p_user_id: profile.id,
          p_amount: tier.monthly_credits,
          p_monthly_quota: tier.monthly_credits,
          p_reset_at: nextMonth().toISOString(),
          p_reason: "monthly_grant",
        });
        resetCount++;
      } else if (tier && tier.monthly_credits === null) {
        // Icon tier, unlimited
        await supabase.from("credits_wallet").upsert({
          user_id: profile.id,
          current_balance: 999999,
          monthly_quota: 999999,
          reset_at: nextMonth().toISOString(),
        });
        resetCount++;
      }
    }

    return NextResponse.json({ reset: resetCount });
  } catch (err) {
    console.error("[CRON RESET] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

function nextMonth(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0));
}
