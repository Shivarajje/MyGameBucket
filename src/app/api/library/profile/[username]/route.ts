import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { profileService } from '@/services/profileService';
import { libraryService } from '@/services/libraryService';
import { friendshipService } from '@/services/friendshipService';

interface RouteParams {
  params: Promise<{ username: string }>;
}

// GET /api/library/profile/[username] — Get a user's library (visibility-gated)
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { username } = await params;
    const profileData = await profileService.getProfileByUsername(username);

    if (!profileData) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Enforce profile visibility — restricted viewers get an empty library
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const canView = await friendshipService.canViewProfile(
      user?.id || null,
      { id: profileData.profile.id, visibility: profileData.profile.visibility || 'Public' }
    );

    if (!canView) {
      return NextResponse.json({ entries: [], count: 0, commonGameIds: [] });
    }

    const result = await libraryService.getProfileLibrary(user?.id || null, profileData.profile.id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[GET /api/library/profile/[username]]', error);
    return NextResponse.json({ error: 'Failed to load library' }, { status: 500 });
  }
}
