-- ============================================================
-- Studio Migration : subscription_tier + dna_completed
-- ============================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free'
  CHECK (subscription_tier IN ('free', 'creator', 'premium', 'elite', 'icon'));

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dna_completed BOOLEAN DEFAULT FALSE;
