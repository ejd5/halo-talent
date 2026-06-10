"use client";

import type { PlatformsSection, PlatformEntry } from "./types";
import { PLATFORM_OPTIONS } from "./types";

export function StepPlatforms({
  value,
  onChange,
}: {
  value: PlatformsSection | null;
  onChange: (v: PlatformsSection) => void;
}) {
  const data = value ?? { platforms: [] };

  const togglePlatform = (name: string) => {
    const exists = data.platforms.find((p) => p.name === name);
    if (exists) {
      onChange({
        platforms: data.platforms.filter((p) => p.name !== name),
      });
    } else {
      onChange({
        platforms: [...data.platforms, { name, followers: 0, isMain: false }],
      });
    }
  };

  const updateField = (name: string, field: "followers" | "isMain", val: number | boolean) => {
    onChange({
      platforms: data.platforms.map((p) => (p.name === name ? { ...p, [field]: val } : p)),
    });
  };

  // Uncheck other mains when setting a new main
  const setMain = (name: string) => {
    onChange({
      platforms: data.platforms.map((p) => ({
        ...p,
        isMain: p.name === name,
      })),
    });
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-2 text-4xl">📱</div>
      <h2
        className="text-xl md:text-2xl font-bold mb-2 text-center"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        Où êtes-vous actif(ve)&nbsp;?
      </h2>
      <p
        className="text-sm text-center mb-6"
        style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
      >
        Activez vos plateformes et renseignez vos abonnés
      </p>

      <div className="space-y-2">
        {PLATFORM_OPTIONS.map((name) => {
          const entry = data.platforms.find((p) => p.name === name);
          const active = !!entry;
          return (
            <div
              key={name}
              className="rounded-xl overflow-hidden transition-all"
              style={{
                backgroundColor: "var(--bg-card)",
                border: active
                  ? "1px solid var(--accent)"
                  : "1px solid var(--border-default)",
              }}
            >
              {/* Toggle header */}
              <button
                onClick={() => togglePlatform(name)}
                className="flex items-center justify-between w-full px-4 py-3 text-left"
              >
                <span
                  className="text-sm font-medium"
                  style={{ color: active ? "var(--accent)" : "var(--text-primary)" }}
                >
                  {name}
                </span>
                <div
                  className={`w-8 h-5 rounded-full transition-colors relative ${
                    active ? "bg-accent" : ""
                  }`}
                  style={{
                    backgroundColor: active ? "var(--accent)" : "var(--border-default)",
                  }}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform"
                    style={{ left: active ? "calc(100% - 16px)" : "3px" }}
                  />
                </div>
              </button>

              {/* Expanded fields */}
              {active && (
                <div className="px-4 pb-3 flex items-center gap-3">
                  <div className="flex-1">
                    <label
                      className="text-[10px] font-medium block mb-0.5"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Abonnés
                    </label>
                    <input
                      type="number"
                      value={entry!.followers}
                      onChange={(e) => updateField(name, "followers", Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-2 py-1.5 text-sm rounded-lg outline-none"
                      style={{
                        backgroundColor: "var(--bg-surface)",
                        color: "var(--text-primary)",
                        border: "1px solid var(--border-default)",
                      }}
                    />
                  </div>
                  <button
                    onClick={() => setMain(name)}
                    className="px-3 py-1.5 text-[10px] font-medium rounded-lg whitespace-nowrap"
                    style={{
                      backgroundColor: entry!.isMain
                        ? "var(--accent-soft)"
                        : "var(--bg-surface)",
                      color: entry!.isMain ? "var(--accent)" : "var(--text-tertiary)",
                      border: "1px solid",
                      borderColor: entry!.isMain
                        ? "var(--accent)"
                        : "var(--border-default)",
                    }}
                  >
                    {entry!.isMain ? "★ Principale" : "☆ Principale"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
