"use client";

import {
  Upload, Layout, Type, Sticker, Sparkles, Music, Download,
  Loader, Save, Mic, Scissors,
} from "lucide-react";

interface Props {
  onImportMedia: () => void;
  onAddText: () => void;
  onOpenStickers: () => void;
  onOpenEffects: () => void;
  onOpenAudio: () => void;
  onOpenTemplates: () => void;
  onOpenCaptions: () => void;
  onExport: () => void;
  onSplit: () => void;
  exporting: boolean;
  onSave: () => void;
  hasUnsaved: boolean;
  hasSelection: boolean;
}

export function EditorToolbar({
  onImportMedia, onAddText, onOpenStickers, onOpenEffects,
  onOpenAudio, onOpenTemplates, onOpenCaptions,
  onExport, onSplit, exporting, onSave, hasUnsaved, hasSelection,
}: Props) {
  return (
    <div
      className="flex items-center gap-0.5 px-3 shrink-0 overflow-x-auto"
      style={{
        height: 48,
        background: "var(--bg-primary)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <ToolbarButton icon={Upload} label="Importer" onClick={onImportMedia} />
      <ToolbarDivider />
      <ToolbarButton icon={Layout} label="Templates" onClick={onOpenTemplates} />
      <ToolbarDivider />
      <ToolbarButton icon={Type} label="Texte" onClick={onAddText} />
      <ToolbarButton icon={Sticker} label="Stickers" onClick={onOpenStickers} />
      <ToolbarButton icon={Sparkles} label="Effets" onClick={onOpenEffects} />
      <ToolbarButton icon={Music} label="Audio" onClick={onOpenAudio} />
      <ToolbarButton icon={Mic} label="Sous-titres" onClick={onOpenCaptions} />
      <ToolbarDivider />
      <ToolbarButton icon={Scissors} label="Split" onClick={onSplit} disabled={!hasSelection} />
      <ToolbarDivider />

      <div className="flex-1" />

      {hasUnsaved && (
        <ToolbarButton icon={Save} label="Sauvegarder" onClick={onSave} />
      )}
      <ToolbarButton
        icon={exporting ? Loader : Download}
        label={exporting ? "Export..." : "Export"}
        onClick={onExport}
        disabled={exporting}
        accent
      />
    </div>
  );
}

function ToolbarButton({ icon: Icon, label, onClick, disabled, accent }: { icon: any; label: string; onClick?: () => void; disabled?: boolean; accent?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] whitespace-nowrap transition-colors hover:bg-white/5 disabled:opacity-30 rounded-sm"
      style={{ color: accent ? "var(--text-primary)" : "rgba(255,255,255,0.6)", background: accent ? "var(--accent)" : "transparent" }}
    >
      {disabled && Icon === Loader ? <Loader size={13} className="animate-spin" /> : <Icon size={13} />}
      {label}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-5 mx-1" style={{ background: "rgba(255,255,255,0.06)" }} />;
}
