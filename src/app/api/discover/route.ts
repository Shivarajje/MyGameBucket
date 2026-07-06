import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { friendshipService } from '@/services/friendshipService';

// GET /api/discover — Get random public profiles
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const profiles = await friendshipService.discoverProfiles(user?.id || null, 12);
    return NextResponse.json(profiles);
  } catch (error: any) {
    console.error('[GET /api/discover]', error);
    return NextResponse.json({ error: error.message || 'Failed to load profiles' }, { status: 500 });
  }
}
