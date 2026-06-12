import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const fanId = searchParams.get("fanId");
    const status = searchParams.get("status");
    const platform = searchParams.get("platform");
    const language = searchParams.get("language");
    const vip = searchParams.get("vip");
    const whale = searchParams.get("whale");
    const dormant = searchParams.get("dormant");
    const churnRisk = searchParams.get("churnRisk");
    const doNotContact = searchParams.get("doNotContact");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);
    const offset = parseInt(searchParams.get("offset") || "0");

    // Detail mode: single fan
    if (fanId) {
      const { data, error } = await supabase
        .from("chat_ai_fans")
        .select("*")
        .eq("id", fanId)
        .single();

      if (error) throw error;
      return NextResponse.json({ fan: data });
    }

    // List mode with filters
    let query = supabase
      .from("chat_ai_fans")
      .select("*")
      .order("ltv", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    } else {
      // Handle legacy filter params
      if (vip === "true") query = query.eq("status", "vip");
      else if (whale === "true") query = query.eq("status", "whale");
      else if (dormant === "true") query = query.eq("status", "dormant");
      else if (doNotContact === "true") query = query.eq("status", "do_not_contact");
    }

    if (platform) query = query.eq("platform", platform);
    if (language) query = query.eq("language", language);

    const { data, error } = await query;
    if (error) throw error;

    let results = data || [];

    // Post-filter churn risk
    if (churnRisk === "high") {
      results = results.filter((f: Record<string, unknown>) => (f.churn_risk as number) >= 70);
    }

    return NextResponse.json({ fans: results, total: results.length });
  } catch (error) {
    console.error("[Chat AI] Fans GET error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
