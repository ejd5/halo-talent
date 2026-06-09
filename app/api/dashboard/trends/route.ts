import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { TrendAggregator } from "@/lib/trends/aggregator";
import type { TrendSourceData, TrendItem } from "@/lib/trends/types";

// GET /api/dashboard/trends?geo=FR&timeframe=7d
// Returns cross-platform trend analysis + source data for columns
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const geo = searchParams.get("geo") ?? "FR";

    // Cross-platform picks from TrendAggregator
    const aggregator = new TrendAggregator();
    const picks = await aggregator.getCrossPlatformTrends(user.id);

    // Mock source items for the 4-column layout on the dashboard
    const sources: TrendSourceData[] = [
      {
        source: "google",
        items: mockGoogleItems,
        fetched_at: new Date().toISOString(),
        cached: true,
      },
      {
        source: "youtube",
        items: mockYouTubeItems,
        fetched_at: new Date().toISOString(),
        cached: true,
      },
      {
        source: "news",
        items: mockNewsItems,
        fetched_at: new Date().toISOString(),
        cached: true,
      },
    ];

    // Get watchlist keywords for reference
    const { data: watchlist } = await supabase
      .from("trends_watchlist")
      .select("keyword, last_value")
      .eq("creator_id", user.id);

    return NextResponse.json({
      sources,
      picks,
      watched_keywords: watchlist ?? [],
      geo,
      generated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[TRENDS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// ─── Mock data for 4-column layout ────────────────────────────────

const mockGoogleItems: TrendItem[] = [
  { id: "g1", title: "IA création contenu", query: "IA création contenu 2026", source: "google", score: 92, change: 45, sparkline: [30,40,50,55,60,70,75], category: "tech" },
  { id: "g2", title: "OnlyFans marketing", query: "stratégie marketing OF 2026", source: "google", score: 88, change: 32, sparkline: [50,48,52,55,58,60,65], category: "business" },
  { id: "g3", title: "Short video trends", query: "tendances vidéo courtes 2026", source: "google", score: 85, change: 28, sparkline: [40,42,45,50,55,58,60], category: "platform" },
  { id: "g4", title: "Newsletter créateur", query: "newsletter créateur contenu", source: "google", score: 78, change: 22, sparkline: [35,38,40,42,45,50,52], category: "marketing" },
  { id: "g5", title: "Automation marketing", query: "automatisation marketing créateur", source: "google", score: 76, change: 18, sparkline: [45,44,48,50,48,52,55], category: "marketing" },
  { id: "g6", title: "Revenue diversification", query: "diversification revenus créateur", source: "google", score: 74, change: 15, sparkline: [30,32,35,38,40,42,44], category: "business" },
  { id: "g7", title: "Community building", query: "construire communauté fidèle", source: "google", score: 72, change: 12, sparkline: [25,28,30,32,35,36,38], category: "growth" },
  { id: "g8", title: "Personal branding", query: "personal branding créateur 2026", source: "google", score: 70, change: 10, sparkline: [40,40,42,42,44,45,46], category: "branding" },
  { id: "g9", title: "AI content tools", query: "outils IA contenu 2026", source: "google", score: 68, change: 8, sparkline: [50,50,52,52,54,55,56], category: "tech" },
  { id: "g10", title: "Creator economy", query: "économie créateur tendances", source: "google", score: 65, change: 5, sparkline: [45,44,45,44,46,45,46], category: "economy" },
];

const mockYouTubeItems: TrendItem[] = [
  { id: "yt1", title: "Comment j'ai automatisé mon CRM créateur", query: "automatisation CRM créateur", source: "youtube", score: 91, change: 55, sparkline: [20,30,45,55,65,75,85], category: "tech" },
  { id: "yt2", title: "IA va-t-elle remplacer les créateurs ?", query: "IA remplacement créateur", source: "youtube", score: 88, change: 42, sparkline: [30,35,40,50,60,70,78], category: "tech" },
  { id: "yt3", title: "Revenue report: combien je gagne avec OF", query: "revenus OnlyFans 2026", source: "youtube", score: 86, change: 38, sparkline: [40,42,48,55,60,65,72], category: "business" },
  { id: "yt4", title: "Top 10 outils IA pour créateurs 2026", query: "outils IA créateur", source: "youtube", score: 84, change: 35, sparkline: [25,30,35,45,55,65,70], category: "tech" },
  { id: "yt5", title: "Comment passer de 0 à 10K fans", query: "10K fans stratégie", source: "youtube", score: 82, change: 30, sparkline: [35,38,40,45,50,55,60], category: "growth" },
  { id: "yt6", title: "Funnel email qui convertit à 15%", query: "email funnel conversion", source: "youtube", score: 79, change: 25, sparkline: [30,32,35,38,42,48,52], category: "marketing" },
  { id: "yt7", title: "Je test les nouveaux outils IA", query: "test outils IA nouveaux", source: "youtube", score: 77, change: 22, sparkline: [40,42,44,48,50,52,55], category: "tech" },
  { id: "yt8", title: "Stratégie TikTok vs YouTube 2026", query: "TikTok vs YouTube stratégie", source: "youtube", score: 76, change: 20, sparkline: [45,46,48,50,52,54,56], category: "growth" },
  { id: "yt9", title: "Comment vendre sans être pushy", query: "vente sans être insistant", source: "youtube", score: 73, change: 14, sparkline: [30,32,34,36,38,40,42], category: "marketing" },
  { id: "yt10", title: "Les 5 erreurs CRM à éviter", query: "erreurs CRM créateur", source: "youtube", score: 70, change: 10, sparkline: [20,22,24,26,28,30,32], category: "business" },
];

const mockNewsItems: TrendItem[] = [
  { id: "n1", title: "L'économie créateur atteint 500M€ en France", query: "créateur économie France 2026", source: "news", score: 93, change: 48, sparkline: [40,45,50,58,65,72,80], category: "economy" },
  { id: "n2", title: "Nouvelle régulation IA en Europe", query: "régulation IA Europe 2026", source: "news", score: 90, change: 40, sparkline: [50,52,55,60,65,70,75], category: "regulation" },
  { id: "n3", title: "TikTok lance son programme créateur premium", query: "TikTok programme créateur premium", source: "news", score: 87, change: 35, sparkline: [30,35,40,48,55,60,68], category: "platform" },
  { id: "n4", title: "YouTube Shorts dépasse TikTok en France", query: "YouTube Shorts vs TikTok France", source: "news", score: 83, change: 28, sparkline: [45,48,50,52,55,58,60], category: "platform" },
  { id: "n5", title: "OnlyFans autorise les revenus publicitaires", query: "OnlyFans publicité revenue", source: "news", score: 81, change: 25, sparkline: [35,38,40,44,48,52,56], category: "platform" },
  { id: "n6", title: "Instagram teste les abonnements payants", query: "Instagram abonnements payants test", source: "news", score: 79, change: 20, sparkline: [25,28,30,34,38,42,46], category: "platform" },
  { id: "n7", title: "Le marketing SMS plus efficace que l'email", query: "SMS vs email marketing efficacité", source: "news", score: 76, change: 16, sparkline: [20,22,24,26,28,30,32], category: "marketing" },
  { id: "n8", title: "RGPD : nouvelles obligations pour les créateurs", query: "RGPD créateur obligations 2026", source: "news", score: 74, change: 12, sparkline: [15,18,20,22,24,26,28], category: "legal" },
];
