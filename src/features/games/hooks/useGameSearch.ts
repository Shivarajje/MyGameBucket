import { useState, useEffect } from 'react';
import { GameSearchResult } from '@/types/game';
import { useDebounce } from '@/hooks/useDebounce';

export function useGameSearch(query: string) {
  const [results, setResults] = useState<GameSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    async function searchGames() {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`/api/games/search?q=${encodeURIComponent(debouncedQuery)}`);
        if (!res.ok) throw new Error('Failed to search');
        
        const json = await res.json();
        setResults(json.data || []);
      } catch (err: any) {
        setError(err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    searchGames();
  }, [debouncedQuery]);

  return { results, loading, error };
}
