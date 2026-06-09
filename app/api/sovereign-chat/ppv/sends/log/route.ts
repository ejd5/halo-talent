import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await request.json();
  const { product_id, fan_id, script_id, script_used_text, platform, ab_test_id } = body;

  if (!product_id || !fan_id) {
    return NextResponse.json({ error: "product_id et fan_id requis" }, { status: 400 });
  }

  // Get product price
  const { data: product } = await supabase
    .from("atlas_ppv_products")
    .select("id, price, name")
    .eq("id", product_id)
    .eq("creator_id", user.id)
    .single();
  if (!product) return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });

  const { data, error } = await supabase
    .from("atlas_ppv_sends")
    .insert({
      creator_id: user.id,
      product_id,
      fan_id,
      script_id: script_id || null,
      script_used_text: script_used_text || null,
      platform: platform || "onlyfans",
      unlock_revenue: product.price, // Set expected revenue
      ab_test_id: ab_test_id || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Erreur de log" }, { status: 500 });

  // Increment product send count
  await supabase
    .from("atlas_ppv_products")
    .update({ total_sends: (await getProductSendCount(supabase, product_id)) })
    .eq("id", product_id);

  return NextResponse.json({ send: data });
}

async function getProductSendCount(supabase: any, productId: string) {
  const { count } = await supabase
    .from("atlas_ppv_sends")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);
  return count ?? 0;
}
