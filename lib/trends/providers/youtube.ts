export class YouTubeTrendsProvider {
  async getTrendingVideos(params: {
    regionCode: string;
    categoryId?: string;
    maxResults?: number;
  }) {
    const url =
      `https://www.googleapis.com/youtube/v3/videos?` +
      `part=snippet,statistics&chart=mostPopular` +
      `&regionCode=${params.regionCode}` +
      `&categoryId=${params.categoryId || ""}` +
      `&maxResults=${params.maxResults || 25}` +
      `&key=${process.env.YOUTUBE_API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`YouTube: ${response.status}`);
    const data = await response.json();

    return data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      published_at: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails.high.url,
      views: parseInt(item.statistics.viewCount),
      likes: parseInt(item.statistics.likeCount || 0),
      momentum: this.calculateMomentum(item),
    }));
  }

  async searchInNiche(query: string, days: number = 7) {
    const publishedAfter = new Date(
      Date.now() - days * 86400000,
    ).toISOString();
    const url =
      `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&q=${encodeURIComponent(query)}&type=video` +
      `&order=viewCount&publishedAfter=${publishedAfter}` +
      `&maxResults=25&key=${process.env.YOUTUBE_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.items;
  }

  private calculateMomentum(video: any): number {
    const hoursLive =
      (Date.now() - new Date(video.snippet.publishedAt).getTime()) / 3600000;
    return parseInt(video.statistics.viewCount) / Math.max(hoursLive, 1);
  }
}
