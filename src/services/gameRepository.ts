import { createClient } from '@/lib/supabase/server';
import { DatabaseGameCatalog } from '@/types/database';

export const gameRepository = {
  async getGameBySlug(slug: string): Promise<DatabaseGameCatalog | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('game_catalog')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) return null;
    return data as DatabaseGameCatalog;
  },

  async upsertGame(game: Omit<DatabaseGameCatalog, 'id' | 'created_at' | 'last_synced_at'> & { id?: string }): Promise<DatabaseGameCatalog> {
    const supabase = await createClient();
    
    // If we have an id, it's an update, otherwise it's an insert based on unique igdb_id/slug
    const { data, error } = await supabase
      .from('game_catalog')
      .upsert({
        ...game,
        last_synced_at: new Date().toISOString(),
      }, { onConflict: 'igdb_id' })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to upsert game: ${error.message}`);
    }

    return data as DatabaseGameCatalog;
  }
};
