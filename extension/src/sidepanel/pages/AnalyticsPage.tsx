// ─── Analytics Page — Halo Companion ───────────

import { useEffect, useCallback } from "react";
import {
  ChevronLeft, TrendingUp, Users, DollarSign,
  Activity, Clock, BarChart3
} from "lucide-react";
import { useCompanionStore } from "../stores/companion-store";
import { getStats } from "../lib/messaging";
import type { Route, RouteState } from "../router";

type NavigateFn = (to: Route | RouteState, params?: Record<string, string>) => void;

interface Props { navigate: NavigateFn }

export function AnalyticsPage({ navigate }: Props) {
  const { stats, setStats } = useCompanionStore();

  const refresh = useCallback(async () => {
    const s = await getStats();
    if (s) setStats(s);
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30_000);
    return () => clearInterval(interval);
  }, [refresh]);

  // Mock hourly distribution for the heatmap
  const hours = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    value: Math.round(Math.sin((i - 14) * Math.PI / 8) * 50 + 30 * Math.random()),
  }));
  const maxHourly = Math.max(...hours.map((h) => h.value), 1);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "var(--bg-primary)" }}>
      <header className="shrink-0 px-4 py-3 flex items-center gap-3 border-b"
        style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)" }}>
        <button onClick={() => navigate("dashboard")} className="p-1 rounded" style={{ color: "var(--text-secondary)" }}>
          <ChevronLeft size={16} />
        </button>
        <h1 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Analytics</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* Revenue bars */}
        <div>
          <h3 className="text-[11px] font-semibold mb-2 flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
            <DollarSign size={12} style={{ color: "var(--success)" }} />
            Revenus
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <BarCard label="Aujourd'hui" value={`${stats?.revenue24h ?? 0}€`} height={60} />
            <BarCard label="Semaine" value={`${Math.round((stats?.revenue24h ?? 0) * 5.5)}€`} height={70} />
            <BarCard label="Mois" value={`${stats?.revenue30d ?? 0}€`} height={90} />
          </div>
        </div>

        {/* Fans stats grid */}
        <div className="grid grid-cols-2 gap-2">
          <StatCard icon={Users} label="Total fans" value={stats?.totalFans ?? 0} color="var(--accent)" />
          <StatCard icon={Activity} label="Actifs" value={stats?.activeFans ?? 0} color="var(--success)" />
          <StatCard icon={TrendingUp} label="Nouveaux 24h" value={stats?.newFans24h ?? 0} color="#3B82F6" />
          <StatCard icon={BarChart3} label="Tx PPV" value={stats?.totalFans ? `${Math.round((stats.activeFans / stats.totalFans) * 30)}%` : "—"} color="#8B5CF6" />
        </div>

        {/* Top 5 Fans */}
        <div>
          <h3 className="text-[11px] font-semibold mb-2 flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
            <TrendingUp size={12} style={{ color: "var(--accent)" }} />
            Top 5 fans ce mois
          </h3>
          <div className="space-y-1">
            {(stats?.topSpenders?.slice(0, 5) ?? MOCK_TOP_FANS).map((f, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg"
                style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ backgroundColor: i === 0 ? "var(--accent-soft)" : "var(--bg-surface)", color: i === 0 ? "var(--accent)" : "var(--text-tertiary)" }}>
                  {i + 1}
                </div>
                <span className="flex-1 text-[11px] truncate" style={{ color: "var(--text-primary)" }}>
                  {f.username}
                </span>
                <span className="text-[11px] font-semibold" style={{ color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace" }}>
                  {f.amount}€
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Heatmap */}
        <div>
          <h3 className="text-[11px] font-semibold mb-2 flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
            <Clock size={12} style={{ color: "var(--text-tertiary)" }} />
            Meilleur créneau horaire
          </h3>
          <div className="rounded-xl p-3" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
            <div className="flex gap-0.5 items-end" style={{ height: 40 }}>
              {hours.map((h) => (
                <div key={h.hour} className="flex-1 rounded-sm transition-all"
                  style={{
                    height: `${(h.value / maxHourly) * 100}%`,
                    backgroundColor: h.value / maxHourly > 0.7 ? "var(--accent)" : h.value / maxHourly > 0.4 ? "var(--accent-soft)" : "var(--border-default)",
                    opacity: 0.9,
                  }}
                  title={`${h.hour}h: ${h.value}%`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1 text-[8px]" style={{ color: "var(--text-tertiary)" }}>
              <span>0h</span><span>6h</span><span>12h</span><span>18h</span><span>24h</span>
            </div>
            <p className="text-[10px] mt-2 text-center" style={{ color: "var(--accent)" }}>
              Pic d'activité : 20h-22h
            </p>
          </div>
        </div>

        {/* Daily metrics */}
        <div className="grid grid-cols-2 gap-2">
          <KVCard label="Fans en ligne" value={stats?.activeFans ?? 0} color="var(--success)" />
          <KVCard label="Abonnements auj." value={`+${stats?.newFans24h ?? 0}`} color="var(--accent)" />
        </div>

      </div>
    </div>
  );
}

const MOCK_TOP_FANS = [
  { username: "john_doe", amount: 340 },
  { username: "mike_fr", amount: 285 },
  { username: "xx_dark", amount: 210 },
  { username: "sweet_p", amount: 175 },
  { username: "lukas_99", amount: 150 },
];

function BarCard({ label, value, height }: { label: string; value: string; height: number }) {
  return (
    <div className="flex flex-col items-center p-3 rounded-xl"
      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
      <div className="w-full flex-1 flex items-end justify-center mb-1">
        <div className="w-10 rounded-t-md transition-all" style={{
          height: `${height}%`,
          backgroundColor: "var(--success)",
          opacity: 0.7,
        }} />
      </div>
      <p className="text-xs font-bold" style={{ color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace" }}>{value}</p>
      <p className="text-[9px]" style={{ color: "var(--text-tertiary)" }}>{label}</p>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-xl p-3" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
      <Icon size={14} style={{ color }} />
      <p className="text-[10px] mt-1.5" style={{ color: "var(--text-tertiary)" }}>{label}</p>
      <p className="text-base font-bold mt-0.5" style={{ color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace" }}>
        {typeof value === "number" ? value.toLocaleString("fr") : value}
      </p>
    </div>
  );
}

function KVCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-xl p-3" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
      <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{label}</p>
      <p className="text-base font-bold mt-0.5" style={{ color, fontFamily: "'JetBrains Mono', monospace" }}>
        {typeof value === "number" ? value.toLocaleString("fr") : value}
      </p>
    </div>
  );
}
