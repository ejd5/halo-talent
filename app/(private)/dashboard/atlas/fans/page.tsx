"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Loader, Users, Filter, ArrowUpDown, ChevronRight, Zap } from "lucide-react";
import { TIER_LABELS, TIER_COLORS } from "@/lib/atlas/crm/fans";
import type { AtlasFan } from "@/lib/atlas/crm/fans";

function FansContent() {
  const searchParams = useSearchParams();
  const tierFilter = searchParams.get("tier") || "";
  const [fans, setFans] = useState<AtlasFan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState(tierFilter);
  const [total, setTotal] = useState(0);

  useEffect(() => { fetchFans(); }, [tier]);

  async function fetchFans() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (tier) params.set("tier", tier);
      if (search) params.set("search", search);
      const res = await fetch(`/api/dashboard/atlas/fans?${params}`);
      const d = await res.json();
      setFans(d.fans ?? []);
      setTotal(d.total ?? 0);
    } catch {} finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchFans(); }, [search]);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#FFFFFF" }}>
            {tier ? TIER_LABELS[tier as keyof typeof TIER_LABELS] || "Fans" : "Tous mes fans"}
          </h1>
          <p className="text-sm mt-1" style={{ color: "#FFFFFF" }}>{total} fan{total > 1 ? "s" : ""}</p>
        </div>
        <Link href="/dashboard/atlas/fans/segments"
          className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-sm transition-opacity hover:opacity-80"
          style={{ background: "rgba(199,91,57,0.2)", color: "#C75B39" }}>
          <Filter size={14} /> Segments
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#FFFFFF" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher par nom, email..."
            className="w-full text-sm bg-transparent pl-9 pr-3 py-2 border border-[var(--color-border)] outline-none focus:border-[var(--color-accent)] transition-colors"
            style={{ color: "#FFFFFF" }} />
        </div>
        <select value={tier} onChange={(e) => setTier(e.target.value)}
          className="text-sm bg-transparent px-3 py-2 border border-[var(--color-border)] outline-none"
          style={{ color: "#FFFFFF" }}>
          <option value="">Tous les tiers</option>
          <option value="vip">VIP</option>
          <option value="whale">Whale</option>
          <option value="engaged">Engagé</option>
          <option value="warm">Tède</option>
          <option value="cold">Froid</option>
          <option value="churned">Perdu</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader size={16} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} /></div>
      ) : fans.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Users size={32} style={{ color: "rgba(255,255,255,0.06)" }} />
          <p className="text-sm mt-3" style={{ color: "rgba(255,255,255,0.15)" }}>Aucun fan trouvé</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.1)" }}>
            {tier ? "Aucun fan dans ce tier pour le moment" : "Importe ou connecte tes plateformes pour voir tes fans apparaître"}
          </p>
        </div>
      ) : (
        <div className="border border-[var(--color-border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", color: "#FFFFFF" }}>
                <th className="text-left px-4 py-3 font-semibold">Fan</th>
                <th className="text-left px-4 py-3 font-semibold">Tier</th>
                <th className="text-left px-4 py-3 font-semibold">Score</th>
                <th className="text-left px-4 py-3 font-semibold">Total dépensé</th>
                <th className="text-left px-4 py-3 font-semibold">Dernière interaction</th>
                <th className="text-left px-4 py-3 font-semibold">Tags</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {fans.map((fan) => (
                <tr key={fan.id} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/atlas/fans/${fan.id}`} className="flex items-center gap-3">
                      <div className="w-8 h-8 border border-[var(--color-border)] flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: "var(--color-card)" }}>
                        {(fan.display_name || fan.email || "?").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium" style={{ color: "#FFFFFF" }}>{fan.display_name || fan.email || "Anonyme"}</div>
                        {fan.email && <div className="text-xs" style={{ color: "#FFFFFF" }}>{fan.email}</div>}
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] px-2 py-0.5 rounded-sm font-medium" style={{
                      background: `${TIER_COLORS[fan.fan_tier]}20`,
                      color: TIER_COLORS[fan.fan_tier],
                    }}>
                      {TIER_LABELS[fan.fan_tier]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-sm" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div className="h-full rounded-sm" style={{ width: `${fan.fan_score}%`, background: fan.fan_score >= 65 ? "#10B981" : fan.fan_score >= 40 ? "#C75B39" : "rgba(255,255,255,0.2)" }} />
                      </div>
                      <span className="text-xs" style={{ color: "#FFFFFF" }}>{fan.fan_score}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: "#FFFFFF" }}>
                    {fan.total_spent.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#FFFFFF" }}>
                    {fan.last_interaction_at ? new Date(fan.last_interaction_at).toLocaleDateString("fr-FR") : "Jamais"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {(fan.tags ?? []).slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-sm" style={{ background: "rgba(255,255,255,0.06)", color: "#FFFFFF" }}>{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/atlas/fans/${fan.id}`} className="transition-opacity hover:opacity-70" style={{ color: "#C75B39" }}>
                      <ChevronRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function FansPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16"><Loader size={16} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} /></div>}>
      <FansContent />
    </Suspense>
  );
}
