import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { TikTokCreativeProvider } from "@/lib/trends/providers/tiktok-creative";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const hashtag = searchParams.get("hashtag");
  const songId = searchParams.get("song_id");
  const region = searchParams.get("region") || "FR";

  if (!hashtag && !songId) {
    return NextResponse.json({ error: "Paramètre 'hashtag' ou 'song_id' requis" }, { status: 400 });
  }

  const provider = new TikTokCreativeProvider();

  try {
    if (hashtag) {
      const details = await provider.getHashtagDetails(hashtag);
      return NextResponse.json({ hashtag, details });
    }

    // Song details: fetch trending songs and filter by song_id
    const songs = await provider.getTrendingSongs({ region, period: "30" });
    const song = songs.find((s: any) => s.tiktok_song_id === songId) || null;
    return NextResponse.json({ song_id: songId, song, region });
  } catch (e: any) {
    console.error("[TIKTOK DETAILS] Error:", e);
    return NextResponse.json({ error: "Erreur lors de la récupération des détails" }, { status: 500 });
  }
}
