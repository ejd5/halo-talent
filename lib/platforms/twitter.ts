import type { TweetParams, PublishResult, PublisherConstructor } from "./types";

export class TwitterPublisher {
  private accessToken: string;
  private userId: string;

  constructor({ accessToken, platformUserId }: PublisherConstructor) {
    this.accessToken = accessToken;
    this.userId = platformUserId;
  }

  async publishTweet(params: TweetParams): Promise<PublishResult> {
    try {
      // Step 1: Upload media if any
      const mediaIds: string[] = [];
      if (params.media_urls?.length) {
        for (const url of params.media_urls) {
          const mediaRes = await fetch(url);
          const mediaBuffer = await mediaRes.arrayBuffer();

          const formData = new FormData();
          formData.append("media", new Blob([mediaBuffer]));

          const uploadRes = await fetch("https://api.twitter.com/2/media/upload", {
            method: "POST",
            headers: { Authorization: `Bearer ${this.accessToken}` },
            body: formData,
          });
          const uploadData = await uploadRes.json();
          if (uploadData.media_id_string) mediaIds.push(uploadData.media_id_string);
        }
      }

      // Step 2: Create tweet
      const body: Record<string, unknown> = { text: params.text };
      if (mediaIds.length > 0) {
        body.media = { media_ids: mediaIds };
      }

      const res = await fetch("https://api.twitter.com/2/tweets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.detail || data.title || `HTTP ${res.status}` };
      }

      return { success: true, platformPostId: data.data?.id };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
  }

  async publishThread(tweets: TweetParams[]): Promise<PublishResult[]> {
    const results: PublishResult[] = [];
    let replyToId: string | undefined;

    for (const tweet of tweets) {
      const result = await this.publishTweet({ ...tweet, reply_to: replyToId });
      if (result.success && result.platformPostId) {
        replyToId = result.platformPostId;
      }
      results.push(result);
    }

    return results;
  }
}
