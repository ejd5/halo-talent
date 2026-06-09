import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkCredits } from "@/lib/studio/credits";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non connecté" }, { status: 401 });
    }

    // Exact same query as checkCredits
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role, subscription_tier, credits_ia, generation_suspended, credit_reset_at")
      .eq("id", user.id)
      .single();

    // Run checkCredits
    const creditCheck = await checkCredits(supabase, user.id, 1, "test");

    return NextResponse.json({
      user: { id: user.id, email: user.email },
      direct_query: { found: !!profile, role: (profile as any)?.role, data: profile, error: profileError?.message },
      check_credits: creditCheck,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
