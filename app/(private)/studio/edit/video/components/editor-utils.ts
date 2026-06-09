export function formatDuration(seconds: number): string {
  if (seconds < 1) return `${Math.round(seconds * 1000)}ms`;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export function formatFrame(frame: number, fps: number): string {
  const secs = Math.floor(frame / fps);
  const mins = Math.floor(secs / 60);
  const s = secs % 60;
  const f = frame % fps;
  return `${mins}:${s.toString().padStart(2, "0")}.${f.toString().padStart(2, "0")}`;
}

export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
