"use client";

import { useState } from "react";
import {
  FileText, Download, ShieldCheck, ArrowRight, Scale,
  ExternalLink, AlertTriangle, Copy, Check,
} from "lucide-react";
import { RiskGauge } from "./RiskGauge";
import type { AnalysisReport } from "@/lib/bouclier-legal/types";

const SEVERITY_COLORS: Record<number, string> = {
  3: "#F59E0B",
  4: "#EF4444",
  5: "#111827",
};

export function StepResultat({
  report,
  onNewAnalysis,
}: {
  report: AnalysisReport;
  onNewAnalysis: () => void;
}) {
  const [savedScripts, setSavedScripts] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const { riskScore, analyzedClauses, diagnosis, platforms, aiDiagnosis } = report;
  const isRisky = riskScore.level === "high" || riskScore.level === "critical";

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // Generate letter content
  const generateLetter = (type: "mise_en_demeure" | "platform_support") => {
    const clauseList = analyzedClauses
      .map((ac, i) => `${i + 1}. ${ac.clause.label} — ${ac.clause.legalArgument}`)
      .join("\n");

    const date = new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    if (type === "mise_en_demeure") {
      return `MISE EN DEMEURE

Date : ${date}
Objet : Mise en demeure de modifier des clauses abusives

[Votre Nom]
[Votre Adresse]

À l'attention de [Nom de l'agence],

Madame, Monsieur,

Je fais suite à l'analyse de mon contrat d'agence.

L'analyse a révélé la présence de ${analyzedClauses.length} clauses problématiques dans mon contrat :

${clauseList}

Ces clauses sont susceptibles d'être considérées comme abusives au sens de l'article L.212-1 du Code de la consommation.

Par la présente, je vous mets en demeure de :

1. Supprimer ou modifier les clauses mentionnées ci-dessus
2. Me fournir un projet de contrat révisé sous 15 jours
3. Me confirmer par écrit que ces modifications seront appliquées

À défaut de régularisation dans ce délai, je me verrai contraint(e) de saisir les autorités compétentes.

Je reste à votre disposition pour échanger sur ces points.

Cordialement,
[Votre signature]`;
    }

    return `DEMANDE D'ASSISTANCE À LA PLATEFORME

Date : ${date}
Objet : Signalement de clauses abusives dans un contrat d'agence

Plateforme(s) concernée(s) : ${platforms.join(", ")}

[Votre Nom]
[Votre Adresse]

À l'attention du service juridique,

Madame, Monsieur,

Je me permets de vous signaler la présence de clauses potentiellement abusives dans mon contrat d'agence.

Mon contrat contient les clauses suivantes qui pourraient violer les conditions d'utilisation de votre plateforme :

${clauseList}

Je vous serais reconnaissant(e) de bien vouloir :

1. Examiner ces clauses au regard de vos CGU
2. Me confirmer si elles sont conformes à votre politique
3. Le cas échéant, prendre les mesures nécessaires

Dans l'attente de votre retour, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

[Votre signature]`;
  };

  const [showLetter, setShowLetter] = useState(false);
  const [letterType, setLetterType] = useState<"mise_en_demeure" | "platform_support">("mise_en_demeure");
  const [letterContent, setLetterContent] = useState<string | null>(null);

  const handleGenerateLetter = (type: "mise_en_demeure" | "platform_support") => {
    setLetterType(type);
    setLetterContent(generateLetter(type));
    setShowLetter(true);
  };

  return (
    <div className="py-8 max-w-4xl mx-auto px-2">
      {/* Score section */}
      <div className="text-center mb-10">
        <div
          className="w-12 h-12 flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: "var(--color-accent-soft)" }}
        >
          <Scale size={22} style={{ color: "var(--color-accent)" }} />
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Résultat de l&apos;analyse
        </h2>
        <p className="text-base" style={{ color: "var(--text-secondary)" }}>
          Analyse pour : {platforms.join(", ")}
        </p>
      </div>

      {/* Risk gauge */}
      <div className="flex justify-center mb-8">
        <RiskGauge percent={riskScore.percent} level={riskScore.level} />
      </div>

      {/* Diagnosis */}
      <div
        className="p-5 mb-8"
        style={{
          backgroundColor: isRisky
            ? "rgba(196,69,54,0.06)"
            : "rgba(122,154,101,0.06)",
          border: `1px solid ${
            isRisky ? "rgba(196,69,54,0.15)" : "rgba(122,154,101,0.15)"
          }`,
        }}
      >
        <div className="flex items-start gap-3">
          {isRisky ? (
            <AlertTriangle size={18} className="shrink-0 mt-0.5" style={{ color: "var(--color-alert)" }} />
          ) : (
            <ShieldCheck size={18} className="shrink-0 mt-0.5" style={{ color: "var(--color-success)" }} />
          )}
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {diagnosis}
          </p>
        </div>
      </div>

      {/* AI Diagnosis (only when available — connected users) */}
      {aiDiagnosis && (
        <div
          className="p-5 mb-8"
          style={{
            backgroundColor: "rgba(199,91,57,0.06)",
            border: "1px solid rgba(199,91,57,0.2)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider"
              style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
            >
              Diagnostic IA
            </span>
            <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
              Analyse personnalisée par intelligence artificielle
            </span>
          </div>
          <div
            className="text-sm leading-relaxed whitespace-pre-wrap"
            style={{ color: "var(--text-secondary)" }}
          >
            {aiDiagnosis}
          </div>
        </div>
      )}

      {/* Analyzed clauses */}
      {analyzedClauses.length > 0 && (
        <div className="mb-8">
          <h3 className="text-base font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            Détail des clauses problématiques ({analyzedClauses.length})
          </h3>
          <div className="space-y-3">
            {analyzedClauses.map((ac, i) => (
              <div
                key={ac.clause.id}
                className="overflow-hidden"
                style={{ border: "1px solid var(--border-default)" }}
              >
                {/* Header */}
                <div
                  className="px-5 py-4 flex items-start justify-between gap-3"
                  style={{ backgroundColor: "var(--bg-surface)" }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="w-7 h-7 flex items-center justify-center text-xs font-bold shrink-0"
                      style={{
                        backgroundColor: `${SEVERITY_COLORS[ac.clause.severity]}15`,
                        color: SEVERITY_COLORS[ac.clause.severity],
                      }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        {ac.clause.label}
                      </p>
                      {ac.clause.legalRef && (
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                          {ac.clause.legalRef}
                        </p>
                      )}
                    </div>
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded shrink-0"
                    style={{
                      backgroundColor: `${SEVERITY_COLORS[ac.clause.severity]}15`,
                      color: SEVERITY_COLORS[ac.clause.severity],
                    }}
                  >
                    Sévérité {ac.clause.severity}/5
                  </span>
                </div>

                {/* Body */}
                <div className="px-5 py-4 space-y-3 text-sm leading-relaxed">
                  <p style={{ color: "var(--text-secondary)" }}>
                    <span className="font-semibold" style={{ color: "#EF4444" }}>
                      Problème :
                    </span>{" "}
                    {ac.explanation}
                  </p>

                  <div
                    className="p-4 space-y-1"
                    style={{ backgroundColor: "rgba(199,91,57,0.06)" }}
                  >
                    <p className="text-xs font-semibold" style={{ color: "var(--color-accent)" }}>
                      ✓ Reformulation saine
                    </p>
                    <p style={{ color: "var(--text-secondary)" }}>
                      {ac.reformulation}
                    </p>
                  </div>

                  <div className="flex items-start gap-1.5">
                    <span className="text-xs font-semibold shrink-0" style={{ color: "#F59E0B" }}>
                      Action :
                    </span>
                    <span style={{ color: "var(--text-secondary)" }}>
                      {ac.action}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="space-y-4 mb-8">
        <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
          Actions recommandées
        </h3>

        {/* Letter buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => handleGenerateLetter("mise_en_demeure")}
            className="flex items-center gap-3 p-5 text-left transition-all hover:scale-[1.01]"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-default)",
            }}
          >
            <div
              className="w-10 h-10 flex items-center justify-center shrink-0"
              style={{ backgroundColor: "var(--color-accent-soft)" }}
            >
              <FileText size={18} style={{ color: "var(--color-accent)" }} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Lettre de mise en demeure
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                Template prêt à envoyer à votre agence
              </p>
            </div>
          </button>

          <button
            onClick={() => handleGenerateLetter("platform_support")}
            className="flex items-center gap-3 p-5 text-left transition-all hover:scale-[1.01]"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-default)",
            }}
          >
            <div
              className="w-10 h-10 flex items-center justify-center shrink-0"
              style={{ backgroundColor: "var(--color-accent-soft)" }}
            >
              <ExternalLink size={18} style={{ color: "var(--color-accent)" }} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Assistance plateforme
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                Demande d'aide à la plateforme
              </p>
            </div>
          </button>
        </div>

        {/* Letter preview */}
        {showLetter && letterContent && (
          <div
            className="overflow-hidden animate-slide-up"
            style={{ border: "1px solid var(--border-default)" }}
          >
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{ backgroundColor: "var(--bg-surface)" }}
            >
              <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                {letterType === "mise_en_demeure"
                  ? "Lettre de mise en demeure"
                  : "Demande d'assistance plateforme"}
              </span>
              <button
                onClick={() => handleCopy(letterContent)}
                className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded transition-colors"
                style={{ color: "var(--text-secondary)" }}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copié" : "Copier"}
              </button>
            </div>
            <div className="p-5 max-h-80 overflow-y-auto">
              <pre
                className="text-xs leading-relaxed whitespace-pre-wrap font-mono"
                style={{ color: "var(--text-secondary)" }}
              >
                {letterContent}
              </pre>
            </div>
          </div>
        )}

        {/* Download report */}
        <button
          onClick={() => {
            const content = `Rapport d'analyse de contrat
Date : ${new Date().toLocaleDateString("fr-FR")}
Plateforme(s) : ${platforms.join(", ")}
Score de risque : ${riskScore.percent}% (${riskScore.level})

${diagnosis}

Clauses identifiées :
${analyzedClauses.map((ac, i) =>
  `${i + 1}. ${ac.clause.label}
   Sévérité : ${ac.clause.severity}/5
   ${ac.explanation}
   Action : ${ac.action}`
).join("\n\n")}
`;
            const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `bouclier-legal-rapport-${new Date().toISOString().slice(0, 10)}.txt`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="flex items-center justify-center gap-2 w-full p-4 text-sm font-semibold transition-all"
          style={{
            backgroundColor: "var(--bg-card)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-default)",
          }}
        >
          <Download size={16} />
          Télécharger le rapport (.txt)
        </button>
      </div>

      {/* CTA Section */}
      <div
        className="p-8 text-center space-y-5"
        style={{
          background: "linear-gradient(135deg, rgba(199,91,57,0.1) 0%, rgba(199,91,57,0.03) 100%)",
          border: "1px solid rgba(199,91,57,0.2)",
        }}
      >
        <ShieldCheck size={32} style={{ color: "var(--color-accent)" }} className="mx-auto" />
        <div>
          <h3 className="text-base font-bold mb-1" style={{ color: "var(--text-primary)" }}>
            Comparez avec le contrat standard Halo
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Notre contrat standard a été conçu par des avocats spécialisés pour protéger
            les créateurs. Pas de clauses abusives, 100% transparent.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/contrat-type"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-all hover:scale-[1.02]"
            style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
          >
            Voir le contrat standard Halo
            <ArrowRight size={16} />
          </a>
          <a
            href="/apply"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-all"
            style={{
              backgroundColor: "transparent",
              color: "var(--text-primary)",
              border: "1px solid var(--border-default)",
            }}
          >
            Créer un compte Halo
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Nouvelle analyse */}
      <div className="text-center mt-6">
        <button
          onClick={onNewAnalysis}
          className="text-sm font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: "var(--text-tertiary)" }}
        >
          Analyser un autre contrat
        </button>
      </div>
    </div>
  );
}
