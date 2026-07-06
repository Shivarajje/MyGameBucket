import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { friendshipService } from '@/services/friendshipService';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/friends/[id] — Accept or reject a request
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { action } = await request.json();

    if (action === 'accept') {
      const result = await friendshipService.acceptRequest(user.id, id);
      return NextResponse.json(result);
    } else if (action === 'reject') {
      await friendshipService.rejectRequest(user.id, id);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Invalid action. Use "accept" or "reject".' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('[PATCH /api/friends/[id]]', error);
    return NextResponse.json({ error: error.message || 'Failed to update request' }, { status: 500 });
  }
}

// DELETE /api/friends/[id] — Unfriend or cancel a sent request
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await friendshipService.removeFriend(user.id, id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[DELETE /api/friends/[id]]', error);
    return NextResponse.json({ error: error.message || 'Failed to remove' }, { status: 500 });
  }
}
