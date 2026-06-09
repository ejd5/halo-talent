"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, ImageIcon, Film, X, Sparkles, BookTemplate } from "lucide-react";
import type { ComposerMedia } from "@/lib/studio/types";

interface ContentTabProps {
  media: ComposerMedia[];
  onAddMedia: (media: ComposerMedia) => void;
  onRemoveMedia: (id: string) => void;
  onSetMedia: (media: ComposerMedia[]) => void;
}

export function ContentTab({ media, onAddMedia, onRemoveMedia, onSetMedia }: ContentTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback(
    (files: FileList) => {
      Array.from(files).forEach((file) => {
        const id = `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const type = file.type.startsWith("video/") ? ("video" as const) : ("image" as const);
        onAddMedia({
          id,
          file,
          previewUrl: URL.createObjectURL(file),
          type,
          name: file.name,
        });
      });
    },
    [onAddMedia]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) handleFiles(e.target.files);
      e.target.value = "";
    },
    [handleFiles]
  );

  return (
    <div className="p-4 space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="relative flex flex-col items-center justify-center py-12 px-4 cursor-pointer transition-all rounded-sm"
        style={{
          border: `2px dashed ${dragOver ? "#C75B39" : "rgba(255,255,255,0.1)"}`,
          background: dragOver ? "rgba(199,91,57,0.04)" : "rgba(255,255,255,0.02)",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
        <Upload size={24} style={{ color: dragOver ? "#C75B39" : "rgba(255,255,255,0.2)" }} />
        <p className="text-xs mt-3" style={{ color: dragOver ? "#C75B39" : "rgba(255,255,255,0.4)" }}>
          {dragOver ? "Dépose ici" : "Glisse des fichiers ou clique pour ajouter"}
        </p>
        <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>
          Images, vidéos — jusqu'à 1 Go
        </p>
      </div>

      {/* Media preview row */}
      {media.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {media.map((m) => (
            <div
              key={m.id}
              className="relative w-20 h-20 rounded-sm overflow-hidden group"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {m.type === "video" ? (
                <div className="w-full h-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <Film size={20} style={{ color: "rgba(255,255,255,0.3)" }} />
                </div>
              ) : (
                <img
                  src={m.previewUrl}
                  alt={m.name || ""}
                  className="w-full h-full object-cover"
                />
              )}
              <button
                onClick={() => onRemoveMedia(m.id)}
                className="absolute top-0.5 right-0.5 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm"
                style={{ background: "rgba(0,0,0,0.7)" }}
              >
                <X size={10} style={{ color: "#F5F0EB" }} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          className="flex items-center gap-2 px-3 py-2.5 text-xs transition-all rounded-sm hover:opacity-80"
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#F5F0EB",
          }}
        >
          <ImageIcon size={14} style={{ color: "#C75B39" }} />
          Bibliothèque média
        </button>
        <button
          className="flex items-center gap-2 px-3 py-2.5 text-xs transition-all rounded-sm hover:opacity-80"
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#F5F0EB",
          }}
        >
          <Sparkles size={14} style={{ color: "#C75B39" }} />
          Générer avec l'IA
        </button>
        <button
          className="flex items-center gap-2 px-3 py-2.5 text-xs transition-all rounded-sm hover:opacity-80 col-span-2"
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#F5F0EB",
          }}
        >
          <BookTemplate size={14} style={{ color: "#C75B39" }} />
          Choisir un template
        </button>
      </div>
    </div>
  );
}
