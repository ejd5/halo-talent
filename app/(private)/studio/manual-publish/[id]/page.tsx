"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Copy, Check, ExternalLink, Loader, ArrowLeft, Clock, Image, FileText } from "lucide-react";
import Link from "next/link";

interface ManualPublication {
  id: string;
  platform: string;
  content: {
    caption: string;
    media_urls: string[];
    ppv_price?: number;
    ppv_message?: string;
  };
  scheduled_for: string;
  status: string;
  created_at: string;
}

const PLATFORM_LINKS: Record<string, string> = {
  onlyfans: "https://onlyfans.com",
  mym: "https://mym.fans",
  fansly: "https://fansly.com",
};

const PLATFORM_LABELS: Record<string, string> = {
  onlyfans: "OnlyFans",
  mym: "MYM",
  fansly: "Fansly",
};

export default function ManualPublishPage() {
  const params = useParams();
  const id = params.id as string;

  const [publication, setPublication] = useState<ManualPublication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [captionCopied, setCaptionCopied] = useState(false);
  const [mediaCopied, setMediaCopied] = useState<Record<number, boolean>>({});
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/studio/manual-publish/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setPublication(data.data);
      } catch {
        setError("Publication non trouvée");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleCopyCaption = async () => {
    if (!publication) return;
    await navigator.clipboard.writeText(publication.content.caption);
    setCaptionCopied(true);
    await fetch(`/api/studio/manual-publish/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "copied" }),
    });
    setTimeout(() => setCaptionCopied(false), 2000);
  };

  const handleCopyMedia = async (index: number) => {
    if (!publication) return;
    const url = publication.content.media_urls[index];
    await navigator.clipboard.writeText(url);
    setMediaCopied((prev) => ({ ...prev, [index]: true }));
    setTimeout(() => setMediaCopied((prev) => ({ ...prev, [index]: false })), 2000);
  };

  const handleMarkPublished = async () => {
    setPublishing(true);
    await fetch(`/api/studio/manual-publish/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "published" }),
    });
    setPublication((prev) => prev ? { ...prev, status: "published", published_at: new Date().toISOString() } : null);
    setPublishing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader size={16} className="animate-spin" style={{ color: "rgba(255,255,255,0.3)" }} />
      </div>
    );
  }

  if (error || !publication) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 animate-fade-in">
        <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>{error || "Introuvable"}</p>
        <Link href="/studio" className="flex items-center gap-1.5 text-xs" style={{ color: "var(--accent)" }}>
          <ArrowLeft size={14} /> Retour au Studio
        </Link>
      </div>
    );
  }

  const scheduledDate = new Date(publication.scheduled_for);
  const platformUrl = PLATFORM_LINKS[publication.platform] || "#";
  const platformLabel = PLATFORM_LABELS[publication.platform] || publication.platform;
  const isDone = publication.status === "published" || publication.status === "cancelled";

  return (
    <div className="animate-fade-in max-w-2xl mx-auto p-4 md:p-8">
      <Link href="/studio/scheduled" className="inline-flex items-center gap-1.5 text-xs mb-6 transition-opacity hover:opacity-70" style={{ color: "rgba(255,255,255,0.4)" }}>
        <ArrowLeft size={14} /> Retour
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl italic mb-1" style={{ fontFamily: "var(--font-studio)", color: "var(--text-primary)" }}>
            Publier sur {platformLabel}
          </h1>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            <Clock size={10} className="inline mr-1" />
            {scheduledDate.toLocaleDateString()} à {scheduledDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <div
          className="text-[10px] px-2 py-1 rounded-sm"
          style={{
            background: isDone ? "rgba(34,197,94,0.1)" : "rgba(199,91,57,0.1)",
            color: isDone ? "var(--success)" : "var(--accent)",
            border: `1px solid ${isDone ? "rgba(34,197,94,0.2)" : "rgba(199,91,57,0.2)"}`,
          }}
        >
          {isDone ? "Publié" : "À publier"}
        </div>
      </div>

      <div className="space-y-4">
        {/* Caption */}
        <div className="p-4 rounded-sm" style={{ border: "1px solid var(--border-default)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
              <FileText size={10} /> Caption
            </span>
            <button
              onClick={handleCopyCaption}
              className="flex items-center gap-1 px-2 py-1 text-[10px] transition-all rounded-sm"
              style={{
                border: "1px solid var(--accent-border)",
                color: captionCopied ? "var(--success)" : "var(--accent)",
              }}
            >
              {captionCopied ? <Check size={10} /> : <Copy size={10} />}
              {captionCopied ? "Copié !" : "Copier"}
            </button>
          </div>
          <p className="text-sm whitespace-pre-wrap" style={{ color: "var(--text-primary)" }}>
            {publication.content.caption}
          </p>
        </div>

        {/* Media */}
        {publication.content.media_urls.length > 0 && (
          <div className="p-4 rounded-sm" style={{ border: "1px solid var(--border-default)" }}>
            <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
              <Image size={10} /> Médias ({publication.content.media_urls.length})
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {publication.content.media_urls.map((url, i) => (
                <div key={i} className="relative group rounded-sm overflow-hidden" style={{ border: "1px solid var(--border-default)" }}>
                  <img src={url} alt={`Media ${i + 1}`} className="w-full aspect-square object-cover" />
                  <button
                    onClick={() => handleCopyMedia(i)}
                    className="absolute top-1 right-1 p-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "rgba(0,0,0,0.7)" }}
                  >
                    {mediaCopied[i] ? <Check size={10} style={{ color: "var(--success)" }} /> : <Copy size={10} style={{ color: "var(--text-primary)" }} />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PPV info */}
        {publication.content.ppv_price && (
          <div
            className="flex items-center gap-2 px-3 py-2 text-xs rounded-sm"
            style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)", color: "var(--accent)" }}
          >
            PPV · {publication.content.ppv_price}€
            {publication.content.ppv_message && `, ${publication.content.ppv_message}`}
          </div>
        )}

        {/* Actions */}
        {!isDone && (
          <div className="flex items-center gap-2 pt-2">
            <a
              href={platformUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 text-xs transition-opacity hover:opacity-80 rounded-sm"
              style={{ background: "var(--accent)", color: "var(--text-primary)" }}
            >
              <ExternalLink size={12} />
              Ouvrir {platformLabel}
            </a>
            <button
              onClick={handleMarkPublished}
              disabled={publishing}
              className="flex items-center gap-1.5 px-3 py-2 text-xs transition-opacity hover:opacity-80 rounded-sm disabled:opacity-30"
              style={{ border: "1px solid rgba(34,197,94,0.2)", color: "var(--success)" }}
            >
              {publishing ? <Loader size={12} className="animate-spin" /> : <Check size={12} />}
              J'ai publié
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
