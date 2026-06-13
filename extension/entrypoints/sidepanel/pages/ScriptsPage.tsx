// ─── Scripts Page — Halo Companion ───────────

import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, Send, Search } from "lucide-react";
import { useCompanionStore } from "../stores/companion-store";
import { getScripts, insertScript } from "../lib/messaging";
import { SCRIPT_TONE_LABELS, type ChatScript, type ScriptCategory, type ScriptTone } from "@/src/types/message";
import type { Route, RouteState } from "../router";

type NavigateFn = (to: Route | RouteState, params?: Record<string, string>) => void;

interface Props { navigate: NavigateFn }

const CATEGORY_LABELS: Record<ScriptCategory, string> = {
  welcome: "Bienvenue",
  icebreaker: "Icebreaker",
  upsell: "Upsell",
  renewal: "Renouvellement",
  comeback: "Comeback",
  tip_ask: "Demande de tip",
  ppv_promo: "Promo PPV",
  thank_you: "Remerciement",
  birthday: "Anniversaire",
  custom: "Custom",
};

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as ScriptCategory[];

export function ScriptsPage({ navigate }: Props) {
  const { scripts, setScripts, isScriptsLoading, fanContext } = useCompanionStore();
  const [category, setCategory] = useState<ScriptCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [insertingId, setInsertingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const s = await getScripts();
    if (s.length > 0) setScripts(s);
    else setScripts(DEFAULT_SCRIPTS as unknown as ChatScript[]);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = scripts.filter((s) => {
    if (category !== "all" && s.category !== category) return false;
    if (search && !s.title.toLowerCase().includes(search.toLowerCase())
      && !s.content.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleInsert = async (script: ChatScript) => {
    setInsertingId(script.id);
    const displayName = fanContext?.displayName ?? "toi";
    await insertScript(script.content.replace(/\{fan_name\}/g, displayName));
    setInsertingId(null);
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "var(--bg-primary)" }}>
      <header className="shrink-0 px-4 py-3 flex items-center gap-3 border-b"
        style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)" }}>
        <button onClick={() => navigate("dashboard")} className="p-1 rounded" style={{ color: "var(--text-secondary)" }}>
          <ChevronLeft size={16} />
        </button>
        <h1 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Scripts</h1>
      </header>

      {/* Search */}
      <div className="shrink-0 p-3 pb-0">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
          <Search size={13} style={{ color: "var(--text-tertiary)" }} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un script..." className="flex-1 bg-transparent text-[11px] outline-none"
            style={{ color: "var(--text-primary)" }} />
        </div>
      </div>

      {/* Category filter */}
      <div className="shrink-0 px-3 py-2 flex gap-1.5 overflow-x-auto">
        <button onClick={() => setCategory("all")}
          className="text-[10px] px-2 py-1 rounded-full whitespace-nowrap transition-colors"
          style={{
            backgroundColor: category === "all" ? "var(--accent-soft)" : "var(--bg-card)",
            color: category === "all" ? "var(--accent)" : "var(--text-secondary)",
          }}>Tous</button>
        {ALL_CATEGORIES.slice(0, 8).map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)}
            className="text-[10px] px-2 py-1 rounded-full whitespace-nowrap transition-colors"
            style={{
              backgroundColor: category === cat ? "var(--accent-soft)" : "var(--bg-card)",
              color: category === cat ? "var(--accent)" : "var(--text-secondary)",
            }}>
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Script list */}
      <div className="flex-1 overflow-y-auto p-3">
        {isScriptsLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl h-20 animate-pulse" style={{ backgroundColor: "var(--bg-surface)" }} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-2">
            {filtered.map((script) => (
              <div key={script.id} className="rounded-xl p-3 transition-all"
                style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <p className="text-[11px] font-semibold" style={{ color: "var(--text-primary)" }}>{script.title}</p>
                    <div className="flex gap-1 mt-0.5">
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-tertiary)" }}>
                        {CATEGORY_LABELS[script.category] ?? script.category}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}>
                        {SCRIPT_TONE_LABELS[script.tone] ?? script.tone}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] leading-relaxed line-clamp-2 mb-2" style={{ color: "var(--text-secondary)" }}>
                  {script.content}
                </p>
                <button onClick={() => handleInsert(script)}
                  disabled={insertingId === script.id}
                  className="flex items-center gap-1 px-3 py-1 rounded-md text-[10px] font-medium transition-all"
                  style={{
                    backgroundColor: insertingId === script.id ? "var(--success)" : "var(--accent)",
                    color: "#fff",
                  }}>
                  <Send size={10} />
                  {insertingId === script.id ? "Inséré ✓" : "Insérer dans le chat"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>Aucun script trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}

const DEFAULT_SCRIPTS = [
  { id: "1", title: "Message de bienvenue", category: "welcome" as ScriptCategory, content: "Hey ! Bienvenue dans mon univers 💕 N'hésite pas si tu as des questions !", tone: "friendly" as ScriptTone, tags: [], isCustom: false, usageCount: 42, createdAt: "2026-01-01", updatedAt: "2026-01-01" },
  { id: "2", title: "Demande de tips", category: "tip_ask" as ScriptCategory, content: "Si tu aimes mon contenu, n'hésite pas à me soutenir avec un petit tip 💸 Ça m'aide énormément !", tone: "grateful" as ScriptTone, tags: [], isCustom: false, usageCount: 28, createdAt: "2026-01-01", updatedAt: "2026-01-01" },
  { id: "3", title: "Upsell PPV", category: "ppv_promo" as ScriptCategory, content: "J'ai préparé un contenu exclusif pour toi 🔥 Dispo maintenant, ne rate pas ça...", tone: "flirty" as ScriptTone, tags: [], isCustom: false, usageCount: 35, createdAt: "2026-01-01", updatedAt: "2026-01-01" },
  { id: "4", title: "Relance fan dormant", category: "comeback" as ScriptCategory, content: "Ça fait un moment dis donc ! Tu m'as manqué 💕 Viens voir ce que j'ai préparé...", tone: "mysterious" as ScriptTone, tags: [], isCustom: false, usageCount: 19, createdAt: "2026-01-01", updatedAt: "2026-01-01" },
];
