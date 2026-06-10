"use client";

import type { NotifSettings as NotifSettingsType } from "@/lib/notifications/types";

export function NotifSettings({
  settings,
  onChange,
}: {
  settings: NotifSettingsType;
  onChange: (s: NotifSettingsType) => void;
}) {
  const update = (patch: Partial<NotifSettingsType>) => {
    onChange({ ...settings, ...patch });
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar px-4 py-4 space-y-5">
      {/* Master toggle */}
      <label className="flex items-center justify-between cursor-pointer">
        <div>
          <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
            Notifications activées
          </p>
          <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
            Coupe toutes les notifications
          </p>
        </div>
        <Toggle
          checked={settings.enabled}
          onChange={(v) => update({ enabled: v })}
        />
      </label>

      {settings.enabled && (
        <>
          {/* Channels per priority */}
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: "var(--text-primary)" }}>
              Canaux de notification
            </p>
            <div className="space-y-3">
              <ChannelRow
                label="🔴 Urgentes"
                channels={settings.channels.urgent}
                onChange={(ch) =>
                  update({ channels: { ...settings.channels, urgent: ch as any } })
                }
              />
              <ChannelRow
                label="🟡 Importantes"
                channels={settings.channels.important}
                onChange={(ch) =>
                  update({ channels: { ...settings.channels, important: ch as any } })
                }
              />
              <ChannelRow
                label="🟢 Informatives"
                channels={settings.channels.info}
                onChange={(ch) =>
                  update({ channels: { ...settings.channels, info: ch as any } })
                }
              />
            </div>
          </div>

          {/* Quiet hours */}
          <div>
            <label className="flex items-center justify-between cursor-pointer mb-2">
              <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                Ne pas déranger
              </p>
              <Toggle
                checked={settings.quietHours.enabled}
                onChange={(v) =>
                  update({ quietHours: { ...settings.quietHours, enabled: v } })
                }
              />
            </label>
            {settings.quietHours.enabled && (
              <div className="flex gap-2">
                <input
                  type="time"
                  value={settings.quietHours.start}
                  onChange={(e) =>
                    update({
                      quietHours: { ...settings.quietHours, start: e.target.value },
                    })
                  }
                  className="flex-1 px-2 py-1.5 text-xs rounded-lg outline-none"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-default)",
                  }}
                />
                <span className="text-xs self-center" style={{ color: "var(--text-tertiary)" }}>
                  →
                </span>
                <input
                  type="time"
                  value={settings.quietHours.end}
                  onChange={(e) =>
                    update({
                      quietHours: { ...settings.quietHours, end: e.target.value },
                    })
                  }
                  className="flex-1 px-2 py-1.5 text-xs rounded-lg outline-none"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-default)",
                  }}
                />
              </div>
            )}
          </div>

          {/* Thresholds */}
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: "var(--text-primary)" }}>
              Seuils personnalisés
            </p>
            <div>
              <label
                className="text-[10px] block mb-1"
                style={{ color: "var(--text-tertiary)" }}
              >
                Alerter si churn score &gt; {settings.thresholds.churnScore}
              </label>
              <input
                type="range"
                min={30}
                max={95}
                step={5}
                value={settings.thresholds.churnScore}
                onChange={(e) =>
                  update({
                    thresholds: {
                      ...settings.thresholds,
                      churnScore: Number(e.target.value),
                    },
                  })
                }
                className="w-full"
                style={{ accentColor: "var(--accent)" }}
              />
              <div className="flex justify-between text-[9px]" style={{ color: "var(--text-tertiary)" }}>
                <span>Sensible (30)</span>
                <span>Strict (95)</span>
              </div>
            </div>
          </div>

          {/* Daily summary */}
          <div>
            <label className="flex items-center justify-between cursor-pointer mb-2">
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                  Résumé quotidien
                </p>
                <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                  Reçu chaque matin dans vos notifications
                </p>
              </div>
              <Toggle
                checked={settings.dailySummary.enabled}
                onChange={(v) =>
                  update({ dailySummary: { ...settings.dailySummary, enabled: v } })
                }
              />
            </label>
            {settings.dailySummary.enabled && (
              <div>
                <label
                  className="text-[10px] block mb-1"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Heure d&apos;envoi
                </label>
                <input
                  type="time"
                  value={settings.dailySummary.time}
                  onChange={(e) =>
                    update({
                      dailySummary: { ...settings.dailySummary, time: e.target.value },
                    })
                  }
                  className="w-full px-2 py-1.5 text-xs rounded-lg outline-none"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-default)",
                  }}
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* Spacer for scroll */}
      <div className="h-8" />
    </div>
  );
}

/* ─── Toggle switch ─── */

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-9 h-5 rounded-full relative transition-colors"
      style={{
        backgroundColor: checked ? "var(--accent)" : "var(--border-default)",
      }}
    >
      <div
        className="w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform"
        style={{ left: checked ? "calc(100% - 16px)" : "3px" }}
      />
    </button>
  );
}

/* ─── Channel toggles row ─── */

function ChannelRow({
  label,
  channels,
  onChange,
}: {
  label: string;
  channels: string[];
  onChange: (ch: string[]) => void;
}) {
  const allChannels = ["in-app", "email", "push"] as const;
  const channelLabels: Record<string, string> = {
    "in-app": "In-app",
    email: "Email",
    push: "Push",
  };

  const toggle = (ch: string) => {
    if (channels.includes(ch as any)) {
      onChange(channels.filter((c) => c !== ch));
    } else {
      onChange([...channels, ch]);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
        {label}
      </span>
      <div className="flex gap-1.5">
        {allChannels.map((ch) => {
          const active = channels.includes(ch);
          return (
            <button
              key={ch}
              onClick={() => toggle(ch)}
              className="px-2 py-1 text-[9px] font-medium rounded-lg transition-all"
              style={{
                backgroundColor: active ? "var(--accent-soft)" : "var(--bg-card)",
                color: active ? "var(--accent)" : "var(--text-tertiary)",
                border: `1px solid ${active ? "var(--accent)" : "var(--border-default)"}`,
              }}
            >
              {channelLabels[ch]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
