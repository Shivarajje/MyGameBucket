import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { collectionService } from '@/services/collectionService';

// GET /api/collections — Get the current user's collections
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const collections = await collectionService.getCollections(user.id);
    return NextResponse.json(collections);
  } catch (error) {
    console.error('[GET /api/collections]', error);
    return NextResponse.json({ error: 'Failed to load collections' }, { status: 500 });
  }
}

// POST /api/collections — Create a new collection
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description } = body;

    const collection = await collectionService.createCollection(user.id, name, description);
    return NextResponse.json(collection, { status: 201 });
  } catch (error: any) {
    console.error('[POST /api/collections]', error);
    return NextResponse.json({ error: error.message || 'Failed to create collection' }, { status: 500 });
  }
}
