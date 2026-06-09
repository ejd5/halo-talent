import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCreditBalance } from "@/lib/studio/credits";

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const balance = await getCreditBalance(supabase, user.id);
    const tierNames: Record<string, string> = { free: "Free", creator: "Creator", premium: "Premium", elite: "Elite", icon: "Icon" };

    return NextResponse.json({
      balance: balance.credits_remaining,
      monthly_quota: balance.credits_total > 0 ? balance.credits_total : null,
      reset_at: balance.reset_date,
      tier: { name: tierNames[balance.tier] || balance.tier },
      is_admin: balance.is_admin,
      is_unlimited: balance.is_unlimited,
      transactions: [],
      chart_30d: [],
    });
  } catch (err) {
    console.error("[CREDITS API] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
