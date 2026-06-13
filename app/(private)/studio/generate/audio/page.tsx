"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Sparkles, Music, Mic, FileText, Download, Play, Pause,
  Loader, Clock, Heart, TrendingUp, Upload, Check, X,
  ChevronDown, AlertTriangle, Volume2,
} from "lucide-react";
import Link from "next/link";

// ─── Types ───

type MusicStyle = "Hip-hop" | "Pop" | "Cinematic" | "EDM" | "Lo-fi" | "Ambient" | "Jazz" | "Classical";
type MusicDuration = 15 | 30 | 60 | 120 | 300;
type Tab = "music" | "voice" | "transcribe" | "library";
type Emotion = "neutral" | "joyful" | "calm" | "sad" | "angry";

interface TrackResult {
  url: string;
  title: string;
  duration: number;
}

interface LibraryTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  mood: string[];
  genre: string;
  tempo: string;
  source: string;
  trending: boolean;
  previewUrl: string;
  tags: string[];
}

// ─── Constants ───

const MUSIC_STYLES: MusicStyle[] = ["Hip-hop", "Pop", "Cinematic", "EDM", "Lo-fi", "Ambient", "Jazz", "Classical"];
const DURATIONS: MusicDuration[] = [15, 30, 60, 120, 300];
const EMOTIONS: { value: Emotion; label: string }[] = [
  { value: "neutral", label: "Neutre" },
  { value: "joyful", label: "Joyeux" },
  { value: "calm", label: "Calme" },
  { value: "sad", label: "Triste" },
  { value: "angry", label: "Énervé" },
];
const LIBRARY_MOODS = ["calm", "happy", "energetic", "epic", "dark", "peaceful", "dramatic"];
const LIBRARY_GENRES = ["Lo-fi", "Electronic", "Ambient", "Hip-hop", "Cinematic", "Pop", "Jazz", "Classical"];

const formatDuration = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
};

// ─── Main Page ───

export default function GenerateAudioPage() {
  const [tab, setTab] = useState<Tab>("music");
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/studio/credits").then(r => r.json()).then(d => {
      if (d.balance !== undefined) setCredits(d.balance);
    }).catch(() => {});
  }, []);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* ─── Tab Navigation ─── */}
      <div className="flex shrink-0 px-4 gap-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "var(--bg-primary)" }}>
        <TabBtn active={tab === "music"} onClick={() => setTab("music")} icon={Music} label="Musique IA" />
        <TabBtn active={tab === "voice"} onClick={() => setTab("voice")} icon={Mic} label="Clonage vocal" premium />
        <TabBtn active={tab === "transcribe"} onClick={() => setTab("transcribe")} icon={FileText} label="Sous-titres" />
        <TabBtn active={tab === "library"} onClick={() => setTab("library")} icon={Heart} label="Bibliothèque" />
        <div className="flex-1" />
        <div className="flex items-center text-[10px] px-2" style={{ color: "rgba(255,255,255,0.2)" }}>
          {credits !== null ? `${credits} crédits` : ""}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === "music" && <MusicSection credits={credits} />}
        {tab === "voice" && <VoiceSection credits={credits} />}
        {tab === "transcribe" && <TranscribeSection credits={credits} />}
        {tab === "library" && <LibrarySection />}
      </div>
    </div>
  );
}

// ─── Tab Button ───

function TabBtn({ active, onClick, icon: Icon, label, premium }: { active: boolean; onClick: () => void; icon: any; label: string; premium?: boolean }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 px-3 py-2.5 text-[11px] transition-all relative" style={{ color: active ? "var(--accent)" : "rgba(255,255,255,0.4)", borderBottom: active ? "1px solid var(--accent)" : "1px solid transparent" }}>
      <Icon size={13} />
      {label}
      {premium && (
        <span className="text-[7px] uppercase tracking-wider px-1 py-0.5 rounded-sm" style={{ background: "rgba(199,91,57,0.1)", color: "var(--accent)" }}>Premium</span>
      )}
    </button>
  );
}

// ════════════════════════════════════════════════
// SECTION 1: MUSIC GENERATION
// ════════════════════════════════════════════════

