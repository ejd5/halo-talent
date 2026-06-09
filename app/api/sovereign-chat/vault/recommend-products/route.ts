import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ContentRecommender } from "@/lib/sovereign-chat/vault/recommender";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await request.json();
  const { fan_id } = body;
  if (!fan_id)
    return NextResponse.json({ error: "fan_id requis" }, { status: 400 });

  const recommender = new ContentRecommender(user.id);
  const recommendations = await recommender.recommendProductsForFan(fan_id);

  return NextResponse.json({ recommendations });
}
