-- Migration: Create journal_entries table
-- Document 06, Part 4 — journal_entries

CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES game_catalog(id) ON DELETE CASCADE,
  entry TEXT NOT NULL CHECK (char_length(entry) <= 280),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(profile_id, game_id)
);

-- Indexes for fast profile loading, game page loading, personal history
CREATE INDEX idx_journal_entries_profile_id ON journal_entries(profile_id);
CREATE INDEX idx_journal_entries_game_id ON journal_entries(game_id);
CREATE INDEX idx_journal_entries_updated_at ON journal_entries(updated_at);

-- Row Level Security
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Read:
-- 1. Anyone can view if the profile is public
-- 2. Owner can view regardless of visibility
CREATE POLICY "Anyone can view journal entries of public profiles" ON journal_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = journal_entries.profile_id
      AND profiles.visibility = 'Public'
    )
  );

CREATE POLICY "Users can view own journal entries" ON journal_entries
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = journal_entries.profile_id
    )
  );

-- Insert: Owner only
CREATE POLICY "Users can insert own journal entries" ON journal_entries
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = profile_id
    )
  );

-- Update: Owner only
CREATE POLICY "Users can update own journal entries" ON journal_entries
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = profile_id
    )
  );

-- Delete: Owner only
CREATE POLICY "Users can delete own journal entries" ON journal_entries
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = profile_id
    )
  );
