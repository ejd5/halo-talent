"use client";
import { User, Bell, Shield, Palette } from "lucide-react";

const sections = [
  { icon: User, label: "Profil", desc: "Nom, email, photo" },
  { icon: Bell, label: "Notifications", desc: "Alertes et rappels" },
  { icon: Shield, label: "Confidentialité", desc: "Données et sécurité" },
  { icon: Palette, label: "Apparence", desc: "Thème et langue" },
];

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Paramètres</h1>
        <p className="text-xs opacity-40 mt-1">Gérez vos préférences</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sections.map((s) => (
          <button key={s.label} className="flex items-center gap-3 p-4 border border-[var(--color-border)] hover:bg-[var(--color-card)] transition-colors text-left">
            <div className="p-2 border border-[var(--color-border)]"><s.icon size={16} /></div>
            <div>
              <div className="text-xs font-medium">{s.label}</div>
              <div className="text-[10px] opacity-30">{s.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
