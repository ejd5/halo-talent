"use client";

import type { FilterState } from "./ApplicationsPage";
import { departments, platformOptions } from "../data";
import { X } from "lucide-react";

type Props = {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onClose: () => void;
};

export function ApplicationFilters({ filters, onChange, onClose }: Props) {
  const toggleDept = (d: string) => {
    const next = filters.departments.includes(d)
      ? filters.departments.filter((x) => x !== d)
      : [...filters.departments, d];
    onChange({ ...filters, departments: next });
  };

  const togglePlatform = (p: string) => {
    const next = filters.platforms.includes(p)
      ? filters.platforms.filter((x) => x !== p)
      : [...filters.platforms, p];
    onChange({ ...filters, platforms: next });
  };

  return (
    <div className="card-accent" style={{ background: "var(--bg-primary)" }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--text-primary)" }}>
          Filtres
        </p>
        <button onClick={onClose} className="p-1 transition-colors hover:bg-white/5" style={{ color: "var(--text-secondary)" }}>
          <X size={14} strokeWidth={1.5} />
        </button>
      </div>

      <div className="space-y-5">
        {/* Statut */}
        <div>
          <p className="text-[11px] font-sans font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Statut</p>
          <div className="space-y-1">
            {(["all", "pending", "review", "approved", "rejected"] as const).map((s) => (
              <label key={s} className="flex items-center gap-2 py-1 cursor-pointer group">
                <input
                  type="radio"
                  name="status"
                  checked={filters.status === s}
                  onChange={() => onChange({ ...filters, status: s })}
                  className="accent-[var(--accent)]"
                />
                <span className="text-xs font-sans group-hover:opacity-80 transition-opacity" style={{ color: "#D0CCC6" }}>
                  {s === "all" ? "Tous" : s === "pending" ? "En attente" : s === "review" ? "En review" : s === "approved" ? "Approuvées" : "Refusées"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Département */}
        <div>
          <p className="text-[11px] font-sans font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Département</p>
          <div className="space-y-1 max-h-[180px] overflow-y-auto">
            {departments.map((d) => (
              <label key={d} className="flex items-center gap-2 py-1 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.departments.includes(d)}
                  onChange={() => toggleDept(d)}
                  className="accent-[var(--accent)]"
                />
                <span className="text-xs font-sans group-hover:opacity-80 transition-opacity truncate" style={{ color: "#D0CCC6" }}>
                  {d}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Plateformes */}
        <div>
          <p className="text-[11px] font-sans font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Plateformes</p>
          <div className="space-y-1">
            {platformOptions.map((p) => (
              <label key={p} className="flex items-center gap-2 py-1 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.platforms.includes(p)}
                  onChange={() => togglePlatform(p)}
                  className="accent-[var(--accent)]"
                />
                <span className="text-xs font-sans group-hover:opacity-80 transition-opacity" style={{ color: "#D0CCC6" }}>
                  {p}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Score min */}
        <div>
          <p className="text-[11px] font-sans font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
            Score IA min : {filters.scoreMin}
          </p>
          <input
            type="range"
            min={0}
            max={100}
            value={filters.scoreMin}
            onChange={(e) => onChange({ ...filters, scoreMin: Number(e.target.value) })}
            className="w-full accent-[var(--accent)]"
          />
        </div>

        {/* Reset */}
        <button
          onClick={() =>
            onChange({
              search: "",
              departments: [],
              status: "all",
              platforms: [],
              revenueMin: "",
              revenueMax: "",
              scoreMin: 0,
            })
          }
          className="w-full py-2 text-[11px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-white/5"
          style={{ color: "var(--text-primary)", border: "1px solid var(--border-default)" }}
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
}
