import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { creator_handle, creator_id, subscription, user_agent } = await request.json();

    if (!creator_handle || !subscription?.endpoint) {
      return NextResponse.json({ error: "creator_handle et subscription requis" }, { status: 400 });
    }

    const supabase = await createClient();

    // Find the creator by handle
    let creatorId = creator_id;
    if (!creatorId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("handle", creator_handle)
        .single();

      if (!profile) {
        return NextResponse.json({ error: "Créateur introuvable" }, { status: 404 });
      }
      creatorId = profile.id;
    }

    // Find or create fan from handle
    const fanId: string | null = null;

    // Store subscription
    const { data: sub, error: upsertError } = await supabase
      .from("atlas_push_subscriptions")
      .upsert({
        creator_id: creatorId,
        endpoint: subscription.endpoint,
        p256dh_key: subscription.keys?.p256dh || "",
        auth_key: subscription.keys?.auth || "",
        device_info: {},
        user_agent: user_agent || null,
        active: true,
        last_used_at: new Date().toISOString(),
      }, {
        onConflict: "creator_id, endpoint",
        ignoreDuplicates: false,
      })
      .select("id")
      .single();

    if (upsertError) {
      console.error("[PUSH SUBSCRIBE] Upsert error:", upsertError);
      return NextResponse.json({ error: "Erreur d'inscription" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      subscription_id: sub?.id,
    });
  } catch (err) {
    console.error("[PUSH SUBSCRIBE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { endpoint } = await request.json();

    if (!endpoint) {
      return NextResponse.json({ error: "endpoint requis" }, { status: 400 });
    }

    const supabase = await createClient();

    await supabase
      .from("atlas_push_subscriptions")
      .update({ active: false })
      .eq("endpoint", endpoint);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PUSH UNSUBSCRIBE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
