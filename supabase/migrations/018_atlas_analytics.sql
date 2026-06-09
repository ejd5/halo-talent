-- ─── Atlas Analytics — ROI, attribution, cohortes, insights ──
-- Migration 018: Tables de tracking pour le module analytics

-- ============================================================
-- 1. ATLAS COSTS — Suivi mensuel des coûts
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_analytics_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  month DATE NOT NULL, -- premier jour du mois
  subscription DECIMAL(10,2) DEFAULT 0,
  ai_api_costs DECIMAL(10,2) DEFAULT 0,
  twilio_sms DECIMAL(10,2) DEFAULT 0,
  resend_email DECIMAL(10,2) DEFAULT 0,
  other_costs DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(creator_id, month)
);

ALTER TABLE atlas_analytics_costs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "creator_own_costs" ON atlas_analytics_costs
  FOR ALL USING (creator_id IN (SELECT id FROM profiles WHERE auth.uid() = id));

-- ============================================================
-- 2. ATLAS CONVERSIONS — Attribution des revenus aux actions
-- Permet le tracking multi-touch pour l'attribution
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_analytics_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  fan_id UUID REFERENCES atlas_fans(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES atlas_campaigns(id) ON DELETE SET NULL,
  funnel_id UUID REFERENCES atlas_funnels(id) ON DELETE SET NULL,
  interaction_id UUID REFERENCES atlas_interactions(id) ON DELETE SET NULL,
  channel TEXT NOT NULL CHECK (channel IN ('email','sms','push','dm','funnel','other')),
  revenue DECIMAL(12,2) NOT NULL DEFAULT 0,
  attribution_model TEXT NOT NULL DEFAULT 'last_touch',
  touch_weight DECIMAL(5,4) DEFAULT 1.0,
  converted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_conv_creator ON atlas_analytics_conversions(creator_id, converted_at DESC);
CREATE INDEX idx_analytics_conv_fan ON atlas_analytics_conversions(fan_id);
CREATE INDEX idx_analytics_conv_campaign ON atlas_analytics_conversions(campaign_id);
CREATE INDEX idx_analytics_conv_channel ON atlas_analytics_conversions(channel);

ALTER TABLE atlas_analytics_conversions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "creator_own_conversions" ON atlas_analytics_conversions
  FOR ALL USING (creator_id IN (SELECT id FROM profiles WHERE auth.uid() = id));

-- ============================================================
-- 3. ATLAS COHORT METRICS — Agrégation mensuelle par cohorte
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_analytics_cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  cohort_month DATE NOT NULL, -- mois d'acquisition
  month_offset INTEGER NOT NULL DEFAULT 0, -- mois écoulés depuis l'acquisition
  retained_fans INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  fan_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(creator_id, cohort_month, month_offset)
);

ALTER TABLE atlas_analytics_cohorts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "creator_own_cohorts" ON atlas_analytics_cohorts
  FOR ALL USING (creator_id IN (SELECT id FROM profiles WHERE auth.uid() = id));

-- ============================================================
-- 4. ATLAS WEEKLY REPORTS — Insights automatiques stockés
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_weekly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  summary TEXT,
  top_campaigns JSONB DEFAULT '[]'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  kpi_alerts JSONB DEFAULT '[]'::jsonb,
  ai_generated BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(creator_id, week_start)
);

ALTER TABLE atlas_weekly_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "creator_own_reports" ON atlas_weekly_reports
  FOR ALL USING (creator_id IN (SELECT id FROM profiles WHERE auth.uid() = id));

-- ============================================================
-- 5. FONCTIONS UTILITAIRES
-- ============================================================

-- Calcule le ROI mensuel pour un creator
CREATE OR REPLACE FUNCTION atlas_calculate_roi(
  p_creator_id UUID,
  p_month DATE DEFAULT date_trunc('month', NOW())::DATE
)
RETURNS TABLE (
  total_revenue DECIMAL,
  total_cost DECIMAL,
  roi_percent DECIMAL,
  revenue_by_channel JSONB,
  cost_by_channel JSONB
) LANGUAGE plpgsql STABLE AS $$
DECLARE
  v_start DATE := p_month;
  v_end DATE := (p_month + INTERVAL '1 month')::DATE;
  v_revenue DECIMAL;
  v_cost DECIMAL;
