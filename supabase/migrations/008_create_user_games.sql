-- Migration: Create user_games table
-- Document 06, Part 3 — user_games

CREATE TABLE IF NOT EXISTS user_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES game_catalog(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Playing' CHECK (status IN ('Playing', 'Completed', 'On Hold', 'Dropped')),
  hours_played DECIMAL(6,1) DEFAULT 0.0,
  rating DECIMAL(3,1) CHECK (rating IS NULL OR (rating >= 1.0 AND rating <= 10.0)),
  started_at DATE,
  completed_at DATE,
  added_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(profile_id, game_id)
);

-- Indexes for fast library loading, sorting, filtering
CREATE INDEX idx_user_games_profile_id ON user_games(profile_id);
CREATE INDEX idx_user_games_game_id ON user_games(game_id);
CREATE INDEX idx_user_games_status ON user_games(status);
CREATE INDEX idx_user_games_added_at ON user_games(added_at);

-- Row Level Security
ALTER TABLE user_games ENABLE ROW LEVEL SECURITY;

-- Read: owner can always read their own
CREATE POLICY "Users can view own library" ON user_games
  FOR SELECT USING (auth.uid() = profile_id);

-- Insert: owner only
CREATE POLICY "Users can add to own library" ON user_games
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Update: owner only
CREATE POLICY "Users can update own library" ON user_games
  FOR UPDATE USING (auth.uid() = profile_id);

-- Delete: owner only
CREATE POLICY "Users can delete from own library" ON user_games
  FOR DELETE USING (auth.uid() = profile_id);
