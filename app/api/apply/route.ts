import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { applySchema } from "@/lib/validations/apply";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = applySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, age, country, whatsapp, departments, platforms, monthlyRevenue, goals, whyUs, blockers } = parsed.data;

    const supabase = createAdminClient();

    const { error: insertError } = await supabase.from("applications").insert({
      email,
      full_name: `${firstName} ${lastName}`,
      display_name: firstName,
      department: departments[0],
      current_monthly_revenue: monthlyRevenue,
      platforms: platforms?.map((p) => p.name),
      social_links: platforms,
      goals,
      why_us: whyUs,
    });

    if (insertError) {
      console.error("Erreur insertion candidature:", insertError);
      return NextResponse.json(
        { error: "Erreur lors de l'enregistrement de votre candidature." },
        { status: 500 }
      );
    }

    // TODO: Email de confirmation via Resend (quand RESEND_API_KEY configurée)
    // TODO: Notification Telegram à l'admin (quand TELEGRAM_BOT_TOKEN configuré)

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur candidature:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
