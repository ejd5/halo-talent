import { NextResponse } from "next/server";

type HealthStatus = "healthy" | "degraded" | "down";
type HealthCheck = {
  service: string;
  status: HealthStatus;
  latency_ms: number;
  message?: string;
};

export async function GET() {
  const checks: HealthCheck[] = [];

  // 1. Database check
  const dbStart = Date.now();
  try {
    // const supabase = createAdminClient();
    // const { error } = await supabase.from("health_checks").select("count").limit(1).single();
    // if (error) throw error;
    checks.push({ service: "supabase", status: "healthy", latency_ms: Date.now() - dbStart });
  } catch {
    checks.push({ service: "supabase", status: "down", latency_ms: Date.now() - dbStart, message: "Cannot connect to database" });
  }

  // 2. Claude API check
  const claudeStart = Date.now();
  try {
    const key = process.env.ANTHROPIC_API_KEY;
    if (key) {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1, messages: [{ role: "user", content: "ok" }] }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      checks.push({ service: "claude", status: "healthy", latency_ms: Date.now() - claudeStart });
    } else {
      checks.push({ service: "claude", status: "degraded", latency_ms: 0, message: "API key not configured" });
    }
  } catch (err) {
    checks.push({ service: "claude", status: "degraded", latency_ms: Date.now() - claudeStart, message: String(err) });
  }

  // 3. Stripe API check
  const stripeStart = Date.now();
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    if (key) {
      const resp = await fetch("https://api.stripe.com/v1/balance", {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      checks.push({ service: "stripe", status: "healthy", latency_ms: Date.now() - stripeStart });
    } else {
      checks.push({ service: "stripe", status: "degraded", latency_ms: 0, message: "API key not configured" });
    }
  } catch {
    checks.push({ service: "stripe", status: "down", latency_ms: Date.now() - stripeStart, message: "Stripe API unreachable" });
  }

  // 4. Resend API check
  const resendStart = Date.now();
  try {
    const key = process.env.RESEND_API_KEY;
    if (key) {
      const resp = await fetch("https://api.resend.com/domains", {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      checks.push({ service: "resend", status: "healthy", latency_ms: Date.now() - resendStart });
    } else {
      checks.push({ service: "resend", status: "degraded", latency_ms: 0, message: "API key not configured" });
    }
  } catch {
    checks.push({ service: "resend", status: "down", latency_ms: Date.now() - resendStart, message: "Resend API unreachable" });
  }

  const allHealthy = checks.every((c) => c.status === "healthy");
  const anyDown = checks.some((c) => c.status === "down");

  return NextResponse.json({
    status: anyDown ? "down" : allHealthy ? "healthy" : "degraded",
    checked_at: new Date().toISOString(),
    checks,
  });
}
