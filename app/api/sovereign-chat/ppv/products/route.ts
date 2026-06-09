import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const { data: product } = await supabase
      .from("atlas_ppv_products")
      .select("*")
      .eq("id", id)
      .eq("creator_id", user.id)
      .single();
    if (!product) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

    // Get performance by segment
    const { data: sends } = await supabase
      .from("atlas_ppv_sends")
      .select("*, atlas_fans!inner(fan_tier, total_spent)")
      .eq("product_id", id)
      .eq("creator_id", user.id);

    const byTier: Record<string, { sends: number; unlocks: number; revenue: number }> = {};
    for (const s of sends || []) {
      const tier = (s as any).atlas_fans?.fan_tier || "unknown";
      if (!byTier[tier]) byTier[tier] = { sends: 0, unlocks: 0, revenue: 0 };
      byTier[tier].sends++;
      if (s.unlocked) {
        byTier[tier].unlocks++;
        byTier[tier].revenue += Number(s.unlock_revenue || 0);
      }
    }

    // Repeat purchasers
    const fanPurchases: Record<string, number> = {};
    for (const s of sends || []) {
      if (s.unlocked) {
        fanPurchases[s.fan_id] = (fanPurchases[s.fan_id] || 0) + 1;
      }
    }
    const repeatPurchases = Object.values(fanPurchases).filter((c) => c > 1).length;

    return NextResponse.json({ product, performance_by_tier: byTier, repeat_purchasers: repeatPurchases });
  }

  const { data: products } = await supabase
    .from("atlas_ppv_products")
    .select("*")
    .eq("creator_id", user.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ products: products || [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await request.json();
  if (!body.name || !body.price) {
    return NextResponse.json({ error: "name et price requis" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("atlas_ppv_products")
    .insert({
      creator_id: user.id,
      name: body.name,
      description: body.description || null,
      thumbnail_url: body.thumbnail_url || null,
      price: body.price,
      duration_seconds: body.duration_seconds || null,
      tags: body.tags || [],
      category: body.category || null,
      is_active: body.is_active !== false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Erreur de création" }, { status: 500 });
  return NextResponse.json({ product: data });
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: "id requis" }, { status: 400 });

  const updates: Record<string, any> = {};
  for (const key of ["name", "description", "thumbnail_url", "price", "duration_seconds", "tags", "category", "is_active"]) {
    if (body[key] !== undefined) updates[key] = body[key];
  }

  const { data, error } = await supabase
    .from("atlas_ppv_products")
    .update(updates)
    .eq("id", body.id)
    .eq("creator_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
  return NextResponse.json({ product: data });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

  await supabase.from("atlas_ppv_products").delete().eq("id", id).eq("creator_id", user.id);
  return NextResponse.json({ ok: true });
}
