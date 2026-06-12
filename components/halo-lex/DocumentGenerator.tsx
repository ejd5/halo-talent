"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Loader2, FileText, Download, Copy, Send, ChevronLeft, AlertTriangle, Check } from "lucide-react";

interface DocumentContext {
  problemType?: string;
  problemDescription?: string;
  objectives?: string[];
  creatorName?: string;
  username?: string;
  agencyName?: string;
}

interface DocumentHistoryItem {
  id: string;
  letter_type: string;
  platform: string;
  created_at: string;
}

const DOCUMENT_TYPES = [
  { id: "appeal_suspension", label: "Appel suspension/bannissement", icon: FileText, category: "plateforme" },
  { id: "mise_en_demeure", label: "Mise en demeure", icon: AlertTriangle, category: "agence" },
  { id: "reclamation", label: "Réclamation (CNIL, DSA, plainte)", icon: FileText, category: "plateforme" },
  { id: "contrat", label: "Contrat/Clause", icon: FileText, category: "contractuel" },
  { id: "fiscal", label: "Document fiscal", icon: FileText, category: "fiscal" },
];

const PLATFORMS = ["onlyfans", "fansly", "mym", "instagram", "tiktok", "youtube", "twitter", "twitch", "autre"];

const TONES = [
  { id: "ferme_courtois", label: "Ferme mais courtois" },
  { id: "firme_juridique", label: "Ferme et juridique" },
  { id: "conciliant", label: "Conciliant" },
  { id: "tres_ferme", label: "Très ferme (dernier recours)" },
];

const ESCALATION_LEVELS = [
  { id: 1, label: "N1 — Simple demande" },
  { id: 2, label: "N2 — Demande formelle" },
  { id: 3, label: "N3 — Mise en demeure" },
  { id: 4, label: "N4 — Pré-contentieux" },
];

interface DocumentGeneratorProps {
  locale?: string;
  questionnaireId?: string;
  context?: DocumentContext;
  onClose?: () => void;
}

