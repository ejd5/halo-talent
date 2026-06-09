import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { TikTokCreativeProvider } from "@/lib/trends/providers/tiktok-creative";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region") || "FR";
  const industry = searchParams.get("industry") || undefined;
  const period = (searchParams.get("period") as "7" | "30") || "7";

  const provider = new TikTokCreativeProvider();

  try {
    const ads = await provider.getTopAds({ region, industry, period });
    return NextResponse.json({ ads, source: "apify" });
  } catch (e: any) {
    console.error("[TIKTOK TOP ADS] Error:", e);
    return NextResponse.json({ error: "Erreur TikTok API" }, { status: 500 });
  }
}
