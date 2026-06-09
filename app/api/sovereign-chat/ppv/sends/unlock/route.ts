import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await request.json();
  const { send_id } = body;
  if (!send_id) return NextResponse.json({ error: "send_id requis" }, { status: 400 });

  // Verify ownership
  const { data: send } = await supabase
    .from("atlas_ppv_sends")
    .select("id, sent_at, product_id, script_id, unlock_revenue")
    .eq("id", send_id)
    .eq("creator_id", user.id)
    .single();
  if (!send) return NextResponse.json({ error: "Envoi introuvable" }, { status: 404 });

  if (send.unlocked) {
    return NextResponse.json({ error: "Déjà unlock" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const sentAt = new Date(send.sent_at).getTime();
  const timeToUnlock = Math.round((Date.now() - sentAt) / 1000);

  await supabase
    .from("atlas_ppv_sends")
    .update({
      unlocked: true,
      unlocked_at: now,
      time_to_unlock_seconds: timeToUnlock,
    })
    .eq("id", send_id);

  // Update product stats
  const productUpdates: Record<string, any> = {
    total_unlocks: await getCount(supabase, "atlas_ppv_sends", { product_id: send.product_id, unlocked: true }),
    total_revenue: await getSum(supabase, "atlas_ppv_sends", "unlock_revenue", { product_id: send.product_id, unlocked: true }),
  };
  await supabase.from("atlas_ppv_products").update(productUpdates).eq("id", send.product_id);

  // Update script stats
  if (send.script_id) {
    const scriptSends = await supabase
      .from("atlas_ppv_sends")
      .select("unlocked, unlock_revenue")
      .eq("script_id", send.script_id);

    const allSends = scriptSends.data || [];
    const totalSends = allSends.length;
    const totalUnlocks = allSends.filter((s: any) => s.unlocked).length;
    const totalRevenue = allSends.reduce((sum: number, s: any) => sum + Number(s.unlock_revenue || 0), 0);
    const avgRate = totalSends > 0 ? (totalUnlocks / totalSends) * 100 : 0;

    await supabase
      .from("atlas_ppv_scripts")
      .update({
        uses_count: totalSends,
        total_revenue: totalRevenue,
        avg_unlock_rate: Math.round(avgRate * 100) / 100,
      })
      .eq("id", send.script_id);
  }

  return NextResponse.json({ ok: true, time_to_unlock_seconds: timeToUnlock });
}

async function getCount(supabase: any, table: string, filters: Record<string, any>) {
  let q = supabase.from(table).select("id", { count: "exact", head: true });
  for (const [k, v] of Object.entries(filters)) {
    q = q.eq(k, v);
  }
  const { count } = await q;
  return count ?? 0;
}

async function getSum(supabase: any, table: string, column: string, filters: Record<string, any>) {
  let q = supabase.from(table).select(column);
  for (const [k, v] of Object.entries(filters)) {
    q = q.eq(k, v);
  }
  const { data } = await q;
  return (data || []).reduce((sum: number, r: any) => sum + Number(r[column] || 0), 0);
}
