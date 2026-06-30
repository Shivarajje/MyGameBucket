-- Migration: Create collections and collection_games tables
-- Document 06, Part 4 & Part 5

-- Table 5: collections
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(name) <= 100),
  description TEXT CHECK (description IS NULL OR char_length(description) <= 250),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for collections
CREATE INDEX idx_collections_profile_id ON collections(profile_id);
CREATE INDEX idx_collections_name ON collections(name);

-- Table 6: collection_games
CREATE TABLE IF NOT EXISTS collection_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES game_catalog(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(collection_id, game_id)
);

-- Indexes for collection_games
CREATE INDEX idx_collection_games_collection_id ON collection_games(collection_id);
CREATE INDEX idx_collection_games_game_id ON collection_games(game_id);

-- Enable RLS
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_games ENABLE ROW LEVEL SECURITY;

-- RLS Policies for collections
-- Read:
-- 1. Anyone can view if the profile is public
-- 2. Owner can view regardless of visibility
CREATE POLICY "Anyone can view collections of public profiles" ON collections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = collections.profile_id
      AND profiles.visibility = 'Public'
    )
  );

CREATE POLICY "Users can view own collections" ON collections
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = collections.profile_id
    )
  );

-- Insert/Update/Delete: Owner only
CREATE POLICY "Users can insert own collections" ON collections
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = profile_id
    )
  );

CREATE POLICY "Users can update own collections" ON collections
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = profile_id
    )
  );

CREATE POLICY "Users can delete own collections" ON collections
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = profile_id
    )
  );


-- RLS Policies for collection_games
-- Read:
-- 1. Anyone can view if the parent collection is public (linked to a public profile)
-- 2. Owner can view regardless
CREATE POLICY "Anyone can view collection_games of public collections" ON collection_games
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM collections
      JOIN profiles ON profiles.id = collections.profile_id
      WHERE collections.id = collection_games.collection_id
      AND profiles.visibility = 'Public'
    )
  );

CREATE POLICY "Users can view own collection_games" ON collection_games
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM collections
      JOIN profiles ON profiles.id = collections.profile_id
      WHERE collections.id = collection_games.collection_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Insert: Owner only
CREATE POLICY "Users can insert games into own collections" ON collection_games
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM collections
      JOIN profiles ON profiles.id = collections.profile_id
      WHERE collections.id = collection_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Delete: Owner only
CREATE POLICY "Users can delete games from own collections" ON collection_games
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM collections
      JOIN profiles ON profiles.id = collections.profile_id
      WHERE collections.id = collection_id
      AND profiles.user_id = auth.uid()
    )
  );
