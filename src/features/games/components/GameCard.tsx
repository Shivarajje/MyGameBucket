import Image from 'next/image';
import Link from 'next/link';
import { GameSearchResult } from '@/types/game';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GameCardProps {
  game: GameSearchResult;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/game/${game.slug}`}>
      <Card className="h-full overflow-hidden hover:ring-2 hover:ring-primary transition-all duration-300 group bg-background/40 backdrop-blur-md border border-white/10 shadow-lg hover:shadow-[0_0_20px_rgba(202,138,4,0.2)]">
        <div className="aspect-[3/4] relative bg-muted overflow-hidden">
          {game.coverUrl ? (
            <Image 
              src={game.coverUrl} 
              alt={game.title} 
              fill
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              No Cover
            </div>
          )}
          {game.genre && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-md hover:bg-background/90">
                {game.genre}
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-lg line-clamp-1 tracking-tight" title={game.title}>
            {game.title}
          </h3>
          <div className="flex justify-between items-center mt-1 text-sm text-muted-foreground">
            <span>{game.releaseYear || 'TBA'}</span>
            <span className="line-clamp-1 text-right max-w-[50%]">{game.platform}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
