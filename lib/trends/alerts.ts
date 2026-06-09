import { createClient, createAdminClient } from "@/lib/supabase/server";
import { GoogleTrendsProvider } from "./providers/google";
import { notify } from "@/lib/notifications";

export class TrendAlertEngine {
  private google = new GoogleTrendsProvider();

  async run() {
    const supabase = await createClient();
    const { data: watchlists } = await supabase
      .from("trends_watchlist")
      .select("*, creator:profiles!inner(id, telegram_chat_id)");

    for (const entry of watchlists || []) {
      try {
        const current = await this.google.getTrend({
          keyword: entry.keyword,
          geo: entry.geo_filter,
          timeframe: "now 1-d",
        });

        const currentPeak = current.peak_value;

        if (entry.last_value && currentPeak > entry.last_value * 2) {
          await this.fire(entry, {
            type: "spike",
            severity: "high",
            message: `"${entry.keyword}" a explosé de ${Math.round((currentPeak / entry.last_value - 1) * 100)}% en 24h`,
            recommended_action: "create_content_now",
          });
        } else if (entry.last_value && currentPeak < entry.last_value * 0.5) {
          await this.fire(entry, {
            type: "crash",
            severity: "medium",
            message: `"${entry.keyword}" est en chute libre. Évitez d'investir du temps.`,
            recommended_action: "avoid",
          });
        }

        const admin = createAdminClient();
        await admin
          .from("trends_watchlist")
          .update({
            last_value: currentPeak,
            last_checked_at: new Date().toISOString(),
          })
          .eq("id", entry.id);
      } catch (e) {
        console.error(`Watchlist ${entry.id}:`, e);
      }
    }
  }

  private async fire(
    entry: any,
    alert: {
      type: "spike" | "crash" | "pre_viral" | "new_trend";
      severity: "low" | "medium" | "high" | "critical";
      message: string;
      recommended_action: string;
    },
  ) {
    const admin = createAdminClient();
    await admin.from("trends_alerts").insert({
      creator_id: entry.creator_id,
      watchlist_id: entry.id,
      trend_data: alert,
      alert_type: alert.type,
      severity: alert.severity,
    });

    await notify({
      userId: entry.creator_id,
      type: `trend_${alert.type}`,
      title: alert.message,
      message: `Action recommandée : ${alert.recommended_action}`,
      severity: alert.severity,
      channels:
        alert.severity === "critical"
          ? ["in_app", "push", "telegram"]
          : ["in_app"],
    });
  }
}
