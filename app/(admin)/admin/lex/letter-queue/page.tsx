"use client";

// ─── Admin: Letter Queue — Concierge Workflow (32F-BIS) ──
// Workflow 4 étapes : Préparer → Rédiger → Valider → Livrer

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Clock, CheckCircle, Copy, ExternalLink, FileText, Search, User,
  Shield, Edit3, Send, X, RefreshCw, ChevronLeft, ChevronRight,
  AlertTriangle, Star, BookOpen,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────

interface LetterRequest {
  id: string;
  reference?: string;
  user_id: string;
  letter_type: string;
  complexity: "standard" | "complex";
  priority: "standard" | "urgent" | "express";
  brief: string;
  user_context: any;
  language: string;
  tone: string;
  target_platform: string | null;
  status: string;
  requested_at: string;
  deadline_at: string;
  document_content: string | null;
  document_pdf_url: string | null;
  admin_notes: string | null;
  amount_charged: number;
  users: { email: string; raw_user_meta_data: { first_name?: string; full_name?: string } };
}

type WorkflowStep = 1 | 2 | 3 | 4;

// ─── Helpers ──────────────────────────────────────────────

function getDeadlineInfo(deadlineAt: string) {
  const now = new Date();
  const deadline = new Date(deadlineAt);
  const diffMs = deadline.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours < 0) return { label: "En retard !", color: "#ef4444", urgent: true };
  if (diffHours < 4) return { label: `Reste ${Math.floor(diffHours)}h${Math.floor((diffHours % 1) * 60)}min`, color: "#ef4444", urgent: true };
  if (diffHours < 12) return { label: `Reste ${Math.floor(diffHours)}h`, color: "#f59e0b", urgent: false };
  return { label: `${Math.floor(diffHours / 24)}j ${Math.floor(diffHours % 24)}h`, color: "#22c55e", urgent: false };
}

function getPriorityLabel(priority: string): string {
  if (priority === "express") return "Express (4h)";
  if (priority === "urgent") return "Urgent (12h)";
  return "Standard (48h)";
}

function buildClaudePrompt(request: LetterRequest): string {
  const userName = request.users?.raw_user_meta_data?.first_name || "Utilisateur";
  return [
    "Tu es un expert en rédaction de documents juridiques pour créateurs de contenu.",
    "",
    "Contexte :",
    request.brief,
    "",
    `Type de document : ${request.letter_type}`,
    `Complexité : ${request.complexity === "standard" ? "Standard" : "Complexe"}`,
    `Langue : ${request.language === "en" ? "Anglais" : "Français"}`,
    `Ton : ${request.tone || "Ferme et juridique"}`,
    "",
    "Génère un document professionnel structuré qui :",
    "1. Cite précisément les bases légales applicables",
    "2. Articule clairement les demandes",
    "3. Mentionne les délais légaux à respecter",
    "4. Anticipe les contre-arguments potentiels",
    "5. Se termine par une formule de politesse appropriée",
    "",
    `Longueur : ${request.complexity === "standard" ? "4-6 pages" : "8-15 pages"}`,
  ].join("\n");
}

