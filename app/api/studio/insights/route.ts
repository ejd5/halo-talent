import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDashboardSummary, getChartData } from "@/lib/analytics/coach";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const mode = searchParams.get("mode") ?? "dashboard";

    if (mode === "chart") {
      const days = parseInt(searchParams.get("days") ?? "30");
      const chart = await getChartData(supabase, user.id, days);
      return NextResponse.json({ chart });
    }

    if (mode === "metrics") {
      const limit = parseInt(searchParams.get("limit") ?? "50");
      const { data: metrics } = await supabase
        .from("content_metrics")
        .select("*")
        .eq("creator_id", user.id)
        .order("metric_date", { ascending: false })
        .limit(limit);
      return NextResponse.json({ metrics: metrics ?? [] });
    }

    const summary = await getDashboardSummary(supabase, user.id);
    return NextResponse.json(summary);
  } catch (err) {
    console.error("[INSIGHTS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
