"use client";

import { Clock, RotateCcw } from "lucide-react";
import type { PageVersion } from "../../types";

export function VersionHistory({
  versions,
  onRevert,
}: {
  versions: PageVersion[];
  onRevert: (version: PageVersion) => void;
}) {
  if (versions.length === 0) return null;

  return (
    <div>
      <h4 className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-2 flex items-center gap-1.5">
        <Clock size={12} /> Historique des versions
      </h4>
      <div className="space-y-1 max-h-[200px] overflow-y-auto">
        {[...versions].reverse().map((v) => {
          const date = new Date(v.saved_at).toLocaleDateString("fr-FR", {
            day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
          });
          return (
            <div key={v.id} className="flex items-center gap-2 px-2 py-1.5 text-xs border border-[var(--color-border)]">
              <span className="text-[10px] font-mono opacity-30 w-16 shrink-0">{date}</span>
              <span className="flex-1 truncate opacity-60">{v.note || "Sans note"}</span>
              <span className="text-[10px] opacity-30">{v.saved_by}</span>
              <button
                onClick={() => onRevert(v)}
                className="p-0.5 hover:opacity-60 transition-opacity"
                title="Restaurer cette version"
              >
                <RotateCcw size={11} className="opacity-40" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
