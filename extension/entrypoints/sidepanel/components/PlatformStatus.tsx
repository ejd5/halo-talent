import type { PlatformType } from "@/src/types/platform";
import { PLATFORM_LABELS } from "@/src/types/platform";

interface Props {
  activePlatform: PlatformType | null;
  pageType: string;
}

export function PlatformStatus({ activePlatform, pageType }: Props) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-[10px]"
      style={{
        backgroundColor: activePlatform
          ? "rgba(16,185,129,0.06)"
          : "rgba(255,255,255,0.02)",
        border: "1px solid var(--border-default)",
      }}
    >
      <div
        className="w-2 h-2 rounded-full animate-pulse"
        style={{
          backgroundColor: activePlatform ? "var(--success)" : "var(--text-tertiary)",
        }}
      />
      <span style={{ color: "var(--text-secondary)" }}>
        {activePlatform
          ? `${PLATFORM_LABELS[activePlatform]} · ${pageType}`
          : "En attente d'une plateforme"}
      </span>
    </div>
  );
}
