import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { TikTokCreativeProvider } from "@/lib/trends/providers/tiktok-creative";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region") || "FR";
  const period = (searchParams.get("period") as "7" | "30" | "120") || "7";
  const commercialOnly = searchParams.get("commercialOnly") === "true";

  const provider = new TikTokCreativeProvider();

  try {
    const songs = await provider.getTrendingSongs({
      region,
      period,
      commercialOnly,
    });
    return NextResponse.json({ songs, source: provider instanceof TikTokCreativeProvider ? "apify" : "scrapecreators" });
  } catch (e: any) {
    console.error("[TIKTOK SONGS] Error:", e);
    return NextResponse.json({ error: "Erreur TikTok API" }, { status: 500 });
  }
}
