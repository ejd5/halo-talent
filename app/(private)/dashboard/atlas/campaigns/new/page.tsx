"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Loader, Users, Target, FileText, Sparkles, Send,
  Check, ChevronRight, AlertCircle, Image, Mail, Smartphone,
  Eye, Monitor, X, Plus, Trash2, Globe, Zap,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────

interface Segment {
  id: string;
  name: string;
  description: string | null;
  filters: any;
  estimated_count: number;
}

interface ContentBlock {
  id: string;
  type: "header" | "text" | "image" | "button" | "video" | "divider" | "footer";
  content?: string;
  src?: string;
  url?: string;
  label?: string;
  align?: "left" | "center" | "right";
}

const TYPE_OPTIONS = [
  { value: "newsletter", label: "Newsletter", desc: "Contenu régulier pour ta communauté" },
  { value: "new_content", label: "Nouveau contenu", desc: "Annonce d'une nouvelle publication" },
  { value: "promo_ppv", label: "Promo PPV", desc: "Offre spéciale ou contenu payant" },
  { value: "welcome", label: "Welcome series", desc: "Premier email de bienvenue" },
  { value: "reengagement", label: "Re-engagement", desc: "Relance après inactivité" },
  { value: "birthday", label: "Birthday/Anniversary", desc: "Souhait personnalisé" },
  { value: "custom", label: "Custom", desc: "Objectif libre" },
];

const GOAL_OPTIONS = [
  { value: "engagement", label: "Engagement", icon: HeartIcon },
  { value: "direct_sale", label: "Vente directe", icon: Zap },
  { value: "information", label: "Information", icon: Globe },
  { value: "custom", label: "Custom", icon: Target },
];

const BLOCK_TEMPLATES: Record<string, ContentBlock[]> = {
  welcome: [
    { id: "h1", type: "header", content: "Bienvenue {{first_name}} ! 🎉", align: "center" },
    { id: "t1", type: "text", content: "Je suis tellement content que tu aies rejoint mon univers. Prépare-toi à du contenu exclusif, des avant-premières et bien plus encore !", align: "left" },
    { id: "b1", type: "button", label: "Découvrir mon dernier post", url: "https://refundize.com/studio", align: "center" },
    { id: "d1", type: "divider" },
    { id: "f1", type: "footer", content: "© 2026 — Merci de faire partie de l'aventure ✨", align: "center" },
  ],
  new_content: [
    { id: "h1", type: "header", content: "Nouveau contenu 🔥", align: "center" },
    { id: "t1", type: "text", content: "{{greeting}} {{first_name}},\n\nJ'ai quelque chose de spécial pour toi ! Mon nouveau contenu vient de sortir.", align: "left" },
    { id: "b1", type: "button", label: "Voir le contenu →", url: "https://refundize.com/studio", align: "center" },
    { id: "d1", type: "divider" },
    { id: "f1", type: "footer", content: "Tu reçois cet email car tu fais partie de ma communauté.", align: "center" },
  ],
  promo_ppv: [
    { id: "h1", type: "header", content: "Offre exclusive pour toi 🎁", align: "center" },
    { id: "t1", type: "text", content: "{{greeting}} {{first_name}},\n\nJ'ai préparé une offre spéciale, juste pour toi.", align: "left" },
    { id: "b1", type: "button", label: "Voir l'offre", url: "https://refundize.com/studio", align: "center" },
    { id: "d1", type: "divider" },
    { id: "f1", type: "footer", content: "Offre à durée limitée.", align: "center" },
  ],
  reengagement: [
    { id: "h1", type: "header", content: "Tu me manques ! 💫", align: "center" },
    { id: "t1", type: "text", content: "{{greeting}} {{first_name}},\n\nÇa fait un moment et je commençais à m'ennuyer. J'ai préparé plein de nouvelles surprises.", align: "left" },
    { id: "b1", type: "button", label: "Revenir voir", url: "https://refundize.com/studio", align: "center" },
    { id: "d1", type: "divider" },
    { id: "f1", type: "footer", content: "Tu reçois cet email car tu es un membre de ma communauté.", align: "center" },
  ],
  birthday: [
    { id: "h1", type: "header", content: "Joyeux anniversaire {{first_name}} ! 🎂", align: "center" },
    { id: "t1", type: "text", content: "{{greeting}} {{first_name}},\n\nAujourd'hui c'est ton jour ! J'ai un petit quelque chose de spécial pour toi...", align: "left" },
    { id: "b1", type: "button", label: "Mon cadeau 🎁", url: "https://refundize.com/studio", align: "center" },
    { id: "d1", type: "divider" },
    { id: "f1", type: "footer", content: "Joyeux anniversaire de la part de toute l'équipe ! 🎉", align: "center" },
  ],
};

