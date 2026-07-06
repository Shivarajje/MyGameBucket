import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { profileService } from '@/services/profileService';
import { friendshipService } from '@/services/friendshipService';

interface RouteParams {
  params: Promise<{ username: string }>;
}

// GET /api/profile/[username] — Get a public profile by username
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { username } = await params;
    const result = await profileService.getProfileByUsername(username);

    if (!result) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Check visibility
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const canView = await friendshipService.canViewProfile(
      user?.id || null,
      { id: result.profile.id, visibility: result.profile.visibility || 'Public' }
    );

    if (!canView) {
      // Return minimal info for private/restricted profiles
      return NextResponse.json({
        profile: {
          id: result.profile.id,
          username: result.profile.username,
          avatar_url: result.profile.avatar_url,
          visibility: result.profile.visibility || 'Public',
        },
        stats: null,
        restricted: true,
      });
    }

    return NextResponse.json({ ...result, restricted: false });
  } catch (error) {
    console.error('[GET /api/profile/[username]]', error);
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 });
  }
}
