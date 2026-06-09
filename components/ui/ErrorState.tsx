"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle, RefreshCw } from "lucide-react";

export function ErrorState({
  title = "Une erreur est survenue",
  message,
  retry,
  fullPage,
  className,
}: {
  title?: string;
  message?: string;
  retry?: () => void;
  fullPage?: boolean;
  className?: string;
}) {
  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 border border-[var(--color-border)] animate-fade-in",
        className,
      )}
      style={{ backgroundColor: "var(--color-card)" }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: "var(--color-alert)" }}
      >
        <AlertTriangle size={20} color="#FFFFFF" />
      </div>
      <h3
        className="text-base font-semibold text-center max-w-sm"
        style={{ color: "var(--color-ink)" }}
      >
        {title}
      </h3>
      {message && (
        <p
          className="text-sm mt-1.5 text-center max-w-md"
          style={{ color: "var(--color-ink-muted)" }}
        >
          {message}
        </p>
      )}
      {retry && (
        <button
          onClick={retry}
          className="mt-5 flex items-center gap-1.5 px-4 py-2 text-[10px] uppercase tracking-wider font-medium transition-opacity hover:opacity-80"
          style={{ backgroundColor: "var(--color-accent)", color: "#FFFFFF" }}
        >
          <RefreshCw size={12} />
          Réessayer
        </button>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: "var(--color-base)" }}
      >
        {content}
      </div>
    );
  }

  return content;
}
