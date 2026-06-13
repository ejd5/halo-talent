import type { ScriptTone } from "@/src/types/message";
import { SCRIPT_TONE_LABELS } from "@/src/types/message";

interface Props {
  tone: ScriptTone;
  isActive: boolean;
  onClick?: () => void;
}

export function ToneGuardBadge({ tone, isActive, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-2 py-1 rounded text-[9px] font-medium transition-all"
      style={{
        backgroundColor: isActive
          ? "rgba(16,185,129,0.1)"
          : "var(--bg-surface)",
        border: `1px solid ${
          isActive ? "rgba(16,185,129,0.3)" : "var(--border-default)"
        }`,
        color: isActive ? "var(--success)" : "var(--text-tertiary)",
      }}
    >
      {isActive ? "🟢" : "⚪"} {SCRIPT_TONE_LABELS[tone]}
    </button>
  );
}
