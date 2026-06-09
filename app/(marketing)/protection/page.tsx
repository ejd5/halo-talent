"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

/* ─── Types ─── */
interface Clause {
  id: string;
  label: string;
  description: string;
  category: string;
  icon: string | null;
  severity: number;
  legal_argument: string;
  cgu_references: any[];
  law_references: any[];
}

interface StatsData {
  total_analyses: number;
  average_score: number;
  top_clauses: { id: string; label: string; count: number; severity: number }[];
  platform_breakdown: Record<string, number>;
}

interface AnalyzeResult {
  id: string;
  score: number;
  risk_level: string;
  diagnosis: string;
  clauses_details: { id: string; label: string; severity: number; category: string; legal_argument: string }[];
  actions: string[];
}

/* ─── Helpers ─── */
const CATEGORY_LABELS: Record<string, { icon: string; label: string }> = {
  account_control: { icon: "🔒", label: "CONTRÔLE DE COMPTE" },
  financial: { icon: "💰", label: "FINANCES" },
  contractual: { icon: "📄", label: "CONTRAT" },
  content_rights: { icon: "🎨", label: "DROITS SUR LE CONTENU" },
  communication: { icon: "💬", label: "COMMUNICATION" },
  psychological: { icon: "🧠", label: "PSYCHOLOGIQUE" },
};

const PLATFORMS = [
  { id: "onlyfans", label: "OnlyFans" },
  { id: "fansly", label: "Fansly" },
  { id: "mym", label: "MYM" },
  { id: "instagram", label: "Instagram" },
  { id: "other", label: "Autre" },
];

const FALLBACK_STATS = [
  { value: "40-50%", label: "de commission moyenne dans le secteur" },
  { value: "72%", label: "des contrats n'ont pas de clause de sortie claire" },
  { value: "1/3", label: "des créateurs n'ont pas accès à leurs identifiants" },
];

const CGU_QUOTES = [
  { text: "Le titulaire du compte est la personne vérifiée par pièce d'identité.", source: "CGU OnlyFans, 2026" },
  { text: "Les créateurs conservent la propriété de leur contenu. Une licence limitée est accordée à la plateforme.", source: "CGU OnlyFans, 2026" },
  { text: "Le partage de compte est strictement interdit. Chaque compte correspond à une personne physique unique.", source: "CGU Fansly, 2026" },
];

const SEVERITY_COLORS = {
  low: { bar: "bg-success", text: "text-success", label: "Gérable" },
  medium: { bar: "bg-[#D4A04A]", text: "text-[#D4A04A]", label: "Problématique" },
  high: { bar: "bg-alert", text: "text-alert", label: "Dangereux" },
  critical: { bar: "bg-red-600", text: "text-red-600", label: "Urgent" },
};

function getRiskLevel(score: number): string {
  if (score >= 21) return "critical";
  if (score >= 13) return "high";
  if (score >= 6) return "medium";
  return "low";
}

function getMaxScore(clauses: Clause[]): number {
  return clauses.reduce((sum, c) => sum + c.severity, 0);
}

