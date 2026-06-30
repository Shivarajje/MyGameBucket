import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { libraryService } from '@/services/libraryService';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/library/[id] — Update a library entry
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const updated = await libraryService.updateEntry(id, user.id, body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('[PATCH /api/library/[id]]', error);
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
  }
}

// DELETE /api/library/[id] — Remove a game from library
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await libraryService.removeFromLibrary(id, user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/library/[id]]', error);
    return NextResponse.json({ error: 'Failed to remove entry' }, { status: 500 });
  }
}
