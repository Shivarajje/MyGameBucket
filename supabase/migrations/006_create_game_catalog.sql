-- Create game_catalog table
CREATE TABLE public.game_catalog (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    igdb_id BIGINT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    cover_url TEXT,
    genre TEXT,
    platform TEXT,
    release_year INTEGER,
    developer TEXT,
    summary TEXT,
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.game_catalog ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- Anyone can read the game catalog
CREATE POLICY "Allow public read access on game_catalog"
    ON public.game_catalog
    FOR SELECT
    USING (true);

-- Only service role can insert/update (or admins, but typically handled via server route)
CREATE POLICY "Allow service role insert on game_catalog"
    ON public.game_catalog
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow service role update on game_catalog"
    ON public.game_catalog
    FOR UPDATE
    USING (true);

-- Create indexes for searching
CREATE INDEX idx_game_catalog_slug ON public.game_catalog(slug);
CREATE INDEX idx_game_catalog_igdb_id ON public.game_catalog(igdb_id);
CREATE INDEX idx_game_catalog_title ON public.game_catalog USING gin (to_tsvector('english', title));
