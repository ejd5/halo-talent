"use client";

import { useState } from "react";
import { Bold, Italic, List, Link, Heading1, Heading2, Heading3, Pilcrow } from "lucide-react";

export function TextEditor({
  value,
  onChange,
  minHeight = 200,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  minHeight?: number;
  placeholder?: string;
}) {
  const [mode, setMode] = useState<"visual" | "markdown">("visual");

  const wrapSelection = (before: string, after: string) => {
    const ta = document.querySelector(".text-editor-textarea") as HTMLTextAreaElement;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const text = value;
    const newText = text.slice(0, start) + before + text.slice(start, end) + after + text.slice(end);
    onChange(newText);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const insertAtCursor = (text: string) => {
    const ta = document.querySelector(".text-editor-textarea") as HTMLTextAreaElement;
    if (!ta) return;
    const start = ta.selectionStart;
    const val = value;
    const newVal = val.slice(0, start) + text + val.slice(start);
    onChange(newVal);
  };

  return (
    <div className="border border-[var(--color-border)]">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-[var(--color-border)] bg-[var(--color-card)] flex-wrap">
        <ToolbarButton icon={<Bold size={13} />} onClick={() => wrapSelection("**", "**")} title="Gras" />
        <ToolbarButton icon={<Italic size={13} />} onClick={() => wrapSelection("_", "_")} title="Italique" />
        <ToolbarButton icon={<Link size={13} />} onClick={() => insertAtCursor("[texte](url)")} title="Lien" />
        <span className="w-px h-4 mx-1 bg-[var(--color-border)]" />
        <ToolbarButton icon={<Heading1 size={13} />} onClick={() => insertAtCursor("\n# ")} title="H1" />
        <ToolbarButton icon={<Heading2 size={13} />} onClick={() => insertAtCursor("\n## ")} title="H2" />
        <ToolbarButton icon={<Heading3 size={13} />} onClick={() => insertAtCursor("\n### ")} title="H3" />
        <span className="w-px h-4 mx-1 bg-[var(--color-border)]" />
        <ToolbarButton icon={<List size={13} />} onClick={() => insertAtCursor("\n- ")} title="Liste" />
        <ToolbarButton icon={<Pilcrow size={13} />} onClick={() => insertAtCursor("\n\n")} title="Paragraphe" />

        <div className="flex-1" />
        <div className="flex border border-[var(--color-border)] text-[10px]">
          <button
            onClick={() => setMode("visual")}
            className={`px-2 py-0.5 ${mode === "visual" ? "bg-[var(--color-accent)] text-white" : "hover:bg-[var(--color-card)]"}`}
          >
            Visual
          </button>
          <button
            onClick={() => setMode("markdown")}
            className={`px-2 py-0.5 ${mode === "markdown" ? "bg-[var(--color-accent)] text-white" : "hover:bg-[var(--color-card)]"}`}
          >
            Markdown
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="relative" style={{ minHeight }}>
        {mode === "markdown" && (
          <textarea
            className="text-editor-textarea w-full p-3 text-xs font-mono leading-relaxed bg-transparent border-0 resize-y focus:outline-none"
            style={{ minHeight }}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        )}
        {mode === "visual" && (
          <textarea
            className="text-editor-textarea w-full p-3 text-xs leading-relaxed bg-transparent border-0 resize-y focus:outline-none"
            style={{ minHeight }}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        )}
      </div>

      {/* Variables */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-t border-[var(--color-border)] bg-[var(--color-card)]">
        <span className="text-[9px] opacity-30 uppercase tracking-wider mr-1">Variables :</span>
        {["{nom_agence}", "{nb_creators}", "{annee}", "{email_contact}"].map((v) => (
          <button
            key={v}
            onClick={() => insertAtCursor(v)}
            className="text-[9px] px-1.5 py-[1px] border border-[var(--color-border)] opacity-40 hover:opacity-80 font-mono"
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}

function ToolbarButton({ icon, onClick, title }: { icon: React.ReactNode; onClick: () => void; title: string }) {
  return (
    <button
      onClick={onClick}
      className="p-1 hover:bg-[var(--color-base)] transition-colors rounded-[0px]"
      title={title}
    >
      {icon}
    </button>
  );
}
