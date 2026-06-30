import { NextResponse } from 'next/server';
import { gameService } from '@/services/gameService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ data: [] });
  }

  try {
    const results = await gameService.search(query);
    return NextResponse.json({ data: results });
  } catch (error) {
    console.error('Error in search API:', error);
    return NextResponse.json({ error: 'Failed to search games' }, { status: 500 });
  }
}
