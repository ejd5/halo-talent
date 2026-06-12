-- Migration: Halo Sovereign Chat AI — Foundations
-- Tables, enums, indexes, RLS for the Chat AI module
-- Prompt 1: Types + Data model

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE chat_ai_mode AS ENUM ('copilot_only', 'assisted_sales', 'agency', 'elite');
CREATE TYPE disclosure_mode AS ENUM ('private_copilot', 'team_assisted', 'disclosed_assistant', 'platform_restricted');
CREATE TYPE fan_status AS ENUM ('new', 'active', 'vip', 'whale', 'dormant', 'churn_risk', 'do_not_contact');
CREATE TYPE message_direction AS ENUM ('in', 'out');
CREATE TYPE message_source AS ENUM ('fan', 'human', 'ai_draft_approved');
CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE compliance_status AS ENUM ('ok', 'needs_review', 'blocked');
CREATE TYPE followup_type AS ENUM ('welcome', 'discovery', 'inactive', 'vip_checkin', 'ppv_interest', 'renewal', 'thank_you', 'soft_upsell', 'reactivation');
CREATE TYPE followup_status AS ENUM ('draft', 'pending_approval', 'approved', 'paused');
CREATE TYPE qa_reason AS ENUM ('risky_message', 'off_tone', 'excessive_pressure', 'duplicate_content', 'vulnerable_fan', 'missing_disclosure', 'unauthorized_promise', 'inconsistent_price');
CREATE TYPE qa_status AS ENUM ('pending', 'approved', 'revised', 'blocked', 'escalated', 'false_positive');
CREATE TYPE vault_sensitivity AS ENUM ('standard', 'sensitive');
CREATE TYPE vault_type AS ENUM ('photo', 'video', 'audio', 'bundle');

-- ============================================================
-- TABLE 1: chat_ai_playbooks (no FK deps, created first)
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_ai_playbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(100) NOT NULL,
  global_tone VARCHAR(100) NOT NULL DEFAULT 'warm_professional',
  allowed_words TEXT[] DEFAULT '{}',
  forbidden_words TEXT[] DEFAULT '{}',
  emoji_policy VARCHAR(50) DEFAULT 'moderate',
  signature_phrases TEXT[] DEFAULT '{}',
  boundaries TEXT[] DEFAULT '{}',
  forbidden_topics TEXT[] DEFAULT '{}',
  boldness_level INT CHECK (boldness_level BETWEEN 1 AND 5) DEFAULT 3,
  ppv_min_price DECIMAL(10,2) DEFAULT 5,
  ppv_max_price DECIMAL(10,2) DEFAULT 200,
  vip_rules JSONB DEFAULT '{}',
  dormant_rules JSONB DEFAULT '{}',
  custom_request_rules JSONB DEFAULT '{}',
  escalation_rules JSONB DEFAULT '{}',
  no_contact_rules JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT false
);

CREATE INDEX idx_cap_user ON chat_ai_playbooks (user_id, is_active);

-- ============================================================
-- TABLE 2: chat_ai_fans
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_ai_fans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pseudonym VARCHAR(100) NOT NULL,
  platform VARCHAR(50) NOT NULL DEFAULT 'onlyfans',
  country VARCHAR(10) DEFAULT 'FR',
  language VARCHAR(10) DEFAULT 'fr',
  status fan_status NOT NULL DEFAULT 'new',

  -- Financial
  ltv DECIMAL(10,2) DEFAULT 0,
  total_spend DECIMAL(10,2) DEFAULT 0,
  spend_7d DECIMAL(10,2) DEFAULT 0,
  spend_30d DECIMAL(10,2) DEFAULT 0,

  -- Scores
  sentiment FLOAT CHECK (sentiment BETWEEN -1 AND 1) DEFAULT 0,
  relationship_score INT CHECK (relationship_score BETWEEN 0 AND 100) DEFAULT 50,
  commercial_score INT CHECK (commercial_score BETWEEN 0 AND 100) DEFAULT 30,
  churn_risk INT CHECK (churn_risk BETWEEN 0 AND 100) DEFAULT 0,
  intent_score INT CHECK (intent_score BETWEEN 0 AND 100) DEFAULT 0,

  -- Arrays
  purchase_history JSONB DEFAULT '[]',
  content_sent_ids UUID[] DEFAULT '{}',
  preferences TEXT[] DEFAULT '{}',
  avoid_topics TEXT[] DEFAULT '{}',
  risk_flags TEXT[] DEFAULT '{}',

  -- Meta
  notes TEXT,
  assigned_chatter_id UUID,
  last_message_at TIMESTAMPTZ,
  last_purchase_at TIMESTAMPTZ
);

CREATE INDEX idx_caf_user ON chat_ai_fans (user_id);
CREATE INDEX idx_caf_status ON chat_ai_fans (user_id, status);
CREATE INDEX idx_caf_platform ON chat_ai_fans (user_id, platform);
CREATE INDEX idx_caf_churn ON chat_ai_fans (user_id, churn_risk DESC);

