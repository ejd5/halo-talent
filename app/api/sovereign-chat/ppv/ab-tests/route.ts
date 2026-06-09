import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { data: tests } = await supabase
    .from("atlas_ppv_ab_tests")
    .select("*, atlas_ppv_products!inner(name)")
    .eq("creator_id", user.id)
    .order("started_at", { ascending: false });

  return NextResponse.json({ tests: tests || [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await request.json();
  const { product_id, name, variant_a_script_id, variant_b_script_id, segment_id, split_ratio } = body;

  if (!product_id || !variant_a_script_id || !variant_b_script_id) {
    return NextResponse.json(
      { error: "product_id, variant_a_script_id, variant_b_script_id requis" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("atlas_ppv_ab_tests")
    .insert({
      creator_id: user.id,
      product_id,
      name: name || "A/B Test",
      variant_a_script_id,
      variant_b_script_id,
      segment_id: segment_id || null,
      split_ratio: split_ratio || 0.50,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Erreur de création" }, { status: 500 });
  return NextResponse.json({ test: data });
}
