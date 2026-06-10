"use client";

import { useState } from "react";
import { internalNotes } from "../../data";
import { formatDate, relativeTime } from "../../utils";
import { MessageSquare, Send } from "lucide-react";

type Props = { applicationId: string };

export function NotesTab({ applicationId }: Props) {
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState(internalNotes[applicationId] ?? []);

  const handleAdd = () => {
    if (!noteText.trim()) return;
    setNotes((prev) => [
      {
        id: `n-${Date.now()}`,
        application_id: applicationId,
        author: "Moi",
        content: noteText.trim(),
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);
    setNoteText("");
  };

  return (
    <div className="space-y-4 card-accent">
      {/* Add note */}
      <div>
        <div
          className="flex items-start gap-2 p-3"
          style={{ border: "1px solid var(--border-default)" }}
        >
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Ajouter une note interne... (Markdown supporté)"
            rows={3}
            className="w-full bg-transparent text-xs font-sans outline-none resize-none leading-relaxed"
            style={{ color: "#D0CCC6" }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] font-sans" style={{ color: "var(--text-secondary)" }}>
            <kbd className="px-1 py-0.5" style={{ border: "1px solid var(--border-default)" }}>⌘↵</kbd> pour envoyer
          </span>
          <button
            onClick={handleAdd}
            disabled={!noteText.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:opacity-80 disabled:opacity-30"
            style={{ background: "var(--accent)", color: "var(--text-primary)" }}
          >
            <Send size={12} strokeWidth={1.5} />
            Envoyer
          </button>
        </div>
      </div>

      {/* Notes list */}
      {notes.length === 0 ? (
        <p className="text-xs font-sans text-center py-6" style={{ color: "var(--text-secondary)" }}>
          Aucune note interne pour cette candidature.
        </p>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-3"
              style={{
                background: "var(--bg-card)",
                borderLeft: "2px solid rgba(199,91,57,0.2)",
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <MessageSquare size={11} strokeWidth={1.5} style={{ color: "var(--accent)" }} />
                <span className="text-xs font-sans font-medium" style={{ color: "#D0CCC6" }}>
                  {note.author}
                </span>
                <span className="text-[10px] font-sans" style={{ color: "var(--text-secondary)" }}>
                  {relativeTime(note.created_at)}
                </span>
              </div>
              <p className="text-xs font-sans leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {note.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
