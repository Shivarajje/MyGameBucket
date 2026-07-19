import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { profileService } from '@/services/profileService';
import { collectionService } from '@/services/collectionService';
import { friendshipService } from '@/services/friendshipService';

interface RouteParams {
  params: Promise<{ username: string }>;
}

// GET /api/collections/profile/[username] — Get a user's collections (visibility-gated)
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { username } = await params;
    const profileData = await profileService.getProfileByUsername(username);

    if (!profileData) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Enforce profile visibility — restricted viewers get no collections
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const canView = await friendshipService.canViewProfile(
      user?.id || null,
      { id: profileData.profile.id, visibility: profileData.profile.visibility || 'Public' }
    );

    if (!canView) {
      return NextResponse.json([]);
    }

    const collections = await collectionService.getCollections(profileData.profile.id);
    return NextResponse.json(collections);
  } catch (error) {
    console.error('[GET /api/collections/profile/[username]]', error);
    return NextResponse.json({ error: 'Failed to load collections' }, { status: 500 });
  }
}
