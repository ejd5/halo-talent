import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("product_id");
  const limit = parseInt(searchParams.get("limit") || "50");

  let q = supabase
    .from("atlas_ppv_sends")
    .select("*, atlas_ppv_products!inner(name, price, category), atlas_fans!inner(display_name, email, fan_tier)")
    .eq("creator_id", user.id)
    .order("sent_at", { ascending: false })
    .limit(limit);

  if (productId) q = q.eq("product_id", productId);

  const { data } = await q;
  return NextResponse.json({ sends: data || [] });
}
