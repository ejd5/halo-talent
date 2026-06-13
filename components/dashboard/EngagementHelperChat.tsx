"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, Search, AlertTriangle, Shield, Star, MessageCircle,
  Check, Copy, X, ChevronRight, Clock, Zap, Flag,
  Sparkles, ThumbsUp, DollarSign, Users, Filter,
  PanelRightClose, PanelRightOpen, Eye, Edit3, Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────

type DM = {
  id: string;
  sender: string;
  sender_avatar?: string;
  content: string;
  platform: string;
  created_at: string;
  read: boolean;
  category?: string;
  priority?: number;
  status?: "unread" | "read" | "draft_ready" | "answered";
};

type Draft = {
  id: string;
  content: string;
  tone: string;
  goal: string;
};

type Message = {
  role: "user" | "assistant" | "fan" | "creator";
  content: string;
  sender?: string;
  created_at?: string;
};

// ─── Mock DMs for initial display ───────────────────────────

const MOCK_DMS: DM[] = [
  { id: "dm-1", sender: "Lucas_24", content: "Salut ! J'ai adoré ton dernier post, t'es trop belle 😍", platform: "onlyfans", created_at: "2026-06-08T14:23:00Z", read: false, category: "compliment", priority: 40, status: "unread" },
  { id: "dm-2", sender: "Max_off92", content: "Bonjour, je voudrais savoir combien coûte un contenu personnalisé ?", platform: "onlyfans", created_at: "2026-06-08T12:10:00Z", read: false, category: "ppv_request", priority: 85, status: "unread" },
  { id: "dm-3", sender: "Julie_crea", content: "Coucou ! Tu utilises quel matos pour tes vidéos ? Je débute 😊", platform: "instagram", created_at: "2026-06-08T10:05:00Z", read: false, category: "question", priority: 55, status: "unread" },
  { id: "dm-4", sender: "Tom_pv", content: "T'es vraiment la meilleure, merci pour tes conseils 🙏", platform: "onlyfans", created_at: "2026-06-07T22:30:00Z", read: false, category: "compliment", priority: 35, status: "unread" },
  { id: "dm-5", sender: "anon_789", content: "J'ai vu ton profil. Je te propose un partenariat rémunéré. Contacte moi sur Telegram : @scam_789", platform: "instagram", created_at: "2026-06-07T18:45:00Z", read: false, category: "suspicious", priority: 95, status: "unread" },
  { id: "dm-6", sender: "Stephane_off", content: "Bonjour, je suis abonné depuis 3 mois et j'adore ton contenu. Est-ce que tu fais des lives privés ?", platform: "onlyfans", created_at: "2026-06-07T15:20:00Z", read: true, category: "question", priority: 70, status: "read" },
  { id: "dm-7", sender: "Nina_bzh", content: "Hey ! Super contenu cette semaine, continue comme ça ✨", platform: "mym", created_at: "2026-06-06T20:15:00Z", read: true, category: "compliment", priority: 25, status: "answered" },
  { id: "dm-8", sender: "Alex_design", content: "Je suis graphiste et je peux faire tes covers et bannières. Tarif : 50€/set. Intéressée ?", platform: "instagram", created_at: "2026-06-06T14:00:00Z", read: true, category: "regular", priority: 30, status: "read" },
];

const MOCK_CONVERSATIONS: Record<string, Message[]> = {
  "dm-2": [
    { role: "fan", content: "Bonjour, je voudrais savoir combien coûte un contenu personnalisé ?", sender: "Max_off92", created_at: "2026-06-08T12:10:00Z" },
  ],
  "dm-5": [
    { role: "fan", content: "J'ai vu ton profil. Je te propose un partenariat rémunéré. Contacte moi sur Telegram : @scam_789", sender: "anon_789", created_at: "2026-06-07T18:45:00Z" },
  ],
  "dm-6": [
    { role: "fan", content: "Bonjour, je suis abonné depuis 3 mois et j'adore ton contenu.", sender: "Stephane_off", created_at: "2026-06-07T15:20:00Z" },
    { role: "creator", content: "Merci beaucoup Stéphane ! Ravie que tu apprécies 😊", created_at: "2026-06-07T16:00:00Z" },
    { role: "fan", content: "Est-ce que tu fais des lives privés ?", sender: "Stephane_off", created_at: "2026-06-07T16:30:00Z" },
  ],
};

