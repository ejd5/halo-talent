// ─── Tone Guard Settings Mock Data ─────────────────────────

import type { ToneGuardConfig } from "@/lib/chat-copilot/types";

export const mockToneGuardConfig: ToneGuardConfig = {
  enabled: true,
  sensitivity: "moderate",
  checks: {
    dna: true,
    taboo: true,
    tos: true,
    legal: true,
    quality: true,
  },
  blockedWords: ["politique", "religion", "drogue", "alcool"],
  vipExceptions: ["fan-001", "fan-003", "fan-005"],
};

export const SENSITIVITY_THRESHOLDS: Record<string, { warningScore: number; blockingScore: number }> = {
  strict: { warningScore: 60, blockingScore: 30 },
  moderate: { warningScore: 40, blockingScore: 20 },
  flexible: { warningScore: 20, blockingScore: 10 },
};
