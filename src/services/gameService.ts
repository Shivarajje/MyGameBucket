import { externalGameApi } from './externalGameApi';
import { gameRepository } from './gameRepository';
import { GameDetail, GameSearchResult } from '@/types/game';
import { DatabaseGameCatalog } from '@/types/database';

// 7 days in milliseconds
const SYNC_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000;

export const gameService = {
  async search(query: string): Promise<GameSearchResult[]> {
    // For search, we always hit IGDB directly to get the broadest results.
    // In the future, we could search the local catalog first, but IGDB is the source of truth.
    return externalGameApi.searchGames(query);
  },

  async getPopularGames(limit = 10): Promise<GameSearchResult[]> {
    return externalGameApi.getPopularGames(limit);
  },

  async getGame(slug: string): Promise<GameDetail | null> {
    // 1. Check local database first
    const localGame = await gameRepository.getGameBySlug(slug);

    let needsSync = false;
    
    if (!localGame) {
      needsSync = true;
    } else {
      const lastSynced = new Date(localGame.last_synced_at).getTime();
      const now = Date.now();
      if (now - lastSynced > SYNC_THRESHOLD_MS) {
        needsSync = true;
      }
    }

    // 2. If local data is fresh, use it but still fetch screenshots from IGDB
    if (localGame && !needsSync) {
      const detail = this.mapDatabaseToGameDetail(localGame);
      // Screenshots aren't stored in DB, always fetch them live
      try {
        const igdbGame = await externalGameApi.getGameBySlug(slug);
        if (igdbGame) {
          detail.screenshots = igdbGame.screenshots;
          detail.genre = igdbGame.genre;
        }
      } catch {
        // If IGDB fails, we just won't have screenshots — not a fatal error
      }
      return detail;
    }

    // 3. Fetch from IGDB if missing or stale
    try {
      const igdbGame = await externalGameApi.getGameBySlug(slug);
      
      if (!igdbGame) {
        return localGame ? this.mapDatabaseToGameDetail(localGame) : null;
      }

      // 4. Upsert to local database
      const upsertData = {
        ...(localGame ? { id: localGame.id } : {}),
        igdb_id: igdbGame.igdbId,
        slug: igdbGame.slug,
        title: igdbGame.title,
        cover_url: igdbGame.coverUrl,
        genre: igdbGame.genre,
        platform: igdbGame.platform,
        release_year: igdbGame.releaseYear,
        developer: igdbGame.developer,
        summary: igdbGame.summary,
      };

      const syncedGame = await gameRepository.upsertGame(upsertData);

      // We attach the screenshots from the live IGDB response (we don't store them in DB to save space)
      const fullDetail = this.mapDatabaseToGameDetail(syncedGame);
      fullDetail.screenshots = igdbGame.screenshots;

      return fullDetail;
      
    } catch (error) {
      console.error('Error fetching game from IGDB:', error);
      // Fallback to local if IGDB request fails
      if (localGame) {
        return this.mapDatabaseToGameDetail(localGame);
      }
      return null;
    }
  },

  mapDatabaseToGameDetail(dbGame: DatabaseGameCatalog): GameDetail {
    return {
      id: dbGame.id,
      igdbId: dbGame.igdb_id,
      slug: dbGame.slug,
      title: dbGame.title,
      coverUrl: dbGame.cover_url,
      genre: dbGame.genre,
      platform: dbGame.platform,
      releaseYear: dbGame.release_year,
      developer: dbGame.developer,
      summary: dbGame.summary,
      lastSyncedAt: dbGame.last_synced_at,
      createdAt: dbGame.created_at,
      screenshots: [], // Hydrated dynamically if fetched fresh from IGDB
    };
  }
};
