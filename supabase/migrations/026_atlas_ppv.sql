-- ─── PPV Analytics — Tracking granular des contenus premium ───
-- Migration 026: Produits PPV, scripts, envois, unlocks, A/B tests

CREATE TABLE atlas_ppv_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration_seconds INTEGER,
  tags TEXT[],
  category TEXT,
  total_sends INTEGER DEFAULT 0,
  total_unlocks INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE atlas_ppv_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT,
  script_text TEXT NOT NULL,
  target_segment_type TEXT,
  uses_count INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  avg_unlock_rate DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE atlas_ppv_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES atlas_ppv_products(id),
  fan_id UUID REFERENCES atlas_fans(id),
  script_id UUID REFERENCES atlas_ppv_scripts(id),
  script_used_text TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMPTZ,
  time_to_unlock_seconds INTEGER,
  unlock_revenue DECIMAL(10,2),
  platform TEXT,
  ab_test_id UUID
);

CREATE INDEX idx_ppv_sends_creator ON atlas_ppv_sends(creator_id);
CREATE INDEX idx_ppv_sends_unlocked ON atlas_ppv_sends(unlocked, unlocked_at);
CREATE INDEX idx_ppv_sends_product ON atlas_ppv_sends(product_id);
CREATE INDEX idx_ppv_sends_fan ON atlas_ppv_sends(fan_id);

CREATE TABLE atlas_ppv_ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES atlas_ppv_products(id),
  name TEXT,
  variant_a_script_id UUID REFERENCES atlas_ppv_scripts(id),
  variant_b_script_id UUID REFERENCES atlas_ppv_scripts(id),
  segment_id UUID REFERENCES atlas_segments(id),
  split_ratio DECIMAL(3,2) DEFAULT 0.50,
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'cancelled')),
  winner_variant TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

ALTER TABLE atlas_ppv_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_ppv_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_ppv_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_ppv_ab_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creator owns ppv" ON atlas_ppv_products FOR ALL USING (auth.uid() = creator_id);
CREATE POLICY "Creator owns scripts" ON atlas_ppv_scripts FOR ALL USING (auth.uid() = creator_id);
CREATE POLICY "Creator owns sends" ON atlas_ppv_sends FOR ALL USING (auth.uid() = creator_id);
CREATE POLICY "Creator owns abtests" ON atlas_ppv_ab_tests FOR ALL USING (auth.uid() = creator_id);
