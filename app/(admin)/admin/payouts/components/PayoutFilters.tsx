"use client";

import { Search } from "lucide-react";

type Props = {
  statusFilter: string;
  onStatusChange: (status: string) => void;
  methodFilter: string;
  onMethodChange: (method: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
  counts: Record<string, number>;
};

const STATUS_TABS = [
  { id: "all", label: "Toutes" },
  { id: "pending", label: "À effectuer" },
  { id: "validated", label: "Validées" },
  { id: "completed", label: "Effectuées" },
  { id: "error", label: "Erreur" },
];

export function PayoutFilters({
  statusFilter, onStatusChange, methodFilter, onMethodChange,
  search, onSearchChange, counts,
}: Props) {
  return (
    <div className="space-y-3 mb-4">
      {/* Status tabs */}
      <div className="flex items-center gap-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {STATUS_TABS.map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onStatusChange(tab.id)}
              className="flex items-center gap-1.5 pb-3 px-1 text-[10px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors relative"
              style={{
                color: isActive ? "#C75B39" : "#7A736B",
                borderBottom: isActive ? "2px solid #C75B39" : "2px solid transparent",
                marginBottom: "-1px",
              }}
            >
              {tab.label}
              <span className="text-[9px] font-sans ml-0.5" style={{ color: isActive ? "#C75B39" : "#5A544C" }}>
                ({counts[tab.id] ?? 0})
              </span>
            </button>
          );
        })}
      </div>

      {/* Search + method filter */}
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 px-3" style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.06)" }}>
          <Search size={14} strokeWidth={1.5} style={{ color: "#5A544C" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher un créateur..."
            className="flex-1 bg-transparent text-xs font-sans py-2.5 outline-none"
            style={{ color: "#F5F0EB" }}
          />
        </div>
        <select
          value={methodFilter}
          onChange={(e) => onMethodChange(e.target.value)}
          className="text-[10px] font-sans px-3 py-2.5 bg-transparent outline-none"
          style={{ color: "#7A736B", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <option value="all" style={{ background: "#1A1614" }}>Toutes méthodes</option>
          <option value="stripe" style={{ background: "#1A1614" }}>Stripe</option>
          <option value="wire" style={{ background: "#1A1614" }}>Virement</option>
          <option value="other" style={{ background: "#1A1614" }}>Autre</option>
        </select>
      </div>
    </div>
  );
}
