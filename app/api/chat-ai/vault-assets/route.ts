import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    let query = supabase
      .from("chat_ai_vault_assets")
      .select("id, title, type, sensitivity, price_history, sold_to_fan_ids, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (type) query = query.eq("type", type);

    const { data, error } = await query;
    if (error) throw error;

    const assets = (data || []).map((a) => ({
      ...a,
      currentPrice: (a.price_history as Array<{ price: number }>)?.slice(-1)?.[0]?.price || 0,
      soldCount: (a.sold_to_fan_ids as string[])?.length || 0,
    }));

    return NextResponse.json({ assets });
  } catch (error) {
    console.error("[Chat AI] Vault assets GET error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
