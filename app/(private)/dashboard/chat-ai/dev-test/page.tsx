"use client";

import { useState, useEffect } from "react";
import {
  MessageSquare, Zap, Shield, Check, Copy, FileText, Clock,
  AlertTriangle, Loader2, RefreshCw, User, Activity,
  Database, ToggleRight, ToggleLeft, ClipboardCheck, Play,
} from "lucide-react";

// ── Types locaux ──────────────────────────────────────────
interface Fan {
  id: string; pseudonym: string; status: string; language: string;
  ltv: number; intent_score: number; churn_risk: number;
  relationship_score: number; commercial_score: number;
  risk_flags: string[]; platform: string;
}

interface Conversation {
  id: string; fan_id: string; platform: string; priority_score: number;
  last_message_preview: string; status: string;
  chat_ai_fans?: Fan;
}

interface DraftResult {
  allowed: boolean;
  draft?: {
    id: string; text: string; objective: string; tone: string;
    riskLevel: string; complianceStatus: string; model: string;
    explanation: string; status: string; createdAt: string;
  };
  riskLevel?: string;
  complianceNotes?: string[];
  explanation?: string;
  model?: string;
  tokensUsed?: number;
  latencyMs?: number;
  demoMode?: boolean;
  reasons?: string[];
  requiredActions?: string[];
}

interface AuditLog {
  id: string; action: string; target_type: string;
  created_at: string; metadata: Record<string, unknown>;
}

// ── Style helpers ─────────────────────────────────────────
const card = {
  border: "1px solid rgba(245,240,235,0.08)",
  background: "rgba(245,240,235,0.03)",
  borderRadius: "8px",
  padding: "16px",
};

const badge = (color: string) => ({
  display: "inline-block",
  padding: "2px 8px",
  borderRadius: "4px",
  fontSize: "10px",
  fontWeight: 600,
  textTransform: "uppercase" as const,
  background: `${color}20`,
  color,
  border: `1px solid ${color}30`,
});

const statusColors: Record<string, string> = {
  whale: "#f59e0b", vip: "#a78bfa", active: "#34d399",
  new: "#60a5fa", dormant: "#9ca3af", churn_risk: "#f87171",
  do_not_contact: "#ef4444",
};

const riskColors: Record<string, string> = {
  low: "#34d399", medium: "#f59e0b", high: "#ef4444",
};

