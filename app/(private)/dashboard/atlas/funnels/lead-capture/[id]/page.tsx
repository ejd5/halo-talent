"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Loader, Save, Smartphone, Monitor,
  Plus, Trash2, Eye, EyeOff, GripVertical, QrCode,
  Link as LinkIcon, Type, Image, Palette, Globe,
  Mail, MessageSquare, Bell, ToggleLeft, ToggleRight,
  AlertTriangle, Copy, Download, ExternalLink,
} from "lucide-react";
import type { LeadCapturePage, LeadCaptureLink, PageType, LinkType, BackgroundType } from "@/lib/atlas/lead-capture/types";
import { PAGE_TEMPLATES, LINK_PRESETS, SOCIAL_ICONS, SOCIAL_BRAND_COLORS, generateQRUrl } from "@/lib/atlas/lead-capture/types";

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  active:  { label: "Actif",    color: "var(--success)", bg: "rgba(16,185,129,0.1)" },
  paused:  { label: "En pause", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  draft:   { label: "Brouillon", color: "rgba(255,255,255,0.4)", bg: "rgba(255,255,255,0.05)" },
};

export default function LeadCaptureEditorPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "var(--bg-primary)" }} />}>
      <LeadCaptureEditorPageInner params={params} />
    </Suspense>
  );
}

