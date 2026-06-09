"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Bell, Loader, AlertTriangle, TrendingUp, TrendingDown, Sparkles,
  Filter, CheckCheck, ExternalLink,
} from "lucide-react";
import type { TrendAlert } from "@/lib/trends/types";

const ALERT_ICONS: Record<string, any> = {
  spike: TrendingUp,
  crash: TrendingDown,
  pre_viral: Sparkles,
  new_trend: AlertTriangle,
};

const ALERT_COLORS: Record<string, string> = {
  spike: "#C75B39",
  crash: "#C44536",
  pre_viral: "#7A9A65",
  new_trend: "#5B8FA8",
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: "#C44536",
  high: "#C75B39",
  medium: "#C75B39",
  low: "rgba(245,240,235,0.3)",
};

const ALERT_TYPES = [
  { value: "", label: "Tous" },
  { value: "spike", label: "Pics" },
  { value: "crash", label: "Chutes" },
  { value: "pre_viral", label: "Pre-viral" },
  { value: "new_trend", label: "Nouvelles" },
];

const SEVERITY_LEVELS = [
  { value: "", label: "Toutes" },
  { value: "critical", label: "Critique" },
  { value: "high", label: "Haute" },
  { value: "medium", label: "Moyenne" },
  { value: "low", label: "Basse" },
];

export default function AlertsPage() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<TrendAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const loadAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (typeFilter) params.set("type", typeFilter);
      if (severityFilter) params.set("severity", severityFilter);
      if (unreadOnly) params.set("unread", "true");

      const res = await fetch(`/api/dashboard/trends/alerts?${params}`);
      const d = await res.json();
      setAlerts(d.alerts ?? []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [typeFilter, severityFilter, unreadOnly]);

  useEffect(() => { loadAlerts(); }, [loadAlerts]);

  const markAsRead = async (ids: string[]) => {
    try {
      await fetch("/api/dashboard/trends/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      setSelected(new Set());
      loadAlerts();
    } catch {}
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const unreadCount = alerts.filter((a) => !a.notified).length;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}>
            Alertes tendances
          </h1>
          <p className="text-xs mt-1" style={{ color: "rgba(245,240,235,0.4)" }}>
            Surveille les explosions et chutes de tendances en temps réel
          </p>
        </div>
        {selected.size > 0 && (
          <button
            onClick={() => markAsRead(Array.from(selected))}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 font-medium transition-all"
            style={{ backgroundColor: "rgba(122,154,101,0.1)", color: "#7A9A65", border: "1px solid rgba(122,154,101,0.2)" }}
          >
            <CheckCheck size={12} />
            Marquer {selected.size} lue{selected.size > 1 ? "s" : ""}
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Filter size={12} style={{ color: "rgba(245,240,235,0.2)" }} />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-2.5 py-1.5 text-[10px] border bg-transparent"
          style={{ borderColor: "rgba(245,240,235,0.1)", color: "#F5F0EB" }}
        >
          {ALERT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-2.5 py-1.5 text-[10px] border bg-transparent"
          style={{ borderColor: "rgba(245,240,235,0.1)", color: "#F5F0EB" }}
        >
          {SEVERITY_LEVELS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(e) => setUnreadOnly(e.target.checked)}
            className="accent-[#C75B39]"
          />
          <span className="text-[10px]" style={{ color: "rgba(245,240,235,0.3)" }}>
            Non lues {unreadCount > 0 && `(${unreadCount})`}
          </span>
        </label>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Loader size={16} className="animate-spin" style={{ color: "rgba(245,240,235,0.2)" }} />
        </div>
      ) : alerts.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center py-16 text-center">
          <Bell size={32} style={{ color: "rgba(245,240,235,0.06)" }} />
          <p className="text-sm mt-3" style={{ color: "rgba(245,240,235,0.15)" }}>
            Aucune alerte{unreadOnly ? " non lue" : ""}
          </p>
          <p className="text-xs mt-1" style={{ color: "rgba(245,240,235,0.1)" }}>
            Les alertes apparaîtront quand des tendances seront détectées
          </p>
        </div>
      ) : (
        /* Alert list */
        <div className="space-y-2">
          {alerts.map((alert) => {
            const Icon = ALERT_ICONS[alert.alert_type] ?? Bell;
            const color = ALERT_COLORS[alert.alert_type] ?? "#F5F0EB";
            const severityColor = SEVERITY_COLORS[alert.severity] ?? "rgba(245,240,235,0.3)";
            const isSelected = selected.has(alert.id);
            const trendData = alert.trend_data as any;

            return (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 transition-all"
                style={{
                  backgroundColor: `${color}${alert.notified ? "04" : "08"}`,
                  border: `1px solid ${isSelected ? color : `${color}15`}`,
                  borderLeft: `3px solid ${color}`,
                  opacity: alert.notified ? 0.7 : 1,
                }}
              >
                {/* Checkbox */}
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(alert.id)}
                    className="accent-[#C75B39]"
                  />
                </div>

                {/* Icon */}
                <div className="w-8 h-8 flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}10` }}>
                  <Icon size={14} style={{ color }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-sm font-medium capitalize" style={{ color: "#F5F0EB" }}>
                      {alert.keyword ?? "Tendance"}
                    </span>
                    <span
                      className="text-[9px] font-medium uppercase px-1 py-0.5"
                      style={{ backgroundColor: `${severityColor}15`, color: severityColor }}
                    >
                      {alert.severity}
                    </span>
                    <span
                      className="text-[9px] font-medium uppercase px-1 py-0.5"
                      style={{ backgroundColor: `${color}15`, color }}
                    >
                      {alert.alert_type === "pre_viral" ? "Pre-viral" : alert.alert_type}
                    </span>
                  </div>

                  {trendData?.message && (
                    <p className="text-[11px] mt-1" style={{ color: "rgba(245,240,235,0.5)" }}>
                      {trendData.message}
                    </p>
                  )}

                  {trendData?.recommended_action && (
                    <p className="text-[10px] mt-0.5" style={{ color: `${color}` }}>
                      Action : {trendData.recommended_action.replace(/_/g, " ")}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-1.5">
                    <p className="text-[9px]" style={{ color: "rgba(245,240,235,0.15)" }}>
                      {new Date(alert.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    {!alert.notified && (
                      <button
                        onClick={() => markAsRead([alert.id])}
                        className="text-[9px] px-1.5 py-0.5 transition-all hover:opacity-70"
                        style={{ color: "rgba(245,240,235,0.2)" }}
                      >
                        Marquer lue
                      </button>
                    )}
                  </div>
                </div>

                {/* Action */}
                {alert.keyword && (
                  <button
                    onClick={() => router.push(`/dashboard/trends?q=${encodeURIComponent(alert.keyword ?? "")}`)}
                    className="flex items-center gap-1 text-[10px] px-2 py-1.5 transition-all hover:opacity-70 shrink-0"
                    style={{ color: "rgba(245,240,235,0.25)" }}
                  >
                    <ExternalLink size={10} />
                    Voir
                  </button>
                )}
              </div>
            );
          })}

          {alerts.length >= 50 && (
            <p className="text-xs text-center py-3" style={{ color: "rgba(245,240,235,0.2)" }}>
              Affichage des 50 dernières alertes
            </p>
          )}
        </div>
      )}
    </div>
  );
}
