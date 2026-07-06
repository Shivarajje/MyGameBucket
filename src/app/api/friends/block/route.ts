import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { friendshipService } from '@/services/friendshipService';

// POST /api/friends/block — Block a user
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { targetProfileId } = await request.json();
    if (!targetProfileId) {
      return NextResponse.json({ error: 'targetProfileId is required' }, { status: 400 });
    }

    await friendshipService.blockUser(user.id, targetProfileId);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error('[POST /api/friends/block]', error);
    return NextResponse.json({ error: error.message || 'Failed to block user' }, { status: 500 });
  }
}

// GET /api/friends/block — List blocked users
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const blocked = await friendshipService.getBlockedUsers(user.id);
    return NextResponse.json(blocked);
  } catch (error: any) {
    console.error('[GET /api/friends/block]', error);
    return NextResponse.json({ error: error.message || 'Failed to load blocked users' }, { status: 500 });
  }
}
