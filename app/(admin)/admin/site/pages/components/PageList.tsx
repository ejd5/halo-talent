"use client";

import { FileEdit, Eye } from "lucide-react";
import type { SitePage } from "../../types";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  published: { label: "Publié", color: "#7A9A65" },
  draft: { label: "Brouillon", color: "#E0D8D0" },
  review: { label: "En modification", color: "#C75B39" },
};

export function PageList({
  pages,
  onEdit,
}: {
  pages: SitePage[];
  onEdit: (page: SitePage) => void;
}) {
  return (
    <div className="border border-[var(--color-border)] divide-y divide-[var(--color-border)] card-accent" style={{ background: "#0A0908" }}>
      {/* Header */}
      <div className="grid grid-cols-[1fr_120px_180px_100px] gap-4 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider opacity-40">
        <div>Page</div>
        <div>Statut</div>
        <div>Dernière modification</div>
        <div>Actions</div>
      </div>

      {/* Rows */}
      {pages.map((page) => {
        const st = STATUS_LABELS[page.status];
        const date = new Date(page.updated_at).toLocaleDateString("fr-FR", {
          day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
        });
        return (
          <div
            key={page.id}
            className="grid grid-cols-[1fr_120px_180px_100px] gap-4 px-5 py-3 items-center hover:bg-[var(--color-card)] transition-colors"
          >
            <div>
              <div className="text-sm font-medium">{page.title_fr}</div>
              <div className="text-[10px] opacity-30 font-mono">/{page.slug}</div>
            </div>
            <div>
              <span
                className="text-[10px] font-medium px-2 py-0.5"
                style={{ color: st.color, backgroundColor: `${st.color}15` }}
              >
                {st.label}
              </span>
            </div>
            <div className="text-xs opacity-50">
              {date}
              <span className="block text-[10px] opacity-30">par {page.updated_by}</span>
            </div>
            <div>
              <button
                onClick={() => onEdit(page)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium border border-[var(--color-border)] hover:bg-[var(--color-accent)] hover:text-white hover:border-[var(--color-accent)] transition-all rounded-[0px]"
              >
                <FileEdit size={12} />
                Éditer
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
