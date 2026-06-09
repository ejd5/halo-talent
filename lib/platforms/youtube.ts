import type { YouTubeVideoParams, PublishResult, PublisherConstructor } from "./types";

export class YouTubePublisher {
  private accessToken: string;
  private channelId: string;

  constructor({ accessToken, platformUserId }: PublisherConstructor) {
    this.accessToken = accessToken;
    this.channelId = platformUserId;
  }

  async publishVideo(params: YouTubeVideoParams): Promise<PublishResult> {
    try {
      // YouTube uses resumable upload via multipart
      // Step 1: Get the video binary
      const videoRes = await fetch(params.video_url);
      const videoBlob = await videoBlobFromUrl(params.video_url);

      // Step 2: Upload with metadata
      const boundary = `boundary_${Date.now()}`;
      const metadata = JSON.stringify({
        snippet: {
          title: params.title,
          description: params.description,
          tags: params.tags || [],
          categoryId: params.category_id || "22",
        },
        status: {
          privacyStatus: params.privacy_status || "public",
          selfDeclaredMadeForKids: false,
        },
      });

      const body = [
        `--${boundary}`,
        "Content-Type: application/json; charset=UTF-8",
        "",
        metadata,
        `--${boundary}`,
        "Content-Type: video/*",
        "Content-Transfer-Encoding: binary",
        "",
        videoBlob,
        `--${boundary}--`,
      ].join("\r\n");

      const res = await fetch(
        "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": `multipart/related; boundary=${boundary}`,
            "Content-Length": String(new Blob([body]).size),
          },
          body,
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { success: false, error: err.error?.message || `HTTP ${res.status}` };
      }

      const data = await res.json();
      return {
        success: true,
        platformPostId: data.id,
        statusCode: data.status?.uploadStatus,
      };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
  }

  async publishShort(params: YouTubeVideoParams): Promise<PublishResult> {
    return this.publishVideo({
      ...params,
      tags: [...(params.tags || []), "#Shorts"],
      category_id: params.category_id || "22",
    });
  }

  async getQuotaUsage(): Promise<{ used: number; remaining: number }> {
    return { used: 0, remaining: 10000 };
  }
}

async function videoBlobFromUrl(url: string): Promise<string> {
  // In a server context, fetch and return as base64 or buffer
  // Real implementation would stream the file
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  // Return a placeholder for the actual binary content
  return Buffer.from(buffer).toString("base64");
}
