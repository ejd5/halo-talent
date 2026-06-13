"use client";

import { useState } from "react";
import {
  UserCircle, Phone, Mail, MessageSquare, Calendar, TrendingUp,
  Star, Shield, ChevronRight, Clock, CheckCircle2, AlertCircle,
  FileText, Send, Bell,
} from "lucide-react";

// ── Mock data ─────────────────────────────────────────────
const manager = {
  name: "Alexandre Moreau",
  role: "Talent Manager Senior",
  agency: "Halo Talent",
  avatar: "AM",
  experience: "8 ans",
  portfolio: "24 talents gérés",
  rating: 4.9,
  phone: "+33 6 12 34 56 78",
  email: "a.moreau@halo-talent.com",
  timezone: "Paris (UTC+2)",
  availability: "Disponible",
  nextMeeting: "Mardi 17 juin · 14h00",
};

const stats = [
  { label: "Croissance revenus", value: "+34%", positive: true, desc: "vs trimestre dernier" },
  { label: "Followers gagnés", value: "+12.4K", positive: true, desc: "ce mois" },
  { label: "Score satisfaction", value: "9.2/10", positive: true, desc: "évaluation créateur" },
  { label: "Taux de réponse", value: "< 2h", positive: true, desc: "temps moyen manager" },
];

const recentActions = [
  { id: "a1", icon: CheckCircle2, color: "#A8D08D", text: "Contrat renégocié avec Brand A", time: "Il y a 2h" },
  { id: "a2", icon: TrendingUp, color: "var(--color-accent)", text: "Stratégie Q3 mise à jour", time: "Hier" },
  { id: "a3", icon: Shield, color: "#4A90D9", text: "Revue légale contenu validée", time: "Il y a 3j" },
  { id: "a4", icon: Star, color: "#F5C842", text: "Partenariat Brand B confirmé", time: "Il y a 5j" },
];

const upcomingEvents = [
  { id: "e1", title: "Revue mensuelle de performance", date: "Mardi 17 juin", time: "14:00", type: "call" },
  { id: "e2", title: "Négociation contrat exclusif", date: "Jeudi 19 juin", time: "10:30", type: "meeting" },
  { id: "e3", title: "Briefing campagne été", date: "Lundi 24 juin", time: "09:00", type: "call" },
];

const objectives = [
  { label: "Revenus mensuels", current: 3200, target: 5000, unit: "€" },
  { label: "Abonnés Instagram", current: 28400, target: 50000, unit: "" },
  { label: "Taux d'engagement", current: 4.8, target: 6.0, unit: "%" },
];

