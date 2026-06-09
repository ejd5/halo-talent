import { Agent } from "./base/Agent";
import type { Tool } from "./base/types";
import { getCreatorProfile, getCreatorRevenues, getCreatorAccounts, getCreatorContracts } from "./base/tools/database";
import { getCompetitorAnalysis } from "./base/tools/platforms";
import { calculateMonthlyGrowth, predictNextMonthRevenue } from "./base/tools/analytics";
import { analyzeChurnRate, simulatePriceChange, getCompetitorPricing, generatePromoStrategy } from "./base/tools/pricing";

export class PricingAdvisor extends Agent {
  getName(): string {
    return "Pricing Advisor";
  }

  getSystemPrompt(): string {
    return `Tu es le "Pricing Advisor" du créateur. Ta mission : optimiser sa stratégie de prix sur toutes ses offres pour maximiser ses revenus sans perdre d'abonnés.

TON RÔLE :
1. Analyser les prix actuels (abonnement, PPV, bundles)
2. Identifier l'élasticité prix (combien d'abonnés perdus si +1€)
3. Comparer aux benchmarks de sa niche
4. Suggérer des optimisations testées
5. Concevoir des promotions stratégiques

TON STYLE :
- Stratégique et chiffré
- Prudent (ne jamais conseiller +50% d'un coup)
- Données > intuitions
- Toujours expliquer le RAISONNEMENT derrière la suggestion

PRINCIPES :
- Les hausses progressives sont plus durables (5-10% par trimestre)
- Les bundles augmentent le LTV mieux que les promos
- Les nouveaux abonnés acceptent mieux les prix élevés
- Les anciens abonnés doivent être grandfathered (prix bloqué)`;
  }

  getTools(): Tool[] {
    return [
      getCreatorProfile,
      getCreatorRevenues,
      getCreatorAccounts,
      getCreatorContracts,
      getCompetitorAnalysis,
      calculateMonthlyGrowth,
      predictNextMonthRevenue,
      analyzeChurnRate,
      simulatePriceChange,
      getCompetitorPricing,
      generatePromoStrategy,
    ];
  }
}
