import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getRecipientsForSegment,
  buildEmailHtml,
  generateUnsubToken,
  replaceVariables,
  personalizeWithAI,
  sendCampaignEmail,
  estimateSegmentCount,
  type ContentBlock,
} from "@/lib/atlas/channels/email";
import type { SegmentFilter } from "@/lib/atlas/crm/segments";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const action = body.action || "send"; // "send" | "test" | "estimate"

    // Fetch campaign
    const { data: campaign } = await supabase
      .from("atlas_campaigns")
      .select("*, audience_segment:atlas_segments(*)")
      .eq("id", id)
      .eq("creator_id", user.id)
      .single();

    if (!campaign) return NextResponse.json({ error: "Campagne introuvable" }, { status: 404 });

    // ─── SMS Campaign ─────────────────────────────────────
    if (campaign.type === "sms") {
      const { getSMSRecipients, buildSMSText, sendTwilioSMS, estimateSMSCost, checkTimeRestrictions } = await import("@/lib/atlas/channels/sms");

      if (action === "estimate") {
        const filters = (campaign.audience_segment?.filters as any[]) || [];
        const recipients = await getSMSRecipients(user.id, filters, campaign.custom_filters as Record<string, any>);
        const cost = estimateSMSCost(recipients, campaign.message_text || "");
        return NextResponse.json({ estimated_count: recipients.length, ...cost });
      }

      if (action === "test") {
        const testPhone = body.test_phone || process.env.TWILIO_TEST_TO;
        if (!testPhone) return NextResponse.json({ error: "Numéro de test requis" }, { status: 400 });

        const message = buildSMSText(campaign.message_text || "", {
          id: "", phone: "", display_name: "Test", first_name: "Test",
          fan_tier: "vip", country: "FR", language: "fr", timezone: "Europe/Paris",
        }, "#");

        const result = await sendTwilioSMS(testPhone, message.body, id);
        return NextResponse.json({ success: !result.error, sid: result.sid, error: result.error?.message });
      }

      if (action === "send") {
        const filters = (campaign.audience_segment?.filters as any[]) || [];
        const recipients = await getSMSRecipients(user.id, filters, campaign.custom_filters as Record<string, any>);

        if (recipients.length === 0) {
          return NextResponse.json({ error: "Aucun destinataire éligible" }, { status: 400 });
        }

        await supabase.from("atlas_campaigns").update({
          status: "sending", sent_at: new Date().toISOString(), recipients_count: recipients.length,
        }).eq("id", id);

        const statusUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://refundize.com"}/api/atlas/sms/status`;
        const errors: string[] = [];
        let totalCost = 0;

        for (const recipient of recipients) {
          try {
            const { body: smsText } = buildSMSText(campaign.message_text || "", recipient, "#");
            const result = await sendTwilioSMS(recipient.phone, smsText, id, statusUrl);

            if (result.error) throw result.error;

            await supabase.from("atlas_campaign_sends").insert({
              campaign_id: id, fan_id: recipient.id, channel: "sms",
              status: "sent", external_id: result.sid, cost: 0, to_number: recipient.phone,
            });

            totalCost += 0.05; // estimate until status callback
          } catch (err: any) {
            errors.push(`${recipient.phone}: ${err.message}`);
            await supabase.from("atlas_campaign_sends").insert({
              campaign_id: id, fan_id: recipient.id, channel: "sms",
              status: "failed", error: err.message, to_number: recipient.phone,
            });
          }
        }

        const failedCount = errors.length;
        await supabase.from("atlas_campaigns").update({
          status: failedCount === recipients.length ? "failed" : "sent",
          completed_at: new Date().toISOString(),
          sms_cost_actual: totalCost,
        }).eq("id", id);

        return NextResponse.json({ success: true, total: recipients.length, failed: failedCount, cost_estimate: totalCost, errors: errors.slice(0, 10) });
      }

      return NextResponse.json({ error: "Action invalide" }, { status: 400 });
    }

    // ─── Email Campaign ────────────────────────────────────
    // Action: estimate only
    if (action === "estimate") {
      const count = await estimateSegmentCount(
        user.id,
        (campaign.audience_segment?.filters as SegmentFilter[]) || [],
        campaign.custom_filters as Record<string, any>
      );
      return NextResponse.json({ estimated_count: count });
    }

    // Action: test send to self
    if (action === "test") {
      const testEmail = body.test_email || user.email;
      if (!testEmail) return NextResponse.json({ error: "Email de test requis" }, { status: 400 });

      const blocks = (campaign.content as any)?.blocks || [];
      const testHtml = buildEmailHtml(blocks, {
        first_name: "Test",
        display_name: "Test",
        greeting: "Bonjour",
        unsubscribe_url: "#",
        tracking_pixel: "",
      });

      const result = await sendCampaignEmail(
        testEmail,
        campaign.from_name || "Créateur",
        campaign.from_email || process.env.DEFAULT_FROM_EMAIL || "noreply@refundize.com",
        `[TEST] ${campaign.subject || "Sans objet"}`,
        testHtml,
        [{ name: "campaign_id", value: id }, { name: "type", value: "test" }]
      );

      return NextResponse.json({ success: true, email_id: result.data?.id });
    }

    // Action: full send
    if (action === "send") {
      const filters = (campaign.audience_segment?.filters as SegmentFilter[]) || [];
      const customFilters = campaign.custom_filters as Record<string, any>;
      const recipients = await getRecipientsForSegment(user.id, filters, customFilters);

      if (recipients.length === 0) {
        return NextResponse.json({ error: "Aucun destinataire éligible" }, { status: 400 });
      }

      const fromName = campaign.from_name || "Créateur";
      const fromEmail = campaign.from_email || process.env.DEFAULT_FROM_EMAIL || "noreply@refundize.com";
      const campaignContent = (campaign.content as any) || { blocks: [] };
      const personalize = campaign.personalize_with_ai;

      // Mark as sending
      await supabase
        .from("atlas_campaigns")
        .update({
          status: "sending",
          sent_at: new Date().toISOString(),
          recipients_count: recipients.length,
        })
        .eq("id", id);

      // Create send records
      const sendRecords = recipients.map((r: any) => ({
        campaign_id: id,
        fan_id: r.id,
        status: "pending" as const,
      }));

      const { data: sendInserts } = await supabase
        .from("atlas_campaign_sends")
        .insert(sendRecords)
        .select();

      const sendMap = new Map<string, any>();
      for (const s of sendInserts || []) {
        sendMap.set(s.fan_id, s);
      }

      const BATCH_SIZE = 50;
      const DELAY_MS = (campaign.throttle_hours || 4) * 3600000 / Math.ceil(recipients.length / BATCH_SIZE);
      const errors: string[] = [];

      for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
        const batch = recipients.slice(i, i + BATCH_SIZE);

        const results = await Promise.allSettled(
          batch.map(async (recipient: any) => {
            try {
              const sendRecord = sendMap.get(recipient.id);
              if (!sendRecord) return;

              // Personalize
              let content = campaignContent;
              if (personalize) {
                content = await personalizeWithAI(content, recipient);
              }

              const unsubToken = await generateUnsubToken(recipient.id);
              const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://refundize.com"}/api/unsubscribe?token=${unsubToken}`;
              const trackingPixel = `${process.env.NEXT_PUBLIC_APP_URL || "https://refundize.com"}/api/atlas/track/open?campaign=${id}&recipient=${recipient.id}`;

              const blocks: ContentBlock[] = (content as any)?.blocks || campaignContent.blocks || [];
              const html = buildEmailHtml(blocks, {
                first_name: recipient.first_name || recipient.display_name || "cher fan",
                display_name: recipient.display_name || "Fan",
                greeting: "Bonjour",
                unsubscribe_url: unsubscribeUrl,
                tracking_pixel: trackingPixel,
              });

              let subject = campaign.subject || "";
              subject = replaceVariables(subject, {
                first_name: recipient.first_name || "",
                display_name: recipient.display_name || "",
              });

              const result = await sendCampaignEmail(
                recipient.email,
                fromName,
                fromEmail,
                subject,
                html,
                [
                  { name: "campaign_id", value: id },
                  { name: "creator_id", value: user.id },
                  { name: "fan_id", value: recipient.id },
                ],
                unsubscribeUrl
              );

              if (result.error) throw new Error(result.error.message || "Resend error");

              await supabase
                .from("atlas_campaign_sends")
                .update({
                  status: "sent",
                  email_id: result.data?.id || null,
                  subject,
                  sent_at: new Date().toISOString(),
                })
                .eq("id", sendRecord.id);
            } catch (err: any) {
              const sendRecord = sendMap.get(recipient.id);
              if (sendRecord) {
                await supabase
                  .from("atlas_campaign_sends")
                  .update({ status: "failed", error: err.message })
                  .eq("id", sendRecord.id);
              }
              errors.push(`${recipient.email}: ${err.message}`);
            }
          })
        );

        // Update fan last_email_sent_at
        for (const recipient of batch) {
          await supabase
            .from("atlas_fans")
            .update({ last_email_sent_at: new Date().toISOString() })
            .eq("id", recipient.id);
        }

        // Throttle between batches
        if (i + BATCH_SIZE < recipients.length && DELAY_MS > 0) {
          await new Promise((r) => setTimeout(r, Math.min(DELAY_MS, 30000)));
        }
      }

      const failedCount = errors.length;

      // Mark as complete
      await supabase
        .from("atlas_campaigns")
        .update({
          status: failedCount === recipients.length ? "failed" : "sent",
          completed_at: new Date().toISOString(),
        })
        .eq("id", id);

      return NextResponse.json({
        success: true,
        total: recipients.length,
        failed: failedCount,
        errors: errors.slice(0, 10),
      });
    }

    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  } catch (err) {
    console.error("[CAMPAIGN SEND] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
