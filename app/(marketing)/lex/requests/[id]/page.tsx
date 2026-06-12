"use client";

// ─── User: Letter Request Tracking Page (32J) ────────────
// URL: /lex/requests/[id]
// Affiche le statut, la timeline, le téléchargement, le feedback

import { useState, useEffect, use } from "react";
import { Clock, CheckCircle, Circle, Download, Star, MessageSquare, FileText, AlertTriangle, RefreshCw, ArrowLeft, Send, ChevronRight } from "lucide-react";
import Link from "next/link";

interface LetterEvent {
  id: string;
  event_type: string;
  from_status: string | null;
  to_status: string | null;
  created_at: string;
}

interface LetterRequest {
  id: string;
  reference?: string;
  letter_type: string;
  complexity: string;
  priority: string;
  status: string;
  brief: string;
  language: string;
  target_platform: string | null;
  requested_at: string;
  deadline_at: string;
  delivered_at: string | null;
  document_content: string | null;
  document_pdf_url: string | null;
  amount_charged?: number;
  events: LetterEvent[];
  feedback: { rating: number; comment: string | null; outcome: string | null } | null;
}

function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    received: "Reçue",
    awaiting_info: "En attente d'infos",
    in_progress: "En cours de rédaction",
    pending_validation: "Validation finale",
    delivered: "Livrée",
    refused: "Refusée",
  };
  return map[status] || status;
}

function getDeadlineInfo(deadlineAt: string): { label: string; color: string } {
  const now = new Date();
  const deadline = new Date(deadlineAt);
  const diffMs = deadline.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 0) return { label: "Délai dépassé", color: "#ef4444" };
  if (diffHours < 6) return { label: `Reste ${Math.floor(diffHours)}h ${Math.floor((diffHours % 1) * 60)}min`, color: "#ef4444" };
  if (diffHours < 24) return { label: `Reste ${Math.floor(diffHours)}h`, color: "#f59e0b" };
  return { label: `Reste ${Math.floor(diffHours / 24)}j ${Math.floor(diffHours % 24)}h`, color: "#22c55e" };
}

const STATUS_STEPS = ["received", "in_progress", "pending_validation", "delivered"];

function getStepStatus(currentStatus: string, stepStatus: string): "done" | "current" | "pending" {
  const idx = STATUS_STEPS.indexOf(stepStatus);
  const currentIdx = STATUS_STEPS.indexOf(currentStatus);
  if (idx < currentIdx) return "done";
  if (idx === currentIdx) return "current";
  return "pending";
}

