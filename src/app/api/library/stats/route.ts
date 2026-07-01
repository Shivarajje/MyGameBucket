import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { libraryService } from '@/services/libraryService';
import { profileService } from '@/services/profileService';

// GET /api/library/stats — Get the current user's library statistics
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await profileService.getProfileByUserId(user.id);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const stats = await libraryService.getStats(profile.id);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('[GET /api/library/stats]', error);
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
  }
}

