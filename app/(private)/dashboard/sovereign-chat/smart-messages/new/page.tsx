"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Check, Send, Users, Settings, FileText, Play, Zap,
} from "lucide-react";

interface Segment {
  id: string;
  name: string;
  description: string | null;
  type: string;
  member_count: number;
  rules: any[];
}

const PLATFORMS = [
  { id: "onlyfans", label: "OnlyFans", note: "Copier-coller (pas d'API)" },
  { id: "mym", label: "MYM", note: "Copier-coller (pas d'API)" },
  { id: "fansly", label: "Fansly", note: "Copier-coller (pas d'API)" },
  { id: "instagram", label: "Instagram DM", note: "Meta API" },
  { id: "email", label: "Email", note: "SMTP" },
  { id: "sms", label: "SMS", note: "API SMS" },
];

const TONES = [
  { id: "chaleureuse", label: "Chaleureuse", desc: "Empathique et proche" },
  { id: "joueuse", label: "Joueuse", desc: "Légère et amusante" },
  { id: "mysterieuse", label: "Mystérieuse", desc: "Curieuse et intrigante" },
  { id: "directe", label: "Directe", desc: "Claire et professionnelle" },
];

const GOALS = [
  { id: "reengagement", label: "Réengagement", desc: "Fans inactifs" },
  { id: "upsell", label: "Upsell", desc: "Vente incitative" },
  { id: "announcement", label: "Annonce", desc: "Nouveau contenu" },
  { id: "thanks", label: "Remerciement", desc: "Fidélisation" },
  { id: "wishes", label: "Vœux", desc: "Anniversaire/événement" },
  { id: "engagement", label: "Engagement", desc: "Interaction générale" },
];

const VARIABLES = [
  { id: "last_purchase", label: "Mention du dernier achat" },
  { id: "days_since_interaction", label: "Temps écoulé depuis dernière interaction" },
  { id: "fan_tier_ref", label: "Référence au tier du fan" },
  { id: "custom_field", label: "Référence à un goût spécifique" },
];

