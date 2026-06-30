import { createClient } from '@/lib/supabase/server';
import { DatabaseManualGameSubmission } from '@/types/database';

export const manualGameService = {
  async submitGame(data: {
    title: string;
    platform?: string;
    releaseYear?: number;
    igdbUrl?: string;
  }): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'You must be logged in to submit a game.' };
    }

    const { error } = await supabase
      .from('manual_game_submissions')
      .insert({
        submitted_by: user.id,
        title: data.title,
        platform: data.platform || null,
        release_year: data.releaseYear || null,
        igdb_url: data.igdbUrl || null,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }
};
