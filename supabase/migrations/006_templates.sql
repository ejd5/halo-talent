-- ═══════════════════════════════════════════════════════════════
-- Migration 006: Templates Library
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  type TEXT NOT NULL CHECK (type IN ('photo', 'video', 'carousel', 'story', 'caption')),
  target_platforms TEXT[] DEFAULT '{}',
  target_aspect_ratios TEXT[] DEFAULT '{}',
  preview_url TEXT,
  template_data JSONB DEFAULT '{}',
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  department TEXT,
  style TEXT,
  mood TEXT,
  is_official BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  uses_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS template_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(template_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_templates_official ON templates(is_official);
CREATE INDEX IF NOT EXISTS idx_templates_public ON templates(is_public);
CREATE INDEX IF NOT EXISTS idx_templates_created_by ON templates(created_by);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_type ON templates(type);

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_likes ENABLE ROW LEVEL SECURITY;

-- Official templates: everyone can read
CREATE POLICY "Official templates public" ON templates FOR SELECT USING (is_official = TRUE);

-- Public community templates: everyone can read
CREATE POLICY "Community templates public" ON templates FOR SELECT USING (is_public = TRUE);

-- Users can CRUD their own templates
CREATE POLICY "Users own templates" ON templates FOR ALL USING (auth.uid() = created_by);

-- Likes: authenticated users can manage their likes
CREATE POLICY "Users manage likes" ON template_likes FOR ALL USING (auth.uid() = user_id);

-- Admin sees all
CREATE POLICY "Admin all templates" ON templates FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ═══ RPC: Increment template uses ──
CREATE OR REPLACE FUNCTION increment_template_uses(template_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE templates SET uses_count = uses_count + 1 WHERE id = template_id;
END;
$$;

-- ═══ RPC: Increment template likes ──
CREATE OR REPLACE FUNCTION increment_template_likes(template_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE templates SET likes_count = likes_count + 1 WHERE id = template_id;
END;
$$;

-- ═══ RPC: Decrement template likes ──
CREATE OR REPLACE FUNCTION decrement_template_likes(template_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE templates SET likes_count = GREATEST(0, likes_count - 1) WHERE id = template_id;
END;
$$;

-- ═══ SEED: Official Templates ═══

INSERT INTO templates (name, description, category, type, target_platforms, target_aspect_ratios, preview_url, is_official, uses_count, tags, style, mood, template_data) VALUES
-- Instagram Posts
(
  'Post Minimal Luxe',
  'Template photo épuré avec typographie fine et espace négatif. Idéal pour les marques premium.',
  'Instagram Posts', 'photo',
  ARRAY['instagram'], ARRAY['1:1', '4:5'],
  '/templates/preview/minimal-luxe.jpg', TRUE, 0,
  ARRAY['minimal', 'luxe', 'typography', 'elegant'],
  'minimal', 'calm',
  '{"background": "#FAFAF8", "accent": "#1A1A1A", "font_heading": "Playfair Display", "font_body": "Inter", "layers": [{"type": "image", "x": 0, "y": 0, "w": 1080, "h": 700}, {"type": "text", "x": 60, "y": 760, "font_size": 32, "color": "#1A1A1A", "align": "left"}, {"type": "text", "x": 60, "y": 820, "font_size": 14, "color": "#8C8C8C", "align": "left"}]}'
),
(
  'Post Storytelling',
  'Template narrative avec zone de texte large pour raconter une histoire en image.',
  'Instagram Posts', 'photo',
  ARRAY['instagram'], ARRAY['1:1', '4:5'],
  '/templates/preview/storytelling.jpg', TRUE, 0,
  ARRAY['storytelling', 'narrative', 'text-heavy'],
  'editorial', 'peaceful',
  '{"background": "#FFFFFF", "accent": "#C75B39", "font_heading": "Instrument Serif", "font_body": "Inter", "layers": [{"type": "image", "x": 0, "y": 0, "w": 1080, "h": 540}, {"type": "text", "x": 80, "y": 620, "font_size": 28, "color": "#1A1A1A", "align": "left", "max_width": 920}, {"type": "text", "x": 80, "y": 850, "font_size": 12, "color": "#8C8C8C", "align": "left"}]}'
),

-- Reels
(
  'Reel Transition Rapide',
  'Template Reel dynamique avec 3 scènes et transitions fluides. Idéal pour le contenu lifestyle.',
  'Reels', 'video',
  ARRAY['instagram', 'tiktok'], ARRAY['9:16'],
  '/templates/preview/reel-transition.jpg', TRUE, 0,
  ARRAY['reel', 'dynamic', 'transition', 'lifestyle'],
  'dynamic', 'energetic',
  '{"scenes": 3, "scene_duration": 2, "transition": "slide", "background_music": "upbeat", "text_animation": "fade_up", "colors": {"primary": "#1A1A1A", "accent": "#C75B39", "background": "#F5F0EB"}}'
),
(
  'Reel Product Spotlight',
  'Template Reel pour présenter un produit avec texte percutant et zoom avant.',
  'Reels', 'video',
  ARRAY['instagram', 'tiktok'], ARRAY['9:16'],
  '/templates/preview/reel-product.jpg', TRUE, 0,
  ARRAY['product', 'spotlight', 'commercial', 'zoom'],
  'cinematic', 'happy',
  '{"scenes": 2, "scene_duration": 3, "transition": "zoom", "background_music": "corporate", "text_animation": "typewriter", "colors": {"primary": "#FFFFFF", "accent": "#C75B39", "background": "#000000"}}'
),

-- Stories
(
  'Story Poll Interactive',
  'Template Story avec zone pour sondage, question, et swipe-up.',
  'Stories', 'story',
  ARRAY['instagram'], ARRAY['9:16'],
  '/templates/preview/story-poll.jpg', TRUE, 0,
  ARRAY['story', 'interactive', 'poll', 'engagement'],
  'playful', 'happy',
  '{"background_gradient": ["#C75B39", "#1A1A1A"], "elements": [{"type": "image", "x": 0, "y": 0, "w": 1080, "h": 1200}, {"type": "text", "x": 60, "y": 60, "font_size": 36, "color": "#FFFFFF"}, {"type": "poll", "x": 120, "y": 1400, "options": ["Option 1", "Option 2"]}]}'
),

-- TikTok
(
  'TikTok Challenge Hook',
  'Template TikTok avec hook fort les 3 premières secondes pour maximiser la rétention.',
  'TikTok', 'video',
  ARRAY['tiktok'], ARRAY['9:16'],
  '/templates/preview/tiktok-hook.jpg', TRUE, 0,
  ARRAY['tiktok', 'hook', 'challenge', 'viral'],
  'dynamic', 'energetic',
  '{"scenes": 2, "hook_duration": 3, "scene_duration": 5, "transition": "cut", "text_animation": "bounce", "colors": {"primary": "#FFFFFF", "accent": "#FE2C55", "background": "#000000"}}'
),
(
  'TikTok Green Screen',
  'Template avec fond vert superposé pour commenter ou réagir.',
  'TikTok', 'video',
  ARRAY['tiktok'], ARRAY['9:16'],
  '/templates/preview/tiktok-greenscreen.jpg', TRUE, 0,
  ARRAY['tiktok', 'greenscreen', 'commentary', 'reaction'],
  'playful', 'happy',
  '{"scenes": 1, "layout": "greenscreen", "background_music": "trending", "text_animation": "scroll", "colors": {"primary": "#FFFFFF", "accent": "#00F2EA", "background": "#000000"}}'
),

-- YouTube Shorts
(
  'Shorts Tutorial Step',
  'Template Shorts avec étapes numérotées pour tutoriels rapides.',
  'YouTube Shorts', 'video',
  ARRAY['youtube'], ARRAY['9:16'],
  '/templates/preview/shorts-tutorial.jpg', TRUE, 0,
  ARRAY['shorts', 'tutorial', 'step-by-step', 'educational'],
  'editorial', 'peaceful',
  '{"scenes": 4, "scene_duration": 3, "transition": "slide_up", "show_step_numbers": true, "colors": {"primary": "#FFFFFF", "accent": "#FF0000", "background": "#1A1A1A"}}'
),

-- Carrousels
(
  'Carrousel 5 Pages',
  'Template carrousel de 5 slides : cover + 3 contenus + conclusion avec CTA.',
  'Carrousels', 'carousel',
  ARRAY['instagram', 'linkedin'], ARRAY['1:1', '4:5'],
  '/templates/preview/carousel-5.jpg', TRUE, 0,
  ARRAY['carousel', 'educational', 'slides', 'cta'],
  'editorial', 'calm',
  '{"slides": 5, "colors": {"primary": "#1A1A1A", "accent": "#C75B39", "background": "#FAFAF8"}, "font_heading": "Playfair Display", "font_body": "Inter", "layouts": ["cover", "content", "content", "content", "cta"]}'
),

-- Quotes
(
  'Quote Cinematic',
  'Template citation avec photo en fond et texte imposant. Parfait pour les citations inspirantes.',
  'Quotes', 'photo',
  ARRAY['instagram', 'tiktok', 'youtube'], ARRAY['1:1', '4:5', '9:16'],
  '/templates/preview/quote-cinematic.jpg', TRUE, 0,
  ARRAY['quote', 'cinematic', 'inspirational', 'text'],
  'cinematic', 'dramatic',
  '{"background": "#0A0908", "accent": "#D4AF37", "font_heading": "Playfair Display", "font_body": "Inter", "layers": [{"type": "image", "x": 0, "y": 0, "w": 1080, "h": 1080, "opacity": 0.4}, {"type": "text", "x": 120, "y": 300, "font_size": 48, "color": "#FFFFFF", "align": "center", "max_width": 840}, {"type": "text", "x": 120, "y": 700, "font_size": 14, "color": "#D4AF37", "align": "center"}]}'
),

-- Promo
(
  'Promo Launch',
  'Template de lancement avec compte à rebours et bouton CTA visuel.',
  'Promo', 'photo',
  ARRAY['instagram', 'tiktok'], ARRAY['1:1', '4:5', '9:16'],
  '/templates/preview/promo-launch.jpg', TRUE, 0,
  ARRAY['promo', 'launch', 'countdown', 'cta', 'sale'],
  'dynamic', 'energetic',
  '{"background": "#C75B39", "accent": "#FFFFFF", "font_heading": "Instrument Sans", "font_body": "Inter", "layers": [{"type": "text", "x": 60, "y": 200, "font_size": 64, "color": "#FFFFFF", "align": "center"}, {"type": "text", "x": 60, "y": 400, "font_size": 18, "color": "#FFFFFF", "align": "center", "opacity": 0.8}, {"type": "countdown", "x": 200, "y": 550, "color": "#FFFFFF"}, {"type": "cta", "x": 340, "y": 750, "text": "JE DÉCOUVRE", "color": "#C75B39", "background": "#FFFFFF"}]}'
)

ON CONFLICT DO NOTHING;
