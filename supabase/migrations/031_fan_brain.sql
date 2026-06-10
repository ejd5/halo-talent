-- ─── Chat Copilot — Fan Brain System ──────────────────────
-- Persistent knowledge graph per fan with pgvector memory
-- Migration 031

-- ============================================================
-- 1. FAN BRAIN — extended personality, conversation, risk
-- 1:1 with atlas_fans, created automatically on first access
-- ============================================================
CREATE TABLE IF NOT EXISTS fan_brains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fan_id UUID UNIQUE NOT NULL REFERENCES atlas_fans(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Profile enrichment
  custom_name TEXT,
  language_detected TEXT DEFAULT 'fr',
  timezone_estimate TEXT,

  -- Financial enrichment (atlas_fans has base fields)
  ltv_predicted DECIMAL(12,2) DEFAULT 0,
  segment TEXT DEFAULT 'regular' CHECK (segment IN ('whale','tipper','regular','lurker','churning')),
  tip_history JSONB DEFAULT '[]'::jsonb,
  average_ppv_price DECIMAL(10,2) DEFAULT 0,
  subscription_months INTEGER DEFAULT 0,

  -- Personality (JSONB — flexible schema)
  personality JSONB DEFAULT '{}'::jsonb,
  -- {
  --   "communication_style": "flirty|friendly|shy|demanding|casual",
  --   "interests": ["tag1","tag2"],
  --   "triggers_positive": ["ce qui le fait acheter"],
  --   "triggers_negative": ["ce qui le fait fuir"],
  --   "preferred_content_type": "photo|video|audio|text",
  --   "preferred_tone": "string",
  --   "notes_manuelles": "texte libre du créateur"
  -- }

  -- Conversation state (JSONB)
  conversation JSONB DEFAULT '{}'::jsonb,
  -- {
  --   "total_messages": 0,
  --   "topics_discussed": [],
  --   "last_messages_summary": "résumé IA",
  --   "sentiment_trend": "positive|neutral|declining",
  --   "open_threads": [],
  --   "best_performing_messages": []
  -- }

  -- Risk scoring
  churn_score INTEGER DEFAULT 0,
  days_since_last_message INTEGER DEFAULT 0,
  days_since_last_purchase INTEGER DEFAULT 0,
  engagement_trend TEXT DEFAULT 'stable' CHECK (engagement_trend IN ('rising','stable','declining')),

  -- Tags
  tags TEXT[] DEFAULT '{}',

  -- Metadata
  last_brain_update TIMESTAMPTZ,
  last_analysis_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fan_brains_creator ON fan_brains(creator_id);
CREATE INDEX IF NOT EXISTS idx_fan_brains_segment ON fan_brains(segment);
CREATE INDEX IF NOT EXISTS idx_fan_brains_churn ON fan_brains(churn_score DESC);
CREATE INDEX IF NOT EXISTS idx_fan_brains_tags ON fan_brains USING GIN(tags);

ALTER TABLE fan_brains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creator owns fan_brains"
  ON fan_brains
  FOR ALL
  USING (auth.uid() = creator_id);

-- ============================================================
-- 2. FAN MEMORY EMBEDDINGS — pgvector semantic memory store
-- ============================================================
CREATE TABLE IF NOT EXISTS fan_memory_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fan_id UUID NOT NULL REFERENCES atlas_fans(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  memory_type TEXT NOT NULL CHECK (memory_type IN (
    'conversation_summary', 'topic', 'preference', 'purchase_context',
    'trigger_event', 'manual_note', 'interaction'
  )),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  embedding VECTOR(1536),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fan_memory_fan_type ON fan_memory_embeddings(fan_id, memory_type);
CREATE INDEX IF NOT EXISTS idx_fan_memory_creator ON fan_memory_embeddings(creator_id);
CREATE INDEX IF NOT EXISTS idx_fan_memory_embedding
  ON fan_memory_embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

ALTER TABLE fan_memory_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creator owns fan_memory_embeddings"
  ON fan_memory_embeddings
  FOR ALL
  USING (auth.uid() = creator_id);

-- ============================================================
-- 3. AUTO-CREATE fan_brains row when atlas_fans is inserted
-- ============================================================
CREATE OR REPLACE FUNCTION auto_create_fan_brain()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO fan_brains (fan_id, creator_id)
  VALUES (NEW.id, NEW.creator_id)
  ON CONFLICT (fan_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_auto_create_fan_brain ON atlas_fans;
CREATE TRIGGER trg_auto_create_fan_brain
  AFTER INSERT ON atlas_fans
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_fan_brain();

-- ============================================================
-- 4. MATCH MEMORIES — pgvector similarity search RPC
-- ============================================================
CREATE OR REPLACE FUNCTION match_fan_memories(
  p_fan_id UUID,
  p_creator_id UUID,
  p_embedding VECTOR(1536),
  p_match_threshold FLOAT DEFAULT 0.7,
  p_match_count INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  fan_id UUID,
  creator_id UUID,
  memory_type TEXT,
  content TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.fan_id,
    m.creator_id,
    m.memory_type,
    m.content,
    m.metadata,
    m.created_at,
    1 - (m.embedding <=> p_embedding) AS similarity
  FROM fan_memory_embeddings m
  WHERE
    m.fan_id = p_fan_id
    AND m.creator_id = p_creator_id
    AND 1 - (m.embedding <=> p_embedding) > p_match_threshold
  ORDER BY m.embedding <=> p_embedding
  LIMIT p_match_count;
END;
$$;
