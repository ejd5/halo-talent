"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service in production
    console.error("Application error:", error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--encre, #0C0A08)" }}
    >
      <div className="text-center max-w-md px-6">
        <div className="relative mb-10">
          <div
            style={{
              width: 64,
              height: 64,
              margin: "0 auto",
              borderRadius: "50%",
              background: "rgba(232, 99, 74, 0.1)",
              border: "1px solid rgba(232, 99, 74, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            ⚠
          </div>
        </div>

        <p
          className="eyebrow mb-4"
          style={{ color: "var(--danger, #E8634A)" }}
        >
          Erreur
        </p>

        <h1
          style={{
            fontFamily: "var(--font-display-alt, 'Fraunces', serif)",
            fontSize: "clamp(24px, 3.5vw, 36px)",
            fontWeight: 400,
            color: "var(--ivoire, #F4EEE3)",
            lineHeight: 1.15,
            marginBottom: 16,
          }}
        >
          Quelque chose s'est mal passé.
        </h1>

        <p
          className="mb-8"
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: "var(--pierre, #9C9183)",
          }}
        >
          Nous sommes désolés pour ce désagrément. L'erreur a été enregistrée et notre équipe a été notifiée.
        </p>

        {error?.digest && (
          <p
            className="mb-6"
            style={{
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              fontSize: 11,
              color: "var(--pierre, #9C9183)",
              opacity: 0.5,
            }}
          >
            Réf. {error.digest}
          </p>
        )}

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="btn-eco btn-eco-fill"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="btn-eco"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
