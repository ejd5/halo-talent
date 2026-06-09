-- ═══════════════════════════════════════════════════════════════
-- Migration 005: Subscription Tiers & Wallet System
-- ═══════════════════════════════════════════════════════════════

-- 1. Subscription Tiers (seed data, remplace les plans hardcodés)
CREATE TABLE IF NOT EXISTS subscription_tiers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  monthly_price_eur DECIMAL(10,2) DEFAULT 0,
  yearly_price_eur DECIMAL(10,2) DEFAULT 0,
  monthly_credits INTEGER DEFAULT 0,
  features JSONB DEFAULT '{}'
);

INSERT INTO subscription_tiers (id, name, monthly_price_eur, yearly_price_eur, monthly_credits, features) VALUES
  ('free', 'Découverte', 0, 0, 50, '{"max_platforms": 2, "video_generation": false, "voice_cloning": false}'),
  ('starter', 'Starter', 19, 190, 500, '{"max_platforms": 4, "video_generation": "draft_only", "voice_cloning": false}'),
  ('premium', 'Premium', 49, 490, 2000, '{"max_platforms": "unlimited", "video_generation": "standard", "voice_cloning": true}'),
  ('elite', 'Elite', 149, 1490, 7000, '{"max_platforms": "unlimited", "video_generation": "premium", "voice_cloning": true, "byok": true}'),
  ('icon', 'Icon', null, null, null, '{"unlimited": true, "byok": true, "dedicated_support": true}')
ON CONFLICT (id) DO NOTHING;

-- 2. Credits Wallet (1 ligne par user)
CREATE TABLE IF NOT EXISTS credits_wallet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  current_balance INTEGER NOT NULL DEFAULT 0,
  monthly_quota INTEGER NOT NULL DEFAULT 0,
  reset_at TIMESTAMPTZ,
  total_purchased INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Transactions log
CREATE TABLE IF NOT EXISTS credits_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('grant', 'purchase', 'deduct', 'refund', 'bonus')),
  amount INTEGER NOT NULL,
  reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_credits_wallet_user ON credits_wallet(user_id);
CREATE INDEX IF NOT EXISTS idx_credits_transactions_user ON credits_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credits_transactions_date ON credits_transactions(created_at DESC);

-- 4. User API keys for BYOK
CREATE TABLE IF NOT EXISTS user_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  anthropic_key TEXT,
  replicate_key TEXT,
  runway_key TEXT,
  elevenlabs_key TEXT,
  openai_key TEXT,
  huggingface_key TEXT,
  byok_enabled_for TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. RPC: Deduct credits atomically
CREATE OR REPLACE FUNCTION deduct_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_reason TEXT DEFAULT 'generation'
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_balance INTEGER;
BEGIN
  SELECT current_balance INTO v_balance
  FROM credits_wallet
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'wallet_not_found';
  END IF;

  IF v_balance < p_amount THEN
    RAISE EXCEPTION 'insufficient_credits';
  END IF;

  UPDATE credits_wallet
  SET current_balance = current_balance - p_amount
  WHERE user_id = p_user_id
  RETURNING current_balance INTO v_balance;

  INSERT INTO credits_transactions (user_id, type, amount, reason)
  VALUES (p_user_id, 'deduct', -p_amount, p_reason);

  RETURN v_balance;
END;
$$;

-- 6. RPC: Grant credits (used by monthly cron)
CREATE OR REPLACE FUNCTION grant_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_monthly_quota INTEGER,
  p_reset_at TIMESTAMPTZ,
  p_reason TEXT DEFAULT 'monthly_grant'
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_balance INTEGER;
BEGIN
  INSERT INTO credits_wallet (user_id, current_balance, monthly_quota, reset_at)
  VALUES (p_user_id, p_amount, p_monthly_quota, p_reset_at)
  ON CONFLICT (user_id) DO UPDATE
  SET current_balance = p_amount,
      monthly_quota = p_monthly_quota,
      reset_at = p_reset_at
  RETURNING current_balance INTO v_balance;

  INSERT INTO credits_transactions (user_id, type, amount, reason)
  VALUES (p_user_id, 'grant', p_amount, p_reason);

  RETURN v_balance;
END;
$$;

-- 7. RPC: Add purchased credits
CREATE OR REPLACE FUNCTION add_purchased_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_stripe_session_id TEXT DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_balance INTEGER;
BEGIN
  INSERT INTO credits_wallet (user_id, current_balance, total_purchased)
  VALUES (p_user_id, p_amount, p_amount)
  ON CONFLICT (user_id) DO UPDATE
  SET current_balance = credits_wallet.current_balance + p_amount,
      total_purchased = credits_wallet.total_purchased + p_amount
  RETURNING current_balance INTO v_balance;

  INSERT INTO credits_transactions (user_id, type, amount, reason, metadata)
  VALUES (
    p_user_id,
    'purchase',
    p_amount,
    'credit_pack_purchase',
    jsonb_build_object('stripe_session_id', p_stripe_session_id)
  );

  RETURN v_balance;
END;
$$;

-- 8. RLS
ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits_wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;

-- Everyone can view tiers
CREATE POLICY "Tiers are public" ON subscription_tiers FOR SELECT USING (true);

-- Users can only see their own wallet & transactions
CREATE POLICY "Users own wallet" ON credits_wallet FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own transactions" ON credits_transactions FOR SELECT USING (auth.uid() = user_id);

-- Users can manage their own API keys
CREATE POLICY "Users own api keys" ON user_api_keys FOR ALL USING (auth.uid() = user_id);

-- Admin can see all
CREATE POLICY "Admin all wallet" ON credits_wallet FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin all transactions" ON credits_transactions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin all api keys" ON user_api_keys FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
