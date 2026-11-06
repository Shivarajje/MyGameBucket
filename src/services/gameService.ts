import { externalGameApi } from './externalGameApi';
import { gameRepository } from './gameRepository';
import { GameDetail, GameSearchResult } from '@/types/game';
import { DatabaseGameCatalog } from '@/types/database';

// 7 days in milliseconds
const SYNC_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000;

export const gameService = {
  async search(query: string, limit = 30, offset = 0, genre?: string): Promise<GameSearchResult[]> {
    try {
      const results = await externalGameApi.searchGames(query, limit, offset);
      if (!genre) return results;
      return results.filter(
        (game) => game.genre?.toLowerCase().includes(genre.toLowerCase())
      );
    } catch (err) {
      console.error('Failed to search games from IGDB, falling back to local catalog:', err);
      const dbGames = await gameRepository.getCatalogGames(limit, offset);
      const filtered = dbGames.filter((g) =>
        g.title.toLowerCase().includes(query.toLowerCase())
      );
      const results: GameSearchResult[] = filtered.map((g) => ({
        igdbId: g.igdb_id,
        title: g.title,
        slug: g.slug,
        coverUrl: g.cover_url || '/placeholder.png',
        releaseYear: g.release_year,
        genre: g.genre,
        platform: g.platform,
      }));
      if (!genre) return results;
      return results.filter(
        (game) => game.genre?.toLowerCase().includes(genre.toLowerCase())
      );
    }
  },

  async getPopularGames(limit = 30, offset = 0, genre?: string): Promise<GameSearchResult[]> {
    try {
      const results = await externalGameApi.getPopularGames(limit, offset);
      if (!genre) return results;
      return results.filter(
        (game) => game.genre?.toLowerCase().includes(genre.toLowerCase())
      );
    } catch (err) {
      console.error('Failed to get popular games from IGDB, falling back to local catalog:', err);
      const dbGames = await gameRepository.getCatalogGames(limit, offset);
      const results: GameSearchResult[] = dbGames.map((g) => ({
        igdbId: g.igdb_id,
        title: g.title,
        slug: g.slug,
        coverUrl: g.cover_url || '/placeholder.png',
        releaseYear: g.release_year,
        genre: g.genre,
        platform: g.platform,
      }));
      if (!genre) return results;
      return results.filter(
        (game) => game.genre?.toLowerCase().includes(genre.toLowerCase())
      );
    }
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