export function DocumentGenerator({ locale = "fr", questionnaireId, context = {}, onClose }: DocumentGeneratorProps) {
  const [documentType, setDocumentType] = useState("");
  const [platform, setPlatform] = useState("");
  const [tone, setTone] = useState("ferme_courtois");
  const [escalationLevel, setEscalationLevel] = useState(2);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [letterId, setLetterId] = useState<string | null>(null);
  const [history, setHistory] = useState<DocumentHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Charger l'historique au montage
  useEffect(() => {
    // L'historique est chargé depuis les lettres générées de la session
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("lex_documents");
      if (stored) {
        try { setHistory(JSON.parse(stored)); } catch {}
      }
    }
  }, []);

  const generate = useCallback(async () => {
    if (!documentType || !platform) return;

    setLoading(true);
    try {
      const res = await fetch("/api/lex/generate-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentType,
          platform,
          context,
          questionnaireId,
          tone,
          escalationLevel,
          language: locale === "en" ? "en" : "fr",
        }),
      });

      if (!res.ok) throw new Error("Generation failed");

      const data = await res.json();
      setContent(data.content);
      setLetterId(data.id);

      // Ajouter à l'historique local
      const entry: DocumentHistoryItem = {
        id: data.id,
        letter_type: documentType,
        platform,
        created_at: new Date().toISOString(),
      };
      const updated = [entry, ...history].slice(0, 20);
      setHistory(updated);
      sessionStorage.setItem("lex_documents", JSON.stringify(updated));
    } catch (err) {
      console.error("Document generation error:", err);
      setContent("Erreur lors de la génération du document. Veuillez réessayer.");
    }
    setLoading(false);
  }, [documentType, platform, tone, escalationLevel, context, questionnaireId, locale, history]);

  // Régénération automatique au changement de paramètres (debounced)
  useEffect(() => {
    if (!documentType || !platform || !content) return;
    const timer = setTimeout(() => generate(), 800);
    return () => clearTimeout(timer);
  }, [tone, escalationLevel]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatContent = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");
  };

  const selectedDocType = DOCUMENT_TYPES.find((d) => d.id === documentType);

  // Vue historique
  if (showHistory) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
            {locale === "en" ? "My documents" : "Mes documents"}
          </h2>
          <button
            onClick={() => setShowHistory(false)}
            className="px-3 py-1.5 text-sm"
            style={{ color: "var(--accent)" }}
          >
            {locale === "en" ? "New document" : "Nouveau document"}
          </button>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {locale === "en"
                ? "No documents yet."
                : "Aucun document pour le moment."}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((doc) => (
              <div
                key={doc.id}
                className="p-3 cursor-pointer hover:opacity-80 transition-opacity"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
                onClick={() => {
                  setDocumentType(doc.letter_type);
                  setPlatform(doc.platform);
                  setShowHistory(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <FileText size={14} style={{ color: "var(--text-secondary)" }} />
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {DOCUMENT_TYPES.find((d) => d.id === doc.letter_type)?.label || doc.letter_type}
                  </span>
                  <span className="text-xs px-1.5 py-0.5" style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}>
                    {doc.platform}
                  </span>
                </div>
                <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                  {new Date(doc.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Vue résultat
  if (content) {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid var(--border-default)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => { setContent(""); setLetterId(null); }} className="flex items-center gap-1 text-sm" style={{ color: "var(--text-secondary)" }}>
              <ChevronLeft size={16} />
              {locale === "en" ? "Back" : "Retour"}
            </button>
            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {selectedDocType?.label}
            </span>
            <span className="text-xs px-1.5 py-0.5" style={{ background: "rgba(212,162,76,0.1)", color: "#D4A24C" }}>
              {platform}
            </span>
          </div>
          <div className="flex gap-2">
            {/* Historique */}
            {history.length > 0 && (
              <button
                onClick={() => setShowHistory(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                {history.length} doc{history.length > 1 ? "s" : ""}
              </button>
            )}
            {/* Copier */}
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors"
              style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}
            >
              {copied ? <Check size={14} style={{ color: "rgb(34,197,94)" }} /> : <Copy size={14} />}
              {copied ? (locale === "en" ? "Copied!" : "Copié!") : (locale === "en" ? "Copy" : "Copier")}
            </button>
            {/* Télécharger */}
            <button
              onClick={() => {
                const blob = new Blob([content], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `lettre-${documentType}-${platform}.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors"
              style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}
            >
              <Download size={14} />
              TXT
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1 overflow-y-auto p-6">
          <div
            ref={previewRef}
            className="max-w-3xl mx-auto p-8 text-sm leading-relaxed whitespace-pre-wrap"
            style={{
              background: "white",
              color: "#1a1a1a",
              fontFamily: "'Georgia', 'Times New Roman', serif",
              minHeight: "500px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
            dangerouslySetInnerHTML={{ __html: formatContent(content) }}
          />
        </div>

        {/* Footer avec disclaimer */}
        <div className="p-4 text-xs text-center" style={{ borderTop: "1px solid var(--border-default)", color: "var(--text-secondary)" }}>
          <AlertTriangle size={12} className="inline mr-1" />
          {locale === "en"
            ? "This document was generated by AI. We recommend having a lawyer review it before sending."
            : "Ce document a été généré par IA. Nous recommandons une validation par un avocat avant envoi."}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Panneau gauche (30%) — Personnalisation */}
      <div className="w-[30%] shrink-0 p-4 overflow-y-auto space-y-4" style={{ borderRight: "1px solid var(--border-default)" }}>
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {locale === "en" ? "Document settings" : "Configuration"}
        </h3>

        {/* Type de document */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
            {locale === "en" ? "Document type" : "Type de document"}
          </label>
          <div className="space-y-1">
            {DOCUMENT_TYPES.map((dt) => (
              <button
                key={dt.id}
                onClick={() => { setDocumentType(dt.id); setContent(""); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors"
                style={{
                  background: documentType === dt.id ? "rgba(199,91,57,0.12)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${documentType === dt.id ? "var(--accent)" : "var(--border-default)"}`,
                  color: documentType === dt.id ? "var(--accent)" : "var(--text-primary)",
                }}
              >
                <dt.icon size={14} />
                {dt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Plateforme */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
            {locale === "en" ? "Platform" : "Plateforme"}
          </label>
          <select
            value={platform}
            onChange={(e) => { setPlatform(e.target.value); setContent(""); }}
            className="w-full px-3 py-2 text-sm outline-none"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
          >
            <option value="">{locale === "en" ? "Select platform" : "Sélectionner"}</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Ton */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
            {locale === "en" ? "Tone" : "Ton"}
          </label>
          <div className="space-y-1">
            {TONES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTone(t.id)}
                className="w-full text-left px-3 py-1.5 text-xs transition-colors"
                style={{
                  background: tone === t.id ? "rgba(199,91,57,0.08)" : "transparent",
                  color: tone === t.id ? "var(--accent)" : "var(--text-primary)",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Niveau d'escalade */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
            {locale === "en" ? "Escalation level" : "Niveau d'escalade"}
          </label>
          <div className="space-y-1">
            {ESCALATION_LEVELS.map((el) => (
              <button
                key={el.id}
                onClick={() => setEscalationLevel(el.id)}
                className="w-full text-left px-3 py-1.5 text-xs transition-colors"
                style={{
                  background: escalationLevel === el.id ? "rgba(199,91,57,0.08)" : "transparent",
                  color: escalationLevel === el.id ? "var(--accent)" : "var(--text-primary)",
                }}
              >
                {el.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bouton générer */}
        <button
          onClick={generate}
          disabled={!documentType || !platform || loading}
          className="w-full py-2.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-40"
          style={{ background: "var(--accent)", color: "var(--text-primary)" }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              {locale === "en" ? "Generating..." : "Génération..."}
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <FileText size={14} />
              {locale === "en" ? "Generate document" : "Générer le document"}
            </span>
          )}
        </button>

        {/* Historique */}
        {history.length > 0 && (
          <button
            onClick={() => setShowHistory(true)}
            className="w-full py-2 text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            {locale === "en" ? `View ${history.length} previous document(s)` : `Voir ${history.length} document(s) précédent(s)`}
          </button>
        )}
      </div>

      {/* Panneau droit (70%) — Aperçu */}
      <div className="flex-1 flex items-center justify-center p-8">
        {!content && !loading && (
          <div className="text-center">
            <FileText size={48} style={{ color: "rgba(255,255,255,0.1)" }} />
            <p className="mt-4 text-sm" style={{ color: "var(--text-secondary)" }}>
              {locale === "en"
                ? "Configure your document on the left, then generate it."
                : "Configurez votre document à gauche, puis générez-le."}
            </p>
          </div>
        )}
        {loading && (
          <div className="text-center">
            <Loader2 size={32} className="animate-spin" style={{ color: "var(--accent)" }} />
            <p className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>
              {locale === "en" ? "Lex is writing your document..." : "Lex rédige votre document..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
