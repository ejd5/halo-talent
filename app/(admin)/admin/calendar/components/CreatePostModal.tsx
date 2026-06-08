"use client";

import { useState } from "react";
import { X, ChevronLeft, Send } from "lucide-react";
import { calendarEvents } from "../data";
import { PLATFORM_COLORS, CONTENT_TYPE_LABELS, CONTENT_TYPE_ICONS } from "../types";

const STEPS = ["Sélection", "Contenu", "Programmation", "Vérification"];

const PLATFORMS = ["YouTube", "Instagram", "TikTok", "OnlyFans", "Twitter", "LinkedIn"];
const CONTENT_TYPES = ["post", "story", "reel", "video", "live"] as const;
const CREATORS = [...new Set(calendarEvents.map((e) => e.creator_name))].sort();

export function CreatePostModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (event: {
    creator_name: string;
    platform: string;
    content_type: string;
    content_preview: string;
    caption: string;
    hashtags: string[];
    scheduled_at: string;
  }) => void;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    creator_name: "",
    platform: "",
    content_type: "",
    content_preview: "",
    caption: "",
    hashtags: "",
    scheduled_date: "",
    scheduled_time: "",
  });

  const canNext =
    (step === 0 && form.creator_name && form.platform && form.content_type) ||
    (step === 1 && form.content_preview) ||
    (step === 2 && form.scheduled_date && form.scheduled_time);

  const handleSubmit = () => {
    onCreated({
      creator_name: form.creator_name,
      platform: form.platform,
      content_type: form.content_type,
      content_preview: form.content_preview,
      caption: form.caption,
      hashtags: form.hashtags
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean),
      scheduled_at: `${form.scheduled_date}T${form.scheduled_time}:00Z`,
    });
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="w-[560px] border border-[var(--color-border)]"
          style={{ backgroundColor: "var(--color-base)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-3">
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="p-1 hover:bg-[var(--color-card)] transition-colors rounded-[0px]"
                >
                  <ChevronLeft size={16} />
                </button>
              )}
              <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                Nouveau post
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[var(--color-card)] transition-colors rounded-[0px]"
            >
              <X size={16} />
            </button>
          </div>

          {/* Steps indicator */}
          <div className="flex px-6 py-3 gap-1 border-b border-[var(--color-border)]">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className="flex items-center gap-1 text-[10px] font-medium"
              >
                <span
                  className={`w-5 h-5 flex items-center justify-center text-[9px] font-bold ${
                    i <= step
                      ? "bg-[var(--color-accent)] text-white"
                      : "border border-[var(--color-border)] opacity-30"
                  }`}
                >
                  {i + 1}
                </span>
                <span className={i <= step ? "opacity-70" : "opacity-20"}>{s}</span>
                {i < STEPS.length - 1 && <span className="opacity-10 mx-1">—</span>}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="px-6 py-5 min-h-[240px]">
            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider opacity-50 mb-1.5 block">
                    Créateur
                  </label>
                  <select
                    value={form.creator_name}
                    onChange={(e) => setForm({ ...form, creator_name: e.target.value })}
                    className="w-full p-2 text-sm border border-[var(--color-border)] bg-[var(--color-card)] rounded-[0px]"
                  >
                    <option value="">Sélectionner...</option>
                    {CREATORS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider opacity-50 mb-1.5 block">
                    Plateforme
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map((p) => (
                      <button
                        key={p}
                        onClick={() => setForm({ ...form, platform: p })}
                        className={`px-3 py-1.5 text-xs font-medium border transition-colors rounded-[0px] ${
                          form.platform === p
                            ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                            : "border-[var(--color-border)] hover:bg-[var(--color-card)]"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider opacity-50 mb-1.5 block">
                    Type de contenu
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CONTENT_TYPES.map((ct) => (
                      <button
                        key={ct}
                        onClick={() => setForm({ ...form, content_type: ct })}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border transition-colors rounded-[0px] ${
                          form.content_type === ct
                            ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                            : "border-[var(--color-border)] hover:bg-[var(--color-card)]"
                        }`}
                      >
                        <span>{CONTENT_TYPE_ICONS[ct]}</span>
                        {CONTENT_TYPE_LABELS[ct]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider opacity-50 mb-1.5 block">
                    Aperçu du contenu
                  </label>
                  <input
                    type="text"
                    value={form.content_preview}
                    onChange={(e) =>
                      setForm({ ...form, content_preview: e.target.value })
                    }
                    placeholder="Titre ou description courte..."
                    className="w-full p-2 text-sm border border-[var(--color-border)] bg-[var(--color-card)] rounded-[0px]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider opacity-50 mb-1.5 block">
                    Légende
                  </label>
                  <textarea
                    value={form.caption}
                    onChange={(e) => setForm({ ...form, caption: e.target.value })}
                    placeholder="Texte de publication..."
                    rows={3}
                    className="w-full p-2 text-sm border border-[var(--color-border)] bg-[var(--color-card)] rounded-[0px] resize-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider opacity-50 mb-1.5 block">
                    Hashtags (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    value={form.hashtags}
                    onChange={(e) => setForm({ ...form, hashtags: e.target.value })}
                    placeholder="#skincare, #beauté, #routine"
                    className="w-full p-2 text-sm border border-[var(--color-border)] bg-[var(--color-card)] rounded-[0px]"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider opacity-50 mb-1.5 block">
                    Date de publication
                  </label>
                  <input
                    type="date"
                    value={form.scheduled_date}
                    onChange={(e) =>
                      setForm({ ...form, scheduled_date: e.target.value })
                    }
                    className="w-full p-2 text-sm border border-[var(--color-border)] bg-[var(--color-card)] rounded-[0px]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider opacity-50 mb-1.5 block">
                    Heure
                  </label>
                  <input
                    type="time"
                    value={form.scheduled_time}
                    onChange={(e) =>
                      setForm({ ...form, scheduled_time: e.target.value })
                    }
                    className="w-full p-2 text-sm border border-[var(--color-border)] bg-[var(--color-card)] rounded-[0px]"
                  />
                </div>
                <p className="text-[11px] opacity-40 italic">
                  💡 Les meilleurs créneaux de publication varient selon la plateforme.
                  Consultez l&apos;onglet Insights pour des recommandations.
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <ReviewRow label="Créateur" value={form.creator_name} />
                <ReviewRow label="Plateforme" value={form.platform} />
                <ReviewRow
                  label="Type"
                  value={
                    CONTENT_TYPE_LABELS[form.content_type as keyof typeof CONTENT_TYPE_LABELS] ??
                    form.content_type
                  }
                />
                <ReviewRow label="Aperçu" value={form.content_preview} />
                {form.caption && <ReviewRow label="Légende" value={form.caption} />}
                {form.hashtags && <ReviewRow label="Hashtags" value={form.hashtags} />}
                <ReviewRow
                  label="Programmé le"
                  value={`${form.scheduled_date} à ${form.scheduled_time}`}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--color-border)]">
            <span className="text-[10px] opacity-30">Étape {step + 1}/{STEPS.length}</span>
            <div className="flex items-center gap-2">
              {step < STEPS.length - 1 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!canNext}
                  className="px-4 py-1.5 text-xs font-medium bg-[var(--color-accent)] text-white disabled:opacity-30 hover:opacity-90 transition-opacity rounded-[0px]"
                >
                  Suivant
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity rounded-[0px]"
                >
                  <Send size={12} />
                  Créer le post
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="text-[10px] font-semibold uppercase tracking-wider opacity-40 w-24 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="opacity-80">{value}</span>
    </div>
  );
}
