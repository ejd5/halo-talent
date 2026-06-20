-- Migration: Bouclier Légal — Legal Shield Module
-- Tables for legal knowledge base, abusive clause detection, contract analysis,
-- generated letters, and update logging.

-- ============================================================
-- TABLE 1: legal_knowledge (le second cerveau juridique)
-- ============================================================
CREATE TABLE legal_knowledge (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Catégorisation
  category TEXT NOT NULL, -- 'cgu_platform', 'law', 'jurisprudence', 'clause_type', 'best_practice'
  platform TEXT,          -- 'onlyfans', 'fansly', 'mym', 'instagram', 'tiktok', 'youtube', NULL = général
  jurisdiction TEXT DEFAULT 'international', -- 'fr', 'us', 'uk', 'eu', 'international'

  -- Contenu
  title TEXT NOT NULL,
  content TEXT NOT NULL,   -- Le texte juridique complet
  summary TEXT,            -- Résumé IA en 2-3 phrases
  source_url TEXT,         -- URL d'origine
  source_name TEXT,        -- "CGU OnlyFans v2026.04", "Code civil FR Art. 1171", etc.

  -- Métadonnées
  severity_score INT DEFAULT 3 CHECK (severity_score BETWEEN 1 AND 5),
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_verified_at TIMESTAMPTZ,
  auto_generated BOOLEAN DEFAULT false -- true si ajouté par l'agent IA
);

-- ============================================================
-- TABLE 2: abusive_clauses (catalogue des clauses piégeuses)
-- ============================================================
CREATE TABLE abusive_clauses (
  id TEXT PRIMARY KEY, -- ex: 'email_control', 'password_refusal', etc.
  created_at TIMESTAMPTZ DEFAULT now(),

  -- Affichage formulaire
  label TEXT NOT NULL,         -- Texte de la case à cocher
  description TEXT,            -- Explication courte affichée quand cochée
  category TEXT NOT NULL,      -- 'account_control', 'financial', 'content_rights', 'communication', 'psychological', 'contractual'
  icon TEXT,                   -- Nom icône lucide-react

  -- Données juridiques
  cgu_references JSONB DEFAULT '[]',   -- [{platform, article, text}]
  law_references JSONB DEFAULT '[]',   -- [{jurisdiction, code, article, text}]
  legal_argument TEXT NOT NULL,        -- Argumentaire juridique prêt à l'emploi

  -- Scoring
  severity INT DEFAULT 3 CHECK (severity BETWEEN 1 AND 5),
  frequency_detected INT DEFAULT 0,  -- Combien de fois cochée par les utilisateurs
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- ============================================================
-- TABLE 3: contract_analyses (analyses effectuées)
-- ============================================================
CREATE TABLE contract_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),

  -- Utilisateur (anonymisé pour les visiteurs, lié pour les membres)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_anonymous BOOLEAN DEFAULT true,
  session_fingerprint TEXT, -- hash anonyme pour analytics

  -- Données de l'analyse
  platform TEXT NOT NULL,
  clauses_checked TEXT[] NOT NULL,  -- IDs des clauses cochées
  other_clause_text TEXT,           -- Champ libre "autre clause"
  agency_name TEXT,                 -- Optionnel, pour statistiques

  -- Résultats
  total_score INT NOT NULL,
  risk_level TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
  ai_diagnosis TEXT,        -- Diagnostic IA personnalisé

  -- Conversion
  letter_generated BOOLEAN DEFAULT false,
  converted_to_lead BOOLEAN DEFAULT false,
  converted_to_member BOOLEAN DEFAULT false
);

-- ============================================================
-- TABLE 4: generated_letters (lettres générées)
-- ============================================================
CREATE TABLE generated_letters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),

  analysis_id UUID REFERENCES contract_analyses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  letter_type TEXT NOT NULL, -- 'mise_en_demeure', 'resiliation', 'platform_support', 'account_recovery'
  platform TEXT NOT NULL,
  content TEXT NOT NULL,     -- Le texte de la lettre
  language TEXT DEFAULT 'fr', -- fr, en, es, pt

  was_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ
);

