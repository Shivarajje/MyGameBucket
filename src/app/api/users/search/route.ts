import { NextRequest, NextResponse } from 'next/server';
import { profileService } from '@/services/profileService';

// GET /api/users/search?q=... — Search public user profiles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    const users = await profileService.searchUsers(query);
    return NextResponse.json(users);
  } catch (error) {
    console.error('[GET /api/users/search]', error);
    return NextResponse.json({ error: 'Failed to search users' }, { status: 500 });
  }
}
