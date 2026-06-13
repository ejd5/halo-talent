import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
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

  const body = await request.json();
  const { creator_ids } = body as { creator_ids: string[] };
  if (!creator_ids || creator_ids.length < 2) {
    return NextResponse.json({ error: "Au moins 2 créateurs requis" }, { status: 400 });
  }

  if (creator_ids.length > 5) {
    return NextResponse.json({ error: "Maximum 5 créateurs" }, { status: 400 });
  }

  const currentMonth = new Date().toISOString().slice(0, 7) + "-01";
  const prevMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().slice(0, 7) + "-01";

  // Get monthly history (6 months)
  const months: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(new Date().getFullYear(), new Date().getMonth() - i, 1);
    months.push(d.toISOString().slice(0, 7) + "-01");
  }

  const { data: creators } = await supabase
    .from("profiles")
    .select("*")
    .in("id", creator_ids);

  const enriched = await Promise.all(
    (creators || []).map(async (c) => {
      const { data: revs } = await supabase
        .from("monthly_revenues")
        .select("gross_revenue, month")
        .eq("creator_id", c.id)
        .in("month", [currentMonth, prevMonth]);

      const currentRev = (revs || []).filter((r) => r.month === currentMonth).reduce((s, r) => s + Number(r.gross_revenue || 0), 0);
      const prevRev = (revs || []).filter((r) => r.month === prevMonth).reduce((s, r) => s + Number(r.gross_revenue || 0), 0);
      const growth = prevRev > 0 ? Math.round(((currentRev - prevRev) / prevRev) * 100) : currentRev > 0 ? 100 : 0;

      // Revenue history
      const { data: history } = await supabase
        .from("monthly_revenues")
        .select("gross_revenue, month")
        .eq("creator_id", c.id)
        .in("month", months)
        .order("month", { ascending: true });

      const revenue_history = months.map((m) => {
        const match = (history || []).find((h) => h.month === m);
        return match ? Number(match.gross_revenue) : 0;
      });

      // Fans
      const { count: activeFans } = await supabase
        .from("atlas_fans")
        .select("id", { count: "exact", head: true })
        .eq("creator_id", c.id)
        .eq("status", "active");

      // Drafts count
      const { count: draftsCount } = await supabase
        .from("atlas_drafts")
        .select("id", { count: "exact", head: true })
        .eq("creator_id", c.id);

      // PPV stats
      const { data: ppvSends } = await supabase
        .from("atlas_ppv_sends")
        .select("unlocked, unlock_revenue")
        .eq("creator_id", c.id);

      const totalPpvSends = ppvSends?.length || 0;
      const totalPpvUnlocks = ppvSends?.filter((s) => s.unlocked).length || 0;
      const unlockRate = totalPpvSends > 0 ? Math.round((totalPpvUnlocks / totalPpvSends) * 1000) / 10 : 0;

      return {
        id: c.id,
        name: c.display_name || c.full_name || c.email,
        department: c.department || ", ",
        commission_tier: c.commission_tier || ", ",
        revenue: currentRev,
        growth,
        active_fans: activeFans || 0,
        pending_drafts: draftsCount || 0,
        ppv_unlock_rate: unlockRate,
        revenue_per_fan: (activeFans || 0) > 0 ? Math.round(currentRev / (activeFans || 1)) : 0,
        revenue_history,
        months,
      };
    }),
  );

  return NextResponse.json({ creators: enriched });
}
