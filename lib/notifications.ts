import { createAdminClient } from "@/lib/supabase/server";

interface NotifyParams {
  userId: string;
  type: string;
  title: string;
  message: string;
  severity?: string;
  link?: string;
  channels?: ("in_app" | "push" | "telegram")[];
}

export async function notify(params: NotifyParams) {
  const { userId, type, title, message, severity, link, channels = ["in_app"] } = params;

  // Always insert in-app notification
  if (channels.includes("in_app")) {
    try {
      const admin = createAdminClient();
      await admin.from("notifications").insert({
        user_id: userId,
        type,
        title,
        message,
        link,
        read: false,
      });
    } catch (e) {
      console.warn("[notify] In-app notification failed", e);
    }
  }

  // Push notification via Supabase
  if (channels.includes("push")) {
    try {
      const admin = createAdminClient();
      await admin.from("atlas_push_campaigns").insert({
        creator_id: userId,
        title,
        body: message,
        scheduled_for: new Date().toISOString(),
        status: "sending",
      });
    } catch (e) {
      console.warn("[notify] Push notification failed", e);
    }
  }

  // Telegram (future)
  if (channels.includes("telegram")) {
    try {
      const admin = createAdminClient();
      const { data: profile } = await admin
        .from("profiles")
        .select("telegram_chat_id")
        .eq("id", userId)
        .single();

      if (profile?.telegram_chat_id) {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (botToken) {
          await fetch(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: profile.telegram_chat_id,
                text: `🔔 *${title}*\n\n${message}`,
                parse_mode: "Markdown",
              }),
            },
          );
        }
      }
    } catch (e) {
      console.warn("[notify] Telegram failed", e);
    }
  }
}
