"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Filter, Users, Search, ChevronRight } from "lucide-react";
import { SEGMENT_PRESETS } from "@/lib/atlas/crm/segments";

export default function SegmentsPage() {
  const [customName, setCustomName] = useState("");
  const [customFilters, setCustomFilters] = useState<{ field: string; operator: string; value: string }[]>([]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/atlas/fans" className="p-1 transition-opacity hover:opacity-70" style={{ color: "var(--text-primary)" }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>Segments</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-primary)" }}>Segmente ta base fans pour des campagnes ciblées</p>
        </div>
      </div>

      {/* Preset segments */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Segments prédéfinis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SEGMENT_PRESETS.map((seg) => (
            <Link
              key={seg.name}
              href={`/dashboard/atlas/fans?${new URLSearchParams(
                seg.filters.map((f) => [f.field, Array.isArray(f.value) ? f.value.join(",") : String(f.value)])
              )}`}
              className="p-4 border border-[var(--color-border)] transition-colors hover:border-[var(--color-accent)]"
              style={{ backgroundColor: "var(--color-card)" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{seg.name}</h4>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-primary)" }}>{seg.description}</p>
                </div>
                <ChevronRight size={16} style={{ color: "var(--accent)" }} />
              </div>
              <div className="flex gap-1 mt-2">
                {seg.filters.map((f, i) => (
                  <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-sm" style={{ background: "rgba(199,91,57,0.1)", color: "var(--accent)" }}>
                    {f.field} {f.operator} {Array.isArray(f.value) ? f.value.join(", ") : f.value}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Custom segment builder (simplified) */}
      <div className="p-4 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Créer un segment personnalisé</h3>
        <p className="text-xs mb-4" style={{ color: "var(--text-primary)" }}>
          Utilise l&apos;outil de filtrage avancé dans la page fans pour créer tes propres segments.
        </p>
        <Link
          href="/dashboard/atlas/fans"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-sm transition-opacity hover:opacity-80"
          style={{ background: "var(--accent)", color: "var(--text-primary)" }}
        >
          <Filter size={14} /> Filtrer les fans
        </Link>
      </div>
    </div>
  );
}
