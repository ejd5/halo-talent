"use client";

import { useState } from "react";
import { X, Heart, Download, Trash2, Calendar, Ruler, HardDrive, Clock, Tag, AlertTriangle, Shield, CheckCircle, Sparkles, Copy, ExternalLink } from "lucide-react";
import type { MediaItem } from "@/lib/library/types";
import { PLATFORM_COLORS, PLATFORM_LABELS, MOOD_OPTIONS } from "@/lib/library/constants";
import { cn } from "@/lib/utils";

export function MediaPreview({
  item,
  onClose,
  onToggleFavorite,
  onDelete,
}: {
  item: MediaItem;
  onClose: () => void;
  onToggleFavorite: () => void;
  onDelete: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const formatSize = (bytes: number) => {
    if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
    if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(0)} KB`;
    return `${bytes} B`;
  };

  const moodLabel = MOOD_OPTIONS.find((m) => m.value === item.ai_mood);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "#000000CC" }}
      onClick={onClose}>
      <div
        className="w-[720px] max-h-[90vh] flex flex-col border border-[var(--color-border)]"
        style={{ backgroundColor: "var(--color-card)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border)]">
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold truncate" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
              {item.title}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[9px] font-medium" style={{ color: "rgba(255, 255, 255, 0.375)" }}>{item.creator_name}</span>
              <span className="text-[9px]" style={{ color: "rgba(255, 255, 255, 0.19)" }}>·</span>
              <span className="text-[9px]" style={{ color: "rgba(255, 255, 255, 0.375)" }}>
                {new Date(item.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={onToggleFavorite} className="p-1.5 hover:bg-[var(--color-base)] transition-colors">
              <Heart size={13} className={item.is_favorite ? "fill-[var(--danger)] text-[var(--danger)]" : ""} style={{ color: "rgba(255, 255, 255, 0.375)" }} />
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-[var(--color-base)] transition-colors">
              <X size={14} style={{ color: "rgba(255, 255, 255, 0.375)" }} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-[1fr_280px] divide-x divide-[var(--color-border)]">
          {/* Left: Preview */}
          <div className="flex items-center justify-center p-4 min-h-[300px]" style={{ backgroundColor: "var(--color-base)" }}>
            {item.type === "image" ? (
              <img src={item.url} alt={item.title} className="max-w-full max-h-[60vh] object-contain" />
            ) : item.type === "video" ? (
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-16 h-16 border-2 border-[var(--color-border)] flex items-center justify-center">
                  <span className="text-2xl">▶</span>
                </div>
                <p className="text-xs" style={{ color: "rgba(255, 255, 255, 0.375)" }}>Aperçu vidéo</p>
                {item.duration && (
                  <p className="text-[10px]" style={{ color: "rgba(255, 255, 255, 0.25)" }}>
                    Durée : {Math.floor(item.duration / 60)}min {item.duration % 60}s
                  </p>
                )}
              </div>
            ) : item.type === "audio" ? (
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-16 h-16 border-2 border-[var(--color-border)] flex items-center justify-center rounded-full">
                  <span className="text-2xl">🎵</span>
                </div>
                <p className="text-xs" style={{ color: "rgba(255, 255, 255, 0.375)" }}>Fichier audio</p>
                {item.duration && (
                  <p className="text-[10px]" style={{ color: "rgba(255, 255, 255, 0.25)" }}>
                    Durée : {Math.floor(item.duration / 60)}min {item.duration % 60}s
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center">
                <FileTextIcon />
                <p className="text-xs" style={{ color: "rgba(255, 255, 255, 0.375)" }}>Document</p>
                <a href={item.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] text-[var(--accent)] underline underline-offset-4">
                  <ExternalLink size={10} /> Ouvrir le document
                </a>
              </div>
            )}
          </div>

          {/* Right: Metadata & AI Analysis */}
          <div className="p-4 space-y-4 overflow-y-auto">
            {/* File info */}
            <Section title="Informations">
              <InfoRow icon={<HardDrive size={11} />} label="Taille" value={formatSize(item.file_size)} />
              {item.width && item.height && (
                <InfoRow icon={<Ruler size={11} />} label="Dimensions" value={`${item.width}×${item.height}`} />
              )}
              {item.duration && (
                <InfoRow icon={<Clock size={11} />} label="Durée" value={`${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, "0")}`} />
              )}
              <InfoRow icon={<Calendar size={11} />} label="Uploadé le" value={new Date(item.created_at).toLocaleDateString("fr-FR")} />
              <InfoRow icon={<Tag size={11} />} label="Type MIME" value={item.mime_type} />
            </Section>

            {/* Tags */}
            {(item.tags.length > 0 || item.ai_tags.length > 0) && (
              <Section title="Tags">
                <div className="flex flex-wrap gap-1">
                  {[...new Set([...item.tags, ...item.ai_tags])].map((t) => (
                    <span key={t} className="px-1.5 py-0.5 text-[8px] font-medium border border-[var(--color-border)]"
                      style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                      #{t}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* AI Analysis */}
            {item.ai_analyzed && (
              <Section title="Analyse IA" icon={<Sparkles size={11} style={{ color: "var(--success)" }} />}>
                {/* Description */}
                {item.ai_description && (
                  <p className="text-[10px] leading-relaxed" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                    {item.ai_description}
                  </p>
                )}

                {/* Mood */}
                {moodLabel && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[11px]">{moodLabel.emoji}</span>
                    <span className="text-[9px] font-medium" style={{ color: "rgba(255, 255, 255, 0.5)" }}>{moodLabel.label}</span>
                  </div>
                )}

                {/* Colors */}
                {item.ai_colors.length > 0 && (
                  <div className="flex items-center gap-1 mt-1.5">
                    {item.ai_colors.map((c, i) => (
                      <div key={i} className="w-4 h-4 border border-[var(--color-border)]" style={{ backgroundColor: c }}
                        title={c} />
                    ))}
                  </div>
                )}

                {/* Suitable platforms */}
                {item.ai_suitable_platforms.length > 0 && (
                  <div className="mt-2">
                    <p className="text-[8px] uppercase tracking-wider font-medium mb-1" style={{ color: "rgba(255, 255, 255, 0.31)" }}>
                      Plateformes adaptées
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {item.ai_suitable_platforms.map((p) => (
                        <span key={p} className="px-1.5 py-0.5 text-[8px] font-medium"
                          style={{ backgroundColor: `${PLATFORM_COLORS[p] ?? "#666"}20`, color: PLATFORM_COLORS[p] ?? "var(--text-primary)" }}>
                          {PLATFORM_LABELS[p] ?? p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Section>
            )}

            {/* Not analyzed */}
            {!item.ai_analyzed && (
              <Section title="Analyse IA">
                <p className="text-[10px]" style={{ color: "rgba(255, 255, 255, 0.25)" }}>
                  {item.type === "audio" || item.type === "document"
                    ? "L'analyse IA n'est pas disponible pour ce type de fichier"
                    : "En attente d'analyse — clique sur 'Analyser avec IA'"}
                </p>
              </Section>
            )}

            {/* Moderation */}
            {item.moderation_checked && (
              <Section title="Modération" icon={<Shield size={11} style={{ color: item.moderation_safe ? "var(--success)" : "var(--danger)" }} />}>
                {item.moderation_safe ? (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle size={10} style={{ color: "var(--success)" }} />
                    <span className="text-[10px]" style={{ color: "var(--success)" }}>Contenu sûr — OK pour publication</span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle size={10} style={{ color: "var(--danger)" }} />
                      <span className="text-[10px] font-medium" style={{ color: "var(--danger)" }}>Attention nécessaire</span>
                    </div>
                    {item.moderation_concerns.map((c, i) => (
                      <p key={i} className="text-[9px] pl-4" style={{ color: "rgba(239, 68, 68, 0.8)" }}>• {c}</p>
                    ))}
                    <p className="text-[8px] mt-1" style={{ color: "rgba(255, 255, 255, 0.25)" }}>
                      Tu peux publier ce contenu, mais vérifie les guidelines de chaque plateforme.
                    </p>
                  </div>
                )}
              </Section>
            )}

            {/* Usage */}
            {item.used_on_platforms.length > 0 && (
              <Section title="Utilisé sur">
                <div className="flex flex-wrap gap-1">
                  {item.used_on_platforms.map((p) => {
                    const Icon = p === "instagram" ? InstagramIcon : p === "youtube" ? YoutubeIcon : PlatformIcon;
                    return (
                      <span key={p} className="flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-medium border border-[var(--color-border)]"
                        style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                        {p}
                      </span>
                    );
                  })}
                </div>
              </Section>
            )}

            {/* Actions */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => copyToClipboard(item.url)}
                className="flex items-center justify-center gap-1.5 w-full py-2 text-[9px] font-medium uppercase tracking-wider border border-[var(--color-border)] hover:bg-[var(--color-base)] transition-all"
                style={{ color: "var(--text-primary)" }}
              >
                <Copy size={10} />
                {copied ? "Copié !" : "Copier l'URL"}
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="flex items-center justify-center gap-1.5 w-full py-2 text-[9px] font-medium uppercase tracking-wider border border-[var(--danger)]/30 text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-all"
              >
                <Trash2 size={10} />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        {icon}
        <h3 className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: "rgba(255, 255, 255, 0.5)" }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="flex items-center gap-1.5 text-[9px]" style={{ color: "rgba(255, 255, 255, 0.375)" }}>
        {icon}
        {label}
      </span>
      <span className="text-[9px] font-mono" style={{ color: "rgba(255, 255, 255, 0.5)" }}>{value}</span>
    </div>
  );
}

function FileTextIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "rgba(255, 255, 255, 0.25)" }}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function InstagramIcon() { return <span className="text-[9px]">📸</span>; }
function YoutubeIcon() { return <span className="text-[9px]">▶️</span>; }
function PlatformIcon() { return <span className="text-[9px]">🌐</span>; }