// ── Page ──────────────────────────────────────────────────
export default function DevTestPage() {
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [objective, setObjective] = useState("Prendre des nouvelles et créer du lien");
  const [loading, setLoading] = useState(false);
  const [draftResult, setDraftResult] = useState<DraftResult | null>(null);
  const [approveMsg, setApproveMsg] = useState("");
  const [copyMsg, setCopyMsg] = useState("");
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [error, setError] = useState("");
  const [statusLog, setStatusLog] = useState<string[]>([]);

  // Status dashboard state
  const [supabaseStatus, setSupabaseStatus] = useState<"checking" | "connected" | "error">("checking");
  const [smokeRunning, setSmokeRunning] = useState(false);

  const log = (msg: string) => setStatusLog((s) => [...s.slice(-19), `[${new Date().toLocaleTimeString()}] ${msg}`]);

  // Load conversations
  const loadConversations = async () => {
    setError("");
    log("Chargement des conversations...");
    try {
      const res = await fetch("/api/chat-ai/conversations?limit=10");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setConvs(data.conversations || []);
      log(`${data.conversations?.length || 0} conversations chargées`);
    } catch (e) {
      setError(String(e));
      log("ERREUR: " + String(e));
    }
  };

  // Load audit logs
  const loadAuditLogs = async () => {
    try {
      const res = await fetch("/api/chat-ai/audit?limit=10");
      const data = await res.json();
      setAuditLogs(data.logs || []);
    } catch { /* silent */ }
  };

  // Check system status and load data on mount
  useEffect(() => {
    async function init() {
      try {
        const userRes = await fetch("/api/chat-ai/conversations?limit=1");
        if (userRes.status === 401) {
          setSupabaseStatus("error");
          log("Non authentifié, connecte-toi avec le compte demo");
          return;
        }
        setSupabaseStatus("connected");
        log("Supabase connecté");
        await loadConversations();
        await loadAuditLogs();
      } catch {
        setSupabaseStatus("error");
        log("Erreur connexion Supabase");
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generate draft
  const generateDraft = async () => {
    if (!selectedConv) return;
    setError("");
    setDraftResult(null);
    setApproveMsg("");
    setCopyMsg("");
    setLoading(true);
    log("Génération du draft...");

    try {
      const res = await fetch("/api/chat-ai/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConv.id,
          objective,
          actionType: "generate",
        }),
      });
      const data = await res.json();
      setDraftResult(data);
      log(`Draft généré: ${data.allowed ? "OK" : "BLOQUÉ"} | modèle: ${data.model || "demo"}`);
      if (data.draft) log(`Status: ${data.draft.status}, Risque: ${data.riskLevel}`);
      loadAuditLogs();
    } catch (e) {
      setError(String(e));
      log("ERREUR: " + String(e));
    } finally {
      setLoading(false);
    }
  };

  // Approve draft
  const approveDraft = async () => {
    if (!draftResult?.draft?.id) return;
    setLoading(true);
    log("Approbation du draft...");
    try {
      const res = await fetch(`/api/chat-ai/drafts/${draftResult.draft.id}/approve`, {
        method: "POST",
      });
      const data = await res.json();
      setApproveMsg(data.success ? "Approuvé, prêt à copier." : data.error || "Erreur");
      log(data.success ? "Draft approuvé" : "Approbation bloquée: " + (data.error || "inconnu"));
      loadAuditLogs();
    } catch (e) {
      setError(String(e));
      log("ERREUR: " + String(e));
    } finally {
      setLoading(false);
    }
  };

  // Copy draft
  const copyDraft = async () => {
    if (!draftResult?.draft?.id) return;
    setLoading(true);
    log("Copie du draft...");
    try {
      const res = await fetch(`/api/chat-ai/drafts/${draftResult.draft.id}/copy`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.text) {
        await navigator.clipboard.writeText(data.text);
        setCopyMsg("Texte copié dans le presse-papier !");
        log("Texte copié au presse-papier");
      } else {
        setCopyMsg(data.error || "Erreur");
        log("Copie échouée: " + (data.error || "inconnu"));
      }
      loadAuditLogs();
    } catch (e) {
      setError(String(e));
      log("ERREUR: " + String(e));
    } finally {
      setLoading(false);
    }
  };

  const fan = selectedConv?.chat_ai_fans;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
            WTF CHATEENG, Vertical Slice Test
          </h1>
          <p style={{ fontSize: 11, color: "rgba(245,240,235,0.4)", marginTop: 2 }}>
            Test réel: Supabase → DeepSeek → Compliance → Audit
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={loadConversations} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", border: "1px solid rgba(245,240,235,0.1)", borderRadius: 6, background: "rgba(245,240,235,0.05)", color: "rgba(245,240,235,0.6)", cursor: "pointer", fontSize: 11 }}>
            <RefreshCw size={12} /> Rafraîchir
          </button>
          <button
            onClick={async () => {
              setSmokeRunning(true);
              log("Smoke test démarré...");
              const testFan = convs.find(c => c.chat_ai_fans?.status !== "do_not_contact");
              if (testFan) {
                setSelectedConv(testFan);
                await new Promise(r => setTimeout(r, 300));
                await generateDraft();
              }
              setSmokeRunning(false);
              log("Smoke test terminé");
            }}
            disabled={smokeRunning}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", border: "1px solid rgba(96,165,250,0.2)", borderRadius: 6, background: "rgba(96,165,250,0.1)", color: "#60a5fa", cursor: smokeRunning ? "not-allowed" : "pointer", fontSize: 11, fontWeight: 600 }}
          >
            {smokeRunning ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
            Run Smoke Test
          </button>
        </div>
      </div>

      {/* Status Dashboard */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8, marginBottom: 16 }}>
        <StatusBadge icon={<Database size={12} />} label="Supabase" value={supabaseStatus === "connected" ? "Connecté" : supabaseStatus === "checking" ? "Vérification..." : "Erreur"} color={supabaseStatus === "connected" ? "#34d399" : supabaseStatus === "checking" ? "#f59e0b" : "#ef4444"} />
        <StatusBadge icon={<User size={12} />} label="Fans chargés" value={`${convs.length} convs`} color={convs.length > 0 ? "#34d399" : "#f59e0b"} />
        <StatusBadge icon={<MessageSquare size={12} />} label="Module" value={draftResult?.demoMode === false ? "DeepSeek Live" : "Demo Mode"} color={draftResult?.demoMode === false ? "#34d399" : "#f59e0b"} />
        <StatusBadge icon={<ClipboardCheck size={12} />} label="Consent" value={draftResult?.allowed === false && draftResult?.reasons?.some(r => r.includes("Checklist")) ? "INCOMPLET" : "Validé"} color={draftResult?.allowed === false && draftResult?.reasons?.some(r => r.includes("Checklist")) ? "#ef4444" : "#34d399"} />
        <StatusBadge icon={draftResult?.allowed === false && draftResult?.reasons?.some(r => r.includes("pause")) ? <ToggleLeft size={12} /> : <ToggleRight size={12} />} label="Pause" value={draftResult?.allowed === false && draftResult?.reasons?.some(r => r.includes("pause")) ? "Activée" : "Active"} color={draftResult?.allowed === false && draftResult?.reasons?.some(r => r.includes("pause")) ? "#ef4444" : "#34d399"} />
      </div>

      {/* Error */}
      {error && (
        <div style={{ ...card, border: "1px solid rgba(239,68,68,0.3)", marginBottom: 16, background: "rgba(239,68,68,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#f87171", fontSize: 12 }}>
            <AlertTriangle size={14} /> {error}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr 280px", gap: 16 }}>
        {/* LEFT: Conversations */}
        <div style={card}>
          <h2 style={{ fontSize: 12, fontWeight: 600, color: "rgba(245,240,235,0.6)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <MessageSquare size={13} /> Conversations
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 500, overflow: "auto" }}>
            {convs.map((c) => {
              const f = c.chat_ai_fans;
              return (
                <button
                  key={c.id}
                  onClick={() => { setSelectedConv(c); setDraftResult(null); setApproveMsg(""); setCopyMsg(""); }}
                  style={{
                    textAlign: "left", padding: "8px 10px", borderRadius: 6, cursor: "pointer",
                    border: selectedConv?.id === c.id ? "1px solid rgba(96,165,250,0.3)" : "1px solid transparent",
                    background: selectedConv?.id === c.id ? "rgba(96,165,250,0.08)" : "rgba(245,240,235,0.02)",
                    color: "var(--text-primary)", fontSize: 11,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 600 }}>{f?.pseudonym || "Inconnu"}</span>
                    {f && <span style={badge(statusColors[f.status] || "#9ca3af")}>{f.status}</span>}
                  </div>
                  <div style={{ color: "rgba(245,240,235,0.3)", fontSize: 10, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {c.last_message_preview || "Aucun message"}
                  </div>
                </button>
              );
            })}
            {convs.length === 0 && (
              <div style={{ color: "rgba(245,240,235,0.2)", fontSize: 11, textAlign: "center", padding: 20 }}>
                Aucune conversation (seed data requis)
              </div>
            )}
          </div>
        </div>

        {/* CENTER: Draft flow */}
        <div style={card}>
          <h2 style={{ fontSize: 12, fontWeight: 600, color: "rgba(245,240,235,0.6)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <Zap size={13} /> Test Draft IA
          </h2>

          {!selectedConv ? (
            <div style={{ color: "rgba(245,240,235,0.2)", fontSize: 11, textAlign: "center", padding: 40 }}>
              Sélectionne une conversation à gauche
            </div>
          ) : (
            <>
              {/* Fan Brain Compact */}
              {fan && (
                <div style={{ ...card, marginBottom: 12, border: "1px solid rgba(245,240,235,0.05)" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(245,240,235,0.4)", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                    <User size={10} /> Fan Brain, {fan.pseudonym}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 12px", fontSize: 10 }}>
                    <span style={{ color: "rgba(245,240,235,0.3)" }}>Statut:</span>
                    <span style={badge(statusColors[fan.status] || "#9ca3af")}>{fan.status}</span>
                    <span style={{ color: "rgba(245,240,235,0.3)" }}>LTV:</span>
                    <span style={{ color: "rgba(245,240,235,0.7)" }}>{fan.ltv}€</span>
                    <span style={{ color: "rgba(245,240,235,0.3)" }}>Intention:</span>
                    <span style={{ color: "rgba(245,240,235,0.7)" }}>{fan.intent_score}/100</span>
                    <span style={{ color: "rgba(245,240,235,0.3)" }}>Churn:</span>
                    <span style={{ color: fan.churn_risk > 70 ? "#f87171" : "rgba(245,240,235,0.7)" }}>{fan.churn_risk}/100</span>
                    <span style={{ color: "rgba(245,240,235,0.3)" }}>Relationnel:</span>
                    <span style={{ color: "rgba(245,240,235,0.7)" }}>{fan.relationship_score}/100</span>
                    {fan.risk_flags?.length > 0 && (
                      <>
                        <span style={{ color: "rgba(245,240,235,0.3)" }}>Risques:</span>
                        <span style={{ color: "#f87171" }}>{fan.risk_flags.join(", ")}</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Objective input */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 10, color: "rgba(245,240,235,0.4)", display: "block", marginBottom: 4 }}>
                  Objectif du message
                </label>
                <input
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  style={{
                    width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid rgba(245,240,235,0.1)",
                    background: "rgba(245,240,235,0.04)", color: "var(--text-primary)", fontSize: 12, boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Generate button */}
              <button
                onClick={generateDraft}
                disabled={loading}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  width: "100%", padding: "10px", borderRadius: 6, border: "none",
                  background: loading ? "rgba(245,240,235,0.05)" : "rgba(96,165,250,0.15)",
                  color: loading ? "rgba(245,240,235,0.3)" : "#60a5fa",
                  cursor: loading ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 600,
                }}
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                {loading ? "Génération..." : "Générer un brouillon IA"}
              </button>

              {/* Draft result */}
              {draftResult && (
                <div style={{ marginTop: 16 }}>
                  {!draftResult.allowed ? (
                    <div style={{ ...card, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                        <Shield size={14} color="#f87171" />
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#f87171" }}>BLOQUÉ, Conformité</span>
                      </div>
                      {(draftResult.reasons || []).map((r, i) => (
                        <div key={i} style={{ fontSize: 10, color: "rgba(245,240,235,0.5)", marginBottom: 2 }}>• {r}</div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {/* Draft text */}
                      <div style={{ ...card, border: "1px solid rgba(52,211,153,0.2)", background: "rgba(52,211,153,0.05)" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <FileText size={13} color="#34d399" />
                            <span style={{ fontSize: 11, fontWeight: 600, color: "#34d399" }}>Brouillon généré</span>
                          </div>
                          <div style={{ display: "flex", gap: 4 }}>
                            <span style={badge(riskColors[draftResult.riskLevel || "low"])}>{draftResult.riskLevel}</span>
                            <span style={badge("#60a5fa")}>{draftResult.model || "demo"}</span>
                            {draftResult.demoMode && <span style={badge("#f59e0b")}>DEMO</span>}
                          </div>
                        </div>
                        <div style={{
                          fontSize: 12, color: "rgba(245,240,235,0.8)", lineHeight: 1.6,
                          padding: "8px 10px", background: "rgba(0,0,0,0.2)", borderRadius: 6, marginBottom: 8,
                        }}>
                          {draftResult.draft?.text}
                        </div>
                        <div style={{ fontSize: 10, color: "rgba(245,240,235,0.35)", marginBottom: 4 }}>
                          {draftResult.explanation}
                        </div>
                        {(draftResult.complianceNotes || []).length > 0 && (
                          <div style={{ fontSize: 10, color: "rgba(245,240,235,0.3)" }}>
                            Compliance: {draftResult.complianceNotes?.join(" | ")}
                          </div>
                        )}
                        {draftResult.latencyMs ? (
                          <div style={{ fontSize: 10, color: "rgba(245,240,235,0.25)", marginTop: 4 }}>
                            <Clock size={10} style={{ display: "inline", marginRight: 4 }} />
                            {draftResult.latencyMs}ms · {draftResult.tokensUsed} tokens
                          </div>
                        ) : null}
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                        <button
                          onClick={approveDraft}
                          disabled={loading || draftResult.draft?.status === "approved"}
                          style={{
                            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                            padding: "8px", borderRadius: 6, border: "none",
                            background: draftResult.draft?.status === "approved" ? "rgba(52,211,153,0.1)" : "rgba(52,211,153,0.15)",
                            color: draftResult.draft?.status === "approved" ? "rgba(52,211,153,0.5)" : "#34d399",
                            cursor: draftResult.draft?.status === "approved" ? "default" : "pointer",
                            fontSize: 11, fontWeight: 600,
                          }}
                        >
                          <Check size={12} /> Approuver
                        </button>
                        <button
                          onClick={copyDraft}
                          disabled={loading || draftResult.draft?.status === "blocked"}
                          style={{
                            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                            padding: "8px", borderRadius: 6, border: "none",
                            background: "rgba(96,165,250,0.15)", color: "#60a5fa",
                            cursor: "pointer", fontSize: 11, fontWeight: 600,
                          }}
                        >
                          <Copy size={12} /> Copier
                        </button>
                      </div>

                      {/* Messages */}
                      {approveMsg && (
                        <div style={{ marginTop: 8, fontSize: 11, color: "#34d399", display: "flex", alignItems: "center", gap: 4 }}>
                          <Check size={12} /> {approveMsg}
                        </div>
                      )}
                      {copyMsg && (
                        <div style={{ marginTop: 8, fontSize: 11, color: "#60a5fa", display: "flex", alignItems: "center", gap: 4 }}>
                          <Check size={12} /> {copyMsg}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* RIGHT: Audit + Status */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Audit logs */}
          <div style={card}>
            <h2 style={{ fontSize: 12, fontWeight: 600, color: "rgba(245,240,235,0.6)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <Activity size={13} /> Audit Logs
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 260, overflow: "auto" }}>
              {auditLogs.map((log) => (
                <div key={log.id} style={{ fontSize: 10, padding: "4px 6px", borderRadius: 4, background: "rgba(245,240,235,0.02)" }}>
                  <div style={{ color: "rgba(245,240,235,0.5)" }}>
                    <span style={{ color: "rgba(245,240,235,0.7)", fontWeight: 600 }}>{log.action}</span>
                    {" "}{log.target_type && <span style={{ color: "rgba(245,240,235,0.3)" }}>→ {log.target_type}</span>}
                  </div>
                  <div style={{ color: "rgba(245,240,235,0.2)", fontSize: 9 }}>
                    {new Date(log.created_at).toLocaleTimeString()}
                    {log.metadata?.model ? ` · ${log.metadata.model}` : ""}
                  </div>
                </div>
              ))}
              {auditLogs.length === 0 && (
                <div style={{ color: "rgba(245,240,235,0.15)", fontSize: 10, textAlign: "center", padding: 10 }}>
                  Aucun log
                </div>
              )}
            </div>
          </div>

          {/* Status log */}
          <div style={card}>
            <h2 style={{ fontSize: 12, fontWeight: 600, color: "rgba(245,240,235,0.6)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <Clock size={13} /> Status
            </h2>
            <div style={{
              fontFamily: "monospace", fontSize: 9, color: "rgba(245,240,235,0.3)",
              maxHeight: 260, overflow: "auto", lineHeight: 1.8,
            }}>
              {statusLog.map((msg, i) => (
                <div key={i}>{msg}</div>
              ))}
              {statusLog.length === 0 && (
                <div style={{ color: "rgba(245,240,235,0.15)" }}>En attente d'actions...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Status Badge component ───────────────────────────────
function StatusBadge({ icon, label, value, color }: {
  icon: React.ReactNode; label: string; value: string; color: string;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "8px 12px", borderRadius: 6,
      border: `1px solid ${color}20`, background: `${color}08`,
    }}>
      <span style={{ color, display: "flex" }}>{icon}</span>
      <div>
        <div style={{ fontSize: 9, color: "rgba(245,240,235,0.35)", textTransform: "uppercase" }}>{label}</div>
        <div style={{ fontSize: 11, fontWeight: 600, color }}>{value}</div>
      </div>
    </div>
  );
}
