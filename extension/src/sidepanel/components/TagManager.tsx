import { useState } from "react";
import { Plus } from "lucide-react";

interface Props {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
}

export function TagManager({ tags, onAdd, onRemove }: Props) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onAdd(trimmed);
      setInput("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-medium cursor-pointer"
            style={{
              backgroundColor: "rgba(249,115,22,0.08)",
              color: "var(--accent)",
            }}
            onClick={() => onRemove(tag)}
          >
            {tag} ✕
          </span>
        ))}
      </div>
      <div className="flex items-center gap-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Ajouter un tag..."
          className="flex-1 px-2 py-1 rounded text-[10px] outline-none"
          style={{
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            color: "var(--text-primary)",
          }}
        />
        <button
          onClick={handleAdd}
          className="p-1 rounded"
          style={{ color: "var(--accent)" }}
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
