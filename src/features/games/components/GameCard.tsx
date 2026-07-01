import Image from 'next/image';
import Link from 'next/link';
import { GameSearchResult } from '@/types/game';

interface GameCardProps {
  game: GameSearchResult;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/game/${game.slug}`}>
      <div className="group relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl transition-all duration-300 hover:border-primary/40 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(202,138,4,0.2)]">
        {/* Background Image / Cover */}
        <div className="absolute inset-0 z-0">
          {game.coverUrl ? (
            <Image
              src={game.coverUrl}
              alt={game.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, 250px"
              priority
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-zinc-950 p-4 text-center">
              <span className="font-bold text-base">{game.title}</span>
              <span className="text-xs mt-2 text-zinc-600">No Cover Art</span>
            </div>
          )}
        </div>

        {/* Dark gradient overlay for bottom text contrast */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Glassmorphic Info Panel */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 flex flex-col gap-2.5">
          {/* Fading Glassmorphism Background layer */}
          <div 
            className="absolute inset-0 -z-10 bg-black/70 backdrop-blur-md" 
            style={{
              maskImage: 'linear-gradient(to top, black 20%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to top, black 20%, transparent 100%)'
            }}
          />

          <div>
            <h3 className="font-bold text-base sm:text-lg leading-snug text-white truncate drop-shadow-md group-hover:text-primary transition-colors">
              {game.title}
            </h3>
            <p className="text-xs text-zinc-300 font-medium truncate mt-0.5">
              {[game.genre, game.releaseYear].filter(Boolean).join(' · ')}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
