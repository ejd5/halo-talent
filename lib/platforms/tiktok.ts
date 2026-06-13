import type { TikTokVideoParams, PublishResult, PublisherConstructor } from "./types";

const TIKTOK_API = "https://open.tiktokapis.com/v2";
const POLL_INTERVAL = 3000;
const MAX_POLL_WAIT = 180000; // 3 min, videos take time to process

export class TikTokPublisher {
  private accessToken: string;
  private openId: string;

  constructor({ accessToken, platformUserId }: PublisherConstructor) {
    this.accessToken = accessToken;
    this.openId = platformUserId;
  }

  async publishVideo(params: TikTokVideoParams): Promise<PublishResult> {
    try {
      // Step 1: Initiate video upload
      const initRes = await fetch(`${TIKTOK_API}/video/upload/init/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_info: { source: "FILE_UPLOAD", video_size: 0, chunk_size: 0, total_chunk_count: 1 },
        }),
      });
      const init = await initRes.json();
      if (!init.data?.upload_url) {
        return { success: false, error: init.error?.message || "Failed to init upload" };
      }

      // Step 2: Upload video binary
      const uploadRes = await fetch(init.data.upload_url, {
        method: "POST",
        headers: { "Content-Type": "video/mp4" },
        body: await fetch(params.video_url).then((r) => r.blob()),
      });
      if (!uploadRes.ok) {
        return { success: false, error: "Video upload failed" };
      }

      // Step 3: Publish
      const publishRes = await fetch(`${TIKTOK_API}/video/publish/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_info: {
            title: params.caption,
            privacy_level: params.privacy_level || "PUBLIC",
            allow_duet: params.allow_duet ?? true,
            allow_stitch: params.allow_stitch ?? true,
            comment_disabled: params.comment_disabled ?? false,
          },
          source_info: { source: "FILE_UPLOAD", video_size: 0, chunk_size: 0, total_chunk_count: 1 },
        }),
      });
      const publish = await publishRes.json();

      // Step 4: Poll until published
      const publishId = publish.data?.publish_id;
      if (publishId) {
        return await this.pollPublishStatus(publishId);
      }

      return { success: true, platformPostId: publish.data?.id };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
  }

  async checkStatus(publishId: string): Promise<PublishResult> {
    try {
      const res = await fetch(`${TIKTOK_API}/video/publish/status/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publish_id: publishId }),
      });
      const data = await res.json();
      const status = data.data?.status;
      return {
        success: status === "PUBLISH_COMPLETE",
        platformPostId: data.data?.post_id,
        statusCode: status,
        error: data.error?.message,
      };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
  }

  private async pollPublishStatus(publishId: string): Promise<PublishResult> {
    const start = Date.now();
    while (Date.now() - start < MAX_POLL_WAIT) {
      const status = await this.checkStatus(publishId);
      if (status.statusCode === "PUBLISH_COMPLETE") return status;
      if (status.statusCode === "FAILED") {
        return { success: false, error: status.error || "Publishing failed" };
      }
      await new Promise((r) => setTimeout(r, POLL_INTERVAL));
    }
    return { success: false, error: "Publishing timeout" };
  }
}
