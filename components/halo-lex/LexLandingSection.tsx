"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, MessageSquare, FileText, Scale, Sparkles, ArrowRight, Check, AlertTriangle, BookOpen, Users, Globe } from "lucide-react";

interface LexLandingSectionProps {
  locale?: string;
}

export function LexLandingSection({ locale = "fr" }: LexLandingSectionProps) {
  const isEn = locale === "en";

  const features = [
    {
      icon: MessageSquare,
      title: isEn ? "Interactive AI avatar (voice + text)" : "Avatar humain interactif (voix + texte)",
      desc: isEn ? "Real-time conversation with Lex, our photorealistic AI legal advisor. 180ms latency." : "Conversation temps réel avec Lex, notre conseiller juridique IA photoréaliste. 180ms de latence.",
    },
    {
      icon: BookOpen,
      title: isEn ? "Legal base updated daily" : "Base juridique auto-actualisée quotidiennement",
      desc: isEn ? "CGU from 8 platforms, French law, European regulations — updated every day." : "CGU de 8 plateformes, droit français, réglementation européenne — mis à jour chaque jour.",
    },
    {
      icon: FileText,
      title: isEn ? "Letter & legal notice generation" : "Génération de lettres et mises en demeure",
      desc: isEn ? "Generate professional appeal letters, notices, and complaints in 30 seconds." : "Générez des lettres d'appel, mises en demeure et réclamations professionnelles en 30 secondes.",
    },
    {
      icon: Scale,
      title: isEn ? "Abusive clause detection" : "Détection de clauses abusives",
      desc: isEn ? "Analyze your agency contract and detect unfair clauses instantly." : "Analysez votre contrat d'agence et détectez les clauses abusives en un instant.",
    },
    {
      icon: AlertTriangle,
      title: isEn ? "Guided 6-step diagnosis" : "Diagnostic guidé en 6 étapes",
      desc: isEn ? "Don't know how to formulate your problem? Lex guides you step by step." : "Vous ne savez pas formuler votre problème ? Lex vous guide étape par étape.",
    },
    {
      icon: Users,
      title: isEn ? "Lawyer escalation" : "Escalade automatique vers avocat partenaire",
      desc: isEn ? "Complex case? Lex connects you with our partner law firms." : "Cas complexe ? Lex vous met en relation avec nos cabinets d'avocats partenaires.",
    },
  ];

  const domains = [
    isEn ? "Image rights" : "Droit à l'image",
    isEn ? "Platform CGU" : "CGU plateformes",
    isEn ? "Agency disputes" : "Litiges agence",
    isEn ? "Legal notices" : "Mises en demeure",
    "RGPD",
    "DSA",
    isEn ? "Creator taxation" : "Fiscalité créateur",
    isEn ? "Revenge porn" : "Revenge porn",
    isEn ? "6 languages" : "6 langues",
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
        {/* Badge */}
        <div className="text-center mb-6">
          <span
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] px-3 py-1"
            style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(199,91,57,0.15))", border: "1px solid rgba(16,185,129,0.3)", color: "rgb(16,185,129)" }}
          >
            <Sparkles size={12} />
            {isEn ? "World Exclusive" : "Exclusivité mondiale"}
          </span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className="text-[2.5rem] md:text-[3rem] font-bold tracking-[-0.02em] leading-[1.05] max-w-3xl mx-auto"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            {isEn
              ? "The only creator OS with an integrated AI legal advisor"
              : "Le seul OS créateur avec un conseiller juridique IA intégré"}
          </h2>
          <p className="text-base md:text-lg mt-4 max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            {isEn
              ? "Halo Lex is your first line of legal defense. A virtual lawyer available 24/7, powered by a legal base updated in real-time."
              : "Halo Lex est votre première ligne de défense légale. Un avocat virtuel disponible 24/7, alimenté par une base juridique mise à jour en temps réel."}
          </p>
        </div>

        {/* Main block 50/50 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
          {/* Left — Mockup / Visual */}
          <div
            className="p-8 flex flex-col items-center justify-center min-h-[300px]"
            style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.05), rgba(199,91,57,0.08))",
              border: "1px solid rgba(16,185,129,0.2)",
            }}
          >
            <div className="text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(199,91,57,0.2))" }}
              >
                <Shield size={36} style={{ color: "rgb(16,185,129)" }} />
              </div>
              <p className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                ⚖️ Lex
              </p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {isEn ? "Your AI legal advisor" : "Votre conseiller juridique IA"}
              </p>
              <span
                className="inline-block mt-3 text-[10px] font-medium px-2 py-1"
                style={{ background: "rgba(16,185,129,0.1)", color: "rgb(16,185,129)" }}
              >
                {isEn ? "Real-time human avatar · 180ms latency" : "Avatar humain temps réel · 180ms de latence"}
              </span>
            </div>
          </div>

          {/* Right — Features */}
          <div className="space-y-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex gap-3">
                  <div className="shrink-0 mt-0.5">
                    <Icon size={16} style={{ color: "rgb(16,185,129)" }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {f.title}
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                      {f.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonial */}
        <div
          className="p-6 mb-10 text-center max-w-2xl mx-auto"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-default)" }}
        >
          <p className="text-sm italic leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            &ldquo;{isEn
              ? "Lex helped me recover my suspended OnlyFans account in 4 days. Without it, I would have lost 2 months of income."
              : "Lex m&apos;a aidée à récupérer mon compte OnlyFans suspendu en 4 jours. Sans lui, j&apos;aurais perdu 2 mois de revenus."}&rdquo;
          </p>
          <p className="text-xs mt-2 font-medium" style={{ color: "var(--text-primary)" }}>
            — Sarah K., {isEn ? "creator" : "créatrice"}
          </p>
        </div>

        {/* Domains band */}
        <div className="text-center mb-10">
          <p className="text-xs font-medium mb-3" style={{ color: "var(--text-secondary)" }}>
            {isEn ? "Halo Lex covers:" : "Halo Lex couvre :"}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {domains.map((d) => (
              <span
                key={d}
                className="text-xs px-3 py-1"
                style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "rgb(16,185,129)" }}
              >
                {d}
              </span>
            ))}
          </div>
          <p className="text-[10px] mt-3" style={{ color: "var(--text-tertiary)" }}>
            {isEn
              ? "Halo Lex provides general legal information. For complex cases, escalation to our partner lawyer network."
              : "Halo Lex fournit une information juridique générale. Pour les cas complexes, escalade vers notre réseau d&apos;avocats partenaires."}
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/lex/halo-lex"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold transition-all hover:scale-[1.02]"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            {isEn ? "Discover Halo Lex" : "Découvrir Halo Lex"}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
