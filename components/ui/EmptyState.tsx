"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type EmptyStateVariant =
  | "default"
  | "library"
  | "creators"
  | "posts"
  | "calendar"
  | "messages"
  | "goals";

const VARIANT_CONFIG: Record<
  EmptyStateVariant,
  { emoji: string; defaultTitle: string; defaultAction?: string }
> = {
  default: {
    emoji: "📂",
    defaultTitle: "Aucune donnée pour le moment",
    defaultAction: "Créer",
  },
  library: {
    emoji: "📁",
    defaultTitle:
      "Aucun média encore. Commencez par uploader votre premier fichier.",
    defaultAction: "Uploader",
  },
  creators: {
    emoji: "👤",
    defaultTitle:
      "Aucun créateur encore. Commencez par approuver une candidature.",
    defaultAction: "Voir les candidatures",
  },
  posts: {
    emoji: "📝",
    defaultTitle: "Aucune publication pour le moment",
    defaultAction: "Créer un post",
  },
  calendar: {
    emoji: "📅",
    defaultTitle: "Aucun événement planifié",
    defaultAction: "Planifier",
  },
  messages: {
    emoji: "💬",
    defaultTitle: "Aucun message pour le moment",
    defaultAction: "Voir les messages",
  },
  goals: {
    emoji: "🎯",
    defaultTitle:
      "Aucun objectif défini. Fixez-vous un premier cap.",
    defaultAction: "Créer un objectif",
  },
};

export function EmptyState({
  variant = "default",
  title,
  description,
  action,
  onAction,
  illustration,
  className,
}: {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  action?: string;
  onAction?: () => void;
  illustration?: ReactNode;
  className?: string;
}) {
  const config = VARIANT_CONFIG[variant];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 border border-[var(--color-border)] animate-fade-in",
        className,
      )}
      style={{ backgroundColor: "var(--color-card)" }}
    >
      {illustration ?? (
        <div className="text-5xl mb-4 opacity-30">{config.emoji}</div>
      )}
      <h3
        className="text-base font-semibold text-center max-w-sm"
        style={{ color: "var(--color-ink)" }}
      >
        {title ?? config.defaultTitle}
      </h3>
      {description && (
        <p
          className="text-sm mt-1.5 text-center max-w-sm"
          style={{ color: "var(--color-ink-muted)" }}
        >
          {description}
        </p>
      )}
      {action && onAction && (
        <button
          onClick={onAction}
          className="mt-5 flex items-center gap-1.5 px-4 py-2 text-[10px] uppercase tracking-wider font-medium transition-opacity hover:opacity-80"
          style={{ backgroundColor: "var(--color-accent)", color: "#FFFFFF" }}
        >
          {action}
        </button>
      )}
    </div>
  );
}
