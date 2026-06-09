import type {
  PhotoParams,
  VideoParams,
  CarouselParams,
  StoryParams,
  PublishResult,
  PublisherConstructor,
} from "./types";

const FB_API = "https://graph.facebook.com/v18.0";
const POLL_INTERVAL = 2000;
const MAX_POLL_WAIT = 60000;

export class InstagramPublisher {
  private accessToken: string;
  private igUserId: string;

  constructor({ accessToken, platformUserId }: PublisherConstructor) {
    this.accessToken = accessToken;
    this.igUserId = platformUserId;
  }

  async publishPhoto(params: PhotoParams): Promise<PublishResult> {
    try {
      const container = await this.createContainer({
        image_url: params.image_url,
        caption: params.caption,
        location_id: params.location_id,
        user_tags: params.user_tags,
      });

      if (!container.id) {
        return { success: false, error: container.error?.message || "Failed to create container" };
      }

      const result = await this.publishContainer(container.id);
      return {
        success: true,
        platformPostId: result.id || container.id,
        statusCode: result.status_code,
      };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
  }

  async publishReel(params: VideoParams): Promise<PublishResult> {
    try {
      const container = await this.createContainer({
        media_type: "REELS",
        video_url: params.video_url,
        caption: params.caption,
        cover_url: params.cover_url,
        share_to_feed: params.share_to_feed ?? true,
      });

      if (!container.id) {
        return { success: false, error: container.error?.message || "Failed to create reel container" };
      }

      await this.waitForContainerReady(container.id);
      const result = await this.publishContainer(container.id);

      return {
        success: true,
        platformPostId: result.id || container.id,
        statusCode: result.status_code,
      };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
  }

  async publishCarousel(params: CarouselParams): Promise<PublishResult> {
    try {
      const itemContainers = await Promise.all(
        params.items.map(async (item) => {
          const res = await this.createContainer({
            media_type: item.type === "VIDEO" ? "VIDEO" : "IMAGE",
            [item.type === "VIDEO" ? "video_url" : "image_url"]: item.url,
            is_carousel_item: true,
          });
          if (!res.id) throw new Error(`Failed to create carousel item: ${res.error?.message}`);
          return res;
        })
      );

      const carousel = await this.createContainer({
        media_type: "CAROUSEL",
        children: itemContainers.map((c) => c.id).join(","),
        caption: params.caption,
      });

      if (!carousel.id) {
        return { success: false, error: carousel.error?.message || "Failed to create carousel" };
      }

      const result = await this.publishContainer(carousel.id);
      return {
        success: true,
        platformPostId: result.id || carousel.id,
        statusCode: result.status_code,
      };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
  }

  async publishStory(params: StoryParams): Promise<PublishResult> {
    try {
      const body: Record<string, unknown> = {
        media_type: "STORIES",
        access_token: this.accessToken,
      };
      body[params.type === "VIDEO" ? "video_url" : "image_url"] = params.media_url;

      const container = await this.createContainer(body);
      if (!container.id) {
        return { success: false, error: container.error?.message || "Failed to create story" };
      }

      if (params.type === "VIDEO") {
        await this.waitForContainerReady(container.id);
      }

      const result = await this.publishContainer(container.id);
      return {
        success: true,
        platformPostId: result.id || container.id,
        statusCode: result.status_code,
      };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
  }

  async getPostInsights(mediaId: string) {
    const metrics = "impressions,reach,engagement,likes,comments,saved,shares";
    const res = await fetch(
      `${FB_API}/${mediaId}/insights?metric=${metrics}&access_token=${this.accessToken}`
    );
    return await res.json();
  }

  // ─── Private helpers ───

  private async createContainer(body: Record<string, unknown>): Promise<any> {
    const res = await fetch(`${FB_API}/${this.igUserId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, access_token: this.accessToken }),
    });
    return res.json();
  }

  private async publishContainer(containerId: string): Promise<any> {
    const res = await fetch(`${FB_API}/${this.igUserId}/media_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creation_id: containerId, access_token: this.accessToken }),
    });
    return res.json();
  }

  private async waitForContainerReady(containerId: string): Promise<boolean> {
    const start = Date.now();
    while (Date.now() - start < MAX_POLL_WAIT) {
      const res = await fetch(
        `${FB_API}/${containerId}?fields=status_code&access_token=${this.accessToken}`
      );
      const data = await res.json();
      if (data.status_code === "FINISHED") return true;
      if (data.status_code === "ERROR") throw new Error(`Media processing failed: ${data.error?.message || "unknown"}`);
      await new Promise((r) => setTimeout(r, POLL_INTERVAL));
    }
    throw new Error("Media processing timeout");
  }
}
