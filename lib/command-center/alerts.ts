interface Alert {
  type: "revenue_drop" | "platform_disconnected" | "pending_drafts" | "churn_rate" | "vip_inactive";
  severity: "critical" | "warning" | "info";
  label: string;
  message: string;
}

const ALERT_THRESHOLDS = {
  revenueDropPct: 30,
  pendingDraftsCount: 10,
  pendingDraftsHours: 48,
  churnRatePct: 15,
  vipInactiveDays: 14,
};

export async function detectAlerts(profile: Record<string, any>, supabase: any): Promise<Alert[]> {
  const alerts: Alert[] = [];

  // 1. Revenue drop > 30% vs previous period
  if (profile.id) {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 7);
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 7);

    const { data: revs } = await supabase
      .from("monthly_revenues")
      .select("gross_revenue, month")
      .eq("creator_id", profile.id)
      .in("month", [todayStr + "-01", prevMonth + "-01"])
      .order("month", { ascending: false });

    if (revs && revs.length === 2) {
      const current = Number(revs[0].gross_revenue);
      const previous = Number(revs[1].gross_revenue);
      if (previous > 0) {
        const drop = ((previous - current) / previous) * 100;
        if (drop > ALERT_THRESHOLDS.revenueDropPct) {
          alerts.push({
            type: "revenue_drop",
            severity: "critical",
            label: "Chute de revenus",
            message: `-${Math.round(drop)}% vs mois dernier`,
          });
        }
      }
    }
  }

  // 2. Platform disconnected (token expired)
  const { data: accounts } = await supabase
    .from("creator_accounts")
    .select("platform, api_connected, is_managed")
    .eq("creator_id", profile.id);

  for (const acc of accounts || []) {
    if (acc.is_managed && !acc.api_connected) {
      alerts.push({
        type: "platform_disconnected",
        severity: "critical",
        label: "Plateforme déconnectée",
        message: `${acc.platform}, connexion perdue`,
      });
    }
  }

  // 3. Pending drafts > 10 since 48h
  const twoDaysAgo = new Date(Date.now() - ALERT_THRESHOLDS.pendingDraftsHours * 3600000).toISOString();
  const { count: pendingCount } = await supabase
    .from("atlas_drafts")
    .select("id", { count: "exact", head: true })
    .eq("creator_id", profile.id)
    .eq("status", "pending")
    .gte("created_at", twoDaysAgo);

  if (pendingCount && pendingCount >= ALERT_THRESHOLDS.pendingDraftsCount) {
    alerts.push({
      type: "pending_drafts",
      severity: "warning",
      label: "Drafts en attente",
      message: `${pendingCount} brouillons en attente depuis 48h`,
    });
  }

  // 4. Churn rate > 15% on active fans this week
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const { data: fans } = await supabase
    .from("atlas_fans")
    .select("status, last_interaction_at")
    .eq("creator_id", profile.id);

  if (fans && fans.length > 10) {
    const recentActive = fans.filter(
      (f: any) => f.last_interaction_at && new Date(f.last_interaction_at) > new Date(sevenDaysAgo),
    ).length;
    const inactive = fans.length - recentActive;
    const churnRate = (inactive / fans.length) * 100;
    if (churnRate > ALERT_THRESHOLDS.churnRatePct) {
      alerts.push({
        type: "churn_rate",
        severity: "warning",
        label: "Churn élevé",
        message: `${Math.round(churnRate)}% de fans inactifs cette semaine`,
      });
    }
  }

  // 5. VIP fan not interacted in 14 days
  if (fans && fans.length > 0) {
    const vipInactive = (fans as any[]).filter(
      (f: any) =>
        (f.fan_tier === "whale" || f.fan_tier === "vip") &&
        f.last_interaction_at &&
        (Date.now() - new Date(f.last_interaction_at).getTime()) / 86400000 > ALERT_THRESHOLDS.vipInactiveDays,
    ).length;
    if (vipInactive > 0) {
      alerts.push({
        type: "vip_inactive",
        severity: "info",
        label: "VIP inactifs",
        message: `${vipInactive} fans VIP sans interaction depuis ${ALERT_THRESHOLDS.vipInactiveDays}j`,
      });
    }
  }

  return alerts;
}

export function determineStatus(profile: Record<string, any>, alerts: Alert[], todayRevenue: number): "green" | "yellow" | "red" | "black" {
  if (profile.status === "paused" || profile.status === "archived") return "black";

  const hasCritical = alerts.some((a) => a.severity === "critical");
  if (hasCritical) return "red";

  const hasWarning = alerts.some((a) => a.severity === "warning");
  if (hasWarning) return "yellow";

  return "green";
}
