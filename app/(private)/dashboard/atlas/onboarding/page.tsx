"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Globe, Users, Upload, Shield, Zap, CheckCircle,
  ChevronLeft, ChevronRight, SkipForward, ArrowRight,
  Sparkles, Mail, MessageCircle, Smartphone, FileText,
  Video, Music2, Image, Camera,
} from "lucide-react";

const STEPS = [
  { id: "welcome", icon: Sparkles, label: "Bienvenue" },
  { id: "platforms", icon: Globe, label: "Plateformes" },
  { id: "import", icon: Upload, label: "Import" },
  { id: "consents", icon: Shield, label: "Consents" },
  { id: "funnel", icon: Zap, label: "Funnel" },
  { id: "compliance", icon: CheckCircle, label: "Compliance" },
];

const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: Camera, color: "#E4405F" },
  { id: "tiktok", label: "TikTok", icon: Music2, color: "#00F2EA" },
  { id: "youtube", label: "YouTube", icon: Video, color: "#FF0000" },
  { id: "onlyfans", label: "OnlyFans (manuel)", icon: Globe, color: "#00AFF0" },
];

const IMPORT_OPTIONS = [
  { id: "csv", label: "Fichier CSV", desc: "Importer depuis un fichier", icon: FileText },
  { id: "stripe", label: "Sync Stripe", desc: "Importer les fans Stripe", icon: Zap },
  { id: "mailchimp", label: "Mailchimp", desc: "Depuis Mailchimp", icon: Mail },
  { id: "convertkit", label: "ConvertKit", desc: "Depuis ConvertKit", icon: MessageCircle },
];

