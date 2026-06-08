"use client";

import Link from "next/link";
import { Bot, Sparkles, ArrowRight } from "lucide-react";

const suggestions = [
  "Publie un Reel avant vendredi — ta niche est en pleine croissance cette semaine",
  "Optimise le prix de tes PPV : tes 5 derniers contenus à 15$ ont bien performé",
  "Utilise le format Carrousel pour ton prochain post Instagram — 40% plus d'engagement",
];

export function AIAssistantCard() {
  return (
    <div className="border border-accent/20 p-6 bg-gradient-to-br from-accent-soft to-base">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0">
          <Bot size={20} className="text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-2xl text-ink mb-1">
            Votre assistant
          </h2>
          <p className="text-sm text-ink-muted mb-6">
            Voici 3 suggestions pour cette semaine :
          </p>
          <ul className="space-y-4">
            {suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <Sparkles
                  size={14}
                  className="text-accent mt-1 flex-shrink-0"
                />
                <span className="text-sm text-ink-muted leading-relaxed">
                  {s}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard/ai"
            className="inline-flex items-center gap-2 mt-6 text-xs uppercase tracking-[0.15em] text-accent hover:text-accent-hover transition-colors"
          >
            Discuter avec l&apos;assistant <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
