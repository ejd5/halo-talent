"use client";

import { useState, useEffect } from "react";
import {
  Zap, Users, Mail, Phone, Bell, AlertTriangle,
  DollarSign, Activity, Globe, Loader,
} from "lucide-react";

interface MonitoringData {
  stats: {
    creators_using_atlas: number;
    total_fans: number;
    total_campaigns: number;
    active_rules: number;
    recent_executions_30d: number;
  };
  channel_volume: { email: number; sms: number; push: number };
  estimated_costs_usd: { email: number; sms: number; push: number; total: number };
  recent_errors: { id: string; error_message: string; created_at: string }[];
}

export default function AtlasMonitoringPage() {
  const [data, setData] = useState<MonitoringData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/atlas/monitoring");
        const d = await res.json();
        setData(d);
      } catch {} finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader size={20} className="animate-spin" style={{ color: "rgba(245,240,235,0.2)" }} />
      </div>
    );
  }

  const s = data?.stats;
  const cv = data?.channel_volume;
  const costs = data?.estimated_costs_usd;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
          Monitoring Atlas
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(245,240,235,0.4)" }}>
          Surveillance globale du module Atlas
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard icon={Globe} label="Créateurs actifs" value={s?.creators_using_atlas ?? 0} />
        <StatCard icon={Users} label="Fans gérés" value={s?.total_fans ?? 0} />
        <StatCard icon={Mail} label="Campagnes" value={s?.total_campaigns ?? 0} />
        <StatCard icon={Zap} label="Règles actives" value={s?.active_rules ?? 0} />
        <StatCard icon={Activity} label="Exécutions (30j)" value={s?.recent_executions_30d ?? 0} />
      </div>

      {/* Channel volume & Costs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel volume */}
        <div className="p-4" style={{ border: "1px solid rgba(245,240,235,0.06)" }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Volume par canal</h2>
          <div className="space-y-3">
            <ChannelRow icon={Mail} label="Email" count={cv?.email ?? 0} color="var(--accent)" />
            <ChannelRow icon={Phone} label="SMS" count={cv?.sms ?? 0} color="#5B8FA8" />
            <ChannelRow icon={Bell} label="Push" count={cv?.push ?? 0} color="var(--success)" />
          </div>
        </div>

        {/* Costs */}
        <div className="p-4" style={{ border: "1px solid rgba(245,240,235,0.06)" }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Coûts estimés (USD)</h2>
          <div className="space-y-3">
            <CostRow label="Email (Resend)" amount={costs?.email ?? 0} color="var(--accent)" />
            <CostRow label="SMS (Twilio)" amount={costs?.sms ?? 0} color="#5B8FA8" />
            <CostRow label="Push" amount={costs?.push ?? 0} color="var(--success)" />
            <div className="pt-2 border-t" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Total</span>
                <span className="text-sm font-bold" style={{ color: "var(--accent)" }}>
                  ${(costs?.total ?? 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent errors */}
      <div className="p-4" style={{ border: "1px solid rgba(245,240,235,0.06)" }}>
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <AlertTriangle size={14} style={{ color: "var(--danger)" }} />
          Erreurs récentes
        </h2>
        {(!data?.recent_errors || data.recent_errors.length === 0) ? (
          <p className="text-xs" style={{ color: "rgba(245,240,235,0.2)" }}>
            Aucune erreur récente
          </p>
        ) : (
          <div className="space-y-2">
            {data.recent_errors.map((err) => (
              <div
                key={err.id}
                className="flex items-start gap-2 p-2 text-xs"
                style={{ backgroundColor: "rgba(196,69,54,0.05)", border: "1px solid rgba(196,69,54,0.1)" }}
              >
                <span style={{ color: "var(--danger)" }}>{err.error_message}</span>
                <span className="ml-auto shrink-0" style={{ color: "rgba(245,240,235,0.2)" }}>
                  {new Date(err.created_at).toLocaleDateString("fr-FR")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <div className="p-4" style={{ backgroundColor: "var(--bg-card)", border: "1px solid rgba(245,240,235,0.06)" }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(245,240,235,0.4)" }}>{label}</span>
        <Icon size={14} style={{ color: "rgba(245,240,235,0.3)" }} />
      </div>
      <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
        {value.toLocaleString("fr-FR")}
      </p>
    </div>
  );
}

function ChannelRow({ icon: Icon, label, count, color }: { icon: any; label: string; count: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={14} style={{ color }} />
      <span className="text-sm flex-1" style={{ color: "rgba(245,240,235,0.5)" }}>{label}</span>
      <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{count.toLocaleString("fr-FR")}</span>
    </div>
  );
}

function CostRow({ label, amount, color }: { label: string; amount: number; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-sm" style={{ color: "rgba(245,240,235,0.5)" }}>{label}</span>
      </div>
      <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>${amount.toFixed(2)}</span>
    </div>
  );
}
