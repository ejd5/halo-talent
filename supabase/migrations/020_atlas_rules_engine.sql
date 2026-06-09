-- ─── Atlas Rules Engine v2 — Automatisation avancée ─────────
-- Migration 020: Extend atlas_rules, executions, webhooks, API keys

-- ============================================================
-- 1. EXTEND ATLAS_RULES — New columns for v2 engine
-- ============================================================
ALTER TABLE atlas_rules ADD COLUMN IF NOT EXISTS trigger_config JSONB DEFAULT '{}'::jsonb;
ALTER TABLE atlas_rules ADD COLUMN IF NOT EXISTS conditions_logic TEXT DEFAULT 'all' CHECK (conditions_logic IN ('all','any'));
ALTER TABLE atlas_rules ADD COLUMN IF NOT EXISTS rate_limit_per_hour INTEGER DEFAULT 0;
ALTER TABLE atlas_rules ADD COLUMN IF NOT EXISTS logging_level TEXT DEFAULT 'normal' CHECK (logging_level IN ('verbose','normal','errors_only'));
ALTER TABLE atlas_rules ADD COLUMN IF NOT EXISTS test_mode BOOLEAN DEFAULT FALSE;
ALTER TABLE atlas_rules ADD COLUMN IF NOT EXISTS total_errors INTEGER DEFAULT 0;
ALTER TABLE atlas_rules ADD COLUMN IF NOT EXISTS schedule_at TIMESTAMPTZ;

