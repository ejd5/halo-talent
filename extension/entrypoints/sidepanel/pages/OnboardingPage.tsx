// ─── Onboarding Page — Halo Companion ───────────

import { useState } from "react";
import { ChevronRight, ChevronLeft, Check, Shield, Smartphone, Zap, LogIn } from "lucide-react";
import { useCompanionStore } from "../stores/companion-store";
import type { PlatformType } from "@/src/types/platform";
import { PLATFORM_LABELS } from "@/src/types/platform";
import type { Route, RouteState } from "../router";

type NavigateFn = (to: Route | RouteState, params?: Record<string, string>) => void;

interface Props { navigate: NavigateFn }

const STEPS = [
  {
    id: "welcome",
    icon: Zap,
    title: "Bienvenue dans WTF Companion",
    description: "Votre assistant IA pour créateurs de contenu. L'extension qui vous aide à mieux connaître vos fans et à optimiser vos revenus.",
    bulletPoints: [
      "Lit les infos visibles sur vos plateformes",
      "Suggère des messages adaptés à chaque fan",
      "Ne fait RIEN automatiquement — vous gardez le contrôle",
    ],
  },
  {
    id: "connect",
    icon: LogIn,
    title: "Connectez votre compte WTF",
    description: "Liez votre compte WTF pour synchroniser vos fans, votre vault et vos scripts.",
  },
  {
    id: "platforms",
    icon: Smartphone,
    title: "Autorisez les plateformes",
    description: "Choisissez sur quelles plateformes l'extension peut lire les informations visibles.",
  },
  {
    id: "ready",
    icon: Check,
    title: "C'est prêt !",
    description: "WTF Companion est configuré. Ouvrez une plateforme supportée et le Companion s'activera automatiquement.",
  },
] as const;

const PLATFORMS: PlatformType[] = ["onlyfans", "fansly", "mym", "instagram", "tiktok"];

export function OnboardingPage({ navigate }: Props) {
  const [step, setStep] = useState(0);
  const { completeOnboarding, updateSettings } = useCompanionStore();
  const [platformToggles, setPlatformToggles] = useState<Record<PlatformType, boolean>>({
    onlyfans: true, fansly: true, mym: true, instagram: false, tiktok: false,
  });

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      updateSettings({ platforms: platformToggles });
      completeOnboarding();
      navigate("dashboard");
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleConnect = () => {
    chrome.tabs.create({ url: "http://localhost:3001/login?source=extension" });
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Progress */}
      <div className="shrink-0 px-4 pt-4 pb-2">
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full transition-colors"
              style={{ backgroundColor: i <= step ? "var(--accent)" : "var(--border-default)" }} />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 animate-float"
          style={{ backgroundColor: "var(--accent-soft)" }}>
          {step === 3 ? (
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--success)" }}>
              <Check size={20} strokeWidth={3} style={{ color: "#fff" }} />
            </div>
          ) : (
            <current.icon size={28} style={{ color: "var(--accent)" }} />
          )}
        </div>

        {/* Content */}
        <h1 className="text-base font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          {current.title}
        </h1>
        <p className="text-[12px] leading-relaxed mb-6 max-w-xs" style={{ color: "var(--text-secondary)" }}>
          {current.description}
        </p>

        {/* Step-specific content */}
        {step === 0 && (
          <div className="space-y-2 mb-4 w-full max-w-xs">
            {STEPS[0].bulletPoints.map((bp: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-left p-2.5 rounded-lg"
                style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
                <Check size={14} style={{ color: "var(--success)", marginTop: 1 }} />
                <span className="text-[11px]" style={{ color: "var(--text-primary)" }}>{bp}</span>
              </div>
            ))}
          </div>
        )}

        {step === 1 && (
          <button onClick={handleConnect}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold mb-4 transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--accent)", color: "#fff" }}>
            <LogIn size={16} />
            Se connecter à WTF
          </button>
        )}

        {step === 2 && (
          <div className="space-y-2 mb-4 w-full max-w-xs">
            {PLATFORMS.map((p) => (
              <div key={p} className="flex items-center justify-between p-2.5 rounded-lg"
                style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
                <span className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                  {PLATFORM_LABELS[p]}
                </span>
                <button onClick={() => setPlatformToggles((prev) => ({ ...prev, [p]: !prev[p] }))}
                  className="w-9 h-5 rounded-full relative transition-colors"
                  style={{ backgroundColor: platformToggles[p] ? "var(--success)" : "var(--border-strong)" }}>
                  <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm"
                    style={{ left: platformToggles[p] ? "calc(100% - 18px)" : "2px" }} />
                </button>
              </div>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="mb-4 w-full max-w-xs text-center">
            <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Vous pouvez modifier ces paramètres à tout moment dans les réglages de l'extension.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center gap-3">
          {step > 0 && step < 3 && (
            <button onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-[12px] font-medium transition-colors"
              style={{ color: "var(--text-secondary)", backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
              <ChevronLeft size={14} /> Précédent
            </button>
          )}
          <button onClick={handleNext}
            className="flex items-center gap-1 px-5 py-2.5 rounded-xl text-[12px] font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--accent)", color: "#fff" }}>
            {isLast ? "Ouvrir WTF Companion" : "Continuer"}
            {!isLast && <ChevronRight size={14} />}
          </button>
        </div>
      </div>

      {/* Disclaimer — always visible */}
      <div className="shrink-0 px-4 pb-4">
        <div className="rounded-xl p-3 flex items-start gap-2"
          style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-default)" }}>
          <Shield size={14} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
          <p className="text-[9px] leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
            WTF Companion lit les informations visibles sur les plateformes que vous utilisez, avec votre consentement.
            Aucune donnée n'est partagée avec des tiers. Aucune action n'est effectuée automatiquement.
            Vous gardez le contrôle total.
          </p>
        </div>
      </div>
    </div>
  );
}
