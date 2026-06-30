import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { libraryService } from '@/services/libraryService';

// GET /api/library/stats — Get the current user's library statistics
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await libraryService.getStats(user.id);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('[GET /api/library/stats]', error);
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
  }
}
