import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { friendshipService } from '@/services/friendshipService';

// GET /api/friends — Get friends list
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const friends = await friendshipService.getFriends(user.id);
    return NextResponse.json(friends);
  } catch (error: any) {
    console.error('[GET /api/friends]', error);
    return NextResponse.json({ error: error.message || 'Failed to load friends' }, { status: 500 });
  }
}

// POST /api/friends — Send friend request
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { targetProfileId } = await request.json();
    if (!targetProfileId) {
      return NextResponse.json({ error: 'targetProfileId is required' }, { status: 400 });
    }

    const result = await friendshipService.sendFriendRequest(user.id, targetProfileId);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('[POST /api/friends]', error);
    const status = error.message?.includes('Already') || error.message?.includes('pending') ? 409 : 500;
    return NextResponse.json({ error: error.message || 'Failed to send request' }, { status });
  }
}
