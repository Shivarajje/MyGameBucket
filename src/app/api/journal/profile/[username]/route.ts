import { NextRequest, NextResponse } from 'next/server';
import { profileService } from '@/services/profileService';
import { journalService } from '@/services/journalService';

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

    const entries = await journalService.getUserJournal(profileData.profile.id);
    return NextResponse.json(entries);
  } catch (error) {
    console.error('[GET /api/journal/profile/[username]]', error);
    return NextResponse.json({ error: 'Failed to load journal entries' }, { status: 500 });
  }
}
