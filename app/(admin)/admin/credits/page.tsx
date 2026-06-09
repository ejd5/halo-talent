"use client";

import { useState, useEffect } from "react";
import { Coins, Loader, Search, AlertTriangle, Ban, RefreshCw } from "lucide-react";

interface AdminStats {
  total_generations: number;
  total_credits_used: number;
  total_cost_estimate: number;
  active_users: number;
  top_users: { id: string; email: string; total: number; plan: string }[];
  daily_stats: { date: string; count: number }[];
  recent_errors: { id: string; email: string; action: string; error: string; created_at: string }[];
}

export default function AdminCreditsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [adjusting, setAdjusting] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState(100);
  const [adjustReason, setAdjustReason] = useState("admin_adjustment");

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch("/api/studio/credits/admin-stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  async function handleAdjust(userId: string) {
    setAdjusting(userId);
    try {
      await fetch(`/api/studio/credits/admin-adjust`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, amount: adjustAmount, reason: adjustReason }),
      });
      fetchStats();
    } catch {
      // silent
    } finally {
      setAdjusting(null);
    }
  }

  async function handleSuspend(userId: string, suspended: boolean) {
    try {
      await fetch(`/api/studio/credits/admin-suspend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, suspended }),
      });
      fetchStats();
    } catch {
      // silent
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader size={20} className="animate-spin" style={{ color: "#C75B39" }} />
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#F5F0EB" }}>Crédits & Générations IA</h1>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Monitoring et gestion des quotas IA</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] transition-colors hover:bg-white/5 rounded-sm"
          style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#F5F0EB" }}
        >
          <RefreshCw size={12} /> Actualiser
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {[
          { label: "Générations totales", value: stats?.total_generations ?? 0, icon: Coins, color: "#C75B39" },
          { label: "Crédits consommés", value: stats?.total_credits_used ?? 0, icon: Coins, color: "#C75B39" },
          { label: "Coût estimé", value: `${((stats?.total_cost_estimate ?? 0)).toFixed(2)} €`, icon: Coins, color: "#F5F0EB" },
          { label: "Utilisateurs actifs", value: stats?.active_users ?? 0, icon: Coins, color: "#C75B39" },
          { label: "Erreurs récentes", value: stats?.recent_errors?.length ?? 0, icon: AlertTriangle, color: "#E5484D" },
        ].map((card) => (
          <div key={card.label} className="p-4 border rounded-sm" style={{ borderColor: "rgba(255,255,255,0.06)", background: "#0A0908" }}>
            <card.icon size={16} style={{ color: card.color, opacity: 0.5 }} />
            <p className="text-lg font-semibold mt-2" style={{ color: "#F5F0EB" }}>{card.value}</p>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{card.label}</p>
          </div>
        ))}
      </div>

      {/* Top users */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Top consommateurs</h2>
        <div className="border rounded-sm overflow-hidden" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                <th className="text-left px-3 py-2 font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>Email</th>
                <th className="text-left px-3 py-2 font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>Plan</th>
                <th className="text-right px-3 py-2 font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>Crédits utilisés</th>
                <th className="text-right px-3 py-2 font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats?.top_users?.map((u) => (
                <tr key={u.id} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  <td className="px-3 py-2" style={{ color: "#F5F0EB" }}>{u.email}</td>
                  <td className="px-3 py-2" style={{ color: "rgba(255,255,255,0.5)" }}>{u.plan}</td>
                  <td className="px-3 py-2 text-right" style={{ color: "#F5F0EB" }}>{u.total}</td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleSuspend(u.id, true)}
                        className="p-1 transition-colors hover:bg-white/5 rounded-sm"
                        title="Suspendre"
                        style={{ color: "#E5484D" }}
                      >
                        <Ban size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!stats?.top_users || stats.top_users.length === 0) && (
                <tr>
                  <td colSpan={4} className="text-center py-6" style={{ color: "rgba(255,255,255,0.15)" }}>
                    Aucune donnée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent errors */}
      {stats?.recent_errors && stats.recent_errors.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Erreurs API récentes</h2>
          <div className="border rounded-sm overflow-hidden" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                  <th className="text-left px-3 py-2 font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>Utilisateur</th>
                  <th className="text-left px-3 py-2 font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>Action</th>
                  <th className="text-left px-3 py-2 font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>Erreur</th>
                  <th className="text-right px-3 py-2 font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_errors.map((e, i) => (
                  <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <td className="px-3 py-2" style={{ color: "#F5F0EB" }}>{e.email}</td>
                    <td className="px-3 py-2" style={{ color: "rgba(255,255,255,0.5)" }}>{e.action}</td>
                    <td className="px-3 py-2" style={{ color: "#E5484D" }}>{e.error?.slice(0, 80)}</td>
                    <td className="px-3 py-2 text-right" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {new Date(e.created_at).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ajustement manuel */}
      <div className="p-4 border rounded-sm" style={{ borderColor: "rgba(255,255,255,0.06)", background: "#0A0908" }}>
        <h2 className="text-xs font-semibold mb-2" style={{ color: "#F5F0EB" }}>Ajuster manuellement les crédits</h2>
        <p className="text-[10px] mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
          Entrez l&apos;ID utilisateur et le montant à ajouter (négatif pour retirer)
        </p>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="text-[9px] uppercase tracking-wider block mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>ID Utilisateur</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="UUID de l'utilisateur"
              className="w-full text-xs px-2.5 py-1.5 bg-transparent outline-none rounded-sm"
              style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#F5F0EB" }}
            />
          </div>
          <div className="w-24">
            <label className="text-[9px] uppercase tracking-wider block mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>Montant</label>
            <input
              type="number"
              value={adjustAmount}
              onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)}
              className="w-full text-xs px-2.5 py-1.5 bg-transparent outline-none rounded-sm"
              style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#F5F0EB" }}
            />
          </div>
          <button
            onClick={() => handleAdjust(search)}
            disabled={!search || adjusting === search}
            className="px-3 py-1.5 text-[10px] font-medium transition-opacity hover:opacity-80 rounded-sm disabled:opacity-30"
            style={{ background: "#C75B39", color: "#FFFFFF" }}
          >
            {adjusting === search ? <Loader size={12} className="animate-spin" /> : "Appliquer"}
          </button>
        </div>
      </div>
    </div>
  );
}
