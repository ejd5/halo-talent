import type { PlatformConnection, PlatformType, OAuthProvider } from "./types";
import { OAUTH_PROVIDERS } from "./types";

// ─── OAuth State helpers (CSRF protection) ───

interface OAuthState {
  userId: string;
  platform: string;
  redirectTo: string;
  nonce: string;
}

export function encodeOAuthState(state: OAuthState): string {
  const json = JSON.stringify(state);
  return Buffer.from(json).toString("base64url");
}

export function decodeOAuthState(encoded: string): OAuthState | null {
  try {
    const json = Buffer.from(encoded, "base64url").toString();
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// ─── Provider info ───

export function getOAuthProvider(platform: string): OAuthProvider | undefined {
  return OAUTH_PROVIDERS.find((p) => p.type === platform);
}

// ─── Auth URL builders ───

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3005";
}

export function buildAuthUrl(platform: string, state: string): string {
  const redirectUri = `${getBaseUrl()}/api/oauth/${platform}/callback`;
  const provider = getOAuthProvider(platform);
  if (!provider) throw new Error(`Unknown platform: ${platform}`);

  switch (platform) {
    case "instagram":
    case "threads": {
      const appId = process.env[`${platform.toUpperCase()}_APP_ID`] || process.env.META_APP_ID;
      return `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&state=${state}&scope=${provider.scopes.join(",")}&response_type=code`;
    }
    case "tiktok": {
      const clientKey = process.env.TIKTOK_CLIENT_KEY;
      return `https://www.tiktok.com/v2/auth/authorize?client_key=${clientKey}&redirect_uri=${redirectUri}&state=${state}&scope=${provider.scopes.join(",")}&response_type=code`;
    }
    case "youtube": {
      const clientId = process.env.YOUTUBE_CLIENT_ID;
      return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${provider.scopes.join(",")}&response_type=code&access_type=offline&prompt=consent`;
    }
    case "twitter": {
      const clientId = process.env.TWITTER_CLIENT_ID;
      return `https://twitter.com/i/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${provider.scopes.join(" ")}&response_type=code&code_challenge=challenge&code_challenge_method=plain`;
    }
    case "linkedin": {
      const clientId = process.env.LINKEDIN_CLIENT_ID;
      return `https://www.linkedin.com/oauth/v2/authorization?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${provider.scopes.join(",")}&response_type=code`;
    }
    default:
      throw new Error(`Auth URL not implemented for: ${platform}`);
  }
}

// ─── Token exchange ───

interface TokenResult {
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
  scopes: string[];
}

export async function exchangeCodeForToken(platform: string, code: string): Promise<TokenResult> {
  const redirectUri = `${getBaseUrl()}/api/oauth/${platform}/callback`;
  const provider = getOAuthProvider(platform);
  if (!provider) throw new Error(`Unknown platform: ${platform}`);

  switch (platform) {
    case "instagram":
    case "threads": {
      const appId = process.env[`${platform.toUpperCase()}_APP_ID`] || process.env.META_APP_ID;
      const appSecret = process.env[`${platform.toUpperCase()}_APP_SECRET`] || process.env.META_APP_SECRET;
      const res = await fetch("https://graph.facebook.com/v19.0/oauth/access_token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: appId, client_secret: appSecret, code, redirect_uri: redirectUri,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Token exchange failed");
      return {
        access_token: data.access_token,
        expires_at: data.expires_in ? new Date(Date.now() + data.expires_in * 1000).toISOString() : undefined,
        scopes: provider.scopes,
      };
    }
    case "tiktok": {
      const clientKey = process.env.TIKTOK_CLIENT_KEY;
      const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
      const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_key: clientKey!, client_secret: clientSecret!, code, redirect_uri: redirectUri, grant_type: "authorization_code",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error_description || "Token exchange failed");
      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_in ? new Date(Date.now() + data.expires_in * 1000).toISOString() : undefined,
        scopes: provider.scopes,
      };
    }
    case "youtube": {
      const clientId = process.env.YOUTUBE_CLIENT_ID;
      const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
      const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId!, client_secret: clientSecret!, code, redirect_uri: redirectUri, grant_type: "authorization_code",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error_description || "Token exchange failed");
      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_in ? new Date(Date.now() + data.expires_in * 1000).toISOString() : undefined,
        scopes: provider.scopes,
      };
    }
    case "twitter": {
      const clientId = process.env.TWITTER_CLIENT_ID;
      const clientSecret = process.env.TWITTER_CLIENT_SECRET;
      const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
      const res = await fetch("https://api.twitter.com/2/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Basic ${basicAuth}` },
        body: new URLSearchParams({
          code, redirect_uri: redirectUri, grant_type: "authorization_code", code_verifier: "challenge",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error_description || "Token exchange failed");
      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_in ? new Date(Date.now() + data.expires_in * 1000).toISOString() : undefined,
        scopes: provider.scopes,
      };
    }
    case "linkedin": {
      const clientId = process.env.LINKEDIN_CLIENT_ID;
      const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
      const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId!, client_secret: clientSecret!, code, redirect_uri: redirectUri, grant_type: "authorization_code",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error_description || "Token exchange failed");
      return {
        access_token: data.access_token,
        expires_at: data.expires_in ? new Date(Date.now() + data.expires_in * 1000).toISOString() : undefined,
        scopes: provider.scopes,
      };
    }
    default:
      throw new Error(`Token exchange not implemented for: ${platform}`);
  }
}

// ─── Platform user info ───

interface PlatformUserInfo {
  id: string;
  username: string;
  followers?: number;
  metadata: Record<string, unknown>;
}

