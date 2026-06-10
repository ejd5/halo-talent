"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shuffle, Loader, Plus, TrendingUp, Users, DollarSign,
  ToggleLeft, ToggleRight, Copy, Trash2, Eye, Play,
  Pause, Workflow, MousePointerClick, MessageSquare,
} from "lucide-react";
import { FUNNEL_PRESETS } from "@/lib/atlas/funnels/types";
import type { Funnel } from "@/lib/atlas/funnels/types";

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  active:    { label: "Actif",     color: "var(--success)", bg: "rgba(16,185,129,0.1)" },
  paused:    { label: "En pause",  color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  draft:     { label: "Brouillon", color: "rgba(255,255,255,0.4)", bg: "rgba(255,255,255,0.05)" },
  completed: { label: "Terminé",   color: "#5B8FA8", bg: "rgba(91,143,168,0.1)" },
};

export default function FunnelsPage() {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showPresets, setShowPresets] = useState(false);

  useEffect(() => { fetchFunnels(); }, []);

  async function fetchFunnels() {
    try {
      const res = await fetch("/api/dashboard/atlas/funnels");
      const d = await res.json();
      setFunnels(d.funnels ?? []);
    } catch {} finally { setLoading(false); }
  }

  async function toggleStatus(funnel: Funnel) {
    const newStatus = funnel.status === "active" ? "paused" : "active";
    setToggling(funnel.id);
    try {
      await fetch(`/api/dashboard/atlas/funnels/${funnel.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setFunnels((prev) => prev.map((f) => f.id === funnel.id ? { ...f, status: newStatus as Funnel["status"] } : f));
    } catch {} finally { setToggling(null); }
  }

  async function deleteFunnel(id: string) {
    if (!confirm("Supprimer ce funnel ?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/dashboard/atlas/funnels/${id}`, { method: "DELETE" });
      setFunnels((prev) => prev.filter((f) => f.id !== id));
    } catch {} finally { setDeleting(null); }
  }

  async function createFromPreset(preset: typeof FUNNEL_PRESETS[number]) {
    try {
      const res = await fetch("/api/dashboard/atlas/funnels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: preset.name, description: preset.description, steps: preset.steps }),
      });
      const d = await res.json();
      if (d.funnel) {
        setFunnels((prev) => [d.funnel, ...prev]);
        setShowPresets(false);
      }
    } catch {}
  }

  async function duplicateFunnel(funnel: Funnel) {
    try {
      const res = await fetch(`/api/dashboard/atlas/funnels/${funnel.id}`);
      const d = await res.json();
      if (!d.funnel) return;
      const createRes = await fetch("/api/dashboard/atlas/funnels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${funnel.name} (copie)`,
          steps: d.funnel.steps,
        }),
      });
      const created = await createRes.json();
      if (created.funnel) setFunnels((prev) => [created.funnel, ...prev]);
    } catch {}
  }

  const totalEntries = funnels.reduce((s, f) => s + (f.entry_count || 0), 0);
  const totalRevenue = funnels.reduce((s, f) => s + (f.revenue_generated || 0), 0);
  const activeCount = funnels.filter((f) => f.status === "active").length;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Funnels de conversion
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-ink-secondary)" }}>
            {funnels.length} funnel{funnels.length > 1 ? "s" : ""} · {activeCount} actif{activeCount > 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-sm transition-opacity hover:opacity-80"
          style={{ background: "var(--accent)", color: "var(--text-primary)" }}
        >
          <Plus size={14} /> Nouveau funnel
        </button>
      </div>

      {/* ─── KPI bar ─── */}
      {funnels.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Workflow, label: "Funnels actifs", value: activeCount },
            { icon: Users, label: "Fans dans les funnels", value: totalEntries },
            { icon: DollarSign, label: "Revenus générés", value: `${totalRevenue.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}` },
          ].map((kpi) => (
            <div key={kpi.label} className="p-3" style={{ backgroundColor: "var(--bg-card)", border: "1px solid rgba(245,240,235,0.06)" }}>
              <div className="flex items-center gap-2 mb-1">
                <kpi.icon size={12} style={{ color: "var(--color-ink-tertiary)" }} />
                <span className="text-[0.6rem] uppercase tracking-[0.1em]" style={{ color: "var(--color-ink-tertiary)" }}>{kpi.label}</span>
              </div>
              <p className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                {kpi.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ─── Loading ─── */}
      {loading && (
        <div className="flex justify-center py-20">
          <Loader size={16} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} />
        </div>
      )}

      {/* ─── Empty state ─── */}
      {!loading && funnels.length === 0 && !showPresets && (
        <div className="flex flex-col items-center py-20 text-center">
          <Workflow size={36} style={{ color: "rgba(255,255,255,0.05)" }} />
          <p className="text-sm mt-4" style={{ color: "rgba(255,255,255,0.2)" }}>Aucun funnel de conversion</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.1)" }}>
            Automatise tes séquences email/SMS — welcome series, win-back, relance
          </p>
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setShowPresets(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-sm transition-opacity hover:opacity-80"
              style={{ background: "var(--accent)", color: "var(--text-primary)" }}
            >
              <Plus size={14} /> Créer un funnel
            </button>
            <Link
              href="/dashboard/atlas/rules"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-sm transition-opacity hover:bg-white/5"
              style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
            >
              <Shuffle size={14} /> Voir les règles
            </Link>
          </div>
        </div>
      )}

      {/* ─── Presets panel ─── */}
      {showPresets && (
        <div className="p-4 border" style={{ borderColor: "rgba(245,240,235,0.06)", backgroundColor: "var(--bg-card)" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-ink-tertiary)" }}>
              Démarrer avec un template
            </h3>
            <button onClick={() => setShowPresets(false)} className="text-[10px]" style={{ color: "var(--color-ink-tertiary)" }}>
              Annuler
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {FUNNEL_PRESETS.map((preset, i) => (
              <button
                key={i}
                onClick={() => createFromPreset(preset)}
                className="p-3 text-left rounded-sm transition-all hover:bg-white/5"
                style={{ border: "1px solid rgba(245,240,235,0.06)" }}
              >
                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{preset.name}</span>
                <p className="text-[10px] mt-1" style={{ color: "var(--color-ink-tertiary)" }}>{preset.description}</p>
                <span className="inline-block mt-2 text-[9px] px-1.5 py-0.5 rounded-sm" style={{ background: "rgba(199,91,57,0.1)", color: "var(--accent)" }}>
                  {preset.steps.nodes.length} étapes
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Funnel list ─── */}
      {!loading && funnels.length > 0 && (
        <div className="space-y-2">
          {funnels.map((funnel) => {
            const st = STATUS_STYLES[funnel.status] || STATUS_STYLES.draft;
            const isToggling = toggling === funnel.id;
            return (
              <div
                key={funnel.id}
                className="flex items-center gap-3 p-4 border transition-colors"
                style={{ borderColor: "rgba(245,240,235,0.06)", backgroundColor: "var(--bg-card)" }}
              >
                {/* Status indicator */}
                <div className="w-1 h-10 shrink-0 rounded-sm" style={{ backgroundColor: st.color }} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/dashboard/atlas/funnels/${funnel.id}`} className="hover:opacity-70 transition-opacity">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{funnel.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-sm font-medium" style={{ background: st.bg, color: st.color }}>
                        {st.label}
                      </span>
                    </div>
                  </Link>
                  {funnel.description && (
                    <p className="text-[10px] mt-0.5 truncate" style={{ color: "var(--color-ink-tertiary)" }}>{funnel.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1.5 text-[9px]" style={{ color: "var(--color-ink-tertiary)" }}>
                    <span className="flex items-center gap-1"><Users size={9} /> {funnel.entry_count || 0} entrés</span>
                    <span className="flex items-center gap-1"><TrendingUp size={9} /> {funnel.conversion_rate || 0}% conversion</span>
                    <span className="flex items-center gap-1"><DollarSign size={9} /> {(funnel.revenue_generated || 0).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {funnel.status !== "completed" && (
                    <button
                      onClick={() => toggleStatus(funnel)}
                      disabled={isToggling}
                      className="p-1.5 rounded-sm transition-colors hover:bg-white/5 disabled:opacity-30"
                      title={funnel.status === "active" ? "Mettre en pause" : "Activer"}
                    >
                      {isToggling ? <Loader size={13} className="animate-spin" /> : (
                        funnel.status === "active"
                          ? <Pause size={13} style={{ color: "#F59E0B" }} />
                          : <Play size={13} style={{ color: "var(--success)" }} />
                      )}
                    </button>
                  )}
                  <Link
                    href={`/dashboard/atlas/funnels/${funnel.id}`}
                    className="p-1.5 rounded-sm transition-colors hover:bg-white/5"
                    title="Éditer"
                  >
                    <Eye size={13} style={{ color: "var(--color-ink-tertiary)" }} />
                  </Link>
                  <button
                    onClick={() => duplicateFunnel(funnel)}
                    className="p-1.5 rounded-sm transition-colors hover:bg-white/5"
                    title="Dupliquer"
                  >
                    <Copy size={13} style={{ color: "var(--color-ink-tertiary)" }} />
                  </button>
                  <button
                    onClick={() => deleteFunnel(funnel.id!)}
                    disabled={deleting === funnel.id}
                    className="p-1.5 rounded-sm transition-colors hover:bg-white/5 disabled:opacity-30"
                    title="Supprimer"
                  >
                    {deleting === funnel.id
                      ? <Loader size={13} className="animate-spin" />
                      : <Trash2 size={13} style={{ color: "var(--danger)" }} />
                    }
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
