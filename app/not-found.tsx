"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--encre, #0C0A08)" }}
    >
      <div className="text-center max-w-md px-6">
        {/* Decorative halo */}
        <div className="relative mb-12">
          <div
            className="halo-glow"
            style={{
              width: 200,
              height: 200,
              position: "relative",
              margin: "0 auto",
            }}
          />
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: "var(--font-couture, 'Playfair Display', Georgia, serif)",
              fontSize: "clamp(64px, 10vw, 96px)",
              fontWeight: 900,
              color: "var(--or, #D8A95B)",
              opacity: 0.15,
            }}
          >
            404
          </span>
        </div>

        <p
          className="eyebrow mb-4"
          style={{ color: "var(--or, #D8A95B)" }}
        >
          Page introuvable
        </p>

        <h1
          style={{
            fontFamily: "var(--font-display-alt, 'Fraunces', serif)",
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 400,
            color: "var(--ivoire, #F4EEE3)",
            lineHeight: 1.15,
            marginBottom: 16,
          }}
        >
          Cette page n'existe pas.
        </h1>

        <p
          className="mb-10"
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: "var(--pierre, #9C9183)",
          }}
        >
          La page que vous cherchez a peut-être été déplacée, supprimée, ou n'a jamais existé.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="btn-eco btn-eco-fill"
          >
            Retour à l'accueil
          </Link>
          <Link
            href="/contact"
            className="btn-eco"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}
