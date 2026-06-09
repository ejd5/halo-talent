import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();

  // This month sends
  const { data: monthSends } = await supabase
    .from("atlas_ppv_sends")
    .select("id, unlocked, unlocked_at, sent_at, time_to_unlock_seconds, unlock_revenue, product_id, script_id")
    .eq("creator_id", user.id)
    .gte("sent_at", monthStart);

  // Previous month for comparison
  const { data: prevSends } = await supabase
    .from("atlas_ppv_sends")
    .select("id, unlocked, unlock_revenue")
    .eq("creator_id", user.id)
    .gte("sent_at", prevMonthStart)
    .lt("sent_at", monthStart);

  // Daily revenue for chart (30 days)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000).toISOString();
  const { data: chartData } = await supabase
    .from("atlas_ppv_sends")
    .select("unlock_revenue, unlocked_at, sent_at, unlocked")
    .eq("creator_id", user.id)
    .gte("sent_at", thirtyDaysAgo)
    .order("sent_at", { ascending: true });

  // Build daily aggregates
  const dailyRevenue: Record<string, { current: number; prev: number }> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const key = d.toISOString().slice(0, 10);
    dailyRevenue[key] = { current: 0, prev: 0 };
  }

  for (const s of chartData || []) {
    const day = s.sent_at?.slice(0, 10);
    if (day && dailyRevenue[day] !== undefined) {
      if (s.unlocked && s.unlock_revenue) {
        dailyRevenue[day].current += Number(s.unlock_revenue);
      }
    }
  }

  const chart = Object.entries(dailyRevenue).map(([date, vals]) => ({
    date,
    revenue: vals.current,
    prev_revenue: vals.prev,
  }));

  // KPI calculations
  const totalSends = monthSends?.length || 0;
  const unlocked = (monthSends || []).filter((s) => s.unlocked);
  const unlockRate = totalSends > 0 ? (unlocked.length / totalSends) * 100 : 0;
  const totalRevenue = unlocked.reduce((sum, s) => sum + Number(s.unlock_revenue || 0), 0);
  const aov = unlocked.length > 0 ? totalRevenue / unlocked.length : 0;
  const ttuValues = unlocked
    .map((s) => s.time_to_unlock_seconds)
    .filter((v): v is number => v !== null);
  const avgTTU = ttuValues.length > 0
    ? Math.round(ttuValues.reduce((a, b) => a + b, 0) / ttuValues.length / 3600 * 10) / 10
    : 0;

  // Top product
  const productRevenue: Record<string, { name: string; revenue: number }> = {};
  for (const s of unlocked) {
    if (s.product_id) {
      if (!productRevenue[s.product_id]) productRevenue[s.product_id] = { name: s.product_id, revenue: 0 };
      productRevenue[s.product_id].revenue += Number(s.unlock_revenue || 0);
    }
  }
  const topProduct = Object.values(productRevenue).sort((a, b) => b.revenue - a.revenue)[0]?.name || null;

  // Get actual product names
  if (topProduct) {
    const { data: prod } = await supabase
      .from("atlas_ppv_products")
      .select("name")
      .eq("id", topProduct)
      .single();
    if (prod) {
      const topProductName = prod.name;
    }
  }

  // Previous month comparison
  const prevUnlocked = (prevSends || []).filter((s) => s.unlocked);
  const prevRevenue = prevUnlocked.reduce((sum, s) => sum + Number(s.unlock_revenue || 0), 0);
  const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;

  return NextResponse.json({
    kpis: {
      revenue: Math.round(totalRevenue * 100) / 100,
      sends: totalSends,
      unlock_rate: Math.round(unlockRate * 10) / 10,
      aov: Math.round(aov * 100) / 100,
      avg_ttu_hours: avgTTU,
      top_product: topProduct,
      revenue_change: Math.round(revenueChange * 10) / 10,
    },
    chart,
    prev_month_revenue: Math.round(prevRevenue * 100) / 100,
  });
}
