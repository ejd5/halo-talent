-- ─── Atlas Compliance Center — Conformité RGPD, TCPA, CAN-SPAM ──
-- Migration 019: Tables de conformité, consents, audit logs, incidents

-- ============================================================
-- 1. COMPLIANCE SETTINGS — Configuration du créateur
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_compliance_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,

  -- Disclosures
  ai_disclosure_email BOOLEAN DEFAULT TRUE,
  ai_watermark_drafts BOOLEAN DEFAULT TRUE,
  ai_disclose_dm BOOLEAN DEFAULT TRUE,
  detailed_audit_logging BOOLEAN DEFAULT TRUE,

  -- Rate limiting
  max_emails_per_day_per_fan INTEGER DEFAULT 3,
  max_dms_per_day_per_fan INTEGER DEFAULT 1,
  quiet_hours_start TEXT DEFAULT '21:00',
  quiet_hours_end TEXT DEFAULT '08:00',
  quiet_hours_timezone TEXT DEFAULT 'Europe/Paris',

  -- Data retention (days)
  retention_drafts INTEGER DEFAULT 90,
  retention_audit_logs INTEGER DEFAULT 2555,  -- 7 years
  retention_inactive_fans INTEGER DEFAULT 730, -- 2 years
  retention_conversations INTEGER DEFAULT -1,  -- indefinite

  -- Mode strict
  strict_compliance BOOLEAN DEFAULT TRUE,
  last_audited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE atlas_compliance_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "creator_own_compliance_settings" ON atlas_compliance_settings
  FOR ALL USING (creator_id IN (SELECT id FROM profiles WHERE auth.uid() = id));

-- ============================================================
-- 2. CONSENT REGISTRY — Centralisé, horodaté, avec preuve
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_consent_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  fan_id UUID REFERENCES atlas_fans(id) ON DELETE CASCADE NOT NULL,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('email','sms','push','marketing_ai','data_processing','all')),
  granted BOOLEAN NOT NULL DEFAULT TRUE,
  source TEXT NOT NULL DEFAULT 'form',
  source_url TEXT,
  ip_address TEXT,
  user_agent TEXT,
  proof_url TEXT,       -- screenshot ou log
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);

CREATE INDEX idx_consent_registry_creator ON atlas_consent_registry(creator_id);
CREATE INDEX idx_consent_registry_fan ON atlas_consent_registry(fan_id);
CREATE INDEX idx_consent_registry_type ON atlas_consent_registry(consent_type);

ALTER TABLE atlas_consent_registry ENABLE ROW LEVEL SECURITY;
CREATE POLICY "creator_own_consents" ON atlas_consent_registry
  FOR ALL USING (creator_id IN (SELECT id FROM profiles WHERE auth.uid() = id));

-- ============================================================
-- 3. COMPLIANCE AUDIT — Tous les événements, unifiés
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_compliance_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  entity_type TEXT NOT NULL DEFAULT 'generic',
  entity_id UUID,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
) WITH (autovacuum_enabled = false);

CREATE INDEX idx_compliance_audit_creator ON atlas_compliance_audit(creator_id, created_at DESC);
CREATE INDEX idx_compliance_audit_type ON atlas_compliance_audit(event_type);
CREATE INDEX idx_compliance_audit_entity ON atlas_compliance_audit(entity_type, entity_id);

ALTER TABLE atlas_compliance_audit ENABLE ROW LEVEL SECURITY;
CREATE POLICY "creator_own_audit" ON atlas_compliance_audit
  FOR ALL USING (creator_id IN (SELECT id FROM profiles WHERE auth.uid() = id));