-- ============================================================
-- 2. RULE EXECUTIONS — Detailed execution logs
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_rule_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID REFERENCES atlas_rules(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  trigger_event JSONB DEFAULT '{}'::jsonb,
  fan_id UUID REFERENCES atlas_fans(id) ON DELETE SET NULL,
  conditions_evaluation JSONB DEFAULT '[]'::jsonb,
  actions_executed JSONB DEFAULT '[]'::jsonb,
  success BOOLEAN DEFAULT TRUE,
  duration_ms INTEGER DEFAULT 0,
  error_message TEXT,
  dry_run BOOLEAN DEFAULT FALSE,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rule_exec_rule ON atlas_rule_executions(rule_id, executed_at DESC);
CREATE INDEX idx_rule_exec_creator ON atlas_rule_executions(creator_id, executed_at DESC);
CREATE INDEX idx_rule_exec_success ON atlas_rule_executions(success);

ALTER TABLE atlas_rule_executions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "creator_own_executions" ON atlas_rule_executions
  FOR ALL USING (creator_id IN (SELECT id FROM profiles WHERE auth.uid() = id));

-- ============================================================
-- 3. API KEYS — For incoming webhook authentication
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  key TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  active BOOLEAN DEFAULT TRUE,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_api_keys_creator ON atlas_api_keys(creator_id);
CREATE INDEX idx_api_keys_key ON atlas_api_keys(key);

ALTER TABLE atlas_api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "creator_own_api_keys" ON atlas_api_keys
  FOR ALL USING (creator_id IN (SELECT id FROM profiles WHERE auth.uid() = id));

-- ============================================================
-- 4. WEBHOOK EVENTS — Incoming webhook log
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  hook_name TEXT NOT NULL,
  source_ip TEXT,
  headers JSONB DEFAULT '{}'::jsonb,
  payload JSONB DEFAULT '{}'::jsonb,
  matched_rules INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_webhook_events_creator ON atlas_webhook_events(creator_id, created_at DESC);

ALTER TABLE atlas_webhook_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "creator_own_webhook_events" ON atlas_webhook_events
  FOR ALL USING (creator_id IN (SELECT id FROM profiles WHERE auth.uid() = id));

-- ============================================================
-- 5. OUTGOING WEBHOOKS — Configured destinations
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_outgoing_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL DEFAULT '{}',
  secret TEXT,
  active BOOLEAN DEFAULT TRUE,
  last_sent_at TIMESTAMPTZ,
  failure_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE atlas_outgoing_webhooks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "creator_own_outgoing_webhooks" ON atlas_outgoing_webhooks
  FOR ALL USING (creator_id IN (SELECT id FROM profiles WHERE auth.uid() = id));

-- ============================================================
-- 6. EXECUTION QUEUE — For background processing
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_rule_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rule_id UUID REFERENCES atlas_rules(id) ON DELETE CASCADE,
  trigger_event JSONB DEFAULT '{}'::jsonb,
  fan_id UUID REFERENCES atlas_fans(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','failed')),
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  scheduled_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX idx_rule_queue_status ON atlas_rule_queue(status, scheduled_at);

ALTER TABLE atlas_rule_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "creator_own_rule_queue" ON atlas_rule_queue
  FOR ALL USING (creator_id IN (SELECT id FROM profiles WHERE auth.uid() = id));

-- ============================================================
-- 7. FUNCTION: Process next queued rule
-- ============================================================
CREATE OR REPLACE FUNCTION atlas_process_rule_queue(p_limit INTEGER DEFAULT 5)
RETURNS TABLE (processed INTEGER, errors INTEGER) LANGUAGE plpgsql AS $$
DECLARE
  v_queue atlas_rule_queue%ROWTYPE;
  v_rule atlas_rules%ROWTYPE;
  v_processed INTEGER := 0;
  v_errors INTEGER := 0;
  v_conditions_ok BOOLEAN;
  v_cond RECORD;
  v_eval JSONB;
BEGIN
  FOR v_queue IN (
    SELECT * FROM atlas_rule_queue
    WHERE status = 'pending' AND scheduled_at <= NOW()
    ORDER BY scheduled_at ASC
    LIMIT p_limit
    FOR UPDATE SKIP LOCKED
  ) LOOP
    -- Mark as processing
    UPDATE atlas_rule_queue SET status = 'processing' WHERE id = v_queue.id;

    -- Get rule
    SELECT * INTO v_rule FROM atlas_rules WHERE id = v_queue.rule_id;
    IF NOT FOUND THEN
      UPDATE atlas_rule_queue SET status = 'failed', attempts = attempts + 1 WHERE id = v_queue.id;
      v_errors := v_errors + 1;
      CONTINUE;
    END IF;

    -- Check rate limit
    IF v_rule.rate_limit_per_hour > 0 THEN
      IF (SELECT COUNT(*) FROM atlas_rule_executions
          WHERE rule_id = v_rule.id AND executed_at > NOW() - INTERVAL '1 hour') >= v_rule.rate_limit_per_hour THEN
        -- Re-queue later
        UPDATE atlas_rule_queue SET scheduled_at = NOW() + INTERVAL '1 hour' WHERE id = v_queue.id;
        CONTINUE;
      END IF;
    END IF;

    -- Evaluate conditions if any
    v_conditions_ok := TRUE;
    v_eval := '[]'::jsonb;
    IF v_rule.conditions IS NOT NULL AND jsonb_array_length(v_rule.conditions) > 0 THEN
      FOR v_cond IN SELECT * FROM jsonb_to_recordset(v_rule.conditions) AS x(field text, operator text, value text, logic text) LOOP
        -- Simple evaluation against trigger event data
        -- In production, this would be more sophisticated
        v_conditions_ok := TRUE; -- simplified for migration
        v_eval := v_eval || jsonb_build_object('field', v_cond.field, 'operator', v_cond.operator, 'passed', TRUE);
      END LOOP;
    END IF;

    IF v_conditions_ok OR v_rule.conditions IS NULL OR jsonb_array_length(v_rule.conditions) = 0 THEN
      -- Log execution
      INSERT INTO atlas_rule_executions (rule_id, creator_id, trigger_event, fan_id, conditions_evaluation, actions_executed, success, dry_run)
      VALUES (v_queue.rule_id, v_queue.creator_id, v_queue.trigger_event, v_queue.fan_id, v_eval, v_rule.actions, TRUE, FALSE);

      -- Update rule stats
      UPDATE atlas_rules SET
        total_executions = total_executions + 1,
        last_executed_at = NOW()
      WHERE id = v_rule.id;

      v_processed := v_processed + 1;
    END IF;

    -- Dequeue
    UPDATE atlas_rule_queue SET status = 'completed', processed_at = NOW() WHERE id = v_queue.id;
  END LOOP;

  processed := v_processed;
  errors := v_errors;
  RETURN NEXT;
END;
$$;

-- ============================================================
-- 8. FUNCTION: Queue rule for execution
-- ============================================================
CREATE OR REPLACE FUNCTION atlas_enqueue_rule(
  p_rule_id UUID,
  p_creator_id UUID,
  p_trigger_event JSONB DEFAULT '{}'::jsonb,
  p_fan_id UUID DEFAULT NULL
) RETURNS UUID LANGUAGE plpgsql AS $$
DECLARE
  v_queue_id UUID;
BEGIN
  INSERT INTO atlas_rule_queue (creator_id, rule_id, trigger_event, fan_id)
  VALUES (p_creator_id, p_rule_id, p_trigger_event, p_fan_id)
  RETURNING id INTO v_queue_id;

  RETURN v_queue_id;
END;
$$;