/* ─── Component ─── */
export default function ProtectionPage() {
  /* state */
  const [clauses, setClauses] = useState<Clause[]>([]);
  const [loadingClauses, setLoadingClauses] = useState(true);
  const [stats, setStats] = useState<StatsData | null>(null);

  const [step, setStep] = useState<"platform" | "clauses" | "result">("platform");
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [checkedClauses, setCheckedClauses] = useState<Set<string>>(new Set());
  const [otherClause, setOtherClause] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [generatingLetter, setGeneratingLetter] = useState(false);
  const [letter, setLetter] = useState<{ type: string; content: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [letterType, setLetterType] = useState<"mise_en_demeure" | "platform_support">("mise_en_demeure");

  const resultRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  /* fetch clauses + stats on mount */
  useEffect(() => {
    Promise.all([
      fetch("/api/legal/clauses").then((r) => r.json()),
      fetch("/api/legal/stats").then((r) => r.json()),
    ])
      .then(([clauseData, statsData]) => {
        setClauses(clauseData.clauses || []);
        if (statsData.total_analyses > 0) setStats(statsData);
      })
      .catch(() => {})
      .finally(() => setLoadingClauses(false));
  }, []);

  const maxScore = getMaxScore(clauses);
  const checkedArray = Array.from(checkedClauses);
  const checkedDetails = clauses.filter((c) => checkedClauses.has(c.id));
  const currentScore = checkedDetails.reduce((s, c) => s + c.severity, 0);
  const riskLevel = getRiskLevel(currentScore);
  const riskColor = SEVERITY_COLORS[riskLevel as keyof typeof SEVERITY_COLORS];

  /* scoring display */
  const scorePercent = maxScore > 0 ? (currentScore / maxScore) * 100 : 0;

  /* grouped clauses */
  const groupedClauses = clauses.reduce<Record<string, Clause[]>>((acc, c) => {
    if (!acc[c.category]) acc[c.category] = [];
    acc[c.category].push(c);
    return acc;
  }, {});

  const categoryOrder = ["account_control", "financial", "contractual", "content_rights", "communication", "psychological"];

  /* scroll to form */
  const scrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  /* analyze */
  const handleAnalyze = async () => {
    if (!selectedPlatform || checkedArray.length === 0) return;
    setAnalyzing(true);
    try {
      const res = await fetch("/api/legal/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: selectedPlatform,
          clauses_checked: checkedArray,
          other_clause_text: otherClause || undefined,
          agency_name: agencyName || undefined,
        }),
      });
      const data = await res.json();
      setResult(data);
      setStep("result");
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  /* generate letter */
  const handleGenerateLetter = async () => {
    if (!result?.id) return;
    setGeneratingLetter(true);
    try {
      const res = await fetch("/api/legal/generate-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysis_id: result.id,
          letter_type: letterType,
          platform: selectedPlatform,
          agency_name: agencyName || undefined,
        }),
      });
      const data = await res.json();
      setLetter({ type: letterType, content: data.letter_content });
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingLetter(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  /* toggle clause */
  const toggleClause = (id: string) => {
    setCheckedClauses((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      {/* ─── SEO ─── */}
      <title>Contrat d'agence abusif ? Analysez gratuitement vos droits | Halo Talent</title>
      <meta
        name="description"
        content="Outil gratuit d'analyse de contrat pour créateurs OnlyFans, Fansly, MYM. Identifiez les clauses abusives et générez une lettre de mise en demeure."
      />

      {/* ─── SECTION 1: HERO ─── */}
      <Section background="cream" className="relative overflow-hidden">
        <Container className="grid md:grid-cols-2 gap-12 md:gap-16 items-center min-h-[70vh] py-16 md:py-24">
          {/* Left */}
          <div className="space-y-6">
            <span className="font-sans text-xs tracking-[0.15em] uppercase text-accent font-semibold">
              Bouclier Légal
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05] font-bold text-ink">
              VOTRE CONTRAT<br />
              VOUS PIÈGE ?
            </h1>
            <p className="font-sans text-lg md:text-xl text-ink-secondary leading-relaxed max-w-lg">
              Analysez gratuitement votre contrat d'agence en 2 minutes. Découvrez vos droits. Reprenez le contrôle.
            </p>
            <div className="space-y-3">
              <button
                onClick={scrollToForm}
                className="inline-block bg-accent hover:bg-accent-hover text-white font-sans font-semibold text-sm tracking-widest px-10 py-4 transition-colors"
              >
                ANALYSER MON CONTRAT
              </button>
              <p className="font-sans text-xs text-ink-tertiary">100% gratuit · Anonyme · Aucune inscription requise</p>
            </div>
          </div>

          {/* Right — stat visual */}
          <div className="text-center md:text-left md:pl-12">
            <div className="inline-flex flex-col items-center md:items-start">
              <span
                className="font-display font-bold leading-none"
                style={{ fontSize: "clamp(4rem, 10vw, 7rem)", color: "#C75B39" }}
              >
                {stats ? `${stats.total_analyses}` : "78"}
                {stats ? "" : "%"}
              </span>
              <p className="font-sans text-ink-secondary text-lg md:text-xl max-w-xs mt-2">
                {stats
                  ? "analyses effectuées"
                  : "des créateurs sous contrat ont au moins une clause abusive"}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* ─── SECTION 2: STATS ─── */}
      <Section background="dark">
        <Container>
          {stats ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
              <StatCard value={`${stats.total_analyses}`} label="analyses effectuées" />
              <StatCard value={`${stats.average_score}/25`} label="score moyen de dangerosité" />
              <StatCard
                value={stats.top_clauses[0]?.label || "—"}
                label="clause la plus fréquente"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
              {FALLBACK_STATS.map((s, i) => (
                <StatCard key={i} value={s.value} label={s.label} />
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* ─── SECTION 3: FORMULAIRE ─── */}
      <Section background="cream" ref={formRef} id="form-section">
        <Container className="max-w-3xl py-12 md:py-20">
          {/* Score sticky */}
          <div
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50 border-t bg-surface p-4 md:p-6 transition-all duration-500 md:sticky md:top-24 md:z-10 md:border md:border-accent-border md:bg-surface md:rounded-none md:shadow-sm md:mb-8",
              step === "clauses" && checkedArray.length > 0
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0 md:hidden"
            )}
          >
            <div className="flex items-center justify-between max-w-3xl mx-auto gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-1 h-2 bg-base-alt rounded-none overflow-hidden max-w-[200px]">
                  <div
                    className={cn("h-full transition-all duration-500 rounded-none", riskColor.bar)}
                    style={{ width: `${Math.min(scorePercent, 100)}%` }}
                  />
                </div>
                <span className={cn("font-sans text-sm font-semibold whitespace-nowrap", riskColor.text)}>
                  {currentScore}/{maxScore}
                </span>
                <span className="font-sans text-xs text-ink-tertiary hidden sm:inline">
                  {riskColor.label}
                </span>
              </div>
              <button
                onClick={handleAnalyze}
                disabled={checkedArray.length === 0}
                className="bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-sans font-semibold text-xs tracking-widest px-6 py-3 transition-colors whitespace-nowrap"
              >
                OBTENIR MON DIAGNOSTIC
              </button>
            </div>
          </div>

          {/* Step 1: Platform */}
          {step === "platform" && (
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-2 text-center">
                <h2 className="font-display text-3xl md:text-4xl text-ink">
                  Sur quelle plateforme exercez-vous ?
                </h2>
                <p className="font-sans text-ink-secondary">
                  Choisissez la plateforme pour laquelle vous avez signé un contrat d'agence.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlatform(p.id)}
                    className={cn(
                      "px-8 py-4 font-sans font-semibold text-sm tracking-wider transition-all border",
                      selectedPlatform === p.id
                        ? "border-accent bg-accent-muted text-accent"
                        : "border-border text-ink-secondary hover:border-border-hover hover:bg-base-alt"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={() => { if (selectedPlatform) setStep("clauses"); }}
                  disabled={!selectedPlatform}
                  className="bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-sans font-semibold text-sm tracking-widest px-10 py-4 transition-colors"
                >
                  CONTINUER
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Clauses */}
          {step === "clauses" && (
            <div className="space-y-10 animate-fade-in">
              <div className="space-y-2 text-center">
                <h2 className="font-display text-3xl md:text-4xl text-ink">
                  Cochez ce qui s'applique à vous
                </h2>
                <p className="font-sans text-ink-secondary">
                  Sélectionnez toutes les clauses que vous retrouvez dans votre contrat.
                </p>
              </div>

              {loadingClauses ? (
                <div className="text-center py-12">
                  <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent animate-spin rounded-none" />
                </div>
              ) : (
                <div className="space-y-8">
                  {categoryOrder
                    .filter((cat) => groupedClauses[cat]?.length)
                    .map((cat) => {
                      const info = CATEGORY_LABELS[cat] || { icon: "📋", label: cat };
                      return (
                        <div key={cat}>
                          <h3 className="font-sans text-xs tracking-[0.15em] uppercase text-ink-secondary font-semibold mb-3">
                            {info.icon} {info.label}
                          </h3>
                          <div className="space-y-1">
                            {groupedClauses[cat]?.map((clause) => (
                              <ClauseCheckbox
                                key={clause.id}
                                clause={clause}
                                checked={checkedClauses.has(clause.id)}
                                onToggle={toggleClause}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}

              {/* Other clause */}
              <div className="space-y-2">
                <label className="font-sans text-sm text-ink-secondary font-medium">
                  Autre clause que vous jugez abusive
                </label>
                <textarea
                  value={otherClause}
                  onChange={(e) => setOtherClause(e.target.value)}
                  placeholder="Décrivez une clause qui vous semble abusive mais qui n'est pas listée ci-dessus..."
                  className="w-full p-4 bg-surface border border-border font-sans text-sm text-ink placeholder:text-ink-tertiary resize-none focus:outline-none focus:border-accent transition-colors"
                  rows={3}
                />
              </div>

              {/* Agency name */}
              <div className="space-y-2">
                <label className="font-sans text-sm text-ink-secondary font-medium">
                  Nom de l'agence (optionnel — pour statistiques)
                </label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  placeholder="Ex: MyAgency Management"
                  className="w-full p-4 bg-surface border border-border font-sans text-sm text-ink placeholder:text-ink-tertiary focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleAnalyze}
                disabled={checkedArray.length === 0 || analyzing}
                className="w-full bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-sans font-semibold text-sm tracking-widest py-5 transition-colors"
              >
                {analyzing ? (
                  <span className="inline-flex items-center gap-3">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent animate-spin" />
                    Analyse en cours...
                  </span>
                ) : (
                  "OBTENIR MON DIAGNOSTIC"
                )}
              </button>
            </div>
          )}

          {/* Step 3: Result */}
          {step === "result" && result && (
            <div ref={resultRef} className="space-y-10 animate-fade-in">
              {/* Score display */}
              <div className="text-center space-y-4 p-8 bg-surface border border-border">
                <div className="flex items-center justify-center gap-4">
                  <span className={cn("font-display text-7xl font-bold", riskColor.text)}>
                    {result.score}
                  </span>
                  <span className="font-sans text-ink-tertiary text-lg">/ {maxScore}</span>
                </div>
                <div className="w-full max-w-xs mx-auto h-2 bg-base-alt rounded-none overflow-hidden">
                  <div
                    className={cn("h-full transition-all duration-1000 rounded-none", riskColor.bar)}
                    style={{ width: `${Math.min((result.score / maxScore) * 100, 100)}%` }}
                  />
                </div>
                <p className={cn("font-display text-xl font-semibold", riskColor.text)}>
                  Situation {riskColor.label.toUpperCase()}
                </p>
              </div>

              {/* Diagnosis */}
              <div className="prose prose-sm max-w-none font-sans text-ink">
                <h3 className="font-display text-xl text-ink">Diagnostic</h3>
                <div className="whitespace-pre-wrap text-ink-secondary leading-relaxed">
                  {result.diagnosis}
                </div>
              </div>

              {/* Clause details */}
              {result.clauses_details.length > 0 && (
                <div className="space-y-6">
                  <h3 className="font-display text-xl text-ink">
                    Détail des clauses identifiées
                  </h3>
                  {result.clauses_details.map((cd) => (
                    <div
                      key={cd.id}
                      className="p-6 border border-border bg-surface space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="font-sans font-semibold text-ink">
                          {cd.label}
                        </h4>
                        <span
                          className={cn(
                            "font-sans text-xs font-semibold px-2 py-1 whitespace-nowrap",
                            cd.severity >= 4
                              ? "bg-alert/10 text-alert"
                              : "bg-accent-muted text-accent"
                          )}
                        >
                          Sévérité {cd.severity}/5
                        </span>
                      </div>
                      <p className="font-sans text-sm text-ink-secondary leading-relaxed">
                        {cd.legal_argument}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              {result.actions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-display text-xl text-ink">
                    3 actions recommandées
                  </h3>
                  <ol className="space-y-3">
                    {result.actions.map((action, i) => (
                      <li key={i} className="flex items-start gap-3 font-sans text-ink-secondary">
                        <span className="flex-shrink-0 w-7 h-7 rounded-none bg-accent-muted text-accent flex items-center justify-center font-semibold text-sm">
                          {i + 1}
                        </span>
                        <span className="pt-1">{action}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Generate letter */}
              <div className="space-y-4 p-8 border border-accent-border bg-accent-muted/50">
                <h3 className="font-display text-xl text-ink">Générer une lettre</h3>
                <p className="font-sans text-sm text-ink-secondary">
                  Obtenez une lettre prête à envoyer pour demander la restitution de vos droits.
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setLetterType("mise_en_demeure")}
                    className={cn(
                      "px-5 py-3 font-sans text-sm font-semibold transition-colors border",
                      letterType === "mise_en_demeure"
                        ? "border-accent bg-accent text-white"
                        : "border-border text-ink-secondary hover:border-accent"
                    )}
                  >
                    Lettre à l'agence
                  </button>
                  <button
                    onClick={() => setLetterType("platform_support")}
                    className={cn(
                      "px-5 py-3 font-sans text-sm font-semibold transition-colors border",
                      letterType === "platform_support"
                        ? "border-accent bg-accent text-white"
                        : "border-border text-ink-secondary hover:border-accent"
                    )}
                  >
                    Email au support plateforme
                  </button>
                </div>

                <button
                  onClick={handleGenerateLetter}
                  disabled={generatingLetter}
                  className="w-full bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-sans font-semibold text-sm tracking-widest py-4 transition-colors"
                >
                  {generatingLetter ? (
                    <span className="inline-flex items-center gap-3">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent animate-spin" />
                      Génération en cours...
                    </span>
                  ) : (
                    "GÉNÉRER MA LETTRE DE MISE EN DEMEURE"
                  )}
                </button>

                {letter && (
                  <div className="space-y-3 animate-fade-in">
                    <textarea
                      readOnly
                      value={letter.content}
                      className="w-full h-80 p-4 bg-surface border border-border font-sans text-sm text-ink resize-none"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => copyToClipboard(letter.content)}
                        className="flex-1 bg-dark hover:bg-dark-surface text-dark-text font-sans font-semibold text-sm tracking-widest py-3 transition-colors"
                      >
                        {copied ? "COPIÉ ✓" : "COPIER"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA secondaire */}
              <div className="p-8 border border-border bg-surface text-center space-y-4">
                <p className="font-serif italic text-lg text-ink-secondary leading-relaxed">
                  Vous méritez mieux. Chez Halo Talent, la commission baisse quand vous grandissez, le contrat est téléchargeable avant signature, et la sortie se fait en 30 jours.
                </p>
                <a
                  href="/apply"
                  className="inline-block bg-dark hover:bg-dark-surface text-dark-text font-sans font-semibold text-sm tracking-widest px-8 py-4 transition-colors"
                >
                  DÉCOUVRIR NOTRE APPROCHE
                </a>
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* ─── SECTION 4: CGU CITATIONS ─── */}
      <Section background="cream" className="bg-base-alt">
        <Container className="py-16 md:py-24 text-center space-y-12">
          <h2 className="font-display text-3xl md:text-4xl text-ink">
            Ce que disent les CGU
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {CGU_QUOTES.map((quote, i) => (
              <blockquote key={i} className="space-y-3">
                <p className="font-serif italic text-xl md:text-2xl text-ink leading-snug">
                  &ldquo;{quote.text}&rdquo;
                </p>
                <footer className="font-sans text-xs text-ink-tertiary tracking-wider uppercase">
                  — {quote.source}
                </footer>
              </blockquote>
            ))}
          </div>
        </Container>
      </Section>

      {/* ─── SECTION 5: FINAL CTA ─── */}
      <Section background="dark">
        <Container className="py-16 md:py-24 text-center space-y-8">
          <h2 className="font-display text-3xl md:text-5xl text-dark-text leading-tight">
            REPRENEZ LE CONTRÔLE<br />
            DE VOTRE CARRIÈRE
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={scrollToForm}
              className="bg-accent hover:bg-accent-hover text-white font-sans font-semibold text-sm tracking-widest px-10 py-4 transition-colors"
            >
              ANALYSER MON CONTRAT
            </button>
            <a
              href="/apply"
              className="border border-dark-text/20 text-dark-text hover:bg-dark-surface font-sans font-semibold text-sm tracking-widest px-10 py-4 transition-colors"
            >
              POSTULER CHEZ NOUS
            </a>
          </div>
        </Container>
      </Section>
    </>
  );
}

/* ─── Sub-components ─── */

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center space-y-2">
      <p className="font-display text-3xl md:text-4xl font-bold text-dark-text">{value}</p>
      <p className="font-sans text-sm text-dark-muted uppercase tracking-wider">{label}</p>
    </div>
  );
}

function ClauseCheckbox({
  clause,
  checked,
  onToggle,
}: {
  clause: Clause;
  checked: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="border-b border-border last:border-b-0">
      <label
        className={cn(
          "flex items-start gap-4 p-4 cursor-pointer transition-colors",
          checked ? "bg-accent-muted" : "hover:bg-base-alt"
        )}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(clause.id)}
          className="mt-1 w-4 h-4 accent-accent rounded-none"
        />
        <div className="flex-1 min-w-0">
          <span className="font-sans text-sm font-medium text-ink">{clause.label}</span>
          {checked && clause.description && (
            <p className="mt-2 font-sans text-xs text-ink-secondary leading-relaxed animate-fade-in">
              {clause.description}
            </p>
          )}
        </div>
        <span
          className={cn(
            "font-sans text-xs font-semibold px-2 py-0.5 flex-shrink-0",
            clause.severity >= 4
              ? "bg-alert/10 text-alert"
              : "bg-base-alt text-ink-tertiary"
          )}
        >
          {clause.severity}
        </span>
      </label>
    </div>
  );
}
