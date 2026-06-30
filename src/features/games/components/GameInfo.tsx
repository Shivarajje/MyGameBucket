import { GameDetail } from '@/types/game';

interface GameInfoProps {
  game: GameDetail;
}

export function GameInfo({ game }: GameInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-2">About</h3>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {game.summary || 'No description available for this game.'}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/40">
        <div>
          <span className="text-sm text-muted-foreground block mb-1">Developer</span>
          <span className="font-medium">{game.developer || 'Unknown'}</span>
        </div>
        <div>
          <span className="text-sm text-muted-foreground block mb-1">Platform</span>
          <span className="font-medium">{game.platform || 'Unknown'}</span>
        </div>
        <div>
          <span className="text-sm text-muted-foreground block mb-1">Release</span>
          <span className="font-medium">{game.releaseYear || 'TBA'}</span>
        </div>
        <div>
          <span className="text-sm text-muted-foreground block mb-1">Genre</span>
          <span className="font-medium">{game.genre || 'Unknown'}</span>
        </div>
      </div>
    </div>
  );
}
