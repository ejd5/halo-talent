"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Loader2, TrendingUp, CalendarDays } from "lucide-react";
import Link from "next/link";

export default function CalendarAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30d");

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    const now = new Date();
    let from: string;
    switch (period) {
      case "7d": from = new Date(now.getTime() - 7 * 86400000).toISOString(); break;
      case "90d": from = new Date(now.getTime() - 90 * 86400000).toISOString(); break;
      default: from = new Date(now.getTime() - 30 * 86400000).toISOString();
    }

    const res = await fetch(`/api/admin/content-calendar/analytics?from=${from}&to=${now.toISOString()}`);
    const data = await res.json();
    setAnalytics(data.analytics);
    setLoading(false);
  }, [period]);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  return (
    <div style={{ padding: "32px 40px" }}>
      <Link href="/admin/content-calendar" className="inline-flex items-center gap-1 text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
        <ArrowLeft size={14} /> Retour au calendrier
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-semibold" style={{ color: "var(--text-primary)" }}>
          Analytics calendrier
        </h1>
        <div className="flex gap-1" style={{ background: "rgba(255,255,255,0.04)", padding: 2 }}>
          {["7d", "30d", "90d"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-3 py-1 text-xs font-medium transition-colors"
              style={{
                background: period === p ? "var(--accent)" : "transparent",
                color: period === p ? "var(--text-primary)" : "var(--text-secondary)",
              }}
            >
              {p === "7d" ? "7 jours" : p === "30d" ? "30 jours" : "90 jours"}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin" style={{ color: "var(--accent)" }} />
        </div>
      )}

      {analytics && !loading && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            <StatCard label="Total événements" value={analytics.total.toString()} />
            <StatCard label="Publiés" value={analytics.published.toString()} color="var(--success)" />
            <StatCard label="Planifiés" value={analytics.scheduled.toString()} color="var(--accent)" />
            <StatCard label="Échecs" value={analytics.failed.toString()} color="var(--danger)" />
            <StatCard label="Taux publication" value={`${analytics.publish_rate}%`} />
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* By Platform */}
            <div className="p-4" style={{ border: "1px solid var(--border-default)" }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Par plateforme</h3>
              {Object.entries(analytics.by_platform || {}).map(([platform, count]) => (
                <BarRow key={platform} label={platform} count={count as number} total={analytics.total} color="var(--accent)" />
              ))}
              {Object.keys(analytics.by_platform || {}).length === 0 && (
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Aucune donnée</p>
              )}
            </div>

            {/* By Content Type */}
            <div className="p-4" style={{ border: "1px solid var(--border-default)" }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Par type de contenu</h3>
              {Object.entries(analytics.by_type || {}).map(([type, count]) => (
                <BarRow key={type} label={type} count={count as number} total={analytics.total} color="#4A8FE7" />
              ))}
              {Object.keys(analytics.by_type || {}).length === 0 && (
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Aucune donnée</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* By Day of Week */}
            <div className="p-4" style={{ border: "1px solid var(--border-default)" }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Par jour de la semaine</h3>
              <div className="space-y-2">
                {Object.entries(analytics.by_day || {}).map(([day, count]) => (
                  <div key={day} className="flex items-center gap-2 text-sm">
                    <span className="w-8 text-xs" style={{ color: "var(--text-secondary)" }}>{day}</span>
                    <div className="flex-1 h-5" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${Math.min(((count as number) / Math.max(...Object.values(analytics.by_day as Record<string, number>))) * 100, 100)}%`,
                          background: "var(--success)",
                        }}
                      />
                    </div>
                    <span className="text-xs w-8 text-right" style={{ color: "var(--text-secondary)" }}>{count as number}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Volume */}
            <div className="p-4" style={{ border: "1px solid var(--border-default)" }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Volume hebdomadaire</h3>
              {analytics.weekly_volume?.length > 0 ? (
                <div className="flex items-end gap-2 h-32 pt-4">
                  {analytics.weekly_volume.map((w: any) => {
                    const max = Math.max(...analytics.weekly_volume.map((x: any) => x.count));
                    const h = max > 0 ? (w.count / max) * 100 : 0;
                    return (
                      <div key={w.week} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-sm transition-all"
                          style={{
                            height: `${h}%`,
                            background: "var(--accent)",
                            minHeight: 4,
                          }}
                        />
                        <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                          {w.week.slice(5)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Aucune donnée</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
      <div className="text-[11px] font-medium uppercase tracking-wider mb-1" style={{ color: "var(--text-secondary)" }}>{label}</div>
      <div className="text-xl font-semibold" style={{ color: color || "var(--text-primary)" }}>{value}</div>
    </div>
  );
}

function BarRow({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 mb-2 text-sm">
      <span className="w-24 text-xs truncate" style={{ color: "var(--text-secondary)" }}>{label}</span>
      <div className="flex-1 h-5" style={{ background: "rgba(255,255,255,0.04)" }}>
        <div className="h-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs w-12 text-right" style={{ color: "var(--text-secondary)" }}>
        {count} ({pct}%)
      </span>
    </div>
  );
}
