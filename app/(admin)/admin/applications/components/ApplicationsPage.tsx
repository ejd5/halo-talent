"use client";

import { useState, useMemo } from "react";
import type { Application, ApplicationStatus } from "../types";
import { applications as allApps } from "../data";
import { ApplicationFilters } from "./ApplicationFilters";
import { ApplicationsTable } from "./ApplicationsTable";
import { ApplicationDetailPanel } from "./ApplicationDetailPanel";

export type FilterState = {
  search: string;
  departments: string[];
  status: ApplicationStatus | "all";
  platforms: string[];
  revenueMin: string;
  revenueMax: string;
  scoreMin: number;
};

const defaultFilters: FilterState = {
  search: "",
  departments: [],
  status: "all",
  platforms: [],
  revenueMin: "",
  revenueMax: "",
  scoreMin: 0,
};

export function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [apps, setApps] = useState<Application[]>(allApps);

  const statusTabs = [
    { key: "all", label: "Toutes", count: apps.length },
    { key: "pending", label: "En attente", count: apps.filter((a) => a.status === "pending").length },
    { key: "review", label: "En review", count: apps.filter((a) => a.status === "review").length },
    { key: "approved", label: "Approuvées", count: apps.filter((a) => a.status === "approved").length },
    { key: "rejected", label: "Refusées", count: apps.filter((a) => a.status === "rejected").length },
  ];

  const filtered = useMemo(() => {
    let result = [...apps];

    // Tab filter
    if (activeTab !== "all") {
      result = result.filter((a) => a.status === activeTab);
    }

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (a) =>
          a.full_name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.department.toLowerCase().includes(q)
      );
    }

    // Department filter
    if (filters.departments.length > 0) {
      result = result.filter((a) => filters.departments.includes(a.department));
    }

    // Platform filter
    if (filters.platforms.length > 0) {
      result = result.filter((a) =>
        a.platforms.some((p) => filters.platforms.includes(p))
      );
    }

    // Score filter
    if (filters.scoreMin > 0) {
      result = result.filter((a) => a.ai_score >= filters.scoreMin);
    }

    return result;
  }, [apps, activeTab, filters]);

  const handleStatusUpdate = (id: string, newStatus: ApplicationStatus) => {
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    setSelectedApp((prev) =>
      prev?.id === id ? { ...prev, status: newStatus } : prev
    );
  };

  return (
    <div className="max-w-[1600px] card-accent" style={{ background: "#0A0908" }}>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.12em]" style={{ color: "#F5F0EB" }}>
            Acquisition
          </p>
          <h1 className="font-display text-[32px] font-bold mt-1" style={{ color: "#F5F0EB" }}>
            Candidatures
          </h1>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filters sidebar */}
        {showFilters && (
          <div className="w-56 shrink-0">
            <ApplicationFilters
              filters={filters}
              onChange={setFilters}
              onClose={() => setShowFilters(false)}
            />
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Tabs */}
          <div className="flex gap-1 mb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="relative px-4 py-3 text-xs font-sans font-medium uppercase tracking-[0.08em] transition-colors"
                style={{
                  color: activeTab === tab.key ? "#C75B39" : "#F5F0EB",
                  borderBottom: activeTab === tab.key ? "2px solid #C75B39" : "2px solid transparent",
                  marginBottom: -1,
                }}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className="ml-2 text-[10px] px-1.5 py-0.5"
                    style={{
                      background: activeTab === tab.key ? "rgba(199,91,57,0.15)" : "rgba(255,255,255,0.06)",
                      color: activeTab === tab.key ? "#C75B39" : "#E0D8D0",
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
            {!showFilters && (
              <button
                onClick={() => setShowFilters(true)}
                className="ml-auto px-3 py-3 text-[11px] font-sans uppercase tracking-[0.1em] transition-colors hover:bg-white/5"
                style={{ color: "#F5F0EB" }}
              >
                Filtres
              </button>
            )}
          </div>

          {/* Table */}
          <ApplicationsTable
            applications={filtered}
            onSelect={setSelectedApp}
            selectedId={selectedApp?.id ?? null}
            onToggleFilters={() => setShowFilters((s) => !s)}
          />
        </div>
      </div>

      {/* Detail panel */}
      {selectedApp && (
        <ApplicationDetailPanel
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}
