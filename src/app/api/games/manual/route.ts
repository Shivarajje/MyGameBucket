import { NextResponse } from 'next/server';
import { manualGameService } from '@/services/manualGameService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const result = await manualGameService.submitGame(body);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error submitting manual game:', error);
    return NextResponse.json({ error: 'Failed to submit game' }, { status: 500 });
  }
}
