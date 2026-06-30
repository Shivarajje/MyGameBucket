import { useState, useEffect } from 'react';
import { GameDetail } from '@/types/game';

export function useGame(slug: string) {
  const [game, setGame] = useState<GameDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGame() {
      try {
        setLoading(true);
        const res = await fetch(`/api/games/${slug}`);
        if (!res.ok) {
          if (res.status === 404) {
            setGame(null);
            return;
          }
          throw new Error('Failed to fetch game');
        }
        const json = await res.json();
        setGame(json.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchGame();
    }
  }, [slug]);

  return { game, loading, error };
}