-- ============================================================
-- TABLE 5: legal_updates_log (journal du second cerveau)
-- ============================================================
CREATE TABLE legal_updates_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),

  action TEXT NOT NULL,       -- 'cgu_scraped', 'clause_added', 'knowledge_updated', 'pattern_detected'
  source TEXT,                -- D'où vient la mise à jour
  details JSONB,
  items_affected INT DEFAULT 0,
  reviewed_by_admin BOOLEAN DEFAULT false
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_legal_knowledge_category ON legal_knowledge(category);
CREATE INDEX idx_legal_knowledge_platform ON legal_knowledge(platform);
CREATE INDEX idx_abusive_clauses_category ON abusive_clauses(category);
CREATE INDEX idx_contract_analyses_platform ON contract_analyses(platform);
CREATE INDEX idx_contract_analyses_created ON contract_analyses(created_at DESC);

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- legal_knowledge : lecture publique, écriture admin uniquement
ALTER TABLE legal_knowledge ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON legal_knowledge FOR SELECT USING (is_active = true);
CREATE POLICY "Admin write" ON legal_knowledge FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- abusive_clauses : lecture publique
ALTER TABLE abusive_clauses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON abusive_clauses FOR SELECT USING (is_active = true);

-- contract_analyses : l'utilisateur voit les siennes, admin voit tout
ALTER TABLE contract_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own analyses" ON contract_analyses FOR SELECT USING (
  user_id = auth.uid() OR is_anonymous = true
);
CREATE POLICY "Insert anyone" ON contract_analyses FOR INSERT WITH CHECK (true);

-- generated_letters : l'utilisateur voit les siennes
ALTER TABLE generated_letters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own letters" ON generated_letters FOR SELECT USING (
  user_id = auth.uid()
);
CREATE POLICY "Insert anyone" ON generated_letters FOR INSERT WITH CHECK (true);

