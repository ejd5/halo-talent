import type { LinkedInPostParams, PublishResult, PublisherConstructor } from "./types";

export class LinkedInPublisher {
  private accessToken: string;
  private personId: string;

  constructor({ accessToken, platformUserId }: PublisherConstructor) {
    this.accessToken = accessToken;
    this.personId = platformUserId;
  }

  async publishPost(params: LinkedInPostParams): Promise<PublishResult> {
    try {
      // LinkedIn API uses URN format
      const author = `urn:li:person:${this.personId}`;

      // Build media attachments if any
      const media: any[] = [];
      if (params.media_urls?.length) {
        for (const url of params.media_urls) {
          media.push({
            status: "READY",
            description: { text: params.text.slice(0, 200) },
            media: url,
          });
        }
      }

      const body: Record<string, unknown> = {
        author,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text: params.text },
            shareMediaCategory: media.length > 0 ? "IMAGE" : "NONE",
            media: media.length > 0 ? media : undefined,
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": params.visibility || "PUBLIC",
        },
      };

      const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { success: false, error: err.message || `HTTP ${res.status}` };
      }

      // LinkedIn returns the post ID in the Location header
      const location = res.headers.get("Location") || "";
      const postId = location.split("/").pop() || "";

      return { success: true, platformPostId: postId };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
  }
}
