'use client';

import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { DiscoverCard } from '@/features/friends/components/DiscoverCard';
import { useDiscoverProfiles } from '@/features/friends/hooks/useFriends';
import { RefreshCw, Users } from 'lucide-react';

export default function DiscoverPage() {
  const { profiles, loading, refresh } = useDiscoverProfiles();

  return (
    <main className="flex-1 flex flex-col py-10 pt-28">
      <Container>
        <div className="flex items-center justify-between mb-8">
          <PageHeader title="Discover Players" subtitle="Find new gamers to connect with" />
          <Button
            variant="outline"
            className="rounded-full"
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : profiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((data: any) => (
              <DiscoverCard key={data.profile.id} data={data} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-background/20 backdrop-blur-md border border-white/10 rounded-3xl">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-1">No profiles found</h3>
            <p className="text-sm text-muted-foreground">Check back later as more players join!</p>
          </div>
        )}
      </Container>
    </main>
  );
}
