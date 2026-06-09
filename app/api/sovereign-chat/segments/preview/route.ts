import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SmartSegmentEngine } from "@/lib/sovereign-chat/segments/engine";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await request.json();
  const { rules } = body;
  if (!rules || !Array.isArray(rules)) {
    return NextResponse.json({ error: "rules requis (array)" }, { status: 400 });
  }

  // Estimate count by applying rules
  let query = supabase.from("atlas_fans").select("id", { count: "exact", head: true }).eq("creator_id", user.id);

  const engine = new SmartSegmentEngine();
  for (const rule of rules) {
    query = (engine as any).applyRule(query, rule);
  }

  const { count } = await query;
  return NextResponse.json({ estimated_count: count ?? 0 });
}
