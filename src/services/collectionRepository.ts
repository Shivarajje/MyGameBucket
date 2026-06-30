import { createClient } from '@/lib/supabase/server';
import { DatabaseCollection, DatabaseCollectionGame, DatabaseGameCatalog } from '@/types/database';

export type CollectionWithGamesCount = DatabaseCollection & {
  games_count: number;
};

export const collectionRepository = {
  async listByProfileId(profileId: string): Promise<CollectionWithGamesCount[]> {
    const supabase = await createClient();
    
    // Fetch collections
    const { data: collections, error: colsError } = await supabase
      .from('collections')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });

    if (colsError) throw colsError;

    // Fetch counts of games in each collection
    const collectionIds = collections.map(c => c.id);
    if (collectionIds.length === 0) return [];

    const { data: counts, error: countsError } = await supabase
      .from('collection_games')
      .select('collection_id')
      .in('collection_id', collectionIds);

    if (countsError) throw countsError;

    // Map counts
    const countMap = (counts || []).reduce((acc: Record<string, number>, curr) => {
      acc[curr.collection_id] = (acc[curr.collection_id] || 0) + 1;
      return acc;
    }, {});

    return collections.map(c => ({
      ...c,
      games_count: countMap[c.id] || 0,
    })) as CollectionWithGamesCount[];
  },

  async getById(collectionId: string): Promise<DatabaseCollection | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('id', collectionId)
      .maybeSingle();

    if (error) throw error;
    return data as DatabaseCollection | null;
  },

  async getGames(collectionId: string): Promise<DatabaseGameCatalog[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('collection_games')
      .select('game_catalog(*)')
      .eq('collection_id', collectionId);

    if (error) throw error;
    return (data || []).map((item: any) => item.game_catalog) as DatabaseGameCatalog[];
  },

  async countByProfileId(profileId: string): Promise<number> {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from('collections')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profileId);

    if (error) throw error;
    return count || 0;
  },

  async create(profileId: string, name: string, description: string | null): Promise<DatabaseCollection> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('collections')
      .insert({
        profile_id: profileId,
        name,
        description,
      })
      .select()
      .single();

    if (error) throw error;
    return data as DatabaseCollection;
  },

  async update(
    collectionId: string,
    profileId: string,
    updates: Partial<Pick<DatabaseCollection, 'name' | 'description'>>
  ): Promise<DatabaseCollection> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('collections')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', collectionId)
      .eq('profile_id', profileId)
      .select()
      .single();

    if (error) throw error;
    return data as DatabaseCollection;
  },

  async delete(collectionId: string, profileId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', collectionId)
      .eq('profile_id', profileId);

    if (error) throw error;
  },

  async addGame(collectionId: string, gameId: string): Promise<DatabaseCollectionGame> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('collection_games')
      .insert({
        collection_id: collectionId,
        game_id: gameId,
      })
      .select()
      .single();

    if (error) throw error;
    return data as DatabaseCollectionGame;
  },

  async removeGame(collectionId: string, gameId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('collection_games')
      .delete()
      .eq('collection_id', collectionId)
      .eq('game_id', gameId);

    if (error) throw error;
  },

  async isGameInCollection(collectionId: string, gameId: string): Promise<boolean> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('collection_games')
      .select('id')
      .eq('collection_id', collectionId)
      .eq('game_id', gameId)
      .maybeSingle();

    if (error) throw error;
    return data !== null;
  },
};
