import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { collectionService } from '@/services/collectionService';
import { profileService } from '@/services/profileService';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/collections/[id]/games — Add game to collection
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await profileService.getProfileByUserId(user.id);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { id } = await params;
    const body = await request.json();
    const { gameId } = body;

    if (!gameId) {
      return NextResponse.json({ error: 'gameId is required' }, { status: 400 });
    }

    const relation = await collectionService.addGameToCollection(profile.id, id, gameId);
    return NextResponse.json(relation, { status: 201 });
  } catch (error: any) {
    if (error?.code === '23505') {
      return NextResponse.json({ error: 'Game already in collection' }, { status: 409 });
    }
    console.error('[POST /api/collections/[id]/games]', error);
    return NextResponse.json({ error: error.message || 'Failed to add game to collection' }, { status: 500 });
  }
}

// DELETE /api/collections/[id]/games?gameId=... — Remove game from collection
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await profileService.getProfileByUserId(user.id);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');

    if (!gameId) {
      return NextResponse.json({ error: 'gameId is required' }, { status: 400 });
    }

    await collectionService.removeGameFromCollection(profile.id, id, gameId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[DELETE /api/collections/[id]/games]', error);
    return NextResponse.json({ error: error.message || 'Failed to remove game from collection' }, { status: 500 });
  }
}
