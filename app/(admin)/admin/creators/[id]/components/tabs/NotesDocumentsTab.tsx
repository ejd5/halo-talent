"use client";

import { useState } from "react";
import { documents, internalNotes } from "../../../data";
import { relativeTime } from "../../../utils";
import { MessageSquare, FileText, Image as ImageIcon, FileSpreadsheet, Upload, Send, Plus } from "lucide-react";

type Props = { creatorId: string };

const docIcons: Record<string, React.ElementType> = {
  contract: FileText,
  photo: ImageIcon,
  report: FileSpreadsheet,
  other: FileText,
};

const docLabels: Record<string, string> = {
  contract: "Contrat",
  photo: "Photo",
  report: "Rapport",
  other: "Document",
};

export function NotesDocumentsTab({ creatorId }: Props) {
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState(internalNotes[creatorId] ?? []);
  const docs = documents[creatorId] ?? [];

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    setNotes((prev) => [
      {
        id: `n-${Date.now()}`,
        author: "Moi",
        content: noteText.trim(),
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);
    setNoteText("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 card-accent">
      {/* Notes internes */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={14} strokeWidth={1.5} style={{ color: "#C75B39" }} />
          <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.1em]" style={{ color: "#F5F0EB" }}>
            Notes internes
          </p>
        </div>

        {/* Add note */}
        <div className="mb-4 p-3" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Ajouter une note... (Markdown)"
            rows={3}
            className="w-full bg-transparent text-xs font-sans outline-none resize-none leading-relaxed"
            style={{ color: "#D0CCC6" }}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] font-sans" style={{ color: "#E0D8D0" }}>
              <kbd className="px-1 py-0.5" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>⌘↵</kbd>
            </span>
            <button
              onClick={handleAddNote}
              disabled={!noteText.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:opacity-80 disabled:opacity-30"
              style={{ background: "#C75B39", color: "#F5F0EB" }}
            >
              <Send size={11} strokeWidth={1.5} />
              Envoyer
            </button>
          </div>
        </div>

        {/* Notes list */}
        {notes.length === 0 ? (
          <p className="text-xs font-sans text-center py-6" style={{ color: "#E0D8D0" }}>
            Aucune note interne.
          </p>
        ) : (
          <div className="space-y-2">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-3"
                style={{ background: "rgba(255,255,255,0.02)", borderLeft: "2px solid rgba(199,91,57,0.2)" }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare size={10} strokeWidth={1.5} style={{ color: "#C75B39" }} />
                  <span className="text-[11px] font-sans font-medium" style={{ color: "#D0CCC6" }}>{note.author}</span>
                  <span className="text-[9px] font-sans" style={{ color: "#E0D8D0" }}>{relativeTime(note.created_at)}</span>
                </div>
                <p className="text-xs font-sans leading-relaxed" style={{ color: "#E0D8D0" }}>{note.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Documents */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText size={14} strokeWidth={1.5} style={{ color: "#C75B39" }} />
            <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.1em]" style={{ color: "#F5F0EB" }}>
              Documents
            </p>
          </div>
          <button
            className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-white/5"
            style={{ color: "#C75B39", border: "1px solid rgba(199,91,57,0.3)" }}
          >
            <Upload size={11} strokeWidth={1.5} />
            Uploader
          </button>
        </div>

        {docs.length === 0 ? (
          <p className="text-xs font-sans text-center py-6" style={{ color: "#E0D8D0" }}>
            Aucun document uploadé.
          </p>
        ) : (
          <div className="space-y-2">
            {docs.map((doc) => {
              const Icon = docIcons[doc.type] ?? FileText;
              return (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 p-3 transition-colors hover:bg-white/[0.02]"
                  style={{ border: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <div className="w-8 h-8 flex items-center justify-center" style={{ background: "rgba(199,91,57,0.1)" }}>
                    <Icon size={14} strokeWidth={1.5} style={{ color: "#C75B39" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-sans font-medium truncate" style={{ color: "#D0CCC6" }}>{doc.title}</p>
                    <p className="text-[10px] font-sans" style={{ color: "#E0D8D0" }}>
                      {docLabels[doc.type]} · {doc.uploaded_by} · {relativeTime(doc.uploaded_at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
