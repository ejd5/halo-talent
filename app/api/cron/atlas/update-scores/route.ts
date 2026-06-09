import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateFanScore, determineTier, applyTierChange } from "@/lib/atlas/crm/scoring";
import type { FanInteraction, FanPurchase, FanTier } from "@/lib/atlas/crm/scoring";

// ═══════════════════════════════════════════════
// CRON: Update fan scores and tiers
// Runs every hour — batch of 100 fans per run
// Each fan is re-scored at least once per day
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

    // Fetch fans needing update — oldest updated_at first
    const { data: fans, error: fanError } = await supabase
      .from("atlas_fans")
      .select("id, creator_id, first_seen_at, last_interaction_at, last_purchase_at, total_spent, purchases_count, avg_order_value, email, phone, username_onlyfans, username_instagram, username_tiktok, fan_score, fan_tier, status")
      .eq("status", "active")
      .order("updated_at", { ascending: true })
      .limit(100);

    if (fanError) throw fanError;
    if (!fans || fans.length === 0) {
      return NextResponse.json({ updated: 0 });
    }

    let updatedCount = 0;
    let tierChangedCount = 0;

    for (const fan of fans) {
      // Fetch interactions (last 90 days is enough for scoring)
      const { data: rawInteractions } = await supabase
        .from("atlas_interactions")
        .select("id, channel, direction, occurred_at")
        .eq("fan_id", fan.id)
        .gte("occurred_at", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
        .order("occurred_at", { ascending: false });

      // Fetch all purchases
      const { data: rawPurchases } = await supabase
        .from("atlas_purchases")
        .select("id, type, amount, status, purchased_at")
        .eq("fan_id", fan.id);

      const interactions: FanInteraction[] = (rawInteractions ?? []).map((i: any) => ({
        id: i.id,
        channel: i.channel,
        direction: i.direction,
        occurred_at: i.occurred_at,
      }));

      const purchases: FanPurchase[] = (rawPurchases ?? []).map((p: any) => ({
        id: p.id,
        type: p.type,
        amount: p.amount,
        status: p.status,
        purchased_at: p.purchased_at,
      }));

      const completedPurchases = purchases.filter((p) => p.status === "completed");

      const newScore = calculateFanScore(fan, interactions, purchases);
      const newTier = determineTier(newScore, fan.total_spent, fan.last_interaction_at, completedPurchases.length);

      const currentTier = fan.fan_tier as FanTier;

      // Detect tier change and trigger automations
      if (currentTier !== newTier) {
        await applyTierChange(
          {
            fanId: fan.id,
            creatorId: fan.creator_id,
            previousTier: currentTier,
            newTier,
            score: newScore,
            timestamp: new Date(),
          },
          supabase,
        );
        tierChangedCount++;
      }

      // Update fan
      await supabase
        .from("atlas_fans")
        .update({
          fan_score: newScore,
          fan_tier: newTier,
          updated_at: new Date().toISOString(),
        })
        .eq("id", fan.id);

      updatedCount++;
    }

    return NextResponse.json({
      updated: updatedCount,
      tier_changes: tierChangedCount,
    });
  } catch (err) {
    console.error("[CRON ATLAS SCORES] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
