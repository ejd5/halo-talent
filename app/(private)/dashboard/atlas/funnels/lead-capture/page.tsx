"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus, Loader, ExternalLink, Eye, Copy, QrCode,
  Palette, MousePointerClick, BarChart3, Globe, Smartphone,
  Layout, PenSquare, Pause, Play,
} from "lucide-react";
import { PAGE_TEMPLATES, generateQRUrl } from "@/lib/atlas/lead-capture/types";
import type { LeadCapturePage, PageType } from "@/lib/atlas/lead-capture/types";

const TYPE_LABELS: Record<PageType, string> = {
  link_in_bio: "Link in Bio",
  capture_page: "Page de capture",
  popup_form: "Pop-up",
};

const TYPE_ICONS: Record<PageType, any> = {
  link_in_bio: Layout,
  capture_page: PenSquare,
  popup_form: Globe,
};

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  active:  { label: "Actif",    color: "var(--success)", bg: "rgba(16,185,129,0.1)" },
  paused:  { label: "En pause", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  draft:   { label: "Brouillon", color: "rgba(255,255,255,0.4)", bg: "rgba(255,255,255,0.05)" },
};

export default function LeadCapturePage() {
  const [pages, setPages] = useState<LeadCapturePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => { fetchPages(); }, []);

  async function fetchPages() {
    try {
      const res = await fetch("/api/dashboard/atlas/lead-capture");
      const d = await res.json();
      setPages(d.pages ?? []);
    } catch {} finally { setLoading(false); }
  }

  async function createFromTemplate(template: typeof PAGE_TEMPLATES[number]) {
    try {
      const res = await fetch("/api/dashboard/atlas/lead-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_type: template.page_type,
          title: template.name,
          template: template.config,
        }),
      });
      const d = await res.json();
      if (d.page) {
        setPages((prev) => [d.page, ...prev]);
        setShowTemplates(false);
      }
    } catch {}
  }

  async function toggleStatus(page: LeadCapturePage) {
    const newStatus = page.status === "active" ? "paused" : page.status === "draft" ? "active" : "active";
    try {
      await fetch(`/api/dashboard/atlas/lead-capture/${page.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setPages((prev) => prev.map((p) => p.id === page.id ? { ...p, status: newStatus as LeadCapturePage["status"] } : p));
    } catch {}
  }

  async function deletePage(id: string) {
    if (!confirm("Supprimer cette page ?")) return;
    try {
      await fetch(`/api/dashboard/atlas/lead-capture/${id}`, { method: "DELETE" });
      setPages((prev) => prev.filter((p) => p.id !== id));
    } catch {}
  }

  function copyUrl(page: LeadCapturePage) {
    const url = `${window.location.origin}/${page.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(page.id);
    setTimeout(() => setCopiedSlug(null), 2000);
  }

  const totalViews = pages.reduce((s, p) => s + (p.views || 0), 0);
  const totalConvs = pages.reduce((s, p) => s + (p.conversions || 0), 0);
  const activePages = pages.filter((p) => p.status === "active").length;
  const convRate = totalViews > 0 ? ((totalConvs / totalViews) * 100).toFixed(1) : ", ";

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Pages de capture
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-ink-secondary)" }}>
            {pages.length} page{pages.length > 1 ? "s" : ""} · {activePages} active{activePages > 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-sm transition-opacity hover:opacity-80"
          style={{ background: "var(--accent)", color: "var(--text-primary)" }}
        >
          <Plus size={14} /> Créer une page
        </button>
      </div>

      {/* ─── KPIs ─── */}
      {pages.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Eye, label: "Vues totales", value: totalViews.toLocaleString("fr-FR") },
            { icon: MousePointerClick, label: "Conversions", value: totalConvs.toLocaleString("fr-FR") },
            { icon: BarChart3, label: "Taux de conversion", value: typeof convRate === "string" ? convRate : `${convRate}%` },
          ].map((kpi) => (
            <div key={kpi.label} className="p-3" style={{ backgroundColor: "var(--bg-card)", border: "1px solid rgba(245,240,235,0.06)" }}>
              <div className="flex items-center gap-2 mb-1">
                <kpi.icon size={12} style={{ color: "var(--color-ink-tertiary)" }} />
                <span className="text-[0.6rem] uppercase tracking-[0.1em]" style={{ color: "var(--color-ink-tertiary)" }}>{kpi.label}</span>
              </div>
              <p className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                {kpi.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ─── Loading ─── */}
      {loading && (
        <div className="flex justify-center py-20">
          <Loader size={16} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} />
        </div>
      )}

      {/* ─── Empty state ─── */}
      {!loading && pages.length === 0 && !showTemplates && (
        <div className="flex flex-col items-center py-20 text-center">
          <Layout size={36} style={{ color: "rgba(255,255,255,0.05)" }} />
          <p className="text-sm mt-4" style={{ color: "rgba(255,255,255,0.2)" }}>Aucune page de capture</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.1)" }}>
            Crée ta première page, link-in-bio, newsletter, ou pop-up d'inscription
          </p>
          <button
            onClick={() => setShowTemplates(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-sm mt-6 transition-opacity hover:opacity-80"
            style={{ background: "var(--accent)", color: "var(--text-primary)" }}
          >
            <Plus size={14} /> Créer une page
          </button>
        </div>
      )}

      {/* ─── Templates ─── */}
      {showTemplates && (
        <div className="p-4 border" style={{ borderColor: "rgba(245,240,235,0.06)", backgroundColor: "var(--bg-card)" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-ink-tertiary)" }}>
              Choisir un template
            </h3>
            <button onClick={() => setShowTemplates(false)} className="text-[10px]" style={{ color: "var(--color-ink-tertiary)" }}>
              Annuler
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {PAGE_TEMPLATES.map((tpl, i) => (
              <button
                key={i}
                onClick={() => createFromTemplate(tpl)}
                className="p-3 text-left rounded-sm transition-all hover:bg-white/5"
                style={{ border: "1px solid rgba(245,240,235,0.06)" }}
              >
                <span className="text-lg">{tpl.thumbnail}</span>
                <span className="block text-sm font-medium mt-1" style={{ color: "var(--text-primary)" }}>{tpl.name}</span>
                <p className="text-[10px] mt-0.5" style={{ color: "var(--color-ink-tertiary)" }}>{tpl.description}</p>
                <span className="inline-block mt-2 text-[9px] px-1.5 py-0.5 rounded-sm" style={{ background: "rgba(199,91,57,0.1)", color: "var(--accent)" }}>
                  {TYPE_LABELS[tpl.page_type]}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Pages list ─── */}
      {!loading && pages.length > 0 && (
        <div className="space-y-2">
          {pages.map((page) => {
            const st = STATUS_STYLES[page.status] || STATUS_STYLES.draft;
            const TypeIcon = TYPE_ICONS[page.page_type] || Layout;
            const convPct = page.views > 0 ? ((page.conversions / page.views) * 100).toFixed(1) : ", ";
            return (
              <div
                key={page.id}
                className="flex items-center gap-3 p-4 border transition-colors"
                style={{ borderColor: "rgba(245,240,235,0.06)", backgroundColor: "var(--bg-card)" }}
              >
                {/* Type icon */}
                <div className="w-9 h-9 flex items-center justify-center rounded-sm shrink-0" style={{ backgroundColor: "var(--accent-soft)" }}>
                  <TypeIcon size={16} style={{ color: "var(--accent)" }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/atlas/funnels/lead-capture/${page.id}`} className="hover:opacity-70 transition-opacity">
                      <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{page.title}</span>
                    </Link>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-sm" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-sm" style={{ background: "rgba(91,143,168,0.1)", color: "#5B8FA8" }}>
                      {TYPE_LABELS[page.page_type]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[9px]" style={{ color: "var(--color-ink-tertiary)" }}>
                    <span>/{page.slug}</span>
                    <span>{page.views} vues</span>
                    <span>{page.conversions} conversions</span>
                    <span>{convPct}%</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => copyUrl(page)}
                    className="p-1.5 rounded-sm transition-colors hover:bg-white/5"
                    title="Copier l'URL"
                  >
                    {copiedSlug === page.id
                      ? <span className="text-[9px] text-green-400">Copié!</span>
                      : <Copy size={13} style={{ color: "var(--color-ink-tertiary)" }} />
                    }
                  </button>
                  <Link
                    href={`/${page.slug}`}
                    target="_blank"
                    className="p-1.5 rounded-sm transition-colors hover:bg-white/5"
                    title="Voir la page"
                  >
                    <ExternalLink size={13} style={{ color: "var(--color-ink-tertiary)" }} />
                  </Link>
                  <Link
                    href={`/dashboard/atlas/funnels/lead-capture/${page.id}`}
                    className="p-1.5 rounded-sm transition-colors hover:bg-white/5"
                    title="Éditer"
                  >
                    <Palette size={13} style={{ color: "var(--color-ink-tertiary)" }} />
                  </Link>
                  <button
                    onClick={() => toggleStatus(page)}
                    className="p-1.5 rounded-sm transition-colors hover:bg-white/5"
                    title={page.status === "active" ? "Mettre en pause" : "Activer"}
                  >
                    {page.status === "active"
                      ? <Pause size={13} style={{ color: "#F59E0B" }} />
                      : <Play size={13} style={{ color: "var(--success)" }} />
                    }
                  </button>
                  <Link
                    href={`/dashboard/atlas/funnels/lead-capture/${page.id}?tab=qr`}
                    className="p-1.5 rounded-sm transition-colors hover:bg-white/5"
                    title="QR Code"
                  >
                    <QrCode size={13} style={{ color: "var(--color-ink-tertiary)" }} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
