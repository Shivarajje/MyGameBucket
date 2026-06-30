import { createClient } from '@/lib/supabase/server';
import { DatabaseManualGameSubmission, DatabaseGameCatalog } from '@/types/database';

export const adminRepository = {
  async isAdmin(userId: string): Promise<boolean> {
    const supabase = await createClient();
    
    // Get profile first
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!profile) return false;

    // Check role
    const { data: roleData, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('profile_id', profile.id)
      .maybeSingle();

    if (error || !roleData) return false;
    return roleData.role === 'admin';
  },

  async getPendingSubmissions(): Promise<DatabaseManualGameSubmission[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('manual_game_submissions')
      .select('*')
      .eq('status', 'Pending')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []) as DatabaseManualGameSubmission[];
  },

  async getSubmissionById(id: string): Promise<DatabaseManualGameSubmission | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('manual_game_submissions')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as DatabaseManualGameSubmission | null;
  },

  async updateSubmissionStatus(id: string, status: 'Approved' | 'Rejected', notes: string | null): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('manual_game_submissions')
      .update({
        status,
        admin_notes: notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;
  },

  async logAdminAction(
    adminProfileId: string,
    action: string,
    targetType: string,
    targetId: string | null,
    details: any
  ): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('admin_logs')
      .insert({
        admin_id: adminProfileId,
        action,
        target_type: targetType,
        target_id: targetId,
        details,
      });

    if (error) {
      console.error('Failed to log admin action:', error);
    }
  },

  async logSystemEvent(
    level: 'Info' | 'Warning' | 'Error' | 'Critical',
    source: string,
    event: string,
    details: any,
    profileId?: string,
    ipAddress?: string
  ): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('system_logs')
      .insert({
        level,
        source,
        event,
        details,
        user_id: profileId || null,
        ip_address: ipAddress || null,
      });

    if (error) {
      console.error('Failed to log system event:', error);
    }
  },
};
