'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserGameWithCatalog } from '@/services/libraryRepository';

interface UseLibraryOptions {
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  skip?: boolean;
}

export function useLibrary(options?: UseLibraryOptions) {
  const [games, setGames] = useState<UserGameWithCatalog[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const limit = options?.limit || 20;

  const fetchLibrary = useCallback(async (reset = false) => {
    if (options?.skip) return;
    setLoading(true);
    try {
      const currentOffset = reset ? 0 : offset;
      const params = new URLSearchParams();
      if (options?.status) params.set('status', options.status);
      if (options?.sortBy) params.set('sortBy', options.sortBy);
      if (options?.sortOrder) params.set('sortOrder', options.sortOrder);
      params.set('limit', String(limit));
      params.set('offset', String(currentOffset));

      const res = await fetch(`/api/library?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch library');

      const result = await res.json();

      if (reset) {
        setGames(result.data);
        setOffset(limit);
      } else {
        setGames((prev) => [...prev, ...result.data]);
        setOffset((prev) => prev + limit);
      }

      setCount(result.count);
      setHasMore(result.data.length === limit);
    } catch (error) {
      console.error('useLibrary error:', error);
    } finally {
      setLoading(false);
    }
  }, [offset, options?.status, options?.sortBy, options?.sortOrder, options?.skip, limit]);

  useEffect(() => {
    if (options?.skip) return;
    fetchLibrary(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.status, options?.sortBy, options?.sortOrder, options?.skip]);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchLibrary(false);
    }
  };

  const refresh = () => {
    setOffset(0);
    fetchLibrary(true);
  };

  return { games, count, loading, hasMore, loadMore, refresh };
}

export function useLibraryActions() {
  const [loading, setLoading] = useState(false);

  const addToLibrary = async (gameId: string, status?: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, status }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to add game');
      }
      return await res.json();
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = async (id: string, updates: Record<string, any>) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/library/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update');
      return await res.json();
    } finally {
      setLoading(false);
    }
  };

  const removeFromLibrary = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/library/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove');
      return true;
    } finally {
      setLoading(false);
    }
  };

  return { addToLibrary, updateEntry, removeFromLibrary, loading };
}

export function useLibraryStats(options?: { skip?: boolean }) {
  const [stats, setStats] = useState<{
    totalGames: number;
    completedGames: number;
    totalHours: number;
    averageRating: number | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (options?.skip) return;
    async function fetchStats() {
      try {
        const res = await fetch('/api/library/stats');
        if (!res.ok) throw new Error('Failed to fetch stats');
        setStats(await res.json());
      } catch (error) {
        console.error('useLibraryStats error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [options?.skip]);

  return { stats, loading };
}
