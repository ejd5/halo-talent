"use client";

import { useState, useEffect } from "react";
import { Shield, MessageSquare, FileText, ArrowRight, X, Sparkles } from "lucide-react";

interface LexOnboardingModalProps {
  locale?: string;
  open: boolean;
  onClose: () => void;
  onStart: () => void;
}

export function LexOnboardingModal({ locale = "fr", open, onClose, onStart }: LexOnboardingModalProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  if (!open) return null;

  const isEn = locale === "en";

  const slides = [
    {
      icon: Shield,
      title: isEn ? "Meet Lex, your AI legal advisor" : "Découvrez Lex, votre conseiller juridique IA",
      desc: isEn
        ? "Lex is an AI specialized in creator legal protection. Available 24/7, it answers your questions, analyzes your situation, and helps you take action."
        : "Lex est une IA spécialisée dans la protection juridique des créateurs. Disponible 24/7, il répond à vos questions, analyse votre situation et vous aide à agir.",
    },
    {
      icon: MessageSquare,
      title: isEn ? "Chat, voice, or video" : "Texte, vocal ou vidéo",
      desc: isEn
        ? "Interact with Lex however you want: type your question, use voice input, or talk to the real-time human avatar."
        : "Interagissez avec Lex comme vous le souhaitez : tapez votre question, utilisez l'entrée vocale, ou parlez à l'avatar humain temps réel.",
    },
    {
      icon: FileText,
      title: isEn ? "From diagnosis to action" : "Du diagnostic à l'action",
      desc: isEn
        ? "Lex guides you through a structured diagnosis, generates professional legal letters, and escalates to partner lawyers for complex cases."
        : "Lex vous guide dans un diagnostic structuré, génère des lettres juridiques professionnelles, et escalade vers des avocats partenaires pour les cas complexes.",
    },
  ];

  const SlideIcon = slides[step].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        className="w-full max-w-md mx-4 p-8 relative"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 p-1" style={{ color: "var(--text-secondary)" }}>
          <X size={18} />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(199,91,57,0.2))" }}
          >
            <SlideIcon size={28} style={{ color: "rgb(16,185,129)" }} />
          </div>

          {/* Badge */}
          <span
            className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.12em] px-2 py-0.5 mb-3"
            style={{ background: "rgba(16,185,129,0.12)", color: "rgb(16,185,129)" }}
          >
            <Sparkles size={10} />
            WTF Lex
          </span>

          {/* Title */}
          <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            {slides[step].title}
          </h3>

          {/* Description */}
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {slides[step].desc}
          </p>
        </div>

        {/* Steps dots */}
        <div className="flex justify-center gap-1.5 my-6">
          {slides.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                background: i === step ? "var(--accent)" : "rgba(255,255,255,0.15)",
                width: i === step ? 20 : 8,
              }}
            />
          ))}
        </div>

        {/* CTA */}
        {step < slides.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="w-full py-3 text-sm font-medium transition-colors"
            style={{ background: "var(--accent)", color: "var(--text-primary)" }}
          >
            <span className="flex items-center justify-center gap-2">
              {isEn ? "Next" : "Suivant"}
              <ArrowRight size={16} />
            </span>
          </button>
        ) : (
          <button
            onClick={onStart}
            className="w-full py-3 text-sm font-medium transition-colors"
            style={{ background: "var(--accent)", color: "var(--text-primary)" }}
          >
            {isEn ? "Meet Lex" : "Faire connaissance avec Lex"}
          </button>
        )}
      </div>
    </div>
  );
}
