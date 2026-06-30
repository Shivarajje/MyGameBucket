import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { journalService } from '@/services/journalService';

// GET /api/journal?gameId=...
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');

    if (!gameId) {
      return NextResponse.json({ error: 'gameId is required' }, { status: 400 });
    }

    const entry = await journalService.getEntry(user.id, gameId);
    return NextResponse.json(entry);
  } catch (error) {
    console.error('[GET /api/journal]', error);
    return NextResponse.json({ error: 'Failed to load journal entry' }, { status: 500 });
  }
}

// POST /api/journal
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { gameId, entry } = body;

    if (!gameId || typeof entry !== 'string') {
      return NextResponse.json({ error: 'gameId and entry are required' }, { status: 400 });
    }

    const saved = await journalService.saveEntry(user.id, gameId, entry);
    return NextResponse.json(saved);
  } catch (error: any) {
    console.error('[POST /api/journal]', error);
    return NextResponse.json({ error: error.message || 'Failed to save journal entry' }, { status: 500 });
  }
}

// DELETE /api/journal?gameId=...
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');

    if (!gameId) {
      return NextResponse.json({ error: 'gameId is required' }, { status: 400 });
    }

    await journalService.deleteEntry(user.id, gameId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/journal]', error);
    return NextResponse.json({ error: 'Failed to delete journal entry' }, { status: 500 });
  }
}
