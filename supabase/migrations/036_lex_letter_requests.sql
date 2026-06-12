-- Migration: Halo Lex — Letter requests, notifications & feedback
-- Tables pour le workflow de rédaction manuelle des lettres juridiques
-- (Prompt 32I + 32J)

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE letter_status AS ENUM (
  'received', 'awaiting_info', 'in_progress', 'pending_validation',
  'delivered', 'refused'
);

CREATE TYPE letter_complexity AS ENUM ('standard', 'complex');
CREATE TYPE letter_priority AS ENUM ('standard', 'express');

-- ============================================================
-- TABLE 1: letter_requests
-- ============================================================
CREATE TABLE IF NOT EXISTS letter_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Qui
  user_id UUID REFERENCES auth.users(id) NOT NULL,

  -- Type de lettre
  letter_type VARCHAR(100) NOT NULL,
  complexity letter_complexity NOT NULL DEFAULT 'standard',
  priority letter_priority NOT NULL DEFAULT 'standard',

  -- Contexte (recueilli par Lex Express + questionnaire)
  brief TEXT NOT NULL,                             -- Synthèse générée par Lex
  user_context JSONB DEFAULT '{}',                 -- Profil, plateformes, infos créateur
  attachments JSONB DEFAULT '[]',                  -- [{name, url, type}] fichiers uploadés
  language VARCHAR(10) NOT NULL DEFAULT 'fr',
  tone VARCHAR(50),                                -- Ton souhaité
  target_platform VARCHAR(100),                    -- Plateforme concernée (OF, Fansly, etc.)

  -- Workflow
  status letter_status NOT NULL DEFAULT 'received',
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deadline_at TIMESTAMPTZ NOT NULL,
  started_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,

  -- Document final
  document_content TEXT,                            -- Texte complet du document
  document_pdf_url VARCHAR(500),                    -- URL du PDF généré

  -- Liens
  questionnaire_id UUID REFERENCES lex_questionnaires(id) ON DELETE SET NULL,

  -- Admin
  admin_notes TEXT,
  time_spent_minutes INTEGER,

  -- Facturation / Quota
  is_within_quota BOOLEAN NOT NULL DEFAULT TRUE,
  amount_charged DECIMAL(10,2) DEFAULT 0,
  stripe_payment_id VARCHAR(100),

  -- Suivi post-livraison
  followup_3d_sent BOOLEAN DEFAULT FALSE,
  followup_7d_sent BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_lr_status ON letter_requests (status, deadline_at);
CREATE INDEX idx_lr_user ON letter_requests (user_id);
CREATE INDEX idx_lr_priority ON letter_requests (priority) WHERE status = 'received';
CREATE INDEX idx_lr_created ON letter_requests (created_at DESC);

-- ============================================================
-- TABLE 2: letter_request_events
-- ============================================================
CREATE TABLE IF NOT EXISTS letter_request_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  letter_request_id UUID REFERENCES letter_requests(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,          -- 'created', 'status_change', 'note_added', 'document_ready', 'delivered'
  from_status letter_status,
  to_status letter_status,
  event_data JSONB DEFAULT '{}',            -- Données additionnelles (ex: temps passé)
  performed_by UUID REFERENCES auth.users(id),  -- Admin qui a fait l'action
  notes TEXT
);

CREATE INDEX idx_lre_request ON letter_request_events (letter_request_id);
CREATE INDEX idx_lre_created ON letter_request_events (created_at DESC);

-- ============================================================
-- TABLE 3: letter_notifications (log des envois)
-- ============================================================
CREATE TABLE IF NOT EXISTS letter_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  letter_request_id UUID REFERENCES letter_requests(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL,   -- 'received_confirmation', 'in_progress', 'ready', 'clarification_needed', 'followup_3d', 'followup_7d'
  channel VARCHAR(20) NOT NULL,             -- 'email', 'in_app'
  recipient VARCHAR(255) NOT NULL,           -- Email ou user_id
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  content JSONB,                             -- Copie du contenu envoyé
  error_message TEXT
);

CREATE INDEX idx_ln_request ON letter_notifications (letter_request_id);
CREATE INDEX idx_ln_type ON letter_notifications (notification_type);

-- ============================================================
-- TABLE 4: letter_feedback (notation post-livraison)
-- ============================================================
CREATE TABLE IF NOT EXISTS letter_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  letter_request_id UUID REFERENCES letter_requests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  outcome VARCHAR(50),                      -- 'resolved', 'pending', 'no_response', 'rejected'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lf_request ON letter_feedback (letter_request_id);
CREATE INDEX idx_lf_rating ON letter_feedback (rating);

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE letter_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own requests" ON letter_requests
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Insert own requests" ON letter_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own requests" ON letter_requests
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admin sees all requests" ON letter_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

ALTER TABLE letter_request_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own events" ON letter_request_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM letter_requests WHERE id = letter_request_id AND user_id = auth.uid())
  );
CREATE POLICY "Admin manages events" ON letter_request_events
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

ALTER TABLE letter_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin sees notifications" ON letter_notifications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

ALTER TABLE letter_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own feedback" ON letter_feedback
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users insert feedback" ON letter_feedback
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admin sees all feedback" ON letter_feedback
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

NOTIFY pgrst, 'reload schema';
