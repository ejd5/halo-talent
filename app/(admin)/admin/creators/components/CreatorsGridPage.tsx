"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Creator, Tier, CreatorStatus } from "../types";
import { creators as allCreators } from "../data";
import { CreatorCard } from "./CreatorCard";
import { Grid3x3, List, Map } from "lucide-react";

type ViewMode = "grid" | "list";

type Filters = {
  department: string;
  tier: Tier | "all";
  manager: string;
  status: CreatorStatus | "all";
  search: string;
  sort: "revenue" | "date" | "growth" | "engagement";
};

export function CreatorsGridPage() {
  const router = useRouter();
  const [view, setView] = useState<ViewMode>("grid");
  const [filters, setFilters] = useState<Filters>({
    department: "all",
    tier: "all",
    manager: "all",
    status: "all",
    search: "",
    sort: "revenue",
  });

  const filtered = useMemo(() => {
    let result = [...allCreators];

    if (filters.department !== "all")
      result = result.filter((c) => c.department === filters.department);
    if (filters.tier !== "all")
      result = result.filter((c) => c.tier === filters.tier);
    if (filters.status !== "all")
      result = result.filter((c) => c.status === filters.status);
    if (filters.manager !== "all")
      result = result.filter((c) => c.manager_id === filters.manager);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.full_name.toLowerCase().includes(q) ||
          c.department.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      switch (filters.sort) {
        case "revenue": return b.current_month_revenue - a.current_month_revenue;
        case "date": return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
        case "growth": return b.growth_rate - a.growth_rate;
        case "engagement": return b.engagement_rate - a.engagement_rate;
        default: return 0;
      }
    });

    return result;
  }, [filters]);

  const departments = [...new Set(allCreators.map((c) => c.department))];
  const tiers = [...new Set(allCreators.map((c) => c.tier))];
  const managers = [...new Set(allCreators.map((c) => c.manager_id))];

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((f) => ({ ...f, [key]: value }));

  return (
    <div className="max-w-[1600px] card-accent">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--text-primary)" }}>
            Créateurs
          </p>
          <h1 className="font-display text-[32px] font-bold mt-1" style={{ color: "var(--text-primary)" }}>
            Roster — {filtered.length} créateurs
          </h1>
        </div>
        <button
          className="px-4 py-2.5 text-[11px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:opacity-90"
          style={{ background: "var(--accent)", color: "var(--text-primary)" }}
        >
          + Ajouter un créateur
        </button>
      </div>

      {/* Filters bar */}
      <div className="flex items-center gap-3 flex-wrap mb-6 p-3" style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)" }}>
        <input
          type="text"
          placeholder="Rechercher..."
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="bg-transparent text-xs font-sans px-3 py-2 outline-none min-w-[180px]"
          style={{ color: "var(--text-primary)", border: "1px solid var(--border-default)" }}
        />
        <select
          value={filters.department}
          onChange={(e) => updateFilter("department", e.target.value)}
          className="bg-transparent text-xs font-sans px-3 py-2 outline-none"
          style={{ color: "#D0CCC6", border: "1px solid var(--border-default)" }}
        >
          <option value="all" style={{ background: "var(--bg-primary)" }}>Département</option>
          {departments.map((d) => (
            <option key={d} value={d} style={{ background: "var(--bg-primary)" }}>{d}</option>
          ))}
        </select>
        <select
          value={filters.tier}
          onChange={(e) => updateFilter("tier", e.target.value as Tier | "all")}
          className="bg-transparent text-xs font-sans px-3 py-2 outline-none"
          style={{ color: "#D0CCC6", border: "1px solid var(--border-default)" }}
        >
          <option value="all" style={{ background: "var(--bg-primary)" }}>Palier</option>
          {tiers.map((t) => (
            <option key={t} value={t} style={{ background: "var(--bg-primary)" }}>{t}</option>
          ))}
        </select>
        <select
          value={filters.manager}
          onChange={(e) => updateFilter("manager", e.target.value)}
          className="bg-transparent text-xs font-sans px-3 py-2 outline-none"
          style={{ color: "#D0CCC6", border: "1px solid var(--border-default)" }}
        >
          <option value="all" style={{ background: "var(--bg-primary)" }}>Manager</option>
          {managers.map((m) => (
            <option key={m} value={m} style={{ background: "var(--bg-primary)" }}>{m}</option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) => updateFilter("status", e.target.value as CreatorStatus | "all")}
          className="bg-transparent text-xs font-sans px-3 py-2 outline-none"
          style={{ color: "#D0CCC6", border: "1px solid var(--border-default)" }}
        >
          <option value="all" style={{ background: "var(--bg-primary)" }}>Statut</option>
          <option value="active" style={{ background: "var(--bg-primary)" }}>Actif</option>
          <option value="pause" style={{ background: "var(--bg-primary)" }}>Pause</option>
          <option value="alert" style={{ background: "var(--bg-primary)" }}>Alarme</option>
        </select>

        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setView("grid")}
            className="p-1.5 transition-colors"
            style={{ color: view === "grid" ? "var(--accent)" : "var(--text-secondary)", background: view === "grid" ? "rgba(199,91,57,0.1)" : "transparent" }}
          >
            <Grid3x3 size={15} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setView("list")}
            className="p-1.5 transition-colors"
            style={{ color: view === "list" ? "var(--accent)" : "var(--text-secondary)", background: view === "list" ? "rgba(199,91,57,0.1)" : "transparent" }}
          >
            <List size={15} strokeWidth={1.5} />
          </button>
          <select
            value={filters.sort}
            onChange={(e) => updateFilter("sort", e.target.value as Filters["sort"])}
            className="bg-transparent text-[10px] font-sans font-semibold uppercase tracking-[0.1em] px-2 py-1.5 outline-none ml-2"
            style={{ color: "var(--text-primary)", border: "1px solid var(--border-default)" }}
          >
            <option value="revenue" style={{ background: "var(--bg-primary)" }}>Revenus</option>
            <option value="date" style={{ background: "var(--bg-primary)" }}>Date d'arrivée</option>
            <option value="growth" style={{ background: "var(--bg-primary)" }}>Croissance</option>
            <option value="engagement" style={{ background: "var(--bg-primary)" }}>Engagement</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              onClick={() => router.push(`/admin/creators/${creator.id}`)}
            />
          ))}
        </div>
      ) : (
        <div>
          {filtered.map((creator) => (
            <div
              key={creator.id}
              onClick={() => router.push(`/admin/creators/${creator.id}`)}
              className="flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors hover:bg-white/[0.02]"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
            >
              <div className="w-10 h-10 flex items-center justify-center text-sm font-sans font-semibold shrink-0" style={{ background: "rgba(199,91,57,0.15)", color: "var(--accent)" }}>
                {creator.full_name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-sans font-medium" style={{ color: "var(--text-primary)" }}>{creator.full_name}</p>
                <p className="text-[11px] font-sans" style={{ color: "var(--text-secondary)" }}>{creator.department}</p>
              </div>
              <span className="text-xs font-sans font-medium" style={{ color: "var(--text-secondary)" }}>{creator.tier}</span>
              <span className="text-sm font-display font-bold" style={{ color: "var(--accent)" }}>
                {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", notation: "compact" }).format(creator.current_month_revenue)}
              </span>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <p className="text-sm font-sans text-center py-12" style={{ color: "var(--text-secondary)" }}>
          Aucun créateur trouvé
        </p>
      )}
    </div>
  );
}
