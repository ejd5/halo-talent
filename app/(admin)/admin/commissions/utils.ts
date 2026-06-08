import type { Creator } from "../creators/types";
import { tierConfig } from "../creators/data";
import type { CommissionRow } from "./types";
import type { CommissionAdjustment } from "./types";

export function buildCommissionRows(
  creators: Creator[],
  adjustments: CommissionAdjustment[]
): CommissionRow[] {
  const currentMonth = "Jun";

  return creators.map((c) => {
    const mr = c.monthly_revenue.find((m) => m.month === currentMonth);
    const gross = mr?.total_gross ?? 0;
    const net = mr?.total_net ?? 0;

    const contractRate = 15;
    const contractCommission = Math.round(gross * (contractRate / 100));

    const tier = tierConfig[c.tier];
    const tierMinRevenue = tier?.minRevenue ?? 0;

    const creatorAdjustments = adjustments.filter(
      (a) => a.creator_id === c.id && a.status === "validated"
    );
    const totalAdjustment = creatorAdjustments.reduce(
      (sum, a) => sum + a.difference,
      0
    );

    return {
      creator_id: c.id,
      creator_name: c.full_name,
      creator_avatar: c.avatar_url,
      department: c.department,
      tier: c.tier,
      month: currentMonth,
      gross,
      contract_rate: contractRate,
      contract_commission_eur: contractCommission,
      tier_min_revenue: tierMinRevenue,
      tier_reason: `Palier ${tier?.label ?? c.tier} (min. ${tierMinRevenue}€/mois)`,
      net,
      adjustment: creatorAdjustments[0] ?? null,
      effective_commission_eur: contractCommission + totalAdjustment,
    };
  });
}
