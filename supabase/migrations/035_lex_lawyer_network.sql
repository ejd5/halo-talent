-- Migration: Halo Lex — Lawyer partner network & escalation
-- Tables pour le réseau d'avocats partenaires, les consultations,
-- et le suivi des dossiers escaladés.

-- ============================================================
-- TABLE 1: lex_lawyer_partners (cabinets partenaires)
-- ============================================================
CREATE TABLE IF NOT EXISTS lex_lawyer_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Cabinet info
  firm_name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,

  -- Contact
  email TEXT,
  phone TEXT,
  address TEXT,

  -- Spécialités (tags)
  specialties TEXT[] DEFAULT '{}',       -- 'droit_numerique', 'droit_image', 'contrats', 'fiscal', 'pénal', etc.
  jurisdictions TEXT[] DEFAULT '{}',      -- 'france', 'belgique', 'suisse', 'canada', 'uk', 'usa', 'espagne', 'bresil'

  -- Disponibilité
  languages TEXT[] DEFAULT '{}',          -- 'fr', 'en', 'es', 'pt'
  availability TEXT DEFAULT 'on_demand',  -- 'on_demand', 'weekly', 'full_time'
  next_available_date DATE,

  -- Tarifs négociés
  consultation_fee DECIMAL(10,2),         -- Prix préférentiel Halo
  original_fee DECIMAL(10,2),             -- Prix public
  hourly_rate DECIMAL(10,2),             -- Tarif horaire dégressif
  currency TEXT DEFAULT 'EUR',

  -- Intégration Calendly
  calendly_url TEXT,                      -- Lien Calendly pour prise de RDV

  -- Stats
  rating DECIMAL(3,2) DEFAULT 0,          -- Note moyenne (étoiles)
  review_count INT DEFAULT 0,
  cases_handled INT DEFAULT 0,
  response_time_hours INT,               -- Temps de réponse moyen

  -- Gestion
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- ============================================================
-- TABLE 2: lex_consultations (RDV avocats)
-- ============================================================
CREATE TABLE IF NOT EXISTS lex_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Participants
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  partner_id UUID REFERENCES lex_lawyer_partners(id) ON DELETE SET NULL,

  -- Type de consultation
  consultation_type TEXT DEFAULT 'video', -- 'video', 'phone', 'office'
  duration_minutes INT DEFAULT 30,
  status TEXT DEFAULT 'pending',           -- 'pending', 'confirmed', 'completed', 'cancelled'

  -- Calendrier
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancel_reason TEXT,

  -- Lien de visio
  meeting_url TEXT,
  recording_url TEXT,
  transcript TEXT,

  -- Dossier préparé par Lex
  dossier_brief TEXT,                      -- Brief IA automatique
  questionnaire_id UUID REFERENCES lex_questionnaires(id) ON DELETE SET NULL,

  -- Facturation
  fee_charged DECIMAL(10,2),
  billing_model TEXT DEFAULT 'pay_per_consult', -- 'pay_per_consult', 'elite_included', 'icon_dedicated'
  payment_status TEXT DEFAULT 'pending',     -- 'pending', 'paid', 'free', 'waived'

  -- Feedback
  creator_rating INT,                       -- 1-5
  creator_review TEXT,
  lawyer_notes TEXT,

  -- Escalade (si escalade depuis Lex)
  escalated_from TEXT,                      -- 'auto', 'manual', 'guardrail'
  escalation_reason TEXT
);

