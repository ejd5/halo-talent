-- Migration: Chat AI — Team access & creator isolation
-- Enforces: creator sees own data, team members see assigned accounts,
-- admins see support data, audit logs immutable

-- ============================================================
-- TABLE: chat_ai_account_members (team member assignments)
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_ai_account_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  creator_account_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  member_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  role VARCHAR(20) NOT NULL DEFAULT 'chatter',
  -- 'chatter' | 'supervisor' | 'manager'

  assigned_fan_ids UUID[] DEFAULT '{}',

  is_active BOOLEAN DEFAULT true,

  UNIQUE (creator_account_id, member_user_id)
);

CREATE INDEX idx_caam_creator ON chat_ai_account_members (creator_account_id);
CREATE INDEX idx_caam_member ON chat_ai_account_members (member_user_id);

ALTER TABLE chat_ai_account_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creators manage own members" ON chat_ai_account_members
  FOR ALL USING (creator_account_id = auth.uid())
  WITH CHECK (creator_account_id = auth.uid());
CREATE POLICY "Members see own assignments" ON chat_ai_account_members
  FOR SELECT USING (member_user_id = auth.uid());
CREATE POLICY "Admin full access members" ON chat_ai_account_members
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- ============================================================
-- HELPER: check if user can access a creator's data
-- ============================================================
CREATE OR REPLACE FUNCTION can_access_creator(creator_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  -- Creator can access own data
  SELECT auth.uid() = creator_id
  -- Team member assigned to this creator
  OR EXISTS (
    SELECT 1 FROM chat_ai_account_members
    WHERE creator_account_id = creator_id
    AND member_user_id = auth.uid()
    AND is_active = true
  )
  -- Admin can access all
  OR EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'manager')
  );
$$;

-- ============================================================
-- UPDATE RLS on all chat_ai tables to use can_access_creator
-- ============================================================

-- Drop existing simple policies and recreate with team access

-- chat_ai_playbooks
DROP POLICY IF EXISTS "Users manage own playbooks" ON chat_ai_playbooks;
CREATE POLICY "Creator access playbooks" ON chat_ai_playbooks
  FOR ALL USING (can_access_creator(user_id))
  WITH CHECK (can_access_creator(user_id));

-- chat_ai_fans
DROP POLICY IF EXISTS "Users manage own fans" ON chat_ai_fans;
CREATE POLICY "Creator access fans" ON chat_ai_fans
  FOR ALL USING (can_access_creator(user_id))
  WITH CHECK (can_access_creator(user_id));

-- chat_ai_conversations
DROP POLICY IF EXISTS "Users manage own conversations" ON chat_ai_conversations;
CREATE POLICY "Creator access conversations" ON chat_ai_conversations
  FOR ALL USING (can_access_creator(user_id))
  WITH CHECK (can_access_creator(user_id));

-- chat_ai_messages
DROP POLICY IF EXISTS "Users see conv messages" ON chat_ai_messages;
DROP POLICY IF EXISTS "Users insert conv messages" ON chat_ai_messages;
CREATE POLICY "Creator access messages" ON chat_ai_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM chat_ai_conversations WHERE id = conversation_id AND can_access_creator(user_id))
  );
CREATE POLICY "Creator insert messages" ON chat_ai_messages
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM chat_ai_conversations WHERE id = conversation_id AND can_access_creator(user_id))
  );

-- chat_ai_drafts
DROP POLICY IF EXISTS "Users manage own drafts" ON chat_ai_drafts;
CREATE POLICY "Creator access drafts" ON chat_ai_drafts
  FOR ALL USING (can_access_creator(user_id))
  WITH CHECK (can_access_creator(user_id));

-- chat_ai_vault_assets
DROP POLICY IF EXISTS "Users manage own vault" ON chat_ai_vault_assets;
CREATE POLICY "Creator access vault" ON chat_ai_vault_assets
  FOR ALL USING (can_access_creator(user_id))
  WITH CHECK (can_access_creator(user_id));

-- chat_ai_ppv_recommendations
DROP POLICY IF EXISTS "Users manage own PPV" ON chat_ai_ppv_recommendations;
CREATE POLICY "Creator access ppv" ON chat_ai_ppv_recommendations
  FOR ALL USING (can_access_creator(user_id))
  WITH CHECK (can_access_creator(user_id));

-- chat_ai_followups
DROP POLICY IF EXISTS "Users manage own followups" ON chat_ai_followups;
CREATE POLICY "Creator access followups" ON chat_ai_followups
  FOR ALL USING (can_access_creator(user_id))
  WITH CHECK (can_access_creator(user_id));

-- chat_ai_qa_items
DROP POLICY IF EXISTS "Users see own QA" ON chat_ai_qa_items;
DROP POLICY IF EXISTS "Users update own QA" ON chat_ai_qa_items;
CREATE POLICY "Creator access qa" ON chat_ai_qa_items
  FOR ALL USING (can_access_creator(user_id))
  WITH CHECK (can_access_creator(user_id));

-- chat_ai_consent_checklists
DROP POLICY IF EXISTS "Users manage own consent" ON chat_ai_consent_checklists;
CREATE POLICY "Creator access consent" ON chat_ai_consent_checklists
  FOR ALL USING (can_access_creator(user_id))
  WITH CHECK (can_access_creator(user_id));

-- chat_ai_user_config
DROP POLICY IF EXISTS "Users manage own config" ON chat_ai_user_config;
CREATE POLICY "Creator access config" ON chat_ai_user_config
  FOR ALL USING (can_access_creator(user_id))
  WITH CHECK (can_access_creator(user_id));

-- chat_ai_audit_logs
DROP POLICY IF EXISTS "Users see own audit" ON chat_ai_audit_logs;
DROP POLICY IF EXISTS "System inserts audit" ON chat_ai_audit_logs;
DROP POLICY IF EXISTS "Admin full access" ON chat_ai_audit_logs;
CREATE POLICY "Creator access audit" ON chat_ai_audit_logs
  FOR SELECT USING (can_access_creator(user_id));
CREATE POLICY "System inserts audit" ON chat_ai_audit_logs
  FOR INSERT WITH CHECK (true);

-- chat_ai_tracking_events
DROP POLICY IF EXISTS "Users see own tracking" ON chat_ai_tracking_events;
DROP POLICY IF EXISTS "System inserts tracking" ON chat_ai_tracking_events;
CREATE POLICY "Creator access tracking" ON chat_ai_tracking_events
  FOR SELECT USING (can_access_creator(user_id));
CREATE POLICY "System inserts tracking" ON chat_ai_tracking_events
  FOR INSERT WITH CHECK (true);

-- chat_ai_account_members already has its policies above

NOTIFY pgrst, 'reload schema';
