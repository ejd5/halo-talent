"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ArrowLeft, Loader } from "lucide-react";
import Link from "next/link";
import type { Track, Clip, AspectRatio, Draft, StickerDef, VideoTemplate, TransitionType, EffectFilter, ClipType } from "./components/editor-types";
import { DEFAULT_PROJECT, FPS, ASPECT_RATIOS, TRACK_COLORS } from "./components/editor-types";
import { generateId, formatDuration } from "./components/editor-utils";
import { EditorToolbar } from "./components/EditorToolbar";
import { EditorPreview } from "./components/EditorPreview";
import { EditorTimeline } from "./components/EditorTimeline";
import { EditorSidebar } from "./components/EditorSidebar";
import { TemplateLibrary } from "./components/TemplateLibrary";
import { StickerLibrary } from "./components/StickerLibrary";
import { EffectsPicker } from "./components/EffectsPicker";
import { CaptionGenerator } from "./components/CaptionGenerator";
import { AudioWaveform } from "./components/AudioWaveform";

export default function EditVideoPage() {
  // ─── Core State ───
  const [projectName, setProjectName] = useState(DEFAULT_PROJECT.name);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(DEFAULT_PROJECT.aspectRatio);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<EffectFilter>("none");
  const [currentTransition, setCurrentTransition] = useState<TransitionType>("none");

  // ─── Modal State ───
  const [showTemplates, setShowTemplates] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [showEffects, setShowEffects] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);

  // ─── Refs ───
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const draftIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const loadedMediaRef = useRef<Map<string, HTMLVideoElement | HTMLImageElement | HTMLAudioElement>>(new Map());
  const [importMode, setImportMode] = useState<"video" | "audio" | "image" | null>(null);

  // Derived state
  const totalFrames = Math.max(
    ...tracks.map((t) =>
      t.clips.reduce((max, c) => Math.max(max, c.startFrame + c.durationFrames), 0)
    ),
    DEFAULT_PROJECT.durationFrames
  );

  const selectedClip = selectedClipId
    ? tracks.flatMap((t) => t.clips).find((c) => c.id === selectedClipId) ?? null
    : null;
  const selectedTrack = selectedTrackId
    ? tracks.find((t) => t.id === selectedTrackId) ?? null
    : null;

  // ─── Canvas rendering ───
  const renderFrame = useCallback((frame: number) => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ar = ASPECT_RATIOS.find((a) => a.value === aspectRatio)!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const visibleTracks = tracks.filter((t) => t.visible && !t.locked);
    for (const track of visibleTracks) {
      for (const clip of track.clips) {
        const localFrame = frame - clip.startFrame;
        if (localFrame < 0 || localFrame >= clip.durationFrames) continue;

        const x = ((clip.props.x ?? 50) / 100) * canvas.width;
        const y = ((clip.props.y ?? 50) / 100) * canvas.height;
        const opacity = (clip.props.opacity ?? 100) / 100;

        ctx.save();
        ctx.globalAlpha = opacity;

        if (clip.type === "video" && clip.src) {
          const el = loadedMediaRef.current.get(clip.id) as HTMLVideoElement | undefined;
          if (el && el.readyState >= 2) {
            const trimOffset = clip.trimStart ?? 0;
            const seekTime = (localFrame / FPS) + trimOffset;
            if (Math.abs(el.currentTime - seekTime) > 0.5) el.currentTime = seekTime;
            ctx.drawImage(el, 0, 0, ar.w, ar.h);
          }
        } else if (clip.type === "image" && clip.src) {
          const img = loadedMediaRef.current.get(clip.id) as HTMLImageElement | undefined;
          if (img) {
            const iw = clip.props.width ?? ar.w * 0.8;
            const ih = clip.props.height ?? (iw / img.naturalWidth) * img.naturalHeight;
            ctx.drawImage(img, x - iw / 2, y - ih / 2, iw, ih);
          }
        } else if (clip.type === "sticker" && clip.props.stickerId) {
          ctx.font = "60px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(clip.props.stickerId, x, y + 20);
        } else if (clip.type === "text" && clip.props.text) {
          const fontSize = clip.props.fontSize ?? 32;
          ctx.font = `${clip.props.fontWeight || "bold"} ${fontSize}px ${clip.props.fontFamily || "sans-serif"}`;
          ctx.textAlign = clip.props.textAlign || "center";
          ctx.fillStyle = clip.props.color || "var(--text-primary)";
          ctx.shadowColor = "rgba(0,0,0,0.6)";
          ctx.shadowBlur = 8;
          ctx.fillText(clip.props.text, x, y + fontSize / 3);
          ctx.shadowBlur = 0;
        }

        // Apply effect filter on clip level
        const filter = clip.props.filter || currentFilter;
        if (filter !== "none") {
          ctx.globalAlpha = 1;
          ctx.fillStyle = filter === "grayscale" ? "rgba(100,100,100,0.1)" :
                          filter === "sepia" ? "rgba(112,66,20,0.15)" :
                          filter === "vintage" ? "rgba(100,50,30,0.1)" : "transparent";
        }

        ctx.restore();
      }
    }
  }, [tracks, aspectRatio, currentFilter]);

  // ─── Playback ───
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }
    lastFrameTimeRef.current = performance.now();
    const tick = (now: number) => {
      const delta = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;
      const frameAdvance = Math.max(1, Math.round((delta / 1000) * FPS));
      setCurrentFrame((prev) => {
        const next = prev + frameAdvance;
        if (next >= totalFrames) { setIsPlaying(false); return 0; }
        return next;
      });
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, [isPlaying, totalFrames]);

  useEffect(() => { renderFrame(currentFrame); }, [currentFrame, renderFrame]);

  // ─── Media import ───
  const handleImportMedia = useCallback(() => {
    setImportMode("video");
    fileInputRef.current!.accept = "video/*,audio/*,image/*";
    fileInputRef.current?.click();
  }, []);

  const handleImportAudio = useCallback(() => {
    setImportMode("audio");
    fileInputRef.current!.accept = "audio/*";
    fileInputRef.current?.click();
  }, []);

  const handleFileSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const clipType = file.type.startsWith("video/") ? "video" :
                     file.type.startsWith("audio/") ? "audio" : "image";
    const id = generateId();

    if (clipType === "video") {
      const video = document.createElement("video");
      video.src = url; video.crossOrigin = "anonymous"; video.preload = "auto";
      video.load();
      loadedMediaRef.current.set(id, video);
    } else if (clipType === "image") {
      const img = new Image();
      img.src = url;
      loadedMediaRef.current.set(id, img);
    } else if (clipType === "audio") {
      const audio = new Audio();
      audio.src = url;
      audio.preload = "auto";
      loadedMediaRef.current.set(id, audio);
    }

    let durationFrames = clipType === "image" ? FPS * 3 : clipType === "audio" ? FPS * 10 : FPS * 5;

    if (clipType === "video" || clipType === "audio") {
      const media = document.createElement(clipType === "video" ? "video" : "audio");
      media.preload = "metadata";
      media.src = url;
      media.onloadedmetadata = () => {
        durationFrames = Math.ceil(media.duration * FPS);
        addClip(clipType, id, url, file.name, durationFrames);
      };
      return;
    }

    addClip(clipType, id, url, file.name, durationFrames);
  }, []);

  const addClip = (type: Clip["type"], clipId: string, src: string, name: string, durationFrames: number) => {
    setTracks((prev) => {
      const existing = prev.find((t) => t.type === type && !t.locked);
      if (existing) {
        const lastClip = existing.clips[existing.clips.length - 1];
        const startFrame = lastClip ? lastClip.startFrame + lastClip.durationFrames : 0;
        return prev.map((t) =>
          t.id === existing.id
            ? { ...t, clips: [...t.clips, { id: clipId, type, name, src, thumbnail: type === "image" ? src : undefined, startFrame, durationFrames, props: {} } as Clip] }
            : t
        );
      }
      const trackName = type === "video" ? "Vidéo" : type === "audio" ? "Audio" : type === "text" ? "Texte" : type === "sticker" ? "Stickers" : "Images";
      return [...prev, { id: generateId(), type: type as Track["type"], name: trackName, clips: [{ id: clipId, type, name, src, thumbnail: type === "image" ? src : undefined, startFrame: 0, durationFrames, props: {} } as Clip], visible: true, locked: false }];
    });
    setHasUnsaved(true);
    setImportMode(null);
  };

  // ─── Text overlay ───
  const handleAddText = useCallback(() => {
    const clipId = generateId();
    setTracks((prev) => {
      const textTrack = prev.find((t) => t.type === "text");
      const newClip: Clip = { id: clipId, type: "text", name: "Texte", startFrame: 0, durationFrames: FPS * 3, props: { text: "Double-clic pour éditer", x: 50, y: 50, fontSize: 40, color: "var(--text-primary)", fontFamily: "sans-serif", fontWeight: "bold", textAlign: "center", opacity: 100 } };
      if (textTrack) return prev.map((t) => t.id === textTrack.id ? { ...t, clips: [...t.clips, newClip] } : t);
      return [...prev, { id: generateId(), type: "text" as const, name: "Texte", clips: [newClip], visible: true, locked: false }];
    });
    setSelectedClipId(clipId);
    setHasUnsaved(true);
  }, []);

  // ─── Sticker ───
  const handleAddSticker = useCallback((sticker: StickerDef) => {
    const clipId = generateId();
    setTracks((prev) => {
      const stickerTrack = prev.find((t) => t.type === "sticker");
      const newClip: Clip = { id: clipId, type: "sticker", name: sticker.label, startFrame: currentFrame, durationFrames: FPS * 3, props: { stickerId: sticker.emoji, x: 50, y: 50, opacity: 100, animation: "none" } };
      if (stickerTrack) return prev.map((t) => t.id === stickerTrack.id ? { ...t, clips: [...t.clips, newClip] } : t);
      return [...prev, { id: generateId(), type: "sticker" as const, name: "Stickers", clips: [newClip], visible: true, locked: false }];
    });
    setSelectedClipId(clipId);
    setShowStickers(false);
    setHasUnsaved(true);
  }, [currentFrame]);

  // ─── Template ───
  const handleSelectTemplate = useCallback((template: VideoTemplate) => {
    const newTracks: Track[] = [];
    const videoTrack: Track = { id: generateId(), type: "video", name: "Vidéo", clips: [], visible: true, locked: false };
    const textTrack: Track = { id: generateId(), type: "text", name: "Texte", clips: [], visible: true, locked: false };

    for (const scene of template.scenes) {
      const clipId = generateId();
      const clip: Clip = {
        id: clipId,
        type: scene.type as ClipType,
        name: scene.type === "text" ? `Texte` : `${scene.type}_${clipId.slice(-4)}`,
        startFrame: scene.startFrame,
        durationFrames: scene.duration,
        props: scene.props as any,
      };
      if (scene.type === "text") textTrack.clips.push(clip);
      else videoTrack.clips.push(clip);
    }

    if (videoTrack.clips.length > 0) newTracks.push(videoTrack);
    if (textTrack.clips.length > 0) newTracks.push(textTrack);

    setTracks(newTracks);
    setAspectRatio(template.aspectRatio);
    setShowTemplates(false);
    setHasUnsaved(true);
  }, []);

  // ─── Captions ───
  const handleCaptionsReady = useCallback(({ clips, srt }: { clips: Clip[]; srt: string }) => {
    if (clips.length === 0) return;
    setTracks((prev) => {
      const textTrack = prev.find((t) => t.type === "text");
      if (textTrack) return prev.map((t) => t.id === textTrack.id ? { ...t, clips: [...t.clips, ...clips] } : t);
      return [...prev, { id: generateId(), type: "text", name: "Sous-titres", clips, visible: true, locked: false }];
    });
    setShowCaptions(false);
    setHasUnsaved(true);
  }, []);

  // ─── Split clip ───
  const handleSplit = useCallback(() => {
    if (!selectedClipId || !selectedTrackId) return;
    setTracks((prev) =>
      prev.map((track) => {
        if (track.id !== selectedTrackId) return track;
        const clipIndex = track.clips.findIndex((c) => c.id === selectedClipId);
        if (clipIndex === -1) return track;
        const clip = track.clips[clipIndex];
        const splitFrame = currentFrame - clip.startFrame;
        if (splitFrame <= 0 || splitFrame >= clip.durationFrames) return track;

        const firstHalf: Clip = { ...clip, id: generateId(), durationFrames: splitFrame };
        const secondHalf: Clip = { ...clip, id: generateId(), startFrame: currentFrame, durationFrames: clip.durationFrames - splitFrame };
        const newClips = [...track.clips];
        newClips.splice(clipIndex, 1, firstHalf, secondHalf);
        return { ...track, clips: newClips };
      })
    );
    setHasUnsaved(true);
  }, [selectedClipId, selectedTrackId, currentFrame]);

  // ─── Track/clip operations ───
  const handleSelectClip = useCallback((clipId: string, trackId: string) => {
    setSelectedClipId(clipId); setSelectedTrackId(trackId);
  }, []);
  const handleToggleVisibility = useCallback((trackId: string) => {
    setTracks((prev) => prev.map((t) => t.id === trackId ? { ...t, visible: !t.visible } : t));
  }, []);
  const handleToggleLock = useCallback((trackId: string) => {
    setTracks((prev) => prev.map((t) => t.id === trackId ? { ...t, locked: !t.locked } : t));
  }, []);
  const handleDeleteClip = useCallback((clipId: string, trackId: string) => {
    setTracks((prev) => prev.map((t) => t.id === trackId ? { ...t, clips: t.clips.filter((c) => c.id !== clipId) } : t));
    setSelectedClipId((prev) => (prev === clipId ? null : prev));
    setHasUnsaved(true);
  }, []);
  const handleUpdateClip = useCallback((trackId: string, clipId: string, updates: Partial<Clip>) => {
    setTracks((prev) => prev.map((t) => t.id === trackId ? { ...t, clips: t.clips.map((c) => c.id === clipId ? { ...c, ...updates } as Clip : c) } : t));
    setHasUnsaved(true);
  }, []);
  const handleSidebarUpdateClip = useCallback((updates: Partial<Clip>) => {
    if (!selectedClipId || !selectedTrackId) return;
    handleUpdateClip(selectedTrackId, selectedClipId, updates);
  }, [selectedClipId, selectedTrackId, handleUpdateClip]);
  const handleAddTrack = useCallback(() => {
    setTracks((prev) => [...prev, { id: generateId(), type: "video", name: `Piste ${prev.length + 1}`, clips: [], visible: true, locked: false }]);
  }, []);
  const handleSeek = useCallback((frame: number) => { setCurrentFrame(Math.max(0, Math.min(frame, totalFrames))); }, [totalFrames]);
  const handlePlayPause = useCallback(() => { setIsPlaying((p) => !p); }, []);
  const handleRestart = useCallback(() => { setCurrentFrame(0); setIsPlaying(false); }, []);

  // ─── Effects ───
  const handleSelectTransition = useCallback((t: TransitionType) => {
    setCurrentTransition(t);
    if (selectedClipId && selectedTrackId) {
      handleUpdateClip(selectedTrackId, selectedClipId, { props: { ...selectedClip?.props, transition: t } });
    }
  }, [selectedClipId, selectedTrackId, selectedClip]);
  const handleSelectFilter = useCallback((f: EffectFilter) => {
    setCurrentFilter(f);
    if (selectedClipId && selectedTrackId) {
      handleUpdateClip(selectedTrackId, selectedClipId, { props: { ...selectedClip?.props, filter: f } });
    }
  }, [selectedClipId, selectedTrackId, selectedClip]);

  // ─── Export ───
  const handleExport = useCallback(async () => {
    setShowExportModal(true);
    setExporting(true);
    setExportProgress(0);
    try {
      const canvas = previewCanvasRef.current;
      if (!canvas) return;
      const ar = ASPECT_RATIOS.find((a) => a.value === aspectRatio)!;
      const totalExportFrames = totalFrames;
      const stream = canvas.captureStream(FPS);
      const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9", videoBitsPerSecond: 5_000_000 });
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      const exportFinished = new Promise<void>((resolve) => { recorder.onstop = () => resolve(); });
      recorder.start();
      for (let f = 0; f < totalExportFrames; f++) {
        renderFrame(f);
        setExportProgress(Math.round((f / totalExportFrames) * 100));
        await new Promise((r) => setTimeout(r, 0));
      }
      recorder.stop();
      await exportFinished;
      const webmBlob = new Blob(chunks, { type: "video/webm" });
      let finalBlob = webmBlob;
      try {
        const { FFmpeg } = await import("@ffmpeg/ffmpeg");
        const { fetchFile } = await import("@ffmpeg/util");
        const ffmpeg = new FFmpeg();
        await ffmpeg.load();
        ffmpeg.on("progress", ({ progress: p }) => { setExportProgress(Math.round(50 + p * 50)); });
        await ffmpeg.writeFile("input.webm", await fetchFile(webmBlob));
        await ffmpeg.exec(["-i", "input.webm", "-c:v", "libx264", "-preset", "fast", "-c:a", "aac", "output.mp4"]);
        const mp4Data = (await ffmpeg.readFile("output.mp4")) as BlobPart;
        finalBlob = new Blob([mp4Data], { type: "video/mp4" });
      } catch { console.warn("FFmpeg conversion failed, using webm"); }
      const ext = finalBlob.type.includes("mp4") ? "mp4" : "webm";
      const url = URL.createObjectURL(finalBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectName || "video"}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) { console.error("Export failed:", err); }
    finally { setExporting(false); setExportProgress(0); }
  }, [totalFrames, aspectRatio, projectName, renderFrame]);

  // ─── Drafts (auto-save 30s) ───
  useEffect(() => {
    draftIntervalRef.current = setInterval(() => {
      if (!hasUnsaved) return;
      try {
        localStorage.setItem("video-editor-draft", JSON.stringify({ id: "current", name: projectName, state: { tracks, project: { ...DEFAULT_PROJECT, name: projectName, aspectRatio } }, updatedAt: Date.now() }));
        setHasUnsaved(false);
      } catch { /* storage full */ }
    }, 30000);
    return () => { if (draftIntervalRef.current) clearInterval(draftIntervalRef.current); };
  }, [hasUnsaved, tracks, projectName, aspectRatio]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("video-editor-draft");
      if (saved) {
        const draft = JSON.parse(saved);
        if (draft.state) { setTracks(draft.state.tracks); setProjectName(draft.state.project.name); setAspectRatio(draft.state.project.aspectRatio as AspectRatio); }
      }
    } catch { /* ignore */ }
  }, []);

  const handleSave = useCallback(() => {
    localStorage.setItem("video-editor-draft", JSON.stringify({ id: "current", name: projectName, state: { tracks, project: { ...DEFAULT_PROJECT, name: projectName, aspectRatio } }, updatedAt: Date.now() }));
    setHasUnsaved(false);
  }, [tracks, projectName, aspectRatio]);

  // ─── Keyboard shortcuts ───
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") { e.preventDefault(); handlePlayPause(); }
      if (e.code === "Delete" || e.code === "Backspace") {
        if (selectedClipId && selectedTrackId) handleDeleteClip(selectedClipId, selectedTrackId);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handlePlayPause, handleDeleteClip, selectedClipId, selectedTrackId]);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* ─── Header ─── */}
      <div className="flex items-center gap-3 px-4 shrink-0" style={{ height: 40, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "var(--bg-primary)" }}>
        <Link href="/studio/edit" className="flex items-center gap-1 text-[11px] transition-opacity hover:opacity-70" style={{ color: "rgba(255,255,255,0.4)" }}>
          <ArrowLeft size={12} /> Studio
        </Link>
        <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
        <span className="text-[11px]" style={{ color: "var(--accent)" }}>Éditeur vidéo</span>
        <div className="flex-1" />
        {exporting && (
          <div className="flex items-center gap-2 text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            <Loader size={10} className="animate-spin" /> Export {exportProgress}%
          </div>
        )}
      </div>

      {/* ─── Hidden file input ─── */}
      <input ref={fileInputRef} type="file" accept="video/*,audio/*,image/*" className="hidden" onChange={handleFileSelected} />

      {/* ─── Toolbar ─── */}
      <EditorToolbar
        onImportMedia={handleImportMedia}
        onAddText={handleAddText}
        onOpenStickers={() => setShowStickers(true)}
        onOpenEffects={() => setShowEffects(true)}
        onOpenAudio={handleImportAudio}
        onOpenTemplates={() => setShowTemplates(true)}
        onOpenCaptions={() => setShowCaptions(true)}
        onExport={handleExport}
        onSplit={handleSplit}
        exporting={exporting}
        onSave={handleSave}
        hasUnsaved={hasUnsaved}
        hasSelection={!!selectedClipId}
      />

      {/* ─── Main area ─── */}
      <div className="flex flex-1 min-h-0">
        <EditorPreview currentFrame={currentFrame} totalFrames={totalFrames} isPlaying={isPlaying}
          aspectRatio={aspectRatio} onPlayPause={handlePlayPause} onRestart={handleRestart}
          onSeek={handleSeek} previewCanvasRef={previewCanvasRef} />
        <EditorSidebar selectedClip={selectedClip} selectedTrack={selectedTrack}
          aspectRatio={aspectRatio} projectName={projectName} totalFrames={totalFrames} tracks={tracks}
          onUpdateClip={handleSidebarUpdateClip} onChangeAspectRatio={setAspectRatio} onChangeProjectName={setProjectName}
          onSelectFilter={handleSelectFilter} onSelectTransition={handleSelectTransition} />
      </div>

      {/* ─── Timeline ─── */}
      <EditorTimeline tracks={tracks} currentFrame={currentFrame} selectedClipId={selectedClipId}
        zoom={zoom} scrollX={0} onSelectClip={handleSelectClip} onToggleVisibility={handleToggleVisibility}
        onToggleLock={handleToggleLock} onDeleteClip={handleDeleteClip} onSeek={handleSeek}
        onUpdateClip={handleUpdateClip} onAddTrack={handleAddTrack} />

      {/* ─── Audio waveform preview ─── */}
      {tracks.filter(t => t.type === "audio" && t.clips.length > 0).length > 0 && (
        <div className="shrink-0 px-3 py-1" style={{ background: "rgba(16,185,129,0.03)", borderTop: "1px solid var(--border-default)" }}>
          <div className="flex items-center gap-2 text-[9px] mb-1" style={{ color: "var(--success)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
            Audio
          </div>
          {tracks.filter(t => t.type === "audio").map(track =>
            track.clips.map(clip => clip.src ? (
              <AudioWaveform key={clip.id} audioUrl={clip.src} color="var(--success)" height={28} />
            ) : null)
          )}
        </div>
      )}

      {/* ─── Export Modal ─── */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }} onClick={() => !exporting && setShowExportModal(false)}>
          <div className="w-80 p-6 rounded-sm" style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)" }} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm mb-4" style={{ fontFamily: "var(--font-studio)", color: "var(--text-primary)" }}>Export de la vidéo</h3>
            <div className="space-y-3">
              <ExportInfo label="Format" value="MP4 (H.264)" />
              <ExportInfo label="Résolution" value={`${ASPECT_RATIOS.find((a) => a.value === aspectRatio)?.w ?? 1080}×${ASPECT_RATIOS.find((a) => a.value === aspectRatio)?.h ?? 1920}`} />
              <ExportInfo label="Images/s" value={`${FPS}`} />
              <ExportInfo label="Durée" value={formatDuration(totalFrames / FPS)} />
              {exporting && (
                <div className="space-y-1">
                  <div className="relative h-1 w-full rounded-sm" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="absolute left-0 top-0 h-full rounded-sm transition-all" style={{ width: `${exportProgress}%`, background: "var(--accent)" }} />
                  </div>
                  <p className="text-[9px] text-center" style={{ color: "rgba(255,255,255,0.2)" }}>
                    {exportProgress < 50 ? "Rendu des images..." : "Encodage..."}
                  </p>
                </div>
              )}
              {!exporting && (
                <button onClick={() => setShowExportModal(false)} className="w-full py-1.5 text-[10px] rounded-sm transition-colors hover:bg-white/5" style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }}>Fermer</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Modals ─── */}
      {showTemplates && <TemplateLibrary onSelect={handleSelectTemplate} onClose={() => setShowTemplates(false)} />}
      {showStickers && <StickerLibrary onSelect={handleAddSticker} onClose={() => setShowStickers(false)} />}
      {showEffects && <EffectsPicker onSelectTransition={handleSelectTransition} onSelectFilter={handleSelectFilter} currentTransition={currentTransition} currentFilter={currentFilter} onClose={() => setShowEffects(false)} />}
      {showCaptions && <CaptionGenerator onCaptionsReady={handleCaptionsReady} onClose={() => setShowCaptions(false)} totalDurationFrames={totalFrames} fps={FPS} />}

      {/* ─── Empty state ─── */}
      {tracks.length === 0 && !exporting && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ top: 88 }}>
          <div className="pointer-events-auto flex flex-col items-center gap-3 px-8 py-6 rounded-sm" style={{ background: "rgba(10,9,8,0.9)", border: "1px solid var(--border-default)" }}>
            <p className="text-sm" style={{ fontFamily: "var(--font-studio)", color: "var(--text-primary)" }}>Montage Vidéo</p>
            <p className="text-[10px] text-center max-w-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              Importe une vidéo, une image ou de l&apos;audio pour commencer. Utilise un template ou ajoute du texte, des stickers, des effets.
            </p>
            <div className="flex gap-2">
              <button onClick={handleImportMedia} className="flex items-center gap-1.5 px-4 py-2 text-xs transition-opacity hover:opacity-80 rounded-sm" style={{ background: "var(--accent)", color: "var(--text-primary)" }}>
                <ArrowLeft size={12} className="rotate-45" /> Importer
              </button>
              <button onClick={() => setShowTemplates(true)} className="flex items-center gap-1.5 px-4 py-2 text-xs transition-opacity hover:opacity-80 rounded-sm" style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }}>
                Templates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Status bar ─── */}
      <div className="flex items-center gap-3 px-3 shrink-0" style={{ height: 24, background: "var(--bg-primary)", borderTop: "1px solid var(--border-default)" }}>
        <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.15)" }}>
          Espace: Play/Pause · ⌫: Supprimer · Templates · Stickers · Effets · Sous-titres IA
        </span>
        <div className="flex-1" />
        <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.1)" }}>Sauvegarde auto toutes les 30s</span>
      </div>
    </div>
  );
}

// ─── Mini components ───

function ExportInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
      <span>{label}</span><span>{value}</span>
    </div>
  );
}
