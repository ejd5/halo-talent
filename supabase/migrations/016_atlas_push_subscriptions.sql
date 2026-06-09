-- ─── Web Push Subscriptions ──────────────────────────────────
-- Stocke les subscriptions push des fans (via capture page / opt-in)

CREATE TABLE atlas_push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  fan_id UUID REFERENCES atlas_fans(id) ON DELETE SET NULL,
  endpoint TEXT NOT NULL,
  p256dh_key TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  device_info JSONB DEFAULT '{}',
  user_agent TEXT,
  locale TEXT DEFAULT 'fr',
  active BOOLEAN DEFAULT TRUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  UNIQUE(creator_id, endpoint)
);

CREATE INDEX idx_push_subscriptions_creator ON atlas_push_subscriptions(creator_id, active);
CREATE INDEX idx_push_subscriptions_fan ON atlas_push_subscriptions(fan_id);

-- ─── Push Campaigns ─────────────────────────────────────────
-- Campagnes de notification push créées par le creator

CREATE TABLE atlas_push_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  icon_url TEXT,
  image_url TEXT,
  target_url TEXT DEFAULT '/',
  segment_filter JSONB DEFAULT '{}',   -- filtrer les fans (ex: {fan_tier: "premium"})
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','scheduled','sending','sent','cancelled')),
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  stats JSONB DEFAULT '{"sent":0,"delivered":0,"clicked":0}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_push_campaigns_creator ON atlas_push_campaigns(creator_id, status);

-- ─── Campaign Sends Log ─────────────────────────────────────
-- Tracking de chaque envoi de notification

CREATE TABLE atlas_campaign_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES atlas_push_campaigns(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES atlas_push_subscriptions(id) ON DELETE SET NULL,
  fan_id UUID REFERENCES atlas_fans(id) ON DELETE SET NULL,
  channel TEXT DEFAULT 'push',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','sent','delivered','clicked','failed','expired')),
  error TEXT,
  platform_response JSONB,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  clicked_at TIMESTAMPTZ
);

CREATE INDEX idx_campaign_sends_campaign ON atlas_campaign_sends(campaign_id);
CREATE INDEX idx_campaign_sends_status ON atlas_campaign_sends(status);

-- ─── RLS ────────────────────────────────────────────────────

ALTER TABLE atlas_push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_push_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_campaign_sends ENABLE ROW LEVEL SECURITY;

-- Subscriptions : le creator voit/delete ses subs, insert public (fan)
CREATE POLICY "creator_select_own_subs"
  ON atlas_push_subscriptions FOR SELECT
  USING (creator_id IN (SELECT id FROM profiles WHERE auth.uid() = id));

CREATE POLICY "creator_delete_own_subs"
  ON atlas_push_subscriptions FOR DELETE
  USING (creator_id IN (SELECT id FROM profiles WHERE auth.uid() = id));

CREATE POLICY "public_insert_subscriptions"
  ON atlas_push_subscriptions FOR INSERT
  WITH CHECK (true);  -- anyone can subscribe via public API

-- Campaigns : CRUD creator only
CREATE POLICY "creator_select_own_campaigns"
  ON atlas_push_campaigns FOR SELECT
  USING (creator_id IN (SELECT id FROM profiles WHERE auth.uid() = id));

CREATE POLICY "creator_insert_own_campaigns"
  ON atlas_push_campaigns FOR INSERT
  WITH CHECK (creator_id IN (SELECT id FROM profiles WHERE auth.uid() = id));

CREATE POLICY "creator_update_own_campaigns"
  ON atlas_push_campaigns FOR UPDATE
  USING (creator_id IN (SELECT id FROM profiles WHERE auth.uid() = id));

CREATE POLICY "creator_delete_own_campaigns"
  ON atlas_push_campaigns FOR DELETE
  USING (creator_id IN (SELECT id FROM profiles WHERE auth.uid() = id));

-- Campaign sends : creator can read
CREATE POLICY "creator_select_own_sends"
  ON atlas_campaign_sends FOR SELECT
  USING (campaign_id IN (SELECT id FROM atlas_push_campaigns WHERE creator_id IN (SELECT id FROM profiles WHERE auth.uid() = id)));

CREATE POLICY "public_insert_sends"
  ON atlas_campaign_sends FOR INSERT
  WITH CHECK (true);  -- inserted by server-side code