export default function ManagerPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: "m1", from: "manager", text: "Bonjour ! J'ai analysé tes dernières performances. On a de bonnes nouvelles à discuter lors de notre prochain call.", time: "09:30" },
    { id: "m2", from: "me", text: "Super ! J'ai aussi des questions sur la stratégie PPV. À mardi !", time: "10:15" },
    { id: "m3", from: "manager", text: "Parfait, j'ai préparé une analyse complète. N'oublie pas de remplir le brief créatif avant la réunion 👍", time: "10:18" },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, { id: `m${Date.now()}`, from: "me", text: message, time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }]);
    setMessage("");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
          Mon Manager
        </h1>
        <p className="text-xs mt-0.5" style={{ color: "rgba(245,240,235,0.4)" }}>
          Votre interlocuteur Halo Talent dédié
        </p>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Manager info + stats */}
        <div className="flex flex-col gap-4">
          {/* Manager card */}
          <div className="border p-5" style={{ backgroundColor: "var(--color-card)", borderColor: "rgba(245,240,235,0.08)" }}>
            {/* Avatar + info */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-14 h-14 flex items-center justify-center text-lg font-bold"
                style={{ backgroundColor: "var(--accent-soft)", color: "var(--color-accent)", border: "2px solid rgba(199,91,57,0.3)" }}
              >
                {manager.avatar}
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{manager.name}</div>
                <div className="text-[10px] mt-0.5" style={{ color: "var(--color-accent)" }}>{manager.role}</div>
                <div className="text-[10px]" style={{ color: "rgba(245,240,235,0.35)" }}>{manager.agency}</div>
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2 mb-4 px-3 py-2 border" style={{ borderColor: "rgba(168,208,141,0.2)", backgroundColor: "rgba(168,208,141,0.05)" }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#A8D08D" }} />
              <span className="text-[10px] font-semibold" style={{ color: "#A8D08D" }}>{manager.availability}</span>
              <span className="text-[10px] ml-auto" style={{ color: "rgba(245,240,235,0.3)" }}>{manager.timezone}</span>
            </div>

            {/* Contact */}
            <div className="space-y-2 mb-4">
              {[
                { icon: Phone, label: manager.phone },
                { icon: Mail, label: manager.email },
              ].map((c) => (
                <button
                  key={c.label}
                  className="w-full flex items-center gap-2 px-3 py-2 border text-left hover:bg-[var(--color-surface)] transition-colors"
                  style={{ borderColor: "rgba(245,240,235,0.06)", backgroundColor: "var(--color-surface)" }}
                >
                  <c.icon size={12} style={{ color: "rgba(245,240,235,0.3)" }} />
                  <span className="text-[10px]" style={{ color: "rgba(245,240,235,0.5)" }}>{c.label}</span>
                </button>
              ))}
            </div>

            {/* Rating */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} fill={i < Math.floor(manager.rating) ? "#F5C842" : "none"} style={{ color: "#F5C842" }} />
                ))}
              </div>
              <span className="text-xs font-bold" style={{ color: "#F5C842" }}>{manager.rating}/5</span>
            </div>

            {/* Meta */}
            <div className="flex gap-3 mt-3 pt-3 border-t" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
              <div className="text-center flex-1">
                <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{manager.experience}</div>
                <div className="text-[9px]" style={{ color: "rgba(245,240,235,0.3)" }}>Expérience</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{manager.portfolio}</div>
                <div className="text-[9px]" style={{ color: "rgba(245,240,235,0.3)" }}>Portfolio</div>
              </div>
            </div>
          </div>

          {/* Next meeting */}
          <div className="border p-4" style={{ backgroundColor: "var(--color-card)", borderColor: "rgba(199,91,57,0.2)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={14} style={{ color: "var(--color-accent)" }} />
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-accent)" }}>Prochain rdv</span>
            </div>
            <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{manager.nextMeeting}</div>
            <div className="text-[10px] mt-1" style={{ color: "rgba(245,240,235,0.4)" }}>Revue mensuelle de performance</div>
            <button className="mt-3 w-full py-2 text-xs font-semibold border border-[var(--color-accent)]/30 hover:bg-[var(--accent-soft)] transition-colors" style={{ color: "var(--color-accent)" }}>
              Rejoindre le call
            </button>
          </div>

          {/* Objectives */}
          <div className="border p-4" style={{ backgroundColor: "var(--color-card)", borderColor: "rgba(245,240,235,0.08)" }}>
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: "rgba(245,240,235,0.4)" }}>Objectifs en cours</div>
            <div className="space-y-3">
              {objectives.map((obj) => {
                const pct = Math.min(100, Math.round((obj.current / obj.target) * 100));
                return (
                  <div key={obj.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px]" style={{ color: "rgba(245,240,235,0.5)" }}>{obj.label}</span>
                      <span className="text-[10px] font-mono" style={{ color: "var(--color-accent)" }}>{pct}%</span>
                    </div>
                    <div className="h-1 rounded-full" style={{ backgroundColor: "rgba(245,240,235,0.06)" }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: "var(--color-accent)" }} />
                    </div>
                    <div className="flex justify-between mt-0.5">
                      <span className="text-[8px]" style={{ color: "rgba(245,240,235,0.25)" }}>{obj.current.toLocaleString()}{obj.unit}</span>
                      <span className="text-[8px]" style={{ color: "rgba(245,240,235,0.25)" }}>{obj.target.toLocaleString()}{obj.unit}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Middle: Chat */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="p-3 border card-accent" style={{ backgroundColor: "var(--color-card)", borderColor: "rgba(245,240,235,0.08)" }}>
                <div className="text-base font-bold" style={{ fontFamily: "var(--font-display)", color: "#A8D08D" }}>{s.value}</div>
                <div className="text-[9px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: "rgba(245,240,235,0.4)" }}>{s.label}</div>
                <div className="text-[9px] mt-0.5" style={{ color: "rgba(245,240,235,0.25)" }}>{s.desc}</div>
              </div>
            ))}
          </div>

          {/* Chat */}
          <div className="border flex flex-col" style={{ backgroundColor: "var(--color-card)", borderColor: "rgba(245,240,235,0.08)", minHeight: 320 }}>
            <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
              <MessageSquare size={14} style={{ color: "var(--color-accent)" }} />
              <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Message direct — {manager.name}</span>
              <span className="ml-auto text-[9px] px-1.5 py-0.5" style={{ color: "#A8D08D", border: "1px solid rgba(168,208,141,0.2)", backgroundColor: "rgba(168,208,141,0.05)" }}>En ligne</span>
            </div>
            {/* Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto" style={{ minHeight: 200 }}>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="max-w-[80%] px-3 py-2 text-xs leading-relaxed"
                    style={{
                      backgroundColor: msg.from === "me" ? "var(--accent-soft)" : "var(--color-surface)",
                      color: "var(--text-primary)",
                      border: `1px solid ${msg.from === "me" ? "rgba(199,91,57,0.2)" : "rgba(245,240,235,0.06)"}`,
                    }}
                  >
                    {msg.text}
                    <div className="text-[8px] mt-1 text-right" style={{ color: "rgba(245,240,235,0.3)" }}>{msg.time}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Input */}
            <div className="px-4 py-3 border-t flex items-center gap-2" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Écrire un message..."
                className="flex-1 bg-transparent text-xs outline-none"
                style={{ color: "var(--text-primary)" }}
              />
              <button onClick={sendMessage} className="p-2 transition-opacity hover:opacity-80" style={{ color: "var(--color-accent)" }}>
                <Send size={14} />
              </button>
            </div>
          </div>

          {/* Recent actions + upcoming */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recent actions */}
            <div className="border" style={{ backgroundColor: "var(--color-card)", borderColor: "rgba(245,240,235,0.08)" }}>
              <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
                <TrendingUp size={12} style={{ color: "var(--color-accent)" }} />
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(245,240,235,0.4)" }}>Actions récentes</span>
              </div>
              <div className="divide-y divide-[rgba(245,240,235,0.04)]">
                {recentActions.map((a) => (
                  <div key={a.id} className="px-4 py-2.5 flex items-start gap-2.5">
                    <a.icon size={12} style={{ color: a.color, marginTop: 1 }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] leading-snug" style={{ color: "var(--text-primary)" }}>{a.text}</div>
                      <div className="text-[9px] mt-0.5" style={{ color: "rgba(245,240,235,0.25)" }}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming events */}
            <div className="border" style={{ backgroundColor: "var(--color-card)", borderColor: "rgba(245,240,235,0.08)" }}>
              <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
                <Calendar size={12} style={{ color: "var(--color-accent)" }} />
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(245,240,235,0.4)" }}>Agenda</span>
              </div>
              <div className="divide-y divide-[rgba(245,240,235,0.04)]">
                {upcomingEvents.map((e) => (
                  <div key={e.id} className="px-4 py-2.5 flex items-start gap-2.5">
                    <div className="mt-0.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "var(--color-accent)", marginTop: 5 }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-medium leading-snug" style={{ color: "var(--text-primary)" }}>{e.title}</div>
                      <div className="text-[9px] mt-0.5" style={{ color: "rgba(245,240,235,0.3)" }}>{e.date} · {e.time}</div>
                    </div>
                    <ChevronRight size={10} style={{ color: "rgba(245,240,235,0.2)", marginTop: 2 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