-- legal_updates_log : admin only
ALTER TABLE legal_updates_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin all" ON legal_updates_log FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================
-- SEED DATA : Clauses abusives initiales
-- ============================================================
INSERT INTO abusive_clauses (id, label, description, category, severity, legal_argument, cgu_references, sort_order) VALUES
(
  'email_control',
  'L''agence a créé mon compte avec son propre email',
  'Vous n''avez pas accès à l''email de récupération de votre compte. L''agence contrôle donc votre identité numérique.',
  'account_control', 5,
  'Les CGU d''OnlyFans stipulent que le titulaire du compte est la personne vérifiée par pièce d''identité. Le partage d''identifiants est interdit. Vous pouvez contacter le support OF avec votre pièce d''identité pour récupérer l''accès.',
  '[{"platform":"onlyfans","article":"Account Ownership","text":"One person per account; sharing accounts is prohibited"}]',
  1
),
(
  'password_refusal',
  'L''agence refuse de me communiquer le mot de passe',
  'Vous ne pouvez pas vous connecter à votre propre compte sans passer par l''agence.',
  'account_control', 5,
  'Le refus de communiquer les identifiants d''un compte dont vous êtes le titulaire vérifié constitue une rétention abusive. Contactez directement le support de la plateforme avec votre pièce d''identité.',
  '[{"platform":"onlyfans","article":"Account Security","text":"Account credentials must be controlled by the verified account holder"}]',
  2
),
(
  'exit_threats',
  'L''agence me menace de poursuites si je reprends mon compte',
  'Intimidation juridique pour vous empêcher de reprendre le contrôle.',
  'psychological', 4,
  'Une clause contractuelle ne peut pas vous interdire d''exercer vos droits fondamentaux. En droit français (art. 1171 Code civil), les clauses créant un déséquilibre significatif sont réputées non écrites. La menace de poursuites pour exercice d''un droit légitime peut constituer une violence économique (art. 1143 Code civil).',
  '[]',
  3
),
(
  'exclusivity_clause',
  'Mon contrat prévoit une exclusivité longue après rupture',
  'Clause de non-concurrence qui vous empêche de travailler librement après la fin du contrat.',
  'contractual', 4,
  'Une clause de non-concurrence doit être limitée dans le temps, l''espace et compensée financièrement pour être valide (jurisprudence constante). Sans compensation, elle est nulle. En droit du travail FR, même pour un indépendant, une exclusivité de plus de 12 mois sans contrepartie est contestable.',
  '[]',
  4
),
(
  'content_ownership',
  'L''agence se déclare propriétaire de mes contenus',
  'Clause "work for hire" ou cession totale de droits d''auteur.',
  'content_rights', 5,
  'En droit français, la cession globale des œuvres futures est nulle (art. L131-1 CPI). Le créateur est toujours l''auteur initial de son contenu. Une cession doit être explicite, rémunérée, et limitée dans le temps et l''espace. Les CGU d''OnlyFans confirment que le créateur conserve la propriété de son contenu.',
  '[{"platform":"onlyfans","article":"Content Ownership","text":"Creators retain ownership of their content"}]',
  5
),
(
  'exit_penalty',
  'Je dois payer une pénalité pour rompre le contrat',
  'Liquidated damages ou frais de sortie exorbitants.',
  'financial', 4,
  'Une pénalité de sortie disproportionnée par rapport au préjudice réel est une clause abusive (art. 1231-5 Code civil). Le juge peut la réduire. Une pénalité supérieure à 1-2 mois de commission moyenne est généralement considérée comme excessive.',
  '[]',
  6
),
(
  'commission_before_payment',
  'L''agence prélève sa commission AVANT de me payer',
  'L''argent transite d''abord par le compte de l''agence.',
  'financial', 5,
  'Si l''agence reçoit vos revenus sur son propre compte, elle a un contrôle total sur vos finances. Les CGU d''OnlyFans versent les fonds au titulaire vérifié du compte. Si l''agence a mis ses propres informations bancaires, c''est une violation des CGU.',
  '[{"platform":"onlyfans","article":"Payment","text":"Payments are made to the verified account holder"}]',
  7
),
(
  'auto_renewal',
  'Mon contrat se renouvelle automatiquement',
  'Pas de possibilité simple de s''opposer au renouvellement.',
  'contractual', 3,
  'En droit français, le renouvellement tacite est légal mais le client doit être informé de la possibilité de ne pas renouveler (art. L215-1 Code de la consommation). L''absence d''information claire sur la procédure de non-renouvellement rend la clause contestable.',
  '[]',
  8
),
(
  'ghosting',
  'Mon manager ne répond plus à mes messages',
  'Abandon de service sans résiliation formelle.',
  'communication', 3,
  'Le ghosting par votre manager constitue un manquement à ses obligations contractuelles. Documentez chaque tentative de contact (screenshots avec dates). Après 15 jours sans réponse, vous pouvez invoquer la résiliation pour faute de l''agence.',
  '[]',
  9
),
(
  'non_disparagement',
  'L''agence m''interdit de déposer un avis négatif',
  'Clause de non-dénigrement qui censure votre liberté d''expression.',
  'contractual', 3,
  'La liberté d''expression est un droit fondamental. Une clause de non-dénigrement ne peut pas vous empêcher de témoigner factuellement de votre expérience. Vous pouvez décrire des faits objectifs sans risque juridique tant que vous ne diffamez pas.',
  '[]',
  10
),
(
  'content_promotion',
  'L''agence utilise mon contenu pour sa propre promotion',
  'Votre image et vos contenus servent à recruter d''autres modèles.',
  'content_rights', 3,
  'L''utilisation de votre image à des fins commerciales par l''agence nécessite votre consentement explicite (droit à l''image, art. 9 Code civil). Si votre contrat ne prévoit pas cette utilisation, ou si vous ne l''avez pas autorisée, c''est illicite.',
  '[]',
  11
),
(
  'forced_coaching',
  'L''agence m''impose des coachings payants supplémentaires',
  'Services additionnels facturés en plus de la commission.',
  'financial', 3,
  'Si votre contrat ne prévoit pas ces frais supplémentaires, l''agence ne peut pas vous les imposer. Vérifiez votre contrat. Si ces frais n''y figurent pas, refusez par écrit.',
  '[]',
  12
),
(
  'long_contract',
  'Mon contrat dure plus de 12 mois sans période d''essai',
  'Engagement long sans possibilité de tester la relation.',
  'contractual', 4,
  'Un contrat de prestation de services de plus de 12 mois sans période d''essai et sans clause de sortie raisonnable est considéré comme déséquilibré. En droit français, vous pouvez invoquer l''art. 1171 Code civil (clauses abusives dans les contrats d''adhésion).',
  '[]',
  13
),
(
  'bank_control',
  'L''agence contrôle mon compte bancaire ou mes identifiants de paiement',
  'L''agence a accès à vos informations bancaires ou de paiement.',
  'financial', 5,
  'Le contrôle de vos identifiants bancaires par un tiers est extrêmement grave. Changez immédiatement vos mots de passe bancaires. Contactez votre banque pour signaler un accès non autorisé. C''est potentiellement un abus de confiance (art. 314-1 Code pénal).',
  '[]',
  14
);

