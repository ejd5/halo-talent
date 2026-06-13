import { createClient } from "@/lib/supabase/server";
import type { CampaignRecipient } from "@/lib/atlas/channels/email";
import type { SegmentFilter } from "@/lib/atlas/crm/segments";

// ─── Types ──────────────────────────────────────────────────

export interface SMSRecipient {
  id: string;
  phone: string;
  display_name: string | null;
  first_name: string | null;
  fan_tier: string;
  country: string | null;
  language: string;
  timezone: string | null;
}

export interface SMSCampaign {
  id: string;
  creator_id: string;
  name: string;
  message_text: string;
  status: string;
  type: string;
  audience_segment_id: string | null;
  custom_filters: Record<string, any>;
  schedule_at: string | null;
  throttle_hours: number;
  time_restrictions: {
    enabled: boolean;
    quiet_hours_start: string;
    quiet_hours_end: string;
  };
  created_at: string;
}

// Twilio pricing per country (USD per segment)
const SMS_PRICES: Record<string, number> = {
  US: 0.0075, CA: 0.0075, UK: 0.04, FR: 0.07, DE: 0.08, ES: 0.07,
  IT: 0.08, BE: 0.075, CH: 0.06, PT: 0.07, NL: 0.08, BR: 0.02,
  AU: 0.065, DEFAULT: 0.05,
};

function getSmsPrice(country: string | null): number {
  return SMS_PRICES[country || ""] || SMS_PRICES.DEFAULT;
}

// ─── Get SMS-eligible recipients ─────────────────────────

export async function getSMSRecipients(
  creatorId: string,
  filters: SegmentFilter[],
  customFilters?: Record<string, any>
): Promise<SMSRecipient[]> {
  const supabase = await createClient();

  let query = supabase
    .from("atlas_fans")
    .select("id, phone, display_name, first_name, fan_tier, country, language, timezone")
    .eq("creator_id", creatorId)
    .eq("status", "active")
    .eq("sms_consent", true)
    .not("phone", "is", null);

  // Apply segment filters
  for (const f of filters || []) {
    if (f.field === "status" || f.field === "sms_consent") continue;
    switch (f.operator) {
      case "eq": query = (query as any).eq(f.field, f.value); break;
      case "neq": query = (query as any).neq(f.field, f.value); break;
      case "gt": query = (query as any).gt(f.field, f.value); break;
      case "gte": query = (query as any).gte(f.field, f.value); break;
      case "in": query = (query as any).in(f.field, f.value); break;
    }
  }

  if (customFilters) {
    if (customFilters.tier) query = (query as any).in("fan_tier", customFilters.tier);
    if (customFilters.country) query = (query as any).eq("country", customFilters.country);
    if (customFilters.language) query = (query as any).eq("language", customFilters.language);
    if (customFilters.min_spent) query = (query as any).gte("total_spent", customFilters.min_spent);
  }

  const { data } = await query;
  return (data || []) as SMSRecipient[];
}

// ─── Check time restrictions ────────────────────────────

export function checkTimeRestrictions(
  restrictions: SMSCampaign["time_restrictions"],
  timezone: string | null
): { allowed: boolean; reason?: string } {
  if (!restrictions?.enabled) return { allowed: true };

  const now = new Date();
  const tz = timezone || "UTC";

  // Convert current time to recipient's timezone
  const localTime = new Date(now.toLocaleString("en-US", { timeZone: tz }));
  const hours = localTime.getHours();
  const minutes = localTime.getMinutes();
  const currentMinutes = hours * 60 + minutes;

  const [startH, startM] = (restrictions.quiet_hours_start || "21:00").split(":").map(Number);
  const [endH, endM] = (restrictions.quiet_hours_end || "08:00").split(":").map(Number);
  const quietStart = startH * 60 + startM;
  const quietEnd = endH * 60 + endM;

  // If quiet_hours_start > quiet_hours_end, it spans midnight (e.g., 21:00-08:00)
  if (quietStart > quietEnd) {
    if (currentMinutes >= quietStart || currentMinutes < quietEnd) {
      return { allowed: false, reason: `Heure silencieuse (${restrictions.quiet_hours_start}-${restrictions.quiet_hours_end})` };
    }
  } else {
    if (currentMinutes >= quietStart && currentMinutes < quietEnd) {
      return { allowed: false, reason: `Heure silencieuse (${restrictions.quiet_hours_start}-${restrictions.quiet_hours_end})` };
    }
  }

  return { allowed: true };
}

// ─── Count SMS segments (GSM 7-bit: 160/chars, UCS-2: 70/chars) ───

export function countSmsSegments(text: string): number {
  const isGsm7 = /^[\x20-\x7E€£¥¤§¿ÄÅÆÇÉÑÖØÜäßöøüàèéìñòù]*$/.test(text);
  const maxLen = isGsm7 ? 160 : 70;
  if (text.length <= maxLen) return 1;
  // For multi-segment: each segment has 7 bytes of header overhead
  const segLen = isGsm7 ? 153 : 67;
  return Math.ceil(text.length / segLen);
}

// ─── Estimate cost ─────────────────────────────────────

export function estimateSMSCost(
  recipients: SMSRecipient[],
  messageText: string
): { total: number; perCountry: Record<string, { count: number; cost: number }> } {
  const segments = countSmsSegments(messageText);
  const perCountry: Record<string, { count: number; cost: number }> = {};
  let total = 0;

  for (const r of recipients) {
    const country = r.country || "DEFAULT";
    if (!perCountry[country]) perCountry[country] = { count: 0, cost: 0 };
    perCountry[country].count++;
    const cost = segments * getSmsPrice(country);
    perCountry[country].cost += cost;
    total += cost;
  }

  return { total, perCountry };
}

