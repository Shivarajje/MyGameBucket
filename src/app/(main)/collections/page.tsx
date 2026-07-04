'use client';

import { useState, useEffect } from 'react';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { CollectionCard } from '@/features/collections/components/CollectionCard';
import { CollectionDialog } from '@/features/collections/components/CollectionDialog';
import { useCollections } from '@/features/collections/hooks/useCollections';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, FolderHeart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ROUTES } from '@/constants/routes';

export default function CollectionsPage() {
  const router = useRouter();
  const [authChecking, setAuthChecking] = useState(true);
  const { collections, loading, createCollection } = useCollections();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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

  if (authChecking) {
    return (
      <main className="flex-1 flex flex-col py-10 pt-28">
        <Container>
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-12 w-48 mb-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-3xl" />
            ))}
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col py-10 pt-28">
      <Container>
        <div className="flex items-center justify-between gap-4">
          <PageHeader
            title="Collections"
            subtitle="Organize your games into custom lists"
          />
          <Button onClick={() => setIsCreateOpen(true)} className="rounded-full">
            <Plus className="w-4 h-4 mr-2" />
            New Collection
          </Button>
        </div>

        {/* Collections Grid */}
        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-3xl" />
              ))}
            </div>
          ) : collections.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {collections.map((col) => (
                <CollectionCard key={col.id} collection={col} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 text-muted-foreground">
              <FolderHeart className="w-12 h-12 mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-1">No collections yet</h3>
              <p className="text-sm max-w-sm">Create a collection to group your favorite games (e.g. Masterpieces, Backlog).</p>
            </div>
          )}
        </div>

        {/* Create Dialog */}
        <CollectionDialog
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSave={createCollection}
          title="Create New Collection"
        />
      </Container>
    </main>
  );
}
