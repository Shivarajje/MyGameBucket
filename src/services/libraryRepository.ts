import { createClient } from '@/lib/supabase/server';
import { DatabaseUserGame } from '@/types/database';

export type UserGameWithCatalog = DatabaseUserGame & {
  game_catalog: {
    id: string;
    title: string;
    slug: string;
    cover_url: string | null;
    genre: string | null;
    platform: string | null;
    release_year: number | null;
    developer: string | null;
  };
};

export const libraryRepository = {
  async getUserGames(
    profileId: string,
    options?: {
      status?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      limit?: number;
      offset?: number;
    }
  ): Promise<{ data: UserGameWithCatalog[]; count: number }> {
    const supabase = await createClient();

    let query = supabase
      .from('user_games')
      .select('*, game_catalog(*)', { count: 'exact' })
      .eq('profile_id', profileId);

    // Filter by status
    if (options?.status) {
      query = query.eq('status', options.status);
    }

    // Sorting
    const sortBy = options?.sortBy || 'added_at';
    const sortOrder = options?.sortOrder || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Pagination
    if (options?.limit) {
      const offset = options.offset || 0;
      query = query.range(offset, offset + options.limit - 1);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data: (data || []) as UserGameWithCatalog[],
      count: count || 0,
    };
  },

  async getUserGame(profileId: string, gameId: string): Promise<DatabaseUserGame | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('user_games')
      .select('*')
      .eq('profile_id', profileId)
      .eq('game_id', gameId)
      .maybeSingle();

    if (error) throw error;
    return data as DatabaseUserGame | null;
  },

  async addGame(entry: Omit<DatabaseUserGame, 'id' | 'created_at' | 'updated_at' | 'added_at'>): Promise<DatabaseUserGame> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('user_games')
      .insert(entry)
      .select()
      .single();

    if (error) throw error;
    return data as DatabaseUserGame;
  },

  async updateGame(
    id: string,
    profileId: string,
    updates: Partial<Pick<DatabaseUserGame, 'status' | 'hours_played' | 'rating' | 'started_at' | 'finished_at'>>
  ): Promise<DatabaseUserGame> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('user_games')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('profile_id', profileId)
      .select()
      .single();

    if (error) throw error;
    return data as DatabaseUserGame;
  },

  async removeGame(id: string, profileId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('user_games')
      .delete()
      .eq('id', id)
      .eq('profile_id', profileId);

    if (error) throw error;
  },

  async getLibraryStats(profileId: string): Promise<{
    totalGames: number;
    completedGames: number;
    totalHours: number;
    averageRating: number | null;
  }> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('user_games')
      .select('status, hours_played, rating')
      .eq('profile_id', profileId);

    if (error) throw error;

    const games = data || [];
    const completedGames = games.filter((g) => g.status === 'Completed').length;
    const totalHours = games.reduce((sum, g) => sum + (Number(g.hours_played) || 0), 0);
    const rated = games.filter((g) => g.rating != null);
    const averageRating =
      rated.length > 0
        ? rated.reduce((sum, g) => sum + Number(g.rating), 0) / rated.length
        : null;

    return {
      totalGames: games.length,
      completedGames,
      totalHours: Math.round(totalHours * 10) / 10,
      averageRating: averageRating ? Math.round(averageRating * 10) / 10 : null,
    };
  },
};
