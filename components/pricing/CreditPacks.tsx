"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";

const PACKS = [
  { credits: 100, price: 9, popular: false },
  { credits: 500, price: 39, popular: true },
];

export function CreditPacks() {
  return (
    <div className="text-center">
      <h3 className="text-sm font-bold mb-2" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
        <Sparkles size={14} className="inline mr-1.5" style={{ color: "var(--accent)" }} />
        Packs de crédits IA
      </h3>
      <p className="text-[11px] mb-5" style={{ color: "var(--text-tertiary)" }}>
        Des crédits supplémentaires valables à vie, utilisables sur tous les modèles IA.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-3">
        {PACKS.map((pack) => (
          <div
            key={pack.credits}
            className="flex flex-col items-center p-4 rounded-xl min-w-[140px] transition-all"
            style={{
              backgroundColor: pack.popular ? "var(--accent-soft)" : "var(--bg-card)",
              border: pack.popular
                ? "1px solid var(--accent)"
                : "1px solid var(--border-default)",
            }}
          >
            {pack.popular && (
              <span
                className="text-[9px] font-medium px-2 py-0.5 rounded-full mb-2"
                style={{ backgroundColor: "var(--accent)", color: "var(--accent-text, #fff)" }}
              >
                Populaire
              </span>
            )}
            <span
              className="text-lg font-bold"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
            >
              {pack.credits}
            </span>
            <span className="text-[10px] mb-2" style={{ color: "var(--text-tertiary)" }}>
              crédits
            </span>
            <div className="flex items-baseline gap-0.5 mb-3">
              <span
                className="text-xl font-bold"
                style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}
              >
                {pack.price}
              </span>
              <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                €
              </span>
            </div>
            <Link
              href="/apply"
              className="w-full text-center py-1.5 text-[10px] font-medium rounded-lg transition-colors"
              style={{
                backgroundColor: pack.popular ? "var(--accent)" : "transparent",
                color: pack.popular ? "var(--accent-text, #fff)" : "var(--accent)",
                border: pack.popular ? "none" : "1px solid var(--accent)",
              }}
            >
              Acheter
            </Link>
          </div>
        ))}
      </div>

      <p className="text-[9px] mt-3" style={{ color: "var(--text-tertiary)" }}>
        Utilisables sur tous les plans. Valables à vie. Sans expiration.
      </p>
    </div>
  );
}
