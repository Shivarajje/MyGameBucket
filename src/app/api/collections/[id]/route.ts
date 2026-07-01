import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { collectionService } from '@/services/collectionService';
import { profileService } from '@/services/profileService';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/collections/[id] — View specific collection + games
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const result = await collectionService.getCollection(id);

    if (!result) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[GET /api/collections/[id]]', error);
    return NextResponse.json({ error: 'Failed to load collection' }, { status: 500 });
  }
}

// PATCH /api/collections/[id] — Rename/Update collection
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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
    const { name, description } = body;

    const updated = await collectionService.updateCollection(id, profile.id, name, description);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('[PATCH /api/collections/[id]]', error);
    return NextResponse.json({ error: error.message || 'Failed to update collection' }, { status: 500 });
  }
}

// DELETE /api/collections/[id] — Delete collection
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
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
    await collectionService.deleteCollection(id, profile.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/collections/[id]]', error);
    return NextResponse.json({ error: 'Failed to delete collection' }, { status: 500 });
  }
}
