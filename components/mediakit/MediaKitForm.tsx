"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import type { MediaKitState, PortfolioItem, PricingTier } from "@/lib/mediakit/types";

/* ─── Section accordion ─── */
function SectionToggle({
  label, open, onToggle, children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div style={{ borderBottom: "1px solid var(--border-default)" }}>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-4 py-3 text-[11px] font-semibold text-left transition-colors"
        style={{ color: "var(--text-primary)" }}
      >
        {label}
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );
}

/* ─── Form component ─── */
export function MediaKitForm({
  state,
  onStateChange,
}: {
  state: MediaKitState;
  onStateChange: (s: MediaKitState) => void;
}) {
  const [openSection, setOpenSection] = useState<string>("profile");

  const updateProfile = (field: string, value: string) => {
    onStateChange({
      ...state,
      data: { ...state.data, profile: { ...state.data.profile, [field]: value } },
    });
  };

  const updatePricing = (id: string, field: "price" | "label" | "description", value: string | number) => {
    onStateChange({
      ...state,
      data: {
        ...state.data,
        pricing: state.data.pricing.map((p) =>
          p.id === id ? { ...p, [field]: value } : p
        ),
      },
    });
  };

  const togglePortfolio = (id: string) => {
    const sel = state.selectedPortfolio;
    onStateChange({
      ...state,
      selectedPortfolio: sel.includes(id) ? sel.filter((i) => i !== id) : [...sel, id],
    });
  };

  const toggleTemplate = (t: typeof state.template) => {
    onStateChange({ ...state, template: t });
  };

  const toggleVisibility = (field: "showStats" | "showPricing" | "showPortfolio") => {
    onStateChange({ ...state, [field]: !state[field] });
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}
    >
      <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border-default)" }}>
        <p className="text-[10px] font-semibold" style={{ color: "var(--text-primary)" }}>
          Personnalisez votre Média Kit
        </p>
      </div>

      {/* ═══ Template selector ═══ */}
      <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border-default)" }}>
        <p className="text-[9px] font-medium mb-2" style={{ color: "var(--text-tertiary)" }}>Template</p>
        <div className="flex gap-1.5">
          {(["minimal", "bold", "creative"] as const).map((t) => (
            <button
              key={t}
              onClick={() => toggleTemplate(t)}
              className="flex-1 py-1.5 text-[9px] font-medium rounded transition-colors capitalize"
              style={{
                backgroundColor: state.template === t ? "var(--accent)" : "var(--bg-surface)",
                color: state.template === t ? "#fff" : "var(--text-secondary)",
                border: "1px solid",
                borderColor: state.template === t ? "var(--accent)" : "var(--border-default)",
              }}
            >
              {t === "minimal" ? "Minimal" : t === "bold" ? "Bold" : "Creative"}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ Profile ═══ */}
      <SectionToggle label="Profil" open={openSection === "profile"} onToggle={() => setOpenSection(openSection === "profile" ? "" : "profile")}>
        <InputField label="Pseudo" value={state.data.profile.pseudo} onChange={(v) => updateProfile("pseudo", v)} />
        <InputField label="Nom" value={state.data.profile.name} onChange={(v) => updateProfile("name", v)} />
        <div>
          <label className="text-[9px] font-medium block mb-1" style={{ color: "var(--text-tertiary)" }}>Bio</label>
          <textarea
            value={state.data.profile.bio}
            onChange={(e) => updateProfile("bio", e.target.value)}
            maxLength={200}
            rows={3}
            className="w-full px-2 py-1.5 text-[10px] rounded outline-none resize-none"
            style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)", border: "1px solid var(--border-default)" }}
          />
          <p className="text-[8px] mt-0.5 text-right" style={{ color: "var(--text-tertiary)" }}>
            {state.data.profile.bio.length}/200
          </p>
        </div>
        <InputField label="Langues" value={state.data.profile.languages.join(", ")} onChange={(v) => onStateChange({ ...state, data: { ...state.data, profile: { ...state.data.profile, languages: v.split(", ").map((s) => s.trim()).filter(Boolean) } } })} placeholder="Français, English" />
        <InputField label="Pays" value={state.data.profile.country} onChange={(v) => updateProfile("country", v)} />
      </SectionToggle>

      {/* ═══ Sections visibility ═══ */}
      <SectionToggle label="Sections" open={openSection === "sections"} onToggle={() => setOpenSection(openSection === "sections" ? "" : "sections")}>
        {[
          { key: "showStats" as const, label: "Statistiques" },
          { key: "showPortfolio" as const, label: "Portfolio" },
          { key: "showPricing" as const, label: "Tarifs" },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={state[key]}
              onChange={() => toggleVisibility(key)}
              className="w-3.5 h-3.5 rounded"
              style={{ accentColor: "var(--accent)" }}
            />
            <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>{label}</span>
          </label>
        ))}
      </SectionToggle>

      {/* ═══ Portfolio selection ═══ */}
      <SectionToggle label="Portfolio" open={openSection === "portfolio"} onToggle={() => setOpenSection(openSection === "portfolio" ? "" : "portfolio")}>
        {state.data.portfolio.map((item) => (
          <label key={item.id} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={state.selectedPortfolio.includes(item.id)}
              onChange={() => togglePortfolio(item.id)}
              className="w-3.5 h-3.5 rounded"
              style={{ accentColor: "var(--accent)" }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium truncate" style={{ color: "var(--text-primary)" }}>{item.title}</p>
              <p className="text-[8px]" style={{ color: "var(--text-tertiary)" }}>{item.platform} · {item.type}</p>
            </div>
          </label>
        ))}
      </SectionToggle>

      {/* ═══ Pricing ═══ */}
      <SectionToggle label="Tarifs" open={openSection === "pricing"} onToggle={() => setOpenSection(openSection === "pricing" ? "" : "pricing")}>
        {state.data.pricing.map((p) => (
          <div key={p.id} className="space-y-1.5 p-2 rounded-lg" style={{ backgroundColor: "var(--bg-surface)" }}>
            <input
              value={p.label}
              onChange={(e) => updatePricing(p.id, "label", e.target.value)}
              className="w-full px-2 py-1 text-[10px] font-medium rounded outline-none"
              style={{ backgroundColor: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border-default)" }}
            />
            <div className="flex gap-1.5">
              <input
                type="number"
                value={p.price}
                onChange={(e) => updatePricing(p.id, "price", Number(e.target.value))}
                className="w-20 px-2 py-1 text-[10px] rounded outline-none"
                style={{ backgroundColor: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border-default)" }}
              />
              <input
                value={p.description}
                onChange={(e) => updatePricing(p.id, "description", e.target.value)}
                className="flex-1 px-2 py-1 text-[9px] rounded outline-none"
                style={{ backgroundColor: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border-default)" }}
              />
            </div>
          </div>
        ))}
      </SectionToggle>

      {/* ═══ Contact ═══ */}
      <SectionToggle label="Contact" open={openSection === "contact"} onToggle={() => setOpenSection(openSection === "contact" ? "" : "contact")}>
        <InputField label="Email" value={state.data.contactEmail} onChange={(v) => onStateChange({ ...state, data: { ...state.data, contactEmail: v } })} />
        <InputField label="Lien de booking" value={state.data.bookingLink} onChange={(v) => onStateChange({ ...state, data: { ...state.data, bookingLink: v } })} />
      </SectionToggle>
    </div>
  );
}

/* ─── Input field helper ─── */
function InputField({
  label, value, onChange, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[9px] font-medium block mb-1" style={{ color: "var(--text-tertiary)" }}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-2 py-1.5 text-[10px] rounded outline-none"
        style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)", border: "1px solid var(--border-default)" }}
      />
    </div>
  );
}
