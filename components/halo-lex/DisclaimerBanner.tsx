"use client";

import { Info } from "lucide-react";

interface DisclaimerBannerProps {
  locale?: string;
  compact?: boolean;
}

export function DisclaimerBanner({ locale = "fr", compact = false }: DisclaimerBannerProps) {
  const text = locale === "en"
    ? "WTF Lex provides general legal information only. This does not constitute personalized legal advice. For complex cases, we connect you with our partner lawyer network."
    : "WTF Lex fournit une information juridique générale. Cela ne constitue pas un conseil juridique personnalisé. Pour les cas complexes, nous vous mettons en relation avec notre réseau d'avocats partenaires.";

  if (compact) {
    return (
      <div className="flex items-start gap-2 px-3 py-2 text-xs" style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}>
        <Info size={12} style={{ color: "rgb(34,197,94)" }} className="mt-0.5 shrink-0" />
        <span style={{ color: "rgba(255,255,255,0.6)" }}>{text}</span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 px-4 py-3 text-sm" style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}>
      <Info size={16} style={{ color: "rgb(34,197,94)" }} className="mt-0.5 shrink-0" />
      <div>
        <p className="font-medium mb-1" style={{ color: "var(--text-primary)" }}>
          {locale === "en" ? "Legal Information Notice" : "Information juridique"}
        </p>
        <p style={{ color: "rgba(255,255,255,0.6)" }}>{text}</p>
      </div>
    </div>
  );
}
