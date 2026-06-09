import { type NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { exchangeCodeForToken, getPlatformUserInfo, decodeOAuthState, getOAuthProvider } from "@/lib/studio/oauth";
import { encrypt } from "@/lib/crypto";

export async function GET(request: NextRequest, ctx: RouteContext<"/api/oauth/[platform]/callback">) {
  try {
    const { platform } = await ctx.params;
    const code = request.nextUrl.searchParams.get("code");
    const state = request.nextUrl.searchParams.get("state");
    const error = request.nextUrl.searchParams.get("error");

    const provider = getOAuthProvider(platform);
    if (!provider) {
      return NextResponse.redirect(new URL("/studio/platforms?error=unsupported", request.url));
    }

    // Handle provider error (user denied, etc.)
    if (error) {
      return NextResponse.redirect(
        new URL(`/studio/platforms?error=${error}&platform=${platform}`, request.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/studio/platforms?error=missing_params", request.url)
      );
    }

    // Verify state
    const decodedState = decodeOAuthState(state);
    if (!decodedState || decodedState.platform !== platform) {
      return NextResponse.redirect(
        new URL("/studio/platforms?error=invalid_state", request.url)
      );
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForToken(platform, code);

    // Get platform user info
    const platformUserInfo = await getPlatformUserInfo(platform, tokens.access_token);

    // Encrypt tokens
    const encryptedAccessToken = encrypt(tokens.access_token);
    const encryptedRefreshToken = tokens.refresh_token ? encrypt(tokens.refresh_token) : null;

    // Upsert connection in DB
    const supabase = createAdminClient();
    const { error: upsertError } = await supabase.from("platform_connections").upsert(
      {
        creator_id: decodedState.userId,
        platform,
        platform_user_id: platformUserInfo.id,
        platform_username: platformUserInfo.username,
        platform_followers: platformUserInfo.followers || 0,
        access_token: encryptedAccessToken,
        refresh_token: encryptedRefreshToken,
        expires_at: tokens.expires_at || null,
        scopes: tokens.scopes,
        metadata: platformUserInfo.metadata || {},
        status: "active",
        last_sync_at: new Date().toISOString(),
      },
      { onConflict: "creator_id, platform" }
    );

    if (upsertError) {
      console.error(`[OAUTH CALLBACK] Upsert error:`, upsertError);
      return NextResponse.redirect(
        new URL("/studio/platforms?error=db_error", request.url)
      );
    }

    return NextResponse.redirect(
      new URL(`/studio/platforms?success=${platform}`, request.url)
    );
  } catch (err) {
    console.error(`[OAUTH CALLBACK] Error:`, err);
    return NextResponse.redirect(
      new URL("/studio/platforms?error=server_error", request.url)
    );
  }
}
