import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CREDIT_PACKS } from "@/lib/credits/pricing";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { pack_id } = body;

    if (!pack_id) {
      return NextResponse.json({ error: "pack_id requis" }, { status: 400 });
    }

    const pack = CREDIT_PACKS.find((p) => p.id === pack_id);
    if (!pack) {
      return NextResponse.json({ error: "Pack invalide" }, { status: 400 });
    }

    // Try Stripe API directly (no npm package needed)
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey) {
      try {
        const sessionRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${stripeKey}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            "mode": "payment",
            "line_items[0][price_data][currency]": "eur",
            "line_items[0][price_data][product_data][name]": pack.label,
            "line_items[0][price_data][unit_amount]": String(pack.price_eur * 100),
            "line_items[0][quantity]": "1",
            "client_reference_id": user.id,
            "metadata[pack_id]": pack.id,
            "metadata[credits]": String(pack.credits),
            "metadata[user_id]": user.id,
            "success_url": `${request.headers.get("origin")}/studio/credits?purchase=success`,
            "cancel_url": `${request.headers.get("origin")}/studio/credits?purchase=cancelled`,
          }),
        });

        if (sessionRes.ok) {
          const session = await sessionRes.json();
          return NextResponse.json({ url: session.url });
        }
        // Fallback to demo if Stripe fails
      } catch {
        // Fallback to demo mode
      }
    }

    // Demo mode: grant credits directly (no payment)
    await supabase.rpc("add_purchased_credits", {
      p_user_id: user.id,
      p_amount: pack.credits,
      p_stripe_session_id: null,
    });

    return NextResponse.json({
      success: true,
      credits_added: pack.credits,
      demo: true,
      message: `${pack.credits} crédits ajoutés (mode démo — aucune facturation)`,
    });
  } catch (err) {
    console.error("[CREDITS PURCHASE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
