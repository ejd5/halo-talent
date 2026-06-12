export type AvatarState = "connecting" | "idle" | "listening" | "speaking" | "thinking";

export interface AvatarSession {
  id: string;
  userId: string;
  sessionToken: string;
  plan: "premium" | "elite" | "icon";
  startedAt: Date;
  expiresAt: Date;
  durationSeconds: number;
}

export interface CreditUsage {
  userId: string;
  plan: string;
  monthlyUsed: number;
  monthlyLimit: number;
  degradedMode: boolean; // texte seulement, sans avatar
}

export const PLAN_CREDITS: Record<string, { avatarMinutes: number; lettersPerMonth: number }> = {
  premium: { avatarMinutes: 30, lettersPerMonth: 10 },
  elite: { avatarMinutes: 600, lettersPerMonth: 999 },
  icon: { avatarMinutes: 600, lettersPerMonth: 999 },
};
