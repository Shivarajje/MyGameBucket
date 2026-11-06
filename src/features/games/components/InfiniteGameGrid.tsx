'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { GameSearchResult } from '@/types/game';
import { GameCard } from './GameCard';
import { GameCardSkeleton } from './Skeletons';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InfiniteGameGridProps {
  initialGames: GameSearchResult[];
  query?: string;
  genre?: string;
  isDiscoveryMode?: boolean;
}

const BATCH_SIZE = 30; // 5 rows of 6 cards on xl desktop

export function InfiniteGameGrid({
  initialGames,
  query = '',
  genre,
  isDiscoveryMode = false,
}: InfiniteGameGridProps) {
  const [games, setGames] = useState<GameSearchResult[]>(initialGames);
  const [offset, setOffset] = useState<number>(initialGames.length);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(initialGames.length >= BATCH_SIZE);
  const [error, setError] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Sync state if server props change (e.g., search query or genre filter changes)
  useEffect(() => {
    setGames(initialGames);
    setOffset(initialGames.length);
    setHasMore(initialGames.length >= BATCH_SIZE);
    setError(null);
    setLoading(false);
  }, [initialGames, query, genre]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (genre) params.set('genre', genre);
      params.set('limit', BATCH_SIZE.toString());
      params.set('offset', offset.toString());

      const res = await fetch(`/api/games/search?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to load more games');
      }

      const json = await res.json();
      const newGames: GameSearchResult[] = json.data || [];

      if (newGames.length === 0) {
        setHasMore(false);
      } else {
        // Prevent duplicate games by igdbId
        setGames((prev) => {
          const existingIds = new Set(prev.map((g) => g.igdbId));
          const uniqueNew = newGames.filter((g) => !existingIds.has(g.igdbId));
          return [...prev, ...uniqueNew];
        });
        setOffset((prev) => prev + newGames.length);
        setHasMore(newGames.length >= BATCH_SIZE);
      }
    } catch (err: any) {
      console.error('Error fetching more games:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, offset, query, genre]);

  // Set up IntersectionObserver to trigger when the top of the last row enters view
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          loadMore();
        }
      },
      {
        root: null,
        // Trigger right as the last row top approaches or enters the viewport
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    const target = sentinelRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) observer.unobserve(target);
      observer.disconnect();
    };
  }, [hasMore, loading, loadMore]);

  if (games.length === 0 && !loading) {
    return (
      <div className="text-center py-20 text-muted-foreground bg-background/20 backdrop-blur-md border border-white/10 rounded-3xl">
        {isDiscoveryMode
          ? 'Unable to fetch popular games right now.'
          : 'No games found matching your filters.'}
      </div>
    );
  }

  // Sentinel placed at the beginning of the last row (6 cards from end on xl screens)
  const sentinelIndex = Math.max(0, games.length - 6);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {games.map((game, index) => {
          const isSentinel = index === sentinelIndex;
          return (
            <div
              key={`${game.igdbId}-${index}`}
              ref={isSentinel ? sentinelRef : undefined}
              className="h-full"
            >
              <GameCard game={game} priority={index < 6} />
            </div>
          );
        })}

        {/* Skeleton cards for loading next 5 rows */}
        {loading &&
          Array.from({ length: BATCH_SIZE }).map((_, i) => (
            <GameCardSkeleton key={`skeleton-${i}`} />
          ))}
      </div>

      {/* Error state with retry button */}
      {error && (
        <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
          <div className="flex items-center gap-2 text-destructive text-sm font-medium">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadMore}
            className="rounded-full gap-2 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry loading more
          </Button>
        </div>
      )}

      {/* End of results indicator */}
      {!hasMore && games.length > 0 && (
        <div className="py-12 text-center text-zinc-500 text-sm flex flex-col items-center gap-2">
          <div className="w-12 h-px bg-white/10 mb-1" />
          <span>You&apos;ve reached the end of the catalog</span>
        </div>
      )}
    </div>
  );
}

