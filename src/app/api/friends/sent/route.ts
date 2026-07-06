import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { friendshipService } from '@/services/friendshipService';

// GET /api/friends/sent — Get outgoing sent requests
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const sent = await friendshipService.getSentRequests(user.id);
    return NextResponse.json(sent);
  } catch (error: any) {
    console.error('[GET /api/friends/sent]', error);
    return NextResponse.json({ error: error.message || 'Failed to load sent requests' }, { status: 500 });
  }
}
