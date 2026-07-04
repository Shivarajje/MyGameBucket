'use client';

import { GameSearchResult } from '@/types/game';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

interface SearchSuggestionsProps {
  query: string;
  results: GameSearchResult[];
  loading: boolean;
  onSelect: () => void;
}

export function SearchSuggestions({ query, results, loading, onSelect }: SearchSuggestionsProps) {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-popover text-popover-foreground rounded-md shadow-md border border-border overflow-hidden z-50 max-h-[400px] overflow-y-auto">
      {loading ? (
        <div className="p-4 flex items-center justify-center text-muted-foreground text-sm">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Searching...
        </div>
      ) : results.length > 0 ? (
        <div className="flex flex-col">
          {results.slice(0, 5).map((game) => (
            <Link
              key={game.igdbId}
              href={`/game/${game.slug}`}
              onClick={onSelect}
              className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors border-b border-border/40 last:border-0"
            >
              {game.coverUrl ? (
                <Image 
                  src={game.coverUrl} 
                  alt={game.title} 
                  width={40}
                  height={56}
                  className="object-cover rounded-sm"
                />
              ) : (
                <div className="w-10 h-14 bg-muted rounded-sm flex items-center justify-center">
                  <span className="text-[10px] text-muted-foreground">No img</span>
                </div>
              )}
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium truncate">{game.title}</span>
                <span className="text-xs text-muted-foreground truncate">
                  {game.releaseYear} • {game.genre || 'Unknown'}
                </span>
              </div>
            </Link>
          ))}
          <Link 
            href={`/search?q=${encodeURIComponent(query)}`}
            onClick={onSelect}
            className="p-3 text-center text-sm text-primary hover:bg-muted/50 transition-colors font-medium bg-muted/20"
          >
            View all results
          </Link>
        </div>
      ) : (
        <div className="p-4 text-center text-muted-foreground text-sm">
          No results found for &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}

