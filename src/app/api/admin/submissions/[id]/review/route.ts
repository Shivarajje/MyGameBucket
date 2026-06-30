import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { adminService } from '@/services/adminService';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/admin/submissions/[id]/review — Approve or reject a manual game submission
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action, genre, reason } = body;

    if (action === 'approve') {
      if (!genre) {
        return NextResponse.json({ error: 'Genre is required for approval' }, { status: 400 });
      }
      const newGame = await adminService.approveSubmission(user.id, id, genre);
      return NextResponse.json(newGame);
    } else if (action === 'reject') {
      if (!reason) {
        return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 });
      }
      await adminService.rejectSubmission(user.id, id, reason);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('[POST /api/admin/submissions/[id]/review]', error);
    return NextResponse.json({ error: error.message || 'Failed to process review' }, { status: 500 });
  }
}
