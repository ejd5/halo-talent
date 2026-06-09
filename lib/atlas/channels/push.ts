import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";

/* ─── Types ─────────────────────────────────────────────── */

export interface PushSubscription {
  id: string;
  creator_id: string;
  fan_id: string | null;
  endpoint: string;
  p256dh_key: string;
  auth_key: string;
  active: boolean;
}

export interface PushCampaign {
  id: string;
  creator_id: string;
  title: string;
  body: string;
  icon_url?: string;
  image_url?: string;
  target_url?: string;
  segment_filter?: Record<string, any>;
}

export interface PushSendResult {
  subscription_id: string;
  status: "sent" | "failed" | "expired";
  error?: string;
}

/* ─── Init VAPID ─────────────────────────────────────────── */

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:notifications@refundize.com";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export function hasVapidKeys(): boolean {
  return !!vapidPublicKey && !!vapidPrivateKey;
}

export function getVapidPublicKey(): string {
  return vapidPublicKey || "";
}

/* ─── Send to single subscription ───────────────────────── */

export async function sendPushToSub(
  sub: PushSubscription,
  payload: {
    title: string;
    body: string;
    icon?: string;
    image?: string;
    url?: string;
    campaignId?: string;
  },
): Promise<PushSendResult> {
  if (!hasVapidKeys()) {
    return { subscription_id: sub.id, status: "failed", error: "VAPID keys not configured" };
  }

  const subscription = {
    endpoint: sub.endpoint,
    keys: {
      p256dh: sub.p256dh_key,
      auth: sub.auth_key,
    },
  };

  const clickTrackUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/atlas/push/track-click`;

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: payload.title,
        body: payload.body,
        icon: payload.icon || "/default-icon.svg",
        badge: "/badge.svg",
        image: payload.image,
        url: payload.url || "/",
        campaignId: payload.campaignId,
        clickTrackUrl,
        actions: [],
        vibrate: [200, 100, 200],
      }),
    );

    return { subscription_id: sub.id, status: "sent" };
  } catch (err: any) {
    if (err.statusCode === 410) {
      // Subscription expired or unsubscribed
      return { subscription_id: sub.id, status: "expired", error: "Subscription expired" };
    }
    return { subscription_id: sub.id, status: "failed", error: String(err) };
  }
}

/* ─── Send campaign to all active subs of a creator ─────── */

export async function sendPushCampaign(campaign: PushCampaign): Promise<{
  sent: number;
  failed: number;
  expired: number;
}> {
  const supabase = await createClient();

  // Récupérer les subscriptions actives
  let query = supabase
    .from("atlas_push_subscriptions")
    .select("*")
    .eq("creator_id", campaign.creator_id)
    .eq("active", true);

  // Appliquer le filtre de segment si présent
  const seg = campaign.segment_filter || {};
  if (seg.fan_tier) {
    query = supabase
      .from("atlas_push_subscriptions")
      .select("atlas_push_subscriptions.*")
      .eq("creator_id", campaign.creator_id)
      .eq("active", true)
      .eq("atlas_fans.fan_tier", seg.fan_tier) as any;
  }

  const { data: subscriptions } = await query;
  if (!subscriptions?.length) return { sent: 0, failed: 0, expired: 0 };

  let sent = 0;
  let failed = 0;
  let expired = 0;

  for (const sub of subscriptions) {
    const result = await sendPushToSub(sub, {
      title: campaign.title,
      body: campaign.body,
      icon: campaign.icon_url,
      image: campaign.image_url,
      url: campaign.target_url,
      campaignId: campaign.id,
    });

    // Log the send
    await supabase.from("atlas_campaign_sends").insert({
      campaign_id: campaign.id,
      subscription_id: sub.id,
      fan_id: sub.fan_id,
      status: result.status === "sent" ? "sent" : result.status === "expired" ? "expired" : "failed",
      error: result.error,
    });

    if (result.status === "expired") {
      // Désactiver la subscription expirée
      await supabase
        .from("atlas_push_subscriptions")
        .update({ active: false })
        .eq("id", sub.id);
      expired++;
    } else if (result.status === "sent") {
      await supabase
        .from("atlas_push_subscriptions")
        .update({ last_used_at: new Date().toISOString() })
        .eq("id", sub.id);
      sent++;
    } else {
      failed++;
    }
  }

  // Update campaign stats
  await supabase
    .from("atlas_push_campaigns")
    .update({
      stats: { sent, delivered: sent, clicked: 0 },
      sent_at: new Date().toISOString(),
      status: "sent",
    })
    .eq("id", campaign.id);

  return { sent, failed, expired };
}

/* ─── Track click ───────────────────────────────────────── */

export async function trackPushClick(
  campaignId: string,
): Promise<void> {
  const supabase = await createClient();

  // Update send record
  await supabase
    .from("atlas_campaign_sends")
    .update({ status: "clicked", clicked_at: new Date().toISOString() })
    .eq("campaign_id", campaignId)
    .eq("status", "sent");

  // Update campaign stats
  const { data: sends } = await supabase
    .from("atlas_campaign_sends")
    .select("status")
    .eq("campaign_id", campaignId);

  const clicked = sends?.filter((s) => s.status === "clicked").length || 0;

  await supabase
    .from("atlas_push_campaigns")
    .update({ stats: { clicked } })
    .eq("id", campaignId);
}
