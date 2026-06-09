-- ============================================================
-- Migration 002 : Credit System — Plans, Credit Usage, Quotas
-- ============================================================

-- 1. Plans table
CREATE TABLE IF NOT EXISTS plans (
  tier TEXT PRIMARY KEY CHECK (tier IN ('free', 'creator', 'premium', 'elite', 'icon')),
  name TEXT NOT NULL,
  price_monthly NUMERIC(6,2) DEFAULT 0,
  credits_monthly INTEGER NOT NULL DEFAULT 0,
  max_daily_generations INTEGER DEFAULT 0,
  priority INTEGER DEFAULT 0,
  has_advanced_models BOOLEAN DEFAULT FALSE,
  has_byok BOOLEAN DEFAULT FALSE,
  history_retention_days INTEGER DEFAULT 30,
  can_buy_addons BOOLEAN DEFAULT FALSE
);

-- Seed plans
INSERT INTO plans (tier, name, price_monthly, credits_monthly, max_daily_generations, priority, has_advanced_models, has_byok, history_retention_days, can_buy_addons) VALUES
  ('free', 'Free', 0, 0, 0, 0, FALSE, FALSE, 0, FALSE),
  ('creator', 'Creator', 0, 5, 5, 1, FALSE, FALSE, 30, TRUE),
  ('premium', 'Premium', 29, 100, 50, 2, TRUE, FALSE, 90, TRUE),
  ('elite', 'Elite', 79, 500, 100, 3, TRUE, TRUE, 180, TRUE),
  ('icon', 'Icon', 199, -1, -1, 4, TRUE, TRUE, 365, FALSE)
ON CONFLICT (tier) DO NOTHING;

-- 2. Credit usage tracking
CREATE TABLE IF NOT EXISTS credit_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  credits_used INTEGER NOT NULL,
  provider TEXT,
  model TEXT,
  cost_estimate NUMERIC(10,6),
  prompt TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  error TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Profile additions
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS generation_suspended BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS credit_reset_at TIMESTAMPTZ;

-- 4. RLS for credit_usage
ALTER TABLE credit_usage ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'credit_usage' AND policyname = 'Users see own credit usage') THEN
    CREATE POLICY "Users see own credit usage" ON credit_usage
      FOR SELECT USING (auth.uid() = creator_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'credit_usage' AND policyname = 'Service can insert credit usage') THEN
    CREATE POLICY "Service can insert credit usage" ON credit_usage
      FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'credit_usage' AND policyname = 'Admin can see all credit usage') THEN
    CREATE POLICY "Admin can see all credit usage" ON credit_usage
      FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_credit_usage_creator ON credit_usage(creator_id);
CREATE INDEX IF NOT EXISTS idx_credit_usage_created ON credit_usage(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_usage_status ON credit_usage(status);
CREATE INDEX IF NOT EXISTS idx_credit_usage_action ON credit_usage(action);

-- 6. Helper function: atomic credit decrement
CREATE OR REPLACE FUNCTION decrement_credits(user_id UUID, amount INT)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_credits INT;
  new_credits INT;
BEGIN
  SELECT credits_ia INTO current_credits FROM profiles WHERE id = user_id;
  IF current_credits IS NULL THEN
    RETURN 0;
  END IF;
  IF current_credits = -1 THEN
    RETURN -1;
  END IF;
  new_credits := GREATEST(0, current_credits - amount);
  UPDATE profiles SET credits_ia = new_credits WHERE id = user_id;
  RETURN new_credits;
END;
$$;
