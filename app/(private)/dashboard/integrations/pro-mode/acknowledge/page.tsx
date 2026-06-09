"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, Shield, ArrowRight, ArrowLeft } from "lucide-react";

const CHECKBOXES = [
  {
    key: "external",
    label:
      "J'ai lu et compris que ces outils sont externes à la plateforme",
  },
  {
    key: "responsibility",
    label:
      "J'accepte que leur utilisation est sous ma responsabilité exclusive",
  },
  {
    key: "guarantee",
    label:
      "Je comprends que ma Zero Ban Guarantee ne couvre pas les incidents liés",
  },
  {
    key: "alternative",
    label:
      "Je préfère explorer Pro Mode malgré l'alternative Co-management légale proposée",
  },
];

export default function ProModeAcknowledgePage() {
  const router = useRouter();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const allChecked = CHECKBOXES.every((cb) => checked[cb.key]);
  const someChecked = Object.keys(checked).length > 0;

  const handleToggle = (key: string) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAccept = async () => {
    if (!allChecked) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/integrations/pro-mode/acknowledge", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Erreur");
      router.push("/dashboard/integrations/pro-mode");
    } catch {
      setError("Erreur lors de la validation. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-semibold mb-2"
            style={{
              fontFamily: "var(--font-display)",
              color: "#F5F0EB",
            }}
          >
            Zone Pro Mode
          </h1>
          <p
            className="text-sm tracking-wider uppercase"
            style={{ color: "#C75B39" }}
          >
            Avant d&apos;accéder à cette zone
          </p>
        </div>

        {/* Disclaimer block */}
        <div
          className="p-6 mb-8 border-l-4"
          style={{
            backgroundColor: "rgba(245,240,235,0.04)",
            borderColor: "#C75B39",
          }}
        >
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle
              size={18}
              className="shrink-0 mt-0.5"
              style={{ color: "#C75B39" }}
            />
            <div>
              <h2
                className="text-base font-semibold mb-2"
                style={{ color: "#C75B39" }}
              >
                Zone exploratoire
              </h2>
              <div className="space-y-3 text-xs leading-relaxed">
                <p style={{ color: "rgba(245,240,235,0.7)" }}>
                  Les outils présentés dans cette section sont des solutions
                  tierces que vous pouvez choisir d&apos;utiliser de manière{" "}
                  <strong style={{ color: "#F5F0EB" }}>
                    INDÉPENDANTE
                  </strong>{" "}
                  de notre plateforme.
                </p>
                <p style={{ color: "rgba(245,240,235,0.7)" }}>
                  Notre maison{" "}
                  <strong style={{ color: "#F5F0EB" }}>
                    NE LES INTÈGRE PAS
                  </strong>{" "}
                  techniquement et{" "}
                  <strong style={{ color: "#F5F0EB" }}>
                    NE GARANTIT PAS
                  </strong>{" "}
                  leur conformité avec les conditions d&apos;utilisation des
                  plateformes (Meta, TikTok, OnlyFans, MYM, etc.).
                </p>
                <p style={{ color: "rgba(245,240,235,0.7)" }}>
                  L&apos;utilisation de ces outils est sous{" "}
                  <strong style={{ color: "#F5F0EB" }}>
                    VOTRE RESPONSABILITÉ
                  </strong>{" "}
                  exclusive et peut entraîner la suspension ou la résiliation de
                  vos comptes sur les plateformes concernées.
                </p>
                <p style={{ color: "rgba(245,240,235,0.7)" }}>
                  Notre{" "}
                  <strong style={{ color: "#F5F0EB" }}>
                    Garantie Zero Ban
                  </strong>{" "}
                  <strong style={{ color: "#C44536" }}>NE COUVRE PAS</strong>{" "}
                  les incidents résultant de l&apos;utilisation de ces outils
                  tiers.
                </p>
                <div
                  className="p-3 mt-2 text-[10px]"
                  style={{
                    backgroundColor: "rgba(199,91,57,0.08)",
                    border: "1px solid rgba(199,91,57,0.15)",
                    color: "rgba(245,240,235,0.5)",
                  }}
                >
                  <strong style={{ color: "#C75B39" }}>Alternative légale :</strong>{" "}
                  Si vous souhaitez gérer plusieurs comptes de manière 100% conforme,
                  nous vous recommandons fortement d&apos;utiliser plutôt notre
                  fonctionnalité{" "}
                  <Link
                    href="/dashboard/integrations"
                    className="font-medium underline underline-offset-2"
                    style={{ color: "#C75B39" }}
                  >
                    Co-management officiel
                  </Link>
                  .
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3 mb-8">
          {CHECKBOXES.map((cb) => (
            <label
              key={cb.key}
              className="flex items-start gap-3 cursor-pointer group p-2 -mx-2 transition-colors"
              style={{
                backgroundColor: checked[cb.key]
                  ? "rgba(199,91,57,0.04)"
                  : "transparent",
              }}
            >
              <input
                type="checkbox"
                checked={!!checked[cb.key]}
                onChange={() => handleToggle(cb.key)}
                className="mt-0.5 accent-[#C75B39] shrink-0"
              />
              <span
                className="text-xs leading-relaxed"
                style={{
                  color: checked[cb.key]
                    ? "#F5F0EB"
                    : "rgba(245,240,235,0.5)",
                }}
              >
                {cb.label}
              </span>
            </label>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div
            className="text-xs px-3 py-2 mb-4"
            style={{
              backgroundColor: "rgba(196,69,54,0.08)",
              color: "#C44536",
              border: "1px solid rgba(196,69,54,0.15)",
            }}
          >
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleAccept}
            disabled={!allChecked || loading}
            className="w-full text-sm font-semibold py-3 transition-all flex items-center justify-center gap-2 disabled:opacity-30"
            style={{
              backgroundColor: allChecked ? "#C75B39" : "rgba(245,240,235,0.06)",
              color: allChecked ? "#F5F0EB" : "rgba(245,240,235,0.2)",
            }}
          >
            {loading ? (
              "Validation..."
            ) : (
              <>
                Accéder à Pro Mode
                <ArrowRight size={14} />
              </>
            )}
          </button>
          <Link
            href="/dashboard/integrations"
            className="w-full text-xs font-medium py-3 text-center transition-all flex items-center justify-center gap-2"
            style={{
              backgroundColor: "rgba(245,240,235,0.03)",
              color: "rgba(245,240,235,0.3)",
              border: "1px solid rgba(245,240,235,0.06)",
            }}
          >
            <ArrowLeft size={12} />
            Découvrir Co-management d&apos;abord
          </Link>
        </div>

        {/* Version badge */}
        <p
          className="text-[9px] text-center mt-8"
          style={{ color: "rgba(245,240,235,0.15)" }}
        >
          Version v1.0 — Dernière mise à jour : juin 2026
        </p>
      </div>
    </div>
  );
}
