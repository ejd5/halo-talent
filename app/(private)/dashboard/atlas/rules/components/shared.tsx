"use client";

import { Loader, Zap, AlertCircle } from "lucide-react";

export function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <Loader size={16} className="animate-spin" style={{ color: "rgba(245,240,235,0.2)" }} />
    </div>
  );
}

export function EmptyState({ icon: Icon, title, desc }: { icon: any; title: string; desc?: string }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <Icon size={32} style={{ color: "rgba(245,240,235,0.06)" }} />
      <p className="text-sm mt-3" style={{ color: "rgba(245,240,235,0.15)" }}>{title}</p>
      {desc && <p className="text-xs mt-1" style={{ color: "rgba(245,240,235,0.1)" }}>{desc}</p>}
    </div>
  );
}

export function Modal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar animate-scale-fade"
        style={{ backgroundColor: "#1A1614", border: "1px solid rgba(245,240,235,0.1)" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
          <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}>{title}</h2>
          <button onClick={onClose} className="text-xs px-2 py-1" style={{ color: "var(--color-ink-tertiary)" }}>✕</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex gap-2 mb-6">
      {steps.map((s, i) => (
        <div key={i} className="flex-1 flex items-center gap-2">
          <div
            className="w-6 h-6 flex items-center justify-center text-xs font-medium"
            style={{
              backgroundColor: i <= current ? "#C75B39" : "rgba(245,240,235,0.06)",
              color: i <= current ? "#F5F0EB" : "var(--color-ink-tertiary)",
            }}
          >
            {i + 1}
          </div>
          <span className="text-xs hidden md:inline" style={{ color: i <= current ? "#F5F0EB" : "var(--color-ink-tertiary)" }}>
            {s}
          </span>
        </div>
      ))}
    </div>
  );
}

export function SelectOption({ label, options, value, onChange }: {
  label: string; options: { value: string; label: string }[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-ink-secondary)" }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm"
        style={{ backgroundColor: "#2A2420", border: "1px solid rgba(245,240,235,0.06)", color: "#F5F0EB", outline: "none" }}
      >
        <option value="">Sélectionner...</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function Input({ label, value, onChange, placeholder, type = "text" }: {
  label?: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div className="mb-3">
      {label && <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-ink-secondary)" }}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm"
        style={{ backgroundColor: "#2A2420", border: "1px solid rgba(245,240,235,0.06)", color: "#F5F0EB", outline: "none" }}
      />
    </div>
  );
}

export function Badge({ text, color }: { text: string; color?: string }) {
  return (
    <span
      className="inline-flex text-[10px] px-1.5 py-0.5 font-medium"
      style={{ backgroundColor: color ? `${color}15` : "rgba(199,91,57,0.1)", color: color ?? "#C75B39" }}
    >
      {text}
    </span>
  );
}

export function Alert({ children, type = "warning" }: { children: React.ReactNode; type?: "warning" | "info" | "success" }) {
  const colors = {
    warning: { bg: "rgba(199,91,57,0.04)", border: "rgba(199,91,57,0.1)", text: "#C75B39" },
    info: { bg: "rgba(91,143,168,0.04)", border: "rgba(91,143,168,0.1)", text: "#5B8FA8" },
    success: { bg: "rgba(122,154,101,0.04)", border: "rgba(122,154,101,0.1)", text: "#7A9A65" },
  };
  const c = colors[type];
  return (
    <div className="flex items-start gap-2 p-3 text-sm" style={{ backgroundColor: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
      <AlertCircle size={14} style={{ marginTop: 2 }} />
      <div>{children}</div>
    </div>
  );
}
