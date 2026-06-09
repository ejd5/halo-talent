"use client";

import { Loader, Activity, Users, Inbox, BarChart3, Mail, Zap } from "lucide-react";

// ─── Skeleton Components ─────────────────────────────────────────

export function AtlasSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-48" style={{ backgroundColor: "rgba(245,240,235,0.06)" }} />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4" style={{ backgroundColor: "#2A2420", border: "1px solid rgba(245,240,235,0.06)" }}>
            <div className="h-3 w-20 mb-3" style={{ backgroundColor: "rgba(245,240,235,0.06)" }} />
            <div className="h-8 w-16" style={{ backgroundColor: "rgba(245,240,235,0.06)" }} />
          </div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4" style={{ backgroundColor: "#2A2420", border: "1px solid rgba(245,240,235,0.06)" }}>
          <div className="h-4 w-3/4 mb-2" style={{ backgroundColor: "rgba(245,240,235,0.06)" }} />
          <div className="h-3 w-1/2" style={{ backgroundColor: "rgba(245,240,235,0.04)" }} />
        </div>
      ))}
    </div>
  );
}

export function AtlasPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-9 w-32 mb-2" style={{ backgroundColor: "rgba(245,240,235,0.06)" }} />
        <div className="h-4 w-64" style={{ backgroundColor: "rgba(245,240,235,0.04)" }} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4" style={{ backgroundColor: "#2A2420", border: "1px solid rgba(245,240,235,0.06)" }}>
            <div className="h-3 w-20 mb-3" style={{ backgroundColor: "rgba(245,240,235,0.06)" }} />
            <div className="h-8 w-24" style={{ backgroundColor: "rgba(245,240,235,0.06)" }} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-4" style={{ backgroundColor: "#2A2420", border: "1px solid rgba(245,240,235,0.06)" }}>
          <div className="h-4 w-32 mb-4" style={{ backgroundColor: "rgba(245,240,235,0.06)" }} />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3 mb-3">
              <div className="w-7 h-7" style={{ backgroundColor: "rgba(245,240,235,0.06)" }} />
              <div className="flex-1">
                <div className="h-3 w-full mb-1" style={{ backgroundColor: "rgba(245,240,235,0.06)" }} />
                <div className="h-2 w-20" style={{ backgroundColor: "rgba(245,240,235,0.04)" }} />
              </div>
            </div>
          ))}
        </div>
        <div className="p-4" style={{ backgroundColor: "#2A2420", border: "1px solid rgba(245,240,235,0.06)" }}>
          <div className="h-4 w-24 mb-4" style={{ backgroundColor: "rgba(245,240,235,0.06)" }} />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 mb-2" style={{ backgroundColor: "rgba(245,240,235,0.06)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-4 animate-pulse" style={{ backgroundColor: "#2A2420", border: "1px solid rgba(245,240,235,0.06)" }}>
      <div className="h-3 w-24 mb-3" style={{ backgroundColor: "rgba(245,240,235,0.06)" }} />
      <div className="h-8 w-16" style={{ backgroundColor: "rgba(245,240,235,0.06)" }} />
    </div>
  );
}

// ─── Empty States ────────────────────────────────────────────────

const EMPTY_ILLUSTRATIONS: Record<string, { icon: any; color: string }> = {
  fans: { icon: Users, color: "#C75B39" },
  inbox: { icon: Inbox, color: "#5B8FA8" },
  campaigns: { icon: Mail, color: "#C75B39" },
  analytics: { icon: BarChart3, color: "#7A9A65" },
  rules: { icon: Zap, color: "#C75B39" },
  activity: { icon: Activity, color: "rgba(245,240,235,0.2)" },
};

export function AtlasEmptyState({
  type = "activity",
  title,
  desc,
  cta,
  onCta,
}: {
  type?: keyof typeof EMPTY_ILLUSTRATIONS;
  title: string;
  desc?: string;
  cta?: string;
  onCta?: () => void;
}) {
  const illu = EMPTY_ILLUSTRATIONS[type] ?? EMPTY_ILLUSTRATIONS.activity;
  const Icon = illu.icon;

  return (
    <div className="flex flex-col items-center py-16 text-center animate-fade-in">
      {/* Decorative illustration */}
      <div className="relative mb-6">
        <div
          className="w-20 h-20 flex items-center justify-center"
          style={{ backgroundColor: `${illu.color}08`, border: `1px solid ${illu.color}15` }}
        >
          <Icon size={32} style={{ color: `${illu.color}30` }} />
        </div>
        {/* Decorative dots */}
        <div className="absolute -top-1 -right-1 w-3 h-3" style={{ backgroundColor: `${illu.color}15` }} />
        <div className="absolute -bottom-1 -left-1 w-2 h-2" style={{ backgroundColor: `${illu.color}10` }} />
      </div>

      <p className="text-sm font-medium mb-1" style={{ color: "rgba(245,240,235,0.4)" }}>
        {title}
      </p>
      {desc && (
        <p className="text-xs max-w-xs" style={{ color: "rgba(245,240,235,0.15)" }}>
          {desc}
        </p>
      )}
      {cta && onCta && (
        <button
          onClick={onCta}
          className="mt-4 px-4 py-2 text-sm font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: "#C75B39", color: "#F5F0EB" }}
        >
          {cta}
        </button>
      )}
    </div>
  );
}
