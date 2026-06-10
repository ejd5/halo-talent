// ─── Fan Profile Page — Halo Companion ───────────

import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft, ExternalLink, TrendingUp, Clock,
  Tag, MessageCircle, FileText, AlertCircle,
  Calendar, DollarSign, Heart, Activity, Target,
} from "lucide-react";
import { useCompanionStore } from "../stores/companion-store";
import { getFanProfileFromAPI } from "../lib/messaging";
import { FAN_PERSONA_LABELS, type FanPersona } from "@/src/types/fan";
import type { Route, RouteState } from "../router";

type NavigateFn = (to: Route | RouteState, params?: Record<string, string>) => void;

interface Props {
  fanId?: string;
  tab?: string;
  navigate: NavigateFn;
}

export function FanProfilePage({ fanId, tab: initialTab, navigate }: Props) {
  const [activeTab, setActiveTab] = useState(initialTab ?? "profile");
  const { fanContext, fanProfile, setFanProfile, isFanLoading } = useCompanionStore();

  const loadProfile = useCallback(async () => {
    if (!fanId && !fanContext?.platformId) return;
    const id = fanId ?? fanContext?.platformId;
    if (!id) return;

    const profile = await getFanProfileFromAPI(id);
    setFanProfile(profile);
  }, [fanId, fanContext?.platformId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const displayName = fanProfile?.displayName ?? fanContext?.displayName ?? fanId ?? "Inconnu";
  const username = fanProfile?.username ?? fanContext?.username ?? "";
  const persona: FanPersona = fanProfile?.persona ?? "regular";
  const personaLabel = FAN_PERSONA_LABELS[persona] ?? persona;

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Header */}
      <header className="shrink-0 px-4 py-3 flex items-center gap-3 border-b"
        style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)" }}>
        <button onClick={() => navigate("dashboard")} className="p-1 rounded" style={{ color: "var(--text-secondary)" }}>
          <ChevronLeft size={16} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{displayName}</h1>
          <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>@{username}</span>
        </div>
        <button onClick={() => chrome.tabs.create({ url: `https://app.halotalent.com/fans/${fanId}` })}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium"
          style={{ color: "var(--accent)", backgroundColor: "var(--accent-soft)" }}>
          <ExternalLink size={12} /> Halo
        </button>
      </header>

      {/* Badges */}
      <div className="shrink-0 px-4 py-2 flex flex-wrap gap-1.5 border-b"
        style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-primary)" }}>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}>
          {personaLabel}
        </span>
        {fanContext?.platform && (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: "var(--border-default)", color: "var(--text-secondary)" }}>
            {fanContext.platform}
          </span>
        )}
        {fanProfile?.isVIP && (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: "rgba(245,158,11,0.12)", color: "#F59E0B" }}>VIP</span>
        )}
      </div>

      {/* Tabs */}
      <div className="shrink-0 flex border-b" style={{ borderColor: "var(--border-default)" }}>
        {[
          { id: "profile", icon: TrendingUp, label: "Profil" },
          { id: "chat", icon: MessageCircle, label: "Chat" },
          { id: "notes", icon: FileText, label: "Notes" },
        ].map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-medium transition-colors border-b-2"
            style={{
              color: activeTab === id ? "var(--accent)" : "var(--text-tertiary)",
              borderBottomColor: activeTab === id ? "var(--accent)" : "transparent",
            }}>
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isFanLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl h-16 animate-pulse" style={{ backgroundColor: "var(--bg-surface)" }} />
            ))}
          </div>
        ) : activeTab === "profile" ? (
          <ProfileTab profile={fanProfile} context={fanContext} />
        ) : activeTab === "chat" ? (
          <ChatTab profile={fanProfile} />
        ) : (
          <NotesTab fanId={fanId ?? fanContext?.platformId} />
        )}
      </div>
    </div>
  );
}

// ─── Profile Tab ───────────────────────────────────────────

function ProfileTab({ profile, context }: { profile: ReturnType<typeof useCompanionStore.getState>["fanProfile"]; context: ReturnType<typeof useCompanionStore.getState>["fanContext"] }) {
  const churn = profile?.churnRisk ?? 0;
  const churnColor = churn > 70 ? "var(--danger)" : churn > 40 ? "var(--warning)" : "var(--success)";
  return (
    <div className="space-y-3">
      {/* Financial */}
      <Section title="Finances" icon={DollarSign}>
        <div className="grid grid-cols-2 gap-2">
          <KV label="LTV" value={`${profile?.totalSpent ?? context?.totalSpent ?? 0}€`} />
          <KV label="Total dépensé" value={`${profile?.totalSpent ?? context?.totalSpent ?? 0}€`} />
          <KV label="Dépense/mois" value={`${profile?.avgMonthlySpend ?? 0}€`} />
          <KV label="Dernier tip" value={profile?.lastTipAmount ? `${profile.lastTipAmount}€` : "—"} />
        </div>
      </Section>

      {/* Engagement */}
      <Section title="Engagement" icon={Activity}>
        <div className="grid grid-cols-2 gap-2">
          <KV label="Abonné depuis" value={profile?.subscriptionMonths ? `${profile.subscriptionMonths} mois` : "—"} />
          <KV label="Dernier achat" value={profile?.lastTipDate ? new Date(profile.lastTipDate).toLocaleDateString("fr") : "—"} />
          <KV label="Dernier message" value={profile?.lastMessageDate ? new Date(profile.lastMessageDate).toLocaleDateString("fr") : "—"} />
          <KV label="Messages reçus" value={`${profile?.messagesReceived ?? 0}`} />
        </div>
      </Section>

      {/* Churn Risk */}
      <Section title="Risque de churn" icon={AlertCircle}>
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="var(--border-default)" strokeWidth="3" />
              <circle cx="18" cy="18" r="15" fill="none" stroke={churnColor} strokeWidth="3"
                strokeDasharray={`${(churn / 100) * 94.2} 94.2`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold" style={{ color: churnColor, fontFamily: "'JetBrains Mono', monospace" }}>{churn}%</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-[11px]" style={{ color: "var(--text-primary)" }}>
              {churn > 70 ? "Élevé — action recommandée" : churn > 40 ? "Modéré — à surveiller" : "Faible — fan fidèle"}
            </p>
            {profile?.nextBestAction && (
              <p className="text-[10px] mt-1" style={{ color: "var(--accent)" }}>
                → {profile.nextBestAction}
              </p>
            )}
          </div>
        </div>
      </Section>

      {/* Interests */}
      {profile?.interests && profile.interests.length > 0 && (
        <Section title="Intérêts détectés" icon={Heart}>
          <div className="flex flex-wrap gap-1">
            {profile.interests.map((i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}>{i}</span>
            ))}
          </div>
        </Section>
      )}

      {/* Persona Details */}
      <Section title="Style de communication" icon={Target}>
        <div className="space-y-1.5">
          <p className="text-[11px]" style={{ color: "var(--text-primary)" }}>
            {profile?.sentiment === "positive" ? "😊 Positif" : profile?.sentiment === "negative" ? "😤 Négatif" : "😐 Neutre"}
          </p>
          <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
            Meilleur créneau : Achète principalement entre 20h-22h
          </p>
          <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
            Contenus préférés : Photos, budget moyen 15€
          </p>
        </div>
      </Section>
    </div>
  );
}

