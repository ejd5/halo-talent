import { useState } from "react";

interface Props {
  initialNotes: string;
  onSave: (notes: string) => void;
  placeholder?: string;
}

export function NoteEditor({
  initialNotes,
  onSave,
  placeholder = "Ajouter une note sur ce fan...",
}: Props) {
  const [notes, setNotes] = useState(initialNotes);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="space-y-2">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-3 py-2 rounded-lg text-xs resize-none outline-none"
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          color: "var(--text-primary)",
        }}
      />
      <button
        onClick={handleSave}
        className="text-[10px] font-medium px-3 py-1 rounded transition-all"
        style={{
          backgroundColor: saved ? "var(--success)" : "var(--accent)",
          color: "#fff",
        }}
      >
        {saved ? "✓ Sauvegardé" : "Sauvegarder"}
      </button>
    </div>
  );
}
