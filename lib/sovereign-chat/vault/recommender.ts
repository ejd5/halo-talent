import { createClient } from "@/lib/supabase/server";

interface ScoredFan {
  fan: Record<string, any>;
  score: number;
  reason: string;
  probability: number;
  cooldown?: CooldownStatus;
}

interface ProductRecommendation {
  product: Record<string, unknown>;
  score: number;
  reason: string;
}

interface CooldownStatus {
  weeklyPpvCount: number;
  hoursSinceLastPpv: number;
  consecutiveIgnored: number;
  blocked: boolean;
  blockReasons: string[];
}

const COOLDOWN = {
  maxPerWeek: 2,
  minHoursBetween: 48,
  pauseAfterIgnored: 3,
  pauseDays: 7,
};

export class ContentRecommender {
  constructor(private creatorId: string) {}

  async recommendFansForProduct(productId: string): Promise<ScoredFan[]> {
    const supabase = await createClient();

    const { data: product } = await supabase
      .from("atlas_ppv_products")
      .select("*")
      .eq("id", productId)
      .single();
    if (!product) return [];

    // Cold-start creator: use tier/LTV heuristics
    const { count } = await supabase
      .from("atlas_ppv_sends")
      .select("id", { count: "exact", head: true })
      .eq("creator_id", this.creatorId)
      .eq("unlocked", true);
    const isColdStart = !count || count < 5;

    let scoredFans: ScoredFan[];

    if (isColdStart) {
      scoredFans = await this.coldStartRecommendation(product, supabase);
    } else {
      scoredFans = await this.historyBasedRecommendation(product, supabase);
    }

    // Exclude already-bought
    const { data: alreadyBought } = await supabase
      .from("atlas_ppv_sends")
      .select("fan_id")
      .eq("product_id", productId)
      .eq("unlocked", true)
      .eq("creator_id", this.creatorId);
    const boughtIds = new Set((alreadyBought || []).map((s) => s.fan_id));
    scoredFans = scoredFans.filter((f) => !boughtIds.has(f.fan.id));

    // Apply anti-fatigue cooldown
    scoredFans = await this.applyCooldownBatch(scoredFans, supabase);

    return scoredFans.slice(0, 50);
  }