-- ============================================================
-- SEED DATA : legal_knowledge avec les CGU principales
-- ============================================================
INSERT INTO legal_knowledge (category, platform, jurisdiction, title, content, summary, source_name, severity_score, tags) VALUES
(
  'cgu_platform', 'onlyfans', 'international',
  'Propriété du compte OnlyFans',
  'OnlyFans requiert que chaque compte soit détenu par une personne réelle vérifiée par pièce d''identité. Le partage de compte est interdit. Le titulaire vérifié est le seul propriétaire légitime du compte.',
  'Un compte OnlyFans appartient à la personne vérifiée par pièce d''identité, pas à l''agence.',
  'OnlyFans Terms of Service 2026',
  5, ARRAY['account_ownership', 'verification', 'agency']
),
(
  'cgu_platform', 'onlyfans', 'international',
  'Propriété du contenu OnlyFans',
  'Les créateurs conservent la propriété de leur contenu sur OnlyFans. La plateforme obtient une licence d''utilisation limitée à l''affichage sur la plateforme, mais les droits d''auteur restent au créateur.',
  'Le créateur reste propriétaire de son contenu. L''agence ne peut pas s''en attribuer la propriété.',
  'OnlyFans Terms of Service 2026',
  5, ARRAY['content_ownership', 'copyright', 'agency']
),
(
  'cgu_platform', 'onlyfans', 'international',
  'Interdiction de l''usurpation d''identité OnlyFans',
  'OnlyFans interdit aux agences ou managers de se faire passer pour le créateur dans les interactions avec les abonnés. Toute communication doit être authentique ou clairement identifiée comme assistée.',
  'Les chatters qui se font passer pour le créateur violent les CGU. L''IA doit être divulguée.',
  'OnlyFans Policy Updates 2026',
  5, ARRAY['impersonation', 'chatting', 'ai_disclosure']
),
(
  'law', NULL, 'fr',
  'Clauses abusives — Art. 1171 Code civil',
  'Dans un contrat d''adhésion, toute clause non négociable, déterminée à l''avance par l''une des parties, qui crée un déséquilibre significatif entre les droits et obligations des parties au contrat est réputée non écrite.',
  'Les clauses créant un déséquilibre significatif dans un contrat standard sont nulles.',
  'Code civil français — Art. 1171',
  4, ARRAY['clause_abusive', 'contrat_adhesion', 'france']
),
(
  'law', NULL, 'fr',
  'Violence économique — Art. 1143 Code civil',
  'Il y a violence lorsqu''une partie, abusant de l''état de dépendance dans lequel se trouve son cocontractant à son égard, obtient de lui un engagement qu''il n''aurait pas souscrit en l''absence d''une telle contrainte et en tire un avantage manifestement excessif.',
  'Un contrat signé sous pression économique ou menace peut être annulé.',
  'Code civil français — Art. 1143',
  4, ARRAY['violence_economique', 'contrainte', 'france']
),
(
  'law', NULL, 'fr',
  'Cession des œuvres futures — Art. L131-1 CPI',
  'La cession globale des œuvres futures est nulle. Chaque cession doit être explicite, limitée, et rémunérée.',
  'Impossible de céder en bloc tous ses futurs contenus. Chaque cession doit être spécifique.',
  'Code de la Propriété Intellectuelle — Art. L131-1',
  5, ARRAY['droit_auteur', 'cession', 'france']
);

