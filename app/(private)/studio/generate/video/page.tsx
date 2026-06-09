"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles, Wand2, Loader, ToggleLeft, ToggleRight,
  History, Lightbulb, Clock, Play, Pause,
  Download, RefreshCw, AlertTriangle, Upload, Film, Camera,
  Maximize, Minimize,
} from "lucide-react";
import type { VideoModelDef, VideoMode, WalletBalance } from "@/lib/studio/types";
import { VIDEO_MODELS, VIDEO_STYLES } from "@/lib/studio/types";

// ─── Constants ───

type AspectRatio = "16:9" | "9:16" | "1:1";

const ASPECTS: { value: AspectRatio; label: string; icon: string }[] = [
  { value: "16:9", label: "Paysage", icon: "▬" },
  { value: "9:16", label: "Portrait", icon: "▮" },
  { value: "1:1", label: "Carré", icon: "▣" },
];

const DURATIONS = [3, 5, 10, 15, 20, 30, 60];

interface HistoryJob {
  id: string;
  model: string;
  mode: VideoMode;
  prompt: string | null;
  status: "pending" | "processing" | "completed" | "failed";
  output_url: string | null;
  duration_seconds: number;
  progress: number;
  created_at: string;
  error: string | null;
}

// ─── Helpers ───

function getModelColor(modelId: string): string {
  return VIDEO_MODELS.find((m) => m.id === modelId)?.color ?? "#C75B39";
}