// ─── Helpers ─────────────────────────────────────────────────

function HeartIcon({ size }: { size?: number }) {
  return <span style={{ fontSize: size || 14 }}>♥</span>;
}

function generateId() { return Math.random().toString(36).substring(2, 8); }

// ─── Main Wizard ─────────────────────────────────────────────

function NewCampaignWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const channel = searchParams.get("channel") || "email";

  // Wizard state
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [estimatedRecipients, setEstimatedRecipients] = useState<number | null>(null);

  // Step 1 — Audience
  const [segments, setSegments] = useState<Segment[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<string>("");
  const [customTier, setCustomTier] = useState<string[]>([]);
  const [customMinSpent, setCustomMinSpent] = useState("");
  const [customMinScore, setCustomMinScore] = useState("");
  const [customCountry, setCustomCountry] = useState("");

  // Step 2 — Type & Goal
  const [campaignType, setCampaignType] = useState("newsletter");
  const [campaignGoal, setCampaignGoal] = useState("engagement");

  // Step 3 — Content
  const [subject, setSubject] = useState("");
  const [preheader, setPreheader] = useState("");
  const [fromName, setFromName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  // Step 4 — AI
  const [personalizeAI, setPersonalizeAI] = useState(false);

  // Step 5 — Send
  const [scheduleType, setScheduleType] = useState<"now" | "later">("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [throttleHours, setThrottleHours] = useState(4);
  const [abTestEnabled, setAbTestEnabled] = useState(false);

  // ─── Load segments ─────────────────────────────────────────

  useEffect(() => {
    fetch("/api/dashboard/atlas/fans/segments")
      .then((r) => r.json())
      .then((d) => setSegments(d.segments || []))
      .catch(() => {});
  }, []);

  // ─── Apply template when type changes ──────────────────────

  useEffect(() => {
    const template = BLOCK_TEMPLATES[campaignType];
    if (template && contentBlocks.length === 0) {
      setContentBlocks(JSON.parse(JSON.stringify(template)));
    }
  }, [campaignType]);

  // ─── Estimate recipients ───────────────────────────────────

  const estimateRecipients = useCallback(async () => {
    try {
      const filters: any = {};
      if (customTier.length > 0) filters.tier = customTier;
      if (customMinSpent) filters.min_spent = parseFloat(customMinSpent);
      if (customMinScore) filters.min_score = parseFloat(customMinScore);
      if (customCountry) filters.country = customCountry;

      const res = await fetch("/api/dashboard/atlas/campaigns/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ segmentId: selectedSegment || null, filters }),
      });
      if (res.ok) {
        const data = await res.json();
        setEstimatedRecipients(data.estimated_count);
      }
    } catch {}
  }, [selectedSegment, customTier, customMinSpent, customMinScore, customCountry]);

  useEffect(() => { estimateRecipients(); }, [estimateRecipients]);

  // ─── Block management ──────────────────────────────────────

  function addBlock(type: ContentBlock["type"]) {
    const newBlock: ContentBlock = {
      id: generateId(),
      type,
      content: "",
      align: "left",
    };
    if (type === "button") { newBlock.label = "Cliquez ici"; newBlock.url = ""; }
    if (type === "image") { newBlock.src = ""; }
    setContentBlocks([...contentBlocks, newBlock]);
  }

  function updateBlock(id: string, updates: Partial<ContentBlock>) {
    setContentBlocks(contentBlocks.map((b) => b.id === id ? { ...b, ...updates } : b));
  }

  function removeBlock(id: string) {
    setContentBlocks(contentBlocks.filter((b) => b.id !== id));
  }

  function moveBlock(from: number, to: number) {
    const blocks = [...contentBlocks];
    const [removed] = blocks.splice(from, 1);
    blocks.splice(to, 0, removed);
    setContentBlocks(blocks);
  }

  // ─── Create / Save campaign ────────────────────────────────

  async function handleCreate() {
    setSaving(true);
    try {
      const body: any = {
        name: subject || "Sans nom",
        type: campaignType,
        goal: campaignGoal,
        subject,
        preheader,
        from_name: fromName || "Créateur",
        from_email: fromEmail || "noreply@refundize.com",
        content: { blocks: contentBlocks },
        audience_segment_id: selectedSegment || null,
        custom_filters: {
          ...(customTier.length > 0 ? { tier: customTier } : {}),
          ...(customMinSpent ? { min_spent: parseFloat(customMinSpent) } : {}),
          ...(customMinScore ? { min_score: parseFloat(customMinScore) } : {}),
          ...(customCountry ? { country: customCountry } : {}),
        },
        personalize_with_ai: personalizeAI,
        throttle_hours: throttleHours,
        ab_test_enabled: abTestEnabled,
      };

      if (scheduleType === "later" && scheduleDate && scheduleTime) {
        body.schedule_at = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
        body.status = "scheduled";
      }

      const res = await fetch("/api/dashboard/atlas/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Erreur création");
        return;
      }

      const data = await res.json();
      setCreatedId(data.campaign.id);
      router.push(`/dashboard/atlas/campaigns/email/${data.campaign.id}`);
    } catch {
      alert("Erreur lors de la création");
    } finally {
      setSaving(false);
    }
  }

  // ─── Steps configuration ───────────────────────────────────

  const STEPS = [
    { num: 1, label: "Audience", icon: Users },
    { num: 2, label: "Objectif", icon: Target },
    { num: 3, label: "Contenu", icon: FileText },
    { num: 4, label: "IA", icon: Sparkles },
    { num: 5, label: "Envoi", icon: Send },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/atlas/campaigns/email" className="p-1 transition-opacity hover:opacity-70" style={{ color: "var(--text-primary)" }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Nouvelle campagne email
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            {STEPS.find((s) => s.num === step)?.label} — Étape {step}/5
          </p>
        </div>
      </div>

      {/* Step progress */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s.num} className="flex items-center flex-1">
            <button
              onClick={() => setStep(s.num)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
                s.num === step ? "bg-[var(--accent)] text-white" :
                s.num < step ? "text-white bg-[var(--accent)]/30" :
                "text-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.03)]"
              }`}
            >
              {s.num < step ? <Check size={12} /> : <s.icon size={12} />}
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-[1px]" style={{ backgroundColor: s.num <= step ? "var(--accent)" : "rgba(255,255,255,0.06)" }} />
            )}
          </div>
        ))}
      </div>

      {/* ─── STEP 1: Audience ─────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-5 max-w-2xl">
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            Seuls les fans avec <strong style={{ color: "var(--text-primary)" }}>email_consent = true</strong> et <strong style={{ color: "var(--text-primary)" }}>status = active</strong> recevront cette campagne.
          </p>

          {/* Existing segments */}
          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: "rgba(255,255,255,0.4)" }}>Segment existant</label>
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-sm outline-none"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--text-primary)", border: "1px solid transparent" }}
            >
              <option value="">Filtres personnalisés</option>
              {segments.map((s) => (
                <option key={s.id} value={s.id}>{s.name} (~{s.estimated_count})</option>
              ))}
            </select>
          </div>

          {!selectedSegment && (
            <div className="space-y-3">
              <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>Filtres personnalisés</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "rgba(255,255,255,0.3)" }}>Tier</label>
                  <select
                    value={customTier[0] || ""}
                    onChange={(e) => setCustomTier(e.target.value ? [e.target.value] : [])}
                    className="w-full text-xs px-3 py-2 rounded-sm outline-none"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--text-primary)", border: "1px solid transparent" }}
                  >
                    <option value="">Tous les tiers</option>
                    <option value="vip">VIP</option>
                    <option value="whale">Gros dépensier</option>
                    <option value="engaged">Engagé</option>
                    <option value="warm">Tède</option>
                    <option value="cold">Froid</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "rgba(255,255,255,0.3)" }}>Pays</label>
                  <input
                    value={customCountry}
                    onChange={(e) => setCustomCountry(e.target.value)}
                    placeholder="FR, US, ..."
                    className="w-full text-xs px-3 py-2 rounded-sm outline-none"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--text-primary)", border: "1px solid transparent" }}
                  />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "rgba(255,255,255,0.3)" }}>Dépenses min (€)</label>
                  <input type="number" value={customMinSpent} onChange={(e) => setCustomMinSpent(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-sm outline-none"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--text-primary)", border: "1px solid transparent" }} />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "rgba(255,255,255,0.3)" }}>Score min</label>
                  <input type="number" value={customMinScore} onChange={(e) => setCustomMinScore(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-sm outline-none"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--text-primary)", border: "1px solid transparent" }} />
                </div>
              </div>
            </div>
          )}

          {/* Estimated count */}
          <div className="p-4 rounded-sm" style={{ backgroundColor: "var(--accent-soft)", border: "1px solid var(--accent-border)" }}>
            <p className="text-sm" style={{ color: "var(--text-primary)" }}>
              {estimatedRecipients === null ? "Estimation en cours..." :
                estimatedRecipients === 0 ? "⚠️ Aucun fan ne correspond à ces critères" :
                `🎯 Cette campagne sera envoyée à ${estimatedRecipients} fans`
              }
            </p>
          </div>

          <StepNav step={step} setStep={setStep} />
        </div>
      )}

      {/* ─── STEP 2: Type & Goal ─────────────────────────── */}
      {step === 2 && (
        <div className="space-y-6 max-w-2xl">
          <div>
            <label className="text-sm font-medium mb-3 block" style={{ color: "var(--text-primary)" }}>Type d&apos;email</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setCampaignType(opt.value)}
                  className="text-left px-4 py-3 rounded-sm transition-all"
                  style={{
                    backgroundColor: campaignType === opt.value ? "rgba(199,91,57,0.12)" : "rgba(255,255,255,0.03)",
                    border: campaignType === opt.value ? "1px solid rgba(199,91,57,0.3)" : "1px solid transparent",
                  }}
                >
                  <p className="text-sm font-medium" style={{ color: campaignType === opt.value ? "var(--accent)" : "var(--text-primary)" }}>{opt.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-3 block" style={{ color: "var(--text-primary)" }}>Objectif principal</label>
            <div className="flex gap-2">
              {GOAL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setCampaignGoal(opt.value)}
                  className="flex items-center gap-2 px-4 py-3 rounded-sm transition-all"
                  style={{
                    backgroundColor: campaignGoal === opt.value ? "rgba(199,91,57,0.12)" : "rgba(255,255,255,0.03)",
                    border: campaignGoal === opt.value ? "1px solid rgba(199,91,57,0.3)" : "1px solid transparent",
                  }}
                >
                  <opt.icon size={14} />
                  <span className="text-sm" style={{ color: campaignGoal === opt.value ? "var(--accent)" : "var(--text-primary)" }}>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <StepNav step={step} setStep={setStep} />
        </div>
      )}

      {/* ─── STEP 3: Content ─────────────────────────────── */}
      {step === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(255,255,255,0.4)" }}>De la part de</label>
              <div className="grid grid-cols-2 gap-2">
                <input value={fromName} onChange={(e) => setFromName(e.target.value)} placeholder="Nom"
                  className="text-sm px-3 py-2 rounded-sm outline-none"
                  style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--text-primary)", border: "1px solid transparent" }} />
                <input value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} placeholder="Email"
                  className="text-sm px-3 py-2 rounded-sm outline-none"
                  style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--text-primary)", border: "1px solid transparent" }} />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(255,255,255,0.4)" }}>Objet</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Ligne d'objet"
                className="w-full text-sm px-3 py-2 rounded-sm outline-none"
                style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--text-primary)", border: "1px solid transparent" }} />
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(255,255,255,0.4)" }}>Preheader</label>
              <input value={preheader} onChange={(e) => setPreheader(e.target.value)} placeholder="Texte de prévisualisation"
                className="w-full text-sm px-3 py-2 rounded-sm outline-none"
                style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--text-primary)", border: "1px solid transparent" }} />
            </div>

            {/* Blocks */}
            <div className="space-y-2">
              <label className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>Contenu</label>
              {contentBlocks.map((block, i) => (
                <BlockEditor
                  key={block.id}
                  block={block}
                  index={i}
                  total={contentBlocks.length}
                  onUpdate={(updates) => updateBlock(block.id, updates)}
                  onRemove={() => removeBlock(block.id)}
                  onMoveUp={() => moveBlock(i, i - 1)}
                  onMoveDown={() => moveBlock(i, i + 1)}
                />
              ))}
            </div>

            {/* Add block buttons */}
            <div className="flex flex-wrap gap-2">
              <AddBlockButton label="Texte" icon={FileText} onClick={() => addBlock("text")} />
              <AddBlockButton label="Titre" icon={FileText} onClick={() => addBlock("header")} />
              <AddBlockButton label="Image" icon={Image} onClick={() => addBlock("image")} />
              <AddBlockButton label="Bouton" icon={Target} onClick={() => addBlock("button")} />
              <AddBlockButton label="Divider" icon={X} onClick={() => addBlock("divider")} />
            </div>
          </div>

          {/* Preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>Aperçu</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setPreviewMode("desktop")}
                  className="p-1.5 rounded-sm transition-colors"
                  style={{ backgroundColor: previewMode === "desktop" ? "rgba(255,255,255,0.08)" : "transparent" }}
                >
                  <Monitor size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
                </button>
                <button
                  onClick={() => setPreviewMode("mobile")}
                  className="p-1.5 rounded-sm transition-colors"
                  style={{ backgroundColor: previewMode === "mobile" ? "rgba(255,255,255,0.08)" : "transparent" }}
                >
                  <Smartphone size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
                </button>
              </div>
            </div>
            <EmailPreview blocks={contentBlocks} subject={subject} preheader={preheader} mode={previewMode} />
          </div>

          <div className="lg:col-span-2">
            <StepNav step={step} setStep={setStep} />
          </div>
        </div>
      )}

      {/* ─── STEP 4: AI Personalization ─────────────────── */}
      {step === 4 && (
        <div className="space-y-5 max-w-2xl">
          <div className="p-5 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Personnalisation IA</h3>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Chaque destinataire reçoit une variante personnalisée selon son tier, ses préférences, son historique d&apos;achats et sa langue.
                </p>
              </div>
              <button
                onClick={() => setPersonalizeAI(!personalizeAI)}
                className="relative w-10 h-5 rounded-full transition-colors"
                style={{ backgroundColor: personalizeAI ? "var(--accent)" : "rgba(255,255,255,0.1)" }}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${personalizeAI ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>

          {personalizeAI && (
            <div className="space-y-3">
              <div className="p-4 rounded-sm" style={{ backgroundColor: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)" }}>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  ✨ Les variables comme <code style={{ color: "var(--success)" }}>{`{{first_name}}`}</code>, <code style={{ color: "var(--success)" }}>{`{{greeting}}`}</code> seront automatiquement remplacées par le contenu personnalisé.
                </p>
              </div>
              <div className="p-4 rounded-sm" style={{ backgroundColor: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.12)" }}>
                <p className="text-xs" style={{ color: "rgba(245,158,11,0.6)" }}>
                  ⚠️ Coût estimé : <strong>{estimatedRecipients || 0} crédit(s) IA</strong> (1 crédit par email personnalisé)
                </p>
              </div>
            </div>
          )}

          <StepNav step={step} setStep={setStep} />
        </div>
      )}

      {/* ─── STEP 5: Send ───────────────────────────────── */}
      {step === 5 && (
        <div className="space-y-5 max-w-2xl">
          {/* Schedule */}
          <div className="space-y-3">
            <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Envoi</label>
            <div className="flex gap-2">
              <button
                onClick={() => setScheduleType("now")}
                className="flex-1 px-4 py-3 rounded-sm text-sm transition-all"
                style={{
                  backgroundColor: scheduleType === "now" ? "rgba(199,91,57,0.12)" : "rgba(255,255,255,0.03)",
                  border: scheduleType === "now" ? "1px solid rgba(199,91,57,0.3)" : "1px solid transparent",
                  color: scheduleType === "now" ? "var(--accent)" : "var(--text-primary)",
                }}
              >
                Envoyer maintenant
              </button>
              <button
                onClick={() => setScheduleType("later")}
                className="flex-1 px-4 py-3 rounded-sm text-sm transition-all"
                style={{
                  backgroundColor: scheduleType === "later" ? "rgba(199,91,57,0.12)" : "rgba(255,255,255,0.03)",
                  border: scheduleType === "later" ? "1px solid rgba(199,91,57,0.3)" : "1px solid transparent",
                  color: scheduleType === "later" ? "var(--accent)" : "var(--text-primary)",
                }}
              >
                Programmer
              </button>
            </div>
            {scheduleType === "later" && (
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)}
                  className="text-sm px-3 py-2 rounded-sm outline-none"
                  style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--text-primary)", border: "1px solid transparent" }} />
                <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)}
                  className="text-sm px-3 py-2 rounded-sm outline-none"
                  style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--text-primary)", border: "1px solid transparent" }} />
              </div>
            )}
          </div>

          {/* Throttling */}
          <div>
            <label className="text-sm font-medium mb-1 block" style={{ color: "var(--text-primary)" }}>Throttling</label>
            <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Étaler l&apos;envoi sur plusieurs heures pour éviter le spam flag</p>
            <select value={throttleHours} onChange={(e) => setThrottleHours(parseInt(e.target.value))}
              className="text-sm px-3 py-2 rounded-sm outline-none"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--text-primary)", border: "1px solid transparent" }}>
              <option value={1}>1 heure</option>
              <option value={2}>2 heures</option>
              <option value={4}>4 heures (recommandé)</option>
              <option value={8}>8 heures</option>
              <option value={24}>24 heures</option>
            </select>
          </div>

          {/* A/B Test */}
          <div className="p-4 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>A/B Test</h3>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                  2 versions sur 20% de l&apos;audience, la gagnante envoyée aux 80% restants
                </p>
              </div>
              <button
                onClick={() => setAbTestEnabled(!abTestEnabled)}
                className="relative w-10 h-5 rounded-full transition-colors"
                style={{ backgroundColor: abTestEnabled ? "var(--accent)" : "rgba(255,255,255,0.1)" }}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${abTestEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Récapitulatif</h3>
            <div className="space-y-1.5 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              <p>Type : {TYPE_OPTIONS.find((o) => o.value === campaignType)?.label || campaignType}</p>
              <p>Objectif : {GOAL_OPTIONS.find((o) => o.value === campaignGoal)?.label || campaignGoal}</p>
              <p>Destinataires estimés : {estimatedRecipients ?? "..."}</p>
              <p>IA personnalisée : {personalizeAI ? "Oui" : "Non"}</p>
              <p>Throttling : {throttleHours}h</p>
              {abTestEnabled && <p>A/B Test : Activé</p>}
            </div>
          </div>

          {/* Action buttons */}
          {step === 5 && (
            <div className="flex items-center gap-3 pt-4">
              <button onClick={() => setStep(4)} className="text-sm px-4 py-2 rounded-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                Retour
              </button>
              <button
                onClick={handleCreate}
                disabled={saving || !subject.trim()}
                className="flex items-center gap-1.5 px-6 py-2.5 text-sm rounded-sm transition-all hover:opacity-80 disabled:opacity-40"
                style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
              >
                {saving ? <><Loader size={14} className="animate-spin" /> Création...</> : scheduleType === "later" ? "Programmer" : "Créer & envoyer"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────

function StepNav({ step, setStep }: { step: number; setStep: (s: number) => void }) {
  return (
    <div className="flex items-center gap-3 pt-4">
      {step > 1 && (
        <button onClick={() => setStep(step - 1)} className="text-sm px-4 py-2 rounded-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
          Retour
        </button>
      )}
      {step < 5 && (
        <button onClick={() => setStep(step + 1)} className="flex items-center gap-1.5 px-5 py-2.5 text-sm rounded-sm transition-all hover:opacity-80" style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}>
          Suivant <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

function AddBlockButton({ label, icon: Icon, onClick }: { label: string; icon: any; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-sm transition-colors hover:bg-white/[0.05]"
      style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)" }}
    >
      <Plus size={12} /> {label}
    </button>
  );
}

function BlockEditor({ block, index, total, onUpdate, onRemove, onMoveUp, onMoveDown }: {
  block: ContentBlock; index: number; total: number;
  onUpdate: (u: Partial<ContentBlock>) => void;
  onRemove: () => void; onMoveUp: () => void; onMoveDown: () => void;
}) {
  return (
    <div className="p-3 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-medium uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>{block.type}</span>
        <div className="flex items-center gap-1">
          <button disabled={index === 0} onClick={onMoveUp} className="p-0.5 disabled:opacity-20 hover:bg-white/[0.05] rounded-sm">↑</button>
          <button disabled={index === total - 1} onClick={onMoveDown} className="p-0.5 disabled:opacity-20 hover:bg-white/[0.05] rounded-sm">↓</button>
          <button onClick={onRemove} className="p-0.5 hover:bg-white/[0.05] rounded-sm"><Trash2 size={11} style={{ color: "rgba(239,68,68,0.4)" }} /></button>
        </div>
      </div>

      {(block.type === "header" || block.type === "text") && (
        <textarea
          value={block.content || ""}
          onChange={(e) => onUpdate({ content: e.target.value })}
          rows={block.type === "header" ? 1 : 3}
          className="w-full text-xs px-2 py-1.5 rounded-sm outline-none resize-none"
          style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--text-primary)", border: "1px solid transparent" }}
          placeholder={block.type === "header" ? "Titre..." : "Texte..."}
        />
      )}

      {block.type === "image" && (
        <input value={block.src || ""} onChange={(e) => onUpdate({ src: e.target.value })}
          placeholder="URL de l'image"
          className="w-full text-xs px-2 py-1.5 rounded-sm outline-none"
          style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--text-primary)", border: "1px solid transparent" }} />
      )}

      {block.type === "button" && (
        <div className="grid grid-cols-2 gap-2">
          <input value={block.label || ""} onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder="Label"
            className="text-xs px-2 py-1.5 rounded-sm outline-none"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--text-primary)", border: "1px solid transparent" }} />
          <input value={block.url || ""} onChange={(e) => onUpdate({ url: e.target.value })}
            placeholder="URL"
            className="text-xs px-2 py-1.5 rounded-sm outline-none"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--text-primary)", border: "1px solid transparent" }} />
        </div>
      )}

      {block.type === "footer" && (
        <textarea value={block.content || ""} onChange={(e) => onUpdate({ content: e.target.value })}
          rows={2}
          className="w-full text-xs px-2 py-1.5 rounded-sm outline-none resize-none"
          style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--text-primary)", border: "1px solid transparent" }}
          placeholder="Texte du footer..." />
      )}
    </div>
  );
}

function EmailPreview({ blocks, subject, preheader, mode }: {
  blocks: ContentBlock[]; subject: string; preheader: string; mode: "desktop" | "mobile";
}) {
  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case "header":
        return <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "16px 0 8px", textAlign: block.align || "left", color: "#1a1a1a" }}>{block.content}</h2>;
      case "text":
        return <p style={{ fontSize: "14px", lineHeight: 1.6, margin: "0 0 12px", textAlign: block.align || "left", color: "#333" }}>{block.content}</p>;
      case "image":
        return <div style={{ margin: "12px 0", padding: "20px", backgroundColor: "#f5f5f5", textAlign: "center", borderRadius: "4px", fontSize: "12px", color: "#999" }}>🖼 {block.src || "Image"}</div>;
      case "button":
        return <div style={{ textAlign: block.align || "center", margin: "16px 0" }}>
          <span style={{ display: "inline-block", backgroundColor: "var(--accent)", color: "#fff", padding: "10px 24px", borderRadius: "4px", fontSize: "14px", fontWeight: 600 }}>{block.label || "Cliquez ici"}</span>
        </div>;
      case "divider":
        return <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "16px 0" }} />;
      case "footer":
        return <div style={{ marginTop: "24px", paddingTop: "12px", borderTop: "1px solid #eee", fontSize: "11px", color: "#999", textAlign: "center" }}>{block.content}</div>;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-sm overflow-hidden" style={{ backgroundColor: "#f4f4f4", maxWidth: mode === "mobile" ? 320 : "100%" }}>
      {/* Browser chrome */}
      <div style={{ backgroundColor: "#e0e0e0", padding: "6px 10px", display: "flex", alignItems: "center", gap: "6px" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#28c840" }} />
        <div style={{ marginLeft: 8, fontSize: 10, color: "#666", flex: 1, backgroundColor: "#fff", padding: "2px 8px", borderRadius: 3 }}>{subject || "Sans objet"}</div>
      </div>
      {/* Email content */}
      <div style={{ padding: "16px", backgroundColor: "#ffffff", minHeight: 200 }}>
        {preheader && (
          <div style={{ fontSize: 11, color: "#999", marginBottom: 8, display: "none" }}>{preheader}</div>
        )}
        {blocks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#ccc", fontSize: 13 }}>Ajoute des blocs de contenu</div>
        ) : (
          blocks.map((b) => <div key={b.id}>{renderBlock(b)}</div>)
        )}
      </div>
    </div>
  );
}

// ─── Page wrapper ────────────────────────────────────────────

export default function NewCampaignPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16"><Loader size={16} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} /></div>}>
      <NewCampaignWizard />
    </Suspense>
  );
}
