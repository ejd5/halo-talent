// ─── Chat Assist Page — WTF Companion ─────────────────────

import { useState, useCallback, useEffect } from "react";
import {
  ChevronLeft, Send, RefreshCw, Edit3, Check, Zap,
  MessageSquare, Gift, Sparkles, Copy,
} from "lucide-react";
import { useCompanionStore } from "../stores/companion-store";
import { insertScript, getAIDrafts, getScripts } from "../lib/messaging";
import { FAN_PERSONA_LABELS } from "@/src/types/fan";
import type { Route, RouteState } from "../router";

type NavigateFn = (to: Route | RouteState, params?: Record<string, string>) => void;
interface Props { navigate: NavigateFn }

const TONES = [
  { id: "flirty", label: "Flirty 💕", color: "#EC4899" },
  { id: "friendly", label: "Friendly 😊", color: "#10B981" },
  { id: "mysterious", label: "Mystère 🌙", color: "#8B5CF6" },
  { id: "upsell", label: "Upsell 💰", color: "#D8A95B" },
  { id: "direct", label: "Direct ⚡", color: "#3B82F6" },
];

export function ChatAssistPage({ navigate }: Props) {
  const { fanContext, conversationContext, aiDrafts, setAIDrafts, isDraftsLoading, scripts, setScripts } = useCompanionStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [insertingId, setInsertingId] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState("flirty");
  const [copied, setCopied] = useState<string | null>(null);

  const loadDrafts = useCallback(async () => {
    if (!fanContext) return;
    const drafts = await getAIDrafts(conversationContext?.lastMessagePreview);
    if (drafts.length > 0) setAIDrafts(drafts);
  }, [fanContext?.platformId]);

  const loadScripts = useCallback(async () => {
    const s = await getScripts();
    if (s.length > 0) setScripts(s);
  }, []);

  useEffect(() => { loadDrafts(); loadScripts(); }, [loadDrafts, loadScripts]);

  const handleInsert = async (text: string, id: string) => {
    setInsertingId(id);
    await insertScript(text);
    setInsertingId(null);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Header */}
      <header
        className="shrink-0 px-4 py-3 flex items-center gap-3 border-b"
        style={{ borderColor: "var(--border-default)", background: "linear-gradient(135deg, rgba(199,91,57,0.06) 0%, var(--bg-surface) 60%)" }}
      >
        <button onClick={() => navigate("dashboard")} className="p-1" style={{ color: "var(--text-secondary)" }}>
          <ChevronLeft size={16} />
        </button>
        <div className="flex items-center gap-2">
          <Zap size={14} style={{ color: "#C75B39" }} />
          <h1 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Chat Assist IA</h1>
        </div>
        {fanContext && (
          <div className="ml-auto flex items-center gap-1.5 px-2 py-1" style={{ backgroundColor: "rgba(199,91,57,0.1)", border: "1px solid rgba(199,91,57,0.2)" }}>
            <div className="w-4 h-4 flex items-center justify-center text-[8px] font-bold" style={{ backgroundColor: "#C75B39", color: "#fff" }}>
              {fanContext.username[0].toUpperCase()}
            </div>
            <span className="text-[9px] font-semibold" style={{ color: "#C75B39" }}>{fanContext.displayName}</span>
          </div>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* Tone selector */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-tertiary)" }}>Ton du message</p>
          <div className="flex gap-1.5 flex-wrap">
            {TONES.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTone(t.id)}
                className="text-[10px] px-2.5 py-1.5 font-medium transition-all"
                style={{
                  backgroundColor: selectedTone === t.id ? `${t.color}1A` : "var(--bg-card)",
                  color: selectedTone === t.id ? t.color : "var(--text-secondary)",
                  border: `1px solid ${selectedTone === t.id ? t.color + "40" : "var(--border-default)"}`,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Context */}
        {fanContext ? (
          <div className="p-3" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
            <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-primary)" }}>
              Fan : <strong>{fanContext.displayName}</strong>
              {fanContext.platform && <span style={{ color: "var(--text-secondary)" }}> · {fanContext.platform}</span>}
            </p>
            {conversationContext?.lastMessagePreview && (
              <div className="mt-2 p-2" style={{ backgroundColor: "var(--bg-surface)", borderLeft: "2px solid #C75B39" }}>
                <p className="text-[10px] line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                  {conversationContext.lastMessagePreview}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center" style={{ backgroundColor: "var(--bg-card)", border: "1px dashed rgba(199,91,57,0.2)" }}>
            <MessageSquare size={22} className="mx-auto mb-2" style={{ color: "rgba(199,91,57,0.3)" }} />
            <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
              Ouvrez une conversation sur OnlyFans, Fansly ou MYM pour activer l&apos;assistant
            </p>
          </div>
        )}

        {/* AI Suggestions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[11px] font-semibold flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
              <Sparkles size={12} style={{ color: "#C75B39" }} />
              Suggestions IA
            </h3>
            <button onClick={loadDrafts} className="flex items-center gap-1 text-[10px]" style={{ color: "var(--text-tertiary)" }}>
              <RefreshCw size={11} />
              Régénérer
            </button>
          </div>

          {isDraftsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 animate-pulse" style={{ backgroundColor: "var(--bg-surface)" }} />
              ))}
            </div>
          ) : aiDrafts.length > 0 ? (
            <div className="space-y-2">
              {aiDrafts.slice(0, 3).map((draft) => (
                <div key={draft.id} style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
                  <div className="p-3">
                    {editingId === draft.id ? (
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                        className="w-full p-2 text-[11px] resize-none outline-none"
                        style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)", border: "1px solid rgba(199,91,57,0.3)" }}
                      />
                    ) : (
                      <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-primary)" }}>
                        {draft.generatedText}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className="text-[9px] px-1.5 py-0.5 font-semibold"
                        style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "#C75B39", border: "1px solid rgba(199,91,57,0.15)" }}
                      >
                        {Math.round(draft.confidence * 100)}% match
                      </span>
                    </div>
                  </div>
                  <div className="flex border-t" style={{ borderColor: "var(--border-default)" }}>
                    <button
                      onClick={async () => {
                        if (editingId === draft.id) {
                          await handleInsert(editText, draft.id);
                          setEditingId(null);
                        } else {
                          await handleInsert(draft.generatedText, draft.id);
                        }
                      }}
                      disabled={insertingId === draft.id}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-semibold transition-colors"
                      style={{ color: insertingId === draft.id ? "#10B981" : "#C75B39" }}
                    >
                      {insertingId === draft.id ? <Check size={11} /> : <Send size={11} />}
                      {insertingId === draft.id ? "Inséré" : "Insérer"}
                    </button>
                    <button
                      onClick={() => handleCopy(draft.generatedText, draft.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-medium border-x"
                      style={{ borderColor: "var(--border-default)", color: copied === draft.id ? "#10B981" : "var(--text-secondary)" }}
                    >
                      {copied === draft.id ? <Check size={11} /> : <Copy size={11} />}
                      {copied === draft.id ? "Copié" : "Copier"}
                    </button>
                    <button
                      onClick={() => {
                        if (editingId === draft.id) { setEditingId(null); } else { setEditingId(draft.id); setEditText(draft.generatedText); }
                      }}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <Edit3 size={11} />
                      {editingId === draft.id ? "Annuler" : "Modifier"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center" style={{ backgroundColor: "var(--bg-card)", border: "1px dashed rgba(199,91,57,0.2)" }}>
              <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                {fanContext ? "Chargement des suggestions IA..." : "Connectez-vous pour obtenir des suggestions"}
              </p>
            </div>
          )}
        </div>

        {/* Tone Guard */}
        <div className="flex items-center gap-2 p-3" style={{ backgroundColor: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
          <Check size={13} style={{ color: "#10B981" }} />
          <span className="text-[11px] font-semibold" style={{ color: "#10B981" }}>Tone Guard ✓ Conforme ADN</span>
          <span className="text-[9px] ml-auto" style={{ color: "var(--text-tertiary)" }}>Ton cohérent</span>
        </div>

        {/* PPV Actions */}
        {fanContext && (
          <div>
            <h3 className="text-[11px] font-semibold mb-2 flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
              <Gift size={12} style={{ color: "#EC4899" }} />
              Actions PPV
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate({ route: "vault" })}
                className="w-full flex items-center gap-3 p-3 text-left transition-all hover:scale-[1.01]"
                style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}
              >
                <Gift size={14} style={{ color: "#EC4899" }} />
                <div className="flex-1">
                  <p className="text-[11px] font-semibold" style={{ color: "var(--text-primary)" }}>Proposer un PPV</p>
                  <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Sélectionner un contenu du vault</p>
                </div>
                <div className="text-sm font-bold" style={{ color: "#C75B39", fontFamily: "monospace" }}>15-20€</div>
              </button>
            </div>
          </div>
        )}

        {/* Quick Scripts */}
        <div>
          <h3 className="text-[11px] font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
            Scripts rapides
          </h3>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {(scripts.length > 0 ? scripts.slice(0, 8) : DEFAULT_SCRIPTS).map((s, i) => (
              <button
                key={typeof s === "string" ? i : (s as { id: string }).id}
                onClick={async () => {
                  const text = typeof s === "string" ? s : (s as { content: string }).content;
                  const displayName = fanContext?.displayName ?? "toi";
                  await insertScript(text.replace("{fan_name}", displayName));
                }}
                className="w-full text-left p-2.5 transition-all hover:border-[rgba(199,91,57,0.3)]"
                style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}
              >
                <p className="text-[10px] leading-snug line-clamp-2" style={{ color: "var(--text-primary)" }}>
                  {typeof s === "string" ? s : (s as { content: string }).content}
                </p>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const DEFAULT_SCRIPTS = [
  "Hey {fan_name}, ça fait un moment 💕 J'ai préparé un truc spécial pour toi...",
  "Coucou ! Je viens de poster un nouveau contenu que tu vas adorer 🔥",
  "Tu me manques... Viens voir ce que j'ai préparé pour toi aujourd'hui 🎁",
];
