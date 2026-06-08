"use client";

import { useState } from "react";
import { X, Upload } from "lucide-react";
import { mediaItems } from "../data";
import type { MediaType } from "../types";

const CREATORS = [...new Set(mediaItems.map((m) => m.creator_name))].sort();

const TYPE_OPTIONS: { value: MediaType; label: string }[] = [
  { value: "image", label: "Image" },
  { value: "video", label: "Vidéo" },
  { value: "document", label: "Document" },
];

export function MediaUploadModal({
  onClose,
  onUploaded,
}: {
  onClose: () => void;
  onUploaded: (item: {
    title: string;
    type: MediaType;
    creator_name: string;
    tags: string[];
  }) => void;
}) {
  const [form, setForm] = useState({
    title: "",
    type: "image" as MediaType,
    creator_name: "",
    tags: "",
  });
  const [dragOver, setDragOver] = useState(false);

  const canSubmit = form.title && form.creator_name;

  const handleSubmit = () => {
    onUploaded({
      title: form.title,
      type: form.type,
      creator_name: form.creator_name,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="w-[480px] border border-[var(--color-border)]"
          style={{ backgroundColor: "var(--color-base)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
            <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              Importer un média
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[var(--color-card)] transition-colors rounded-[0px]"
            >
              <X size={16} />
            </button>
          </div>

          <div className="px-6 py-5 space-y-4">
            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
              className={`border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
                dragOver
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                  : "border-[var(--color-border)] hover:border-[var(--color-accent)]"
              }`}
            >
              <Upload size={24} className="mx-auto mb-2 opacity-40" />
              <p className="text-xs font-medium opacity-60">
                Glissez-déposez un fichier ici
              </p>
              <p className="text-[10px] opacity-30 mt-1">ou cliquez pour parcourir</p>
            </div>

            {/* Title */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider opacity-50 mb-1.5 block">
                Titre
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Nom du fichier..."
                className="w-full p-2 text-sm border border-[var(--color-border)] bg-[var(--color-card)] rounded-[0px]"
              />
            </div>

            {/* Type */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider opacity-50 mb-1.5 block">
                Type de média
              </label>
              <div className="flex gap-2">
                {TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setForm({ ...form, type: opt.value })}
                    className={`px-3 py-1.5 text-xs font-medium border transition-colors rounded-[0px] ${
                      form.type === opt.value
                        ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                        : "border-[var(--color-border)] hover:bg-[var(--color-card)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Creator */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider opacity-50 mb-1.5 block">
                Créateur
              </label>
              <select
                value={form.creator_name}
                onChange={(e) => setForm({ ...form, creator_name: e.target.value })}
                className="w-full p-2 text-sm border border-[var(--color-border)] bg-[var(--color-card)] rounded-[0px]"
              >
                <option value="">Sélectionner...</option>
                {CREATORS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider opacity-50 mb-1.5 block">
                Tags (séparés par des virgules)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="shooting, été, portrait"
                className="w-full p-2 text-sm border border-[var(--color-border)] bg-[var(--color-card)] rounded-[0px]"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[var(--color-border)]">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium border border-[var(--color-border)] hover:bg-[var(--color-card)] transition-colors rounded-[0px]"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium bg-[var(--color-accent)] text-white disabled:opacity-30 hover:opacity-90 transition-opacity rounded-[0px]"
            >
              <Upload size={12} />
              Importer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
