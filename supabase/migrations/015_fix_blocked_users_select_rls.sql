-- Migration: Widen blocked_users SELECT policy to both directions
-- The app needs to detect "blocked by them" states (friendship status,
-- profile visibility checks, discovery filtering), but the original policy
-- only exposed rows where the current user is the blocker. Queries for
-- "who blocked me" silently returned empty under RLS.

DROP POLICY IF EXISTS "Users can view own blocks" ON blocked_users;
DROP POLICY IF EXISTS "Users can view blocks involving them" ON blocked_users;

CREATE POLICY "Users can view blocks involving them" ON blocked_users
  FOR SELECT USING (
    blocker_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR blocked_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );
