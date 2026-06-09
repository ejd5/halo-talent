interface ViralityFactors {
  velocity: number;
  acceleration: number;
  cross_platform: number;
  early_signal: number;
  geo_spread: number;
  novelty: number;
  creator_match: number;
}

export class ViralityScorer {
  calculate(trend: any, dna: any) {
    const factors: ViralityFactors = {
      velocity: this.velocity(trend),
      acceleration: this.acceleration(trend),
      cross_platform: this.crossPlatform(trend),
      early_signal: this.earlySignal(trend),
      geo_spread: this.geoSpread(trend),
      novelty: this.novelty(trend),
      creator_match: this.matchToCreator(trend, dna),
    };

    const weights = {
      velocity: 0.20,
      acceleration: 0.15,
      cross_platform: 0.20,
      early_signal: 0.15,
      geo_spread: 0.05,
      novelty: 0.10,
      creator_match: 0.15,
    };

    const total = Object.entries(factors).reduce(
      (sum, [k, v]) => sum + v * weights[k as keyof ViralityFactors],
      0,
    );

    return {
      total: Math.round(total),
      breakdown: factors,
      confidence: this.confidence(trend),
      window_hours: this.estimateWindow(factors),
      action: this.recommendAction(total),
    };
  }

  private velocity(trend: any): number {
    if (!trend.history || trend.history.length < 2) return 0;
    const recent = trend.history.slice(-7);
    const growth =
      (recent[recent.length - 1].value / Math.max(recent[0].value, 1) - 1) *
      100;
    return Math.min(growth, 100);
  }

  private acceleration(trend: any): number {
    if (!trend.history || trend.history.length < 4) return 0;
    const recent = trend.history.slice(-4);
    const v1 = recent[1].value - recent[0].value;
    const v2 = recent[3].value - recent[2].value;
    return Math.min(Math.max((v2 - v1) * 10, 0), 100);
  }

  private crossPlatform(trend: any): number {
    return Math.min((trend.platforms?.length || 0) / 5 * 100, 100);
  }

  private earlySignal(trend: any): number {
    const early = ["reddit", "tiktok", "discord"];
    const mature = ["google", "news"];
    const earlyCount = (trend.platforms || []).filter((p: string) =>
      early.includes(p),
    ).length;
    const matureCount = (trend.platforms || []).filter((p: string) =>
      mature.includes(p),
    ).length;
    if (earlyCount > 0 && matureCount === 0) return 100;
    if (earlyCount > 0 && matureCount > 0) return 50;
    return 20;
  }

  private geoSpread(trend: any): number {
    return Math.min((trend.countries?.length || 1) * 20, 100);
  }

  private novelty(trend: any): number {
    return trend.is_seasonal ? 30 : 80;
  }

  private matchToCreator(trend: any, dna: any): number {
    if (!trend.embedding || !dna.style_embedding) return 50;
    return this.cosineSimilarity(trend.embedding, dna.style_embedding) * 100;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dot = a.reduce((s, ai, i) => s + ai * b[i], 0);
    const magA = Math.sqrt(a.reduce((s, ai) => s + ai * ai, 0));
    const magB = Math.sqrt(b.reduce((s, bi) => s + bi * bi, 0));
    return dot / (magA * magB);
  }

  private confidence(
    trend: any,
  ): "high" | "medium" | "low" {
    if (
      (trend.history?.length || 0) >= 14 &&
      (trend.platforms?.length || 0) >= 2
    )
      return "high";
    if ((trend.history?.length || 0) >= 7) return "medium";
    return "low";
  }

  private estimateWindow(factors: ViralityFactors): number {
    if (factors.early_signal > 80) return 120;
    if (factors.acceleration > 60) return 72;
    return 36;
  }

  private recommendAction(score: number) {
    if (score >= 80)
      return { urgency: "critical" as const, recommendation: "create_immediately" as const };
    if (score >= 60)
      return { urgency: "high" as const, recommendation: "create_within_24h" as const };
    if (score >= 40)
      return { urgency: "medium" as const, recommendation: "plan_for_week" as const };
    return { urgency: "low" as const, recommendation: "monitor" as const };
  }
}