function getModelName(modelId: string): string {
  return VIDEO_MODELS.find((m) => m.id === modelId)?.name ?? modelId;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days}j`;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  processing: "Génération...",
  completed: "Terminé",
  failed: "Échec",
};

// ─── Main Page ───

export default function GenerateVideoPage() {
  // State
  const [mode, setMode] = useState<VideoMode>("text-to-video");
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState<VideoModelDef>(VIDEO_MODELS[0]);
  const [duration, setDuration] = useState(5);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [videoStyle, setVideoStyle] = useState("");
  const [useDna, setUseDna] = useState(true);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);

  const [credits, setCredits] = useState<WalletBalance | null>(null);
  const [generating, setGenerating] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<"idle" | "processing" | "completed" | "failed">("idle");
  const [progress, setProgress] = useState(0);
  const [etaRemaining, setEtaRemaining] = useState<number | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryJob[]>([]);
  const [enhancing, setEnhancing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  // Cost for current selection
  const totalCost = selectedModel.costPerSec * duration;
  const hasEnoughCredits = credits
    ? credits.is_unlimited || credits.is_admin || credits.balance >= totalCost
    : true;

  // Fetch credits + history on mount
  useEffect(() => {
    fetch("/api/studio/credits")
      .then((r) => r.json())
      .then((d) => { if (d.tier) setCredits(d); })
      .catch(() => {});
    fetchHistory();
  }, []);

  // Poll job status
  useEffect(() => {
    if (jobStatus === "processing" && jobId) {
      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/studio/generate/video/${jobId}/status`);
          const data = await res.json();

          if (data.status === "completed") {
            setJobStatus("completed");
            setVideoUrl(data.video_url);
            setProgress(1);
            clearInterval(pollRef.current!);
            pollRef.current = null;
            fetchHistory();
            // Refresh credits
            fetch("/api/studio/credits")
              .then((r) => r.json())
              .then((d) => { if (d.tier) setCredits(d); })
              .catch(() => {});
          } else if (data.status === "failed") {
            setJobStatus("failed");
            setError(data.error || "Échec de la génération");
            clearInterval(pollRef.current!);
            pollRef.current = null;
            fetchHistory();
          } else {
            setProgress(data.progress ?? 0);
            setEtaRemaining(data.eta_remaining ?? null);
          }
        } catch {
          // keep polling
        }
      }, 2000);

      return () => {
        if (pollRef.current) clearInterval(pollRef.current);
      };
    }
  }, [jobStatus, jobId]);

  // Cleanup on fullscreen change
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/studio/generate/video/history");
      if (res.ok) {
        const data = await res.json();
        setHistory(data.videos || []);
      }
    } catch {
      // silent
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || generating) return;

    setGenerating(true);
    setError(null);
    setJobStatus("processing");
    setVideoUrl(null);
    setProgress(0);
    setEtaRemaining(null);

    try {
      const body: Record<string, unknown> = {
        prompt: prompt.trim(),
        model: selectedModel.id,
        duration,
        aspect_ratio: aspectRatio,
        mode,
        use_dna: useDna,
      };
      if (videoStyle) body.style = videoStyle;
      if (mode === "image-to-video" && referenceImage) {
        body.reference_image = referenceImage;
      }

      const res = await fetch("/api/studio/generate/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.status === 402 || res.status === 429) {
        const errData = await res.json();
        setError(errData.error || "Crédits insuffisants");
        setJobStatus("idle");
        return;
      }
      if (res.status === 503) {
        setError("Service en cours de configuration. Mode démo actif.");
        setJobStatus("idle");
        return;
      }
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Erreur de génération");
        setJobStatus("idle");
        return;
      }

      const data = await res.json();
      setJobId(data.job_id);
      setEtaRemaining(data.eta_seconds);
      fetchHistory();
    } catch {
      setError("Erreur réseau");
      setJobStatus("idle");
    } finally {
      setGenerating(false);
    }
  };

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setEnhancing(true);
    try {
      const res = await fetch("/api/studio/generate/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brief: `Améliore ce prompt pour une génération vidéo IA. Sois descriptif: lumière, mouvement, atmosphère, composition. Modèle: ${selectedModel.name}. Mode: ${mode}. Prompt original: "${prompt}"`,
          type: "general", platform: "all", tone: "naturel", length: "long", count: 1,
        }),
      });
      const data = await res.json();
      if (data.variations?.[0]?.text) {
        setPrompt(data.variations[0].text.replace(/^["']|["']$/g, ""));
      }
    } catch {
      // silent
    } finally {
      setEnhancing(false);
    }
  };

  const handleRetry = () => {
    setJobStatus("idle");
    setError(null);
    setVideoUrl(null);
    setJobId(null);
    setProgress(0);
  };

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleToggleFullscreen = async () => {
    if (!playerRef.current) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await playerRef.current.requestFullscreen();
    }
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `halo-video-${selectedModel.id}-${Date.now()}.mp4`;
    a.click();
  };

  const handleReferenceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setReferenceImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // Filter models by mode compatibility
  const availableModels = VIDEO_MODELS.filter((m) => m.modes.includes(mode));
  const availableDurations = DURATIONS.filter(
    (d) => d >= selectedModel.minDuration && d <= selectedModel.maxDuration
  );
  // Pick nearest available duration if current not available
  useEffect(() => {
    if (!availableDurations.includes(duration) && availableDurations.length > 0) {
      setDuration(availableDurations[0]);
    }
  }, [selectedModel.id, mode]);

  // ─── Render ───

  return (
    <div className="flex gap-0 h-full animate-fade-in">
      {/* ═══ LEFT — Config Panel ═══ */}
      <div className="w-80 shrink-0 overflow-y-auto p-4 space-y-4" style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Header */}
        <div>
          <h1 className="text-lg italic mb-1" style={{ fontFamily: "var(--font-studio)", color: "#F5F0EB" }}>Vidéo IA</h1>
          <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            {credits
              ? credits.is_admin || credits.is_unlimited
                ? "∞ crédits"
                : `${credits.balance} crédits`
              : ""}
          </p>
        </div>

        {/* Mode selector */}
        <div>
          <label className="text-[10px] uppercase tracking-wider mb-1.5 block" style={{ color: "rgba(255,255,255,0.3)" }}>Mode</label>
          <div className="grid grid-cols-3 gap-1">
            {([
              { value: "text-to-video" as VideoMode, label: "Texte → Vidéo", icon: Sparkles },
              { value: "image-to-video" as VideoMode, label: "Image → Vidéo", icon: Camera },
              { value: "video-extension" as VideoMode, label: "Extension", icon: Film },
            ]).map((m) => (
              <button
                key={m.value}
                onClick={() => setMode(m.value)}
                className="flex flex-col items-center gap-1 px-2 py-2 text-[9px] rounded-sm transition-all"
                style={{
                  border: `1px solid ${mode === m.value ? "rgba(199,91,57,0.3)" : "rgba(255,255,255,0.06)"}`,
                  background: mode === m.value ? "rgba(199,91,57,0.06)" : "transparent",
                  color: mode === m.value ? "#C75B39" : "rgba(255,255,255,0.4)",
                }}
              >
                <m.icon size={14} />
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt */}
        <div>
          <label className="text-[10px] uppercase tracking-wider mb-1.5 block" style={{ color: "rgba(255,255,255,0.3)" }}>Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={mode === "text-to-video"
              ? "Décris la vidéo que tu veux générer..."
              : "Décris le mouvement et l'ambiance..."
            }
            className="w-full text-xs bg-transparent outline-none resize-none px-2.5 py-2 rounded-sm"
            rows={4}
            style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#F5F0EB" }}
          />
          <div className="flex gap-1 mt-1.5">
            <button
              onClick={handleEnhancePrompt}
              disabled={enhancing || !prompt.trim()}
              className="flex items-center gap-1 px-2 py-1 text-[9px] transition-colors hover:bg-white/5 disabled:opacity-30 rounded-sm"
              style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
            >
              {enhancing ? <Loader size={10} className="animate-spin" /> : <Wand2 size={10} />}
              Améliorer
            </button>
          </div>
        </div>

        {/* Reference image (Image-to-Video mode) */}
        {(mode === "image-to-video" || mode === "video-extension") && (
          <div>
            <label className="text-[10px] uppercase tracking-wider mb-1.5 block" style={{ color: "rgba(255,255,255,0.3)" }}>
              {mode === "image-to-video" ? "Image de référence" : "Vidéo source"}
            </label>
            {referenceImage ? (
              <div className="relative rounded-sm overflow-hidden mb-1.5">
                <img src={referenceImage} alt="Reference" className="w-full aspect-video object-cover" />
                <button
                  onClick={() => setReferenceImage(null)}
                  className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded-full text-[9px]"
                  style={{ background: "rgba(0,0,0,0.7)", color: "#F5F0EB" }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-1.5 px-3 py-4 rounded-sm cursor-pointer transition-colors hover:bg-white/5"
                style={{ border: "1px dashed rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.3)" }}>
                <Upload size={16} />
                <span className="text-[9px]">Upload {mode === "image-to-video" ? "une image" : "une vidéo"}</span>
                <input type="file" accept={mode === "image-to-video" ? "image/*" : "video/*"} className="hidden" onChange={handleReferenceImageUpload} />
              </label>
            )}
          </div>
        )}

        {/* Model selector */}
        <div>
          <label className="text-[10px] uppercase tracking-wider mb-1.5 block" style={{ color: "rgba(255,255,255,0.3)" }}>Modèle</label>
          <div className="space-y-1">
            {availableModels.map((m) => {
              const isSelected = selectedModel.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedModel(m)}
                  className="w-full text-left px-2.5 py-2 rounded-sm transition-all"
                  style={{
                    border: `1px solid ${isSelected ? `${m.color}40` : "rgba(255,255,255,0.06)"}`,
                    background: isSelected ? `${m.color}08` : "transparent",
                  }}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] font-medium" style={{ color: isSelected ? m.color : "#F5F0EB" }}>{m.name}</span>
                    <span
                      className="text-[8px] uppercase tracking-wider px-1 py-0.5 rounded-sm"
                      style={{
                        background: isSelected ? `${m.color}20` : "rgba(255,255,255,0.04)",
                        color: isSelected ? m.color : "rgba(255,255,255,0.3)",
                      }}
                    >
                      {m.quality === "cinema" ? "Cinéma" : m.quality === "premium" ? "Premium" : "Standard"}
                    </span>
                  </div>
                  <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {m.costPerSec} crédits/s · {formatDuration(m.minDuration)}–{formatDuration(m.maxDuration)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="text-[10px] uppercase tracking-wider mb-1.5 block" style={{ color: "rgba(255,255,255,0.3)" }}>
            Durée · {duration}s
          </label>
          <div className="flex flex-wrap gap-1">
            {DURATIONS.filter(
              (d) => d >= selectedModel.minDuration && d <= selectedModel.maxDuration
            ).map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className="px-2.5 py-1 text-[9px] rounded-sm transition-all"
                style={{
                  border: `1px solid ${duration === d ? "rgba(199,91,57,0.3)" : "rgba(255,255,255,0.06)"}`,
                  background: duration === d ? "rgba(199,91,57,0.06)" : "transparent",
                  color: duration === d ? "#C75B39" : "rgba(255,255,255,0.4)",
                }}
              >
                {d}s
              </button>
            ))}
          </div>
        </div>

        {/* Aspect ratio */}
        <div>
          <label className="text-[10px] uppercase tracking-wider mb-1.5 block" style={{ color: "rgba(255,255,255,0.3)" }}>Ratio</label>
          <div className="flex gap-1">
            {ASPECTS.map((a) => (
              <button
                key={a.value}
                onClick={() => setAspectRatio(a.value)}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-[9px] rounded-sm transition-all"
                style={{
                  border: `1px solid ${aspectRatio === a.value ? "rgba(199,91,57,0.3)" : "rgba(255,255,255,0.06)"}`,
                  background: aspectRatio === a.value ? "rgba(199,91,57,0.06)" : "transparent",
                  color: aspectRatio === a.value ? "#C75B39" : "rgba(255,255,255,0.4)",
                }}
              >
                <span>{a.icon}</span>
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Style selector */}
        <div>
          <label className="text-[10px] uppercase tracking-wider mb-1.5 block" style={{ color: "rgba(255,255,255,0.3)" }}>Style</label>
          <div className="grid grid-cols-2 gap-1">
            {VIDEO_STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => setVideoStyle(videoStyle === s.id ? "" : s.id)}
                className="flex items-center gap-1.5 px-2 py-1.5 text-[9px] rounded-sm transition-all text-left"
                style={{
                  border: `1px solid ${videoStyle === s.id ? "rgba(199,91,57,0.3)" : "rgba(255,255,255,0.06)"}`,
                  background: videoStyle === s.id ? "rgba(199,91,57,0.06)" : "transparent",
                  color: videoStyle === s.id ? "#C75B39" : "rgba(255,255,255,0.5)",
                }}
              >
                <span>{s.emoji}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* DNA toggle */}
        <div>
          <button
            onClick={() => setUseDna(!useDna)}
            className="flex items-center gap-2 px-2.5 py-2 w-full text-[10px] rounded-sm transition-all"
            style={{
              border: `1px solid ${useDna ? "rgba(199,91,57,0.2)" : "rgba(255,255,255,0.06)"}`,
              color: useDna ? "#C75B39" : "rgba(255,255,255,0.4)",
            }}
          >
            {useDna ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
            Utiliser mon style ADN
          </button>
        </div>

        {/* Generate button */}
        <div className="pt-1">
          <button
            onClick={handleGenerate}
            disabled={generating || !prompt.trim() || (mode !== "text-to-video" && !referenceImage) || jobStatus === "processing"}
            className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-30 rounded-sm"
            style={{ background: "#C75B39", color: "#FFFFFF" }}
          >
            {generating || jobStatus === "processing" ? (
              <Loader size={12} className="animate-spin" />
            ) : (
              <Sparkles size={12} />
            )}
            {generating
              ? "Initialisation..."
              : jobStatus === "processing"
              ? "Génération en cours..."
              : "Générer la vidéo"}
          </button>
          <p className="text-[9px] text-center mt-1.5" style={{ color: hasEnoughCredits ? "rgba(255,255,255,0.2)" : "#E5484D" }}>
            Coût : {totalCost} crédits · {selectedModel.name} · {formatDuration(duration)}
          </p>
        </div>
      </div>

      {/* ═══ CENTER — Video Player / Results ═══ */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto p-4">

          {/* Error state */}
          {error && (
            <div className="mb-3 px-3 py-2 text-xs rounded-sm flex items-center justify-between" style={{ background: "rgba(229,72,77,0.08)", border: "1px solid rgba(229,72,77,0.2)", color: "#E5484D" }}>
              <span>{error}</span>
              <button onClick={handleRetry} className="flex items-center gap-1 text-[9px] underline">
                <RefreshCw size={10} /> Réessayer
              </button>
            </div>
          )}

          {/* Empty state */}
          {jobStatus === "idle" && !error && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-16 h-16 flex items-center justify-center rounded-sm mb-4" style={{ background: "rgba(199,91,57,0.06)" }}>
                <Sparkles size={32} style={{ color: "rgba(199,91,57,0.2)" }} />
              </div>
              <p className="text-sm mb-2" style={{ fontFamily: "var(--font-studio)", color: "#F5F0EB" }}>Génération Vidéo IA</p>
              <p className="text-[10px] text-center max-w-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
                Configure ta vidéo à gauche, choisis un modèle et un prompt, puis génère.
                <br />
                La génération prend 30s à 3min selon le modèle et la durée.
              </p>
              {!credits?.is_admin && !credits?.is_unlimited && credits && (
                <div className="mt-4 px-3 py-1.5 text-[9px] rounded-sm" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.1)", color: "#C75B39" }}>
                  {credits.balance} crédits disponibles · ~{totalCost} crédits par génération
                </div>
              )}
            </div>
          )}

          {/* Processing state */}
          {jobStatus === "processing" && (
            <div className="flex flex-col items-center justify-center py-16 gap-6">
              {/* Shimmer animation */}
              <div className="relative w-full max-w-lg aspect-video rounded-sm overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent shimmer" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center gap-2">
                    <Loader size={20} className="animate-spin" style={{ color: getModelColor(selectedModel.id) }} />
                    <span className="text-sm" style={{ fontFamily: "var(--font-studio)", color: "#F5F0EB" }}>Génération en cours</span>
                  </div>
                  <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {selectedModel.name} · {formatDuration(duration)} · {mode === "text-to-video" ? "Texte → Vidéo" : mode === "image-to-video" ? "Image → Vidéo" : "Extension"}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-lg space-y-2">
                <div className="relative h-1 w-full rounded-sm" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="absolute left-0 top-0 h-full rounded-sm transition-all duration-500"
                    style={{ width: `${Math.min(100, progress * 100)}%`, background: getModelColor(selectedModel.id) }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  <span>Progression : {Math.round(progress * 100)}%</span>
                  {etaRemaining !== null && (
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      ~{etaRemaining > 60 ? `${Math.round(etaRemaining / 60)}min` : `${etaRemaining}s`} restantes
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Completed — Video player */}
          {jobStatus === "completed" && videoUrl && (
            <div className="flex flex-col items-center gap-4">
              <div
                ref={playerRef}
                className="relative w-full max-w-3xl aspect-video rounded-sm overflow-hidden group"
                style={{ background: "#000", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full object-contain"
                  onEnded={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  controls={false}
                />

                {/* Video controls overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.8))" }}>
                  <button
                    onClick={handleTogglePlay}
                    className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-white/20"
                    style={{ background: "rgba(255,255,255,0.1)" }}
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                  <div className="flex-1" />
                  <button onClick={handleDownload} className="flex items-center gap-1 px-2 py-1 text-[10px] transition-colors hover:bg-white/20 rounded-sm" style={{ background: "rgba(255,255,255,0.1)", color: "#F5F0EB" }}>
                    <Download size={10} /> Télécharger
                  </button>
                  <button onClick={handleToggleFullscreen} className="flex items-center justify-center w-7 h-7 transition-colors hover:bg-white/20 rounded-sm" style={{ background: "rgba(255,255,255,0.1)" }}>
                    {isFullscreen ? <Minimize size={12} /> : <Maximize size={12} />}
                  </button>
                </div>
              </div>

              {/* Video metadata */}
              <div className="flex items-center gap-3 text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                <span style={{ color: getModelColor(selectedModel.id) }}>{selectedModel.name}</span>
                <span>·</span>
                <span>{formatDuration(duration)}</span>
                <span>·</span>
                <span>{aspectRatio}</span>
                <span>·</span>
                <span>{totalCost} crédits utilisés</span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] transition-opacity hover:opacity-80 rounded-sm"
                  style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#F5F0EB" }}
                >
                  <RefreshCw size={10} />
                  Nouvelle génération
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] transition-opacity hover:opacity-80 rounded-sm"
                  style={{ background: "#C75B39", color: "#FFFFFF" }}
                >
                  <Download size={10} />
                  Télécharger la vidéo
                </button>
              </div>
            </div>
          )}

          {/* Failed state (no current error message — already handled above) */}
          {jobStatus === "failed" && !error && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-14 h-14 flex items-center justify-center" style={{ background: "rgba(229,72,77,0.1)" }}>
                <AlertTriangle size={24} style={{ color: "#E5484D" }} />
              </div>
              <p className="text-sm" style={{ fontFamily: "var(--font-studio)", color: "#F5F0EB" }}>Échec de la génération</p>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>Réessaie avec un prompt différent ou un autre modèle</p>
              <button onClick={handleRetry} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] rounded-sm transition-opacity hover:opacity-80" style={{ background: "#C75B39", color: "#FFFFFF" }}>
                <RefreshCw size={10} /> Réessayer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══ RIGHT — History ═══ */}
      <div className="w-64 shrink-0 overflow-y-auto p-4 space-y-2" style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
            <History size={10} className="inline mr-1" /> Historique
          </span>
          <button onClick={fetchHistory} className="transition-opacity hover:opacity-70" style={{ color: "rgba(255,255,255,0.2)" }}>
            <RefreshCw size={10} />
          </button>
        </div>

        {history.length === 0 && (
          <div className="flex flex-col items-center py-8 text-center">
            <Film size={16} style={{ color: "rgba(255,255,255,0.06)" }} />
            <p className="text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.15)" }}>
              Tes vidéos apparaîtront ici
            </p>
          </div>
        )}

        {history.map((job) => (
          <button
            key={job.id}
            onClick={() => {
              if (job.status === "completed" && job.output_url) {
                setVideoUrl(job.output_url);
                setJobStatus("completed");
                setJobId(job.id);
                setSelectedModel(VIDEO_MODELS.find((m) => m.id === job.model) || VIDEO_MODELS[0]);
                setDuration(job.duration_seconds);
                if (job.prompt) setPrompt(job.prompt);
              }
            }}
            className="w-full text-left px-2 py-1.5 text-[10px] transition-colors hover:bg-white/5 rounded-sm"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            <div className="flex items-center gap-2">
              {/* Status indicator */}
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{
                background: job.status === "completed"
                  ? "#10B981"
                  : job.status === "failed"
                  ? "#E5484D"
                  : "#C75B39",
              }} />
              <span className="flex-1 truncate">
                {job.prompt?.slice(0, 50) || "Sans prompt"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 ml-3.5">
              <span style={{ color: getModelColor(job.model) }}>{getModelName(job.model)}</span>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>{formatDuration(job.duration_seconds)}</span>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>{formatTimeAgo(job.created_at)}</span>
            </div>
            {job.status === "processing" && (
              <div className="mt-1 h-0.5 w-full rounded-sm" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-sm" style={{ width: `${Math.max(5, job.progress * 100)}%`, background: getModelColor(job.model) }} />
              </div>
            )}
          </button>
        ))}

        {/* Divider */}
        {history.length > 0 && (
          <div className="pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <Link
              href="/studio/history"
              className="flex items-center justify-center gap-1 py-1.5 text-[9px] transition-opacity hover:opacity-70"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Voir tout l&apos;historique
            </Link>
          </div>
        )}

        {/* Inspirations */}
        <div className="pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="text-[10px] uppercase tracking-wider block mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
            <Lightbulb size={10} className="inline mr-1" /> Idées de prompts
          </span>
          <div className="space-y-1">
            {[
              "Danseur en silhouette, éclairage néon, ralenti artistique",
              "Transition rapide entre 3 tenues différentes, fond blanc studio",
              "Créateur marchant vers la caméra, regard confiant, cityscape",
              "Vidéo produit à 360°, reflets sur surfaces premium",
            ].map((idea, i) => (
              <button
                key={i}
                onClick={() => setPrompt(idea)}
                className="text-[9px] px-2 py-2 rounded-sm text-left transition-colors hover:bg-white/5 block w-full"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)" }}
              >
                "{idea}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Inline Styles for shimmer animation ─── */}
      <style jsx>{`
        .shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.03) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 2.5s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
