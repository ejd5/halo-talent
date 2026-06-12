"use client";

// ─── Admin: Letter Requests Dashboard (32I) ──────────────
// Split 30/70 layout: queue on left, request detail on right

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Clock, AlertTriangle, CheckCircle, ChevronRight, Copy,
  ExternalLink, Download, FileText, Search, Send, User,
  Shield, BookOpen, ListChecks, Eye, Edit3, Star,
  X, RefreshCw, MessageSquare, Filter,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────

interface UserMeta {
  email: string;
  raw_user_meta_data: { first_name?: string; full_name?: string; avatar_url?: string };
}

interface LetterRequest {
  id: string;
  user_id: string;
  letter_type: string;
  complexity: "standard" | "complex";
  priority: "standard" | "urgent" | "express";
  reference?: string;
  brief: string;
  user_context: any;
  attachments: any[];
  language: string;
  tone: string;
  target_platform: string | null;
  status: string;
  requested_at: string;
  deadline_at: string;
  started_at: string | null;
  delivered_at: string | null;
  document_content: string | null;
  document_pdf_url: string | null;
  admin_notes: string | null;
  time_spent_minutes: number | null;
  is_within_quota: boolean;
  amount_charged: number;
  users: UserMeta;
  events?: LetterEvent[];
  feedback?: Feedback | null;
}

interface LetterEvent {
  id: string;
  event_type: string;
  from_status: string | null;
  to_status: string | null;
  event_data: any;
  performed_by: string | null;
  notes: string | null;
  created_at: string;
}

interface Feedback {
  rating: number;
  comment: string | null;
  outcome: string | null;
}

interface DashboardCounts {
  received: number;
  in_progress: number;
  today: number;
}

type FilterTab = "all" | "express" | "urgent" | "standard" | "done" | "archive";

// ─── Helpers ──────────────────────────────────────────────

function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    received: "Reçue",
    awaiting_info: "En attente d'infos",
    in_progress: "En cours",
    pending_validation: "À valider",
    delivered: "Livrée",
    refused: "Refusée",
  };
  return map[status] || status;
}

function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    received: "var(--accent)",
    awaiting_info: "#f59e0b",
    in_progress: "#3b82f6",
    pending_validation: "#8b5cf6",
    delivered: "#22c55e",
    refused: "#ef4444",
  };
  return map[status] || "var(--text-secondary)";
}

function getDeadlineInfo(deadlineAt: string): { label: string; color: string; urgent: boolean } {
  const now = new Date();
  const deadline = new Date(deadlineAt);
  const diffMs = deadline.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 0) {
    return { label: "En retard !", color: "#ef4444", urgent: true };
  }
  if (diffHours < 6) {
    return { label: `Reste ${Math.floor(diffHours)}h${Math.floor((diffHours % 1) * 60)}min`, color: "#ef4444", urgent: true };
  }
  if (diffHours < 24) {
    return { label: `Reste ${Math.floor(diffHours)}h`, color: "#f59e0b", urgent: false };
  }
  return { label: `${Math.floor(diffHours / 24)}j ${Math.floor(diffHours % 24)}h`, color: "#22c55e", urgent: false };
}

// ─── Claude Prompt Generator ──────────────────────────────

function buildClaudePrompt(request: LetterRequest): string {
  const userName = request.users?.raw_user_meta_data?.first_name || request.users?.raw_user_meta_data?.full_name || "Utilisateur";
  return [
    "Tu es un expert en rédaction de documents juridiques pour créateurs de contenu.",
    "",
    "Contexte :",
    request.brief,
    "",
    `Type de document à rédiger : ${request.letter_type}`,
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
    "Format : structure formelle avec en-tête, objet, corps, conclusion, signature.",
    `Longueur : ${request.complexity === "standard" ? "4-6 pages" : "8-15 pages"}`,
  ].join("\n");
}

// ─── Stats Panel ──────────────────────────────────────────

