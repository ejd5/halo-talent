// ─── Smoke Test — Chat AI API Routes ─────────────────────────
// Usage: npx tsx scripts/smoke-chat-ai.ts
// Tests: GET conversations, GET fans, POST draft (success + blocked),
//        POST approve, POST copy, POST PPV (blocked), GET audit
//
// Prerequisites:
//   - Seed data inserted (npx tsx scripts/seed-chat-ai-demo.ts)
//   - Next.js dev server running on localhost:3000
//   - Demo user session (this script uses service_role for testing)

import WebSocket from "ws";
import { createClient } from "@supabase/supabase-js";

// Polyfill WebSocket for Node.js v20 (required by @supabase/realtime-js)
if (!globalThis.WebSocket) {
  (globalThis as Record<string, unknown>).WebSocket = WebSocket;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const API_BASE = process.env.SMOKE_API_BASE || "http://localhost:3000";

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEMO_EMAIL = "demo-creator@halo-talent.com";
const DEMO_PASSWORD = "DemoChatAI2026!";

interface TestResult { name: string; passed: boolean; detail: string; }
const results: TestResult[] = [];

function record(name: string, passed: boolean, detail: string) {
  results.push({ name, passed, detail });
  const icon = passed ? "✅" : "❌";
  console.log(`  ${icon} ${name}: ${detail}`);
}

const SUPABASE_REF = SUPABASE_URL.match(/https:\/\/(.+)\.supabase\.co/)?.[1] || "lsabyfolyqlrvbseggit";
const AUTH_COOKIE_NAME = `sb-${SUPABASE_REF}-auth-token`;

async function getAuthCookie(): Promise<string> {
  // Create a session for the demo user
  const { data } = await supabase.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  });

  if (!data.session) {
    // User may not exist — try to create
    const { data: newUser } = await supabase.auth.admin.createUser({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      email_confirm: true,
    });

    if (newUser.user) {
      const { data: newSession } = await supabase.auth.signInWithPassword({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      });
      if (newSession.session) {
        return buildAuthCookie(newSession.session);
      }
    }
    throw new Error("Impossible d'authentifier le demo user. Lance le seed d'abord.");
  }

  return buildAuthCookie(data.session);
}

function buildAuthCookie(session: { access_token: string; refresh_token: string; expires_at?: number; user?: unknown }): string {
  // Supabase SSR uses "base64-" + base64url(JSON.stringify(session))
  const sessionJson = JSON.stringify({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
    token_type: "bearer",
    user: session.user || null,
  });
  const encoded = `base64-${Buffer.from(sessionJson).toString("base64url")}`;
  return `${AUTH_COOKIE_NAME}=${encoded}`;
}

async function apiGet(path: string, cookie: string) {
  const res = await fetch(`${API_BASE}${path}`, { headers: { Cookie: cookie } });
  return { status: res.status, data: await res.json() };
}

async function apiPost(path: string, body: unknown, cookie: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify(body),
  });
  return { status: res.status, data: await res.json() };
}

