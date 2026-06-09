-- ─── Atlas — Fan Relationship Manager ───
-- Migration 008: Fans CRM, interactions, segmentation, automation logs

-- ============================================================
-- 1. ATLAS FANS (CRM central)
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_fans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  -- Identification multi-canal
  email TEXT,
  phone TEXT,
  username_onlyfans TEXT,
  username_instagram TEXT,
  username_tiktok TEXT,
  username_other JSONB DEFAULT '{}'::jsonb,

  -- Données enrichies
  first_name TEXT,
  display_name TEXT,
  avatar_url TEXT,
  country TEXT,
  language TEXT DEFAULT 'en',
  timezone TEXT,

  -- Scoring & comportement
  total_spent DECIMAL(12,2) DEFAULT 0,
  lifetime_value DECIMAL(12,2) DEFAULT 0,
  last_purchase_at TIMESTAMPTZ,
  purchases_count INTEGER DEFAULT 0,
  avg_order_value DECIMAL(10,2) DEFAULT 0,

  -- Engagement
  first_seen_at TIMESTAMPTZ DEFAULT NOW(),
  last_interaction_at TIMESTAMPTZ,
  total_interactions INTEGER DEFAULT 0,

  -- Lead scoring (0-100)
  fan_score INTEGER DEFAULT 0,
  fan_tier TEXT DEFAULT 'cold' CHECK (fan_tier IN ('cold','warm','engaged','whale','vip','churned')),

  -- Consents (RGPD)
  email_consent BOOLEAN DEFAULT FALSE,
  email_consent_at TIMESTAMPTZ,
  sms_consent BOOLEAN DEFAULT FALSE,
  sms_consent_at TIMESTAMPTZ,
  push_consent BOOLEAN DEFAULT FALSE,
  data_processing_consent BOOLEAN DEFAULT FALSE,

  -- Source d'acquisition
  acquired_via TEXT,
  acquired_at TIMESTAMPTZ DEFAULT NOW(),

  -- Tags & segmentation
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}'::jsonb,

  -- Statut
  status TEXT DEFAULT 'active' CHECK (status IN ('active','unsubscribed','blocked','deleted')),
  blocked_reason TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Index unique par créateur + email pour déduplication
  UNIQUE(creator_id, email)
);

CREATE INDEX IF NOT EXISTS idx_atlas_fans_creator ON atlas_fans(creator_id);
CREATE INDEX IF NOT EXISTS idx_atlas_fans_score ON atlas_fans(fan_score DESC);
CREATE INDEX IF NOT EXISTS idx_atlas_fans_tier ON atlas_fans(fan_tier);
CREATE INDEX IF NOT EXISTS idx_atlas_fans_status ON atlas_fans(status);
CREATE INDEX IF NOT EXISTS idx_atlas_fans_tags ON atlas_fans USING gin(tags);

ALTER TABLE atlas_fans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creator owns fans"
  ON atlas_fans FOR ALL
  USING (auth.uid() = creator_id);

