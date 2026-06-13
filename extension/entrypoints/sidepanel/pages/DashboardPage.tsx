// ─── Dashboard Page — WTF Companion ───────────────────────
"use client";

import { useEffect, useCallback } from "react";
import {
  MessageSquare, Archive, FileText, BarChart3, Tags, Languages,
  Settings, Sun, Moon, LogIn, Zap, AlertTriangle, Gift,
  TrendingUp, Users, DollarSign, UserRound, Radio, ChevronRight,
  Crown,
} from "lucide-react";
import { useCompanionStore } from "../stores/companion-store";
import { getFanContext, getConversationContext, getStats, getPageInfo } from "../lib/messaging";
import { PLATFORM_LABELS } from "@/src/types/platform";
import type { Route, RouteState } from "../router";

type NavigateFn = (to: Route | RouteState, params?: Record<string, string>) => void;

const QUICK_ACTIONS = [
  { icon: MessageSquare, label: "Suggestions IA", route: "chat-assist" as Route, color: "#C75B39", bg: "rgba(199,91,57,0.1)" },
  { icon: FileText, label: "Scripts", route: "scripts" as Route, color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" },
  { icon: Archive, label: "Vault", route: "vault" as Route, color: "#10B981", bg: "rgba(16,185,129,0.1)" },
  { icon: BarChart3, label: "Analytics", route: "analytics" as Route, color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
  { icon: Tags, label: "Fan Profile", route: "fan-profile" as Route, color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  { icon: Languages, label: "Traduire", route: "chat-assist" as Route, color: "#EC4899", bg: "rgba(236,72,153,0.1)" },
];

interface Props {
  navigate: NavigateFn;
}

export function DashboardPage({ navigate }: Props) {
  const {
    isConnected, userEmail,
    activePlatform, setActivePlatform,
    fanContext, setFanContext,
    setConversationContext,
    stats, setStats, dailySummary,
    alerts, addAlert, dismissAlert,
  } = useCompanionStore();

  const refresh = useCallback(async () => {
    const info = await getPageInfo();
    if (info) setActivePlatform(info.platform as Parameters<typeof setActivePlatform>[0], info.pageType);
    const fan = await getFanContext();
    setFanContext(fan);
    const conv = await getConversationContext();
    setConversationContext(conv);
    const s = await getStats();
    if (s) setStats(s);
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 10_000);
    return () => clearInterval(interval);
  }, [refresh]);

  useEffect(() => {
    if (!fanContext) return;
    if (alerts.length > 5) return;
    const id = `alert-${Date.now()}`;
    addAlert({
      id,
      type: fanContext.totalSpent > 500 ? "whale_online" : "new_fan",
      fanName: fanContext.username,
      fanId: fanContext.platformId,
      message: fanContext.isVIP
        ? `👑 ${fanContext.username} est en ligne — LTV ${fanContext.totalSpent}€`
        : `${fanContext.username} est en ligne`,
      cta: { label: "Ouvrir la conversation", action: "open_conversation" },
      timestamp: Date.now(),
    });
  }, [fanContext?.platformId]);

  const platformLabel = activePlatform ? PLATFORM_LABELS[activePlatform] : null;

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Header */}
      <header
        className="shrink-0 px-4 py-3 flex items-center justify-between border-b"
        style={{
          borderColor: "var(--border-default)",
          background: "linear-gradient(135deg, rgba(199,91,57,0.08) 0%, var(--bg-surface) 50%)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 flex items-center justify-center text-[12px] font-black"
            style={{ background: "linear-gradient(135deg, #C75B39 0%, #D8A95B 100%)", color: "#fff" }}
          >
            W
          </div>
          <div>
            <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>WTF Companion</span>
            {platformLabel && (
              <span
                className="ml-2 text-[9px] font-semibold px-1.5 py-0.5"
                style={{ backgroundColor: "rgba(199,91,57,0.12)", color: "#C75B39", border: "1px solid rgba(199,91,57,0.2)" }}
              >
                {platformLabel}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate({ route: "settings" })}
            className="p-1.5 rounded-md transition-colors hover:bg-[rgba(245,240,235,0.06)]"
          >
            <Settings size={14} style={{ color: "var(--text-tertiary)" }} />
          </button>
          <button
            onClick={() => {
              const html = document.documentElement;
              const t = html.getAttribute("data-theme");
              html.setAttribute("data-theme", t === "dark" ? "light" : "dark");
            }}
            className="p-1.5 rounded-md transition-colors hover:bg-[rgba(245,240,235,0.06)]"
          >
            <Sun size={14} className="block dark:hidden" style={{ color: "var(--text-tertiary)" }} />
            <Moon size={14} className="hidden dark:block" style={{ color: "var(--text-tertiary)" }} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">

          {/* Connection Banner */}
          {isConnected ? (
            <div
              className="flex items-center gap-2 px-3 py-2 text-[11px]"
              style={{ backgroundColor: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)", color: "#10B981" }}
            >
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#10B981" }} />
              <span>Connecté — {userEmail}</span>
              <div className="ml-auto flex items-center gap-1 text-[9px] px-1.5 py-0.5" style={{ backgroundColor: "rgba(216,169,91,0.1)", color: "#D8A95B", border: "1px solid rgba(216,169,91,0.2)" }}>
                <Crown size={8} />STARTER
              </div>
            </div>
          ) : (
            <button
              onClick={() => chrome.tabs.create({ url: "http://localhost:3001/login?source=wtf-companion" })}
              className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #C75B39 0%, #D8A95B 100%)", color: "#fff" }}
            >
              <LogIn size={14} />
              Se connecter à WTF
            </button>
          )}

          {/* Fan Card */}
          {fanContext ? (
            <FanMiniCard fan={fanContext} navigate={navigate} />
          ) : (
            <div
              className="p-4 text-center"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}
            >
              <UserRound size={22} className="mx-auto mb-2" style={{ color: "var(--text-tertiary)" }} />
              <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                Ouvrez une conversation pour voir le profil fan
              </p>
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--text-tertiary)" }}>
              Actions rapides
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_ACTIONS.map((a) => (
                <button
                  key={a.label}
                  onClick={() => navigate(a.route)}
                  className="flex flex-col items-center gap-1.5 p-3 transition-all hover:scale-[1.03] active:scale-[0.98]"
                  style={{ backgroundColor: a.bg, border: `1px solid ${a.color}25` }}
                >
                  <a.icon size={16} style={{ color: a.color }} />
                  <span className="text-[10px] font-medium leading-tight text-center" style={{ color: "var(--text-secondary)" }}>
                    {a.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Revenue Radar */}
          <RevenueRadar navigate={navigate} />

          {/* Alerts */}
          {alerts.length > 0 && (
            <div>
              <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                <Radio size={10} style={{ color: "#C75B39" }} />
                <span>Alertes en temps réel</span>
                <span className="ml-auto text-[9px] px-1.5 py-0.5 font-bold" style={{ backgroundColor: "rgba(199,91,57,0.12)", color: "#C75B39" }}>
                  {alerts.length}
                </span>
              </h3>
              <div className="space-y-1.5">
                {alerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-2 p-2.5"
                    style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}
                  >
                    <div className="shrink-0 mt-0.5">
                      {alert.type === "whale_online" && <TrendingUp size={12} style={{ color: "#C75B39" }} />}
                      {alert.type === "fan_at_risk" && <AlertTriangle size={12} style={{ color: "#F59E0B" }} />}
                      {alert.type === "ppv_unopened" && <Gift size={12} style={{ color: "#EC4899" }} />}
                      {alert.type === "new_fan" && <UserRound size={12} style={{ color: "#3B82F6" }} />}
                      {alert.type === "big_spender" && <DollarSign size={12} style={{ color: "#10B981" }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] leading-snug" style={{ color: "var(--text-primary)" }}>
                        {alert.message}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => navigate({ route: "chat-assist" })}
                          className="text-[9px] font-semibold px-2 py-0.5"
                          style={{ backgroundColor: "rgba(199,91,57,0.12)", color: "#C75B39" }}
                        >
                          {alert.cta.label}
                        </button>
                        <button onClick={() => dismissAlert(alert.id)} className="text-[9px]" style={{ color: "var(--text-tertiary)" }}>
                          Ignorer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Daily Summary */}
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-tertiary)" }}>
              Résumé du jour
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <SummaryCard icon={MessageSquare} value={`${stats ? Math.floor(stats.totalFans * 0.02) : dailySummary.messagesSent}`} label="Msgs envoyés" color="#C75B39" />
              <SummaryCard icon={DollarSign} value={`${stats?.revenue24h ?? dailySummary.revenueToday}€`} label="Revenus" color="#10B981" />
              <SummaryCard icon={Users} value={`${stats?.activeFans ?? dailySummary.activeFans}`} label="Fans actifs" color="#3B82F6" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Revenue Radar ─────────────────────────────────────────

function RevenueRadar({ navigate }: { navigate: NavigateFn }) {
  const MOCK_FANS = [
    { name: "Alex_28", ltv: 420, online: true, risk: "low" },
    { name: "mike_fr", ltv: 285, online: true, risk: "medium" },
    { name: "sweet_p", ltv: 175, online: false, risk: "high" },
  ];

  return (
    <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid rgba(199,91,57,0.2)" }}>
      <div className="flex items-center justify-between px-3 py-2.5" style={{ borderBottom: "1px solid rgba(245,240,235,0.05)" }}>
        <div className="flex items-center gap-1.5">
          <Radio size={11} style={{ color: "#C75B39" }} />
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#C75B39" }}>Revenue Radar</span>
        </div>
        <button onClick={() => navigate("revenue-radar")} className="flex items-center gap-0.5 text-[9px]" style={{ color: "var(--text-tertiary)" }}>
          Voir tout <ChevronRight size={9} />
        </button>
      </div>
      <div className="p-2.5 space-y-1.5">
        {MOCK_FANS.map((f) => (
          <div key={f.name} className="flex items-center gap-2.5 px-2 py-1.5" style={{ backgroundColor: "rgba(245,240,235,0.02)" }}>
            <div className="relative">
              <div className="w-6 h-6 flex items-center justify-center text-[9px] font-bold" style={{ backgroundColor: "rgba(199,91,57,0.12)", color: "#C75B39" }}>
                {f.name[0].toUpperCase()}
              </div>
              {f.online && (
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#0A0A0B]" style={{ backgroundColor: "#10B981" }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-medium" style={{ color: "var(--text-primary)" }}>{f.name}</div>
              <div className="text-[9px]" style={{ color: "var(--text-tertiary)" }}>LTV {f.ltv}€</div>
            </div>
            <div className="text-[8px] px-1.5 py-0.5 font-semibold" style={{
              backgroundColor: f.risk === "low" ? "rgba(16,185,129,0.1)" : f.risk === "medium" ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)",
              color: f.risk === "low" ? "#10B981" : f.risk === "medium" ? "#F59E0B" : "#EF4444",
            }}>
              {f.risk === "low" ? "Fidèle" : f.risk === "medium" ? "Surveiller" : "À risque"}
            </div>
            {f.online && (
              <button
                onClick={() => navigate("chat-assist")}
                className="text-[9px] font-bold px-2 py-0.5"
                style={{ backgroundColor: "rgba(199,91,57,0.12)", color: "#C75B39", border: "1px solid rgba(199,91,57,0.2)" }}
              >
                Écrire
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────

function SummaryCard({ icon: Icon, value, label, color }: { icon: React.ElementType; value: string; label: string; color: string }) {
  return (
    <div className="p-3 text-center" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
      <Icon size={14} className="mx-auto mb-1" style={{ color }} />
      <div className="text-sm font-bold" style={{ color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace" }}>
        {value}
      </div>
      <div className="text-[9px]" style={{ color: "var(--text-tertiary)" }}>{label}</div>
    </div>
  );
}

function FanMiniCard({ fan, navigate }: {
  fan: NonNullable<ReturnType<typeof useCompanionStore.getState>["fanContext"]>;
  navigate: NavigateFn
}) {
  return (
    <div
      className="p-4"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-default)",
        background: "linear-gradient(135deg, rgba(199,91,57,0.04) 0%, var(--bg-card) 60%)",
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 flex items-center justify-center text-sm font-bold shrink-0"
          style={{ background: "linear-gradient(135deg, #C75B39 0%, #D8A95B 100%)", color: "#fff" }}
        >
          {fan.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
            {fan.displayName}
          </div>
          <div className="text-[10px]" style={{ color: "var(--text-secondary)" }}>@{fan.username}</div>
          <div className="flex flex-wrap gap-1 mt-1">
            {fan.isVIP && <Badge label="👑 VIP" color="#D8A95B" />}
            {fan.subscriptionMonths > 0 && <Badge label={`${fan.subscriptionMonths} mois`} />}
            {fan.totalSpent > 0 && <Badge label={`${fan.totalSpent}€ LTV`} color="#C75B39" />}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[10px] mb-3">
        <DataPoint label="LTV" value={`${fan.totalSpent}€`} />
        <DataPoint label="Dernier achat" value={fan.lastActivity ? new Date(fan.lastActivity).toLocaleDateString("fr") : "—"} />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => navigate({ route: "fan-profile", params: { fanId: fan.platformId } })}
          className="flex-1 px-3 py-2 text-[11px] font-bold transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #C75B39 0%, #D8A95B 100%)", color: "#fff" }}
        >
          Profil complet
        </button>
        <button
          onClick={() => navigate({ route: "chat-assist" })}
          className="px-3 py-2 text-[11px] font-medium"
          style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "#C75B39", border: "1px solid rgba(199,91,57,0.2)" }}
        >
          <Zap size={12} />
        </button>
        <button
          onClick={() => navigate({ route: "fan-profile", params: { fanId: fan.platformId, tab: "notes" } })}
          className="px-3 py-2 text-[11px] font-medium"
          style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}
        >
          + Note
        </button>
      </div>
    </div>
  );
}

function Badge({ label, color }: { label: string; color?: string }) {
  return (
    <span
      className="text-[9px] px-1.5 py-0.5 font-semibold"
      style={{ backgroundColor: color ? `${color}1A` : "var(--border-default)", color: color ?? "var(--text-secondary)" }}
    >
      {label}
    </span>
  );
}

function DataPoint({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2 py-1.5" style={{ backgroundColor: "var(--bg-surface)" }}>
      <div className="text-[9px]" style={{ color: "var(--text-tertiary)" }}>{label}</div>
      <div className="text-[11px] font-semibold" style={{ color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
    </div>
  );
}
