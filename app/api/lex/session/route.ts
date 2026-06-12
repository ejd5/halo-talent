import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getUserCreditUsage, generateAnamSessionToken } from "@/lib/halo-lex/avatar/session-manager";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const credit = await getUserCreditUsage(user.id);
    const sessionToken = await generateAnamSessionToken(user.id, credit.plan);

    return NextResponse.json({
      sessionToken,
      degradedMode: credit.degradedMode,
      plan: credit.plan,
      avatarAvailable: !!sessionToken && !credit.degradedMode,
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