export default function NewSmartMessageCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loadingSegments, setLoadingSegments] = useState(true);

  // Step 1
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);

  // Step 2
  const [platform, setPlatform] = useState("");
  const [tone, setTone] = useState("");
  const [goal, setGoal] = useState("");
  const [variables, setVariables] = useState<string[]>([]);
  const [brief, setBrief] = useState("");

  // Step 3 (sample)
  const [sampleDrafts, setSampleDrafts] = useState<any[]>([]);
  const [generatingSample, setGeneratingSample] = useState(false);

  // Step 4 (generation)
  const [generating, setGenerating] = useState(false);
  const [campaignId, setCampaignId] = useState<string | null>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/sovereign-chat/segments")
      .then((r) => r.json())
      .then((d) => setSegments(d.segments || []))
      .catch(() => {})
      .finally(() => setLoadingSegments(false));
  }, []);

  // Step 1: Select segment with member count override
  const effectiveCount = selectedSegment ? selectedSegment.member_count : 0;

  const canProceedStep1 = !!selectedSegment;
  const canProceedStep2 = platform && tone && goal;

  const handleNext = () => {
    if (step === 0 && !canProceedStep1) return;
    if (step === 1 && !canProceedStep2) return;
    if (step === 2) {
      // Generate 3 sample drafts
      generateSampleDrafts();
      return;
    }
    if (step === 3) {
      launchCampaign();
      return;
    }
    setStep((s) => Math.min(s + 1, 4));
  };

  const handleBack = () => {
    if (step === 2) { setStep(1); return; }
    if (step === 3 && sampleDrafts.length > 0) { setStep(2); return; }
    setStep((s) => Math.max(s - 1, 0));
  };

  const toggleVariable = (id: string) => {
    setVariables((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  };

  const generateSampleDrafts = async () => {
    setGeneratingSample(true);
    setError("");
    try {
      const res = await fetch("/api/sovereign-chat/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          intent: "engagement",
          fan_id: selectedSegment?.id, // Will pick random fans from segment
          context: { brief, tone, goal, variables },
          count: 3,
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSampleDrafts(data.drafts || []);
      setStep(3);
    } catch {
      setError("Erreur lors de la génération de l'échantillon");
    } finally {
      setGeneratingSample(false);
    }
  };

  const launchCampaign = async () => {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/sovereign-chat/smart-messages/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          segmentId: selectedSegment!.id,
          platform,
          tone,
          goal,
          brief: brief || null,
          variables,
          campaignName: `Campagne ${selectedSegment!.name} - ${new Date().toLocaleDateString("fr-FR")}`,
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCampaignId(data.campaign_id);
      setStep(4);
    } catch {
      setError("Erreur lors du lancement de la campagne");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/sovereign-chat/smart-messages" className="transition-all hover:opacity-70">
          <ArrowLeft size={14} style={{ color: "rgba(245,240,235,0.3)" }} />
        </Link>
        <div>
          <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Nouvelle campagne Smart Messages
          </h1>
          <p className="text-[10px]" style={{ color: "rgba(245,240,235,0.3)" }}>
            Étape {step + 1}/5
          </p>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex gap-1">
        {[
          { icon: Users, label: "Segment" },
          { icon: Settings, label: "Config" },
          { icon: FileText, label: "Test" },
          { icon: Zap, label: "Génération" },
          { icon: Send, label: "Validation" },
        ].map((s, i) => (
          <div key={i} className="flex-1 text-center">
            <div
              className={`mx-auto w-6 h-6 flex items-center justify-center mb-1 transition-all ${
                i < step ? "bg-opacity-100" : i === step ? "" : "opacity-30"
              }`}
              style={{
                backgroundColor: i <= step ? "rgba(199,91,57,0.15)" : "rgba(245,240,235,0.04)",
                color: i <= step ? "var(--accent)" : "rgba(245,240,235,0.15)",
              }}
            >
              <s.icon size={12} />
            </div>
            <p className="text-[7px]" style={{ color: i <= step ? "rgba(245,240,235,0.3)" : "rgba(245,240,235,0.1)" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Step 1: Segment selection */}
      {step === 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
            Sélectionne un segment de fans
          </h3>
          {loadingSegments ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 animate-pulse" style={{ backgroundColor: "rgba(245,240,235,0.03)" }} />
              ))}
            </div>
          ) : segments.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-xs" style={{ color: "rgba(245,240,235,0.3)" }}>
                Crée d'abord un segment dans Smart Segments
              </p>
              <Link
                href="/dashboard/sovereign-chat/segments/new"
                className="inline-block mt-2 text-[10px] font-medium py-2 px-3"
                style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
              >
                Créer un segment
              </Link>
            </div>
          ) : (
            <div className="space-y-1.5">
              {segments.map((seg) => (
                <button
                  key={seg.id}
                  onClick={() => setSelectedSegment(seg)}
                  className="w-full flex items-center justify-between p-3 text-left transition-all"
                  style={{
                    backgroundColor: selectedSegment?.id === seg.id
                      ? "rgba(199,91,57,0.08)"
                      : "rgba(245,240,235,0.02)",
                    border: selectedSegment?.id === seg.id
                      ? "1px solid rgba(199,91,57,0.2)"
                      : "1px solid rgba(245,240,235,0.04)",
                  }}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium" style={{ color: selectedSegment?.id === seg.id ? "var(--text-primary)" : "rgba(245,240,235,0.6)" }}>
                        {seg.name}
                      </span>
                      <span className="text-[8px] px-1 py-0.5" style={{
                        backgroundColor: seg.type === "smart" ? "rgba(122,154,101,0.1)" : "rgba(199,91,57,0.1)",
                        color: seg.type === "smart" ? "var(--success)" : "var(--accent)",
                      }}>
                        {seg.type}
                      </span>
                    </div>
                    {seg.description && (
                      <p className="text-[9px] mt-0.5 truncate" style={{ color: "rgba(245,240,235,0.2)" }}>
                        {seg.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{seg.member_count}</p>
                    <p className="text-[8px]" style={{ color: "rgba(245,240,235,0.2)" }}>membres</p>
                  </div>
                </button>
              ))}
            </div>
          )}
          {selectedSegment && (
            <div className="p-3 text-[10px]" style={{ backgroundColor: "rgba(199,91,57,0.04)", border: "1px solid rgba(199,91,57,0.1)" }}>
              <p style={{ color: "rgba(245,240,235,0.5)" }}>
                Cette campagne créera{" "}
                <strong style={{ color: "var(--accent)" }}>{effectiveCount} drafts personnalisés</strong>
                {" "}· Coût estimé : ~{effectiveCount} crédits IA
              </p>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Configuration */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
            Configure ta campagne
          </h3>

          {/* Platform */}
          <div>
            <p className="text-[9px] uppercase tracking-wider mb-1.5" style={{ color: "rgba(245,240,235,0.3)" }}>Plateforme</p>
            <div className="grid grid-cols-3 gap-1.5">
              {PLATFORMS.map((p) => (
                <button key={p.id} onClick={() => setPlatform(p.id)}
                  className="p-2 text-left transition-all"
                  style={{
                    backgroundColor: platform === p.id ? "rgba(199,91,57,0.08)" : "rgba(245,240,235,0.03)",
                    border: platform === p.id ? "1px solid rgba(199,91,57,0.2)" : "1px solid rgba(245,240,235,0.06)",
                  }}
                >
                  <p className="text-[10px] font-medium" style={{ color: platform === p.id ? "var(--text-primary)" : "rgba(245,240,235,0.5)" }}>{p.label}</p>
                  <p className="text-[7px] mt-0.5" style={{ color: "rgba(245,240,235,0.15)" }}>{p.note}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div>
            <p className="text-[9px] uppercase tracking-wider mb-1.5" style={{ color: "rgba(245,240,235,0.3)" }}>Tonalité</p>
            <div className="grid grid-cols-4 gap-1.5">
              {TONES.map((t) => (
                <button key={t.id} onClick={() => setTone(t.id)}
                  className="p-2 text-left transition-all"
                  style={{
                    backgroundColor: tone === t.id ? "rgba(199,91,57,0.08)" : "rgba(245,240,235,0.03)",
                    border: tone === t.id ? "1px solid rgba(199,91,57,0.2)" : "1px solid rgba(245,240,235,0.06)",
                  }}
                >
                  <p className="text-[10px] font-medium" style={{ color: tone === t.id ? "var(--text-primary)" : "rgba(245,240,235,0.5)" }}>{t.label}</p>
                  <p className="text-[7px] mt-0.5" style={{ color: "rgba(245,240,235,0.15)" }}>{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Goal */}
          <div>
            <p className="text-[9px] uppercase tracking-wider mb-1.5" style={{ color: "rgba(245,240,235,0.3)" }}>Objectif</p>
            <div className="grid grid-cols-3 gap-1.5">
              {GOALS.map((g) => (
                <button key={g.id} onClick={() => setGoal(g.id)}
                  className="p-2 text-left transition-all"
                  style={{
                    backgroundColor: goal === g.id ? "rgba(199,91,57,0.08)" : "rgba(245,240,235,0.03)",
                    border: goal === g.id ? "1px solid rgba(199,91,57,0.2)" : "1px solid rgba(245,240,235,0.06)",
                  }}
                >
                  <p className="text-[10px] font-medium" style={{ color: goal === g.id ? "var(--text-primary)" : "rgba(245,240,235,0.5)" }}>{g.label}</p>
                  <p className="text-[7px] mt-0.5" style={{ color: "rgba(245,240,235,0.15)" }}>{g.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Variables */}
          <div>
            <p className="text-[9px] uppercase tracking-wider mb-1.5" style={{ color: "rgba(245,240,235,0.3)" }}>Personnalisation</p>
            <div className="space-y-1">
              {VARIABLES.map((v) => (
                <label key={v.id} className="flex items-center gap-2 cursor-pointer p-1">
                  <input
                    type="checkbox"
                    checked={variables.includes(v.id)}
                    onChange={() => toggleVariable(v.id)}
                    className="accent-[var(--accent)]"
                  />
                  <span className="text-[10px]" style={{ color: variables.includes(v.id) ? "var(--text-primary)" : "rgba(245,240,235,0.3)" }}>
                    {v.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Brief */}
          <div>
            <p className="text-[9px] uppercase tracking-wider mb-1.5" style={{ color: "rgba(245,240,235,0.3)" }}>Brief libre</p>
            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="Décris ce que tu veux dire en quelques phrases..."
              rows={3}
              className="w-full p-2.5 text-xs mt-1 bg-transparent transition-all resize-none"
              style={{ color: "var(--text-primary)", border: "1px solid rgba(245,240,235,0.1)" }}
            />
          </div>
        </div>
      )}

      {/* Step 3: Generating sample (transient) / Step 4: Sample review */}
      {step === 2 && (
        <div className="space-y-4 text-center py-8">
          {generatingSample ? (
            <>
              <div className="animate-spin w-8 h-8 mx-auto" style={{ border: "2px solid rgba(199,91,57,0.2)", borderTopColor: "var(--accent)", borderRadius: "50%" }} />
              <p className="text-xs" style={{ color: "rgba(245,240,235,0.5)" }}>Génération de l'échantillon test...</p>
            </>
          ) : (
            <div>
              <p className="text-xs" style={{ color: "rgba(245,240,235,0.3)" }}>
                Prêt à générer l'échantillon de test
              </p>
              <p className="text-[10px] mt-1" style={{ color: "rgba(245,240,235,0.2)" }}>
                3 drafts seront générés pour 3 fans aléatoires du segment
              </p>
            </div>
          )}
        </div>
      )}

      {/* Step 3 (after generation): Sample review */}
      {step === 3 && sampleDrafts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
            Échantillon test, Vérifie la direction
          </h3>
          <div className="space-y-2">
            {sampleDrafts.map((draft: any, i: number) => (
              <div key={i} className="p-3" style={{ backgroundColor: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)" }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9px] font-medium px-1.5 py-0.5" style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "var(--accent)" }}>
                    {draft.approach || "Draft"}
                  </span>
                  <span className="text-[8px]" style={{ color: "rgba(245,240,235,0.2)" }}>
                    Engagement estimé : {draft.estimated_engagement}%
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(245,240,235,0.7)" }}>
                  {draft.text}
                </p>
                {draft.warnings?.length > 0 && (
                  <p className="text-[9px] mt-1" style={{ color: "var(--accent)" }}>
                    ⚠ {draft.warnings.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Full generation progress */}
      {step === 3 && sampleDrafts.length === 0 && (
        <div className="text-center py-8">
          {generating ? (
            <>
              <div className="animate-spin w-8 h-8 mx-auto mb-3" style={{ border: "2px solid rgba(199,91,57,0.2)", borderTopColor: "var(--accent)", borderRadius: "50%" }} />
              <p className="text-xs" style={{ color: "rgba(245,240,235,0.5)" }}>
                Génération de {effectiveCount} drafts en arrière-plan...
              </p>
              <p className="text-[10px] mt-1" style={{ color: "rgba(245,240,235,0.2)" }}>
                Tu peux fermer cette page et revenir plus tard
              </p>
            </>
          ) : campaignId ? null : null}
        </div>
      )}

      {/* Step 5: Confirm done */}
      {step === 4 && campaignId && (
        <div className="space-y-4 text-center py-8">
          <div className="w-12 h-12 mx-auto flex items-center justify-center" style={{ backgroundColor: "rgba(122,154,101,0.1)" }}>
            <Check size={20} style={{ color: "var(--success)" }} />
          </div>
          <div>
            <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>Campagne lancée !</h3>
            <p className="text-xs mt-1" style={{ color: "rgba(245,240,235,0.4)" }}>
              {effectiveCount} drafts sont en cours de génération en arrière-plan
            </p>
          </div>
          <p className="text-[10px]" style={{ color: "rgba(245,240,235,0.2)" }}>
            Tu recevras une notification quand les drafts seront prêts à valider
          </p>
          <div className="flex gap-2 justify-center pt-2">
            <Link
              href="/dashboard/sovereign-chat/smart-messages"
              className="text-[10px] font-medium py-2 px-4"
              style={{ backgroundColor: "rgba(245,240,235,0.04)", color: "rgba(245,240,235,0.3)", border: "1px solid rgba(245,240,235,0.06)" }}
            >
              Retour aux campagnes
            </Link>
            <Link
              href={`/dashboard/sovereign-chat/smart-messages/${campaignId}/validate`}
              className="text-[10px] font-semibold py-2 px-4"
              style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
            >
              Voir la progression
              <ArrowRight size={10} className="inline ml-1" />
            </Link>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-[10px] p-2" style={{ backgroundColor: "rgba(196,69,54,0.08)", color: "var(--danger)" }}>
          {error}
        </div>
      )}

      {/* Navigation buttons (excl. final step) */}
      {step < 4 && (
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleBack}
            className="text-[10px] font-medium py-2 px-3 transition-all hover:opacity-70 flex items-center gap-1"
            style={{ color: "rgba(245,240,235,0.3)" }}
          >
            <ArrowLeft size={10} />
            {step === 0 ? "Annuler" : "Retour"}
          </button>
          {step !== 2 && ( // Step 2 auto-advances with sample generation
            <button
              onClick={handleNext}
              disabled={
                (step === 0 && !canProceedStep1) ||
                (step === 1 && !canProceedStep2) ||
                generating
              }
              className="text-[10px] font-semibold py-2 px-4 transition-all flex items-center gap-1 disabled:opacity-30"
              style={{
                backgroundColor: canProceedStep1 || step > 0 ? "var(--accent)" : "rgba(245,240,235,0.06)",
                color: canProceedStep1 || step > 0 ? "var(--text-primary)" : "rgba(245,240,235,0.2)",
              }}
            >
              {step === 0 ? "Configurer" : step === 1 ? "Tester" : step === 3 ? "Lancer la campagne" : "Suivant"}
              <ArrowRight size={10} />
            </button>
          )}
          {step === 2 && !generatingSample && (
            <button
              onClick={generateSampleDrafts}
              className="text-[10px] font-semibold py-2 px-4 transition-all"
              style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
            >
              Générer l'échantillon
              <ArrowRight size={10} className="inline ml-1" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
