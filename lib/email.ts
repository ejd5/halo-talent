// ─── Email Service (Resend) ─────────────────────────────────
// Wrapper around Resend for transactional emails.
// Falls back to logging when RESEND_API_KEY is not configured.

import { Resend } from "resend";

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

const FROM = "WTF Lex <lex@halo-talent.com>";
const REPLY_TO = "support@halo-talent.com";

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "re_your-resend-key" || apiKey.trim() === "") {
    return null;
  }
  return new Resend(apiKey);
}

/**
 * Send a transactional email via Resend.
 * Falls back to console.log in development when API key is not set.
 */
export async function sendEmail(params: EmailParams): Promise<{ sent: boolean; provider: "resend" | "log" }> {
  const resend = getResend();

  if (!resend) {
    console.log("[Email] RESEND_API_KEY not configured, logging email:");
    console.log(`  To: ${params.to}`);
    console.log(`  Subject: ${params.subject}`);
    console.log(`  Reply-To: ${params.replyTo || REPLY_TO}`);
    return { sent: false, provider: "log" };
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
      replyTo: params.replyTo || REPLY_TO,
    });
    return { sent: true, provider: "resend" };
  } catch (err) {
    console.error("[Email] Resend send failed:", err);
    return { sent: false, provider: "resend" };
  }
}
