import { libraryRepository, UserGameWithCatalog } from './libraryRepository';
import { profileRepository } from './profileRepository';
import { GameStatus } from '@/constants/enums';

export const libraryService = {
  async getLibrary(
    profileId: string,
    options?: {
      status?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      limit?: number;
      offset?: number;
    }
  ) {
    return libraryRepository.getUserGames(profileId, options);
  },

  async isGameInLibrary(profileId: string, gameId: string): Promise<boolean> {
    const entry = await libraryRepository.getUserGame(profileId, gameId);
    return entry !== null;
  },

  async getGameEntry(profileId: string, gameId: string) {
    return libraryRepository.getUserGame(profileId, gameId);
  },

  async addToLibrary(profileId: string, gameId: string, status: GameStatus = GameStatus.Playing) {
    return libraryRepository.addGame({
      profile_id: profileId,
      game_id: gameId,
      status,
      hours_played: 0,
      rating: null,
      started_at: null,
      completed_at: null,
    });
  },

  async updateEntry(
    id: string,
    profileId: string,
    updates: {
      status?: GameStatus;
      hours_played?: number;
      rating?: number | null;
      started_at?: string | null;
      completed_at?: string | null;
    }
  ) {
    return libraryRepository.updateGame(id, profileId, updates);
  },

  async removeFromLibrary(id: string, profileId: string) {
    return libraryRepository.removeGame(id, profileId);
  },

  async getStats(profileId: string) {
    return libraryRepository.getLibraryStats(profileId);
  },

  // Another user's library, as seen by the (optionally anonymous) viewer.
  // Visibility gating happens in the API route via friendshipService.canViewProfile;
  // RLS enforces it again at the database level. commonGameIds marks games the
  // viewer also has in their own library ("Games in Common").
  async getProfileLibrary(viewerUserId: string | null, profileId: string) {
    const { data: entries, count } = await libraryRepository.getUserGames(profileId, {
      sortBy: 'updated_at',
      sortOrder: 'desc',
    });

    let commonGameIds: string[] = [];
    if (viewerUserId) {
      const viewerProfile = await profileRepository.getByUserId(viewerUserId);
      if (viewerProfile && viewerProfile.id !== profileId) {
        const { data: viewerEntries } = await libraryRepository.getUserGames(viewerProfile.id);
        const viewerGameIds = new Set(viewerEntries.map((e) => e.game_id));
        commonGameIds = entries
          .filter((e) => viewerGameIds.has(e.game_id))
          .map((e) => e.game_id);
      }
    }

    return { entries, count, commonGameIds };
  },
};
