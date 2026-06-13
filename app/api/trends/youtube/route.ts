import { YouTubeTrendsProvider } from "@/lib/trends/providers/youtube";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const keyword = url.searchParams.get("q");
  const geo = url.searchParams.get("geo") || "FR";
  const category = url.searchParams.get("category") || "";

  const provider = new YouTubeTrendsProvider();

  try {
    let videos: any[];

    if (keyword) {
      // Search by keyword, use searchInNiche
      const items = await provider.searchInNiche(keyword, 7);
      videos = (items ?? []).map((item: any) => ({
        id: item.id?.videoId ?? "",
        title: item.snippet?.title ?? "",
        channelTitle: item.snippet?.channelTitle ?? "",
        description: item.snippet?.description ?? "",
        thumbnail: item.snippet?.thumbnails?.high?.url ?? item.snippet?.thumbnails?.default?.url ?? "",
        publishedAt: item.snippet?.publishedAt ?? "",
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        duration: "",
        tags: [],
        category,
      }));
    } else {
      // Trending by region/category
      const items = await provider.getTrendingVideos({
        regionCode: geo,
        categoryId: category || undefined,
        maxResults: 20,
      });
      videos = items.map((v: any) => ({
        id: v.id,
        title: v.title,
        channelTitle: v.channel,
        description: "",
        thumbnail: v.thumbnail,
        publishedAt: v.published_at,
        viewCount: v.views,
        likeCount: v.likes,
        commentCount: 0,
        duration: "",
        tags: [],
        category,
      }));
    }

    return NextResponse.json({
      keyword: keyword ?? "",
      geo,
      category,
      videos,
      source: "youtube_api",
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Erreur lors de la recherche YouTube" },
      { status: 500 },
    );
  }
}