BEGIN
  -- Revenus: tout ce qui est tracké dans conversions pour le mois
  SELECT COALESCE(SUM(revenue), 0) INTO v_revenue
  FROM atlas_analytics_conversions
  WHERE creator_id = p_creator_id
    AND converted_at >= v_start
    AND converted_at < v_end;

  -- Coûts: depuis la table costs
  SELECT COALESCE(subscription + ai_api_costs + twilio_sms + resend_email + other_costs, 0) INTO v_cost
  FROM atlas_analytics_costs
  WHERE creator_id = p_creator_id AND month = p_month;

  total_revenue := v_revenue;
  total_cost := GREATEST(v_cost, 0.01);
  roi_percent := ROUND(((v_revenue - v_cost) / GREATEST(v_cost, 0.01)) * 100, 2);
  cost_by_channel := (
    SELECT COALESCE(jsonb_build_object(
      'subscription', subscription,
      'ai_api', ai_api_costs,
      'twilio', twilio_sms,
      'resend', resend_email,
      'other', other_costs
    ), '{}'::jsonb)
    FROM atlas_analytics_costs
    WHERE creator_id = p_creator_id AND month = p_month
  );
  revenue_by_channel := (
    SELECT COALESCE(jsonb_agg(jsonb_build_object('channel', channel, 'revenue', total))
      FILTER (WHERE channel IS NOT NULL), '[]'::jsonb)
    FROM (
      SELECT channel, SUM(revenue) as total
      FROM atlas_analytics_conversions
      WHERE creator_id = p_creator_id
        AND converted_at >= v_start
        AND converted_at < v_end
      GROUP BY channel
    ) sub
  );

  RETURN NEXT;
END;
$$;

-- Agrège les données overview pour un creator
CREATE OR REPLACE FUNCTION atlas_overview_stats(p_creator_id UUID)
RETURNS TABLE (
  total_fans INTEGER,
  active_fans INTEGER,
  total_revenue DECIMAL,
  total_cost DECIMAL,
  roi_value DECIMAL,
  avg_ltv DECIMAL,
  new_fans_30d INTEGER,
  churn_rate DECIMAL,
  revenue_12m JSONB,
  ai_insight TEXT
) LANGUAGE plpgsql STABLE AS $$
DECLARE
  v_now DATE := CURRENT_DATE;
  v_30d_ago TIMESTAMPTZ := v_now - INTERVAL '30 days';
  v_12m_ago TIMESTAMPTZ := v_now - INTERVAL '12 months';
BEGIN
  -- Fans stats
  SELECT COUNT(*)::INTEGER INTO total_fans
  FROM atlas_fans WHERE creator_id = p_creator_id AND status = 'active';

  SELECT COUNT(*)::INTEGER INTO active_fans
  FROM atlas_fans WHERE creator_id = p_creator_id
  AND status = 'active'
  AND last_interaction_at >= v_30d_ago;

  -- Nouveaux fans (30 jours)
  SELECT COUNT(*)::INTEGER INTO new_fans_30d
  FROM atlas_fans WHERE creator_id = p_creator_id
  AND acquired_at >= v_30d_ago;

  -- Churn rate: fans perdus / total début de mois
  SELECT ROUND(
    COUNT(*) FILTER (WHERE status = 'churned' AND updated_at >= v_30d_ago)::DECIMAL
    / GREATEST(COUNT(*), 1) * 100, 1
  ) INTO churn_rate
  FROM atlas_fans WHERE creator_id = p_creator_id;

  -- Revenus totaux depuis conversions
  SELECT COALESCE(SUM(revenue), 0) INTO total_revenue
  FROM atlas_analytics_conversions
  WHERE creator_id = p_creator_id;

  -- Coûts totaux
  SELECT COALESCE(SUM(subscription + ai_api_costs + twilio_sms + resend_email + other_costs), 0)
  INTO total_cost
  FROM atlas_analytics_costs
  WHERE creator_id = p_creator_id;

  roi_value := CASE WHEN total_cost > 0
    THEN ROUND((total_revenue - total_cost) / total_cost * 100, 1)
    ELSE 0 END;

  -- LTV moyen
  SELECT COALESCE(ROUND(AVG(lifetime_value), 2), 0) INTO avg_ltv
  FROM atlas_fans WHERE creator_id = p_creator_id AND status = 'active';

  -- Revenus 12 mois par mois
  revenue_12m := (
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
      'month', TO_CHAR(month, 'YYYY-MM'),
      'revenue', COALESCE(SUM(revenue), 0)
    ) ORDER BY month), '[]'::jsonb)
    FROM (
      SELECT date_trunc('month', converted_at)::DATE as month, SUM(revenue) as revenue
      FROM atlas_analytics_conversions
      WHERE creator_id = p_creator_id AND converted_at >= v_12m_ago
      GROUP BY date_trunc('month', converted_at)
    ) sub
  );

  -- Insight IA textuelle simple
  ai_insight := 'Analyse en cours...';

  RETURN NEXT;
END;
$$;
