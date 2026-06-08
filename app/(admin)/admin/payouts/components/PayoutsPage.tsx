"use client";

import { useState, useMemo } from "react";
import { payouts as allPayouts } from "../data";
import { PayoutFilters } from "./PayoutFilters";
import { PayoutTable } from "./PayoutTable";
import { PayoutDetailPanel } from "./PayoutDetailPanel";
import type { Payout } from "../types";

export function PayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>(allPayouts);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);

  const filtered = useMemo(() => {
    return payouts.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (methodFilter !== "all" && p.method !== methodFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!p.creator_name.toLowerCase().includes(q) && !p.department.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [payouts, statusFilter, methodFilter, search]);

  const totalPending = payouts
    .filter((p) => p.status === "pending" || p.status === "validated")
    .reduce((s, p) => s + p.amount, 0);

  const handleUpdatePayout = (payoutId: string, updates: Partial<Payout>) => {
    setPayouts((prev) =>
      prev.map((p) => (p.id === payoutId ? { ...p, ...updates } : p))
    );
    setSelectedPayout((prev) =>
      prev && prev.id === payoutId ? { ...prev, ...updates } : prev
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: "#F5F0EB" }}>
            Payouts
          </h1>
          <p className="text-xs font-sans mt-1" style={{ color: "#7A736B" }}>
            Paiements aux créateurs
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-sans uppercase tracking-[0.08em]" style={{ color: "#7A736B" }}>
            Total en attente
          </p>
          <p className="font-display text-xl font-bold tabular-nums" style={{ color: "#C75B39" }}>
            {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", notation: "compact" }).format(totalPending)}
          </p>
        </div>
      </div>

      <PayoutFilters
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        methodFilter={methodFilter}
        onMethodChange={setMethodFilter}
        search={search}
        onSearchChange={setSearch}
        counts={{
          all: payouts.length,
          pending: payouts.filter((p) => p.status === "pending").length,
          validated: payouts.filter((p) => p.status === "validated").length,
          completed: payouts.filter((p) => p.status === "completed").length,
          error: payouts.filter((p) => p.status === "error").length,
        }}
      />

      <PayoutTable
        payouts={filtered}
        onSelect={setSelectedPayout}
        onUpdate={handleUpdatePayout}
      />

      {selectedPayout && (
        <PayoutDetailPanel
          payout={selectedPayout}
          onClose={() => setSelectedPayout(null)}
          onUpdate={handleUpdatePayout}
        />
      )}
    </div>
  );
}
