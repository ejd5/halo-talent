import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { LTVPredictor } from "@/lib/sovereign-chat/predict/ltv";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const fanId = searchParams.get("fan_id");
  if (!fanId) return NextResponse.json({ error: "fan_id requis" }, { status: 400 });

  const predictor = new LTVPredictor(user.id);
  const prediction = await predictor.predict(fanId);
  if (!prediction)
    return NextResponse.json({ error: "Fan introuvable" }, { status: 404 });

  return NextResponse.json({ prediction });
}
