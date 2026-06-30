import { Metadata } from 'next';
import { gameService } from '@/services/gameService';
import { profileService } from '@/services/profileService';
import { GameCard } from '@/features/games/components/GameCard';
import { UserCard } from '@/features/profile/components/UserCard';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, Gamepad2 } from 'lucide-react';

import { GameSearchResult } from '@/types/game';
import { DatabaseProfile } from '@/types/database';

interface SearchPageProps {
  searchParams: Promise<{ q?: string; type?: string; genre?: string; platform?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q} | MyGameBucket` : 'Search | MyGameBucket',
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, type, genre, platform } = await searchParams;
  const query = q || '';
  const searchType = type === 'gamers' ? 'gamers' : 'games';

  let gameResults: GameSearchResult[] = [];
  let userResults: DatabaseProfile[] = [];

  if (query) {
    if (searchType === 'games') {
      const rawGames = await gameService.search(query);
      
      // Apply basic filters
      gameResults = rawGames.filter((game) => {
        const matchGenre = !genre || game.genre?.toLowerCase() === genre.toLowerCase();
        const matchPlatform = !platform || game.platform?.toLowerCase() === platform.toLowerCase();
        return matchGenre && matchPlatform;
      });
    } else {
      userResults = await profileService.searchUsers(query);
    }
  }

  // Get unique genres and platforms from raw search results for filtering
  const allRawGames = query && searchType === 'games' ? await gameService.search(query) : [];
  const genres = Array.from(new Set(allRawGames.map((g) => g.genre).filter(Boolean)));
  const platforms = Array.from(new Set(allRawGames.map((g) => g.platform).filter(Boolean)));

  return (
    <main className="flex-1 flex flex-col py-10 pt-28">
      <Container>
        <PageHeader
          title={query ? `Search results for "${query}"` : 'Search'}
          subtitle={
            query
              ? `${searchType === 'games' ? gameResults.length : userResults.length} results found`
              : 'Find games and other gamers.'
          }
        />

        {query && (
          <div className="flex flex-col gap-6 mt-8">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/10 pb-4">
              <Button
                variant={searchType === 'games' ? 'default' : 'ghost'}
                className="rounded-full"
                asChild
              >
                <Link href={`/search?q=${encodeURIComponent(query)}&type=games`}>
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Games
                </Link>
              </Button>
              <Button
                variant={searchType === 'gamers' ? 'default' : 'ghost'}
                className="rounded-full"
                asChild
              >
                <Link href={`/search?q=${encodeURIComponent(query)}&type=gamers`}>
                  <Users className="w-4 h-4 mr-2" />
                  Gamers
                </Link>
              </Button>
            </div>

            {/* Game Filters */}
            {searchType === 'games' && (genres.length > 0 || platforms.length > 0) && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-muted-foreground mr-2">Filter:</span>
                
                {/* Genre Filters */}
                {genres.map((g) => {
                  const isSelected = genre === g;
                  const targetUrl = isSelected
                    ? `/search?q=${encodeURIComponent(query)}&type=games`
                    : `/search?q=${encodeURIComponent(query)}&type=games&genre=${encodeURIComponent(g!)}${platform ? `&platform=${encodeURIComponent(platform)}` : ''}`;
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

                {/* Platform Filters */}
                {platforms.map((p) => {
                  const isSelected = platform === p;
                  const targetUrl = isSelected
                    ? `/search?q=${encodeURIComponent(query)}&type=games`
                    : `/search?q=${encodeURIComponent(query)}&type=games&platform=${encodeURIComponent(p!)}${genre ? `&genre=${encodeURIComponent(genre)}` : ''}`;
                  return (
                    <Button
                      key={p}
                      variant={isSelected ? 'secondary' : 'outline'}
                      size="sm"
                      className="rounded-full text-xs"
                      asChild
                    >
                      <Link href={targetUrl}>{p}</Link>
                    </Button>
                  );
                })}
              </div>
            )}

            {/* Results Grid */}
            {searchType === 'games' ? (
              gameResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {gameResults.map((game) => (
                    <GameCard key={game.igdbId} game={game} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-muted-foreground bg-background/20 backdrop-blur-md border border-white/10 rounded-3xl">
                  No games found matching your filters.
                </div>
              )
            ) : userResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {userResults.map((profile) => (
                  <UserCard key={profile.id} profile={profile} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground bg-background/20 backdrop-blur-md border border-white/10 rounded-3xl">
                No gamers found matching &ldquo;{query}&rdquo;.
              </div>
            )}
          </div>
        )}
      </Container>
    </main>
  );
}
