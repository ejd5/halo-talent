"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { applyStep1Schema, applyStep2Schema, applyStep3Schema, applyStep4Schema } from "@/lib/validations/apply";

// ─── Types ───
type Step1 = { firstName: string; lastName: string; email: string; age: string; country: string; whatsapp: string };
type Step2 = { departments: string[] };
type PlatformEntry = { name: string; username: string; followers: string };
type Step3 = { platforms: PlatformEntry[]; monthlyRevenue: string };
type Step4 = { goals: string; whyUs: string; blockers: string };
type FormData = Step1 & Step2 & Step3 & Step4;
type StepErrors = Record<string, string>;

const STORAGE_KEY = "halo-apply-draft";

const allPlatforms = [
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "youtube", label: "YouTube" },
  { id: "twitter", label: "Twitter / X" },
  { id: "twitch", label: "Twitch" },
  { id: "onlyfans", label: "OnlyFans" },
  { id: "mym", label: "MYM" },
  { id: "fansly", label: "Fansly" },
  { id: "reveal", label: "Reveal" },
  { id: "patreon", label: "Patreon" },
  { id: "substack", label: "Substack" },
  { id: "autre", label: "Autre" },
];

const departments = [
  { id: "music", label: "Music & Performing Arts", subtitle: "Artistes, musiciens, danseurs, comédiens" },
  { id: "sport", label: "Sport & Lifestyle", subtitle: "Athlètes, coachs, bien-être, nutrition" },
  { id: "business", label: "Business & Thought Leadership", subtitle: "Entrepreneurs, conférenciers, experts" },
  { id: "digital", label: "Digital Creators", subtitle: "Influenceurs, content creators, storytellers" },
  { id: "premium", label: "Talent Premium", subtitle: "Segment créateurs adultes, accompagnement spécifique et discret" },
];

const followerRanges = ["< 1K", "1K – 10K", "10K – 100K", "100K – 1M", "1M+"];
const revenueRanges = [
  "Pas de revenus",
  "0 – 1 000€",
  "1 000 – 5 000€",
  "5 000 – 20 000€",
  "20 000 – 50 000€",
  "50 000€+",
];

const ageOptions = Array.from({ length: 53 }, (_, i) => (i + 18).toString());

const stepLabels = ["Vous", "Département", "Plateformes", "Ambitions", "Confirmation"];

