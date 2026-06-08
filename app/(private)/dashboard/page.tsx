"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Sparkles, MessageCircle, Lightbulb, ArrowRight, RefreshCw, BarChart3, Target, Calendar, User } from "lucide-react";
import { mockBrief, mockKpi, agentCards, mockActivities, mockEvolution, timeAgo, formatEuro, mockCreator } from "@/components/dashboard/data";

// ── KPI Card ────────────────────────────────────────────

function KpiCard({ label, value, trend, subtitle }: { label: string; value: string; trend?: { value: string; positive: boolean }; subtitle?: string }) {
  return (
    <div className="p-4 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
      <div className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-1">{label}</div>
      <div className="text-lg font-semibold font-mono" style={{ fontFamily: "var(--font-display)" }}>{value}</div>
      {trend && (
        <div className={`flex items-center gap-1 mt-1 text-[11px] ${trend.positive ? "text-[#7A9A65]" : "text-[#C44536]"}`}>
          {trend.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{trend.value}</span>
        </div>
      )}
      {subtitle && <div className="text-[10px] opacity-30 mt-1">{subtitle}</div>}
    </div>
  );
}

// ── Section 1: DailyBrief ───────────────────────────────

function DailyBrief({ onOpenChat }: { onOpenChat: () => void }) {
  return (
    <div className="p-6 border border-[var(--color-border)] relative overflow-hidden" style={{ backgroundColor: "var(--color-card)" }}>
      {/* Decorative accent line */}
      <div className="absolute top-0 left-0 w-full h-0.5" style={{ backgroundColor: "var(--color-accent)" }} />

      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-base font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            Bonjour {mockBrief.greeting},
          </h2>
          <p className="text-xs opacity-50 mt-1">
            {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <div className="p-1.5 border border-[var(--color-border)] opacity-30">
          <Sparkles size={16} />
        </div>
      </div>

      <p className="text-sm leading-relaxed opacity-80 mb-3">{mockBrief.summary}</p>
      <p className="text-xs opacity-50 mb-4">
        Hier: <strong className="text-[var(--color-accent)]" style={{ fontFamily: "var(--font-display)" }}>+{formatEuro(mockBrief.yesterday_revenue)}</strong> (+{mockBrief.revenue_change_pct}%) · Post {mockBrief.top_post_platform} : {mockBrief.top_post_views.toLocaleString()} vues
      </p>

      {/* Suggestions */}
      <div className="space-y-2 mb-4">
        <div className="text-[10px] font-semibold uppercase tracking-wider opacity-30 mb-2">Suggestions pour aujourd'hui</div>
        {mockBrief.suggestions.map((s, i) => (
          <div key={s.id} className="flex items-start gap-2 text-xs p-2 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-base)" }}>
            <span className="font-mono text-[10px] opacity-30 shrink-0">{(i + 1).toString().padStart(2, "0")}</span>
            <span className="flex-1">{s.text}</span>
            <Link href={`/dashboard/${s.action}`} className="text-[var(--color-accent)] text-[10px] hover:underline shrink-0">Détails</Link>
          </div>
        ))}
      </div>

      <button
        onClick={onOpenChat}
        className="flex items-center gap-2 text-xs font-medium opacity-60 hover:opacity-100 transition-opacity"
      >
        <MessageCircle size={14} />
        Parler à mon assistant
        <ArrowRight size={12} />
      </button>
    </div>
  );
}

// ── Section 2: KPIs ─────────────────────────────────────

function KpiGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard
        label="Revenus du mois"
        value={formatEuro(mockKpi.month_revenue)}
        trend={{ value: `+${mockKpi.month_revenue_change_pct}% vs mois dernier`, positive: true }}
      />
      <KpiCard
        label="Followers totaux"
        value={mockKpi.total_followers.toLocaleString()}
        trend={{ value: `+${mockKpi.follower_change_pct}% ce mois`, positive: true }}
        subtitle="Toutes plateformes"
      />
      <KpiCard
        label="Engagement moyen"
        value={`${mockKpi.avg_engagement_rate}%`}
        trend={{ value: `+${mockKpi.engagement_change_pct}% cette semaine`, positive: true }}
      />
      <KpiCard
        label="Palier commission"
        value={mockKpi.commission_tier}
        trend={{ value: `${mockKpi.commission_rate}% · ${mockKpi.next_tier_name ? `Prochain: ${mockKpi.next_tier_name}` : "Palier max" }`, positive: true }}
        subtitle={`Progression: ${mockKpi.next_tier_progress_pct}%`}
      />
    </div>
  );
}

// ── Section 3: Agent Grid ───────────────────────────────

function AgentGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {agentCards.map((agent) => (
        <Link
          key={agent.id}
          href={agent.href}
          className="p-4 border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all group"
          style={{ backgroundColor: "var(--color-card)" }}
        >
          <div className="flex items-start justify-between mb-2">
            <span className="text-lg">{agent.emoji}</span>
            <ArrowRight size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
          </div>
          <h3 className="text-xs font-semibold mb-1">{agent.title}</h3>
          <p className="text-[11px] opacity-50 mb-2 leading-relaxed">{agent.description}</p>
          <div className="text-[10px] font-medium" style={{ color: "var(--color-accent)" }}>{agent.status}</div>
        </Link>
      ))}
    </div>
  );
}

