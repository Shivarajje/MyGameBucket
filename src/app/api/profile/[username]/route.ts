import { NextRequest, NextResponse } from 'next/server';
import { profileService } from '@/services/profileService';

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

    return NextResponse.json(result);
  } catch (error) {
    console.error('[GET /api/profile/[username]]', error);
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 });
  }
}
