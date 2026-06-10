"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users, Plus, Smartphone, RefreshCw, MoreHorizontal,
  Copy, Trash2, Send, Download, ChevronRight,
} from "lucide-react";

interface Segment {
  id: string;
  name: string;
  description: string | null;
  type: "smart" | "static";
  rules: any[];
  member_count: number;
  on_entry_funnel_id: string | null;
  on_exit_funnel_id: string | null;
  last_calculated_at: string | null;
  created_at: string;
}

export default function SegmentsListPage() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [recalculating, setRecalculating] = useState<string | null>(null);

  useEffect(() => {
    loadSegments();
  }, []);

  const loadSegments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sovereign-chat/segments");
      const data = await res.json();
      setSegments(data.segments || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculate = async (id: string) => {
    setRecalculating(id);
    try {
      await fetch("/api/sovereign-chat/segments/recalculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ segment_id: id }),
      });
      await loadSegments();
    } catch {
    } finally {
      setRecalculating(null);
    }
  };

  const handleDuplicate = async (segment: Segment) => {
    try {
      await fetch("/api/sovereign-chat/segments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${segment.name} (copie)`,
          description: segment.description,
          type: segment.type,
          rules: segment.rules,
        }),
      });
      await loadSegments();
    } catch {}
    setMenuOpen(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce segment ?")) return;
    try {
      await fetch(`/api/sovereign-chat/segments?id=${id}`, { method: "DELETE" });
      await loadSegments();
    } catch {}
    setMenuOpen(null);
  };

  const exportCSV = async (segment: Segment) => {
    try {
      const res = await fetch(`/api/sovereign-chat/segments/members?segment_id=${segment.id}`);
      const data = await res.json();
      const fans = data.members || [];
      const csv = [
        "email,display_name,total_spent,fan_tier,fan_score,language,country,last_interaction_at",
        ...fans.map((f: any) =>
          [
            f.email || "",
            f.display_name || "",
            f.total_spent || 0,
            f.fan_tier || "",
            f.fan_score || 0,
            f.language || "",
            f.country || "",
            f.last_interaction_at || "",
          ].join(","),
        ),
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${segment.name.replace(/\s+/g, "_")}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
    setMenuOpen(null);
  };

  const smartCount = segments.filter((s) => s.type === "smart").length;
  const staticCount = segments.filter((s) => s.type === "static").length;
  const totalMembers = segments.reduce((sum, s) => sum + s.member_count, 0);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-xl font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Smart Segments
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "rgba(245,240,235,0.4)" }}>
            Groupes de fans dynamiques qui se mettent à jour automatiquement
          </p>
        </div>
        <Link
          href="/dashboard/sovereign-chat/segments/new"
          className="text-[10px] font-semibold py-2.5 px-4 transition-all hover:opacity-80 flex items-center gap-1.5"
          style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
        >
          <Plus size={12} />
          Nouveau segment
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        <div className="p-3" style={{ backgroundColor: "rgba(245,240,235,0.03)", border: "1px solid rgba(245,240,235,0.06)" }}>
          <p className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(245,240,235,0.2)" }}>Total segments</p>
          <p className="text-lg font-semibold mt-1" style={{ color: "var(--text-primary)" }}>{segments.length}</p>
        </div>
        <div className="p-3" style={{ backgroundColor: "rgba(122,154,101,0.06)", border: "1px solid rgba(122,154,101,0.1)" }}>
          <p className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(122,154,101,0.5)" }}>Smart</p>
          <p className="text-lg font-semibold mt-1" style={{ color: "var(--success)" }}>{smartCount}</p>
        </div>
        <div className="p-3" style={{ backgroundColor: "rgba(199,91,57,0.06)", border: "1px solid rgba(199,91,57,0.1)" }}>
          <p className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(199,91,57,0.5)" }}>Static</p>
          <p className="text-lg font-semibold mt-1" style={{ color: "var(--accent)" }}>{staticCount}</p>
        </div>
        <div className="p-3" style={{ backgroundColor: "rgba(245,240,235,0.03)", border: "1px solid rgba(245,240,235,0.06)" }}>
          <p className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(245,240,235,0.2)" }}>Total fans</p>
          <p className="text-lg font-semibold mt-1" style={{ color: "var(--text-primary)" }}>{totalMembers}</p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse" style={{ backgroundColor: "rgba(245,240,235,0.03)" }} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && segments.length === 0 && (
        <div className="p-8 text-center" style={{ backgroundColor: "rgba(245,240,235,0.03)", border: "1px solid rgba(245,240,235,0.06)" }}>
          <Users size={24} className="mx-auto mb-2" style={{ color: "rgba(245,240,235,0.15)" }} />
          <p className="text-xs" style={{ color: "rgba(245,240,235,0.3)" }}>Aucun segment pour le moment</p>
          <div className="flex gap-2 justify-center mt-3">
            <Link
              href="/dashboard/sovereign-chat/segments/new"
              className="text-[10px] font-medium py-2 px-3"
              style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
            >
              Créer un segment
            </Link>
            <Link
              href="/dashboard/sovereign-chat/segments/new?template=true"
              className="text-[10px] font-medium py-2 px-3"
              style={{ backgroundColor: "rgba(245,240,235,0.04)", color: "rgba(245,240,235,0.3)", border: "1px solid rgba(245,240,235,0.06)" }}
            >
              Cloner un template
            </Link>
          </div>
        </div>
      )}

      {/* Segment cards */}
      {!loading && segments.length > 0 && (
        <div className="space-y-2">
          {segments.map((seg) => (
            <div
              key={seg.id}
              className="p-3 transition-all relative"
              style={{
                backgroundColor: "rgba(245,240,235,0.02)",
                border: "1px solid rgba(245,240,235,0.04)",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={`/dashboard/sovereign-chat/segments/${seg.id}`}
                  className="flex-1 min-w-0"
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                      {seg.name}
                    </span>
                    <span
                      className="text-[8px] px-1.5 py-0.5 uppercase tracking-wider shrink-0"
                      style={{
                        backgroundColor: seg.type === "smart"
                          ? "rgba(122,154,101,0.1)"
                          : "rgba(199,91,57,0.1)",
                        color: seg.type === "smart" ? "var(--success)" : "var(--accent)",
                      }}
                    >
                      {seg.type === "smart" ? "Smart" : "Static"}
                    </span>
                  </div>
                  {seg.description && (
                    <p className="text-[10px] truncate" style={{ color: "rgba(245,240,235,0.3)" }}>
                      {seg.description}
                    </p>
                  )}
                </Link>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Member count */}
                  <div className="text-right">
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{seg.member_count}</p>
                    <p className="text-[8px]" style={{ color: "rgba(245,240,235,0.2)" }}>membres</p>
                  </div>

                  {/* Recalculate button (smart only) */}
                  {seg.type === "smart" && (
                    <button
                      onClick={(e) => { e.preventDefault(); handleRecalculate(seg.id); }}
                      disabled={recalculating === seg.id}
                      className="p-1.5 transition-all hover:opacity-70 disabled:opacity-30"
                      style={{ color: "rgba(245,240,235,0.2)" }}
                    >
                      <RefreshCw size={12} className={recalculating === seg.id ? "animate-spin" : ""} />
                    </button>
                  )}

                  {/* Rule badges */}
                  <Link
                    href={`/dashboard/sovereign-chat/segments/${seg.id}`}
                    className="flex items-center gap-0.5"
                  >
                    {(seg.rules || []).slice(0, 3).map((rule: any, i: number) => (
                      <span
                        key={i}
                        className="text-[7px] px-1 py-0.5"
                        style={{ backgroundColor: "rgba(245,240,235,0.04)", color: "rgba(245,240,235,0.2)" }}
                      >
                        {rule.field} {rule.operator}
                      </span>
                    ))}
                    {(seg.rules || []).length > 3 && (
                      <span className="text-[7px]" style={{ color: "rgba(245,240,235,0.15)" }}>
                        +{seg.rules.length - 3}
                      </span>
                    )}
                  </Link>

                  {/* Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === seg.id ? null : seg.id)}
                      className="p-1 transition-all hover:opacity-70"
                      style={{ color: "rgba(245,240,235,0.2)" }}
                    >
                      <MoreHorizontal size={14} />
                    </button>
                    {menuOpen === seg.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                        <div
                          className="absolute right-0 top-8 z-20 w-40 py-1"
                          style={{ backgroundColor: "var(--bg-primary)", border: "1px solid rgba(245,240,235,0.08)" }}
                        >
                          <Link
                            href={`/dashboard/sovereign-chat/segments/${seg.id}`}
                            className="flex items-center gap-2 px-3 py-1.5 text-[10px] transition-all hover:opacity-70"
                            style={{ color: "rgba(245,240,235,0.5)" }}
                          >
                            <Users size={10} /> Voir membres
                          </Link>
                          <Link
                            href={`/dashboard/sovereign-chat/segments/${seg.id}/edit`}
                            className="flex items-center gap-2 px-3 py-1.5 text-[10px] transition-all hover:opacity-70"
                            style={{ color: "rgba(245,240,235,0.5)" }}
                          >
                            <Smartphone size={10} /> Éditer
                          </Link>
                          <button
                            onClick={() => handleDuplicate(seg)}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-[10px] transition-all hover:opacity-70"
                            style={{ color: "rgba(245,240,235,0.5)" }}
                          >
                            <Copy size={10} /> Dupliquer
                          </button>
                          <button
                            onClick={() => exportCSV(seg)}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-[10px] transition-all hover:opacity-70"
                            style={{ color: "rgba(245,240,235,0.5)" }}
                          >
                            <Download size={10} /> Exporter CSV
                          </button>
                          <div className="h-px my-1" style={{ backgroundColor: "rgba(245,240,235,0.04)" }} />
                          <button
                            onClick={() => handleDelete(seg.id)}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-[10px] transition-all hover:opacity-70"
                            style={{ color: "var(--danger)" }}
                          >
                            <Trash2 size={10} /> Supprimer
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer info */}
              <div className="flex items-center gap-3 mt-2 text-[8px]" style={{ color: "rgba(245,240,235,0.15)" }}>
                {seg.last_calculated_at && (
                  <span>Dernier calcul : {new Date(seg.last_calculated_at).toLocaleDateString("fr-FR")}</span>
                )}
                <span>Créé le {new Date(seg.created_at).toLocaleDateString("fr-FR")}</span>
                {seg.on_entry_funnel_id && <span>Funnel entrée ✓</span>}
                {seg.on_exit_funnel_id && <span>Funnel sortie ✓</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom actions */}
      {!loading && segments.length > 0 && (
        <div className="flex gap-2">
          <Link
            href="/dashboard/sovereign-chat/segments/new"
            className="flex-1 text-[10px] font-medium py-2.5 text-center transition-all hover:opacity-80"
            style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
          >
            <Plus size={10} className="inline mr-1" />
            Nouveau segment
          </Link>
          <Link
            href="/dashboard/sovereign-chat/segments/new?template=true"
            className="flex-1 text-[10px] font-medium py-2.5 text-center transition-all hover:opacity-70"
            style={{ backgroundColor: "rgba(245,240,235,0.04)", color: "rgba(245,240,235,0.3)", border: "1px solid rgba(245,240,235,0.06)" }}
          >
            <Copy size={10} className="inline mr-1" />
            Cloner un template
          </Link>
        </div>
      )}
    </div>
  );
}
