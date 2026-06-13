// ─── WTF Lex, Letter Delivery & Notification Service ──────
// Gère l'envoi des notifications aux 4 étapes clés, les emails,
// le suivi post-livraison J+3 et J+7, et le feedback.

import { createAdminClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";

interface NotificationPayload {
  letterRequestId: string;
  userId: string;
  email: string;
  firstName: string;
  letterType: string;
  priority: string;
  deadlineAt: string;
  complexity: string;
}

// ─── Log notification in DB ──────────────────────────────

async function logNotification(
  letterRequestId: string,
  type: string,
  channel: string,
  recipient: string,
  content: any,
  status: string = "sent"
) {
  try {
    const supabase = await createAdminClient();
    await supabase.from("letter_notifications").insert({
      letter_request_id: letterRequestId,
      notification_type: type,
      channel,
      recipient,
      status,
      sent_at: new Date().toISOString(),
      content,
    });
  } catch (err) {
    console.warn("[Lex Notification] Failed to log:", err);
  }
}

// ─── Send + log email ────────────────────────────────────

async function sendAndLogEmail(
  letterRequestId: string,
  type: string,
  email: string,
  subject: string,
  html: string
) {
  const result = await sendEmail({ to: email, subject, html });
  await logNotification(
    letterRequestId,
    type,
    "email",
    email,
    { subject, html },
    result.sent ? "sent" : "failed"
  );
  return result;
}

// ─── Step 1: Received confirmation ───────────────────────

export async function sendReceivedConfirmation(data: NotificationPayload) {
  const subject = `✅ Votre demande de rédaction a bien été reçue, WTF Lex`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Bonjour ${data.firstName},</h2>
      <p>Votre demande de rédaction du document <strong>"${data.letterType}"</strong> a bien été reçue.</p>

      <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p><strong>Récapitulatif :</strong></p>
        <ul>
          <li>Type : ${data.letterType}</li>
          <li>Complexité : ${data.complexity === "standard" ? "Standard" : "Complexe"}</li>
          <li>Priorité : ${data.priority === "express" ? "Express (4h)" : data.priority === "urgent" ? "Urgent (12h)" : "Standard (48h)"}</li>
     ${data.priority !== "standard" ? `<li>Supplément : ${data.priority === "express" ? "+50€" : "+20€"}</li>` : ""}
          <li>Échéance : ${new Date(data.deadlineAt).toLocaleDateString("fr-FR", { dateStyle: "long" })}</li>
        </ul>
      </div>

      <p>L'équipe WTF va préparer votre document. Vous recevrez une notification dès qu'il sera prêt.</p>
      <p>Vous pouvez suivre le statut de votre demande en temps réel :</p>
      <p><a href="https://halo-talent.com/lex/requests/${data.letterRequestId}" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Suivre ma demande</a></p>
      <p style="margin-top: 24px; font-size: 12px; color: #666;">ℹ️ WTF Lex fournit une assistance à la rédaction juridique. Information juridique générale, ne constitue pas un acte d'avocat.</p>
    </div>
  `;

  await sendAndLogEmail(data.letterRequestId, "received_confirmation", data.email, subject, html);
  await sendInAppNotification(data.userId, "received_confirmation", `Votre demande "${data.letterType}" a été reçue`, data.letterRequestId);
}

// ─── Step 2: In progress notification ────────────────────

export async function sendInProgressNotification(data: NotificationPayload) {
  const subject = `✍️ Votre lettre est en cours de rédaction, WTF Lex`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Bonjour ${data.firstName},</h2>
      <p>Bonne nouvelle ! Notre équipe a commencé la rédaction de votre document <strong>"${data.letterType}"</strong>.</p>
      <p>Vous le recevrez avant le <strong>${new Date(data.deadlineAt).toLocaleDateString("fr-FR", { dateStyle: "long" })}</strong>.</p>
      <p><a href="https://halo-talent.com/lex/requests/${data.letterRequestId}" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Suivre l'avancement</a></p>
      <p style="margin-top: 24px;">À bientôt,<br>L'équipe WTF</p>
    </div>
  `;

  await sendAndLogEmail(data.letterRequestId, "in_progress", data.email, subject, html);
  await sendInAppNotification(data.userId, "in_progress", `Votre lettre "${data.letterType}" est en cours de rédaction`, data.letterRequestId);
}

// ─── Step 3: Document ready notification ─────────────────

export async function sendDocumentReadyNotification(
  data: NotificationPayload,
  pdfUrl: string,
  recommendations?: { deadlineDays?: number; followUpDays?: number; sendMethod?: string }
) {
  const rec = recommendations || {};
  const subject = `📄 Votre document est prêt, WTF Lex`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Bonjour ${data.firstName},</h2>
      <p>Votre document <strong>"${data.letterType}"</strong> est prêt ! Vous trouverez ci-joint le PDF finalisé.</p>

      <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p><strong>📝 Conseils d'utilisation :</strong></p>
        <ol>
          <li>Relisez attentivement avant envoi</li>
          <li>Personnalisez les passages entre crochets si nécessaire</li>
          <li>Envoyez le document par ${rec.sendMethod || "email recommandé / courrier recommandé selon le cas"}</li>
          <li>Conservez une copie pour vos archives</li>
        </ol>
      </div>

      ${rec.deadlineDays ? `<p>🕐 Délais légaux à respecter : ${rec.deadlineDays} jours ouvrés à compter de la réception.</p>` : ""}
      ${rec.followUpDays ? `<p>📊 Suivi recommandé : Si vous n'avez pas de réponse sous ${rec.followUpDays} jours, n'hésitez pas à demander une lettre de relance via WTF Lex.</p>` : ""}

      <p><a href="${pdfUrl}" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Télécharger mon document</a></p>
      <p style="margin-top: 24px; font-size: 12px; color: #666;">ℹ️ Information juridique générale, ne constitue pas un acte d'avocat. Le créateur reste seul responsable de l'envoi et des conséquences de ce document.</p>
    </div>
  `;

  await sendAndLogEmail(data.letterRequestId, "ready", data.email, subject, html);
  await sendInAppNotification(data.userId, "document_ready", `Votre document "${data.letterType}" est prêt !`, data.letterRequestId);
}

// ─── Step 4: Clarification requested ─────────────────────

export async function sendClarificationNotification(
  data: NotificationPayload,
  questions: string[]
) {
  const subject = `❓ Information complémentaire nécessaire, WTF Lex`;
  const questionList = questions.map((q, i) => `${i + 1}. ${q}`).join("\n");
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Bonjour ${data.firstName},</h2>
      <p>Pour finaliser votre document <strong>"${data.letterType}"</strong>, nous avons besoin de quelques précisions :</p>
      <div style="background: #fff7ed; padding: 16px; border-radius: 8px; margin: 16px 0;">
        ${questions.map((q, i) => `<p><strong>${i + 1}.</strong> ${q}</p>`).join("")}
      </div>
      <p>Répondez directement sur votre tableau de bord :</p>
      <p><a href="https://halo-talent.com/lex/requests/${data.letterRequestId}" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Répondre</a></p>
      <p>Le compte à rebours de votre demande est mis en pause jusqu'à votre réponse.</p>
      <p>Merci,<br>L'équipe WTF</p>
    </div>
  `;

  await sendAndLogEmail(data.letterRequestId, "clarification_needed", data.email, subject, html);
  await sendInAppNotification(data.userId, "clarification", "Information complémentaire nécessaire pour votre document", data.letterRequestId);
}

// ─── Follow-up: J+3 ──────────────────────────────────────

export async function sendFollowUp3Days(data: NotificationPayload) {
  const subject = `💬 Comment se passe le suivi de votre dossier ?`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Bonjour ${data.firstName},</h2>
      <p>Il y a 3 jours, nous vous avons livré votre document <strong>"${data.letterType}"</strong>.</p>
      <p>Avez-vous eu une réponse du destinataire ?</p>
      <div style="display: flex; gap: 8px; margin: 16px 0;">
        <a href="https://halo-talent.com/lex/requests/${data.letterRequestId}?outcome=resolved" style="background: #22c55e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">Oui, résolu</a>
        <a href="https://halo-talent.com/lex/requests/${data.letterRequestId}?outcome=pending" style="background: #f59e0b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">En attente</a>
        <a href="https://halo-talent.com/lex/requests/${data.letterRequestId}?outcome=no_response" style="background: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">Pas de réponse</a>
      </div>
      <p>Si vous n'avez pas de réponse, une lettre de relance pourrait être nécessaire.</p>
      <p>L'équipe WTF</p>
    </div>
  `;

  await sendAndLogEmail(data.letterRequestId, "followup_3d", data.email, subject, html);
}

// ─── Follow-up: J+7 si pas de réponse ────────────────────

export async function sendFollowUp7Days(data: NotificationPayload) {
  const subject = `📝 Souhaitez-vous une lettre de relance ?`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Bonjour ${data.firstName},</h2>
      <p>7 jours se sont écoulés depuis l'envoi de votre document <strong>"${data.letterType}"</strong>.</p>
      <p>Sans réponse du destinataire, une relance formelle peut accélérer le processus.</p>
      <p><a href="https://halo-talent.com/lex/requests/${data.letterRequestId}?request_relance=true" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Demander une lettre de relance</a></p>
      <p>L'équipe WTF</p>
    </div>
  `;

  await sendAndLogEmail(data.letterRequestId, "followup_7d", data.email, subject, html);
}

// ─── In-app notification ─────────────────────────────────

async function sendInAppNotification(userId: string, type: string, message: string, letterRequestId: string) {
  try {
    const { notify } = await import("@/lib/notifications");
    await notify({
      userId,
      type: "letter_" + type,
      title: "WTF Lex",
      message,
      link: `/lex/requests/${letterRequestId}`,
      channels: ["in_app"],
    });
  } catch (err) {
    console.warn("[Lex Notification] In-app failed:", err);
  }
}

// ─── Create letter request (orchestrator) ─────────────────

export interface CreateLetterRequestInput {
  userId: string;
  email: string;
  firstName: string;
  letterType: string;
  complexity: "standard" | "complex";
  priority: "standard" | "urgent" | "express";
  brief: string;
  userContext?: any;
  attachments?: any[];
  language?: string;
  tone?: string;
  targetPlatform?: string;
  questionnaireId?: string;
}

export async function createLetterRequest(input: CreateLetterRequestInput) {
  const supabase = await createAdminClient();

  // Calculate deadline: Standard=48h, Urgent=12h/+20€, Express=4h/+50€
  const now = new Date();
  const deadline = new Date(now);
  const pricing: Record<string, number> = { standard: 0, urgent: 20, express: 50 };
  const amountCharged = pricing[input.priority] || 0;

  if (input.priority === "express") {
    deadline.setHours(deadline.getHours() + 4); // Express: 4h
  } else if (input.priority === "urgent") {
    deadline.setHours(deadline.getHours() + 12); // Urgent: 12h
  } else {
    deadline.setDate(deadline.getDate() + 2); // Standard: 48h
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

  const { data: request, error } = await supabase
    .from("letter_requests")
    .insert({
      user_id: input.userId,
      letter_type: input.letterType,
      complexity: input.complexity,
      priority: input.priority,
      reference,
      brief: input.brief,
      user_context: input.userContext || {},
      attachments: input.attachments || [],
      language: input.language || "fr",
      tone: input.tone || "ferme_et_juridique",
      target_platform: input.targetPlatform || null,
      deadline_at: deadline.toISOString(),
      questionnaire_id: input.questionnaireId || null,
      amount_charged: amountCharged,
    })
    .select()
    .single();

  if (error) throw error;

  // Log event
  await supabase.from("letter_request_events").insert({
    letter_request_id: request.id,
    event_type: "created",
    to_status: "received",
    event_data: { priority: input.priority, complexity: input.complexity },
  });

  // Send received notification
  const payload: NotificationPayload = {
    letterRequestId: request.id,
    userId: input.userId,
    email: input.email,
    firstName: input.firstName,
    letterType: input.letterType,
    priority: input.priority,
    deadlineAt: deadline.toISOString(),
    complexity: input.complexity,
  };

  await sendReceivedConfirmation(payload);

  return request;
}

// ─── Update letter request status ────────────────────────

export async function updateLetterRequestStatus(
  requestId: string,
  newStatus: string,
  adminId: string,
  extra?: { documentContent?: string; pdfUrl?: string; adminNotes?: string; timeSpent?: number }
) {
  const supabase = await createAdminClient();

  // Get current request + user info
  const { data: request } = await supabase
    .from("letter_requests")
    .select("*, auth.users!inner(email, raw_user_meta_data)")
    .eq("id", requestId)
    .single();

  if (!request || (request as any).error) throw new Error("Request not found");
  const r = request as any;
  const oldStatus = r.status;

  // Build update payload
  const update: any = { status: newStatus, updated_at: new Date().toISOString() };
  if (newStatus === "in_progress") update.started_at = new Date().toISOString();
  if (newStatus === "delivered") update.delivered_at = new Date().toISOString();
  if (extra?.documentContent) update.document_content = extra.documentContent;
  if (extra?.pdfUrl) update.document_pdf_url = extra.pdfUrl;
  if (extra?.adminNotes) update.admin_notes = extra.adminNotes;
  if (extra?.timeSpent) update.time_spent_minutes = extra.timeSpent;

  // Timer pause/resume logic for awaiting_info
  const now = new Date();
  if (newStatus === "awaiting_info") {
    // Pause the timer: store pause timestamp in user_context
    const ctx = r.user_context || {};
    ctx.timer_paused_at = now.toISOString();
    update.user_context = ctx;
  } else if (oldStatus === "awaiting_info" && r.user_context?.timer_paused_at) {
    // Resume timer: extend deadline by the paused duration
    const pausedAt = new Date(r.user_context.timer_paused_at);
    const pauseDurationMs = now.getTime() - pausedAt.getTime();
    const currentDeadline = new Date(r.deadline_at);
    const newDeadline = new Date(currentDeadline.getTime() + pauseDurationMs);
    update.deadline_at = newDeadline.toISOString();

    const ctx = r.user_context || {};
    const prevPaused = ctx.total_paused_ms || 0;
    ctx.total_paused_ms = prevPaused + pauseDurationMs;
    ctx.timer_paused_at = null;
    update.user_context = ctx;
  }

  const { error } = await supabase.from("letter_requests").update(update).eq("id", requestId);
  if (error) throw error;

  // Log event
  await supabase.from("letter_request_events").insert({
    letter_request_id: requestId,
    event_type: "status_change",
    from_status: oldStatus,
    to_status: newStatus,
    performed_by: adminId,
    event_data: { time_spent: extra?.timeSpent },
  });

  // Get user info for notifications
  const userData = r["auth.users"];
  const email = userData?.email || "";
  const firstName = userData?.raw_user_meta_data?.first_name || userData?.raw_user_meta_data?.full_name || "Utilisateur";

  const payload: NotificationPayload = {
    letterRequestId: requestId,
    userId: r.user_id,
    email,
    firstName,
    letterType: r.letter_type,
    priority: r.priority,
    deadlineAt: r.deadline_at,
    complexity: r.complexity,
  };

  // Send stage notification
  if (newStatus === "in_progress") {
    await sendInProgressNotification(payload);
  } else if (newStatus === "delivered") {
    if (extra?.pdfUrl) {
      await sendDocumentReadyNotification(payload, extra.pdfUrl);
    }
  } else if (newStatus === "awaiting_info" && extra?.adminNotes) {
    await sendClarificationNotification(payload, [extra.adminNotes]);
  }

  return { success: true };
}

// ─── Record feedback ─────────────────────────────────────

export async function recordFeedback(
  letterRequestId: string,
  userId: string,
  rating: number,
  comment?: string,
  outcome?: string
) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("letter_feedback")
    .insert({ letter_request_id: letterRequestId, user_id: userId, rating, comment, outcome })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── Check and send follow-ups (cron) ────────────────────

export async function checkPendingFollowUps() {
  const supabase = await createAdminClient();
  const now = new Date();

  // J+3 follow-ups
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const { data: threeDayCandidates } = await supabase
    .from("letter_requests")
    .select("*, users:auth.users!inner(email, raw_user_meta_data)")
    .eq("status", "delivered")
    .eq("followup_3d_sent", false)
    .lt("delivered_at", threeDaysAgo.toISOString())
    .limit(10);

  for (const req of (threeDayCandidates || []) as any[]) {
    const userData = req.users;
    const payload: NotificationPayload = {
      letterRequestId: req.id,
      userId: req.user_id,
      email: userData?.email || "",
      firstName: userData?.raw_user_meta_data?.first_name || "Utilisateur",
      letterType: req.letter_type,
      priority: req.priority,
      deadlineAt: req.deadline_at,
      complexity: req.complexity,
    };
    await sendFollowUp3Days(payload);
    await supabase.from("letter_requests").update({ followup_3d_sent: true }).eq("id", req.id);
  }

  // J+7 follow-ups
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const { data: sevenDayCandidates } = await supabase
    .from("letter_requests")
    .select("*, users:auth.users!inner(email, raw_user_meta_data)")
    .eq("status", "delivered")
    .eq("followup_7d_sent", false)
    .eq("followup_3d_sent", true)
    .lt("delivered_at", sevenDaysAgo.toISOString())
    .limit(10);

  for (const req of (sevenDayCandidates || []) as any[]) {
    const userData = req.users;
    const payload: NotificationPayload = {
      letterRequestId: req.id,
      userId: req.user_id,
      email: userData?.email || "",
      firstName: userData?.raw_user_meta_data?.first_name || "Utilisateur",
      letterType: req.letter_type,
      priority: req.priority,
      deadlineAt: req.deadline_at,
      complexity: req.complexity,
    };
    await sendFollowUp7Days(payload);
    await supabase.from("letter_requests").update({ followup_7d_sent: true }).eq("id", req.id);
  }

  return {
    threeDaySent: (threeDayCandidates || []).length,
    sevenDaySent: (sevenDayCandidates || []).length,
  };
}

// ─── Admin Notifications (Task 81) ─────────────────────

interface AdminNotificationData {
  requestId: string;
  reference: string;
  userName: string;
  letterType: string;
  priority: string;
  deadlineAt: string;
  status: string;
  email: string;
}

async function getAdminEmails(): Promise<string[]> {
  try {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from("profiles")
      .select("email")
      .in("role", ["admin", "manager"]);
    return (data || []).map((p: any) => p.email).filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Récapitulatif quotidien à 8h, résumé des demandes en cours.
 */
export async function sendAdminDailyRecap() {
  const supabase = await createAdminClient();
  const now = new Date();

  const { data: pending } = await supabase
    .from("letter_requests")
    .select("*, users:auth.users!inner(email, raw_user_meta_data)")
    .in("status", ["received", "in_progress", "pending_validation", "awaiting_info"])
    .order("deadline_at", { ascending: true });

  if (!pending || pending.length === 0) return { sent: 0 };

  const adminEmails = await getAdminEmails();
  if (adminEmails.length === 0) return { sent: 0 };

  const counts = {
    received: pending.filter((r: any) => r.status === "received").length,
    in_progress: pending.filter((r: any) => r.status === "in_progress").length,
    awaiting_info: pending.filter((r: any) => r.status === "awaiting_info").length,
    pending_validation: pending.filter((r: any) => r.status === "pending_validation").length,
    express: pending.filter((r: any) => r.priority === "express").length,
    urgent: pending.filter((r: any) => r.priority === "urgent").length,
    late: pending.filter((r: any) => new Date(r.deadline_at) < now).length,
  };

  const rows = pending.slice(0, 15).map((r: any) => {
    const userName = r.users?.raw_user_meta_data?.first_name || ", ";
    const dl = new Date(r.deadline_at);
    const isLate = dl < now;
    const hoursLeft = Math.round((dl.getTime() - now.getTime()) / (1000 * 60 * 60));
    const priorityIcon = r.priority === "express" ? "🔥" : r.priority === "urgent" ? "⚡" : "⏰";
    return `<tr>
      <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb">${priorityIcon}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb">${r.reference || r.id.substring(0, 8)}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb">${userName}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb">${r.letter_type}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;color:${isLate ? "#ef4444" : "inherit"}">${isLate ? "EN RETARD" : `${hoursLeft}h restantes`}</td>
    </tr>`;
  }).join("");

  const subject = `📊 WTF Lex, Récap du ${now.toLocaleDateString("fr-FR", { dateStyle: "long" })}`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <h2>File de rédaction, ${now.toLocaleDateString("fr-FR", { dateStyle: "long" })}</h2>
      <div style="background:#f8f9fa;padding:12px;border-radius:8px;margin:12px 0">
        <p><strong>En attente :</strong> ${pending.length} demande${pending.length > 1 ? "s" : ""}</p>
        <ul>
          <li>📥 Reçues : ${counts.received}</li>
          <li>✍️ En cours : ${counts.in_progress}</li>
          <li>❓ En attente d'infos : ${counts.awaiting_info}</li>
          <li>✅ À valider : ${counts.pending_validation}</li>
          ${counts.express > 0 ? `<li>🔥 Express : ${counts.express}</li>` : ""}
          ${counts.urgent > 0 ? `<li>⚡ Urgent : ${counts.urgent}</li>` : ""}
          ${counts.late > 0 ? `<li>🚨 En retard : ${counts.late}</li>` : ""}
        </ul>
      </div>
      ${pending.length > 0 ? `
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead><tr style="background:#f3f4f6;text-align:left">
          <th style="padding:6px 8px"></th>
          <th style="padding:6px 8px">Réf</th>
          <th style="padding:6px 8px">Client</th>
          <th style="padding:6px 8px">Document</th>
          <th style="padding:6px 8px">Échéance</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      ` : ""}
      <p style="margin-top:16px"><a href="https://halo-talent.com/admin/lex/letter-queue" style="display:inline-block;background:#7c3aed;color:white;padding:10px 20px;text-decoration:none;border-radius:6px">Accéder à la file</a></p>
    </div>`;

  let sent = 0;
  for (const email of adminEmails) {
    await sendAndLogEmail("admin_daily", "daily_recap", email, subject, html);
    sent++;
  }

  return { sent, pending: pending.length, ...counts };
}

/**
 * Alerte 4h avant l'échéance pour les demandes urgentes/express non commencées.
 */
export async function sendDeadlineReminder4h() {
  const supabase = await createAdminClient();
  const now = new Date();
  const in4Hours = new Date(now.getTime() + 4 * 60 * 60 * 1000);

  const { data: urgent } = await supabase
    .from("letter_requests")
    .select("*, users:auth.users!inner(email, raw_user_meta_data)")
    .in("status", ["received"])
    .lte("deadline_at", in4Hours.toISOString())
    .gt("deadline_at", now.toISOString());

  if (!urgent || urgent.length === 0) return { sent: 0 };

  const adminEmails = await getAdminEmails();
  if (adminEmails.length === 0) return { sent: 0 };

  const requestList = urgent.map((r: any) => {
    const userName = r.users?.raw_user_meta_data?.first_name || ", ";
    const dl = new Date(r.deadline_at);
    const minsLeft = Math.round((dl.getTime() - now.getTime()) / (1000 * 60));
    return `<li>${r.reference || r.id.substring(0, 8)}, ${r.letter_type} (${userName}), ${r.priority === "express" ? "Express" : "Urgent"}, <strong>${minsLeft}min restantes</strong></li>`;
  }).join("");

  const subject = `🚨 WTF Lex, ${urgent.length} demande${urgent.length > 1 ? "s" : ""} urgente${urgent.length > 1 ? "s" : ""} à traiter`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#ef4444">Demandes urgentes à traiter</h2>
      <p>Ces demandes arrivent à échéance dans moins de 4h :</p>
      <ul>${requestList}</ul>
      <p><a href="https://halo-talent.com/admin/lex/letter-queue" style="display:inline-block;background:#ef4444;color:white;padding:10px 20px;text-decoration:none;border-radius:6px">Traiter maintenant</a></p>
    </div>`;

  let sent = 0;
  for (const email of adminEmails) {
    await sendAndLogEmail("admin_deadline", "deadline_4h", email, subject, html);
    sent++;
  }

  return { sent, urgentCount: urgent.length };
}

/**
 * Alerte de retard, demandes dont l'échéance est dépassée.
 */
export async function sendLateAlert() {
  const supabase = await createAdminClient();
  const now = new Date();

  const { data: late } = await supabase
    .from("letter_requests")
    .select("*, users:auth.users!inner(email, raw_user_meta_data)")
    .in("status", ["received", "in_progress", "awaiting_info"])
    .lt("deadline_at", now.toISOString())
    .order("deadline_at", { ascending: true });

  if (!late || late.length === 0) return { sent: 0 };

  const adminEmails = await getAdminEmails();
  if (adminEmails.length === 0) return { sent: 0 };

  const requestList = late.map((r: any) => {
    const userName = r.users?.raw_user_meta_data?.first_name || ", ";
    const dl = new Date(r.deadline_at);
    const hoursLate = Math.round((now.getTime() - dl.getTime()) / (1000 * 60 * 60));
    return `<li>${r.reference || r.id.substring(0, 8)}, ${r.letter_type} (${userName}), <strong style="color:#ef4444">En retard de ${hoursLate}h</strong></li>`;
  }).join("");

  const subject = `🔴 WTF Lex, ${late.length} demande${late.length > 1 ? "s" : ""} en retard`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#ef4444">Demandes en retard</h2>
      <p>Ces demandes ont dépassé leur échéance :</p>
      <ul>${requestList}</ul>
      <p><a href="https://halo-talent.com/admin/lex/letter-queue" style="display:inline-block;background:#ef4444;color:white;padding:10px 20px;text-decoration:none;border-radius:6px">Traiter en priorité</a></p>
    </div>`;

  let sent = 0;
  for (const email of adminEmails) {
    await sendAndLogEmail("admin_late", "late_alert", email, subject, html);
    sent++;
  }

  return { sent, lateCount: late.length };
}

/**
 * Cron : exécute toutes les vérifications admin.
 * À appeler toutes les heures.
 */
export async function checkAdminNotifications() {
  const now = new Date();
  const hour = now.getHours();
  const results: any = {};

  // Daily recap at 8h
  if (hour === 8) {
    results.dailyRecap = await sendAdminDailyRecap();
  }

  // 4h reminder every hour
  results.deadline4h = await sendDeadlineReminder4h();

  // Late alert every hour
  results.lateAlert = await sendLateAlert();

  return results;
}

// ─── Get quota info ──────────────────────────────────────

export async function getUserLetterQuota(userId: string, plan: string = "premium") {
  const supabase = await createAdminClient();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Count letters this month
  const { count } = await supabase
    .from("letter_requests")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("requested_at", startOfMonth.toISOString());

  const used = count || 0;

  const limits: Record<string, { standard: number; complex: number }> = {
    premium: { standard: 2, complex: 0 },
    elite: { standard: 8, complex: 1 },
    icon: { standard: 20, complex: 20 },
  };

  const planLimits = limits[plan] || { standard: 0, complex: 0 };
  const maxStandard = planLimits.standard;
  const maxComplex = planLimits.complex;

  return {
    used,
    maxStandard,
    maxComplex,
    remaining: maxStandard + maxComplex - used,
    plan,
    renewalDate: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString(),
  };
}