NOTIFY pgrst, 'reload schema';
-- Migration: Legal CGU Versioning — snapshots traçables + change events
-- Capture les versions successives des CGU scrappées pour permettre
-- un diff entre versions et un historique traçable des évolutions.
-- Conçu pour être alimenté par legal-scan cron (sans le modifier ici).

-- ============================================================
-- TABLE 1: legal_source_snapshots (archives de CGU)
-- ============================================================
CREATE TABLE legal_source_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),

  -- Identification de la source
  platform TEXT NOT NULL,        -- 'onlyfans', 'fansly', 'mym', etc.
  doc_type TEXT NOT NULL,        -- 'terms_of_service', 'acceptable_use', 'privacy_policy', 'creator_guidelines'
  source_url TEXT NOT NULL,       -- URL exacte au moment du snapshot
  doc_version TEXT,              -- Version indiquée par la plateforme (ex: "v2026.04")

  -- Contenu
  raw_content TEXT NOT NULL,     -- Le texte brut scrappé (HTML stripped)
  content_hash TEXT NOT NULL,    -- hash SHA-256 du raw_content pour détection de changements

  -- Métadonnées de capture
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  fetch_method TEXT DEFAULT 'scraper', -- 'scraper', 'api', 'manual'
  fetch_success BOOLEAN DEFAULT true,
  fetch_error TEXT,              -- Message d'erreur si échec
  response_size_bytes INT,       -- Taille de la réponse
  is_active BOOLEAN DEFAULT true,

  -- Contrainte d'unicité sur le hash pour éviter les doublons
  CONSTRAINT unique_content_hash UNIQUE (content_hash)
);

-- ============================================================
-- TABLE 2: legal_change_events (deltas détectés)
-- ============================================================
CREATE TABLE legal_change_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),

  -- Référence aux snapshots (avant / après)
  previous_snapshot_id UUID REFERENCES legal_source_snapshots(id) ON DELETE SET NULL,
  new_snapshot_id UUID REFERENCES legal_source_snapshots(id) ON DELETE SET NULL,

  -- Contexte du changement
  platform TEXT NOT NULL,
  doc_type TEXT NOT NULL,
  source_url TEXT,

  -- Analyse du changement
  summary TEXT NOT NULL,                 -- Résumé IA du changement (1-3 phrases)
  impact_level TEXT DEFAULT 'minor',     -- 'critical', 'major', 'minor', 'none'
  affected_articles TEXT[],              -- Liste des articles/sections modifiés
  human_reviewed BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,

  -- Publication
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_legal_snapshots_lookup
  ON legal_source_snapshots(platform, doc_type, fetched_at DESC);

CREATE INDEX idx_legal_snapshots_hash
  ON legal_source_snapshots(content_hash);

CREATE INDEX idx_legal_change_events_platform
  ON legal_change_events(platform, doc_type, created_at DESC);

CREATE INDEX idx_legal_change_events_published
  ON legal_change_events(published, human_reviewed)
  WHERE published = true AND human_reviewed = true;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- legal_source_snapshots : accessible uniquement par service_role
-- (service_role bypass RLS, donc USING(false) bloque anon/authenticated)
ALTER TABLE legal_source_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Block anon all" ON legal_source_snapshots
  FOR ALL USING (false)
  WITH CHECK (false);

-- legal_change_events : écriture service_role seulement,
-- lecture publique uniquement sur les événements publiés + vérifiés
ALTER TABLE legal_change_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role write" ON legal_change_events
  FOR ALL USING (false)
  WITH CHECK (false);

CREATE POLICY "Public read reviewed" ON legal_change_events
  FOR SELECT USING (published = true AND human_reviewed = true);

-- ============================================================
-- NOTIFY pour recharger le schéma
-- ============================================================
NOTIFY pgrst, 'reload schema';
-- Migration: Halo Lex — Knowledge Base vectorielle + RAG
-- Tables pour le stockage, chunking, embedding et recherche
-- sémantique de la base juridique de Halo Lex.
--
-- Dépend de : pgvector (déjà activé via migration 031)

