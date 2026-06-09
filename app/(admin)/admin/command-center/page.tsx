"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  LayoutGrid, Table2, Maximize2, Users, DollarSign, TrendingUp,
  AlertTriangle, Search, Filter, X, ChevronDown, ChevronRight,
  MessageSquare, FileText, BarChart3, RefreshCw, Download,
  Star, Zap, Clock, CheckCircle, Circle, Minus, Send,
  Tag, ArrowUpDown, ArrowUp, ArrowDown, Loader,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// ─── Types ──────────────────────────────────────────────────

interface CreatorData {
  id: string;
  email: string;
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  department: string | null;
  role: string;
  status: string;
  commission_tier: string | null;
  joined_at: string;
  today_revenue: number;
  period_revenue: number;
  period_change: number;
  pending_drafts: number;
  active_fans: number;
  total_fans: number;
  alerts: any[];
  status_color: "green" | "yellow" | "red" | "black";
  sparkline: number[];
  total_commission: number;
}

interface CommandCenterData {
  creators: CreatorData[];
  totals: {
    creators_count: number;
    total_revenue: number;
    total_commission: number;
    total_alerts: number;
    top_performer: { id: string; name: string; revenue: number } | null;
  };
}

type ViewMode = "grid" | "compact" | "detail";
type Period = "today" | "7d" | "30d" | "90d";
type SortKey = "alpha" | "revenue_day" | "revenue_month" | "growth" | "joined";

// ─── Status dot ─────────────────────────────────────────────

function StatusDot({ color }: { color: string }) {
  const colors: Record<string, string> = {
    green: "#7A9A65",
    yellow: "#C75B39",
    red: "#C44536",
    black: "rgba(245,240,235,0.2)",
  };
  return (
    <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: colors[color] || colors.green }} />
  );
}

// ─── Sparkline mini ─────────────────────────────────────────

