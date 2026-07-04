'use client';

import { use, useState, useEffect } from 'react';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { GameCard } from '@/features/games/components/GameCard';
import { CollectionDialog } from '@/features/collections/components/CollectionDialog';
import { useCollection, useCollections, useCollectionActions } from '@/features/collections/hooks/useCollections';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit3, Trash2, X, FolderHeart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { createClient } from '@/lib/supabase/client';

interface CollectionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CollectionDetailPage({ params }: CollectionDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [authChecking, setAuthChecking] = useState(true);
  const { collection, games: initialGames, loading, error } = useCollection(id);
  const { updateCollection, deleteCollection } = useCollections();
  const { removeGame, loading: actionLoading } = useCollectionActions();
  
  const [games, setGames] = useState(initialGames);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace(ROUTES.LOGIN);
      } else {
        setAuthChecking(false);
      }
    });
  }, [router]);

  useEffect(() => {
    if (initialGames) {
      setGames(initialGames);
    }
  }, [initialGames]);

  const handleRename = async (name: string, description: string | null) => {
    await updateCollection(id, name, description);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this collection?')) {
      await deleteCollection(id);
      router.push(ROUTES.COLLECTIONS);
    }
  };

  const handleRemoveGame = async (gameId: string) => {
    if (confirm('Remove this game from the collection?')) {
      try {
        await removeGame(id, gameId);
        setGames((prev) => prev.filter((g) => g.id !== gameId));
      } catch (err) {
        // Handled by hook toast
      }
    }
  };

  if (authChecking || loading) {
    return (
      <main className="flex-1 flex flex-col py-10 pt-28">
        <Container>
          <Skeleton className="h-12 w-48 mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-8">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-3xl" />
            ))}
          </div>
        </Container>
      </main>
    );
  }

  if (error || !collection) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-20 pt-28">
        <FolderHeart className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold">Collection not found</h2>
        <p className="text-sm text-muted-foreground">This collection doesn&apos;t exist or is private.</p>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col py-10 pt-28">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <PageHeader
            title={collection.name}
            subtitle={collection.description || 'Custom game list'}
          />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)} className="rounded-full">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete} className="rounded-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Games Grid */}
        <div className="mt-8">
          {games.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {games.map((game) => (
                <div key={game.id} className="relative group">
                  <GameCard game={{
                    igdbId: game.igdb_id,
                    slug: game.slug,
                    title: game.title,
                    coverUrl: game.cover_url,
                    genre: game.genre,
                    platform: game.platform,
                    releaseYear: game.release_year,
                  }} />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md border border-white/10"
                    onClick={() => handleRemoveGame(game.id)}
                    disabled={actionLoading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground bg-background/20 backdrop-blur-md border border-white/10 rounded-3xl">
              No games in this collection yet. Go to a game page to add it!
            </div>
          )}
        </div>

        {/* Edit Dialog */}
        <CollectionDialog
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSave={handleRename}
          initialData={{ name: collection.name, description: collection.description }}
          title="Edit Collection"
        />
      </Container>
    </main>
  );
}
