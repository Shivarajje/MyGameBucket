'use client';

import { CollectionWithGamesCount } from '@/services/collectionService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderHeart, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

export function CollectionCard({ collection }: { collection: CollectionWithGamesCount }) {
  return (
    <Link href={`/collections/${collection.id}`}>
      <Card className="group bg-background/40 backdrop-blur-md border border-white/10 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(202,138,4,0.15)] transition-all duration-300 cursor-pointer h-full flex flex-col justify-between">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="bg-primary/10 p-2 rounded-xl border border-primary/20">
              <FolderHeart className="w-5 h-5 text-primary" />
            </div>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <LayoutGrid className="w-3 h-3" />
              {collection.games_count} {collection.games_count === 1 ? 'game' : 'games'}
            </span>
          </div>
          <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors truncate">
            {collection.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="line-clamp-2 text-zinc-400">
            {collection.description || 'No description provided.'}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
