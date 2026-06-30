'use client';

import { JournalEntryWithGame } from '@/services/journalService';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function JournalEntryCard({ entry }: { entry: JournalEntryWithGame }) {
  const game = entry.game_catalog;

  return (
    <Card className="bg-background/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-primary/30 transition-all duration-300 shadow-lg">
      <CardContent className="p-6 flex flex-col md:flex-row gap-6">
        {/* Game Cover */}
        <Link href={`/game/${game.slug}`} className="w-20 h-28 shrink-0 rounded-xl overflow-hidden bg-muted hidden sm:block relative">
          {game.cover_url ? (
            <Image
              src={game.cover_url}
              alt={game.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="80px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
              No Cover
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <Link href={`/game/${game.slug}`} className="font-bold text-base hover:text-primary transition-colors">
                {game.title}
              </Link>
              <span className="text-[10px] text-muted-foreground">
                {new Date(entry.updated_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-foreground/90 italic leading-relaxed text-sm pl-3 border-l-2 border-primary/40">
              &ldquo;{entry.entry}&rdquo;
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
