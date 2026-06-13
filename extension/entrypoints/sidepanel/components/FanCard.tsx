import type { FanProfile } from "@/src/types/fan";
import { FAN_PERSONA_LABELS } from "@/src/types/fan";

interface Props {
  fan: FanProfile;
  onClick?: (fanId: string) => void;
}

export function FanCard({ fan, onClick }: Props) {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
      }}
      onClick={() => onClick?.(fan.id)}
    >
      {fan.avatarUrl ? (
        <img
          src={fan.avatarUrl}
          alt={fan.username}
          className="w-8 h-8 rounded-full object-cover shrink-0"
        />
      ) : (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}
        >
          {fan.username.charAt(0).toUpperCase()}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
            {fan.displayName}
          </p>
          <span className="text-[9px] font-medium" style={{ color: "var(--text-tertiary)" }}>
            @{fan.username}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
            {FAN_PERSONA_LABELS[fan.persona]}
          </span>
          {fan.totalSpent > 0 && (
            <span className="text-[9px]" style={{ color: "var(--success)" }}>
              ${fan.totalSpent}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
