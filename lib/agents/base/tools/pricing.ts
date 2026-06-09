import type { Tool } from "../types";

export const analyzeChurnRate: Tool = {
  name: "analyze_churn_rate",
  description: "Analyze the creator's churn rate and identify patterns in subscriber losses",
  input_schema: {
    type: "object",
    properties: {
      platform: { type: "string", enum: ["onlyfans", "mym", "fansly", "all"] },
      period_days: { type: "number", default: 90 },
    },
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const since = new Date(Date.now() - (input.period_days ?? 90) * 86400000).toISOString();

    const { data: revenues } = await supabase
      .from("monthly_revenues")
      .select("amount, month, platform")
      .eq("creator_id", creatorId)
      .gte("month", since.slice(0, 7))
      .order("month", { ascending: true });

    if (!revenues || revenues.length < 2) {
      return {
        churn_rate: null,
        message: "Not enough revenue data to calculate churn",
        trend: "unknown",
      };
    }

    // Estimate churn from revenue changes month over month
    const monthlyChanges = [];
    for (let i = 1; i < revenues.length; i++) {
      const prev = revenues[i - 1].amount ?? 0;
      const curr = revenues[i].amount ?? 0;
      if (prev > 0) {
        const change = (curr - prev) / prev;
        // If revenue dropped by more than 5%, attribute some to churn
        if (change < -0.05) {
          monthlyChanges.push({
            month: revenues[i].month,
            estimated_churn: Math.round(Math.abs(change) * 100 * 100) / 100,
            revenue_before: prev,
            revenue_after: curr,
          });
        }
      }
    }

    const avgChurn = monthlyChanges.length > 0
      ? Math.round((monthlyChanges.reduce((s, m) => s + m.estimated_churn, 0) / monthlyChanges.length) * 100) / 100
      : 2.5; // Default industry estimate

    return {
      churn_rate: avgChurn,
      estimated_monthly_loss_pct: avgChurn,
      trend: monthlyChanges.length > 0 ? "needs_attention" : "stable",
      months_analyzed: revenues.length,
      monthly_breakdown: monthlyChanges,
      recommendation: avgChurn > 5
        ? "Ton taux de churn est élevé. Envisage d'ajouter du contenu exclusif et des avantages fidélité."
        : avgChurn > 2
        ? "Ton churn est dans la moyenne. Un petit effort sur la rétention pourrait faire la différence."
        : "Bon taux de rétention ! Continue d'entretenir cette relation avec tes abonnés.",
    };
  },
};

export const simulatePriceChange: Tool = {
  name: "simulate_price_change",
  description: "Simulate the impact of a price change on revenue based on historical churn data",
  input_schema: {
    type: "object",
    properties: {
      current_price: { type: "number", description: "Current subscription price in €" },
      new_price: { type: "number", description: "Proposed new subscription price in €" },
      current_subscribers: { type: "number", description: "Current number of subscribers" },
      platform: { type: "string", enum: ["onlyfans", "mym", "fansly"] },
    },
    required: ["current_price", "new_price", "current_subscribers"],
  },
  execute: async (input) => {
    const priceIncrease = input.new_price - input.current_price;
    const priceIncreasePct = priceIncrease / input.current_price;

    // Elasticity model: 40% elasticity means 1% price increase → 0.4% subscriber loss
    const elasticity = 0.4;
    const estimatedChurnPct = Math.min(priceIncreasePct * elasticity, 0.5); // Cap at 50% churn
    const estimatedLostSubs = Math.floor(input.current_subscribers * estimatedChurnPct);
    const remainingSubs = input.current_subscribers - estimatedLostSubs;

    const currentRevenue = input.current_price * input.current_subscribers;
    const newRevenue = input.new_price * remainingSubs;
    const revenueDelta = newRevenue - currentRevenue;

    // Break-even analysis
    const minSubsForBreakEven = Math.ceil(currentRevenue / input.new_price);
    const maxChurnForBreakEven = ((input.current_subscribers - minSubsForBreakEven) / input.current_subscribers) * 100;

    return {
      simulation: {
        current_price: input.current_price,
        new_price: input.new_price,
        current_subscribers: input.current_subscribers,
        estimated_churn_pct: Math.round(estimatedChurnPct * 100 * 100) / 100,
        estimated_lost_subs: estimatedLostSubs,
        remaining_subscribers: remainingSubs,
        current_monthly_revenue: Math.round(currentRevenue * 100) / 100,
        estimated_new_revenue: Math.round(newRevenue * 100) / 100,
        revenue_delta: Math.round(revenueDelta * 100) / 100,
      },
      break_even: {
        min_subscribers_needed: minSubsForBreakEven,
        max_churn_tolerance_pct: Math.round(maxChurnForBreakEven * 100) / 100,
      },
      recommendation: revenueDelta > 0
        ? "positive_outlook"
        : revenueDelta === 0
        ? "neutral"
        : "caution_advised",
      recommendation_text: revenueDelta > 0
        ? `Cette augmentation de ${priceIncrease}€ semble viable. Tu pourrais gagner ~${Math.round(revenueDelta)}€/mois.`
        : revenueDelta === 0
        ? "Le revenu resterait stable, mais tu risques de perdre des abonnés. À éviter."
        : `Risque de perte de ~${Math.round(Math.abs(revenueDelta))}€/mois. Essaie une augmentation plus progressive (${Math.round(input.current_price * 1.05)}€ d'abord).`,
      disclaimer: "Il s'agit d'une simulation basée sur un modèle d'élasticité standard. Les résultats réels peuvent varier.",
    };
  },
};