-- ============================================================
-- TABLE 3: chat_ai_conversations
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  fan_id UUID REFERENCES chat_ai_fans(id) ON DELETE SET NULL,
  platform VARCHAR(50) NOT NULL DEFAULT 'onlyfans',

  priority_score INT DEFAULT 0,
  last_message_preview TEXT,
  unread INT DEFAULT 0,

  recommended_action VARCHAR(100),
  recommended_ppv_id UUID,
  vault_warnings JSONB DEFAULT '[]',
  compliance_flags JSONB DEFAULT '[]',

  status VARCHAR(50) NOT NULL DEFAULT 'open'
);

CREATE INDEX idx_cac_user ON chat_ai_conversations (user_id, status);
CREATE INDEX idx_cac_fan ON chat_ai_conversations (fan_id);
CREATE INDEX idx_cac_priority ON chat_ai_conversations (user_id, priority_score DESC);

-- ============================================================
-- TABLE 4: chat_ai_messages
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  conversation_id UUID REFERENCES chat_ai_conversations(id) ON DELETE CASCADE NOT NULL,
  direction message_direction NOT NULL,
  text TEXT NOT NULL,
  source message_source NOT NULL DEFAULT 'fan',

  approved_by UUID REFERENCES auth.users(id),
  ai_meta JSONB DEFAULT '{}',

  -- Ordering within conversation
  seq INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_cam_conv ON chat_ai_messages (conversation_id, seq);

-- ============================================================
-- TABLE 5: chat_ai_drafts
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_ai_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  conversation_id UUID REFERENCES chat_ai_conversations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  text TEXT NOT NULL,
  objective VARCHAR(100),
  tone VARCHAR(50),
  context_sources JSONB DEFAULT '[]',

  risk_level risk_level NOT NULL DEFAULT 'low',
  compliance_status compliance_status NOT NULL DEFAULT 'needs_review',
  requires_validation BOOLEAN NOT NULL DEFAULT true,

  model VARCHAR(50) NOT NULL DEFAULT 'deepseek-v4-flash',
  explanation TEXT,

  -- Status tracking
  status VARCHAR(50) NOT NULL DEFAULT 'draft'
  -- 'draft' | 'reviewed' | 'approved' | 'copied' | 'blocked' | 'escalated'
);

CREATE INDEX idx_cad_conv ON chat_ai_drafts (conversation_id);
CREATE INDEX idx_cad_user ON chat_ai_drafts (user_id, status);

-- ============================================================
-- TABLE 6: chat_ai_vault_assets
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_ai_vault_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(200) NOT NULL,
  type vault_type NOT NULL DEFAULT 'photo',
  sensitivity vault_sensitivity NOT NULL DEFAULT 'standard',

  price_history JSONB DEFAULT '[]',
  sold_to_fan_ids UUID[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_cava_user ON chat_ai_vault_assets (user_id);

-- ============================================================
-- TABLE 7: chat_ai_ppv_recommendations
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_ai_ppv_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vault_asset_id UUID REFERENCES chat_ai_vault_assets(id) ON DELETE SET NULL,

  target_fan_ids UUID[] DEFAULT '{}',
  segment_id UUID,

  recommended_price DECIMAL(10,2) NOT NULL,
  min_price DECIMAL(10,2) NOT NULL,
  max_price DECIMAL(10,2) NOT NULL,

  justification TEXT,
  fatigue_risk TEXT,
  already_sold_to UUID[] DEFAULT '{}',
  conversion_estimate VARCHAR(200),

  status VARCHAR(50) NOT NULL DEFAULT 'draft'
);

CREATE INDEX idx_capr_user ON chat_ai_ppv_recommendations (user_id, status);

-- ============================================================
-- TABLE 8: chat_ai_followups
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_ai_followups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type followup_type NOT NULL,
  segment_id UUID,
  objective TEXT,
  delay_hours INT DEFAULT 24,
  draft_text TEXT,

  risk_level risk_level NOT NULL DEFAULT 'low',
  status followup_status NOT NULL DEFAULT 'draft',
  human_approval_required BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_cafu_user ON chat_ai_followups (user_id, status);

-- ============================================================
-- TABLE 9: chat_ai_qa_items
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_ai_qa_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message_id UUID REFERENCES chat_ai_messages(id) ON DELETE SET NULL,
  draft_id UUID REFERENCES chat_ai_drafts(id) ON DELETE SET NULL,

  reason qa_reason NOT NULL,
  severity INT CHECK (severity BETWEEN 1 AND 5) DEFAULT 3,
  status qa_status NOT NULL DEFAULT 'pending',
  reviewer_id UUID REFERENCES auth.users(id),

  notes TEXT
);

CREATE INDEX idx_caqa_user ON chat_ai_qa_items (user_id, status);
CREATE INDEX idx_caqa_reason ON chat_ai_qa_items (user_id, reason);

