"use client";

import { useState } from "react";
import {
  MessageSquare, Search, Send, Star, UserCircle, Clock,
  ChevronRight, Phone, Video, MoreHorizontal, Paperclip,
  SmilePlus, Check, CheckCheck, Bell, BellOff, Archive,
  Inbox, Users, UserCog,
} from "lucide-react";

// ── Types & Mock data ──────────────────────────────────────
type ConvType = "manager" | "team" | "dm";

interface Message {
  id: string;
  from: string;
  text: string;
  time: string;
  mine: boolean;
  read: boolean;
}

interface Conversation {
  id: string;
  name: string;
  role?: string;
  avatar: string;
  type: ConvType;
  lastMsg: string;
  time: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

const CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    name: "Alexandre Moreau",
    role: "Talent Manager",
    avatar: "AM",
    type: "manager",
    lastMsg: "J'ai regardé tes stats de cette semaine 🔥",
    time: "09:30",
    unread: 2,
    online: true,
    messages: [
      { id: "m1", from: "AM", text: "Bonjour ! J'ai regardé tes analytics de cette semaine.", time: "09:15", mine: false, read: true },
      { id: "m2", from: "AM", text: "Ton taux d'engagement est en hausse de 18%. Très bon travail ! 🔥", time: "09:16", mine: false, read: true },
      { id: "m3", from: "me", text: "Merci ! J'ai suivi les conseils du brief de lundi.", time: "09:20", mine: true, read: true },
      { id: "m4", from: "AM", text: "Exactement. Pour la semaine prochaine, on va se concentrer sur les Reels.", time: "09:25", mine: false, read: true },
      { id: "m5", from: "AM", text: "J'ai regardé tes stats de cette semaine 🔥", time: "09:30", mine: false, read: false },
    ],
  },
  {
    id: "c2",
    name: "Équipe Halo",
    role: "Équipe créa",
    avatar: "HT",
    type: "team",
    lastMsg: "Brief campaign été confirmé ✓",
    time: "Hier",
    unread: 0,
    online: true,
    messages: [
      { id: "m1", from: "HT", text: "Le moodboard pour la campagne été est prêt !", time: "Hier 14:00", mine: false, read: true },
      { id: "m2", from: "me", text: "Super ! Je le valide. On peut partir en prod.", time: "Hier 14:30", mine: true, read: true },
      { id: "m3", from: "HT", text: "Brief campaign été confirmé ✓", time: "Hier 15:00", mine: false, read: true },
    ],
  },
  {
    id: "c3",
    name: "Sophie Renard",
    role: "Designer",
    avatar: "SR",
    type: "dm",
    lastMsg: "Les visuels sont prêts pour review",
    time: "Il y a 2j",
    unread: 1,
    online: false,
    messages: [
      { id: "m1", from: "SR", text: "Bonjour ! J'ai terminé les 5 visuels pour ton post de lundi.", time: "Il y a 2j", mine: false, read: true },
      { id: "m2", from: "SR", text: "Les visuels sont prêts pour review", time: "Il y a 2j", mine: false, read: false },
    ],
  },
  {
    id: "c4",
    name: "Lucas Petit",
    role: "Community Manager",
    avatar: "LP",
    type: "team",
    lastMsg: "15 commentaires en attente de réponse",
    time: "Il y a 3j",
    unread: 0,
    online: false,
    messages: [
      { id: "m1", from: "LP", text: "15 commentaires en attente de réponse sur Instagram.", time: "Il y a 3j", mine: false, read: true },
    ],
  },
];

const TYPE_ICONS: Record<ConvType, React.ElementType> = {
  manager: UserCog,
  team: Users,
  dm: UserCircle,
};

const TYPE_LABELS: Record<ConvType, string> = {
  manager: "Manager",
  team: "Équipe",
  dm: "Direct",
};

