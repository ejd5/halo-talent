import { ExternalLink } from "lucide-react";

export interface SourceItem {
  label: string;
  url?: string;
  date?: string; // ISO date
}

export function SourceTag({ sources }: { sources: SourceItem[] }) {
  if (!sources.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px]" style={{ color: "var(--text-tertiary)" }}>
      {sources.map((src, i) => (
        <span key={i} className="inline-flex items-center gap-1">
          {src.url ? (
            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 transition-colors hover:opacity-70"
              style={{ color: "var(--color-accent)" }}
            >
              {src.label}
              <ExternalLink size={9} />
            </a>
          ) : (
            <span>{src.label}</span>
          )}
          {src.date && (
            <span className="font-mono" style={{ color: "var(--text-tertiary)" }}>
              ({src.date})
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