-- ============================================================
-- TABLE 1: legal_sources (sources amont)
-- ============================================================
CREATE TABLE IF NOT EXISTS legal_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type TEXT NOT NULL,        -- 'cgu_platform', 'law', 'jurisprudence', 'case_law', 'internal'
  source_name TEXT NOT NULL,
  url TEXT,
  jurisdiction TEXT DEFAULT 'international',
  language TEXT DEFAULT 'fr',
  current_version_hash TEXT,
  last_checked_at TIMESTAMPTZ,
  last_updated_at TIMESTAMPTZ,
  update_frequency TEXT DEFAULT 'weekly', -- 'daily', 'weekly', 'monthly'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TABLE 2: legal_documents (versions spécifiques des sources)
-- ============================================================
CREATE TABLE IF NOT EXISTS legal_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES legal_sources(id) ON DELETE CASCADE,
  document_title TEXT NOT NULL,
  document_reference TEXT,          -- ex: "Art. 1171", "CGU v2026.04"
  effective_date DATE,
  version_hash TEXT NOT NULL,       -- SHA-256 du full_text
  full_text TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  ingested_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TABLE 3: legal_chunks (chunks vectorisés)
-- ============================================================
CREATE TABLE IF NOT EXISTS legal_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES legal_documents(id) ON DELETE CASCADE,
  chunk_index INT NOT NULL,
  chunk_text TEXT NOT NULL,
  chunk_summary TEXT,
  embedding VECTOR(1024),
  tags TEXT[] DEFAULT '{}',
  complexity_level INT DEFAULT 3 CHECK (complexity_level BETWEEN 1 AND 5),
  use_cases TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- RLS : service_role uniquement (comme legal_source_snapshots)
-- ============================================================
ALTER TABLE legal_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role only" ON legal_sources
  FOR ALL USING (false) WITH CHECK (false);

ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role only" ON legal_documents
  FOR ALL USING (false) WITH CHECK (false);

ALTER TABLE legal_chunks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role only" ON legal_chunks
  FOR ALL USING (false) WITH CHECK (false);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_legal_chunks_embedding
  ON legal_chunks
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_legal_chunks_tags
  ON legal_chunks USING GIN (tags);

CREATE INDEX IF NOT EXISTS idx_legal_chunks_document
  ON legal_chunks (document_id);

CREATE INDEX IF NOT EXISTS idx_legal_documents_source
  ON legal_documents (source_id);

