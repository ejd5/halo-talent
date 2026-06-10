"use client";

import { useState, useEffect } from "react";
import { Loader2, CheckCircle, XCircle, Cpu, Database, Key, Globe, FileText, Users, CalendarDays } from "lucide-react";

type MonitoringData = {
  status: string;
  uptime: number;
  timestamp: string;
  metrics: Record<string, number>;
  services: Record<string, string>;
};

export default function MonitoringPage() {
  const [data, setData] = useState<MonitoringData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/monitoring")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${h}h ${m}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={24} className="animate-spin" style={{ color: "var(--accent)" }} />
      </div>
    );
  }

  return (
    <div style={{ padding: "32px 40px" }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-semibold" style={{ color: "var(--text-primary)" }}>
            Monitoring
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            État du système Halo Talent
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
            style={{
              background: data?.status === "operational" ? "rgba(122,154,101,0.12)" : "rgba(196,69,54,0.12)",
              color: data?.status === "operational" ? "var(--success)" : "var(--danger)",
            }}
          >
            {data?.status === "operational" ? <CheckCircle size={12} /> : <XCircle size={12} />}
            {data?.status === "operational" ? "Opérationnel" : "Problème"}
          </span>
        </div>
      </div>

      {/* Services */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
          Services
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {Object.entries(data?.services || {}).map(([name, status]) => (
            <div
              key={name}
              className="flex items-center gap-3 p-3"
              style={{ border: "1px solid var(--border-default)" }}
            >
              {status === "operational" || status === "configured"
                ? <CheckCircle size={16} style={{ color: "var(--success)" }} />
                : <XCircle size={16} style={{ color: "var(--danger)" }} />
              }
              <div>
                <div className="text-sm" style={{ color: "var(--text-primary)" }}>{name}</div>
                <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
          Métriques
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <MetricCard
            icon={<Users size={18} />}
            label="Créateurs actifs"
            value={data?.metrics.active_creators || 0}
          />
          <MetricCard
            icon={<Users size={18} />}
            label="Membres équipe"
            value={data?.metrics.team_members || 0}
          />
          <MetricCard
            icon={<CalendarDays size={18} />}
            label="Événements calendrier"
            value={data?.metrics.total_calendar_events || 0}
          />
          <MetricCard
            icon={<CalendarDays size={18} />}
            label="Événements aujourd'hui"
            value={data?.metrics.today_events || 0}
          />
          <MetricCard
            icon={<FileText size={18} />}
            label="Drafts en attente"
            value={data?.metrics.pending_drafts || 0}
          />
          <MetricCard
            icon={<FileText size={18} />}
            label="Entrées audit aujourd'hui"
            value={data?.metrics.audit_entries_today || 0}
          />
        </div>
      </div>

      {/* Uptime */}
      <div className="p-4" style={{ border: "1px solid var(--border-default)" }}>
        <div className="flex items-center gap-2 mb-1">
          <Cpu size={14} style={{ color: "var(--text-secondary)" }} />
          <span className="text-sm" style={{ color: "var(--text-primary)" }}>Uptime</span>
        </div>
        <span className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
          {formatUptime(data?.uptime || 0)}
        </span>
        <span className="text-xs ml-2" style={{ color: "rgba(255,255,255,0.3)" }}>
          depuis le dernier déploiement
        </span>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
      <div className="flex items-center gap-2 mb-2" style={{ color: "var(--text-secondary)" }}>
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>{value}</div>
    </div>
  );
}
