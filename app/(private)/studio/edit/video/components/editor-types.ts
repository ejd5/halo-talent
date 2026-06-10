export type ClipType = "video" | "audio" | "text" | "sticker" | "image";

export interface ClipProps {
  // Position & size
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  opacity?: number;
  // Text
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  textAlign?: "left" | "center" | "right";
  // Animation
  animation?: "none" | "fadeIn" | "slideUp" | "zoomIn" | "bounce";
  // Transition
  transition?: "none" | "fade" | "dissolve" | "slideLeft" | "slideRight" | "zoomIn";
  // Filter
  filter?: "none" | "grayscale" | "sepia" | "vintage" | "contrast" | "bright";
  // Sticker
  stickerId?: string;
  // Audio
  volume?: number;
}

export interface Clip {
  id: string;
  type: ClipType;
  name: string;
  src?: string;
  thumbnail?: string;
  startFrame: number;
  durationFrames: number;
  trimStart?: number;
  trimEnd?: number;
  props: ClipProps;
}

export interface Track {
  id: string;
  type: "video" | "audio" | "text" | "sticker";
  name: string;
  clips: Clip[];
  visible: boolean;
  locked: boolean;
}

export type AspectRatio = "9:16" | "1:1" | "16:9" | "4:5";

export interface ProjectSettings {
  width: number;
  height: number;
  fps: number;
  durationFrames: number;
  aspectRatio: AspectRatio;
  name: string;
}

export interface EditorState {
  project: ProjectSettings;
  tracks: Track[];
  currentFrame: number;
  selectedClipId: string | null;
  selectedTrackId: string | null;
  isPlaying: boolean;
  zoom: number;
  scrollX: number;
}

export interface Draft {
  id: string;
  name: string;
  state: {
    tracks: Track[];
    project: ProjectSettings;
  };
  updatedAt: number;
  thumbnail?: string;
}

export const DEFAULT_PROJECT: ProjectSettings = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationFrames: 450, // 15s at 30fps
  aspectRatio: "9:16",
  name: "Sans titre",
};

export const FPS = 30;

export const ASPECT_RATIOS: { value: AspectRatio; label: string; w: number; h: number }[] = [
  { value: "9:16", label: "Story", w: 1080, h: 1920 },
  { value: "1:1", label: "Carré", w: 1080, h: 1080 },
  { value: "16:9", label: "Paysage", w: 1920, h: 1080 },
  { value: "4:5", label: "Portrait", w: 1080, h: 1350 },
];

export const TRACK_COLORS: Record<string, string> = {
  video: "#7C3AED",
  audio: "var(--success)",
  text: "#F59E0B",
  sticker: "#EC4899",
};

// ─── Templates ───

export interface TemplateScene {
  type: "video" | "image" | "text";
  startFrame: number;
  duration: number;
  props: Record<string, unknown>;
  placeholder?: { label: string; accept: string };
}

export interface VideoTemplate {
  id: string;
  name: string;
  description: string;
  duration: number;
  aspectRatio: AspectRatio;
  icon: string;
  scenes: TemplateScene[];
  compatibleDna: boolean;
}

// ─── Stickers ───

export interface StickerDef {
  id: string;
  emoji: string;
  label: string;
  category: "emoji" | "shape" | "arrow" | "badge" | "frame";
}

// ─── Effects / Transitions ───

export type TransitionType = "none" | "fade" | "dissolve" | "slideLeft" | "slideRight" | "zoomIn";

export type EffectFilter = "none" | "grayscale" | "sepia" | "vintage" | "contrast" | "bright";

// ─── Captions ───

export interface Caption {
  start: number;
  end: number;
  text: string;
}

export interface CaptionStyle {
  fontFamily: string;
  fontSize: number;
  color: string;
  position: "top" | "middle" | "bottom";
  background: boolean;
}