// ── Section 4: Activity Stream ──────────────────────────

function ActivityStream() {
  return (
    <div className="border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
      <div className="px-4 py-3 border-b border-[var(--color-border)]">
        <h3 className="text-xs font-semibold" style={{ fontFamily: "var(--font-display)" }}>Aujourd'hui</h3>
      </div>
      <div className="divide-y divide-[var(--color-border)]">
        {mockActivities.map((act) => (
          <div key={act.id} className="px-4 py-2.5 flex items-center gap-3 text-xs hover:bg-[var(--color-base)]/50 transition-colors">
            <span className="text-sm">{act.emoji}</span>
            <span className="flex-1">{act.text}</span>
            <span className="text-[10px] opacity-30 shrink-0">{timeAgo(act.created_at)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Section 5: Quick Actions ────────────────────────────

function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <Link
        href="/dashboard/calendar"
        className="flex items-center gap-3 p-4 border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all"
        style={{ backgroundColor: "var(--color-card)" }}
      >
        <div className="p-2 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-base)" }}>
          <Calendar size={16} />
        </div>
        <div>
          <div className="text-xs font-medium">Créer du contenu</div>
          <div className="text-[10px] opacity-30">Planifier une publication</div>
        </div>
        <ArrowRight size={14} className="ml-auto opacity-20" />
      </Link>
      <Link
        href="/dashboard/messages"
        className="flex items-center gap-3 p-4 border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all"
        style={{ backgroundColor: "var(--color-card)" }}
      >
        <div className="p-2 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-base)" }}>
          <MessageCircle size={16} />
        </div>
        <div>
          <div className="text-xs font-medium">Discuter avec mon manager</div>
          <div className="text-[10px] opacity-30">Messagerie directe</div>
        </div>
        <ArrowRight size={14} className="ml-auto opacity-20" />
      </Link>
      <Link
        href="/dashboard/insights"
        className="flex items-center gap-3 p-4 border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all"
        style={{ backgroundColor: "var(--color-card)" }}
      >
        <div className="p-2 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-base)" }}>
          <Lightbulb size={16} />
        </div>
        <div>
          <div className="text-xs font-medium">Demander une revue stratégique</div>
          <div className="text-[10px] opacity-30">Analyse personnalisée</div>
        </div>
        <ArrowRight size={14} className="ml-auto opacity-20" />
      </Link>
    </div>
  );
}

// ── Section 6: Evolution ────────────────────────────────

function MiniChart({ data, color, label, unit }: { data: { month: string; value: number }[]; color: string; label: string; unit: string }) {
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;
  return (
    <div className="p-4 border border-[var(--color-border)] flex-1" style={{ backgroundColor: "var(--color-card)" }}>
      <div className="text-[10px] font-semibold uppercase tracking-wider opacity-30 mb-3">{label}</div>
      <div className="flex items-end gap-1 h-20">
        {data.map((d, i) => {
          const h = ((d.value - min) / range) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-[1px] transition-all duration-300" style={{ height: `${Math.max(h, 5)}%`, backgroundColor: color, opacity: 0.6 + (h / 100) * 0.4 }} />
              <span className="text-[8px] opacity-20 font-mono">{d.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EvolutionSection() {
  return (
    <div className="flex flex-col md:flex-row gap-3">
      <MiniChart data={mockEvolution.revenue} color="var(--color-accent)" label="Revenus 6 mois" unit="€" />
      <MiniChart data={mockEvolution.followers} color="#4A90D9" label="Followers 6 mois" unit="" />
      <MiniChart data={mockEvolution.wellness_score} color="#7A9A65" label="Bien-être" unit="/10" />
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────

export default function DashboardPage() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Section 1: Daily Brief */}
      <DailyBrief onOpenChat={() => setChatOpen(true)} />

      {/* Section 2: KPI */}
      <KpiGrid />

      {/* Section 3: Agents IA */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Mes agents IA</h2>
          <Link href="/dashboard/agents" className="text-[10px] font-medium opacity-30 hover:opacity-100 transition-opacity flex items-center gap-1">
            Voir tout <ArrowRight size={10} />
          </Link>
        </div>
        <AgentGrid />
      </div>

      {/* Section 4 + 6 layout: Stream + Quick actions + Evolution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick actions */}
          <QuickActions />
          {/* Evolution */}
          <div>
            <h2 className="text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-display)" }}>Mon évolution</h2>
            <EvolutionSection />
          </div>
        </div>

        {/* Right 1/3: Activity stream */}
        <div className="lg:col-span-1">
          <h2 className="text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-display)" }}>Activité en direct</h2>
          <ActivityStream />
        </div>
      </div>
    </div>
  );
}
