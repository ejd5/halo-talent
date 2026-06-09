import { createClient } from "@/lib/supabase/server";

interface ChurnPrediction {
  score: number;
  level: "critical" | "high" | "medium" | "low";
  factors: string[];
  recommended_action: string;
  potential_loss?: number;
}

export class ChurnPredictor {
  constructor(private creatorId: string) {}

  async predict(fanId: string): Promise<ChurnPrediction | null> {
    const supabase = await createClient();

    const { data: fan } = await supabase
      .from("atlas_fans")
      .select("*")
      .eq("id", fanId)
      .eq("creator_id", this.creatorId)
      .single();
    if (!fan) return null;

    let score = 0;
    const factors: string[] = [];

    // Recency of interaction
    const daysSinceInteraction = fan.last_interaction_at
      ? (Date.now() - new Date(fan.last_interaction_at).getTime()) / 86400000
      : 999;

    if (daysSinceInteraction > 60) {
      score += 30;
      factors.push("60+ jours sans interaction");
    } else if (daysSinceInteraction > 30) {
      score += 20;
      factors.push("30+ jours sans interaction");
    } else if (daysSinceInteraction > 14) {
      score += 10;
      factors.push("14+ jours sans interaction");
    }

    // Recency of purchase
    const daysSincePurchase = fan.last_purchase_at
      ? (Date.now() - new Date(fan.last_purchase_at).getTime()) / 86400000
      : 999;

    if (daysSincePurchase > 90) {
      score += 25;
      factors.push("Pas d'achat depuis 90j+");
    } else if (daysSincePurchase > 60) {
      score += 15;
      factors.push("Pas d'achat depuis 60j+");
    } else if (daysSincePurchase > 30) {
      score += 5;
      factors.push("Pas d'achat depuis 30j+");
    }

    // Low engagement signals
    if (fan.total_interactions === 0 || fan.total_interactions < 3) {
      score += 15;
      factors.push("Très peu d'interactions");
    }

    // Low LTV relative to time since first seen
    if (fan.first_seen_at && fan.total_spent > 0) {
      const daysSinceFirst =
        (Date.now() - new Date(fan.first_seen_at).getTime()) / 86400000;
      const monthlyAvg = fan.total_spent / Math.max(daysSinceFirst / 30, 1);
      if (monthlyAvg < 10) {
        score += 10;
        factors.push("Dépense mensuelle très faible");
      }
    }

    // Fan tier: whales are riskier to lose
    if (fan.fan_tier === "whale" || fan.fan_tier === "vip") {
      score += 5; // higher stakes
    }

    const clippedScore = Math.min(score, 100);
    const level = clippedScore > 70 ? "critical" : clippedScore > 40 ? "high" : clippedScore > 20 ? "medium" : "low";

    return {
      score: clippedScore,
      level,
      factors,
      recommended_action: this.recommendAction(clippedScore, fan),
      potential_loss: this.estimatePotentialLoss(clippedScore, fan),
    };
  }

  private recommendAction(score: number, fan: any): string {
    if (score > 70) return "win_back_campaign_high_value";
    if (score > 40) return "personal_outreach";
    if (score > 20) return "engagement_content";
    return "continue_normal";
  }

  private estimatePotentialLoss(score: number, fan: any): number {
    if (!fan.total_spent) return 0;
    const probability = score / 100;
    // Projected loss = current LTV * probability * 2 (conservative 2x multiplier for future)
    return Math.round(fan.total_spent * probability * 2);
  }
}
