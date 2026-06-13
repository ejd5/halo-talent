"use client";

import { X, Eye, Send } from "lucide-react";
import type { SiteBlock } from "../../types";
import { BLOCK_LABELS } from "../../types";
import { BlockPreview } from "./BlockPreview";

export function PublishModal({
  blocks,
  onConfirm,
  onClose,
  mode = "publish",
}: {
  blocks: SiteBlock[];
  onConfirm: (note: string) => void;
  onClose: () => void;
  mode: "publish" | "draft";
}) {
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center" onClick={onClose}>
        <div
          className="w-[640px] max-h-[80vh] border border-[var(--color-border)] flex flex-col card-accent"
          style={{ backgroundColor: "var(--color-base)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
            <h2 className="text-sm font-semibold flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
              <Eye size={14} />
              {mode === "publish" ? "Confirmer la publication" : "Sauvegarder le brouillon"}
            </h2>
            <button onClick={onClose} className="p-1 hover:bg-[var(--color-card)] transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Preview of changes */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider opacity-40">
              Aperçu des blocs ({blocks.length})
            </p>
            <div className="space-y-2">
              {blocks.map((block, i) => (
                <div key={block.id} className="border border-[var(--color-border)]">
                  <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider opacity-30 bg-[var(--color-card)]">
                    #{i + 1}, {BLOCK_LABELS[block.type]}
                  </div>
                  <div className="max-h-[120px] overflow-hidden opacity-60">
                    <BlockPreview block={block} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Note + confirm */}
          <div className="px-6 py-4 border-t border-[var(--color-border)] space-y-3">
            <PublishNoteInput onConfirm={onConfirm} onClose={onClose} mode={mode} />
          </div>
        </div>
      </div>
    </>
  );
}

function PublishNoteInput({
  onConfirm,
  onClose,
  mode,
}: {
  onConfirm: (note: string) => void;
  onClose: () => void;
  mode: "publish" | "draft";
}) {
  let note = "";

  return (
    <>
      <input
        type="text"
        onChange={(e) => { note = e.target.value; }}
        placeholder="Note de version (optionnelle)..."
        className="w-full p-2 text-xs border border-[var(--color-border)] bg-transparent rounded-[0px]"
      />
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-1.5 text-xs font-medium border border-[var(--color-border)] hover:bg-[var(--color-card)] transition-colors rounded-[0px]">
          Annuler
        </button>
        <button
          onClick={() => onConfirm(note)}
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white transition-opacity rounded-[0px]"
          style={{ backgroundColor: mode === "publish" ? "var(--success)" : "var(--color-accent)" }}
        >
          <Send size={12} />
          {mode === "publish" ? "Publier" : "Sauvegarder"}
        </button>
      </div>
    </>
  );
}
