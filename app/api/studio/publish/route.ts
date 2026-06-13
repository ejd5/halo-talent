import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { PublishRequest, PublishResponse, PublishResult } from "@/lib/studio/types";

async function publishToPlatform(
  platform: string,
  subType: string,
  payload: { media: PublishRequest["media"]; caption: PublishRequest["caption"]; config: PublishRequest["config"] },
  retries = 3
): Promise<PublishResult> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const syncUrl = process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/platforms/${platform}/sync`
        : `http://localhost:3005/api/platforms/${platform}/sync`;

      const res = await fetch(syncUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subType,
          media: payload.media,
          caption: payload.caption,
          config: payload.config,
        }),
        signal: AbortSignal.timeout(30000),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          platform: platform as PublishResult["platform"],
          subType: subType as PublishResult["subType"],
          success: true,
          postId: data.postId || data.id || `mock-${Date.now()}`,
        };
      }

      const errorText = await res.text();

      // Don't retry 4xx errors
      if (res.status >= 400 && res.status < 500) {
        return {
          platform: platform as PublishResult["platform"],
          subType: subType as PublishResult["subType"],
          success: false,
          error: `HTTP ${res.status}: ${errorText.slice(0, 200)}`,
        };
      }

      // Retry on 5xx
      if (attempt < retries - 1) {
        await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000));
      }
    } catch (err) {
      if (attempt < retries - 1) {
        await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000));
        continue;
      }
      return {
        platform: platform as PublishResult["platform"],
        subType: subType as PublishResult["subType"],
        success: false,
        error: err instanceof Error ? err.message : "Erreur inconnue",
      };
    }
  }

  return {
    platform: platform as PublishResult["platform"],
    subType: subType as PublishResult["subType"],
    success: false,
    error: "Max retries atteint",
  };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body: PublishRequest = await request.json();

    if (!body.platforms || body.platforms.length === 0) {
      return NextResponse.json({ error: "Au moins une plateforme requise" }, { status: 400 });
    }

    // Dispatch to all platforms in parallel
    // Each platform runs independently, failures don't block others
    const results = await Promise.allSettled(
      body.platforms.map((p) =>
        publishToPlatform(p.platform, p.subType, {
          media: body.media,
          caption: body.caption,
          config: body.config,
        })
      )
    );

    const resolved: PublishResult[] = results.map((r) =>
      r.status === "fulfilled"
        ? r.value
        : {
            platform: "instagram" as const,
            subType: "post" as const,
            success: false,
            error: r.reason instanceof Error ? r.reason.message : "Erreur inconnue",
          }
    );

    const succeeded = resolved.filter((r) => r.success);
    const failed = resolved.filter((r) => !r.success);

    const response: PublishResponse = {
      success: failed.length === 0,
      results: resolved,
      failed,
    };

    // Log the publish attempt for history
    try {
      await supabase.from("publish_logs").insert({
        creator_id: user.id,
        platforms: body.platforms,
        results: resolved,
        status: failed.length === 0 ? "success" : "partial",
        created_at: new Date().toISOString(),
      });
    } catch {
      // Non-blocking, logging failure shouldn't fail the request
    }

    return NextResponse.json(response);
  } catch (err) {
    console.error("[PUBLISH API] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
