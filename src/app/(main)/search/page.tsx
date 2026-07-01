import { Metadata } from 'next';
import { gameService } from '@/services/gameService';
import { GameCard } from '@/features/games/components/GameCard';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Search, Sparkles } from 'lucide-react';
import { GameSearchResult } from '@/types/game';

interface SearchPageProps {
  searchParams: Promise<{ q?: string; genre?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q} | MyGameBucket` : 'Games | MyGameBucket',
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, genre } = await searchParams;
  const query = q || '';

  let displayGames: GameSearchResult[] = [];
  let isDiscoveryMode = false;

  if (query) {
    const rawGames = await gameService.search(query);
    // Apply basic filters
    displayGames = rawGames.filter((game) => {
      const matchGenre = !genre || game.genre?.toLowerCase() === genre.toLowerCase();
      return matchGenre;
    });
  } else {
    isDiscoveryMode = true;
    displayGames = await gameService.getPopularGames(12);
  }

  // Get unique genres from raw search results for filtering
  const allRawGames = query ? await gameService.search(query) : [];
  const genres = Array.from(new Set(allRawGames.map((g) => g.genre).filter(Boolean)));

  return (
    <main className="flex-1 flex flex-col py-10 pt-28">
      <Container>
        <PageHeader
          title={query ? `Search results for "${query}"` : 'Games'}
          subtitle={
            query
              ? `${displayGames.length} results found`
              : 'Discover popular games and add them to your collection.'
          }
        />

        {/* Centered Local Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto w-full">
          <form action="/search" method="GET" className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="w-5 h-5 text-zinc-400" />
            </div>
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search millions of games..."
              className="w-full pl-12 pr-28 py-3.5 rounded-full bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all shadow-xl text-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-6 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors text-xs shadow-lg"
            >
              Search
            </button>
          </form>
        </div>

        {/* Results or Discovery Section */}
        <div className="flex flex-col gap-6 mt-12">
          {/* Filters for active searches */}
          {!isDiscoveryMode && genres.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-muted-foreground mr-2 font-medium">Filter:</span>
              
              {/* Genre Filters */}
              {genres.map((g) => {
                const isSelected = genre === g;
                const targetUrl = isSelected
                  ? `/search?q=${encodeURIComponent(query)}`
                  : `/search?q=${encodeURIComponent(query)}&genre=${encodeURIComponent(g!)}`;
                return (
                  <Button
                    key={g}
                    variant={isSelected ? 'secondary' : 'outline'}
                    size="sm"
                    className="rounded-full text-xs"
                    asChild
                  >
                    <Link href={targetUrl}>{g}</Link>
                  </Button>
                );
              })}
            </div>
          )}

          {/* Title Header for Discovery Grid */}
          {isDiscoveryMode && (
            <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight">Popular & Trending</h2>
            </div>
          )}

          {/* Grid */}
          {displayGames.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {displayGames.map((game) => (
                <GameCard key={game.igdbId} game={game} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground bg-background/20 backdrop-blur-md border border-white/10 rounded-3xl">
              {isDiscoveryMode 
                ? "Unable to fetch popular games right now." 
                : "No games found matching your filters."
              }
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
