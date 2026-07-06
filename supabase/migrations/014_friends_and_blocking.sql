-- 1. Add visibility column to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'Public'
CHECK (visibility IN ('Public', 'Private', 'FriendsOnly'));

-- 2. Create friendships table
CREATE TABLE IF NOT EXISTS friendships (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  addressee_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Prevent duplicate requests in either direction
  CONSTRAINT unique_friendship UNIQUE (requester_id, addressee_id),
  -- Prevent self-friending
  CONSTRAINT no_self_friend CHECK (requester_id != addressee_id)
);

CREATE INDEX IF NOT EXISTS idx_friendships_requester ON friendships(requester_id);
CREATE INDEX IF NOT EXISTS idx_friendships_addressee ON friendships(addressee_id);
CREATE INDEX IF NOT EXISTS idx_friendships_status ON friendships(status);

-- 3. Create blocked_users table
CREATE TABLE IF NOT EXISTS blocked_users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  blocker_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),

  CONSTRAINT unique_block UNIQUE (blocker_id, blocked_id),
  CONSTRAINT no_self_block CHECK (blocker_id != blocked_id)
);

CREATE INDEX IF NOT EXISTS idx_blocked_blocker ON blocked_users(blocker_id);
CREATE INDEX IF NOT EXISTS idx_blocked_blocked ON blocked_users(blocked_id);

-- 4. RLS for friendships
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own friendships"
  ON friendships FOR SELECT
  USING (
    requester_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR addressee_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can send friend requests"
  ON friendships FOR INSERT
  WITH CHECK (
    requester_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Addressee can update friendship status"
  ON friendships FOR UPDATE
  USING (
    addressee_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own friendships"
  ON friendships FOR DELETE
  USING (
    requester_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR addressee_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- 5. RLS for blocked_users
ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own blocks"
  ON blocked_users FOR SELECT
  USING (
    blocker_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can block others"
  ON blocked_users FOR INSERT
  WITH CHECK (
    blocker_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can unblock others"
  ON blocked_users FOR DELETE
  USING (
    blocker_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );
