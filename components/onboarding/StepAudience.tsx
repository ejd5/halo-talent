"use client";

import type { AudienceSection, Gender, AgeRange } from "./types";
import { AGE_RANGES, INTEREST_TAGS, GEO_ZONES } from "./types";

export function StepAudience({
  value,
  onChange,
}: {
  value: AudienceSection | null;
  onChange: (v: AudienceSection) => void;
}) {
  const data = value ?? { gender: null, ageRange: null, geoZones: [], interests: [] };

  const toggle = (field: "geoZones" | "interests", item: string) => {
    const arr = data[field];
    const next = arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
    onChange({ ...data, [field]: next });
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-2 text-4xl">👥</div>
      <h2
        className="text-xl md:text-2xl font-bold mb-2 text-center"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        Qui est votre audience idéale&nbsp;?
      </h2>
      <p
        className="text-sm text-center mb-6"
        style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
      >
        Aidez-nous à comprendre votre communauté
      </p>

      {/* Gender */}
      <div className="mb-5">
        <p className="text-xs font-medium mb-2" style={{ color: "var(--text-tertiary)" }}>
          Genre
        </p>
        <div className="flex gap-2">
          {(["femmes", "hommes", "tous"] as Gender[]).map((g) => {
            const sel = data.gender === g;
            return (
              <button
                key={g}
                onClick={() => onChange({ ...data, gender: sel ? null : g })}
                className="flex-1 py-2.5 text-sm font-medium rounded-xl transition-all"
                style={{
                  backgroundColor: sel ? "var(--accent-soft)" : "var(--bg-card)",
                  border: sel
                    ? "2px solid var(--accent)"
                    : "1px solid var(--border-default)",
                  color: sel ? "var(--accent)" : "var(--text-primary)",
                }}
              >
                {g === "femmes" ? "Femmes" : g === "hommes" ? "Hommes" : "Tous"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Age */}
      <div className="mb-5">
        <p className="text-xs font-medium mb-2" style={{ color: "var(--text-tertiary)" }}>
          Tranche d'âge
        </p>
        <div className="flex gap-2">
          {AGE_RANGES.map((a) => {
            const sel = data.ageRange === a;
            return (
              <button
                key={a}
                onClick={() => onChange({ ...data, ageRange: sel ? null : a })}
                className="flex-1 py-2.5 text-sm font-medium rounded-xl transition-all"
                style={{
                  backgroundColor: sel ? "var(--accent-soft)" : "var(--bg-card)",
                  border: sel
                    ? "2px solid var(--accent)"
                    : "1px solid var(--border-default)",
                  color: sel ? "var(--accent)" : "var(--text-primary)",
                }}
              >
                {a}
              </button>
            );
          })}
        </div>
      </div>

      {/* Geography */}
      <div className="mb-5">
        <p className="text-xs font-medium mb-2" style={{ color: "var(--text-tertiary)" }}>
          Zones géographiques principales
        </p>
        <div className="flex flex-wrap gap-1.5">
          {GEO_ZONES.map((z) => {
            const sel = data.geoZones.includes(z);
            return (
              <button
                key={z}
                onClick={() => toggle("geoZones", z)}
                className="px-3 py-1.5 text-[11px] font-medium rounded-lg transition-all"
                style={{
                  backgroundColor: sel ? "var(--accent-soft)" : "var(--bg-card)",
                  border: sel
                    ? "1px solid var(--accent)"
                    : "1px solid var(--border-default)",
                  color: sel ? "var(--accent)" : "var(--text-primary)",
                }}
              >
                {z}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interests */}
      <div className="mb-2">
        <p className="text-xs font-medium mb-2" style={{ color: "var(--text-tertiary)" }}>
          Centres d'intérêt
        </p>
        <div className="flex flex-wrap gap-1.5">
          {INTEREST_TAGS.map((tag) => {
            const sel = data.interests.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggle("interests", tag)}
                className="px-3 py-1.5 text-[11px] font-medium rounded-lg transition-all"
                style={{
                  backgroundColor: sel ? "var(--accent-soft)" : "var(--bg-card)",
                  border: sel
                    ? "1px solid var(--accent)"
                    : "1px solid var(--border-default)",
                  color: sel ? "var(--accent)" : "var(--text-primary)",
                }}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