export default function MessagesPage() {
  const [activeConv, setActiveConv] = useState<Conversation>(CONVERSATIONS[0]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<"all" | ConvType>("all");
  const [convMessages, setConvMessages] = useState<Record<string, Message[]>>(
    Object.fromEntries(CONVERSATIONS.map((c) => [c.id, c.messages]))
  );

  const filtered = CONVERSATIONS.filter((c) => filter === "all" || c.type === filter);
  const currentMessages = convMessages[activeConv.id] || [];

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      from: "me",
      text: input,
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      mine: true,
      read: false,
    };
    setConvMessages((prev) => ({ ...prev, [activeConv.id]: [...(prev[activeConv.id] || []), newMsg] }));
    setInput("");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Messages
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "rgba(245,240,235,0.4)" }}>
            {CONVERSATIONS.reduce((acc, c) => acc + c.unread, 0)} messages non lus
          </p>
        </div>
      </div>

      {/* Messenger layout */}
      <div className="border flex" style={{ backgroundColor: "var(--color-card)", borderColor: "rgba(245,240,235,0.08)", height: "calc(100vh - 220px)", minHeight: 480 }}>
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 border-r flex flex-col" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
          {/* Search */}
          <div className="p-3 border-b" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
            <div className="flex items-center gap-2 px-2.5 py-1.5 border" style={{ borderColor: "rgba(245,240,235,0.08)", backgroundColor: "var(--color-surface)" }}>
              <Search size={11} style={{ color: "rgba(245,240,235,0.3)" }} />
              <input placeholder="Rechercher..." className="flex-1 bg-transparent text-[10px] outline-none" style={{ color: "var(--text-primary)" }} />
            </div>
          </div>
          {/* Filters */}
          <div className="flex gap-1 p-2 border-b" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
            {(["all", "manager", "team", "dm"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="flex-1 py-1 text-[8px] font-semibold uppercase tracking-wider border transition-all"
                style={{
                  borderColor: filter === f ? "var(--color-accent)" : "rgba(245,240,235,0.06)",
                  color: filter === f ? "var(--color-accent)" : "rgba(245,240,235,0.3)",
                  backgroundColor: filter === f ? "var(--accent-soft)" : "transparent",
                }}
              >
                {f === "all" ? "Tous" : TYPE_LABELS[f]}
              </button>
            ))}
          </div>
          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {filtered.map((conv) => {
              const TypeIcon = TYPE_ICONS[conv.type];
              const isActive = conv.id === activeConv.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConv(conv)}
                  className="w-full px-3 py-3 flex items-start gap-2.5 transition-colors text-left"
                  style={{
                    backgroundColor: isActive ? "var(--accent-soft)" : "transparent",
                    borderLeft: isActive ? `2px solid var(--color-accent)` : "2px solid transparent",
                  }}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div
                      className="w-8 h-8 flex items-center justify-center text-[10px] font-bold"
                      style={{
                        backgroundColor: isActive ? "var(--color-accent)" : "var(--color-surface)",
                        color: isActive ? "#fff" : "var(--color-accent)",
                        border: `1px solid ${isActive ? "transparent" : "rgba(199,91,57,0.2)"}`,
                      }}
                    >
                      {conv.avatar}
                    </div>
                    {conv.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[var(--color-card)]" style={{ backgroundColor: "#A8D08D" }} />
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold truncate" style={{ color: "var(--text-primary)" }}>{conv.name}</span>
                      <span className="text-[8px] shrink-0 ml-1" style={{ color: "rgba(245,240,235,0.25)" }}>{conv.time}</span>
                    </div>
                    <div className="text-[9px] truncate mt-0.5" style={{ color: "rgba(245,240,235,0.35)" }}>{conv.lastMsg}</div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-1">
                        <TypeIcon size={9} style={{ color: "rgba(245,240,235,0.25)" }} />
                        <span className="text-[8px]" style={{ color: "rgba(245,240,235,0.25)" }}>{TYPE_LABELS[conv.type]}</span>
                      </div>
                      {conv.unread > 0 && (
                        <div className="w-4 h-4 flex items-center justify-center rounded-full text-[8px] font-bold" style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}>
                          {conv.unread}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat header */}
          <div className="px-4 py-3 border-b flex items-center gap-3" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
            <div
              className="w-8 h-8 flex items-center justify-center text-[10px] font-bold shrink-0"
              style={{ backgroundColor: "var(--accent-soft)", color: "var(--color-accent)", border: "1px solid rgba(199,91,57,0.2)" }}
            >
              {activeConv.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{activeConv.name}</div>
              <div className="flex items-center gap-1.5">
                {activeConv.online && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#A8D08D" }} />}
                <span className="text-[9px]" style={{ color: "rgba(245,240,235,0.35)" }}>
                  {activeConv.online ? "En ligne" : "Hors ligne"} · {activeConv.role}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 border transition-all hover:bg-[var(--color-surface)]" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
                <Phone size={12} style={{ color: "rgba(245,240,235,0.4)" }} />
              </button>
              <button className="p-1.5 border transition-all hover:bg-[var(--color-surface)]" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
                <Video size={12} style={{ color: "rgba(245,240,235,0.4)" }} />
              </button>
              <button className="p-1.5 border transition-all hover:bg-[var(--color-surface)]" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
                <MoreHorizontal size={12} style={{ color: "rgba(245,240,235,0.4)" }} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {currentMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.mine ? "justify-end" : "justify-start"}`}>
                {!msg.mine && (
                  <div
                    className="w-6 h-6 flex items-center justify-center text-[8px] font-bold mr-1.5 shrink-0 self-end"
                    style={{ backgroundColor: "var(--color-surface)", color: "var(--color-accent)", border: "1px solid rgba(199,91,57,0.15)" }}
                  >
                    {activeConv.avatar}
                  </div>
                )}
                <div
                  className="max-w-[75%] px-3 py-2 text-xs leading-relaxed"
                  style={{
                    backgroundColor: msg.mine ? "var(--color-accent)" : "var(--color-surface)",
                    color: msg.mine ? "#fff" : "var(--text-primary)",
                  }}
                >
                  {msg.text}
                  <div className={`flex items-center gap-1 mt-1 ${msg.mine ? "justify-end" : "justify-start"}`}>
                    <span className="text-[8px]" style={{ color: msg.mine ? "rgba(255,255,255,0.5)" : "rgba(245,240,235,0.25)" }}>{msg.time}</span>
                    {msg.mine && <CheckCheck size={8} style={{ color: "rgba(255,255,255,0.5)" }} />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t flex items-center gap-2" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
            <button className="p-1.5 opacity-30 hover:opacity-60 transition-opacity">
              <Paperclip size={14} style={{ color: "var(--text-primary)" }} />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={`Message à ${activeConv.name}...`}
              className="flex-1 bg-transparent text-xs outline-none"
              style={{ color: "var(--text-primary)" }}
            />
            <button className="p-1.5 opacity-30 hover:opacity-60 transition-opacity">
              <SmilePlus size={14} style={{ color: "var(--text-primary)" }} />
            </button>
            <button
              onClick={sendMessage}
              className="p-2 transition-all"
              style={{ backgroundColor: "var(--color-accent)", color: "#fff", opacity: input.trim() ? 1 : 0.4 }}
            >
              <Send size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
