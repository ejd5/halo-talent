"use client";

import type { Creator } from "../../../types";
import { formatEuro } from "../../../utils";
import { internalNotes } from "../../../data";
import {
  Users,
  TrendingUp,
  Activity,
  CalendarClock,
} from "lucide-react";

type Props = { creator: Creator };

export function OverviewTab({ creator }: Props) {
  const notes = internalNotes[creator.id] ?? [];

  return (
    <div className="space-y-6 card-accent">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Revenus du mois", value: formatEuro(creator.current_month_revenue), icon: TrendingUp, color: "var(--accent)" },
          { label: "Plateformes", value: String(creator.platforms.length), icon: Activity, color: "var(--text-primary)" },
          { label: "Followers totaux", value: new Intl.NumberFormat("fr-FR", { notation: "compact" }).format(creator.total_followers), icon: Users, color: "var(--success)" },
          { label: "Taux d'engagement", value: `${creator.engagement_rate}%`, icon: Activity, color: "var(--accent)" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="p-4" style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)" }}>
              <div className="flex items-center gap-2 mb-2">
                <Icon size={13} strokeWidth={1.5} style={{ color: stat.color }} />
                <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--text-primary)" }}>
                  {stat.label}
                </p>
              </div>
              <p className="font-display text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Revenue chart 12 months (simple bars) */}
      <div className="p-5" style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)" }}>
        <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.1em] mb-4" style={{ color: "var(--text-primary)" }}>
          Revenus 12 mois
        </p>
        <div className="flex items-end gap-1.5 h-32">
          {creator.monthly_revenue.map((m) => {
            const max = Math.max(...creator.monthly_revenue.map((r) => r.total_gross));
            const h = (m.total_gross / max) * 100;
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] font-sans tabular-nums" style={{ color: "var(--accent)" }}>
                  {formatEuro(m.total_gross)}
                </span>
                <div
                  className="w-full rounded-none transition-all hover:opacity-80"
                  style={{
                    height: `${Math.max(h, 4)}%`,
                    background: m.total_gross === max ? "var(--accent)" : "rgba(199,91,57,0.3)",
                  }}
                />
                <span className="text-[9px] font-sans" style={{ color: "var(--text-secondary)" }}>
                  {m.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent notes */}
        <div className="p-5" style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)" }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={13} strokeWidth={1.5} style={{ color: "var(--accent)" }} />
            <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--text-primary)" }}>
              Notes du manager
            </p>
          </div>
          {notes.length > 0 ? (
            <div className="space-y-3">
              {notes.slice(0, 3).map((n) => (
                <div key={n.id} className="p-3" style={{ background: "var(--bg-card)", borderLeft: "2px solid rgba(199,91,57,0.2)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-sans font-medium" style={{ color: "#D0CCC6" }}>{n.author}</span>
                  </div>
                  <p className="text-xs font-sans leading-relaxed" style={{ color: "var(--text-secondary)" }}>{n.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs font-sans" style={{ color: "var(--text-secondary)" }}>Aucune note</p>
          )}
        </div>

        {/* Upcoming deadlines */}
        <div className="p-5" style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)" }}>
          <div className="flex items-center gap-2 mb-4">
            <CalendarClock size={13} strokeWidth={1.5} style={{ color: "var(--accent)" }} />
            <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--text-primary)" }}>
              Prochaines échéances
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3" style={{ background: "var(--bg-card)" }}>
              <div>
                <p className="text-xs font-sans font-medium" style={{ color: "#D0CCC6" }}>Revue trimestrielle</p>
                <p className="text-[10px] font-sans" style={{ color: "var(--text-secondary)" }}>30 juin 2026</p>
              </div>
              <span className="text-[10px] font-sans font-semibold uppercase" style={{ color: "var(--accent)" }}>Dans 22j</span>
            </div>
            <div className="flex items-center justify-between p-3" style={{ background: "var(--bg-card)" }}>
              <div>
                <p className="text-xs font-sans font-medium" style={{ color: "#D0CCC6" }}>Point mensuel manager</p>
                <p className="text-[10px] font-sans" style={{ color: "var(--text-secondary)" }}>15 juin 2026</p>
              </div>
              <span className="text-[10px] font-sans font-semibold uppercase" style={{ color: "var(--success)" }}>Dans 7j</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
