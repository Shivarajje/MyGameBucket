-- Migration: Visibility-aware read policies for profile content
-- Replaces owner-only / public-only SELECT policies on user_games,
-- journal_entries, collections, and collection_games with a single
-- helper that mirrors friendshipService.canViewProfile:
--   - owner always sees own content
--   - a block in either direction hides content
--   - 'Public' is visible to everyone (including anonymous)
--   - 'FriendsOnly' is visible to accepted friends
--   - 'Private' is owner-only
-- SECURITY DEFINER lets the helper consult profiles/friendships/blocked_users
-- without being constrained by their own RLS policies.

CREATE OR REPLACE FUNCTION can_view_profile_content(target_profile_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_visibility text;
  viewer_profile_id uuid;
BEGIN
  SELECT visibility INTO target_visibility
  FROM profiles WHERE id = target_profile_id;

  IF target_visibility IS NULL THEN
    RETURN false; -- profile does not exist
  END IF;

  SELECT id INTO viewer_profile_id
  FROM profiles WHERE user_id = auth.uid();

  -- Owner always sees own content
  IF viewer_profile_id IS NOT NULL AND viewer_profile_id = target_profile_id THEN
    RETURN true;
  END IF;

  -- A block in either direction hides content regardless of visibility
  IF viewer_profile_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM blocked_users
    WHERE (blocker_id = target_profile_id AND blocked_id = viewer_profile_id)
       OR (blocker_id = viewer_profile_id AND blocked_id = target_profile_id)
  ) THEN
    RETURN false;
  END IF;

  IF target_visibility = 'Public' THEN
    RETURN true;
  END IF;

  IF target_visibility = 'FriendsOnly' THEN
    RETURN viewer_profile_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM friendships
      WHERE status = 'Accepted'
        AND ((requester_id = viewer_profile_id AND addressee_id = target_profile_id)
          OR (requester_id = target_profile_id AND addressee_id = viewer_profile_id))
    );
  END IF;

  RETURN false; -- 'Private' (non-owner) or unknown value
END;
$$;

-- user_games: was owner-only (013)
DROP POLICY IF EXISTS "Users can view own library" ON user_games;
DROP POLICY IF EXISTS "Users can view viewable libraries" ON user_games;
CREATE POLICY "Users can view viewable libraries" ON user_games
  FOR SELECT USING (can_view_profile_content(profile_id));

-- journal_entries: was public-or-owner (010); now friends-aware and block-aware
DROP POLICY IF EXISTS "Anyone can view journal entries of public profiles" ON journal_entries;
DROP POLICY IF EXISTS "Users can view own journal entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can view viewable journal entries" ON journal_entries;
CREATE POLICY "Users can view viewable journal entries" ON journal_entries
  FOR SELECT USING (can_view_profile_content(profile_id));

-- collections: was public-or-owner (011); now friends-aware and block-aware
DROP POLICY IF EXISTS "Anyone can view collections of public profiles" ON collections;
DROP POLICY IF EXISTS "Users can view own collections" ON collections;
DROP POLICY IF EXISTS "Users can view viewable collections" ON collections;
CREATE POLICY "Users can view viewable collections" ON collections
  FOR SELECT USING (can_view_profile_content(profile_id));

-- collection_games: follows the parent collection's owner
DROP POLICY IF EXISTS "Anyone can view collection_games of public collections" ON collection_games;
DROP POLICY IF EXISTS "Users can view own collection_games" ON collection_games;
DROP POLICY IF EXISTS "Users can view viewable collection_games" ON collection_games;
CREATE POLICY "Users can view viewable collection_games" ON collection_games
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_games.collection_id
      AND can_view_profile_content(collections.profile_id)
    )
  );
