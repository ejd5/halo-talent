import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/admin/apify/usage?month=2026-06
// Admin only — Apify cost monitoring
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    // Check admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month"); // YYYY-MM format

    let query = supabase
      .from("apify_usage_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (month) {
      const start = `${month}-01`;
      const endDate = new Date(start);
      endDate.setMonth(endDate.getMonth() + 1);
      const end = endDate.toISOString();
      query = query.gte("created_at", start).lt("created_at", end);
    }

    const { data, error } = await query.limit(500);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const totalCost = (data ?? []).reduce(
      (sum, log: any) => sum + parseFloat(log.cost_estimate || "0"),
      0,
    );
    const overBudget = totalCost > 50;

    return NextResponse.json({
      logs: data ?? [],
      summary: {
        total_calls: data?.length ?? 0,
        total_cost: Math.round(totalCost * 100) / 100,
        monthly_limit: 50,
        over_budget: overBudget,
        status: overBudget ? "alert" : "ok",
      },
    });
  } catch (err) {
    console.error("[ADMIN APIFY USAGE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
