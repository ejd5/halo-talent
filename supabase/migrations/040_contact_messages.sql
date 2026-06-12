-- Migration: Contact form messages
-- Public contact form submissions stored for admin review

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  name TEXT NOT NULL,
  email TEXT NOT NULL,
  profile TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  consent_contact BOOLEAN DEFAULT false,

  status TEXT DEFAULT 'new',
  -- 'new' | 'read' | 'replied' | 'archived'

  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Only admins/managers can read contact messages
CREATE POLICY "Admin read contact messages" ON contact_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- Anyone can insert (public form)
CREATE POLICY "Public insert contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Only admins can update status
CREATE POLICY "Admin update contact messages" ON contact_messages
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

CREATE INDEX idx_contact_status ON contact_messages (status);
CREATE INDEX idx_contact_created ON contact_messages (created_at DESC);

NOTIFY pgrst, 'reload schema';
