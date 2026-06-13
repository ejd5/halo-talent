"use client";

import { useState } from "react";
import {
  User, Bell, Shield, Palette, Link2, Users, Zap, CreditCard,
  ChevronRight, Check, Edit3, Camera, Globe, Lock, Eye, EyeOff,
  Moon, Sun, Smartphone, Mail, Phone, AlertCircle,
  Play, AtSign,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────
type Section = "profile" | "notifications" | "security" | "appearance" | "integrations" | "co-management" | "billing";

const SECTIONS: { id: Section; label: string; icon: React.ElementType; desc: string; badge?: string }[] = [
  { id: "profile", label: "Profil & ADN", icon: User, desc: "Informations personnelles et identité" },
  { id: "notifications", label: "Notifications", icon: Bell, desc: "Alertes, rappels et préférences" },
  { id: "security", label: "Sécurité", icon: Shield, desc: "Mot de passe et authentification" },
  { id: "appearance", label: "Apparence", icon: Palette, desc: "Thème, langue, affichage" },
  { id: "integrations", label: "Plateformes", icon: Link2, desc: "Comptes connectés" },
  { id: "co-management", label: "Co-management", icon: Users, desc: "Accès et permissions équipe" },
  { id: "billing", label: "Facturation", icon: CreditCard, desc: "Plan, paiements et factures", badge: "Pro" },
];

const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: Camera, color: "#E1306C", connected: true, handle: "@maria_lifestyle", followers: "28.4K" },
  { id: "tiktok", label: "TikTok", icon: () => <span style={{ fontSize: 14 }}>♪</span>, color: "#69C9D0", connected: true, handle: "@maria.creates", followers: "14.2K" },
  { id: "youtube", label: "YouTube", icon: Play, color: "#FF0000", connected: false, handle: "", followers: "" },
  { id: "twitter", label: "Twitter/X", icon: AtSign, color: "#1DA1F2", connected: false, handle: "", followers: "" },
];

const TEAM_MEMBERS = [
  { id: "t1", name: "Alexandre Moreau", role: "Manager", avatar: "AM", access: "Lecture + Écriture", since: "Jan 2025" },
  { id: "t2", name: "Sophie Renard", role: "Designer", avatar: "SR", access: "Lecture seule", since: "Mars 2025" },
];

const NOTIF_PREFS = [
  { id: "n1", label: "Nouveau fan", desc: "Quand quelqu'un s'abonne", email: true, push: true, sms: false },
  { id: "n2", label: "Nouveau message", desc: "DM entrant non lu", email: false, push: true, sms: false },
  { id: "n3", label: "Rapport hebdomadaire", desc: "Résumé de vos performances", email: true, push: false, sms: false },
  { id: "n4", label: "Alerte churn", desc: "Fan à risque détecté", email: true, push: true, sms: true },
  { id: "n5", label: "Paiement reçu", desc: "Transaction validée", email: true, push: true, sms: false },
  { id: "n6", label: "Rappel publication", desc: "Post planifié dans 1h", email: false, push: true, sms: false },
];

