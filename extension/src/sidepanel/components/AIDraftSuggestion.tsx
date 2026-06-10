interface Props {
  text: string;
  confidence: number;
  onInsert: (text: string) => void;
  onDismiss: () => void;
}

export function AIDraftSuggestion({
  text,
  confidence,
  onInsert,
  onDismiss,
}: Props) {
  return (
    <div
      className="rounded-xl p-3 space-y-2 animate-slide-up"
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
          style={{
            backgroundColor: "rgba(249,115,22,0.1)",
            color: "var(--accent)",
          }}
        >
          AI Suggestion · {Math.round(confidence * 100)}%
        </span>
        <button
          onClick={onDismiss}
          className="text-[9px]"
          style={{ color: "var(--text-tertiary)" }}
        >
          Ignorer
        </button>
      </div>

      <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {text}
      </p>

      <button
        onClick={() => onInsert(text)}
        className="w-full text-xs font-semibold py-1.5 rounded-lg transition-all"
        style={{ backgroundColor: "var(--accent)", color: "#fff" }}
      >
        Insérer dans le chat
      </button>
    </div>
  );
}
