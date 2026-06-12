"use client";

import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2, FileText, AlertTriangle, Scale, Shield, Upload, Clock, History, Trash2 } from "lucide-react";

interface QuestionnaireData {
  platforms: string[];
  problemType: string;
  problemDetails: {
    timing: string;
    description: string;
    platformMessage: string;
  };
  documents: string[];
  objectives: string[];
  urgency: string;
}

interface SavedQuestionnaire {
  id: string;
  created_at: string;
  platforms: string[];
  problem_type: string;
  objectives: string[];
  urgency: string;
  status: string;
}

const STEP_LABELS = ["Plateforme", "Problème", "Détails", "Documents", "Objectifs", "Diagnostic"];

const PROBLEM_TYPES = [
  { id: "suspension", label: "Suspension / bannissement", icon: AlertTriangle },
  { id: "non_payment", label: "Retenue ou non-paiement", icon: FileText },
  { id: "content_removed", label: "Contenu supprimé sans raison", icon: Shield },
  { id: "contract_dispute", label: "Litige contractuel (agence)", icon: Scale },
  { id: "image_rights", label: "Atteinte au droit à l'image", icon: Shield },
  { id: "tax", label: "Question fiscale", icon: FileText },
  { id: "defamation", label: "Diffamation / harcèlement", icon: AlertTriangle },
  { id: "leak", label: "Vol de contenu / leak", icon: Shield },
  { id: "cgu", label: "Question sur les CGU", icon: FileText },
  { id: "other", label: "Autre situation", icon: AlertTriangle },
];

const PLATFORMS = ["onlyfans", "fansly", "mym", "instagram", "tiktok", "youtube", "twitter", "twitch"];

const TIMING_OPTIONS = ["Aujourd'hui", "Cette semaine", "Ce mois", "+1 mois", "Date précise"];

const DOCUMENT_OPTIONS = [
  "Email/notification de la plateforme",
  "Captures d'écran du compte",
  "Historique des paiements",
  "Contrat avec l'agence",
  "Screenshots conversations support",
];

const OBJECTIVE_OPTIONS = [
  "Récupérer mon compte",
  "Récupérer mes paiements en attente",
  "Obtenir des explications",
  "Faire annuler une décision",
  "Connaître mes droits",
  "Préparer une procédure",
  "Comprendre la situation",
];

const URGENCY_OPTIONS = ["Pas urgent", "Modéré", "Urgent", "Très urgent"];

interface QuestionnaireProps {
  locale?: string;
  onComplete?: (data: QuestionnaireData, diagnosis: string) => void;
  onClose?: () => void;
}