function MusicSection({ credits }: { credits: number | null }) {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState<MusicDuration>(30);
  const [style, setStyle] = useState<MusicStyle>("Lo-fi");
  const [generating, setGenerating] = useState(false);
  const [tracks, setTracks] = useState<TrackResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/studio/generate/audio/music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), duration, style, count: 3 }),
      });
      if (res.status === 402) { const d = await res.json(); setError(d.error); return; }
      if (!res.ok) { const d = await res.json(); setError(d.error || "Erreur"); return; }
      const data = await res.json();
      setTracks(data.tracks || []);
      if (data.credits_remaining !== undefined && credits !== null) {
        // Update parent credits
      }
    } catch { setError("Erreur réseau"); }
    finally { setGenerating(false); }
  };

  const handlePlay = (url: string, id: string) => {
    if (playingId === id) { audioRef.current?.pause(); setPlayingId(null); return; }
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(url);
    audio.onended = () => setPlayingId(null);
    audio.play();
    audioRef.current = audio;
    setPlayingId(id);
  };

  const handleDownload = async (url: string, title: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}.wav`;
    a.click();
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div className="mb-2">
        <h1 className="text-xl italic" style={{ fontFamily: "var(--font-studio)", color: "var(--text-primary)" }}>Génération de musique</h1>
        <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Crée de la musique libre de droits pour tes vidéos, Suno, Mubert, Stability Audio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left: controls */}
        <div className="space-y-4 md:col-span-1">
          <div>
            <label className="text-[10px] uppercase tracking-wider mb-1.5 block" style={{ color: "rgba(255,255,255,0.3)" }}>Prompt</label>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
              placeholder="musique chill cinematic pour vidéo lifestyle..."
              className="w-full text-xs bg-transparent outline-none resize-none px-2.5 py-2 rounded-sm" rows={4}
              style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider mb-1.5 block" style={{ color: "rgba(255,255,255,0.3)" }}>Style</label>
            <div className="flex flex-wrap gap-1">
              {MUSIC_STYLES.map((s) => (
                <button key={s} onClick={() => setStyle(s)}
                  className="px-2 py-1 text-[9px] rounded-sm transition-all"
                  style={{ border: `1px solid ${style === s ? "rgba(199,91,57,0.3)" : "rgba(255,255,255,0.06)"}`,
                    background: style === s ? "rgba(199,91,57,0.06)" : "transparent",
                    color: style === s ? "var(--accent)" : "rgba(255,255,255,0.4)" }}>{s}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider mb-1.5 block" style={{ color: "rgba(255,255,255,0.3)" }}>Durée</label>
            <div className="flex gap-1">
              {DURATIONS.map((d) => (
                <button key={d} onClick={() => setDuration(d)}
                  className="flex-1 px-2 py-1.5 text-[9px] rounded-sm transition-all"
                  style={{ border: `1px solid ${duration === d ? "rgba(199,91,57,0.3)" : "rgba(255,255,255,0.06)"}`,
                    background: duration === d ? "rgba(199,91,57,0.06)" : "transparent",
                    color: duration === d ? "var(--accent)" : "rgba(255,255,255,0.4)" }}>{d}s</button>
              ))}
            </div>
          </div>

          <button onClick={handleGenerate} disabled={generating || !prompt.trim()}
            className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-30 rounded-sm"
            style={{ background: "var(--accent)", color: "var(--text-primary)" }}>
            {generating ? <Loader size={12} className="animate-spin" /> : <Sparkles size={12} />}
            {generating ? "Génération..." : "Générer 3 variations"}
          </button>

          <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.15)" }}>
            Coût : 3 crédits · 3 variations · démo si pas de clé API
          </p>
        </div>

        {/* Right: results */}
        <div className="md:col-span-2 space-y-3">
          {error && (
            <div className="px-3 py-2 text-xs rounded-sm" style={{ background: "rgba(229,72,77,0.08)", border: "1px solid rgba(229,72,77,0.2)", color: "var(--danger)" }}>{error}</div>
          )}

          {generating && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader size={24} className="animate-spin" style={{ color: "var(--accent)" }} />
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>Génération de musique en cours...</p>
            </div>
          )}

          {tracks.length > 0 && !generating && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Music size={14} style={{ color: "var(--success)" }} />
                <span className="text-[11px]" style={{ color: "var(--text-primary)" }}>3 variations générées</span>
              </div>
              {tracks.map((track, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-sm" style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
                  <button onClick={() => handlePlay(track.url, `track-${i}`)}
                    className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-white/10"
                    style={{ background: playingId === `track-${i}` ? "var(--accent)" : "rgba(255,255,255,0.06)" }}>
                    {playingId === `track-${i}` ? <Pause size={12} /> : <Play size={12} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] truncate" style={{ color: "var(--text-primary)" }}>{track.title}</div>
                    <div className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                      <Clock size={8} className="inline mr-1" />{formatDuration(track.duration)} · {style}
                    </div>
                  </div>
                  <button onClick={() => handleDownload(track.url, track.title)}
                    className="p-1.5 transition-colors hover:bg-white/10 rounded-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
                    <Download size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {tracks.length === 0 && !generating && !error && (
            <div className="flex flex-col items-center justify-center py-16">
              <Music size={32} style={{ color: "rgba(255,255,255,0.06)" }} />
              <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.15)" }}>
                Décris la musique, choisis un style, génère 3 variations
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
// SECTION 2: VOICE CLONING
// ════════════════════════════════════════════════

function VoiceSection({ credits }: { credits: number | null }) {
  const [step, setStep] = useState<"sample" | "setup" | "ready">("sample");
  const [voiceId, setVoiceId] = useState<string | null>(null);
  const [sampleFile, setSampleFile] = useState<File | null>(null);
  const [sampleUrl, setSampleUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [setupProgress, setSetupProgress] = useState(0);
  const [text, setText] = useState("");
  const [emotion, setEmotion] = useState<Emotion>("neutral");
  const [speed, setSpeed] = useState(50);
  const [generating, setGenerating] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSampleFile(file);
    setSampleUrl(URL.createObjectURL(file));
    setStep("setup");
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setSampleUrl(url);
        setSampleFile(new File([blob], "recording.webm", { type: "audio/webm" }));
        setStep("setup");
        stream.getTracks().forEach(t => t.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch { setError("Microphone non accessible"); }
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const handleSetup = async () => {
    if (!sampleUrl) return;
    setSetupProgress(0);
    const interval = setInterval(() => setSetupProgress(p => Math.min(90, p + 10)), 1000);

    try {
      const res = await fetch("/api/studio/generate/audio/voice-clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setup", audio_url: sampleUrl, name: "Ma voix" }),
      });
      clearInterval(interval);
      setSetupProgress(100);
      if (!res.ok) { const d = await res.json(); setError(d.error); return; }
      const data = await res.json();
      setVoiceId(data.voice_id);
      setTimeout(() => setStep("ready"), 500);
    } catch {
      clearInterval(interval);
      setError("Erreur de configuration");
    }
  };

  const handleGenerate = async () => {
    if (!text.trim() || !voiceId) return;
    setGenerating(true);
    setError(null);
    setResultUrl(null);
    try {
      const res = await fetch("/api/studio/generate/audio/voice-clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", voice_id: voiceId, text: text.trim(), emotion, speed: speed / 100 }),
      });
      if (res.status === 402) { const d = await res.json(); setError(d.error); return; }
      if (!res.ok) { const d = await res.json(); setError(d.error); return; }
      const data = await res.json();
      setResultUrl(data.audio_url);
    } catch { setError("Erreur de génération"); }
    finally { setGenerating(false); }
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6">
      <div className="mb-2">
        <h1 className="text-xl italic" style={{ fontFamily: "var(--font-studio)", color: "var(--text-primary)" }}>Clonage vocal</h1>
        <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
          Crée un modèle de ta voix avec ElevenLabs, voice-over, podcasts, narration
        </p>
      </div>

      {!acceptedTerms && (
        <div className="px-4 py-3 rounded-sm space-y-2" style={{ background: "rgba(199,91,57,0.04)", border: "1px solid rgba(199,91,57,0.1)" }}>
          <p className="text-[11px]" style={{ color: "var(--accent)" }}>
            🔒 Usage exclusivement personnel
          </p>
          <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            En utilisant cette fonctionnalité, tu certifies que :
            · Tu clones ta PROPRE voix uniquement
            · Tu n'imiteras pas une personne publique sans consentement
            · Tout usage abusif peut entraîner la suspension de ton compte
          </p>
          <button onClick={() => setAcceptedTerms(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] rounded-sm transition-opacity hover:opacity-80"
            style={{ background: "var(--accent)", color: "var(--text-primary)" }}>
            <Check size={10} /> J'accepte ces conditions
          </button>
        </div>
      )}

      {acceptedTerms && (
        <>
          {/* Step 1: Sample */}
          {step === "sample" && (
            <div className="space-y-3">
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                Enregistre ~1 minute de ta voix pour créer ton modèle vocal
              </p>
              <div className="flex gap-2">
                <label className="flex flex-col items-center gap-2 flex-1 px-4 py-6 rounded-sm cursor-pointer transition-colors hover:bg-white/5"
                  style={{ border: "1px dashed rgba(255,255,255,0.1)" }}>
                  <Upload size={20} style={{ color: "rgba(255,255,255,0.2)" }} />
                  <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>Uploader un fichier audio</span>
                  <input type="file" accept="audio/*" className="hidden" onChange={handleFileSelect} />
                </label>
                <button onClick={recording ? handleStopRecording : handleStartRecording}
                  className="flex flex-col items-center gap-2 flex-1 px-4 py-6 rounded-sm transition-colors hover:bg-white/5"
                  style={{ border: `1px solid ${recording ? "rgba(229,72,77,0.3)" : "rgba(255,255,255,0.1)"}`,
                    background: recording ? "rgba(229,72,77,0.06)" : "transparent" }}>
                  <span className={`text-xl ${recording ? "animate-pulse" : ""}`} style={{ color: recording ? "var(--danger)" : "rgba(255,255,255,0.2)" }}>
                    {recording ? "🔴" : "🎤"}
                  </span>
                  <span className="text-[10px]" style={{ color: recording ? "var(--danger)" : "rgba(255,255,255,0.3)" }}>
                    {recording ? "Arrêter l'enregistrement" : "Enregistrer"}
                  </span>
                </button>
              </div>
              {sampleUrl && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-sm text-[10px]" style={{ background: "rgba(16,185,129,0.06)", color: "var(--success)" }}>
                  <Check size={10} /> Échantillon prêt
                </div>
              )}
            </div>
          )}

          {/* Step 2: Setup progress */}
          {step === "setup" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader size={24} className="animate-spin" style={{ color: "var(--accent)" }} />
              <div className="w-full max-w-sm space-y-2">
                <div className="relative h-1 w-full rounded-sm" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="absolute left-0 top-0 h-full rounded-sm transition-all" style={{ width: `${setupProgress}%`, background: "var(--accent)" }} />
                </div>
                <p className="text-[10px] text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Création du modèle vocal... ~5-10 min
                </p>
              </div>
              <button onClick={handleSetup} disabled={setupProgress > 0}
                className="flex items-center gap-1.5 px-4 py-2 text-[10px] rounded-sm transition-opacity hover:opacity-80 disabled:opacity-30"
                style={{ background: "var(--accent)", color: "var(--text-primary)" }}>
                Démarrer la création du modèle (10 crédits)
              </button>
            </div>
          )}

          {/* Step 3: Ready - Generate */}
          {step === "ready" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-3 py-2 rounded-sm text-[10px]" style={{ background: "rgba(16,185,129,0.06)", color: "var(--success)" }}>
                <Check size={10} /> Modèle vocal prêt
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider mb-1.5 block" style={{ color: "rgba(255,255,255,0.3)" }}>Texte à dire</label>
                <textarea value={text} onChange={(e) => setText(e.target.value)}
                  placeholder="Écris le texte que ta voix va prononcer..."
                  className="w-full text-xs bg-transparent outline-none resize-none px-2.5 py-2 rounded-sm" rows={4}
                  style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider mb-1.5 block" style={{ color: "rgba(255,255,255,0.3)" }}>Émotion</label>
                  <div className="flex flex-wrap gap-1">
                    {EMOTIONS.map((e) => (
                      <button key={e.value} onClick={() => setEmotion(e.value)}
                        className="px-2 py-1 text-[9px] rounded-sm transition-all"
                        style={{ border: `1px solid ${emotion === e.value ? "rgba(199,91,57,0.3)" : "rgba(255,255,255,0.06)"}`,
                          background: emotion === e.value ? "rgba(199,91,57,0.06)" : "transparent",
                          color: emotion === e.value ? "var(--accent)" : "rgba(255,255,255,0.4)" }}>{e.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider mb-1.5 block" style={{ color: "rgba(255,255,255,0.3)" }}>Vitesse: {speed}%</label>
                  <input type="range" min={30} max={100} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full" />
                </div>
              </div>

              {error && (
                <div className="px-3 py-2 text-xs rounded-sm" style={{ background: "rgba(229,72,77,0.08)", border: "1px solid rgba(229,72,77,0.2)", color: "var(--danger)" }}>{error}</div>
              )}

              <button onClick={handleGenerate} disabled={generating || !text.trim()}
                className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-30 rounded-sm"
                style={{ background: "var(--accent)", color: "var(--text-primary)" }}>
                {generating ? <Loader size={12} className="animate-spin" /> : <Mic size={12} />}
                {generating ? "Génération..." : "Générer l'audio (2 crédits)"}
              </button>

              {resultUrl && (
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-sm" style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
                  <Volume2 size={16} style={{ color: "var(--success)" }} />
                  <audio src={resultUrl} controls className="flex-1 h-8" />
                  <a href={resultUrl} download="voice-over.wav" className="p-1.5 transition-colors hover:bg-white/10 rounded-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
                    <Download size={12} />
                  </a>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════
// SECTION 3: TRANSCRIPTION & SUBTITLES
// ════════════════════════════════════════════════

function TranscribeSection({ credits }: { credits: number | null }) {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("fr");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ text: string; srt: string; segments: { start: number; end: number; text: string }[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleTranscribe = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("language", language);
      const res = await fetch("/api/studio/generate/audio/transcribe", {
        method: "POST",
        body: formData,
      });
      if (res.status === 402) { const d = await res.json(); setError(d.error); return; }
      if (!res.ok) { const d = await res.json(); setError(d.error); return; }
      const data = await res.json();
      setResult(data);
    } catch { setError("Erreur réseau"); }
    finally { setProcessing(false); }
  };

  const downloadSrt = () => {
    if (!result?.srt) return;
    const blob = new Blob([result.srt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "subtitles.srt"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6">
      <div className="mb-2">
        <h1 className="text-xl italic" style={{ fontFamily: "var(--font-studio)", color: "var(--text-primary)" }}>Transcription & Sous-titres</h1>
        <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Transcris l'audio d'une vidéo et génère des sous-titres SRT, Whisper API</p>
      </div>

      <div className="space-y-3">
        <label className="flex flex-col items-center gap-2 px-4 py-8 rounded-sm cursor-pointer transition-colors hover:bg-white/5"
          style={{ border: "1px dashed rgba(255,255,255,0.1)" }}>
          <FileText size={24} style={{ color: "rgba(255,255,255,0.15)" }} />
          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            {file ? file.name : "Upload une vidéo ou un fichier audio"}
          </span>
          {file && (
            <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.15)" }}>
              {(file.size / 1024 / 1024).toFixed(1)} MB
            </span>
          )}
          <input type="file" accept="audio/*,video/*" className="hidden" onChange={handleFileSelect} />
        </label>

        <div className="flex items-center gap-2">
          <select value={language} onChange={(e) => setLanguage(e.target.value)}
            className="text-[10px] bg-transparent px-2 py-1.5 rounded-sm outline-none"
            style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }}>
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="de">Deutsch</option>
            <option value="it">Italiano</option>
            <option value="pt">Português</option>
          </select>
          <button onClick={handleTranscribe} disabled={processing || !file}
            className="flex items-center gap-1.5 px-4 py-1.5 text-[10px] transition-opacity hover:opacity-80 disabled:opacity-30 rounded-sm"
            style={{ background: "var(--accent)", color: "var(--text-primary)" }}>
            {processing ? <Loader size={10} className="animate-spin" /> : <Sparkles size={10} />}
            {processing ? "Transcription..." : "Transcrire (1 crédit)"}
          </button>
        </div>

        {error && (
          <div className="px-3 py-2 text-xs rounded-sm" style={{ background: "rgba(229,72,77,0.08)", border: "1px solid rgba(229,72,77,0.2)", color: "var(--danger)" }}>{error}</div>
        )}

        {processing && (
          <div className="flex items-center justify-center py-8">
            <Loader size={20} className="animate-spin" style={{ color: "var(--accent)" }} />
            <span className="text-[10px] ml-2" style={{ color: "rgba(255,255,255,0.2)" }}>Transcription en cours...</span>
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
                Transcription ({result.segments.length} segments)
              </span>
              <button onClick={downloadSrt}
                className="flex items-center gap-1 px-2 py-1 text-[9px] rounded-sm transition-colors hover:bg-white/5"
                style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }}>
                <Download size={10} /> Télécharger SRT
              </button>
            </div>

            <div className="px-3 py-2 text-[11px] rounded-sm max-h-48 overflow-y-auto" style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", color: "rgba(255,255,255,0.6)" }}>
              {result.text}
            </div>

            <div className="max-h-48 overflow-y-auto space-y-0.5">
              {result.segments.map((seg, i) => (
                <div key={i} className="flex items-start gap-2 px-2 py-1 rounded-sm text-[9px]" style={{ background: "var(--bg-card)", color: "rgba(255,255,255,0.4)" }}>
                  <span className="shrink-0 font-mono" style={{ color: "rgba(255,255,255,0.15)" }}>
                    {formatMs(seg.start)} → {formatMs(seg.end)}
                  </span>
                  <span>{seg.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!file && !result && (
          <p className="text-[9px] text-center py-4" style={{ color: "rgba(255,255,255,0.1)" }}>
            Supporte MP3, WAV, MP4, MOV, etc. Jusqu'à 25MB. Whisper API (~0.006$/min)
          </p>
        )}
      </div>
    </div>
  );
}

function formatMs(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}.${Math.floor((sec % 1) * 10)}`;
}

