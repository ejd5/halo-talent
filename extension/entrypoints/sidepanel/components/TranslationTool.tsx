import { useState } from "react";

interface Props {
  text: string;
  onTranslated: (text: string) => void;
}

const LANGUAGES = [
  { code: "en", label: "🇬🇧 English" },
  { code: "es", label: "🇪🇸 Español" },
  { code: "de", label: "🇩🇪 Deutsch" },
  { code: "pt", label: "🇵🇹 Português" },
  { code: "it", label: "🇮🇹 Italiano" },
  { code: "ja", label: "🇯🇵 日本語" },
];

export function TranslationTool({ text, onTranslated }: Props) {
  const [target, setTarget] = useState("en");

  // Placeholder — real translation via Halo API
  const handleTranslate = () => {
    onTranslated(`[Translated to ${target}] ${text}`);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <select
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="flex-1 px-2 py-1 rounded text-[10px] outline-none"
          style={{
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            color: "var(--text-primary)",
          }}
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleTranslate}
          className="text-[10px] font-semibold px-2 py-1 rounded"
          style={{ backgroundColor: "var(--accent)", color: "#fff" }}
        >
          Traduire
        </button>
      </div>
    </div>
  );
}
