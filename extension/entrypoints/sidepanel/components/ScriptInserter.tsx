import type { ChatScript } from "@/src/types/message";

interface Props {
  script: ChatScript;
  onInsert: (text: string) => void;
}

export function ScriptInserter({ script, onInsert }: Props) {
  return (
    <div
      className="rounded-xl p-3 space-y-2 cursor-pointer transition-all hover:scale-[1.01]"
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
      }}
      onClick={() => onInsert(script.content)}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
          {script.title}
        </p>
        <span
          className="text-[9px] px-1.5 py-0.5 rounded"
          style={{
            backgroundColor: "rgba(249,115,22,0.08)",
            color: "var(--accent)",
          }}
        >
          {script.tone}
        </span>
      </div>
      <p
        className="text-[10px] leading-relaxed line-clamp-2"
        style={{ color: "var(--text-tertiary)" }}
      >
        {script.content}
      </p>
      <div className="flex items-center gap-1 flex-wrap">
        {script.tags.map((tag) => (
          <span
            key={tag}
            className="text-[8px] px-1 py-0.5 rounded"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-tertiary)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
