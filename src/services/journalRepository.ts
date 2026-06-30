import { createClient } from '@/lib/supabase/server';
import { DatabaseJournalEntry } from '@/types/database';

export type JournalEntryWithGame = DatabaseJournalEntry & {
  game_catalog: {
    id: string;
    title: string;
    slug: string;
    cover_url: string | null;
    genre: string | null;
    platform: string | null;
    release_year: number | null;
  };
};

export const journalRepository = {
  async getByGameId(profileId: string, gameId: string): Promise<DatabaseJournalEntry | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('profile_id', profileId)
      .eq('game_id', gameId)
      .maybeSingle();

    if (error) throw error;
    return data as DatabaseJournalEntry | null;
  },

  async getByProfileId(profileId: string): Promise<JournalEntryWithGame[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*, game_catalog(*)')
      .eq('profile_id', profileId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return (data || []) as JournalEntryWithGame[];
  },

  async upsert(entry: Omit<DatabaseJournalEntry, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseJournalEntry> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('journal_entries')
      .upsert(
        {
          profile_id: entry.profile_id,
          game_id: entry.game_id,
          entry: entry.entry,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'profile_id,game_id' }
      )
      .select()
      .single();

    if (error) throw error;
    return data as DatabaseJournalEntry;
  },

  async delete(profileId: string, gameId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('profile_id', profileId)
      .eq('game_id', gameId);

    if (error) throw error;
  },
};
