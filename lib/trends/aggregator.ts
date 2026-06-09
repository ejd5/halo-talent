import { GoogleTrendsProvider } from "./providers/google";
import { YouTubeTrendsProvider } from "./providers/youtube";
import { RedditTrendsProvider } from "./providers/reddit";
import { NewsTrendsProvider } from "./providers/news";
import { createClient } from "@/lib/supabase/server";
import type { AggregatedTrend, TrendItem } from "./types";
import Anthropic from "@anthropic-ai/sdk";

async function getCreatorDNA(
  creatorId: string,
): Promise<{ audience_profile?: { primary_country?: string }; basic_info?: { department?: string } }> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("profiles")
      .select("department")
      .eq("id", creatorId)
      .single();
    return {
      basic_info: { department: data?.department ?? undefined },
      audience_profile: { primary_country: "FR" },
    };
  } catch {
    return {
      basic_info: {},
      audience_profile: { primary_country: "FR" },
    };
  }
}

export class TrendAggregator {
  private google = new GoogleTrendsProvider();
  private youtube = new YouTubeTrendsProvider();
  private reddit = new RedditTrendsProvider();
  private news = new NewsTrendsProvider();
  private anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  async getCrossPlatformTrends(creatorId: string): Promise<AggregatedTrend[]> {
    const dna = await getCreatorDNA(creatorId);
    const geo = dna.audience_profile?.primary_country || "WORLD";
    const subreddits = this.getRelevantSubreddits(dna);

    const [googleDaily, ytTrending, redditEmerging, newsTop] =
      await Promise.all([
        this.google.getDailyTrends(geo).catch(() => []),
        this.youtube.getTrendingVideos({ regionCode: geo }).catch(() => []),
        this.reddit.detectEmergingTopics(subreddits).catch(() => []),
        this.news.getTopHeadlines({ country: geo.toLowerCase() }).catch(() => []),
      ]);

    return this.mergeAndScore(
      {
        google: googleDaily,
        youtube: ytTrending,
        reddit: redditEmerging,
        news: newsTop,
      },
      dna,
    );
  }

  private async mergeAndScore(sources: any, dna: any): Promise<AggregatedTrend[]> {
    const concepts = await this.extractConceptsWithClaude(sources);
    return concepts
      .map((c: any) => {
        const momentum = Math.round(c.momentum ?? this.estimateWindow(c));
        let opportunityWindow = "1 mois";
        if (momentum > 40) opportunityWindow = "48h";
        else if (momentum > 25) opportunityWindow = "1 semaine";
        else if (momentum > 15) opportunityWindow = "2 semaines";

        const sources = (c.sources ?? ["google"]) as TrendItem["source"][];
        const topSource = sources[0] ?? "google";

        return {
          id: `agg_${(c.query ?? c.title ?? "trend").replace(/\s+/g, "_").slice(0, 30)}`,
          title: c.title ?? "Tendance émergente",
          query: c.query ?? c.title ?? "",
          sources,
          relevanceScore: c.relevance_to_creator ?? c.relevanceScore ?? this.scoreRelevance(c, dna),
          viralityScore: c.viral_score ?? c.viralityScore ?? this.scoreViral(c),
          momentum,
          sparkline: c.sparkline ?? this.generateSparkline(),
          opportunityWindow,
          topSource,
        };
      })
      .sort((a: AggregatedTrend, b: AggregatedTrend) =>
        b.relevanceScore - a.relevanceScore,
      )
      .slice(0, 10);
  }

  private async extractConceptsWithClaude(sources: any): Promise<any[]> {
    if (!process.env.ANTHROPIC_API_KEY) {
      return this.generateFallbackConcepts(sources);
    }
    try {
      const response = await this.anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: `Identifie les concepts/thèmes qui émergent simultanément sur plusieurs plateformes. SOURCES : ${JSON.stringify(sources, null, 2).slice(0, 8000)} Retourne UN JSON : ...`,
          },
        ],
      });
      const text =
        response.content[0].type === "text" ? response.content[0].text : "{}";
      const parsed = JSON.parse(text);
      return parsed.concepts ?? [];
    } catch {
      return this.generateFallbackConcepts(sources);
    }
  }

  private generateFallbackConcepts(sources: any): any[] {
    const concepts: any[] = [];
    const platformLabels: Record<string, string> = {
      google: "Google Trends",
      youtube: "YouTube",
      reddit: "Reddit",
      news: "News",
    };

    // Extract trending topics from each platform
    for (const [platform, items] of Object.entries(sources)) {
      if (!Array.isArray(items) || items.length === 0) continue;
      const sample = items.slice(0, 3);
      sample.forEach((item: any, i: number) => {
        const title =
          item.title ??
          item.keyword ??
          (typeof item === "string" ? item : `Trend #${i + 1}`);
        const momentum =
          item.momentum ?? item.change ?? Math.floor(Math.random() * 40 + 10);
        const score =
          item.score ??
          item.relevanceScore ??
          Math.floor(Math.random() * 40 + 40);
        concepts.push({
          title,
          query: item.query ?? item.keyword ?? title,
          momentum,
          relevanceScore: score,
          viralityScore: this.scoreViral(null),
          sources: [platform],
          sparkline: this.generateSparkline(),
        });
      });
    }

    return concepts.sort(
      (a: any, b: any) => (b.momentum ?? 0) - (a.momentum ?? 0),
    );
  }

  private generateSparkline(): number[] {
    return Array.from({ length: 7 }, () =>
      Math.floor(Math.random() * 60 + 20),
    );
  }

  private getRelevantSubreddits(dna: any): string[] {
    const department = dna.basic_info?.department;
    const map: Record<string, string[]> = {
      music: ["Music", "WeAreTheMusicMakers", "edmproduction"],
      sport: ["Fitness", "bodyweightfitness", "running"],
      business: ["Entrepreneur", "smallbusiness", "marketing"],
      digital: ["InstagramMarketing", "TikTokAds", "influencermarketing"],
      talent_premium: ["CreatorsAdvice", "onlyfansadvice101"],
    };
    return map[department] || ["CreatorsAdvice"];
  }

  private scoreRelevance(_concept: any, _dna: any): number {
    return 50;
  }
  private scoreViral(_concept: any): number {
    return 50;
  }
  private estimateWindow(_concept: any): number {
    return 72;
  }
}