-- ============================================================
-- 2. ATLAS INTERACTIONS (historique complet)
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fan_id UUID REFERENCES atlas_fans(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  direction TEXT CHECK (direction IN ('inbound','outbound')) NOT NULL,
  type TEXT,
  subject TEXT,
  content TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  ai_generated BOOLEAN DEFAULT FALSE,
  ai_validated_by_human BOOLEAN DEFAULT FALSE,
  occurred_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_atlas_interactions_fan ON atlas_interactions(fan_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_atlas_interactions_creator ON atlas_interactions(creator_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_atlas_interactions_channel ON atlas_interactions(channel);

ALTER TABLE atlas_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creator owns interactions"
  ON atlas_interactions FOR ALL
  USING (auth.uid() = creator_id);

-- ============================================================
-- 3. ATLAS CAMPAIGNS
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  channel TEXT NOT NULL CHECK (channel IN ('email','sms','push','dm')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','scheduled','running','completed','cancelled')),
  content TEXT,
  subject_line TEXT,
  segment_filters JSONB DEFAULT '{}'::jsonb,
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  sent_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  converted_count INTEGER DEFAULT 0,
  revenue_generated DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_atlas_campaigns_creator ON atlas_campaigns(creator_id, created_at DESC);

ALTER TABLE atlas_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator owns campaigns" ON atlas_campaigns FOR ALL USING (auth.uid() = creator_id);

-- ============================================================
-- 4. ATLAS AUTOMATION RULES
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  trigger_event TEXT NOT NULL,   -- 'new_fan','fan_tier_change','high_value_action','inactivity','purchase','custom'
  conditions JSONB DEFAULT '{}'::jsonb,
  actions JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  execution_count INTEGER DEFAULT 0,
  last_executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_atlas_rules_creator ON atlas_rules(creator_id);

ALTER TABLE atlas_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator owns rules" ON atlas_rules FOR ALL USING (auth.uid() = creator_id);

-- ============================================================
-- 5. ATLAS FUNNELS
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_funnels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  steps JSONB DEFAULT '[]'::jsonb,   -- [{order, channel, content, delay_hours}]
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','active','paused','completed')),
  entry_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  conversion_rate NUMERIC(5,2) DEFAULT 0,
  revenue_generated DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE atlas_funnels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator owns funnels" ON atlas_funnels FOR ALL USING (auth.uid() = creator_id);

-- ============================================================
-- 6. ATLAS AI DRAFTS
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  fan_id UUID REFERENCES atlas_fans(id) ON DELETE SET NULL,
  channel TEXT NOT NULL,
  type TEXT,
  content TEXT NOT NULL,
  context JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','sent')),
  validated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE atlas_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator owns drafts" ON atlas_drafts FOR ALL USING (auth.uid() = creator_id);

-- ============================================================
-- 7. ATLAS ANALYTICS SNAPSHOTS
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_fans INTEGER DEFAULT 0,
  active_fans INTEGER DEFAULT 0,
  whales INTEGER DEFAULT 0,
  vip_count INTEGER DEFAULT 0,
  churned_count INTEGER DEFAULT 0,
  new_fans_today INTEGER DEFAULT 0,
  revenue_today DECIMAL(12,2) DEFAULT 0,
  revenue_month DECIMAL(12,2) DEFAULT 0,
  messages_sent INTEGER DEFAULT 0,
  campaigns_sent INTEGER DEFAULT 0,
  drafts_pending INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(creator_id, snapshot_date)
);

ALTER TABLE atlas_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator owns snapshots" ON atlas_snapshots FOR ALL USING (auth.uid() = creator_id);

-- ============================================================
-- 8. SCORING FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION calculate_fan_score(
  p_total_spent DECIMAL,
  p_purchases_count INTEGER,
  p_total_interactions INTEGER,
  p_days_since_last_interaction INTEGER,
  p_is_subscribed BOOLEAN
) RETURNS INTEGER LANGUAGE SQL IMMUTABLE AS $$
  SELECT LEAST(100, GREATEST(0,
    -- Monetary (0-40 points)
    CASE
      WHEN p_total_spent > 1000 THEN 40
      WHEN p_total_spent > 500 THEN 30
      WHEN p_total_spent > 100 THEN 20
      WHEN p_total_spent > 50 THEN 10
      ELSE 5
    END
    +
    -- Recency (0-25 points)
    CASE
      WHEN p_days_since_last_interaction < 2 THEN 25
      WHEN p_days_since_last_interaction < 7 THEN 20
      WHEN p_days_since_last_interaction < 30 THEN 15
      WHEN p_days_since_last_interaction < 90 THEN 5
      ELSE 0
    END
    +
    -- Frequency (0-25 points)
    CASE
      WHEN p_purchases_count > 20 THEN 25
      WHEN p_purchases_count > 10 THEN 20
      WHEN p_purchases_count > 5 THEN 15
      WHEN p_purchases_count > 2 THEN 10
      WHEN p_purchases_count > 0 THEN 5
      ELSE 0
    END
    +
    -- Engagement (0-10 points)
    CASE
      WHEN p_total_interactions > 100 THEN 10
      WHEN p_total_interactions > 50 THEN 8
      WHEN p_total_interactions > 20 THEN 5
      WHEN p_total_interactions > 5 THEN 3
      ELSE 1
    END
  ));
$$;

-- Tier based on score
CREATE OR REPLACE FUNCTION fan_tier_from_score(p_score INTEGER)
RETURNS TEXT LANGUAGE SQL IMMUTABLE AS $$
  SELECT CASE
    WHEN p_score >= 80 THEN 'vip'
    WHEN p_score >= 65 THEN 'whale'
    WHEN p_score >= 40 THEN 'engaged'
    WHEN p_score >= 20 THEN 'warm'
    WHEN p_score > 0 THEN 'cold'
    ELSE 'churned'
  END;
$$;