  async recommendProductsForFan(fanId: string): Promise<ProductRecommendation[]> {
    const supabase = await createClient();

    const { data: fanPurchases } = await supabase
      .from("atlas_ppv_sends")
      .select("*, atlas_ppv_products(*)")
      .eq("fan_id", fanId)
      .eq("unlocked", true)
      .eq("creator_id", this.creatorId);

    const preferred = this.extractPreferences(fanPurchases || []);

    const { data: candidates } = await supabase
      .from("atlas_ppv_products")
      .select("*")
      .eq("is_active", true)
      .eq("creator_id", this.creatorId);

    const boughtIds = new Set(
      (fanPurchases || []).map((p) => (p.atlas_ppv_products as any)?.id).filter(Boolean),
    );

    return (candidates || [])
      .filter((p) => !boughtIds.has(p.id))
      .map((p) => ({
        product: p,
        score: this.matchScore(p, preferred),
        reason: this.productReason(p, preferred),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }

  // ─── Cold start ────────────────────────────────────────────

  private async coldStartRecommendation(product: any, supabase: any): Promise<ScoredFan[]> {
    const { data: fans } = await supabase
      .from("atlas_fans")
      .select("*")
      .eq("creator_id", this.creatorId)
      .order("total_spent", { ascending: false })
      .limit(100);

    return (fans || []).map((fan: any) => {
      const tierBonus = { whale: 30, vip: 20, regular: 10, new: 5 }[fan.fan_tier as string] || 0;
      const spendScore = Math.min((fan.total_spent / 500) * 40, 40);
      const interactionScore = fan.last_interaction_at
        ? Math.max(0, 30 - (Date.now() - new Date(fan.last_interaction_at).getTime()) / 86400000)
        : 0;
      const score = tierBonus + spendScore + interactionScore;

      return {
        fan,
        score: Math.round(score),
        reason: this.coldStartReason(fan),
        probability: Math.round(100 / (1 + Math.exp(-score / 30 + 1))),
      };
    });
  }

  private coldStartReason(fan: any): string {
    const parts: string[] = [];
    const tiers: Record<string, string> = { whale: "Top dépensier", vip: "VIP", regular: "Régulier" };
    if (tiers[fan.fan_tier]) parts.push(tiers[fan.fan_tier]);
    if (fan.total_spent > 200) parts.push("Forte LTV");
    return parts.length > 0 ? parts.join(" · ") : "Profil prometteur";
  }

  // ─── History-based ─────────────────────────────────────────

  private async historyBasedRecommendation(product: any, supabase: any): Promise<ScoredFan[]> {
    const { data: similarPurchases } = await supabase
      .from("atlas_ppv_sends")
      .select("fan_id, atlas_ppv_products!inner(category, tags, price)")
      .eq("unlocked", true)
      .eq("creator_id", this.creatorId);

    const fanScores = new Map<string, { score: number; reasons: string[] }>();

    for (const purchase of similarPurchases || []) {
      const rel = purchase.atlas_ppv_products as any;
      const tagsOverlap = this.tagOverlap(product.tags || [], rel?.tags || []);
      const categoryMatch = product.category === rel?.category ? 1 : 0;
      const priceMatch = this.priceCompat(product.price, rel?.price);

      const score = tagsOverlap * 50 + categoryMatch * 30 + priceMatch * 20;
      const existing = fanScores.get(purchase.fan_id) || { score: 0, reasons: [] };
      existing.score += score;
      if (categoryMatch) existing.reasons.push("Même catégorie");
      if (tagsOverlap > 0.5) existing.reasons.push("Tags similaires");
      if (priceMatch > 0.8) existing.reasons.push("Prix similaire");
      fanScores.set(purchase.fan_id, existing);
    }

    const topFanIds = [...fanScores.entries()]
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, 50)
      .map(([id]) => id);

    const { data: topFans } = await supabase
      .from("atlas_fans")
      .select("*")
      .in("id", topFanIds);

    return (topFans || []).map((f: any) => {
      const scoring = fanScores.get(f.id)!;
      return {
        fan: f,
        score: scoring.score,
        reason: this.formatReason(scoring.reasons),
        probability: this.scoreToProbability(scoring.score),
      };
    });
  }

  // ─── Anti-fatigue cooldown ────────────────────────────────

  private async applyCooldownBatch(fans: ScoredFan[], supabase: any): Promise<ScoredFan[]> {
    if (fans.length === 0) return fans;

    const fanIds = fans.map((f) => f.fan.id);
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();

    const { data: recentSends } = await supabase
      .from("atlas_ppv_sends")
      .select("fan_id, sent_at, time_to_unlock_seconds")
      .in("fan_id", fanIds)
      .gte("sent_at", sevenDaysAgo)
      .order("sent_at", { ascending: false });

    const sendMap = new Map<string, typeof recentSends>();
    for (const s of recentSends || []) {
      if (!sendMap.has(s.fan_id)) sendMap.set(s.fan_id, []);
      sendMap.get(s.fan_id)!.push(s);
    }

    return fans.map((f) => {
      const cooldown = this.checkCooldown(f.fan.id, sendMap.get(f.fan.id) || []);
      return { ...f, cooldown };
    });
  }

  private checkCooldown(fanId: string, recentSends: any[]): CooldownStatus {
    const blockReasons: string[] = [];

    const weeklyPpvCount = recentSends.length;
    if (weeklyPpvCount >= COOLDOWN.maxPerWeek) {
      blockReasons.push(`Déjà ${weeklyPpvCount} PPV cette semaine (max ${COOLDOWN.maxPerWeek})`);
    }

    let hoursSinceLastPpv = Infinity;
    if (recentSends.length > 0) {
      hoursSinceLastPpv =
        (Date.now() - new Date(recentSends[0].sent_at).getTime()) / 3600000;
      if (hoursSinceLastPpv < COOLDOWN.minHoursBetween) {
        blockReasons.push(
          `Dernier PPV il y a ${Math.round(hoursSinceLastPpv)}h (min ${COOLDOWN.minHoursBetween}h)`,
        );
      }
    }

    const consecutiveIgnored = recentSends.filter(
      (s) => s.time_to_unlock_seconds === null,
    ).length;
    if (consecutiveIgnored >= COOLDOWN.pauseAfterIgnored) {
      blockReasons.push(
        `${consecutiveIgnored} PPV ignorés consécutifs, pause ${COOLDOWN.pauseDays}j recommandée`,
      );
    }

    return {
      weeklyPpvCount,
      hoursSinceLastPpv: hoursSinceLastPpv === Infinity ? 99 : Math.round(hoursSinceLastPpv),
      consecutiveIgnored,
      blocked: blockReasons.length > 0,
      blockReasons,
    };
  }

  // ─── Scoring helpers ───────────────────────────────────────

  private tagOverlap(t1: string[], t2: string[]): number {
    const intersection = t1.filter((t) => t2.includes(t));
    const union = [...new Set([...t1, ...t2])];
    return union.length > 0 ? intersection.length / union.length : 0;
  }

  private priceCompat(p1: number, p2: number): number {
    if (!p1 || !p2) return 0.5;
    return Math.min(p1, p2) / Math.max(p1, p2);
  }

  private scoreToProbability(score: number): number {
    return Math.min(97, Math.max(3, Math.round(100 / (1 + Math.exp(-score / 30 + 1)))));
  }

  private formatReason(reasons: string[]): string {
    if (reasons.length === 0) return "Profil cohérent";
    return [...new Set(reasons)].join(" · ");
  }

  private extractPreferences(purchases: any[]): Record<string, any> {
    const categories: Record<string, number> = {};
    const tags: Record<string, number> = {};
    let totalPrice = 0;
    let priceCount = 0;

    for (const p of purchases || []) {
      const rel = p.atlas_ppv_products as any;
      if (rel?.category) categories[rel.category] = (categories[rel.category] || 0) + 1;
      for (const t of rel?.tags || []) tags[t] = (tags[t] || 0) + 1;
      if (rel?.price) {
        totalPrice += rel.price;
        priceCount++;
      }
    }

    return {
      topCategory:
        Object.entries(categories).sort((a, b) => b[1] - a[1])[0]?.[0] || null,
      topTags: Object.entries(tags)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([t]) => t),
      avgPrice: priceCount > 0 ? totalPrice / priceCount : 0,
      categoryScores: categories,
    };
  }

  private matchScore(product: any, prefs: Record<string, any>): number {
    let score = 30; // base

    if (prefs.topCategory && product.category === prefs.topCategory) score += 30;
    if (prefs.topTags?.length && product.tags) {
      const overlap = product.tags.filter((t: string) => prefs.topTags.includes(t)).length;
      score += overlap * 10;
    }
    if (prefs.avgPrice > 0) {
      const compat = this.priceCompat(product.price, prefs.avgPrice);
      score += compat * 20;
    }

    return Math.min(100, score);
  }

  private productReason(product: any, prefs: Record<string, any>): string {
    const reasons: string[] = [];
    if (prefs.topCategory && product.category === prefs.topCategory) {
      reasons.push(`Aimé la catégorie ${product.category}`);
    }
    if (prefs.topTags?.length && product.tags) {
      const overlap = product.tags.filter((t: string) => prefs.topTags.includes(t));
      if (overlap.length > 0) reasons.push(`Tags: ${overlap.join(", ")}`);
    }
    if (prefs.avgPrice > 0) {
      const compat = this.priceCompat(product.price, prefs.avgPrice);
      if (compat > 0.8) reasons.push("Prix habituel");
      else if (product.price < prefs.avgPrice) reasons.push("Moins cher que ses achats");
      else reasons.push("Premium");
    }
    return reasons.length > 0 ? reasons.join(" · ") : "Nouveau contenu";
  }
}
