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
