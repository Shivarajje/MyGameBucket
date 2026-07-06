import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { friendshipService } from '@/services/friendshipService';

interface RouteParams {
  params: Promise<{ profileId: string }>;
}

// GET /api/friends/status/[profileId] — Get friendship status
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ status: 'none', friendshipId: null, isRequester: false });

    const { profileId } = await params;
    const result = await friendshipService.getFriendshipStatus(user.id, profileId);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[GET /api/friends/status/[profileId]]', error);
    return NextResponse.json({ error: error.message || 'Failed to get status' }, { status: 500 });
  }
}
