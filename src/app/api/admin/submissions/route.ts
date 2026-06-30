import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { adminService } from '@/services/adminService';

// GET /api/admin/submissions — Get all pending manual game submissions
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const submissions = await adminService.getPendingSubmissions(user.id);
    return NextResponse.json(submissions);
  } catch (error: any) {
    console.error('[GET /api/admin/submissions]', error);
    return NextResponse.json({ error: error.message || 'Failed to load submissions' }, { status: 500 });
  }
}
