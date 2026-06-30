import { createClient } from '@/lib/supabase/server';
import { DatabaseProfile } from '@/types/database';

export const profileRepository = {
  async getByUserId(userId: string): Promise<DatabaseProfile | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data as DatabaseProfile | null;
  },

  async getByUsername(username: string): Promise<DatabaseProfile | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('username', username)
      .maybeSingle();

    if (error) throw error;
    return data as DatabaseProfile | null;
  },

  async getById(id: string): Promise<DatabaseProfile | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as DatabaseProfile | null;
  },

  async searchPublicProfiles(query: string): Promise<DatabaseProfile[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('visibility', 'Public')
      .ilike('username', `%${query}%`)
      .limit(20);

    if (error) throw error;
    return (data || []) as DatabaseProfile[];
  },

  async updateProfile(
    userId: string,
    updates: Partial<Pick<DatabaseProfile, 'username' | 'avatar_url' | 'bio' | 'favorite_game_id' | 'favorite_genre'>>
  ): Promise<DatabaseProfile> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as DatabaseProfile;
  },
};