const FUNNEL_TEMPLATES = [
  { id: "welcome-email", label: "Séquence Email", desc: "3 emails de bienvenue automatiques" },
  { id: "welcome-sms", label: "Séquence SMS", desc: "2 SMS de bienvenue" },
  { id: "welcome-push", label: "Push Notification", desc: "Notification push de bienvenue" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [connected, setConnected] = useState<string[]>([]);
  const [imported, setImported] = useState<string[]>([]);
  const [emailDomain, setEmailDomain] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [creatorName, setCreatorName] = useState("");
  const [funnelStyle, setFunnelStyle] = useState<"formal" | "casual">("casual");
  const [selectedFunnel, setSelectedFunnel] = useState("welcome-email");
  const [welcomeOffer, setWelcomeOffer] = useState("");
  const [complianceComplete, setComplianceComplete] = useState(false);

  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  const canContinue = () => {
    switch (step) {
      case 0: return true;
      case 1: return true; // optional
      case 2: return true; // optional
      case 3: return true; // optional
      case 4: return selectedFunnel !== "" && creatorName.trim() !== "";
      case 5: return true;
      default: return true;
    }
  };

  const handleNext = () => {
    if (isLast) {
      setComplianceComplete(true);
      router.push("/dashboard/atlas?onboarded=true");
    } else {
      setStep((s) => s + 1);
    }
  };

  const togglePlatform = (id: string) => {
    setConnected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const toggleImport = (id: string) => {
    setImported((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  return (
    <div className="max-w-3xl mx-auto py-8 animate-fade-in">
      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-10">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-1 flex-1">
            <div
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium transition-all"
              style={{
                backgroundColor: i <= step ? "rgba(199,91,57,0.12)" : "transparent",
                color: i <= step ? "#C75B39" : "rgba(245,240,235,0.15)",
                border: i === step ? "1px solid rgba(199,91,57,0.3)" : "1px solid transparent",
              }}
            >
              <s.icon size={12} />
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px" style={{ backgroundColor: i < step ? "#C75B39" : "rgba(245,240,235,0.06)" }} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="min-h-[400px]">
        {step === 0 && <StepWelcome />}
        {step === 1 && <StepPlatforms connected={connected} onToggle={togglePlatform} />}
        {step === 2 && <StepImport imported={imported} onToggle={toggleImport} />}
        {step === 3 && (
          <StepConsents
            emailDomain={emailDomain}
            onEmailDomain={setEmailDomain}
            phoneNumber={phoneNumber}
            onPhoneNumber={setPhoneNumber}
            privacyAccepted={privacyAccepted}
            onPrivacyAccepted={setPrivacyAccepted}
          />
        )}
        {step === 4 && (
          <StepFunnel
            creatorName={creatorName}
            onCreatorName={setCreatorName}
            funnelStyle={funnelStyle}
            onFunnelStyle={setFunnelStyle}
            selectedFunnel={selectedFunnel}
            onSelectFunnel={setSelectedFunnel}
            welcomeOffer={welcomeOffer}
            onWelcomeOffer={setWelcomeOffer}
          />
        )}
        {step === 5 && <StepCompliance complete={complianceComplete} />}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
        <div>
          {!isFirst ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1.5 text-sm px-4 py-2 transition-opacity hover:opacity-70"
              style={{ color: "rgba(245,240,235,0.4)" }}
            >
              <ChevronLeft size={14} /> Retour
            </button>
          ) : (
            <button
              onClick={() => router.push("/dashboard/atlas")}
              className="flex items-center gap-1.5 text-sm px-4 py-2 transition-opacity hover:opacity-70"
              style={{ color: "rgba(245,240,235,0.4)" }}
            >
              <SkipForward size={14} /> Skip tout
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (isLast) router.push("/dashboard/atlas?onboarded=true");
              else setStep((s) => s + 1);
            }}
            className="text-sm px-3 py-2 transition-opacity hover:opacity-70"
            style={{ color: "rgba(245,240,235,0.3)" }}
          >
            Passer
          </button>
          <button
            onClick={handleNext}
            disabled={!canContinue()}
            className="flex items-center gap-1.5 text-sm font-medium px-5 py-2.5 transition-all disabled:opacity-30"
            style={{
              backgroundColor: "#C75B39",
              color: "#F5F0EB",
              opacity: canContinue() ? 1 : 0.3,
            }}
          >
            {isLast ? "Terminer" : "Continuer"}
            {!isLast && <ChevronRight size={14} />}
            {isLast && <CheckCircle size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── STEP 1: Welcome ──────────────────────────────────────────────

function StepWelcome() {
  return (
    <div className="flex flex-col items-center text-center py-8 animate-fade-in">
      <div className="w-20 h-20 flex items-center justify-center mb-6" style={{ backgroundColor: "rgba(199,91,57,0.1)" }}>
        <Sparkles size={36} style={{ color: "#C75B39" }} />
      </div>
      <h1 className="text-2xl font-semibold mb-3" style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}>
        Bienvenue dans Atlas
      </h1>
      <p className="text-sm max-w-lg mb-6" style={{ color: "rgba(245,240,235,0.5)" }}>
        Atlas est votre allié pour automatiser à 100% ce qui est légal dans votre relation fan.
        CRM intelligent, campagnes multi-canaux, funnels automatisés, modération IA —
        tout est conçu pour vous faire gagner du temps sans risquer votre compte.
      </p>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mt-4">
        {[
          { icon: Users, title: "CRM Intelligent", desc: "Segmentez, scorez et fidélisez chaque fan automatiquement" },
          { icon: Zap, title: "Automatisations", desc: "Règles, funnels, webhooks — tout s'automatise" },
          { icon: Shield, title: "100% Conforme", desc: "RGPD, anti-spam, taux limites — zéro ban garanti" },
        ].map((f) => (
          <div key={f.title} className="p-4 text-center" style={{ border: "1px solid rgba(245,240,235,0.06)", backgroundColor: "#2A2420" }}>
            <f.icon size={20} style={{ color: "#C75B39" }} className="mb-2" />
            <h3 className="text-sm font-medium mb-1" style={{ color: "#F5F0EB" }}>{f.title}</h3>
            <p className="text-[11px]" style={{ color: "rgba(245,240,235,0.35)" }}>{f.desc}</p>
          </div>
        ))}
      </div>

      <p className="text-xs mt-8" style={{ color: "rgba(245,240,235,0.2)" }}>
        Configuration rapide — environ 15 minutes
      </p>
    </div>
  );
}

// ─── STEP 2: Platforms ────────────────────────────────────────────

function StepPlatforms({ connected, onToggle }: { connected: string[]; onToggle: (id: string) => void }) {
  return (
    <div className="py-4 animate-fade-in">
      <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}>
        Connecter vos plateformes
      </h2>
      <p className="text-sm mb-6" style={{ color: "rgba(245,240,235,0.4)" }}>
        Liez vos comptes pour qu&apos;Atlas puisse interagir avec vos fans partout.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PLATFORMS.map((p) => {
          const isConnected = connected.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => onToggle(p.id)}
              className="flex items-center gap-4 p-4 text-left transition-all"
              style={{
                backgroundColor: isConnected ? "rgba(199,91,57,0.08)" : "#2A2420",
                border: `1px solid ${isConnected ? "rgba(199,91,57,0.3)" : "rgba(245,240,235,0.06)"}`,
              }}
            >
              <div className="w-10 h-10 flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                <p.icon size={20} style={{ color: p.color }} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium" style={{ color: "#F5F0EB" }}>{p.label}</div>
                <div className="text-[10px] mt-0.5" style={{ color: isConnected ? "#7A9A65" : "rgba(245,240,235,0.25)" }}>
                  {isConnected ? "Connecté" : "Cliquer pour connecter"}
                </div>
              </div>
              <div
                className="w-5 h-5 flex items-center justify-center text-[10px] font-medium"
                style={{
                  backgroundColor: isConnected ? "#7A9A65" : "rgba(245,240,235,0.06)",
                  color: isConnected ? "#F5F0EB" : "transparent",
                }}
              >
                {isConnected ? "✓" : ""}
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs mt-4" style={{ color: "rgba(245,240,235,0.2)" }}>
        Vous pourrez configurer les plateformes plus tard depuis Paramètres &gt; Plateformes connectées.
      </p>
    </div>
  );
}

// ─── STEP 3: Import ───────────────────────────────────────────────

function StepImport({ imported, onToggle }: { imported: string[]; onToggle: (id: string) => void }) {
  return (
    <div className="py-4 animate-fade-in">
      <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}>
        Importer vos contacts
      </h2>
      <p className="text-sm mb-6" style={{ color: "rgba(245,240,235,0.4)" }}>
        Importez vos fans existants depuis d&apos;autres outils ou fichiers.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {IMPORT_OPTIONS.map((opt) => {
          const isImported = imported.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => onToggle(opt.id)}
              className="flex items-center gap-3 p-4 text-left transition-all"
              style={{
                backgroundColor: isImported ? "rgba(199,91,57,0.08)" : "#2A2420",
                border: `1px solid ${isImported ? "rgba(199,91,57,0.3)" : "rgba(245,240,235,0.06)"}`,
              }}
            >
              <div className="w-10 h-10 flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(199,91,57,0.1)" }}>
                <opt.icon size={18} style={{ color: "#C75B39" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium" style={{ color: "#F5F0EB" }}>{opt.label}</div>
                <div className="text-[10px] mt-0.5 truncate" style={{ color: "rgba(245,240,235,0.35)" }}>{opt.desc}</div>
              </div>
              <div
                className="w-5 h-5 flex items-center justify-center text-[10px] font-medium shrink-0"
                style={{
                  backgroundColor: isImported ? "#7A9A65" : "rgba(245,240,235,0.06)",
                  color: isImported ? "#F5F0EB" : "transparent",
                }}
              >
                {isImported ? "✓" : ""}
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs mt-4" style={{ color: "rgba(245,240,235,0.2)" }}>
        Vous pourrez importer plus tard depuis Paramètres Atlas.
      </p>
    </div>
  );
}

// ─── STEP 4: Consents ─────────────────────────────────────────────

function StepConsents({
  emailDomain, onEmailDomain, phoneNumber, onPhoneNumber, privacyAccepted, onPrivacyAccepted,
}: {
  emailDomain: string; onEmailDomain: (v: string) => void;
  phoneNumber: string; onPhoneNumber: (v: string) => void;
  privacyAccepted: boolean; onPrivacyAccepted: (v: boolean) => void;
}) {
  return (
    <div className="py-4 animate-fade-in">
      <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}>
        Configurer les consents
      </h2>
      <p className="text-sm mb-6" style={{ color: "rgba(245,240,235,0.4)" }}>
        Paramètres légaux pour vos campagnes. Vous pourrez les modifier à tout moment.
      </p>

      <div className="space-y-4">
        {/* Email domain */}
        <div className="p-4" style={{ border: "1px solid rgba(245,240,235,0.06)", backgroundColor: "#2A2420" }}>
          <label className="block text-xs font-medium mb-1" style={{ color: "rgba(245,240,235,0.5)" }}>
            Domaine email (DKIM/SPF)
          </label>
          <input
            type="text"
            value={emailDomain}
            onChange={(e) => onEmailDomain(e.target.value)}
            placeholder="ex: votredomaine.com"
            className="w-full px-3 py-2 text-sm bg-transparent border"
            style={{ borderColor: "rgba(245,240,235,0.1)", color: "#F5F0EB" }}
          />
          <p className="text-[10px] mt-1" style={{ color: "rgba(245,240,235,0.2)" }}>
            Nécessaire pour l&apos;envoi d&apos;emails. DKIM/SPF à configurer dans votre DNS.
          </p>
        </div>

        {/* Phone number */}
        <div className="p-4" style={{ border: "1px solid rgba(245,240,235,0.06)", backgroundColor: "#2A2420" }}>
          <label className="block text-xs font-medium mb-1" style={{ color: "rgba(245,240,235,0.5)" }}>
            Numéro SMS (Twilio)
          </label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => onPhoneNumber(e.target.value)}
            placeholder="ex: +33612345678"
            className="w-full px-3 py-2 text-sm bg-transparent border"
            style={{ borderColor: "rgba(245,240,235,0.1)", color: "#F5F0EB" }}
          />
        </div>

        {/* Privacy policy */}
        <div className="p-4" style={{ border: "1px solid rgba(245,240,235,0.06)", backgroundColor: "#2A2420" }}>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(e) => onPrivacyAccepted(e.target.checked)}
              className="mt-0.5"
            />
            <div>
              <span className="text-sm font-medium" style={{ color: "#F5F0EB" }}>
                Générer une politique de confidentialité
              </span>
              <p className="text-[10px] mt-0.5" style={{ color: "rgba(245,240,235,0.2)" }}>
                Atlas générera une politique RGPD adaptée à votre activité. Vous pourrez la personnaliser.
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

// ─── STEP 5: Funnel Welcome ───────────────────────────────────────

function StepFunnel({
  creatorName, onCreatorName, funnelStyle, onFunnelStyle, selectedFunnel, onSelectFunnel, welcomeOffer, onWelcomeOffer,
}: {
  creatorName: string; onCreatorName: (v: string) => void;
  funnelStyle: "formal" | "casual"; onFunnelStyle: (v: "formal" | "casual") => void;
  selectedFunnel: string; onSelectFunnel: (v: string) => void;
  welcomeOffer: string; onWelcomeOffer: (v: string) => void;
}) {
  return (
    <div className="py-4 animate-fade-in">
      <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}>
        Premier funnel &quot;Welcome&quot;
      </h2>
      <p className="text-sm mb-6" style={{ color: "rgba(245,240,235,0.4)" }}>
        Activez un tunnel de bienvenue automatique pour accueillir vos nouveaux fans.
      </p>

      <div className="space-y-4">
        {/* Creator name */}
        <div className="p-4" style={{ border: "1px solid rgba(245,240,235,0.06)", backgroundColor: "#2A2420" }}>
          <label className="block text-xs font-medium mb-1" style={{ color: "rgba(245,240,235,0.5)" }}>
            Nom du créateur
          </label>
          <input
            type="text"
            value={creatorName}
            onChange={(e) => onCreatorName(e.target.value)}
            placeholder="Votre nom / pseudo"
            className="w-full px-3 py-2 text-sm bg-transparent border"
            style={{ borderColor: "rgba(245,240,235,0.1)", color: "#F5F0EB" }}
          />
        </div>

        {/* Tone style */}
        <div className="p-4" style={{ border: "1px solid rgba(245,240,235,0.06)", backgroundColor: "#2A2420" }}>
          <label className="block text-xs font-medium mb-2" style={{ color: "rgba(245,240,235,0.5)" }}>
            Style de communication
          </label>
          <div className="flex gap-2">
            {(["formal", "casual"] as const).map((style) => (
              <button
                key={style}
                onClick={() => onFunnelStyle(style)}
                className="flex-1 py-2 text-sm font-medium transition-all"
                style={{
                  backgroundColor: funnelStyle === style ? "rgba(199,91,57,0.12)" : "rgba(245,240,235,0.04)",
                  color: funnelStyle === style ? "#C75B39" : "rgba(245,240,235,0.3)",
                  border: `1px solid ${funnelStyle === style ? "rgba(199,91,57,0.3)" : "transparent"}`,
                }}
              >
                {style === "formal" ? "Formel" : "Décontracté"}
              </button>
            ))}
          </div>
        </div>

        {/* Funnel template */}
        <div className="space-y-2">
          <label className="block text-xs font-medium" style={{ color: "rgba(245,240,235,0.5)" }}>
            Template de bienvenue
          </label>
          {FUNNEL_TEMPLATES.map((ft) => (
            <button
              key={ft.id}
              onClick={() => onSelectFunnel(ft.id)}
              className="flex items-center gap-3 w-full p-3 text-left transition-all"
              style={{
                backgroundColor: selectedFunnel === ft.id ? "rgba(199,91,57,0.08)" : "#2A2420",
                border: `1px solid ${selectedFunnel === ft.id ? "rgba(199,91,57,0.3)" : "rgba(245,240,235,0.06)"}`,
              }}
            >
              <div
                className="w-5 h-5 flex items-center justify-center text-[10px] font-medium shrink-0"
                style={{
                  backgroundColor: selectedFunnel === ft.id ? "#C75B39" : "rgba(245,240,235,0.06)",
                  color: selectedFunnel === ft.id ? "#F5F0EB" : "transparent",
                }}
              >
                {selectedFunnel === ft.id ? "✓" : ""}
              </div>
              <div>
                <div className="text-sm font-medium" style={{ color: "#F5F0EB" }}>{ft.label}</div>
                <div className="text-[10px]" style={{ color: "rgba(245,240,235,0.35)" }}>{ft.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Welcome offer (optional) */}
        <div className="p-4" style={{ border: "1px solid rgba(245,240,235,0.06)", backgroundColor: "#2A2420" }}>
          <label className="block text-xs font-medium mb-1" style={{ color: "rgba(245,240,235,0.5)" }}>
            Offre de bienvenue (optionnel)
          </label>
          <input
            type="text"
            value={welcomeOffer}
            onChange={(e) => onWelcomeOffer(e.target.value)}
            placeholder="ex: -10% sur ton premier abonnement"
            className="w-full px-3 py-2 text-sm bg-transparent border"
            style={{ borderColor: "rgba(245,240,235,0.1)", color: "#F5F0EB" }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── STEP 6: Compliance ───────────────────────────────────────────

function StepCompliance({ complete }: { complete: boolean }) {
  const checks = [
    { label: "Politique de confidentialité", status: "ok", detail: "Générée" },
    { label: "Consentement email", status: "ok", detail: "Configuré" },
    { label: "Anti-spam (loi CAN-SPAM)", status: "ok", detail: "Actif" },
    { label: "Rate limiting (RGPD)", status: "ok", detail: "Actif" },
    { label: "Lien de désabonnement", status: "ok", detail: "Ajouté aux campagnes" },
    { label: "RGPD — Délégation de traitement", status: "warn", detail: "Contrat type à signer" },
    { label: "DKIM/SPF vérifié", status: "warn", detail: "En attente de confirmation DNS" },
    { label: "Protection des données (DPA)", status: "pending", detail: "DPA à générer" },
  ];

  const score = Math.round((checks.filter((c) => c.status === "ok").length / checks.length) * 10);

  return (
    <div className="py-4 animate-fade-in">
      <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}>
        Vérification compliance
      </h2>
      <p className="text-sm mb-6" style={{ color: "rgba(245,240,235,0.4)" }}>
        Atlas vérifie que votre configuration respecte les réglementations en vigueur.
      </p>

      {/* Score */}
      <div className="flex items-center gap-4 p-5 mb-6" style={{ backgroundColor: "#2A2420", border: "1px solid rgba(199,91,57,0.1)" }}>
        <div
          className="w-16 h-16 flex items-center justify-center text-2xl font-bold shrink-0"
          style={{
            fontFamily: "var(--font-display)",
            backgroundColor: score >= 8 ? "rgba(122,154,101,0.1)" : "rgba(199,91,57,0.1)",
            color: score >= 8 ? "#7A9A65" : "#C75B39",
          }}
        >
          {score}/10
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: "#F5F0EB" }}>
            {score >= 9 ? "Excellent !" : score >= 7 ? "Bien, quelques améliorations possibles" : "Améliorations nécessaires"}
          </p>
          {score < 10 && (
            <p className="text-[11px] mt-1" style={{ color: "rgba(245,240,235,0.35)" }}>
              {checks.filter((c) => c.status !== "ok").length} point{checks.filter((c) => c.status !== "ok").length > 1 ? "s" : ""} à améliorer
            </p>
          )}
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-1">
        {checks.map((c) => (
          <div
            key={c.label}
            className="flex items-center justify-between px-4 py-2.5 text-sm"
            style={{ borderBottom: "1px solid rgba(245,240,235,0.04)" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  backgroundColor:
                    c.status === "ok" ? "#7A9A65" :
                    c.status === "warn" ? "#C75B39" :
                    "rgba(245,240,235,0.1)",
                }}
              />
              <span style={{ color: c.status === "ok" ? "#F5F0EB" : "rgba(245,240,235,0.5)" }}>
                {c.label}
              </span>
            </div>
            <span
              className="text-[10px] font-medium"
              style={{ color: c.status === "ok" ? "#7A9A65" : "rgba(245,240,235,0.2)" }}
            >
              {c.detail}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs mt-6" style={{ color: "rgba(245,240,235,0.2)" }}>
        Vous pouvez améliorer votre score à tout moment depuis le Centre de Conformité.
      </p>
    </div>
  );
}
