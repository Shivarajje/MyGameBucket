import { profileRepository } from './profileRepository';
import { libraryRepository } from './libraryRepository';
import { DatabaseProfile } from '@/types/database';

export const profileService = {
  async getProfileByUsername(username: string) {
    const profile = await profileRepository.getByUsername(username);
    if (!profile) return null;

    const stats = await libraryRepository.getLibraryStats(profile.id);

    return {
      profile,
      stats,
    };
  },

  async getProfileByUserId(userId: string) {
    return profileRepository.getByUserId(userId);
  },

  async searchUsers(query: string) {
    const trimmed = query.trim();
    if (!trimmed) return [];
    return profileRepository.searchPublicProfiles(trimmed);
  },

  async getCurrentProfile(userId: string) {
    return profileRepository.getByUserId(userId);
  },

  async updateProfile(
    userId: string,
    updates: Partial<Pick<DatabaseProfile, 'username' | 'avatar_url' | 'bio' | 'favorite_game_id' | 'favorite_genre' | 'visibility'>>
  ) {
    // Validate username length
    if (updates.username) {
      if (updates.username.length < 3 || updates.username.length > 30) {
        throw new Error('Username must be between 3 and 30 characters');
      }
    }

    // Validate bio length
    if (updates.bio && updates.bio.length > 100) {
      throw new Error('Bio must be 100 characters or less');
    }

    // Validate visibility
    if (updates.visibility) {
      if (!['Public', 'Private', 'FriendsOnly'].includes(updates.visibility)) {
        throw new Error('Invalid visibility option');
      }
    }

    return profileRepository.updateProfile(userId, updates);
  },
};