function LeadCaptureEditorPageInner({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [id, setId] = useState<string | null>(null);

  useEffect(() => { params.then((p) => setId(p.id)); }, [params]);

  if (!id) return null;
  return <Editor pageId={id} router={router} qrTab={searchParams.get("tab") === "qr"} />;
}

function Editor({ pageId, router, qrTab: initialQrTab }: { pageId: string; router: ReturnType<typeof useRouter>; qrTab: boolean }) {
  /* ─── State ─── */
  const [page, setPage] = useState<LeadCapturePage | null>(null);
  const [links, setLinks] = useState<LeadCaptureLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<string>(initialQrTab ? "qr" : "editor");
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");
  const [qrCode, setQrCode] = useState<{ qr_image: string; url: string } | null>(null);
  const [showLinkPresets, setShowLinkPresets] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  /* ─── Form state ─── */
  const [form, setForm] = useState({
    title: "", slug: "", display_name: "", bio: "", avatar_url: "",
    background_type: "color" as BackgroundType, background_value: "#1A1614",
    accent_color: "var(--accent)", text_color: "var(--text-primary)",
    headline: "", subtitle: "", cta_text: "Je m'abonne",
    confirmation_message: "Vérifiez votre boîte mail",
    collect_first_name: true, consent_text: "J'accepte de recevoir des communications",
  });

  /* ─── Load ─── */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/dashboard/atlas/lead-capture/${pageId}`);
        if (!res.ok) { setLoading(false); return; }
        const d = await res.json();
        const p: LeadCapturePage = d.page;
        setPage(p);
        setForm({
          title: p.title || "", slug: p.slug || "", display_name: p.display_name || "",
          bio: p.bio || "", avatar_url: p.avatar_url || "",
          background_type: p.background_type || "color",
          background_value: p.background_value || "#1A1614",
          accent_color: p.accent_color || "var(--accent)",
          text_color: p.text_color || "var(--text-primary)",
          headline: p.headline || "", subtitle: p.subtitle || "",
          cta_text: p.cta_text || "Je m'abonne",
          confirmation_message: p.confirmation_message || "Vérifiez votre boîte mail",
          collect_first_name: p.collect_first_name ?? true,
          consent_text: p.consent_text || "J'accepte de recevoir des communications",
        });
        setLinks(d.links || []);
      } catch {} finally { setLoading(false); }
    })();
  }, [pageId]);

  /* ─── Save ─── */
  async function handleSave() {
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch(`/api/dashboard/atlas/lead-capture/${pageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { setSaveMsg({ type: "error", text: "Erreur" }); return; }
      const d = await res.json();
      if (d.page) setPage(d.page);
      setSaveMsg({ type: "success", text: "Sauvegardé" });
      setTimeout(() => setSaveMsg(null), 2500);
    } catch { setSaveMsg({ type: "error", text: "Erreur réseau" }); }
    finally { setSaving(false); }
  }

  /* ─── Toggle status ─── */
  async function toggleStatus() {
    if (!page) return;
    const ns = page.status === "active" ? "paused" : page.status === "draft" ? "active" : "active";
    try {
      const res = await fetch(`/api/dashboard/atlas/lead-capture/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: ns }),
      });
      if (res.ok) setPage((prev) => prev ? { ...prev, status: ns as LeadCapturePage["status"] } : prev);
    } catch {}
  }

  /* ─── Links ─── */
  async function addLink(preset?: typeof LINK_PRESETS[number]) {
    const p = preset || LINK_PRESETS[LINK_PRESETS.length - 1];
    try {
      const res = await fetch(`/api/dashboard/atlas/lead-capture/${pageId}/links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link_type: p.link_type, label: p.label, url: p.url, icon: p.icon }),
      });
      const d = await res.json();
      if (d.link) setLinks((prev) => [...prev, d.link]);
    } catch {}
    setShowLinkPresets(false);
  }

  async function updateLink(linkId: string, patch: Partial<LeadCaptureLink>) {
    try {
      const res = await fetch(`/api/dashboard/atlas/lead-capture/${pageId}/links`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link_id: linkId, ...patch }),
      });
      const d = await res.json();
      if (d.link) setLinks((prev) => prev.map((l) => l.id === linkId ? d.link : l));
    } catch {}
  }

  async function deleteLink(linkId: string) {
    try {
      await fetch(`/api/dashboard/atlas/lead-capture/${pageId}/links?link_id=${linkId}`, { method: "DELETE" });
      setLinks((prev) => prev.filter((l) => l.id !== linkId));
    } catch {}
  }

  function moveLink(from: number, to: number) {
    if (to < 0 || to >= links.length) return;
    const reordered = [...links];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    setLinks(reordered);
    reordered.forEach((link, i) => updateLink(link.id, { sort_order: i } as any));
  }

  /* ─── QR Code ─── */
  useEffect(() => {
    if (activeTab === "qr" && page) {
      fetch(`/api/lead-capture/qr?page_id=${pageId}`)
        .then((r) => r.json()).then((d) => setQrCode(d)).catch(() => {});
    }
  }, [activeTab, pageId, page]);

  /* ─── Auto-save on Ctrl+S ─── */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); handleSave(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [form]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <Loader size={16} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center gap-3">
        <AlertTriangle size={28} style={{ color: "rgba(255,255,255,0.1)" }} />
        <p style={{ color: "rgba(255,255,255,0.3)" }}>Page introuvable</p>
        <Link href="/dashboard/atlas/funnels/lead-capture" className="text-xs px-3 py-1.5 rounded-sm" style={{ background: "rgba(199,91,57,0.1)", color: "var(--accent)" }}>
          Retour
        </Link>
      </div>
    );
  }

  const st = STATUS_STYLES[page.status] || STATUS_STYLES.draft;
  const isLib = page.page_type === "link_in_bio";

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      {/* ═══ Top bar ═══ */}
      <div className="flex items-center justify-between px-4 py-2 shrink-0 border-b" style={{ borderColor: "rgba(245,240,235,0.06)", backgroundColor: "var(--bg-primary)" }}>
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/dashboard/atlas/funnels/lead-capture" className="p-1 transition-opacity hover:opacity-70 shrink-0">
            <ArrowLeft size={16} style={{ color: "var(--color-ink-tertiary)" }} />
          </Link>
          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{page.title}</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded-sm font-medium" style={{ background: st.bg, color: st.color }}>{st.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleStatus}
            className="flex items-center gap-1 px-2 py-1 text-[10px] rounded-sm transition-colors hover:bg-white/5"
            style={{ border: "1px solid rgba(245,240,235,0.08)", color: page.status === "active" ? "#F59E0B" : "var(--success)" }}
          >
            {page.status === "active" ? <ToggleLeft size={12} /> : <ToggleRight size={12} />}
            {page.status === "active" ? "Pause" : "Activer"}
          </button>
          <Link
            href={`/${page.slug}`}
            target="_blank"
            className="flex items-center gap-1 px-2 py-1 text-[10px] rounded-sm transition-colors hover:bg-white/5"
            style={{ border: "1px solid rgba(245,240,235,0.08)", color: "var(--text-primary)" }}
          >
            <ExternalLink size={12} /> Voir
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-medium rounded-sm transition-opacity hover:opacity-80 disabled:opacity-30"
            style={{ background: "var(--accent)", color: "var(--text-primary)" }}
          >
            {saving ? <Loader size={12} className="animate-spin" /> : <Save size={12} />}
            {saving ? "..." : "Sauvegarder"}
          </button>
          {saveMsg && (
            <span className="text-[10px]" style={{ color: saveMsg.type === "success" ? "var(--success)" : "var(--danger)" }}>{saveMsg.text}</span>
          )}
        </div>
      </div>

      {/* ═══ Tabs ═══ */}
      <div className="flex gap-0 px-4 border-b shrink-0" style={{ borderColor: "rgba(245,240,235,0.06)", backgroundColor: "var(--bg-primary)" }}>
        {[
          { id: "editor", label: "Éditeur", icon: Palette },
          { id: "links", label: "Liens", icon: LinkIcon, hide: !isLib },
          { id: "design", label: "Design", icon: Image },
          { id: "qr", label: "QR Code", icon: QrCode },
        ].filter((t) => !t.hide).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-medium border-b-2 transition-colors"
              style={{
                borderColor: activeTab === tab.id ? "var(--accent)" : "transparent",
                color: activeTab === tab.id ? "var(--accent)" : "var(--color-ink-tertiary)",
              }}
            >
              <Icon size={12} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* ═══ Body ═══ */}
      <div className="flex flex-1 min-h-0">
        {/* ─── Editor panel ─── */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4" style={{ backgroundColor: "var(--bg-primary)" }}>
          {activeTab === "editor" && (
            <div className="max-w-lg mx-auto space-y-3">
              <h3 className="text-[10px] uppercase tracking-wider" style={{ color: "var(--color-ink-tertiary)" }}>Contenu</h3>
              <Field label="Titre SEO" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} />
              <Field label="Slug (URL)" value={form.slug} onChange={(v) => setForm((f) => ({ ...f, slug: v }))} hint={`/${form.slug}`} />
              <Field label="Nom affiché" value={form.display_name} onChange={(v) => setForm((f) => ({ ...f, display_name: v }))} />
              <TextArea label="Bio" value={form.bio} onChange={(v) => setForm((f) => ({ ...f, bio: v }))} rows={2} />
              <Field label="Avatar URL" value={form.avatar_url} onChange={(v) => setForm((f) => ({ ...f, avatar_url: v }))} />

              {!isLib && (
                <>
                  <div className="h-px" style={{ background: "rgba(245,240,235,0.06)" }} />
                  <h3 className="text-[10px] uppercase tracking-wider" style={{ color: "var(--color-ink-tertiary)" }}>Formulaire de capture</h3>
                  <Field label="Titre (headline)" value={form.headline} onChange={(v) => setForm((f) => ({ ...f, headline: v }))} />
                  <TextArea label="Sous-titre" value={form.subtitle} onChange={(v) => setForm((f) => ({ ...f, subtitle: v }))} rows={2} />
                  <Field label="Texte du bouton CTA" value={form.cta_text} onChange={(v) => setForm((f) => ({ ...f, cta_text: v }))} />
                  <Field label="Message de confirmation" value={form.confirmation_message} onChange={(v) => setForm((f) => ({ ...f, confirmation_message: v }))} />
                  <Field label="Texte de consentement" value={form.consent_text} onChange={(v) => setForm((f) => ({ ...f, consent_text: v }))} />
                  <ToggleField label="Collecter le prénom" value={form.collect_first_name} onChange={(v) => setForm((f) => ({ ...f, collect_first_name: v }))} />
                </>
              )}
            </div>
          )}

          {activeTab === "links" && isLib && (
            <div className="max-w-lg mx-auto space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] uppercase tracking-wider" style={{ color: "var(--color-ink-tertiary)" }}>
                  {links.length} lien{links.length > 1 ? "s" : ""}
                </h3>
                <button
                  onClick={() => setShowLinkPresets(!showLinkPresets)}
                  className="flex items-center gap-1 px-2 py-1 text-[10px] rounded-sm transition-colors hover:bg-white/5"
                  style={{ border: "1px solid rgba(245,240,235,0.08)", color: "var(--accent)" }}
                >
                  <Plus size={10} /> Ajouter
                </button>
              </div>

              {showLinkPresets && (
                <div className="p-2 border rounded-sm" style={{ borderColor: "rgba(245,240,235,0.06)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                  <div className="grid grid-cols-2 gap-1">
                    {LINK_PRESETS.map((preset, i) => (
                      <button
                        key={i}
                        onClick={() => addLink(preset)}
                        className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] rounded-sm hover:bg-white/5 text-left"
                        style={{ color: "var(--text-primary)" }}
                      >
                        <Plus size={10} /> {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {links.length === 0 && !showLinkPresets && (
                <div className="flex flex-col items-center py-8 text-center">
                  <LinkIcon size={24} style={{ color: "rgba(255,255,255,0.06)" }} />
                  <p className="text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.15)" }}>Ajoute tes premiers liens</p>
                </div>
              )}

              <div className="space-y-1">
                {links.map((link, i) => (
                  <div
                    key={link.id}
                    className="flex items-center gap-2 p-2 rounded-sm transition-colors"
                    style={{ border: "1px solid rgba(245,240,235,0.06)" }}
                  >
                    <button
                      onMouseDown={() => setDragIdx(i)}
                      className="p-0.5 cursor-grab"
                      style={{ color: "var(--color-ink-tertiary)" }}
                    >
                      <GripVertical size={12} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <input
                        value={link.label}
                        onChange={(e) => updateLink(link.id, { label: e.target.value } as any)}
                        className="w-full bg-transparent text-[11px] outline-none"
                        style={{ color: "var(--text-primary)" }}
                        placeholder="Label"
                      />
                      <input
                        value={link.url}
                        onChange={(e) => updateLink(link.id, { url: e.target.value } as any)}
                        className="w-full bg-transparent text-[9px] outline-none"
                        style={{ color: "var(--color-ink-tertiary)" }}
                        placeholder="https://..."
                      />
                    </div>
                    <button
                      onClick={() => updateLink(link.id, { is_active: !link.is_active } as any)}
                      className="p-1"
                      style={{ color: link.is_active ? "var(--success)" : "var(--color-ink-tertiary)" }}
                    >
                      {link.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                    </button>
                    <button onClick={() => deleteLink(link.id)} className="p-1" style={{ color: "var(--danger)" }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "design" && (
            <div className="max-w-lg mx-auto space-y-3">
              <h3 className="text-[10px] uppercase tracking-wider" style={{ color: "var(--color-ink-tertiary)" }}>Apparence</h3>
              <SelectField label="Type de fond" value={form.background_type} onChange={(v) => setForm((f) => ({ ...f, background_type: v as BackgroundType }))}
                options={[{ value: "color", label: "Couleur" }, { value: "image", label: "Image" }, { value: "video", label: "Vidéo" }]} />
              {form.background_type === "color" && (
                <ColorField label="Couleur de fond" value={form.background_value} onChange={(v) => setForm((f) => ({ ...f, background_value: v }))} />
              )}
              {form.background_type !== "color" && (
                <Field label={form.background_type === "image" ? "URL de l'image" : "URL de la vidéo"} value={form.background_value} onChange={(v) => setForm((f) => ({ ...f, background_value: v }))} />
              )}
              <ColorField label="Couleur d'accent" value={form.accent_color} onChange={(v) => setForm((f) => ({ ...f, accent_color: v }))} />
              <ColorField label="Couleur du texte" value={form.text_color} onChange={(v) => setForm((f) => ({ ...f, text_color: v }))} />
            </div>
          )}

          {activeTab === "qr" && (
            <div className="max-w-lg mx-auto space-y-4">
              <h3 className="text-[10px] uppercase tracking-wider" style={{ color: "var(--color-ink-tertiary)" }}>QR Code</h3>
              {qrCode ? (
                <>
                  <div className="flex justify-center">
                    <img
                      src={qrCode.qr_image}
                      alt={`QR Code for ${page.title}`}
                      className="rounded-sm"
                      style={{ width: 240, height: 240 }}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(qrCode.url)}
                      className="flex items-center gap-1 px-3 py-1.5 text-[10px] rounded-sm transition-colors hover:bg-white/5"
                      style={{ border: "1px solid rgba(245,240,235,0.08)", color: "var(--text-primary)" }}
                    >
                      <Copy size={10} /> Copier l'URL
                    </button>
                    <a
                      href={qrCode.qr_image.replace("size=240x240", "size=1024x1024")}
                      download={`qr-${page.slug}.png`}
                      className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-medium rounded-sm transition-opacity hover:opacity-80"
                      style={{ background: "var(--accent)", color: "var(--text-primary)" }}
                    >
                      <Download size={10} /> Télécharger
                    </a>
                  </div>
                  <p className="text-[9px] text-center" style={{ color: "var(--color-ink-tertiary)" }}>
                    {qrCode.url}
                  </p>
                </>
              ) : (
                <div className="flex justify-center py-8">
                  <Loader size={14} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── Preview panel ─── */}
        <div className="w-[420px] shrink-0 overflow-y-auto border-l custom-scrollbar" style={{ borderColor: "rgba(245,240,235,0.06)", backgroundColor: "var(--bg-primary)" }}>
          {/* Preview mode toggle */}
          <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
            <span className="text-[9px] uppercase tracking-wider" style={{ color: "var(--color-ink-tertiary)" }}>Aperçu</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPreviewMode("mobile")}
                className="p-1 rounded-sm transition-colors"
                style={{ color: previewMode === "mobile" ? "var(--accent)" : "var(--color-ink-tertiary)" }}
              >
                <Smartphone size={13} />
              </button>
              <button
                onClick={() => setPreviewMode("desktop")}
                className="p-1 rounded-sm transition-colors"
                style={{ color: previewMode === "desktop" ? "var(--accent)" : "var(--color-ink-tertiary)" }}
              >
                <Monitor size={13} />
              </button>
            </div>
          </div>

          {/* Live preview */}
          <div className="flex justify-center p-4" style={{ backgroundColor: "var(--bg-card)", minHeight: 400 }}>
            <LivePreview
              form={form}
              links={links}
              pageType={page.page_type}
              mode={previewMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Live Preview, renders exactly what the public page looks like
   ═══════════════════════════════════════════════════════════ */
function LivePreview({ form, links, pageType, mode }: {
  form: any;
  links: LeadCaptureLink[];
  pageType: PageType;
  mode: "mobile" | "desktop";
}) {
  const isMobile = mode === "mobile";
  const isLib = pageType === "link_in_bio";

  const bgStyle: React.CSSProperties = form.background_type === "image"
    ? { backgroundImage: `url(${form.background_value})`, backgroundSize: "cover", backgroundPosition: "center" }
    : form.background_type === "video"
    ? { background: "var(--bg-primary)" }
    : { backgroundColor: form.background_value };

  return (
    <div
      className={isMobile ? "rounded-sm overflow-hidden" : "w-full"}
      style={{
        width: isMobile ? 280 : "100%",
        maxWidth: isMobile ? 280 : "100%",
        minHeight: 480,
        ...bgStyle,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div className="flex flex-col items-center px-4 py-8 text-center">
        {/* Avatar */}
        {form.avatar_url ? (
          <img src={form.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover mb-2" />
        ) : (
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-2 text-lg font-bold"
            style={{ backgroundColor: `${form.accent_color}22`, color: form.accent_color }}
          >
            {(form.display_name || "?").charAt(0).toUpperCase()}
          </div>
        )}

        {/* Name */}
        {form.display_name && (
          <p className="text-sm font-semibold mb-0.5" style={{ color: form.text_color }}>{form.display_name}</p>
        )}

        {/* Bio */}
        {form.bio && (
          <p className="text-[11px] mb-4 leading-relaxed" style={{ color: `${form.text_color}99` }}>{form.bio}</p>
        )}

        {/* Links (for link_in_bio) */}
        {isLib && links.filter((l) => l.is_active).map((link) => {
          const brandColor = link.icon ? SOCIAL_BRAND_COLORS[link.icon] : undefined;
          return (
            <a
              key={link.id}
              href={link.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block text-center py-2.5 px-4 mb-2 text-[11px] font-medium rounded-sm transition-opacity hover:opacity-80"
              style={{
                backgroundColor: brandColor ? `${brandColor}15` : `${form.accent_color}15`,
                border: `1px solid ${brandColor ? `${brandColor}30` : `${form.accent_color}30`}`,
                color: brandColor || form.accent_color,
              }}
            >
              {link.label}
            </a>
          );
        })}

        {/* Capture form (for capture_page / popup_form) */}
        {!isLib && (
          <div className="w-full space-y-2">
            {form.headline && (
              <p className="text-sm font-semibold" style={{ color: form.text_color }}>{form.headline}</p>
            )}
            {form.subtitle && (
              <p className="text-[11px]" style={{ color: `${form.text_color}99` }}>{form.subtitle}</p>
            )}

            <div className="space-y-1.5 mt-3">
              {form.collect_first_name && (
                <input
                  placeholder="Prénom"
                  disabled
                  className="w-full px-3 py-2 text-[11px] bg-transparent rounded-sm outline-none"
                  style={{ border: `1px solid ${form.text_color}15`, color: form.text_color }}
                />
              )}
              <input
                placeholder="Email"
                disabled
                className="w-full px-3 py-2 text-[11px] bg-transparent rounded-sm outline-none"
                style={{ border: `1px solid ${form.text_color}15`, color: form.text_color }}
              />
              <button
                disabled
                className="w-full py-2 text-[11px] font-medium rounded-sm opacity-80"
                style={{ backgroundColor: form.accent_color, color: "var(--text-primary)" }}
              >
                {form.cta_text || "Je m'abonne"}
              </button>
            </div>

            <p className="text-[8px] mt-2" style={{ color: `${form.text_color}60` }}>
              {form.consent_text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Field helpers
   ═══════════════════════════════════════════════════════════ */
function Field({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <div>
      <label className="text-[9px] uppercase tracking-wider block mb-0.5" style={{ color: "var(--color-ink-tertiary)" }}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 py-1.5 text-[11px] bg-transparent rounded-sm outline-none"
        style={{ border: "1px solid rgba(245,240,235,0.08)", color: "var(--text-primary)" }}
      />
      {hint && <p className="text-[8px] mt-0.5" style={{ color: "var(--color-ink-tertiary)" }}>{hint}</p>}
    </div>
  );
}

function TextArea({ label, value, onChange, rows }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className="text-[9px] uppercase tracking-wider block mb-0.5" style={{ color: "var(--color-ink-tertiary)" }}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows || 2}
        className="w-full px-2 py-1.5 text-[11px] bg-transparent rounded-sm outline-none resize-none"
        style={{ border: "1px solid rgba(245,240,235,0.08)", color: "var(--text-primary)" }}
      />
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[9px] uppercase tracking-wider block mb-0.5" style={{ color: "var(--color-ink-tertiary)" }}>{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-sm cursor-pointer border-0 p-0"
          style={{ backgroundColor: "transparent" }}
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-1.5 text-[11px] bg-transparent rounded-sm outline-none"
          style={{ border: "1px solid rgba(245,240,235,0.08)", color: "var(--text-primary)" }}
        />
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="text-[9px] uppercase tracking-wider block mb-0.5" style={{ color: "var(--color-ink-tertiary)" }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 py-1.5 text-[11px] bg-transparent rounded-sm outline-none appearance-none cursor-pointer"
        style={{ border: "1px solid rgba(245,240,235,0.08)", color: "var(--text-primary)" }}
      >
        {options.map((o) => (<option key={o.value} value={o.value} style={{ backgroundColor: "var(--bg-primary)" }}>{o.label}</option>))}
      </select>
    </div>
  );
}

function ToggleField({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px]" style={{ color: "var(--text-primary)" }}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        className="transition-colors"
        style={{ color: value ? "var(--accent)" : "var(--color-ink-tertiary)" }}
      >
        {value ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
      </button>
    </div>
  );
}
