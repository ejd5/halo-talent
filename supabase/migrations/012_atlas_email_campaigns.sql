-- ─── Atlas — Email Campaigns ───────────────────────────────
-- Migration 012: Segments, campaigns, sends, consent logs

-- ============================================================
-- 1. SEGMENTS — Saved audience definitions
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  filters JSONB DEFAULT '{}'::jsonb,
  estimated_count INTEGER DEFAULT 0,
  is_dynamic BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE atlas_segments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator owns segments" ON atlas_segments FOR ALL USING (auth.uid() = creator_id);

-- ============================================================
-- 2. CAMPAIGNS — Email campaigns
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','scheduled','sending','sent','paused','failed')),
  type TEXT NOT NULL
    CHECK (type IN ('newsletter','new_content','promo_ppv','welcome','reengagement','birthday','custom')),
  goal TEXT
    CHECK (goal IN ('engagement','direct_sale','information','custom')),
  subject TEXT,
  preheader TEXT,
  from_name TEXT,
  from_email TEXT,
  content JSONB DEFAULT '[]'::jsonb,
  audience_segment_id UUID REFERENCES atlas_segments(id) ON DELETE SET NULL,
  custom_filters JSONB DEFAULT '{}'::jsonb,
  personalize_with_ai BOOLEAN DEFAULT FALSE,
  schedule_at TIMESTAMPTZ,
  throttle_hours INTEGER DEFAULT 4,
  ab_test_enabled BOOLEAN DEFAULT FALSE,
  ab_test_version_a JSONB,
  ab_test_version_b JSONB,
  ab_test_winner TEXT,
  ab_test_sent INTEGER DEFAULT 0,
  sent_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  recipients_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE atlas_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator owns campaigns" ON atlas_campaigns FOR ALL USING (auth.uid() = creator_id);

-- ============================================================
-- 3. CAMPAIGN SENDS — Per-recipient tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_campaign_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES atlas_campaigns(id) ON DELETE CASCADE NOT NULL,
  fan_id UUID REFERENCES atlas_fans(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','sent','failed','bounced','opened','clicked','unsubscribed')),
  email_id TEXT,
  subject TEXT,
  content_preview TEXT,
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  open_count INTEGER DEFAULT 0,
  clicked_at TIMESTAMPTZ,
  click_count INTEGER DEFAULT 0,
  unsubscribed_at TIMESTAMPTZ,
  error TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE atlas_campaign_sends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator owns campaign sends" ON atlas_campaign_sends FOR ALL USING (
  EXISTS (SELECT 1 FROM atlas_campaigns WHERE id = campaign_id AND creator_id = auth.uid())
);

-- Index for tracking lookups
CREATE INDEX IF NOT EXISTS idx_campaign_sends_campaign ON atlas_campaign_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_sends_fan ON atlas_campaign_sends(fan_id);
CREATE INDEX IF NOT EXISTS idx_campaign_sends_status ON atlas_campaign_sends(status);

-- ============================================================
-- 4. CONSENT LOGS — RGPD audit trail
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_consent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fan_id UUID REFERENCES atlas_fans(id) ON DELETE CASCADE NOT NULL,
  consent_type TEXT NOT NULL,
  granted BOOLEAN NOT NULL,
  source TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE atlas_consent_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator can read consent logs" ON atlas_consent_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM atlas_fans WHERE id = fan_id AND creator_id = auth.uid())
);

-- ============================================================
-- 5. UNSUBSCRIBE TOKENS — For one-click unsubscribe
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_unsubscribe_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fan_id UUID REFERENCES atlas_fans(id) ON DELETE CASCADE NOT NULL,
  token TEXT UNIQUE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '365 days'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE atlas_unsubscribe_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read unsubscribe tokens" ON atlas_unsubscribe_tokens FOR SELECT USING (true);
CREATE POLICY "Anyone can update unsubscribe tokens" ON atlas_unsubscribe_tokens FOR UPDATE USING (true);

-- ============================================================
-- 6. Add columns to atlas_fans for email marketing
-- ============================================================
ALTER TABLE atlas_fans ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMPTZ;
ALTER TABLE atlas_fans ADD COLUMN IF NOT EXISTS last_email_sent_at TIMESTAMPTZ;
ALTER TABLE atlas_fans ADD COLUMN IF NOT EXISTS email_bounced BOOLEAN DEFAULT FALSE;
ALTER TABLE atlas_fans ADD COLUMN IF NOT EXISTS email_bounce_reason TEXT;
