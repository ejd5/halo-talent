"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { X, Upload, File, Image, Video, Music, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import type { MediaItem, UploadFile } from "@/lib/library/types";
import { cn } from "@/lib/utils";

const FILE_ICONS: Record<string, React.ElementType> = {
  image: Image,
  video: Video,
  audio: Music,
  document: FileText,
};

export function UploadModal({
  onClose,
  onComplete,
}: {
  onClose: () => void;
  onComplete: (items: MediaItem[]) => void;
}) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((fileList: FileList) => {
    const newFiles: UploadFile[] = Array.from(fileList).map((file) => {
      const type = file.type.startsWith("image/") ? "image"
        : file.type.startsWith("video/") ? "video"
        : file.type.startsWith("audio/") ? "audio"
        : "document";

      return {
        id: `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        name: file.name,
        type,
        size: file.size,
        progress: 0,
        status: "pending" as const,
        preview: type === "image" ? URL.createObjectURL(file) : null,
      };
    });
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }, [addFiles]);

  const simulateUpload = async () => {
    setUploading(true);
    const newItems: MediaItem[] = [];

    for (const file of files) {
      // Compressing
      setFiles((prev) => prev.map((f) => f.id === file.id ? { ...f, status: "compressing", progress: 10 } : f));
      await sleep(300);

      // Uploading
      setFiles((prev) => prev.map((f) => f.id === file.id ? { ...f, status: "uploading", progress: 30 } : f));
      await sleep(500);

      setFiles((prev) => prev.map((f) => f.id === file.id ? { ...f, progress: 60 } : f));
      await sleep(400);

      setFiles((prev) => prev.map((f) => f.id === file.id ? { ...f, progress: 80 } : f));
      await sleep(300);

      // Analyzing with AI
      setFiles((prev) => prev.map((f) => f.id === file.id ? { ...f, status: "analyzing", progress: 90 } : f));
      await sleep(600);

      // Done
      setFiles((prev) => prev.map((f) => f.id === file.id ? { ...f, status: "done", progress: 100 } : f));

      newItems.push({
        id: `med-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: file.name.replace(/\.[^/.]+$/, ""),
        url: URL.createObjectURL(file.file),
        thumbnail_url: file.preview,
        type: file.type,
        mime_type: file.file.type,
        creator_id: "c1",
        creator_name: "Moi",
        manager_id: null,
        file_size: file.size,
        width: null,
        height: null,
        duration: null,
        tags: [],
        ai_description: null,
        ai_tags: [],
        ai_colors: [],
        ai_mood: null,
        ai_suitable_platforms: [],
        ai_analyzed: false,
        ai_analysis_date: null,
        moderation_safe: true,
        moderation_concerns: [],
        moderation_checked: false,
        used_in_post_ids: [],
        used_on_platforms: [],
        post_id: null,
        folder: null,
        is_favorite: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    await sleep(500);
    setUploading(false);
    onComplete(newItems);
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
    if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(0)} KB`;
    return `${bytes} B`;
  };

  const totalSize = files.reduce((s, f) => s + f.size, 0);
  const allDone = files.length > 0 && files.every((f) => f.status === "done");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "#00000080" }}
      onClick={onClose}>
      <div
        className="w-[560px] max-h-[80vh] flex flex-col border border-[var(--color-border)]"
        style={{ backgroundColor: "var(--color-card)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border)]">
          <div>
            <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "#FFFFFF" }}>
              Importer des médias
            </h2>
            <p className="text-[10px]" style={{ color: "#FFFFFF60" }}>
              {files.length > 0 ? `${files.length} fichier${files.length > 1 ? "s" : ""} · ${formatSize(totalSize)}` : "Glisse ou sélectionne tes fichiers"}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-[var(--color-base)] transition-colors">
            <X size={14} style={{ color: "#FFFFFF60" }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "border-2 border-dashed p-8 text-center transition-all cursor-pointer",
              dragOver ? "border-[#C75B39] bg-[#C75B39]/5" : "border-[var(--color-border)] hover:border-[#C75B39]/50"
            )}
          >
            <Upload size={28} className="mx-auto mb-2" style={{ color: "#FFFFFF30" }} />
            <p className="text-xs font-medium" style={{ color: "#FFFFFF80" }}>
              {dragOver ? "Dépose les fichiers ici" : "Glisse-dépose tes fichiers ici"}
            </p>
            <p className="text-[10px] mt-1" style={{ color: "#FFFFFF40" }}>
              ou clique pour parcourir — Images, vidéos, audio, documents
            </p>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => e.target.files && addFiles(e.target.files)}
            />
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file) => {
                const Icon = FILE_ICONS[file.type] ?? File;
                return (
                  <div key={file.id} className="flex items-center gap-3 p-2 border border-[var(--color-border)]"
                    style={{ backgroundColor: "var(--color-base)" }}>
                    {/* Preview / Icon */}
                    <div className="w-10 h-10 border border-[var(--color-border)] flex items-center justify-center overflow-hidden shrink-0"
                      style={{ backgroundColor: "var(--color-card)" }}>
                      {file.preview ? (
                        <img src={file.preview} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Icon size={16} style={{ color: "#FFFFFF40" }} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium truncate" style={{ color: "#FFFFFF" }}>{file.name}</p>
                      <p className="text-[9px]" style={{ color: "#FFFFFF50" }}>{formatSize(file.size)}</p>
                    </div>

                    {/* Progress / Status */}
                    <div className="w-24 shrink-0">
                      {file.status === "pending" && (
                        <button onClick={() => removeFile(file.id)} className="p-1 hover:opacity-70 transition-opacity">
                          <X size={12} style={{ color: "#FFFFFF40" }} />
                        </button>
                      )}
                      {file.status === "uploading" && (
                        <div className="space-y-0.5">
                          <div className="h-1 bg-[var(--color-border)] overflow-hidden">
                            <div className="h-full bg-[#C75B39] transition-all duration-300" style={{ width: `${file.progress}%` }} />
                          </div>
                          <p className="text-[8px] text-right" style={{ color: "#FFFFFF40" }}>{file.progress}%</p>
                        </div>
                      )}
                      {(file.status === "compressing") && (
                        <div className="flex items-center gap-1 text-[9px]" style={{ color: "#F59E0B" }}>
                          <Loader2 size={10} className="animate-spin" /> Compression
                        </div>
                      )}
                      {file.status === "analyzing" && (
                        <div className="flex items-center gap-1 text-[9px]" style={{ color: "#3B82F6" }}>
                          <Loader2 size={10} className="animate-spin" /> Analyse IA
                        </div>
                      )}
                      {file.status === "done" && (
                        <div className="flex items-center gap-1 text-[9px]" style={{ color: "#10B981" }}>
                          <CheckCircle size={10} /> Terminé
                        </div>
                      )}
                      {file.status === "error" && (
                        <div className="flex items-center gap-1 text-[9px]" style={{ color: "#EF4444" }}>
                          <AlertCircle size={10} /> {file.error ?? "Erreur"}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--color-border)]">
          <p className="text-[9px]" style={{ color: "#FFFFFF40" }}>
            Formats supportés : JPG, PNG, MP4, MOV, MP3, PDF — Max 100MB
          </p>
          <div className="flex gap-2">
            <button onClick={onClose}
              className="px-4 py-1.5 text-[10px] font-medium uppercase tracking-wider border border-[var(--color-border)] hover:bg-[var(--color-base)] transition-colors"
              style={{ color: "#FFFFFF" }}>
              Annuler
            </button>
            <button
              onClick={simulateUpload}
              disabled={files.length === 0 || uploading}
              className="flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-medium uppercase tracking-wider disabled:opacity-40 transition-opacity"
              style={{ backgroundColor: "#C75B39", color: "#FFFFFF" }}
            >
              {uploading ? (
                <><Loader2 size={11} className="animate-spin" /> Upload en cours...</>
              ) : allDone ? (
                <><CheckCircle size={11} /> Terminé</>
              ) : (
                <><Upload size={11} /> Upload {files.length > 0 ? `(${files.length})` : ""}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
