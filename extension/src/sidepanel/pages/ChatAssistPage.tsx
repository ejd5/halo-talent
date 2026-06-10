// ─── Chat Assist Page — Halo Companion ───────────

import { useState, useCallback, useEffect } from "react";
import {
  ChevronLeft, Send, RefreshCw, Edit3, Check, Zap,
  Search, MessageSquare, Gift
} from "lucide-react";
import { useCompanionStore } from "../stores/companion-store";
import { insertScript, getAIDrafts, getScripts } from "../lib/messaging";
import { FAN_PERSONA_LABELS } from "@/src/types/fan";
import type { Route, RouteState } from "../router";

type NavigateFn = (to: Route | RouteState, params?: Record<string, string>) => void;

interface Props { navigate: NavigateFn }

export function ChatAssistPage({ navigate }: Props) {
  const { fanContext, conversationContext, aiDrafts, setAIDrafts, isDraftsLoading, scripts, setScripts } = useCompanionStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [insertingId, setInsertingId] = useState<string | null>(null);

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

  const personaLabel = fanContext ? FAN_PERSONA_LABELS.regular : null;

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Header */}
      <header className="shrink-0 px-4 py-3 flex items-center gap-3 border-b"
        style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)" }}>
        <button onClick={() => navigate("dashboard")} className="p-1 rounded" style={{ color: "var(--text-secondary)" }}>
          <ChevronLeft size={16} />
        </button>
        <div className="flex-1">
          <h1 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Chat Assist</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* Context */}
        {fanContext ? (
          <div className="rounded-xl p-3" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
            <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-primary)" }}>
              Vous chattez avec <strong>{fanContext.displayName}</strong>
              {personaLabel && <span> ({personaLabel})</span>}
              {fanContext.platform && <span> sur {fanContext.platform}</span>}
            </p>
            {conversationContext?.lastMessagePreview && (
              <div className="mt-2 p-2 rounded-lg" style={{ backgroundColor: "var(--bg-surface)" }}>
                <p className="text-[10px] line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                  Dernier message : {conversationContext.lastMessagePreview}
                </p>
              </div>
            )}
          </div>
        ) : (
          <EmptyState icon={MessageSquare} message="Ouvrez une conversation sur OnlyFans, Fansly ou MYM pour activer l'assistant" />
        )}

        {/* AI Suggestions */}
        <div>
          <h3 className="text-[11px] font-semibold mb-2 flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
            <Zap size={12} style={{ color: "var(--accent)" }} />
            Suggestions IA
          </h3>
          {isDraftsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl h-20 animate-pulse" style={{ backgroundColor: "var(--bg-surface)" }} />
              ))}
            </div>
          ) : aiDrafts.length > 0 ? (
            <div className="space-y-2">
              {aiDrafts.slice(0, 3).map((draft) => (
                <div key={draft.id} className="rounded-xl overflow-hidden animate-slide-up"
                  style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
                  <div className="p-3">
                    {editingId === draft.id ? (
                      <textarea value={editText} onChange={(e) => setEditText(e.target.value)}
                        rows={3} className="w-full rounded-lg p-2 text-[11px] resize-none outline-none"
                        style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)", border: "1px solid var(--border-default)" }} />
                    ) : (
                      <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-primary)" }}>
                        {draft.generatedText}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}>
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
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors"
                      style={{ color: insertingId === draft.id ? "var(--success)" : "var(--accent)" }}>
                      {insertingId === draft.id ? <Check size={12} /> : <Send size={12} />}
                      {insertingId === draft.id ? "Inséré" : "Insérer"}
                    </button>
                    <button onClick={() => {
                      if (editingId === draft.id) {
                        setEditingId(null);
                      } else {
                        setEditingId(draft.id);
                        setEditText(draft.generatedText);
                      }
                    }}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-medium border-x transition-colors"
                      style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}>
                      {editingId === draft.id ? <Check size={12} /> : <Edit3 size={12} />}
                      {editingId === draft.id ? "Terminé" : "Modifier"}
                    </button>
                    <button onClick={loadDrafts}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors"
                      style={{ color: "var(--text-secondary)" }}>
                      <RefreshCw size={12} /> Régénérer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl p-4 text-center"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
              <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                {fanContext ? "Générez des suggestions IA pour engager la conversation" : "Connectez-vous pour obtenir des suggestions"}
              </p>
            </div>
          )}
        </div>

        {/* Tone Guard */}
        <div className="rounded-xl p-3 flex items-center gap-2"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
          <Check size={14} style={{ color: "var(--success)" }} />
          <span className="text-[11px] font-medium" style={{ color: "var(--success)" }}>Conforme ADN</span>
          <span className="text-[10px] ml-auto" style={{ color: "var(--text-tertiary)" }}>Ton cohérent</span>
        </div>

        {/* PPV Actions */}
        {fanContext && (
          <div>
            <h3 className="text-[11px] font-semibold mb-2 flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
              <Gift size={12} style={{ color: "#EC4899" }} />
              Actions PPV
            </h3>
            <div className="space-y-2">
              <button onClick={() => navigate({ route: "vault" })}
                className="w-full flex items-center gap-2 p-2.5 rounded-xl text-left transition-colors"
                style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
                <Gift size={14} style={{ color: "#EC4899" }} />
                <div className="flex-1">
                  <p className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>Proposer un PPV</p>
                  <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Sélectionner un contenu du vault</p>
                </div>
              </button>
              <button onClick={() => navigate({ route: "vault" })}
                className="w-full flex items-center gap-2 p-2.5 rounded-xl text-left transition-colors"
                style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
                <Search size={14} style={{ color: "var(--text-secondary)" }} />
                <div className="flex-1">
                  <p className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>Vérifier l'historique</p>
                  <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Ce média a-t-il déjà été envoyé ?</p>
                </div>
              </button>
              <div className="rounded-xl p-2.5" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
                <p className="text-[10px] font-medium" style={{ color: "var(--text-primary)" }}>Prix optimal suggéré</p>
                <p className="text-sm font-bold mt-0.5" style={{ color: "var(--accent)", fontFamily: "'JetBrains Mono', monospace" }}>
                  15-20€
                </p>
                <p className="text-[9px]" style={{ color: "var(--text-tertiary)" }}>Basé sur l'historique d'achat</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Scripts */}
        <div>
          <h3 className="text-[11px] font-semibold mb-2 flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
            <MessageSquare size={12} style={{ color: "var(--text-tertiary)" }} />
            Scripts rapides
          </h3>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {(scripts.length > 0 ? scripts.slice(0, 8) : DEFAULT_SCRIPTS).map((s, i) => (
              <button key={typeof s === "string" ? i : (s as { id: string }).id}
                onClick={async () => {
                  const text = typeof s === "string" ? s : (s as { content: string }).content;
                  const displayName = fanContext?.displayName ?? "toi";
                  await insertScript(text.replace("{fan_name}", displayName));
                }}
                className="w-full text-left p-2 rounded-lg transition-colors hover:bg-[var(--accent-soft)]"
                style={{ backgroundColor: "var(--bg-card)" }}>
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

function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="rounded-xl p-6 text-center" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
      <Icon size={22} className="mx-auto mb-2" style={{ color: "var(--text-tertiary)" }} />
      <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>{message}</p>
    </div>
  );
}
