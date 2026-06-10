"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Sparkles, MessageCircle, Lightbulb, ArrowRight, Calendar, Globe, ChevronRight } from "lucide-react";
import { mockBrief, mockKpi, agentCards, mockEvolution, formatEuro } from "@/components/dashboard/data";

// ── KPI Card ────────────────────────────────────────────

function KpiCard({ label, value, trend, subtitle }: { label: string; value: string; trend?: { value: string; positive: boolean }; subtitle?: string }) {
  return (
    <div className="p-6 border border-[var(--color-border)] card-accent" style={{ backgroundColor: "var(--color-card)" }}>
      <div className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-primary)" }}>{label}</div>
      <div className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-accent)" }}>{value}</div>
      {trend && (
        <div className={`flex items-center gap-1 mt-2 text-sm ${trend.positive ? "text-[#A8D08D]" : "text-[var(--danger)]"}`}>
          {trend.positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{trend.value}</span>
        </div>
      )}
      {subtitle && <div className="text-sm mt-2" style={{ color: "var(--text-primary)" }}>{subtitle}</div>}
    </div>
  );
}

// ── Section 1: DailyBrief ───────────────────────────────

function DailyBrief() {
  return (
    <div className="p-6 md:p-8 border border-[var(--color-border)] relative overflow-hidden" style={{ backgroundColor: "var(--color-card)" }}>
      {/* Decorative accent line */}
      <div className="absolute top-0 left-0 w-full h-0.5" style={{ backgroundColor: "var(--color-accent)" }} />

      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Bonjour {mockBrief.greeting},
          </h2>
          <p className="text-base mt-1.5 font-bold" style={{ color: "var(--text-primary)" }}>
            {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <div className="p-2 border border-[var(--color-border)] opacity-30">
          <Sparkles size={18} />
        </div>
      </div>

      <p className="text-lg leading-relaxed font-bold mb-4" style={{ color: "var(--text-primary)" }}>{mockBrief.summary}</p>
      <p className="text-base mb-5 font-bold" style={{ color: "var(--text-primary)" }}>
        Hier: <strong className="text-[var(--color-accent)]" style={{ fontFamily: "var(--font-display)" }}>+{formatEuro(mockBrief.yesterday_revenue)}</strong> (+{mockBrief.revenue_change_pct}%) · Post {mockBrief.top_post_platform} : {mockBrief.top_post_views.toLocaleString()} vues
      </p>

      {/* Suggestions */}
      <div className="space-y-2 mb-5">
        <div className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-primary)" }}>Suggestions pour aujourd'hui</div>
        {mockBrief.suggestions.map((s, i) => (
          <div key={s.id} className="flex items-start gap-3 text-base p-3 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-surface)" }}>
            <span className="font-mono text-sm shrink-0" style={{ color: "var(--text-primary)" }}>{(i + 1).toString().padStart(2, "0")}</span>
            <span className="flex-1">{s.text}</span>
            <Link href={`/dashboard/${s.action}`} className="text-sm shrink-0" style={{ color: "var(--accent)" }}>Détails</Link>
          </div>
        ))}
      </div>

      <Link
        href="/dashboard/messages"
        className="flex items-center gap-2 text-base font-medium transition-colors" style={{ color: "var(--accent)" }}
      >
        <MessageCircle size={18} />
        Parler à mon assistant
        <ArrowRight size={16} />
      </Link>
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
          className="p-5 border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all group card-accent"
          style={{ backgroundColor: "var(--color-card)" }}
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-2xl">{agent.emoji}</span>
            <ArrowRight size={18} className="opacity-0 group-hover:opacity-40 transition-opacity" />
          </div>
          <h3 className="text-base font-bold mb-1.5">{agent.title}</h3>
          <p className="text-sm mb-2 leading-relaxed" style={{ color: "var(--text-primary)" }}>{agent.description}</p>
          <div className="text-sm font-medium" style={{ color: "var(--color-accent)" }}>{agent.status}</div>
        </Link>
      ))}
    </div>
  );
}

// ── Section 4: Missions du jour ──────────────────────────

const missionsDuJour = [
  { id: "m1", emoji: "🧬", text: "Finalisez votre ADN créatif", action: "/onboarding/dna" },
  { id: "m2", emoji: "🔗", text: "Connectez votre première plateforme", action: "/dashboard/platforms" },
  { id: "m3", emoji: "✨", text: "Publiez votre premier contenu", action: "/studio/composer" },
  { id: "m4", emoji: "💬", text: "Répondez à vos messages en attente", action: "/dashboard/messages" },
];

