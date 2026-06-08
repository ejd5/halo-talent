"use client";

import { useState } from "react";
import { GripVertical, Plus, Settings, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import type { SiteBlock, BlockType } from "../../types";
import { BLOCK_LABELS } from "../../types";

const BLOCK_TYPES: BlockType[] = ["hero", "editorial", "grid", "citation", "gallery", "cta", "table", "custom_html"];

export function BlockEditor({
  blocks,
  onChange,
}: {
  blocks: SiteBlock[];
  onChange: (blocks: SiteBlock[]) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const updateBlock = (id: string, content: Record<string, unknown>) => {
    onChange(blocks.map((b) => (b.id === id ? { ...b, content } : b)));
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter((b) => b.id !== id));
  };

  const addBlock = (type: BlockType) => {
    const newBlock: SiteBlock = {
      id: `blk-${Date.now()}`,
      type,
      content: {},
      order: blocks.length,
    };
    onChange([...blocks, newBlock]);
    setExpandedId(newBlock.id);
  };

  const moveBlock = (id: string, dir: "up" | "down") => {
    const idx = blocks.findIndex((b) => b.id === id);
    if (dir === "up" && idx === 0) return;
    if (dir === "down" && idx === blocks.length - 1) return;
    const next = [...blocks];
    const swap = dir === "up" ? idx - 1 : idx + 1;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    onChange(next.map((b, i) => ({ ...b, order: i })));
  };

  return (
    <div className="space-y-2">
      <div className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-3">Blocs ({blocks.length})</div>

      {blocks.map((block, i) => (
        <div key={block.id} className="border border-[var(--color-border)]">
          {/* Block header */}
          <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-card)]">
            <GripVertical size={14} className="opacity-20 cursor-grab" />
            <span className="text-[10px] font-semibold uppercase tracking-wider opacity-50 flex-1">
              {BLOCK_LABELS[block.type]}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => moveBlock(block.id, "up")} className="p-0.5 hover:opacity-60 transition-opacity" disabled={i === 0}>
                <ChevronUp size={12} className="opacity-40" />
              </button>
              <button onClick={() => moveBlock(block.id, "down")} className="p-0.5 hover:opacity-60 transition-opacity" disabled={i === blocks.length - 1}>
                <ChevronDown size={12} className="opacity-40" />
              </button>
              <button onClick={() => setExpandedId(expandedId === block.id ? null : block.id)} className="p-0.5 hover:opacity-60 transition-opacity">
                <Settings size={12} className="opacity-40" />
              </button>
              <button onClick={() => removeBlock(block.id)} className="p-0.5 hover:opacity-60 transition-opacity">
                <Trash2 size={12} className="opacity-30 hover:text-red-400" />
              </button>
            </div>
          </div>

          {/* Expanded editor */}
          {expandedId === block.id && (
            <div className="p-3 border-t border-[var(--color-border)] space-y-3">
              <BlockContentEditor block={block} onUpdate={(c) => updateBlock(block.id, c)} />
            </div>
          )}
        </div>
      ))}

      {/* Add block */}
      <div className="relative group">
        <div className="border border-dashed border-[var(--color-border)] p-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-medium uppercase tracking-wider opacity-30 mr-1">Ajouter :</span>
            {BLOCK_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => addBlock(type)}
                className="text-[10px] px-2 py-1 border border-[var(--color-border)] opacity-40 hover:opacity-100 hover:border-[var(--color-accent)] transition-all"
              >
                {BLOCK_LABELS[type]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BlockContentEditor({ block, onUpdate }: { block: SiteBlock; onUpdate: (content: Record<string, unknown>) => void }) {
  const c = block.content;

  switch (block.type) {
    case "hero":
      return (
        <div className="space-y-2">
          <Input label="Titre" value={(c.title as string) ?? ""} onChange={(v) => onUpdate({ ...c, title: v })} />
          <Input label="Sous-titre" value={(c.subtitle as string) ?? ""} onChange={(v) => onUpdate({ ...c, subtitle: v })} />
          <Input label="URL image" value={(c.image as string) ?? ""} onChange={(v) => onUpdate({ ...c, image: v })} />
          <Input label="Texte CTA" value={(c.cta_text as string) ?? ""} onChange={(v) => onUpdate({ ...c, cta_text: v })} />
          <Input label="Lien CTA" value={(c.cta_link as string) ?? ""} onChange={(v) => onUpdate({ ...c, cta_link: v })} />
        </div>
      );

    case "editorial":
      return (
        <div className="space-y-2">
          <Input label="Titre" value={(c.title as string) ?? ""} onChange={(v) => onUpdate({ ...c, title: v })} />
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider opacity-40 block mb-1">Corps</label>
            <textarea
              value={(c.body as string) ?? ""}
              onChange={(e) => onUpdate({ ...c, body: e.target.value })}
              rows={6}
              className="w-full p-2 text-xs border border-[var(--color-border)] bg-transparent rounded-[0px] font-mono resize-y"
            />
          </div>
        </div>
      );

    case "grid":
      return (
        <div className="space-y-2">
          <Input label="Titre" value={(c.title as string) ?? ""} onChange={(v) => onUpdate({ ...c, title: v })} />
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider opacity-40 block mb-1">Cards (JSON)</label>
            <textarea
              value={JSON.stringify(c.cards ?? [], null, 2)}
              onChange={(e) => {
                try { onUpdate({ ...c, cards: JSON.parse(e.target.value) }); } catch {}
              }}
              rows={4}
              className="w-full p-2 text-xs border border-[var(--color-border)] bg-transparent rounded-[0px] font-mono resize-y"
            />
          </div>
        </div>
      );

    case "citation":
      return (
        <div className="space-y-2">
          <Input label="Citation" value={(c.text as string) ?? ""} onChange={(v) => onUpdate({ ...c, text: v })} />
          <Input label="Auteur" value={(c.author as string) ?? ""} onChange={(v) => onUpdate({ ...c, author: v })} />
        </div>
      );

    case "gallery":
      return (
        <div className="space-y-2">
          <Input label="Titre" value={(c.title as string) ?? ""} onChange={(v) => onUpdate({ ...c, title: v })} />
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider opacity-40 block mb-1">Images (JSON array)</label>
            <textarea
              value={JSON.stringify(c.images ?? [], null, 2)}
              onChange={(e) => {
                try { onUpdate({ ...c, images: JSON.parse(e.target.value) }); } catch {}
              }}
              rows={3}
              className="w-full p-2 text-xs border border-[var(--color-border)] bg-transparent rounded-[0px] font-mono resize-y"
            />
          </div>
        </div>
      );

    case "cta":
      return (
        <div className="space-y-2">
          <Input label="Texte" value={(c.text as string) ?? ""} onChange={(v) => onUpdate({ ...c, text: v })} />
          <Input label="Bouton" value={(c.button_text as string) ?? ""} onChange={(v) => onUpdate({ ...c, button_text: v })} />
          <Input label="Lien" value={(c.button_link as string) ?? ""} onChange={(v) => onUpdate({ ...c, button_link: v })} />
        </div>
      );

    case "table":
      return (
        <div className="space-y-2">
          <Input label="Titre" value={(c.title as string) ?? ""} onChange={(v) => onUpdate({ ...c, title: v })} />
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider opacity-40 block mb-1">Headers (JSON array)</label>
            <input
              value={JSON.stringify(c.headers ?? [])}
              onChange={(e) => {
                try { onUpdate({ ...c, headers: JSON.parse(e.target.value) }); } catch {}
              }}
              className="w-full p-2 text-xs border border-[var(--color-border)] bg-transparent rounded-[0px] font-mono"
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider opacity-40 block mb-1">Rows (JSON array of arrays)</label>
            <textarea
              value={JSON.stringify(c.rows ?? [], null, 2)}
              onChange={(e) => {
                try { onUpdate({ ...c, rows: JSON.parse(e.target.value) }); } catch {}
              }}
              rows={4}
              className="w-full p-2 text-xs border border-[var(--color-border)] bg-transparent rounded-[0px] font-mono resize-y"
            />
          </div>
        </div>
      );

    case "custom_html":
      return (
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider opacity-40 block mb-1">HTML</label>
          <textarea
            value={(c.html as string) ?? ""}
            onChange={(e) => onUpdate({ ...c, html: e.target.value })}
            rows={6}
            className="w-full p-2 text-xs border border-[var(--color-border)] bg-transparent rounded-[0px] font-mono resize-y"
          />
        </div>
      );

    default:
      return <p className="text-xs opacity-30">Éditeur non disponible</p>;
  }
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-wider opacity-40 block mb-0.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 text-xs border border-[var(--color-border)] bg-transparent rounded-[0px]"
      />
    </div>
  );
}
