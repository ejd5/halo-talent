"use client";

import { useState, useEffect } from "react";
import {
  Bot, Zap, Clock, AlertTriangle,
  CheckCircle, RefreshCw, History, Shield,
} from "lucide-react";

interface VaultAsset {
  id: string;
  title: string;
  type: string;
  sensitivity: string;
  currentPrice: number;
  soldCount: number;
  created_at: string;
}

interface PPVRecommendation {
  id: string;
  vaultAssetId: string;
  vaultAssetTitle?: string | null;
  vaultAssetType?: string | null;
  targetFanIds: string[];
  recommendedPrice: number;
  minPrice: number;
  maxPrice: number;
  justification: string;
  fatigueRisk: string;
  alreadySoldTo: string[];
  conversionEstimate: string;
  status: string;
  createdAt: string;
  compliance?: { allowed: boolean; reasons: string[] };
  model?: string;
  demoMode?: boolean;
}

export default function PPVCopilotPage() {
  const [assets, setAssets] = useState<VaultAsset[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(true);

  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [targetFanIds, setTargetFanIds] = useState("");
  const [segmentId, setSegmentId] = useState("");

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentRec, setCurrentRec] = useState<PPVRecommendation | null>(null);

  const [history, setHistory] = useState<PPVRecommendation[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyFilter, setHistoryFilter] = useState("");

  // Load vault assets
  useEffect(() => {
    fetch("/api/chat-ai/vault-assets")
      .then((r) => r.json())
      .then((d) => { setAssets(d.assets || []); setLoadingAssets(false); })
      .catch(() => setLoadingAssets(false));
  }, []);

  // Load recommendation history
  async function refreshHistory() {
    setLoadingHistory(true);
    try {
      const r = await fetch("/api/chat-ai/ppv-recommendation?limit=30");
      const d = await r.json();
      setHistory(d.recommendations || []);
    } catch { /* empty */ }
    setLoadingHistory(false);
  }

  useEffect(() => {
    let cancelled = false;
    fetch("/api/chat-ai/ppv-recommendation?limit=30")
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setHistory(d.recommendations || []); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingHistory(false); });
    return () => { cancelled = true; };
  }, []);

  const handleGenerate = async () => {
    if (!selectedAssetId) {
      setError("Sélectionne un asset du vault.");
      return;
    }
    setGenerating(true);
    setError(null);
    setCurrentRec(null);

    try {
      const body: Record<string, unknown> = { vaultAssetId: selectedAssetId };
      const fanIds = targetFanIds.split(",").map((id) => id.trim()).filter(Boolean);
      if (fanIds.length > 0) body.targetFanIds = fanIds;
      if (segmentId.trim()) body.segmentId = segmentId.trim();

      const res = await fetch("/api/chat-ai/ppv-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.reasons?.join(", ") || "Recommandation impossible");
        return;
      }

      setCurrentRec(data.recommendation);
      refreshHistory();
    } catch {
      setError("Erreur réseau lors de la génération.");
    } finally {
      setGenerating(false);
    }
  };

  const selectedAsset = assets.find((a) => a.id === selectedAssetId);

  const filteredHistory = historyFilter
    ? history.filter((r) => r.status === historyFilter)
    : history;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bot size={16} style={{ color: "var(--accent)" }} />
            <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
              PPV Copilot
            </h1>
          </div>
          <p className="text-xs" style={{ color: "rgba(245,240,235,0.4)" }}>
            Recommandations IA de prix et stratégie PPV, basé sur ton vault, tes fans, et l'historique
          </p>
        </div>
      </div>

      {/* Main content: 2-col */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "start" }}>
        {/* Left: Configuration + Result */}
        <div style={{ flex: "1 1 400px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Configuration panel */}
          <div style={{
            padding: 16, borderRadius: 8, border: "1px solid rgba(245,240,235,0.05)",
            background: "rgba(245,240,235,0.01)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
              <Zap size={12} style={{ color: "rgba(245,240,235,0.3)" }} />
              <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(245,240,235,0.4)", textTransform: "uppercase" }}>
                Configuration
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Vault asset selector */}
              <div>
                <label style={{ fontSize: 10, color: "rgba(245,240,235,0.3)", display: "block", marginBottom: 4 }}>
                  Asset du vault *
                </label>
                {loadingAssets ? (
                  <div className="h-9 animate-pulse" style={{ background: "rgba(245,240,235,0.03)" }} />
                ) : (
                  <select
                    value={selectedAssetId}
                    onChange={(e) => setSelectedAssetId(e.target.value)}
                    style={{
                      width: "100%", padding: "8px 10px", fontSize: 11,
                      background: "transparent", color: "var(--text-primary)",
                      border: "1px solid rgba(245,240,235,0.1)", borderRadius: 4,
                    }}
                  >
                    <option value="">-- Choisir un contenu --</option>
                    {assets.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.title} ({a.type}), {a.currentPrice}€
                      </option>
                    ))}
                  </select>
                )}
                {selectedAsset && (
                  <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 10, color: "rgba(245,240,235,0.25)" }}>
                    <span>Type: {selectedAsset.type}</span>
                    <span>Sensibilité: {selectedAsset.sensitivity}</span>
                    <span>Vendu {selectedAsset.soldCount}x</span>
                  </div>
                )}
              </div>

              {/* Fan targets */}
              <div>
                <label style={{ fontSize: 10, color: "rgba(245,240,235,0.3)", display: "block", marginBottom: 4 }}>
                  Fan(s) cible (IDs, séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={targetFanIds}
                  onChange={(e) => setTargetFanIds(e.target.value)}
                  placeholder="ex: fan-uuid-1, fan-uuid-2"
                  style={{
                    width: "100%", padding: "8px 10px", fontSize: 11,
                    background: "transparent", color: "var(--text-primary)",
                    border: "1px solid rgba(245,240,235,0.1)", borderRadius: 4,
                  }}
                />
              </div>

              {/* Segment */}
              <div>
                <label style={{ fontSize: 10, color: "rgba(245,240,235,0.3)", display: "block", marginBottom: 4 }}>
                  Ou segment (optionnel)
                </label>
                <input
                  type="text"
                  value={segmentId}
                  onChange={(e) => setSegmentId(e.target.value)}
                  placeholder="ID du segment"
                  style={{
                    width: "100%", padding: "8px 10px", fontSize: 11,
                    background: "transparent", color: "var(--text-primary)",
                    border: "1px solid rgba(245,240,235,0.1)", borderRadius: 4,
                  }}
                />
              </div>

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={generating || !selectedAssetId}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "10px 16px", fontSize: 12, fontWeight: 600,
                  background: generating ? "rgba(245,240,235,0.04)" : "var(--accent)",
                  color: generating ? "rgba(245,240,235,0.3)" : "var(--text-primary)",
                  border: "none", borderRadius: 6, cursor: generating ? "not-allowed" : "pointer",
                  opacity: !selectedAssetId ? 0.4 : 1,
                }}
              >
                {generating ? (
                  <><RefreshCw size={12} className="animate-spin" /> Génération en cours...</>
                ) : (
                  <><Bot size={12} /> Générer la stratégie PPV</>
                )}
              </button>

              {error && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 6, padding: "8px 10px", background: "rgba(196,69,54,0.06)", borderRadius: 4, border: "1px solid rgba(196,69,54,0.1)" }}>
                  <AlertTriangle size={12} style={{ color: "var(--danger)", minWidth: 12, marginTop: 1 }} />
                  <p style={{ fontSize: 11, color: "var(--danger)", margin: 0 }}>{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Result */}
          {currentRec && (
            <div style={{
              padding: 16, borderRadius: 8, border: "1px solid rgba(245,240,235,0.06)",
              background: "rgba(245,240,235,0.02)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <CheckCircle size={12} style={{ color: "var(--success)" }} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(245,240,235,0.4)", textTransform: "uppercase" }}>
                    Recommandation IA
                  </span>
                </div>
                {currentRec.demoMode && (
                  <span style={{ fontSize: 9, padding: "2px 6px", background: "rgba(199,91,57,0.1)", color: "var(--accent)", borderRadius: 3 }}>
                    DEMO
                  </span>
                )}
              </div>

              {/* Price recommendation */}
              <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 100px", textAlign: "center", padding: "10px", background: "rgba(199,91,57,0.06)", borderRadius: 6, border: "1px solid rgba(199,91,57,0.1)" }}>
                  <p style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)", margin: 0 }}>
                    {currentRec.recommendedPrice}€
                  </p>
                  <p style={{ fontSize: 9, color: "rgba(245,240,235,0.25)", marginTop: 2 }}>Prix recommandé</p>
                </div>
                <div style={{ flex: "1 1 100px", textAlign: "center", padding: "10px", background: "rgba(245,240,235,0.02)", borderRadius: 6, border: "1px solid rgba(245,240,235,0.04)" }}>
                  <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
                    {currentRec.minPrice}€ – {currentRec.maxPrice}€
                  </p>
                  <p style={{ fontSize: 9, color: "rgba(245,240,235,0.25)", marginTop: 2 }}>Fourchette</p>
                </div>
                <div style={{ flex: "1 1 100px", textAlign: "center", padding: "10px", background: "rgba(245,240,235,0.02)", borderRadius: 6, border: "1px solid rgba(245,240,235,0.04)" }}>
                  <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
                    {currentRec.conversionEstimate}
                  </p>
                  <p style={{ fontSize: 9, color: "rgba(245,240,235,0.25)", marginTop: 2 }}>Conversion estimée</p>
                </div>
              </div>

              {/* Justification */}
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(245,240,235,0.3)", marginBottom: 4 }}>Justification</p>
                <p style={{ fontSize: 11, color: "rgba(245,240,235,0.6)", lineHeight: 1.5, margin: 0 }}>
                  {currentRec.justification}
                </p>
              </div>

              {/* Risk & warnings */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {currentRec.fatigueRisk && currentRec.fatigueRisk !== "low" && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, padding: "4px 8px", background: "rgba(199,91,57,0.06)", borderRadius: 4, color: "var(--accent)" }}>
                    <Clock size={10} /> Risque fatigue: {currentRec.fatigueRisk}
                  </div>
                )}
                {currentRec.alreadySoldTo && currentRec.alreadySoldTo.length > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, padding: "4px 8px", background: "rgba(196,69,54,0.06)", borderRadius: 4, color: "var(--danger)" }}>
                    <AlertTriangle size={10} /> Déjà vendu à {currentRec.alreadySoldTo.length} fan(s)
                  </div>
                )}
                {currentRec.compliance && !currentRec.compliance.allowed && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, padding: "4px 8px", background: "rgba(196,69,54,0.06)", borderRadius: 4, color: "var(--danger)" }}>
                    <Shield size={10} /> {currentRec.compliance.reasons?.[0] || "Non conforme"}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: History */}
        <div style={{ flex: "0 1 320px", minWidth: 250, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{
            padding: 16, borderRadius: 8, border: "1px solid rgba(245,240,235,0.05)",
            background: "rgba(245,240,235,0.01)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <History size={12} style={{ color: "rgba(245,240,235,0.3)" }} />
                <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(245,240,235,0.4)", textTransform: "uppercase" }}>
                  Historique
                </span>
              </div>
              <select
                value={historyFilter}
                onChange={(e) => setHistoryFilter(e.target.value)}
                style={{
                  fontSize: 9, padding: "2px 6px", background: "transparent",
                  color: "rgba(245,240,235,0.3)", border: "1px solid rgba(245,240,235,0.08)", borderRadius: 3,
                }}
              >
                <option value="">Tous</option>
                <option value="draft">Brouillons</option>
                <option value="proposed">Proposés</option>
                <option value="accepted">Acceptés</option>
                <option value="rejected">Rejetés</option>
              </select>
            </div>

            {loadingHistory ? (
              <div className="space-y-2">{[1, 2, 3].map((i) => (
                <div key={i} className="h-14 animate-pulse" style={{ background: "rgba(245,240,235,0.03)" }} />
              ))}</div>
            ) : filteredHistory.length === 0 ? (
              <p style={{ fontSize: 11, color: "rgba(245,240,235,0.15)", textAlign: "center", padding: 20 }}>
                Aucune recommandation
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {filteredHistory.map((rec) => {
                  const statusColors: Record<string, string> = {
                    draft: "rgba(245,240,235,0.2)",
                    proposed: "var(--accent)",
                    accepted: "var(--success)",
                    rejected: "var(--danger)",
                  };
                  return (
                    <div
                      key={rec.id}
                      style={{
                        padding: "8px 10px", borderRadius: 4,
                        background: "rgba(245,240,235,0.02)",
                        border: "1px solid rgba(245,240,235,0.04)",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          {rec.vaultAssetTitle && (
                            <div style={{ fontSize: 9, color: "rgba(245,240,235,0.2)", marginBottom: 1 }}>
                              {rec.vaultAssetTitle}
                            </div>
                          )}
                          <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-primary)" }}>
                            {rec.recommendedPrice}€
                          </span>
                        </div>
                        <span style={{
                          fontSize: 8, padding: "1px 5px", borderRadius: 3,
                          color: statusColors[rec.status] || "rgba(245,240,235,0.2)",
                          background: `${statusColors[rec.status] || "rgba(245,240,235,0.2)"}18`,
                        }}>
                          {rec.status}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 3, fontSize: 9, color: "rgba(245,240,235,0.2)" }}>
                        <span>{rec.targetFanIds?.length || 0} fan(s)</span>
                        <span>•</span>
                        <span>{rec.fatigueRisk || "low"} risk</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
