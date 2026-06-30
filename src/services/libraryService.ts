import { libraryRepository, UserGameWithCatalog } from './libraryRepository';
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
      finished_at: null,
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
      finished_at?: string | null;
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
};
