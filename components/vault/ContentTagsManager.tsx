"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

interface ContentTagsManagerProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function ContentTagsManager({ tags, onTagsChange }: ContentTagsManagerProps) {
  const locale = useLocale();
  const l = norm(locale);
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed || tags.includes(trimmed)) return;
    onTagsChange([...tags, trimmed]);
    setInput("");
  };

  const handleRemove = (tag: string) => {
    onTagsChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {tags.length === 0 ? (
          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.15)" }}>
            {t("content_vault.tags.empty", l)}
          </span>
        ) : (
          tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-2 py-0.5 rounded-sm text-[9px]"
              style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "var(--accent)" }}
            >
              {tag}
              <button onClick={() => handleRemove(tag)} className="hover:opacity-60">
                <X size={10} />
              </button>
            </span>
          ))
        )}
      </div>

      <div className="flex gap-1.5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("content_vault.tags.placeholder", l)}
          className="flex-1 text-[10px] bg-transparent px-2 py-1.5 rounded-sm outline-none"
          style={{
            color: "rgba(255,255,255,0.5)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim()}
          className="flex items-center gap-1 px-2 py-1.5 rounded-sm text-[9px] font-medium transition-opacity disabled:opacity-30"
          style={{ backgroundColor: "rgba(199,91,57,0.12)", color: "var(--accent)" }}
        >
          <Plus size={10} />
          {t("content_vault.tags.add", l)}
        </button>
      </div>
    </div>
  );
}