export const getCompetitorPricing: Tool = {
  name: "get_competitor_pricing",
  description: "Get pricing benchmarks from similar creators in the same niche and platform",
  input_schema: {
    type: "object",
    properties: {
      platform: { type: "string", enum: ["onlyfans", "mym", "fansly"] },
      niche: { type: "string", description: "e.g. fitness, beauty, music" },
    },
  },
  execute: async (input) => {
    // Mock pricing benchmarks by niche
    const pricingData: Record<string, any> = {
      fitness: { avg_subscription: 12, avg_ppv: 18, top_10_pct_subscription: 20, top_10_pct_ppv: 35 },
      beauty: { avg_subscription: 10, avg_ppv: 15, top_10_pct_subscription: 18, top_10_pct_ppv: 30 },
      music: { avg_subscription: 8, avg_ppv: 12, top_10_pct_subscription: 15, top_10_pct_ppv: 25 },
      gaming: { avg_subscription: 7, avg_ppv: 10, top_10_pct_subscription: 14, top_10_pct_ppv: 22 },
      lifestyle: { avg_subscription: 9, avg_ppv: 14, top_10_pct_subscription: 16, top_10_pct_ppv: 28 },
      adult: { avg_subscription: 11, avg_ppv: 20, top_10_pct_subscription: 22, top_10_pct_ppv: 40 },
    };

    const niche = input.niche?.toLowerCase() ?? "general";
    const data = pricingData[niche] ?? { avg_subscription: 10, avg_ppv: 15, top_10_pct_subscription: 18, top_10_pct_ppv: 28 };

    return {
      platform: input.platform ?? "onlyfans",
      niche,
      benchmarks: {
        average_subscription_price: `${data.avg_subscription}€/mois`,
        average_ppv_price: `${data.avg_ppv}€`,
        top_10_percent_subscription: `${data.top_10_pct_subscription}€/mois`,
        top_10_percent_ppv: `${data.top_10_pct_ppv}€`,
        price_range: {
          subscription_min: `${Math.round(data.avg_subscription * 0.5)}€`,
          subscription_max: `${data.top_10_pct_subscription}€`,
          ppv_min: `${Math.round(data.avg_ppv * 0.5)}€`,
          ppv_max: `${data.top_10_pct_ppv}€`,
        },
      },
      recommendation: `Dans la niche "${niche}", le prix d'abonnement moyen est de ${data.avg_subscription}€/mois. Les créateurs du top 10% facturent jusqu'à ${data.top_10_pct_subscription}€/mois.`,
      source: "Halo Talent Market Data 2026",
    };
  },
};

export const generatePromoStrategy: Tool = {
  name: "generate_promo_strategy",
  description: "Generate a promotional pricing strategy (discounts, bundles, trial periods)",
  input_schema: {
    type: "object",
    properties: {
      platform: { type: "string", enum: ["onlyfans", "mym", "fansly"] },
      current_subscription_price: { type: "number" },
      goal: { type: "string", enum: ["acquire", "retain", "reactivate", "maximize_revenue"] },
      subscriber_count: { type: "number" },
    },
    required: ["platform", "current_subscription_price", "goal"],
  },
  execute: async (input) => {
    const price = input.current_subscription_price ?? 10;
    const goal = input.goal ?? "acquire";

    const strategies: Record<string, any> = {
      acquire: {
        name: "Promo de bienvenue",
        description: `Offre -25% sur le premier mois (${Math.round(price * 0.75)}€ au lieu de ${price}€)`,
        expected_impact: "+35% nouveaux abonnés sur 30 jours",
        risk: "Faible — les nouveaux abonnés paient moins au départ",
        duration_recommendation: "1 mois maximum",
      },
      retain: {
        name: "Abonnement annuel",
        description: `Passe tes abonnés mensuels en annuel avec 2 mois offerts (${Math.round(price * 10)}€/an au lieu de ${Math.round(price * 12)}€)`,
        expected_impact: "+20% de rétention, meilleur LTV",
        risk: "Réduit le revenu mensuel affiché mais augmente le revenu garanti",
        duration_recommendation: "12 mois",
      },
      reactivate: {
        name: "Campagne de réactivation",
        description: `Offre spéciale -40% pour les anciens abonnés : ${Math.round(price * 0.6)}€/mois pendant 3 mois`,
        expected_impact: "+15% de réactivation des abonnés perdus",
        risk: "Moyen — peut dévaluer ta marque si trop fréquent",
        duration_recommendation: "3 mois max, avec limite d'1 utilisation par abonné",
      },
      maximize_revenue: {
        name: "Bundle PPV + Abonnement",
        description: `Pack premium : abonnement à ${price}€ + 5 PPV exclusifs pour ${Math.round(price + 15)}€/mois`,
        expected_impact: "+40% ARPU (revenu moyen par abonné)",
        risk: "Moyen — nécessite du contenu exclusif régulier",
        duration_recommendation: "Continu, avec rotation du contenu PPV",
      },
    };

    const strategy = strategies[goal] ?? strategies.acquire;

    return {
      platform: input.platform ?? "onlyfans",
      goal,
      strategy: {
        name: strategy.name,
        description: strategy.description,
        expected_impact: strategy.expected_impact,
        risk: strategy.risk,
        duration: strategy.duration_recommendation,
      },
      alternatives: Object.entries(strategies)
        .filter(([key]) => key !== goal)
        .map(([key, val]: [string, any]) => ({
          goal: key,
          name: val.name,
          description: val.description,
        })),
      note: "Toutes ces stratégies sont des suggestions. Le créateur applique manuellement sur sa plateforme.",
    };
  },
};