// ─── Chat Tab ──────────────────────────────────────────────

function ChatTab({ profile }: { profile: ReturnType<typeof useCompanionStore.getState>["fanProfile"] }) {
  return (
    <div className="space-y-3">
      <Section title="Résumé IA de la conversation" icon={MessageCircle}>
        <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-primary)" }}>
          {profile?.aiNotes ?? "Aucune conversation récente analysée. Ouvrez une conversation pour activer l'assistant."}
        </p>
      </Section>

      <Section title="Sujets abordés" icon={Tag}>
        <div className="flex flex-wrap gap-1">
          {profile?.interests?.slice(0, 8).map((i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}>{i}</span>
          )) ?? <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Aucun sujet détecté</span>}
        </div>
      </Section>

      <Section title="Sentiment" icon={Activity}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{profile?.sentiment === "positive" ? "😊" : profile?.sentiment === "negative" ? "😤" : "😐"}</span>
          <span className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
            {profile?.sentiment === "positive" ? "Positif" : profile?.sentiment === "negative" ? "Négatif" : "Neutre"}
          </span>
          {profile?.sentiment === "positive" && <span className="text-[10px]" style={{ color: "var(--success)" }}>↑ En hausse</span>}
        </div>
      </Section>

      <Section title="Messages ayant mené à des achats" icon={DollarSign}>
        <div className="space-y-2">
          <div className="text-[10px] p-2 rounded-lg" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}>
            🔥 "J&apos;ai une surprise pour toi ce soir..." → 25€ PPV
          </div>
          <div className="text-[10px] p-2 rounded-lg" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}>
            💕 "Tu me manques, reviens vite..." → 40€ tips
          </div>
        </div>
      </Section>
    </div>
  );
}

// ─── Notes Tab ─────────────────────────────────────────────

function NotesTab({ fanId: _fanId }: { fanId?: string }) {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!note.trim()) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-3">
      <Section title="Ajouter une note" icon={FileText}>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note privée sur ce fan..."
          rows={3}
          className="w-full rounded-lg p-2.5 text-[11px] resize-none outline-none"
          style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)", border: "1px solid var(--border-default)" }}
        />
        <button onClick={handleSave}
          className="mt-2 px-4 py-1.5 rounded-lg text-[11px] font-medium transition-all"
          style={{ backgroundColor: saved ? "var(--success)" : "var(--accent)", color: "#fff" }}>
          {saved ? "✓ Sauvegardé" : "Sauvegarder"}
        </button>
      </Section>

      <Section title="Historique des notes" icon={Clock}>
        <div className="space-y-2">
          {[
            { text: "A mentionné aimer les photos en extérieur — proposer le set \"Nature\"", date: "Il y a 3 jours" },
            { text: "Budget ~20€ par PPV, sensible aux offres limitées", date: "Il y a 1 semaine" },
          ].map((n, i) => (
            <div key={i} className="p-2 rounded-lg" style={{ backgroundColor: "var(--bg-surface)" }}>
              <p className="text-[11px]" style={{ color: "var(--text-primary)" }}>{n.text}</p>
              <p className="text-[9px] mt-1" style={{ color: "var(--text-tertiary)" }}>{n.date}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Rappels" icon={Calendar}>
        <div className="p-2 rounded-lg" style={{ backgroundColor: "var(--accent-soft)" }}>
          <p className="text-[11px]" style={{ color: "var(--accent)" }}>
            Rappeler dans 3 jours de proposer le nouveau set
          </p>
        </div>
      </Section>
    </div>
  );
}

// ─── Reusable Components ───────────────────────────────────

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-3" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
      <h3 className="text-[11px] font-semibold mb-2 flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
        <Icon size={13} style={{ color: "var(--text-tertiary)" }} />
        {title}
      </h3>
      {children}
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2 py-1.5 rounded-lg" style={{ backgroundColor: "var(--bg-surface)" }}>
      <div className="text-[9px]" style={{ color: "var(--text-tertiary)" }}>{label}</div>
      <div className="text-xs font-semibold" style={{ color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace" }}>
        {value}
      </div>
    </div>
  );
}
