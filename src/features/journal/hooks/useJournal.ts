'use client';

import { useState, useEffect } from 'react';
import { DatabaseJournalEntry } from '@/types/database';
import { JournalEntryWithGame } from '@/services/journalService';
import { toast } from 'sonner';

export function useJournal(gameId: string) {
  const [entry, setEntry] = useState<DatabaseJournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchEntry() {
      try {
        const res = await fetch(`/api/journal?gameId=${gameId}`);
        if (res.ok) {
          const data = await res.json();
          setEntry(data);
        }
      } catch (error) {
        console.error('Failed to load journal entry:', error);
      } finally {
        setLoading(false);
      }
    }

    if (gameId) {
      fetchEntry();
    }
  }, [gameId]);

  const saveEntry = async (entryText: string) => {
    setSaving(true);
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, entry: entryText }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save entry');
      }

      const data = await res.json();
      setEntry(data);
      toast.success('Journal entry saved!');
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to save entry');
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const deleteEntry = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/journal?gameId=${gameId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete entry');
      }

      setEntry(null);
      toast.success('Journal entry deleted');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete entry');
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return { entry, loading, saving, saveEntry, deleteEntry };
}

export function useUserJournal(username: string) {
  const [entries, setEntries] = useState<JournalEntryWithGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJournal() {
      try {
        const res = await fetch(`/api/journal/profile/${encodeURIComponent(username)}`);
        if (!res.ok) {
          throw new Error('Failed to load journal');
        }
        const data = await res.json();
        setEntries(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load journal');
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      fetchJournal();
    }
  }, [username]);

  return { entries, loading, error };
}
