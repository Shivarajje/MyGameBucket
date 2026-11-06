import { NextResponse } from 'next/server';
import { gameService } from '@/services/gameService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const genre = searchParams.get('genre') || undefined;
  const limitParam = searchParams.get('limit');
  const offsetParam = searchParams.get('offset');

  const limit = Math.min(Math.max(limitParam ? parseInt(limitParam, 10) : 30, 1), 50);
  const offset = Math.max(offsetParam ? parseInt(offsetParam, 10) : 0, 0);

  try {
    const results = query.trim()
      ? await gameService.search(query.trim(), limit, offset, genre)
      : await gameService.getPopularGames(limit, offset, genre);

    return NextResponse.json({
      data: results,
      hasMore: results.length >= limit,
      offset,
      limit,
    });
  } catch (error) {
    console.error('Error in search API:', error);
    return NextResponse.json({ error: 'Failed to search games' }, { status: 500 });
  }
}
