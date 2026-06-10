"use client";

import {
  UserPlus,
  DollarSign,
  MessageSquare,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

type Activity = {
  icon: React.ElementType;
  text: string;
  time: string;
  color: string;
};

const activities: Activity[] = [
  {
    icon: UserPlus,
    text: "Nouvelle candidature : Sarah K. (Digital Creators)",
    time: "12 min",
    color: "var(--accent)",
  },
  {
    icon: DollarSign,
    text: "Revenu OnlyFans synchronisé : Marc T. (+2 340 €)",
    time: "1 h",
    color: "var(--success)",
  },
  {
    icon: MessageSquare,
    text: "Message non lu de Léa R.",
    time: "2 h",
    color: "var(--text-secondary)",
  },
  {
    icon: FileText,
    text: "Contrat signé : Emma V. (Music & Performing Arts)",
    time: "3 h",
    color: "var(--success)",
  },
  {
    icon: AlertCircle,
    text: "Paiement en attente : Alex M. (Sport & Lifestyle)",
    time: "5 h",
    color: "var(--danger)",
  },
  {
    icon: CheckCircle,
    text: "Candidature approuvée : Hugo P.",
    time: "1 j",
    color: "var(--success)",
  },
  {
    icon: UserPlus,
    text: "Nouveau créateur encarté : Inès D. (Digital Creators)",
    time: "1 j",
    color: "var(--accent)",
  },
  {
    icon: DollarSign,
    text: "Paiement Instagram validé : Clara W. (+890 €)",
    time: "2 j",
    color: "var(--success)",
  },
];

export function ActivityFeed() {
  return (
    <div
      className="flex flex-col card-accent"
      style={{
        background: "var(--bg-primary)",
        border: "1px solid var(--border-default)",
        height: "100%",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{
          borderBottom: "1px solid var(--border-default)",
        }}
      >
        <h2
          className="font-display text-base font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Activité récente
        </h2>
        <span
          className="relative flex h-2 w-2"
        >
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ background: "var(--success)" }}
          />
          <span
            className="relative inline-flex rounded-full h-2 w-2"
            style={{ background: "var(--success)" }}
          />
        </span>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: "var(--border-default)" }}>
        {activities.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={i}
              className="flex items-start gap-3 w-full text-left px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
            >
              <div
                className="w-8 h-8 flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  background: `${item.color}12`,
                }}
              >
                <Icon size={14} strokeWidth={1.5} style={{ color: item.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="text-[13px] font-sans leading-snug"
                  style={{ color: "#D0CCC6" }}
                >
                  {item.text}
                </p>
                <p
                  className="text-[11px] font-sans mt-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  il y a {item.time}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
