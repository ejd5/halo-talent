"use client";

import { useState } from "react";
import { X, Loader, Download, Type, Mic } from "lucide-react";
import type { Caption, CaptionStyle } from "./editor-types";

interface Props {
  onCaptionsReady: (captions: { clips: import("./editor-types").Clip[]; srt: string }) => void;
  onClose: () => void;
  totalDurationFrames: number;
  fps: number;
}

export function CaptionGenerator({ onCaptionsReady, onClose, totalDurationFrames, fps }: Props) {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [generating, setGenerating] = useState(false);
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const [style, setStyle] = useState<CaptionStyle>({
    fontFamily: "sans-serif",
    fontSize: 28,
    color: "#FFFFFF",
    position: "bottom",
    background: true,
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudioFile(file);

    setGenerating(true);
    try {
      // Use OpenAI Whisper API for transcription
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model", "whisper-1");
      formData.append("response_format", "srt");

      const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("openai-api-key") || ""}`,
        },
        body: formData,
      });

      if (!res.ok) {
        // Fallback: generate mock captions from audio duration
        throw new Error("API failed");
      }

      const srtText = await res.text();
      const parsed = parseSRT(srtText);

      // Map SRT timestamps to frames
      const totalSecs = totalDurationFrames / fps;
      const validCaptions = parsed.filter((c) => c.end <= totalSecs * 1000);
      setCaptions(validCaptions.length > 0 ? validCaptions : generateMockCaptions(totalDurationFrames, fps));
    } catch {
      // Demo mode: generate mock captions
      setCaptions(generateMockCaptions(totalDurationFrames, fps));
    } finally {
      setGenerating(false);
    }
  };

  const generateMockCaptions = (totalFrames: number, frameRate: number): Caption[] => {
    const totalSecs = totalFrames / frameRate;
    const phrases = [
      "Salut tout le monde ✨",
      "Aujourd'hui on se retrouve",
      "pour une nouvelle vidéo",
      "J'espère que ça vous plaît",
      "Like et abonne-toi 🔥",
    ];
    const segDuration = totalSecs / phrases.length;
    return phrases.map((text, i) => ({
      start: Math.round(i * segDuration * 1000),
      end: Math.round((i + 1) * segDuration * 1000),
      text,
    }));
  };

  const applyCaptions = () => {
    if (!captions) return;
    const fps = 30;
    const clips: import("./editor-types").Clip[] = captions.map((cap, i) => ({
      id: `caption-${Date.now()}-${i}`,
      type: "text" as const,
      name: `Sous-titre ${i + 1}`,
      startFrame: Math.round((cap.start / 1000) * fps),
      durationFrames: Math.round(((cap.end - cap.start) / 1000) * fps),
      props: {
        text: cap.text,
        x: 50,
        y: style.position === "top" ? 15 : style.position === "middle" ? 50 : 85,
        fontSize: style.fontSize,
        fontFamily: style.fontFamily,
        color: style.color,
        fontWeight: "bold",
        textAlign: "center",
        opacity: 100,
      },
    }));

    const srtContent = captions
      .map((cap, i) => {
        const srtTime = (ms: number) => {
          const h = Math.floor(ms / 3600000);
          const m = Math.floor((ms % 3600000) / 60000);
          const s = Math.floor((ms % 60000) / 1000);
          const mls = ms % 1000;
          return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")},${mls.toString().padStart(3, "0")}`;
        };
        return `${i + 1}\n${srtTime(cap.start)} --> ${srtTime(cap.end)}\n${cap.text}\n`;
      })
      .join("\n");

    onCaptionsReady({ clips, srt: srtContent });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div
        className="w-[480px] max-h-[600px] flex flex-col rounded-sm"
        style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.08)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 className="text-sm flex items-center gap-2" style={{ fontFamily: "var(--font-studio)", color: "#F5F0EB" }}>
            <Mic size={14} style={{ color: "#C75B39" }} />
            Sous-titres automatiques
          </h3>
          <button onClick={onClose} className="p-1 transition-colors hover:bg-white/10 rounded-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            <X size={14} />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Audio upload */}
          <div>
            <label className="text-[10px] uppercase tracking-wider mb-1.5 block" style={{ color: "rgba(255,255,255,0.3)" }}>
              Fichier audio / vidéo
            </label>
            <label
              className="flex flex-col items-center justify-center gap-2 py-6 rounded-sm cursor-pointer transition-colors hover:bg-white/5"
              style={{ border: "1px dashed rgba(255,255,255,0.1)" }}
            >
              {generating ? (
                <Loader size={20} className="animate-spin" style={{ color: "#C75B39" }} />
              ) : (
                <>
                  <Mic size={20} style={{ color: "rgba(255,255,255,0.2)" }} />
                  <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {audioFile ? audioFile.name : "Clique pour importer l'audio"}
                  </span>
                </>
              )}
              <input type="file" accept="audio/*,video/*" className="hidden" onChange={handleFileSelect} disabled={generating} />
            </label>
            <p className="text-[8px] mt-1" style={{ color: "rgba(255,255,255,0.15)" }}>
              Whisper API (~0.006$/min) ou mode démo si pas de clé API
            </p>
          </div>

          {/* Style */}
          {captions && (
            <>
              <div>
                <label className="text-[10px] uppercase tracking-wider mb-1.5 block" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Style des sous-titres
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <div>
                    <div className="text-[9px] mb-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Position</div>
                    <select
                      value={style.position}
                      onChange={(e) => setStyle({ ...style, position: e.target.value as any })}
                      className="w-full text-[10px] bg-transparent px-2 py-1 rounded-sm outline-none"
                      style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#F5F0EB" }}
                    >
                      <option value="top">Haut</option>
                      <option value="middle">Milieu</option>
                      <option value="bottom">Bas</option>
                    </select>
                  </div>
                  <div>
                    <div className="text-[9px] mb-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Police</div>
                    <select
                      value={style.fontFamily}
                      onChange={(e) => setStyle({ ...style, fontFamily: e.target.value })}
                      className="w-full text-[10px] bg-transparent px-2 py-1 rounded-sm outline-none"
                      style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#F5F0EB" }}
                    >
                      <option value="sans-serif">Sans-serif</option>
                      <option value="serif">Serif</option>
                      <option value="monospace">Mono</option>
                    </select>
                  </div>
                  <div>
                    <div className="text-[9px] mb-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Taille</div>
                    <input
                      type="number"
                      value={style.fontSize}
                      onChange={(e) => setStyle({ ...style, fontSize: Number(e.target.value) })}
                      className="w-full text-[10px] bg-transparent px-2 py-1 rounded-sm outline-none"
                      style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#F5F0EB" }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={style.color}
                    onChange={(e) => setStyle({ ...style, color: e.target.value })}
                    className="w-8 h-6 rounded-sm cursor-pointer"
                    style={{ background: "transparent", border: "none" }}
                  />
                  <label className="flex items-center gap-1 text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                    <input
                      type="checkbox"
                      checked={style.background}
                      onChange={(e) => setStyle({ ...style, background: e.target.checked })}
                    />
                    Fond semi-transparent
                  </label>
                </div>
              </div>

              {/* Preview captions */}
              <div>
                <label className="text-[10px] uppercase tracking-wider mb-1.5 block" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Aperçu ({captions.length} sous-titres)
                </label>
                <div className="max-h-28 overflow-y-auto space-y-0.5">
                  {captions.map((cap, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 px-2 py-1 text-[10px] rounded-sm"
                      style={{ background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.5)" }}
                    >
                      <span className="shrink-0 text-[8px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                        {formatMs(cap.start)} → {formatMs(cap.end)}
                      </span>
                      <span>{cap.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={applyCaptions}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] rounded-sm transition-opacity hover:opacity-80"
                  style={{ background: "#C75B39", color: "#FFFFFF" }}
                >
                  <Type size={10} />
                  Appliquer les sous-titres
                </button>
                <button
                  onClick={() => {
                    if (!captions) return;
                    const srt = captions
                      .map((cap, i) => {
                        const srtTime = (ms: number) => {
                          const h = Math.floor(ms / 3600000);
                          const m = Math.floor((ms % 3600000) / 60000);
                          const s = Math.floor((ms % 60000) / 1000);
                          const mls = ms % 1000;
                          return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")},${mls.toString().padStart(3, "0")}`;
                        };
                        return `${i + 1}\n${srtTime(cap.start)} --> ${srtTime(cap.end)}\n${cap.text}\n`;
                      })
                      .join("\n");
                    const blob = new Blob([srt], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "subtitles.srt";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 text-[10px] rounded-sm transition-colors hover:bg-white/5"
                  style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
                >
                  <Download size={10} />
                  SRT
                </button>
              </div>
            </>
          )}

          {!audioFile && !generating && (
            <p className="text-[10px] text-center py-4" style={{ color: "rgba(255,255,255,0.15)" }}>
              Importe un fichier audio ou une vidéo contenant de la parole
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function formatMs(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}.${(ms % 1000).toString().padStart(3, "0").slice(0, 2)}`;
}

function parseSRT(srt: string): Caption[] {
  const blocks = srt.trim().split(/\n\s*\n/);
  return blocks
    .map((block) => {
      const lines = block.split("\n");
      if (lines.length < 3) return null;
      // Line 2: timestamps
      const timeMatch = lines[1].match(
        /(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/
      );
      if (!timeMatch) return null;
      const toMs = (h: string, m: string, s: string, ms: string) =>
        Number(h) * 3600000 + Number(m) * 60000 + Number(s) * 1000 + Number(ms);
      const text = lines.slice(2).join(" ");
      return {
        start: toMs(timeMatch[1], timeMatch[2], timeMatch[3], timeMatch[4]),
        end: toMs(timeMatch[5], timeMatch[6], timeMatch[7], timeMatch[8]),
        text,
      } as Caption;
    })
    .filter((c): c is Caption => c !== null);
}
