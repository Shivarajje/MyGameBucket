'use client';

import { GameStatus } from '@/constants/enums';
import { STATUS_LABELS } from '@/constants/labels';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Star, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { UserGameWithCatalog } from '@/services/libraryRepository';

interface LibraryCardProps {
  entry: UserGameWithCatalog;
}

const STATUS_COLORS: Record<string, string> = {
  [GameStatus.Playing]: 'bg-green-500/20 text-green-400 border-green-500/30',
  [GameStatus.Completed]: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  [GameStatus.OnHold]: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  [GameStatus.Dropped]: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export function LibraryCard({ entry }: LibraryCardProps) {
  const game = entry.game_catalog;
  const statusColor = STATUS_COLORS[entry.status] || '';

  return (
    <Link href={`/game/${game.slug}`}>
      <Card className="group flex gap-4 p-4 bg-background/40 backdrop-blur-md border border-white/10 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(202,138,4,0.15)] transition-all duration-300 cursor-pointer">
        {/* Cover */}
        <div className="w-16 h-20 sm:w-20 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden bg-muted relative">
          {game.cover_url ? (
            <Image
              src={game.cover_url}
              alt={game.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 64px, 80px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
              No Cover
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-sm sm:text-base truncate group-hover:text-primary transition-colors">
              {game.title}
            </h3>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {[game.genre, game.developer, game.release_year].filter(Boolean).join(' · ')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="outline" className={`text-[10px] ${statusColor}`}>
              {STATUS_LABELS[entry.status as GameStatus] || entry.status}
            </Badge>

            {entry.rating != null && (
              <span className="inline-flex items-center gap-1 text-xs text-primary">
                <Star className="w-3 h-3 fill-primary" />
                {entry.rating}
              </span>
            )}

            {Number(entry.hours_played) > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {entry.hours_played}h
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