export function Questionnaire({ locale = "fr", onComplete, onClose }: QuestionnaireProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<QuestionnaireData>({
    platforms: [],
    problemType: "",
    problemDetails: { timing: "", description: "", platformMessage: "" },
    documents: [],
    objectives: [],
    urgency: "Modéré",
  });
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [questionnaireId, setQuestionnaireId] = useState<string | null>(null);
  const [history, setHistory] = useState<SavedQuestionnaire[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Charger l'historique au montage
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await fetch("/api/lex/questionnaire");
      if (!res.ok) return;
      const json = await res.json();
      setHistory(json.questionnaires || []);
    } catch {}
  };

  // Sauvegarder automatiquement
  const saveProgress = useCallback(async (status: string = "draft") => {
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        platforms: data.platforms,
        problemType: data.problemType,
        problemTiming: data.problemDetails.timing,
        problemDescription: data.problemDetails.description,
        platformMessage: data.problemDetails.platformMessage,
        documents: data.documents,
        objectives: data.objectives,
        urgency: data.urgency,
        status,
      };

      if (diagnosis) body.diagnosis = diagnosis;
      if (questionnaireId) body.id = questionnaireId;

      const res = await fetch("/api/lex/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.questionnaire?.id) setQuestionnaireId(json.questionnaire.id);
        loadHistory();
      }
    } catch {}
    setSaving(false);
  }, [data, diagnosis, questionnaireId]);

  // Sauvegarder à chaque changement d'étape
  useEffect(() => {
    if (questionnaireId || step > 0) {
      saveProgress("draft");
    }
  }, [step]);

  const update = useCallback(<K extends keyof QuestionnaireData>(key: K, value: QuestionnaireData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleArray = useCallback((key: "platforms" | "documents" | "objectives", value: string) => {
    setData((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  }, []);

  const generateDiagnosis = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/lex/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `Réalise un diagnostic juridique structuré pour un créateur de contenu.

Plateforme(s) : ${data.platforms.join(", ") || "Non spécifié"}
Type de problème : ${PROBLEM_TYPES.find((p) => p.id === data.problemType)?.label || data.problemType}
Détails : ${data.problemDetails.description || "Non spécifiés"}
Objectifs : ${data.objectives.join(", ") || "Non spécifiés"}
Urgence : ${data.urgency}

Format attendu :
📋 DIAGNOSTIC

Votre situation : [résumé]

🎯 Évaluation :
- Complexité : [Simple/Modéré/Complexe]
- Force position : /5

⚖️ Bases légales applicables :
- [Référence 1]
- [Référence 2]

📝 Actions recommandées :
1. [Action]
2. [Action]
3. [Action]

🚨 Points d'attention :
- [Point]

📞 Faut-il un avocat ? [Oui/Non]`,
          }],
          locale,
        }),
      });

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const event = JSON.parse(line.slice(6));
              if (event.type === "text") fullText += event.text;
            } catch {}
          }
        }
      }

      setDiagnosis(fullText);

      // Sauvegarder avec le diagnostic
      setData((prev) => prev); // trigger effect with new diagnosis
      if (questionnaireId || fullText) {
        await saveProgress("completed");
      }
    } catch (err) {
      console.error("Diagnosis error:", err);
      setDiagnosis("Erreur lors de la génération du diagnostic. Veuillez réessayer.");
    }
    setLoading(false);
  }, [data, locale, questionnaireId, saveProgress]);

  // Sauvegarder une fois le diagnostic prêt
  useEffect(() => {
    if (diagnosis && questionnaireId) {
      saveProgress("completed");
    }
  }, [diagnosis]);

  const handleNext = useCallback(async () => {
    if (step < 5) {
      setStep((s) => s + 1);
    }
  }, [step]);

  const handleBack = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
  }, [step]);

  const canProceed = () => {
    switch (step) {
      case 0: return data.platforms.length > 0;
      case 1: return !!data.problemType;
      case 2: return !!data.problemDetails.timing;
      case 3: return true;
      case 4: return data.objectives.length > 0;
      case 5: return !!diagnosis;
      default: return true;
    }
  };

  const loadQuestionnaire = async (id: string) => {
    try {
      const res = await fetch(`/api/lex/questionnaire?id=${id}`);
      if (!res.ok) return;
      const q = await res.json();
      setQuestionnaireId(q.id);
      setData({
        platforms: q.platforms || [],
        problemType: q.problem_type || "",
        problemDetails: {
          timing: q.problem_timing || "",
          description: q.problem_description || "",
          platformMessage: q.platform_message || "",
        },
        documents: q.documents || [],
        objectives: q.objectives || [],
        urgency: q.urgency || "Modéré",
      });
      if (q.diagnosis) setDiagnosis(q.diagnosis);
      setStep(q.diagnosis ? 5 : 0);
      setShowHistory(false);
    } catch {}
  };

  const deleteQuestionnaire = async (id: string) => {
    try {
      await fetch(`/api/lex/questionnaire?id=${id}`, { method: "DELETE" });
      setShowDeleteConfirm(null);
      loadHistory();
    } catch {}
  };

  // Vue historique
  if (showHistory) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
            <History size={20} className="inline mr-2" />
            {locale === "en" ? "My diagnoses" : "Mes diagnostics"}
          </h2>
          <button
            onClick={() => setShowHistory(false)}
            className="px-3 py-1.5 text-sm"
            style={{ color: "var(--accent)" }}
          >
            {locale === "en" ? "New diagnosis" : "Nouveau diagnostic"}
          </button>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {locale === "en"
                ? "No diagnoses yet. Start one to see it here."
                : "Aucun diagnostic pour le moment. Lancez-en un pour le voir apparaître ici."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((q) => (
              <div
                key={q.id}
                className="flex items-center justify-between p-4"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
              >
                <button
                  onClick={() => loadQuestionnaire(q.id)}
                  className="flex-1 text-left"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {(q.platforms || []).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(", ") || "Plateforme(s)"}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5"
                      style={{
                        background: q.status === "completed" ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.06)",
                        color: q.status === "completed" ? "rgb(34,197,94)" : "var(--text-secondary)",
                      }}
                    >
                      {q.status === "completed" ? (locale === "en" ? "Completed" : "Terminé") : q.status === "draft" ? (locale === "en" ? "Draft" : "Brouillon") : q.status}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {new Date(q.created_at).toLocaleDateString(locale === "en" ? "en-US" : "fr-FR", {
                      day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </button>

                {showDeleteConfirm === q.id ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteQuestionnaire(q.id)}
                      className="px-2 py-1 text-xs"
                      style={{ background: "rgba(239,68,68,0.2)", color: "rgb(239,68,68)" }}
                    >
                      {locale === "en" ? "Confirm" : "Confirmer"}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className="px-2 py-1 text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {locale === "en" ? "Cancel" : "Annuler"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(q.id)}
                    className="p-2 transition-opacity hover:opacity-70"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Vue diagnostic (résultat)
  if (diagnosis && step === 5) {
    return (
      <div className="p-6 space-y-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
            📋 Diagnostic
          </h2>
          {saving && (
            <div className="flex items-center gap-1 text-xs" style={{ color: "var(--text-secondary)" }}>
              <Loader2 size={12} className="animate-spin" />
              Sauvegarde...
            </div>
          )}
        </div>
        <div className="p-6 whitespace-pre-wrap text-sm leading-relaxed" style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
          {diagnosis}
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => onComplete?.(data, diagnosis)}
            className="px-4 py-2 text-sm font-medium"
            style={{ background: "var(--accent)", color: "var(--text-primary)" }}
          >
            {locale === "en" ? "Save & continue" : "Sauvegarder"}
          </button>
          <button
            onClick={() => onComplete?.(data, diagnosis)}
            className="px-4 py-2 text-sm font-medium"
            style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}
          >
            {locale === "en" ? "Generate a letter" : "Générer une lettre"}
          </button>
          <button
            onClick={() => { setShowHistory(true); }}
            className="px-4 py-2 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {locale === "en" ? "My diagnoses" : "Mes diagnostics"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {locale === "en" ? "Close" : "Fermer"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 max-w-4xl mx-auto">
      {/* Progress sidebar */}
      <div className="w-48 shrink-0 space-y-1">
        {STEP_LABELS.map((label, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-3 py-2 text-sm"
            style={{
              color: i === step ? "var(--accent)" : i < step ? "rgb(34,197,94)" : "var(--text-secondary)",
              background: i === step ? "rgba(199,91,57,0.08)" : "transparent",
            }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
              style={{
                background: i <= step ? "var(--accent)" : "rgba(255,255,255,0.06)",
                color: i <= step ? "var(--text-primary)" : "var(--text-secondary)",
              }}
            >
              {i < step ? "✓" : i + 1}
            </div>
            {label}
          </div>
        ))}
        <div className="mt-4 px-3 space-y-2">
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {locale === "en" ? "Estimated time" : "Temps estimé"} : 3 min
          </div>
          {questionnaireId && (
            <div className="flex items-center gap-1 text-xs" style={{ color: saving ? "var(--accent)" : "rgb(34,197,94)" }}>
              <div className={`w-1.5 h-1.5 rounded-full ${saving ? "animate-pulse" : ""}`} style={{ background: saving ? "var(--accent)" : "rgb(34,197,94)" }} />
              {saving ? (locale === "en" ? "Saving..." : "Sauvegarde...") : (locale === "en" ? "Saved" : "Sauvegardé")}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <div className="p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
          {/* Step 0: Platforms */}
          {step === 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                Plateforme(s) concernée(s)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    onClick={() => toggleArray("platforms", p)}
                    className="px-4 py-3 text-sm font-medium text-left transition-colors"
                    style={{
                      background: data.platforms.includes(p) ? "rgba(199,91,57,0.12)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${data.platforms.includes(p) ? "var(--accent)" : "var(--border-default)"}`,
                      color: data.platforms.includes(p) ? "var(--accent)" : "var(--text-primary)",
                    }}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Problem type */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                Type de problème
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {PROBLEM_TYPES.map((pt) => {
                  const Icon = pt.icon;
                  return (
                    <button
                      key={pt.id}
                      onClick={() => update("problemType", pt.id)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors"
                      style={{
                        background: data.problemType === pt.id ? "rgba(199,91,57,0.12)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${data.problemType === pt.id ? "var(--accent)" : "var(--border-default)"}`,
                        color: data.problemType === pt.id ? "var(--accent)" : "var(--text-primary)",
                      }}
                    >
                      <Icon size={18} />
                      {pt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                Détails du litige
              </h3>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                  Quand ?
                </label>
                <div className="flex gap-2 flex-wrap">
                  {TIMING_OPTIONS.map((t) => (
                    <button
                      key={t}
                      onClick={() => update("problemDetails", { ...data.problemDetails, timing: t })}
                      className="px-3 py-1.5 text-sm transition-colors"
                      style={{
                        background: data.problemDetails.timing === t ? "rgba(199,91,57,0.12)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${data.problemDetails.timing === t ? "var(--accent)" : "var(--border-default)"}`,
                        color: data.problemDetails.timing === t ? "var(--accent)" : "var(--text-primary)",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                  Description de la situation
                </label>
                <textarea
                  value={data.problemDetails.description}
                  onChange={(e) => update("problemDetails", { ...data.problemDetails, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 text-sm outline-none resize-none"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                  placeholder="Décrivez ce qui s'est passé..."
                />
              </div>
            </div>
          )}

          {/* Step 3: Documents */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                Documents disponibles
              </h3>
              <div className="space-y-2">
                {DOCUMENT_OPTIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => toggleArray("documents", d)}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-left transition-colors"
                    style={{
                      background: data.documents.includes(d) ? "rgba(199,91,57,0.12)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${data.documents.includes(d) ? "var(--accent)" : "var(--border-default)"}`,
                      color: data.documents.includes(d) ? "var(--accent)" : "var(--text-primary)",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center text-xs"
                      style={{
                        background: data.documents.includes(d) ? "var(--accent)" : "rgba(255,255,255,0.06)",
                      }}
                    >
                      {data.documents.includes(d) ? "✓" : ""}
                    </div>
                    {d}
                  </button>
                ))}
              </div>
              <div
                className="flex items-center gap-3 px-4 py-3 text-sm cursor-pointer transition-colors hover:opacity-80"
                style={{ border: "1px dashed var(--border-default)" }}
              >
                <Upload size={16} style={{ color: "var(--text-secondary)" }} />
                <span style={{ color: "var(--text-secondary)" }}>
                  Uploader des fichiers (PDF, images)
                </span>
              </div>
            </div>
          )}

          {/* Step 4: Objectives */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                Vos objectifs
              </h3>
              <div className="space-y-2">
                {OBJECTIVE_OPTIONS.map((o) => (
                  <button
                    key={o}
                    onClick={() => toggleArray("objectives", o)}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-left transition-colors"
                    style={{
                      background: data.objectives.includes(o) ? "rgba(199,91,57,0.12)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${data.objectives.includes(o) ? "var(--accent)" : "var(--border-default)"}`,
                      color: data.objectives.includes(o) ? "var(--accent)" : "var(--text-primary)",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center text-xs"
                      style={{
                        background: data.objectives.includes(o) ? "var(--accent)" : "rgba(255,255,255,0.06)",
                      }}
                    >
                      {data.objectives.includes(o) ? "✓" : ""}
                    </div>
                    {o}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                  Urgence
                </label>
                <div className="flex gap-2">
                  {URGENCY_OPTIONS.map((u) => (
                    <button
                      key={u}
                      onClick={() => update("urgency", u)}
                      className="px-3 py-1.5 text-sm transition-colors"
                      style={{
                        background: data.urgency === u ? "rgba(199,91,57,0.12)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${data.urgency === u ? "var(--accent)" : "var(--border-default)"}`,
                        color: data.urgency === u ? "var(--accent)" : "var(--text-primary)",
                      }}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Generate */}
          {step === 5 && (
            <div className="space-y-4 text-center py-8">
              <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                Génération du diagnostic
              </h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Lex analyse vos réponses et prépare un diagnostic personnalisé...
              </p>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 size={32} className="animate-spin" style={{ color: "var(--accent)" }} />
                </div>
              ) : (
                <button
                  onClick={generateDiagnosis}
                  className="px-6 py-3 text-sm font-medium"
                  style={{ background: "var(--accent)", color: "var(--text-primary)" }}
                >
                  {locale === "en" ? "Generate my diagnosis" : "Générer mon diagnostic"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-4">
          <div className="flex gap-2">
            <button
              onClick={step === 0 ? onClose : handleBack}
              className="flex items-center gap-1 px-4 py-2 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <ChevronLeft size={16} />
              {step === 0 ? (locale === "en" ? "Cancel" : "Annuler") : (locale === "en" ? "Back" : "Précédent")}
            </button>
            {history.length > 0 && (
              <button
                onClick={() => setShowHistory(true)}
                className="flex items-center gap-1 px-4 py-2 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                <History size={14} />
                {locale === "en" ? "History" : "Historique"}
              </button>
            )}
          </div>

          {step < 5 && (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ background: "var(--accent)", color: "var(--text-primary)" }}
            >
              {locale === "en" ? "Continue" : "Continuer"}
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