-- ============================================================
-- RECHERCHE VECTORIELLE — RPC function
-- ============================================================
CREATE OR REPLACE FUNCTION match_legal_chunks(
  p_embedding VECTOR(1024),
  p_match_threshold FLOAT DEFAULT 0.7,
  p_match_count INT DEFAULT 10,
  p_tags TEXT[] DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  chunk_text TEXT,
  chunk_summary TEXT,
  document_title TEXT,
  source_name TEXT,
  source_url TEXT,
  tags TEXT[],
  complexity_level INT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.chunk_text,
    c.chunk_summary,
    d.document_title,
    s.source_name,
    s.url AS source_url,
    c.tags,
    c.complexity_level,
    1 - (c.embedding <=> p_embedding) AS similarity
  FROM legal_chunks c
  JOIN legal_documents d ON d.id = c.document_id
  JOIN legal_sources s ON s.id = d.source_id
  WHERE 1 - (c.embedding <=> p_embedding) > p_match_threshold
    AND (p_tags IS NULL OR c.tags && p_tags)
  ORDER BY similarity DESC
  LIMIT p_match_count;
END;
$$;

-- Seed initial : les sources juridiques de base
INSERT INTO legal_sources (source_type, source_name, url, jurisdiction, language, update_frequency) VALUES
  ('cgu_platform', 'OnlyFans Terms of Service', 'https://onlyfans.com/terms', 'international', 'en', 'weekly'),
  ('cgu_platform', 'Fansly Terms of Service', 'https://fansly.com/tos', 'international', 'en', 'weekly'),
  ('cgu_platform', 'MYM Conditions Générales', 'https://www.mym.fans/terms', 'france', 'fr', 'weekly'),
  ('law', 'Code civil français', NULL, 'france', 'fr', 'monthly'),
  ('law', 'Code de la propriété intellectuelle', NULL, 'france', 'fr', 'monthly'),
  ('law', 'RGPD — Règlement 2016/679', NULL, 'europe', 'fr', 'monthly'),
  ('law', 'Digital Services Act — Règlement 2022/2065', NULL, 'europe', 'en', 'monthly'),
  ('jurisprudence', 'Cour de cassation', NULL, 'france', 'fr', 'daily'),
  ('jurisprudence', 'CJUE', NULL, 'europe', 'fr', 'daily')
ON CONFLICT DO NOTHING;

NOTIFY pgrst, 'reload schema';
-- Migration: Halo Lex — Questionnaires & diagnostic history
-- Stocke les questionnaires guidés et leurs diagnostics associés.
--
-- Dépend de : auth.users, generated_letters (030)

-- ============================================================
-- TABLE: lex_questionnaires
-- ============================================================
CREATE TABLE IF NOT EXISTS lex_questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Propriétaire
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Étape 1 — Plateformes
  platforms TEXT[] DEFAULT '{}',

  -- Étape 2 — Type de problème
  problem_type TEXT,

  -- Étape 3 — Détails
  problem_timing TEXT,
  problem_description TEXT,
  platform_message TEXT,

  -- Étape 4 — Documents
  documents TEXT[] DEFAULT '{}',

  -- Étape 5 — Objectifs
  objectives TEXT[] DEFAULT '{}',
  urgency TEXT DEFAULT 'Modéré',

  -- Résultat du diagnostic
  diagnosis TEXT,
  status TEXT DEFAULT 'draft',   -- 'draft', 'completed', 'letter_generated', 'escalated'

  -- Lien vers une lettre générée
  letter_id UUID REFERENCES generated_letters(id) ON DELETE SET NULL,

  -- Métadonnées
  metadata JSONB DEFAULT '{}'
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_lex_questionnaires_user ON lex_questionnaires (user_id);
CREATE INDEX idx_lex_questionnaires_created ON lex_questionnaires (created_at DESC);
CREATE INDEX idx_lex_questionnaires_status ON lex_questionnaires (status);

-- ============================================================
-- RLS : utilisateur voit ses questionnaires, admin voit tout
-- ============================================================
ALTER TABLE lex_questionnaires ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own questionnaires" ON lex_questionnaires
  FOR ALL USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Insert questionnaires" ON lex_questionnaires
  FOR INSERT WITH CHECK (
    user_id = auth.uid() OR user_id IS NULL
  );

NOTIFY pgrst, 'reload schema';
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
-- Migration: Add Urgent priority level + LX-YYYY-XXXX reference format
-- Tasks 78-79: 3 urgency tiers (Standard/Urgent/Express) + human-readable references

-- ============================================================
-- 1. Add 'urgent' to letter_priority enum
-- ============================================================
ALTER TYPE letter_priority ADD VALUE IF NOT EXISTS 'urgent';

-- ============================================================
-- 2. Add reference column to letter_requests
-- ============================================================
ALTER TABLE letter_requests
  ADD COLUMN IF NOT EXISTS reference VARCHAR(20);

-- Unique index on reference
CREATE UNIQUE INDEX IF NOT EXISTS idx_lr_reference ON letter_requests (reference)
  WHERE reference IS NOT NULL;

-- ============================================================
-- 3. Admin notifications table (Task 81)
-- ============================================================
CREATE TABLE IF NOT EXISTS lex_admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  notification_type VARCHAR(50) NOT NULL,
  -- 'daily_recap', 'deadline_4h', 'late_alert', 'new_request'

  request_id UUID REFERENCES letter_requests(id) ON DELETE SET NULL,
  recipient_admin_id UUID REFERENCES auth.users(id),

  title TEXT NOT NULL,
  body TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  is_sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,

  metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_lan_admin ON lex_admin_notifications (recipient_admin_id, is_read);
CREATE INDEX IF NOT EXISTS idx_lan_type ON lex_admin_notifications (notification_type);

ALTER TABLE lex_admin_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin only" ON lex_admin_notifications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

NOTIFY pgrst, 'reload schema';
