import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const fanId = searchParams.get("fan_id");
  if (!fanId) return NextResponse.json({ error: "fan_id requis" }, { status: 400 });

  // Get fan
  const { data: fan } = await supabase
    .from("atlas_fans")
    .select("*")
    .eq("id", fanId)
    .eq("creator_id", user.id)
    .single();
  if (!fan) return NextResponse.json({ error: "Fan introuvable" }, { status: 404 });

  // Get PPV sends for this fan
  const { data: sends } = await supabase
    .from("atlas_ppv_sends")
    .select("*, atlas_ppv_products!inner(name, price, category, tags)")
    .eq("fan_id", fanId)
    .eq("creator_id", user.id)
    .order("sent_at", { ascending: false });

  const totalSends = sends?.length || 0;
  const totalUnlocks = sends?.filter((s) => s.unlocked).length || 0;
  const convRate = totalSends > 0 ? (totalUnlocks / totalSends) * 100 : 0;
  const totalRevenue = sends?.reduce((sum, s) => sum + Number(s.unlock_revenue || 0), 0) || 0;

  // Preferred categories
  const categories: Record<string, number> = {};
  for (const s of sends || []) {
    const cat = (s as any).atlas_ppv_products?.category || "unknown";
    categories[cat] = (categories[cat] || 0) + 1;
  }

  // Avg TTU
  const ttuValues = (sends || [])
    .filter((s) => s.unlocked && s.time_to_unlock_seconds)
    .map((s) => s.time_to_unlock_seconds!);
  const avgTTU = ttuValues.length > 0
    ? Math.round(ttuValues.reduce((a, b) => a + b, 0) / ttuValues.length / 60)
    : null;

  return NextResponse.json({
    fan,
    analytics: {
      total_sends: totalSends,
      total_unlocks: totalUnlocks,
      conv_rate: Math.round(convRate * 10) / 10,
      total_revenue: Math.round(totalRevenue * 100) / 100,
      avg_ttu_minutes: avgTTU,
      preferred_categories: categories,
    },
    sends,
  });
}
