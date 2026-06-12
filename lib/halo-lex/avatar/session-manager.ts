import { createClient } from "@supabase/supabase-js";
import { PLAN_CREDITS } from "./types";
import type { CreditUsage } from "./types";

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function getUserCreditUsage(userId: string): Promise<CreditUsage> {
  const supabase = getAdmin();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  const plan = (profile?.role === "admin" ? "elite" : "premium") as "premium" | "elite" | "icon";
  const limits = PLAN_CREDITS[plan] ?? PLAN_CREDITS.premium;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("generated_letters")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth.toISOString());

  return {
    userId,
    plan,
    monthlyUsed: count ?? 0,
    monthlyLimit: limits.avatarMinutes,
    degradedMode: (count ?? 0) >= limits.avatarMinutes,
  };
}

export async function generateAnamSessionToken(
  userId: string,
  userPlan: string
): Promise<string | null> {
  const apiKey = process.env.ANAM_API_KEY;
  if (!apiKey) return null;

  const maxDuration = userPlan === "elite" || userPlan === "icon" ? 3600 : 1800;

  try {
    const response = await fetch("https://api.anam.ai/v1/auth/session-token", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personaConfig: {
          personaPreset: "lex_legal_advisor",
          avatarId: process.env.ANAM_LEX_AVATAR_ID,
          voiceId: process.env.ANAM_LEX_VOICE_ID,
        },
        maxSessionDurationSeconds: maxDuration,
      }),
    });

    if (!response.ok) return null;
    const { sessionToken } = await response.json();
    return sessionToken;
  } catch {
    return null;
  }
}
