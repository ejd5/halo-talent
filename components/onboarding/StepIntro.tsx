"use client";

import { useEffect, useState } from "react";

export function StepIntro({ onStart }: { onStart: () => void }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      {/* Animated symbol */}
      <div
        className={`text-6xl mb-8 transition-all duration-1000 ease-out ${
          show ? "opacity-100 scale-100" : "opacity-0 scale-50"
        }`}
      >
        ✦
      </div>

      {/* Title */}
      <h1
        className={`text-3xl md:text-4xl font-bold mb-4 leading-tight transition-all duration-800 delay-200 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        Bienvenue chez Halo
      </h1>

      {/* Subtitle */}
      <p
        className={`text-base md:text-lg max-w-lg leading-relaxed mb-10 transition-all duration-800 delay-400 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
      >
        Prenons 5 minutes pour comprendre qui vous êtes. Vos réponses configurent votre{" "}
        <strong style={{ color: "var(--accent)" }}>ADN créatif</strong> — l&apos;intelligence
        qui personnalise tout dans Halo.
      </p>

      {/* Start button */}
      <button
        onClick={onStart}
        className={`px-10 py-3.5 text-sm font-semibold rounded-xl transition-all duration-800 delay-600 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{
          backgroundColor: "var(--accent)",
          color: "var(--accent-text, #fff)",
          fontFamily: "var(--font-body)",
        }}
      >
        Commencer le questionnaire
      </button>

      {/* Duration hint */}
      <p
        className={`text-xs mt-4 transition-all duration-800 delay-700 ${
          show ? "opacity-100" : "opacity-0"
        }`}
        style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-body)" }}
      >
        ~5 minutes · 8 questions
      </p>
    </div>
  );
}
