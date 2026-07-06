import { friendshipRepository } from './friendshipRepository';
import { profileRepository } from './profileRepository';
import { libraryRepository } from './libraryRepository';

export const friendshipService = {
  async sendFriendRequest(userId: string, targetProfileId: string) {
    const profile = await profileRepository.getByUserId(userId);
    if (!profile) throw new Error('Profile not found');

    if (profile.id === targetProfileId) {
      throw new Error('Cannot send friend request to yourself');
    }

    // Check if blocked
    const blocked = await friendshipRepository.isBlockedEitherWay(profile.id, targetProfileId);
    if (blocked) throw new Error('Cannot send friend request');

    // Check existing friendship
    const existing = await friendshipRepository.getFriendshipBetween(profile.id, targetProfileId);
    if (existing) {
      if (existing.status === 'Accepted') throw new Error('Already friends');
      if (existing.status === 'Pending') throw new Error('Friend request already pending');
    }

    return friendshipRepository.sendRequest(profile.id, targetProfileId);
  },

  async acceptRequest(userId: string, friendshipId: string) {
    const profile = await profileRepository.getByUserId(userId);
    if (!profile) throw new Error('Profile not found');

    const friendship = await friendshipRepository.getById(friendshipId);
    if (!friendship) throw new Error('Request not found');
    if (friendship.addressee_id !== profile.id) throw new Error('Not authorized');
    if (friendship.status !== 'Pending') throw new Error('Request is not pending');

    return friendshipRepository.updateStatus(friendshipId, 'Accepted');
  },

  async rejectRequest(userId: string, friendshipId: string) {
    const profile = await profileRepository.getByUserId(userId);
    if (!profile) throw new Error('Profile not found');

    const friendship = await friendshipRepository.getById(friendshipId);
    if (!friendship) throw new Error('Request not found');
    if (friendship.addressee_id !== profile.id) throw new Error('Not authorized');
    if (friendship.status !== 'Pending') throw new Error('Request is not pending');

    // Delete instead of updating to "Rejected" so they can re-send later
    await friendshipRepository.deleteFriendship(friendshipId);
  },

  async removeFriend(userId: string, friendshipId: string) {
    const profile = await profileRepository.getByUserId(userId);
    if (!profile) throw new Error('Profile not found');

    const friendship = await friendshipRepository.getById(friendshipId);
    if (!friendship) throw new Error('Friendship not found');

    if (friendship.requester_id !== profile.id && friendship.addressee_id !== profile.id) {
      throw new Error('Not authorized');
    }

    await friendshipRepository.deleteFriendship(friendshipId);
  },

  async cancelRequest(userId: string, friendshipId: string) {
    const profile = await profileRepository.getByUserId(userId);
    if (!profile) throw new Error('Profile not found');

    const friendship = await friendshipRepository.getById(friendshipId);
    if (!friendship) throw new Error('Request not found');
    if (friendship.requester_id !== profile.id) throw new Error('Not authorized');
    if (friendship.status !== 'Pending') throw new Error('Request is not pending');

    await friendshipRepository.deleteFriendship(friendshipId);
  },

  async getFriends(userId: string) {
    const profile = await profileRepository.getByUserId(userId);
    if (!profile) throw new Error('Profile not found');
    return friendshipRepository.getFriends(profile.id);
  },

  async getPendingRequests(userId: string) {
    const profile = await profileRepository.getByUserId(userId);
    if (!profile) throw new Error('Profile not found');
    return friendshipRepository.getPendingRequests(profile.id);
  },

  async getSentRequests(userId: string) {
    const profile = await profileRepository.getByUserId(userId);
    if (!profile) throw new Error('Profile not found');
    return friendshipRepository.getSentRequests(profile.id);
  },

  async getPendingCount(userId: string) {
    const profile = await profileRepository.getByUserId(userId);
    if (!profile) return 0;
    return friendshipRepository.getPendingCount(profile.id);
  },

  async getFriendshipStatus(userId: string, targetProfileId: string) {
    const profile = await profileRepository.getByUserId(userId);
    if (!profile) return { status: 'none' as const, friendshipId: null, isRequester: false };

    if (profile.id === targetProfileId) {
      return { status: 'self' as const, friendshipId: null, isRequester: false };
    }

    // Check if blocked
    const blockedByMe = await friendshipRepository.isBlocked(profile.id, targetProfileId);
    if (blockedByMe) return { status: 'blocked' as const, friendshipId: null, isRequester: false };

    const blockedByThem = await friendshipRepository.isBlocked(targetProfileId, profile.id);
    if (blockedByThem) return { status: 'blocked_by_them' as const, friendshipId: null, isRequester: false };

    const friendship = await friendshipRepository.getFriendshipBetween(profile.id, targetProfileId);
    if (!friendship) return { status: 'none' as const, friendshipId: null, isRequester: false };

    return {
      status: friendship.status === 'Accepted' ? 'friends' as const
        : friendship.requester_id === profile.id ? 'request_sent' as const
        : 'request_received' as const,
      friendshipId: friendship.id,
      isRequester: friendship.requester_id === profile.id,
    };
  },

  // --- Block operations ---

  async blockUser(userId: string, targetProfileId: string) {
    const profile = await profileRepository.getByUserId(userId);
    if (!profile) throw new Error('Profile not found');

    if (profile.id === targetProfileId) throw new Error('Cannot block yourself');

    return friendshipRepository.blockUser(profile.id, targetProfileId);
  },

  async unblockUser(userId: string, targetProfileId: string) {
    const profile = await profileRepository.getByUserId(userId);
    if (!profile) throw new Error('Profile not found');
    return friendshipRepository.unblockUser(profile.id, targetProfileId);
  },

  async getBlockedUsers(userId: string) {
    const profile = await profileRepository.getByUserId(userId);
    if (!profile) throw new Error('Profile not found');
    return friendshipRepository.getBlockedUsers(profile.id);
  },

  // --- Discovery ---

  async discoverProfiles(userId: string | null, limit: number = 12) {
    let excludeProfileId: string | null = null;
    if (userId) {
      const profile = await profileRepository.getByUserId(userId);
      excludeProfileId = profile?.id || null;
    }

    const profiles = await friendshipRepository.getRandomPublicProfiles(excludeProfileId, limit);

    // Enrich with stats
    const enriched = await Promise.all(
      profiles.map(async (p) => {
        const stats = await libraryRepository.getLibraryStats(p.id);
        return { profile: p, stats };
      })
    );

    return enriched;
  },

  // --- Visibility check ---

  async canViewProfile(viewerUserId: string | null, targetProfile: { id: string; visibility: string }) {
    if (targetProfile.visibility === 'Public') return true;

    if (!viewerUserId) return false;

    const viewerProfile = await profileRepository.getByUserId(viewerUserId);
    if (!viewerProfile) return false;

    // Own profile
    if (viewerProfile.id === targetProfile.id) return true;

    if (targetProfile.visibility === 'Private') return false;

    // FriendsOnly — check friendship
    if (targetProfile.visibility === 'FriendsOnly') {
      return friendshipRepository.areFriends(viewerProfile.id, targetProfile.id);
    }

    return false;
  },
};