-- ============================================================
-- TABLE 3: lex_escalation_triggers (log des déclenchements)
-- ============================================================
CREATE TABLE IF NOT EXISTS lex_escalation_triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),

  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  trigger_type TEXT NOT NULL,               -- 'auto', 'manual', 'guardrail'
  trigger_reason TEXT NOT NULL,
  message_context TEXT,                     -- Le message qui a déclenché

  -- Résultat
  partner_suggested UUID[] DEFAULT '{}',    -- IDs des partenaires suggérés
  consultation_id UUID REFERENCES lex_consultations(id) ON DELETE SET NULL,
  resolved BOOLEAN DEFAULT false
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_lex_partners_active ON lex_lawyer_partners (is_active);
CREATE INDEX idx_lex_partners_specialties ON lex_lawyer_partners USING GIN (specialties);
CREATE INDEX idx_lex_partners_jurisdictions ON lex_lawyer_partners USING GIN (jurisdictions);
CREATE INDEX idx_lex_consultations_user ON lex_consultations (user_id);
CREATE INDEX idx_lex_consultations_partner ON lex_consultations (partner_id);
CREATE INDEX idx_lex_consultations_status ON lex_consultations (status);
CREATE INDEX idx_lex_consultations_scheduled ON lex_consultations (scheduled_at);
CREATE INDEX idx_lex_escalation_user ON lex_escalation_triggers (user_id);

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE lex_lawyer_partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read partners" ON lex_lawyer_partners
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admin write partners" ON lex_lawyer_partners
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

ALTER TABLE lex_consultations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own consultations" ON lex_consultations
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Insert consultations" ON lex_consultations
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Update own consultations" ON lex_consultations
  FOR UPDATE USING (user_id = auth.uid());

ALTER TABLE lex_escalation_triggers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own triggers" ON lex_escalation_triggers
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Insert triggers" ON lex_escalation_triggers
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- ============================================================
-- SEED — Avocats partenaires de démonstration
-- ============================================================
INSERT INTO lex_lawyer_partners (firm_name, description, specialties, jurisdictions, languages, consultation_fee, original_fee, hourly_rate, rating, review_count, cases_handled, calendly_url, sort_order) VALUES
(
  'Cabinet Dupont & Associés',
  'Cabinet spécialisé en droit du numérique et protection des créateurs de contenu. Expertise reconnue en droit à l''image, contrats d''agence et litiges plateformes.',
  ARRAY['droit_numerique', 'droit_image', 'contrats'],
  ARRAY['france'],
  ARRAY['fr', 'en'],
  80.00, 150.00, 200.00,
  4.8, 47, 230,
  'https://calendly.com/dupont-demo',
  1
),
(
  'LexCreate Legal',
  'Cabinet international dédié aux créateurs de contenu. Couverture UK, USA et Europe. Spécialistes des litiges transfrontaliers et fiscalité internationale.',
  ARRAY['droit_numerique', 'fiscal', 'contrats'],
  ARRAY['uk', 'usa', 'europe'],
  ARRAY['en', 'fr', 'es'],
  100.00, 180.00, 250.00,
  4.7, 32, 180,
  'https://calendly.com/lexcreate-demo',
  2
),
(
  'Maître Sarah Fontaine',
  'Avocate au Barreau de Paris, spécialiste en droit de la propriété intellectuelle et droit à l''image. Accompagnement des créateurs dans leurs démarches contractuelles et contentieuses.',
  ARRAY['droit_image', 'propriete_intellectuelle', 'contrats'],
  ARRAY['france', 'belgique', 'suisse'],
  ARRAY['fr'],
  80.00, 150.00, 180.00,
  4.9, 58, 310,
  'https://calendly.com/fontaine-demo',
  3
),
(
  'International Creator Law',
  'Cabinet anglo-saxon spécialisé dans la protection des créateurs de contenu. Expertise DMCA, Section 230, droit comparé US/EU. Procédures d''appel plateformes.',
  ARRAY['droit_numerique', 'dmca', 'plateformes'],
  ARRAY['usa', 'uk', 'canada'],
  ARRAY['en', 'es', 'pt'],
  120.00, 200.00, 300.00,
  4.6, 24, 95,
  'https://calendly.com/icl-demo',
  4
)
ON CONFLICT DO NOTHING;

NOTIFY pgrst, 'reload schema';