// ─── Category config ────────────────────────────────────────

const CATEGORY_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  question: { label: "Question", color: "#3B82F6", icon: MessageCircle },
  compliment: { label: "Compliment", color: "var(--success)", icon: ThumbsUp },
  ppv_request: { label: "Demande PPV", color: "var(--accent)", icon: DollarSign },
  suspicious: { label: "Suspect", color: "#EF4444", icon: AlertTriangle },
  regular: { label: "Habitué", color: "#8B5CF6", icon: Users },
};

const STATUS_LABELS: Record<string, string> = {
  unread: "Non lu",
  read: "Lu",
  draft_ready: "Brouillon prêt",
  answered: "Répondu",
};

// ─── Component ──────────────────────────────────────────────

export function EngagementHelperChat() {
  const [dms, setDms] = useState<DM[]>(MOCK_DMS);
  const [selectedDmId, setSelectedDmId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [generating, setGenerating] = useState(false);
  const [loadingDms, setLoadingDms] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, drafts]);

  // Load DMs from the agent API
  const loadDMs = useCallback(async () => {
    setLoadingDms(true);
    try {
      const res = await fetch("/api/dashboard/agents/engagement/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Liste mes DMs non lus et catégorise-les par priorité" }),
      });
      const data = await res.json();
      if (data.toolCalls?.length > 0) {
        // Tool calls indicate the agent processed DMs
        // Refresh from the messages table
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: messages } = await supabase
            .from("messages")
            .select("*")
            .eq("creator_id", user.id)
            .order("created_at", { ascending: false })
            .limit(20);
          if (messages && messages.length > 0) {
            setDms(messages.map((m: any) => ({
              id: m.id,
              sender: m.sender_info?.username ?? m.sender ?? "Inconnu",
              content: m.content ?? "",
              platform: m.platform ?? "onlyfans",
              created_at: m.created_at,
              read: m.read ?? false,
              category: "regular",
              priority: 30,
              status: m.read ? "read" : "unread",
            })));
          }
        }
      }
    } catch {
      // Keep mock DMs
    } finally {
      setLoadingDms(false);
    }
  }, [supabase]);

  // Select a DM
  const selectDm = (dmId: string) => {
    setSelectedDmId(dmId);
    setDrafts([]);
    setEditingDraft(null);
    // Load conversation (mock for now)
    setConversation(MOCK_CONVERSATIONS[dmId] ?? [
      { role: "fan", content: dms.find((d) => d.id === dmId)?.content ?? "", sender: dms.find((d) => d.id === dmId)?.sender, created_at: dms.find((d) => d.id === dmId)?.created_at },
    ]);
  };

  // Generate 3 drafts
  const generateDrafts = async () => {
    if (!selectedDmId) return;
    setGenerating(true);

    const tones = ["friendly", "flirty", "professional"];
    const goals = ["build_rapport", "thank", "offer_ppv"];
    const newDrafts: Draft[] = [];

    try {
      const selectedDm = dms.find((d) => d.id === selectedDmId);
      const responses = await Promise.all(
        tones.map((tone, i) =>
          fetch("/api/dashboard/agents/engagement/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: `Drafte une réponse ${tone === "flirty" ? "flirty" : tone === "professional" ? "professionnelle" : "amicale"} pour ce message : "${selectedDm?.content ?? ""}"`,
            }),
          }).then((r) => r.json())
        )
      );

      responses.forEach((data, i) => {
        if (data.message) {
          newDrafts.push({
            id: `draft-${Date.now()}-${i}`,
            content: data.message,
            tone: tones[i],
            goal: goals[i] ?? "build_rapport",
          });
        }
      });
    } catch {
      // Fallback drafts
      const fallbackTexts = [
        "Salut ! Merci pour ton message, ça me fait super plaisir 😊 N'hésite pas si tu as des questions !",
        "Hey ! Trop contente que ça te plaise 🥰 On se parle vite fait là ?",
        "Bonjour et merci pour votre message ! Ravie de savoir que mon contenu vous plaît. Au plaisir d'échanger !",
      ];
      fallbackTexts.forEach((text, i) => {
        newDrafts.push({ id: `draft-${Date.now()}-${i}`, content: text, tone: tones[i], goal: goals[i] ?? "build_rapport" });
      });
    }

    setDrafts(newDrafts);
    setGenerating(false);
  };

  // Copy draft to clipboard
  const copyDraft = async (content: string, draftId: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(draftId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Start editing a draft
  const startEdit = (draft: Draft) => {
    setEditingDraft(draft.id);
    setEditText(draft.content);
  };

  // Save edited draft
  const saveEdit = (draftId: string) => {
    setDrafts((prev) => prev.map((d) => d.id === draftId ? { ...d, content: editText } : d));
    setEditingDraft(null);
  };

  // Filter DMs
  const filteredDms = dms
    .filter((dm) => filter === "all" || dm.category === filter)
    .filter((dm) => !search || dm.sender.toLowerCase().includes(search.toLowerCase()) || dm.content.toLowerCase().includes(search.toLowerCase()));

  // Category counts
  const counts = {
    all: dms.length,
    unread: dms.filter((d) => !d.read).length,
    suspicious: dms.filter((d) => d.category === "suspicious").length,
    ppv_request: dms.filter((d) => d.category === "ppv_request").length,
  };

  // ─── DM Item ──────────────────────────────────────────────

  const DmItem = ({ dm }: { dm: DM }) => {
    const CatConfig = CATEGORY_CONFIG[dm.category ?? "regular"];
    const CatIcon = CatConfig?.icon ?? MessageCircle;
    const isSelected = selectedDmId === dm.id;

    return (
      <button
        onClick={() => selectDm(dm.id)}
        className={cn(
          "w-full text-left p-3 border-b border-[var(--color-border)] transition-all hover:bg-[var(--or, #D8A95B)]/05",
          isSelected && "bg-[var(--accent)/10]"
        )}
      >
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full border border-[var(--color-border)] flex items-center justify-center text-xs font-mono shrink-0 mt-0.5"
            style={{ backgroundColor: "var(--color-card)" }}>
            {dm.sender.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                {dm.sender}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {!dm.read && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} />}
                <span className="text-[9px] font-mono" style={{ color: dm.priority && dm.priority >= 70 ? "#EF4444" : "rgba(255, 255, 255, 0.375)" }}>
                  P{dm.priority ?? 30}
                </span>
              </div>
            </div>

            {/* Message preview */}
            <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
              {dm.content}
            </p>

            {/* Footer */}
            <div className="flex items-center gap-2 mt-1.5">
              {/* Category badge */}
              {CatConfig && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wider"
                  style={{ backgroundColor: `${CatConfig.color}15`, color: CatConfig.color }}>
                  <CatIcon size={8} />
                  {CatConfig.label}
                </span>
              )}
              {/* Platform */}
              <span className="text-[8px] uppercase font-mono" style={{ color: "rgba(255, 255, 255, 0.25)" }}>
                {dm.platform}
              </span>
              {/* Status */}
              <span className="text-[8px] ml-auto" style={{ color: "rgba(255, 255, 255, 0.25)" }}>
                {STATUS_LABELS[dm.status ?? "unread"]}
              </span>
            </div>
          </div>
        </div>
      </button>
    );
  };

  // ─── Draft Card ───────────────────────────────────────────

  const DraftCard = ({ draft }: { draft: Draft }) => {
    const isEditing = editingDraft === draft.id;

    return (
      <div className="border border-[var(--accent)/20]" style={{ backgroundColor: "rgba(199, 91, 57, 0.03)" }}>
        <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--accent)/10]">
          <div className="flex items-center gap-2">
            <Sparkles size={11} style={{ color: "var(--accent)" }} />
            <span className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: "var(--accent)" }}>
              Suggestion IA
            </span>
            <span className="text-[8px] px-1 py-0.5 font-mono" style={{ backgroundColor: "rgba(199, 91, 57, 0.08)", color: "var(--accent)" }}>
              {draft.tone}
            </span>
          </div>
        </div>

        <div className="p-3">
          {isEditing ? (
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full bg-transparent border border-[var(--color-border)] p-2 text-sm resize-none focus:outline-none focus:border-[var(--or, #D8A95B)]"
              rows={4}
              style={{ color: "var(--text-primary)" }}
            />
          ) : (
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
              {draft.content}
            </p>
          )}

          <div className="flex items-center gap-2 mt-3">
            {isEditing ? (
              <>
                <button onClick={() => saveEdit(draft.id)}
                  className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium"
                  style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}>
                  <Check size={10} /> Sauver
                </button>
                <button onClick={() => setEditingDraft(null)}
                  className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium border border-[var(--color-border)]"
                  style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                  <X size={10} /> Annuler
                </button>
              </>
            ) : (
              <>
                <button onClick={() => copyDraft(draft.content, draft.id)}
                  className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium"
                  style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}>
                  {copiedId === draft.id ? <Check size={10} /> : <Copy size={10} />}
                  {copiedId === draft.id ? "Copié !" : "Utiliser"}
                </button>
                <button onClick={() => startEdit(draft)}
                  className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium border border-[var(--color-border)]"
                  style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                  <Edit3 size={10} /> Modifier
                </button>
                <button onClick={() => setDrafts((prev) => prev.filter((d) => d.id !== draft.id))}
                  className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium border border-[var(--color-border)]"
                  style={{ color: "#EF444480" }}>
                  <Trash2 size={10} /> Ignorer
                </button>
              </>
            )}
          </div>

          {!isEditing && (
            <p className="text-[8px] mt-2" style={{ color: "rgba(255, 255, 255, 0.25)" }}>
              Suggestion IA, À valider avant envoi · Copiez-collez dans votre messagerie
            </p>
          )}
        </div>
      </div>
    );
  };

  // ─── Render ───────────────────────────────────────────────

  return (
    <div className="flex h-[calc(100vh-10rem)] border border-[var(--color-border)] overflow-hidden" style={{ backgroundColor: "var(--color-card)" }}>
      {/* Left: DM List */}
      <div className={cn("flex flex-col border-r border-[var(--color-border)] transition-all", sidebarOpen ? "w-80" : "w-0 overflow-hidden")}>
        {/* Header */}
        <div className="p-3 border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Messagerie</h2>
            <button onClick={loadDMs} className="text-[10px]" style={{ color: "var(--accent)" }}>
              <Clock size={12} />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-2">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(255, 255, 255, 0.25)" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full bg-transparent border border-[var(--color-border)] pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-[var(--or, #D8A95B)] transition-colors"
              style={{ color: "var(--text-primary)" }}
            />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1">
            {[
              { id: "all", label: `Tous (${counts.all})` },
              { id: "unread", label: `Non lus (${counts.unread})` },
              { id: "suspicious", label: `Alertes (${counts.suspicious})` },
              { id: "ppv_request", label: `PPV (${counts.ppv_request})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "px-2 py-1 text-[9px] uppercase tracking-wider font-medium whitespace-nowrap transition-colors",
                  filter === f.id ? "border-b-2" : "opacity-50 hover:opacity-80"
                )}
                style={{ borderColor: filter === f.id ? "var(--accent)" : "transparent", color: "var(--text-primary)" }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* DM List */}
        <div className="flex-1 overflow-y-auto">
          {filteredDms.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-xs" style={{ color: "rgba(255, 255, 255, 0.375)" }}>Aucun message trouvé</p>
            </div>
          ) : (
            filteredDms.map((dm) => <DmItem key={dm.id} dm={dm} />)
          )}
        </div>
      </div>

      {/* Center: Conversation */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedDmId ? (
          <>
            {/* Conversation header */}
            <div className="flex items-center gap-3 p-3 border-b border-[var(--color-border)]">
              {dms.find((d) => d.id === selectedDmId) && (
                <>
                  <div className="w-8 h-8 rounded-full border border-[var(--color-border)] flex items-center justify-center text-xs font-mono"
                    style={{ backgroundColor: "var(--color-base)" }}>
                    {dms.find((d) => d.id === selectedDmId)!.sender.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {dms.find((d) => d.id === selectedDmId)!.sender}
                    </p>
                    <p className="text-[10px]" style={{ color: "rgba(255, 255, 255, 0.375)" }}>
                      {dms.find((d) => d.id === selectedDmId)!.platform}
                    </p>
                  </div>
                  {dms.find((d) => d.id === selectedDmId)?.category === "suspicious" && (
                    <div className="flex items-center gap-1 ml-auto px-2 py-1 text-[9px] font-medium" style={{ backgroundColor: "#EF444415", color: "#EF4444" }}>
                      <AlertTriangle size={10} />
                      Signalé
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {conversation.map((msg, i) => (
                <div key={i} className={cn("flex", msg.role === "fan" ? "justify-start" : "justify-end")}>
                  <div className={cn(
                    "max-w-[70%] px-3 py-2 text-sm leading-relaxed",
                    msg.role === "fan"
                      ? "border border-[var(--color-border)]"
                      : "text-white"
                  )}
                    style={msg.role === "fan"
                      ? { backgroundColor: "var(--color-base)" }
                      : { backgroundColor: "var(--color-accent)" }
                    }
                  >
                    {msg.role === "fan" && (
                      <p className="text-[10px] font-medium mb-1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                        {msg.sender}
                      </p>
                    )}
                    <p style={{ color: msg.role === "fan" ? "var(--text-primary)" : "var(--text-primary)" }}>{msg.content}</p>
                    {msg.created_at && (
                      <p className="text-[9px] mt-1" style={{ color: "rgba(255, 255, 255, 0.25)" }}>
                        {new Date(msg.created_at).toLocaleString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Draft generator */}
            <div className="border-t border-[var(--color-border)] p-3 space-y-3">
              {drafts.length === 0 ? (
                <button
                  onClick={generateDrafts}
                  disabled={generating}
                  className="w-full py-2.5 text-xs uppercase tracking-wider font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
                  style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
                >
                  {generating ? (
                    <span className="flex items-center justify-center gap-2">
                      <Clock size={12} className="animate-spin" />
                      Génération des brouillons...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles size={12} />
                      Générer 3 brouillons de réponse
                    </span>
                  )}
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--accent)" }}>
                      3 brouillons générés
                    </p>
                    <button
                      onClick={() => setDrafts([])}
                      className="text-[9px] opacity-50 hover:opacity-100"
                      style={{ color: "var(--text-primary)" }}
                    >
                      × Effacer
                    </button>
                  </div>
                  {drafts.map((draft) => (
                    <DraftCard key={draft.id} draft={draft} />
                  ))}
                </div>
              )}

              {/* Legal notice */}
              <p className="text-[8px] text-center" style={{ color: "rgba(255, 255, 255, 0.19)" }}>
                Aucun message n'est envoyé automatiquement. Vous copiez-collez manuellement dans votre messagerie.
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-8">
              <MessageCircle size={32} className="mx-auto mb-3" style={{ color: "rgba(255, 255, 255, 0.125)" }} />
              <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                Sélectionnez une conversation
              </p>
              <p className="text-xs" style={{ color: "rgba(255, 255, 255, 0.375)" }}>
                Choisissez un message à gauche pour voir la conversation
              </p>
              <p className="text-[9px] mt-4" style={{ color: "rgba(255, 255, 255, 0.19)" }}>
                L'agent catégorise et priorise automatiquement vos DMs
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="border-l border-[var(--color-border)] px-2 flex items-center hover:opacity-70 transition-opacity"
        style={{ backgroundColor: "var(--color-card)" }}
      >
        {sidebarOpen ? <PanelRightClose size={14} style={{ color: "rgba(255, 255, 255, 0.375)" }} /> : <PanelRightOpen size={14} style={{ color: "rgba(255, 255, 255, 0.375)" }} />}
      </button>
    </div>
  );
}