-- ============================================================
-- TABLE 10: chat_ai_consent_checklists
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_ai_consent_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  version INT NOT NULL DEFAULT 1,

  -- 11 consent items
  item_1_authorized BOOLEAN DEFAULT false,
  item_2_platform_rules BOOLEAN DEFAULT false,
  item_3_ia_limitations BOOLEAN DEFAULT false,
  item_4_no_guarantee BOOLEAN DEFAULT false,
  item_5_no_revenue_guarantee BOOLEAN DEFAULT false,
  item_6_human_approval BOOLEAN DEFAULT false,
  item_7_disclosure BOOLEAN DEFAULT false,
  item_8_boundaries BOOLEAN DEFAULT false,
  item_9_audit_logged BOOLEAN DEFAULT false,
  item_10_can_disable BOOLEAN DEFAULT false,
  item_11_legal_info_only BOOLEAN DEFAULT false,

  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_cacc_user ON chat_ai_consent_checklists (user_id, version);
CREATE UNIQUE INDEX idx_cacc_user_version ON chat_ai_consent_checklists (user_id, version);

-- ============================================================
-- TABLE 11: chat_ai_user_config
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_ai_user_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  mode chat_ai_mode NOT NULL DEFAULT 'copilot_only',
  disclosure disclosure_mode NOT NULL DEFAULT 'private_copilot',
  platforms VARCHAR(50)[] DEFAULT '{}',
  active_playbook_id UUID REFERENCES chat_ai_playbooks(id) ON DELETE SET NULL,

  is_paused BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT false,
  demo_mode BOOLEAN DEFAULT true,

  -- Setup wizard progress (0-12)
  wizard_step INT DEFAULT 0,
  wizard_completed BOOLEAN DEFAULT false,

  -- Config
  cooldown_minutes INT DEFAULT 60,
  max_daily_drafts INT DEFAULT 50,
  plan VARCHAR(50) DEFAULT 'starter',

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_cauc_user ON chat_ai_user_config (user_id);

-- ============================================================
-- TABLE 12: chat_ai_audit_logs
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_ai_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  actor_id UUID,
  actor_type VARCHAR(20) NOT NULL DEFAULT 'system',

  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50),
  target_id UUID,

  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_caal_user ON chat_ai_audit_logs (user_id, created_at DESC);
CREATE INDEX idx_caal_action ON chat_ai_audit_logs (action);

-- ============================================================
-- TABLE 13: chat_ai_tracking_events
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_ai_tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  payload JSONB DEFAULT '{}',
  session_id VARCHAR(100)
);

CREATE INDEX idx_cate_user ON chat_ai_tracking_events (user_id, created_at DESC);
CREATE INDEX idx_cate_name ON chat_ai_tracking_events (name);

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Playbooks
ALTER TABLE chat_ai_playbooks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own playbooks" ON chat_ai_playbooks
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Fans
ALTER TABLE chat_ai_fans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own fans" ON chat_ai_fans
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Conversations
ALTER TABLE chat_ai_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own conversations" ON chat_ai_conversations
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Messages
ALTER TABLE chat_ai_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see conv messages" ON chat_ai_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM chat_ai_conversations WHERE id = conversation_id AND user_id = auth.uid())
  );
CREATE POLICY "Users insert conv messages" ON chat_ai_messages
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM chat_ai_conversations WHERE id = conversation_id AND user_id = auth.uid())
  );

-- Drafts
ALTER TABLE chat_ai_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own drafts" ON chat_ai_drafts
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Vault
ALTER TABLE chat_ai_vault_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own vault" ON chat_ai_vault_assets
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- PPV
ALTER TABLE chat_ai_ppv_recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own PPV" ON chat_ai_ppv_recommendations
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Followups
ALTER TABLE chat_ai_followups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own followups" ON chat_ai_followups
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- QA
ALTER TABLE chat_ai_qa_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own QA" ON chat_ai_qa_items
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users update own QA" ON chat_ai_qa_items
  FOR UPDATE USING (user_id = auth.uid());

-- Consent
ALTER TABLE chat_ai_consent_checklists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own consent" ON chat_ai_consent_checklists
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- User config
ALTER TABLE chat_ai_user_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own config" ON chat_ai_user_config
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Audit logs
ALTER TABLE chat_ai_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own audit" ON chat_ai_audit_logs
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System inserts audit" ON chat_ai_audit_logs
  FOR INSERT WITH CHECK (true);

-- Tracking
ALTER TABLE chat_ai_tracking_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own tracking" ON chat_ai_tracking_events
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System inserts tracking" ON chat_ai_tracking_events
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- ADMIN POLICIES (using profiles role check)
-- ============================================================
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename LIKE 'chat_ai_%'
  LOOP
    EXECUTE format('
      CREATE POLICY "Admin full access" ON %I
        FOR ALL USING (
          EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN (''admin'', ''manager''))
        )
    ', t);
  END LOOP;
END $$;

NOTIFY pgrst, 'reload schema';
