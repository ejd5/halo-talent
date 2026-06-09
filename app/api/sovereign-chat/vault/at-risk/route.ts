import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ChurnPredictor } from "@/lib/sovereign-chat/predict/churn";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  // Get all fans for this creator
  const { data: fans } = await supabase
    .from("atlas_fans")
    .select("*")
    .eq("creator_id", user.id);

  if (!fans || fans.length === 0) {
    return NextResponse.json({ at_risk: [], total: 0 });
  }

  const predictor = new ChurnPredictor(user.id);
  const results = [];

  for (const fan of fans) {
    const prediction = await predictor.predict(fan.id);
    if (prediction && prediction.score > 40) {
      results.push({
        fan,
        churn: prediction,
      });
    }
  }

  // Sort by potential loss descending
  results.sort((a, b) => (b.churn.potential_loss || 0) - (a.churn.potential_loss || 0));

  return NextResponse.json({
    at_risk: results,
    total: results.length,
    total_fans: fans.length,
  });
}
