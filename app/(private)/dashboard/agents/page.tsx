"use client";

import Link from "next/link";
import { ArrowRight, Bot, BarChart3, MessageCircle, TrendingUp, DollarSign, Heart } from "lucide-react";
import { AGENT_LABELS, AGENT_EMOJIS, AGENT_DESCRIPTIONS } from "@/lib/agents/constants";
import type { AgentName } from "@/lib/agents/constants";

const agents: { key: AgentName; status: string }[] = [
  { key: "content", status: "3 idées prêtes pour cette semaine" },
  { key: "analytics", status: "Nouveau rapport hebdo disponible" },
  { key: "engagement", status: "12 brouillons prêts" },
  { key: "trends", status: "5 tendances détectées dans votre niche" },
  { key: "pricing", status: "Suggestion : augmenter votre abonnement de 12€ à 15€" },
  { key: "wellness", status: "Vous travaillez 9h/jour en moyenne" },
];

const agentIcons: Record<AgentName, React.ElementType> = {
  content: Bot, analytics: BarChart3, engagement: MessageCircle,
  trends: TrendingUp, pricing: DollarSign, wellness: Heart,
};

export default function AgentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Mes agents IA</h1>
        <p className="text-base mt-1" style={{ color: "#FFFFFF" }}>6 assistants spécialisés pour booster votre activité</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {agents.map(({ key, status }) => {
          const Icon = agentIcons[key];
          return (
            <Link
              key={key}
              href={`/dashboard/agents/${key}`}
              className="p-5 border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all group"
              style={{ backgroundColor: "var(--color-card)" }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 border border-[var(--color-border)] flex items-center justify-center text-xl" style={{ backgroundColor: "var(--color-surface)" }}>
                    <span>{AGENT_EMOJIS[key]}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">{AGENT_LABELS[key]}</h3>
                    <p className="text-sm mt-0.5" style={{ color: "#FFFFFF" }}>{AGENT_DESCRIPTIONS[key]}</p>
                  </div>
                </div>
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-60 transition-opacity shrink-0" style={{ color: "#FFFFFF" }} />
              </div>
              <div className="flex items-center gap-2">
                <Icon size={14} className="shrink-0" style={{ color: "#FFFFFF" }} />
                <span className="text-sm font-medium" style={{ color: "var(--color-accent)" }}>{status}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
