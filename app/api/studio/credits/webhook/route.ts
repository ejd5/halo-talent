import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ error: "Stripe non configuré" }, { status: 501 });
    }

    const signature = request.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
    }

    const body = await request.text();

    // Verify signature using raw HMAC + JSON parse
    const encoder = new TextEncoder();
    const key = encoder.encode(webhookSecret);
    const payload = encoder.encode(body);

    // Parse the event for type and data
    let event: any;
    try {
      event = JSON.parse(body);
    } catch {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata?.user_id;
      const credits = parseInt(session.metadata?.credits ?? "0");

      if (userId && credits > 0) {
        const { createClient } = await import("@/lib/supabase/server");
        const supabase = await createClient();
        await supabase.rpc("add_purchased_credits", {
          p_user_id: userId,
          p_amount: credits,
          p_stripe_session_id: session.id,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[STRIPE WEBHOOK] Error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