export async function getPlatformUserInfo(platform: string, accessToken: string): Promise<PlatformUserInfo> {
  switch (platform) {
    case "instagram": {
      const res = await fetch(`https://graph.facebook.com/v19.0/me?fields=id,name&access_token=${accessToken}`);
      const user = await res.json();
      const igRes = await fetch(
        `https://graph.facebook.com/v19.0/me/accounts?fields=instagram_business_account{id,username,followers_count,profile_picture_url}&access_token=${accessToken}`
      );
      const accounts = await igRes.json();
      const ig = accounts.data?.[0]?.instagram_business_account;
      return {
        id: ig?.id || user.id,
        username: ig?.username || user.name || "unknown",
        followers: ig?.followers_count || 0,
        metadata: { facebook_user_id: user.id, profile_picture: ig?.profile_picture_url },
      };
    }
    case "tiktok": {
      const res = await fetch("https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,display_name,avatar_url,follower_count", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      const u = data.data?.user || {};
      return {
        id: u.open_id || "unknown",
        username: u.display_name || "unknown",
        followers: u.follower_count || 0,
        metadata: { avatar_url: u.avatar_url, union_id: u.union_id },
      };
    }
    case "youtube": {
      const res = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      const channel = data.items?.[0];
      return {
        id: channel?.id || "unknown",
        username: channel?.snippet?.title || "unknown",
        followers: parseInt(channel?.statistics?.subscriberCount || "0"),
        metadata: { description: channel?.snippet?.description, thumbnail: channel?.snippet?.thumbnails?.default?.url },
      };
    }
    case "twitter": {
      const res = await fetch("https://api.twitter.com/2/users/me?user.fields=public_metrics,description,profile_image_url", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      const u = data.data || {};
      return {
        id: u.id || "unknown",
        username: u.username || "unknown",
        followers: u.public_metrics?.followers_count || 0,
        metadata: { name: u.name, description: u.description, profile_image_url: u.profile_image_url },
      };
    }
    case "threads": {
      const res = await fetch(`https://graph.threads.net/v1.0/me?fields=id,username,name,threads_profile_picture_url,followers_count&access_token=${accessToken}`);
      const data = await res.json();
      return {
        id: data.id || "unknown",
        username: data.username || data.name || "unknown",
        followers: data.followers_count || 0,
        metadata: { name: data.name, profile_picture: data.threads_profile_picture_url },
      };
    }
    case "linkedin": {
      const res = await fetch("https://api.linkedin.com/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      return {
        id: data.sub || "unknown",
        username: data.preferred_username || data.name || "unknown",
        followers: 0,
        metadata: { name: data.name, email: data.email, picture: data.picture },
      };
    }
    default:
      return { id: "unknown", username: "unknown", metadata: {} };
  }
}

// ─── Token refresh ───

export async function refreshPlatformToken(platform: string, refreshToken: string): Promise<TokenResult> {
  switch (platform) {
    case "instagram":
    case "threads": {
      const appId = process.env[`${platform.toUpperCase()}_APP_ID`] || process.env.META_APP_ID;
      const appSecret = process.env[`${platform.toUpperCase()}_APP_SECRET`] || process.env.META_APP_SECRET;
      const res = await fetch("https://graph.facebook.com/v19.0/oauth/access_token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: appId, client_secret: appSecret, refresh_token: refreshToken, grant_type: "fb_exchange_token",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Refresh failed");
      return {
        access_token: data.access_token,
        expires_at: data.expires_in ? new Date(Date.now() + data.expires_in * 1000).toISOString() : undefined,
        scopes: [],
      };
    }
    case "tiktok": {
      const clientKey = process.env.TIKTOK_CLIENT_KEY;
      const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
      const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_key: clientKey!, client_secret: clientSecret!, refresh_token: refreshToken, grant_type: "refresh_token",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error_description || "Refresh failed");
      return { access_token: data.access_token, refresh_token: data.refresh_token, expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(), scopes: [] };
    }
    case "youtube": {
      const clientId = process.env.YOUTUBE_CLIENT_ID;
      const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
      const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId!, client_secret: clientSecret!, refresh_token: refreshToken, grant_type: "refresh_token",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error_description || "Refresh failed");
      return { access_token: data.access_token, expires_at: new Date(Date.now() + (data.expires_in || 3600) * 1000).toISOString(), scopes: [] };
    }
    case "twitter": {
      const clientId = process.env.TWITTER_CLIENT_ID;
      const clientSecret = process.env.TWITTER_CLIENT_SECRET;
      const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
      const res = await fetch("https://api.twitter.com/2/oauth2/token", {
        method: "POST",
        headers: { Authorization: `Basic ${basicAuth}`, "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ refresh_token: refreshToken, grant_type: "refresh_token" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error_description || "Refresh failed");
      return { access_token: data.access_token, refresh_token: data.refresh_token, expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(), scopes: [] };
    }
    default:
      throw new Error(`Token refresh not implemented for: ${platform}`);
  }
}

// ─── Status helpers ───

export function getConnectionStatus(connection: PlatformConnection | null | undefined): { label: string; color: string } {
  if (!connection) return { label: "Non connecté", color: "rgba(255,255,255,0.2)" };
  switch (connection.status) {
    case "active": return { label: "Connecté", color: "#22C55E" };
    case "expired": return { label: "Token expiré", color: "#C75B39" };
    case "revoked": return { label: "Révoqué", color: "#E5484D" };
    case "error": return { label: "Erreur de connexion", color: "#E5484D" };
    default: return { label: "Non connecté", color: "rgba(255,255,255,0.2)" };
  }
}

export function needsReconnect(connection: PlatformConnection | null | undefined): boolean {
  if (!connection) return false;
  return connection.status === "expired" || connection.status === "revoked" || connection.status === "error";
}
