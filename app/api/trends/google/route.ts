import { GoogleTrendsProvider } from "@/lib/trends/providers/google";
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
  const geo = url.searchParams.get("geo") || "";
  const timeframe = url.searchParams.get("timeframe") || "today 1-m";

  if (!keyword) {
    return NextResponse.json({ error: "Missing q param" }, { status: 400 });
  }

  const provider = new GoogleTrendsProvider();

  try {
    const data = await provider.getTrend(
      { keyword, geo, timeframe, includeRelated: true },
      user.id,
    );
    return NextResponse.json(data);
  } catch (e: any) {
    if (e?.message === "RATE_LIMIT") {
      return NextResponse.json(
        { error: "Trop de requêtes. Limite : 5/minute." },
        { status: 429 },
      );
    }
    return NextResponse.json(
      { error: "Erreur lors de la récupération des tendances" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { keywords } = body as { keywords?: string[] };

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { error: "Missing keywords array" },
        { status: 400 },
      );
    }

    if (keywords.length > 5) {
      return NextResponse.json(
        { error: "Maximum 5 keywords" },
        { status: 400 },
      );
    }

    const provider = new GoogleTrendsProvider();
    const results = await Promise.all(
      keywords.map((kw) =>
        provider.getTrend(
          { keyword: kw, includeRelated: true },
          user.id,
        ).catch(() => null),
      ),
    );

    return NextResponse.json({ results: results.filter(Boolean) });
  } catch {
    return NextResponse.json(
      { error: "Invalid body" },
      { status: 400 },
    );
  }
}
