import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { contactSchema } from "@/lib/validations/contact";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, profile, subject, message, consent_contact } = parsed.data;

    const supabase = createAdminClient();

    const { error: insertError } = await supabase.from("contact_messages").insert({
      name,
      email,
      profile: profile || null,
      subject,
      message,
      consent_contact: consent_contact ?? false,
    });

    if (insertError) {
      console.error("Erreur insertion contact:", insertError);
      return NextResponse.json(
        { error: "Erreur lors de l'enregistrement de votre message." },
        { status: 500 }
      );
    }

    // TODO: Notification admin, quand un webhook ou email de notification
    // est configuré, envoyer une alerte ici. Actuellement les messages sont
    // consultables uniquement via le dashboard admin Supabase.
    // Options futures : Resend (email), Telegram bot, Slack webhook.

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur contact:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
