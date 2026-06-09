export class NewsTrendsProvider {
  async getTopHeadlines(params: {
    country?: string;
    category?: string;
    q?: string;
  }) {
    const sp = new URLSearchParams();
    if (params.country) sp.set("country", params.country);
    if (params.category) sp.set("category", params.category);
    if (params.q) sp.set("q", params.q);
    sp.set("apiKey", process.env.NEWSAPI_KEY!);

    const response = await fetch(`https://newsapi.org/v2/top-headlines?${sp}`);
    if (!response.ok) throw new Error(`NewsAPI: ${response.status}`);
    const data = await response.json();
    return data.articles;
  }

  async searchEverything(query: string, from?: Date) {
    const sp = new URLSearchParams();
    sp.set("q", query);
    sp.set("sortBy", "popularity");
    if (from) sp.set("from", from.toISOString());
    sp.set("apiKey", process.env.NEWSAPI_KEY!);

    const response = await fetch(`https://newsapi.org/v2/everything?${sp}`);
    const data = await response.json();
    return data.articles;
  }
}
