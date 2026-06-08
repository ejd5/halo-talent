"use client";

import { ChevronRight } from "lucide-react";

const activities = [
  {
    label: "Nouveau message de votre manager",
    time: "Il y a 2h",
    href: "/dashboard/messages",
  },
  {
    label: "Revenus OnlyFans synchronisés",
    time: "Hier",
    href: "/dashboard/analytics",
  },
  {
    label: "Nouvelle campagne suggérée par l'IA",
    time: "Il y a 2 jours",
    href: "/dashboard/ai",
  },
  {
    label: "Objectif mensuel atteint à 75%",
    time: "Il y a 3 jours",
    href: "/dashboard/analytics",
  },
  {
    label: "Contrat mis à jour — Nouvelle version disponible",
    time: "Il y a 5 jours",
    href: "/dashboard/contracts",
  },
];

export function ActivityTimeline() {
  return (
    <div>
      <h2 className="font-display text-2xl text-brand-ivory mb-6">
        Activité récente
      </h2>
      <div className="space-y-1">
        {activities.map((item, i) => (
          <a
            key={i}
            href={item.href}
            className="flex items-center justify-between py-3 px-4 border border-transparent hover:border-white/5 hover:bg-white/[0.02] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/50" />
              <span className="text-sm text-brand-taupe group-hover:text-brand-ivory transition-colors">
                {item.label}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-brand-taupe/60">{item.time}</span>
              <ChevronRight
                size={14}
                className="text-brand-taupe/30 group-hover:text-brand-gold transition-colors"
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
