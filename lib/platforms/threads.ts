import type { PhotoParams, PublishResult, PublisherConstructor } from "./types";

export class ThreadsPublisher {
  private accessToken: string;
  private threadsUserId: string;

  constructor({ accessToken, platformUserId }: PublisherConstructor) {
    this.accessToken = accessToken;
    this.threadsUserId = platformUserId;
  }

  async publishThread(params: PhotoParams): Promise<PublishResult> {
    try {
      // Step 1: Create media container
      const containerRes = await fetch(
        `https://graph.threads.net/v1.0/${this.threadsUserId}/threads`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            media_type: "IMAGE",
            image_url: params.image_url,
            text: params.caption,
            access_token: this.accessToken,
          }),
        }
      );
      const container = await containerRes.json();
      if (!container.id) {
        return { success: false, error: container.error?.message || "Failed to create container" };
      }

      // Step 2: Publish
      const publishRes = await fetch(
        `https://graph.threads.net/v1.0/${this.threadsUserId}/threads_publish`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ creation_id: container.id, access_token: this.accessToken }),
        }
      );
      const result = await publishRes.json();

      return {
        success: true,
        platformPostId: result.id || container.id,
      };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
  }
}
