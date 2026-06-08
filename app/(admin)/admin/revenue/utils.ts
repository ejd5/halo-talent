import type { Creator, MonthlyRevenue } from "../creators/types";
import type {
  AggregatedMonthlyRevenue,
  RevenueSummary,
  PlatformRevenueSummary,
  CreatorRevenueRow,
  FinancialAlert,
} from "./types";

const MONTHS = [
  "Juil", "Août", "Sep", "Oct", "Nov", "Déc",
  "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
];

export function aggregateMonthlyRevenue(
  creators: Creator[],
  periodMonths: number = 12
): AggregatedMonthlyRevenue[] {
  const sliced = MONTHS.slice(-periodMonths);
  return sliced.map((month) => {
    const platforms: Record<string, { gross: number; commission: number; net: number }> = {};
    let total_gross = 0;
    let total_commission = 0;
    let total_net = 0;

    creators.forEach((c) => {
      const mr = c.monthly_revenue.find((m) => m.month === month);
      if (!mr) return;
      total_gross += mr.total_gross;
      total_commission += mr.total_commission;
      total_net += mr.total_net;

      mr.platforms.forEach((p) => {
        if (!platforms[p.name]) {
          platforms[p.name] = { gross: 0, commission: 0, net: 0 };
        }
        platforms[p.name].gross += p.gross;
        platforms[p.name].commission += p.commission_eur;
        platforms[p.name].net += p.net;
      });
    });

    return {
      month,
      total_gross,
      total_commission,
      total_net,
      platform_fees: total_gross - total_commission - total_net,
      platforms,
    };
  });
}

export function computeRevenueSummary(
  aggregated: AggregatedMonthlyRevenue[],
  previous: AggregatedMonthlyRevenue[]
): RevenueSummary {
  const totals = aggregated.reduce(
    (acc, m) => ({
      gross: acc.gross + m.total_gross,
      commission: acc.commission + m.total_commission,
      net: acc.net + m.total_net,
      fees: acc.fees + m.platform_fees,
    }),
    { gross: 0, commission: 0, net: 0, fees: 0 }
  );

  const prevTotals = previous.reduce(
    (acc, m) => ({
      gross: acc.gross + m.total_gross,
      commission: acc.commission + m.total_commission,
    }),
    { gross: 0, commission: 0 }
  );

  const prevMargin = prevTotals.gross > 0 ? (prevTotals.commission / prevTotals.gross) * 100 : 0;
  const margin = totals.gross > 0 ? (totals.commission / totals.gross) * 100 : 0;
  const marginVariation = prevMargin > 0 ? margin - prevMargin : 0;

  return {
    total_gross: totals.gross,
    total_commission: totals.commission,
    total_net: totals.net,
    total_platform_fees: totals.fees,
    avg_margin: margin,
    creator_count: 0,
    active_creator_count: 0,
    margin_variation: marginVariation,
  };
}

export function computePlatformSummaries(
  aggregated: AggregatedMonthlyRevenue[],
  creators: Creator[]
): PlatformRevenueSummary[] {
  const platformMap: Record<string, { total: number; creators: Set<string>; history: number[] }> = {};

  aggregated.forEach((m) => {
    Object.entries(m.platforms).forEach(([name, data]) => {
      if (!platformMap[name]) {
        platformMap[name] = { total: 0, creators: new Set(), history: [] };
      }
      platformMap[name].total += data.gross;
      platformMap[name].history.push(data.gross);
    });
  });

  creators.forEach((c) => {
    c.platforms.forEach((p) => {
      if (platformMap[p.name]) {
        platformMap[p.name].creators.add(c.id);
      }
    });
  });

  const grandTotal = Object.values(platformMap).reduce((s, p) => s + p.total, 0);

  return Object.entries(platformMap)
    .map(([name, data]) => {
      const cnt = data.creators.size;
      const avg = cnt > 0 ? data.total / cnt : 0;
      const history = data.history;
      const growth =
        history.length >= 6
          ? ((history[history.length - 1] - history[0]) / history[0]) * 100
          : 0;

      return {
        name,
        total_revenue: data.total,
        share_pct: grandTotal > 0 ? (data.total / grandTotal) * 100 : 0,
        active_creators: cnt,
        avg_revenue_per_creator: Math.round(avg),
        monthly_history: history.slice(-6),
        growth_rate: Math.round(growth * 10) / 10,
      };
    })
    .sort((a, b) => b.total_revenue - a.total_revenue);
}

export function buildCreatorRevenueRows(creators: Creator[]): CreatorRevenueRow[] {
  return creators.map((c) => {
    const rev = c.monthly_revenue;
    const current = rev[rev.length - 1]?.total_gross ?? 0;
    const last = rev[rev.length - 2]?.total_gross ?? 0;
    const variation = last > 0 ? ((current - last) / last) * 100 : 0;
    const ytd = rev.reduce((s, r) => s + r.total_gross, 0);
    const commission = rev.reduce((s, r) => s + r.total_commission, 0);

    return {
      creator_id: c.id,
      creator_name: c.full_name,
      creator_avatar: c.avatar_url,
      department: c.department,
      tier: c.tier,
      current_month: current,
      last_month: last,
      variation_pct: Math.round(variation * 10) / 10,
      ytd_total: ytd,
      commission_rate: 15,
      commission_eur: commission,
      payment_status: c.tier === "discovery" ? "paid" : "pending",
    };
  });
}

export function buildFinancialAlerts(
  creators: Creator[],
  currentMonth: string
): FinancialAlert[] {
  const alerts: FinancialAlert[] = [];
  let id = 1;

  creators.forEach((c) => {
    const rev = c.monthly_revenue;
    if (rev.length < 2) return;
    const lastIdx = rev.length - 1;
    const current = rev[lastIdx]?.total_gross ?? 0;
    const prev = rev[lastIdx - 1]?.total_gross ?? 0;
    const decline = prev > 0 ? ((prev - current) / prev) * 100 : 0;

    if (decline > 30) {
      alerts.push({
        id: `alert-${id++}`,
        type: "revenue_drop",
        severity: "high",
        message: `Baisse de revenus de ${Math.round(decline)}% pour ${c.full_name} ce mois`,
        creator_id: c.id,
        creator_name: c.full_name,
        created_at: new Date().toISOString(),
      });
    }
  });

  const pendingCount = creators.filter((c) => c.tier !== "discovery").length;
  if (pendingCount > 0) {
    alerts.push({
      id: `alert-${id++}`,
      type: "payment_pending",
      severity: "medium",
      message: `${pendingCount} paiements en attente de validation`,
      creator_id: null,
      creator_name: null,
      created_at: new Date().toISOString(),
    });
  }

  const expiringSoon = creators.filter(
    (c) => c.tier === "discovery" || c.tier === "growth"
  ).length;
  if (expiringSoon > 0) {
    alerts.push({
      id: `alert-${id++}`,
      type: "contract_expiring",
      severity: "low",
      message: `${expiringSoon} créateurs pourraient nécessiter une révision de palier`,
      creator_id: null,
      creator_name: null,
      created_at: new Date().toISOString(),
    });
  }

  return alerts;
}

export function computeMargin(
  revenue: MonthlyRevenue[]
): { margin_pct: number; margin_eur: number }[] {
  return revenue.map((r) => ({
    margin_pct:
      r.total_gross > 0
        ? Math.round((r.total_commission / r.total_gross) * 100)
        : 0,
    margin_eur: r.total_commission,
  }));
}
