import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { libraryService } from '@/services/libraryService';

// GET /api/library — Get the current user's library
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const sortBy = searchParams.get('sortBy') || 'added_at';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const result = await libraryService.getLibrary(user.id, {
      status,
      sortBy,
      sortOrder,
      limit,
      offset,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[GET /api/library]', error);
    return NextResponse.json({ error: 'Failed to load library' }, { status: 500 });
  }
}

// POST /api/library — Add a game to the user's library
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { gameId, status } = body;

    if (!gameId) {
      return NextResponse.json({ error: 'gameId is required' }, { status: 400 });
    }

    const entry = await libraryService.addToLibrary(user.id, gameId, status);
    return NextResponse.json(entry, { status: 201 });
  } catch (error: any) {
    // Handle unique constraint violation (game already in library)
    if (error?.code === '23505') {
      return NextResponse.json({ error: 'Game already in library' }, { status: 409 });
    }
    console.error('[POST /api/library]', error);
    return NextResponse.json({ error: 'Failed to add game' }, { status: 500 });
  }
}
