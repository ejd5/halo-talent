import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { newsletterSchema } from "@/lib/validations/newsletter";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Email invalide", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, source, consent_marketing } = parsed.data;

    const supabase = createAdminClient();

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, status")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      if (existing.status === "active") {
        return NextResponse.json({ success: true, status: "already_subscribed" });
      }
      // Re-subscribe if previously unsubscribed
      const { error: updateError } = await supabase
        .from("newsletter_subscribers")
        .update({ status: "active", unsubscribed_at: null })
        .eq("id", existing.id);

      if (updateError) {
        console.error("Erreur réabonnement newsletter:", updateError);
        return NextResponse.json({ error: "Erreur lors de l'inscription." }, { status: 500 });
      }

      return NextResponse.json({ success: true, status: "resubscribed" });
    }

    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || null;
    const userAgent = request.headers.get("user-agent");

    const { error: insertError } = await supabase.from("newsletter_subscribers").insert({
      email,
      source: source || "footer",
      consent_marketing: consent_marketing ?? false,
      ip_address: ip,
      user_agent: userAgent,
    });

    if (insertError) {
      // Unique constraint violation = race condition, treat as success
      if (insertError.code === "23505") {
        return NextResponse.json({ success: true, status: "already_subscribed" });
      }
      console.error("Erreur inscription newsletter:", insertError);
      return NextResponse.json({ error: "Erreur lors de l'inscription." }, { status: 500 });
    }

    // TODO: Send confirmation email via Resend when RESEND_API_KEY is configured
    // TODO: Admin notification via Telegram/email when configured

    return NextResponse.json({ success: true, status: "subscribed" });
  } catch (error) {
    console.error("Erreur newsletter:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