function StatsModal({ onClose }: { onClose: () => void }) {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/lex/requests")
      .then((r) => r.json())
      .then((d) => {
        if (d.requests) {
          const total = d.requests.length;
          const delivered = d.requests.filter((r: LetterRequest) => r.status === "delivered").length;
          const express = d.requests.filter((r: LetterRequest) => r.priority === "express").length;
          const complex = d.requests.filter((r: LetterRequest) => r.complexity === "complex").length;
          setStats({ total, delivered, express, complex, ...d.counts });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "var(--bg-overlay)" }}>
      <div className="rounded-xl w-full max-w-lg p-6" style={{ backgroundColor: "var(--bg-primary)" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Statistiques</h2>
          <button onClick={onClose} style={{ color: "var(--text-secondary)" }}><X size={20} /></button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Total demandes", value: stats?.total || 0, color: "var(--accent)" },
            { label: "En attente", value: stats?.received || 0, color: "#f59e0b" },
            { label: "En cours", value: stats?.in_progress || 0, color: "#3b82f6" },
            { label: "Livrées aujourd'hui", value: stats?.today || 0, color: "#22c55e" },
            { label: "Express", value: stats?.express || 0, color: "#ef4444" },
            { label: "Complexes", value: stats?.complex || 0, color: "#8b5cf6" },
            { label: "Livrées total", value: stats?.delivered || 0, color: "#22c55e" },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-lg" style={{ backgroundColor: "var(--bg-surface)" }}>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{s.label}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────

export default function LexRequestsAdminPage() {
  const [requests, setRequests] = useState<LetterRequest[]>([]);
  const [counts, setCounts] = useState<DashboardCounts>({ received: 0, in_progress: 0, today: 0 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<LetterRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showStats, setShowStats] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [showClarificationModal, setShowClarificationModal] = useState(false);
  const [clarificationQuestions, setClarificationQuestions] = useState("");
  const [submittingClarification, setSubmittingClarification] = useState(false);

  // Load requests
  const loadRequests = useCallback(async () => {
    setLoading(true);
    const statusParam = filterTab === "done" ? "delivered" :
      filterTab === "archive" ? "refused" : undefined;
    const priorityParam = filterTab === "express" ? "express" :
      filterTab === "urgent" ? "urgent" :
      filterTab === "standard" ? "standard" : undefined;

    const params = new URLSearchParams();
    params.set("limit", "100");
    if (statusParam) params.set("status", statusParam);
    if (priorityParam) params.set("priority", priorityParam);

    try {
      const res = await fetch(`/api/admin/lex/requests?${params}`);
      const data = await res.json();
      setRequests(data.requests || []);
      // Recalculate counts from the data
      const received = data.requests?.filter((r: LetterRequest) => r.status === "received").length || 0;
      const inProgress = data.requests?.filter((r: LetterRequest) => r.status === "in_progress").length || 0;
      const today = data.requests?.filter((r: LetterRequest) => {
        const d = new Date(r.requested_at);
        const now = new Date();
        return d.toDateString() === now.toDateString();
      }).length || 0;
      setCounts({ received, in_progress: inProgress, today });
    } catch (err) {
      console.error("Failed to load requests:", err);
    }
    setLoading(false);
  }, [filterTab]);

  useEffect(() => { loadRequests(); }, [loadRequests]);

  // Browser push notification for new requests
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    // Request permission once
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    const knownIds = new Set<string>();
    let firstLoad = true;

    const checkForNew = async () => {
      try {
        const res = await fetch("/api/admin/lex/requests?limit=5&sort=created_at");
        const data = await res.json();
        const latest = data.requests || [];

        for (const req of latest) {
          if (!knownIds.has(req.id)) {
            knownIds.add(req.id);
            if (!firstLoad && Notification.permission === "granted") {
              const userName = req.users?.raw_user_meta_data?.first_name || "Utilisateur";
              const priority = req.priority === "express" ? "🔥 " : "";
              new Notification("Nouvelle demande Halo Lex", {
                body: `${priority}${userName} — ${req.letter_type}`,
                icon: "/favicon.ico",
                tag: req.id,
              });
            }
          }
        }
        firstLoad = false;
      } catch { /* silent */ }
    };

    checkForNew(); // Initial load
    const interval = setInterval(checkForNew, 60000); // Poll every 60s
    return () => clearInterval(interval);
  }, []);

  // Load selected request detail
  const loadSelectedDetail = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/lex/requests?id=${id}`);
      const data = await res.json();
      setSelectedRequest(data);
      setEditorContent(data.document_content || "");
    } catch (err) {
      console.error("Failed to load request detail:", err);
    }
  }, []);

  useEffect(() => {
    if (selectedId) loadSelectedDetail(selectedId);
  }, [selectedId, loadSelectedDetail]);

  // Update request status
  const updateStatus = async (newStatus: string) => {
    if (!selectedRequest) return;
    const body: any = { id: selectedRequest.id, status: newStatus };
    if (newStatus === "delivered") {
      body.document_content = editorContent;
      body.pdf_url = selectedRequest.document_pdf_url || `https://halo-talent.com/api/lex/requests/${selectedRequest.id}/pdf`;
    }
    try {
      const res = await fetch("/api/admin/lex/requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        loadRequests();
        loadSelectedDetail(selectedRequest.id);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Copy Claude prompt
  const copyClaudePrompt = () => {
    if (!selectedRequest) return;
    const prompt = buildClaudePrompt(selectedRequest);
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Open Claude.ai
  const openClaude = () => {
    if (!selectedRequest) return;
    const prompt = buildClaudePrompt(selectedRequest);
    const url = `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
    window.open(url, "_blank");
  };

  // Submit clarification request
  const submitClarification = async () => {
    if (!selectedRequest || !clarificationQuestions.trim()) return;
    setSubmittingClarification(true);
    try {
      const questions = clarificationQuestions.split("\n").filter((q) => q.trim());
      const res = await fetch("/api/admin/lex/requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedRequest.id,
          status: "awaiting_info",
          admin_notes: clarificationQuestions.trim(),
        }),
      });
      if (res.ok) {
        setShowClarificationModal(false);
        setClarificationQuestions("");
        loadRequests();
        loadSelectedDetail(selectedRequest.id);
      }
    } catch (err) {
      console.error("Failed to send clarification:", err);
    }
    setSubmittingClarification(false);
  };

  // Filter requests by tab
  const filteredRequests = useMemo(() => {
    let list = [...requests];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((r) => {
        const userName = r.users?.raw_user_meta_data?.first_name?.toLowerCase() || "";
        const letterType = r.letter_type?.toLowerCase() || "";
        return userName.includes(q) || letterType.includes(q);
      });
    }
    return list;
  }, [requests, searchQuery]);

  // Compute urgency class for queue cards
  function getUrgencyClass(deadlineAt: string, status: string): string {
    if (status === "delivered" || status === "refused") return "opacity-60";
    const info = getDeadlineInfo(deadlineAt);
    if (info.label === "En retard !") return "border-l-[3px] border-l-red-500";
    if (info.color === "#ef4444") return "border-l-[3px] border-l-red-400";
    if (info.color === "#f59e0b") return "border-l-[3px] border-l-amber-400";
    return "";
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--border-default)" }}>
        <div className="flex items-center gap-3">
          <Shield size={20} style={{ color: "var(--accent)" }} />
          <div>
            <h1 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>Rédaction Lex</h1>
            <div className="flex items-center gap-3 text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
              <span>{counts.received} en attente</span>
              <span>·</span>
              <span>{counts.in_progress} en cours</span>
              <span>·</span>
              <span>{counts.today} aujourd&apos;hui</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowStats(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors"
            style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}
          >
            Stats
          </button>
          <button
            onClick={() => setFocusMode(!focusMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors"
            style={{
              backgroundColor: focusMode ? "var(--accent)" : "var(--bg-surface)",
              color: focusMode ? "var(--accent-text)" : "var(--text-secondary)",
            }}
          >
            {focusMode ? "Focus ON" : "Mode focus"}
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* ─── LEFT PANEL (30%) — Queue ─── */}
        <div className="w-[30%] flex flex-col shrink-0" style={{ borderRight: "1px solid var(--border-default)" }}>
          {/* Filters */}
          <div className="shrink-0 px-3 py-2 space-y-2" style={{ borderBottom: "1px solid var(--border-default)" }}>
            <div className="flex gap-1">
              {[
                { key: "all", label: "Toutes" },
                { key: "express", label: "🔥 Express" },
                { key: "urgent", label: "⚡ Urgent" },
                { key: "standard", label: "⏰ Standard" },
                { key: "done", label: "✅ Terminé" },
                { key: "archive", label: "📁 Archive" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilterTab(tab.key as FilterTab)}
                  className="px-2 py-1 text-[11px] rounded transition-colors"
                  style={{
                    backgroundColor: filterTab === tab.key ? "var(--accent)" : "transparent",
                    color: filterTab === tab.key ? "var(--accent-text)" : "var(--text-secondary)",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs rounded-md pl-7 pr-2 py-1.5 outline-none"
                style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)", border: "1px solid var(--border-default)" }}
              />
            </div>
          </div>

          {/* Queue List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw size={20} className="animate-spin" style={{ color: "var(--accent)" }} />
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <FileText size={32} style={{ color: "var(--text-tertiary)" }} />
                <p className="text-sm mt-3" style={{ color: "var(--text-secondary)" }}>Aucune demande</p>
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {filteredRequests.map((req) => {
                  const deadline = getDeadlineInfo(req.deadline_at);
                  const isSelected = req.id === selectedId;
                  const userName = req.users?.raw_user_meta_data?.first_name || req.users?.raw_user_meta_data?.full_name || "Utilisateur";

                  return (
                    <button
                      key={req.id}
                      onClick={() => setSelectedId(req.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${getUrgencyClass(req.deadline_at, req.status)}`}
                      style={{
                        backgroundColor: isSelected ? "var(--accent-soft)" : "var(--bg-surface)",
                        border: isSelected ? "1px solid var(--accent)" : "1px solid transparent",
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          {req.priority === "express" && (
                            <span className="text-[9px] font-bold px-1 py-0.5 rounded animate-pulse" style={{ backgroundColor: "#ef4444", color: "white" }}>EXPRESS</span>
                          )}
                          {req.priority === "urgent" && (
                            <span className="text-[9px] font-bold px-1 py-0.5 rounded" style={{ backgroundColor: "#f59e0b", color: "white" }}>URGENT</span>
                          )}
                          {req.complexity === "complex" && (
                            <span className="text-[9px] font-bold px-1 py-0.5 rounded" style={{ backgroundColor: "#8b5cf6", color: "white" }}>COMPLEXE</span>
                          )}
                        </div>
                        <span className="text-[10px]" style={{ color: deadline.color }}>{deadline.label}</span>
                      </div>
                      <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>{userName}</p>
                      <p className="text-[11px] truncate mt-0.5" style={{ color: "var(--text-secondary)" }}>{req.letter_type}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${getStatusColor(req.status)}20`, color: getStatusColor(req.status) }}>
                          {getStatusLabel(req.status)}
                        </span>
                        <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                          {new Date(req.requested_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Refresh */}
          <div className="shrink-0 px-3 py-2" style={{ borderTop: "1px solid var(--border-default)" }}>
            <button
              onClick={loadRequests}
              className="flex items-center gap-1.5 text-xs"
              style={{ color: "var(--text-tertiary)" }}
            >
              <RefreshCw size={12} />
              Actualiser
            </button>
          </div>
        </div>

        {/* ─── RIGHT PANEL (70%) — Detail ─── */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {!selectedRequest ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <FileText size={48} style={{ color: "var(--text-tertiary)" }} />
              <p className="text-sm mt-4 font-medium" style={{ color: "var(--text-secondary)" }}>Sélectionnez une demande</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>Choisissez une demande dans la file d&apos;attente pour voir les détails</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {/* ── Request Header ── */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{selectedRequest.letter_type}</h2>
                    {selectedRequest.reference && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-secondary)", border: "1px solid var(--border-default)" }}>{selectedRequest.reference}</span>
                    )}
                    {selectedRequest.priority === "express" && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded animate-pulse" style={{ backgroundColor: "#ef4444", color: "white" }}>EXPRESS</span>
                    )}
                    {selectedRequest.priority === "urgent" && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#f59e0b", color: "white" }}>URGENT</span>
                    )}
                    {selectedRequest.complexity === "complex" && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#8b5cf6", color: "white" }}>COMPLEXE</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                    <span className="flex items-center gap-1"><User size={12} /> {selectedRequest.users?.raw_user_meta_data?.first_name || "Utilisateur"}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> Échéance : {new Date(selectedRequest.deadline_at).toLocaleDateString("fr-FR", { dateStyle: "long" })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedRequest.status === "received" && (
                    <button onClick={() => updateStatus("in_progress")} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md" style={{ backgroundColor: "#3b82f6", color: "white" }}>
                      <Edit3 size={12} /> Marquer en cours
                    </button>
                  )}
                  {selectedRequest.status === "in_progress" && (
                    <button onClick={() => updateStatus("pending_validation")} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md" style={{ backgroundColor: "#8b5cf6", color: "white" }}>
                      <CheckCircle size={12} /> À valider
                    </button>
                  )}
                  {selectedRequest.status === "pending_validation" && (
                    <button onClick={() => updateStatus("delivered")} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md" style={{ backgroundColor: "#22c55e", color: "white" }}>
                      <Send size={12} /> Envoyer au client
                    </button>
                  )}
                  {(selectedRequest.status === "received" || selectedRequest.status === "in_progress") && (
                    <button onClick={() => setShowClarificationModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md" style={{ backgroundColor: "#f59e0b", color: "white" }}>
                      <MessageSquare size={12} /> Demander infos
                    </button>
                  )}
                </div>
              </div>

              {/* ── Section 1: Client Context ── */}
              <details open className="rounded-lg" style={{ backgroundColor: "var(--bg-surface)" }}>
                <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  <User size={14} /> Contexte client
                </summary>
                <div className="px-4 pb-4 space-y-2">
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <p style={{ color: "var(--text-tertiary)" }}>Nom</p>
                      <p style={{ color: "var(--text-primary)" }}>{selectedRequest.users?.raw_user_meta_data?.first_name || "—"}</p>
                    </div>
                    <div>
                      <p style={{ color: "var(--text-tertiary)" }}>Email</p>
                      <p style={{ color: "var(--text-primary)" }}>{selectedRequest.users?.email || "—"}</p>
                    </div>
                    <div>
                      <p style={{ color: "var(--text-tertiary)" }}>Plateforme cible</p>
                      <p style={{ color: "var(--text-primary)" }}>{selectedRequest.target_platform || "—"}</p>
                    </div>
                    <div>
                      <p style={{ color: "var(--text-tertiary)" }}>Langue</p>
                      <p style={{ color: "var(--text-primary)" }}>{selectedRequest.language === "en" ? "Anglais" : "Français"}</p>
                    </div>
                    <div>
                      <p style={{ color: "var(--text-tertiary)" }}>Ton</p>
                      <p style={{ color: "var(--text-primary)" }}>{selectedRequest.tone || "Ferme et juridique"}</p>
                    </div>
                  </div>
                </div>
              </details>

              {/* ── Section 2: Brief Lex ── */}
              <details open className="rounded-lg" style={{ backgroundColor: "var(--bg-surface)" }}>
                <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  <BookOpen size={14} /> Brief généré par Lex
                </summary>
                <div className="px-4 pb-4">
                  <pre className="text-xs whitespace-pre-wrap font-sans leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {selectedRequest.brief}
                  </pre>
                </div>
              </details>

              {/* ── Section 3: Claude Prompt ── */}
              <details open className="rounded-lg" style={{ backgroundColor: "var(--bg-surface)" }}>
                <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  <Shield size={14} /> Prompt Claude
                </summary>
                <div className="px-4 pb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <button
                      onClick={copyClaudePrompt}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors"
                      style={{ backgroundColor: copied ? "#22c55e" : "var(--accent)", color: "var(--accent-text)" }}
                    >
                      {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
                      {copied ? "Copié !" : "Copier le prompt Claude"}
                    </button>
                    <button
                      onClick={openClaude}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors"
                      style={{ backgroundColor: "var(--bg-primary)", color: "var(--accent)", border: "1px solid var(--accent)" }}
                    >
                      <ExternalLink size={12} /> Ouvrir Claude.ai
                    </button>
                  </div>
                  <pre className="text-xs whitespace-pre-wrap font-sans leading-relaxed p-3 rounded-lg" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-secondary)", border: "1px solid var(--border-default)" }}>
                    {buildClaudePrompt(selectedRequest)}
                  </pre>
                </div>
              </details>

              {/* ── Section 4: Editor ── */}
              <details open className="rounded-lg" style={{ backgroundColor: "var(--bg-surface)" }}>
                <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  <Edit3 size={14} /> Éditeur du document
                </summary>
                <div className="px-4 pb-4">
                  <textarea
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    className="w-full h-64 text-sm p-3 rounded-lg font-serif resize-y outline-none"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border-default)",
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      lineHeight: 1.8,
                    }}
                    placeholder="Collez ici le résultat de Claude..."
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                      {editorContent.split(/\s+/).filter(Boolean).length} mots · {Math.ceil(editorContent.split(/\s+/).filter(Boolean).length / 250)} pages estimées
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateStatus("pending_validation")}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md"
                        style={{ backgroundColor: "#8b5cf6", color: "white" }}
                      >
                        <CheckCircle size={12} /> Marquer à valider
                      </button>
                    </div>
                  </div>
                </div>
              </details>

              {/* Editor analysis: citations + customizable + forbidden terms */}
              {editorContent && (() => {
                const legalCitations = editorContent.match(/(?:Article\s+\d+(?:[-\s]\d+)?(?:[-.\s]\d+)?(?:\s+(?:du|des|de la|de l')\s+(?:Code|Règlement|Loi|Décret)[^,.!?]+))|(?:Art\.\s+\d+(?:[-\s]\d+)?(?:[-.\s]\d+)?(?:\s+(?:C\.?\s*(?:civ|com|trav|pén|CPI)|code[^,.!?]+)))|(?:(?:CGU|Conditions Générales)\s+(?:d['e]n?|de\s+la\s+plateforme\s+)?(?:OnlyFans|Fansly|MYM|Instagram|TikTok|YouTube|Twitter|Twitch))|(?:Règlement\s+(?:UE| européen)[^,.!?]*\d{4}\/\d+)|(?:Loi\s+(?:n°|nº|n\.?)\s*\d{4}[-\s]\d+)|(?:(?:DSA|RGPD)\s*(?:Article|Règlement)?\s*\d+)/gi) || [];
                const customizables = editorContent.match(/\[([^\]]+)\]/g) || [];
                const forbidden: string[] = [];
                const fbTerms = ["conseil juridique", "je vous conseille", "mon conseil est", "vous devez", "avocat partenaire", "validé par un avocat", "expert juridique", "conseiller juridique"];
                for (const term of fbTerms) {
                  const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
                  const matches = editorContent.match(re);
                  if (matches) forbidden.push(...matches);
                }

                if (legalCitations.length === 0 && customizables.length === 0 && forbidden.length === 0) return null;

                return (
                  <div className="mt-3 p-3 rounded-lg space-y-1.5" style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border-default)" }}>
                    {legalCitations.length > 0 && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: "#22c55e" }} />
                        <span style={{ color: "#22c55e" }}>{legalCitations.length} citation{legalCitations.length > 1 ? "s" : ""} légale{legalCitations.length > 1 ? "s" : ""} détectée{legalCitations.length > 1 ? "s" : ""}</span>
                        <span className="truncate" style={{ color: "var(--text-tertiary)" }}>({legalCitations.slice(0, 3).map(c => c.substring(0, 40) + "…").join(", ")})</span>
                      </div>
                    )}
                    {customizables.length > 0 && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: "#f59e0b" }} />
                        <span style={{ color: "#f59e0b" }}>{customizables.length} passage{customizables.length > 1 ? "s" : ""} personnalisable{customizables.length > 1 ? "s" : ""}</span>
                        <span className="truncate" style={{ color: "var(--text-tertiary)" }}>({customizables.slice(0, 3).map(c => c.substring(0, 30) + "…").join(", ")})</span>
                      </div>
                    )}
                    {forbidden.length > 0 && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: "#ef4444" }} />
                        <span style={{ color: "#ef4444" }}>⚠️ {forbidden.length} terme{forbidden.length > 1 ? "s" : ""} interdit{forbidden.length > 1 ? "s" : ""} détecté{forbidden.length > 1 ? "s" : ""}</span>
                        <span style={{ color: "var(--text-tertiary)" }}>({[...new Set(forbidden)].join(", ")})</span>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* ── Section 5: Personalization ── */}
              <details className="rounded-lg" style={{ backgroundColor: "var(--bg-surface)" }}>
                <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  <FileText size={14} /> Personnalisation
                </summary>
                <div className="px-4 pb-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs mb-1" style={{ color: "var(--text-tertiary)" }}>Langue</p>
                    <p className="text-sm" style={{ color: "var(--text-primary)" }}>{selectedRequest.language === "en" ? "Anglais" : "Français"}</p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: "var(--text-tertiary)" }}>Signature</p>
                    <p className="text-sm" style={{ color: "var(--text-primary)" }}>L&apos;équipe Halo Talent (par défaut)</p>
                  </div>
                </div>
              </details>

              {/* ── Section 6: Validation Checklist ── */}
              <details className="rounded-lg" style={{ backgroundColor: "var(--bg-surface)" }}>
                <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  <ListChecks size={14} /> Validation
                </summary>
                <div className="px-4 pb-4 space-y-2">
                  {[
                    "Le ton correspond à la demande",
                    "Toutes les bases légales sont vérifiées",
                    'Aucun terme interdit ("conseil juridique", "avocat")',
                    "Le disclaimer obligatoire est présent",
                    "La langue est correcte",
                  ].map((item) => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{item}</span>
                    </label>
                  ))}
                  <button
                    onClick={() => updateStatus("delivered")}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-md mt-3"
                    style={{ backgroundColor: "#22c55e", color: "white" }}
                  >
                    <Send size={14} /> Générer le PDF et envoyer
                  </button>
                </div>
              </details>

              {/* ── Section 7: Admin Notes + Events ── */}
              <details className="rounded-lg" style={{ backgroundColor: "var(--bg-surface)" }}>
                <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  <Clock size={14} /> Suivi
                </summary>
                <div className="px-4 pb-4">
                  {/* Events timeline */}
                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-medium mb-2" style={{ color: "var(--text-tertiary)" }}>Historique</p>
                    {(selectedRequest.events || []).map((event) => (
                      <div key={event.id} className="flex items-start gap-2 text-xs">
                        <div className="w-2 h-2 mt-1 rounded-full shrink-0" style={{ backgroundColor: getStatusColor(event.to_status || event.event_type) }} />
                        <div>
                          <p style={{ color: "var(--text-primary)" }}>
                            {event.event_type === "created" ? "Demande créée" :
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

                  {/* Admin notes */}
                  <div>
                    <p className="text-xs font-medium mb-2" style={{ color: "var(--text-tertiary)" }}>Note interne</p>
                    <textarea
                      className="w-full h-20 text-xs p-2 rounded-lg resize-none outline-none"
                      style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)", border: "1px solid var(--border-default)" }}
                      placeholder="Ajouter une note interne..."
                      defaultValue={selectedRequest.admin_notes || ""}
                    />
                  </div>
                </div>
              </details>

              {/* ── Feedback (if delivered) ── */}
              {selectedRequest.feedback && (
                <div className="rounded-lg p-4" style={{ backgroundColor: "var(--bg-surface)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Star size={14} style={{ color: "#f59e0b" }} />
                    <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>Feedback client</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={14} fill={star <= (selectedRequest.feedback?.rating || 0) ? "#f59e0b" : "none"} style={{ color: "#f59e0b" }} />
                    ))}
                  </div>
                  {selectedRequest.feedback?.comment && (
                    <p className="text-xs mt-2" style={{ color: "var(--text-secondary)" }}>{selectedRequest.feedback.comment}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Clarification Modal */}
      {showClarificationModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "var(--bg-overlay)" }}>
          <div className="rounded-xl w-full max-w-lg p-6" style={{ backgroundColor: "var(--bg-primary)" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} style={{ color: "#f59e0b" }} />
                <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Demander des précisions</h2>
              </div>
              <button onClick={() => { setShowClarificationModal(false); setClarificationQuestions(""); }} style={{ color: "var(--text-secondary)" }}>
                <X size={20} />
              </button>
            </div>
            <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
              Précisez les informations manquantes. Le compte à rebours sera mis en pause jusqu&apos;à la réponse du client.
              Le client recevra un email avec vos questions.
            </p>
            <textarea
              value={clarificationQuestions}
              onChange={(e) => setClarificationQuestions(e.target.value)}
              className="w-full h-32 text-sm p-3 rounded-lg resize-none outline-none mb-4"
              style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)", border: "1px solid var(--border-default)" }}
              placeholder={"1. [Question 1]\n2. [Question 2]\n3. [Question 3]"}
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => { setShowClarificationModal(false); setClarificationQuestions(""); }}
                className="px-4 py-2 text-xs rounded-md"
                style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}
              >
                Annuler
              </button>
              <button
                onClick={submitClarification}
                disabled={!clarificationQuestions.trim() || submittingClarification}
                className="flex items-center gap-1.5 px-4 py-2 text-xs rounded-md"
                style={{
                  backgroundColor: clarificationQuestions.trim() ? "#f59e0b" : "var(--bg-surface)",
                  color: clarificationQuestions.trim() ? "white" : "var(--text-tertiary)",
                }}
              >
                <Send size={12} /> {submittingClarification ? "Envoi..." : "Envoyer au client"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {showStats && <StatsModal onClose={() => setShowStats(false)} />}
    </div>
  );
}