// ── Components ────────────────────────────────────────────
function ProfileSection() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Maria Dubois");
  const [bio, setBio] = useState("Créatrice de contenu lifestyle & fitness. Passionnée de bien-être et d'authenticité.");
  const [email, setEmail] = useState("maria.dubois@email.com");
  return (
    <div className="flex flex-col gap-5">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: "var(--accent-soft)", color: "var(--color-accent)", border: "2px solid rgba(199,91,57,0.3)" }}>
            MD
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 flex items-center justify-center border" style={{ backgroundColor: "var(--color-surface)", borderColor: "rgba(245,240,235,0.1)" }}>
            <Camera size={12} style={{ color: "rgba(245,240,235,0.5)" }} />
          </button>
        </div>
        <div>
          <div className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>{name}</div>
          <div className="text-xs mt-0.5" style={{ color: "rgba(245,240,235,0.4)" }}>Digital Creator · Halo Talent</div>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#A8D08D" }} />
            <span className="text-[10px]" style={{ color: "#A8D08D" }}>Profil vérifié</span>
          </div>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs border transition-all"
          style={{ borderColor: "rgba(245,240,235,0.1)", color: "rgba(245,240,235,0.5)" }}
        >
          <Edit3 size={11} />
          {editing ? "Annuler" : "Modifier"}
        </button>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Nom complet", value: name, onChange: setName },
          { label: "Email", value: email, onChange: setEmail },
        ].map((f) => (
          <div key={f.label}>
            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "rgba(245,240,235,0.4)" }}>{f.label}</label>
            <input
              value={f.value}
              onChange={(e) => editing && f.onChange(e.target.value)}
              readOnly={!editing}
              className="w-full px-3 py-2 text-xs border outline-none transition-colors"
              style={{
                backgroundColor: editing ? "var(--color-surface)" : "var(--color-card)",
                borderColor: editing ? "rgba(199,91,57,0.3)" : "rgba(245,240,235,0.06)",
                color: "var(--text-primary)",
              }}
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "rgba(245,240,235,0.4)" }}>Biographie</label>
        <textarea
          value={bio}
          onChange={(e) => editing && setBio(e.target.value)}
          readOnly={!editing}
          rows={3}
          className="w-full px-3 py-2 text-xs border outline-none resize-none transition-colors"
          style={{
            backgroundColor: editing ? "var(--color-surface)" : "var(--color-card)",
            borderColor: editing ? "rgba(199,91,57,0.3)" : "rgba(245,240,235,0.06)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      {editing && (
        <button
          onClick={() => setEditing(false)}
          className="self-start px-4 py-2 text-xs font-semibold"
          style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
        >
          Sauvegarder les modifications
        </button>
      )}
    </div>
  );
}

function NotificationsSection() {
  const [prefs, setPrefs] = useState(NOTIF_PREFS);
  const toggle = (id: string, channel: "email" | "push" | "sms") => {
    setPrefs((p) => p.map((n) => n.id === id ? { ...n, [channel]: !n[channel as keyof typeof n] } : n));
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="text-[10px]" style={{ color: "rgba(245,240,235,0.4)" }}>
        Choisissez comment et quand vous souhaitez être notifié(e).
      </div>
      <div className="border" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
          <div className="col-span-6 text-[9px] font-semibold uppercase tracking-wider" style={{ color: "rgba(245,240,235,0.3)" }}>Notification</div>
          <div className="col-span-2 text-[9px] font-semibold uppercase tracking-wider text-center" style={{ color: "rgba(245,240,235,0.3)" }}>Email</div>
          <div className="col-span-2 text-[9px] font-semibold uppercase tracking-wider text-center" style={{ color: "rgba(245,240,235,0.3)" }}>Push</div>
          <div className="col-span-2 text-[9px] font-semibold uppercase tracking-wider text-center" style={{ color: "rgba(245,240,235,0.3)" }}>SMS</div>
        </div>
        {prefs.map((n) => (
          <div key={n.id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center border-b last:border-b-0" style={{ borderColor: "rgba(245,240,235,0.04)" }}>
            <div className="col-span-6">
              <div className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{n.label}</div>
              <div className="text-[9px] mt-0.5" style={{ color: "rgba(245,240,235,0.3)" }}>{n.desc}</div>
            </div>
            {(["email", "push", "sms"] as const).map((ch) => (
              <div key={ch} className="col-span-2 flex justify-center">
                <button
                  onClick={() => toggle(n.id, ch)}
                  className="w-8 h-4 relative rounded-full transition-colors"
                  style={{ backgroundColor: n[ch] ? "var(--color-accent)" : "rgba(245,240,235,0.1)" }}
                >
                  <div
                    className="absolute top-0.5 w-3 h-3 rounded-full transition-transform"
                    style={{ backgroundColor: "#fff", left: n[ch] ? "calc(100% - 14px)" : "2px" }}
                  />
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function SecuritySection() {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(245,240,235,0.4)" }}>Mot de passe</label>
        <div className="flex items-center gap-2">
          <input type={show ? "text" : "password"} value="•••••••••••" readOnly className="flex-1 px-3 py-2 text-xs border outline-none" style={{ backgroundColor: "var(--color-surface)", borderColor: "rgba(245,240,235,0.06)", color: "var(--text-primary)" }} />
          <button onClick={() => setShow(!show)} className="p-2 border" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
            {show ? <EyeOff size={14} style={{ color: "rgba(245,240,235,0.4)" }} /> : <Eye size={14} style={{ color: "rgba(245,240,235,0.4)" }} />}
          </button>
        </div>
        <button className="mt-2 text-xs font-semibold" style={{ color: "var(--color-accent)" }}>Changer le mot de passe</button>
      </div>

      <div className="border p-4" style={{ borderColor: "rgba(245,240,235,0.06)", backgroundColor: "var(--color-surface)" }}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Authentification 2 facteurs</div>
            <div className="text-[10px] mt-0.5" style={{ color: "rgba(245,240,235,0.4)" }}>Via application (Google Authenticator)</div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#A8D08D" }} />
            <span className="text-[10px] font-semibold" style={{ color: "#A8D08D" }}>Activé</span>
          </div>
        </div>
        <button className="text-[10px] font-semibold" style={{ color: "rgba(245,240,235,0.4)" }}>Gérer la 2FA</button>
      </div>

      <div className="border p-4" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Sessions actives</div>
        {[
          { device: "MacBook Pro", location: "Paris, France", current: true, time: "Maintenant" },
          { device: "iPhone 15", location: "Paris, France", current: false, time: "Il y a 2h" },
        ].map((s) => (
          <div key={s.device} className="flex items-center justify-between py-2 border-b last:border-b-0" style={{ borderColor: "rgba(245,240,235,0.04)" }}>
            <div className="flex items-center gap-2">
              <Smartphone size={12} style={{ color: "rgba(245,240,235,0.3)" }} />
              <div>
                <div className="text-[10px] font-medium" style={{ color: "var(--text-primary)" }}>{s.device} {s.current && <span style={{ color: "var(--color-accent)" }}>(actuel)</span>}</div>
                <div className="text-[9px]" style={{ color: "rgba(245,240,235,0.3)" }}>{s.location} · {s.time}</div>
              </div>
            </div>
            {!s.current && <button className="text-[9px]" style={{ color: "#E05C5C" }}>Déconnecter</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

function AppearanceSection() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [lang, setLang] = useState("fr");
  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: "rgba(245,240,235,0.4)" }}>Thème</label>
        <div className="flex gap-3">
          {(["dark", "light"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className="flex-1 flex flex-col items-center gap-2 p-4 border transition-all"
              style={{
                borderColor: theme === t ? "var(--color-accent)" : "rgba(245,240,235,0.08)",
                backgroundColor: theme === t ? "var(--accent-soft)" : "var(--color-card)",
              }}
            >
              {t === "dark" ? <Moon size={18} style={{ color: theme === t ? "var(--color-accent)" : "rgba(245,240,235,0.4)" }} /> : <Sun size={18} style={{ color: theme === t ? "var(--color-accent)" : "rgba(245,240,235,0.4)" }} />}
              <span className="text-[10px] font-semibold capitalize" style={{ color: theme === t ? "var(--color-accent)" : "rgba(245,240,235,0.4)" }}>{t === "dark" ? "Sombre" : "Clair"}</span>
              {theme === t && <Check size={10} style={{ color: "var(--color-accent)" }} />}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(245,240,235,0.4)" }}>Langue</label>
        <div className="flex gap-2">
          {[{ id: "fr", label: "Français" }, { id: "en", label: "English" }].map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className="px-3 py-1.5 text-xs border transition-all"
              style={{
                borderColor: lang === l.id ? "var(--color-accent)" : "rgba(245,240,235,0.08)",
                color: lang === l.id ? "var(--color-accent)" : "rgba(245,240,235,0.4)",
                backgroundColor: lang === l.id ? "var(--accent-soft)" : "transparent",
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function IntegrationsSection() {
  return (
    <div className="flex flex-col gap-3">
      {PLATFORMS.map((p) => {
        const Icon = p.icon;
        return (
          <div key={p.id} className="flex items-center gap-4 p-4 border" style={{ borderColor: "rgba(245,240,235,0.06)", backgroundColor: "var(--color-surface)" }}>
            <div className="w-9 h-9 flex items-center justify-center border" style={{ borderColor: "rgba(245,240,235,0.06)", backgroundColor: "var(--color-card)" }}>
              <Icon size={16} style={{ color: p.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{p.label}</div>
              {p.connected ? (
                <div className="text-[10px] mt-0.5" style={{ color: "rgba(245,240,235,0.4)" }}>{p.handle} · {p.followers} abonnés</div>
              ) : (
                <div className="text-[10px] mt-0.5" style={{ color: "rgba(245,240,235,0.25)" }}>Non connecté</div>
              )}
            </div>
            <button
              className="px-3 py-1.5 text-[10px] font-semibold border transition-all"
              style={{
                borderColor: p.connected ? "rgba(168,208,141,0.2)" : "rgba(199,91,57,0.3)",
                color: p.connected ? "#A8D08D" : "var(--color-accent)",
                backgroundColor: p.connected ? "rgba(168,208,141,0.05)" : "var(--accent-soft)",
              }}
            >
              {p.connected ? "Connecté ✓" : "Connecter"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function CoManagementSection() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px]" style={{ color: "rgba(245,240,235,0.4)" }}>
          Personnes ayant accès à votre dashboard
        </p>
        <button className="px-3 py-1.5 text-[10px] font-semibold border" style={{ borderColor: "rgba(199,91,57,0.3)", color: "var(--color-accent)", backgroundColor: "var(--accent-soft)" }}>
          + Inviter
        </button>
      </div>
      {TEAM_MEMBERS.map((m) => (
        <div key={m.id} className="flex items-center gap-3 p-4 border" style={{ borderColor: "rgba(245,240,235,0.06)", backgroundColor: "var(--color-surface)" }}>
          <div className="w-9 h-9 flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: "var(--accent-soft)", color: "var(--color-accent)", border: "1px solid rgba(199,91,57,0.2)" }}>
            {m.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{m.name}</div>
            <div className="text-[10px] mt-0.5" style={{ color: "rgba(245,240,235,0.35)" }}>{m.role} · depuis {m.since}</div>
          </div>
          <div className="text-[10px] px-2 py-1 border" style={{ borderColor: "rgba(245,240,235,0.06)", color: "rgba(245,240,235,0.4)" }}>{m.access}</div>
          <button className="text-[9px] ml-2" style={{ color: "#E05C5C" }}>Retirer</button>
        </div>
      ))}
    </div>
  );
}

function BillingSection() {
  return (
    <div className="flex flex-col gap-4">
      <div className="p-5 border relative overflow-hidden" style={{ borderColor: "rgba(199,91,57,0.25)", background: "linear-gradient(135deg, rgba(199,91,57,0.1) 0%, transparent 60%)" }}>
        <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: "var(--color-accent)" }} />
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-xs font-bold" style={{ color: "var(--color-accent)" }}>Plan Pro</div>
            <div className="text-[10px] mt-0.5" style={{ color: "rgba(245,240,235,0.4)" }}>Facturation mensuelle · Renouvellement le 1er juillet</div>
          </div>
          <div className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>€49<span className="text-xs font-normal">/mois</span></div>
        </div>
        <div className="flex items-center gap-2">
          {["6 Agents IA", "Atlas CRM", "Analytics avancés", "Support prioritaire"].map((f) => (
            <div key={f} className="flex items-center gap-1 text-[9px]" style={{ color: "rgba(245,240,235,0.4)" }}>
              <Check size={8} style={{ color: "#A8D08D" }} />
              {f}
            </div>
          ))}
        </div>
      </div>
      <div className="border" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(245,240,235,0.4)" }}>Historique des paiements</span>
        </div>
        {[
          { date: "1 Juin 2026", amount: "€49.00", status: "Payé" },
          { date: "1 Mai 2026", amount: "€49.00", status: "Payé" },
          { date: "1 Avr 2026", amount: "€49.00", status: "Payé" },
        ].map((p) => (
          <div key={p.date} className="flex items-center justify-between px-4 py-3 border-b last:border-b-0" style={{ borderColor: "rgba(245,240,235,0.04)" }}>
            <div className="text-[10px]" style={{ color: "rgba(245,240,235,0.5)" }}>{p.date}</div>
            <div className="text-[10px] font-semibold" style={{ color: "var(--text-primary)" }}>{p.amount}</div>
            <div className="text-[9px] px-1.5 py-0.5" style={{ color: "#A8D08D", border: "1px solid rgba(168,208,141,0.2)" }}>{p.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const SECTION_CONTENT: Record<Section, React.ReactNode> = {
  profile: <ProfileSection />,
  notifications: <NotificationsSection />,
  security: <SecuritySection />,
  appearance: <AppearanceSection />,
  integrations: <IntegrationsSection />,
  "co-management": <CoManagementSection />,
  billing: <BillingSection />,
};

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>("profile");

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
          Paramètres
        </h1>
        <p className="text-xs mt-0.5" style={{ color: "rgba(245,240,235,0.4)" }}>
          Gérez votre compte, vos préférences et vos connexions
        </p>
      </div>

      {/* Layout */}
      <div className="flex gap-6">
        {/* Sidebar nav */}
        <div className="w-52 shrink-0">
          <div className="border" style={{ borderColor: "rgba(245,240,235,0.06)", backgroundColor: "var(--color-card)" }}>
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const isActive = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className="w-full flex items-start gap-2.5 px-3 py-3 text-left border-b last:border-b-0 transition-all"
                  style={{
                    borderColor: "rgba(245,240,235,0.04)",
                    backgroundColor: isActive ? "var(--accent-soft)" : "transparent",
                    borderLeft: isActive ? "2px solid var(--color-accent)" : "2px solid transparent",
                  }}
                >
                  <Icon size={14} style={{ color: isActive ? "var(--color-accent)" : "rgba(245,240,235,0.3)", marginTop: 1 }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-semibold flex items-center gap-1.5" style={{ color: isActive ? "var(--color-accent)" : "var(--text-primary)" }}>
                      {s.label}
                      {s.badge && <span className="text-[8px] px-1 py-0.5 font-bold" style={{ backgroundColor: "var(--accent-soft)", color: "var(--color-accent)", border: "1px solid rgba(199,91,57,0.2)" }}>{s.badge}</span>}
                    </div>
                    <div className="text-[9px] mt-0.5 truncate" style={{ color: "rgba(245,240,235,0.25)" }}>{s.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 border p-6" style={{ borderColor: "rgba(245,240,235,0.06)", backgroundColor: "var(--color-card)" }}>
          <div className="mb-5 pb-4 border-b" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {SECTIONS.find((s) => s.id === activeSection)?.label}
            </h2>
            <p className="text-[10px] mt-0.5" style={{ color: "rgba(245,240,235,0.4)" }}>
              {SECTIONS.find((s) => s.id === activeSection)?.desc}
            </p>
          </div>
          {SECTION_CONTENT[activeSection]}
        </div>
      </div>
    </div>
  );
}
