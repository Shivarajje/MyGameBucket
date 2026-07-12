import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { profileService } from '@/services/profileService';
import { journalService } from '@/services/journalService';
import { friendshipService } from '@/services/friendshipService';

interface RouteParams {
  params: Promise<{ username: string }>;
}

// GET /api/journal/profile/[username] — Get all public journal entries for a user
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { username } = await params;
    const profileData = await profileService.getProfileByUsername(username);

    if (!profileData) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Enforce profile visibility — restricted viewers get no entries
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const canView = await friendshipService.canViewProfile(
      user?.id || null,
      { id: profileData.profile.id, visibility: profileData.profile.visibility || 'Public' }
    );

    if (!canView) {
      return NextResponse.json([]);
    }

    const entries = await journalService.getUserJournal(profileData.profile.id);
    return NextResponse.json(entries);
  } catch (error) {
    console.error('[GET /api/journal/profile/[username]]', error);
    return NextResponse.json({ error: 'Failed to load journal entries' }, { status: 500 });
  }
}
