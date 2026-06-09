-- ─── Atlas — Scoring v2 ───────────────────────────────────
-- Migration 010: Advanced fan scoring, cron tracking, tier change log

-- ============================================================
-- 1. UPDATE SCORING FUNCTION — full 4-factor model
-- ============================================================
-- Matches the TypeScript scoring engine in lib/atlas/crm/scoring.ts
-- Weight: Purchases (40pts) + Engagement (30pts) + Loyalty (20pts) + Signals (10pts)

CREATE OR REPLACE FUNCTION calculate_fan_score_v2(
  p_total_spent DECIMAL,
  p_purchases_count INTEGER,
  p_last_purchase_days INTEGER,  -- days since last purchase
  p_avg_order_value DECIMAL,
  p_interactions_30d INTEGER,    -- interactions in last 30 days
  p_last_interaction_days INTEGER, -- days since last interaction
  p_active_channels INTEGER,     -- number of channels with identity
  p_days_as_fan INTEGER,         -- days since first_seen
  p_loyalty_streak INTEGER       -- consecutive months with purchase
) RETURNS INTEGER LANGUAGE SQL IMMUTABLE AS $$
  SELECT LEAST(100, GREATEST(0,
    -- Purchases (40 pts)
    CASE
      WHEN p_total_spent > 5000 THEN 15
      WHEN p_total_spent > 1000 THEN 12
      WHEN p_total_spent > 500 THEN 8
      WHEN p_total_spent > 100 THEN 5
      WHEN p_total_spent > 0 THEN 2
      ELSE 0
    END
    +
    CASE
      WHEN p_purchases_count > 50 THEN 10
      WHEN p_purchases_count > 20 THEN 7
      WHEN p_purchases_count > 10 THEN 5
      WHEN p_purchases_count > 3 THEN 3
      WHEN p_purchases_count > 0 THEN 1
      ELSE 0
    END
    +
    CASE
      WHEN p_last_purchase_days < 7 THEN 10
      WHEN p_last_purchase_days < 30 THEN 7
      WHEN p_last_purchase_days < 90 THEN 4
      WHEN p_last_purchase_days < 180 THEN 1
      ELSE 0
    END
    +
    CASE
      WHEN p_avg_order_value > 100 THEN 5
      WHEN p_avg_order_value > 50 THEN 3
      WHEN p_avg_order_value > 20 THEN 1
      ELSE 0
    END
    +
    -- Engagement (30 pts)
    CASE
      WHEN p_interactions_30d > 20 THEN 15
      WHEN p_interactions_30d > 10 THEN 10
      WHEN p_interactions_30d > 5 THEN 6
      WHEN p_interactions_30d > 0 THEN 3
      ELSE 0
    END
    +
    CASE
      WHEN p_last_interaction_days < 3 THEN 10
      WHEN p_last_interaction_days < 7 THEN 7
      WHEN p_last_interaction_days < 14 THEN 4
      WHEN p_last_interaction_days < 30 THEN 1
      ELSE 0
    END
    +
    CASE
      WHEN p_active_channels >= 3 THEN 5
      WHEN p_active_channels >= 2 THEN 3
      WHEN p_active_channels >= 1 THEN 1
      ELSE 0
    END
    +
    -- Loyalty (20 pts)
    CASE
      WHEN p_days_as_fan > 730 THEN 10
      WHEN p_days_as_fan > 365 THEN 8
      WHEN p_days_as_fan > 180 THEN 5
      WHEN p_days_as_fan > 90 THEN 3
      WHEN p_days_as_fan > 30 THEN 1
      ELSE 0
    END
    +
    LEAST(p_loyalty_streak * 2, 10)
  ));
$$;

-- ============================================================
-- 2. UPDATE TIER FUNCTION — churned override + VIP threshold
-- ============================================================

CREATE OR REPLACE FUNCTION fan_tier_from_score_v2(
  p_score INTEGER,
  p_total_spent DECIMAL,
  p_last_interaction_days INTEGER,
  p_purchases_count INTEGER
) RETURNS TEXT LANGUAGE SQL IMMUTABLE AS $$
  SELECT CASE
    -- Churned: no interaction for 90+ days
    WHEN p_last_interaction_days > 90 THEN 'churned'
    -- VIP: top spenders or near-perfect score
    WHEN p_total_spent > 3000 OR p_score >= 90 THEN 'vip'
    -- Whale: high spenders
    WHEN p_total_spent > 1000 OR p_score >= 75 THEN 'whale'
    -- Engaged: active and has purchased
    WHEN p_score >= 50 AND p_purchases_count > 0 THEN 'engaged'
    -- Warm: some activity but no purchase yet
    WHEN p_score >= 30 THEN 'warm'
    ELSE 'cold'
  END;
$$;

-- Drop old functions if they exist
DROP FUNCTION IF EXISTS calculate_fan_score(DECIMAL, INTEGER, INTEGER, INTEGER, BOOLEAN);
DROP FUNCTION IF EXISTS fan_tier_from_score(INTEGER);

-- ============================================================
-- 3. SCORING RUN LOG — track when each fan was last scored
-- ============================================================

ALTER TABLE atlas_fans ADD COLUMN IF NOT EXISTS last_scored_at TIMESTAMPTZ;
ALTER TABLE atlas_fans ADD COLUMN IF NOT EXISTS score_updated_at TIMESTAMPTZ;

-- Index for cron — pick fans that need scoring (null or oldest first)
CREATE INDEX IF NOT EXISTS idx_atlas_fans_score_pending
  ON atlas_fans(last_scored_at NULLS FIRST)
  WHERE status = 'active';
