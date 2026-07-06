import { createClient } from '@/lib/supabase/server';
import { DatabaseFriendship, DatabaseBlockedUser, DatabaseProfile, FriendshipStatus } from '@/types/database';

export type FriendshipWithProfile = DatabaseFriendship & {
  friend_profile: DatabaseProfile;
};

export type RequestWithProfile = DatabaseFriendship & {
  requester_profile: DatabaseProfile;
};

export type SentRequestWithProfile = DatabaseFriendship & {
  addressee_profile: DatabaseProfile;
};

export const friendshipRepository = {
  async sendRequest(requesterId: string, addresseeId: string): Promise<DatabaseFriendship> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('friendships')
      .insert({ requester_id: requesterId, addressee_id: addresseeId })
      .select()
      .single();

    if (error) throw error;
    return data as DatabaseFriendship;
  },

  async getById(id: string): Promise<DatabaseFriendship | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('friendships')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as DatabaseFriendship | null;
  },

  async getFriends(profileId: string): Promise<FriendshipWithProfile[]> {
    const supabase = await createClient();

    // Get friendships where user is requester
    const { data: asRequester, error: err1 } = await supabase
      .from('friendships')
      .select('*, addressee:profiles!friendships_addressee_id_fkey(*)')
      .eq('requester_id', profileId)
      .eq('status', 'Accepted');

    if (err1) throw err1;

    // Get friendships where user is addressee
    const { data: asAddressee, error: err2 } = await supabase
      .from('friendships')
      .select('*, requester:profiles!friendships_requester_id_fkey(*)')
      .eq('addressee_id', profileId)
      .eq('status', 'Accepted');

    if (err2) throw err2;

    const friends: FriendshipWithProfile[] = [];

    for (const f of (asRequester || [])) {
      friends.push({
        ...f,
        friend_profile: (f as any).addressee as DatabaseProfile,
      });
    }

    for (const f of (asAddressee || [])) {
      friends.push({
        ...f,
        friend_profile: (f as any).requester as DatabaseProfile,
      });
    }

    return friends;
  },

  async getPendingRequests(profileId: string): Promise<RequestWithProfile[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('friendships')
      .select('*, requester:profiles!friendships_requester_id_fkey(*)')
      .eq('addressee_id', profileId)
      .eq('status', 'Pending')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((f: any) => ({
      ...f,
      requester_profile: f.requester as DatabaseProfile,
    }));
  },

  async getSentRequests(profileId: string): Promise<SentRequestWithProfile[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('friendships')
      .select('*, addressee:profiles!friendships_addressee_id_fkey(*)')
      .eq('requester_id', profileId)
      .eq('status', 'Pending')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((f: any) => ({
      ...f,
      addressee_profile: f.addressee as DatabaseProfile,
    }));
  },

  async getPendingCount(profileId: string): Promise<number> {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from('friendships')
      .select('id', { count: 'exact', head: true })
      .eq('addressee_id', profileId)
      .eq('status', 'Pending');

    if (error) throw error;
    return count || 0;
  },

  async getFriendshipBetween(profileId1: string, profileId2: string): Promise<DatabaseFriendship | null> {
    const supabase = await createClient();

    // Check both directions
    const { data: d1, error: e1 } = await supabase
      .from('friendships')
      .select('*')
      .eq('requester_id', profileId1)
      .eq('addressee_id', profileId2)
      .neq('status', 'Rejected')
      .maybeSingle();

    if (e1) throw e1;
    if (d1) return d1 as DatabaseFriendship;

    const { data: d2, error: e2 } = await supabase
      .from('friendships')
      .select('*')
      .eq('requester_id', profileId2)
      .eq('addressee_id', profileId1)
      .neq('status', 'Rejected')
      .maybeSingle();

    if (e2) throw e2;
    return d2 as DatabaseFriendship | null;
  },

  async updateStatus(id: string, status: FriendshipStatus): Promise<DatabaseFriendship> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('friendships')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as DatabaseFriendship;
  },

  async deleteFriendship(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async areFriends(profileId1: string, profileId2: string): Promise<boolean> {
    const friendship = await this.getFriendshipBetween(profileId1, profileId2);
    return friendship?.status === 'Accepted';
  },

  // --- Block operations ---

  async blockUser(blockerId: string, blockedId: string): Promise<DatabaseBlockedUser> {
    const supabase = await createClient();

    // First, delete any existing friendship between the two
    const friendship = await this.getFriendshipBetween(blockerId, blockedId);
    if (friendship) {
      await this.deleteFriendship(friendship.id);
    }

    const { data, error } = await supabase
      .from('blocked_users')
      .insert({ blocker_id: blockerId, blocked_id: blockedId })
      .select()
      .single();

    if (error) throw error;
    return data as DatabaseBlockedUser;
  },

  async unblockUser(blockerId: string, blockedId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('blocked_users')
      .delete()
      .eq('blocker_id', blockerId)
      .eq('blocked_id', blockedId);

    if (error) throw error;
  },

  async getBlockedUsers(blockerId: string): Promise<(DatabaseBlockedUser & { blocked_profile: DatabaseProfile })[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blocked_users')
      .select('*, blocked:profiles!blocked_users_blocked_id_fkey(*)')
      .eq('blocker_id', blockerId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((b: any) => ({
      ...b,
      blocked_profile: b.blocked as DatabaseProfile,
    }));
  },

  async isBlocked(blockerId: string, blockedId: string): Promise<boolean> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blocked_users')
      .select('id')
      .eq('blocker_id', blockerId)
      .eq('blocked_id', blockedId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  async isBlockedEitherWay(profileId1: string, profileId2: string): Promise<boolean> {
    const a = await this.isBlocked(profileId1, profileId2);
    if (a) return true;
    return this.isBlocked(profileId2, profileId1);
  },

  // --- Discovery ---

  async getRandomPublicProfiles(excludeProfileId: string | null, limit: number = 12): Promise<DatabaseProfile[]> {
    const supabase = await createClient();

    // Get blocked IDs to exclude
    let blockedIds: string[] = [];
    if (excludeProfileId) {
      const { data: blocks } = await supabase
        .from('blocked_users')
        .select('blocked_id')
        .eq('blocker_id', excludeProfileId);
      blockedIds = (blocks || []).map((b: any) => b.blocked_id);

      const { data: blockedBy } = await supabase
        .from('blocked_users')
        .select('blocker_id')
        .eq('blocked_id', excludeProfileId);
      blockedIds = [...blockedIds, ...(blockedBy || []).map((b: any) => b.blocker_id)];
    }

    let query = supabase
      .from('profiles')
      .select('*')
      .eq('visibility', 'Public')
      .order('created_at', { ascending: false })
      .limit(limit * 3);

    if (excludeProfileId) {
      query = query.neq('id', excludeProfileId);
    }

    const { data, error } = await query;
    if (error) throw error;

    let profiles = (data || []) as DatabaseProfile[];

    if (blockedIds.length > 0) {
      profiles = profiles.filter(p => !blockedIds.includes(p.id));
    }

    // Shuffle and take limit
    for (let i = profiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [profiles[i], profiles[j]] = [profiles[j], profiles[i]];
    }

    return profiles.slice(0, limit);
  },
};
