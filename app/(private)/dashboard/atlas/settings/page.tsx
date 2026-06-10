"use client";

import { useState } from "react";
import Link from "next/link";
import { Settings, Shield, Bell, Mail, Globe, Database, CheckCircle, XCircle, ArrowRight, ExternalLink } from "lucide-react";

export default function AtlasSettingsPage() {
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>Paramètres Atlas</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-primary)" }}>Configure tes canaux, préférences et conformité</p>
      </div>

      {/* Connected Channels */}
      <Section title="Canaux connectés" icon={Globe}>
        <ChannelRow label="Email (Resend)" connected={false} />
        <ChannelRow label="SMS (Twilio)" connected={false} />
        <ChannelRow label="Push notifications (Web)" connected={false} />
        <ChannelRow label="Instagram DM (Meta)" connected={false} />
        <ChannelRow label="OnlyFans DM (Manuel)" connected={true} />
        <ChannelRow label="TikTok DM" connected={false} />
      </Section>

      {/* Message Templates */}
      <Section title="Templates de messages" icon={Mail}>
        <p className="text-xs mb-3" style={{ color: "var(--text-primary)" }}>Les templates permettent de standardiser tes réponses automatiques</p>
        <TemplateRow name="Bienvenue" preview="Hey {name}! 🔥 So glad you joined..." />
        <TemplateRow name="Relance 7 jours" preview="Hey {name}! 💫 Been a while — wanted to check in..." />
        <TemplateRow name="Remerciement achat" preview="{name}! 🫶 Huge thank you for your support..." />
        <TemplateRow name="Anniversaire" preview="Happy birthday {name}! 🎂🎉 You deserve something special..." />
      </Section>

      {/* Compliance */}
      <Section title="Conformité & Disclosure" icon={Shield}>
        <div className="space-y-3">
          <p className="text-xs" style={{ color: "var(--text-primary)" }}>
            Assure-toi que toutes tes communications respectent les réglementations en vigueur (RGPD, CAN-SPAM, FTC).
          </p>
          <Link
            href="/dashboard/atlas/settings/compliance"
            className="flex items-center justify-between text-sm group transition-colors"
            style={{ color: "var(--text-primary)" }}
          >
            <span>Centre de conformité complet</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" style={{ color: "var(--accent)" }} />
          </Link>
        </div>
      </Section>

      {/* Privacy */}
      <Section title="Gestion des données" icon={Database}>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span style={{ color: "var(--text-primary)" }}>Rétention des données fans</span>
            <span style={{ color: "var(--text-primary)" }}>12 mois</span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ color: "var(--text-primary)" }}>Anonymisation automatique</span>
            <span className="text-xs px-2 py-0.5 rounded-sm" style={{ background: "rgba(16,185,129,0.1)", color: "var(--success)" }}>Activée</span>
          </div>
        </div>
      </Section>

      <button onClick={handleSave}
        className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-sm transition-opacity hover:opacity-80"
        style={{ background: "var(--accent)", color: "var(--text-primary)" }}>
        {saved ? <><CheckCircle size={14} /> Sauvegardé</> : "Sauvegarder les paramètres"}
      </button>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="p-4 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
        <Icon size={14} /> {title}
      </h3>
      {children}
    </div>
  );
}

function ChannelRow({ label, connected }: { label: string; connected: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span style={{ color: "var(--text-primary)" }}>{label}</span>
      <span className={`flex items-center gap-1 text-xs ${
        connected ? "text-[var(--success)]" : "text-[var(--text-primary)]"
      }`}>
        {connected ? <CheckCircle size={12} /> : <XCircle size={12} />}
        {connected ? "Connecté" : "Non connecté"}
      </span>
    </div>
  );
}

function TemplateRow({ name, preview }: { name: string; preview: string }) {
  return (
    <div className="py-2">
      <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{name}</span>
      <p className="text-xs mt-0.5 italic" style={{ color: "var(--text-primary)" }}>{preview}</p>
    </div>
  );
}