function MissionsDuJour() {
  return (
    <div className="border border-[var(--color-border)] card-accent" style={{ backgroundColor: "var(--color-card)" }}>
      <div className="px-5 py-3.5 border-b border-[var(--color-border)] flex items-center justify-between">
        <h3 className="text-base font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>Missions du jour</h3>
        <span className="text-[10px] font-medium px-2 py-0.5" style={{ color: "rgba(245,240,235,0.4)", border: "1px solid rgba(245,240,235,0.1)" }}>données de démonstration</span>
      </div>
      <div className="divide-y divide-[var(--color-border)]">
        {missionsDuJour.map((m) => (
          <Link
            key={m.id}
            href={m.action}
            className="px-5 py-3 flex items-center gap-3 text-sm hover:bg-[var(--color-base)]/50 transition-colors"
          >
            <span className="text-base">{m.emoji}</span>
            <span className="flex-1 font-bold" style={{ color: "var(--text-primary)" }}>{m.text}</span>
            <ChevronRight size={14} style={{ color: "rgba(245,240,235,0.3)" }} />
          </Link>
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
        className="flex items-center gap-4 p-5 border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all card-accent"
        style={{ backgroundColor: "var(--color-card)" }}
      >
        <div className="p-3 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-surface)" }}>
          <Calendar size={20} />
        </div>
        <div>
          <div className="text-base font-bold">Créer du contenu</div>
          <div className="text-sm mt-0.5 font-medium" style={{ color: "var(--text-primary)" }}>Planifier une publication</div>
        </div>
        <ArrowRight size={18} className="ml-auto shrink-0" style={{ color: "var(--text-primary)" }} />
      </Link>
      <Link
        href="/dashboard/messages"
        className="flex items-center gap-4 p-5 border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all card-accent"
        style={{ backgroundColor: "var(--color-card)" }}
      >
        <div className="p-3 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-surface)" }}>
          <MessageCircle size={20} />
        </div>
        <div>
          <div className="text-base font-bold">Discuter avec mon manager</div>
          <div className="text-sm mt-0.5 font-medium" style={{ color: "var(--text-primary)" }}>Messagerie directe</div>
        </div>
        <ArrowRight size={18} className="ml-auto shrink-0" style={{ color: "var(--text-primary)" }} />
      </Link>
      <Link
        href="/dashboard/insights"
        className="flex items-center gap-4 p-5 border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all card-accent"
        style={{ backgroundColor: "var(--color-card)" }}
      >
        <div className="p-3 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-surface)" }}>
          <Lightbulb size={20} />
        </div>
        <div>
          <div className="text-base font-bold">Demander une revue stratégique</div>
          <div className="text-sm mt-0.5 font-medium" style={{ color: "var(--text-primary)" }}>Analyse personnalisée</div>
        </div>
        <ArrowRight size={18} className="ml-auto shrink-0" style={{ color: "var(--text-primary)" }} />
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
    <div className="p-5 border border-[var(--color-border)] flex-1 card-accent" style={{ backgroundColor: "var(--color-card)" }}>
      <div className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-primary)" }}>{label}</div>
      <div className="flex items-end gap-1.5 h-24">
        {data.map((d, i) => {
          const h = ((d.value - min) / range) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full rounded-sm transition-all duration-300" style={{ height: `${Math.max(h, 5)}%`, backgroundColor: color, opacity: 0.6 + (h / 100) * 0.4 }} />
              <span className="text-xs font-mono" style={{ color: "var(--text-primary)" }}>{d.month}</span>
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
      <MiniChart data={mockEvolution.wellness_score} color="#A8D08D" label="Bien-être" unit="/10" />
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────

export default function DashboardPage() {
  const [dismissDNA, setDismissDNA] = useState(false);
  const [dismissAtlas, setDismissAtlas] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Demo data indicator */}
      <div className="flex justify-end">
        <span className="text-[10px] font-medium px-2 py-1" style={{ color: "rgba(245,240,235,0.25)", border: "1px solid rgba(245,240,235,0.06)" }}>
          données de démonstration
        </span>
      </div>

      {/* Section 1: Daily Brief */}
      <DailyBrief />

      {/* Section 2: DNA Onboarding CTA */}
      {!dismissDNA && (
        <div className="relative group">
          <button
            onClick={() => setDismissDNA(true)}
            className="absolute top-3 right-3 z-10 transition-opacity opacity-40 hover:opacity-100"
            style={{ color: "rgba(245,240,235,0.4)" }}
            aria-label="Fermer"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 2l10 10M12 2L2 12"/></svg>
          </button>
          <Link href="/onboarding/dna" className="block group">
            <div className="p-6 border border-[var(--color-border)] relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(199,91,57,0.2) 0%, rgba(199,91,57,0.08) 40%, transparent 100%)" }}>
              <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: "var(--accent)" }} />
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 shrink-0" style={{ backgroundColor: "var(--accent-soft)", border: "1px solid rgba(199,91,57,0.25)" }}>
                    <Sparkles size={28} style={{ color: "var(--accent)" }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                      Définissez votre ADN créatif
                    </h2>
                    <p className="text-sm mt-1.5 font-medium" style={{ color: "rgba(245,240,235,0.7)" }}>
                      8 sections pour révéler votre identité, votre voix, votre style — et débloquer votre Studio personnalisé avec vos 6 agents IA.
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs font-medium">
                      <span className="flex items-center gap-1" style={{ color: "var(--accent)" }}>Identité</span>
                      <span className="flex items-center gap-1" style={{ color: "var(--accent)" }}>Voice</span>
                      <span className="flex items-center gap-1" style={{ color: "var(--accent)" }}>Esthétique</span>
                      <span className="flex items-center gap-1" style={{ color: "rgba(245,240,235,0.35)" }}>+ 5 sections</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium transition-opacity group-hover:opacity-80 shrink-0" style={{ color: "var(--accent)" }}>
                  Commencer <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Section 3: Atlas CTA */}
      {!dismissAtlas && (
        <div className="relative group">
          <button
            onClick={() => setDismissAtlas(true)}
            className="absolute top-3 right-3 z-10 transition-opacity opacity-40 hover:opacity-100"
            style={{ color: "rgba(245,240,235,0.4)" }}
            aria-label="Fermer"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 2l10 10M12 2L2 12"/></svg>
          </button>
          <Link href="/dashboard/atlas" className="block group">
            <div className="p-6 border border-[var(--color-border)] relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(199,91,57,0.15) 0%, rgba(199,91,57,0.05) 50%, transparent 100%)" }}>
              <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: "var(--color-accent)" }} />
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 border border-[var(--color-accent)]/20 shrink-0" style={{ backgroundColor: "rgba(199,91,57,0.1)" }}>
                    <Globe size={28} style={{ color: "var(--color-accent)" }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                      Atlas CRM
                    </h2>
                    <p className="text-sm mt-1.5 font-medium" style={{ color: "var(--text-primary)" }}>
                      Gérez votre relation fan — scoring intelligent, campagnes automatisées, inbox unifié, funnels de conversion et modération IA.
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs font-medium">
                      <span className="flex items-center gap-1" style={{ color: "var(--success)" }}>● Scoring & Tiers</span>
                      <span className="flex items-center gap-1" style={{ color: "var(--success)" }}>● Automatisations</span>
                      <span className="flex items-center gap-1" style={{ color: "var(--success)" }}>● Campagnes multi-canal</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium transition-opacity group-hover:opacity-80 shrink-0" style={{ color: "var(--color-accent)" }}>
                  Ouvrir <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Section 3: KPI */}
      <KpiGrid />

      {/* Section 3: Agents IA */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>Mes agents IA</h2>
            <span className="text-[10px] font-medium px-1.5 py-0.5" style={{ color: "rgba(245,240,235,0.3)", border: "1px solid rgba(245,240,235,0.08)" }}>simulation</span>
          </div>
          <Link href="/dashboard/agents" className="text-sm font-medium flex items-center gap-1 transition-colors" style={{ color: "var(--text-primary)" }}>
            Voir tout <ArrowRight size={14} />
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
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>Mon évolution</h2>
            <EvolutionSection />
          </div>
        </div>

        {/* Right 1/3: Missions du jour */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>Missions du jour</h2>
          <MissionsDuJour />
        </div>
      </div>
    </div>
  );
}
