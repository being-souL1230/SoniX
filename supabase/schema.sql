-- ==============================================================================
-- SoniX Supabase Database Schema
-- Run this script in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Create community_scenarios table
CREATE TABLE IF NOT EXISTS public.community_scenarios (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    options JSONB NOT NULL,
    insight TEXT,
    author_label TEXT DEFAULT 'A fellow thinker',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create community_perspectives table
CREATE TABLE IF NOT EXISTS public.community_perspectives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scenario_id TEXT NOT NULL,
    selected_option TEXT NOT NULL,
    reasoning TEXT NOT NULL,
    anonymous_label TEXT DEFAULT 'A fellow thinker',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Indexes for fast real-time lookups & sorting
CREATE INDEX IF NOT EXISTS idx_community_scenarios_created_at 
    ON public.community_scenarios (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_community_perspectives_scenario_id 
    ON public.community_perspectives (scenario_id);

CREATE INDEX IF NOT EXISTS idx_community_perspectives_created_at 
    ON public.community_perspectives (created_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.community_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_perspectives ENABLE ROW LEVEL SECURITY;

-- 5. Policies: Anyone can view and insert community questions
DROP POLICY IF EXISTS "Public can view community scenarios" ON public.community_scenarios;
CREATE POLICY "Public can view community scenarios" ON public.community_scenarios
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert community scenarios" ON public.community_scenarios;
CREATE POLICY "Public can insert community scenarios" ON public.community_scenarios
    FOR INSERT WITH CHECK (true);

-- 6. Policies: Anyone can view and submit perspectives anonymously
DROP POLICY IF EXISTS "Public can view community perspectives" ON public.community_perspectives;
CREATE POLICY "Public can view community perspectives" ON public.community_perspectives
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert community perspectives" ON public.community_perspectives;
CREATE POLICY "Public can insert community perspectives" ON public.community_perspectives
    FOR INSERT WITH CHECK (true);

-- 7. Enable Realtime publication for instant live updates across visitors
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'community_scenarios'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.community_scenarios;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'community_perspectives'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.community_perspectives;
  END IF;
END $$;