// ─── Build SMS text with variables ──────────────────────

export function buildSMSText(
  message: string,
  recipient: SMSRecipient,
  unsubscribeUrl: string
): { body: string; segments: number } {
  let body = message
    .replace(/\{\{first_name\}\}/g, recipient.first_name || recipient.display_name || "fan")
    .replace(/\{\{display_name\}\}/g, recipient.display_name || "Fan")
    .replace(/\{\{tier\}\}/g, recipient.fan_tier || "");

  // Add STOP notice for US/CA (TCPA compliance)
  if (recipient.country === "US" || recipient.country === "CA") {
    body += `\n\nReply STOP to unsubscribe. Msg&data rates may apply.`;
  }

  return { body, segments: countSmsSegments(body) };
}

// ─── Send SMS via Twilio ────────────────────────────────

export async function sendTwilioSMS(
  to: string,
  body: string,
  campaignId: string,
  statusCallbackUrl?: string
) {
  const twilio = await loadTwilio();
  if (!twilio) return { error: new Error("Twilio non configuré") };

  const from = process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_MESSAGING_SERVICE_SID;

  const result = await twilio.messages.create({
    body,
    to,
    ...(from?.startsWith("MG") ? { messagingServiceSid: from } : { from }),
    statusCallback: statusCallbackUrl,
  });

  return { sid: result.sid, segments: result.numSegments ? parseInt(result.numSegments) : 1, price: result.price || null };
}

// ─── TWILIO STATUS CALLBACK HANDLER ─────────────────────

export async function handleStatusCallback(payload: {
  MessageSid: string;
  MessageStatus: string;
  To: string;
  ErrorCode?: string;
  Price?: string;
}) {
  const supabase = await createClient();

  // Find the send record
  const { data: send } = await supabase
    .from("atlas_campaign_sends")
    .select("id")
    .eq("external_id", payload.MessageSid)
    .single();

  if (send) {
    const updates: Record<string, any> = {};

    switch (payload.MessageStatus) {
      case "delivered":
        updates.status = "sent";
        break;
      case "failed":
      case "undelivered":
        updates.status = "failed";
        updates.error = `Twilio: ${payload.ErrorCode || "unknown"}`;
        break;
      case "sent":
        updates.status = "sent";
        break;
    }

    if (payload.Price) {
      updates.cost = parseFloat(payload.Price);
    }

    if (Object.keys(updates).length > 0) {
      await supabase.from("atlas_campaign_sends").update(updates).eq("id", send.id);
    }
  }

  // Log webhook
  await supabase.from("atlas_sms_webhook_logs").insert({
    message_sid: payload.MessageSid,
    direction: "status_callback",
    to_number: payload.To,
    status: payload.MessageStatus,
    error_code: payload.ErrorCode,
    raw_payload: payload,
  });
}

// ─── Handle inbound SMS (STOP/HELP/reply) ───────────────

export async function handleInboundSMS(from: string, body: string) {
  const supabase = await createClient();
  const keyword = body.toLowerCase().trim();

  // Find fan by phone
  const { data: fan } = await supabase
    .from("atlas_fans")
    .select("id, creator_id, display_name, language")
    .eq("phone", from)
    .single();

  // Log regardless
  await supabase.from("atlas_sms_webhook_logs").insert({
    fan_id: fan?.id || null,
    creator_id: fan?.creator_id || null,
    from_number: from,
    body,
    keyword,
    direction: "inbound",
  });

  // Handle STOP keywords
  const stopKeywords = ["stop", "unsubscribe", "cancel", "arrêt", "arret", "quit", "end"];
  if (stopKeywords.includes(keyword) && fan) {
    await supabase
      .from("atlas_fans")
      .update({ sms_consent: false })
      .eq("id", fan.id);

    await supabase.from("atlas_consent_logs").insert({
      fan_id: fan.id,
      consent_type: "sms_marketing",
      granted: false,
      source: "sms_stop_keyword",
    });

    // Also update pending campaign sends
    await supabase
      .from("atlas_campaign_sends")
      .update({ status: "unsubscribed", unsubscribed_at: new Date().toISOString() })
      .eq("fan_id", fan.id)
      .is("unsubscribed_at", null);

    return { action: "unsubscribed", fan, responseXml: twimlResponse("You've been unsubscribed. No more messages will be sent. ❌ Réponse STOP reçue, vous ne recevrez plus de SMS.") };
  }

  // Handle HELP keywords
  const helpKeywords = ["help", "aide", "info"];
  if (helpKeywords.includes(keyword) && fan) {
    return { action: "help", fan, responseXml: twimlResponse("Reply STOP to unsubscribe at any time. Standard message rates apply.") };
  }

  // Regular reply, create interaction + notify creator
  if (fan) {
    await supabase.from("atlas_interactions").insert({
      fan_id: fan.id,
      creator_id: fan.creator_id,
      channel: "sms",
      direction: "inbound",
      type: "sms_reply",
      content: body,
      occurred_at: new Date().toISOString(),
    });

    // Also create pending draft notification
    await supabase.from("atlas_drafts").insert({
      creator_id: fan.creator_id,
      fan_id: fan.id,
      platform: "sms",
      channel: "sms",
      draft_text: body,
      status: "pending_validation",
      generator_prompt: null,
      estimated_engagement: 0,
    });
  }

  return { action: "reply", fan, responseXml: null };
}

// ─── TwiML response builder ─────────────────────────────

function twimlResponse(message: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(message)}</Message></Response>`;
}

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ─── Lazy load Twilio ────────────────────────────────────

async function loadTwilio() {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    if (!accountSid || !authToken) return null;
    const twilio = await import("twilio");
    return twilio.default(accountSid, authToken);
  } catch {
    return null;
  }
}
