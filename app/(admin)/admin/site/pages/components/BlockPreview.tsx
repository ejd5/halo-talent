"use client";

import type { SiteBlock } from "../../types";

export function BlockPreview({ block }: { block: SiteBlock }) {
  const c = block.content as any;

  switch (block.type) {
    case "hero":
      return (
        <div className="relative min-h-[200px] flex items-center justify-center p-8 text-center" style={{ backgroundColor: "var(--color-card)" }}>
          <div>
            <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>{(c.title as string) ?? "Titre"}</h2>
            <p className="text-sm opacity-60 max-w-md">{(c.subtitle as string) ?? ""}</p>
            {(c.cta_text as string | undefined) && (
              <span className="inline-block mt-3 px-4 py-2 text-xs font-medium text-white" style={{ backgroundColor: "var(--color-accent)" }}>
                {c.cta_text as string}
              </span>
            )}
          </div>
        </div>
      );

    case "editorial":
      return (
        <div className="p-6">
          <h3 className="text-lg font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>{(c.title as string) ?? ""}</h3>
          <div className="text-sm opacity-70 leading-relaxed whitespace-pre-line">{(c.body as string) ?? ""}</div>
        </div>
      );

    case "grid":
      return (
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>{(c.title as string) ?? ""}</h3>
          <div className="grid grid-cols-3 gap-3">
            {((c.cards as Array<{ title: string; desc: string }>) ?? []).map((card, i) => (
              <div key={i} className="p-3 border border-[var(--color-border)]">
                <div className="text-xs font-semibold">{card.title}</div>
                <div className="text-[10px] opacity-50 mt-1">{card.desc}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case "citation":
      return (
        <div className="p-8 text-center italic">
          <p className="text-base opacity-80 max-w-lg mx-auto">&ldquo;{(c.text as string) ?? ""}&rdquo;</p>
          {c.author && <p className="text-xs opacity-40 mt-3">— {(c.author as string)}</p>}
        </div>
      );

    case "gallery":
      return (
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>{(c.title as string) ?? ""}</h3>
          <div className="grid grid-cols-3 gap-2">
            {((c.images as string[]) ?? []).map((img, i) => (
              <div key={i} className="aspect-[4/3] border border-[var(--color-border)] flex items-center justify-center text-[10px] opacity-30" style={{ backgroundColor: "var(--color-card)" }}>
                {img.split("/").pop()}
              </div>
            ))}
          </div>
        </div>
      );

    case "cta":
      return (
        <div className="p-8 text-center" style={{ backgroundColor: "var(--color-card)" }}>
          <p className="text-base font-semibold mb-3">{(c.text as string) ?? ""}</p>
          <span className="inline-block px-5 py-2 text-xs font-medium text-white" style={{ backgroundColor: "var(--color-accent)" }}>
            {(c.button_text as string) ?? "CTA"}
          </span>
        </div>
      );

    case "table":
      return (
        <div className="p-6">
          <h3 className="text-lg font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>{(c.title as string) ?? ""}</h3>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {((c.headers as string[]) ?? []).map((h, i) => (
                  <th key={i} className="py-2 pr-4 text-left font-semibold opacity-50">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {((c.rows as string[][]) ?? []).map((row, i) => (
                <tr key={i} className="border-b border-[var(--color-border)]">
                  {row.map((cell, j) => (
                    <td key={j} className="py-2 pr-4 opacity-70">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "custom_html":
      return (
        <div className="p-4 text-[10px] opacity-30 italic border border-dashed border-[var(--color-border)] m-2">
          HTML personnalisé
        </div>
      );

    default:
      return null;
  }
}
