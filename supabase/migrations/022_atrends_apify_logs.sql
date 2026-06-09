-- 022_atrends_apify_logs.sql
-- Apify usage tracking + TikTok Creative Center provider support

-- ─── Apify Usage Logs ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS apify_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id TEXT NOT NULL,
  cost_estimate DECIMAL(10,4) DEFAULT 0.05,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE apify_usage_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view usage logs
CREATE POLICY "Admins view apify logs" ON apify_usage_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Service role can insert
CREATE POLICY "Service role manages apify logs" ON apify_usage_logs
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- ─── Index for monthly cost queries ────────────────────────────
CREATE INDEX IF NOT EXISTS idx_apify_logs_created ON apify_usage_logs(created_at);

-- ─── Profiles: add telegram_chat_id if not exists ────────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS telegram_chat_id TEXT;
