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
    color: "#C75B39",
  },
  {
    icon: DollarSign,
    text: "Revenu OnlyFans synchronisé : Marc T. (+2 340 €)",
    time: "1 h",
    color: "#7A9A65",
  },
  {
    icon: MessageSquare,
    text: "Message non lu de Léa R.",
    time: "2 h",
    color: "#9A9590",
  },
  {
    icon: FileText,
    text: "Contrat signé : Emma V. (Music & Performing Arts)",
    time: "3 h",
    color: "#7A9A65",
  },
  {
    icon: AlertCircle,
    text: "Paiement en attente : Alex M. (Sport & Lifestyle)",
    time: "5 h",
    color: "#C44536",
  },
  {
    icon: CheckCircle,
    text: "Candidature approuvée : Hugo P.",
    time: "1 j",
    color: "#7A9A65",
  },
  {
    icon: UserPlus,
    text: "Nouveau créateur encarté : Inès D. (Digital Creators)",
    time: "1 j",
    color: "#C75B39",
  },
  {
    icon: DollarSign,
    text: "Paiement Instagram validé : Clara W. (+890 €)",
    time: "2 j",
    color: "#7A9A65",
  },
];

export function ActivityFeed() {
  return (
    <div
      className="flex flex-col"
      style={{
        background: "#1A1614",
        border: "1px solid rgba(255,255,255,0.04)",
        height: "100%",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <h2
          className="font-display text-base font-bold"
          style={{ color: "#F5F0EB" }}
        >
          Activité récente
        </h2>
        <span
          className="relative flex h-2 w-2"
        >
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ background: "#7A9A65" }}
          />
          <span
            className="relative inline-flex rounded-full h-2 w-2"
            style={{ background: "#7A9A65" }}
          />
        </span>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
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
                  style={{ color: "#5A544C" }}
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
