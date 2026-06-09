"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Users, Zap, Sparkles, ArrowRight, Activity,
  UserPlus, Send, MessageCircle, DollarSign,
} from "lucide-react";
import { AtlasPageSkeleton } from "@/components/atlas/AtlasShared";
import { AtlasTourButton, AtlasGuidedTour } from "@/components/atlas/AtlasGuidedTour";

interface AtlasOverview {
  fanStats: {
    total: number; whales: number; vip: number; engaged: number;
    warm: number; cold: number; churned: number; total_revenue: number;
  };
  recentActivity: { id: string; text: string; occurred_at: string }[];
  draftCount: number;
}

function formatEuro(n: number): string {
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.round(hours / 24);
  return `il y a ${days}j`;
}

export default function AtlasPageWrapper() {
  return (
    <Suspense fallback={<AtlasPageSkeleton />}>
      <AtlasPage />
    </Suspense>
  );
}

function AtlasPage() {
  const [data, setData] = useState<AtlasOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const showTour = searchParams.get("onboarded") === "true";

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/dashboard/atlas/overview");
        const d = await res.json();
        setData(d);
      } catch {} finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <AtlasPageSkeleton />;
  }

  const stats = data?.fanStats;
  const whalesVip = (stats?.whales ?? 0) + (stats?.vip ?? 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[2.2rem] font-semibold" style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}>
            Atlas
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-ink-secondary)" }}>
            Fan Relationship Manager — Automatise et personnalise tes relations fans
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/atlas/onboarding"
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 font-medium transition-all hover:opacity-80"
            style={{ backgroundColor: "rgba(245,240,235,0.06)", color: "#F5F0EB", border: "1px solid rgba(245,240,235,0.1)" }}
          >
            <Sparkles size={12} />
            Onboarding
          </Link>
          <AtlasTourButton />
        </div>
      </div>
      <AtlasGuidedTour autoStart={showTour} />

      {/* KPI Row — 5 cartes, même style que Studio */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <KpiCard label="Fans actifs" value={stats?.total ?? null} icon={Users} />
        <KpiCard label="Whales & VIP" value={whalesVip} icon={Zap} />
        <KpiCard label="Revenus" value={stats?.total_revenue ?? null} icon={DollarSign} isCurrency />
        <KpiCard label="Brouillons IA" value={data?.draftCount ?? null} icon={MessageCircle} />
        <KpiCard label="ROI Atlas" value={null} icon={Activity} />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activité récente */}
        <div className="lg:col-span-2" style={{ border: "1px solid rgba(245,240,235,0.06)" }}>
          <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(245,240,235,0.04)" }}>
            <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: "#F5F0EB" }}>
              <Activity size={14} /> Activité récente
            </h3>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {(!data?.recentActivity || data.recentActivity.length === 0) ? (
              <div className="flex flex-col items-center py-12 text-center">
                <Activity size={24} style={{ color: "var(--color-ink-tertiary)" }} />
                <p className="text-sm mt-3" style={{ color: "var(--color-ink-tertiary)" }}>
                  Aucune activité récente
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--color-ink-tertiary)" }}>
                  Les événements apparaîtront quand tu interagiras avec tes fans
                </p>
              </div>
            ) : (
              data.recentActivity.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start gap-3 px-4 py-3"
                  style={{ borderBottom: "1px solid rgba(245,240,235,0.04)" }}
                >
                  <div className="w-7 h-7 flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(199,91,57,0.1)" }}>
                    <Activity size={12} style={{ color: "#C75B39" }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm" style={{ color: "#F5F0EB" }}>{act.text}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-tertiary)" }}>{timeAgo(act.occurred_at)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Colonne droite */}
        <div className="space-y-4">
          {/* Actions rapides — liste verticale */}
          <div>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "#F5F0EB" }}>
              Actions rapides
            </h3>
            <div className="space-y-0.5">
              <QuickAction icon={UserPlus} label="Capturer un lead" href="/dashboard/atlas/fans" />
              <QuickAction icon={Send} label="Lancer une campagne" href="/dashboard/atlas/campaigns/email" />
              <QuickAction icon={MessageCircle} label="Valider mes brouillons" href="/dashboard/atlas/inbox/drafts" badge={data?.draftCount} />
              <QuickAction icon={Zap} label="Voir mes whales" href="/dashboard/atlas/fans?tier=whale" />
            </div>
          </div>

          {/* Insights du jour */}
          <div className="p-4" style={{ border: "1px solid rgba(199,91,57,0.1)", backgroundColor: "rgba(199,91,57,0.04)" }}>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "#F5F0EB" }}>
              <Sparkles size={14} style={{ color: "#C75B39" }} /> Insights du jour
            </h3>
            <p className="text-xs" style={{ color: "var(--color-ink-tertiary)" }}>
              Connecte des plateformes et interagis avec tes fans pour débloquer des insights personnalisés.
            </p>
            <Link
              href="/dashboard/atlas/settings"
              className="flex items-center gap-1 text-xs font-medium mt-3 transition-opacity hover:opacity-70"
              style={{ color: "#C75B39" }}
            >
              Configurer mes canaux <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── KPI Card — même style exact que Studio ────────────────────

function KpiCard({ label, value, icon: Icon, isCurrency }: {
  label: string;
  value: number | null;
  icon: any;
  isCurrency?: boolean;
}) {
  const displayValue = (value === null || value === 0)
    ? "—"
    : isCurrency
      ? formatEuro(value)
      : value.toLocaleString("fr-FR");

  return (
    <div className="p-4" style={{ backgroundColor: "#2A2420", border: "1px solid rgba(245,240,235,0.06)" }}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-sans text-[0.6rem] uppercase tracking-[0.1em]" style={{ color: "var(--color-ink-tertiary)" }}>
          {label}
        </span>
        <Icon size={14} style={{ color: "var(--color-ink-secondary)" }} />
      </div>
      <p
        className="text-[2rem] font-bold leading-none"
        style={{
          fontFamily: "var(--font-display)",
          color: (value === null || value === 0) ? "var(--color-ink-tertiary)" : "#F5F0EB",
        }}
      >
        {displayValue}
      </p>
    </div>
  );
}

// ─── Quick Action — liste verticale ────────────────────────────

function QuickAction({ icon: Icon, label, href, badge }: {
  icon: any; label: string; href: string; badge?: number;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 px-3 py-2 transition-colors"
      style={{ color: "#F5F0EB" }}
      onMouseEnter={(e) => { e.currentTarget.style.color = "#C75B39"; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = "#F5F0EB"; }}
    >
      <Icon size={18} style={{ color: "#C75B39" }} />
      <span className="flex-1 text-sm">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="text-[10px] px-1.5 py-0.5" style={{ backgroundColor: "rgba(199,91,57,0.15)", color: "#C75B39" }}>
          {badge}
        </span>
      )}
      <ArrowRight
        size={12}
        style={{ color: "var(--color-ink-tertiary)" }}
        className="transition-transform duration-200 group-hover:translate-x-1"
      />
    </Link>
  );
}