export default function ApplyPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [errors, setErrors] = useState<StepErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [rgpd, setRgpd] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  const [form, setForm] = useState<Partial<FormData>>({
    firstName: "", lastName: "", email: "", age: "", country: "", whatsapp: "",
    departments: [],
    platforms: [],
    monthlyRevenue: "",
    goals: "", whyUs: "", blockers: "",
  });

  // Restore from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setForm((prev) => ({ ...prev, ...parsed }));
        if (typeof parsed._step === "number") setStep(parsed._step);
      } catch { /* ignore */ }
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...form, _step: step }));
  }, [form, step]);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ─── Validation ───
  const validateStep = useCallback((s: number): boolean => {
    setErrors({});
    switch (s) {
      case 0: {
        const r = applyStep1Schema.safeParse(form);
        if (!r.success) {
          const fieldErrors: StepErrors = {};
          r.error.errors.forEach((e) => { fieldErrors[e.path[0] as string] = e.message; });
          setErrors(fieldErrors);
          return false;
        }
        return true;
      }
      case 1: {
        const r = applyStep2Schema.safeParse(form);
        if (!r.success) { setErrors({ departments: "Sélectionnez au moins un département" }); return false; }
        return true;
      }
      case 2: {
        const r = applyStep3Schema.safeParse(form);
        if (!r.success) { setErrors({ monthlyRevenue: "Indiquez vos revenus" }); return false; }
        return true;
      }
      case 3: {
        const r = applyStep4Schema.safeParse(form);
        if (!r.success) {
          const fieldErrors: StepErrors = {};
          r.error.errors.forEach((e) => { fieldErrors[e.path[0] as string] = e.message; });
          setErrors(fieldErrors);
          return false;
        }
        return true;
      }
      default: return true;
    }
  }, [form]);

  // ─── Navigation ───
  const goNext = () => {
    if (!validateStep(step)) return;
    setDirection("next");
    setStep((s) => Math.min(4, s + 1));
  };

  const goPrev = () => {
    setDirection("prev");
    setStep((s) => Math.max(0, s - 1));
  };

  // ─── Touch swipe ───
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 60) {
      if (diff < 0 && step < 4) goNext();
      if (diff > 0 && step > 0) goPrev();
    }
  };

  // ─── Toggles ───
  const toggleDepartment = (deptId: string) => {
    const current = form.departments || [];
    update("departments", current.includes(deptId) ? current.filter((d) => d !== deptId) : [...current, deptId]);
  };

  const togglePlatform = (name: string) => {
    const current = form.platforms || [];
    if (current.find((p) => p.name === name)) {
      update("platforms", current.filter((p) => p.name !== name));
    } else {
      update("platforms", [...current, { name, username: "", followers: "" }]);
    }
  };

  const updatePlatform = (name: string, key: "username" | "followers", value: string) => {
    update("platforms", (form.platforms || []).map((p) => p.name === name ? { ...p, [key]: value } : p));
  };

  // ─── Submit ───
  const handleSubmit = async () => {
    if (!rgpd) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        localStorage.removeItem(STORAGE_KEY);
        setSubmitted(true);
      } else {
        const data = await res.json();
        setErrors({ _submit: data.error || "Erreur lors de l'envoi" });
      }
    } catch {
      setErrors({ _submit: "Erreur réseau. Vérifiez votre connexion." });
    } finally {
      setSubmitting(false);
    }
  };

  // ─── SUCCESS SCREEN ───
  if (submitted) {
    return <SuccessScreen />;
  }

  const progress = ((step + 1) / 5) * 100;

  // ─── RENDER ───
  return (
    <div className="min-h-screen bg-brand-black flex flex-col select-none">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-[1px] bg-white/5 w-full">
          <div
            className="h-full bg-brand-gold transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="fixed top-6 left-8 right-8 z-40 flex items-center justify-between">
        <Link href="/" className="font-display text-lg italic tracking-wide text-brand-ivory hover:text-brand-gold transition-colors">
          Halo Talent
        </Link>
        <span className="text-xs text-brand-taupe uppercase tracking-[0.2em]">
          Étape {step + 1} / 5
        </span>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-28">
        {/* Step title */}
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl md:text-3xl italic text-brand-gold/60 tracking-wide">
            {stepLabels[step]}
          </h2>
        </div>

        {/* Content with slide animation */}
        <div
          ref={formRef}
          className="w-full max-w-lg overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="transition-all duration-200 ease-out"
            style={{
              opacity: 1,
              transform: "translateY(0)",
            }}
          >
            <StepContent
              step={step}
              form={form}
              errors={errors}
              rgpd={rgpd}
              onUpdate={update}
              onToggleDepartment={toggleDepartment}
              onTogglePlatform={togglePlatform}
              onUpdatePlatform={updatePlatform}
              onRgpdChange={setRgpd}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-white/[0.03] bg-gradient-to-t from-brand-black via-brand-black to-transparent">
        <div className="max-w-lg mx-auto flex items-center justify-between px-6 py-6">
          <button
            onClick={goPrev}
            className={cn(
              "flex items-center gap-2 text-xs uppercase tracking-[0.2em] transition-all",
              step === 0 ? "text-white/[0.07] pointer-events-none" : "text-brand-taupe hover:text-brand-ivory"
            )}
          >
            <ArrowLeft size={13} /> Précédent
          </button>

          <div className="flex items-center gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-500",
                  i === step ? "bg-brand-gold w-4" : i < step ? "bg-brand-gold/40" : "bg-white/10"
                )}
              />
            ))}
          </div>

          {step < 4 ? (
            <button
              onClick={goNext}
              className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-brand-gold hover:text-brand-gold-light transition-all"
            >
              Suivant <ArrowRight size={13} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!rgpd || submitting}
              className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-brand-gold hover:text-brand-gold-light transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              {submitting ? "Envoi en cours..." : "Envoyer"} <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// STEP CONTENT
// ══════════════════════════════════════════════

function StepContent({
  step, form, errors, rgpd, onUpdate, onToggleDepartment, onTogglePlatform, onUpdatePlatform, onRgpdChange,
}: {
  step: number; form: Partial<FormData>; errors: StepErrors; rgpd: boolean;
  onUpdate: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  onToggleDepartment: (id: string) => void;
  onTogglePlatform: (name: string) => void;
  onUpdatePlatform: (name: string, key: "username" | "followers", value: string) => void;
  onRgpdChange: (v: boolean) => void;
}) {
  switch (step) {
    case 0: return <Step1 form={form} errors={errors} onUpdate={onUpdate} />;
    case 1: return <Step2 form={form} onToggle={onToggleDepartment} />;
    case 2: return <Step3 form={form} errors={errors} onToggle={onTogglePlatform} onUpdate={onUpdatePlatform} onUpdateForm={onUpdate} />;
    case 3: return <Step4 form={form} errors={errors} onUpdate={onUpdate} />;
    case 4: return <Step5 form={form} rgpd={rgpd} onRgpdChange={onRgpdChange} />;
    default: return null;
  }
}

// ══════════════════════════════════════════════
// STEP 1 — Vous
// ══════════════════════════════════════════════

function Step1({ form, errors, onUpdate }: {
  form: Partial<Step1>; errors: StepErrors; onUpdate: <K extends keyof Step1>(k: K, v: Step1[K]) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-display text-4xl md:text-5xl italic text-brand-ivory leading-tight">
          Commençons par vous.
        </h3>
        <p className="text-brand-taupe mt-3 text-sm">
          Quelques informations basiques pour faire connaissance.
        </p>
      </div>
      <div className="space-y-7">
        <Input id="firstName" label="Prénom" placeholder="Jean" value={form.firstName || ""} error={errors.firstName} onChange={(e) => onUpdate("firstName", e.target.value)} />
        <Input id="lastName" label="Nom (ou pseudo professionnel)" placeholder="Dupont" value={form.lastName || ""} error={errors.lastName} onChange={(e) => onUpdate("lastName", e.target.value)} />
        <Input id="email" label="Email" type="email" placeholder="jean@email.com" value={form.email || ""} error={errors.email} onChange={(e) => onUpdate("email", e.target.value)} />
        <div>
          <p className="block text-xs uppercase tracking-[0.15em] text-brand-taupe mb-3">Âge</p>
          <select
            value={form.age || ""}
            onChange={(e) => onUpdate("age", e.target.value)}
            className="w-full bg-transparent border-b border-white/20 py-3 text-brand-ivory text-lg focus:outline-none focus:border-brand-gold transition-colors appearance-none"
          >
            <option value="" disabled className="bg-brand-black">Sélectionnez</option>
            {ageOptions.map((a) => <option key={a} value={a} className="bg-brand-black">{a} ans</option>)}
          </select>
          {errors.age && <p className="mt-2 text-sm text-brand-alert">{errors.age}</p>}
        </div>
        <Input id="country" label="Pays de résidence" placeholder="France" value={form.country || ""} error={errors.country} onChange={(e) => onUpdate("country", e.target.value)} />
        <Input id="whatsapp" label="WhatsApp ou Telegram (optionnel)" placeholder="+33 6 12 34 56 78" value={form.whatsapp || ""} onChange={(e) => onUpdate("whatsapp", e.target.value)} />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// STEP 2 — Département
// ══════════════════════════════════════════════

function Step2({ form, onToggle }: {
  form: Partial<Step2>; onToggle: (id: string) => void;
}) {
  return (
    <div>
      <h3 className="font-display text-3xl md:text-4xl italic text-brand-ivory leading-tight mb-8">
        Dans quel département <br />vous reconnaissez-vous ?
      </h3>
      <div className="space-y-3">
        {departments.map((d) => {
          const selected = form.departments?.includes(d.id);
          return (
            <button
              key={d.id}
              onClick={() => onToggle(d.id)}
              className={cn(
                "w-full text-left p-5 border transition-all duration-200 group",
                selected
                  ? "border-brand-gold bg-brand-gold/[0.04]"
                  : "border-white/[0.06] hover:border-white/20"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className={cn(
                    "font-display text-lg tracking-wide transition-colors",
                    selected ? "text-brand-gold" : "text-brand-ivory group-hover:text-brand-gold"
                  )}>
                    {d.label}
                  </span>
                  <p className="text-xs text-brand-taupe/60 mt-1 max-w-md leading-relaxed">
                    {d.subtitle}
                  </p>
                </div>
                <div className={cn(
                  "w-5 h-5 border rounded-full flex items-center justify-center shrink-0 ml-4 transition-all",
                  selected ? "border-brand-gold bg-brand-gold" : "border-white/20"
                )}>
                  {selected && <Check size={12} className="text-brand-black" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-brand-taupe/50 mt-4 italic">
        Vous pouvez en sélectionner plusieurs.
      </p>
    </div>
  );
}

// ══════════════════════════════════════════════
// STEP 3 — Plateformes
// ══════════════════════════════════════════════

function Step3({ form, errors, onToggle, onUpdate, onUpdateForm }: {
  form: Partial<Step3>; errors: StepErrors;
  onToggle: (name: string) => void;
  onUpdate: (name: string, key: "username" | "followers", value: string) => void;
  onUpdateForm: <K extends keyof Step3>(k: K, v: Step3[K]) => void;
}) {
  return (
    <div>
      <h3 className="font-display text-4xl md:text-5xl italic text-brand-ivory leading-tight mb-2">
        Où êtes-vous déjà présent ?
      </h3>
      <p className="text-brand-taupe text-sm mb-8">
        Sélectionnez vos plateformes et renseignez vos statistiques.
      </p>

      {/* Platform pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {allPlatforms.map((p) => {
          const active = form.platforms?.find((x) => x.name === p.id);
          return (
            <button
              key={p.id}
              onClick={() => onToggle(p.id)}
              className={cn(
                "px-4 py-2.5 text-xs uppercase tracking-[0.12em] border transition-all",
                active
                  ? "border-brand-gold bg-brand-gold/[0.06] text-brand-gold"
                  : "border-white/[0.08] text-brand-taupe hover:border-white/20"
              )}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Platform details */}
      {(form.platforms || []).length > 0 && (
        <div className="space-y-5 mb-8">
          {form.platforms?.map((p) => (
            <div key={p.name} className="border border-white/[0.06] p-5 space-y-4">
              <p className="text-sm font-medium text-brand-gold uppercase tracking-[0.1em]">
                {allPlatforms.find((x) => x.id === p.name)?.label || p.name}
              </p>
              <Input
                id={`user-${p.name}`}
                label="Username / Handle"
                placeholder="@votrehandle"
                value={p.username}
                onChange={(e) => onUpdate(p.name, "username", e.target.value)}
              />
              <div>
                <p className="block text-xs uppercase tracking-[0.15em] text-brand-taupe mb-3">Followers</p>
                <div className="flex flex-wrap gap-1.5">
                  {followerRanges.map((r) => (
                    <button
                      key={r}
                      onClick={() => onUpdate(p.name, "followers", r)}
                      className={cn(
                        "px-3 py-1.5 text-[11px] border transition-all",
                        p.followers === r
                          ? "border-brand-gold bg-brand-gold/[0.06] text-brand-gold"
                          : "border-white/[0.08] text-brand-taupe hover:border-white/20"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Revenue */}
      <div className="pt-4 border-t border-white/[0.04]">
        <p className="text-xs text-brand-taupe uppercase tracking-[0.15em] mb-4">
          Vos revenus mensuels actuels totaux
        </p>
        <div className="flex flex-wrap gap-2">
          {revenueRanges.map((r) => (
            <button
              key={r}
              onClick={() => onUpdateForm("monthlyRevenue", r)}
              className={cn(
                "px-4 py-2.5 text-xs border transition-all",
                form.monthlyRevenue === r
                  ? "border-brand-gold bg-brand-gold/[0.06] text-brand-gold"
                  : "border-white/[0.08] text-brand-taupe hover:border-white/20"
              )}
            >
              {r}
            </button>
          ))}
        </div>
        {errors.monthlyRevenue && <p className="mt-2 text-sm text-brand-alert">{errors.monthlyRevenue}</p>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// STEP 4 — Ambitions
// ══════════════════════════════════════════════

const textareaClass = "w-full bg-transparent border-b border-white/20 py-3 text-brand-ivory placeholder:text-brand-taupe/30 focus:outline-none focus:border-brand-gold transition-colors resize-none h-28 text-lg leading-relaxed";

function TextArea({ value, onChange, placeholder, maxLength, error }: {
  value: string; onChange: (v: string) => void; placeholder: string; maxLength: number; error?: string;
}) {
  return (
    <div>
      <textarea
        className={textareaClass}
        placeholder={placeholder}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="flex justify-between items-center mt-2">
        {error ? <p className="text-sm text-brand-alert">{error}</p> : <span />}
        <span className="text-xs text-brand-taupe/40">{value.length}/{maxLength}</span>
      </div>
    </div>
  );
}

function Step4({ form, errors, onUpdate }: {
  form: Partial<Step4>; errors: StepErrors;
  onUpdate: <K extends keyof Step4>(k: K, v: Step4[K]) => void;
}) {
  return (
    <div className="space-y-8">
      <h3 className="font-display text-4xl md:text-5xl italic text-brand-ivory leading-tight">
        Où voulez-vous être <br />dans 12 mois ?
      </h3>
      <div className="space-y-8">
        <div>
          <p className="block text-xs uppercase tracking-[0.15em] text-brand-taupe mb-3">Vos objectifs</p>
          <TextArea value={form.goals || ""} onChange={(v) => onUpdate("goals", v)} placeholder="Je veux..." maxLength={500} error={errors.goals} />
        </div>
        <div>
          <p className="block text-xs uppercase tracking-[0.15em] text-brand-taupe mb-3">Pourquoi nous plutôt qu'une autre agence ?</p>
          <TextArea value={form.whyUs || ""} onChange={(v) => onUpdate("whyUs", v)} placeholder="Parce que..." maxLength={500} error={errors.whyUs} />
        </div>
        <div>
          <p className="block text-xs uppercase tracking-[0.15em] text-brand-taupe mb-3">Qu'est-ce qui vous freine aujourd'hui ?</p>
          <TextArea value={form.blockers || ""} onChange={(v) => onUpdate("blockers", v)} placeholder="Mon plus grand défi..." maxLength={500} error={errors.blockers} />
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// STEP 5 — Confirmation
// ══════════════════════════════════════════════

function Step5({ form, rgpd, onRgpdChange }: {
  form: Partial<FormData>; rgpd: boolean; onRgpdChange: (v: boolean) => void;
}) {
  return (
    <div className="space-y-8">
      <h3 className="font-display text-4xl md:text-5xl italic text-brand-ivory leading-tight">
        Confirmez votre <br />candidature.
      </h3>

      <div className="border border-white/[0.06] divide-y divide-white/[0.04]">
        <SummaryRow label="Nom" value={`${form.firstName || ""} ${form.lastName || ""}`} />
        <SummaryRow label="Email" value={form.email || ""} />
        <SummaryRow label="Âge" value={form.age || ""} />
        <SummaryRow label="Pays" value={form.country || ""} />
        <SummaryRow label="Département(s)" value={form.departments?.join(", ") || "—"} />
        <SummaryRow label="Plateformes" value={form.platforms?.map((p) => {
          const label = allPlatforms.find((x) => x.id === p.name)?.label || p.name;
          return p.followers ? `${label} (${p.followers})` : label;
        }).join(", ") || "Aucune"} />
        <SummaryRow label="Revenus mensuels" value={form.monthlyRevenue || "—"} />
      </div>

      <div className="border border-white/[0.06] p-5">
        <p className="text-sm text-brand-taupe leading-relaxed">
          En envoyant votre candidature, vous acceptez que nous étudiions votre profil.
          Nous répondons à chaque candidature sous 7 jours.
        </p>
        <label className="flex items-start gap-3 mt-4 cursor-pointer group">
          <input
            type="checkbox"
            checked={rgpd}
            onChange={(e) => onRgpdChange(e.target.checked)}
            className="mt-0.5 appearance-none w-4 h-4 border border-white/20 rounded-[2px] checked:border-brand-gold checked:bg-brand-gold transition-all shrink-0"
          />
          <span className="text-xs text-brand-taupe/60 group-hover:text-brand-taupe transition-colors leading-relaxed">
            J'accepte que mes données soient utilisées uniquement dans le cadre de cette candidature (RGPD)
          </span>
        </label>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between px-5 py-3.5 gap-4">
      <span className="text-[11px] uppercase tracking-[0.15em] text-brand-gold shrink-0">{label}</span>
      <span className="text-sm text-brand-ivory text-right">{value}</span>
    </div>
  );
}

// ══════════════════════════════════════════════
// SUCCESS SCREEN
// ══════════════════════════════════════════════

function SuccessScreen() {
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReveal(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        {/* Animated circle */}
        <div className="relative w-20 h-20 mx-auto mb-8">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
            <circle
              cx="40" cy="40" r="36" fill="none" stroke="#D4AF37" strokeWidth="1.5"
              strokeDasharray={Math.PI * 72}
              strokeDashoffset={reveal ? 0 : Math.PI * 72}
              className="transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-500",
            reveal ? "opacity-100 scale-100" : "opacity-0 scale-50"
          )}>
            <Check size={24} className="text-brand-gold" />
          </div>
        </div>

        <h1 className={cn(
          "font-display text-4xl md:text-5xl italic text-brand-ivory mb-4 transition-all duration-700 delay-300",
          reveal ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          Votre candidature <br />est entre nos mains.
        </h1>
        <p className={cn(
          "text-brand-taupe mb-10 transition-all duration-700 delay-500",
          reveal ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          Vous recevrez un email de confirmation, puis notre réponse sous 7 jours.
        </p>
        <div className={cn(
          "transition-all duration-700 delay-700",
          reveal ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <Button variant="outline" as="link" href="/">
            Retour à la maison
          </Button>
        </div>
      </div>
    </div>
  );
}
