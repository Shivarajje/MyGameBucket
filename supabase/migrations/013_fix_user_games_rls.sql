-- Migration: Fix user_games RLS policies
-- The profile_id column references profiles.id (an auto-generated UUID),
-- NOT auth.users.id. The RLS policies need to join through the profiles table.

-- Drop the old policies that incorrectly compare auth.uid() to profile_id
DROP POLICY IF EXISTS "Users can view own library" ON user_games;
DROP POLICY IF EXISTS "Users can add to own library" ON user_games;
DROP POLICY IF EXISTS "Users can update own library" ON user_games;
DROP POLICY IF EXISTS "Users can delete from own library" ON user_games;

-- Recreate with correct join through profiles table
CREATE POLICY "Users can view own library" ON user_games
  FOR SELECT USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can add to own library" ON user_games
  FOR INSERT WITH CHECK (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own library" ON user_games
  FOR UPDATE USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete from own library" ON user_games
  FOR DELETE USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );
