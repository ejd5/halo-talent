import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/dashboard/trends/alerts?limit=20&type=spike&severity=high&unread=true
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const typeFilter = searchParams.get("type");
    const severityFilter = searchParams.get("severity");
    const unreadOnly = searchParams.get("unread") === "true";

    let query = supabase
      .from("trends_alerts")
      .select("*, trends_watchlist!inner(keyword)")
      .eq("creator_id", user.id);

    if (typeFilter) {
      query = query.eq("alert_type", typeFilter);
    }
    if (severityFilter) {
      query = query.eq("severity", severityFilter);
    }
    if (unreadOnly) {
      query = query.eq("notified", false);
    }

    const { data, error } = await query
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const alerts = (data ?? []).map((a: any) => ({
      id: a.id,
      watchlist_id: a.watchlist_id,
      trend_data: a.trend_data,
      alert_type: a.alert_type,
      severity: a.severity,
      notified: a.notified,
      created_at: a.created_at,
      keyword: a.trends_watchlist?.keyword ?? null,
    }));

    return NextResponse.json({ alerts });
  } catch (err) {
    console.error("[TRENDS ALERTS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH /api/dashboard/trends/alerts, mark alerts as read
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "ids requis (tableau)" }, { status: 400 });
    }

    const { error } = await supabase
      .from("trends_alerts")
      .update({ notified: true })
      .eq("creator_id", user.id)
      .in("id", ids);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, updated: ids.length });
  } catch (err) {
    console.error("[TRENDS ALERTS PATCH] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