function MiniSparkline({ data, color }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1);
  const h = 24;
  if (data.length === 0) return <div className="h-6" />;
  return (
    <div className="flex items-end gap-px h-6">
      {data.map((v, i) => (
        <div
          key={i}
          className="w-full transition-all"
          style={{
            height: `${(v / max) * h}px`,
            backgroundColor: color || "#C75B39",
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
}

// ─── Filter sidebar ─────────────────────────────────────────

interface Filters {
  departments: string[];
  status: string;
  alertsOnly: boolean;
  performance: string;
}

function FilterSidebar({
  creators,
  filters,
  onFilter,
  onClose,
}: {
  creators: CreatorData[];
  filters: Filters;
  onFilter: (f: Filters) => void;
  onClose: () => void;
}) {
  const departments = [...new Set(creators.map((c) => c.department).filter(Boolean))] as string[];

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div
        className="w-64 h-full overflow-y-auto p-4 space-y-4"
        style={{ backgroundColor: "#1A1614", borderRight: "1px solid rgba(245,240,235,0.06)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(245,240,235,0.5)" }}>Filtres</h3>
          <button onClick={onClose}><X size={12} style={{ color: "rgba(245,240,235,0.3)" }} /></button>
        </div>

        {/* Department */}
        <div>
          <p className="text-[10px] font-medium mb-1.5" style={{ color: "rgba(245,240,235,0.4)" }}>Département</p>
          <div className="space-y-1">
            {departments.map((d) => (
              <label key={d} className="flex items-center gap-2 text-[10px] cursor-pointer" style={{ color: "#F5F0EB" }}>
                <input
                  type="checkbox"
                  checked={filters.departments.includes(d)}
                  onChange={() => {
                    const next = filters.departments.includes(d)
                      ? filters.departments.filter((x) => x !== d)
                      : [...filters.departments, d];
                    onFilter({ ...filters, departments: next });
                  }}
                  className="accent-[#C75B39]"
                />
                {d}
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <p className="text-[10px] font-medium mb-1.5" style={{ color: "rgba(245,240,235,0.4)" }}>Statut</p>
          {["all", "active", "paused", "archived"].map((s) => (
            <button
              key={s}
              onClick={() => onFilter({ ...filters, status: s })}
              className="block w-full text-left text-[10px] py-1 px-2"
              style={{
                backgroundColor: filters.status === s ? "rgba(199,91,57,0.1)" : "transparent",
                color: filters.status === s ? "#C75B39" : "rgba(245,240,235,0.5)",
              }}
            >
              {s === "all" ? "Tous" : s === "active" ? "Actif" : s === "paused" ? "En pause" : "Archivé"}
            </button>
          ))}
        </div>

        {/* Performance */}
        <div>
          <p className="text-[10px] font-medium mb-1.5" style={{ color: "rgba(245,240,235,0.4)" }}>Performance</p>
          {[
            { key: "", label: "Tous" },
            { key: "top10", label: "Top 10%" },
            { key: "top25", label: "Top 25%" },
            { key: "bottom25", label: "Bottom 25%" },
          ].map((p) => (
            <button
              key={p.key}
              onClick={() => onFilter({ ...filters, performance: p.key })}
              className="block w-full text-left text-[10px] py-1 px-2"
              style={{
                backgroundColor: filters.performance === p.key ? "rgba(199,91,57,0.1)" : "transparent",
                color: filters.performance === p.key ? "#C75B39" : "rgba(245,240,235,0.5)",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Alerts only toggle */}
        <label className="flex items-center gap-2 text-[10px] cursor-pointer" style={{ color: "#F5F0EB" }}>
          <input
            type="checkbox"
            checked={filters.alertsOnly}
            onChange={() => onFilter({ ...filters, alertsOnly: !filters.alertsOnly })}
            className="accent-[#C75B39]"
          />
          Alertes uniquement
        </label>
      </div>
    </div>
  );
}

// ─── Creator card (grid view) ──────────────────────────────

function CreatorCard({ creator, onSelect }: { creator: CreatorData; onSelect: (c: CreatorData) => void }) {
  const name = creator.display_name || creator.full_name || creator.email;
  const initials = name.slice(0, 2).toUpperCase();
  const changeColor = creator.period_change > 0 ? "#7A9A65" : creator.period_change < 0 ? "#C44536" : "rgba(245,240,235,0.3)";

  return (
    <div
      className="p-3 cursor-pointer transition-all hover:opacity-90 relative"
      style={{ backgroundColor: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.06)" }}
      onClick={() => onSelect(creator)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 flex items-center justify-center text-[9px] font-semibold shrink-0" style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "#C75B39" }}>
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-medium truncate" style={{ color: "#F5F0EB" }}>{name}</p>
            <p className="text-[8px] truncate" style={{ color: "rgba(245,240,235,0.3)" }}>
              {creator.department || "—"}
            </p>
          </div>
        </div>
        <StatusDot color={creator.status_color} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[9px] mb-2">
        <span style={{ color: "rgba(245,240,235,0.4)" }}>
          Revenus jour <strong style={{ color: "#C75B39" }}>{creator.today_revenue}€</strong>
        </span>
        <span style={{ color: "rgba(245,240,235,0.4)" }}>
          Croissance <strong style={{ color: changeColor }}>{creator.period_change > 0 ? "+" : ""}{creator.period_change}%</strong>
        </span>
        <span style={{ color: "rgba(245,240,235,0.4)" }}>
          Revenus mois <strong style={{ color: "#F5F0EB" }}>{creator.period_revenue}€</strong>
        </span>
        <span style={{ color: "rgba(245,240,235,0.4)" }}>
          Drafts <strong style={{ color: creator.pending_drafts > 5 ? "#C75B39" : "rgba(245,240,235,0.5)" }}>{creator.pending_drafts}</strong>
        </span>
        <span style={{ color: "rgba(245,240,235,0.4)" }}>
          Fans actifs <strong style={{ color: "#F5F0EB" }}>{creator.active_fans}</strong>
        </span>
      </div>

      {/* Sparkline */}
      <MiniSparkline data={creator.sparkline} color="#C75B39" />

      {/* Alerts */}
      {creator.alerts.length > 0 && (
        <div className="mt-1.5 space-y-0.5">
          {creator.alerts.slice(0, 1).map((a, i) => (
            <p key={i} className="text-[7px]" style={{ color: a.severity === "critical" ? "#C44536" : "#C75B39" }}>
              • {a.label}: {a.message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Compact row (table view) ──────────────────────────────

function CreatorRow({ creator, onSelect }: { creator: CreatorData; onSelect: (c: CreatorData) => void }) {
  const name = creator.display_name || creator.full_name || creator.email;
  const changeColor = creator.period_change > 0 ? "#7A9A65" : creator.period_change < 0 ? "#C44536" : "rgba(245,240,235,0.3)";

  return (
    <tr
      className="cursor-pointer transition-all hover:opacity-80"
      style={{ borderBottom: "1px solid rgba(245,240,235,0.04)" }}
      onClick={() => onSelect(creator)}
    >
      <td className="py-2.5 px-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center text-[8px] font-medium shrink-0" style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "#C75B39" }}>
            {name.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-[10px] font-medium truncate" style={{ color: "#F5F0EB" }}>{name}</span>
        </div>
      </td>
      <td className="py-2.5 px-2 text-[10px]" style={{ color: "rgba(245,240,235,0.4)" }}>{creator.department || "—"}</td>
      <td className="py-2.5 px-2 text-[10px]" style={{ color: "#F5F0EB" }}>{creator.today_revenue}€</td>
      <td className="py-2.5 px-2 text-[10px]" style={{ color: "#C75B39" }}>{creator.period_revenue}€</td>
      <td className="py-2.5 px-2 text-[10px]" style={{ color: changeColor }}>{creator.period_change > 0 ? "+" : ""}{creator.period_change}%</td>
      <td className="py-2.5 px-2 text-[10px]" style={{ color: "rgba(245,240,235,0.5)" }}>{creator.active_fans}</td>
      <td className="py-2.5 px-2 text-[10px]" style={{ color: creator.pending_drafts > 5 ? "#C75B39" : "rgba(245,240,235,0.5)" }}>{creator.pending_drafts}</td>
      <td className="py-2.5 px-2">
        <div className="flex items-center gap-1.5">
          <StatusDot color={creator.status_color} />
          <span className="text-[9px]" style={{ color: "rgba(245,240,235,0.3)" }}>
            {creator.status === "active" ? "Actif" : creator.status === "paused" ? "Pause" : "Archivé"}
          </span>
        </div>
      </td>
    </tr>
  );
}

// ─── Detailed card ─────────────────────────────────────────

function DetailedCard({ creator, onClose }: { creator: CreatorData; onClose: () => void }) {
  const name = creator.display_name || creator.full_name || creator.email;
  const changeColor = creator.period_change > 0 ? "#7A9A65" : creator.period_change < 0 ? "#C44536" : "rgba(245,240,235,0.3)";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto border"
        style={{ backgroundColor: "#1A1614", borderColor: "rgba(245,240,235,0.06)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid rgba(245,240,235,0.04)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "#C75B39" }}>
              {name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-sm font-medium" style={{ color: "#F5F0EB" }}>{name}</h3>
              <p className="text-[10px]" style={{ color: "rgba(245,240,235,0.3)" }}>
                {creator.department || "—"} · {creator.commission_tier || "N/A"}
              </p>
            </div>
          </div>
          <button onClick={onClose}><X size={14} style={{ color: "rgba(245,240,235,0.3)" }} /></button>
        </div>

        <div className="p-4 space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Revenus jour", value: `${creator.today_revenue}€`, color: "#C75B39" },
              { label: "Revenus mois", value: `${creator.period_revenue}€`, color: "#F5F0EB" },
              { label: "Croissance", value: `${creator.period_change > 0 ? "+" : ""}${creator.period_change}%`, color: changeColor },
              { label: "Commission", value: `${creator.total_commission}€`, color: "#C75B39" },
              { label: "Fans actifs", value: String(creator.active_fans), color: "#7A9A65" },
              { label: "Drafts", value: String(creator.pending_drafts), color: creator.pending_drafts > 5 ? "#C75B39" : "rgba(245,240,235,0.5)" },
            ].map((k, i) => (
              <div key={i} className="p-2 text-center" style={{ backgroundColor: "rgba(245,240,235,0.02)" }}>
                <p className="text-xs font-semibold" style={{ color: k.color }}>{k.value}</p>
                <p className="text-[8px]" style={{ color: "rgba(245,240,235,0.3)" }}>{k.label}</p>
              </div>
            ))}
          </div>

          {/* Sparkline */}
          <div className="p-3" style={{ backgroundColor: "rgba(245,240,235,0.02)" }}>
            <p className="text-[9px] mb-2" style={{ color: "rgba(245,240,235,0.3)" }}>Tendance 30 jours</p>
            <MiniSparkline data={creator.sparkline} color="#C75B39" />
          </div>

          {/* Alertes */}
          {creator.alerts.length > 0 && (
            <div>
              <p className="text-[9px] font-medium mb-1.5" style={{ color: "rgba(245,240,235,0.4)" }}>Alertes ({creator.alerts.length})</p>
              <div className="space-y-1">
                {creator.alerts.map((a, i) => (
                  <div key={i} className="p-2 text-[10px]" style={{
                    backgroundColor: a.severity === "critical" ? "rgba(196,69,54,0.04)" : a.severity === "warning" ? "rgba(199,91,57,0.04)" : "rgba(245,240,235,0.02)",
                    borderLeft: `2px solid ${a.severity === "critical" ? "#C44536" : a.severity === "warning" ? "#C75B39" : "rgba(245,240,235,0.1)"}`,
                  }}>
                    <p className="font-medium" style={{ color: "#F5F0EB" }}>{a.label}</p>
                    <p style={{ color: "rgba(245,240,235,0.4)" }}>{a.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2" style={{ borderTop: "1px solid rgba(245,240,235,0.04)" }}>
            {[
              { icon: FileText, label: "Drafts", href: `/dashboard/sovereign-chat/ppv` },
              { icon: MessageSquare, label: "Message", href: `/dashboard/atlas/inbox?creator=${creator.id}` },
              { icon: BarChart3, label: "Stats", href: `/admin/analytics?creator=${creator.id}` },
              { icon: DollarSign, label: "Revenus", href: `/admin/revenue?creator=${creator.id}` },
            ].map((btn) => (
              <a
                key={btn.label}
                href={btn.href}
                className="flex items-center gap-1 text-[9px] py-1.5 px-2.5 transition-opacity hover:opacity-80"
                style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "#C75B39" }}
              >
                <btn.icon size={10} /> {btn.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Bulk action bar ────────────────────────────────────────

function BulkActionBar({
  selectedCount,
  onClear,
  onAction,
}: {
  selectedCount: number;
  onClear: () => void;
  onAction: (action: string) => void;
}) {
  if (selectedCount === 0) return null;

  return (
    <div
      className="flex items-center gap-3 px-4 py-2"
      style={{ backgroundColor: "rgba(199,91,57,0.08)", border: "1px solid rgba(199,91,57,0.15)" }}
    >
      <span className="text-[10px] font-medium" style={{ color: "#C75B39" }}>{selectedCount} sélectionné(s)</span>
      <div className="flex gap-1.5">
        {[
          { key: "message", label: "Message aux managers", icon: Send },
          { key: "campaign", label: "Campagne transversale", icon: TrendingUp },
          { key: "report", label: "Rapport PDF", icon: Download },
          { key: "tag", label: "Tagger", icon: Tag },
        ].map((btn) => (
          <button
            key={btn.key}
            onClick={() => onAction(btn.key)}
            className="flex items-center gap-1 text-[9px] py-1 px-2 transition-all hover:opacity-80"
            style={{ backgroundColor: "rgba(245,240,235,0.06)", color: "#F5F0EB" }}
          >
            <btn.icon size={10} /> {btn.label}
          </button>
        ))}
      </div>
      <button onClick={onClear} className="text-[9px] ml-auto" style={{ color: "rgba(245,240,235,0.3)" }}>
        <X size={12} />
      </button>
    </div>
  );
}

// ─── KPI Band ──────────────────────────────────────────────

function KpiBand({ totals, creators }: { totals: CommandCenterData["totals"]; creators: CreatorData[] }) {
  const topPerformer = creators.length > 0
    ? [...creators].sort((a, b) => b.period_revenue - a.period_revenue)[0]
    : null;

  return (
    <div className="grid grid-cols-5 gap-2">
      {[
        { label: "Créateurs actifs", value: String(totals.creators_count), icon: Users, color: "#F5F0EB" },
        { label: "Revenus consolidés", value: `${totals.total_revenue}€`, icon: DollarSign, color: "#C75B39" },
        { label: "Commission agence", value: `${totals.total_commission}€`, icon: TrendingUp, color: "#7A9A65" },
        {
          label: "Top performer",
          value: topPerformer ? (topPerformer.display_name || topPerformer.full_name || "—") : "—",
          icon: Star,
          color: "#C75B39",
        },
        { label: "Alertes", value: String(totals.total_alerts), icon: AlertTriangle, color: totals.total_alerts > 0 ? "#C44536" : "#7A9A65" },
      ].map((k, i) => (
        <div key={i} className="p-2.5" style={{ backgroundColor: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)" }}>
          <k.icon size={10} className="mb-1" style={{ color: k.color }} />
          <p className="text-[8px]" style={{ color: "rgba(245,240,235,0.2)" }}>{k.label}</p>
          <p className="text-xs font-semibold mt-0.5 truncate" style={{ color: k.color }}>{k.value}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────────

export default function CommandCenterPage() {
  const [data, setData] = useState<CommandCenterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [period, setPeriod] = useState<Period>("30d");

  // Filters
  const [filters, setFilters] = useState<Filters>({
    departments: [],
    status: "all",
    alertsOnly: false,
    performance: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("revenue_month");
  const [sortAsc, setSortAsc] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailCreator, setDetailCreator] = useState<CreatorData | null>(null);

  // Realtime
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("command-center")
      .on("postgres_changes" as any, { event: "*", schema: "public", table: "atlas_fans" }, () => fetchData())
      .on("postgres_changes" as any, { event: "*", schema: "public", table: "atlas_drafts" }, () => fetchData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [period, filters]);

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (period) params.set("period", period);
      if (filters.status && filters.status !== "all") params.set("status", filters.status);
      if (filters.departments.length === 1) params.set("department", filters.departments[0]);

      const res = await fetch(`/api/admin/command-center?${params.toString()}`);
      if (!res.ok) throw new Error("Erreur chargement");
      const d = await res.json();
      setData(d);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Erreur");
    } finally {
      setLoading(false);
    }
  }, [period, filters]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Filter + sort creators
  const filteredCreators = useMemo(() => {
    if (!data) return [];

    let list = [...data.creators];

    // Text search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (c) =>
          (c.display_name || "").toLowerCase().includes(term) ||
          (c.full_name || "").toLowerCase().includes(term) ||
          (c.department || "").toLowerCase().includes(term),
      );
    }

    // Department filter (multi)
    if (filters.departments.length > 1) {
      list = list.filter((c) => c.department && filters.departments.includes(c.department));
    }

    // Alerts only
    if (filters.alertsOnly) {
      list = list.filter((c) => c.alerts.length > 0);
    }

    // Performance filter
    if (filters.performance) {
      const sorted = [...list].sort((a, b) => b.period_revenue - a.period_revenue);
      const total = sorted.length;
      if (filters.performance === "top10") {
        list = sorted.slice(0, Math.max(1, Math.ceil(total * 0.1)));
      } else if (filters.performance === "top25") {
        list = sorted.slice(0, Math.max(1, Math.ceil(total * 0.25)));
      } else if (filters.performance === "bottom25") {
        list = sorted.slice(Math.floor(total * 0.75));
      }
    }

    // Sort
    list.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "alpha":
          cmp = (a.display_name || a.full_name || "").localeCompare(b.display_name || b.full_name || "");
          break;
        case "revenue_day":
          cmp = a.today_revenue - b.today_revenue;
          break;
        case "revenue_month":
          cmp = a.period_revenue - b.period_revenue;
          break;
        case "growth":
          cmp = a.period_change - b.period_change;
          break;
        case "joined":
          cmp = new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime();
          break;
      }
      return sortAsc ? cmp : -cmp;
    });

    return list;
  }, [data, searchTerm, filters, sortKey, sortAsc]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ArrowUpDown size={10} style={{ color: "rgba(245,240,235,0.15)" }} />;
    return sortAsc ? <ArrowUp size={10} style={{ color: "#C75B39" }} /> : <ArrowDown size={10} style={{ color: "#C75B39" }} />;
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-4">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}>
            Command Center
          </h1>
          <p className="text-xs mt-1" style={{ color: "rgba(245,240,235,0.4)" }}>
            Gestion centralisée des créateurs
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Period */}
          <div className="flex bg-transparent text-[10px]" style={{ border: "1px solid rgba(245,240,235,0.06)" }}>
            {(["today", "7d", "30d", "90d"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className="py-1.5 px-2.5 font-medium"
                style={{
                  backgroundColor: period === p ? "rgba(199,91,57,0.1)" : "transparent",
                  color: period === p ? "#C75B39" : "rgba(245,240,235,0.3)",
                }}
              >
                {p === "today" ? "Aujourd'hui" : p}
              </button>
            ))}
          </div>

          {/* View mode toggle */}
          <div className="flex bg-transparent text-[10px]" style={{ border: "1px solid rgba(245,240,235,0.06)" }}>
            {([
              { key: "grid" as ViewMode, icon: LayoutGrid },
              { key: "compact" as ViewMode, icon: Table2 },
              { key: "detail" as ViewMode, icon: Maximize2 },
            ]).map((v) => (
              <button
                key={v.key}
                onClick={() => setViewMode(v.key)}
                className="p-1.5"
                style={{
                  backgroundColor: viewMode === v.key ? "rgba(199,91,57,0.1)" : "transparent",
                  color: viewMode === v.key ? "#C75B39" : "rgba(245,240,235,0.3)",
                }}
              >
                <v.icon size={14} />
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-1.5 transition-opacity hover:opacity-70 disabled:opacity-30"
            style={{ color: "rgba(245,240,235,0.3)" }}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* ── KPI Band ── */}
      {data && !loading && <KpiBand totals={data.totals} creators={data.creators} />}

      {/* ── Search + Filters bar ── */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2" style={{ color: "rgba(245,240,235,0.2)" }} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un créateur..."
            className="w-full pl-7 pr-2 py-1.5 text-[10px] bg-transparent"
            style={{ color: "#F5F0EB", border: "1px solid rgba(245,240,235,0.06)" }}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1 text-[10px] py-1.5 px-2.5"
          style={{ backgroundColor: "rgba(199,91,57,0.08)", color: "#C75B39" }}
        >
          <Filter size={10} /> Filtres
        </button>

        {selectedIds.size > 0 && (
          <BulkActionBar
            selectedCount={selectedIds.size}
            onClear={() => setSelectedIds(new Set())}
            onAction={(action) => {
              // Future: implement bulk actions
              setSelectedIds(new Set());
            }}
          />
        )}
      </div>

      {/* ── Content ── */}
      {error && (
        <div className="p-4 text-xs" style={{ backgroundColor: "rgba(196,69,54,0.04)", color: "#C44536", border: "1px solid rgba(196,69,54,0.1)" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-16 animate-pulse" style={{ backgroundColor: "rgba(245,240,235,0.03)" }} />
          ))}
        </div>
      ) : !data || filteredCreators.length === 0 ? (
        <div className="flex flex-col items-center py-16">
          <Users size={32} style={{ color: "rgba(245,240,235,0.06)" }} />
          <p className="text-sm mt-3" style={{ color: "rgba(245,240,235,0.15)" }}>
            {data && data.creators.length === 0
              ? "Aucun créateur trouvé pour ces filtres"
              : "Aucun créateur ne correspond à ces filtres"}
          </p>
          <p className="text-xs mt-1" style={{ color: "rgba(245,240,235,0.1)" }}>
            Essaie de modifier les filtres ou la recherche
          </p>
          {data && data.creators.length > 0 && (
            <button
              onClick={() => {
                setFilters({ departments: [], status: "all", alertsOnly: false, performance: "" });
                setSearchTerm("");
              }}
              className="mt-3 text-[10px] py-1.5 px-3"
              style={{ backgroundColor: "#C75B39", color: "#F5F0EB" }}
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      ) : viewMode === "compact" ? (
        /* ── Compact / Table view ── */
        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
            <thead>
              <tr>
                <th className="w-8 px-2 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filteredCreators.length}
                    onChange={() => {
                      if (selectedIds.size === filteredCreators.length) setSelectedIds(new Set());
                      else setSelectedIds(new Set(filteredCreators.map((c) => c.id)));
                    }}
                    className="accent-[#C75B39]"
                  />
                </th>
                {[
                  { key: "alpha", label: "Créateur" },
                  { key: null, label: "Dept" },
                  { key: "revenue_day", label: "Rev/J" },
                  { key: "revenue_month", label: "Rev/M" },
                  { key: "growth", label: "Croissance" },
                  { key: null, label: "Fans" },
                  { key: null, label: "Drafts" },
                  { key: null, label: "Statut" },
                ].map((col, i) => (
                  <th
                    key={i}
                    className={`text-left font-medium py-2 px-2 text-[9px] uppercase tracking-wider ${col.key ? "cursor-pointer" : ""}`}
                    style={{ color: "rgba(245,240,235,0.2)", borderBottom: "1px solid rgba(245,240,235,0.06)" }}
                    onClick={() => col.key && handleSort(col.key as SortKey)}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {col.key && sortIcon(col.key as SortKey)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCreators.map((c) => (
                <tr key={c.id} className="cursor-pointer transition-all hover:opacity-80" style={{ borderBottom: "1px solid rgba(245,240,235,0.04)" }}>
                  <td className="px-2 py-2.5">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(c.id)}
                      onChange={() => toggleSelect(c.id)}
                      className="accent-[#C75B39]"
                    />
                  </td>
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 flex items-center justify-center text-[8px] font-medium shrink-0" style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "#C75B39" }}>
                        {(c.display_name || c.full_name || c.email).slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[10px] font-medium truncate" style={{ color: "#F5F0EB" }}>
                        {c.display_name || c.full_name || c.email}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-[10px]" style={{ color: "rgba(245,240,235,0.4)" }}>{c.department || "—"}</td>
                  <td className="py-2.5 px-2 text-[10px]" style={{ color: "#F5F0EB" }}>{c.today_revenue}€</td>
                  <td className="py-2.5 px-2 text-[10px]" style={{ color: "#C75B39" }}>{c.period_revenue}€</td>
                  <td className="py-2.5 px-2 text-[10px]" style={{ color: c.period_change > 0 ? "#7A9A65" : "#C44536" }}>
                    {c.period_change > 0 ? "+" : ""}{c.period_change}%
                  </td>
                  <td className="py-2.5 px-2 text-[10px]" style={{ color: "rgba(245,240,235,0.5)" }}>{c.active_fans}</td>
                  <td className="py-2.5 px-2 text-[10px]" style={{ color: c.pending_drafts > 5 ? "#C75B39" : "rgba(245,240,235,0.5)" }}>
                    {c.pending_drafts}
                  </td>
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-1.5">
                      <StatusDot color={c.status_color} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : viewMode === "detail" ? (
        /* ── Detail view ── */
        <div className="space-y-2">
          {filteredCreators.map((c) => {
            const name = c.display_name || c.full_name || c.email;
            return (
              <div
                key={c.id}
                className="p-4 cursor-pointer transition-all hover:opacity-90"
                style={{ backgroundColor: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.06)" }}
                onClick={() => setDetailCreator(c)}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 flex items-center justify-center text-[10px] font-semibold shrink-0" style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "#C75B39" }}>
                        {name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: "#F5F0EB" }}>{name}</p>
                        <p className="text-[10px]" style={{ color: "rgba(245,240,235,0.3)" }}>
                          {c.department || "—"} · {c.commission_tier || "N/A"}
                        </p>
                      </div>
                      <StatusDot color={c.status_color} />
                    </div>

                    <div className="grid grid-cols-4 gap-3 mb-2">
                      <div>
                        <p className="text-[8px]" style={{ color: "rgba(245,240,235,0.2)" }}>Revenus mois</p>
                        <p className="text-xs font-semibold" style={{ color: "#C75B39" }}>{c.period_revenue}€</p>
                      </div>
                      <div>
                        <p className="text-[8px]" style={{ color: "rgba(245,240,235,0.2)" }}>Croissance</p>
                        <p className="text-xs font-semibold" style={{ color: c.period_change > 0 ? "#7A9A65" : "#C44536" }}>
                          {c.period_change > 0 ? "+" : ""}{c.period_change}%
                        </p>
                      </div>
                      <div>
                        <p className="text-[8px]" style={{ color: "rgba(245,240,235,0.2)" }}>Fans actifs</p>
                        <p className="text-xs font-semibold" style={{ color: "#F5F0EB" }}>{c.active_fans}</p>
                      </div>
                      <div>
                        <p className="text-[8px]" style={{ color: "rgba(245,240,235,0.2)" }}>Drafts</p>
                        <p className="text-xs font-semibold" style={{ color: c.pending_drafts > 5 ? "#C75B39" : "rgba(245,240,235,0.5)" }}>
                          {c.pending_drafts}
                        </p>
                      </div>
                    </div>

                    {/* Alerts */}
                    {c.alerts.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {c.alerts.slice(0, 3).map((a, i) => (
                          <span
                            key={i}
                            className="text-[8px] px-1 py-px"
                            style={{
                              backgroundColor: a.severity === "critical" ? "rgba(196,69,54,0.08)" : "rgba(199,91,57,0.06)",
                              color: a.severity === "critical" ? "#C44536" : "#C75B39",
                            }}
                          >
                            {a.label}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Sparkline */}
                    <div className="mt-2 max-w-[240px]">
                      <MiniSparkline data={c.sparkline} color="#C75B39" />
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="flex flex-col gap-1 shrink-0">
                    <button className="text-[9px] py-1 px-2" style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "#C75B39" }}>
                      <FileText size={10} className="inline mr-1" /> Drafts
                    </button>
                    <button className="text-[9px] py-1 px-2" style={{ backgroundColor: "rgba(245,240,235,0.04)", color: "rgba(245,240,235,0.5)" }}>
                      <BarChart3 size={10} className="inline mr-1" /> Stats
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Grid view (default) ── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {filteredCreators.map((c) => (
            <CreatorCard key={c.id} creator={c} onSelect={setDetailCreator} />
          ))}
        </div>
      )}

      {/* ── Count footer ── */}
      {data && !loading && (
        <p className="text-[9px] text-center" style={{ color: "rgba(245,240,235,0.15)" }}>
          {filteredCreators.length} / {data.creators.length} créateurs affichés
          {selectedIds.size > 0 && ` · ${selectedIds.size} sélectionné(s)`}
        </p>
      )}

      {/* ── Detail modal ── */}
      {detailCreator && <DetailedCard creator={detailCreator} onClose={() => setDetailCreator(null)} />}

      {/* ── Filter sidebar ── */}
      {showFilters && (
        <FilterSidebar
          creators={data?.creators || []}
          filters={filters}
          onFilter={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  );
}
