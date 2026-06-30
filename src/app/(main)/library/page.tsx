'use client';

import { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { LibraryCard } from '@/features/library/components/LibraryCard';
import { LibraryStatsBar } from '@/features/library/components/LibraryStatsBar';
import { LibraryFilters } from '@/features/library/components/LibraryFilters';
import { useLibrary, useLibraryStats } from '@/features/library/hooks/useLibrary';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Library } from 'lucide-react';

export default function LibraryPage() {
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('added_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { games, count, loading, hasMore, loadMore } = useLibrary({
    status: status === 'all' ? undefined : status,
    sortBy,
    sortOrder,
  });

  const { stats, loading: statsLoading } = useLibraryStats();

  return (
    <main className="flex-1 flex flex-col py-10 pt-28">
      <Container>
        <PageHeader
          title="My Library"
          subtitle={count > 0 ? `${count} games tracked` : 'Your personal game collection'}
        />

        {/* Stats Bar */}
        <div className="mt-8">
          {statsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-2xl" />
              ))}
            </div>
          ) : stats ? (
            <LibraryStatsBar
              totalGames={stats.totalGames}
              completedGames={stats.completedGames}
              totalHours={stats.totalHours}
              averageRating={stats.averageRating}
            />
          ) : null}
        </div>

        {/* Filters */}
        <div className="mt-8">
          <LibraryFilters
            status={status}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onStatusChange={setStatus}
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
          />
        </div>

        {/* Game List */}
        <div className="mt-8 space-y-3">
          {loading && games.length === 0 ? (
            [...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))
          ) : games.length > 0 ? (
            <>
              {games.map((entry) => (
                <LibraryCard key={entry.id} entry={entry} />
              ))}

              {hasMore && (
                <div className="flex justify-center pt-6">
                  <Button
                    variant="outline"
                    onClick={loadMore}
                    disabled={loading}
                    className="rounded-full bg-background/40 backdrop-blur-md border-white/10 hover:border-primary/30"
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 text-muted-foreground">
              <Library className="w-12 h-12 mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-1">Your library is empty</h3>
              <p className="text-sm">Search for games and add them to start tracking your journey.</p>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