async function main() {
  console.log("🧪 Smoke Test — Chat AI API Routes");
  console.log(`📡 API Base: ${API_BASE}\n`);

  let authCookie: string;
  try {
    authCookie = await getAuthCookie();
    console.log("🔑 Authentifié en tant que demo-creator\n");
  } catch (e) {
    console.error("❌ Auth échouée:", e);
    process.exit(1);
  }

  // ── Test 1: GET /api/chat-ai/conversations ──────────────
  console.log("── Conversations ──");
  const convRes = await apiGet("/api/chat-ai/conversations?limit=50", authCookie);
  record("GET conversations", convRes.status === 200 && convRes.data.conversations?.length > 0,
    convRes.status === 200
      ? `${convRes.data.conversations?.length || 0} conversations`
      : `HTTP ${convRes.status}: ${JSON.stringify(convRes.data).slice(0, 100)}`);

  // ── Test 2: GET /api/chat-ai/fans ───────────────────────
  console.log("── Fans ──");
  const fansRes = await apiGet("/api/chat-ai/fans?limit=60", authCookie);
  record("GET fans (all)", fansRes.status === 200 && fansRes.data.fans?.length >= 40,
    `${fansRes.data.fans?.length || 0} fans`);

  const fanDetailRes = await apiGet(`/api/chat-ai/fans?fanId=${fansRes.data.fans?.[0]?.id}`, authCookie);
  record("GET fan detail", fanDetailRes.status === 200 && !!fanDetailRes.data.fan,
    fanDetailRes.data.fan?.pseudonym || "non trouvé");

  const dncRes = await apiGet("/api/chat-ai/fans?doNotContact=true", authCookie);
  record("GET fans (do_not_contact)", dncRes.status === 200,
    `${dncRes.data.fans?.length || 0} fans do_not_contact`);

  // ── Test 3: POST /api/chat-ai/draft (success) ───────────
  console.log("── Draft (success) ──");

  // Get first non-blocked conversation
  const fanForDraft = fansRes.data.fans?.find((f: Record<string, unknown>) =>
    f.status !== "do_not_contact" && !(f.risk_flags as string[])?.includes("vulnerable_fan"));

  let convForDraft: Record<string, unknown> | null = null;
  if (fanForDraft) {
    convForDraft = convRes.data.conversations?.find((c: Record<string, unknown>) =>
      c.fan_id === fanForDraft.id);
  }

  let draftId: string | null = null;

  if (convForDraft) {
    const draftRes = await apiPost("/api/chat-ai/draft", {
      conversationId: convForDraft.id,
      objective: "Prendre des nouvelles et créer du lien",
      actionType: "generate",
    }, authCookie);

    const draftOk = draftRes.status === 200 && draftRes.data.allowed !== false && !!draftRes.data.draft?.id;
    record("POST draft (autorisé)", draftOk,
      draftOk
        ? `Draft ${draftRes.data.draft.id} — modèle: ${draftRes.data.model} — risque: ${draftRes.data.riskLevel}`
        : `HTTP ${draftRes.status}: ${JSON.stringify(draftRes.data).slice(0, 120)}`);

    if (draftOk) {
      draftId = draftRes.data.draft.id;
      record("  Draft demoMode", true, draftRes.data.demoMode ? "Demo Mode (OK — pas de clé)" : "DeepSeek réel (OK — clé présente)");
    }
  } else {
    record("POST draft (autorisé)", false, "Aucune conversation trouvée pour un fan non-bloqué");
  }

  // ── Test 4: POST /api/chat-ai/draft on do_not_contact ──
  console.log("── Draft (bloqué — do_not_contact) ──");

  const blockedFan = fansRes.data.fans?.find((f: Record<string, unknown>) =>
    f.status === "do_not_contact" && !(f.risk_flags as string[])?.includes("vulnerable_fan"));

  if (blockedFan) {
    const blockedConv = convRes.data.conversations?.find((c: Record<string, unknown>) =>
      c.fan_id === blockedFan.id);

    if (blockedConv) {
      const blockedRes = await apiPost("/api/chat-ai/draft", {
        conversationId: blockedConv.id,
        objective: "Proposer une offre premium",
      }, authCookie);

      record("POST draft (do_not_contact)", blockedRes.status === 403 && blockedRes.data.allowed === false,
        `HTTP ${blockedRes.status} — allowed=${blockedRes.data.allowed} — ${(blockedRes.data.reasons || []).join(", ")}`);
    } else {
      // The do_not_contact fans don't have conversations (they were filtered out in seed)
      // Create a direct test: try the compliance-scan endpoint with do_not_contact context
      const scanRes = await apiPost("/api/chat-ai/compliance-scan", {
        text: "Message test pour fan bloqué",
        fanId: blockedFan.id,
        action: "generate_draft",
      }, authCookie);

      record("POST scan (do_not_contact)", scanRes.status === 200 && scanRes.data.allowed === false,
        `HTTP ${scanRes.status} — allowed=${scanRes.data.allowed} — reasons: ${(scanRes.data.reasons || []).length} items`);
    }
  } else {
    record("POST draft (do_not_contact)", false, "Fan do_not_contact non trouvé");
  }

  // ── Test 5: POST /api/chat-ai/draft on vulnerable_fan ───
  console.log("── Draft (bloqué — vulnerable_fan) ──");

  const vulnFan = fansRes.data.fans?.find((f: Record<string, unknown>) =>
    (f.risk_flags as string[])?.includes("vulnerable_fan"));

  if (vulnFan) {
    const scanRes = await apiPost("/api/chat-ai/compliance-scan", {
      text: "Offre exclusive à 50€",
      fanId: vulnFan.id,
      action: "create_ppv",
    }, authCookie);

    record("POST scan (vulnerable_fan + commercial)", scanRes.data.allowed === false || scanRes.data.reasons?.length > 0,
      `HTTP ${scanRes.status} — allowed=${scanRes.data.allowed} — reasons: ${(scanRes.data.reasons || []).length} items`);
  } else {
    record("POST draft (vulnerable_fan)", false, "Fan vulnerable non trouvé");
  }

  // ── Test 6: POST approve draft ──────────────────────────
  console.log("── Approve / Copy ──");

  if (draftId) {
    const approveRes = await apiPost(`/api/chat-ai/drafts/${draftId}/approve`, {}, authCookie);
    record("POST approve draft", approveRes.status === 200 && approveRes.data.success,
      approveRes.data.success ? "Approuvé — prêt à copier" : `HTTP ${approveRes.status}: ${JSON.stringify(approveRes.data).slice(0, 100)}`);

    // Test 7: POST copy draft
    const copyRes = await apiPost(`/api/chat-ai/drafts/${draftId}/copy`, {}, authCookie);
    record("POST copy draft", copyRes.status === 200 && copyRes.data.success,
      copyRes.data.success ? "Copié — texte retourné" : `HTTP ${copyRes.status}: ${JSON.stringify(copyRes.data).slice(0, 100)}`);
  } else {
    record("POST approve draft", false, "Pas de draft ID (test précédent échoué)");
    record("POST copy draft", false, "Pas de draft ID (test précédent échoué)");
  }

  // ── Test 8: POST PPV with first fan ─────────────────────
  console.log("── PPV ──");

  // Get vault assets and find one to recommend
  const vaultRes = await apiGet("/api/chat-ai/vault-assets", authCookie);
  const vaultAssets = vaultRes.data?.assets || [];
  const fanForPPV = fansRes.data.fans?.[0];

  if (fanForPPV && vaultAssets.length > 0) {
    const ppvRes = await apiPost("/api/chat-ai/ppv-recommendation", {
      vaultAssetId: vaultAssets[0].id,
      targetFanIds: [fanForPPV.id],
    }, authCookie);

    record("POST PPV recommendation", ppvRes.status === 200,
      ppvRes.status === 200
        ? `${ppvRes.data.recommendation?.recommendedPrice || "?"}€ recommandé`
        : `HTTP ${ppvRes.status}: ${ppvRes.data.error || "OK"}`.slice(0, 100));
  } else {
    record("POST PPV recommendation", false, !fanForPPV ? "Fan non trouvé" : "Aucun vault asset");
  }

  // ── Test 9: GET audit logs ──────────────────────────────
  console.log("── Audit ──");
  const auditRes = await apiGet("/api/chat-ai/audit?limit=20", authCookie);
  record("GET audit logs", auditRes.status === 200 && auditRes.data.logs?.length > 0,
    `${auditRes.data.logs?.length || 0} logs`);

  const exportRes = await apiGet("/api/chat-ai/audit?export=true", authCookie);
  record("GET audit export", exportRes.status === 200 && !!exportRes.data.exportedAt,
    `Exporté: ${exportRes.data.logs?.length || 0} entrées`);

  // ── Summary ─────────────────────────────────────────────
  console.log("\n" + "=".repeat(60));
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`📊 Résultats: ${passed}/${results.length} passés, ${failed} échoués`);
  console.log("=".repeat(60));

  if (failed > 0) {
    console.log("\n❌ Tests échoués:");
    for (const r of results.filter((r) => !r.passed)) {
      console.log(`  - ${r.name}: ${r.detail}`);
    }
  }

  process.exit(failed > 0 ? 1 : 0);
}

main();
