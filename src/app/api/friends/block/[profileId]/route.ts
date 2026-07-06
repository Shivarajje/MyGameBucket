import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { friendshipService } from '@/services/friendshipService';

interface RouteParams {
  params: Promise<{ profileId: string }>;
}

// DELETE /api/friends/block/[profileId] — Unblock a user
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { profileId } = await params;
    await friendshipService.unblockUser(user.id, profileId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[DELETE /api/friends/block/[profileId]]', error);
    return NextResponse.json({ error: error.message || 'Failed to unblock user' }, { status: 500 });
  }
}
