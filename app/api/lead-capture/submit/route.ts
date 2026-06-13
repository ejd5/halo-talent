import { type NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { confirmationEmailHtml } from "@/lib/atlas/lead-capture/email-templates";
import crypto from "crypto";

const PUBLIC_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3005";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, email, first_name, source } = body;

    if (!slug || !email) {
      return NextResponse.json({ error: "slug et email requis" }, { status: 400 });
    }

    const supabase = await createClient();
    const admin = createAdminClient();

    // Find the creator by slug from lead_capture_pages
    const { data: page } = await supabase
      .from("lead_capture_pages")
      .select("id, creator_id, title, display_name, confirmation_message, collect_first_name, conversions")
      .eq("slug", slug)
      .eq("status", "active")
      .single();

    if (!page) {
      return NextResponse.json({ error: "Page introuvable" }, { status: 404 });
    }

    // Get creator info
    const { data: creator } = await admin
      .from("profiles")
      .select("display_name, handle")
      .eq("id", page.creator_id)
      .single();

    // Check if fan already exists
    const { data: existing } = await supabase
      .from("atlas_fans")
      .select("id, email_consent")
      .eq("creator_id", page.creator_id)
      .eq("email", email)
      .maybeSingle();

    let fanId: string | null = existing?.id || null;

    if (!existing) {
      // Create new fan (pending confirmation)
      const { data: newFan } = await supabase
        .from("atlas_fans")
        .insert({
          creator_id: page.creator_id,
          email,
          first_name: first_name || null,
          acquired_via: source || "lead_capture",
          email_consent: false,
          status: "active",
        })
        .select("id")
        .single();

      fanId = newFan?.id || null;
    } else if (existing.email_consent) {
      return NextResponse.json({ message: "Déjà inscrit", status: "already_subscribed" });
    }

    // Generate confirmation token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Record submission
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const ua = request.headers.get("user-agent") || "";

    const { data: submission } = await supabase
      .from("lead_capture_submissions")
      .insert({
        page_id: page.id,
        creator_id: page.creator_id,
        fan_id: fanId,
        email,
        first_name: first_name || null,
        source: source || "lead_capture",
        ip_address: ip,
        user_agent: ua,
        confirmation_token: token,
        token_expires_at: expiresAt.toISOString(),
        status: "pending",
      })
      .select("id")
      .single();

    if (!submission) {
      return NextResponse.json({ error: "Erreur d'inscription" }, { status: 500 });
    }

    // Increment page conversions stat
    await supabase
      .from("lead_capture_pages")
      .update({ conversions: (page.conversions || 0) + 1 })
      .eq("id", page.id)
      .maybeSingle();

    // Build confirm URL
    const confirmUrl = `${PUBLIC_URL}/confirm?token=${token}`;

    // Send confirmation email (via Resend or log)
    const creatorName = creator?.display_name || page.display_name || "Creator";
    const emailHtml = confirmationEmailHtml({
      first_name: first_name || undefined,
      confirm_url: confirmUrl,
      creator_name: creatorName,
      page_title: page.title,
    });

    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: `${creatorName} <noreply@refundize.com>`,
        to: email,
        subject: `Confirme ton inscription à ${page.title}`,
        html: emailHtml,
      });
    } catch (emailErr) {
      console.error("[LEAD-CAPTURE] Email send error:", emailErr);
      // Don't fail the request, the submission is recorded
    }

    return NextResponse.json({
      message: page.confirmation_message || "Vérifie ta boîte mail pour confirmer",
      status: "pending_confirmation",
    });
  } catch (err) {
    console.error("[LEAD-CAPTURE SUBMIT] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
