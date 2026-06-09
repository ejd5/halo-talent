import { createClient } from "@/lib/supabase/server";

interface LTNPrediction {
  current_ltv: number;
  predicted_ltv_12m: number;
  confidence: "high" | "medium" | "low";
  monthly_velocity: number;
  trend_direction: "growing" | "declining" | "stable";
  range: { low: number; high: number };
}

export class LTVPredictor {
  constructor(private creatorId: string) {}

  async predict(fanId: string): Promise<LTNPrediction | null> {
    const supabase = await createClient();

    const { data: fan } = await supabase
      .from("atlas_fans")
      .select("*")
      .eq("id", fanId)
      .eq("creator_id", this.creatorId)
      .single();
    if (!fan) return null;

    const { data: purchases } = await supabase
      .from("atlas_ppv_sends")
      .select("*")
      .eq("fan_id", fanId)
      .eq("creator_id", this.creatorId)
      .eq("unlocked", true)
      .order("unlocked_at", { ascending: false });

    if (!purchases || purchases.length === 0) {
      return {
        current_ltv: fan.total_spent || 0,
        predicted_ltv_12m: fan.total_spent || 0,
        confidence: "low",
        monthly_velocity: 0,
        trend_direction: "stable",
        range: { low: fan.total_spent || 0, high: fan.total_spent || 0 },
      };
    }

    const monthlyAvg = this.monthlyAverage(purchases);
    const trend = this.trend(purchases);
    const projected = monthlyAvg * (1 + trend);
    const ltv12m = fan.total_spent + projected * 12;
    const stdDev = this.stdDev(purchases);

    const confidence: "high" | "medium" | "low" =
      purchases.length >= 5 ? "high" : purchases.length >= 2 ? "medium" : "low";

    return {
      current_ltv: fan.total_spent || 0,
      predicted_ltv_12m: Math.round(ltv12m * 100) / 100,
      confidence,
      monthly_velocity: Math.round(monthlyAvg * 100) / 100,
      trend_direction:
        trend > 0.1 ? "growing" : trend < -0.1 ? "declining" : "stable",
      range: {
        low: Math.max(0, Math.round((ltv12m - stdDev) * 100) / 100),
        high: Math.round((ltv12m + stdDev) * 100) / 100,
      },
    };
  }

  private monthlyAverage(purchases: any[]): number {
    if (purchases.length === 0) return 0;
    const totalDays =
      (Date.now() - new Date(purchases[purchases.length - 1].unlocked_at).getTime()) /
      86400000;
    const months = Math.max(totalDays / 30, 1);
    const total = purchases.reduce((s, p) => s + Number(p.unlock_revenue || 0), 0);
    return total / months;
  }

  private trend(purchases: any[]): number {
    if (purchases.length < 6) return 0;
    const half = Math.floor(purchases.length / 2);
    const recent = purchases
      .slice(0, half)
      .reduce((s, p) => s + Number(p.unlock_revenue || 0), 0);
    const older = purchases
      .slice(half)
      .reduce((s, p) => s + Number(p.unlock_revenue || 0), 0);
    if (older === 0) return 0;
    return recent / older - 1;
  }

  private stdDev(purchases: any[]): number {
    if (purchases.length === 0) return 0;
    const values = purchases.map((p) => Number(p.unlock_revenue || 0));
    const mean = values.reduce((s, v) => s + v, 0) / values.length;
    const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
    return Math.sqrt(variance) * 12; // annualized std dev
  }
}
