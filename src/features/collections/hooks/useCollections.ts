'use client';

import { useState, useEffect } from 'react';
import { DatabaseCollection, DatabaseGameCatalog } from '@/types/database';
import { CollectionWithGamesCount } from '@/services/collectionService';
import { toast } from 'sonner';

export function useCollections(options?: { skip?: boolean }) {
  const [collections, setCollections] = useState<CollectionWithGamesCount[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCollections = async () => {
    try {
      const res = await fetch('/api/collections');
      if (res.ok) {
        setCollections(await res.json());
      }
    } catch (error) {
      console.error('Failed to load collections:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options?.skip) return;
    fetchCollections();
  }, [options?.skip]);

  const createCollection = async (name: string, description: string | null) => {
    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create collection');
      }

      const newCol = await res.json();
      setCollections((prev) => [{ ...newCol, games_count: 0 }, ...prev]);
      toast.success('Collection created!');
      return newCol;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create collection');
      throw error;
    }
  };

  const updateCollection = async (id: string, name: string, description: string | null) => {
    try {
      const res = await fetch(`/api/collections/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update collection');
      }

      const updated = await res.json();
      setCollections((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
      );
      toast.success('Collection updated!');
      return updated;
    } catch (error: any) {
      toast.error(error.message || 'Failed to update collection');
      throw error;
    }
  };

  const deleteCollection = async (id: string) => {
    try {
      const res = await fetch(`/api/collections/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete collection');
      setCollections((prev) => prev.filter((c) => c.id !== id));
      toast.success('Collection deleted');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete collection');
      throw error;
    }
  };

  return { collections, loading, createCollection, updateCollection, deleteCollection, refresh: fetchCollections };
}

export function useCollection(id: string, options?: { skip?: boolean }) {
  const [collection, setCollection] = useState<DatabaseCollection | null>(null);
  const [games, setGames] = useState<DatabaseGameCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (options?.skip) return;
    async function fetchCollection() {
      try {
        const res = await fetch(`/api/collections/${id}`);
        if (!res.ok) throw new Error('Collection not found');
        const data = await res.json();
        setCollection(data.collection);
        setGames(data.games);
      } catch (err: any) {
        setError(err.message || 'Failed to load collection');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchCollection();
  }, [id, options?.skip]);

  return { collection, games, loading, error };
}

export function useCollectionActions(collectionId?: string) {
  const [loading, setLoading] = useState(false);

  const addGame = async (colId: string, gameId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/collections/${colId}/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to add game');
      }

      toast.success('Game added to collection!');
      return await res.json();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add game');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeGame = async (colId: string, gameId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/collections/${colId}/games?gameId=${gameId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to remove game');
      }

      toast.success('Game removed from collection');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove game');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { addGame, removeGame, loading };
}

// Fetch another user's collections by username (visibility-gated server-side).
export function useUserCollections(username: string) {
  const [collections, setCollections] = useState<CollectionWithGamesCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserCollections() {
      try {
        const res = await fetch(`/api/collections/profile/${encodeURIComponent(username)}`);
        if (!res.ok) {
          throw new Error('Failed to load collections');
        }
        const data = await res.json();
        setCollections(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || 'Failed to load collections');
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      fetchUserCollections();
    }
  }, [username]);

  return { collections, loading, error };
}
