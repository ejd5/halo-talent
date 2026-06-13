import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || !["admin", "manager"].includes(profile.role)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const currentMonth = new Date().toISOString().slice(0, 7) + "-01";
  const prevMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().slice(0, 7) + "-01";

  const { data: creators } = await supabase
    .from("profiles")
    .select("id, full_name, display_name, commission_tier, joined_at, status")
    .eq("role", "creator")
    .in("status", ["active", "paused"]);

  if (!creators) return NextResponse.json({ tiers: [], flows: [] });

  // Standard tier order
  const TIER_ORDER = ["Découverte", "Croissance", "Scale", "Elite", "Icon"];
  const tierMap = new Map<string, any[]>();

  for (const c of creators) {
    let tier = c.commission_tier || "Découverte";
    // Normalize tier names
    const tierNorm: Record<string, string> = {
      discovery: "Découverte", croissance: "Croissance", scale: "Scale", elite: "Elite", icon: "Icon",
    };
    tier = tierNorm[tier.toLowerCase()] || tier;
    if (!TIER_ORDER.includes(tier)) tier = "Découverte";

    if (!tierMap.has(tier)) tierMap.set(tier, []);

    const { data: revs } = await supabase
      .from("monthly_revenues")
      .select("gross_revenue")
      .eq("creator_id", c.id)
      .eq("month", currentMonth);

    const revenue = (revs || []).reduce((s, r) => s + Number(r.gross_revenue || 0), 0);

    const { data: prevRevs } = await supabase
      .from("monthly_revenues")
      .select("gross_revenue")
      .eq("creator_id", c.id)
      .eq("month", prevMonth);

    const prevRevenue = (prevRevs || []).reduce((s, r) => s + Number(r.gross_revenue || 0), 0);
    const growth = prevRevenue > 0 ? Math.round(((revenue - prevRevenue) / prevRevenue) * 100) : revenue > 0 ? 100 : 0;

    // Time since joined in months
    const monthsSinceJoined = c.joined_at
      ? Math.max(1, Math.round((Date.now() - new Date(c.joined_at).getTime()) / (30 * 86400000)))
      : 1;

    tierMap.get(tier)!.push({ id: c.id, name: c.display_name || c.full_name || ", ", revenue, growth, months_since_joined: monthsSinceJoined, status: c.status, joined_at: c.joined_at });
  }

  const tiers = TIER_ORDER.map((name) => {
    const members = tierMap.get(name) || [];
    const avgRevenue = members.length > 0 ? Math.round(members.reduce((s, m) => s + m.revenue, 0) / members.length) : 0;
    const avgGrowth = members.length > 0 ? Math.round(members.reduce((s, m) => s + m.growth, 0) / members.length) : 0;
    const avgTimeToReach = members.length > 0 ? Math.round(members.reduce((s, m) => s + m.months_since_joined, 0) / members.length) : 0;

    return { name, count: members.length, avg_revenue: avgRevenue, avg_growth: avgGrowth, avg_months_in_tier: avgTimeToReach, members };
  });

  // Calculate flows (who moved up/down, compare current vs historical assignment)
  // For MVP, estimate flow from revenue changes
  const flows = TIER_ORDER.slice(0, -1).map((lower, i) => {
    const upper = TIER_ORDER[i + 1];
    const lowerMembers = tierMap.get(lower) || [];
    const upperMembers = tierMap.get(upper) || [];

    // Estimate: members in lower tier with high growth "eligible" to move up
    const movingUp = lowerMembers.filter((m) => m.growth > 30 && m.revenue > 1000).length;
    // Members in upper tier with decline
    const movingDown = upperMembers.filter((m) => m.growth < -20).length;

    return { from: lower, to: upper, up: movingUp, down: movingDown };
  });

  return NextResponse.json({ tiers, flows });
}
