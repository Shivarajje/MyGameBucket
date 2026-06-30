'use client';

import { useState, useEffect } from 'react';
import { DatabaseManualGameSubmission } from '@/types/database';
import { toast } from 'sonner';

export function useAdminSubmissions() {
  const [submissions, setSubmissions] = useState<DatabaseManualGameSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/admin/submissions');
      if (res.ok) {
        setSubmissions(await res.json());
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Failed to load admin submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const approveSubmission = async (id: string, genre: string) => {
    try {
      const res = await fetch(`/api/admin/submissions/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve', genre }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to approve submission');
      }

      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      toast.success('Submission approved and added to catalog!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve');
      throw error;
    }
  };

  const rejectSubmission = async (id: string, reason: string) => {
    try {
      const res = await fetch(`/api/admin/submissions/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', reason }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to reject submission');
      }

      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      toast.success('Submission rejected');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject');
      throw error;
    }
  };

  return { submissions, loading, isAdmin, approveSubmission, rejectSubmission, refresh: fetchSubmissions };
}
