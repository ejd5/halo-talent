// ─── Dashboard Page — Halo Companion ───────────

import { useEffect, useCallback } from "react";
import {
  MessageSquare, Archive, FileText, BarChart3,
  Tags, Languages, Settings, Sun, Moon, LogIn,
  Zap, AlertTriangle, Gift, TrendingUp, Users, DollarSign, UserRound,
} from "lucide-react";
import { useCompanionStore } from "../stores/companion-store";
import { getFanContext, getConversationContext, getStats, getPageInfo } from "../lib/messaging";
import { PLATFORM_LABELS } from "@/src/types/platform";
import type { Route, RouteState } from "../router";

type NavigateFn = (to: Route | RouteState, params?: Record<string, string>) => void;

const QUICK_ACTIONS = [
  { icon: MessageSquare, label: "Suggestions IA", route: "chat-assist" as Route, color: "var(--accent)" },
  { icon: FileText, label: "Scripts", route: "scripts" as Route, color: "#8B5CF6" },
  { icon: Archive, label: "Vault Check", route: "vault" as Route, color: "#10B981" },
  { icon: BarChart3, label: "Stats", route: "analytics" as Route, color: "#3B82F6" },
  { icon: Tags, label: "Tags", route: "fan-profile" as Route, color: "#F59E0B" },
  { icon: Languages, label: "Traduire", route: "chat-assist" as Route, color: "#EC4899" },
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

  // Simulate an alert on fan change (in production: from background)
  useEffect(() => {
    if (!fanContext) return;
    if (alerts.length > 5) return; // Don't flood
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
      <header className="shrink-0 px-4 py-3 flex items-center justify-between border-b"
        style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)" }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold"
            style={{ backgroundColor: "var(--accent)", color: "#fff" }}>H</div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Companion</span>
        </div>
        <div className="flex items-center gap-2">
          {platformLabel && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}>
              {platformLabel}
            </span>
          )}
          <button onClick={() => navigate({ route: "settings" })}
            className="p-1 rounded-md hover:bg-[var(--border-default)] transition-colors">
            <Settings size={15} style={{ color: "var(--text-secondary)" }} />
          </button>
          <button onClick={() => {
            const html = document.documentElement;
            const t = html.getAttribute("data-theme");
            html.setAttribute("data-theme", t === "dark" ? "light" : "dark");
          }} className="p-1 rounded-md hover:bg-[var(--border-default)] transition-colors">
            <Sun size={15} className="block dark:hidden" style={{ color: "var(--text-secondary)" }} />
            <Moon size={15} className="hidden dark:block" style={{ color: "var(--text-secondary)" }} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">

          {/* Connection */}
          {isConnected ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] animate-fade-in"
              style={{ backgroundColor: "rgba(16,185,129,0.08)", color: "var(--success)" }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--success)" }} />
              Connecté à Halo — {userEmail}
            </div>
          ) : (
            <button onClick={() => chrome.tabs.create({ url: "https://app.halotalent.com/login?source=extension" })}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: "var(--accent)", color: "#fff" }}>
              <LogIn size={15} />
              Se connecter à Halo
            </button>
          )}

          {/* Fan Card */}
          {fanContext ? (
            <FanMiniCard fan={fanContext} navigate={navigate} />
          ) : (
            <div className="rounded-xl p-4 text-center animate-fade-in"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
              <UserRound size={22} className="mx-auto mb-2" style={{ color: "var(--text-tertiary)" }} />
              <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                Ouvrez une conversation pour voir le profil fan
              </p>
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-tertiary)" }}>
              Actions rapides
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_ACTIONS.map((a) => (
                <button key={a.label} onClick={() => navigate(a.route)}
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
                  <a.icon size={18} style={{ color: a.color }} />
                  <span className="text-[10px] font-medium leading-tight text-center" style={{ color: "var(--text-secondary)" }}>
                    {a.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <div>
              <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1"
                style={{ color: "var(--text-tertiary)" }}>
                <Zap size={11} /> Alertes
              </h3>
              <div className="space-y-1.5">
                {alerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="flex items-start gap-2 p-2.5 rounded-lg animate-slide-up"
                    style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
                    <div className="shrink-0 mt-0.5">
                      {alert.type === "whale_online" && <TrendingUp size={13} style={{ color: "var(--accent)" }} />}
                      {alert.type === "fan_at_risk" && <AlertTriangle size={13} style={{ color: "var(--warning)" }} />}
                      {alert.type === "ppv_unopened" && <Gift size={13} style={{ color: "#EC4899" }} />}
                      {alert.type === "new_fan" && <UserRound size={13} style={{ color: "#3B82F6" }} />}
                      {alert.type === "big_spender" && <DollarSign size={13} style={{ color: "#10B981" }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] leading-snug" style={{ color: "var(--text-primary)" }}>
                        {alert.message}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <button onClick={() => navigate({ route: "chat-assist" })}
                          className="text-[9px] font-medium px-2 py-0.5 rounded-md"
                          style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}>
                          {alert.cta.label}
                        </button>
                        <button onClick={() => dismissAlert(alert.id)}
                          className="text-[9px] px-2 py-0.5 rounded-md" style={{ color: "var(--text-tertiary)" }}>
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
              <SummaryCard icon={MessageSquare} value={`${stats ? Math.floor(stats.totalFans * 0.02) : dailySummary.messagesSent}`} label="Msgs envoyés" />
              <SummaryCard icon={DollarSign} value={`${stats?.revenue24h ?? dailySummary.revenueToday}€`} label="Revenus" />
              <SummaryCard icon={Users} value={`${stats?.activeFans ?? dailySummary.activeFans}`} label="Fans actifs" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) {
  return (
    <div className="rounded-xl p-3 text-center"
      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
      <Icon size={15} className="mx-auto mb-1" style={{ color: "var(--text-tertiary)" }} />
      <div className="text-base font-bold" style={{ color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace" }}>
        {value}
      </div>
      <div className="text-[9px]" style={{ color: "var(--text-tertiary)" }}>{label}</div>
    </div>
  );
}

function FanMiniCard({ fan, navigate }: { fan: NonNullable<ReturnType<typeof useCompanionStore.getState>["fanContext"]>; navigate: NavigateFn }) {
  return (
    <div className="rounded-xl p-4 animate-fade-in"
      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
          style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}>
          {fan.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
            {fan.displayName}
          </div>
          <div className="text-[10px]" style={{ color: "var(--text-secondary)" }}>@{fan.username}</div>
          <div className="flex flex-wrap gap-1 mt-1">
            {fan.isVIP && <Badge label="VIP" color="#F59E0B" />}
            {fan.subscriptionMonths > 0 && <Badge label={`${fan.subscriptionMonths} mois`} />}
            {fan.totalSpent > 0 && <Badge label={`${fan.totalSpent}€`} color="var(--accent)" />}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        <DataPoint label="LTV" value={`${fan.totalSpent}€`} />
        <DataPoint label="Dernier achat" value={fan.lastActivity ? new Date(fan.lastActivity).toLocaleDateString("fr") : "—"} />
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={() => navigate({ route: "fan-profile", params: { fanId: fan.platformId } })}
          className="flex-1 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
          style={{ backgroundColor: "var(--accent)", color: "#fff" }}>
          Profil complet
        </button>
        <button onClick={() => navigate({ route: "fan-profile", params: { fanId: fan.platformId, tab: "notes" } })}
          className="px-3 py-1.5 rounded-lg text-[11px] font-medium"
          style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}>
          + Note
        </button>
      </div>
    </div>
  );
}

function Badge({ label, color }: { label: string; color?: string }) {
  return (
    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
      style={{ backgroundColor: color ? `${color}1A` : "var(--border-default)", color: color ?? "var(--text-secondary)" }}>
      {label}
    </span>
  );
}

function DataPoint({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2 py-1.5 rounded-lg" style={{ backgroundColor: "var(--bg-surface)" }}>
      <div style={{ color: "var(--text-tertiary)" }}>{label}</div>
      <div className="font-semibold" style={{ color: "var(--text-primary)" }}>{value}</div>
    </div>
  );
}