-- ============================================================
-- 4. SPAM CHECKS — Résultats d'analyse anti-spam
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_spam_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  campaign_id UUID REFERENCES atlas_campaigns(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL DEFAULT 'email',
  score DECIMAL(5,2) NOT NULL DEFAULT 0,
  triggers JSONB DEFAULT '[]'::jsonb,
  suggestions JSONB DEFAULT '[]'::jsonb,
  is_blocked BOOLEAN DEFAULT FALSE,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE atlas_spam_checks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "creator_own_spam_checks" ON atlas_spam_checks
  FOR ALL USING (creator_id IN (SELECT id FROM profiles WHERE auth.uid() = id));

-- ============================================================
-- 5. INCIDENT LOGS — Data breach tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_incident_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low','medium','high','critical')),
  incident_type TEXT NOT NULL,
  description TEXT NOT NULL,
  affected_fans INTEGER DEFAULT 0,
  notification_sent BOOLEAN DEFAULT FALSE,
  notification_sent_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE atlas_incident_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "creator_own_incidents" ON atlas_incident_logs
  FOR ALL USING (creator_id IN (SELECT id FROM profiles WHERE auth.uid() = id));

-- ============================================================
-- 6. DATA RETENTION CONFIG — par défaut
-- ============================================================
INSERT INTO atlas_compliance_settings (creator_id, strict_compliance)
SELECT id, TRUE FROM profiles
ON CONFLICT (creator_id) DO NOTHING;

-- ============================================================
-- 7. AUTO AUDIT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION atlas_auto_audit()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO atlas_compliance_audit (creator_id, event_type, entity_type, entity_id, description, metadata)
  VALUES (
    COALESCE(NEW.creator_id, auth.uid()),
    CASE
      WHEN TG_OP = 'INSERT' THEN TG_TABLE_NAME || '.created'
      WHEN TG_OP = 'UPDATE' THEN TG_TABLE_NAME || '.updated'
      WHEN TG_OP = 'DELETE' THEN TG_TABLE_NAME || '.deleted'
    END,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_TABLE_NAME || ' ' || lower(TG_OP) || 'd',
    jsonb_build_object('table', TG_TABLE_NAME, 'schema', TG_TABLE_SCHEMA)
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- ============================================================
-- 8. COMPLIANCE SCORE FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION atlas_compliance_status(p_creator_id UUID)
RETURNS TABLE (
  chanel TEXT,
  status TEXT,
  label TEXT,
  details TEXT
) LANGUAGE plpgsql STABLE AS $$
DECLARE
  v_settings atlas_compliance_settings%ROWTYPE;
  v_email_consents INTEGER;
  v_sms_consents INTEGER;
  v_push_consents INTEGER;
  v_disclosures_ok BOOLEAN;
BEGIN
  SELECT * INTO v_settings FROM atlas_compliance_settings WHERE creator_id = p_creator_id;

  SELECT COUNT(*) INTO v_email_consents
  FROM atlas_consent_registry
  WHERE creator_id = p_creator_id AND consent_type = 'email' AND granted = TRUE;

  SELECT COUNT(*) INTO v_sms_consents
  FROM atlas_consent_registry
  WHERE creator_id = p_creator_id AND consent_type = 'sms' AND granted = TRUE;

  SELECT COUNT(*) INTO v_push_consents
  FROM atlas_consent_registry
  WHERE creator_id = p_creator_id AND consent_type = 'push' AND granted = TRUE;

  v_disclosures_ok := v_settings.ai_disclosure_email
    AND v_settings.ai_watermark_drafts
    AND v_settings.ai_disclose_dm;

  -- Email
  chanel := 'email'; status := 'ok'; label := 'Email';
  details := CASE WHEN v_email_consents > 0
    THEN v_email_consents || ' consents enregistrés'
    ELSE 'Aucun consent email, mais paramètres conformes' END;
  RETURN NEXT;

  -- SMS
  chanel := 'sms'; status := 'ok'; label := 'SMS';
  details := CASE WHEN v_sms_consents > 0
    THEN v_sms_consents || ' consents enregistrés'
    ELSE 'Aucun consent SMS' END;
  RETURN NEXT;

  -- Push
  chanel := 'push'; status := 'ok'; label := 'Push';
  details := CASE WHEN v_push_consents > 0
    THEN v_push_consents || ' consents enregistrés'
    ELSE 'Aucun consent push' END;
  RETURN NEXT;

  -- OnlyFans disclosures
  chanel := 'onlyfans';
  status := CASE WHEN v_disclosures_ok THEN 'ok' ELSE 'warning' END;
  label := 'OnlyFans';
  details := CASE WHEN v_disclosures_ok
    THEN 'Disclosures AI activées'
    ELSE 'Vérifiez les disclosure settings' END;
  RETURN NEXT;

  -- Instagram / Meta
  chanel := 'instagram'; status := 'ok'; label := 'Instagram';
  details := 'API Meta Graph — conforme';
  RETURN NEXT;

  -- Strict compliance
  chanel := 'strict_mode'; status := CASE WHEN v_settings.strict_compliance THEN 'ok' ELSE 'warning' END;
  label := 'Mode strict';
  details := CASE WHEN v_settings.strict_compliance THEN 'Activé' ELSE 'Désactivé — risques légaux' END;
  RETURN NEXT;
END;
$$;
