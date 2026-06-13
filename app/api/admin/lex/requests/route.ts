// ─── Admin API: Letter Requests ───────────────────────────
// GET    /api/admin/lex/requests       , List with filters
// GET    /api/admin/lex/requests?id=X  , Single request detail
// PUT    /api/admin/lex/requests       , Update status/notes
// POST   /api/admin/lex/requests       , Create request (admin)

import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import {
  updateLetterRequestStatus,
  getUserLetterQuota,
} from "@/lib/halo-lex/letters/letter-delivery";

export const dynamic = "force-dynamic";

// ─── GET ──────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const supabase = await createAdminClient();

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Non authentifié" }), { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !["admin", "manager"].includes(profile.role)) {
      return new Response(JSON.stringify({ error: "Accès refusé" }), { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    // Single request with full details
    if (id) {
      const { data: reqData, error } = await supabase
        .from("letter_requests")
        .select(`
          *,
          users:auth.users!inner(email, raw_user_meta_data),
          letter_request_events(*),
          letter_feedback(*)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;

      // Separate events and feedback
      const { letter_request_events, letter_feedback, ...requestData } = reqData as any;

      return new Response(
        JSON.stringify({
          ...requestData,
          events: letter_request_events || [],
          feedback: letter_feedback?.[0] || null,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // Build query
    let query = supabase
      .from("letter_requests")
      .select(`
        *,
        users:auth.users!inner(email, raw_user_meta_data)
      `, { count: "exact" });

    if (status) {
      const statuses = status.split(",");
      query = query.in("status", statuses);
    }

    if (priority) {
      query = query.eq("priority", priority);
    }

    if (userId) {
      query = query.eq("user_id", userId);
    }

    // Order by deadline (most urgent first), then by creation date
    query = query.order("deadline_at", { ascending: true }).range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    // Counts for dashboard header
    const { count: receivedCount } = await supabase
      .from("letter_requests")
      .select("*", { count: "exact", head: true })
      .in("status", ["received"]);
    const { count: inProgressCount } = await supabase
      .from("letter_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "in_progress");
    const { count: todayCount } = await supabase
      .from("letter_requests")
      .select("*", { count: "exact", head: true })
      .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString());

    return new Response(
      JSON.stringify({
        requests: data || [],
        total: count || 0,
        page,
        counts: {
          received: receivedCount || 0,
          in_progress: inProgressCount || 0,
          today: todayCount || 0,
        },
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Admin Lex] GET error:", error);
    return new Response(JSON.stringify({ error: "Erreur interne" }), { status: 500 });
  }
}

// ─── PUT (Update status) ──────────────────────────────────

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Non authentifié" }), { status: 401 });
    }

    // Verify admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !["admin", "manager"].includes(profile.role)) {
      return new Response(JSON.stringify({ error: "Accès refusé" }), { status: 403 });
    }

    const body = await request.json();
    const { id, status, document_content, pdf_url, admin_notes, time_spent } = body;

    if (!id || !status) {
      return new Response(JSON.stringify({ error: "id et status requis" }), { status: 400 });
    }

    const validStatuses = ["received", "awaiting_info", "in_progress", "pending_validation", "delivered", "refused"];
    if (!validStatuses.includes(status)) {
      return new Response(JSON.stringify({ error: "Status invalide" }), { status: 400 });
    }

    await updateLetterRequestStatus(id, status, user.id, {
      documentContent: document_content,
      pdfUrl: pdf_url,
      adminNotes: admin_notes,
      timeSpent: time_spent,
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[Admin Lex] PUT error:", error);
    return new Response(JSON.stringify({ error: "Erreur interne" }), { status: 500 });
  }
}

// ─── POST (Create) ────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const supabase = await createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Non authentifié" }), { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !["admin", "manager"].includes(profile.role)) {
      return new Response(JSON.stringify({ error: "Accès refusé" }), { status: 403 });
    }

    const body = await request.json();
    const { user_id, letter_type, complexity, priority, brief, language, tone, target_platform } = body;

    if (!user_id || !letter_type || !brief) {
      return new Response(JSON.stringify({ error: "user_id, letter_type et brief requis" }), { status: 400 });
    }

    // Check quota
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user_id)
      .single();

    const plan = userProfile?.plan || "premium";
    const quota = await getUserLetterQuota(user_id, plan);

    // Calculate deadline: Standard=48h, Urgent=12h/+20€, Express=4h/+50€
    const now = new Date();
    const deadlineAt = new Date(now);
    const pricing: Record<string, number> = { standard: 0, urgent: 20, express: 50 };
    const amountCharged = pricing[priority] || 0;

    if (priority === "express") {
      deadlineAt.setHours(deadlineAt.getHours() + 4);
    } else if (priority === "urgent") {
      deadlineAt.setHours(deadlineAt.getHours() + 12);
    } else {
      deadlineAt.setDate(deadlineAt.getDate() + 2);
    }

    // Generate reference: LX-YYYY-XXXX
    const year = now.getFullYear();
    const { count: yearCount } = await supabase
      .from("letter_requests")
      .select("*", { count: "exact", head: true })
      .gte("created_at", new Date(year, 0, 1).toISOString())
      .lt("created_at", new Date(year + 1, 0, 1).toISOString());
    const seq = String((yearCount || 0) + 1).padStart(4, "0");
    const reference = `LX-${year}-${seq}`;

    const { data: newRequest, error } = await supabase
      .from("letter_requests")
      .insert({
        user_id,
        letter_type,
        complexity: complexity || "standard",
        priority: priority || "standard",
        reference,
        brief,
        language: language || "fr",
        tone: tone || "ferme_et_juridique",
        target_platform: target_platform || null,
        deadline_at: deadlineAt.toISOString(),
        is_within_quota: quota.remaining > 0,
        amount_charged: amountCharged,
      })
      .select()
      .single();

    if (error) throw error;

    // Log event
    await supabase.from("letter_request_events").insert({
      letter_request_id: newRequest.id,
      event_type: "created",
      to_status: "received",
      performed_by: user.id,
      event_data: { created_by_admin: true },
    });

    return new Response(JSON.stringify({ success: true, id: newRequest.id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[Admin Lex] POST error:", error);
    return new Response(JSON.stringify({ error: "Erreur interne" }), { status: 500 });
  }
}
