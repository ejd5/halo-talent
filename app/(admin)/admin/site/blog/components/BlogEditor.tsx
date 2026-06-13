"use client";

import { useState } from "react";
import { ArrowLeft, Save, Sparkles, Wand2, Tags, FileText, Search } from "lucide-react";
import type { BlogPost } from "../../types";
import { TextEditor } from "../../pages/components/TextEditor";
import { blogPosts } from "../../data";

const ALL_TAGS = [...new Set(blogPosts.flatMap((p) => p.tags))].sort();
const ALL_CATEGORIES = [...new Set(blogPosts.map((p) => p.category))].sort();

export function BlogEditor({
  post,
  onSave,
  onBack,
}: {
  post: BlogPost;
  onSave: (post: BlogPost) => void;
  onBack: () => void;
}) {
  const [form, setForm] = useState(post);
  const [saving, setSaving] = useState(false);

  const update = (partial: Partial<BlogPost>) => setForm((prev) => ({ ...prev, ...partial }));

  const handleSave = (status: BlogPost["status"]) => {
    setSaving(true);
    update({
      status,
      updated_at: new Date().toISOString(),
      published_at: status === "published" ? (form.published_at || new Date().toISOString()) : form.published_at,
    });
    // Simulate save delay
    setTimeout(() => {
      onSave({ ...form, status, updated_at: new Date().toISOString() });
      setSaving(false);
    }, 100);
  };

  return (
    <div className="flex flex-col h-full card-accent">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 hover:bg-[var(--color-card)] transition-colors rounded-[0px]">
            <ArrowLeft size={16} />
          </button>
          <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            {form.id.startsWith("post-") && !form.id.includes("post-") ? "Nouvel article" : "Éditer l'article"}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[var(--color-border)] hover:bg-[var(--color-card)] transition-colors rounded-[0px] disabled:opacity-30"
          >
            <Save size={12} />
            Brouillon
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity rounded-[0px] disabled:opacity-30"
          >
            <Save size={12} />
            Publier
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-1 block">Titre principal</label>
            <div className="flex gap-2">
              <input
                type="text" value={form.title}
                onChange={(e) => update({ title: e.target.value })}
                placeholder="Titre de l'article..."
                className="flex-1 p-3 text-lg font-semibold border border-[var(--color-border)] bg-transparent rounded-[0px] focus:outline-none focus:border-[var(--color-accent)]"
                style={{ fontFamily: "var(--font-display)" }}
              />
              <AIActionButton icon={<Search size={14} />} label="Suggérer titres" onClick={() => {
                const suggestions = [
                  "Comment l'IA transforme le management créateur",
                  "5 secrets pour booster votre engagement",
                  "Le guide ultime des commissions transparentes",
                  "Pourquoi les créateurs choisissent Where Talent Forms",
                  "2026 : les tendances qui vont tout changer",
                ];
                alert("Titres suggérés par Claude IA :\n\n• " + suggestions.join("\n• "));
              }} />
            </div>
          </div>

          {/* Subtitle */}
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-1 block">Sous-titre</label>
            <input
              type="text" value={form.subtitle}
              onChange={(e) => update({ subtitle: e.target.value })}
              placeholder="Sous-titre..."
              className="w-full p-2 text-sm border border-[var(--color-border)] bg-transparent rounded-[0px] focus:outline-none"
            />
          </div>

          {/* Cover + Author + Category + Tags row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-1 block">Image de couverture (URL)</label>
              <input type="text" value={form.cover_url ?? ""} onChange={(e) => update({ cover_url: e.target.value || null })} placeholder="/mock/blog-cover.jpg" className="w-full p-2 text-xs border border-[var(--color-border)] bg-transparent rounded-[0px]" />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-1 block">Auteur</label>
              <input type="text" value={form.author} onChange={(e) => update({ author: e.target.value })} className="w-full p-2 text-xs border border-[var(--color-border)] bg-transparent rounded-[0px]" />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-1 block">Catégorie</label>
              <div className="flex gap-1 flex-wrap">
                {ALL_CATEGORIES.map((c) => (
                  <button key={c} onClick={() => update({ category: c })} className={`px-2 py-1 text-[10px] font-medium border transition-colors ${form.category === c ? "border-[var(--color-accent)] text-[var(--color-accent)]" : "border-[var(--color-border)] hover:bg-[var(--color-card)]"}`}>{c}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-1 block">Tags</label>
              <div className="flex gap-1 flex-wrap">
                {ALL_TAGS.map((t) => (
                  <button key={t} onClick={() => update({ tags: form.tags.includes(t) ? form.tags.filter((x) => x !== t) : [...form.tags, t] })} className={`px-2 py-1 text-[10px] font-medium border transition-colors ${form.tags.includes(t) ? "border-[var(--color-accent)] text-[var(--color-accent)]" : "border-[var(--color-border)] hover:bg-[var(--color-card)]"}`}>#{t}</button>
                ))}
                <AIActionButton icon={<Tags size={10} />} label="Suggérer" onClick={() => {
                  const suggestions = ["marketing", "stratégie", "créateurs"];
                  update({ tags: [...new Set([...form.tags, ...suggestions])] });
                }} />
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider opacity-40">Contenu</label>
              <AIActionButton icon={<Wand2 size={12} />} label="Améliorer le contenu" onClick={() => {
                const improved = form.content + "\n\n> Paragraphe amélioré par l'IA, ajoutez des transitions, des exemples concrets et une structure claire.";
                update({ content: improved });
              }} />
            </div>
            <TextEditor
              value={form.content}
              onChange={(v) => update({ content: v })}
              minHeight={400}
              placeholder="Écrivez votre article en markdown..."
            />
          </div>

          {/* SEO */}
          <div className="border border-[var(--color-border)] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-semibold uppercase tracking-wider opacity-40">SEO</h3>
              <div className="flex gap-1">
                <AIActionButton icon={<Sparkles size={10} />} label="Générer résumé" onClick={() => {
                  const seo = form.subtitle || form.title.slice(0, 150);
                  update({ seo_description: seo });
                }} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-1 block">Meta title</label>
              <input type="text" value={form.seo_title} onChange={(e) => update({ seo_title: e.target.value })} className="w-full p-2 text-xs border border-[var(--color-border)] bg-transparent rounded-[0px]" />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-1 block">Meta description</label>
              <textarea value={form.seo_description} onChange={(e) => update({ seo_description: e.target.value })} rows={2} className="w-full p-2 text-xs border border-[var(--color-border)] bg-transparent rounded-[0px] resize-none" />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-1 block">SEO Image URL</label>
              <input type="text" value={form.seo_image ?? ""} onChange={(e) => update({ seo_image: e.target.value || null })} className="w-full p-2 text-xs border border-[var(--color-border)] bg-transparent rounded-[0px]" />
            </div>
          </div>

          {/* Scheduling */}
          <div className="flex items-center gap-4 border border-[var(--color-border)] p-3">
            <label className="text-[10px] font-semibold uppercase tracking-wider opacity-40">Publication planifiée</label>
            <input
              type="datetime-local"
              value={form.scheduled_at ? form.scheduled_at.slice(0, 16) : ""}
              onChange={(e) => update({ scheduled_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
              className="px-2 py-1 text-xs border border-[var(--color-border)] bg-transparent rounded-[0px]"
            />
            {form.scheduled_at && (
              <span className="text-[10px] text-[var(--color-accent)]">Programmé</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AIActionButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-2 py-1 text-[9px] font-medium border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all shrink-0"
    >
      {icon}
      {label}
    </button>
  );
}