export default function LetterQueuePage() {
  const [requests, setRequests] = useState<LetterRequest[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editorContent, setEditorContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState<WorkflowStep>(1);
  const [validationChecks, setValidationChecks] = useState([false, false, false, false, false]);
  const [delivering, setDelivering] = useState(false);
  const [showConfirmDeliver, setShowConfirmDeliver] = useState(false);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/lex/requests?limit=50&status=received,in_progress,pending_validation");
      const data = await res.json();
      const active = (data.requests || []).filter(
        (r: LetterRequest) => r.status !== "delivered" && r.status !== "refused"
      );
      active.sort((a: LetterRequest, b: LetterRequest) => {
        const pa = a.priority === "express" ? 0 : a.priority === "urgent" ? 1 : 2;
        const pb = b.priority === "express" ? 0 : b.priority === "urgent" ? 1 : 2;
        if (pa !== pb) return pa - pb;
        return new Date(a.deadline_at).getTime() - new Date(b.deadline_at).getTime();
      });
      setRequests(active);
    } catch (err) {
      console.error("Failed to load requests:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadRequests(); }, [loadRequests]);

  // Auto-refresh every 2 minutes
  useEffect(() => {
    const interval = setInterval(loadRequests, 120000);
    return () => clearInterval(interval);
  }, [loadRequests]);

  const currentRequest = requests[currentIndex] || null;

  // Reset editor and steps when changing request
  useEffect(() => {
    if (currentRequest) {
      setEditorContent(currentRequest.document_content || "");
      setActiveStep(currentRequest.status === "pending_validation" ? 3 : currentRequest.status === "in_progress" ? 2 : 1);
      setValidationChecks([false, false, false, false, false]);
    }
  }, [currentIndex, currentRequest?.id]);

  const goNext = () => {
    if (currentIndex < requests.length - 1) setCurrentIndex(currentIndex + 1);
  };
  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const copyPrompt = () => {
    if (!currentRequest) return;
    navigator.clipboard.writeText(buildClaudePrompt(currentRequest));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openClaude = () => {
    if (!currentRequest) return;
    window.open(`https://claude.ai/new?q=${encodeURIComponent(buildClaudePrompt(currentRequest))}`, "_blank");
  };

  const updateStatus = async (newStatus: string) => {
    if (!currentRequest) return;
    const body: any = { id: currentRequest.id, status: newStatus };
    if (newStatus === "pending_validation" || newStatus === "delivered") {
      body.document_content = editorContent;
    }
    try {
      const res = await fetch("/api/admin/lex/requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        if (newStatus === "in_progress") setActiveStep(2);
        else if (newStatus === "pending_validation") setActiveStep(3);
        else if (newStatus === "delivered") {
          setActiveStep(4);
          setShowConfirmDeliver(false);
        }
        loadRequests();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const deliver = async () => {
    setDelivering(true);
    await updateStatus("delivered");
    setDelivering(false);
  };

  // Editor analysis
  const editorAnalysis = useMemo(() => {
    if (!editorContent) return null;
    const legalCitations = editorContent.match(/(?:Article\s+\d+(?:[-\s]\d+)?)|(?:Art\.\s+\d+)|(?:(?:CGU|Conditions Générales)\s+(?:d['e]n?|de\s+la\s+plateforme\s+)?(?:OnlyFans|Fansly|MYM|Instagram|TikTok|YouTube|Twitter|Twitch))|(?:Règlement\s+(?:UE| européen)[^,.!?]*\d{4}\/\d+)|(?:(?:DSA|RGPD)\s*(?:Article|Règlement)?\s*\d+)/gi) || [];
    const customizables = editorContent.match(/\[([^\]]+)\]/g) || [];
    const fbTerms = ["conseil juridique", "je vous conseille", "mon conseil est", "vous devez", "avocat partenaire", "validé par un avocat", "expert juridique", "conseiller juridique"];
    const forbidden: string[] = [];
    for (const term of fbTerms) {
      const matches = editorContent.match(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"));
      if (matches) forbidden.push(...matches);
    }
    return { citations: legalCitations.length, customizables, forbidden: [...new Set(forbidden)] };
  }, [editorContent]);

  // ─── Empty State ──────────────────────────────────────────

  if (!loading && requests.length === 0) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <CheckCircle size={48} className="mx-auto" style={{ color: "#22c55e" }} />
          <h1 className="text-xl font-semibold mt-4" style={{ color: "var(--text-primary)" }}>File vide !</h1>
          <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>Toutes les demandes ont été traitées.</p>
          <button onClick={loadRequests} className="mt-4 px-4 py-2 text-sm rounded-md" style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}>
            <RefreshCw size={14} className="inline mr-1.5" /> Actualiser
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center">
        <RefreshCw size={24} className="animate-spin" style={{ color: "var(--accent)" }} />
      </div>
    );
  }

  const userName = currentRequest?.users?.raw_user_meta_data?.first_name || "Utilisateur";
  const deadline = currentRequest ? getDeadlineInfo(currentRequest.deadline_at) : null;

  // ─── Render ───────────────────────────────────────────────

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Top bar */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--border-default)" }}>
        <div className="flex items-center gap-3">
          <Shield size={20} style={{ color: "var(--accent)" }} />
          <div>
            <h1 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>File de rédaction</h1>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {requests.length} demande{requests.length > 1 ? "s" : ""} en attente
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadRequests} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}>
            <RefreshCw size={12} /> Actualiser
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* ── LEFT: Queue sidebar ── */}
        <div className="w-64 shrink-0 overflow-y-auto custom-scrollbar" style={{ borderRight: "1px solid var(--border-default)" }}>
          <div className="p-2 space-y-1">
            {requests.map((req, i) => {
              const dl = getDeadlineInfo(req.deadline_at);
              const isActive = i === currentIndex;
              return (
                <button
                  key={req.id}
                  onClick={() => setCurrentIndex(i)}
                  className="w-full text-left p-2 rounded-lg transition-colors"
                  style={{
                    backgroundColor: isActive ? "var(--accent-soft)" : "transparent",
                    border: isActive ? "1px solid var(--accent)" : "1px solid transparent",
                    borderLeft: dl.urgent ? "3px solid #ef4444" : "3px solid transparent",
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    {req.priority === "express" && (
                      <span className="text-[8px] font-bold px-1 py-0.5 rounded" style={{ backgroundColor: "#ef4444", color: "white" }}>E</span>
                    )}
                    {req.priority === "urgent" && (
                      <span className="text-[8px] font-bold px-1 py-0.5 rounded" style={{ backgroundColor: "#f59e0b", color: "white" }}>U</span>
                    )}
                    <span className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
                      {req.reference || req.id.substring(0, 8)}
                    </span>
                  </div>
                  <p className="text-[11px] truncate mt-0.5" style={{ color: "var(--text-secondary)" }}>{req.letter_type}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] truncate" style={{ color: "var(--text-tertiary)" }}>{req.users?.raw_user_meta_data?.first_name || "—"}</span>
                    <span className="text-[10px]" style={{ color: dl.color }}>{dl.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: Workflow ── */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {!currentRequest ? (
            <div className="flex items-center justify-center h-full text-center">
              <p style={{ color: "var(--text-secondary)" }}>Sélectionnez une demande</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button onClick={goPrev} disabled={currentIndex === 0} className="flex items-center gap-1 text-xs disabled:opacity-30" style={{ color: "var(--text-secondary)" }}>
                  <ChevronLeft size={14} /> Précédent
                </button>
                <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  {currentIndex + 1} / {requests.length}
                </span>
                <button onClick={goNext} disabled={currentIndex >= requests.length - 1} className="flex items-center gap-1 text-xs disabled:opacity-30" style={{ color: "var(--text-secondary)" }}>
                  Suivant <ChevronRight size={14} />
                </button>
              </div>

              {/* Request Header */}
              <div className="rounded-xl p-5" style={{ backgroundColor: "var(--bg-surface)" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{currentRequest.letter_type}</h2>
                      {currentRequest.reference && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-secondary)", border: "1px solid var(--border-default)" }}>{currentRequest.reference}</span>
                      )}
                      {currentRequest.priority !== "standard" && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{
                          backgroundColor: currentRequest.priority === "express" ? "#ef4444" : "#f59e0b",
                          color: "white",
                        }}>
                          {currentRequest.priority === "express" ? "EXPRESS" : "URGENT"}
                        </span>
                      )}
                      {currentRequest.complexity === "complex" && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#8b5cf6", color: "white" }}>COMPLEXE</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                      <span className="flex items-center gap-1"><User size={12} /> {userName}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {getPriorityLabel(currentRequest.priority)}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} style={{ color: deadline?.color }} /> Échéance : {deadline?.label}
                      </span>
                      {currentRequest.amount_charged > 0 && (
                        <span style={{ color: "var(--accent)" }}>+{currentRequest.amount_charged}€</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Brief */}
                <details className="mt-4">
                  <summary className="flex items-center gap-1.5 text-xs cursor-pointer" style={{ color: "var(--accent)" }}>
                    <BookOpen size={12} /> Voir le brief
                  </summary>
                  <pre className="mt-2 text-xs whitespace-pre-wrap font-sans leading-relaxed p-3 rounded-lg" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-secondary)" }}>
                    {currentRequest.brief}
                  </pre>
                </details>
              </div>

              {/* ─── WORKFLOW STEPS ─── */}
              <div className="space-y-3">
                {/* Step 1: Préparer */}
                <div className={`rounded-xl p-5 transition-opacity ${activeStep >= 1 ? "opacity-100" : "opacity-50"}`} style={{ backgroundColor: "var(--bg-surface)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{
                      backgroundColor: activeStep > 1 ? "#22c55e" : activeStep === 1 ? "var(--accent)" : "var(--bg-primary)",
                      color: activeStep >= 1 ? "white" : "var(--text-tertiary)",
                    }}>
                      {activeStep > 1 ? <CheckCircle size={14} /> : "1"}
                    </div>
                    <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Préparer le prompt Claude</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={copyPrompt} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md" style={{ backgroundColor: copied ? "#22c55e" : "var(--accent)", color: "var(--accent-text)" }}>
                      {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
                      {copied ? "Copié !" : "Copier le prompt"}
                    </button>
                    <button onClick={openClaude} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md" style={{ backgroundColor: "var(--bg-primary)", color: "var(--accent)", border: "1px solid var(--accent)" }}>
                      <ExternalLink size={12} /> Ouvrir Claude.ai
                    </button>
                    {currentRequest.status === "received" && (
                      <button onClick={() => updateStatus("in_progress")} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md ml-auto" style={{ backgroundColor: "#3b82f6", color: "white" }}>
                        <Edit3 size={12} /> Démarrer
                      </button>
                    )}
                  </div>
                </div>

                {/* Step 2: Rédiger */}
                <div className={`rounded-xl p-5 ${activeStep >= 2 ? "opacity-100" : "opacity-50"}`} style={{ backgroundColor: "var(--bg-surface)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{
                      backgroundColor: activeStep > 2 ? "#22c55e" : activeStep === 2 ? "var(--accent)" : "var(--bg-primary)",
                      color: activeStep >= 2 ? "white" : "var(--text-tertiary)",
                    }}>
                      {activeStep > 2 ? <CheckCircle size={14} /> : "2"}
                    </div>
                    <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Coller la réponse Claude</h3>
                  </div>
                  <textarea
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    className="w-full h-48 text-sm p-3 rounded-lg font-serif resize-y outline-none"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border-default)",
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      lineHeight: 1.8,
                    }}
                    placeholder="Collez ici le résultat de Claude..."
                    disabled={activeStep < 2}
                  />

                  {/* Live analysis */}
                  {editorAnalysis && (
                    <div className="flex items-center gap-3 mt-2 text-[11px]">
                      {editorAnalysis.citations > 0 && (
                        <span style={{ color: "#22c55e" }}>{editorAnalysis.citations} citation{editorAnalysis.citations > 1 ? "s" : ""} légale{editorAnalysis.citations > 1 ? "s" : ""}</span>
                      )}
                      {editorAnalysis.customizables.length > 0 && (
                        <span style={{ color: "#f59e0b" }}>{editorAnalysis.customizables.length} passage{editorAnalysis.customizables.length > 1 ? "s" : ""} à personnaliser</span>
                      )}
                      {editorAnalysis.forbidden.length > 0 && (
                        <span style={{ color: "#ef4444" }}>⚠️ {editorAnalysis.forbidden.length} terme{editorAnalysis.forbidden.length > 1 ? "s" : ""} interdit{editorAnalysis.forbidden.length > 1 ? "s" : ""} : {editorAnalysis.forbidden.join(", ")}</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                      {editorContent.split(/\s+/).filter(Boolean).length} mots · ~{Math.ceil(editorContent.split(/\s+/).filter(Boolean).length / 250)} pages
                    </span>
                    <button
                      onClick={() => updateStatus("pending_validation")}
                      disabled={!editorContent.trim() || activeStep < 2}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md disabled:opacity-40"
                      style={{ backgroundColor: "#8b5cf6", color: "white" }}
                    >
                      <CheckCircle size={12} /> Valider le document
                    </button>
                  </div>
                </div>

                {/* Step 3: Valider */}
                <div className={`rounded-xl p-5 ${activeStep >= 3 ? "opacity-100" : "opacity-50"}`} style={{ backgroundColor: "var(--bg-surface)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{
                      backgroundColor: activeStep > 3 ? "#22c55e" : activeStep === 3 ? "var(--accent)" : "var(--bg-primary)",
                      color: activeStep >= 3 ? "white" : "var(--text-tertiary)",
                    }}>
                      {activeStep > 3 ? <CheckCircle size={14} /> : "3"}
                    </div>
                    <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Checklist de validation</h3>
                  </div>
                  <div className="space-y-2">
                    {[
                      "Le ton correspond à la demande",
                      "Toutes les bases légales sont vérifiées",
                      'Aucun terme interdit ("conseil juridique", "avocat")',
                      "Le disclaimer obligatoire est présent",
                      "La langue est correcte",
                    ].map((item, i) => (
                      <label key={i} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={validationChecks[i]}
                          onChange={() => {
                            const next = [...validationChecks];
                            next[i] = !next[i];
                            setValidationChecks(next);
                          }}
                          className="rounded"
                        />
                        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Step 4: Livrer */}
                <div className={`rounded-xl p-5 ${activeStep >= 3 ? "opacity-100" : "opacity-50"}`} style={{ backgroundColor: "var(--bg-surface)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{
                      backgroundColor: activeStep === 4 ? "#22c55e" : "var(--bg-primary)",
                      color: activeStep === 4 ? "white" : "var(--text-tertiary)",
                    }}>
                      {activeStep === 4 ? <CheckCircle size={14} /> : "4"}
                    </div>
                    <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Livrer au client</h3>
                  </div>

                  {activeStep === 4 ? (
                    <div className="p-4 rounded-lg text-center" style={{ backgroundColor: "#f0fdf4" }}>
                      <CheckCircle size={24} className="mx-auto mb-2" style={{ color: "#22c55e" }} />
                      <p className="text-sm font-medium" style={{ color: "#16a34a" }}>Document livré avec succès</p>
                      <p className="text-xs mt-1" style={{ color: "#15803d" }}>Le client a reçu une notification par email.</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowConfirmDeliver(true)}
                      disabled={!validationChecks.every(Boolean) || activeStep < 3}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-md disabled:opacity-40"
                      style={{ backgroundColor: "#22c55e", color: "white" }}
                    >
                      <Send size={14} /> Générer le PDF et livrer au client
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirm delivery modal */}
      {showConfirmDeliver && currentRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "var(--bg-overlay)" }}>
          <div className="rounded-xl w-full max-w-md p-6" style={{ backgroundColor: "var(--bg-primary)" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Send size={18} style={{ color: "#22c55e" }} />
                <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Confirmer la livraison</h2>
              </div>
              <button onClick={() => setShowConfirmDeliver(false)} style={{ color: "var(--text-secondary)" }}>
                <X size={20} />
              </button>
            </div>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              Le document sera envoyé à <strong>{userName}</strong> ({currentRequest.users?.email}). Un email de notification sera envoyé avec le lien de téléchargement.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setShowConfirmDeliver(false)} className="px-4 py-2 text-xs rounded-md" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}>
                Annuler
              </button>
              <button onClick={deliver} disabled={delivering} className="flex items-center gap-1.5 px-4 py-2 text-xs rounded-md" style={{ backgroundColor: "#22c55e", color: "white" }}>
                <Send size={12} /> {delivering ? "Envoi..." : "Confirmer l'envoi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
