import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { TrendAggregator } from "@/lib/trends/aggregator";
import { ViralityScorer } from "@/lib/trends/scoring";
import { TikTokCreativeProvider } from "@/lib/trends/providers/tiktok-creative";
import { notify } from "@/lib/notifications";
import Anthropic from "@anthropic-ai/sdk";

export async function GET(request: NextRequest) {
  if (
    request.headers.get("authorization") !==
    `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: premiumCreators } = await admin
    .from("profiles")
    .select("id, full_name, department")
    .in("role", ["creator", "manager"]);

  const aggregator = new TrendAggregator();
  const scorer = new ViralityScorer();
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const tiktok = new TikTokCreativeProvider();

  let sent = 0;
  let failed = 0;

  for (const creator of premiumCreators || []) {
    try {
      const trends = await aggregator.getCrossPlatformTrends(creator.id);
      const top3 = trends.slice(0, 3).map((t) => ({
        title: t.title,
        query: t.query,
        score: t.relevanceScore,
        momentum: t.momentum,
      }));

      // TikTok trends section
      let tiktokSection = "";
      try {
        const [hashtags, songs] = await Promise.all([
          tiktok.getTrendingHashtags({ region: "FR", period: "7" }),
          tiktok.getTrendingSongs({ region: "FR", period: "7", commercialOnly: false }),
        ]);
        const topHashtags = (hashtags || []).slice(0, 5);
        const topSongs = (songs || []).slice(0, 3);
        if (topHashtags.length > 0 || topSongs.length > 0) {
          tiktokSection = "\n\nTIKTOK CREATIVE LAB :\n";
          if (topHashtags.length > 0) {
            tiktokSection += `Hashtags tendances : ${topHashtags.map((h: any) => `#${h.name}`).join(", ")}\n`;
          }
          if (topSongs.length > 0) {
            tiktokSection += `Sons viraux : ${topSongs.map((s: any) => `${s.title} par ${s.author}`).join(", ")}`;
          }
        }
      } catch {
        tiktokSection = "\n\nTikTok : indisponible aujourd'hui.";
      }

      let digestText = "Voici les 3 tendances du jour :";
      if (top3.length > 0) {
        const scored = top3.map((t) => ({
          ...t,
          virality: scorer.calculate(
            { history: [], platforms: [], countries: [] },
            null,
          ),
        }));

        if (process.env.ANTHROPIC_API_KEY) {
          try {
            const response = await anthropic.messages.create({
              model: "claude-sonnet-4-20250514",
              max_tokens: 1000,
              messages: [
                {
                  role: "user",
                  content: `Génère un brief matinal personnalisé pour un créateur. TOP 3 TENDANCES : ${JSON.stringify(scored, null, 2)}${tiktokSection}. Pour chaque tendance : 1 phrase d'explication courte + 1 suggestion concrète de contenu. Inclus les tendances TikTok si disponibles. Format court, actionnable.`,
                },
              ],
            });
            digestText =
              response.content[0].type === "text"
                ? response.content[0].text
                : digestText;
          } catch {
            digestText = top3
              .map(
                (t, i) =>
                  `${i + 1}. **${t.title}** — Score: ${t.score}/100, Momentum: ${t.momentum}%\n   Suggestion : Crée un contenu autour de "${t.query}"`,
              )
              .join("\n\n") + tiktokSection;
          }
        } else {
          digestText = top3
            .map(
              (t, i) =>
                `${i + 1}. **${t.title}** — Score: ${t.score}/100, Momentum: ${t.momentum}%`,
            )
            .join("\n\n") + tiktokSection;
        }
      } else {
        digestText += tiktokSection;
      }

      await notify({
        userId: creator.id,
        type: "trend_daily_digest",
        title: "☀️ Brief tendances du jour",
        message: digestText,
        channels: ["in_app", "push"],
      });

      sent++;
    } catch (e) {
      console.error(`[DAILY DIGEST] Failed for ${creator.id}:`, e);
      failed++;
    }
  }

  return NextResponse.json({
    ok: true,
    sent,
    failed,
    timestamp: new Date(),
  });
}
