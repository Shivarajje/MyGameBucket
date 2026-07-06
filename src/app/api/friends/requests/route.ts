import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { friendshipService } from '@/services/friendshipService';

// GET /api/friends/requests — Get incoming pending requests
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const requests = await friendshipService.getPendingRequests(user.id);
    return NextResponse.json(requests);
  } catch (error: any) {
    console.error('[GET /api/friends/requests]', error);
    return NextResponse.json({ error: error.message || 'Failed to load requests' }, { status: 500 });
  }
}
