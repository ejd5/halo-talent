"use client";

import { useState, useCallback } from "react";
import { ArrowLeft, Save, SendHorizonal } from "lucide-react";
import { sitePages as initialPages } from "../../data";
import type { SitePage, SiteBlock, PageVersion, LangCode } from "../../types";
import { PageList } from "./PageList";
import { BlockEditor } from "./BlockEditor";
import { BlockPreview } from "./BlockPreview";
import { TranslationPanel } from "./TranslationPanel";
import { PublishModal } from "./PublishModal";
import { VersionHistory } from "./VersionHistory";

export function SitePagesPage() {
  const [pages, setPages] = useState(initialPages);
  const [editingPage, setEditingPage] = useState<SitePage | null>(null);
  const [currentLang, setCurrentLang] = useState<LangCode>("fr");
  const [showPublishModal, setShowPublishModal] = useState<"publish" | "draft" | null>(null);

  // Translation tracking
  const missingTranslations: LangCode[] = ["en", "es"]; // mock: always missing

  const handleEdit = useCallback((page: SitePage) => {
    setEditingPage({ ...page, blocks: page.blocks.map((b) => ({ ...b })) });
  }, []);

  const handleBack = useCallback(() => {
    setEditingPage(null);
    setShowPublishModal(null);
  }, []);

  const handleBlocksChange = useCallback((blocks: SiteBlock[]) => {
    setEditingPage((prev) => prev ? { ...prev, blocks } : null);
  }, []);

  const handleSave = useCallback((note: string) => {
    if (!editingPage) return;
    const mode = showPublishModal;
    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== editingPage.id) return p;
        const newVersion: PageVersion = {
          id: `v-${p.id}-${p.versions.length + 1}`,
          saved_at: new Date().toISOString(),
          saved_by: "Admin",
          blocks: editingPage.blocks,
          note,
        };
        return {
          ...p,
          status: mode === "publish" ? "published" as const : "draft" as const,
          blocks: editingPage.blocks,
          versions: [...p.versions, newVersion],
          updated_at: new Date().toISOString(),
          updated_by: "Admin",
        };
      })
    );
    setShowPublishModal(null);
    setEditingPage(null);
  }, [editingPage, showPublishModal]);

  const handleRevert = useCallback((version: PageVersion) => {
    if (!editingPage) return;
    setEditingPage((prev) => prev ? { ...prev, blocks: version.blocks.map((b) => ({ ...b })) } : null);
  }, []);

  const handleTranslateAll = useCallback(() => {
    // Mock: would call API
    alert("Traduction IA déclenchée (simulation)");
  }, []);

  // Page list view
  if (!editingPage) {
    return (
      <div className="flex flex-col gap-4 p-6 card-accent" style={{ background: "#0A0908" }}>
        <div>
          <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Pages du site</h1>
          <p className="text-xs opacity-40 mt-0.5">{pages.length} pages · Gérez le contenu de votre site marketing</p>
        </div>
        <PageList pages={pages} onEdit={handleEdit} />
      </div>
    );
  }

  // Editor view
  return (
    <div className="flex flex-col h-full card-accent" style={{ background: "#0A0908" }}>
      {/* Editor top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="p-1 hover:bg-[var(--color-card)] transition-colors rounded-[0px]">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              {editingPage.title_fr}
            </h2>
            <span className="text-[10px] opacity-30 font-mono">/{editingPage.slug}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TranslationPanel
            currentLang={currentLang}
            onLangChange={setCurrentLang}
            missingTranslations={missingTranslations}
            onTranslateAll={handleTranslateAll}
          />
          <button
            onClick={() => setShowPublishModal("draft")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[var(--color-border)] hover:bg-[var(--color-card)] transition-colors rounded-[0px]"
          >
            <Save size={12} />
            Brouillon
          </button>
          <button
            onClick={() => setShowPublishModal("publish")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity rounded-[0px]"
          >
            <SendHorizonal size={12} />
            Publier
          </button>
        </div>
      </div>

      {/* Split content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: editor */}
        <div className="w-1/2 overflow-y-auto border-r border-[var(--color-border)] p-5 space-y-4">
          <BlockEditor blocks={editingPage.blocks} onChange={handleBlocksChange} />
          <VersionHistory versions={editingPage.versions} onRevert={handleRevert} />
        </div>

        {/* Right: preview */}
        <div className="w-1/2 overflow-y-auto">
          <div className="sticky top-0 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider opacity-30 border-b border-[var(--color-border)]" style={{ backgroundColor: "var(--color-base)" }}>
            Aperçu en temps réel
          </div>
          <div>
            {editingPage.blocks.map((block, i) => (
              <div key={block.id} className="border-b border-[var(--color-border)]">
                <div className="px-3 py-1 text-[8px] font-mono opacity-20">#{i + 1} {block.type}</div>
                <BlockPreview block={block} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Publish modals */}
      {showPublishModal && (
        <PublishModal
          blocks={editingPage.blocks}
          mode={showPublishModal}
          onConfirm={handleSave}
          onClose={() => setShowPublishModal(null)}
        />
      )}
    </div>
  );
}