// ════════════════════════════════════════════════
// SECTION 4: FREE MUSIC LIBRARY
// ════════════════════════════════════════════════

function LibrarySection() {
  const [tracks, setTracks] = useState<LibraryTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [mood, setMood] = useState("");
  const [genre, setGenre] = useState("");
  const [search, setSearch] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchTracks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (mood) params.set("mood", mood);
      if (genre) params.set("genre", genre);
      if (search) params.set("search", search);
      const res = await fetch(`/api/studio/generate/audio/library?${params}`);
      const data = await res.json();
      setTracks(data.tracks || []);
    } catch { setTracks([]); }
    finally { setLoading(false); }
  }, [mood, genre, search]);

  useEffect(() => { fetchTracks(); }, [fetchTracks]);

  const handlePlay = (id: string, previewUrl?: string) => {
    if (!previewUrl) return;
    if (playingId === id) { audioRef.current?.pause(); setPlayingId(null); return; }
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(previewUrl);
    audio.onended = () => setPlayingId(null);
    audio.play();
    audioRef.current = audio;
    setPlayingId(id);
  };

  // Generate a simple beep tone for demo (since we have no real URLs)
  const demoBeep = (id: string) => `/api/studio/generate/audio/music?demo=${id}`;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div className="mb-2">
        <h1 className="text-xl italic" style={{ fontFamily: "var(--font-studio)", color: "var(--text-primary)" }}>Bibliothèque musique libre</h1>
        <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Musiques libres de droits curées depuis Pixabay, FMA, Mixkit</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..."
          className="text-[10px] bg-transparent px-2.5 py-1.5 rounded-sm outline-none w-40"
          style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />

        <select value={mood} onChange={(e) => setMood(e.target.value)}
          className="text-[10px] bg-transparent px-2 py-1.5 rounded-sm outline-none"
          style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }}>
          <option value="">Toutes les ambiances</option>
          {LIBRARY_MOODS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        <select value={genre} onChange={(e) => setGenre(e.target.value)}
          className="text-[10px] bg-transparent px-2 py-1.5 rounded-sm outline-none"
          style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }}>
          <option value="">Tous les genres</option>
          {LIBRARY_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>

        {(mood || genre || search) && (
          <button onClick={() => { setMood(""); setGenre(""); setSearch(""); }}
            className="text-[9px] px-2 py-1 rounded-sm transition-colors hover:bg-white/5"
            style={{ border: "1px solid var(--border-default)", color: "rgba(255,255,255,0.3)" }}>
            Réinitialiser
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-8"><Loader size={16} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {tracks.map((track) => (
            <div key={track.id} className="flex items-center gap-3 px-3 py-2.5 rounded-sm" style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
              <button onClick={() => handlePlay(track.id)}
                className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-white/10"
                style={{ background: playingId === track.id ? "var(--accent)" : "rgba(255,255,255,0.06)" }}>
                {playingId === track.id ? <Pause size={12} /> : <Play size={12} />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] truncate" style={{ color: "var(--text-primary)" }}>{track.title}</span>
                  {track.trending && <TrendingUp size={10} style={{ color: "var(--accent)" }} />}
                </div>
                <div className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {track.artist} · {track.genre} · {formatDuration(track.duration)}
                </div>
                <div className="flex gap-1 mt-0.5">
                  {track.mood.slice(0, 2).map((m) => (
                    <span key={m} className="text-[7px] px-1 py-0.5 rounded-sm" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.2)" }}>{m}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[7px] px-1 py-0.5 rounded-sm" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.2)" }}>{track.source}</span>
                {track.previewUrl && (
                  <a href={track.previewUrl} download className="p-1 transition-colors hover:bg-white/10 rounded-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
                    <Download size={10} />
                  </a>
                )}
              </div>
            </div>
          ))}
          {tracks.length === 0 && (
            <div className="col-span-2 text-center py-8">
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.15)" }}>Aucune musique trouvée</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
