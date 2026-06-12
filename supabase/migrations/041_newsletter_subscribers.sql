-- Migration: Newsletter subscribers
-- Public newsletter signup with consent tracking

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'footer',
  -- 'footer' | 'landing_page' | 'blog'

  consent_marketing BOOLEAN DEFAULT false,
  ip_address TEXT,
  user_agent TEXT,

  status TEXT DEFAULT 'active',
  -- 'active' | 'unsubscribed' | 'bounced'

  unsubscribed_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public form)
CREATE POLICY "Public insert newsletter" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Only admins can read/manage
CREATE POLICY "Admin read newsletter" ON newsletter_subscribers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

CREATE POLICY "Admin manage newsletter" ON newsletter_subscribers
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

CREATE INDEX idx_newsletter_email ON newsletter_subscribers (email);
CREATE INDEX idx_newsletter_status ON newsletter_subscribers (status);

NOTIFY pgrst, 'reload schema';
