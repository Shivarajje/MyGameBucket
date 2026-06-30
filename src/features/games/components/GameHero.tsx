import { GameDetail } from '@/types/game';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface GameHeroProps {
  game: GameDetail;
}

export function GameHero({ game }: GameHeroProps) {
  // We use the first screenshot as the hero background, or fallback to cover, or fallback to dark gradient
  const heroImage = game.screenshots?.[0] || game.coverUrl;

  return (
    <div className="relative w-full h-[60vh] min-h-[400px] max-h-[700px] bg-background overflow-hidden flex items-end">
      {/* Background Image */}
      {heroImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt={game.title}
            fill
            className="object-cover opacity-50"
            priority
            sizes="100vw"
          />
        </div>
      )}
      
      {/* Gradient Overlay for text readability (darkens at bottom) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/60 to-transparent" />
 
      {/* Content */}
      <div className="relative z-20 w-full max-w-[1440px] mx-auto px-4 md:px-8 pb-12 flex flex-col md:flex-row gap-6 md:items-end">
        
        {/* Cover Art (Thumbnail style on desktop) */}
        {game.coverUrl && (
          <div className="hidden md:block w-48 shrink-0 rounded-lg overflow-hidden shadow-2xl border border-border/40 relative aspect-[3/4]">
            <Image 
              src={game.coverUrl} 
              alt={game.title} 
              fill
              className="object-cover"
              sizes="192px"
            />
          </div>
        )}

        <div className="flex flex-col gap-2 flex-1 z-20">
          <div className="flex flex-wrap gap-2 mb-2">
            {game.genre && <Badge variant="secondary" className="text-sm bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/10">{game.genre}</Badge>}
            {game.releaseYear && <Badge variant="outline" className="text-sm bg-black/40 backdrop-blur-md border-white/10">{game.releaseYear}</Badge>}
            {game.platform && <Badge variant="outline" className="text-sm bg-black/40 backdrop-blur-md border-white/10">{game.platform}</Badge>}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground drop-shadow-md">
            {game.title}
          </h1>
          
          {game.developer && (
            <p className="text-xl text-muted-foreground font-medium drop-shadow-sm">
              by {game.developer}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
