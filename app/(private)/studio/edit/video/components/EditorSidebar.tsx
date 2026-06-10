"use client";

import type { Clip, Track, AspectRatio, TransitionType, EffectFilter } from "./editor-types";
import { ASPECT_RATIOS } from "./editor-types";

interface Props {
  selectedClip: Clip | null;
  selectedTrack: Track | null;
  aspectRatio: AspectRatio;
  projectName: string;
  totalFrames: number;
  tracks: Track[];
  onUpdateClip: (updates: Partial<Clip>) => void;
  onChangeAspectRatio: (ar: AspectRatio) => void;
  onChangeProjectName: (name: string) => void;
  onSelectFilter?: (filter: EffectFilter) => void;
  onSelectTransition?: (transition: TransitionType) => void;
}

export function EditorSidebar({
  selectedClip, selectedTrack, aspectRatio, projectName,
  totalFrames, tracks, onUpdateClip, onChangeAspectRatio,
  onChangeProjectName, onSelectFilter, onSelectTransition,
}: Props) {
  const framesToSecs = (f: number) => (f / 30).toFixed(1);

  return (
    <div className="w-64 shrink-0 overflow-y-auto p-4 space-y-4" style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Project info */}
      <Section title="Projet">
        <input value={projectName} onChange={(e) => onChangeProjectName(e.target.value)}
          className="w-full text-[11px] bg-transparent outline-none px-2 py-1 rounded-sm"
          style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
        <div className="text-[10px] space-y-1 mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
          <Row label="Durée" value={`${framesToSecs(totalFrames)}s`} />
          <Row label="Pistes" value={`${tracks.length}`} />
          <Row label="FPS" value="30" />
        </div>
      </Section>

      {/* Aspect ratio */}
      <Section title="Ratio">
        <div className="flex gap-1 flex-wrap">
          {ASPECT_RATIOS.map((ar) => (
            <button key={ar.value} onClick={() => onChangeAspectRatio(ar.value)}
              className="flex-1 px-2 py-1.5 text-[9px] rounded-sm transition-all"
              style={{ border: `1px solid ${aspectRatio === ar.value ? "rgba(199,91,57,0.3)" : "rgba(255,255,255,0.06)"}`,
                background: aspectRatio === ar.value ? "rgba(199,91,57,0.06)" : "transparent",
                color: aspectRatio === ar.value ? "var(--accent)" : "rgba(255,255,255,0.4)" }}>
              {ar.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Selected clip properties */}
      {selectedClip && (
        <>
          <Section title={`${selectedClip.name}`}>
            {/* Text editing */}
            {selectedClip.type === "text" && (
              <Field label="Texte">
                <textarea value={selectedClip.props.text || ""} onChange={(e) => onUpdateClip({ props: { ...selectedClip.props, text: e.target.value } })}
                  className="w-full text-[11px] bg-transparent outline-none resize-none px-2 py-1 rounded-sm" rows={3}
                  style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
              </Field>
            )}

            {/* Text style */}
            {selectedClip.type === "text" && (
              <div className="grid grid-cols-2 gap-1">
                <Field label="Police">
                  <select value={selectedClip.props.fontFamily || "sans-serif"} onChange={(e) => onUpdateClip({ props: { ...selectedClip.props, fontFamily: e.target.value } })}
                    className="w-full text-[10px] bg-transparent px-2 py-1 rounded-sm outline-none"
                    style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }}>
                    <option value="sans-serif">Sans-serif</option>
                    <option value="serif">Serif</option>
                    <option value="monospace">Mono</option>
                    <option value="display">Display</option>
                  </select>
                </Field>
                <Field label="Couleur">
                  <input type="color" value={selectedClip.props.color || "var(--text-primary)"} onChange={(e) => onUpdateClip({ props: { ...selectedClip.props, color: e.target.value } })}
                    className="w-full h-7 rounded-sm cursor-pointer" style={{ background: "transparent", border: "none" }} />
                </Field>
              </div>
            )}

            {/* Animation */}
            <Field label="Animation">
              <select value={selectedClip.props.animation || "none"} onChange={(e) => onUpdateClip({ props: { ...selectedClip.props, animation: e.target.value as any } })}
                className="w-full text-[10px] bg-transparent px-2 py-1 rounded-sm outline-none"
                style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }}>
                <option value="none">Aucune</option>
                <option value="fadeIn">Fade in</option>
                <option value="slideUp">Slide up</option>
                <option value="zoomIn">Zoom in</option>
                <option value="bounce">Bounce</option>
              </select>
            </Field>

            {/* Transition */}
            {onSelectTransition && (
              <Field label="Transition">
                <select value={selectedClip.props.transition || "none"} onChange={(e) => onUpdateClip({ props: { ...selectedClip.props, transition: e.target.value as any } })}
                  className="w-full text-[10px] bg-transparent px-2 py-1 rounded-sm outline-none"
                  style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }}>
                  <option value="none">Aucune</option>
                  <option value="fade">Fondu</option>
                  <option value="dissolve">Dissoudre</option>
                  <option value="slideLeft">Glisse gauche</option>
                  <option value="slideRight">Glisse droite</option>
                  <option value="zoomIn">Zoom avant</option>
                </select>
              </Field>
            )}

            {/* Position & size */}
            <div className="grid grid-cols-2 gap-1">
              <Field label="X"><Slider value={selectedClip.props.x ?? 50} onChange={(v) => onUpdateClip({ props: { ...selectedClip.props, x: v } })} /></Field>
              <Field label="Y"><Slider value={selectedClip.props.y ?? 50} onChange={(v) => onUpdateClip({ props: { ...selectedClip.props, y: v } })} /></Field>
            </div>

            <Field label="Opacité"><Slider value={selectedClip.props.opacity ?? 100} onChange={(v) => onUpdateClip({ props: { ...selectedClip.props, opacity: v } })} /></Field>

            {selectedClip.type === "image" && (
              <Field label="Taille"><Slider value={selectedClip.props.width ?? 80} min={10} max={100} onChange={(v) => onUpdateClip({ props: { ...selectedClip.props, width: v } })} /></Field>
            )}

            <div className="text-[10px] pt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
              Durée: {framesToSecs(selectedClip.durationFrames)}s · Début: {framesToSecs(selectedClip.startFrame)}s
            </div>
          </Section>
        </>
      )}

      {!selectedClip && (
        <div className="py-8 text-center">
          <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.15)" }}>
            Sélectionne un clip dans la timeline pour éditer ses propriétés
          </p>
        </div>
      )}

      {/* Track info */}
      {selectedTrack && !selectedClip && (
        <Section title={`Piste: ${selectedTrack.name}`}>
          <div className="text-[10px] space-y-1" style={{ color: "rgba(255,255,255,0.3)" }}>
            <Row label="Type" value={selectedTrack.type} />
            <Row label="Clips" value={`${selectedTrack.clips.length}`} />
            <Row label="Visible" value={selectedTrack.visible ? "Oui" : "Non"} />
            <Row label="Verrouillée" value={selectedTrack.locked ? "Oui" : "Non"} />
          </div>
        </Section>
      )}
    </div>
  );
}

// ─── Helpers ───

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>{title}</div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[9px] mb-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{label}</div>
      {children}
    </div>
  );
}

function Slider({ value, min = 0, max = 100, onChange }: { value: number; min?: number; max?: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="flex-1" />
      <span className="text-[9px] w-6 text-right" style={{ color: "rgba(255,255,255,0.3)" }}>{value}%</span>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span style={{ color: "rgba(255,255,255,0.5)" }}>{value}</span>
    </div>
  );
}
