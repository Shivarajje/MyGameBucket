import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { friendshipService } from '@/services/friendshipService';

// GET /api/friends/notifications — Get pending request count
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ count: 0 });

    const count = await friendshipService.getPendingCount(user.id);
    return NextResponse.json({ count });
  } catch (error: any) {
    console.error('[GET /api/friends/notifications]', error);
    return NextResponse.json({ count: 0 });
  }
}
