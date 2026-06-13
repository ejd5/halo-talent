import type { BlueskyPostParams, PublishResult, PublisherConstructor } from "./types";

// Bluesky uses AT Protocol, no OAuth, just API key / app password
// Uses @atproto/api SDK or direct HTTP to the PDS

export class BlueskyPublisher {
  private accessToken: string;
  private did: string;

  constructor({ accessToken, platformUserId }: PublisherConstructor) {
    this.accessToken = accessToken;
    this.did = platformUserId;
  }

  async publishPost(params: BlueskyPostParams): Promise<PublishResult> {
    try {
      const pdsUrl = "https://bsky.social";

      // Build embed if images
      let embed: Record<string, unknown> | undefined;
      if (params.image_urls?.length) {
        const images = await Promise.all(
          params.image_urls.map(async (url) => {
            const imgRes = await fetch(url);
            const imgBuffer = await imgRes.arrayBuffer();
            const base64 = Buffer.from(imgBuffer).toString("base64");
            const mimeType = imgRes.headers.get("content-type") || "image/jpeg";

            // Upload blob to PDS
            const blobRes = await fetch(`${pdsUrl}/xrpc/com.atproto.repo.uploadBlob`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": mimeType,
              },
              body: Buffer.from(base64, "base64"),
            });
            const blob = await blobRes.json();
            return {
              alt: "",
              image: blob.data?.blob || blob.blob,
            };
          })
        );
        embed = {
          $type: "app.bsky.embed.images",
          images,
        };
      }

      // Create the record
      const record: Record<string, unknown> = {
        $type: "app.bsky.feed.post",
        text: params.text,
        createdAt: new Date().toISOString(),
        langs: params.langs || ["fr"],
      };

      if (embed) record.embed = embed;
      if (params.reply_to) {
        record.reply = {
          parent: { uri: params.reply_to, cid: "" },
          root: { uri: params.reply_to, cid: "" },
        };
      }

      const res = await fetch(`${pdsUrl}/xrpc/com.atproto.repo.createRecord`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repo: this.did,
          collection: "app.bsky.feed.post",
          record,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.message || `HTTP ${res.status}` };
      }

      return { success: true, platformPostId: data.uri };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
  }
}
