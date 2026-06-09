export class RedditTrendsProvider {
  async getTopPosts(params: {
    subreddit: string;
    timeframe: "hour" | "day" | "week" | "month";
    limit?: number;
  }) {
    const url =
      `https://www.reddit.com/r/${params.subreddit}/top.json?` +
      `t=${params.timeframe}&limit=${params.limit || 25}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "TrendHubPro/1.0 (by /u/maison_creative)",
      },
    });
    if (!response.ok) throw new Error(`Reddit: ${response.status}`);

    const data = await response.json();
    return data.data.children.map((c: any) => ({
      id: c.data.id,
      title: c.data.title,
      author: c.data.author,
      subreddit: c.data.subreddit,
      score: c.data.score,
      num_comments: c.data.num_comments,
      created_utc: new Date(c.data.created_utc * 1000),
      url: `https://reddit.com${c.data.permalink}`,
      thumbnail: c.data.thumbnail,
    }));
  }

  async detectEmergingTopics(subreddits: string[]) {
    const allPosts = await Promise.all(
      subreddits.map((s) =>
        this.getTopPosts({ subreddit: s, timeframe: "day", limit: 50 }),
      ),
    );

    const keywordCounts = new Map<string, number>();
    allPosts.flat().forEach((post) => {
      const keywords = this.extractKeywords(post.title);
      keywords.forEach((kw) =>
        keywordCounts.set(kw, (keywordCounts.get(kw) || 0) + 1),
      );
    });

    return Array.from(keywordCounts.entries())
      .filter(([_, count]) => count >= 3)
      .map(([keyword, count]) => ({ keyword, count, sources: subreddits }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }

  private extractKeywords(title: string): string[] {
    const stopwords = new Set([
      "this",
      "that",
      "with",
      "have",
      "from",
      "about",
    ]);
    return title
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 4 && !stopwords.has(w));
  }
}