export default function LetterRequestTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [request, setRequest] = useState<LetterRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [outcome, setOutcome] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    fetch(`/api/lex/requests?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setRequest(data);
      })
      .catch(() => setError("Impossible de charger votre demande"))
      .finally(() => setLoading(false));
  }, [id]);

  const submitFeedback = async () => {
    if (rating === 0) return;
    setSubmittingRating(true);
    try {
      const res = await fetch("/api/lex/requests/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letter_request_id: id, rating, comment, outcome }),
      });
      if (res.ok) setFeedbackSent(true);
    } catch (err) {
      console.error("Feedback error:", err);
    }
    setSubmittingRating(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-primary)" }}>
        <RefreshCw size={24} className="animate-spin" style={{ color: "var(--accent)" }} />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-primary)" }}>
        <div className="text-center max-w-md px-4">
          <AlertTriangle size={48} className="mx-auto" style={{ color: "var(--text-tertiary)" }} />
          <h1 className="text-xl font-semibold mt-4" style={{ color: "var(--text-primary)" }}>Demande introuvable</h1>
          <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>{error || "Cette demande n'existe pas ou vous n'y avez pas accès."}</p>
          <Link href="/lex" className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 text-sm rounded-md" style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}>
            <ArrowLeft size={14} /> Retour à Halo Lex
          </Link>
        </div>
      </div>
    );
  }

  const deadline = getDeadlineInfo(request.deadline_at);
  const isDelivered = request.status === "delivered";

  return (
    <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link href="/lex" className="inline-flex items-center gap-1.5 text-xs mb-6" style={{ color: "var(--accent)" }}>
          <ArrowLeft size={14} /> Retour à Halo Lex
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>{request.letter_type}</h1>
            {request.reference && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)", border: "1px solid var(--border-default)" }}>{request.reference}</span>
            )}
            {request.priority === "express" && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded animate-pulse" style={{ backgroundColor: "#ef4444", color: "white" }}>EXPRESS</span>
            )}
            {request.priority === "urgent" && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#f59e0b", color: "white" }}>URGENT</span>
            )}
          </div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Demandé le {new Date(request.requested_at).toLocaleDateString("fr-FR", { dateStyle: "long" })}
            {request.priority === "express" ? " · Express (4h)" : request.priority === "urgent" ? " · Urgent (12h)" : " · Standard (48h)"}
            {request.amount_charged ? ` · +${request.amount_charged}€` : ""}
          </p>
        </div>

        {/* Deadline warning */}
        {!isDelivered && (
          <div className="flex items-center gap-2 p-3 rounded-lg mb-6" style={{
            backgroundColor: deadline.color === "#ef4444" ? "#fef2f2" :
              deadline.color === "#f59e0b" ? "#fff7ed" : "#f0fdf4",
            color: deadline.color,
          }}>
            <Clock size={16} />
            <span className="text-sm font-medium">{deadline.label}</span>
          </div>
        )}

        {/* Progress Timeline */}
        <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: "var(--bg-surface)" }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Progression</h2>
          <div className="space-y-3">
            {[
              { key: "received", label: "Reçue" },
              { key: "in_progress", label: "En cours de rédaction" },
              { key: "pending_validation", label: "Validation finale" },
              { key: "delivered", label: "Livraison" },
            ].map((step) => {
              const stepStatus = getStepStatus(request.status === "awaiting_info" ? "received" : request.status === "refused" ? "delivered" : request.status, step.key);
              return (
                <div key={step.key} className="flex items-center gap-3">
                  {stepStatus === "done" ? (
                    <CheckCircle size={20} style={{ color: "#22c55e" }} />
                  ) : stepStatus === "current" ? (
                    <Clock size={20} style={{ color: "var(--accent)" }} />
                  ) : (
                    <Circle size={20} style={{ color: "var(--text-tertiary)" }} />
                  )}
                  <span className="text-sm" style={{
                    color: stepStatus === "done" ? "#22c55e" :
                      stepStatus === "current" ? "var(--accent)" : "var(--text-tertiary)",
                    fontWeight: stepStatus === "current" ? 600 : 400,
                  }}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {request.status === "awaiting_info" && (
            <div className="mt-4 p-3 rounded-lg text-xs" style={{ backgroundColor: "#fff7ed", color: "#f59e0b" }}>
              <AlertTriangle size={12} className="inline mr-1" /> En attente d&apos;informations complémentaires de votre part
            </div>
          )}
          {request.status === "refused" && (
            <div className="mt-4 p-3 rounded-lg text-xs" style={{ backgroundColor: "#fef2f2", color: "#ef4444" }}>
              <AlertTriangle size={12} className="inline mr-1" /> Demande refusée
            </div>
          )}
        </div>

        {/* Event History */}
        {request.events && request.events.length > 0 && (
          <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: "var(--bg-surface)" }}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Historique</h2>
            <div className="space-y-2">
              {request.events.map((event) => (
                <div key={event.id} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 mt-1.5 rounded-full shrink-0" style={{ backgroundColor: "var(--accent)" }} />
                  <div>
                    <p style={{ color: "var(--text-primary)" }}>
                      {event.event_type === "created" ? "Demande reçue" :
                       event.event_type === "status_change" && event.to_status ? getStatusLabel(event.to_status) :
                       event.event_type}
                    </p>
                    <p style={{ color: "var(--text-tertiary)" }}>
                      {new Date(event.created_at).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delivered: Download + Tips + Feedback */}
        {isDelivered && (
          <>
            {/* Download */}
            <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: "#f0fdf4" }}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={20} style={{ color: "#22c55e" }} />
                <h2 className="text-sm font-semibold" style={{ color: "#16a34a" }}>Votre document est prêt</h2>
              </div>
              <p className="text-xs mb-3" style={{ color: "#15803d" }}>
                Livré le {request.delivered_at ? new Date(request.delivered_at).toLocaleDateString("fr-FR", { dateStyle: "long" }) : "—"}
              </p>

              <a
                href={request.document_pdf_url || "#"}
                download
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md"
                style={{ backgroundColor: "#22c55e", color: "white" }}
              >
                <Download size={16} /> Télécharger le document
              </a>

              <div className="mt-4 text-xs space-y-1" style={{ color: "#15803d" }}>
                <p><strong>Que faire maintenant ?</strong></p>
                <ol className="list-decimal list-inside space-y-0.5 mt-1">
                  <li>Relisez attentivement le document</li>
                  <li>Personnalisez les passages entre crochets si nécessaire</li>
                  <li>Envoyez le document par email recommandé ou courrier recommandé</li>
                  <li>Conservez une copie pour vos archives</li>
                </ol>
              </div>

              <div className="mt-4 pt-4" style={{ borderTop: "1px solid #bbf7d0" }}>
                <Link
                  href={`/lex/requests/${id}?request_relance=true`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium"
                  style={{ color: "#16a34a" }}
                >
                  <Send size={12} /> Demander une lettre de relance <ChevronRight size={12} />
                </Link>
              </div>
            </div>

            {/* Rating */}
            {!feedbackSent && !request.feedback ? (
              <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: "var(--bg-surface)" }}>
                <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                  Comment évaluez-vous ce document ?
                </h2>
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)} className="p-0.5">
                      <Star size={24} fill={star <= rating ? "#f59e0b" : "none"} style={{ color: "#f59e0b" }} />
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Laisser un commentaire (optionnel)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full text-xs p-3 rounded-lg resize-none outline-none mb-3"
                  style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)", border: "1px solid var(--border-default)", height: 60 }}
                />
                <div className="flex items-center gap-2 mb-3">
                  {["resolved", "pending", "no_response"].map((o) => (
                    <button
                      key={o}
                      onClick={() => setOutcome(o)}
                      className="px-2.5 py-1 text-xs rounded-md"
                      style={{
                        backgroundColor: outcome === o ? "var(--accent)" : "var(--bg-primary)",
                        color: outcome === o ? "var(--accent-text)" : "var(--text-secondary)",
                        border: "1px solid var(--border-default)",
                      }}
                    >
                      {o === "resolved" ? "Résolu" : o === "pending" ? "En attente" : "Pas de réponse"}
                    </button>
                  ))}
                </div>
                <button
                  onClick={submitFeedback}
                  disabled={rating === 0 || submittingRating}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-md"
                  style={{
                    backgroundColor: rating > 0 ? "var(--accent)" : "var(--bg-primary)",
                    color: rating > 0 ? "var(--accent-text)" : "var(--text-tertiary)",
                    opacity: rating === 0 ? 0.5 : 1,
                  }}
                >
                  {submittingRating ? "Envoi..." : "Envoyer"}
                </button>
              </div>
            ) : (
              <div className="rounded-xl p-6 mb-6 text-center" style={{ backgroundColor: "var(--bg-surface)" }}>
                <CheckCircle size={24} className="mx-auto mb-2" style={{ color: "#22c55e" }} />
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Merci pour votre évaluation !</p>
              </div>
            )}
          </>
        )}

        {/* Bottom info */}
        <p className="text-center text-xs mt-8" style={{ color: "var(--text-tertiary)" }}>
          ℹ️ Halo Lex fournit une assistance à la rédaction juridique. Information juridique générale, ne constitue pas un acte d&apos;avocat.
        </p>
      </div>
    </div>
  );
}
